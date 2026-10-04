import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const canonical = { routes: read('data/phone/v1/routes.json'), markets: read('data/phone/v1/markets.json'), snapshots: read('data/phone/v1/snapshots.json') };
const sources = read('data/phone/v1/sources.json'), brands = read('data/phone/v1/brands.json'), networks = read('data/phone/v1/networks.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');
const expected = {
  'vodafone-nl-prepaid-2026': ['nl', 'vodafone-nl-prepaid', 'vodafone-nl', 'admitted'],
  'ctexcel-uk-2026': ['gb', 'ctexcel-uk', 'ee-uk', 'hold'],
  'one-nz-prepay-2026': ['nz', 'one-nz-prepay', 'one-nz', 'admitted'],
};
for (const [routeId, [marketId, brandId, networkId, evidenceState]] of Object.entries(expected)) {
  const route = canonical.routes.find((row) => row.id === routeId); assert(route, `DB-C20 route missing: ${routeId}`);
  assert.equal(route.marketId, marketId); assert.equal(route.brandId, brandId); assert.equal(route.networkId, networkId); assert.equal(route.evidenceState, evidenceState); assert.equal(route.surfaceState, 'backstage-only');
  assert(canonical.markets.some((row) => row.id === marketId)); assert(brands.some((row) => row.id === brandId && row.marketId === marketId)); assert(networks.some((row) => row.id === networkId && row.marketId === marketId));
  for (const id of route.sourceIds) assert(sources.some((row) => row.id === id && /^https?:\/\//.test(row.url)), `${routeId}: missing source ${id}`);
  assert.equal(policy.routeStates[routeId], undefined, `${routeId}: must stay non-indexable`);
}
const vodafone = buildCanonicalComparisonRoute(canonical, 'vodafone-nl-prepaid-2026');
assert.equal(vodafone.keep.intervalDays, 180); assert.equal(vodafone.keep.observedActionCost, 0.15); assert.equal(vodafone.keep.yearCostOriginal, 0.3); assert.match(vodafone.keep.action, /six months|paid/i); assert.match(vodafone.chinaActivation, /variable|not provider-guaranteed/i);
const ctexcel = buildCanonicalComparisonRoute(canonical, 'ctexcel-uk-2026');
assert.equal(ctexcel.keep.intervalDays, null); assert.equal(ctexcel.keep.yearCostOriginal, null); assert.match(ctexcel.holdReason, /eligibility|90-day|plan/i); assert.match(ctexcel.roamingSms, /China|SMS/i);
const one = buildCanonicalComparisonRoute(canonical, 'one-nz-prepay-2026');
assert.equal(one.keep.intervalDays, 360); assert.equal(one.keep.observedActionCost, 10); assert.equal(one.keep.yearCostOriginal, 10.14); assert.match(one.chinaActivation, /coverage|China-first/i); assert.match(one.roamingSms, /China/i);
assert.equal(canonical.routes.length, 157); assert.equal(canonical.markets.length, 86); assert.equal(brands.length, 154); assert.equal(networks.length, 116); assert.ok(sources.length >= 599, `source corpus regressed below Saily baseline: ${sources.length}`);
const canonicalIds = new Set(canonical.routes.map((row) => row.id));
const legacyOnly = globalDirectory.routes.map((row) => row.id).filter((id) => !canonicalIds.has(id));
assert.deepEqual(legacyOnly, ['sakura-mobile-voice-2026']);
assert.equal(globalDirectory.routes.length, 135); assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);
console.log('Phone canonical DB-C20 migration passed: Vodafone NL ADMIT, CTExcel UK HOLD, One NZ ADMIT; 135 comparison routes and 3-route indexability preserved.');
