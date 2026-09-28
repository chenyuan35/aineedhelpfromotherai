import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const canonical = {
  routes: read('data/phone/v1/routes.json'),
  markets: read('data/phone/v1/markets.json'),
  snapshots: read('data/phone/v1/snapshots.json'),
};
const sources = read('data/phone/v1/sources.json');
const brands = read('data/phone/v1/brands.json');
const networks = read('data/phone/v1/networks.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const manifest = read('frontend/tools/phone-number-lifecycle-mvp/batch-admission-manifest.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const expected = {
  'speakout-711-365voucher-2026': ['ca','speakout-711','rogers-ca'],
  'telcel-amigo-lifecycle-2026': ['mx','telcel-amigo','telcel-mx'],
  'jio-prepaid-90d-trai-2026': ['in','jio-prepaid','jio-in'],
  'orange-mobicarte-2026': ['fr','orange-mobicarte','orange-fr'],
  'sunrise-prepaid-2026': ['ch','sunrise-prepaid','sunrise-ch'],
};
for (const [routeId, [marketId, brandId, networkId]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `batch-I canonical route missing: ${routeId}`);
  assert.equal(route.marketId, marketId);
  assert.equal(route.brandId, brandId);
  assert.equal(route.networkId, networkId);
  assert.equal(route.surfaceState, 'backstage-only');
  assert.equal(route.evidenceState, 'hold');
  assert(brands.some((row) => row.id === brandId && row.marketId === marketId), `${routeId}: brand missing`);
  assert(networks.some((row) => row.id === networkId && row.marketId === marketId), `${routeId}: network missing`);
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: source missing ${id}`);
  const legacy = globalDirectory.routes.find((row) => row.id === routeId);
  assert(legacy, `${routeId}: comparison row missing`);
  assert.deepEqual(buildCanonicalComparisonRoute(canonical, routeId), legacy, `${routeId}: exact adapter parity required`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}

const speakout = globalDirectory.routes.find((r) => r.id === 'speakout-711-365voucher-2026');
assert.equal(speakout.keep.observedActionCost, 19);
assert.match(speakout.roamingSms, /does not roam outside Canada/i);
assert.match(speakout.holdReason, /does not roam outside Canada/i);

const telcel = globalDirectory.routes.find((r) => r.id === 'telcel-amigo-lifecycle-2026');
assert.equal(telcel.keep.observedActionCost, 10);
assert.equal(telcel.keep.intervalDays, 365);
assert.match(telcel.kyc, /Mandatory 2026 line registration/i);
assert.match(telcel.holdReason, /Tourist eSIM/i);

const jio = globalDirectory.routes.find((r) => r.id === 'jio-prepaid-90d-trai-2026');
assert.equal(jio.keep.observedActionCost, 20);
assert.equal(jio.keep.yearCostOriginal, 200);
assert.match(jio.keep.action, /Automatic Number Retention/i);
assert.match(jio.roamingSms, /incoming SMS free/i);

const orange = globalDirectory.routes.find((r) => r.id === 'orange-mobicarte-2026');
assert.equal(orange.keep.observedActionCost, 10);
assert.equal(orange.keep.yearCostOriginal, 20);
assert.equal(orange.avoidRoute, true);
assert.match(orange.holdReason, /stable-link/i);

const sunrise = globalDirectory.routes.find((r) => r.id === 'sunrise-prepaid-2026');
assert.equal(sunrise.keep.observedActionCost, 10);
assert.equal(sunrise.keep.intervalDays, 510);
assert.match(sunrise.keep.action, /17 months/i);
assert.match(sunrise.chinaActivation, /foreign address/i);

assert(manifest.admittedBatches.includes('ca-fr-ch-mx-in-directory-batch-i.json'));
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical CA/FR/CH/MX/IN batch-I migration passed: five HOLD routes have exact comparison parity and publication remains unchanged.');
