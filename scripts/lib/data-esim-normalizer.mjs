import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const manifestPath = 'data/esim/v1/manifest.json';

const readJson = (root, relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const uniq = (values) => [...new Set(values.filter(Boolean))];

const slugify = (value) => String(value || '')
  .normalize('NFKD')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unresolved-provider';

const collectStrings = (value, out = []) => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
};

const classifyAcquisition = (raw) => {
  const strings = collectStrings(raw);
  const text = strings.join(' \n ');
  const classes = [];
  if (/third[- ]party|reseller|agent\b/i.test(text)) classes.push('third-party-or-reseller');
  if (/referr/i.test(text)) classes.push('referral');
  if (/promot|coupon|discount/i.test(text)) classes.push('promotion-or-discount');
  if (/task[- ]reward|microtask|task-dependent|completing .*tasks/i.test(text)) classes.push('task-reward');
  if (/ad[- ]funded|watch ads|ad-dependent|per ad/i.test(text)) classes.push('ad-funded');
  if (/wallet|payg|pay-as-you-go|prepaid-credit/i.test(text)) classes.push('wallet-or-payg');
  if (/app\b/i.test(text)) classes.push('app-mentioned');

  return {
    classes: uniq(classes),
    rawSignals: uniq(strings.filter((item) => /third[- ]party|reseller|agent\b|referr|promot|coupon|discount|task|wallet|payg|pay-as-you-go|prepaid-credit|watch ads|ad-funded|app\b/i.test(item)))
  };
};

const capabilityState = (text, type) => {
  const patterns = {
    voice: {
      negative: /(?:no|without|unavailable|not available|does not include)[^.;]{0,40}\bvoice\b|\bvoice\b[^.;]{0,40}(?:unavailable|not available)/i,
      positive: /\bvoice\b|cheap calls?|voice calls?/i
    },
    sms: {
      negative: /(?:no|without|unavailable|not available|does not include)[^.;]{0,40}\bsms\b|\bsms\b[^.;]{0,40}(?:unavailable|not available)/i,
      positive: /\bsms\b|text messages?/i
    },
    number: {
      negative: /(?:no|without|unavailable|not available|does not include)[^.;]{0,40}(?:phone|mobile)[ -]?number/i,
      positive: /(?:phone|mobile|thailand)[ -]?number|number option|number included/i
    }
  };
  const selected = patterns[type];
  if (selected.negative.test(text)) return 'community-claimed-unavailable';
  if (selected.positive.test(text)) return 'community-mentioned';
  if (/data[- ]only/i.test(text)) return 'community-claimed-unavailable';
  return 'unknown';
};

const deriveCapabilities = (raw) => {
  const text = collectStrings(raw).join(' \n ');
  return {
    data: 'community-offered',
    voice: capabilityState(text, 'voice'),
    sms: capabilityState(text, 'sms'),
    number: capabilityState(text, 'number'),
    sourceSignals: uniq(collectStrings(raw).filter((item) => /data[- ]only|\bvoice\b|cheap calls?|\bsms\b|text messages?|(?:phone|mobile|thailand)[ -]?number|number option/i.test(item)))
  };
};

const deriveNetworkPolicy = (raw) => {
  const strings = collectStrings(raw);
  const explicitIp = [raw.ipEgressHint, raw.ipHint].filter(Boolean);
  const ipSignals = strings.filter((item) => /\begress\b|\bip\b|selectable .*region/i.test(item));
  const throttleSignals = strings.filter((item) => /thrott|\bkbps\b|\bmbps\b|high[- ]speed|speed[- ]cap|after cap|\bfup\b/i.test(item));
  const unlimitedSignals = strings.filter((item) => /unlimited/i.test(item));
  const numericSpeedSignals = Object.entries(raw)
    .filter(([key, value]) => /speed.*kbps|kbps/i.test(key) && typeof value === 'number')
    .map(([key, value]) => `${key}=${value}`);

  return {
    ipEgressSignals: uniq([...explicitIp, ...ipSignals]),
    throttleOrFupSignals: uniq([...throttleSignals, ...numericSpeedSignals]),
    unlimitedSignals: uniq(unlimitedSignals)
  };
};

const sourceDefaultClaimStrength = (doc) => {
  if (doc.source?.type === 'user-supplied-community-transcription') return 'user-supplied-community-transcription';
  return 'community-source-record';
};

const makeEvidenceRecord = ({ entry, doc, raw, providerLabel, recordType, recordKey }) => {
  const evidenceId = `${entry.id}:${recordType}:${recordKey}`;
  const claimStrength = raw.claimStrength || sourceDefaultClaimStrength(doc);
  return {
    evidenceId,
    family: 'data-esim',
    providerId: slugify(providerLabel),
    providerLabel,
    identityStatus: raw.identityStatus || 'unresolved-or-community-label',
    canonicalPhoneRouteId: null,
    recordType,
    capturedAt: doc.capturedAt || entry.capturedAt,
    claimStrength,
    provenance: {
      sourceSnapshotId: entry.id,
      sourcePath: entry.path,
      sourceType: doc.source?.type || null,
      sourceUrl: entry.resolvedSource?.url || doc.source?.url || null,
      sourceTitle: entry.resolvedSource?.title || doc.source?.title || null,
      sourceAuthor: doc.source?.author || doc.source?.authorContext || null,
      publicationState: doc.publicationState || null,
      extendsSignalId: doc.extendsSignalId || entry.extends || null,
      recordKey
    },
    acquisition: classifyAcquisition(raw),
    networkPolicy: deriveNetworkPolicy(raw),
    capabilities: deriveCapabilities(raw),
    raw
  };
};

const makeOfferRecords = (evidence, raw) => {
  const explicitOffers = Array.isArray(raw.offers) ? raw.offers : null;
  const offerInputs = explicitOffers || (evidence.recordType === 'free-mechanism' ? [raw] : []);
  return offerInputs.map((offer, index) => ({
    offerId: `${evidence.evidenceId}:offer:${index + 1}`,
    family: 'data-esim',
    providerId: evidence.providerId,
    providerLabel: evidence.providerLabel,
    evidenceId: evidence.evidenceId,
    sourceSnapshotId: evidence.provenance.sourceSnapshotId,
    capturedAt: evidence.capturedAt,
    versionKey: `${evidence.capturedAt}:${evidence.provenance.sourceSnapshotId}:${evidence.provenance.recordKey}:${index + 1}`,
    kind: offer.kind || offer.mechanism || 'community-offer',
    dataAmount: offer.dataAmount ?? null,
    dataUnit: offer.dataUnit ?? null,
    price: offer.price ?? null,
    currency: offer.currency ?? null,
    validityDays: offer.validityDays ?? null,
    claimStrength: evidence.claimStrength,
    rawOffer: offer
  }));
};

const assertSnapshotShape = (entry, doc) => {
  if (doc.signalId !== entry.id) throw new Error(`Data-eSIM source id mismatch: ${entry.path}`);
  if (doc.publicationState !== 'backstage-candidate-only') throw new Error(`Data-eSIM source must remain backstage-only: ${entry.path}`);
  if (entry.extends && doc.extendsSignalId !== entry.extends) throw new Error(`Data-eSIM delta parent mismatch: ${entry.path}`);
  if (entry.expectedRecordCount != null) {
    const records = entry.role === 'free-mechanism-snapshot' ? doc.offers : doc.records;
    if (!Array.isArray(records) || records.length !== entry.expectedRecordCount) {
      throw new Error(`Data-eSIM record count mismatch for ${entry.id}`);
    }
  }
  if (entry.expectedNewRecordCount != null && doc.newRecords?.length !== entry.expectedNewRecordCount) {
    throw new Error(`Data-eSIM new-record count mismatch for ${entry.id}`);
  }
  if (entry.expectedUpdateCount != null && doc.updates?.length !== entry.expectedUpdateCount) {
    throw new Error(`Data-eSIM update count mismatch for ${entry.id}`);
  }
};

export const loadDataEsimCatalog = ({ root = repoRoot } = {}) => {
  const manifest = readJson(root, manifestPath);
  if (manifest.family !== 'data-esim' || manifest.surfaceState !== 'backstage-only' || manifest.indexability !== 'none') {
    throw new Error('Data-eSIM manifest publication boundary is invalid');
  }

  const evidence = [];
  const offers = [];
  const sourceSnapshots = [];

  for (const entry of manifest.sourceSnapshots) {
    const doc = readJson(root, entry.path);
    assertSnapshotShape(entry, doc);
    sourceSnapshots.push({
      id: entry.id,
      path: entry.path,
      capturedAt: doc.capturedAt || entry.capturedAt,
      role: entry.role,
      extends: entry.extends || null,
      source: {
        ...(doc.source || {}),
        url: entry.resolvedSource?.url || doc.source?.url || null,
        title: entry.resolvedSource?.title || doc.source?.title || null,
        resolution: entry.resolvedSource || null
      }
    });

    const pushEvidence = (raw, providerLabel, recordType, recordKey) => {
      if (!providerLabel) throw new Error(`Data-eSIM evidence missing provider label in ${entry.id}:${recordKey}`);
      const record = makeEvidenceRecord({ entry, doc, raw, providerLabel, recordType, recordKey });
      evidence.push(record);
      offers.push(...makeOfferRecords(record, raw));
    };

    if (entry.role === 'free-mechanism-snapshot') {
      doc.offers.forEach((raw, index) => pushEvidence(raw, raw.provider, 'free-mechanism', `${index + 1}:${raw.mechanism || 'offer'}`));
      continue;
    }

    if (entry.role === 'price-snapshot') {
      doc.records.forEach((raw) => pushEvidence(raw, raw.providerLabel, 'price-snapshot-record', String(raw.ordinal)));
      (doc.threadFollowups || []).forEach((raw, index) => {
        if (raw.providerLabel) pushEvidence(raw, raw.providerLabel, 'thread-followup', `${raw.relatedOrdinal ?? 'x'}:${index + 1}`);
      });
      continue;
    }

    if (entry.role === 'version-delta') {
      doc.updates.forEach((raw, index) => pushEvidence(raw, raw.providerLabel, 'price-delta-update', `${raw.ordinal ?? 'x'}:${index + 1}`));
      doc.newRecords.forEach((raw) => pushEvidence(raw, raw.providerLabel, 'price-delta-new-record', String(raw.ordinal)));
      continue;
    }

    if (entry.role === 'community-outcome-snapshot') {
      doc.records.forEach((raw, index) => pushEvidence(raw, raw.providerLabel, 'community-outcome', String(index + 1)));
      continue;
    }

    throw new Error(`Unsupported Data-eSIM source role: ${entry.role}`);
  }

  const providersById = new Map();
  for (const item of evidence) {
    const current = providersById.get(item.providerId) || {
      providerId: item.providerId,
      family: 'data-esim',
      labels: [],
      identityStatus: 'unresolved-or-community-label',
      canonicalPhoneRouteId: null,
      evidenceIds: [],
      offerIds: []
    };
    current.labels = uniq([...current.labels, item.providerLabel]);
    current.evidenceIds.push(item.evidenceId);
    providersById.set(item.providerId, current);
  }
  for (const offer of offers) providersById.get(offer.providerId)?.offerIds.push(offer.offerId);

  const providers = [...providersById.values()]
    .map((provider) => ({ ...provider, evidenceIds: uniq(provider.evidenceIds), offerIds: uniq(provider.offerIds) }))
    .sort((a, b) => a.providerId.localeCompare(b.providerId));

  return {
    schemaVersion: 1,
    family: 'data-esim',
    surfaceState: 'backstage-only',
    publicationState: 'not-public',
    indexability: 'none',
    manifest,
    sourceSnapshots,
    providers,
    evidence,
    offers
  };
};

export { repoRoot as DATA_ESIM_REPO_ROOT };
