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
  'movistar-pre-pe-2026': ['pe', 'movistar-pre-pe', 'movistar-pe', 'hold'],
  'talkmobile-uk-payg-closed-2026': ['gb', 'talkmobile-uk', 'vodafone-uk', 'hold'],
  'smarty-uk-2026': ['gb', 'smarty-uk', 'three-uk', 'admitted'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C15 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(canonical.markets.some((row) => row.id === marketId)); assert(brands.some((row) => row.id === brandId && row.marketId === marketId)); assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https?:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const movistar = buildCanonicalComparisonRoute(canonical, 'movistar-pre-pe-2026');
assert.equal(movistar.keep.intervalDays, 210); assert.equal(movistar.keep.observedActionCost, 5); assert.equal(movistar.keep.yearCostOriginal, 10); assert.match(movistar.kyc, /foreign|biometric|Migraciones/i); assert.match(movistar.roamingSms, /not established|not inferred|unresolved/i); assert.match(movistar.holdReason, /roaming|China|OTP/i);
const talk = buildCanonicalComparisonRoute(canonical, 'talkmobile-uk-payg-closed-2026');
assert.equal(talk.keep.intervalDays, null); assert.equal(talk.keep.observedActionCost, null); assert.equal(talk.keep.state, 'discontinued'); assert.equal(talk.avoidRoute, true); assert.match(talk.holdReason, /discontinued|2017/i); assert.match(talk.acquisitionSummary, /DISCONTINUED|31 August 2017/i);
const smarty = buildCanonicalComparisonRoute(canonical, 'smarty-uk-2026');
assert.equal(smarty.keep.intervalDays, 220); assert.equal(smarty.keep.observedActionCost, 6); assert.equal(smarty.keep.yearCostOriginal, null); assert.equal(smarty.landedCost.landedOriginal, 6); assert.match(smarty.simType, /eSIM/i); assert.match(smarty.payment, /PayPal|Apple|Google/i); assert.match(smarty.roamingSms, /China|FREE/i); assert.equal(smarty.holdReason, null);
assert.equal(canonical.routes.length, 140); assert.equal(canonical.markets.length, 81); assert.equal(brands.length, 137); assert.equal(networks.length, 107); assert.equal(sources.length, 525);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C15 migration passed: Movistar Peru HOLD, Talkmobile PAYG HOLD/discontinued, SMARTY UK ADMITTED; 140 canonical routes, 135 comparison routes and 3-route indexability preserved.');
