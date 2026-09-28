import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const routeIds = ['clubsim-sms-pack-6hkd-2026', 'sosim-recharge-ladder-2026', 'threehk-diy-recharge-2026'];
const canonical = { routes: read('data/phone/v1/routes.json'), markets: read('data/phone/v1/markets.json'), snapshots: read('data/phone/v1/snapshots.json') };
const sources = read('data/phone/v1/sources.json');
const networks = read('data/phone/v1/networks.json');
const brands = read('data/phone/v1/brands.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const manifest = read('frontend/tools/phone-number-lifecycle-mvp/batch-admission-manifest.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const expected = {
  'clubsim-sms-pack-6hkd-2026': { networkId: 'csl-hk', brandId: 'clubsim-hk' },
  'sosim-recharge-ladder-2026': { networkId: 'three-hk', brandId: 'sosim-hk' },
  'threehk-diy-recharge-2026': { networkId: 'three-hk', brandId: 'threehk-diy' },
};

for (const routeId of routeIds) {
  const e = expected[routeId];
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `HK route missing from canonical: ${routeId}`);
  assert.equal(route.marketId, 'hk');
  assert.equal(route.networkId, e.networkId);
  assert.equal(route.brandId, e.brandId);
  assert.equal(route.surfaceState, 'backstage-only');
  assert.equal(route.evidenceState, 'admitted');
  assert(networks.some((row) => row.id === route.networkId && row.marketId === 'hk'));
  assert(brands.some((row) => row.id === route.brandId && row.marketId === 'hk' && row.networkId === route.networkId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  const legacy = globalDirectory.routes.find((row) => row.id === routeId);
  assert(legacy, `legacy row missing: ${routeId}`);
  assert.deepEqual(buildCanonicalComparisonRoute(canonical, routeId), legacy, `${routeId}: canonical adapter parity must be exact`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId} must stay non-indexable`);
}

const sourceUrl = (id) => sources.find((row) => row.id === id)?.url;
const legacySourceUrl = (id) => globalDirectory.sources.find((row) => row.id === id)?.url;
assert.equal(sourceUrl('official-clubsim-faq-365-window-2026-09-26'), 'https://clubsim.com.hk/en/go/clubSim-tnc');
assert.equal(sourceUrl('community-vocus-clubsim-6hkd-guide-2026-04'), 'https://vocus.cc/article/69e62705fd89780001d6685f');
assert.equal(sourceUrl('official-clubsim-sms-pack-6hkd-2026-09-28'), 'https://www.clubsim.com.hk/zh/smspack/tnc');
assert.equal(sourceUrl('official-sosim-topup-renewal-2026-09-26'), 'https://www.sosimhk.com/en/guide/top-up-renewal.html');
assert.equal(sourceUrl('official-sosim-retrieve-expired-number-2026-09-26'), 'https://www.sosimhk.com/en/guide/retrieve-expired-number.html');
assert.equal(sourceUrl('official-sosim-faq-esim-33-2026-09-28'), 'https://www.sosimhk.com/en/faq.html');
assert.equal(sourceUrl('official-3hk-online-recharge-2026-09-26'), 'https://www.three.com.hk/3Care/eng/prepay/payonline1.jsp');
assert.equal(sourceUrl('official-3hk-simworld-recharge-table-2026-09-26'), 'https://web.three.com.hk/simworld/en/buy-recharge.html');
assert.equal(legacySourceUrl('community-vocus-clubsim-6hkd-guide-2026-04'), 'https://vocus.cc/article/69e62705fd89780001d6685f');
assert.equal(legacySourceUrl('official-clubsim-sms-pack-6hkd-2026-09-28'), 'https://www.clubsim.com.hk/zh/smspack/tnc');
assert.equal(legacySourceUrl('official-sosim-topup-renewal-2026-09-26'), 'https://www.sosimhk.com/en/guide/top-up-renewal.html');
assert.equal(legacySourceUrl('official-sosim-faq-esim-33-2026-09-28'), 'https://www.sosimhk.com/en/faq.html');
assert.equal(legacySourceUrl('official-3hk-simworld-recharge-table-2026-09-26'), 'https://web.three.com.hk/simworld/en/buy-recharge.html');

const club = globalDirectory.routes.find((row) => row.id === 'clubsim-sms-pack-6hkd-2026');
assert.equal(club.keep.observedActionCost, 6);
assert.match(club.keep.action, /not a guaranteed all-channel annual price/);
assert(club.sourceIds.includes('community-naixi-clubsim-pack-availability-2026-07'));

const sosim = globalDirectory.routes.find((row) => row.id === 'sosim-recharge-ladder-2026');
assert.equal(sosim.landedCost.landedOriginal, 33);
assert.equal(sosim.keep.observedActionCost, 100);
assert.equal(sosim.keep.intervalDays, 180);
assert.match(sosim.keep.action, /HK\$500\+ extends 730 days/);

const three = globalDirectory.routes.find((row) => row.id === 'threehk-diy-recharge-2026');
assert.equal(three.keep.observedActionCost, 100);
assert.equal(three.keep.yearCostOriginal, 200);
assert.match(three.keep.action, /Do not use the SIM World HK\$50\/365-day table for DIY/);
assert(!/HK\$50 extends ~180 days/.test(three.keep.action));
assert(three.sourceIds.includes('community-3hk-diy-recharge-reproduction-2025-10-21'));

assert(manifest.admittedBatches.includes('hk-directory-batch-c.json'));
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical HK migration passed: ClubSIM + SoSIM + 3HK DIY parity exact; provenance conflicts preserved; 135 comparison routes and 3 indexable routes preserved.');
