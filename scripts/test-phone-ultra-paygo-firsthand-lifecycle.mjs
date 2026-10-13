import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {originalDiscussionKey} from './phone-original-discussion.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const get=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const routes=get('data/phone/v1/routes.json');const sources=get('data/phone/v1/sources.json');
const events=get('data/phone/v1/events.json'),observations=get('data/phone/v1/observations.json');
const route=routes.find(x=>x.id==='ultra-mobile-paygo-3-2026');
assert(route&&route.evidenceState==='admitted'&&route.surfaceState==='backstage-only');
const ids=[
 ['1se5ggi','reddit-ultra-paygo-hk-invalid-act-1se5ggi-20260406','2026-04-06','Newbie_yang'],
 ['1v0rabd','reddit-ultra-paygo-wallet-service-loss-1v0rabd-20260719','2026-07-19','Wolandor'],
 ['1h8yft0','reddit-ultra-paygo-old-overseas-port-wallet-1h8yft0-20241207','2024-12-07','CreativeLet'],
];
for(const [thread,id,reportedAt,author] of ids){
 const src=sources.filter(x=>x.url?.includes('/comments/'+thread+'/'));
 assert.equal(src.length,1,'one original thread per report '+thread);
 assert.equal(src[0].id,id);assert.equal(src[0].type,'first-hand-community-thread');
 assert.equal(src[0].reportedAt,reportedAt);
 assert.equal(originalDiscussionKey(src[0]),originalDiscussionKey({id:'same-original-comment',url:'https://old.reddit.com/r/NoContract/comments/'+thread+'/any-slug/?sort=new'}),'Replies and URL forms collapse to original Reddit discussion');
 assert.equal(route.sourceIds.filter(x=>x===id).length,1);
 const cases=events.filter(x=>x.sourceId===id);
 assert.equal(cases.length,1,'retain same-author lifecycle in a single incident rather than split success and failure');
 assert.equal(cases[0].routeId,route.id);assert.equal(cases[0].authorHandle,author);
 assert.equal(cases[0].reportedAt,reportedAt);
 assert.match(cases[0].productCohort,/PayGo/i);
 assert.equal(observations.filter(x=>x.sourceId===id).length,0,'no named-app OTP actually established');
}
const uniqueOrigins=new Set(ids.map(x=>originalDiscussionKey(sources.find(s=>s.id===x[1]))));
assert.equal(uniqueOrigins.size,3,'Do not count multiple authors or duplicate thread aliases as separate original discussions');
const [invalid,dead,older]=ids.map(x=>events.find(e=>e.sourceId===x[1]));
assert.match(invalid.outcome,/Yoho|Hong Kong/);assert.match(invalid.outcome,/invalid/);
assert.match(invalid.outcome,/No verified activation resolution or refund/);
assert.match(invalid.outcome,/hypothesize/);assert.match(invalid.outcome,/neither is diagnosed/);
assert.match(dead.outcome,/\$45/);assert.match(dead.outcome,/July 5/);
assert.match(dead.outcome,/MIGHT be canceled/);assert.match(dead.outcome,/NOT established/);
assert.match(dead.outcome,/did not know if related/);assert.match(dead.outcome,/NOT been bound to any bank\/app/);
assert.match(older.outcome,/2024/);assert.match(older.outcome,/PORTED numbers/);
assert.match(older.outcome,/NOT new US number/);assert.match(older.outcome,/manager helped resolve/);
assert.match(older.outcome,/CONFLICTS with current 2026 provider PayGo official roaming support/);
assert.match(older.outcome,/No exact foreign location/);
const summaries=get('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json').routes;
const s=summaries.find(x=>x.id===route.id);assert(s);
assert.equal(s.decisionFacts.sourceCount,route.sourceIds.length);
assert.equal(s.serviceEvidence.length,1,'Only existing exact Telegram evidence; none inferred from these reports');
const telegram=s.serviceEvidence[0];assert.equal(telegram.serviceId,'telegram');
assert.equal(telegram.sampleSize,5);assert.equal(telegram.independentSourceCount,5);
assert.equal(telegram.grade,'C');assert.equal(telegram.successRatePct,60);
const detail=get('frontend/tools/phone-number-lifecycle-mvp/phone-route-data/'+route.id+'.json');
assert.equal(detail.events.filter(x=>ids.some(id=>id[1]===x.sourceId)).length,3);
assert.equal(detail.sources.filter(x=>ids.some(id=>id[1]===x.id)).length,3);
assert.equal(detail.observations.filter(x=>ids.some(id=>id[1]===x.sourceId)).length,0);
assert.equal(detail.snapshots.filter(x=>x.kind==='current-profile').sort((a,b)=>b.checkedAt.localeCompare(a.checkedAt))[0].data.guideEligible,true);
assert.match(detail.snapshots.filter(x=>x.kind==='current-profile').at(-1).data.chinaActivation,/not verified/);
console.log('Ultra PayGo: 3 independent origins, one author per chronology, HK original activation block + wallet loss unknown + 2024 port-in WiFi contrary; no fake OTP/new-line success PASS');
