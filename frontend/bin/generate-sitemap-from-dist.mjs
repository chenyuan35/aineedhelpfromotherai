import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Single-source sitemap: walks the final dist/ and emits every public page.
// Replaces the per-generator string-append sitemap logic. Phone-surface pages
// get lastmod from the evidence packet's checkedAt; other pages omit lastmod.

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE = 'https://aineedhelpfromotherai.com';
const GUIDE = '/tools/phone-number-survival-guide/';

const dataPath = join(root, 'tools', 'phone-number-lifecycle-mvp', 'global-directory.json');
const checkedAt = existsSync(dataPath) ? JSON.parse(readFileSync(dataPath, 'utf8')).checkedAt : null;

const skipFiles = new Set(['404.html']);
// Reset-family tools stay reachable by direct URL but are deliberately kept out
// of the sitemap (decision: removed from primary surfaces for site focus).
const excludeUrls = new Set([
  '/tools/claude-code-limit-reset/',
  '/tools/cursor-usage-reset/',
  '/tools/bolt-tokens-reset/',
  '/tools/github-copilot-credits-reset/',
  '/tools/manus-credits-reset/',
  '/tools/replit-usage-reset/',
  '/tools/ai-credit-burn-rate-calculator/',
]);
const urls = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) { walk(p); continue; }
    if (!name.endsWith('.html')) continue;
    const rel = p.slice(dist.length).replace(/\\/g, '/');
    if (rel.split('/').some((seg) => skipFiles.has(seg))) continue;
    let url;
    if (name === 'index.html') url = rel.slice(0, -'index.html'.length);
    else url = rel;
    if (excludeUrls.has(url)) continue;
    urls.push(url);
  }
}
walk(dist);

function priority(url) {
  if (url === '/') return '1.0';
  if (url === GUIDE) return '0.9';
  if (url === '/tools/') return '0.8';
  if (url.startsWith(GUIDE)) {
    if (['directory/', 'guides/', 'keep-alive/', 'market/'].some((s) => url === `${GUIDE}${s}`)) return '0.8';
    return '0.7';
  }
  if (url === '/about/' || url === '/contact/' || url === '/privacy/' || url === '/terms/') return '0.3';
  return '0.6';
}

urls.sort((a, b) => a.localeCompare(b));
const entries = urls.map((url) => {
  const isPhone = url.startsWith(GUIDE);
  const lastmod = isPhone && checkedAt ? `\n    <lastmod>${checkedAt}</lastmod>` : '';
  return `  <url>\n    <loc>${SITE}${url}</loc>${lastmod}\n    <changefreq>${isPhone ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${priority(url)}</priority>\n  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
writeFileSync(join(dist, 'sitemap.xml'), xml);
console.log(`Sitemap regenerated from dist: ${urls.length} URLs.`);
