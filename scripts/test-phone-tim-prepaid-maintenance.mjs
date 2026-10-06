import fs from "node:fs";
import assert from "node:assert/strict";
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const routeId = "tim-prepaid-12mo-2026";
const routes = read("data/phone/v1/routes.json");
const sources = read("data/phone/v1/sources.json");
const observations = read("data/phone/v1/observations.json");
const events = read("data/phone/v1/events.json");
const detail = read(`frontend/tools/phone-number-lifecycle-mvp/phone-route-data/${routeId}.json`);
const summary = read("frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json").routes.find(x => x.id === routeId);
const route = routes.find(x => x.id === routeId);
assert(route);
assert.equal(route.surfaceState, "backstage-only");
assert.equal(route.evidenceState, "admitted");
assert.equal(route.lastVerifiedAt, "2026-10-06");
assert.equal(route.form, "physical + eSIM");
for (const id of [
  "official-tim-riattivare-sim-2026-09-26",
  "official-tim-ricarica-5-2026-09-28",
  "official-tim-mobile-sim-cost-current-20261006",
  "official-tim-passa-esim-id-current-20261006",
  "official-tim-estero-current-20261006",
  "official-tim-video-identification-current-20261006",
]) {
  assert(route.sourceIds.includes(id));
  assert(sources.some(x => x.id === id));
}
for (const id of [
  "evt-tim-prepaid-lifecycle-rescue-20261006",
  "evt-tim-prepaid-five-euro-keep-20261006",
  "evt-tim-prepaid-current-sim-cost-20261006",
  "evt-tim-prepaid-esim-identity-payment-boundary-20261006",
  "evt-tim-prepaid-roaming-sms-boundary-20261006",
]) assert(events.some(x => x.id === id));
assert.equal(observations.filter(x => x.routeId === routeId).length, 0);
assert.equal(detail.serviceEvidence.length, 0);
assert(summary);
assert.equal(summary.serviceEvidence.length, 0);
assert.equal(summary.decisionFacts.sourceCount, 6);
assert.equal(detail.metrics.acquisitionCostOriginal, 10);
assert.equal(detail.metrics.keepYearCostOriginal, 5);
assert.equal(detail.metrics.keepIntervalDays, 365);
const latest=detail.snapshots.at(-1);
assert.equal(latest.id, "snap-tim-prepaid-12mo-2026-current-profile-20261006");
assert.equal(latest.data.guideEligible, false);
assert.match(latest.data.keep.action, /EUR5/i);
assert.match(latest.data.keep.action, /11 months/i);
assert.match(latest.data.kyc, /Codice Fiscale/i);
assert.match(latest.data.kyc, /passport/i);
assert.match(latest.data.roamingSms, /China/i);
assert.match(latest.data.holdReason, /China|mainland/i);
console.log("TIM Prepaid maintenance OK");
