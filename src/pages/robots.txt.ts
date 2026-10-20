import type { APIRoute } from 'astro';
import { url } from '../lib/url.ts';
// The GitHub Pages copy is a preview: block crawlers there (pages also carry noindex).
const isPreview = import.meta.env.BASE_URL.replace(/\/+$/, '') !== '';
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\n${isPreview ? 'Disallow' : 'Allow'}: /\n\nSitemap: ${new URL(url('sitemap-index.xml'), site)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
