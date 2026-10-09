import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gradeServiceEvidence } from './phone-evidence-grading.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(repo, 'data/phone/v1');
const out = path.join(repo, 'frontend/tools/phone-number-lifecycle-mvp');
const read = name => JSON.parse(fs.readFileSync(path.join(src, name), 'utf8'));
const writeAtomic = (file, text) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, text);
  fs.renameSync(tmp, file);
};
const meta = read('meta.json');
const markets = read('markets.json');
const networks = read('networks.json');
const brands = read('brands.json');
const routes = read('routes.json');
const sources = read('sources.json');
const observations = read('observations.json');
const events = read('events.json');
const snapshots = read('snapshots.json');
const aliases = read('aliases.json');
const services = read('services.json');
const numberRanges = read('number-ranges.json');

const unique = (rows, label) => {
  const seen = new Set();
  for (const row of rows) {
    if (!row.id) throw new Error(`${label}: missing id`);
    if (seen.has(row.id)) throw new Error(`${label}: duplicate id ${row.id}`);
    seen.add(row.id);
  }
  return seen;
};
const marketIds = unique(markets, 'markets');
const networkIds = unique(networks, 'networks');
const brandIds = unique(brands, 'brands');
const routeIds = unique(routes, 'routes');
const sourceIds = unique(sources, 'sources');
const serviceIds = unique(services, 'services');
const rangeIds = unique(numberRanges, 'number-ranges');
unique(observations, 'observations'); unique(events, 'events'); unique(snapshots, 'snapshots');
for (const n of networks) if (!marketIds.has(n.marketId)) throw new Error(`network ${n.id}: missing market ${n.marketId}`);
for (const b of brands) {
  if (!marketIds.has(b.marketId)) throw new Error(`brand ${b.id}: missing market ${b.marketId}`);
  if (b.networkId && !networkIds.has(b.networkId)) throw new Error(`brand ${b.id}: missing network ${b.networkId}`);
}
for (const r of routes) {
  if (!marketIds.has(r.marketId)) throw new Error(`route ${r.id}: missing market ${r.marketId}`);
  if (!brandIds.has(r.brandId)) throw new Error(`route ${r.id}: missing brand ${r.brandId}`);
  if (r.networkId && !networkIds.has(r.networkId)) throw new Error(`route ${r.id}: missing network ${r.networkId}`);
  for (const sid of r.sourceIds || []) if (!sourceIds.has(sid)) throw new Error(`route ${r.id}: missing source ${sid}`);
}
for (const row of [...observations, ...events, ...snapshots]) if (!routeIds.has(row.routeId)) throw new Error(`${row.id}: missing route ${row.routeId}`);
for (const row of [...observations, ...events]) if (row.sourceId && !sourceIds.has(row.sourceId)) throw new Error(`${row.id}: missing source ${row.sourceId}`);
for (const a of aliases) if (!routeIds.has(a.routeId)) throw new Error(`alias ${a.aliasId}: missing route ${a.routeId}`);
for (const r of numberRanges) { if (!marketIds.has(r.marketId)) throw new Error(`number range ${r.id}: missing market ${r.marketId}`); if (r.networkId && !networkIds.has(r.networkId)) throw new Error(`number range ${r.id}: missing network ${r.networkId}`); if (r.sourceId && !sourceIds.has(r.sourceId)) throw new Error(`number range ${r.id}: missing source ${r.sourceId}`); }

const isoDate = /^\d{4}-\d{2}-\d{2}$/;
for (const r of routes) if (r.lastVerifiedAt && !isoDate.test(r.lastVerifiedAt)) throw new Error(`route ${r.id}: lastVerifiedAt must be YYYY-MM-DD, got ${r.lastVerifiedAt}`);
for (const s of snapshots) if (s.checkedAt && !isoDate.test(s.checkedAt)) throw new Error(`snapshot ${s.id}: checkedAt must be YYYY-MM-DD, got ${s.checkedAt}`);
for (const s of sources) if (s.reportedAt && !isoDate.test(s.reportedAt)) throw new Error(`source ${s.id}: reportedAt must be YYYY-MM-DD, got ${s.reportedAt}`);
for (const row of [...observations, ...events]) if (row.reportedAt && !isoDate.test(row.reportedAt)) throw new Error(`${row.id}: reportedAt must be YYYY-MM-DD, got ${row.reportedAt}`);


const byMarket = new Map(markets.map(x => [x.id, x]));
const byNetwork = new Map(networks.map(x => [x.id, x]));
const byBrand = new Map(brands.map(x => [x.id, x]));
const snapByRoute = new Map();
for (const s of snapshots) { if (!snapByRoute.has(s.routeId)) snapByRoute.set(s.routeId, []); snapByRoute.get(s.routeId).push(s); }
const obsByRoute = new Map();
for (const o of observations) { if (!obsByRoute.has(o.routeId)) obsByRoute.set(o.routeId, []); obsByRoute.get(o.routeId).push(o); }
const eventByRoute = new Map();
for (const e of events) { if (!eventByRoute.has(e.routeId)) eventByRoute.set(e.routeId, []); eventByRoute.get(e.routeId).push(e); }

const collectStrings = (value, out = []) => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) for (const x of value) collectStrings(x, out);
  else if (value && typeof value === 'object') for (const x of Object.values(value)) collectStrings(x, out);
  return out;
};
const normalize = s => String(s || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9+]+/g, ' ').trim();
const slug = value => normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unknown';
const serviceAlias = new Map();
for (const service of services) for (const alias of [service.name, ...(service.aliases || [])]) serviceAlias.set(normalize(alias), service.id);
const observationServiceId = observation => serviceAlias.get(normalize(observation.service)) || null;

const serviceAggregates = [];
for (const route of routes) {
  const os = obsByRoute.get(route.id) || [];
  const grouped = new Map();
  for (const o of os) {
    const serviceId = observationServiceId(o); if (!serviceId) continue;
    const key = `${serviceId}|${o.operation || 'unspecified'}|${o.numberRangeId || ''}`;
    if (!grouped.has(key)) grouped.set(key, { serviceId, operation: o.operation || 'unspecified', numberRangeId: o.numberRangeId || null, rows: [] });
    grouped.get(key).rows.push(o);
  }
  for (const g of grouped.values()) serviceAggregates.push({ id: `svcagg-${slug(route.id)}-${slug(g.serviceId)}-${slug(g.operation)}${g.numberRangeId ? `-${slug(g.numberRangeId)}` : ''}`, routeId: route.id, serviceId: g.serviceId, operation: g.operation, numberRangeId: g.numberRangeId, ...gradeServiceEvidence(g.rows) });
}

const currentProfileByRoute = new Map(snapshots.filter(x => x.kind === 'current-profile').map(x => [x.routeId, x]));
const routeMetrics = routes.map(route => {
  const snap = currentProfileByRoute.get(route.id); const d = snap?.data || {}; const landed = d.landedCost || {}; const keep = d.keep || {};
  return {
    routeId: route.id,
    checkedAt: snap?.checkedAt || route.lastVerifiedAt || null,
    metricState: snap ? 'current-profile' : 'not-normalized',
    acquisitionCurrency: landed.currency || null,
    acquisitionCostOriginal: Number.isFinite(landed.landedOriginal) ? landed.landedOriginal : null,
    acquisitionCostCny: Number.isFinite(landed.landedCny) ? landed.landedCny : null,
    keepCurrency: keep.currency || landed.currency || null,
    keepYearCostOriginal: Number.isFinite(keep.yearCostOriginal) ? keep.yearCostOriginal : null,
    keepYearCostCny: Number.isFinite(keep.yearCostCny) ? keep.yearCostCny : null,
    keepIntervalDays: Number.isFinite(keep.intervalDays) ? keep.intervalDays : null,
  };
});
const metricByRoute = new Map(routeMetrics.map(x => [x.routeId, x]));
const serviceAggByRoute = new Map();
for (const x of serviceAggregates) { if (!serviceAggByRoute.has(x.routeId)) serviceAggByRoute.set(x.routeId, []); serviceAggByRoute.get(x.routeId).push(x); }
const serviceNameById = new Map(services.map(x => [x.id, x.name]));
const compactText = (value, max = 180) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
};
const classifyKyc = value => {
  const text = normalize(value);
  if (!text) return 'unknown';
  // An explicit evidence gap or disclaimer must beat a substring such as "no-KYC" inside "do not market as no-KYC".
  if (/do not market.{0,100}\b(?:no kyc|without kyc)\b/.test(text)) return 'unknown';
  if (/not required|no kyc|without kyc|no identity/.test(text)) return 'not-required';
  if (/required|real name|passport|identity|kyc/.test(text)) return 'required';
  return 'unclear';
};
const continuityRiskPattern = /(number[- ]?loss|closure|termination|terminated|suspension|cancel(?:lation|led)?|deactivat|recycl|service[- ]activation[- ]friction|operational[- ]failure|incident)/i;

const searchIndex = routes.map(r => {
  const market = byMarket.get(r.marketId); const brand = byBrand.get(r.brandId); const network = r.networkId ? byNetwork.get(r.networkId) : null;
  const ss = snapByRoute.get(r.id) || []; const os = obsByRoute.get(r.id) || []; const es = eventByRoute.get(r.id) || [];
  const profile = currentProfileByRoute.get(r.id)?.data || {};
  const riskSignals = es.filter(e => continuityRiskPattern.test(`${e.type || ''} ${e.outcome || ''}`));
  const services = [...new Set(os.map(o => o.service).filter(Boolean))].sort();
  const operations = [...new Set(os.map(o => o.operation).filter(Boolean))].sort();
  const textParts = [r.id, r.displayName, market?.name, market?.countryCode, brand?.name, network?.name, r.family, r.numberClass, r.form, r.surfaceState, r.evidenceState, ...services, ...operations];
  for (const o of os) textParts.push(o.outcome, o.geography);
  for (const e of es) textParts.push(...collectStrings(e));
  for (const s of ss) textParts.push(...collectStrings(s.data));
  const normalized = normalize(textParts.filter(Boolean).join(' '));
  const tokens = [...new Set(normalized.split(/\s+/).filter(x => x.length > 1))].slice(0, 96);
  return {
    id: r.id,
    displayName: r.displayName,
    marketId: r.marketId,
    marketName: market?.name || r.marketId,
    countryCode: market?.countryCode || null,
    networkName: network?.name || null,
    brandName: brand?.name || r.brandId,
    family: r.family,
    numberClass: r.numberClass,
    form: r.form,
    surfaceState: r.surfaceState,
    evidenceState: r.evidenceState,
    lastVerifiedAt: r.lastVerifiedAt,
    observationCount: os.length,
    eventCount: es.length,
    services,
    operations,
    serviceEvidence: (serviceAggByRoute.get(r.id) || []).map(x => ({ serviceId: x.serviceId, serviceName: serviceNameById.get(x.serviceId) || x.serviceId, operation: x.operation, grade: x.grade, label: x.label, confidence: x.confidence, sampleSize: x.sampleSize, independentSourceCount: x.independentSourceCount, successCount: x.successCount, failureCount: x.failureCount, mixedCount: x.mixedCount, percentageEligible: x.percentageEligible, successRatePct: x.successRatePct, lastObservedAt: x.lastObservedAt })),
    decisionFacts: {
      sourceCount: (r.sourceIds || []).length,
      kycState: classifyKyc(profile.kyc),
      keepAction: compactText(profile.keep?.action),
      roamingSms: compactText(profile.roamingSms),
      holdReason: compactText(profile.holdReason),
      continuityRiskSignalCount: riskSignals.length,
      lastContinuityRiskSignalAt: riskSignals.map(x => x.reportedAt).filter(Boolean).sort().at(-1) || null,
    },
    metrics: metricByRoute.get(r.id),
    tokens,
  };
});

const bundle = { meta: { ...meta }, markets, networks, brands, routes, sources, observations, events, snapshots, aliases, services, numberRanges, serviceAggregates, routeMetrics };
const databaseText = JSON.stringify(bundle, null, 2) + '\n';
const searchText = JSON.stringify({ schemaVersion: meta.schemaVersion, routes: searchIndex }, null, 2) + '\n';
const summaryRows = searchIndex.map(({ tokens, ...row }) => row);
const summaryText = JSON.stringify({ schemaVersion: meta.schemaVersion, routes: summaryRows }, null, 2) + '\n';
const globalDirectory = JSON.parse(fs.readFileSync(path.join(out, 'global-directory.json'), 'utf8'));
const publicationPolicy = JSON.parse(fs.readFileSync(path.join(out, 'publication-policy.json'), 'utf8'));
const globalBrandById = new Map((globalDirectory.brands || []).map(x => [x.id, x]));
const globalNetworkById = new Map((globalDirectory.networks || []).map(x => [x.id, x]));
const publicationState = id => publicationPolicy.routeStates?.[id] || publicationPolicy.defaultRouteState || 'database-only';
const comparisonIndexRows = (globalDirectory.routes || [])
  .filter(r => ['comparison-visible', 'detail-eligible', 'indexable'].includes(publicationState(r.id)))
  .map(r => {
    const brand = globalBrandById.get(r.brandId); const network = brand?.networkId ? globalNetworkById.get(brand.networkId) : null;
    const landed = r.landedCost || {}; const keep = r.keep || {};
    return {
      id: r.id,
      brandName: brand?.name || r.brandId,
      networkName: network?.name || null,
      marketName: r.marketName || 'Global',
      publicationState: publicationState(r.id),
      publishState: r.publishState || null,
      numberType: r.numberType || null,
      simType: r.simType || null,
      acquisitionCurrency: landed.currency || null,
      acquisitionCostOriginal: Number.isFinite(landed.landedOriginal) ? landed.landedOriginal : (Number.isFinite(landed.providerOrCommunityPrice) ? landed.providerOrCommunityPrice : null),
      acquisitionCostCny: Number.isFinite(landed.landedCny) ? landed.landedCny : null,
      keepCurrency: keep.currency || landed.currency || null,
      keepYearCostOriginal: Number.isFinite(keep.yearCostOriginal) ? keep.yearCostOriginal : null,
      keepYearCostCny: Number.isFinite(keep.yearCostCny) ? keep.yearCostCny : null,
      keepIntervalDays: Number.isFinite(keep.intervalDays) ? keep.intervalDays : null,
      evidenceState: keep.state || r.publishState || null,
      trend: r.trend || null,
      lastVerifiedAt: r.lastVerifiedAt || globalDirectory.checkedAt || null,
      sourceCount: (r.sourceIds || []).length,
      searchable: normalize([r.id, brand?.name, network?.name, r.marketName, r.numberType, r.simType].filter(Boolean).join(' ')),
    };
  });
const comparisonIndexText = JSON.stringify({ schemaVersion: meta.schemaVersion, checkedAt: globalDirectory.checkedAt || null, routeCount: comparisonIndexRows.length, routes: comparisonIndexRows }, null, 2) + '\n';
const databasePath = path.join(out, 'phone-database.json');
const searchPath = path.join(out, 'phone-search-index.json');
const summaryPath = path.join(out, 'phone-route-summaries.json');
const comparisonIndexPath = path.join(out, 'comparison-route-index.json');
const serviceAggPath = path.join(out, 'phone-service-evidence.json');
const metricsPath = path.join(out, 'phone-route-metrics.json');
const rangesPath = path.join(out, 'phone-number-ranges.json');
const serviceAggText = JSON.stringify({ schemaVersion: meta.schemaVersion, aggregates: serviceAggregates }, null, 2) + '\n';
const metricsText = JSON.stringify({ schemaVersion: meta.schemaVersion, metrics: routeMetrics }, null, 2) + '\n';
const rangesText = JSON.stringify({ schemaVersion: meta.schemaVersion, ranges: numberRanges }, null, 2) + '\n';
const detailDir = path.join(out, 'phone-route-data');
const expectedDetails = new Map(routes.map(route => {
  const market = byMarket.get(route.marketId); const brand = byBrand.get(route.brandId); const network = route.networkId ? byNetwork.get(route.networkId) : null;
  const detail = { schemaVersion: meta.schemaVersion, route, market, network, brand, metrics: metricByRoute.get(route.id), numberRanges: numberRanges.filter(x => (x.routeIds || []).includes(route.id) || (route.networkId && x.networkId === route.networkId)), serviceEvidence: serviceAggByRoute.get(route.id) || [], sources: (route.sourceIds || []).map(id => sources.find(x => x.id === id)).filter(Boolean), observations: obsByRoute.get(route.id) || [], events: eventByRoute.get(route.id) || [], snapshots: snapByRoute.get(route.id) || [] };
  return [path.join(detailDir, `${route.id}.json`), JSON.stringify(detail, null, 2) + '\n'];
}));
if (process.argv.includes('--check')) {
  for (const [file, expected] of [[databasePath, databaseText], [searchPath, searchText], [summaryPath, summaryText], [comparisonIndexPath, comparisonIndexText], [serviceAggPath, serviceAggText], [metricsPath, metricsText], [rangesPath, rangesText], ...expectedDetails]) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== expected) throw new Error(`Phone database generated artifact is stale: ${path.relative(repo, file)}`);
  }
  const actualDetailFiles = fs.existsSync(detailDir) ? fs.readdirSync(detailDir).filter(x => x.endsWith('.json')).sort() : [];
  const expectedDetailFiles = [...expectedDetails.keys()].map(x => path.basename(x)).sort();
  if (JSON.stringify(actualDetailFiles) !== JSON.stringify(expectedDetailFiles)) throw new Error('Phone route detail artifact set is stale');
  console.log(`Phone database check OK: ${routes.length} routes / ${markets.length} markets / ${sources.length} sources.`);
} else {
  fs.mkdirSync(detailDir, { recursive: true });
  const expectedNames = new Set([...expectedDetails.keys()].map(x => path.basename(x)));
  for (const name of fs.readdirSync(detailDir)) if (name.endsWith('.json') && !expectedNames.has(name)) fs.rmSync(path.join(detailDir, name));
  writeAtomic(databasePath, databaseText);
  writeAtomic(searchPath, searchText);
  writeAtomic(summaryPath, summaryText);
  writeAtomic(comparisonIndexPath, comparisonIndexText);
  writeAtomic(serviceAggPath, serviceAggText);
  writeAtomic(metricsPath, metricsText);
  writeAtomic(rangesPath, rangesText);
  for (const [file, expected] of expectedDetails) writeAtomic(file, expected);
  console.log(`Compiled Phone database: ${routes.length} routes / ${markets.length} markets / ${sources.length} sources.`);
}
