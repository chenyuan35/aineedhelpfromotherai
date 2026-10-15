import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const get=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const routes=get('data/phone/v1/routes.json'),sources=get('data/phone/v1/sources.json');
const events=get('data/phone/v1/events.json'),obs=get('data/phone/v1/observations.json');
const route=routes.find(r=>r.id==='lebara-uk-direct-esim-china');
assert(route&&route.surfaceState==='public-pilot'&&route.evidenceState==='admitted');
const rows=sources.filter(s=>s.url?.includes('/comments/1rtwkoj/'));
assert.equal(rows.length,1,'One original Lebara discussion, not one per commenter');
const original=rows[0];assert.equal(original.type,'first-hand-community-thread');assert.equal(original.reportedAt,'2026-03-14');
assert.equal(route.sourceIds.filter(x=>x===original.id).length,1);
const reports=events.filter(e=>e.sourceId===original.id);
assert.equal(reports.length,1,'No extra untested commenters admitted');
const e=reports[0];assert.equal(e.routeId,route.id);assert.equal(e.authorHandle,'Substantial_Heat1254');
assert.match(e.productCohort,/Lebara UK eSIM/);assert.match(e.productCohort,/unknown/);
assert.match(e.outcome,/Wi-Fi Calling NOT working/);assert.match(e.outcome,/UNVERIFIED/);
assert.match(e.outcome,/THEY WERE TOLD/);assert.match(e.outcome,/no first-party policy/);
assert.match(e.outcome,/Do NOT infer a passport requirement/);
assert.match(e.scope,/Do not infer mainland-China/);
assert.equal(obs.filter(o=>o.sourceId===original.id).length,0,'Question about activation is NOT a service-specific SMS outcome');
const summary=get('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json').routes.find(x=>x.id===route.id);
assert.equal(summary.decisionFacts.sourceCount,route.sourceIds.length);
const service=summary.serviceEvidence.filter(s=>s.serviceId==='telegram'||s.serviceId==='whatsapp');
assert.equal(service.length,2);assert(service.every(s=>s.independentSourceCount===1&&s.successRatePct===null));
const detail=get('frontend/tools/phone-number-lifecycle-mvp/phone-route-data/'+route.id+'.json');
assert(detail.sources.some(x=>x.id===original.id));assert(detail.events.some(x=>x.id===e.id));
assert.equal(detail.observations.filter(x=>x.sourceId===original.id).length,0);
console.log('Lebara UK eSIM actual abroad WiFi Calling failed, unspecified geography, one OP/one original, no China/OTP/payment/KYC fabrications PASS');

const originalNodeSeekIds=[
  'nodeseek-lebara-uk-863917-paid-activation-contradiction-20260808',
  'nodeseek-lebara-uk-874249-mainland-wfc-contrasts-20260814'
];
const newlyReviewedEvents=events.filter(e=>originalNodeSeekIds.includes(e.sourceId));
assert.equal(newlyReviewedEvents.length,4,'Four author-level incidents, but exactly two independent original discussions');
assert.equal(new Set(newlyReviewedEvents.map(e=>e.authorHandle)).size,4,'Distinct individual reporters within each original');
assert.equal(new Set(newlyReviewedEvents.map(e=>e.sourceId)).size,2,'Same-thread replies must not become extra independent original URLs');
for(const sid of originalNodeSeekIds){
  const src=sources.find(s=>s.id===sid);
  assert(src&&src.type==='first-hand-community-thread'&&route.sourceIds.includes(sid));
  assert(detail.sources.some(x=>x.id===sid));
}
assert.equal(detail.events.filter(e=>originalNodeSeekIds.includes(e.sourceId)).length,4);
assert.equal(obs.filter(o=>originalNodeSeekIds.includes(o.sourceId)).length,0,'No independently tested named app OTP on these originals');
const buyer=newlyReviewedEvents.find(e=>e.authorHandle==='ddgg');
assert(buyer&&/NOT ACTIVATED/.test(buyer.outcome)&&/UNKNOWN/.test(buyer.outcome));
assert(/UNVERIFIED/.test(buyer.outcome)&&/previous user's calls/.test(buyer.outcome));
assert(newlyReviewedEvents.some(e=>e.authorHandle==='lzd'&&/NOT a generally supported workaround/.test(e.outcome)));
assert(newlyReviewedEvents.some(e=>e.authorHandle==='chevis'&&/PERSONAL TEMPORARY SUCCESS/.test(e.outcome)));
assert(newlyReviewedEvents.some(e=>e.authorHandle==='starsakura'&&/SAME-AUTHOR FAILURE-THEN-RECOVERY/.test(e.outcome)));
assert.equal(summary.eventCount,events.filter(e=>e.routeId===route.id).length);
assert.equal(summary.eventCount,8);
assert.equal(summary.decisionFacts.sourceCount,route.sourceIds.length);
assert.equal(summary.decisionFacts.sourceCount,11);
assert.equal(summary.decisionFacts.continuityRiskSignalCount,1);
assert.equal(summary.decisionFacts.lastContinuityRiskSignalAt,'2026-08-08');
console.log('Lebara UK paid buyer, alleged prior-user account history, WFC opposites: two original URLs/four scoped reports/zero named OTP PASS');
