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
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const expected = {
  'cosmote-frog-13mo-2026': ['gr', 'cosmote-frog', 'cosmote-gr', 'admitted'],
  'optus-flex-plus-au-2026': ['au', 'optus-au-direct', 'optus-au', 'hold'],
  'lebara-fr-2026': ['fr', 'lebara-fr', 'sfr-fr', 'hold'],
};

for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `DB-C4A canonical route missing: ${routeId}`);
  assert.equal(route.marketId, marketId);
  assert.equal(route.brandId, brandId);
  assert.equal(route.networkId, networkId);
  assert.equal(route.surfaceState, 'backstage-only');
  assert.equal(route.evidenceState, evidenceState);
  assert(brands.some((row) => row.id === brandId && row.marketId === marketId), `${routeId}: brand missing`);
  assert(networks.some((row) => row.id === networkId && row.marketId === marketId), `${routeId}: network missing`);
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: source missing ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}

const frog = buildCanonicalComparisonRoute(canonical, 'cosmote-frog-13mo-2026');
assert.equal(frog.keep.observedActionCost, 13);
assert.equal(frog.keep.intervalDays, 365);
assert.match(frog.keep.action, /13-month/i);
assert.equal(frog.holdReason, null);

const optus = buildCanonicalComparisonRoute(canonical, 'optus-flex-plus-au-2026');
assert.equal(optus.keep.observedActionCost, 350);
assert.equal(optus.keep.intervalDays, 365);
assert.match(optus.keep.state, /2026-09-30/);
assert.match(optus.kyc, /valid form of ID/i);
assert.match(optus.holdReason, /2026-09-30/i);

const lebara = buildCanonicalComparisonRoute(canonical, 'lebara-fr-2026');
assert.equal(lebara.keep.observedActionCost, null);
assert.equal(lebara.keep.intervalDays, 90);
assert.match(lebara.keep.action, /90 consecutive days without use/i);
assert.match(lebara.holdReason, /90 days without service use/i);

assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C4A migration passed: 1 admitted + 2 HOLD routes added backstage; legacy public comparison and 3-route indexability preserved.');
