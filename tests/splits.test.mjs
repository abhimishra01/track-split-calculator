import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseTime, parseNumber, formatTime, formatDistance, roundTo, markers, raceSplits, finishFromLap,
  intervals, paces, laneExtraPerLap, splitsText, M_PER_MILE, UNIT_M,
} from '../src/lib/splits.js';

const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);

test('parseTime: m:ss, h:mm:ss, tenths, plain numbers', () => {
  assert.equal(parseTime('20:00'), 1200);
  assert.equal(parseTime('1:30:15'), 5415);
  assert.equal(parseTime('1:36.5'), 96.5);
  assert.equal(parseTime('20'), 1200);          // plain = minutes
  assert.equal(parseTime('20.5'), 1230);
  assert.equal(parseTime('96', 's'), 96);       // plain = seconds for lap times
  assert.equal(parseTime('90.5', 's'), 90.5);
  assert.equal(parseTime(' 4 : 00 '), 240);
  assert.equal(parseTime('0:59.7'), 59.7);
});
test('parseTime rejects bad input', () => {
  for (const bad of ['', 'abc', '1:75', '1:2:3:4', ':', '1::30', '-5', '1:60']) assert.equal(parseTime(bad), null, bad);
});
test('parseNumber handles comma decimals and rejects junk', () => {
  assert.equal(parseNumber('1,5'), 1.5);
  assert.equal(parseNumber('400'), 400);
  assert.equal(parseNumber('4e2'), null);
  assert.equal(parseNumber(''), null);
});
test('formatTime', () => {
  assert.equal(formatTime(96), '1:36.0');
  assert.equal(formatTime(59.7), '59.7');
  assert.equal(formatTime(59.96), '1:00.0');
  assert.equal(formatTime(1200), '20:00.0');
  assert.equal(formatTime(5415), '1:30:15.0');
  assert.equal(formatTime(1200, 1), '20:00');
  assert.equal(formatTime(59.5, 1), '1:00');
  assert.equal(formatTime(0), '0.0');
});
test('formatDistance', () => {
  assert.equal(formatDistance(400), '400');
  assert.equal(formatDistance(5000), '5,000');
  assert.equal(formatDistance(1609.344), '1,609.3');
  assert.equal(formatDistance(42195), '42,195');
});
test('markers: from the start and at the finish line', () => {
  assert.deepEqual(markers(1200, 400), [400, 800, 1200]);
  assert.deepEqual(markers(1500, 400), [400, 800, 1200, 1500]);
  assert.deepEqual(markers(1500, 400, 'line'), [300, 700, 1100, 1500]);
  assert.deepEqual(markers(800, 400, 'line'), [400, 800]);
  assert.deepEqual(markers(300, 400), [300]);
});

test('5K in 20:00 on a 400 m track: 1:36.0 per lap, 48.0 for the last 200 m', () => {
  const r = raceSplits({ distance: 5000, time: 1200, lap: 400 });
  assert.equal(r.rows.length, 13);
  assert.equal(r.rows[0].split, 96);
  assert.equal(r.rows[11].cum, 1152);           // 4800 m at 19:12
  assert.equal(r.rows[12].seg, 200);
  assert.equal(r.rows[12].split, 48);
  assert.equal(r.rows[12].cum, 1200);
  near(r.perKm, 240);
  near(r.perMile, 386.2418, 1e-3);              // 6:26.2 per mile
});
test('800 m in 2:00 is 60.0 per lap', () => {
  const r = raceSplits({ distance: 800, time: 120, lap: 400 });
  assert.deepEqual(r.rows.map((x) => [x.split, x.cum]), [[60, 60], [60, 120]]);
});
test('1500 m in 4:00 on 400 m laps: 64.0 per lap, 48.0 for the last 300 m', () => {
  const r = raceSplits({ distance: 1500, time: 240, lap: 400 });
  assert.deepEqual(r.rows.map((x) => x.cum), [64, 128, 192, 240]);
  assert.equal(r.rows[3].seg, 300);
  assert.equal(r.rows[3].split, 48);
});
test('1500 m, splits at the finish line: first marker at 300 m', () => {
  const r = raceSplits({ distance: 1500, time: 240, lap: 400, from: 'line' });
  assert.deepEqual(r.rows.map((x) => x.cum), [48, 112, 176, 240]);
});
test('mile in 4:00 even: 59.7 per 400 m, 3:58.6 at 1600 m, 4:00.0 at the end', () => {
  const r = raceSplits({ distance: M_PER_MILE, time: 240, lap: 400 });
  assert.equal(r.rows.length, 5);
  assert.equal(r.rows[0].cum, 59.7);
  assert.equal(r.rows[3].cum, 238.6);
  assert.equal(r.rows[4].cum, 240);
  near(r.rows[4].seg, 9.344);
  near(r.perMile, 240);
});
test('rounding to whole seconds keeps the total exact', () => {
  const r = raceSplits({ distance: 5000, time: 1200, lap: 300, step: 1 });
  assert.equal(r.rows.at(-1).cum, 1200);
  let sum = 0; r.rows.forEach((x) => { sum += x.split; });
  assert.equal(sum, 1200);
});
test('splits always add up to the goal time (many shapes)', () => {
  for (const [d, t, l, delta] of [[1609.344, 247.3, 400, 0], [10000, 2400, 200, -12], [3000, 600, 300, 5], [21097.5, 5400, 400, -30], [1500, 227.5, 400, -3.5]]) {
    const r = raceSplits({ distance: d, time: t, lap: l, delta });
    near(r.rows.at(-1).cum, roundTo(t, 0.1), 1e-9);
    let sum = 0; r.rows.forEach((x) => { sum += x.split; });
    near(sum, roundTo(t, 0.1), 1e-6);
  }
});
test('negative split: 1600 m in 6:40 with the 2nd half 4 s faster', () => {
  const r = raceSplits({ distance: 1600, time: 400, lap: 400, delta: -4 });
  assert.deepEqual(r.rows.map((x) => x.split), [101.5, 100.5, 99.5, 98.5]);
  assert.equal(r.rows[1].cum, 202);
  near(r.firstHalf, 202); near(r.secondHalf, 198);
  assert.equal(r.rows[3].cum, 400);
});
test('positive split: 2nd half 4 s slower', () => {
  const r = raceSplits({ distance: 1600, time: 400, lap: 400, delta: 4 });
  assert.deepEqual(r.rows.map((x) => x.split), [98.5, 99.5, 100.5, 101.5]);
});
test('half marathon on a 400 m track gives 53 rows (52 laps + 297.5 m)', () => {
  const r = raceSplits({ distance: 21097.5, time: 5400, lap: 400 });
  assert.equal(r.rows.length, 53);
});
test('errors: bad input, too many laps, impossible negative split', () => {
  assert.ok(raceSplits({ distance: 0, time: 100, lap: 400 }).error);
  assert.ok(raceSplits({ distance: 42195, time: 10000, lap: 10 }).error);
  assert.ok(raceSplits({ distance: 1600, time: 400, lap: 400, delta: -380 }).error);
});
test('finish time from a lap time: 90 s per 400 m over 5000 m is 18:45', () => {
  near(finishFromLap({ lapTime: 90, lap: 400, distance: 5000 }), 1125);
  assert.equal(formatTime(1125), '18:45.0');
  assert.equal(finishFromLap({ lapTime: 0, lap: 400, distance: 5000 }), null);
});
test('paces: 5K in 20:00 is 4:00 per km and 6:26.2 per mile', () => {
  const p = paces(5000, 1200);
  assert.equal(formatTime(p.perKm), '4:00.0');
  assert.equal(formatTime(p.perMile), '6:26.2');
});
test('intervals: 8 x 400 at 5K goal pace of 20:00, 90 s rest', () => {
  const pace = 1200 / 5000;
  const r = intervals({ reps: 8, repM: 400, paceSPerM: pace, restS: 90, lap: 400 });
  assert.equal(r.repTime, 96);
  assert.equal(r.workDistance, 3200);
  assert.equal(r.workTime, 768);
  assert.equal(r.totalTime, 768 + 7 * 90);
  assert.equal(formatTime(r.totalTime), '23:18.0');
  assert.equal(r.rows[0].clock, 96);
  assert.equal(r.rows[1].clock, 96 + 90 + 96);
  assert.equal(r.rows[7].clock, r.totalTime);
});
test('intervals: 4 x 800 shows a 400 m split inside each rep', () => {
  const r = intervals({ reps: 4, repM: 800, paceSPerM: 0.24, restS: 0, lap: 400 });
  assert.equal(r.repTime, 192);
  assert.deepEqual(r.inside.map((x) => x.cum), [96, 192]);
  assert.equal(r.totalTime, 768);
});
test('intervals: a 300 m rep on a 400 m lap has one split', () => {
  const r = intervals({ reps: 6, repM: 300, paceSPerM: 0.2, lap: 400 });
  assert.equal(r.repTime, 60);
  assert.equal(r.inside.length, 1);
});
test('intervals: errors', () => {
  assert.ok(intervals({ reps: 0, repM: 400, paceSPerM: 0.2, lap: 400 }).error);
  assert.ok(intervals({ reps: 101, repM: 400, paceSPerM: 0.2, lap: 400 }).error);
});
test('lane 2 adds about 7.7 m per 400 m lap', () => {
  near(laneExtraPerLap(1), 7.665, 0.01);
  near(laneExtraPerLap(2), 15.33, 0.02);
});
test('unit factors', () => {
  assert.equal(UNIT_M.km, 1000);
  assert.equal(UNIT_M.mi, 1609.344);
});
test('copy text has a title, a header and one line per split', () => {
  const r = raceSplits({ distance: 800, time: 120, lap: 400 });
  const t = splitsText('800 m in 2:00.0', r.rows, 0.1).split('\n');
  assert.equal(t.length, 4);
  assert.equal(t[2], '1\t400\t1:00.0\t1:00.0');
});
