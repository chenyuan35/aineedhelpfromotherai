import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCanonicalComparisonRoute } from './phone-canonical-comparison-adapter.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => JSON.parse(fs.readFileSync(path.join(repo, file), 'utf8'));
const routeId = 'mtn-ng-keepmynumber-2026';
const routes = read('data/phone/v1/routes.json');
const markets = read('data/phone/v1/markets.json');
const snapshots = read('data/phone/v1/snapshots.json');
const sources = read('data/phone/v1/sources.json');
const events = read('data/phone/v1/events.json');
const observations = read('data/phone/v1/observations.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const summaries = read('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json');
const detail = read('frontend/tools/phone-number-lifecycle-mvp/phone-route-data/mtn-ng-keepmynumber-2026.json');
const comparison = read('frontend/tools/phone-number-lifecycle-mvp/comparison-route-index.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const route = routes.find(x => x.id === routeId);
assert(route);
assert.equal(route.lastVerifiedAt, '2026-10-08');
assert.equal(route.form, 'physical + eSIM');
assert.equal(route.surfaceState, 'backstage-only');
assert.equal(route.evidenceState, 'admitted');
assert.equal(route.sourceIds.length, 9);
for (const id of route.sourceIds) assert(sources.some(x => x.id === id), `missing source ${id}`);

const profile = snapshots.find(x => x.routeId === routeId && x.kind === 'current-profile');
assert(profile);
assert.equal(profile.checkedAt, '2026-10-08');
assert.equal(profile.data.keep.observedActionCost, 7500);
assert.equal(profile.data.keep.intervalDays, 1095);
assert.equal(profile.data.keep.yearCostOriginal, 2500);
assert.equal(profile.data.guideEligible, false);
assert.match(profile.data.chinaActivation, /MTN store|Nigeria-side/i);
assert.match(profile.data.payment, /card|bank-transfer/i);
assert.match(profile.data.roamingSms, /China/);
assert.match(profile.data.roamingSms, /unquantified/);
assert.match(profile.data.tariffSummary, /NCC rules/);

const routeEvents = events.filter(x => x.routeId === routeId);
assert(routeEvents.some(x => x.type === 'regulatory-lifecycle-reconciliation'));
assert(routeEvents.some(x => x.type === 'number-reassignment-incident'));
assert(routeEvents.some(x => /six months/i.test(x.outcome)));
assert.equal(observations.filter(x => x.routeId === routeId).length, 0);

const legacy = globalDirectory.routes.find(x => x.id === routeId);
assert.deepEqual(buildCanonicalComparisonRoute({ routes, markets, snapshots }, routeId), legacy);
assert.equal(globalDirectory.routes.length, 135);
assert.equal(policy.routeStates[routeId], 'comparison-visible');
assert.equal(Object.values(policy.routeStates).filter(x => x === 'indexable').length, 3);

const summary = summaries.routes.find(x => x.id === routeId);
assert(summary);
assert.equal(summary.metrics.keepYearCostOriginal, 2500);
assert.equal(summary.metrics.keepIntervalDays, 1095);
assert.equal(summary.decisionFacts.sourceCount, 9);
assert.equal(summary.decisionFacts.continuityRiskSignalCount, 2);
assert.equal(summary.decisionFacts.lastContinuityRiskSignalAt, '2026-10-08');

const comparisonRow = comparison.routes.find(x => x.id === routeId);
assert(comparisonRow);
assert.equal(comparisonRow.keepYearCostOriginal, 2500);
assert.equal(comparisonRow.keepIntervalDays, 1095);
assert.equal(comparisonRow.sourceCount, 9);

assert.equal(detail.route.lastVerifiedAt, '2026-10-08');
assert.equal(detail.sources.length, 9);
assert.equal(detail.events.length, 4);
assert.equal(sources.length, 754);
console.log('MTN Nigeria Keep My Number maintenance passed.');
