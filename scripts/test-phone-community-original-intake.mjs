import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const inbox = read('data/phone/inbox/community-esimgg-saily-original-otp-2026-10-09.json');
const routes = read('data/phone/v1/routes.json');
const sources = read('data/phone/v1/sources.json');
const observations = read('data/phone/v1/observations.json');

assert.equal(inbox.schemaVersion, 1);
assert.equal(inbox.scope, 'real-number-original-user-service-verification');
assert.equal(inbox.publicationState, 'backstage-candidate-only');
assert.equal(inbox.newCanonicalSourceCount, 0);
assert.equal(inbox.newCanonicalObservationCount, 0);
assert.equal(inbox.sourcePolicy.oneThreadOnePrimaryUrl, true);
assert.equal(inbox.sourcePolicy.multiAuthorsWithinThreadCountAsIndependentSourceUrls, false);
assert.equal(inbox.sourcePolicy.votesAreOutcomes, false);
assert(routes.some((r) => r.id === inbox.canonicalRouteLink && r.numberClass === 'real-mobile'));
assert(routes.some((r) => r.id === 'saily-us-phone-number-2026' && r.numberClass === 'voip-second-line'));

const threadIds = new Set();
const threadUrls = new Set();
let n = 0;
for (const thread of inbox.threads) {
  assert(!threadIds.has(thread.threadId), 'one original discussion per thread id');
  assert(!threadUrls.has(thread.url), 'one original URL per discussion');
  assert(/^https:\/\/linux\.do\/t\/topic\/\d+$/.test(thread.url));
  assert.equal(thread.primarySourceRecordExistsInCanonical, false);
  assert(!sources.some((s) => s.url === thread.url), 'inbox source must remain distinct from canonical sources until reviewed');
  assert(Array.isArray(thread.reports) && thread.reports.length);
  threadIds.add(thread.threadId);
  threadUrls.add(thread.url);
  for (const report of thread.reports) {
    n++;
    assert(typeof report.authorHandle === 'string' && report.authorHandle.length > 1);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(report.date));
    assert(report.date >= thread.opened, 'report must not predate thread');
    assert(report.date <= inbox.capturedAt, 'do not invent future report');
    assert(Array.isArray(report.targetServices));
    assert(Array.isArray(report.prefixBands));
    assert(typeof report.operation === 'string' && report.operation);
    assert(typeof report.outcome === 'string' && report.outcome);
    assert(typeof report.confidence === 'string' && report.confidence);
    for (const prefix of report.prefixBands) {
      assert(/^\d{2,4}$/.test(prefix), 'prefix band only: never capture a full customer phone number');
    }
  }
}
assert.equal(inbox.threads.length, 4);
assert.equal(n, 10, 'preserve all ten separately dated/user-attributed assertions');
const first = inbox.threads.find((t) => t.threadId === 'linuxdo-2919304');
const positive = first.reports.find((r) => r.authorHandle === 'luweiji' && r.prefixBands.includes('5405'));
const negative = first.reports.find((r) => r.authorHandle === 'KPI' && r.prefixBands.includes('5405'));
assert.equal(positive.outcome, 'success');
assert.equal(negative.outcome, 'failure');
assert(positive.targetServices.includes('Telegram') && negative.targetServices.includes('Telegram'));
assert(positive.targetServices.includes('WhatsApp') && negative.targetServices.includes('WhatsApp'));
assert.notEqual(positive.authorHandle, negative.authorHandle, 'two opposite experiences, not one study sample');
const temporal = inbox.threads.find((t) => t.threadId === 'linuxdo-2836806');
assert(temporal.reports.some((r) => r.provider === 'eSIM.gg' && r.outcome === 'failure-then-success'), 'the same account first failed then worked');
assert(temporal.reports.some((r) => r.provider === 'Saily US-number add-on' && r.outcome === 'success-after-delay'), 'VoIP incident must not be attributed to eSIM.gg');
assert(observations.every((o) => !threadUrls.has(sources.find((s) => s.id === o.sourceId)?.url)), 'candidate reports must not silently affect current service acceptance samples');
assert(inbox.reviewGate.includes('not'), 'human gate is required');
console.log('Community original-outcome inbox: 4 thread URLs / 10 attributed assertions / mixed same-prefix and delayed outcomes preserved; zero canonical admissions — PASS');
