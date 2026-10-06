import fs from "node:fs";
import assert from "node:assert/strict";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const routeId = "digi-reload-validity-my-2026";
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
assert.equal(route.acquireUrl, "https://www.celcomdigi.com/prepaid");

for (const id of [
  "celcomdigi-validity-20260929",
  "celcomdigi-kuning-20260929",
  "official-celcomdigi-prepaid-current-20261006",
  "official-celcomdigi-kuning-plan-current-20261006",
  "official-celcomdigi-kuning-pds-current-20261006",
  "official-celcomdigi-activation-current-20261006",
  "official-celcomdigi-esim-current-20261006",
  "official-celcomdigi-roaming-pass-current-20261006",
  "mcmc-prepaid-mandatory-standard-20260226",
  "lowyat-digi-prepaid-roaming-otp-20240716",
]) {
  assert(route.sourceIds.includes(id));
  assert(sources.some((x) => x.id === id));
}

for (const id of [
  "evt-digi-acquisition-reprice-boundary-20261006",
  "evt-digi-rm198-validity-extension-boundary-20261006",
  "evt-digi-kuning-lifecycle-20261006",
  "evt-digi-foreign-registration-20261006",
  "evt-digi-esim-boundary-20261006",
  "evt-digi-roaming-otp-current-20261006",
  "evt-digi-independent-roaming-sms-20240716",
]) assert(events.some((x) => x.id === id));

assert.equal(observations.filter((x) => x.routeId === routeId).length, 0);
assert.equal(detail.serviceEvidence.length, 0);
assert(summary);
assert.equal(summary.serviceEvidence.length, 0);
assert.equal(summary.decisionFacts.sourceCount, 10);
assert.equal(summary.decisionFacts.kycState, "required");
assert.equal(detail.metrics.acquisitionCostOriginal, null);
assert.equal(detail.metrics.keepYearCostOriginal, 198);
assert.equal(detail.metrics.keepIntervalDays, 365);

const latest = detail.snapshots.at(-1);
assert.equal(latest.id, "snap-digi-reload-validity-my-2026-current-profile-20261006");
assert.equal(latest.data.guideEligible, false);
assert.match(latest.data.acquisitionSummary, /RM5/);
assert.match(latest.data.acquisitionSummary, /does not establish/i);
assert.match(latest.data.keep.action, /RM198/);
assert.match(latest.data.keep.action, /does not repeat/i);
assert.match(latest.data.kyc, /student visa or work permit/i);
assert.match(latest.data.kyc, /three months/i);
assert.match(latest.data.chinaActivation, /authorized dealer/i);
assert.match(latest.data.payment, /locally issued Visa or MasterCard/i);
assert.match(latest.data.roamingSms, /China/i);
assert.match(latest.data.roamingSms, /OTPs/i);
assert.match(latest.data.roamingSms, /Exact mainland-China bank\/app OTP reliability remains unverified/i);

console.log("Digi maintenance OK");
