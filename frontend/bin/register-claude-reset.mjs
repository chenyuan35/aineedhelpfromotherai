import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const slug = 'claude-code-limit-reset';
const url = `https://aineedhelpfromotherai.com/tools/${slug}/`;
const card = `<a class="tool-card" href="/tools/${slug}/"><span class="pill">AI usage tracker</span><h2>Claude Code Limit Reset Calculator</h2><p>Track Claude Code session and weekly usage resets with two local countdowns using the reset times shown by Claude.</p><span class="text-link">Open tool →</span></a>`;

const toolsPath = join(root, 'tools', 'index.html');
let tools = readFileSync(toolsPath, 'utf8');
if (!tools.includes(`/tools/${slug}/`)) {
  const marker = '<a class="tool-card" href="/tools/ai-credit-burn-rate-calculator/">';
  if (!tools.includes(marker)) throw new Error('AI tools marker not found');
  tools = tools.replace(marker, card + marker);
  writeFileSync(toolsPath, tools);
}

const sitemapPath = join(root, 'sitemap.xml');
let sitemap = readFileSync(sitemapPath, 'utf8');
if (!sitemap.includes(url)) {
  sitemap = sitemap.replace('</urlset>', `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n</urlset>`);
  writeFileSync(sitemapPath, sitemap);
}
console.log('Registered Claude Code Limit Reset Calculator in tools and sitemap.');
