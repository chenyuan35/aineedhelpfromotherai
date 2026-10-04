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
  ['esimgg-estonia-372-2026', ['ee', 'esimgg-estonia', 'esimgg-ee', 'admitted']],
  ['hkmobi-365-hk-2026', ['hk', 'hkmobi-hk', 'csl-hk', 'admitted']]
]);
for (const [id, [marketId, brandId, networkId, evidenceState]] of expected) {
  const route = canonical.routes.find((row) => row.id === id);
  assert(route, `missing DB-C23 route ${id}`);
  assert.equal(route.marketId, marketId);
  assert.equal(route.brandId, brandId);
  assert.equal(route.networkId, networkId);
  assert.equal(route.evidenceState, evidenceState);
  assert.equal(route.surfaceState, 'backstage-only');
  assert(route.sourceIds.length >= 3);
  assert.equal(policy.routeStates[id], undefined);
}

const gg = buildCanonicalComparisonRoute(canonical, 'esimgg-estonia-372-2026');
assert.equal(gg.keep.intervalDays, 365);
assert.equal(gg.keep.observedActionCost, null);
assert.match(gg.roamingSms, /GPT|WhatsApp|Telegram|prefix/i);
assert.equal(gg.holdReason, null);

const hk = buildCanonicalComparisonRoute(canonical, 'hkmobi-365-hk-2026');
assert.equal(hk.keep.intervalDays, 365);
assert.equal(hk.keep.observedActionCost, 20);
assert.equal(hk.keep.yearCostOriginal, 20);
assert.match(hk.kyc, /real-name/i);
assert.match(hk.keep.state, /20261231|promo/i);
assert.equal(hk.holdReason, null);

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
console.log('Phone canonical DB-C23 migration passed: eSIM.GG +372 and HK Mobi 365 admitted backstage; public boundary preserved.');
