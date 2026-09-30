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
  'lguplus-prepaid-kr-2026': ['kr', 'lguplus-prepaid-kr', 'lguplus-kr', 'hold'],
  'mts-by-2026': ['by', 'mts-by-prepaid', 'mts-by', 'hold'],
  'bakcell-cin-az-2026': ['az', 'bakcell-cin', 'bakcell-az', 'hold'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C9 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(brands.some((row) => row.id === brandId && row.marketId === marketId));
  assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https?:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const lgu = buildCanonicalComparisonRoute(canonical, 'lguplus-prepaid-kr-2026');
assert.equal(lgu.guideEligible, false); assert.match(lgu.holdReason, /identity|product|MVNO|roaming/i); assert.match(lgu.roamingSms, /roaming|overseas/i);
const mts = buildCanonicalComparisonRoute(canonical, 'mts-by-2026');
assert.equal(mts.landedCost.observedActionCost, 39.9); assert.equal(mts.keep.state, 'current-provider-lifecycle'); assert.match(mts.roamingSms, /unavailable|not a valid/i);
const bakcell = buildCanonicalComparisonRoute(canonical, 'bakcell-cin-az-2026');
assert.equal(bakcell.keep.observedActionCost, 3.99); assert.equal(bakcell.keep.intervalDays, 30); assert.match(bakcell.holdReason, /archive|archived/i);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C9 migration passed: LG U+ legacy candidate, MTS Belarus and Bakcell CIN normalized as HOLD; 135 comparison routes and 3-route indexability preserved.');
