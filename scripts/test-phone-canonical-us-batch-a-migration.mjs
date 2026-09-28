import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const routeIds = ['ultra-mobile-paygo-3-2026', 'tello-paygo-credit-2026', 'h2o-paygo-10-90d-2026'];
const canonical = { routes: read('data/phone/v1/routes.json'), markets: read('data/phone/v1/markets.json'), snapshots: read('data/phone/v1/snapshots.json') };
const sources = read('data/phone/v1/sources.json');
const networks = read('data/phone/v1/networks.json');
const brands = read('data/phone/v1/brands.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const manifest = read('frontend/tools/phone-number-lifecycle-mvp/batch-admission-manifest.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const expected = {
  'ultra-mobile-paygo-3-2026': { networkId: 'tmobile-us', brandId: 'ultra-mobile-us', evidenceState: 'admitted' },
  'tello-paygo-credit-2026': { networkId: null, brandId: 'tello-us', evidenceState: 'admitted' },
  'h2o-paygo-10-90d-2026': { networkId: 'att-us', brandId: 'h2o-us', evidenceState: 'hold' },
};
for (const routeId of routeIds) {
  const e = expected[routeId];
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `US batch-A route missing from canonical: ${routeId}`);
  assert.equal(route.marketId, 'us'); assert.equal(route.networkId, e.networkId); assert.equal(route.brandId, e.brandId);
  assert.equal(route.surfaceState, 'backstage-only'); assert.equal(route.evidenceState, e.evidenceState);
  if (route.networkId) assert(networks.some((row) => row.id === route.networkId && row.marketId === 'us'));
  const brand = brands.find((row) => row.id === route.brandId && row.marketId === 'us'); assert(brand, `${routeId}: missing brand`);
  if (route.networkId) assert.equal(brand.networkId, route.networkId);
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  const legacy = globalDirectory.routes.find((row) => row.id === routeId); assert(legacy, `legacy row missing: ${routeId}`);
  assert.deepEqual(buildCanonicalComparisonRoute(canonical, routeId), legacy, `${routeId}: canonical adapter parity must be exact`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId} must stay non-indexable`);
}

const monthlyTello = canonical.routes.find((row) => row.id === 'tello-us');
const paygTello = canonical.routes.find((row) => row.id === 'tello-paygo-credit-2026');
assert(monthlyTello && paygTello); assert.notEqual(monthlyTello.id, paygTello.id);
assert.equal(monthlyTello.brandId, 'tello-us'); assert.equal(paygTello.brandId, 'tello-us');
assert.equal(paygTello.networkId, null, 'PAYG route must not invent normalized T-Mobile provenance');
const ultra = globalDirectory.routes.find((row) => row.id === 'ultra-mobile-paygo-3-2026');
assert.equal(ultra.simType, 'physical SIM');
assert.equal(ultra.landedCost.landedOriginal, null); assert.equal(ultra.keep.observedActionCost, 3); assert.equal(ultra.keep.intervalDays, 30);
assert.match(ultra.acquisitionSummary, /eBay or select T-Mobile stores/); assert.match(ultra.tariffSummary, /enclosed physical SIM/);

const tello = globalDirectory.routes.find((row) => row.id === 'tello-paygo-credit-2026');
assert.equal(tello.keep.observedActionCost, 20); assert.equal(tello.keep.yearCostOriginal, 80); assert.equal(tello.keep.intervalDays, 90);
assert.match(tello.keep.action, /new PAYG order/); assert.doesNotMatch(tello.keep.action, /send one SMS|80 days/i);
assert.match(tello.chinaActivation, /physically in the United States/);
assert(tello.sourceIds.includes('community-nodeloc-tello-china-2026-09-20'));
assert(tello.sourceIds.includes('community-nodeseek-tello-risk-2026-06-19'));

const h2o = globalDirectory.routes.find((row) => row.id === 'h2o-paygo-10-90d-2026');
assert.equal(h2o.publishState, 'observation'); assert.equal(h2o.guideEligible, false);
assert.match(h2o.roamingSms, /not an eligible roaming route/); assert.match(h2o.holdReason, /exclude PAYG from International Roaming/);
assert.equal(h2o.keep.intervalDays, 90); assert.equal(h2o.keep.observedActionCost, 10);

const sourceUrl = (id) => globalDirectory.sources.find((row) => row.id === id)?.url;
assert.equal(sourceUrl('official-ultramobile-paygo-terms-2026-09-29'), 'https://www.ultramobile.com/mobile-plans-terms-conditions/');
assert.equal(sourceUrl('official-tello-terms-2026-09-29'), 'https://tello.com/terms');
assert.equal(sourceUrl('official-h2o-roaming-2026-09-29'), 'https://www.h2owireless.com/international-roaming');
assert(manifest.admittedBatches.includes('us-directory-batch-a.json'));
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical US batch-A migration passed: Tello route identity separated, current Ultra/Tello/H2O provenance reconciled, exact comparison parity preserved, and publication remains unchanged.');
