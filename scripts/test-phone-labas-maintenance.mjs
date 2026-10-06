import fs from "node:fs";
import assert from "node:assert/strict";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const routeId = "labas-90-120d-2026";
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
assert.equal(route.lastVerifiedAt, "2026-10-06");
assert.equal(route.acquireUrl, "https://www.labas.lt/en/packaging");

for (const id of [
  "labas-help-20260929",
  "labas-rules-20260929",
  "official-labas-terms-current-20261006",
  "official-labas-packaging-current-20261006",
  "official-labas-registration-current-20261006",
  "official-labas-topup-current-20261006",
  "official-labas-roaming-current-20261006",
]) {
  assert(route.sourceIds.includes(id));
  assert(sources.some((x) => x.id === id));
}

for (const id of [
  "evt-labas-current-esim-entry-20261006",
  "evt-labas-lifecycle-reconfirmation-20261006",
  "evt-labas-foreign-registration-kyc-20261006",
  "evt-labas-offshore-activation-boundary-20261006",
  "evt-labas-roaming-sms-continuity-20261006",
]) assert(events.some((x) => x.id === id));

assert.equal(observations.filter((x) => x.routeId === routeId).length, 0);
assert.equal(detail.serviceEvidence.length, 0);
assert(summary);
assert.equal(summary.serviceEvidence.length, 0);
assert.equal(summary.decisionFacts.sourceCount, 7);
assert.equal(detail.metrics.acquisitionCostOriginal, 1);
assert.equal(detail.metrics.keepYearCostOriginal, 12);
assert.equal(detail.metrics.keepIntervalDays, 90);

const latest = detail.snapshots.at(-1);
assert.equal(latest.id, "snap-labas-90-120d-2026-current-profile-20261006");
assert.equal(latest.data.guideEligible, false);
assert.match(latest.data.acquisitionSummary, /€1/);
assert.match(latest.data.keep.action, /€3/);
assert.match(latest.data.keep.action, /120 days/);
assert.match(latest.data.kyc, /citizens of any country/i);
assert.match(latest.data.chinaActivation, /may be restricted/i);
assert.match(latest.data.roamingSms, /China/i);
assert.match(latest.data.roamingSms, /not bank\/app OTP reliability/i);

console.log("LABAS maintenance OK");
