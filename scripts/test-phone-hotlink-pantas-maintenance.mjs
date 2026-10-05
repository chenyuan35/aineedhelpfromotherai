import fs from "node:fs";
import assert from "node:assert/strict";
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const routeId = "hotlink-pantas-365-pass-2026";
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
const sourceIds = [
  "official-hotlink-pantas-tc-current-20261006",
  "official-hotlink-pantas-passes-current-20261006",
  "official-hotlink-pantas-general-current-20261006",
  "official-hotlink-prepaid-esim-current-20261006",
  "official-hotlink-self-registration-current-20261006",
  "official-hotlink-roaming-general-current-20261006",
  "official-hotlink-topup-general-current-20261006",
  "reddit-hotlink-pantas-365-switch-20260901",
  "lowyat-hotlink-pantas-roaming-sms-failure-20260922",
  "hardwarezone-hotlink-offshore-esim-20260106",
  "andrewkim-hotlink-offshore-esim-20260620",
];
for (const id of sourceIds) {
  assert(route.sourceIds.includes(id));
  assert(sources.some(x => x.id === id));
}
for (const id of [
  "evt-hotlink-pantas-current-acquisition-20261006",
  "evt-hotlink-pantas-365-lifecycle-20261006",
  "evt-hotlink-pantas-tourist-90d-exclusion-20261006",
  "evt-hotlink-pantas-registration-esim-20261006",
  "evt-hotlink-pantas-roaming-sms-risk-20261006",
  "evt-hotlink-pantas-365-current-community-confirmation-20261006",
]) assert(events.some(x => x.id === id));
assert.equal(observations.filter(x => x.routeId === routeId).length, 0);
assert.equal(detail.serviceEvidence.length, 0);
assert(summary);
assert.equal(summary.serviceEvidence.length, 0);
assert.equal(summary.decisionFacts.sourceCount, 12);
assert.equal(detail.metrics.acquisitionCostOriginal, 12);
assert.equal(detail.metrics.keepYearCostOriginal, 30);
assert.equal(detail.metrics.keepIntervalDays, 365);
const latest = detail.snapshots.at(-1);
assert.equal(latest.id, "snap-hotlink-pantas-365-pass-2026-current-profile-20261006");
assert.equal(latest.data.guideEligible, false);
assert.match(latest.data.holdReason, /tourist/i);
assert.match(latest.data.keep.action, /90 days/i);
assert.match(latest.data.kyc, /passport/i);
assert.match(latest.data.roamingSms, /failure|unresolved|not established/i);
assert.match(latest.data.tariffSummary, /RM12/);
console.log("Hotlink Pantas maintenance OK");
