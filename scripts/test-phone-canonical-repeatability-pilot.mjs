import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const routeIds = ['kpn-prepaid-6mo-2026', 'telstra-prepaid-longexpiry-2026'];
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
  'kpn-prepaid-6mo-2026': {
    marketId: 'nl', networkId: 'kpn-nl', brandId: 'kpn-prepaid', evidenceState: 'admitted',
  },
  'telstra-prepaid-longexpiry-2026': {
    marketId: 'au', networkId: 'telstra-au', brandId: 'telstra-prepaid', evidenceState: 'hold',
  },
};

for (const routeId of routeIds) {
  const expected = expectations[routeId];
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `repeatability route missing from canonical: ${routeId}`);
  assert.equal(route.marketId, expected.marketId);
  assert.equal(route.networkId, expected.networkId);
  assert.equal(route.brandId, expected.brandId);
  assert.equal(route.surfaceState, 'backstage-only', `${routeId} must stay backstage-only`);
  assert.equal(route.evidenceState, expected.evidenceState);
  assert(networks.some((row) => row.id === route.networkId && row.marketId === route.marketId));
  assert(brands.some((row) => row.id === route.brandId && row.marketId === route.marketId && row.networkId === route.networkId));
  for (const id of route.sourceIds) {
    assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: missing canonical provenance for ${id}`);
  }
  const legacy = globalDirectory.routes.find((row) => row.id === routeId);
  assert(legacy, `legacy comparison row missing: ${routeId}`);
  if (routeId === 'telstra-prepaid-longexpiry-2026') {
    // Preserve the historical admission parity against the immutable intake,
    // while allowing a reviewed current-price correction in canonical data.
    const historicalPacket = read('data/phone/review-packets/telstra-prepaid-longexpiry-2026.json');
    assert.deepEqual(
      buildCanonicalComparisonRoute(
        { routes: [historicalPacket.route], markets: [historicalPacket.market], snapshots: historicalPacket.snapshots },
        routeId,
      ),
      legacy,
      'Telstra historical intake must still reproduce the frozen legacy comparison row',
    );
    const revised = buildCanonicalComparisonRoute(canonical, routeId);
    assert.equal(revised.keep.yearCostOriginal, 74, 'Telstra Casual annual keep must use the revised current rate');
    assert.equal(revised.guideEligible, false);
  } else {
    assert.deepEqual(
      buildCanonicalComparisonRoute(canonical, routeId),
      legacy,
      `${routeId}: canonical adapter must reproduce legacy comparison row exactly`,
    );
  }
  assert.equal(policy.routeStates[routeId], undefined, `${routeId} must not become detail-eligible/indexable`);
}

assert.equal(
  sources.find((row) => row.id === 'official-staff-kpn-community-6mo-rule-2026-02')?.url,
  'https://community.kpn.com/prepaid-16/kpn-prepaid-geldig-tot-19-08-26-terwijl-dit-volgens-de-informatie-onbeperkt-houdbaar-is-645988',
  'KPN provenance must point to the actual 2026 community evidence',
);
assert(manifest.admittedBatches.includes('nl-au-directory-batch-g.json'));
assert.equal(globalDirectory.routes.length, 135, 'must preserve 135-route comparison coverage');
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3, 'must preserve 3 indexable routes');
console.log('Phone canonical repeatability passed: KPN current parity exact, Telstra historical parity intact and reviewed current correction accepted; 135 comparison routes and 3 indexable routes preserved.');
