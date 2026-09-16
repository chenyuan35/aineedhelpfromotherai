import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const slug = 'phone-number-survival-guide';
const pathUrl = `/tools/${slug}/`;
const canonical = `https://aineedhelpfromotherai.com${pathUrl}`;
const toolsPath = join(root, 'tools', 'index.html');
let tools = readFileSync(toolsPath, 'utf8');

tools = tools
  .replace('<title>Free Online Calculators – Fast, Private, No Sign-Up</title>', '<title>Phone Number, AI Usage & Utility Tools | Everyday Tools</title>')
  .replace('<meta name="description" content="Free online percentage, discount, age and date calculators. Fast, mobile-friendly tools that run directly in your browser.">', '<meta name="description" content="Phone number survival guidance, AI usage reset trackers, relay risk checks and fast browser utilities — free, private-first and no sign-up required.">')
  .replace('{"@context":"https://schema.org","@type":"CollectionPage","name":"Free Online Calculators","url":"https://aineedhelpfromotherai.com/tools/"}', '{"@context":"https://schema.org","@type":"CollectionPage","name":"Phone Number, AI Usage & Utility Tools","url":"https://aineedhelpfromotherai.com/tools/"}')
  .replace('<a href="/tools/">Calculators</a>', '<a href="/tools/">Tools</a>')
  .replace('<section class="listing-hero"><p class="eyebrow">Free online calculators</p><h1>Useful calculations without the clutter.</h1><p>Open a calculator, enter your numbers, and get the answer. No account, no installation, and no AI usage required.</p></section>', '<section class="listing-hero"><p class="eyebrow">Phone number &amp; AI utility tools</p><h1>Keep access to the accounts and tools you rely on.</h1><p>Start with phone-number survival, then use focused AI reset, relay-risk and browser utilities. No account is required.</p></section>')
  .replace('All calculators', 'All tools');

if (!tools.includes(pathUrl)) {
  const marker = '<section class="tools-grid">';
  if (!tools.includes(marker)) throw new Error('Primary tools marker not found');
  const section = `<section><p class="eyebrow">Primary product · Phone number survival</p><h2>Get a number you can still control later.</h2><p>Compare purchase, activation, verification, roaming, keep-alive and recovery rules with explicit unknowns.</p><div class="tools-grid"><a class="tool-card" href="${pathUrl}"><span class="pill">Phone number survival</span><h2>Phone Number Survival Guide</h2><p>Choose a number for registration or travel, see the real lifecycle risk, and know the safest documented action to keep it alive.</p><span class="text-link">Build a survival plan →</span></a></div></section>`;
  tools = tools.replace(marker, section + marker);
}
writeFileSync(toolsPath, tools);

const sitemapPath = join(root, 'sitemap.xml');
let sitemap = readFileSync(sitemapPath, 'utf8');
if (!sitemap.includes(canonical)) {
  sitemap = sitemap.replace('</urlset>', `  <url>
    <loc>${canonical}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  writeFileSync(sitemapPath, sitemap);
}
console.log('Registered Phone Number Survival Guide in tools and sitemap.');
