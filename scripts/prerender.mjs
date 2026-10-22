/**
 * Post-build prerender script.
 *
 * After `vite build` produces `dist/`, this script:
 *  1. Spins up a local static server on dist/
 *  2. Uses Puppeteer to visit each route
 *  3. Waits for the React app to fully render
 *  4. Captures the rendered HTML and writes it back to dist/
 *
 * Result: dist/index.html and dist/casestudy/index.html contain
 * the fully rendered page content — visible to crawlers without JS.
 *
 * Usage: node scripts/prerender.mjs
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, '..', 'dist');
const PORT = 4173;

// ──────────────────────────────────────────────
// Routes to prerender — add new public routes here
// ──────────────────────────────────────────────
const ROUTES = ['/', '/casestudy'];

// MIME types for the static server
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
};

/**
 * Minimal static file server for the dist directory.
 * Falls back to index.html for SPA routes.
 */
function startServer() {
  return new Promise((resolvePromise) => {
    const server = createServer((req, res) => {
      let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

      // If the path doesn't have an extension, treat it as an SPA route
      if (!extname(filePath)) {
        filePath = join(DIST_DIR, 'index.html');
      }

      if (!existsSync(filePath)) {
        filePath = join(DIST_DIR, 'index.html');
      }

      try {
        const content = readFileSync(filePath);
        const ext = extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(PORT, () => {
      console.log(`📦  Static server running at http://localhost:${PORT}`);
      resolvePromise(server);
    });
  });
}

async function prerender() {
  console.log('\n🔄  Starting prerender...\n');

  // 1. Start local server
  const server = await startServer();

  // 2. Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const route of ROUTES) {
      const url = `http://localhost:${PORT}${route}`;
      console.log(`  ⏳  Rendering ${route} ...`);

      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      // Wait for React to mount — the #root div should have children
      await page.waitForFunction(
        () => {
          const root = document.getElementById('root');
          return root && root.children.length > 0;
        },
        { timeout: 15000 }
      );

      // Wait for actual page content to appear (after loading screen animation).
      // Home page: the loading screen runs ~4s before #main-content appears.
      // Casestudy: lazy-loaded, wait for .casestudy-container.
      const contentSelector =
        route === '/' ? '#main-content' : '.casestudy-container';

      await page.waitForSelector(contentSelector, { timeout: 20000 });

      // Extra settle time for animations, fonts, lazy images
      await new Promise((r) => setTimeout(r, 2000));

      // Remove loading screen overlay and decorative blur from prerendered HTML
      await page.evaluate(() => {
        // Remove the loading screen (if still in DOM after animation)
        document.querySelectorAll('.loading-screen, .gradual-blur').forEach(el => el.remove());
      });

      // 3. Capture the full rendered HTML
      const html = await page.content();

      // 4. Determine output path
      let outPath;
      if (route === '/') {
        outPath = join(DIST_DIR, 'index.html');
      } else {
        // e.g. /casestudy → dist/casestudy/index.html
        const dir = join(DIST_DIR, route.replace(/^\//, ''));
        mkdirSync(dir, { recursive: true });
        outPath = join(dir, 'index.html');
      }

      writeFileSync(outPath, html, 'utf-8');
      console.log(`  ✅  ${route} → ${outPath}`);

      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n🎉  Prerender complete!\n');
}

prerender().catch((err) => {
  console.error('❌  Prerender failed:', err);
  process.exit(1);
});
