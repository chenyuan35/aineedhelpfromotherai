import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = 'https://aineedhelpfromotherai.com/tiktok-publish/';
const card = `<a class="tool-card" href="/tiktok-publish/"><span class="pill">Creator utility</span><h2>TikTok Video Publisher</h2><p>For individual creators: choose a finished MP4 or MOV, review settings and explicitly publish your own video to TikTok.</p><span class="text-link">Open tool →</span></a>`;
const searchTuple = '["TikTok Video Publisher","/tiktok-publish/","tiktok creator publish video MP4 MOV upload post caption account"]';

const homePath = join(root, 'index.html');
let home = readFileSync(homePath, 'utf8');
if (!home.includes('"/tiktok-publish/"')) {
  const marker = 'const tools=[';
  if (!home.includes(marker)) throw new Error('Homepage search insertion marker not found');
  home = home.replace(marker, `${marker}${searchTuple},`);
  writeFileSync(homePath, home);
}

const toolsPath = join(root, 'tools', 'index.html');
let tools = readFileSync(toolsPath, 'utf8');
if (!tools.includes('/tiktok-publish/')) {
  const marker = '<a class="tool-card" href="/tools/ai-credit-burn-rate-calculator/">';
  if (tools.includes(marker)) {
    tools = tools.replace(marker, card + marker);
  } else {
    const mainEnd = '</main>';
    if (!tools.includes(mainEnd)) throw new Error('Tools page insertion point not found');
    const creatorSection = `<section aria-labelledby="creator-tools-title"><p class="eyebrow" id="creator-tools-title">Creator tools</p><div class="tools-grid">${card}</div></section>`;
    tools = tools.replace(mainEnd, `${creatorSection}${mainEnd}`);
  }
  writeFileSync(toolsPath, tools);
}

const sitemapPath = join(root, 'sitemap.xml');
let sitemap = readFileSync(sitemapPath, 'utf8');
if (!sitemap.includes(url)) {
  sitemap = sitemap.replace('</urlset>', `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n</urlset>`);
  writeFileSync(sitemapPath, sitemap);
}
console.log('Registered TikTok Video Publisher in tools and sitemap.');
