import assert from 'node:assert/strict';
import fs from 'node:fs';
const packet = JSON.parse(fs.readFileSync(new URL('../data/phone/inbox/community-dito-maribank-crosspost-2026-10-10.json', import.meta.url), 'utf8'));
const routes = JSON.parse(fs.readFileSync(new URL('../data/phone/v1/routes.json', import.meta.url), 'utf8'));
const sources = JSON.parse(fs.readFileSync(new URL('../data/phone/v1/sources.json', import.meta.url), 'utf8'));
const observations = JSON.parse(fs.readFileSync(new URL('../data/phone/v1/observations.json', import.meta.url), 'utf8'));
assert.equal(packet.schemaVersion, 1);
assert.equal(packet.publicationState, 'backstage-candidate-only');
assert.equal(packet.newCanonicalSources, 0);
assert.equal(packet.newCanonicalObservations, 0);
assert.equal(packet.newCanonicalRoutes, 0);
assert(routes.some(x => x.id === packet.canonicalRouteLink && x.evidenceState === 'hold'));
assert.equal(packet.threads.length, 3);
const urls = new Set(), pairs = new Set(), authors = new Set(), reports = [];
for (const thread of packet.threads) {
  assert(/^https:\/\/www\.reddit\.com\/r\/[A-Za-z]+\/comments\/[a-z0-9]+\//.test(thread.url));
  assert(!urls.has(thread.url), 'one original thread should be one source');
  assert(!sources.some(x => x.url === thread.url), 'unreviewed thread must not be in canonical');
  urls.add(thread.url);
  for (const r of thread.reports) {
    assert(r.author && r.service && r.operation && r.outcome && r.classification);
    assert(r.geography && r.device && r.evidence && r.resolution);
    assert(!observations.some(x => x.sourceId === thread.id), 'unreviewed app observations cannot be canonical');
    const pair = `${thread.id}:${r.author}`;
    assert(!pairs.has(pair), 'one author per original discussion case');
    pairs.add(pair); authors.add(r.author); reports.push({ ...r, threadId: thread.id });
  }
}
assert.equal(urls.size, 3);
assert.equal(reports.length, 6);
assert.equal(authors.size, 5, 'one crossposted author must not increase the person denominator');
const ken = reports.filter(x => x.author === 'KenLovesG');
assert.equal(ken.length, 2);
assert(ken.every(x => x.classification.includes('negative') || x.classification.startsWith('crosspost')));
assert(ken.every(x => x.samePersonAs), 'crosspost linkage must be explicit in both threads');
const recovery = reports.find(x => x.author === 'CarOwn7886');
assert.equal(recovery.outcome, 'failure-then-success', 'later correction must not be flattened into permanent failure');
const comparator = reports.find(x => x.author === 'jjas21');
assert.equal(comparator.service, 'Maybank');
assert.equal(comparator.classification, 'separate-firsthand-comparator-not-Maribank');
assert(reports.some(x => x.author === 'Fermooooo' && x.evidence.includes('not proof')));
assert(packet.evidenceRules.noRateOrCarrierBlame.includes('unresolved'));
assert.equal(packet.reviewDecision.includes('do not normalize into app grades'), true);
console.log('DITO MariBank research packet: 3 distinct Reddit threads, 5 distinct firsthand authors, 6 claims including 1 crosspost and recovery — PASS');
