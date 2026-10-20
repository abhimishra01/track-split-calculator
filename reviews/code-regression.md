# Code review: regression lens (Okoye)

Verdict: the math is correct in every case I recomputed by hand and in the browser, and all template rules hold. One real wrong-answer path (thousands comma), one accuracy overstatement (lane 2 distance). Must-fix: 1.

## Recomputed by hand (and run in node and in the live page)
| # | Case | By hand | Tool | OK |
|---|---|---|---|---|
| 1 | 5K in 20:00, 400 m | 1200/5000x400 = 96.0 s; last 200 m = 48.0 s; 4:00.0 per km; 1200/3.10686 = 386.24 s = 6:26.2 per mile | 1:36.0 per lap, 48.0, 4:00.0, 6:26.2 | yes |
| 2 | Mile in 4:00, 400 m | 240x400/1609.344 = 59.652 -> 59.7; 4 x 400 = 1600 m at 238.6; last 9.344 m | 59.7 / 3:58.6 / 4:00.0, 9.3 m | yes |
| 3 | Mile in 4:00, at the finish line | first marker 9.344 m = 1.4 s, then 400 m legs | 9.3 m 1.4, then 59.6, 59.7, 59.6, 59.7 (cum 4:00.0) | yes |
| 4 | 1600 m in 6:40, second half 4 s faster | b = 4d/D = -0.01; lap 1 = 100 + 1.5 = 101.5; then 100.5, 99.5, 98.5 | 101.5, 100.5, 99.5, 98.5 | yes |
| 5 | 5K in 20:00, second half 6 s faster | halves 10:03.0 and 9:57.0 (article claim) | 10:03.0 / 9:57.0; lap 1 1:36.9; lap 6 1:36.1; 4,800 m lap 1:35.2 | yes, article numbers are right |
| 6 | Marathon 3:00:00, 400 m | 10800/42195x400 = 102.38 s = 1:42.4; last 195 m = 49.9 s; 6:51.9 per mile | same; 106 rows | yes |
| 7 | 8 x 400 at 5K 20:00 pace, 90 s rest | 8x96 = 768 s = 12:48.0; + 7x90 = 1398 s = 23:18.0 | 12:48.0 / 23:18.0 | yes |
| 8 | 90 s per 400 m over 5000 m | 90x12.5 = 1125 s = 18:45.0 (FAQ) | 18:45.0 in tests | yes |
| 9 | Mile at 1:30 per 400 m (lap to finish) | 90x1609.344/400 = 362.1 s = 6:02.1 | 6:02.1, last split 2.1 s for 9.3 m | yes |
| 10 | Article tables: 5K 18, 22, 25, 28, 30 min; mile 4 to 10 min, per 400 and per 200 | all 22 cells recomputed | all match | yes |
| 11 | Lane 2 extra: 2 x pi x 1.22 = 7.67 m, x 0.24 s/m = 1.84 s | page says about 7.7 m, 1.8 s | see row below | arithmetic yes |
| 12 | 400 m in 1:00 on a 400 m lap, 800 m neg 2 s | one split; 31.0 + 29.0 | matches | yes |

Edge cases run in the page: blank goal, lap length 49 m (rejected, below 50), lap 100 m on a marathon (422 rows, OK), custom lap with 1-second rounding (totals stay exact), negative delta "-6" (rejected), impossible delta (rejected), repeats 8.5 (rejected), rest "-5" and "abc" (rejected).

## Template rules
Canonical points at tracksplitcalculator.com and is correct on the Pages build. pages.dev noindex rules are in public/_headers and in dist. Footer links About, Contact, Privacy and Terms. 404.html built. sitemap-index and sitemap-0 list 5 pages (404 excluded). robots.txt links the sitemap. No GA or AdSense script in dist when the IDs are empty; ads.txt is a comment only. Pages build (PAGES_BASE) rewrites every link, adds `noindex`, keeps the real-domain canonical. All hold.

## Findings
| Severity | file:line | Finding | Why | Fix |
|---|---|---|---|---|
| must | src/lib/splits.js:28-32 | "10,000" in the custom distance field is read as 10 (comma = decimal). Result: "Finish time for 10 m ... 33:20:00.0 per km". | Plausible US input, wrong answer. | Accept thousands commas (see maintainer report). Add test: `parseNumber('10,000') === 10000`, `parseNumber('1,5') === 1.5`. |
| should | src/pages/about.astro, Article.astro "Lane 1 assumption", FAQ, Tool.astro:171 | "A whole lap in lane 2 adds about 7.7 m." 7.66 m is the pure geometry (2 x pi x 1.22). The official measuring convention (lane 1 measured 0.30 m from the kerb, other lanes 0.20 m from the line) gives 2 x pi x (1.22 - 0.10) = 7.04 m. A common PE reference gives 7.04 m for lane 2. Sources disagree by 0.6 m (0.15 s per lap at 1:36). | "Cite every formula." The page cites no source and uses the larger figure. | Say "about 7 to 7.7 m" or use 7.04 m, and cite World Athletics Technical Rule 14 (track marking) in one line. |
| should | src/components/Tool.astro:182, skin-retro.css:55 | `aria-invalid` red border is overridden by the retro `#tool .field` rule (tested: invalid field keeps the normal 2 px ink border). The error text is in the result box only. | Error state is invisible on the field; it works only through text. | Add `#tool .field[aria-invalid="true"] { border-color:#dc2626; outline... }` after the retro rule and link the field with `aria-describedby` to the message. |
| should | src/components/Tool.astro:342, 296 | Negative delta ("-6") gives "Enter the difference between the halves in seconds." | User typed a number; message does not say what is wrong. | "Use a positive number; the Negative or Positive button sets the direction." |
| nice | src/components/Tool.astro:258 | Restore does not validate `cunit`; a bad value gives NaN distance (see maintainer). | Only on corrupt storage. | Validate. |
| nice | src/pages/index.astro:12-24 | JSON-LD `applicationCategory: HealthApplication`. | A split calculator is not a health app; the brief says add health copy only where health is touched. | schema.org has no sports category; use `UtilitiesApplication` or keep `HealthApplication` on purpose and note why. |

Sources checked: mile 1609.344 m (1959 international yard and pound agreement); lane width 1.22 m +/- 0.01 m and the 0.30 m kerb offset (World Athletics Technical Rules, track marking, as summarized by Scottish Athletics "Rule of the Month Nov 2022" and the track marking standard); 7.04 m stagger formula from a PE manual versus 7.66 m geometry (RunDida lane calculator shows lane 8 at 453.66 m, which matches geometry). I could not open the official WA rulebook text itself.
