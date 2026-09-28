import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const routeId = 'cmhk-mysim-hk-2026';
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

const route = canonical.routes.find((row) => row.id === routeId);
assert(route, 'pilot route must exist in canonical routes');
assert.equal(route.marketId, 'hk');
assert.equal(route.networkId, 'cmhk-hk');
assert.equal(route.brandId, 'cmhk-hk-direct');
assert.equal(route.surfaceState, 'backstage-only', 'pilot must not alter public canonical surface state');
assert.equal(route.evidenceState, 'admitted');
assert(networks.some((row) => row.id === route.networkId && row.marketId === 'hk'));
assert(brands.some((row) => row.id === route.brandId && row.marketId === 'hk' && row.networkId === route.networkId));
for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `missing canonical provenance for ${id}`);
assert.equal(sources.find((row) => row.id === 'cmhk-mysim-hk-community')?.url, 'https://prepaid-data-sim-card.fandom.com/wiki/Hong_Kong');

const legacy = globalDirectory.routes.find((row) => row.id === routeId);
assert(legacy, 'legacy comparison row must remain present');
assert.deepEqual(buildCanonicalComparisonRoute(canonical, routeId), legacy, 'canonical adapter must reproduce the current comparison row exactly');
assert(manifest.admittedBatches.includes('hk2-depth-batch-u.json'), 'legacy manifest gate must remain in place during pilot');
assert.equal(globalDirectory.routes.length, 135, 'pilot must preserve 135-route comparison coverage');
assert.equal(policy.routeStates[routeId], undefined, 'pilot must not make the route explicitly detail-eligible/indexable');
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3, 'pilot must preserve explicit indexable route count');
console.log('Phone canonical comparison pilot passed: CMHK parity exact; 135 comparison routes and 3 indexable routes preserved.');
