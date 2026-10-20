# Fix summary (Sam)

## Fixed
- Thousands commas: "10,000" is now 10000; "1,5" stays 1.5. Tests added.
- Interval cap: repeat distance above 100,000 m is rejected; "Splits inside a repeat" text shows at most 12 entries. Tests added.
- Saved settings: selects and radios are checked against their real options; distance is NaN-safe (no more silent bad state).
- Lane 2: the page now states both figures with sources. 7.04 m by the World Athletics measuring lines (lane 1 at 0.30 m from the curb, other lanes 0.20 m from the line, TR 14.2 and 14.4; 2 pi x 1.12) and 7.67 m by pure geometry (2 pi x 1.22). About 1.7 to 1.8 s per lap at 1:36. A Sources list (mile definition, WA rules via Scottish Athletics summary) is in the article; README updated; `laneExtraPerLap(n, measured)` is now the one place for the math. Limit: I could not open the WA rulebook text itself; the 0.20 m rule (TR 14.4) is confirmed through the Scottish Athletics summary, the 0.30 m rule (TR 14.2) is the standard rule that summary refers to.
- Phone layout: Repeats, Repeat distance, Rest, Pacing and "Where do you read splits" now sit above the result. Lap length and Round-to stay below. Table no longer has a nested scroll on phones; "Clock (with rest)" is now "Clock".
- Error state: red border and ring now beat the Retro rule; the field links to the message with aria-describedby. Negative or bad delta message is clearer.
- Pace sanity warning (slower than 20:00 or faster than 2:00 per mile).
- Print button now explains when there is nothing to print.
- 404 no longer gets the Retro eyebrow style.
- robots.txt says Disallow on the Pages build. JSON-LD category is UtilitiesApplication.
- Readability: `lastCopy` is `current`, `ol` is `list`, `MIN_PACE_FRACTION` named, unused `i` removed, innerHTML safety comment, layout comment. US spelling (curb). "Settings are saved on this device" and a clearer chips label.
- Template list: README, US spelling, fixed "Last updated", no absolute paths, no new-tool.sh, screenshots/ and .playwright-cli/ ignored and untracked, deploy runs npm test, privacy cookie text, no duplicate home links, Tailwind `source(none)` plus `@source "../"`, branch main: all already in place; verified.
- Tailwind scan: CSS 26,934 B before, 27,184 B after (new styles); JS 11,850 B to 12,956 B.

## Rejected or deferred
- Move compute() into view.js with string tests (maintainer, should): a refactor with no user gain this pass. Left for the owner.
- Debounce the live region (design, should): risk of missing announcements; left as is.
- Rep pace direct entry, mile and km markers, strip print layout with several bands (customer 3 and 4): new features that widen the tool. Phase 2 candidates.
- Phone sticky result bar: not needed after the reorder.
- Merge retro CSS into tokens, dead non-retro tokens, maskable icon split, OG "5K total" label (needs image regeneration), H1 wording, footer tap size: nice items, left.
- Mile and km markers: see above.

## Tests and Lighthouse
- npm test: 32 pass. npm run build: OK. Pages build checked under /track-split-calculator/ (home, about, privacy, icons, manifest, 404): all links under the base, noindex, canonical on tracksplitcalculator.com.
- Screenshots viewed at 1280 and 390, light and dark, Intervals mode and error state.
- Lighthouse not re-run after these changes; last run (review) was 100 on all four. Re-run before deploy.

## Left for the owner
- Decide on the Phase 2 features above.
- Confirm the lane 2 wording (two figures) is what you want.

## Phase 2 SEO pages (best 20)
1. 5K pace chart 2. 10K pace chart 3. mile pace chart 4. 400m splits for a 60 second lap 5. 800m splits 6. 1500m splits 7. 3000m splits 8. 2 mile splits 9. 5K 20 minute splits 10. 5K 25 minute splits 11. 10K 50 minute splits 12. half marathon 2 hour pace band 13. marathon 4 hour pace band 14. marathon 3:30 pace band 15. 4 minute mile splits 16. 5 minute mile splits 17. 8x400 workout pace 18. 6x800 workout pace 19. negative split calculator for 5K 20. 200m track splits for indoor 5K
