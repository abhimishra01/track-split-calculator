# Code review: readability lens (Okoye)

Verdict: readable math file with good comments and cited formulas in the README; the UI script is dense and a few names mislead. No placeholder text left on the site. Must-fix: 0.

Template leftovers (fixer's list): not repeated.

| Severity | file:line | Finding | Why | Fix |
|---|---|---|---|---|
| should | src/components/Tool.astro:388, 466-492 | `lastCopy` also means "there is a valid result" and feeds print. Name says copy only. | A new engineer will not look for print logic there. | Rename to `current` (an object with `text` and `valid`). |
| should | src/components/Tool.astro:489 | Variable `ol` holds a `<ul>` element (`pr-cells`). | Misleading. | Rename `list`. |
| should | src/lib/splits.js, Tool.astro | "lap" means three things: lap length (`lap`, 400 m), one lap's time (`lapTime`, mode `'lap'`), and a split row. `from: 'line'` vs UI "At the finish line", `'start'` vs "Every lap from the start". | Hard to follow `radio('lap')` vs `mode === 'lap'`. | Rename the mode to `'lap-to-finish'` and the option `from` to `'finish-line'` / `'gun'`; keep one glossary line at the top of splits.js. |
| should | src/lib/splits.js:121-129 | `a`, `b`, `D`, `T`, `delta` are explained in `cumulativeAt` but `raceSplits` repeats the formula with the guard `a - Math.abs(b) / 2 < a * 0.4` and no comment. | The 0.4 limit (pace may not drop below 40% of average) is a magic number. | Name it `MIN_PACE_FRACTION = 0.4` and say why. |
| should | src/components/Tool.astro:440-441 | One-line `innerHTML` templates with nested ternaries for column alignment. | Hard to read and change. | Use an `align` array and a small `cell()` helper. |
| should | src/components/Tool.astro:5-6, 9-10 | Comment "Inputs. On a phone: what you want, then the result, then the settings." matches the code, but the layout trick (`contents`, `order-1/2/3`) is not explained. | Next person will break it. | One comment: "`display: contents` lets the two input groups sit on either side of the result on phones." |
| nice | src/lib/splits.js:79, 95 | `step` parameter is "0.1 or 1" in one place and "dec" is derived from `step < 1`. | Any other step (0.5) is silently formatted as tenths. | Document that only 0.1 and 1 are supported. |
| nice | src/components/Tool.astro:352 | `pace` string joins with a middle dot; copy text uses tabs; band title uses commas. Three formats for the same facts. | Slight inconsistency. | Fine; note only. |
| nice | src/site.config.ts:17 | Comment says skins are "minimal, swiss, clay or retro" but only retro CSS is imported in global.css. | Changing `skin` to "swiss" does nothing. | Say "only retro is built in this tool", or import the others. |
| nice | README.md | Accurate on files, formulas, commands and Pages. It still says "30 cm out from the inside edge" (kerb), fine. No mention of the lane 2 sources. | Complete enough. | Add the source URLs in "Formulas and sources". |

Placeholder and stale text sweep (About, Privacy, Terms, Contact, FAQ, article, 404, README): none found. Copy is US English ("meters", "kilometers", "color"); no em dashes seen in the pages; the privacy and terms pages say "may" for ads and analytics while both are off, which the privacy page explains.
