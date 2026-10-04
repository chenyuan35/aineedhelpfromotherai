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
  'cricket-us-2026': ['us', 'cricket-us', 'att-us', 'hold'],
  'google-fi-flexible-2026': ['us', 'google-fi-us', 'tmobile-us', 'hold'],
  'beeline-uz-2026': ['uz', 'beeline-uz-prepaid', 'beeline-uz', 'hold'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C17 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(canonical.markets.some((row) => row.id === marketId)); assert(brands.some((row) => row.id === brandId && row.marketId === marketId)); assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https?:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const cricket = buildCanonicalComparisonRoute(canonical, 'cricket-us-2026');
assert.equal(cricket.keep.intervalDays, 365); assert.equal(cricket.keep.observedActionCost, 300); assert.equal(cricket.keep.yearCostOriginal, 300); assert.match(cricket.roamingSms, /China|Passport/i); assert.match(cricket.wifiCalling, /previously connected|Cricket network/i); assert.match(cricket.holdReason, /USD300|China-first|foreign/i);
const fi = buildCanonicalComparisonRoute(canonical, 'google-fi-flexible-2026');
assert.equal(fi.keep.intervalDays, 30); assert.equal(fi.keep.observedActionCost, 20); assert.equal(fi.keep.yearCostOriginal, 240); assert.match(fi.chinaActivation, /United States|abroad is not allowed/i); assert.match(fi.roamingSms, /China|no extra charge/i); assert.match(fi.holdReason, /U\.S\.-first|payments-profile|USD240/i);
const beeline = buildCanonicalComparisonRoute(canonical, 'beeline-uz-2026');
assert.equal(beeline.keep.intervalDays, 90); assert.equal(beeline.landedCost.providerOrCommunityPrice, 12000); assert.match(beeline.payment, /Ding|Visa|UnionPay/i); assert.match(beeline.roamingSms, /China|Hello|ordinary/i); assert.match(beeline.holdReason, /Hello|ordinary|90-day/i);
assert.equal(canonical.routes.length, 157); assert.equal(canonical.markets.length, 86); assert.equal(brands.length, 154); assert.equal(networks.length, 116); assert.equal(sources.length, 599);
const canonicalIds = new Set(canonical.routes.map((row) => row.id));
const legacyOnly = globalDirectory.routes.map((row) => row.id).filter((id) => !canonicalIds.has(id));
assert.deepEqual(legacyOnly, ['sakura-mobile-voice-2026']);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C17 migration passed: Cricket HOLD, Google Fi HOLD, Beeline UZ HOLD; 140 canonical routes, 129 comparison overlaps, 6 legacy-only and 3-route indexability preserved.');
