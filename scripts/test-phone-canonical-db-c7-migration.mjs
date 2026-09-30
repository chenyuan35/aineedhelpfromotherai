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
  'ifmobile-jp-2026': ['jp', 'ifmobile-jp', null, 'hold'],
  'rakuten-mobile-jp-2026': ['jp', 'rakuten-mobile-jp', 'rakuten-mobile-jp', 'hold'],
  'linemo-jp-2026': ['jp', 'linemo-jp', 'softbank-jp', 'hold'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C7 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(brands.some((row) => row.id === brandId && row.marketId === marketId));
  if (networkId) assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const ifm = buildCanonicalComparisonRoute(canonical, 'ifmobile-jp-2026');
assert.equal(ifm.keep.observedActionCost, 1408); assert.equal(ifm.keep.intervalDays, 30); assert.match(ifm.holdReason, /2026-03-31|passport-only/i); assert.match(ifm.kyc, /IC-chip|JPKI/i);
const rakuten = buildCanonicalComparisonRoute(canonical, 'rakuten-mobile-jp-2026');
assert.equal(rakuten.keep.observedActionCost, 1078); assert.match(rakuten.kyc, /residence card/i); assert.match(rakuten.chinaActivation, /Rakuten Link.*Japan/i);
const linemo = buildCanonicalComparisonRoute(canonical, 'linemo-jp-2026');
assert.equal(linemo.keep.observedActionCost, 990); assert.equal(linemo.landedCost.landedOriginal, 3850); assert.match(linemo.kyc, /residence card/i); assert.match(linemo.roamingSms, /fifth billing month/i);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C7 migration passed: IF Mobile, Rakuten Mobile and LINEMO normalized as HOLD; 135 comparison routes and 3-route indexability preserved.');
