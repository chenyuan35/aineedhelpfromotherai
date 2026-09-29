import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const canonical = { routes: read('data/phone/v1/routes.json'), markets: read('data/phone/v1/markets.json'), snapshots: read('data/phone/v1/snapshots.json') };
const sources = read('data/phone/v1/sources.json');
const brands = read('data/phone/v1/brands.json');
const networks = read('data/phone/v1/networks.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');
const expected = {
  'smart-prepaid-ph-2026': ['ph', 'smart-ph', 'smart-ph', 'hold'],
  'mtn-ng-keepmynumber-2026': ['ng', 'mtn-ng-prepaid', 'mtn-ng', 'admitted'],
  'id-mobile-uk-2026': ['gb', 'id-mobile-uk', 'three-uk', 'hold'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `DB-C4B canonical route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId);
  assert.equal(route.surfaceState, 'backstage-only'); assert.equal(route.evidenceState, evidenceState);
  assert(brands.some((row) => row.id === brandId && row.marketId === marketId), `${routeId}: brand missing`);
  assert(networks.some((row) => row.id === networkId && row.marketId === marketId), `${routeId}: network missing`);
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: source missing ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const smart = buildCanonicalComparisonRoute(canonical, 'smart-prepaid-ph-2026');
assert.equal(smart.keep.observedActionCost, null);
assert.equal(smart.keep.intervalDays, null);
assert.match(smart.holdReason, /30 days/i);
assert.match(smart.kyc, /other visa/i);
const mtn = buildCanonicalComparisonRoute(canonical, 'mtn-ng-keepmynumber-2026');
assert.equal(mtn.keep.observedActionCost, 7500);
assert.equal(mtn.keep.yearCostOriginal, 2500);
assert.equal(mtn.keep.intervalDays, 1095);
assert.match(mtn.keep.action, /3-year option/i);
assert.equal(mtn.holdReason, null);
assert.match(mtn.kyc, /less than 24 months/i);
const idm = buildCanonicalComparisonRoute(canonical, 'id-mobile-uk-2026');
assert.equal(idm.keep.observedActionCost, 0.02);
assert.equal(idm.keep.intervalDays, 120);
assert.match(idm.keep.state, /180d/i);
assert.match(idm.holdReason, /120-day/i);
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C4B migration passed: Smart HOLD + MTN admitted + iD HOLD; 135 comparison routes and 3-route indexability preserved.');
