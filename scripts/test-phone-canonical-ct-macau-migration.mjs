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
const events = read('data/phone/v1/events.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const id = 'china-telecom-macau-easy-pass-2026';
const route = canonical.routes.find((row) => row.id === id);
assert(route, 'missing China Telecom Macau Easy PASS route');
assert.equal(route.marketId, 'mo');
assert.equal(route.networkId, 'china-telecom-macau');
assert.equal(route.brandId, 'china-telecom-macau-easy-pass');
assert.equal(route.numberClass, 'real-mobile');
assert.equal(route.family, 'long-term');
assert.equal(route.form, 'physical + eSIM');
assert.equal(route.surfaceState, 'backstage-only');
assert.equal(route.evidenceState, 'hold');
assert.equal(policy.routeStates[id], undefined, 'Macau HOLD route must not receive a public publication state');
assert.equal(globalDirectory.routes.some((row) => row.id === id), false, 'Macau route must not enter the legacy comparison directory');

const market = canonical.markets.find((row) => row.id === 'mo');
const network = networks.find((row) => row.id === 'china-telecom-macau');
const brand = brands.find((row) => row.id === 'china-telecom-macau-easy-pass');
assert.equal(market?.name, 'Macau');
assert.equal(network?.marketId, 'mo');
assert.equal(brand?.networkId, 'china-telecom-macau');

const current = buildCanonicalComparisonRoute(canonical, id);
assert.equal(current.numberType, 'real-mobile');
assert.equal(current.landedCost.providerOrCommunityPrice, 100);
assert.equal(current.keep.observedActionCost, 50);
assert.equal(current.keep.intervalDays, 180);
assert.equal(current.keep.yearCostOriginal, 101.39);
assert.match(current.kyc, /required|real-name/i);
assert.match(current.roamingSms, /free|mainland China|OTP/i);
assert.match(current.holdReason, /OTP|verification|recommendation/i);
assert.equal(current.guideEligible, false);
for (const eventId of [
  'evt-ctmacau-easy-pass-lifecycle-20261004',
  'evt-ctmacau-easy-pass-esim-20261004',
  'evt-ctmacau-easy-pass-sms-caveat-20261004'
]) assert(events.some((row) => row.id === eventId), `missing Macau event ${eventId}`);

assert.equal(canonical.routes.length, 159);
assert.equal(canonical.markets.length, 87);
assert.equal(brands.length, 156);
assert.equal(networks.length, 117);
assert.equal(sources.length, 618);
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);

console.log('Phone canonical China Telecom Macau migration passed: lifecycle-cleared real-mobile HOLD admitted backstage; public boundary preserved.');
