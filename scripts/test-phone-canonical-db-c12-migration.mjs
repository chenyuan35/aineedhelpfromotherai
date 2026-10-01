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
  'mtn-gh-prepaid-2026': ['gh', 'mtn-gh-prepaid', 'mtn-gh', 'hold'],
  'ncell-np-2026': ['np', 'ncell-prepaid', 'ncell-np', 'admitted'],
  'kolbi-cr-2026': ['cr', 'kolbi-prepaid', 'kolbi-cr', 'admitted'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C12 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(canonical.markets.some((row) => row.id === marketId));
  assert(brands.some((row) => row.id === brandId && row.marketId === marketId));
  assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https?:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const mtn = buildCanonicalComparisonRoute(canonical, 'mtn-gh-prepaid-2026');
assert.equal(mtn.keep.intervalDays, 365); assert.equal(mtn.keep.observedActionCost, 15); assert.equal(mtn.keep.yearCostOriginal, 15); assert.match(mtn.keep.action, /Number For Life|24 months/i); assert.match(mtn.kyc, /Ghana Card|Passport|NCA/i); assert.match(mtn.roamingSms, /China/i); assert.match(mtn.holdReason, /Ghana Card|passport|nonresident/i);
const ncell = buildCanonicalComparisonRoute(canonical, 'ncell-np-2026');
assert.equal(ncell.keep.intervalDays, 360); assert.equal(ncell.keep.observedActionCost, 500); assert.equal(ncell.keep.yearCostOriginal, 500); assert.match(ncell.keep.action, /730 days|360 days/i); assert.match(ncell.acquisitionSummary, /Tourist|passport|eSIM/i); assert.match(ncell.roamingSms, /China/i); assert.equal(ncell.holdReason, null);
const kolbi = buildCanonicalComparisonRoute(canonical, 'kolbi-cr-2026');
assert.equal(kolbi.keep.intervalDays, 90); assert.equal(kolbi.keep.yearCostOriginal, null); assert.match(kolbi.keep.action, /90 days|billable|recharge/i); assert.match(kolbi.kyc, /passport|tourist/i); assert.match(kolbi.roamingSms, /China/i); assert.equal(kolbi.holdReason, null);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C12 migration passed: MTN Ghana HOLD, Ncell Nepal ADMITTED, kölbi Costa Rica ADMITTED; 135 comparison routes and 3-route indexability preserved.');
