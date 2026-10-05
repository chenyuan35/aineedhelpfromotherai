import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDataEsimCatalog } from './lib/data-esim-normalizer.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

const basePath = 'data/phone/inbox/community-esim-price-nodeseek-935678-2026-10-01.json';
const deltaPath = 'data/phone/inbox/community-esim-price-user-supplied-later-delta-2026-10-01.json';
const freePath = 'data/phone/inbox/community-free-esim-nodeseek-954805-2026-09-29.json';
const latestFreePath = 'data/phone/inbox/community-free-esim-nodeseek-965985-2026-10-05.json';
const outcomePath = 'data/phone/inbox/community-usims-linuxdo-2923258-2026-10-03.json';
const base = readJson(basePath);
const delta = readJson(deltaPath);
const free = readJson(freePath);
const latestFree = readJson(latestFreePath);
const outcome = readJson(outcomePath);

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
assert(delta.source?.url === null, 'immutable raw delta must retain its original unresolved source URL');
assert(delta.newRecords.length === 13, 'later delta must preserve entries 47..59');
assert(delta.newRecords[0].ordinal === 47 && delta.newRecords.at(-1).ordinal === 59, 'later delta ordinal range mismatch');
assert(delta.updates.some((u) => u.ordinal === 22 && u.newPriceNote?.includes('EUR20')), 'StellarSecurity price-change signal missing');

assert(free.publicationState === 'backstage-candidate-only', 'free-eSIM roundup must stay backstage-only');
assert(free.offers.length === 9, 'free-eSIM roundup must preserve all 9 mechanisms');
assert(free.offers.some((x) => x.provider === 'Firsty' && x.oldAccountSpeedKbps === 256), 'Firsty throttled ad-funded mechanic missing');
assert(free.offers.some((x) => x.provider === 'Eskimo' && x.ipHint?.includes('Singapore')), 'Eskimo egress signal missing');

assert(latestFree.publicationState === 'backstage-candidate-only', 'latest free-eSIM roundup must stay backstage-only');
assert(latestFree.source?.url === 'https://www.nodeseek.com/post-965985-1', 'unexpected latest free-eSIM NodeSeek source URL');
assert(latestFree.offers.length === 8, 'latest free-eSIM roundup must preserve all 8 verified mechanisms');
assert(latestFree.offers.every((x) => x.claimStrength === 'author-firsthand-current'), 'latest free-eSIM records must preserve the author-firsthand claim strength');
assert(latestFree.offers.some((x) => x.provider === 'Firsty' && x.freeDataMBPerAd === 20 && x.speedMbps === 1 && x.validityDays === 7), 'latest Firsty ad-funded mechanic missing');
assert(latestFree.offers.some((x) => x.provider === 'Holafly' && x.freeDataMBMonthly === 1024 && /prior paid/i.test(x.cardRequired)), 'Holafly conditional monthly backup mechanic missing');
assert(latestFree.offers.some((x) => x.provider === 'Nomad' && x.freeDataMB === 1024 && x.installDeadlineDays === 15), 'Nomad install-deadline mechanic missing');
assert(latestFree.offers.some((x) => x.provider === 'Gohub' && x.freeDataMB === 300 && x.cardRequired === false && /first data use/i.test(x.activationTrigger)), 'Gohub no-card first-use mechanic missing');
assert(latestFree.offers.some((x) => x.provider === 'GigSky' && x.freeDataMB === 'unlimited-fup' && x.highSpeedDailyGBApprox === 2.5), 'GigSky Visa/FUP mechanic missing');
assert(latestFree.offers.some((x) => x.provider === 'Eskimo' && x.referralCode === 'KL25629' && x.giftCode === 'TRIPLE-A' && x.giftCodeExpiresAt === '2026-11-30'), 'Eskimo referral/gift-code version missing');
assert(latestFree.offers.some((x) => x.provider === 'Red Bull MOBILE' && x.freeDataMB === 100), 'Red Bull MOBILE signup allowance missing');
assert(latestFree.offers.some((x) => x.provider === 'Kolet' && x.promoCode === 'AFKLDATA' && x.validityHours === 48), 'Kolet partner-code/48-hour mechanic missing');

assert(outcome.publicationState === 'backstage-candidate-only', 'USIMS community outcome must stay backstage-only');
assert(outcome.source?.url === 'https://linux.do/t/topic/2923258', 'unexpected USIMS Linux.do source URL');
assert(outcome.records.length === 1 && outcome.records[0].providerLabel === 'USIMS', 'USIMS outcome snapshot shape mismatch');
assert(outcome.records[0].observations.some((x) => x.kind === 'split-device-outcome' && /no signal/i.test(x.claim)), 'USIMS split device outcome missing');
assert(outcome.records[0].observations.some((x) => x.kind === 'order-failure'), 'USIMS later order-failure observation missing');

const normalized = loadDataEsimCatalog({ root });
const evidenceFor = (label) => normalized.evidence.filter((x) => x.providerLabel === label);
const providerFor = (label) => normalized.providers.find((x) => x.labels.includes(label));
const resolvedDeltaSource = normalized.sourceSnapshots.find((x) => x.id === 'user-supplied-esim-price-later-delta-2026-10-01')?.source;
const latestFreeSource = normalized.sourceSnapshots.find((x) => x.id === 'nodeseek-965985-free-esim-verified-roundup-2026-10-05')?.source;

assert(normalized.family === 'data-esim', 'normalized family must be data-esim');
assert(normalized.surfaceState === 'backstage-only' && normalized.indexability === 'none', 'Data-eSIM normalized layer must not publish URLs');
assert(normalized.sourceSnapshots.length === 5, 'normalized layer must admit exactly the five reviewed source snapshots');
assert(resolvedDeltaSource?.url === 'https://linux.do/t/topic/2973469', 'reviewed Linux.do source resolution must reach normalized provenance');
assert(resolvedDeltaSource?.resolution?.resolutionStatus === 'content-matched', 'resolved source must retain review status');
assert(latestFreeSource?.url === 'https://www.nodeseek.com/post-965985-1', 'latest free-eSIM normalized provenance must retain NodeSeek URL');
assert(normalized.evidence.filter((x) => x.recordType === 'price-snapshot-record').length === 46, 'normalized base price snapshot count mismatch');
assert(normalized.evidence.filter((x) => x.recordType === 'price-delta-new-record').length === 13, 'normalized delta new-record count mismatch');
assert(normalized.evidence.filter((x) => x.recordType === 'price-delta-update').length === 2, 'normalized delta update count mismatch');
assert(normalized.evidence.filter((x) => x.recordType === 'free-mechanism').length === 17, 'normalized free-mechanism count mismatch');
assert(normalized.evidence.filter((x) => x.recordType === 'community-outcome').length === 1, 'normalized community-outcome count mismatch');
assert(normalized.evidence.every((x) => x.canonicalPhoneRouteId === null), 'pure Data-eSIM evidence must not enter Phone canonical routes');
assert(normalized.providers.every((x) => x.canonicalPhoneRouteId === null), 'Data-eSIM provider identities must not link to Phone routes by default');
assert(normalized.evidence.every((x) => x.claimStrength && x.provenance?.sourceSnapshotId && x.provenance?.sourcePath), 'every normalized evidence record needs claim strength and provenance');
assert(normalized.offers.every((x) => x.versionKey && x.rawOffer && x.sourceSnapshotId && x.capturedAt), 'every normalized offer must keep version/provenance/raw offer data');
assert(normalized.offers.length === 167, 'latest free-eSIM snapshot must append eight versioned offers without overwriting history');
assert(normalized.evidence.length === 81, 'normalized evidence count must include the latest eight free-eSIM mechanisms');

assert(providerFor('eSIM.io')?.evidenceIds.length >= 2, 'eSIM.io cross-snapshot evidence must reconcile under one source-label provider identity');
assert(providerFor('USIMS')?.evidenceIds.length >= 3, 'USIMS free + later-price + dated outcome evidence must reconcile without overwriting history');
assert(providerFor('GG')?.evidenceIds.length === 2, 'GG base unavailable state + later price update must both survive');
assert(evidenceFor('GG').some((x) => x.recordType === 'price-snapshot-record' && x.raw.offers?.length === 0), 'GG original no-price snapshot must survive');
assert(evidenceFor('GG').some((x) => x.recordType === 'price-delta-update' && x.raw.offers?.length === 3), 'GG later price version must survive as a delta');
assert(evidenceFor('StellarSecurity').some((x) => x.recordType === 'price-delta-update' && x.raw.newPriceNote?.includes('EUR20')), 'StellarSecurity price-rise delta must survive normalization');
assert(evidenceFor('USIMS').some((x) => x.recordType === 'price-delta-new-record' && x.provenance.sourceUrl === 'https://linux.do/t/topic/2973469'), 'delta evidence must inherit the resolved public source URL');
assert(evidenceFor('USIMS').some((x) => x.recordType === 'community-outcome' && x.provenance.sourceUrl === 'https://linux.do/t/topic/2923258'), 'USIMS dated outcome must preserve direct Linux.do provenance');
assert(evidenceFor('Firsty').some((x) => x.provenance.sourceSnapshotId === 'nodeseek-965985-free-esim-verified-roundup-2026-10-05' && x.raw.freeDataMBPerAd === 20), 'latest Firsty version must survive normalization alongside prior Firsty evidence');
assert(evidenceFor('Eskimo').some((x) => x.raw.giftCode === 'TRIPLE-A' && x.raw.giftCodeExpiresAt === '2026-11-30'), 'latest Eskimo promo version must survive normalization');
assert(evidenceFor('GigSky').some((x) => x.networkPolicy.throttleOrFupSignals.some((s) => /fair-use|2.5 GB|thrott/i.test(s))), 'GigSky FUP/throttle signal must survive normalization');

assert(evidenceFor('TF').some((x) => x.networkPolicy.ipEgressSignals.some((s) => /selectable|Hong Kong|Singapore/i.test(s))), 'TF selectable egress must survive normalization');
assert(evidenceFor('CodSIM').some((x) => x.networkPolicy.ipEgressSignals.length > 0 && x.networkPolicy.throttleOrFupSignals.length > 0), 'CodSIM IP + throttle mechanics must survive normalization');
assert(evidenceFor('USIMS').some((x) => x.networkPolicy.throttleOrFupSignals.length > 0), 'USIMS throttling history must survive normalization');
assert(evidenceFor('CMLink').some((x) => x.acquisition.classes.includes('third-party-or-reseller')), 'CMLink third-party acquisition channel must survive normalization');

assert(evidenceFor('Trip').some((x) => x.capabilities.number === 'community-mentioned'), 'Trip Thailand-number signal must remain a capability claim');
assert(evidenceFor('eSIM.net').some((x) => x.capabilities.voice === 'community-mentioned'), 'eSIM.net voice-call mention must remain a capability claim');
assert(evidenceFor('BNESIM').some((x) => x.capabilities.sms === 'unknown' && x.capabilities.number === 'unknown'), 'missing SMS/number facts must remain unknown, not false');

console.log(`Phone/Data-eSIM community normalization check passed: ${normalized.providers.length} source-label providers, ${normalized.evidence.length} evidence records, ${normalized.offers.length} versioned offers; backstage only.`);
