import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(repo, p), 'utf8'));
const canonical = { routes: read('data/phone/v1/routes.json'), markets: read('data/phone/v1/markets.json'), snapshots: read('data/phone/v1/snapshots.json') };
const brands = read('data/phone/v1/brands.json');
const networks = read('data/phone/v1/networks.json');
const sources = read('data/phone/v1/sources.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const expected = new Map([
  ['cmlink-uk-keep-number-2026', ['gb', 'cmlink-uk', 'ee-uk']],
  ['dito-prepaid-ph-2026', ['ph', 'dito-prepaid', 'dito-ph']],
  ['ais-local-prepaid-th-2026', ['th', 'ais-local-prepaid', 'ais-th']]
]);
for (const [id, [marketId, brandId, networkId]] of expected) {
  const route = canonical.routes.find((row) => row.id === id);
  assert(route, `missing DB-C22 route ${id}`);
  assert.equal(route.marketId, marketId);
  assert.equal(route.brandId, brandId);
  assert.equal(route.networkId, networkId);
  assert.equal(route.evidenceState, 'hold');
  assert.equal(route.surfaceState, 'backstage-only');
  assert(route.sourceIds.length >= 3, `${id} should retain multi-source provenance`);
  assert.equal(policy.routeStates[id], undefined, `${id} must not receive a public publication state`);
}

const cmlink = buildCanonicalComparisonRoute(canonical, 'cmlink-uk-keep-number-2026');
assert.equal(cmlink.keep.intervalDays, 365);
assert.equal(cmlink.keep.observedActionCost, 15);
assert.match(cmlink.holdReason, /eligibility|closure|SMS|operational/i);

const dito = buildCanonicalComparisonRoute(canonical, 'dito-prepaid-ph-2026');
assert.equal(dito.keep.intervalDays, null);
assert.equal(dito.keep.observedActionCost, null);
assert.match(dito.kyc, /tourist|passport|address|return ticket/i);
assert.match(dito.holdReason, /30-day|PHP5|PHP10|provider/i);

const ais = buildCanonicalComparisonRoute(canonical, 'ais-local-prepaid-th-2026');
assert.equal(ais.keep.intervalDays, 30);
assert.equal(ais.keep.observedActionCost, 30);
assert.match(ais.holdReason, /durable|remote|mainland|multi-year/i);
assert.notEqual(ais.brandId, 'ais-sim2fly');

assert.equal(canonical.routes.length, 159);
assert.equal(canonical.markets.length, 87);
assert.equal(brands.length, 156);
assert.equal(networks.length, 117);
assert.ok(sources.length >= 599, `source corpus regressed below Saily baseline: ${sources.length}`);
const canonicalIds = new Set(canonical.routes.map((row) => row.id));
const legacyOnly = globalDirectory.routes.map((row) => row.id).filter((id) => !canonicalIds.has(id));
assert.deepEqual(legacyOnly, ['sakura-mobile-voice-2026']);
assert.equal(globalDirectory.routes.length, 135);
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C22 migration passed: CMLink UK, DITO PH and AIS local normalized as HOLD; 135 comparison routes and 3-route indexability preserved.');
