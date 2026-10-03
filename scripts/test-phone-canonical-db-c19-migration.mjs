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
  'digicel-jm-2026': ['jm', 'digicel-jm-prepaid', 'digicel-jm', 'hold'],
  'tigo-tz-2026': ['tz', 'yas-tz-prepaid', 'yas-tz', 'hold'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C19 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(canonical.markets.some((row) => row.id === marketId)); assert(brands.some((row) => row.id === brandId && row.marketId === marketId)); assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https?:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const digicel = buildCanonicalComparisonRoute(canonical, 'digicel-jm-2026');
assert.equal(digicel.landedCost.providerOrCommunityPrice, 750); assert.equal(digicel.keep.intervalDays, 120); assert.equal(digicel.keep.yearCostOriginal, null); assert.match(digicel.holdReason, /four-month|qualifying activity|OTP/i); assert.match(digicel.roamingSms, /China|Global/i);
const yas = buildCanonicalComparisonRoute(canonical, 'tigo-tz-2026');
assert.equal(yas.brandId, 'yas-tz-prepaid'); assert.equal(yas.keep.intervalDays, 90); assert.equal(yas.keep.yearCostOriginal, null); assert.match(yas.holdReason, /90 days|four months|visitor/i); assert.match(yas.roamingSms, /China Unicom|China Telecommunications/i);
assert.equal(canonical.routes.length, 156); assert.equal(canonical.markets.length, 86); assert.equal(brands.length, 153); assert.equal(networks.length, 116); assert.equal(sources.length, 593);
const canonicalIds = new Set(canonical.routes.map((row) => row.id));
const legacyOnly = globalDirectory.routes.map((row) => row.id).filter((id) => !canonicalIds.has(id));
assert.deepEqual(legacyOnly, ['sakura-mobile-voice-2026']);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C19 migration passed: Digicel Jamaica HOLD, Yas Tanzania HOLD; all non-alias comparison IDs normalized and 3-route indexability preserved.');
