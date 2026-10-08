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
  'globe-prepaid-1yr-2026': ['ph','globe-prepaid','globe-ph'],
  'turkcell-tourist-90d-blocker-2026': ['tr','turkcell-tourist','turkcell-tr'],
  'du-prepaid-ae-2026': ['ae','du-prepaid','du-ae'],
  'viettel-vtvang-keepnumber-2026': ['vn','viettel-prepaid','viettel-vn'],
};
for (const [routeId, [marketId, brandId, networkId]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId);
  assert(route, `batch-J canonical route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId);
  assert.equal(route.surfaceState, 'backstage-only'); assert.equal(route.evidenceState, 'hold');
  assert(brands.some((row) => row.id === brandId && row.marketId === marketId), `${routeId}: brand missing`);
  assert(networks.some((row) => row.id === networkId && row.marketId === marketId), `${routeId}: network missing`);
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https:\/\//.test(row.url)), `${routeId}: source missing ${id}`);
  const legacy = globalDirectory.routes.find((row) => row.id === routeId); assert(legacy, `${routeId}: comparison row missing`);
  if (routeId === 'turkcell-tourist-90d-blocker-2026' || routeId === 'viettel-vtvang-keepnumber-2026') {
    // The 2026-09 intake/comparison baseline stays immutable for maintained Turkcell and Viettel current-state evidence.
    const packet = read(`data/phone/review-packets/${routeId}.json`);
    const historical = {
      ...canonical,
      routes: canonical.routes.map((r) => r.id === routeId ? packet.route : r),
      snapshots: canonical.snapshots.map((s) => s.routeId === routeId && s.kind === 'current-profile' ? packet.snapshots.find((p) => p.kind === 'current-profile') : s),
    };
    assert.deepEqual(buildCanonicalComparisonRoute(historical, routeId), legacy, `${routeId}: immutable historical comparison parity required`);
  } else {
    assert.deepEqual(buildCanonicalComparisonRoute(canonical, routeId), legacy, `${routeId}: exact adapter parity required`);
  }
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const globe = globalDirectory.routes.find((r) => r.id === 'globe-prepaid-1yr-2026');
assert.equal(globe.keep.intervalDays, 30); assert.match(globe.holdReason, /30 days/i); assert.match(globe.roamingSms, /receive incoming texts for free/i);
const turkcell = globalDirectory.routes.find((r) => r.id === 'turkcell-tourist-90d-blocker-2026');
assert.equal(turkcell.keep.intervalDays, null); assert.match(turkcell.keep.action, /repealed/i); assert.equal(turkcell.avoidRoute, true);
const du = globalDirectory.routes.find((r) => r.id === 'du-prepaid-ae-2026');
assert.equal(du.keep.observedActionCost, 5); assert.equal(du.keep.intervalDays, 90); assert.match(du.holdReason, /short-term/i);
const viettel = globalDirectory.routes.find((r) => r.id === 'viettel-vtvang-keepnumber-2026');
assert.equal(viettel.keep.observedActionCost, 50000); assert.equal(viettel.keep.intervalDays, 365); assert.match(viettel.holdReason, /first-party/i);
assert(manifest.admittedBatches.includes('ph-tr-ae-vn-directory-batch-j.json'));
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical PH/TR/AE/VN batch-J migration passed: four HOLD routes have exact comparison parity and publication remains unchanged.');
