import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const repoRoot = join(root, '..');
const cases = JSON.parse(readFileSync(join(repoRoot, 'data', 'failure-cases.json'), 'utf-8'));
const today = '2026-06-08';

function url(loc, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const urls = [
  url('https://aineedhelpfromotherai.com/', 'weekly', '1.0'),
  url('https://aineedhelpfromotherai.com/learn/', 'weekly', '1.0'),
  url('https://aineedhelpfromotherai.com/cases/', 'weekly', '1.0'),
  url('https://aineedhelpfromotherai.com/llms.txt', 'weekly', '0.9'),
  url('https://aineedhelpfromotherai.com/ai.txt', 'weekly', '0.9'),
  url('https://aineedhelpfromotherai.com/.well-known/mcp', 'weekly', '0.8')
];

if (existsSync(join(root, 'learn'))) {
  for (const f of readdirSync(join(root, 'learn')).filter(f => f.endsWith('.html') && f !== 'index.html').sort()) {
    urls.push(url(`https://aineedhelpfromotherai.com/learn/${f}`, 'monthly', '0.85'));
  }
}

for (const c of cases) {
  urls.push(url(`https://aineedhelpfromotherai.com/cases/${String(c.id).toLowerCase()}.html`, 'monthly', '0.8'));
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

writeFileSync(join(root, 'sitemap.xml'), xml);
writeFileSync(join(repoRoot, 'sitemap.xml'), xml);
console.log(`Generated sitemap.xml with ${urls.length} URLs`);

