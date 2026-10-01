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
  'starhub-prepaid-sg-2026': ['sg', 'starhub-sg', 'starhub-sg', 'hold'],
  'jazz-pk-2026': ['pk', 'jazz-prepaid', 'jazz-pk', 'hold'],
  'vodafone-eg-2026': ['eg', 'vodafone-eg-prepaid', 'vodafone-eg', 'hold'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C10 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(brands.some((row) => row.id === brandId && row.marketId === marketId));
  assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https?:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const starhub = buildCanonicalComparisonRoute(canonical, 'starhub-prepaid-sg-2026');
assert.equal(starhub.landedCost.providerOrCommunityPrice, 12); assert.equal(starhub.keep.intervalDays, 120); assert.equal(starhub.keep.yearCostOriginal, null); assert.match(starhub.kyc, /passport.*30 days|30 days.*passport/i); assert.match(starhub.payment, /Visa|Mastercard|UnionPay/i); assert.match(starhub.holdReason, /passport|Singapore-issued|nonresident/i);
const jazz = buildCanonicalComparisonRoute(canonical, 'jazz-pk-2026');
assert.equal(jazz.landedCost.providerOrCommunityPrice, 350); assert.equal(jazz.keep.state, 'insufficient-current-lifecycle-evidence'); assert.match(jazz.kyc, /passport.*visa.*fingerprint|fingerprint.*passport/i); assert.match(jazz.roamingSms, /incoming SMS.*free|China/i); assert.match(jazz.holdReason, /deactivation|lifecycle|keep-alive/i);
const vodafone = buildCanonicalComparisonRoute(canonical, 'vodafone-eg-2026');
assert.equal(vodafone.keep.state, 'insufficient-current-prepaid-lifecycle-evidence'); assert.match(vodafone.kyc, /passport.*residency|e-visa/i); assert.match(vodafone.roamingSms, /free from day one/i); assert.match(vodafone.holdReason, /Park Your Line.*postpaid|postpaid-only/i); assert.equal(vodafone.keep.yearCostOriginal, null);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C10 migration passed: StarHub, Jazz and Vodafone Egypt normalized as HOLD with current lifecycle/product boundaries; 135 comparison routes and 3-route indexability preserved.');
