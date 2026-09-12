import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const repoRoot = join(root, '..');
const today = process.env.SITEMAP_LASTMOD || new Date().toISOString().slice(0,10);
const base = 'https://aineedhelpfromotherai.com';
const entries = [
  ['/', 'weekly', '1.0'],
  ['/tools/', 'weekly', '1.0'],
  ['/tools/percentage-calculator/', 'monthly', '0.9'],
  ['/tools/percentage-increase-calculator/', 'monthly', '0.9'],
  ['/tools/discount-calculator/', 'monthly', '0.9'],
  ['/tools/age-calculator/', 'monthly', '0.9'],
  ['/tools/date-difference-calculator/', 'monthly', '0.9'],
  ['/about/', 'monthly', '0.5'],
  ['/contact/', 'monthly', '0.4'],
  ['/privacy/', 'yearly', '0.3'],
  ['/terms/', 'yearly', '0.3']
];
const urls=entries.map(([path,freq,priority])=>`  <url>\n    <loc>${base}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join('\n');
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
writeFileSync(join(root,'sitemap.xml'),xml);
writeFileSync(join(repoRoot,'sitemap.xml'),xml);
console.log(`Generated sitemap.xml with ${entries.length} focused URLs`);
