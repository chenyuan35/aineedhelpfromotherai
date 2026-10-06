import fs from "node:fs";
import assert from "node:assert/strict";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const routeId = "1pmobile-uk-2026";
const routes = read("data/phone/v1/routes.json");
const sources = read("data/phone/v1/sources.json");
const observations = read("data/phone/v1/observations.json");
const events = read("data/phone/v1/events.json");
const detail = read(`frontend/tools/phone-number-lifecycle-mvp/phone-route-data/${routeId}.json`);
const summary = read("frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json").routes.find((x) => x.id === routeId);
const route = routes.find((x) => x.id === routeId);

assert(route);
assert.equal(route.surfaceState, "backstage-only");
assert.equal(route.evidenceState, "admitted");
assert.equal(route.form, "physical + eSIM");
assert.equal(route.lastVerifiedAt, "2026-10-06");

for (const id of [
  "1pmobile-terms-20260929",
  "official-1pmobile-terms-current-20261006",
  "official-1pmobile-payg-current-20261006",
  "official-1pmobile-join-current-20261006",
  "official-1pmobile-esim-current-20261006",
  "official-1pmobile-overseas-current-20261006",
  "official-1pmobile-payment-current-20261006",
]) {
  assert(route.sourceIds.includes(id));
  assert(sources.some((x) => x.id === id));
}

for (const id of [
  "evt-1pmobile-current-signup-promo-boundary-20261006",
  "evt-1pmobile-new-customer-90d-commitment-20261006",
  "evt-1pmobile-esim-offshore-activation-20261006",
  "evt-1pmobile-long-term-overseas-sms-20261006",
  "evt-1pmobile-current-payment-methods-20261006",
]) assert(events.some((x) => x.id === id));

assert.equal(observations.filter((x) => x.routeId === routeId).length, 0);
assert.equal(detail.serviceEvidence.length, 0);
assert(summary);
assert.equal(summary.serviceEvidence.length, 0);
assert.equal(summary.decisionFacts.sourceCount, 7);
assert.equal(detail.metrics.acquisitionCostOriginal, 10);
assert.equal(detail.metrics.keepYearCostOriginal, 40);
assert.equal(detail.metrics.keepIntervalDays, 90);

const latest = detail.snapshots.at(-1);
assert.equal(latest.id, "snap-1pmobile-uk-2026-current-profile-20261006");
assert.equal(latest.data.guideEligible, false);
assert.match(latest.data.acquisitionSummary, /£5 promotional/i);
assert.match(latest.data.keep.action, /spend\/use/i);
assert.match(latest.data.keep.action, /90-day/i);
assert.match(latest.data.chinaActivation, /outside the UK/i);
assert.match(latest.data.roamingSms, /banking OTP/i);
assert.match(latest.data.roamingSms, /local partner/i);
assert.match(latest.data.holdReason, /provider statements/i);

console.log("1pMobile maintenance OK");
