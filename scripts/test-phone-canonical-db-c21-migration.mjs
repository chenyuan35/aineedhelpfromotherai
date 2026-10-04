import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(repo, p), 'utf8'));
const canonical = {
  routes: read('data/phone/v1/routes.json'),
  markets: read('data/phone/v1/markets.json'),
  snapshots: read('data/phone/v1/snapshots.json')
};
const brands = read('data/phone/v1/brands.json');
const networks = read('data/phone/v1/networks.json');
const sources = read('data/phone/v1/sources.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const expected = new Map([
  ['fortress-hahasim-hk-2026', ['hk', 'haha-sim-hk', 'three-hk', 'admitted']],
  ['csl-711-prepaid-hk-2026', ['hk', 'csl-711-hk', 'csl-hk', 'hold']],
  ['tunetalk-365-my-2026', ['my', 'tunetalk-my', 'celcomdigi-my', 'hold']]
]);
for (const [id, [marketId, brandId, networkId, evidenceState]] of expected) {
  const route = canonical.routes.find((row) => row.id === id);
  assert(route, `missing DB-C21 route ${id}`);
  assert.equal(route.marketId, marketId);
  assert.equal(route.brandId, brandId);
  assert.equal(route.networkId, networkId);
  assert.equal(route.evidenceState, evidenceState);
  assert.equal(route.surfaceState, 'backstage-only');
  assert(route.sourceIds.length >= 2, `${id} should retain multi-source provenance`);
  assert.equal(policy.routeStates[id], undefined, `${id} must not receive a public publication state`);
}

const haha = buildCanonicalComparisonRoute(canonical, 'fortress-hahasim-hk-2026');
assert.equal(haha.keep.intervalDays, 365);
assert.equal(haha.keep.observedActionCost, 10);
assert.equal(haha.keep.yearCostOriginal, 10);
assert.equal(haha.holdReason, null);
assert.match(haha.simType, /physical/i);
assert.match(haha.kyc, /travel-document|real-name/i);
assert.match(haha.roamingSms, /recycled|OTP|mainland/i);

const csl = buildCanonicalComparisonRoute(canonical, 'csl-711-prepaid-hk-2026');
assert.equal(csl.landedCost.providerOrCommunityPrice, 58);
assert.equal(csl.keep.intervalDays, null);
assert.equal(csl.keep.observedActionCost, null);
assert.match(csl.keep.state, /conflict/i);
assert.match(csl.holdReason, /180|365|promotion|conflict/i);

const tune = buildCanonicalComparisonRoute(canonical, 'tunetalk-365-my-2026');
assert.equal(tune.keep.intervalDays, 365);
assert.equal(tune.keep.observedActionCost, 35);
assert.equal(tune.keep.yearCostOriginal, 35);
assert.match(tune.holdReason, /tourist|three months|3 months/i);
assert.match(tune.kyc, /mandatory|tourist|three-month/i);

assert.equal(canonical.routes.length, 157);
assert.equal(canonical.markets.length, 86);
assert.equal(brands.length, 154);
assert.equal(networks.length, 116);
assert.equal(sources.length, 599);
const canonicalIds = new Set(canonical.routes.map((row) => row.id));
const legacyOnly = globalDirectory.routes.map((row) => row.id).filter((id) => !canonicalIds.has(id));
assert.deepEqual(legacyOnly, ['sakura-mobile-voice-2026']);
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C21 migration passed: haha SIM ADMIT, csl 7-Eleven HOLD, Tune Talk 365 HOLD; 135 comparison routes and 3-route indexability preserved.');
