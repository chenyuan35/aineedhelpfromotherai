import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const routeIds = ['taiwan-mobile-prepaid-tw-2026', 'fareastone-prepaid-tw-2026'];
const canonical = {
  routes: read('data/phone/v1/routes.json'),
  markets: read('data/phone/v1/markets.json'),
  snapshots: read('data/phone/v1/snapshots.json'),
};
const sources = read('data/phone/v1/sources.json');
const networks = read('data/phone/v1/networks.json');
const brands = read('data/phone/v1/brands.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const manifest = read('frontend/tools/phone-number-lifecycle-mvp/batch-admission-manifest.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const expectations = {
  'taiwan-mobile-prepaid-tw-2026': { networkId: 'twm-tw', brandId: 'taiwan-mobile-tw', evidenceState: 'admitted' },
  'fareastone-prepaid-tw-2026': { networkId: 'fet-tw', brandId: 'fareastone-tw', evidenceState: 'admitted' },
};

for (const routeId of routeIds) {
  const expected = expectations[routeId];
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `Taiwan route missing from canonical: ${routeId}`);
  assert.equal(route.marketId, 'tw');
  assert.equal(route.networkId, expected.networkId);
  assert.equal(route.brandId, expected.brandId);
  assert.equal(route.surfaceState, 'backstage-only', `${routeId} must stay backstage-only`);
  assert.equal(route.evidenceState, expected.evidenceState);
  assert(networks.some((row) => row.id === route.networkId && row.marketId === 'tw'));
  assert(brands.some((row) => row.id === route.brandId && row.marketId === 'tw' && row.networkId === route.networkId));
  for (const id of route.sourceIds) {
    assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: missing canonical provenance for ${id}`);
  }
  const legacy = globalDirectory.routes.find((row) => row.id === routeId);
  assert(legacy, `legacy comparison row missing: ${routeId}`);
  assert.deepEqual(buildCanonicalComparisonRoute(canonical, routeId), legacy, `${routeId}: canonical adapter parity must be exact`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId} must not become detail-eligible/indexable`);
}

assert.equal(sources.find((row) => row.id === 'taiwan-mobile-tw-official')?.url, 'https://www.taiwanmobile.com/mobile/prepaid/5Gprepaid.html');
assert.equal(sources.find((row) => row.id === 'fareastone-tw-official')?.url, 'https://service.fetnet.net/prepaid/product/prepaid-card.html');
const fetLegacy = globalDirectory.routes.find((row) => row.id === 'fareastone-prepaid-tw-2026');
assert.equal(fetLegacy.publishState, 'candidate', 'FarEasTone should reflect current official six-month validity evidence');
assert.equal(fetLegacy.keep.observedActionCost, 100, 'FarEasTone minimum official communication-credit recharge is NT$100');
assert.equal(fetLegacy.keep.intervalDays, 180);

assert(manifest.admittedBatches.includes('tw-depth-batch-w.json'));
assert.equal(globalDirectory.routes.length, 135, 'must preserve 135-route comparison coverage');
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3, 'must preserve 3 indexable routes');
console.log('Phone canonical Taiwan migration passed: Taiwan Mobile + FarEasTone parity exact; 135 comparison routes and 3 indexable routes preserved.');
