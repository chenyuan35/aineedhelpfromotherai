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
  'telenor-kontantkort-se-2026': ['se', 'telenor-kontant-se', 'telenor-se', 'hold'],
  'telia-dk-prepaid-2026': ['dk', 'telia-dk-prepaid', 'norlys-mobile-dk', 'hold'],
  'telemach-prepaid-si-2026': ['si', 'telemach-free2go', 'telemach-si', 'admitted'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C13 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(canonical.markets.some((row) => row.id === marketId));
  assert(brands.some((row) => row.id === brandId && row.marketId === marketId));
  assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https?:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const telenor = buildCanonicalComparisonRoute(canonical, 'telenor-kontantkort-se-2026');
assert.equal(telenor.keep.intervalDays, null); assert.equal(telenor.keep.yearCostOriginal, null); assert.match(telenor.keep.action, /old SEK 50|not established/i); assert.match(telenor.kyc, /registered|foreign/i); assert.match(telenor.roamingSms, /Taiwan|country-dependent/i); assert.match(telenor.holdReason, /economics|registration/i);
const telia = buildCanonicalComparisonRoute(canonical, 'telia-dk-prepaid-2026');
assert.equal(telia.keep.intervalDays, null); assert.equal(telia.keep.yearCostOriginal, null); assert.match(telia.acquisitionSummary, /Norlys|legacy/i); assert.match(telia.kyc, /MitID|legacy/i); assert.match(telia.holdReason, /Norlys|identity|lifecycle/i);
const telemach = buildCanonicalComparisonRoute(canonical, 'telemach-prepaid-si-2026');
assert.equal(telemach.keep.intervalDays, 90); assert.equal(telemach.keep.observedActionCost, 5); assert.equal(telemach.keep.yearCostOriginal, 20); assert.match(telemach.keep.action, /270 days|90 days/i); assert.match(telemach.kyc, /stable ties|RLAH/i); assert.match(telemach.payment, /5\/10\/20|USSD/i); assert.equal(telemach.holdReason, null);
assert.equal(canonical.routes.length, 128); assert.equal(canonical.markets.length, 76); assert.equal(brands.length, 125); assert.equal(networks.length, 101); assert.equal(sources.length, 461);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C13 migration passed: Telenor Sweden HOLD, Telia Denmark legacy HOLD, Telemach Slovenia ADMITTED; 128 canonical routes, 135 comparison routes and 3-route indexability preserved.');
