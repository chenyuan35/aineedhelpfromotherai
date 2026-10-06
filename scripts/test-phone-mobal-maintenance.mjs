import fs from "node:fs";
import assert from "node:assert/strict";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const routeId = "mobal-japan-voice-2026";
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
assert.equal(route.displayName, "Mobal Japan Voice Lite");
assert.equal(route.form, "physical + eSIM");
assert.equal(route.lastVerifiedAt, "2026-10-06");

for (const id of [
  "official-mobal-id-requirements-2026-09-29",
  "official-mobal-japan-sim-2026-09-29",
  "official-mobal-voice-lite-sim-current-20261006",
  "official-mobal-voice-lite-esim-current-20261006",
  "official-mobal-id-requirements-current-20261006",
  "official-mobal-shipping-current-20261006",
  "official-mobal-roaming-current-20261006",
]) {
  assert(route.sourceIds.includes(id));
  assert(sources.some((x) => x.id === id));
}

for (const id of [
  "evt-mobal-voice-lite-product-successor-20261006",
  "evt-mobal-voice-lite-current-economics-20261006",
  "evt-mobal-voice-lite-japan-only-boundary-20261006",
  "evt-mobal-voice-lite-esim-delivery-id-20261006",
  "evt-mobal-voice-lite-wifi-calling-boundary-20261006",
]) assert(events.some((x) => x.id === id));

assert.equal(observations.filter((x) => x.routeId === routeId).length, 0);
assert.equal(detail.serviceEvidence.length, 0);
assert(summary);
assert.equal(summary.serviceEvidence.length, 0);
assert.equal(summary.decisionFacts.sourceCount, 7);
assert.equal(detail.metrics.acquisitionCostOriginal, 4950);
assert.equal(detail.metrics.keepYearCostOriginal, 11880);
assert.equal(detail.metrics.keepIntervalDays, 30);

const latest = detail.snapshots.at(-1);
assert.equal(latest.id, "snap-mobal-japan-voice-2026-current-profile-20261006");
assert.equal(latest.data.guideEligible, false);
assert.match(latest.data.acquisitionSummary, /Voice Lite/i);
assert.match(latest.data.keep.action, /¥990/);
assert.match(latest.data.chinaActivation, /only in Japan/i);
assert.match(latest.data.wifiCalling, /Not supported/i);
assert.match(latest.data.roamingSms, /only works in Japan/i);
assert.match(latest.data.holdReason, /Japan-only/i);

console.log("Mobal Voice Lite maintenance OK");
