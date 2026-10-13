import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const id='giffgaff-uk-direct-esim-payg',route=read('data/phone/v1/routes.json').find(x=>x.id===id);
const sources=read('data/phone/v1/sources.json'),events=read('data/phone/v1/events.json');
const observations=read('data/phone/v1/observations.json'),summary=read('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json').routes.find(x=>x.id===id);
const detail=read('frontend/tools/phone-number-lifecycle-mvp/phone-route-data/'+id+'.json');
const originals={
 '1tc9fy9':'reddit-giffgaff-1tc9fy9-uk-paris-plan-20260513',
 '1qjxpv0':'reddit-giffgaff-1qjxpv0-physical-esim-contrast-20260122',
 '1onzflv':'reddit-giffgaff-1onzflv-esim-mfa-overseas-20251104'
};
for(const [thread,sid] of Object.entries(originals)){
 const found=sources.filter(x=>String(x.url).includes('/comments/'+thread+'/'));
 assert.equal(found.length,1,'one original thread URL for '+thread);
 assert.equal(found[0].id,sid);
 assert(route.sourceIds.includes(sid));
 assert(detail.sources.some(x=>x.id===sid));
 assert.match(found[0].type,/first.hand.community.thread/);
}
const own=events.filter(e=>Object.values(originals).includes(e.sourceId));
assert.equal(own.length,5,'5 author-scoped reports across 3 independently originated discussions');
const counts=Object.fromEntries(Object.values(originals).map(s=>[s,own.filter(e=>e.sourceId===s).length]));
assert.deepEqual(counts,{
 'reddit-giffgaff-1tc9fy9-uk-paris-plan-20260513':1,
 'reddit-giffgaff-1qjxpv0-physical-esim-contrast-20260122':2,
 'reddit-giffgaff-1onzflv-esim-mfa-overseas-20251104':2
});
assert.equal(new Set(own.map(e=>e.authorHandle+'|'+e.sourceId)).size,5,'each event is distinct author / original');
for(const event of own){
 assert(detail.events.some(x=>x.id===event.id),'on-demand detail missing '+event.id);
 assert.equal(event.routeId,id);
 assert(!/(^|[- ])phone-verification|registration-verification/i.test(event.type),'not named OTP outcome');
}
const paid=own.find(e=>e.authorHandle==='NY10990'),failed=own.find(e=>e.authorHandle==='Imaginary-Ad-1456'),success=own.find(e=>e.authorHandle==='JonTravel');
assert.match(paid.productCohort,/one-month paid PLAN/);
assert.match(paid.outcome,/does NOT establish.*China-first/i);
assert.match(failed.productCohort,/Existing.*PHYSICAL SIM/i);
assert.match(success.productCohort,/EXISTING UK/i);
assert.match(success.outcome,/SAME original thread/);
const mfa=own.find(e=>e.authorHandle==='graspmore'),recovery=own.find(e=>e.authorHandle==='Known-Isopod-7240');
assert.match(mfa.outcome,/NOT bank\/WhatsApp verification-SMS filtering/);
assert.match(recovery.outcome,/not.*proof/i);
assert.equal(observations.filter(o=>Object.values(originals).includes(o.sourceId)).length,0);
assert.equal(summary.serviceEvidence.reduce((n,x)=>n+(x.sampleSize||0),0),observations.filter(o=>o.routeId===id).length,'non-app incidents must not change OTP evidence grades');
assert.equal(summary.surfaceState,'public-pilot');
assert.equal(summary.evidenceState,'admitted');
assert.equal(summary.metrics.acquisitionCostOriginal,null,'isolated £10 paid-plan case cannot fill new-eSIM universal price');
assert.equal(read('data/phone/v1/routes.json').length,160);
assert.equal(read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json').routes.length,135);
assert.equal(Object.values(read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json').routeStates).filter(x=>x==='indexable').length,3);
console.log('Giffgaff original-source dedup, author chronology, plan vs conversion/recovery and no app-OTP inflation — PASS');
