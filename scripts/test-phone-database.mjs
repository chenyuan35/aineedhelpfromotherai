import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gradeServiceEvidence } from './phone-evidence-grading.mjs';
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

// One original 2025 Reddit firsthand case improves SMARTY operational provenance,
// not service-specific signup reliability or a China-first acquisition result.
const smartyRoute = db.routes.find(r=>r.id==='smarty-uk-2026');
const smartySource = db.sources.find(s=>s.id==='reddit-smarty-overseas-periodic-sms-1i0c96q-20250116');
const smartyEvent = db.events.find(e=>e.id==='evt-smarty-uk-1i0c96q-periodic-overseas-sms');
assert(smartyRoute && smartySource && smartyEvent);
assert.equal(smartyRoute.sourceIds.filter(x=>x===smartySource.id).length,1);
assert.equal(smartySource.url,'https://www.reddit.com/r/SmartyMobile/comments/1i0c96q');
assert.equal(smartySource.type,'first-hand-community-thread');
assert.equal(smartyEvent.sourceId,smartySource.id);
assert.equal(smartyEvent.routeId,smartyRoute.id);
assert.match(smartyEvent.outcome,/device off for weeks|device off/);
assert.match(smartyEvent.outcome,/NOT establish/);
assert.equal(db.observations.filter(o=>o.sourceId===smartySource.id).length,0,'unspecified SMS reception is not a bank, Telegram or app signup observation');
assert.equal(idx.routes.find(r=>r.id===smartyRoute.id)?.serviceEvidence.length,0,'new firsthand event must not invent verified named-app results');
assert.equal(idx.routes.find(r=>r.id===smartyRoute.id)?.decisionFacts.sourceCount,9);

console.log(`Phone DB tests passed: ${db.routes.length} routes, ${db.markets.length} markets, ${idx.routes.length} searchable records.`);

// S7: one primary failure discussion, two accounts, no invented named-app OTP.
const lebaraSource = db.sources.find(x=>x.id==='linuxdo-lebara-2815946-20260826');
const lebaraEvent = db.events.find(x=>x.id==='evt-lebara-mainland-no-signal-20260826');
const lebaraRoute = db.routes.find(x=>x.id==='lebara-uk-direct-esim-china');
const lebaraIndex = idx.routes.find(x=>x.id===lebaraRoute?.id);
assert(lebaraSource && lebaraEvent && lebaraRoute && lebaraIndex,'Lebara failure evidence normalized');
assert.equal(lebaraEvent.sourceId,lebaraSource.id);
assert.equal(lebaraRoute.sourceIds.filter(x=>x===lebaraSource.id).length,1);
assert.equal(lebaraIndex.decisionFacts.sourceCount,8);
assert.equal(lebaraIndex.eventCount,3);
assert(!db.observations.some(x=>x.sourceId===lebaraSource.id),'a failed network attach is not a named-app OTP failure');
const lebaraTelegramEvidence=lebaraIndex.serviceEvidence.find(x=>/Telegram/i.test(x.serviceName));
const lebaraWhatsappEvidence=lebaraIndex.serviceEvidence.find(x=>/WhatsApp/i.test(x.serviceName));
assert.equal(lebaraTelegramEvidence?.independentSourceCount,1);
assert.equal(lebaraWhatsappEvidence?.independentSourceCount,1);

// P0 #472: reports within one discussion remain person-level observations
// but cannot establish independent service reliability.
for (const evidence of [lebaraTelegramEvidence, lebaraWhatsappEvidence]) {
  assert.equal(evidence?.sampleSize, 2);
  assert.equal(evidence?.successCount, 2);
  assert.equal(evidence?.grade, 'insufficient');
  assert.equal(evidence?.label, 'Multiple reports in one original source');
  assert.equal(evidence?.confidence, 'very-low');
  assert.equal(evidence?.percentageEligible, false);
  assert.equal(evidence?.successRatePct, null);
}
for (const app of ['Telegram', 'WhatsApp']) {
  const reports = db.observations.filter(x => x.routeId === lebaraRoute.id && x.service === app && x.outcome === 'success');
  assert.equal(reports.length, 2, `${app}: preserve two user reports`);
  assert.equal(new Set(reports.map(x => x.sourceId)).size, 1, `${app}: one original discussion`);
}
const testReport = (i, sourceId) => ({
  dedupeKey: `distinct-author-${i}`, sourceId, outcome: 'success', reportedAt: '2026-10-01'
});
const sameThread = gradeServiceEvidence(Array.from({ length: 5 }, (_, i) => testReport(i, 'one-original-thread')));
assert.equal(sameThread.sampleSize, 5);
assert.equal(sameThread.independentSourceCount, 1);
assert.equal(sameThread.grade, 'insufficient');
assert.equal(sameThread.confidence, 'very-low');
assert.equal(sameThread.percentageEligible, false);
assert.equal(sameThread.successRatePct, null);
const twoOriginals = gradeServiceEvidence([testReport(1, 'original-a'), testReport(2, 'original-b')]);
assert.equal(twoOriginals.grade, 'B');
assert.equal(twoOriginals.confidence, 'low');
const fiveOriginals = gradeServiceEvidence(Array.from({ length: 5 }, (_, i) => testReport(i, `original-${i}`)));
assert.equal(fiveOriginals.grade, 'A');
assert.equal(fiveOriginals.confidence, 'high');
assert.equal(fiveOriginals.percentageEligible, true);
const negativeThread = gradeServiceEvidence([
  testReport(1, 'thread-a'), { ...testReport(2, 'thread-a'), outcome: 'failure' }
]);
assert.equal(negativeThread.grade, 'C', 'negative and mixed reports remain visible');
assert.equal(negativeThread.confidence, 'very-low');

// S8: ported-number China roaming signal is a separate operational event,
// never a new China-first acquisition or app OTP success.
const lebaraPortinSource = db.sources.find(x => x.id === 'nodeseek-lebara-869053-20260811');
const lebaraPortinEvent = db.events.find(x => x.id === 'evt-lebara-portin-mainland-signal-20260811');
assert(lebaraPortinSource && lebaraPortinEvent, 'port-in field report must be normalized');
assert.equal(lebaraPortinEvent.sourceId, lebaraPortinSource.id);
assert.equal(lebaraPortinEvent.routeId, 'lebara-uk-direct-esim-china');
assert.equal(lebaraRoute.sourceIds.filter(x => x === lebaraPortinSource.id).length, 1);
assert.match(lebaraPortinEvent.outcome, /post-port roaming-attach observation/i);
assert(!db.observations.some(x => x.sourceId === lebaraPortinSource.id),
  'port-in network signal is not an app verification observation');
assert.equal(lebaraTelegramEvidence?.grade, 'insufficient');
assert.equal(lebaraWhatsappEvidence?.grade, 'insufficient');
