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
assert.equal(inbox.newCanonicalSourceCount, 3);
assert.equal(inbox.newCanonicalObservationCount, 11);
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
  const admitted = ['linuxdo-2919304','linuxdo-2836806','linuxdo-2992813'].includes(thread.threadId);
  assert.equal(thread.primarySourceRecordExistsInCanonical, admitted);
  assert.equal(sources.some((s) => s.url === thread.url), admitted, 'only the reviewed original discussion is canonical');
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
assert.equal(n, 12, 'preserve all twelve separately dated/user-attributed assertions');
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
const stagedUrls = new Set(inbox.threads.filter(t => !t.primarySourceRecordExistsInCanonical).map(t => t.url));
assert.equal(stagedUrls.size, 1);
assert.equal(temporal.reports.find(r => r.authorHandle === 'cyminute' && r.provider === 'eSIM.gg').date, '2026-09-08');
assert(observations.every((o) => !stagedUrls.has(sources.find((s) => s.id === o.sourceId)?.url)), 'unreviewed reports must not silently affect current service acceptance samples');
assert.equal(observations.filter(o => o.sourceId === 'linuxdo-esimgg-2919304-20260918').length, 9);
assert(/require independent manual review before normalization/i.test(inbox.reviewGate), 'manual source review gate is required');
console.log('Community original-outcome inbox: 4 thread URLs / 12 attributed assertions / mixed same-prefix and delayed outcomes preserved; three reviewed original canonical sources — PASS');
