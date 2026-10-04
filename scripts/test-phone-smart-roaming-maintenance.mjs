import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(repo, p), 'utf8'));
const routes = read('data/phone/v1/routes.json');
const sources = read('data/phone/v1/sources.json');
const events = read('data/phone/v1/events.json');
const snapshots = read('data/phone/v1/snapshots.json');
const detail = read('frontend/tools/phone-number-lifecycle-mvp/phone-route-data/smart-prepaid-ph-2026.json');
const globalDirectory = read('frontend/tools/phone-number-lifecycle-mvp/global-directory.json');
const policy = read('frontend/tools/phone-number-lifecycle-mvp/publication-policy.json');

const id = 'smart-prepaid-ph-2026';
const route = routes.find((row) => row.id === id);
assert(route, 'missing Smart Prepaid route');
assert.equal(route.surfaceState, 'backstage-only');
assert.equal(route.evidenceState, 'hold');
assert.equal(route.lastVerifiedAt, '2026-10-04');

const expectedSources = [
  'smart-prepaid-roaming-activation-20261004',
  'smart-prepaid-roaming-reload-20261004',
  'smart-prepaid-roaming-call-text-20261004',
  'smart-prepaid-roaming-sms-receive-20261004',
  'reddit-smart-esim-roaming-20260215',
  'reddit-smart-esim-acquisition-20260921',
  'reddit-smart-esim-activation-incident-20260929'
];
for (const sid of expectedSources) {
  assert(route.sourceIds.includes(sid), `Smart route missing source ${sid}`);
  assert(sources.some((row) => row.id === sid), `canonical sources missing ${sid}`);
  assert(detail.sources.some((row) => row.id === sid), `generated Smart detail missing ${sid}`);
}

const snapshot = snapshots.find((row) => row.id === 'snap-smart-prepaid-ph-2026-current-profile-20261004');
assert(snapshot, 'missing Smart 2026-10-04 maintenance snapshot');
assert.match(snapshot.data.roamingSms, /send|receive|SMS|roaming/i);
assert.match(snapshot.data.roamingSms, /OTP reliability remains unverified/i);
assert.match(snapshot.data.holdReason, /30 days|30-day/i);
assert.equal(snapshot.data.guideEligible, false);
assert(detail.snapshots.some((row) => row.id === snapshot.id), 'generated Smart detail missing maintenance snapshot');

for (const eid of [
  'evt-smart-prepaid-ph-2026-roaming-capability-20261004',
  'evt-smart-prepaid-ph-2026-roaming-activation-20261004',
  'evt-smart-prepaid-ph-2026-community-roaming-20260215',
  'evt-smart-prepaid-ph-2026-esim-activation-success-20260927',
  'evt-smart-prepaid-ph-2026-esim-activation-incident-20260929'
]) assert(events.some((row) => row.id === eid), `missing Smart evidence event ${eid}`);

assert.equal(routes.length, 158);
assert.ok(sources.length >= 611, `expected append-only source corpus >=611, got ${sources.length}`);
assert.equal(globalDirectory.routes.length, 135);
assert.equal(policy.routeStates[id], undefined, 'Smart HOLD maintenance must not grant a public route state');
assert.equal(Object.values(policy.routeStates).filter((state) => state === 'indexable').length, 3);

console.log('Smart roaming maintenance passed: roaming/SMS evidence refreshed; HOLD and publication boundary preserved.');
