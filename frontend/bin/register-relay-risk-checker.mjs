import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const slug = 'relay-exit-risk-checker';
const url = `/tools/${slug}/`;

function injectBefore(path, marker, content) {
  let html = readFileSync(path, 'utf8');
  if (html.includes(url)) return;
  if (!html.includes(marker)) throw new Error(`Marker not found in ${path}`);
  html = html.replace(marker, content + marker);
  writeFileSync(path, html);
}

const card = `<a class="tool-card" href="${url}"><span class="pill">Community risk</span><h2>AI Relay Exit Risk Checker</h2><p>Vote on shutdown risk and model-dilution sentiment, then calculate how many days of spending your prepaid balance exposes.</p><span class="text-link">Check relay risk →</span></a>`;
const toolsSection = `<section><p class="eyebrow">Community risk</p><h2>Check an AI relay before you prepay.</h2><p>Community shutdown-risk predictions, model-dilution sentiment and a prepaid-balance exposure calculator.</p><div class="tools-grid">${card}</div></section>`;
injectBefore(join(root, 'tools', 'index.html'), '<section class="content-section"><h2>Built for quick answers</h2>', toolsSection);

const homeSection = `<section><p class="eyebrow">Community risk tool</p><h2>Before you prepay an AI relay, check the crowd.</h2><p>Compare community exit-risk predictions, model-dilution sentiment and your own prepaid cash exposure.</p><div class="tools-grid">${card}</div></section>`;
injectBefore(join(root, 'index.html'), '<section><p class="eyebrow">How we build tools</p>', homeSection);

const sitemapPath = join(root, 'sitemap.xml');
let sitemap = readFileSync(sitemapPath, 'utf8');
const loc = `https://aineedhelpfromotherai.com${url}`;
if (!sitemap.includes(loc)) {
  sitemap = sitemap.replace('</urlset>', `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n</urlset>`);
  writeFileSync(sitemapPath, sitemap);
}
console.log('Registered AI Relay Exit Risk Checker in navigation and sitemap.');
