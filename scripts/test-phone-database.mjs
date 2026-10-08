import assert from 'node:assert/strict';
import fs from 'node:fs';
import { searchPhoneRoutes } from '../frontend/tools/phone-number-lifecycle-mvp/phone-search.mjs';
import { lookupNumberRange } from '../frontend/tools/phone-number-lifecycle-mvp/phone-number-lookup.mjs';

const root = new URL('../frontend/tools/phone-number-lifecycle-mvp/', import.meta.url);
const db = JSON.parse(fs.readFileSync(new URL('phone-database.json', root), 'utf8'));
const idx = JSON.parse(fs.readFileSync(new URL('phone-search-index.json', root), 'utf8'));
const ids = new Set(db.routes.map(x => x.id));
assert.ok(db.markets.length >= 6, 'normalized database must cover existing multi-market inventory');
assert.ok(db.routes.length >= 15, 'normalized database must not collapse back to the four-route UK UI');
assert.equal(ids.size, db.routes.length, 'route ids must be unique');
assert.equal(idx.routes.length, db.routes.length, 'search index must contain every normalized route');
assert.ok(db.aliases.some(x => x.aliasId === 'giffgaff-uk' && x.routeId === 'giffgaff-uk-direct-esim-payg'));
assert.ok(!ids.has('giffgaff-uk'), 'legacy alias must not appear as duplicate canonical route');

const tello = searchPhoneRoutes(idx.routes, 'Tello');
assert.ok(tello.some(x => x.id === 'tello-us'));
assert.ok(tello.some(x => x.id === 'tello-paygo-credit-2026'));
const japan = searchPhoneRoutes(idx.routes, 'Japan', { family: 'long-term' });
assert.ok(japan.some(x => x.id === 'mobal-japan-voice-data'));
assert.ok(japan.some(x => x.id === 'sakura-japan-voice-data'));
const croatia = searchPhoneRoutes(idx.routes, 'Croatia esim');
assert.equal(croatia[0]?.id, 'a1-croatia-prepaid-esim');
const temp = searchPhoneRoutes(idx.routes, '', { family: 'temporary' });
assert.ok(temp.length >= 3);
const fiveSim = db.routes.find(x => x.id === '5sim-temp');
const fiveSimProfile = db.snapshots.find(x => x.routeId === '5sim-temp' && x.kind === 'current-profile');
const fiveSimMetric = db.routeMetrics.find(x => x.routeId === '5sim-temp');
const fiveSimSummary = idx.routes.find(x => x.id === '5sim-temp');
assert(fiveSim && fiveSimProfile && fiveSimMetric && fiveSimSummary);
assert.equal(fiveSim.family, 'temporary');
assert.equal(fiveSim.evidenceState, 'hold');
assert.equal(fiveSim.sourceIds.length, 8);
assert.equal(fiveSimProfile.data.guideEligible, false);
assert.equal(fiveSimProfile.data.keep.yearCostOriginal, null);
assert.equal(fiveSimProfile.data.landedCost.landedOriginal, null);
assert.equal(fiveSimMetric.metricState, 'current-profile');
assert.equal(fiveSimMetric.acquisitionCostOriginal, null);
assert.equal(fiveSimMetric.keepYearCostOriginal, null);
assert.equal(fiveSimSummary.decisionFacts.sourceCount, 8);
assert.equal(fiveSimSummary.serviceEvidence.length, 0);
assert(!db.aliases.some(x => x.aliasId === '5sim-temp'), '5SIM is a distinct marketplace, not a same-product alias');
const fiveSimDetail = JSON.parse(fs.readFileSync(new URL('phone-route-data/5sim-temp.json', root), 'utf8'));
assert.equal(fiveSimDetail.sources.length, 8);
assert.equal(fiveSimDetail.events.length, 2);
assert.equal(fiveSimDetail.snapshots.filter(x => x.kind === 'current-profile').length, 1);
const gb = searchPhoneRoutes(idx.routes, '', { marketId: 'gb' });
assert.ok(gb.length >= 7, 'UK canonical coverage must preserve the established routes while allowing reviewed additions');
assert.ok(gb.some(x => x.id === 'tesco-mobile-payg-uk-2026'));

const whatsapp = searchPhoneRoutes(idx.routes, 'WhatsApp', { marketId: 'gb' });
assert.ok(whatsapp.some(x => x.id === 'lebara-uk-direct-esim-china'));
const detailDir = new URL('phone-route-data/', root);
for (const route of db.routes) {
  const detail = JSON.parse(fs.readFileSync(new URL(`${route.id}.json`, detailDir), 'utf8'));
  assert.equal(detail.route.id, route.id, `detail bundle mismatch for ${route.id}`);
}

const keepCheap = searchPhoneRoutes(idx.routes, '', { marketId: 'gb', family: 'long-term', surfaceState: 'public-pilot', sort: 'keep-cost' });
assert.equal(keepCheap[0]?.id, 'voxi-uk-esim-payg-retention');
const keepLongest = searchPhoneRoutes(idx.routes, '', { marketId: 'gb', family: 'long-term', surfaceState: 'public-pilot', sort: 'keep-window' });
assert.ok(['voxi-uk-esim-payg-retention','giffgaff-uk-direct-esim-payg'].includes(keepLongest[0]?.id));
const waEvidence = searchPhoneRoutes(idx.routes, '', { marketId: 'gb', surfaceState: 'public-pilot', serviceId: 'whatsapp', sort: 'service-evidence' });
assert.equal(waEvidence[0]?.id, 'lebara-uk-direct-esim-china');
const fixtureRanges = [
  {id:'r-short',marketId:'gb',e164Prefix:'+4477',allocationProviderName:'Example A'},
  {id:'r-long',marketId:'gb',e164Prefix:'+447700',allocationProviderName:'Example B'}
];
assert.equal(lookupNumberRange(fixtureRanges, '+44 7700 900123')?.id, 'r-long');
assert.match(lookupNumberRange(fixtureRanges, '+44 7700 900123')?.portabilityNotice || '', /ported number/i);

const comparisonIdx = JSON.parse(fs.readFileSync(new URL('../frontend/tools/phone-number-lifecycle-mvp/comparison-route-index.json', import.meta.url), 'utf8'));
assert.equal(comparisonIdx.routeCount, 135, 'comparison route index must preserve 135 routes');
assert.equal(comparisonIdx.routes.length, 135, 'comparison route index row count must preserve 135 routes');
assert.ok(comparisonIdx.routes.some(r => r.marketName === 'United Kingdom'));
assert.ok(comparisonIdx.routes.some(r => r.marketName !== 'United Kingdom'));
assert.ok(comparisonIdx.routes.every(r => ['comparison-visible','detail-eligible','indexable'].includes(r.publicationState)));

console.log(`Phone DB tests passed: ${db.routes.length} routes, ${db.markets.length} markets, ${idx.routes.length} searchable records.`);
