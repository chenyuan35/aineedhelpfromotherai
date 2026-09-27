import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Post-build verification for the Phone Radar content surface (Astro-generated).
// Fails the build if pages or critical interactive markers are missing.

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const guideDir = join(dist, 'tools', 'phone-number-survival-guide');
const data = JSON.parse(readFileSync(join(root, 'tools', 'phone-number-lifecycle-mvp', 'global-directory.json'), 'utf8'));
const policy = JSON.parse(readFileSync(join(root, 'tools', 'phone-number-lifecycle-mvp', 'publication-policy.json'), 'utf8'));
const detailStates = new Set(['detail-eligible', 'indexable']);
const routeState = (r) => policy.routeStates?.[r.id] || policy.defaultRouteState || 'database-only';
const marketState = (m) => policy.marketStates?.[m] || policy.defaultMarketState || 'database-only';

const mustExist = [
  'index.html',
  'directory/index.html',
  'market/index.html',
  'keep-alive/index.html',
  'guides/index.html',
  'guides/keep-us-number-alive-abroad/index.html',
  'guides/keep-uk-number-alive-abroad/index.html',
  'guides/cheapest-sim-receiving-sms-abroad/index.html',
  'guides/hong-kong-sim-retention-guide/index.html',
  'guides/japan-sim-retention-guide/index.html',
];
for (const rel of mustExist) {
  if (!existsSync(join(guideDir, rel))) throw new Error(`Phone surface page missing: ${rel}`);
}

// Standalone route pages are explicit publication decisions, not a mirror of the database.
const expectedRouteIds = data.routes.filter((r) => detailStates.has(routeState(r))).map((r) => r.id).sort();
const routeRoot = join(guideDir, 'route');
const actualRouteIds = existsSync(routeRoot) ? readdirSync(routeRoot).filter((n) => existsSync(join(routeRoot, n, 'index.html'))).sort() : [];
if (JSON.stringify(actualRouteIds) !== JSON.stringify(expectedRouteIds)) throw new Error(`Route publication mismatch: ${actualRouteIds.length} built vs ${expectedRouteIds.length} admitted`);

const expectedKeepAliveIds = data.routes
  .filter((r) => detailStates.has(routeState(r)) && Number.isFinite(r.keep?.intervalDays) && r.keep?.action && r.publishState !== 'observation-hold')
  .map((r) => r.id).sort();
const keepAliveRoot = join(guideDir, 'keep-alive');
const actualKeepAliveIds = readdirSync(keepAliveRoot).filter((n) => n !== 'index.html' && existsSync(join(keepAliveRoot, n, 'index.html'))).sort();
if (JSON.stringify(actualKeepAliveIds) !== JSON.stringify(expectedKeepAliveIds)) throw new Error(`Keep-alive detail publication mismatch: ${actualKeepAliveIds.length} built vs ${expectedKeepAliveIds.length} admitted`);

// Interactive markers: keep-alive hub must ship the calculator + reminder engine.
const keepAliveHub = readFileSync(join(guideDir, 'keep-alive', 'index.html'), 'utf8');
for (const marker of ['window.KA_DATA=', 'phone_keepalive_calculate', 'phone_keepalive_ics', 'ka-date-']) {
  if (!keepAliveHub.includes(marker)) throw new Error(`Keep-alive hub marker missing: ${marker}`);
}
if (keepAliveHub.includes('RRULE:FREQ=DAILY;INTERVAL=') || keepAliveHub.includes('Default safety buffer: 15%')) throw new Error('Unsupported recurring reminder / default 15% buffer leaked into public build');

// Directory must ship the leaderboard, avoid-list and client filter.
const directory = readFileSync(join(guideDir, 'directory', 'index.html'), 'utf8');
for (const marker of ['Cheapest keep-alive routes', 'Not viable for retention', 'id="dir-q"', 'comparison-index.json']) {
  if (!directory.includes(marker)) throw new Error(`Directory marker missing: ${marker}`);
}

const comparisonIndexPath = join(guideDir, 'directory', 'comparison-index.json');
if (!existsSync(comparisonIndexPath)) throw new Error('Deferred comparison index missing');
const comparisonIndex = JSON.parse(readFileSync(comparisonIndexPath, 'utf8'));
const expectedComparisonCount = data.routes.filter((r) => ['comparison-visible','detail-eligible','indexable'].includes(routeState(r))).length;
if (comparisonIndex.routes?.length !== expectedComparisonCount) throw new Error(`Comparison index count mismatch: ${comparisonIndex.routes?.length} vs ${expectedComparisonCount}`);
for (const r of comparisonIndex.routes || []) {
  if (!r.detailHref) continue;
  const target = join(dist, r.detailHref.replace(/^\//, ''), 'index.html');
  if (!existsSync(target)) throw new Error(`Comparison index detail link missing target: ${r.id}`);
}
if ((directory.match(/<tr data-q=/g) || []).length) throw new Error('Full comparison database leaked into initial Directory HTML');

// No generated Phone page may link to a removed/non-published Phone URL.
function collectHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name.endsWith('.html')) out.push(p);
    else if (existsSync(p) && !name.includes('.')) collectHtml(p, out);
  }
  return out;
}
for (const file of collectHtml(guideDir)) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/href=["'](\/tools\/phone-number-survival-guide\/[^"']*)["']/g)) {
    const clean = match[1].split(/[?#]/)[0];
    const target = clean.endsWith('/')
      ? join(dist, clean.replace(/^\//, ''), 'index.html')
      : join(dist, clean.replace(/^\//, ''));
    if (!existsSync(target)) throw new Error(`Broken Phone internal link in ${file.slice(dist.length)}: ${match[1]}`);
  }
}

// Market detail pages require explicit admission; broad markets remain directory filters.
const expectedMarketSlugs = [...new Set(data.routes.map((r) => r.marketName || 'Global'))]
  .filter((m) => detailStates.has(marketState(m)))
  .map((m) => m.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')).sort();
const marketRoot = join(guideDir, 'market');
const actualMarketSlugs = readdirSync(marketRoot).filter((n) => n !== 'index.html' && existsSync(join(marketRoot, n, 'index.html'))).sort();
if (JSON.stringify(actualMarketSlugs) !== JSON.stringify(expectedMarketSlugs)) throw new Error(`Market publication mismatch: ${actualMarketSlugs.length} built vs ${expectedMarketSlugs.length} admitted`);

// Sitemap must contain only indexable standalone Phone detail URLs.
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const urlCount = (sitemap.match(/<loc>/g) || []).length;
for (const r of data.routes) {
  const url = `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/route/${r.id}/`;
  const present = sitemap.includes(`<loc>${url}</loc>`);
  if (routeState(r) === 'indexable' && !present) throw new Error(`Indexable route missing from sitemap: ${r.id}`);
  if (routeState(r) !== 'indexable' && present) throw new Error(`Non-indexable route leaked into sitemap: ${r.id}`);
}
for (const market of new Set(data.routes.map((r) => r.marketName || 'Global'))) {
  const slug = market.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const url = `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/market/${slug}/`;
  const present = sitemap.includes(`<loc>${url}</loc>`);
  if (marketState(market) === 'indexable' && !present) throw new Error(`Indexable market missing from sitemap: ${market}`);
  if (marketState(market) !== 'indexable' && present) throw new Error(`Non-indexable market leaked into sitemap: ${market}`);
}

console.log(`Phone surface verified: ${data.routes.length} database routes, ${expectedRouteIds.length} route detail pages, ${expectedMarketSlugs.length} market detail pages, ${urlCount} sitemap URLs.`);
