/**
 * Post-build prerender script with Vercel / CI fallback.
 *
 * How it works:
 *  1. On environments with a full browser available (e.g. Windows/macOS/full Linux),
 *     it spins up a local server and uses Puppeteer to render the complete dynamic DOM.
 *  2. On minimal serverless environments like Vercel (where Chrome system libraries like
 *     libnspr4.so are absent) or if browser launch fails, it seamlessly falls back to
 *     static HTML route generation. It creates dist/index.html and dist/casestudy/index.html
 *     with full route-specific SEO metadata (Title, Description, Canonical, OpenGraph,
 *     Twitter cards, JSON-LD structured data) and semantic HTML content.
 *
 * Result: The build NEVER crashes on Vercel, and crawlers always get fully indexed pages.
 *
 * Usage: node scripts/prerender.mjs
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, '..', 'dist');
const PORT = 4173;

const ROUTES = ['/', '/casestudy'];

// MIME types for the local static server
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

// Route metadata for static generation / fallback
const ROUTE_DATA = {
  '/': {
    title: 'Dev Kumar | Frontend Developer & Digital Marketing Enthusiast',
    description:
      'Frontend Developer crafting modern UI/UX and driving growth with digital marketing, social media marketing, and responsive web design.',
    canonical: 'https://devkumar.is-a.dev/',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfilePage',
          '@id': 'https://devkumar.is-a.dev/#profile',
          url: 'https://devkumar.is-a.dev/',
          name: 'Dev Kumar | Portfolio',
          dateCreated: '2025-01-01T00:00:00+00:00',
          dateModified: '2026-10-22T00:00:00+00:00',
          mainEntity: {
            '@type': 'Person',
            '@id': 'https://devkumar.is-a.dev/#person',
            name: 'Dev Kumar',
            url: 'https://devkumar.is-a.dev/',
            jobTitle: 'Frontend Developer & Digital Marketing Enthusiast',
            description:
              'Building modern websites with code, creativity, and digital strategy. Frontend Developer and Digital Marketing enthusiast with experience in React.js, HTML, CSS, JavaScript, Figma, SEO, and content marketing.',
            image: 'https://devkumar.is-a.dev/og-preview.png',
            sameAs: [
              'https://www.linkedin.com/in/kumaardev/',
              'https://github.com/devknowledgebase',
              'https://x.com/Dev3807',
            ],
          },
        },
        {
          '@type': 'WebSite',
          '@id': 'https://devkumar.is-a.dev/#website',
          name: 'Dev Kumar | Portfolio',
          url: 'https://devkumar.is-a.dev/',
        },
      ],
    },
    bodyHtml: `
      <main id="main-content">
        <header class="hero-fallback" style="padding:40px 20px;max-width:1100px;margin:0 auto;">
          <p style="font-size:24px;margin-bottom:8px;">Hello, I'm</p>
          <h1 style="font-size:48px;font-weight:700;margin:0 0 16px;">Dev Kumar</h1>
          <p style="font-size:20px;max-width:700px;line-height:1.5;">Turning Ideas into Interactive, Modern & Scalable Web Experiences.</p>
        </header>
        <section id="Work" style="padding:40px 20px;max-width:1100px;margin:0 auto;">
          <h2 style="font-size:32px;margin-bottom:24px;">Featured Works</h2>
          <article style="margin-bottom:32px;">
            <h3 style="font-size:24px;"><a href="/casestudy" style="color:inherit;text-decoration:none;">Lunara — Pinterest Marketing Case Study</a></h3>
            <p style="line-height:1.6;margin-top:8px;">How I grew a Pinterest brand to 164K+ impressions and 113K audience through organic content strategy, Pinterest SEO, and data-driven optimization.</p>
            <p><a href="/casestudy" style="color:#2b45f8;font-weight:600;">Read Case Study →</a></p>
          </article>
        </section>
        <section id="About" style="padding:40px 20px;max-width:1100px;margin:0 auto;">
          <h2 style="font-size:32px;margin-bottom:16px;">Combining Development, Design, and Digital Marketing</h2>
          <p style="line-height:1.6;max-width:800px;">Building modern websites with code, creativity, and digital strategy. Frontend Developer and Digital Marketing enthusiast with experience in React.js, HTML, CSS, JavaScript, Figma, SEO, and content marketing.</p>
          <p style="margin-top:20px;"><a href="/Resume_.pdf" target="_blank" rel="noopener noreferrer" style="color:#000000;font-weight:600;text-decoration:none;border:1.5px solid #000;padding:12px 24px;border-radius:100px;display:inline-block;">View CV</a></p>
        </section>
      </main>
    `,
  },
  '/casestudy': {
    title: 'Lunara — Pinterest Marketing Case Study | Dev Kumar',
    description:
      'How I grew a Pinterest brand to 164K+ impressions and 113K audience through organic content strategy, Pinterest SEO, and data-driven optimization.',
    canonical: 'https://devkumar.is-a.dev/casestudy',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Lunara — Pinterest Marketing Case Study',
      description:
        'How I grew a Pinterest brand to 164K+ impressions and 113K audience through organic content strategy, Pinterest SEO, and data-driven optimization.',
      image: 'https://devkumar.is-a.dev/og-preview.png',
      datePublished: '2026-01-15T00:00:00+00:00',
      dateModified: '2026-10-22T00:00:00+00:00',
      author: {
        '@type': 'Person',
        name: 'Dev Kumar',
        url: 'https://devkumar.is-a.dev/',
      },
      publisher: {
        '@type': 'Person',
        name: 'Dev Kumar',
      },
      mainEntityOfPage: 'https://devkumar.is-a.dev/casestudy',
    },
    bodyHtml: `
      <article class="casestudy-container" style="max-width:1100px;margin:0 auto;padding:40px 20px;">
        <nav style="display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;">
          <a href="/" style="color:inherit;text-decoration:none;font-weight:700;font-size:20px;">Dev Kumar</a>
          <a href="/" style="color:inherit;text-decoration:none;border:1px solid rgba(255,255,255,0.2);padding:10px 20px;border-radius:30px;">← Back to Work</a>
        </nav>
        <header style="margin-bottom:40px;">
          <span style="display:inline-block;background:#2b45f8;color:#fff;padding:6px 16px;border-radius:20px;font-size:14px;font-weight:600;text-transform:uppercase;margin-bottom:20px;">Case Study</span>
          <h1 style="font-size:48px;font-weight:700;margin:0 0 8px;">Pinterest Marketing</h1>
          <p style="font-size:20px;opacity:0.8;margin:0 0 20px;">Self-Care Niche — Organic Growth</p>
          <a href="https://pin.it/2Kn4pJy6m" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;border:1px solid rgba(255,255,255,0.2);padding:10px 20px;border-radius:30px;display:inline-block;">View Profile ↗</a>
        </header>
        <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:20px;margin-bottom:40px;">
          <div><div style="font-size:32px;font-weight:700;">164K+</div><div style="opacity:0.7;">Impressions</div></div>
          <div><div style="font-size:32px;font-weight:700;">113.4K</div><div style="opacity:0.7;">Total Audience</div></div>
          <div><div style="font-size:32px;font-weight:700;">350+</div><div style="opacity:0.7;">Pins Published</div></div>
          <div><div style="font-size:32px;font-weight:700;">8.4K</div><div style="opacity:0.7;">Outbound Clicks</div></div>
          <div><div style="font-size:32px;font-weight:700;">8.24%</div><div style="opacity:0.7;">Engagement Rate</div></div>
        </section>
        <section style="margin-bottom:40px;">
          <h2 style="font-size:28px;margin-bottom:16px;">Project Overview</h2>
          <p style="line-height:1.7;font-size:18px;">Lunara is a Pinterest brand focused on inspiring healthier habits, mindfulness, productivity, and self-care. I built and managed the account from the ground up, creating an organic content strategy that combined Pinterest SEO, engaging visual design, and data-driven optimization to increase reach and audience engagement without paid advertising.</p>
        </section>
        <section style="margin-bottom:40px;">
          <h2 style="font-size:28px;margin-bottom:16px;">Responsibilities</h2>
          <ul style="line-height:2;font-size:17px;">
            <li>Pinterest SEO & Keyword Research</li>
            <li>Content Strategy & Planning</li>
            <li>Pin Design (Figma & Canva)</li>
            <li>Copywriting & Call-to-Action Optimization</li>
            <li>Board Organization & Strategic SEO</li>
            <li>Pinterest Analytics & Performance Tracking</li>
          </ul>
        </section>
        <footer style="margin-top:60px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);">
          <a href="/" style="color:inherit;text-decoration:none;border:1px solid rgba(255,255,255,0.2);padding:12px 28px;border-radius:30px;display:inline-block;">← Back to All Works</a>
        </footer>
      </article>
    `,
  },
};

/**
 * Generate a static HTML page by injecting route-specific metadata and fallback content into the template dist/index.html.
 */
function generateStaticRoute(templateHtml, route) {
  const data = ROUTE_DATA[route];
  if (!data) return templateHtml;

  let html = templateHtml;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${data.title}</title>`);

  // Replace Description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"/i,
    `<meta name="description" content="${data.description}"`
  );

  // Replace Canonical Link
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"/i,
    `<link rel="canonical" href="${data.canonical}"`
  );

  // Replace OG tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"/i,
    `<meta property="og:title" content="${data.title}"`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"/i,
    `<meta property="og:description" content="${data.description}"`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"/i,
    `<meta property="og:url" content="${data.canonical}"`
  );
  html = html.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"/i,
    `<meta property="og:type" content="${data.ogType}"`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"/i,
    `<meta name="twitter:title" content="${data.title}"`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"/i,
    `<meta name="twitter:description" content="${data.description}"`
  );

  // Inject JSON-LD structured data before </head>
  const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(data.jsonLd)}</script>`;
  html = html.replace('</head>', `  ${jsonLdScript}\n</head>`);

  // Inject semantic fallback content inside <div id="root"></div>
  html = html.replace(
    /<div id="root"><\/div>/i,
    `<div id="root">${data.bodyHtml}</div>`
  );

  return html;
}

/**
 * Fallback static generator: runs when Puppeteer / Chrome cannot launch.
 */
function generateAllStaticRoutes() {
  const templatePath = join(DIST_DIR, 'index.html');
  if (!existsSync(templatePath)) {
    console.error('❌  Template dist/index.html not found! Run vite build first.');
    return;
  }
  const baseHtml = readFileSync(templatePath, 'utf-8');

  for (const route of ROUTES) {
    const renderedHtml = generateStaticRoute(baseHtml, route);
    let outPath;
    if (route === '/') {
      outPath = join(DIST_DIR, 'index.html');
    } else {
      const dir = join(DIST_DIR, route.replace(/^\//, ''));
      mkdirSync(dir, { recursive: true });
      outPath = join(dir, 'index.html');
    }
    writeFileSync(outPath, renderedHtml, 'utf-8');
    console.log(`  ✅  [Static] ${route} → ${outPath}`);
  }
}

/**
 * Minimal static server for Puppeteer rendering.
 */
function startServer() {
  return new Promise((resolvePromise) => {
    const server = createServer((req, res) => {
      let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

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

  // If VERCEL environment is detected, directly use static generation.
  // Vercel build containers lack GUI/desktop libraries (libnspr4.so, etc.) needed by standard Chrome.
  if (process.env.VERCEL) {
    console.log('⚡  Vercel environment detected (minimal Linux container).');
    console.log('⚡  Generating static prerendered HTML routes with SEO metadata & semantic fallback...\n');
    generateAllStaticRoutes();
    console.log('\n🎉  Prerender complete!\n');
    return;
  }

  // Attempt dynamic Puppeteer rendering for local / supported environments
  let puppeteer;
  try {
    puppeteer = (await import('puppeteer')).default;
  } catch (err) {
    console.warn('⚠️  Puppeteer module not found. Using static generator fallback.');
    generateAllStaticRoutes();
    return;
  }

  let server;
  let browser;

  try {
    server = await startServer();
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (launchErr) {
    console.warn(`\n⚠️  Could not launch headless browser: ${launchErr.message}`);
    console.log('⚡  Falling back to static HTML route generation...\n');
    if (server) server.close();
    generateAllStaticRoutes();
    console.log('\n🎉  Prerender complete (static fallback)!\n');
    return;
  }

  try {
    for (const route of ROUTES) {
      const url = `http://localhost:${PORT}${route}`;
      console.log(`  ⏳  Rendering ${route} ...`);

      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      await page.waitForFunction(
        () => {
          const root = document.getElementById('root');
          return root && root.children.length > 0;
        },
        { timeout: 15000 }
      );

      const contentSelector =
        route === '/' ? '#main-content' : '.casestudy-container';

      await page.waitForSelector(contentSelector, { timeout: 20000 });
      await new Promise((r) => setTimeout(r, 2000));

      await page.evaluate(() => {
        document.querySelectorAll('.loading-screen, .gradual-blur').forEach(el => el.remove());
        // Clean up runtime scripts/links injected by preview server or GTM during crawl
        document.querySelectorAll('script[src*="googletagmanager.com/gtm.js"]').forEach(el => el.remove());
        document.querySelectorAll('link[href*="localhost"]').forEach(el => el.remove());
      });

      let html = await page.content();
      html = html.replaceAll('http://localhost:4173', '');

      let outPath;
      if (route === '/') {
        outPath = join(DIST_DIR, 'index.html');
      } else {
        const dir = join(DIST_DIR, route.replace(/^\//, ''));
        mkdirSync(dir, { recursive: true });
        outPath = join(dir, 'index.html');
      }

      writeFileSync(outPath, html, 'utf-8');
      console.log(`  ✅  ${route} → ${outPath}`);

      await page.close();
    }
  } catch (crawlErr) {
    console.warn(`\n⚠️  Puppeteer dynamic crawl encountered an issue: ${crawlErr.message}`);
    console.log('⚡  Ensuring all static routes are generated via fallback...');
    generateAllStaticRoutes();
  } finally {
    if (browser) await browser.close();
    if (server) server.close();
  }

  console.log('\n🎉  Prerender complete!\n');
}

prerender().catch((err) => {
  console.error('⚠️  Prerender notice:', err.message || err);
  // Never crash the build; ensure static routes exist
  try {
    generateAllStaticRoutes();
  } catch {
    // ignore
  }
  process.exit(0);
});
