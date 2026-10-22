/**
 * Sitemap generator — runs at build time via `npm run build`.
 * 
 * Reads routes from a config array below. When you add a new public route,
 * add it here so the sitemap stays in sync.
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL = 'https://devkumar.is-a.dev';
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// ──────────────────────────────────────────────
// Add / remove public routes here:
// ──────────────────────────────────────────────
const routes = [
  { path: '/',          lastmod: TODAY },
  { path: '/casestudy', lastmod: TODAY },
];

function generateSitemap(routes) {
  const urls = routes
    .map(
      (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${r.lastmod}</lastmod>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

const sitemap = generateSitemap(routes);
const outPath = resolve(__dirname, '..', 'public', 'sitemap.xml');
writeFileSync(outPath, sitemap, 'utf-8');
console.log(`✅  Sitemap written to ${outPath}`);
