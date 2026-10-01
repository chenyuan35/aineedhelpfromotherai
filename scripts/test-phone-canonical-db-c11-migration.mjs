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
  'telenor-kontant-no-2026': ['no', 'telenor-kontant-no', 'telenor-no', 'hold'],
  'go-payasyougo-mt-2026': ['mt', 'go-payasyougo', 'go-mt', 'admitted'],
  'maroc-telecom-prepaid-2026': ['ma', 'maroc-prepaid', 'maroc-telecom', 'hold'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C11 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(canonical.markets.some((row) => row.id === marketId));
  assert(brands.some((row) => row.id === brandId && row.marketId === marketId));
  assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https?:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const telenor = buildCanonicalComparisonRoute(canonical, 'telenor-kontant-no-2026');
assert.equal(telenor.keep.intervalDays, 365); assert.equal(telenor.keep.yearCostOriginal, null); assert.match(telenor.keep.action, /12 months|two additional months/i); assert.match(telenor.kyc, /BankID|nonresident/i); assert.match(telenor.payment, /Norway|Denmark|Sweden|Finland|Nordic/i); assert.match(telenor.holdReason, /BankID|nonresident|Nordic/i);
const go = buildCanonicalComparisonRoute(canonical, 'go-payasyougo-mt-2026');
assert.equal(go.keep.intervalDays, 90); assert.equal(go.keep.observedActionCost, 0.1); assert.equal(go.keep.yearCostOriginal, null); assert.match(go.keep.state, /90-day.*275-day/i); assert.match(go.acquisitionSummary, /visitor|before landing|before arrival/i); assert.match(go.roamingSms, /China|Zone 4/i); assert.equal(go.holdReason, null);
const maroc = buildCanonicalComparisonRoute(canonical, 'maroc-telecom-prepaid-2026');
assert.equal(maroc.keep.intervalDays, 365); assert.equal(maroc.keep.yearCostOriginal, null); assert.match(maroc.keep.action, /12-month|each recharge/i); assert.match(maroc.kyc, /identity document|passport|foreign/i); assert.match(maroc.roamingSms, /optional|activated on request/i); assert.match(maroc.holdReason, /foreign|visitor|QR|activation/i);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C11 migration passed: Telenor Norway HOLD, GO Malta ADMITTED, Maroc Telecom HOLD; 135 comparison routes and 3-route indexability preserved.');
