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
const expected = {'us-mobile-light-2026':['us','us-mobile-us','multi-us','hold'],'lycamobile-us-2026':['us','lycamobile-us','att-us','hold'],'orange-sn-sama-numero-2026':['sn','orange-sn-prepaid','orange-sn','admitted']};
for (const [routeId,[marketId,brandId,networkId,evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C4C route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(brands.some((row)=>row.id===brandId&&row.marketId===marketId)); assert(networks.some((row)=>row.id===networkId&&row.marketId===marketId));
  for (const id of route.sourceIds) assert(sources.some((row)=>row.id===id&&/^https:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const usm=buildCanonicalComparisonRoute(canonical,'us-mobile-light-2026'); assert.equal(usm.keep.yearCostOriginal,96); assert.equal(usm.keep.intervalDays,365); assert.match(usm.holdReason,/domestic U\.S\. usage/i);
const lyca=buildCanonicalComparisonRoute(canonical,'lycamobile-us-2026'); assert.equal(lyca.keep.intervalDays,60); assert.equal(lyca.keep.yearCostOriginal,null); assert.match(lyca.holdReason,/lowest-cost keep-alive/i);
const orange=buildCanonicalComparisonRoute(canonical,'orange-sn-sama-numero-2026'); assert.equal(orange.keep.yearCostOriginal,5000); assert.equal(orange.keep.intervalDays,365); assert.equal(orange.holdReason,null); assert.match(orange.keep.action,/10,000\/24 months/i);
assert.equal(globalDirectory.routes.length,135); assert.equal(Object.values(policy.routeStates).filter((state)=>state==='indexable').length,3);
console.log('Phone canonical DB-C4C migration passed: US Mobile HOLD + Lyca US HOLD + Orange SN admitted; 135 comparison routes and 3-route indexability preserved.');
