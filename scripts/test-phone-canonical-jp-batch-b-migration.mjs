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
  'povo20-zero-base-2026': { brandId: 'povo-jp', networkId: 'au-jp', evidenceState: 'hold' },
  'mobal-japan-voice-2026': { brandId: 'mobal-japan-jp', networkId: null, evidenceState: 'admitted' },
};
for (const [routeId, e] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `Japan batch-B canonical route missing: ${routeId}`);
  assert.equal(route.marketId, 'jp');
  assert.equal(route.brandId, e.brandId);
  assert.equal(route.networkId, e.networkId);
  assert.equal(route.surfaceState, 'backstage-only');
  assert.equal(route.evidenceState, e.evidenceState);
  const brand = brands.find((row) => row.id === e.brandId && row.marketId === 'jp');
  assert(brand, `${routeId}: normalized brand missing`);
  if (e.networkId) assert(networks.some((row) => row.id === e.networkId && row.marketId === 'jp'));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  const legacy = globalDirectory.routes.find((row) => row.id === routeId);
  assert(legacy, `Japan batch-B comparison row missing: ${routeId}`);
  assert.deepEqual(buildCanonicalComparisonRoute(canonical, routeId), legacy, `${routeId}: canonical adapter parity must be exact`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId} must stay non-indexable`);
}

const povo = globalDirectory.routes.find((row) => row.id === 'povo20-zero-base-2026');
assert.equal(povo.publishState, 'observation');
assert.equal(povo.keep.observedActionCost, null);
assert.equal(povo.keep.intervalDays, 180);
assert.match(povo.keep.action, /qualifying paid topping/i);
assert.match(povo.kyc, /residence card/i);
assert.match(povo.roamingSms, /supports SMS/i);

const mobal = globalDirectory.routes.find((row) => row.id === 'mobal-japan-voice-2026');
assert.equal(mobal.brandId, 'mobal-japan-jp');
assert.equal(mobal.landedCost.providerOrCommunityPrice, 4950);
assert.equal(mobal.keep.observedActionCost, 1430);
assert.match(mobal.roamingSms, /Voice\/SMS roaming/i);
assert.notEqual(canonical.routes.find((row) => row.id === 'mobal-japan-voice-data')?.id, mobal.id);

const sakuraLegacy = globalDirectory.routes.find((row) => row.id === 'sakura-mobile-voice-2026');
const sakuraCanonical = canonical.routes.find((row) => row.id === 'sakura-japan-voice-data');
assert(sakuraLegacy && sakuraCanonical, 'Sakura legacy comparison and canonical product must both remain addressable');
assert.equal(sakuraLegacy.brandId, 'sakura-mobile-jp');
assert.equal(sakuraCanonical.brandId, 'sakura-mobile-jp');
assert.equal(sakuraLegacy.keep.observedActionCost, 3278);
assert.equal(sakuraLegacy.landedCost.landedOriginal, 8778);
assert.match(sakuraLegacy.roamingSms, /calls and SMS can be used outside Japan/i);
assert.equal(canonical.routes.some((row) => row.id === 'sakura-mobile-voice-2026'), false, 'same Sakura product must not be duplicated in canonical');

assert(manifest.admittedBatches.includes('jp-directory-batch-b.json'));
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical Japan batch-B migration passed: povo/Mobal migrated with exact comparison parity, Sakura stayed single-product canonical, and publication remained unchanged.');
