# Design and SEO review (Okoye)

Built to a private folder, served on port 4826, viewed at 1280 and 390, light and dark. Lighthouse run with Google Chrome (headless).

## Scores
| Run | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Mobile | 100 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |
LCP 1.0 s mobile, 0.3 s desktop. CLS 0.005 mobile, 0.024 desktop. TBT 0 ms. Page: 36 KB HTML, 12 KB JS, 27 KB CSS, no web fonts, no external requests.

Verdict: clearly better than the small competitor sites (RunBundle and similar): inputs and a big result visible together on desktop, 3 modes, print band, copy, dark mode, saved settings. Retro print skin fits the barbell family and the edge-contrast fix is applied (ink edges in light, cream in dark). One phone-layout problem and a few polish items. Must-fix: 1.

| Severity | Area | Finding | Fix |
|---|---|---|---|
| must | Phone layout | In Intervals mode on a 390 px phone, Repeats, Repeat distance and Rest sit below the table and the pace band, about 1,200 px under the result. A user changing "8" to "6" scrolls past everything, then back up to see the answer. Lap length and Pacing have the same problem in the other modes. Page tool height is 2,073 px. | Put the mode-specific controls (repeats, distance, rest, pacing) above the result on phones; keep only Lap length and Round-to below. Or add a sticky mini result bar. |
| should | Phone table | "Clock (with rest)" header and the last column are cut off at the right edge of the table box on 390 px; the table scrolls sideways inside a card that also scrolls vertically (max-h 26 rem). Nested scroll areas are awkward with a thumb. | Shorten to "Clock"; drop the max-height on phones. |
| should | Error state | Invalid field keeps a normal border in the Retro skin (the red `aria-invalid` rule loses to the Retro rule). The result box says "Check your numbers" but the input looks fine. | Add a Retro override for `[aria-invalid]`, and `aria-describedby` to the message. |
| should | 404 page | The Retro eyebrow rule (`main > section:first-child > p:first-child`) catches the big "404": it renders as a thin bordered 12 px bar across the page. | Scope the rule to the home page hero, or give the 404 paragraph a class. |
| should | Screen readers | `#result-status` is `aria-live="polite"` and `aria-atomic`; it re-announces the whole sentence on every keystroke. | Update the live region after a 600 ms pause, or only on blur or change. |
| should | Citations | Article and FAQ state the mile definition, the lane measuring line and the 7.7 m lane figure with no links. "Cite every formula" is a rule for this batch. | Add a short "Sources" list: International yard and pound agreement 1959, World Athletics Technical Rule on track marking. |
| should | H1 and hero | H1 is the bare keyword "Track split calculator"; the phone hides the description (`hidden sm:block`). | Fine for SEO; consider an H1 that says what it does ("Track split calculator: goal time to lap splits") and show a one-line description on phones. |
| should | Social image | OG card is good, but "5K 20:00.0" tile reads as a split, not a total time. | Label the tiles "5K total". |
| nice | Tap targets | Footer links about 36 px high; hint text is 12 px. All inputs, segments and buttons are at least 44 px. | `py-3` on footer links; hint text 13 px. |
| nice | JSON-LD | Parsed OK: WebApplication (free offer, featureList) and FAQPage (8 Q and A). Category HealthApplication is odd for a lap calculator. FAQ rich results are no longer shown for most sites, so the FAQ schema is harmless but gives no gain. | Use `UtilitiesApplication`. |
| nice | Article depth | 889 words, 12 headings, two tables (5K and mile). Missing tables for the queries people type: 800 m, 1500 m, 10K splits, "400m splits for a 60 s lap" lookups. | Add 800 m, 1500 m and 10K tables; add a link to jump to them. |
| nice | Internal links | Article links only to `#tool`; no link from FAQ answers to the article sections or from About to the tool. | Link "negative split" and "pace band" mentions to their sections. |
| nice | Sitemap | No `lastmod`. Fine for 5 pages. | Optional. |
| nice | Favicon and logo | Favicon (oval track in a green circle) is clear at 192 px; header mark is the same. | None. |
| nice | Dark mode | Tested at 1280: contrast good (cream on brown; white on green result). Result green is the same in both themes, OK. | None. |
| nice | Layout shift | Reserved heights (`min-h-[44rem]`) work; CLS 0.005 on mobile. | None. |

Checks passed: title 51 characters, meta description 150, one H1, outline H2 only below, canonical to the real domain, OG and Twitter tags, manifest, apple-touch-icon, robots and sitemap, skip link, visible 3 px focus ring, labels on all inputs, `prefers-reduced-motion`, print layout (53 cells for a half marathon, black on white).
