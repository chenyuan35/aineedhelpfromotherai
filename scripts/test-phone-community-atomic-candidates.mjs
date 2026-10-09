import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const queue=read('data/phone/inbox/community-missing-atomic-phone-routes-2026-10-09.json');
const routeIds=new Set(read('data/phone/v1/routes.json').map(x=>x.id));
const sourceURLs=new Set(read('data/phone/v1/sources.json').map(x=>x.url));
assert.equal(queue.schemaVersion,1);
assert.equal(queue.publicationState,'backstage-candidate-only');
assert.equal(queue.canonicalRouteCountChange,0);
assert.equal(queue.sourceCountChange,0);
assert.equal(queue.candidates.length,3);
assert.equal(queue.policy.uniqueAtomicIdentityMustBeIndependentlyReviewed,true);
assert.equal(queue.policy.namedServiceProofRequiresExplicitReporter,true);
const ids=new Set(), urls=new Set();
for(const item of queue.candidates){
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(item.candidateId));
  assert(!routeIds.has(item.candidateId),'cannot stage a duplicate canonical ID as missing');
  assert(!ids.has(item.candidateId),'candidate ID must be unique');
  assert.equal(item.needsDistinctRouteReview,true);
  assert.equal(item.canonicalMatches.length,0);
  assert.equal(item.numberClass,'real-mobile');
  assert(item.task.length>40);
  assert(item.gates.length>=3);
  ids.add(item.candidateId);
  assert(item.firsthandSources.length>=1);
  for(const src of item.firsthandSources){
    assert(/^https:\/\/www\.nodeseek\.com\/post-\d+-1$/.test(src.url),'only grounded public original thread');
    assert(!sourceURLs.has(src.url),'candidate source not already canonical');
    assert(!urls.has(src.url),'do not double count the same discussion');
    assert(/^\d{4}-\d{2}$/.test(src.postDate));
    assert(src.author.length>1 && src.operation.length>8);
    assert(src.uncertain.length>0,'unknown eligibility preserved');
    urls.add(src.url);
  }
}
assert(ids.has('simyo-nl-prepaid-esim-2026'));
assert(ids.has('cuniq-hk-dual-number-go-2026'));
assert(ids.has('china-mobile-beijing-cny8-4g-fly-2026'));
const nl=queue.candidates.find(x=>x.country==='nl');
assert.equal(nl.firsthandSources.length,2);
assert(nl.firsthandSources.some(x=>x.reportedOutcome==='success-after-failed-first-order'));
assert(nl.firsthandSources.some(x=>x.reportedOutcome==='failed-before-provider-purchase'));
const hk=queue.candidates.find(x=>x.country==='hk');
assert(hk.firsthandSources.some(x=>x.reportedOutcome==='conditional-success'));
assert(hk.firsthandSources.some(x=>x.reportedOutcome==='application-awaiting-approval'));
const cn=queue.candidates.find(x=>x.country==='cn');
assert.equal(cn.economicHintsUnverified.cutoffDateClaim,'2026-10-19');
assert(cn.firsthandSources[0].uncertain.some(x=>/official/i.test(x)));
assert.equal(urls.size,5);
console.log('External atomic-route candidate inbox: 3 distinct task routes / 5 original source URLs / 0 canonical admissions — PASS');
