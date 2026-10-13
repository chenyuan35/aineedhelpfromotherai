import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../frontend/tools/phone-number-lifecycle-mvp/',import.meta.url);
const source=fs.readFileSync(new URL('index.html',root),'utf8');
const legacy=JSON.parse(fs.readFileSync(new URL('global-directory.json',root),'utf8'));
const canonical=JSON.parse(fs.readFileSync(new URL('phone-route-summaries.json',root),'utf8'));
const by=new Map(canonical.routes.map(x=>[x.id,x]));
const flagged=legacy.routes.filter(r=>{
 const x=by.get(r.id);
 return Number.isFinite(r.keep?.yearCostOriginal)&&Number.isFinite(x?.metrics?.keepYearCostOriginal)
  && (r.keep.currency||r.landedCost?.currency)===x.metrics.keepCurrency
  && Math.abs(r.keep.yearCostOriginal-x.metrics.keepYearCostOriginal)>0.00001;
});
assert(flagged.length>=15,'fixture must test real cross-stream mismatch list');
assert(flagged.some(x=>x.id==='tello-paygo-credit-2026'));
assert(flagged.some(x=>x.id==='optus-flex-plus-au-2026'));
assert.match(source,/function dirAnnualCostConflict\(r\)/);
assert.match(source,/function dirComparableKeepForSort\(r\)/);
assert.match(source,/COST REVIEW — historical/);
assert.match(source,/Different plans or recharge paths may apply; inspect evidence before comparing/);
assert.match(source,/state\.dirSort==='keep-cost'\)arr\.sort\(\(a,b\)=>eligibleFirst\(a,b\)\|\|dirSortVal\(dirComparableKeepForSort\(a\)\)/);
assert.match(source,/keep:dirComparableKeepForSort\(r\),keepCurrency:/);
assert.match(source,/conflicting annual costs are marked as needing review, not ranked cheapest/);
// Legacy source display and app chip must not bypass canonical evidence grading.
assert.match(source,/const sources=globalThis\.PhoneEvidence\.selectHighlightSources\(directorySources\(r\),6\)/);
assert.match(source,/Never compute a "success %" from legacy report counts/);
assert.match(source,/independent originals/);
assert.match(source,/older ungraded reports; named-app operation and independence unverified/);
assert(!source.includes('Math.round(success/n*100)'), 'raw legacy app report ratio must not be a synthetic success rate');
// Rendering groups must preserve the canonical readiness sort across networks.
assert.match(source,/key=\(research\?'research:':'reviewed:'\)/,'network grouping cannot promote HOLD ahead of reviewed routes');
// Canonical eligibility must order current publishable routes ahead of HOLD.
assert.match(source,/const eligibleFirst=\(a,b\)=>rank\(a\)-rank\(b\)/);
assert.match(source,/function legacyPriceNote\(r\)/);
for(const fn of ['dirRow','dirMobileCard','renderComparePanel']){
 const begin=source.indexOf('function '+fn+'(');
 const end=source.indexOf('\nfunction ',begin+9);
 assert.match(source.slice(begin,end),/legacyPriceNote\(r\)/,'historical price warning in '+fn);
}
// Cross-view purchase/status parity must use canonical state, never old publication flags.
const vm=await import('node:vm');
const helperNames=['legacyCanonicalState','legacyStatusBadge','legacyAcquireLink'];
const snippets=helperNames.map(name=>{
 const line=source.split('\n').find(line=>line.startsWith('function '+name+'('));
 assert(line,'missing canonical legacy helper: '+name);return line;
});
const helpers=vm.runInNewContext(snippets.join('\n')+'\n({legacyCanonicalState,legacyStatusBadge,legacyAcquireLink})',{
 canonicalIndex:canonical,
 taskEligible:r=>r.family==='long-term'&&r.numberClass==='real-mobile'&&r.evidenceState==='admitted'&&['public-legacy','public-pilot'].includes(r.surfaceState),
 canonicalStateLabel:r=>r.evidenceState==='hold'?'Observation / hold':r.evidenceState==='needs-reconciliation'?'Needs reconciliation':r.surfaceState==='backstage-only'?'Backstage reviewed':'Reviewed route',
 esc:v=>String(v)
});
const oldHold=legacy.routes.filter(x=>by.get(x.id)?.evidenceState==='hold');
assert.equal(oldHold.length,79,'fixture HOLD crosswalk changed, re-audit cohort');
assert.equal(oldHold.filter(x=>x.publishState!=='observation-hold').length,76,'fixture legacy disagreement count changed');
const dangerous=['optus-flex-plus-au-2026','truemove-validity-pack-th-2026','smart-prepaid-ph-2026','asda-mobile-uk-2026','id-mobile-uk-2026','lycamobile-uk-keep-number-2026'];
for(const row of oldHold){
 assert.equal(helpers.legacyCanonicalState(row).hold,true,'HOLD must never be a candidate: '+row.id);
 assert.match(helpers.legacyStatusBadge(row),/data-state="hold"/,'HOLD badge: '+row.id);
 assert(!helpers.legacyStatusBadge(row).includes('Pilot candidate'),'HOLD cannot appear pilot: '+row.id);
 assert.equal(helpers.legacyAcquireLink(row),'','HOLD must not expose direct Acquire: '+row.id);
}
for(const id of dangerous){
 const row=legacy.routes.find(x=>x.id===id);assert(row,'missing source fixture '+id);
 assert(row.guideEligible!==false&&row.acquireUrl,'legacy Acquire fixture changed '+id);
 assert.equal(helpers.legacyAcquireLink(row),'','canonical HOLD blocked: '+id);
}
const unmatched=legacy.routes.find(x=>x.id==='sakura-mobile-voice-2026');
assert(unmatched && !by.has(unmatched.id));
assert.equal(helpers.legacyCanonicalState(unmatched).hold,true,'unmapped legacy routes must fail closed');
assert.equal(helpers.legacyAcquireLink(unmatched),'');
const fnPart=name=>{const start=source.indexOf('function '+name+'(');assert(start>=0);const end=source.indexOf('\nfunction ',start+9);return source.slice(start,end>0?end:undefined);};
for(const name of ['dirRow','dirMobileCard','renderComparePanel','openDirectoryGuide']){
 const section=fnPart(name);
 assert.match(section,/legacy(?:StatusBadge|CanonicalState)/,'status helper missing in '+name);
 assert.match(section,/legacy(?:AcquireLink|CanonicalState)/,'CTA gate missing in '+name);
 assert(!section.includes("r.publishState==='observation-hold'"),'stale legacy badge in '+name);
}
assert.equal(helpers.legacyCanonicalState(legacy.routes.find(x=>x.id==='optus-flex-plus-au-2026')).label,'Observation / hold');
console.log('Legacy market comparison: price conflicts disclosed, omitted from low-cost ranking and SVG comparison; '+flagged.length+' discrepancies — PASS');
