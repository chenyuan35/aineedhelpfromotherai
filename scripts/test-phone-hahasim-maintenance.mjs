import fs from "node:fs";
import assert from "node:assert/strict";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const routeId = "fortress-hahasim-hk-2026";
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
assert.equal(route.acquireUrl, "https://www.fortress.com.hk/en/product/roaming-data-haha-sim-card-reusable-with-50-balance/p/BP_11953923");

for (const id of [
  "fortress-hahasim-faq-20261003",
  "linuxdo-hahasim-2511282-20260824",
  "official-fortress-hahasim-product-current-20261006",
  "official-three-hk-prepaid-rnr-current-20261006",
  "linuxdo-hahasim-telegram-failure-20250529",
  "linuxdo-hahasim-telegram-conditional-20260105",
]) {
  assert(route.sourceIds.includes(id));
  assert(sources.some((x) => x.id === id));
}

for (const id of [
  "evt-hahasim-current-acquisition-20261006",
  "evt-hahasim-lifecycle-reconfirmation-20261006",
  "evt-hahasim-physical-only-20261006",
  "evt-hahasim-kyc-activation-boundary-20261006",
  "evt-hahasim-roaming-sms-balance-20261006",
  "evt-hahasim-rnr-recycle-risk-20261006",
]) assert(events.some((x) => x.id === id));

const routeObs = observations.filter((x) => x.routeId === routeId);
assert.equal(routeObs.length, 2);
assert(routeObs.every((x) => x.service === "Telegram" && x.operation === "registration-verification"));

assert(summary);
assert.equal(summary.decisionFacts.sourceCount, 6);
assert.equal(detail.metrics.acquisitionCostOriginal, 50);
assert.equal(detail.metrics.keepYearCostOriginal, 10);
assert.equal(detail.metrics.keepIntervalDays, 365);

const telegram = detail.serviceEvidence.find((x) => x.serviceId === "telegram" && x.operation === "registration-verification");
assert(telegram);
assert.equal(telegram.grade, "C");
assert.equal(telegram.sampleSize, 2);
assert.equal(telegram.independentSourceCount, 2);
assert.equal(telegram.failureCount, 1);
assert.equal(telegram.mixedCount, 1);
assert.equal(telegram.percentageEligible, false);
assert.equal(telegram.successRatePct, null);

const latest = detail.snapshots.at(-1);
assert.equal(latest.id, "snap-fortress-hahasim-hk-2026-current-profile-20261006");
assert.equal(latest.data.guideEligible, false);
assert.equal(latest.data.simType, "physical");
assert.match(latest.data.acquisitionSummary, /HK\$50/);
assert.match(latest.data.keep.action, /HK\$10/);
assert.match(latest.data.keep.action, /data package does not extend/i);
assert.match(latest.data.keep.action, /14 days/);
assert.match(latest.data.kyc, /travel-document/i);
assert.match(latest.data.chinaActivation, /does not explicitly guarantee/i);
assert.match(latest.data.roamingSms, /stored balance/i);
assert.match(latest.data.roamingSms, /do not establish dependable Telegram or bank\/app OTP reliability/i);

console.log("haha SIM maintenance OK");
