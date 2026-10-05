import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(repo, p), 'utf8'));
const canonical = {
  routes: read('data/phone/v1/routes.json'),
  markets: read('data/phone/v1/markets.json'),
  snapshots: read('data/phone/v1/snapshots.json')
};
const brands = read('data/phone/v1/brands.json');
const networks = read('data/phone/v1/networks.json');
const sources = read('data/phone/v1/sources.json');
const observations = read('data/phone/v1/observations.json');
const events = read('data/phone/v1/events.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const id = 'luckysim-hk-prepaid-2026';
const route = canonical.routes.find((row) => row.id === id);
assert(route, 'missing LuckySIM Hong Kong route');
assert.equal(route.marketId, 'hk');
assert.equal(route.brandId, 'luckysim-hk');
assert.equal(route.networkId, 'csl-hk');
assert.equal(route.numberClass, 'real-mobile');
assert.equal(route.family, 'long-term');
assert.equal(route.surfaceState, 'backstage-only');
assert.equal(route.evidenceState, 'hold');
assert.equal(route.sourceIds.length, 7);
assert.equal(policy.routeStates[id], undefined, 'LuckySIM HOLD route must not receive a public publication state');
assert.equal(globalDirectory.routes.some((row) => row.id === id), false, 'LuckySIM must not enter the legacy public comparison directory');

const brand = brands.find((row) => row.id === 'luckysim-hk');
assert(brand, 'missing LuckySIM brand');
assert.equal(brand.marketId, 'hk');
assert.equal(brand.networkId, 'csl-hk');

const current = buildCanonicalComparisonRoute(canonical, id);
assert.equal(current.numberType, 'real-mobile');
assert.equal(current.landedCost.providerOrCommunityPrice, 138);
assert.equal(current.keep.observedActionCost, 100);
assert.equal(current.keep.yearCostOriginal, 100);
assert.equal(current.keep.intervalDays, 365);
assert.match(current.kyc, /required|real-name|OFCA/i);
assert.match(current.roamingSms, /mainland China|UK|OTP|HOLD/i);
assert.match(current.holdReason, /OTP|reliability|manual selection|HOLD/i);
assert.equal(current.guideEligible, false);

const ukSms = observations.find((row) => row.id === 'obs-luckysim-hk-uk-incoming-sms-20260814');
const cnSms = observations.find((row) => row.id === 'obs-luckysim-hk-cn-ordinary-sms-20260904');
assert(ukSms && cnSms, 'missing LuckySIM incoming-SMS observations');
assert.equal(ukSms.outcome, 'success');
assert.equal(cnSms.outcome, 'success');
assert(events.some((row) => row.id === 'evt-luckysim-hk-lifecycle-20261004'), 'missing LuckySIM lifecycle event');
assert(events.some((row) => row.id === 'evt-luckysim-hk-reliability-caveat-20261004'), 'missing LuckySIM reliability event');
assert(sources.some((row) => row.id === 'reddit-luckysim-australia-bank-codes-20251018'), 'missing LuckySIM Australia banking-code source');
assert(sources.some((row) => row.id === 'reddit-luckysim-overseas-sms-instability-20260430'), 'missing LuckySIM SMS-instability source');
const auBank = observations.find((row) => row.id === 'obs-luckysim-hk-au-banking-codes-20251018');
const smsFailure = observations.find((row) => row.id === 'obs-luckysim-hk-overseas-sms-intermittent-failure-20260430');
assert(auBank && smsFailure, 'missing LuckySIM maintenance observations');
assert.equal(auBank.service, 'banking-codes');
assert.equal(auBank.outcome, 'success');
assert.equal(smsFailure.outcome, 'failure');
assert(events.some((row) => row.id === 'evt-luckysim-hk-service-sms-maintenance-20261004'), 'missing LuckySIM SMS maintenance event');
assert.match(current.roamingSms, /banking-code|Australia|mixed|HOLD/i);

assert.ok(canonical.routes.length >= 159, `canonical route corpus regressed below historical baseline: ${canonical.routes.length}`);
assert.equal(canonical.markets.length, 87);
assert.ok(brands.length >= 156, `brand corpus regressed below historical baseline: ${brands.length}`);
assert.equal(networks.length, 117);
assert(sources.length >= 611);
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);

console.log('Phone canonical LuckySIM migration passed: lifecycle-cleared real-mobile HOLD admitted backstage; public boundary preserved.');
