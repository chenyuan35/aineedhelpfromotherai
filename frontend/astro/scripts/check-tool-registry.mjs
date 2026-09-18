import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(here, '..', 'src', 'data', 'tools.ts'), 'utf8');

const values = (pattern) => [...source.matchAll(pattern)].map((match) => match[1]);
const hrefs = values(/href:\s*'([^']+)'/g);
const slugs = values(/slug:\s*'([^']+)'/g);

if (!hrefs.length || !slugs.length || hrefs.length !== slugs.length) {
  throw new Error(`Registry parse failed: ${slugs.length} slugs / ${hrefs.length} hrefs`);
}

for (const href of hrefs) {
  if (!href.startsWith('/tools/') || !href.endsWith('/')) {
    throw new Error(`Tool href must be a trailing-slash /tools/ path: ${href}`);
  }
}

for (const [label, entries] of [['slug', slugs], ['href', hrefs]]) {
  const duplicates = entries.filter((value, index) => entries.indexOf(value) !== index);
  if (duplicates.length) throw new Error(`Duplicate ${label}: ${[...new Set(duplicates)].join(', ')}`);
}

const required = [
  '/tools/phone-number-survival-guide/',
  '/tools/cursor-usage-reset/',
  '/tools/claude-code-limit-reset/',
  '/tools/relay-exit-risk-checker/',
];
for (const href of required) {
  if (!hrefs.includes(href)) throw new Error(`Missing required core route: ${href}`);
}

console.log(`Tool registry OK: ${hrefs.length} unique public routes.`);
