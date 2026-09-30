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
const expected = {'stc-sawa-sa-2026':['sa','stc-sawa','stc-sa','hold'],'claro-pre-ar-2026':['ar','claro-pre-ar','claro-ar','admitted'],'skt-prepaid-kr-2026':['kr','skt-prepaid-kr','skt-kr','hold']};
for (const [routeId,[marketId,brandId,networkId,evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C6 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(brands.some((row)=>row.id===brandId&&row.marketId===marketId)); assert(networks.some((row)=>row.id===networkId&&row.marketId===marketId));
  for (const id of route.sourceIds) assert(sources.some((row)=>row.id===id&&/^https:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const stc=buildCanonicalComparisonRoute(canonical,'stc-sawa-sa-2026'); assert.equal(stc.keep.state,'provider-conflict'); assert.match(stc.holdReason,/180 vs 360|final departure/i);
const claro=buildCanonicalComparisonRoute(canonical,'claro-pre-ar-2026'); assert.equal(claro.keep.intervalDays,180); assert.equal(claro.keep.observedActionCost,2000); assert.match(claro.tariffSummary,/60-day active grace/i);
const skt=buildCanonicalComparisonRoute(canonical,'skt-prepaid-kr-2026'); assert.equal(skt.keep.intervalDays,120); assert.equal(skt.keep.observedActionCost,5000); assert.match(skt.roamingSms,/roaming-unavailable/i);
assert.equal(globalDirectory.routes.length,135); assert.equal(Object.values(policy.routeStates).filter((state)=>state==='indexable').length,3);
console.log('Phone canonical DB-C6 migration passed: Claro AR admitted; STC Sawa + SKT PPS HOLD; 135 comparison routes and 3-route indexability preserved.');
