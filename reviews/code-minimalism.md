# Code review: minimalism lens (Okoye)

Verdict: already lean (11.8 KB JS, 27 KB CSS, no runtime dependencies); only small deletions available. Must-fix: 0.

Template leftovers (fixer's list): not repeated.

| Severity | file:line | Finding | Why | Fix |
|---|---|---|---|---|
| should | src/lib/splits.js:166-170 | `laneExtraPerLap()` and `LANE_WIDTH_M` are used only by tests. The UI hard-codes "7.7 m" in 4 places (Tool.astro:171, Article, FAQ, About). | Dead code in production, and the number is duplicated in text. | Either use `laneExtraPerLap(1)` to render the figure into the page at build time (single source), or delete the function and its test. |
| should | src/lib/splits.js:152 | `inside = xs.map((x, i) => ...)`: `i` is unused. | Leftover. | Remove `i`. |
| should | src/components/Tool.astro:238-239, 237 | `FIELDS` and `RADIOS` lists plus `RACE_M` duplicate what the DOM already knows. `RACE_M` rebuilds a map from `RACES` just to look up `m`. | Three places to edit when a field is added. | Collect `[data-save]` elements instead; look up `RACES.find`. About 10 lines saved. |
| nice | src/components/Tool.astro:177-217 | 40 lines of `is:global` CSS for the tool, partly overridden again in skin-retro.css (`.seg-face`, `.step`, `.chip`, `.alt-btn`, `.field` borders). Retro overrides need long `:root[data-skin][data-theme]` selectors. | Two sources of truth per control. A skin change means editing both. | Move control rules into the skin tokens (`--edge`, `--radius`, `--shadow`) and keep one rule each. |
| nice | src/styles/global.css:17-48 | Non-retro `:root` token blocks (paper, card, ink, ...) are fully replaced by the retro block, so they never apply while `skin: 'retro'`. | Dead while the skin is retro, about 30 lines. | Keep (template feature) but note it; or drop if the template is never re-skinned. |
| nice | src/components/AdSlot.astro, Analytics.astro | Render nothing while IDs are empty. | Correct by design. | Keep. |
| nice | src/pages/site.webmanifest.ts:8-9 | `purpose: 'any maskable'` on one icon, and a hard-coded `#f1e6d2`. | Maskable icons need safe-zone padding; the 512 icon has little. | Split into two entries or drop `maskable`; read the colour from the skin. |
| nice | src/components/Article.astro:73-80 | Table CSS in a global style block inside a component. | Moves with the article, fine. | None. |
| nice | public/*.png | Icons total small; og.png is a static PNG with a hard-coded example. | Fine. | None. |

Nothing else to delete: no unused dependencies (only astro, sitemap, tailwind, wrangler dev), no leftover demo code in `src/`.
