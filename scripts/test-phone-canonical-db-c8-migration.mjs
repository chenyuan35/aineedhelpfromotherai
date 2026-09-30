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
  'ahamo-jp-2026': ['jp', 'ahamo-jp', 'docomo-jp', 'hold'],
  'iijmio-jp-2026': ['jp', 'iijmio-jp', 'docomo-jp', 'hold'],
  'kt-prepaid-kr-2026': ['kr', 'kt-prepaid-kr', 'kt-kr', 'hold'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C8 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(brands.some((row) => row.id === brandId && row.marketId === marketId));
  assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const ahamo = buildCanonicalComparisonRoute(canonical, 'ahamo-jp-2026');
assert.equal(ahamo.keep.observedActionCost, 2970); assert.match(ahamo.holdReason, /resident|2026-12-01/i); assert.match(ahamo.roamingSms, /200/i);
const iij = buildCanonicalComparisonRoute(canonical, 'iijmio-jp-2026');
assert.equal(iij.keep.observedActionCost, 850); assert.match(iij.payment, /credit card only/i); assert.match(iij.roamingSms, /voice and SMS/i);
const kt = buildCanonicalComparisonRoute(canonical, 'kt-prepaid-kr-2026');
assert.equal(kt.keep.observedActionCost, 50000); assert.equal(kt.keep.intervalDays, 365); assert.match(kt.roamingSms, /roaming is not provided/i);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C8 migration passed: ahamo, IIJmio and KT Prepaid normalized as HOLD; 135 comparison routes and 3-route indexability preserved.');
