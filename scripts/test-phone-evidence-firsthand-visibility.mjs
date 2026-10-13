import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const at = name => JSON.parse(fs.readFileSync(new URL('../data/phone/v1/'+name+'.json',import.meta.url),'utf8'));
const frontend = new URL('../frontend/tools/phone-number-lifecycle-mvp/',import.meta.url);
const html=fs.readFileSync(new URL('index.html',frontend),'utf8');
const core=fs.readFileSync(new URL('phone-evidence-core.js',frontend),'utf8');
const ctx = vm.createContext({});
vm.runInContext(core,ctx);
const choose=ctx.PhoneEvidence.selectHighlightSources;
assert.match(html, /<script src="\.\/phone-evidence-core\.js"><\/script>/);
assert.match(html,/const sources=globalThis\.PhoneEvidence\.selectCitedSources\(detail\.sources\|\|\[\],/);
assert(!html.includes('const sources=(detail.sources||[]).slice(0,8)'), 'old first-eight slicing must be retired');
// Source of an actual displayed incident must stay clickable, even when old.
const citedSelect=ctx.PhoneEvidence.selectCitedSources;
const fixture=[
 {id:'historical-original',url:'https://example.org/old-user-thread',type:'first-hand-community-thread',reportedAt:'2025-01-01'},
 ...Array.from({length:12},(_,i)=>({id:'recent-'+i,url:'https://example.org/recent-'+i,type:'independent-community',reportedAt:'2026-10-11'})),
 {id:'official-current',url:'https://example.org/current-terms',type:'provider-official',reportedAt:'2026-10-12'},
];
const selected=citedSelect(fixture,[{sourceId:'historical-original'}],8);
assert(selected.some(x=>x.id==='historical-original'),'must include cited old user incident');
assert(selected.some(x=>x.id==='official-current'),'must show a current official reference');
assert(selected.length<=8);
assert.equal(new Set(selected.map(x=>x.url)).size,selected.length);
const r=at('routes'),s=at('sources'),e=at('events'),o=at('observations'),svc=at('services');
const sourcesById=new Map(s.map(x=>[x.id,x]));
const tello = r.find(x=>x.id==='tello-paygo-credit-2026');
assert(tello);
const telloRecords=tello.sourceIds.map(id=>sourcesById.get(id)).filter(Boolean);
const telloEvents=e.filter(x=>x.routeId===tello.id);
const telloChosen=citedSelect(telloRecords,telloEvents,8);
assert(telloChosen.some(x=>x.id==='reddit-tello-china-new-esim-attempt-1tm4m9k-20260524'),'Explicit PAYG original must be visible on PAYG');
const generalTello=r.find(x=>x.id==='tello-us');
const genericChosen=citedSelect(generalTello.sourceIds.map(id=>sourcesById.get(id)).filter(Boolean),e.filter(x=>x.routeId===generalTello.id),8);
for(const id of ['reddit-tello-pixel9-foreign-registration-1utffrl-20260711','reddit-tello-china-new-esim-attempt-1tm4m9k-20260524']) {
 assert(genericChosen.some(x=>x.id===id),'Scope-correct generic Tello source hidden: '+id);
}

const route=r.find(x=>x.id==='1pmobile-uk-2026');assert(route);
const ids=['reddit-1pmobile-overseas-replacement-1vf663j-20260804','reddit-1pmobile-incoming-otp-1sxe5k1-20260427'];
for(const id of ids){assert.equal(route.sourceIds.filter(x=>x===id).length,1);assert.equal(sourcesById.get(id)?.type,'first-hand-community-thread');}
assert.equal(route.evidenceState,'admitted');assert.equal(route.surfaceState,'backstage-only');
assert.equal(e.filter(x=>ids.includes(x.sourceId)).length,2);
const amex=o.filter(x=>ids.includes(x.sourceId));assert.equal(amex.length,1);
assert.equal(amex[0].service,'American Express');
assert.equal(amex[0].operation,'sms-verification');assert.equal(amex[0].outcome,'failure');
assert.equal(amex[0].authorHandle,'jackoboy9');
assert(svc.some(x=>x.id==='american-express'&&x.aliases.includes('amex')));
const detail=JSON.parse(fs.readFileSync(new URL('phone-route-data/1pmobile-uk-2026.json',frontend),'utf8'));
assert.equal(detail.sources.filter(x=>ids.includes(x.id)).length,2);
assert.equal(detail.events.filter(x=>ids.includes(x.sourceId)).length,2);
assert.equal(detail.observations.filter(x=>ids.includes(x.sourceId)).length,1);
const row=JSON.parse(fs.readFileSync(new URL('phone-route-summaries.json',frontend),'utf8')).routes.find(x=>x.id===route.id);
assert.equal(row.decisionFacts.sourceCount,11);
const bank=row.serviceEvidence.find(x=>x.serviceId==='american-express'&&x.operation==='sms-verification');
assert(bank,'named-bank failure must have one eligible service/operation-specific aggregate');
assert.equal(bank.sampleSize,1);assert.equal(bank.independentSourceCount,1);
assert.equal(bank.failureCount,1);assert.equal(bank.percentageEligible,false);assert.equal(bank.successRatePct,null);
const allWithCommunity=r.filter(x=>x.sourceIds.some(id=>/community|first.hand/i.test(sourcesById.get(id)?.type||'')));
let previouslyHidden=0,nowFixed=0;
for(const rt of allWithCommunity){
 const records=rt.sourceIds.map(id=>sourcesById.get(id)).filter(Boolean);
 if(!records.slice(0,8).some(x=>/community|first.hand/i.test(x.type||''))){
   previouslyHidden++;
   assert(choose(records,8).some(x=>/community|first.hand/i.test(x.type||'')),rt.id+' still hides all firsthand sources');
   nowFixed++;
 }
 const chosen=choose(records,8);
 assert(chosen.length<=8);
 assert.equal(new Set(chosen.map(x=>x.url)).size,chosen.length);
 if(records.some(x=>/provider.official|official/i.test(x.type||''))&&records.some(x=>/community|first.hand/i.test(x.type||''))){
   assert(chosen.some(x=>/provider.official|official/i.test(x.type||'')),rt.id+' must retain current-provider rules');
 }
}
assert(previouslyHidden>=10,'fixture must cover real previously hidden firsthand-source regression');
const fake=[...Array.from({length:12},(_,i)=>({id:'p'+i,url:'https://test.example/'+i,type:'provider-official',reportedAt:'2026-10-10'})),{id:'op',url:'https://reddit.com/op',type:'first-hand-community-thread',reportedAt:'2026-04-27'}];
assert(choose(fake,8).some(x=>x.id==='op'));
console.log('Phone firsthand provenance, one named Amex SMS report, preserve official rule and community evidence display: '+nowFixed+' formerly hidden cases FIXED — PASS');
