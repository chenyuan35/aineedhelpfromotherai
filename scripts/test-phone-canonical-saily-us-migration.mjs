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

const id = 'saily-us-phone-number-2026';
const route = canonical.routes.find((row) => row.id === id);
assert(route, 'missing Saily U.S. phone-number route');
assert.equal(route.marketId, 'us');
assert.equal(route.brandId, 'saily-phone-number-us');
assert.equal(route.networkId, undefined, 'VoIP second-line route must not be normalized onto a cellular network');
assert.equal(route.numberClass, 'voip-second-line');
assert.equal(route.family, 'long-term');
assert.equal(route.surfaceState, 'backstage-only');
assert.equal(route.evidenceState, 'hold');
assert.equal(route.sourceIds.length, 6);
assert.equal(policy.routeStates[id], undefined, 'Saily HOLD route must not receive a public publication state');
assert.equal(globalDirectory.routes.some((row) => row.id === id), false, 'Saily must not enter the legacy public comparison directory');

const brand = brands.find((row) => row.id === 'saily-phone-number-us');
assert(brand, 'missing Saily phone-number brand');
assert.equal(brand.marketId, 'us');
assert.equal(brand.networkId, null);

const current = buildCanonicalComparisonRoute(canonical, id);
assert.equal(current.numberType, 'voip-second-line');
assert.equal(current.keep.observedActionCost, 1.99);
assert.equal(current.keep.yearCostOriginal, 23.88);
assert.equal(current.keep.intervalDays, 30);
assert.match(current.kyc, /required|identity|KYC/i);
assert.match(current.roamingSms, /VoIP|WhatsApp|iMessage|failure/i);
assert.match(current.holdReason, /VoIP|OTP|port|KYC|failure/i);
assert.equal(current.guideEligible, false);

const whatsapp = observations.find((row) => row.id === 'obs-saily-us-phone-number-whatsapp-20260815');
assert(whatsapp, 'missing Saily WhatsApp observation');
assert.equal(whatsapp.outcome, 'success');
assert(events.some((row) => row.id === 'evt-saily-us-phone-number-operational-failure-20260813'), 'missing Saily operational-failure event');

assert.equal(canonical.routes.length, 159);
assert.equal(canonical.markets.length, 87);
assert.equal(brands.length, 156);
assert.equal(networks.length, 117);
assert.ok(sources.length >= 599, `source corpus regressed below Saily baseline: ${sources.length}`);
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);

console.log('Phone canonical Saily migration passed: VoIP second-line HOLD admitted backstage; public boundary preserved.');
