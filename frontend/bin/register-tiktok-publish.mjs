import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = 'https://aineedhelpfromotherai.com/tiktok-publish/';
const card = `<a class="tool-card" href="/tiktok-publish/"><span class="pill">Creator utility</span><h2>TikTok Video Publisher</h2><p>Connect your TikTok account, choose an MP4 or MOV, review privacy settings, and publish with TikTok's Content Posting API.</p><span class="text-link">Open tool →</span></a>`;

const toolsPath = join(root, 'tools', 'index.html');
let tools = readFileSync(toolsPath, 'utf8');
if (!tools.includes('/tiktok-publish/')) {
  const marker = '<a class="tool-card" href="/tools/ai-credit-burn-rate-calculator/">';
  if (!tools.includes(marker)) throw new Error('Tools insertion marker not found');
  tools = tools.replace(marker, card + marker);
  writeFileSync(toolsPath, tools);
}

const sitemapPath = join(root, 'sitemap.xml');
let sitemap = readFileSync(sitemapPath, 'utf8');
if (!sitemap.includes(url)) {
  sitemap = sitemap.replace('</urlset>', `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n</urlset>`);
  writeFileSync(sitemapPath, sitemap);
}
console.log('Registered TikTok Video Publisher in tools and sitemap.');
