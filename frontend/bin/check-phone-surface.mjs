import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Post-build verification for the Phone Radar content surface (Astro-generated).
// Fails the build if pages or critical interactive markers are missing.

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const guideDir = join(dist, 'tools', 'phone-number-survival-guide');
const data = JSON.parse(readFileSync(join(root, 'tools', 'phone-number-lifecycle-mvp', 'global-directory.json'), 'utf8'));

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

// Every route in the packet must have a page.
const missingRoutes = data.routes.filter((r) => !existsSync(join(guideDir, 'route', r.id, 'index.html')));
if (missingRoutes.length) throw new Error(`Route pages missing: ${missingRoutes.map((r) => r.id).join(', ')}`);

// Interactive markers: keep-alive hub must ship the calculator + reminder engine.
const keepAliveHub = readFileSync(join(guideDir, 'keep-alive', 'index.html'), 'utf8');
for (const marker of ['window.KA_DATA=', 'RRULE:FREQ=DAILY;INTERVAL=', 'phone_keepalive_calculate', 'phone_keepalive_ics', 'ka-date-']) {
  if (!keepAliveHub.includes(marker)) throw new Error(`Keep-alive hub marker missing: ${marker}`);
}

// Directory must ship the leaderboard, avoid-list and client filter.
const directory = readFileSync(join(guideDir, 'directory', 'index.html'), 'utf8');
for (const marker of ['Cheapest keep-alive routes', 'Not viable for retention', 'id="dir-q"', 'data-q=']) {
  if (!directory.includes(marker)) throw new Error(`Directory marker missing: ${marker}`);
}

// Market pages: count must match the packet's markets.
const expectedMarkets = new Set(data.routes.map((r) => r.marketName || 'Global')).size;
const marketDirs = readdirSync(join(guideDir, 'market')).filter((n) => n !== 'index.html');
if (marketDirs.length !== expectedMarkets) throw new Error(`Market page count mismatch: ${marketDirs.length} vs ${expectedMarkets}`);

// Sitemap sanity: at least as many URLs as the pre-Astro baseline (262).
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const urlCount = (sitemap.match(/<loc>/g) || []).length;
if (urlCount < 262) throw new Error(`Sitemap URL count regression: ${urlCount} < 262`);

console.log(`Phone surface verified: ${data.routes.length} routes, ${expectedMarkets} markets, ${urlCount} sitemap URLs.`);
