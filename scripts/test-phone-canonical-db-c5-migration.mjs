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
const expected = {'one-me-2026':['me','one-me-tourist','one-me','hold'],'bhtelecom-ba-2026':['ba','bhtelecom-prepaid','bhtelecom-ba','admitted'],'yettel-prepaid-bg-2026':['bg','yettel-prepaid','yettel-bg','hold']};
for (const [routeId,[marketId,brandId,networkId,evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C5 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(brands.some((row)=>row.id===brandId&&row.marketId===marketId)); assert(networks.some((row)=>row.id===networkId&&row.marketId===marketId));
  for (const id of route.sourceIds) assert(sources.some((row)=>row.id===id&&/^https:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const one=buildCanonicalComparisonRoute(canonical,'one-me-2026'); assert.equal(one.keep.intervalDays,90); assert.match(one.holdReason,/roaming outside Montenegro/i);
const bh=buildCanonicalComparisonRoute(canonical,'bhtelecom-ba-2026'); assert.equal(bh.keep.yearCostOriginal,40); assert.equal(bh.keep.intervalDays,180); assert.equal(bh.holdReason,null);
const yettel=buildCanonicalComparisonRoute(canonical,'yettel-prepaid-bg-2026'); assert.equal(yettel.keep.yearCostOriginal,4.09); assert.equal(yettel.keep.intervalDays,365); assert.match(yettel.holdReason,/foreign passport/i);
assert.equal(globalDirectory.routes.length,135); assert.equal(Object.values(policy.routeStates).filter((state)=>state==='indexable').length,3);
console.log('Phone canonical DB-C5 migration passed: BH Telecom admitted; One ME + Yettel BG HOLD; 135 comparison routes and 3-route indexability preserved.');
