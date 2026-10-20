# Mock-customer test (Okoye)

Method: one reviewer played five personas. Each persona's real task was run on the built page (own build, served on my port 4826; no server is running now) with playwright-cli, typing real values and reading results, at the viewport named. The quotes are my simulated judgments of each persona, not real people. Clipboard copy was not testable in headless Chrome; print was tested through the print layout.

## Stories

**1. Jordan, 20, college club runner, iPhone (390 px). Task: 400m splits for a 5K in 22:00, then 6 x 800.**
Typed 22:00, saw 1:45.6 per lap at once, with the table under it. Happy. Switched to Intervals, saw 800 m = 3:31.2, then wanted 6 reps and 2 min rest. The Repeats and Rest boxes were far below the table and the pace band. He scrolled twice. "I got there, but I lost the answer while I changed it." Would click it on Google: yes, "400m split calculator" matches. Under 30 seconds: splits yes (8 s), interval no (about 50 s). Confusing: Intervals asks for a "goal race", but he thinks in "6 x 800 at 3:30". Missing for a bookmark: type the rep pace directly. Trusts it: yes, numbers match his watch. Comes back: yes, weekly.

**2. Coach Dana, 41, HS cross-country and track coach, laptop (1280 px). Task: print a 1600 m pace band for 5:20, with 400 m splits; then a 4 x 1200 session.**
Chose 1600 m, typed 5:20, got 1:20.0 per lap. Print gave a clean black and white sheet of boxes. Wanted strips, not a grid: "I need something I can cut and tape on a wrist". Interval run was fast on desktop because inputs and result sit side by side. Would click: yes. Done in 30 s: yes. Confusing: "Where do you read splits" needs the note; she skipped it. Missing: a strip layout (one column of 4 to 8 boxes), the team name or athlete name on the print, 3 or 4 bands per sheet. Trust: yes, she checked 1:20 x 4. Comes back: yes, every meet week.

**3. Marcus, 34, first-time half-marathoner, Android phone (390 px). Task: pace band for 1:45:00 half.**
Picked Half marathon, typed 1:45:00. Got 400 m markers: 53 boxes of 1:59.4 and 1:59.5. "I run on roads. I need mile or km markers." He set Custom lap 1609.344, which works, but he had to guess it. Would click on Google: "track split calculator" is not his search, he would have searched "half marathon pace band". Done in 30 s: no. Missing: a marker choice of "every mile / every km" next to the lap length. Trust: yes. Comes back: maybe.

**4. Priya, 29, masters sprinter and recreational track runner, desktop (1280 px). Task: negative split for 1500 m in 4:30 (second half 4 s faster), read at the finish line.**
Typed 4:30, chose Negative, delta 4, "At the finish line". Table showed a 300 m first split then 400 m legs. It matched her coach's sheet to the tenth. Liked the chips (1%, 2%, 3% in seconds) but did not know what "1% = 2.5 s" means at first. Would click: yes. Under 30 s: yes. Confusing: the percent chips sit next to a seconds box. Missing: save my last settings (it does that, she did not notice), a shareable link. Trust: high. Comes back: yes.

**5. Rick, 67, walking-track regular, 200 m indoor mall track, phone (390 px, large text). Task: how long for a mile at 15:00; type "10,000" meters for a 10K-equivalent.**
Chose Mile, typed 15:00 and got 3:44 per 400 m. Easy. Then tried Custom distance with "10,000" meters: the page showed "Finish time for 10 m" and "33:20:00.0 per km". He thought the site was broken. Retyped 10000 and it worked. Lap length 200 m was a clear button. Would click: no, he would use Google's mile calculator. Under 30 s: yes for the mile. Confusing: tenths ("3:44.2"). Missing: a "1 second" rounding default for walkers; comma in numbers. Trust: dropped after the 10 m result. Comes back: unlikely.

## Ranked change list
| Rank | Level | Change | Asked by |
|---|---|---|---|
| 1 | must | Accept "10,000" (thousands comma) in distance fields; today it is silently read as 10 | 2 of 5 (Rick hit it; Jordan and Marcus type commas by habit) |
| 2 | must | On phones, move Repeats, Repeat distance, Rest and Pacing above the result (or add a sticky result bar) | 3 of 5 (Jordan, Marcus, Rick) |
| 3 | should | Let the user type the rep pace or rep time directly in Intervals ("6 x 800 at 3:30") instead of only a goal race | 2 of 5 (Jordan, Dana) |
| 4 | should | Pace band marker choice: every lap, every mile, every km; and a strip layout, with several bands per sheet and an optional name | 3 of 5 (Dana, Marcus, Priya for km) |
| 5 | should | Show a red field border and a clear reason when a number is wrong | 2 of 5 |
| 6 | should | Explain the percent chips ("1% of your goal time") and hide them behind a "Quick values" label | 1 of 5 |
| 7 | nice | Remember to say "Settings are saved on this device" near the inputs | 1 of 5 |
| 8 | nice | Whole-second rounding tip for slower or older users; larger hint text | 1 of 5 |
| 9 | nice | Share link with the numbers in the URL | 1 of 5 |

## Top 5 changes
1. Accept thousands commas in distance fields (wrong answer today).
2. Phone layout: put the interval and pacing controls above the result.
3. Intervals: allow a direct rep time or pace.
4. Pace band: mile and km markers plus a strip print layout.
5. Visible field-level error state in the Retro skin.
