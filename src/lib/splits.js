// All track split math. Pure functions, no DOM. Times are in seconds, distances in meters.
// Tested by tests/splits.test.mjs (npm test).

export const M_PER_MILE = 1609.344;
export const M_PER_KM = 1000;
export const LANE_WIDTH_M = 1.22; // World Athletics standard lane width
export const MAX_ROWS = 500;
export const MAX_TIME = 100 * 3600;

// Race presets in meters.
export const RACES = [
  { id: '400', label: '400 m', m: 400 },
  { id: '800', label: '800 m', m: 800 },
  { id: '1500', label: '1500 m', m: 1500 },
  { id: '1600', label: '1600 m', m: 1600 },
  { id: 'mile', label: 'Mile (1609.34 m)', m: M_PER_MILE },
  { id: '3000', label: '3000 m', m: 3000 },
  { id: '3200', label: '3200 m', m: 3200 },
  { id: '2mile', label: '2 miles (3218.69 m)', m: 2 * M_PER_MILE },
  { id: '5000', label: '5K (5000 m)', m: 5000 },
  { id: '10000', label: '10K (10,000 m)', m: 10000 },
  { id: 'half', label: 'Half marathon (21,097.5 m)', m: 21097.5 },
  { id: 'marathon', label: 'Marathon (42,195 m)', m: 42195 },
];
export const UNIT_M = { m: 1, km: M_PER_KM, mi: M_PER_MILE };

// Read a number. Accepts "1,5" as 1.5 and ignores spaces. Returns null when it is not a plain number.
export function parseNumber(s) {
  if (typeof s === 'number') return Number.isFinite(s) ? s : null;
  const t = String(s ?? '').trim().replace(/\s+/g, '').replace(',', '.');
  if (!/^\d*\.?\d+$|^\d+\.$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

// Read a time. "20:00" is 20 min, "1:30:15" is h:mm:ss, "1:36.5" has tenths.
// A plain number is minutes when plainUnit is "min" and seconds when it is "s".
export function parseTime(s, plainUnit = 'min') {
  const t = String(s ?? '').trim().replace(/\s+/g, '');
  if (!t) return null;
  if (!t.includes(':')) {
    const n = parseNumber(t);
    return n === null ? null : n * (plainUnit === 'min' ? 60 : 1);
  }
  const parts = t.split(':');
  if (parts.length > 3) return null;
  let total = 0;
  for (let i = 0; i < parts.length; i++) {
    const last = i === parts.length - 1;
    const p = parts[i];
    if (p === '' && !last && i > 0) return null;
    if (p === '') { if (last) return null; continue; }
    const v = last ? parseNumber(p) : (/^\d+$/.test(p) ? Number(p) : null);
    if (v === null) return null;
    if (i > 0 && !last && v >= 60) return null;
    if (last && parts.length > 1 && v >= 60) return null;
    total = total * 60 + v;
  }
  return total;
}

// Round to a step (0.1 or 1) without float noise.
export function roundTo(x, step) {
  return Math.round((Math.round(x / step + 1e-9) * step) * 1e6) / 1e6;
}

// "59.7", "1:36.0", "1:05:30" (tenths kept when step is 0.1).
export function formatTime(sec, step = 0.1) {
  const r = roundTo(Math.max(0, sec), step);
  const dec = step < 1 ? 1 : 0;
  const tenths = Math.round(r * 10);
  const whole = Math.floor(tenths / 10);
  const frac = tenths % 10;
  const h = Math.floor(whole / 3600), m = Math.floor((whole % 3600) / 60), s = whole % 60;
  const sTxt = (dec ? `${s}.${frac}` : `${s}`);
  const sPad = (dec ? `${String(s).padStart(2, '0')}.${frac}` : String(s).padStart(2, '0'));
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${sPad}`;
  if (m > 0) return `${m}:${sPad}`;
  return sTxt;
}

export function formatDistance(m) {
  const r = Math.round(m * 10) / 10;
  return (Number.isInteger(r) ? r.toFixed(0) : r.toFixed(1)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Pace for a distance and time. Returns seconds per mile and per km.
export function paces(distanceM, timeS) {
  return { perMile: timeS / (distanceM / M_PER_MILE), perKm: timeS / (distanceM / M_PER_KM) };
}

// Marker distances (meters from the start) where a split is read.
//   from "start": every lapM from the start, then the finish.
//   from "line": the odd distance comes first, so every later marker is at the finish line.
export function markers(distanceM, lapM, from = 'start') {
  const eps = 1e-6;
  const out = [];
  if (from === 'line') {
    const rem = distanceM % lapM;
    let x = rem < eps || lapM - rem < eps ? lapM : rem;
    while (x < distanceM - eps) { out.push(x); x += lapM; }
  } else {
    for (let x = lapM; x < distanceM - eps; x += lapM) out.push(x);
  }
  out.push(distanceM);
  return out;
}

// Time at the start of a segment [0, x] when pace changes linearly with distance.
// pace(x) = a + b * (x / D - 0.5) in s per m. a = T / D. b = 4 * delta / D, where
// delta = (time of 2nd half) - (time of 1st half). Negative delta is a negative split.
function cumulativeAt(x, D, T, delta) {
  const a = T / D, b = (4 * delta) / D;
  return a * x + b * ((x * x) / (2 * D) - 0.5 * x);
}

// Race splits for a goal time.
// opts: { distance, time, lap, from: 'start'|'line', delta: seconds (2nd half minus 1st half), step: 0.1|1 }
export function raceSplits({ distance, time, lap, from = 'start', delta = 0, step = 0.1 }) {
  if (!(distance > 0) || !(time > 0) || !(lap > 0)) return { error: 'Enter a distance, a time and a lap length.' };
  if (time > MAX_TIME) return { error: 'That time is too long.' };
  if (Math.ceil(distance / lap) > MAX_ROWS) return { error: 'Too many laps. Use a longer lap length.' };
  const D = distance, T = time;
  const a = T / D, b = (4 * delta) / D;
  if (a - Math.abs(b) / 2 < a * 0.4) return { error: 'The second-half difference is too large for this time.' };
  const xs = markers(D, lap, from);
  const rows = [];
  let prevX = 0, prevR = 0;
  xs.forEach((x, i) => {
    const exact = i === xs.length - 1 ? T : cumulativeAt(x, D, T, delta);
    const cum = roundTo(exact, step);
    rows.push({ n: i + 1, from: prevX, to: x, seg: x - prevX, split: cum - prevR, cum });
    prevX = x; prevR = cum;
  });
  const half = cumulativeAt(D / 2, D, T, delta);
  return { rows, ...paces(D, T), time: T, distance: D, firstHalf: half, secondHalf: T - half };
}

// Finish time from one lap time (even pace).
export function finishFromLap({ lapTime, lap, distance }) {
  if (!(lapTime > 0) || !(lap > 0) || !(distance > 0)) return null;
  return (lapTime * distance) / lap;
}

// Interval session. Every rep runs at the pace of the goal race.
// opts: { reps, repM, paceSPerM, restS, lap, step }
export function intervals({ reps, repM, paceSPerM, restS = 0, lap, step = 0.1 }) {
  if (!(reps >= 1) || !(repM > 0) || !(paceSPerM > 0) || !(lap > 0)) return { error: 'Enter reps, a rep distance and a goal.' };
  if (reps > 100) return { error: 'Use 100 reps or fewer.' };
  const repT = roundTo(repM * paceSPerM, step);
  const xs = markers(repM, lap, 'start');
  const inside = xs.map((x, i) => ({ to: x, cum: roundTo(x * paceSPerM, step) }));
  const rest = Math.max(0, restS);
  const rows = [];
  let clock = 0;
  for (let k = 1; k <= reps; k++) {
    clock += repT;
    rows.push({ n: k, repTime: repT, clock });
    if (k < reps) clock += rest;
  }
  return {
    rows, repTime: repT, inside, workDistance: reps * repM, workTime: reps * repT,
    totalTime: reps * repT + (reps - 1) * rest, rest,
  };
}

// Extra meters per lap when you run the whole lap in a lane n steps outside lane 1 (n = 1 is lane 2).
export function laneExtraPerLap(lanesOut = 1) {
  return 2 * Math.PI * LANE_WIDTH_M * lanesOut;
}

// Plain text for the clipboard (tab separated, pastes into a spreadsheet).
export function splitsText(title, rows, step) {
  const lines = [title, ['Split', 'Distance (m)', 'Lap time', 'Total time'].join('\t')];
  rows.forEach((r) => lines.push([r.n, formatDistance(r.to), formatTime(r.split, step), formatTime(r.cum, step)].join('\t')));
  return lines.join('\n');
}
