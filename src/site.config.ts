// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
export default {
  name: 'Track Split Calculator',                 // shown in header, title, footer
  domain: 'tracksplitcalculator.com',            // no https://, no www. Used for canonical, sitemap, robots
  cloudflareProject: 'track-split-calculator',    // Cloudflare Pages project name (used by npm run deploy)
  keyword: 'track split calculator',        // main keyword (search phrase)
  h1: 'Track split calculator',     // visible page heading
  title: 'Track Split Calculator: 400m Lap Splits & Pace Band', // home page title, under 60 chars
  tagline: 'Free and fast',
  description:
    'Turn a goal time into 400 m, 300 m or 200 m lap splits. Even or negative split, lap time to finish time, interval builder and a printable pace band.',
  keywords: ['track split calculator', '400m split calculator', 'lap split calculator', 'pace band', 'negative split calculator', 'interval pace calculator', 'track pace calculator'],
  email: 'hello@tracksplitcalculator.com',       // contact email (shown on Contact and Privacy pages)
  ga4: '',                            // GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty = Google Analytics off
  adsense: '',                        // AdSense publisher ID, e.g. 'ca-pub-1234567890123456'. Empty = ads off
  brand: '#2f7a1f',                   // brand color (hex): infield green
  skin: 'retro',                      // visual skin: minimal, swiss, clay or retro
  locale: 'en-US',                    // BCP 47 language tag
  ogImage: '/og.png',
  category: 'UtilitiesApplication',   // schema.org applicationCategory
  owner: 'Track Split Calculator',                // name used in legal pages (person or business)
};
