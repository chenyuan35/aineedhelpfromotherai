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
const expected = {'elisa-prepaid-fi-2026':['fi','elisa-prepaid','elisa-fi','admitted'],'cyta-soeasy-cy-2026':['cy','cyta-soeasy','cyta-cy','admitted'],'hotmobile-il-2026':['il','hotmobile-prepaid','hotmobile-il','hold']};
for (const [routeId,[marketId,brandId,networkId,evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C4D route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(brands.some((row)=>row.id===brandId&&row.marketId===marketId)); assert(networks.some((row)=>row.id===networkId&&row.marketId===marketId));
  for (const id of route.sourceIds) assert(sources.some((row)=>row.id===id&&/^https:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const elisa=buildCanonicalComparisonRoute(canonical,'elisa-prepaid-fi-2026'); assert.equal(elisa.keep.yearCostOriginal,10); assert.equal(elisa.keep.intervalDays,365); assert.equal(elisa.holdReason,null); assert.match(elisa.chinaActivation,/activated in Finland/i);
const cyta=buildCanonicalComparisonRoute(canonical,'cyta-soeasy-cy-2026'); assert.equal(cyta.keep.yearCostOriginal,5); assert.equal(cyta.keep.intervalDays,365); assert.equal(cyta.holdReason,null); assert.match(cyta.kyc,/mandatory/i);
const hot=buildCanonicalComparisonRoute(canonical,'hotmobile-il-2026'); assert.equal(hot.keep.yearCostOriginal,null); assert.equal(hot.keep.intervalDays,180); assert.match(hot.holdReason,/number-deactivation\/recycling rule/i); assert.match(hot.kyc,/withdrawn/i);
assert.equal(globalDirectory.routes.length,135); assert.equal(Object.values(policy.routeStates).filter((state)=>state==='indexable').length,3);
console.log('Phone canonical DB-C4D migration passed: Elisa FI + Cyta soeasy admitted, HOT Mobile HOLD; 135 comparison routes and 3-route indexability preserved.');
