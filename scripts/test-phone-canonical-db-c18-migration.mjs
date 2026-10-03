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
  'zain-kw-eezee-2026': ['kw', 'zain-eezee', 'zain-kw', 'admitted'],
  'omantel-om-2026': ['om', 'omantel-prepaid', 'omantel-om', 'admitted'],
  'btc-bs-2026': ['bs', 'btc-prepaid', 'btc-bs', 'hold'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C18 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(canonical.markets.some((row) => row.id === marketId)); assert(brands.some((row) => row.id === brandId && row.marketId === marketId)); assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https?:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const zain = buildCanonicalComparisonRoute(canonical, 'zain-kw-eezee-2026');
assert.equal(zain.landedCost.providerOrCommunityPrice, 5); assert.equal(zain.keep.intervalDays, 365); assert.equal(zain.keep.observedActionCost, 13); assert.equal(zain.keep.yearCostOriginal, 13); assert.match(zain.roamingSms, /default|prepaid|roaming/i); assert.equal(zain.holdReason, null);
const omantel = buildCanonicalComparisonRoute(canonical, 'omantel-om-2026');
assert.equal(omantel.keep.intervalDays, 90); assert.equal(omantel.keep.observedActionCost, 7); assert.equal(omantel.keep.yearCostOriginal, 28); assert.match(omantel.kyc, /passport|residence/i); assert.match(omantel.roamingSms, /free of charge|incoming SMS/i); assert.equal(omantel.holdReason, null);
const btc = buildCanonicalComparisonRoute(canonical, 'btc-bs-2026');
assert.equal(btc.keep.intervalDays, null); assert.match(btc.holdReason, /lifecycle|keep-alive|foreigner/i); assert.match(btc.acquisitionSummary, /prepaid|April 2025/i);
assert.equal(canonical.routes.length, 143); assert.equal(canonical.markets.length, 84); assert.equal(brands.length, 140); assert.equal(networks.length, 110); assert.equal(sources.length, 537);
const canonicalIds = new Set(canonical.routes.map((row) => row.id));
const legacyOnly = globalDirectory.routes.map((row) => row.id).filter((id) => !canonicalIds.has(id));
assert.deepEqual(legacyOnly, ['sakura-mobile-voice-2026','digicel-jm-2026','tigo-tz-2026']);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C18 migration passed: Zain Kuwait + Omantel ADMITTED, BTC Bahamas HOLD; 143 canonical routes, 132 comparison overlaps, 3 legacy-only and 3-route indexability preserved.');
