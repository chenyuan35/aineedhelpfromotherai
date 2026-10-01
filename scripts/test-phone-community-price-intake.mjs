import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

const basePath = 'data/phone/inbox/community-esim-price-nodeseek-935678-2026-10-01.json';
const deltaPath = 'data/phone/inbox/community-esim-price-user-supplied-later-delta-2026-10-01.json';
const base = readJson(basePath);
const delta = readJson(deltaPath);

const assert = (ok, msg) => { if (!ok) throw new Error(msg); };

assert(base.publicationState === 'backstage-candidate-only', 'community price snapshot must stay backstage-only');
assert(base.evidencePolicy?.communityEvidenceIsFirstClass === true, 'community evidence must be first-class');
assert(base.evidencePolicy?.officialAbsenceIsNotRejection === true, 'official-site absence must not reject a community signal');
assert(base.source?.url === 'https://www.nodeseek.com/post-935678-1', 'unexpected NodeSeek source URL');
assert(base.recordCount === 46 && base.records.length === 46, '3.0 snapshot must contain 46 records');
assert(new Set(base.records.map((r) => r.ordinal)).size === 46, '3.0 ordinals must be unique');
assert(Math.min(...base.records.map((r) => r.ordinal)) === 1 && Math.max(...base.records.map((r) => r.ordinal)) === 46, '3.0 ordinals must span 1..46');
assert(base.records.every((r) => r.identityStatus === 'unresolved-or-community-label'), 'intake must not guess provider identity');
assert(!JSON.stringify(base).includes('indexable'), 'raw intake must not grant indexability');

const byLabel = new Map(base.records.map((r) => [r.providerLabel, r]));
assert(byLabel.get('BNESIM')?.validityNote === 'non-expiring', 'BNESIM non-expiry signal missing');
assert(byLabel.get('TF')?.mechanics?.includes('selectable egress/IP'), 'TF selectable-IP signal missing');
assert(byLabel.get('CMLink')?.offers?.some((o) => o.kind === 'third-party-channel'), 'CMLink third-party route missing');
assert(byLabel.get('Saily')?.mechanics?.includes('selectable egress region'), 'Saily selectable-egress signal missing');
assert(byLabel.get('CMLink 52-country')?.coverageClaimMarkets?.length === 52, 'CMLink 52-country coverage claim must preserve all 52 listed markets');
assert(base.threadFollowups?.some((x) => x.relatedOrdinal === 27 && x.providerLabel === 'Rakuten' && x.threadReply.includes('meSIM')), 'Rakuten/meSIM reseller reply must be preserved');
assert(base.projectCrossReferences?.exactProviderLabelOverlaps?.includes('eSIM.io'), 'prior inbox overlap reconciliation missing');
assert(byLabel.get('GoMoWorld')?.claimStrength === 'provider-claim-plus-author-negative-test', 'negative app test must remain explicit');

assert(delta.publicationState === 'backstage-candidate-only', 'later delta must stay backstage-only');
assert(delta.extendsSignalId === base.signalId, 'later delta must version the 3.0 snapshot');
assert(delta.newRecords.length === 13, 'later delta must preserve entries 47..59');
assert(delta.newRecords[0].ordinal === 47 && delta.newRecords.at(-1).ordinal === 59, 'later delta ordinal range mismatch');
assert(delta.updates.some((u) => u.ordinal === 22 && u.newPriceNote?.includes('EUR20')), 'StellarSecurity price-change signal missing');

console.log('Phone community eSIM price intake check passed: 46-source snapshot + 13 later-delta records, backstage only.');
