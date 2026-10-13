import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const id='giffgaff-uk-direct-esim-payg';
const snaps=read('data/phone/v1/snapshots.json').filter(x=>x.routeId===id);
const old=snaps.find(x=>x.kind==='current-profile'&&x.checkedAt==='2026-09-15');
const current=[...snaps.filter(x=>x.kind==='current-profile')].sort((a,b)=>String(b.checkedAt).localeCompare(String(a.checkedAt)))[0];
const cap=snaps.find(x=>x.kind==='capabilities').data;
const canonical=read('data/phone/v1/routes.json').find(x=>x.id===id);
const sources=read('data/phone/v1/sources.json');
const pilot=read('frontend/tools/phone-number-lifecycle-mvp/uk-directory-pilot.json').routes.find(x=>x.id===id);
const global=read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const legacy=global.routes.find(x=>x.id===id);
const search=read('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json');
const summary=search.routes.find(x=>x.id===id);
const comparison=read('frontend/tools/phone-number-lifecycle-mvp/comparison-route-index.json').routes.find(x=>x.id===id);
const detail=read('frontend/tools/phone-number-lifecycle-mvp/phone-route-data/'+id+'.json');
const page=fs.readFileSync(path.join(root,'frontend/tools/phone-number-lifecycle-mvp/index.html'),'utf8');

assert(old && current && old.id!==current.id);
assert.equal(old.data.landedCost.mandatoryTopup,10,'the dated old record stays visible as historical evidence, not current truth');
assert.equal(current.checkedAt,'2026-10-13');
assert.equal(current.data.landedCost.landedOriginal,null);
assert.equal(current.data.landedCost.landedCny,null);
assert.equal(current.data.landedCost.mandatoryTopup,null);
assert.equal(current.data.landedCost.providerOrCommunityPrice,null);
assert.match(current.data.payment,/new eSIM requires purchasing an initial plan/i);
assert.match(current.data.payment,/Foreign-issued card acceptance.*unverified/i);
assert.match(current.data.tariffSummary,/Physical SIM: separate credit\/PAYG option/i);
assert.match(current.data.chinaActivation,/do not establish.*China-first/i);
assert.match(current.data.guideSteps.join(' '),/physical-SIM swap may be necessary/);
const officialInitialUrl='https://help.giffgaff.com/en/articles/240912-getting-started-on-giffgaff';
assert.equal(current.data.onboardingSourceUrl,officialInitialUrl);
assert.equal(cap.wifiCallingAbroad.state,'not-supported');
assert.match(current.data.wifiCalling,/NOT supported abroad/i);
assert.match(current.data.wifiCalling,/Cellular roaming SMS is separate/i);
assert.match(current.data.roamingSms,/inbound verification SMS/i);

const scoped=[pilot,legacy,detail.snapshots.find(x=>x.id===current.id)?.data];
for(const [i,d] of scoped.entries()){
 assert(d,'missing updated cross-view row '+i);
 assert.equal(d.landedCost.mandatoryTopup,null,'no fake £10 credit-only eSIM price in view '+i);
 assert.equal(d.landedCost.landedOriginal,null,'no guessed eSIM initial plan price in view '+i);
 assert.equal(d.landedCost.landedCny,null,'no CNY conversion of unknown new eSIM price in view '+i);
 assert.match(d.payment,/new eSIM requires purchasing an initial plan/i);
 assert.match(d.wifiCalling,/NOT supported abroad/i);
 assert.doesNotMatch(d.acquisitionSummary,/£10 minimum top-up/i);
 assert.equal(d.onboardingSourceUrl,officialInitialUrl,'purchase proof link missing in view '+i);
}
for(const m of [summary.metrics,detail.metrics]){
 assert.equal(m.acquisitionCostOriginal,null);
 assert.equal(m.acquisitionCostCny,null);
 assert.equal(m.acquisitionCurrency,'GBP');
}
assert.equal(comparison.acquisitionCostOriginal,null);
assert.equal(comparison.acquisitionCostCny,null);
assert.equal(summary.id,id);
assert.equal(detail.metrics.checkedAt,'2026-10-13');
assert.equal(summary.evidenceState,'admitted');
assert.equal(summary.surfaceState,'public-pilot');
assert.equal(search.routes.length,160);
assert.equal(global.routes.length,135);
assert.equal(global.routes.filter(x=>x.id===id).length,1);
for(const sourceId of ['giffgaff-official-new-esim-initial-plan-20261013','giffgaff-official-deleted-esim-recovery-20261013','src-7bc565362f29']){
 assert(canonical.sourceIds.includes(sourceId),sourceId+' not linked to route');
 assert(current.data.sourceIds.includes(sourceId),sourceId+' not cited by revised snapshot');
 assert(sources.some(x=>x.id===sourceId&&x.url.startsWith('https://help.giffgaff.com/')),sourceId+' source missing');
}
assert.match(page,/\$\{esc\(r\.wifiCalling\|\|'Unknown'\)\}/,'desktop comparison uses corrected legacy Wi-Fi description');
assert.match(page,/function dirStartCost\(r\)/,'legacy cost renders null as Unknown');
assert.match(page,/No verified matches/i,'foreign-first no-match UI must remain available');
assert.match(page,/function onboardingSourceLink\(r\)/);
assert.match(page,/\$\{onboardingSourceLink\(d\)\}/,'canonical evidence must show direct official plan source');
assert.match(page,/\$\{onboardingSourceLink\(r\)\}/,'legacy guide must show direct official plan source');
const publication=read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');
assert.equal(Object.values(publication.routeStates).filter(v=>v==='indexable').length,3);
console.log('Giffgaff initial eSIM plan / unknown checkout / UK-only Wi-Fi / recovery cross-view and publication checks — PASS');
