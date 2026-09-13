import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const repoRoot = join(root, '..');

// Generated builds must not claim that every page was materially updated on the
// build date. Google recommends omitting <lastmod> when an accurate significant
// modification date cannot be maintained consistently.
function stripSitemapLastmod(file) {
  if (!existsSync(file)) return;
  const xml = readFileSync(file, 'utf8');
  const normalized = xml.replace(/\n\s*<lastmod>[^<]+<\/lastmod>/g, '');
  writeFileSync(file, normalized);
}

stripSitemapLastmod(join(root, 'sitemap.xml'));
stripSitemapLastmod(join(repoRoot, 'sitemap.xml'));

// The AI tool generators previously set schema.org dateModified to the build
// date. Remove that volatile value rather than publishing fabricated freshness.
const aiToolSlugs = [
  'manus-credits-reset',
  'replit-usage-reset',
  'cursor-usage-reset',
  'ai-credit-burn-rate-calculator',
  'github-copilot-credits-reset',
  'bolt-tokens-reset',
];

for (const slug of aiToolSlugs) {
  const file = join(root, 'tools', slug, 'index.html');
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');
  const normalized = html.replace(/,"dateModified":"\d{4}-\d{2}-\d{2}"/g, '');
  writeFileSync(file, normalized);
}

console.log('Normalized generated freshness metadata: no build-date freshness claims.');
