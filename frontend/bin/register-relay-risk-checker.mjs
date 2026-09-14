import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const slug = 'relay-exit-risk-checker';
const url = `/tools/${slug}/`;

function injectBefore(path, marker, content) {
  let html = readFileSync(path, 'utf8');
  if (html.includes(content.trim())) return;
  if (!html.includes(marker)) throw new Error(`Marker not found in ${path}`);
  html = html.replace(marker, content + marker);
  writeFileSync(path, html);
}

const card = `<a class="tool-card" href="${url}"><span class="pill">Relay risk</span><h2>Could This AI Relay Disappear?</h2><p>Combine open third-party measurements, daily history and a 90-day community forecast into an Exit Risk Index.</p><span class="text-link">Check relay risk →</span></a>`;
const toolsSection = `<section><p class="eyebrow">Relay risk</p><h2>Check an AI relay before you prepay.</h2><p>Measured uptime and pricing signals, our daily snapshots, community forecasts and prepaid-balance exposure.</p><div class="tools-grid">${card}</div></section>`;
injectBefore(join(root, 'tools', 'index.html'), '<section class="content-section"><h2>Built for quick answers</h2>', toolsSection);

const homePath = join(root, 'index.html');
let home = readFileSync(homePath, 'utf8');
if (!home.includes('id="quick-relay"')) {
  const marker = '  </div>\n</section>\n<section><p class="eyebrow">Popular tools</p>';
  const quick = '    <article class="quick-start-card" id="quick-relay"><span class="quick-start-kicker">Relay risk</span><h3>Could this relay disappear?</h3><p>Open measurements, daily history and a 90-day community forecast.</p><div class="quick-links"><a href="/tools/relay-exit-risk-checker/">Check a relay</a></div></article>\n';
  if (!home.includes(marker)) throw new Error('Quick-start marker not found on homepage');
  home = home.replace(marker, quick + marker);
}
if (!home.includes('href="#quick-relay">Check relay risk</a>')) {
  home = home.replace('<a href="/tools/">Browse all tools</a>', '<a href="#quick-relay">Check relay risk</a><a href="/tools/">Browse all tools</a>');
}
if (!home.includes('"AI Relay Exit Risk Checker","/tools/relay-exit-risk-checker/"')) {
  home = home.replace('];const input=document.getElementById(\'tool-search\')', ',["AI Relay Exit Risk Checker","/tools/relay-exit-risk-checker/","relay risk exit shutdown disappear api middleman"]];const input=document.getElementById(\'tool-search\')');
}
writeFileSync(homePath, home);

const sitemapPath = join(root, 'sitemap.xml');
let sitemap = readFileSync(sitemapPath, 'utf8');
const loc = `https://aineedhelpfromotherai.com${url}`;
if (!sitemap.includes(loc)) {
  sitemap = sitemap.replace('</urlset>', `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n</urlset>`);
  writeFileSync(sitemapPath, sitemap);
}
console.log('Registered Relay Exit Risk Checker in homepage quick starts, search, tools, and sitemap.');
