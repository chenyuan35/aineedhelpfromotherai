import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const canonical = {
  routes: read('data/phone/v1/routes.json'),
  markets: read('data/phone/v1/markets.json'),
  snapshots: read('data/phone/v1/snapshots.json'),
};
const sources = read('data/phone/v1/sources.json');
const brands = read('data/phone/v1/brands.json');
const networks = read('data/phone/v1/networks.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const manifest = read('frontend/tools/phone-number-lifecycle-mvp/batch-admission-manifest.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const expected = {
  'skinny-prepay-12mo-2026': { marketId: 'nz', brandId: 'skinny-nz', networkId: 'spark-nz' },
  '2degrees-prepay-2026': { marketId: 'nz', brandId: '2degrees-nz', networkId: '2degrees-nz' },
  'ais-sim2fly-365d-2026': { marketId: 'th', brandId: 'ais-sim2fly', networkId: 'ais-th' },
};
for (const [routeId, e] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `NZ/Thailand batch-D canonical route missing: ${routeId}`);
  assert.equal(route.marketId, e.marketId);
  assert.equal(route.brandId, e.brandId);
  assert.equal(route.networkId, e.networkId);
  assert.equal(route.surfaceState, 'backstage-only');
  assert.equal(route.evidenceState, 'hold');
  assert(brands.some((row) => row.id === e.brandId && row.marketId === e.marketId));
  assert(networks.some((row) => row.id === e.networkId && row.marketId === e.marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  const legacy = globalDirectory.routes.find((row) => row.id === routeId);
  assert(legacy, `NZ/Thailand batch-D comparison row missing: ${routeId}`);
  assert.deepEqual(buildCanonicalComparisonRoute(canonical, routeId), legacy, `${routeId}: canonical adapter parity must be exact`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId} must stay non-indexable`);
}

const skinny = globalDirectory.routes.find((row) => row.id === 'skinny-prepay-12mo-2026');
assert.equal(skinny.keep.observedActionCost, 5);
assert.equal(skinny.keep.intervalDays, 365);
assert.equal(skinny.landedCost.providerOrCommunityPrice, 0);
assert.match(skinny.chinaActivation, /must be activated on New Zealand networks/i);
assert.match(skinny.roamingSms, /sending and receiving text messages/i);
assert.equal(skinny.guideEligible, false);

const twoDegrees = globalDirectory.routes.find((row) => row.id === '2degrees-prepay-2026');
assert.equal(twoDegrees.keep.observedActionCost, 10);
assert.equal(twoDegrees.keep.intervalDays, 365);
assert.equal(twoDegrees.landedCost.providerOrCommunityPrice, 8);
assert.match(twoDegrees.holdReason, /overseas-first activation/i);
assert.equal(twoDegrees.guideEligible, false);

const ais = globalDirectory.routes.find((row) => row.id === 'ais-sim2fly-365d-2026');
assert.equal(ais.landedCost.providerOrCommunityPrice, 2699);
assert.equal(ais.keep.observedActionCost, null);
assert.equal(ais.keep.intervalDays, null);
assert.match(ais.kyc, /passport/i);
assert.match(ais.chinaActivation, /China/i);
assert.match(ais.roamingSms, /more than 60 days of continuous roaming/i);
assert.equal(ais.guideEligible, false);

assert(manifest.admittedBatches.includes('nz-th-directory-batch-d.json'));
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical NZ/Thailand batch-D migration passed: all three HOLD routes have exact comparison parity and publication remains unchanged.');
