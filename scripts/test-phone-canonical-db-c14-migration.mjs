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
  'ooredoo-hala-qa-2026': ['qa', 'ooredoo-hala', 'ooredoo-qa', 'admitted'],
  'claro-pre-cl-2026': ['cl', 'claro-pre-cl', 'claro-cl', 'hold'],
  'claro-pre-co-2026': ['co', 'claro-pre-co', 'claro-co', 'hold'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C14 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(canonical.markets.some((row) => row.id === marketId)); assert(brands.some((row) => row.id === brandId && row.marketId === marketId)); assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https?:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const ooredoo = buildCanonicalComparisonRoute(canonical, 'ooredoo-hala-qa-2026');
assert.equal(ooredoo.keep.intervalDays, 209); assert.equal(ooredoo.keep.observedActionCost, 10); assert.equal(ooredoo.keep.yearCostOriginal, 20); assert.match(ooredoo.kyc, /passport|QID/i); assert.match(ooredoo.payment, /international|Apple Pay/i); assert.match(ooredoo.roamingSms, /China/i); assert.equal(ooredoo.holdReason, null);
const chile = buildCanonicalComparisonRoute(canonical, 'claro-pre-cl-2026');
assert.equal(chile.keep.intervalDays, null); assert.equal(chile.keep.observedActionCost, 750); assert.equal(chile.keep.yearCostOriginal, null); assert.match(chile.keep.action, /180 days|balance/i); assert.match(chile.kyc, /Chilean|passport/i); assert.match(chile.holdReason, /foreign|lifecycle|roaming/i);
const colombia = buildCanonicalComparisonRoute(canonical, 'claro-pre-co-2026');
assert.equal(colombia.keep.intervalDays, 60); assert.equal(colombia.keep.observedActionCost, 1000); assert.equal(colombia.keep.yearCostOriginal, null); assert.match(colombia.keep.action, /60 days|movement/i); assert.match(colombia.roamingSms, /no cost|free/i); assert.match(colombia.holdReason, /foreign|China/i);
assert.equal(canonical.routes.length, 131); assert.equal(canonical.markets.length, 79); assert.equal(brands.length, 128); assert.equal(networks.length, 104); assert.equal(sources.length, 475);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C14 migration passed: Ooredoo Hala Qatar ADMITTED, Claro Chile HOLD, Claro Colombia HOLD; 131 canonical routes, 135 comparison routes and 3-route indexability preserved.');
