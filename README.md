# Track split calculator

Free browser tool for tracksplitcalculator.com. Turn a goal time into lap splits (200 m, 300 m, 400 m or custom laps), with even, negative or positive pacing. Also: lap time to finish time, an interval builder (for example 8 x 400 m at goal race pace, with rest) and a printable, copyable pace band. Splits can be read every lap from the start or at the finish line. Lane 1 is assumed and stated on the page. Settings are saved in the browser. There is no backend.

Built with Astro (static) and Tailwind 4. Skin: Retro print. Brand: infield green #2f7a1f.

## Where things live

- `src/lib/splits.js`: all split math (pure functions, no DOM): time parsing and formatting, markers, race splits with a linear pace change, finish from lap, intervals, lane extra distance.
- `tests/splits.test.mjs`: known-answer tests (5K in 20:00 is 1:36.0 per 400 m, mile in 4:00 is 59.7 per 400 m, 8 x 400 total 23:18.0, and more).
- `src/components/Tool.astro`: the calculator UI, pace band and print layout.
- `src/components/Article.astro`, `src/data/faq.ts`: page text and FAQ (the FAQ also becomes FAQPage JSON-LD).
- `src/site.config.ts`: name, domain, keywords, email, brand color, analytics and ads IDs (empty = off).
- `src/lib/url.ts`: link helper that works at the site root and under a sub-path.

## Formulas and sources

- Time per lap = goal time / distance x lap length. A mile is 1609.344 m (1959 international yard and pound agreement).
- Negative or positive split: pace changes linearly across the race, p(x) = a + b (x / D - 0.5) with a = T / D and b = 4 d / D, where d is the second-half time minus the first-half time. The total stays T.
- Lane 1 is measured 30 cm from the inside edge (World Athletics). A lane is 1.22 m wide, so a whole lap one lane out adds 2 pi x 1.22 = 7.67 m by geometry. By the measuring lines (lane 1 at 0.30 m, other lanes 0.20 m from the line, TR 14.2 and 14.4) lane 2 is 1.12 m further out, which adds 7.04 m. The page states both. Sources: World Athletics Technical Rules; Scottish Athletics, Rule of the Month, Nov 2022 (https://www.scottishathletics.org.uk/wp-content/uploads/2023/01/Rule-of-the-Month-Nov-2022.pdf).

## Commands

- `npm run dev`: work on the site.
- `npm test`: run the logic tests.
- `npm run build`: build `dist/`.
- `npm run deploy`: test, build, then upload to Cloudflare Pages (you must run `npx wrangler login` once first).

## GitHub Pages

The workflow `.github/workflows/pages.yml` builds on every push to `main` and publishes to https://abhimishra01.github.io/track-split-calculator/. It sets `PAGES_BASE` and `PAGES_SITE`. Locally: `PAGES_BASE=/track-split-calculator/ npx astro build --outDir dist-pages`. Canonical links always point to the real domain.

## Notes

- Splits are targets. The tool does not model wind, fitness or the curve. Lane 1 is assumed.
- `public/_headers` keeps the `*.pages.dev` address out of Google (Cloudflare Pages only).
