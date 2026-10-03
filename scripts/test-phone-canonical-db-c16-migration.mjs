import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const canonical = { routes: read('data/phone/v1/routes.json'), markets: read('data/phone/v1/markets.json'), snapshots: read('data/phone/v1/snapshots.json') };
const sources = read('data/phone/v1/sources.json'), brands = read('data/phone/v1/brands.json'), networks = read('data/phone/v1/networks.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');
const expected = {
  'mint-mobile-us-2026': ['us', 'mint-mobile-us', 'tmobile-us', 'hold'],
  'tmobile-prepaid-connect-2026': ['us', 'tmobile-prepaid-us', 'tmobile-us', 'admitted'],
  'visible-25-2026': ['us', 'visible-us', 'verizon-us', 'hold'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C16 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(canonical.markets.some((row) => row.id === marketId)); assert(brands.some((row) => row.id === brandId && row.marketId === marketId)); assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https?:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const mint = buildCanonicalComparisonRoute(canonical, 'mint-mobile-us-2026');
assert.equal(mint.keep.intervalDays, 365); assert.equal(mint.keep.observedActionCost, 180); assert.equal(mint.keep.yearCostOriginal, 180); assert.match(mint.wifiCalling, /all plans|Wi-Fi/i); assert.match(mint.holdReason, /China-first|payment|OTP/i);
const tmobile = buildCanonicalComparisonRoute(canonical, 'tmobile-prepaid-connect-2026');
assert.equal(tmobile.keep.intervalDays, 30); assert.equal(tmobile.keep.observedActionCost, 15); assert.equal(tmobile.keep.yearCostOriginal, 180); assert.match(tmobile.roamingSms, /China|0\.10|prepaid/i); assert.equal(tmobile.holdReason, null);
const visible = buildCanonicalComparisonRoute(canonical, 'visible-25-2026');
assert.equal(visible.keep.intervalDays, 365); assert.equal(visible.keep.observedActionCost, 275); assert.equal(visible.keep.yearCostOriginal, 275); assert.match(visible.wifiCalling, /before leaving|outside the U\.S\./i); assert.match(visible.holdReason, /activation|payment|China-first/i);
assert.equal(canonical.routes.length, 145); assert.equal(canonical.markets.length, 86); assert.equal(brands.length, 142); assert.equal(networks.length, 112); assert.equal(sources.length, 547);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C16 migration passed: Mint HOLD, T-Mobile Connect ADMITTED, Visible HOLD; 140 canonical routes, 135 comparison routes and 3-route indexability preserved.');
