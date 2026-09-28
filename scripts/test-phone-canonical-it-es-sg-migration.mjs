import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const routeIds = ['tim-prepaid-12mo-2026', 'movistar-prepago-6mo-2026', 'singtel-hi-prepaid-passport-30d-2026'];
const canonical = { routes: read('data/phone/v1/routes.json'), markets: read('data/phone/v1/markets.json'), snapshots: read('data/phone/v1/snapshots.json') };
const sources = read('data/phone/v1/sources.json');
const networks = read('data/phone/v1/networks.json');
const brands = read('data/phone/v1/brands.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const manifest = read('frontend/tools/phone-number-lifecycle-mvp/batch-admission-manifest.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const expected = {
  'tim-prepaid-12mo-2026': { marketId: 'it', networkId: 'tim-it', brandId: 'tim-prepaid', evidenceState: 'admitted' },
  'movistar-prepago-6mo-2026': { marketId: 'es', networkId: 'movistar-es', brandId: 'movistar-prepago', evidenceState: 'admitted' },
  'singtel-hi-prepaid-passport-30d-2026': { marketId: 'sg', networkId: 'singtel-sg', brandId: 'singtel-hi', evidenceState: 'hold' },
};
for (const routeId of routeIds) {
  const e = expected[routeId];
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `IT/ES/SG route missing from canonical: ${routeId}`);
  assert.equal(route.marketId, e.marketId); assert.equal(route.networkId, e.networkId); assert.equal(route.brandId, e.brandId);
  assert.equal(route.surfaceState, 'backstage-only'); assert.equal(route.evidenceState, e.evidenceState);
  assert(networks.some((row) => row.id === route.networkId && row.marketId === route.marketId));
  assert(brands.some((row) => row.id === route.brandId && row.marketId === route.marketId && row.networkId === route.networkId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  const legacy = globalDirectory.routes.find((row) => row.id === routeId); assert(legacy, `legacy row missing: ${routeId}`);
  assert.deepEqual(buildCanonicalComparisonRoute(canonical, routeId), legacy, `${routeId}: canonical adapter parity must be exact`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId} must stay non-indexable`);
}
const sourceUrl=(id)=>sources.find((row)=>row.id===id)?.url;
assert.equal(sourceUrl('official-tim-riattivare-sim-2026-09-26'),'https://www.tim.it/assistenza/per-la-tua-linea/riattivare-una-sim');
assert.equal(sourceUrl('official-movistar-community-saldo-vigencia-2026-09-26'),'https://comunidad.movistar.es/kb/Gestiones/%C2%BFcu%C3%A1l-es-la-vigencia-del-saldo-de-movistar-%C2%BFcuando-caduca/4535087');
assert.equal(sourceUrl('official-singtel-prepaid-registration-2026-09-28'),'https://www.singtel.com/personal/products-services/mobile/prepaid-plans/hi-sim-cards-id-registration');
const tim=globalDirectory.routes.find((x)=>x.id==='tim-prepaid-12mo-2026'); assert.match(tim.keep.action,/EUR5/); assert.match(tim.acquisitionSummary,/11 months after expiry/);
const mov=globalDirectory.routes.find((x)=>x.id==='movistar-prepago-6mo-2026'); assert.match(mov.acquisitionSummary,/54-day tail/); assert.equal(mov.keep.observedActionCost,5);
const sg=globalDirectory.routes.find((x)=>x.id==='singtel-hi-prepaid-passport-30d-2026'); assert.equal(sg.guideEligible,false); assert.equal(sg.avoidRoute,true); assert.match(sg.keep.action,/data-only/); assert.match(sg.holdReason,/Singapore-issued ID\/work pass/);
assert(manifest.admittedBatches.includes('it-es-sg-directory-batch-h.json'));
assert.equal(globalDirectory.routes.length,135); assert.equal(Object.values(policy.routeStates).filter((s)=>s==='indexable').length,3);
console.log('Phone canonical IT/ES/SG migration passed: TIM + Movistar parity exact; Singtel passport blocker preserved; 135 comparison routes and 3 indexable routes preserved.');
