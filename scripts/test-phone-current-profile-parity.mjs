import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildCanonicalComparisonRoute} from './phone-canonical-comparison-adapter.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const db={routes:read('data/phone/v1/routes.json'),markets:read('data/phone/v1/markets.json'),snapshots:read('data/phone/v1/snapshots.json')};
const summaries=read('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json').routes;
const sourceRows=read('data/phone/v1/sources.json');
const sourceById=new Map(sourceRows.map(s=>[s.id,s]));
const snapByRoute=new Map();
for(const snapshot of db.snapshots.filter(x=>x.kind==='current-profile')){
 if(!snapByRoute.has(snapshot.routeId))snapByRoute.set(snapshot.routeId,[]);
 snapByRoute.get(snapshot.routeId).push(snapshot);
}
let multiple=0,priceChanged=0;
for(const route of db.routes){
 const history=snapByRoute.get(route.id)||[];
 if(!history.length)continue;
 const latest=[...history].sort((a,b)=>String(b.checkedAt||'').localeCompare(String(a.checkedAt||''))||String(b.id||'').localeCompare(String(a.id||'')))[0];
 const adapter=buildCanonicalComparisonRoute(db,route.id);
 const reordered=buildCanonicalComparisonRoute({...db,snapshots:[...db.snapshots].reverse()},route.id);
 for(const field of ['keep','landedCost','kyc','holdReason','lastVerifiedAt','tariffSummary']){
   assert.deepEqual(adapter[field],latest.data[field],route.id+': adapter must select latest '+field);
   assert.deepEqual(reordered[field],adapter[field],route.id+': adapter must not depend on snapshot order');
 }
 const generated=summaries.find(x=>x.id===route.id);
 assert(generated,'no generated summary: '+route.id);
 const detail=read('frontend/tools/phone-number-lifecycle-mvp/phone-route-data/'+route.id+'.json');
 assert.deepEqual(detail.metrics,generated.metrics,'detail vs summary metrics: '+route.id);
 const fromDetail=[...(detail.snapshots||[])].filter(x=>x.kind==='current-profile').sort((a,b)=>String(b.checkedAt||'').localeCompare(String(a.checkedAt||''))||String(b.id||'').localeCompare(String(a.id||'')))[0];
 assert.equal(fromDetail?.id,latest.id,'detail reader must expose latest profile: '+route.id);
 if(latest.data.keep)assert.equal(generated.metrics.keepYearCostOriginal,latest.data.keep.yearCostOriginal??null,'stale indexed keep cost: '+route.id);
 if(latest.data.landedCost)assert.equal(generated.metrics.acquisitionCostOriginal,latest.data.landedCost.landedOriginal??null,'stale indexed startup price: '+route.id);
 assert.equal(generated.metrics.checkedAt,latest.checkedAt,'stale indexed date: '+route.id);
 if(history.length>1){multiple++;if(history[0].data.keep?.yearCostOriginal!==latest.data.keep?.yearCostOriginal)priceChanged++}
}
assert(multiple>=20,'historical multi-profile fixture unexpectedly missing');
assert(priceChanged>=5,'historical cost disagreement fixture unexpectedly missing');
const id='optus-flex-plus-au-2026',route=db.routes.find(r=>r.id===id),history=snapByRoute.get(id);
assert(route && route.evidenceState==='hold' && route.surfaceState==='backstage-only');
assert.equal(history.length,2);
assert.equal(history[0].data.keep.yearCostOriginal,350,'historical cohort must remain intact');
assert.equal(history[0].data.landedCost.landedOriginal,199);
const updated=buildCanonicalComparisonRoute(db,id);
assert.equal(updated.keep.yearCostOriginal,395,'current 365-day annual price');
assert.equal(updated.landedCost.landedOriginal,395,'current provider-listed eSIM quote');
assert.match(updated.holdReason,/foreign ID/i);
assert.match(updated.tariffSummary,/A\$395\/365d/);
const current=summaries.find(r=>r.id===id);
assert.equal(current.metrics.keepYearCostOriginal,395);
assert.equal(current.metrics.acquisitionCostOriginal,395);
assert.equal(current.evidenceState,'hold');
assert.equal(current.surfaceState,'backstage-only');
assert.equal(current.decisionFacts.kycState,'required');
const official='optus-flex-plus-au-price-20261012';
assert(route.sourceIds.includes(official));
assert.equal(sourceById.get(official)?.url,'https://www.optus.com.au/prepaid/sim-plans');
assert.equal(sourceById.get(official)?.reportedAt,'2026-10-12');
assert.equal(updated.guideEligible,false,'price correction is NOT remote-buy eligibility');
console.log('Dated Phone profile parity: '+db.routes.length+' routes, '+multiple+' historical cohorts, '+priceChanged+' annual price changes; Optus current AUD395 HOLD/history intact — PASS');
