import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const routeId = 'cmhk-mysim-hk-2026';
const routes = read('data/phone/v1/routes.json');
const markets = read('data/phone/v1/markets.json');
const snapshots = read('data/phone/v1/snapshots.json');
const sources = read('data/phone/v1/sources.json');
const observations = read('data/phone/v1/observations.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const summaries = read('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json');
const detail = read('frontend/tools/phone-number-lifecycle-mvp/phone-route-data/cmhk-mysim-hk-2026.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const route = routes.find(x => x.id === routeId);
assert(route);
assert.equal(route.lastVerifiedAt, '2026-10-07');
assert.equal(route.form, 'physical + eSIM conversion');
assert.equal(route.surfaceState, 'backstage-only');
assert.equal(route.evidenceState, 'admitted');
assert.equal(route.sourceIds.length, 12);
for (const id of route.sourceIds) assert(sources.some(x => x.id === id), `missing source ${id}`);

const profile = snapshots.find(x => x.routeId === routeId && x.kind === 'current-profile');
assert(profile);
assert.equal(profile.checkedAt, '2026-10-07');
assert.equal(profile.data.landedCost.landedOriginal, 38);
assert.equal(profile.data.keep.observedActionCost, 50);
assert.equal(profile.data.keep.intervalDays, 180);
assert.equal(profile.data.keep.yearCostOriginal, 100);
assert.equal(profile.data.guideEligible, false);
assert.match(profile.data.keep.action, /standing CMHK official refill guide/);
assert.match(profile.data.chinaActivation, /cannot be activated in Mainland China/);
assert.match(profile.data.roamingSms, /adjacent-product evidence/);
assert.match(profile.data.roamingSms, /No current exact-4G bank\/app success rate/);

const legacy = globalDirectory.routes.find(x => x.id === routeId);
assert.deepEqual(buildCanonicalComparisonRoute({ routes, markets, snapshots }, routeId), legacy);
assert.equal(globalDirectory.routes.length, 135);
assert.equal(policy.routeStates[routeId], undefined);
assert.equal(Object.values(policy.routeStates).filter(x => x === 'indexable').length, 3);

const summary = summaries.routes.find(x => x.id === routeId);
assert(summary);
assert.equal(summary.metrics.acquisitionCostOriginal, 38);
assert.equal(summary.metrics.keepYearCostOriginal, 100);
assert.equal(summary.decisionFacts.sourceCount, 12);
assert.equal(summary.decisionFacts.kycState, 'required');
assert.equal(detail.route.lastVerifiedAt, '2026-10-07');
assert.equal(observations.filter(x => x.routeId === routeId).length, 0);
assert.equal(sources.length, 747);
console.log('CMHK MySIM maintenance passed.');
