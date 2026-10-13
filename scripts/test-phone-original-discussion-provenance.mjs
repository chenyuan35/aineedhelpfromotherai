import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import { originalDiscussionKey } from './phone-original-discussion.mjs';
import { gradeServiceEvidence } from './phone-evidence-grading.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file),'utf8'));
const routes=read('data/phone/v1/routes.json'), sources=read('data/phone/v1/sources.json');
const events=read('data/phone/v1/events.json'), observations=read('data/phone/v1/observations.json');
const sourceMap=new Map(sources.map(s=>[s.id,s]));
const routeMap=new Map(routes.map(r=>[r.id,r]));
for(const row of [...events,...observations]) {
  assert(sourceMap.has(row.sourceId),'Unknown source in event/observation: '+row.id);
  assert(routeMap.get(row.routeId)?.sourceIds.includes(row.sourceId),'Event has a cited source missing from its route: '+row.id);
}
const key=(id,url)=>originalDiscussionKey({id,url});
assert.equal(key('parent','https://linux.do/t/topic/2322268'),key('reply','https://linux.do/t/topic/2322268/14'));
assert.equal(key('root','https://linux.do/t/topic/2244241'),key('page2','https://linux.do/t/topic/2244241?page=2'));
assert.equal(key('first','https://www.reddit.com/r/Tello/comments/1tm4m9k/activate_in_china/'),key('second','https://old.reddit.com/r/Tello/comments/1tm4m9k/activate_in_china/?sort=new'));
assert.equal(key('a','https://www.nodeseek.com/post-884095-1'),key('b','https://www.nodeseek.com/post-884095-2'));
assert.notEqual(key('a','https://linux.do/t/topic/2322268'),key('b','https://linux.do/t/topic/2310901'));
assert.notEqual(key('a','https://not-supported.example.com/topic/1'),key('b','https://not-supported.example.com/topic/1'),'Cannot combine unsupported sources without review');

const reports=observations.filter(o=>o.routeId==='giffgaff-uk-direct-esim-payg'&&o.service==='Telegram');
assert.equal(reports.length,2,'Preserve separate author-level observations');
assert.equal(new Set(reports.map(x=>x.sourceId)).size,2,'SourceIDs intentionally differ');
assert.equal(new Set(reports.map(x=>originalDiscussionKey(sourceMap.get(x.sourceId)))).size,1,'But one ORIGINAL Linux.do topic');
const scores=read('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json').routes;
const g=scores.find(x=>x.id==='giffgaff-uk-direct-esim-payg');
const telegram=g?.serviceEvidence.find(x=>x.serviceId==='telegram'&&x.operation==='registration-verification');
assert(telegram,'Giffgaff Telegram evidence exists');
assert.equal(telegram.sampleSize,2);
assert.equal(telegram.independentSourceCount,1);
assert.equal(telegram.confidence,'very-low');
assert.equal(telegram.grade,'C','Mixed success/retry preserved, not Good');
assert.equal(telegram.successRatePct,null,'No percentage for an original-discussion sample of one');
const detail=read('frontend/tools/phone-number-lifecycle-mvp/phone-route-data/giffgaff-uk-direct-esim-payg.json');
assert(detail.sources.some(x=>x.id==='linuxdo-giffgaff-2322268-reply14'),'Clickable cited original reply is now included in route evidence packet');
const mock=(sourceId,url,i)=>({sourceId, originalDiscussionKey:key(sourceId,url),dedupeKey:'author-'+i,reportedAt:'2026-10-01',outcome:'success'});
const same=[mock('one','https://linux.do/t/topic/2322268',1),mock('two','https://linux.do/t/topic/2322268/14',2)];
const sameGrade=gradeServiceEvidence(same);
assert.equal(sameGrade.independentSourceCount,1);
assert.equal(sameGrade.grade,'insufficient');
assert.equal(sameGrade.label,'Multiple reports in one original source');
const distinct=[mock('one','https://linux.do/t/topic/2322268',1),mock('two','https://linux.do/t/topic/2310901',2)];
assert.equal(gradeServiceEvidence(distinct).grade,'B');
console.log('Original-discussion provenance PASS: all event source links, Giffgaff reply vs topic, Reddit/Nodeseek pagination, no fabricated second original');
