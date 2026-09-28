import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const routeIds = ['aldi-talk-activity-window-2026', 'vodafone-callya-90d-2026', 'hotlink-pantas-365-pass-2026'];
const canonical = { routes: read('data/phone/v1/routes.json'), markets: read('data/phone/v1/markets.json'), snapshots: read('data/phone/v1/snapshots.json') };
const sources = read('data/phone/v1/sources.json');
const networks = read('data/phone/v1/networks.json');
const brands = read('data/phone/v1/brands.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const manifest = read('frontend/tools/phone-number-lifecycle-mvp/batch-admission-manifest.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const expected = {
  'aldi-talk-activity-window-2026': { marketId: 'de', networkId: 'telefonica-de', brandId: 'aldi-talk', evidenceState: 'admitted' },
  'vodafone-callya-90d-2026': { marketId: 'de', networkId: 'vodafone-de', brandId: 'vodafone-callya', evidenceState: 'hold' },
  'hotlink-pantas-365-pass-2026': { marketId: 'my', networkId: 'maxis-my', brandId: 'hotlink-my', evidenceState: 'admitted' },
};

for (const routeId of routeIds) {
  const e = expected[routeId];
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `DE/MY route missing from canonical: ${routeId}`);
  assert.equal(route.marketId, e.marketId);
  assert.equal(route.networkId, e.networkId);
  assert.equal(route.brandId, e.brandId);
  assert.equal(route.surfaceState, 'backstage-only');
  assert.equal(route.evidenceState, e.evidenceState);
  assert(networks.some((row) => row.id === route.networkId && row.marketId === route.marketId));
  assert(brands.some((row) => row.id === route.brandId && row.marketId === route.marketId && row.networkId === route.networkId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  const legacy = globalDirectory.routes.find((row) => row.id === routeId);
  assert(legacy, `legacy row missing: ${routeId}`);
  assert.deepEqual(buildCanonicalComparisonRoute(canonical, routeId), legacy, `${routeId}: canonical adapter parity must be exact`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId} must stay non-indexable`);
}

const aldi = globalDirectory.routes.find((row) => row.id === 'aldi-talk-activity-window-2026');
assert.equal(aldi.landedCost.landedOriginal, 9.99, 'ALDI TALK current official starter price is €9.99');
assert.equal(aldi.keep.observedActionCost, 5);
assert.equal(aldi.keep.intervalDays, 120);
assert.equal(sources.find((row) => row.id === 'official-alditalk-aktivitaetszeitfenster-pdf-2026-01')?.url, 'https://media.medion.com/cms/medion/alditalkde/ALDI-TALK-Aktivitaetszeitfenster-der-SIM-Karte.pdf?v=0426');

const vodafone = globalDirectory.routes.find((row) => row.id === 'vodafone-callya-90d-2026');
assert.equal(vodafone.landedCost.landedOriginal, 0, 'CallYa Classic SIM/eSIM activation and shipping are currently free');
assert.equal(vodafone.keep.intervalDays, 90);
assert.equal(sources.find((row) => row.id === 'official-vodafone-prepaid-hilfe-2026-09-26')?.url, 'https://www.vodafone.de/hilfe/prepaid.html');
assert.equal(sources.find((row) => row.id === 'official-callya-faq-via-prepaid-deutschland-2025-08')?.url, 'https://www.prepaid-deutschland.de/sim-aktiv-halten-was-bedeutet-nutzen-bei-der-callya-prepaid-karte/');

const hotlink = globalDirectory.routes.find((row) => row.id === 'hotlink-pantas-365-pass-2026');
assert.equal(hotlink.keep.observedActionCost, 30);
assert.equal(hotlink.keep.intervalDays, 365);
assert(!hotlink.tariffSummary.startsWith('RM2/yr'), 'Hotlink RM2 data pass must not be represented as SIM retention');
assert(!hotlink.guideSteps.some((step) => /Buy RM2 365-day pass/.test(step)), 'Hotlink guide must not preserve the refuted RM2 keep-alive instruction');
assert.equal(sources.find((row) => row.id === 'official-hotlink-pantas-passes-faq-2026-09-26')?.url, 'https://www.hotlink.com.my/en/faq/products/prepaid-pantas/passes/');

assert(manifest.admittedBatches.includes('de-my-directory-batch-f.json'));
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DE/MY migration passed: ALDI TALK + CallYa + Hotlink parity exact; 135 comparison routes and 3 indexable routes preserved.');
