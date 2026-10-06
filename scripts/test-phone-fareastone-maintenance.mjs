import fs from 'node:fs';
import assert from 'node:assert/strict';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const routeId='fareastone-prepaid-tw-2026';
const routes=read('data/phone/v1/routes.json');
const sources=read('data/phone/v1/sources.json');
const obs=read('data/phone/v1/observations.json');
const events=read('data/phone/v1/events.json');
const detail=read(`frontend/tools/phone-number-lifecycle-mvp/phone-route-data/${routeId}.json`);
const summary=read('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json').routes.find(x=>x.id===routeId);
const route=routes.find(x=>x.id===routeId);
assert(route);
assert.equal(route.surfaceState,'backstage-only');
assert.equal(route.evidenceState,'admitted');
assert.equal(route.lastVerifiedAt,'2026-10-06');
assert.equal(route.form,'physical + eSIM');
const sourceIds=[
 'official-fareastone-prepaid-product-current-20261006',
 'official-fareastone-prepaid-topup-current-20261006',
 'official-fareastone-prepaid-choice-current-20261006',
 'official-fareastone-prepaid-english-current-20261006',
 'official-fareastone-prepaid-home-current-20261006',
 'official-fareastone-prepaid-roaming-current-20261006',
 'official-fareastone-volte-overseas-sms-20260824',
 'official-fareastone-tourist-card-current-20261006',
 'official-fareastone-esim-prepaid-guide-current-20261006',
 'reddit-fareastone-foreigner-identity-continuity-20260713',
];
for (const id of sourceIds) { assert(route.sourceIds.includes(id)); assert(sources.some(x=>x.id===id)); }
for (const id of [
 'evt-fareastone-current-economics-lifecycle-20261006',
 'evt-fareastone-instore-esim-identity-boundary-20261006',
 'evt-fareastone-tourist-product-separation-20261006',
 'evt-fareastone-overseas-sms-scope-20261006',
 'evt-fareastone-foreigner-identity-continuity-risk-20261006',
]) assert(events.some(x=>x.id===id));
assert.equal(obs.filter(x=>x.routeId===routeId).length,0);
assert.equal(detail.serviceEvidence.length,0);
assert(summary);
assert.equal(summary.serviceEvidence.length,0);
assert.equal(summary.decisionFacts.sourceCount,11);
assert.equal(detail.metrics.acquisitionCostOriginal,300);
assert.equal(detail.metrics.keepYearCostOriginal,200);
assert.equal(detail.metrics.keepIntervalDays,180);
const latest=detail.snapshots.at(-1);
assert.equal(latest.id,'snap-fareastone-prepaid-tw-2026-current-profile-20261006');
assert.equal(latest.data.guideEligible,false);
assert.match(latest.data.keep.action,/NT\$100/);
assert.match(latest.data.chinaActivation,/in-person Taiwan store/i);
assert.match(latest.data.roamingSms,/mainland China|China/i);
assert.match(latest.data.kyc,/passport\/ARC|two identity/i);
console.log('FarEasTone prepaid maintenance OK');
