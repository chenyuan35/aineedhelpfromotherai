import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const canonical = { routes: read('data/phone/v1/routes.json'), markets: read('data/phone/v1/markets.json'), snapshots: read('data/phone/v1/snapshots.json') };
const sources = read('data/phone/v1/sources.json');
const brands = read('data/phone/v1/brands.json');
const networks = read('data/phone/v1/networks.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const manifest = read('frontend/tools/phone-number-lifecycle-mvp/batch-admission-manifest.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const expected = {
  'three-ie-prepay-lifecycle-2026': ['ie','three-ie-prepay','three-ie'],
  'orange-pl-nakarte-2026': ['pl','orange-pl-nakarte','orange-pl'],
  'vodafone-yorn-pt-2026': ['pt','vodafone-yorn','vodafone-pt'],
  'a1-hr-prepaid-2026': ['hr','a1-hr-prepaid','a1-hr'],
};
for (const [routeId, [marketId, brandId, networkId]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `batch-K canonical route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId);
  assert.equal(route.surfaceState, 'backstage-only'); assert.equal(route.evidenceState, 'hold');
  assert(brands.some((row) => row.id === brandId && row.marketId === marketId), `${routeId}: brand missing`);
  assert(networks.some((row) => row.id === networkId && row.marketId === marketId), `${routeId}: network missing`);
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: source missing ${id}`);
  const legacy = globalDirectory.routes.find((row) => row.id === routeId); assert(legacy, `${routeId}: comparison row missing`);
  assert.deepEqual(buildCanonicalComparisonRoute(canonical, routeId), legacy, `${routeId}: exact adapter parity required`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const three = globalDirectory.routes.find((r) => r.id === 'three-ie-prepay-lifecycle-2026');
assert.equal(three.keep.intervalDays, null); assert.match(three.keep.state, /conflict/); assert.equal(three.guideEligible, false);
const orange = globalDirectory.routes.find((r) => r.id === 'orange-pl-nakarte-2026');
assert.equal(orange.keep.observedActionCost, 39); assert.equal(orange.keep.intervalDays, 365); assert.match(orange.tariffSummary, /PLN39/);
const yorn = globalDirectory.routes.find((r) => r.id === 'vodafone-yorn-pt-2026');
assert.equal(yorn.keep.intervalDays, 7); assert.match(yorn.keep.action, /incoming calls and SMS are blocked/i);
const a1 = globalDirectory.routes.find((r) => r.id === 'a1-hr-prepaid-2026');
assert.equal(a1.keep.observedActionCost, 5); assert.equal(a1.keep.intervalDays, null); assert.match(a1.holdReason, /validity duration/i);
assert(manifest.admittedBatches.includes('ie-pl-pt-hr-directory-batch-k.json'));
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical IE/PL/PT/HR batch-K migration passed: four HOLD routes have exact comparison parity and publication remains unchanged.');
