import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const routes=read('data/phone/v1/routes.json');
const sources=read('data/phone/v1/sources.json');
const events=read('data/phone/v1/events.json');
const observations=read('data/phone/v1/observations.json');
const route=routes.find(x=>x.id==='optus-flex-plus-au-2026');
assert(route);
assert.equal(route.evidenceState,'hold');
assert.equal(route.surfaceState,'backstage-only');
const originals=[
 ['1qbghav','reddit-optus-passport-port-identity-mismatch-1qbghav-20260113'],
 ['1sczgck','reddit-optus-yearly-prepaid-samebrand-port-refund-1sczgck-20260405'],
];
const authors=new Set();
for(const [thread,sourceId] of originals){
 const matches=sources.filter(s=>s.url?.includes('/comments/'+thread+'/'));
 assert.equal(matches.length,1,'one original thread '+thread);
 assert.equal(matches[0].id,sourceId);
 assert.equal(matches[0].type,'first-hand-community-thread');
 assert(route.sourceIds.includes(sourceId),'route must link its source');
 const reports=events.filter(e=>e.sourceId===sourceId);
 assert.equal(reports.length,1,'one same-author timeline/event');
 assert.equal(reports[0].routeId,route.id);
 assert(reports[0].authorHandle);
 authors.add(reports[0].authorHandle);
 assert.match(reports[0].outcome,/NOT a verified current Flex Plus|exact current Flex Plus|all Optus long-expiry plans/);
 assert.equal(observations.filter(o=>o.sourceId===sourceId).length,0,'no named app evidence');
}
assert.equal(authors.size,2,'distinct original authors, not same-author crosspost');
const refund=events.find(e=>e.sourceId===originals[1][1]);
assert.match(refund.outcome,/refunded the entire purchase/);
assert.match(refund.outcome,/SAME-OPERATOR/);
const identity=events.find(e=>e.sourceId===originals[0][1]);
assert.match(identity.outcome,/No confirmed cause/);
assert.match(identity.outcome,/every foreign passport is rejected/);
const detail=read('frontend/tools/phone-number-lifecycle-mvp/phone-route-data/optus-flex-plus-au-2026.json');
const summary=read('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json').routes.find(x=>x.id===route.id);
assert.equal(summary.evidenceState,'hold');
assert.equal(summary.surfaceState,'backstage-only');
assert.equal(detail.sources.filter(s=>originals.some(o=>o[1]===s.id)).length,2);
assert.equal(detail.events.filter(e=>originals.some(o=>o[1]===e.sourceId)).length,2);
assert.equal(detail.observations.filter(o=>originals.some(a=>a[1]===o.sourceId)).length,0);
console.log('Optus adjacent first-hand identity/port/refund: 2 originals, 2 scoped non-app incidents, HOLD / no named OTP — PASS');
