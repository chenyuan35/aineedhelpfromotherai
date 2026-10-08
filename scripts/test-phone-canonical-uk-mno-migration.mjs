import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const routeIds = ['three-uk-payg-180d-2026', 'o2-uk-classic-payg-6mo-2026', 'ee-uk-payg-180d-2026'];
const canonical = { routes: read('data/phone/v1/routes.json'), markets: read('data/phone/v1/markets.json'), snapshots: read('data/phone/v1/snapshots.json') };
const sources = read('data/phone/v1/sources.json');
const networks = read('data/phone/v1/networks.json');
const brands = read('data/phone/v1/brands.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const manifest = read('frontend/tools/phone-number-lifecycle-mvp/batch-admission-manifest.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');
const publicPilotIds = ['lebara-uk-direct-esim-china', 'giffgaff-uk-direct-esim-payg', 'voxi-uk-esim-payg-retention'];

const expected = {
  'three-uk-payg-180d-2026': { networkId: 'three-uk', brandId: 'three-uk-payg', evidenceState: 'admitted' },
  'o2-uk-classic-payg-6mo-2026': { networkId: 'o2-uk', brandId: 'o2-uk-classic', evidenceState: 'hold' },
  'ee-uk-payg-180d-2026': { networkId: 'ee-uk', brandId: 'ee-uk-payg', evidenceState: 'admitted' },
};
for (const routeId of routeIds) {
  const e = expected[routeId];
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `UK MNO route missing from canonical: ${routeId}`);
  assert.equal(route.marketId, 'gb'); assert.equal(route.networkId, e.networkId); assert.equal(route.brandId, e.brandId);
  assert.equal(route.surfaceState, 'backstage-only'); assert.equal(route.evidenceState, e.evidenceState);
  assert(networks.some((row) => row.id === route.networkId && row.marketId === 'gb'));
  assert(brands.some((row) => row.id === route.brandId && row.marketId === 'gb' && row.networkId === route.networkId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  const legacy = globalDirectory.routes.find((row) => row.id === routeId); assert(legacy, `legacy row missing: ${routeId}`);
  if (routeId === 'o2-uk-classic-payg-6mo-2026') {
    // Preserve the accepted 2026-09 historical admission comparison, but audit
    // the 2026-10 reviewed Classic legacy-holder correction as a distinct layer.
    const packet = read('data/phone/review-packets/o2-uk-classic-payg-6mo-2026.json');
    assert.deepEqual(
      buildCanonicalComparisonRoute(
        { routes: [packet.route], markets: [packet.market], snapshots: packet.snapshots },
        routeId,
      ),
      legacy,
      'O2 Classic historical intake must still reproduce the frozen legacy comparison row',
    );
    const revised = buildCanonicalComparisonRoute(canonical, routeId);
    assert.equal(revised.landedCost.landedOriginal, null, 'Classic has no verified new-user acquisition');
    assert.equal(revised.keep.yearCostOriginal, null, '2p domestic text is not the annual retention cost');
    assert.equal(revised.keep.intervalDays, null, 'six calendar months is not a fixed 180-day count');
    assert.equal(revised.keep.observedActionCost, 0.02);
    assert.match(revised.payment, /UK-bank-issued/);
    assert.match(revised.wifiCalling, /NOT supported outside the UK/);
    assert.equal(revised.guideEligible, false);
    assert.equal(revised.avoidRoute, true);
  } else {
    assert.deepEqual(buildCanonicalComparisonRoute(canonical, routeId), legacy, `${routeId}: canonical adapter parity must be exact`);
  }
  assert.equal(policy.routeStates[routeId], undefined, `${routeId} must stay non-indexable`);
}
const sourceUrl=(id)=>sources.find((row)=>row.id===id)?.url;
assert.equal(sourceUrl('official-three-payg-support-2026-09-28'),'https://www.three.co.uk/support/pay-as-you-go');
assert.equal(sourceUrl('official-o2-classic-payg-help-2026-09-28'),'https://www.o2.co.uk/help/products-and-services/pay-as-you-go/classic-pay-as-you-go');
assert.equal(sourceUrl('community-o2-inactivity-criteria-2024'),'https://community.o2.co.uk/t5/Pay-As-You-Go/Inactivity-criteria-for-sim-disconnection/td-p/1685980');
assert.equal(sourceUrl('official-ee-payg-hibernation-2026-09-28'),'https://ee.co.uk/help/mobile/manage-use/pay-as-you-go/pay-as-you-go-credit-run-out-when-i-havent-made-calls');
const three=globalDirectory.routes.find((x)=>x.id==='three-uk-payg-180d-2026');
assert.equal(three.keep.intervalDays,180); assert.equal(three.keep.observedActionCost,0.15); assert.equal(three.landedCost.mandatoryTopup,5); assert.match(three.keep.action,/Wi-Fi-only activity does not count/); assert.match(three.simType,/eSIM/);
const o2=globalDirectory.routes.find((x)=>x.id==='o2-uk-classic-payg-6mo-2026');
assert.equal(o2.publishState,'observation-hold'); assert.equal(o2.guideEligible,false); assert.equal(o2.avoidRoute,true); assert.equal(o2.keep.observedActionCost,0.02); assert.match(o2.holdReason,/legacy tariff/);
const ee=globalDirectory.routes.find((x)=>x.id==='ee-uk-payg-180d-2026');
assert.equal(ee.keep.intervalDays,180); assert.equal(ee.keep.observedActionCost,0.20); assert.equal(ee.landedCost.mandatoryTopup,5); assert.equal(ee.simType,'physical SIM'); assert.match(ee.keep.action,/90 days/); assert.match(ee.tariffSummary,/270-day hard closure/);
for (const id of publicPilotIds) {
  const route=canonical.routes.find((x)=>x.id===id); assert(route, `existing UK public pilot missing: ${id}`); assert.equal(route.surfaceState,'public-pilot'); assert.equal(policy.routeStates[id],'indexable');
}
assert(manifest.admittedBatches.includes('uk-mno-directory-batch-e.json'));
assert.equal(globalDirectory.routes.length,135); assert.equal(Object.values(policy.routeStates).filter((s)=>s==='indexable').length,3);
console.log('Phone canonical UK MNO migration passed: Three/EE current lifecycle economics reconciled; O2 Classic HOLD preserved; existing UK public pilot, 135 comparison routes and 3 indexable routes preserved.');
