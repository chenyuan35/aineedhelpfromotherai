import fs from "node:fs";
import assert from "node:assert/strict";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const routeId = "etisalat-wasel-ae-2026";
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
assert.equal(route.lastVerifiedAt, "2026-10-07");
assert.equal(route.acquireUrl, "https://www.eand.ae/en/c/mobile/plans/rmp/wasel-prepaid-line.html");

for (const sourceId of [
  "eand-wasel-faq-2026-09-29",
  "eand-wasel-line-2026-09-29",
  "official-eand-wasel-current-20261007",
  "official-eand-wasel-terms-current-20261007",
  "official-eand-wasel-faq-current-20261007",
  "official-eand-esim-current-20261007",
  "official-eand-roaming-rates-current-20261007",
  "official-eand-roaming-faq-current-20261007",
  "official-eand-visitor-line-current-20261007",
  "reddit-etisalat-wasel-uaepass-otp-20240216",
  "reddit-etisalat-wasel-roaming-otp-20231119",
]) {
  assert(route.sourceIds.includes(sourceId));
  assert(sources.some((x) => x.id === sourceId));
}

for (const eventId of [
  "evt-etisalat-wasel-acquisition-current-20261007",
  "evt-etisalat-wasel-lifecycle-current-20261007",
  "evt-etisalat-wasel-lowest-controlled-keep-20261007",
  "evt-etisalat-wasel-kyc-visitor-boundary-20261007",
  "evt-etisalat-wasel-esim-location-boundary-20261007",
  "evt-etisalat-wasel-roaming-sms-current-20261007",
  "evt-etisalat-wasel-independent-uaepass-otp-20240216",
  "evt-etisalat-wasel-independent-roaming-otp-20231119",
]) assert(events.some((x) => x.id === eventId));

assert.equal(observations.filter((x) => x.routeId === routeId).length, 0);
assert.equal(detail.serviceEvidence.length, 0);
assert(summary);
assert.equal(summary.serviceEvidence.length, 0);
assert.equal(summary.decisionFacts.sourceCount, 11);
assert.equal(summary.decisionFacts.kycState, "required");
assert.equal(detail.metrics.acquisitionCostOriginal, 40);
assert.equal(detail.metrics.keepYearCostOriginal, 0.76);
assert.equal(detail.metrics.keepIntervalDays, 90);

const latest = detail.snapshots.at(-1);
assert.equal(latest.id, "snap-etisalat-wasel-ae-2026-current-profile-20261007");
assert.equal(latest.data.guideEligible, false);
assert.match(latest.data.acquisitionSummary, /AED40/);
assert.match(latest.data.keep.action, /AED0\.19/);
assert.match(latest.data.keep.action, /AED10 per 90-day period/);
assert.match(latest.data.keep.action, /one-year number-retention/);
assert.match(latest.data.kyc, /Emirates ID/);
assert.match(latest.data.kyc, /Visitor Line/);
assert.match(latest.data.chinaActivation, /physical UAE presence/);
assert.match(latest.data.payment, /recharge abroad/);
assert.match(latest.data.roamingSms, /incoming SMS while roaming is free/);
assert.match(latest.data.roamingSms, /UAEPass OTP success overseas/);
assert.match(latest.data.roamingSms, /mainland-China bank\/app OTP reliability remains unverified/);

console.log("Etisalat Wasel maintenance OK");
