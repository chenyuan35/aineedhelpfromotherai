import fs from "node:fs";
import assert from "node:assert/strict";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const routeId="taiwan-mobile-prepaid-tw-2026";
const routes=read("data/phone/v1/routes.json");
const sources=read("data/phone/v1/sources.json");
const events=read("data/phone/v1/events.json");
const observations=read("data/phone/v1/observations.json");
const detail=read(`frontend/tools/phone-number-lifecycle-mvp/phone-route-data/${routeId}.json`);
const summary=read("frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json").routes.find(x=>x.id===routeId);
const route=routes.find(x=>x.id===routeId);
assert(route);
assert.equal(route.surfaceState,"backstage-only");
assert.equal(route.evidenceState,"admitted");
assert.equal(route.form,"physical + eSIM");
assert.equal(route.lastVerifiedAt,"2026-10-06");
for(const id of [
 "taiwan-mobile-tw-official",
 "official-twm-regular-prepaid-tariff-current-20261006",
 "official-twm-prepaid-recharge-current-20261006",
 "official-twm-esim-current-20261006",
 "official-twm-identity-faq-current-20261006",
 "official-twm-prepaid-roaming-current-20261006"
]) { assert(route.sourceIds.includes(id)); assert(sources.some(x=>x.id===id)); }
for(const id of [
 "evt-twm-prepaid-standard-acquisition-20261006",
 "evt-twm-prepaid-100-recharge-180d-20261006",
 "evt-twm-prepaid-esim-support-20261006",
 "evt-twm-prepaid-foreign-registration-classification-20261006",
 "evt-twm-prepaid-china-incoming-sms-20261006"
]) assert(events.some(x=>x.id===id));
assert.equal(observations.filter(x=>x.routeId===routeId).length,0);
assert.equal(detail.serviceEvidence.length,0);
assert(summary);
assert.equal(summary.serviceEvidence.length,0);
assert.equal(summary.decisionFacts.sourceCount,6);
assert.equal(detail.metrics.acquisitionCostOriginal,300);
assert.equal(detail.metrics.keepYearCostOriginal,200);
assert.equal(detail.metrics.keepIntervalDays,180);
const latest=detail.snapshots.at(-1);
assert.equal(latest.id,"snap-taiwan-mobile-prepaid-tw-2026-current-profile-20261006");
assert.equal(latest.data.guideEligible,false);
assert.match(latest.data.keep.action,/NT\$100/);
assert.match(latest.data.kyc,/short-term|Regular-vs-short-term/i);
assert.match(latest.data.roamingSms,/China/i);
assert.match(latest.data.roamingSms,/incoming SMS/i);
assert.match(latest.data.roamingSms,/not an app\/bank OTP|not.*OTP/i);
console.log("Taiwan Mobile prepaid maintenance OK");
