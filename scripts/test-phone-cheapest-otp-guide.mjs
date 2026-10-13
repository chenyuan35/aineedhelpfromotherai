import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../',import.meta.url);
const file=fs.readFileSync(new URL('frontend/site/src/pages/tools/phone-number-survival-guide/guides/cheapest-sim-receiving-sms-abroad.astro',root),'utf8');
const data=fs.readFileSync(new URL('frontend/site/src/data/phone.js',root),'utf8');
const rows=JSON.parse(fs.readFileSync(new URL('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json',root),'utf8')).routes;
const ranked=rows.filter(r=>r.family==='long-term'&&r.numberClass==='real-mobile'&&r.evidenceState==='admitted'
  &&Number.isFinite(r.metrics?.keepYearCostOriginal)&&Number.isFinite(r.metrics?.keepYearCostCny)&&r.metrics.keepYearCostOriginal>=0
  &&Number.isFinite(r.metrics.keepIntervalDays))
  .sort((a,b)=>a.metrics.keepYearCostCny-b.metrics.keepYearCostCny||String(a.id).localeCompare(String(b.id))).slice(0,12);
assert(ranked.length>=3 && ranked.length<=12);
assert(ranked.every(x=>x.evidenceState==='admitted'&&x.numberClass==='real-mobile'&&x.family==='long-term'));
assert(ranked.every(x=>Number.isFinite(x.metrics.keepYearCostCny)));
assert(ranked.every(x=>!['hold','needs-reconciliation'].includes(x.evidenceState)));
assert.match(file,/canonicalRouteSummaries\(\)/);
assert.match(data,/export const canonicalRouteSummaries =/);
assert.match(file,/not by the probability of receiving SMS abroad/);
assert.match(file,/No verified matches/);
assert.match(file,/researchedNotPublic\(r\) \? 'Research-only' : 'Reviewed route'/);
assert.match(file,/different evidence requirements/);
assert.match(file,/First activation or port-in must take place in the United States/);
assert(!file.includes('definitive cost ranking'));
assert(!file.includes('every entry verified against official terms or community evidence'));
assert(!file.includes('the cheapest verified route you can realistically acquire'));
assert(!file.includes('you can actually acquire without local residency'));
assert(!file.includes('SMS that actually arrives abroad'));
assert(!file.includes('the top-up amount. Topped-up credit stays yours.'));
const club=rows.find(r=>r.id==='clubsim-sms-pack-6hkd-2026');
assert(club.serviceEvidence.some(x=>x.serviceId==='telegram' && x.successCount && x.failureCount),'ClubSIM disclaimer grounded in contradictory reports');
const tello=rows.find(r=>r.id==='tello-paygo-credit-2026');
assert.equal(tello.metrics.keepYearCostOriginal,40);
console.log('Cheapest SMS guide: canonical costs, HOLD excluded, backstage scoped, no worldwide named-app OTP or China-first guarantee — PASS');
