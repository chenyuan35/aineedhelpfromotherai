import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const legacyDir = path.join(repo, 'frontend/tools/phone-number-lifecycle-mvp');
const outDir = path.join(repo, 'data/phone/v1');
fs.mkdirSync(outDir, { recursive: true });
const read = name => JSON.parse(fs.readFileSync(path.join(legacyDir, name), 'utf8'));
const write = (name, value) => fs.writeFileSync(path.join(outDir, name), JSON.stringify(value, null, 2) + '\n');
const slug = value => String(value || 'unknown').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unknown';
const hash = value => crypto.createHash('sha1').update(value).digest('hex').slice(0, 12);

const catalog = read('catalog.json');
const radar = read('radar-view.json');
const purchase = read('purchase-intelligence.json');
const retention = read('retention-intelligence.json');
const capabilities = read('route-capabilities.json');
const locations = read('location-constraints.json');
const tutorial = read('tutorial-insights.json');
const audit = read('audit-rules.json');
const pilot = read('uk-directory-pilot.json');

const countryMap = new Map([
  ['United Kingdom', ['gb', 'United Kingdom', 'GB']],
  ['United States', ['us', 'United States', 'US']],
  ['Japan', ['jp', 'Japan', 'JP']],
  ['China', ['cn', 'China', 'CN']],
  ['Mainland China', ['cn', 'China', 'CN']],
  ['Croatia', ['hr', 'Croatia', 'HR']],
  ['Global', ['global', 'Global / multi-market', null]],
  ['Multiple', ['global', 'Global / multi-market', null]],
  ['Destination-specific', ['various', 'Destination-specific', null]],
]);
const markets = new Map();
const ensureMarket = country => {
  const [id, name, countryCode] = countryMap.get(country) || [slug(country || 'unknown'), country || 'Unknown', null];
  if (!markets.has(id)) markets.set(id, { id, name, countryCode });
  return id;
};
ensureMarket(pilot.market.name);
for (const r of catalog.routes || []) ensureMarket(r.country);
for (const r of [...(tutorial.additionalRoutes || []), ...(audit.additionalRoutes || [])]) ensureMarket(r.country);

const networks = new Map((pilot.networks || []).map(x => [x.id, { ...x, marketId: pilot.market.countryCode === 'GB' ? 'gb' : ensureMarket(pilot.market.name) }]));
const brands = new Map((pilot.brands || []).map(x => [x.id, { ...x, marketId: 'gb' }]));
const sourceByUrl = new Map();
const sources = new Map();
const sourceIdRemap = new Map();
const putSource = (src, preferredId) => {
  if (!src?.url) return null;
  if (sourceByUrl.has(src.url)) return sourceByUrl.get(src.url);
  let id = preferredId || `src-${hash(src.url)}`;
  let n = 2;
  while (sources.has(id)) id = `${preferredId || `src-${hash(src.url)}`}-${n++}`;
  const row = { id, url: src.url, type: src.type || 'unknown' };
  if (src.label) row.label = src.label;
  if (src.reportedAt) row.reportedAt = src.reportedAt;
  if (src.author) row.author = src.author;
  if (src.note) row.note = src.note;
  sources.set(id, row); sourceByUrl.set(src.url, id); return id;
};
for (const src of pilot.sources || []) sourceIdRemap.set(src.id, putSource(src, src.id));

const routeAliases = new Map([
  ['giffgaff-uk', 'giffgaff-uk-direct-esim-payg'],
  ['lebara-uk', 'lebara-uk-direct-esim-china'],
]);
const excludedGeneric = new Set(['local-carrier', 'local-data-physical', 'china-official-carrier', 'airalo-data']);
const routes = new Map();
const sourceLinks = new Map();
const addLink = (routeId, sourceId) => {
  if (!sourceId) return;
  if (!sourceLinks.has(routeId)) sourceLinks.set(routeId, new Set());
  sourceLinks.get(routeId).add(sourceId);
};

for (const r of pilot.routes || []) {
  const brand = brands.get(r.brandId);
  const network = brand ? networks.get(brand.networkId) : null;
  routes.set(r.id, {
    id: r.id,
    marketId: 'gb',
    networkId: network?.id || null,
    brandId: r.brandId,
    displayName: brand?.name || r.id,
    family: 'long-term',
    numberClass: r.numberType || 'real-mobile',
    form: r.simType || null,
    surfaceState: r.publishState === 'observation-hold' ? 'public-hold' : 'public-pilot',
    evidenceState: r.publishState === 'observation-hold' ? 'hold' : 'admitted',
    lastVerifiedAt: r.lastVerifiedAt || pilot.checkedAt,
    acquireUrl: r.acquireUrl || null,
  });
  for (const sid of r.sourceIds || []) addLink(r.id, sourceIdRemap.get(sid) || sid);
}

const legacyRows = new Map();
for (const r of catalog.routes || []) legacyRows.set(r.id, r);
for (const r of tutorial.additionalRoutes || []) if (!legacyRows.has(r.id)) legacyRows.set(r.id, r);
for (const r of audit.additionalRoutes || []) if (!legacyRows.has(r.id)) legacyRows.set(r.id, r);

const inferFamily = (r, id) => radar.routes?.[id]?.family || (r.numberClass === 'data-only' ? 'data' : (String(r.numberClass).includes('temporary') || id.includes('temp') ? 'temporary' : 'long-term'));
for (const [legacyId, r] of legacyRows) {
  if (excludedGeneric.has(legacyId)) continue;
  const canonicalId = routeAliases.get(legacyId) || legacyId;
  const marketId = ensureMarket(r.country);
  const provider = r.provider || r.name || legacyId;
  let brandId;
  if (canonicalId !== legacyId && routes.has(canonicalId)) {
    brandId = routes.get(canonicalId).brandId;
  } else {
    brandId = `${slug(provider)}-${marketId}`;
    if (!brands.has(brandId)) brands.set(brandId, { id: brandId, marketId, networkId: null, name: provider });
  }
  if (!routes.has(canonicalId)) {
    routes.set(canonicalId, {
      id: canonicalId,
      marketId,
      networkId: null,
      brandId,
      displayName: r.name || provider,
      family: inferFamily(r, legacyId),
      numberClass: r.numberClass || null,
      form: r.form || null,
      surfaceState: radar.routes?.[legacyId] ? 'public-legacy' : 'backstage-only',
      evidenceState: 'needs-reconciliation',
      lastVerifiedAt: radar.routes?.[legacyId]?.verified || catalog.meta?.verifiedOn || null,
      acquireUrl: r.purchaseUrl || null,
    });
  }
  for (const ev of r.evidence || []) addLink(canonicalId, putSource(ev));
}

const snapshots = [];
const pushSnap = (routeId, kind, checkedAt, dataset, data) => {
  const canonicalId = routeAliases.get(routeId) || routeId;
  if (!routes.has(canonicalId) || data == null) return;
  snapshots.push({ id: `snap-${slug(canonicalId)}-${slug(kind)}-${hash(dataset + JSON.stringify(data)).slice(0,6)}`, routeId: canonicalId, kind, checkedAt: checkedAt || null, sourceDataset: dataset, data });
};
for (const [id, data] of Object.entries(radar.routes || {})) pushSnap(id, 'frontstage', data.verified || radar.updatedAt, 'radar-view.json', data);
for (const [id, data] of Object.entries(purchase.routes || {})) pushSnap(id, 'commercial', data.verifiedOn || purchase.verifiedOn, 'purchase-intelligence.json', data);
for (const [id, data] of Object.entries(retention.routes || {})) pushSnap(id, 'retention', data.last_verified_at || retention.verifiedOn, 'retention-intelligence.json', data);
for (const [id, data] of Object.entries(capabilities.routes || {})) pushSnap(id, 'capabilities', capabilities.verifiedOn, 'route-capabilities.json', data);
for (const [id, data] of Object.entries(locations.routes || {})) pushSnap(id, 'location', locations.verifiedOn, 'location-constraints.json', data);
for (const r of pilot.routes || []) pushSnap(r.id, 'current-profile', r.lastVerifiedAt || pilot.checkedAt, 'uk-directory-pilot.json', r);

for (const [legacyId, r] of legacyRows) {
  const canonicalId = routeAliases.get(legacyId) || legacyId;
  if (!routes.has(canonicalId)) continue;
  for (const ev of r.evidence || []) addLink(canonicalId, putSource(ev));
}
for (const routeId of routes.keys()) routes.get(routeId).sourceIds = [...(sourceLinks.get(routeId) || [])].sort();

const observations = (pilot.serviceObservations || []).filter(x => routes.has(x.routeId)).map((x, i) => ({ id: x.id || `obs-${slug(x.routeId)}-${i+1}-${hash(JSON.stringify(x)).slice(0,6)}`, ...x, sourceId: sourceIdRemap.get(x.sourceId) || x.sourceId }));
const events = (pilot.continuityEvents || []).filter(x => routes.has(x.routeId)).map((x, i) => ({ id: x.id || `evt-${slug(x.routeId)}-${i+1}-${hash(JSON.stringify(x)).slice(0,6)}`, ...x, sourceId: sourceIdRemap.get(x.sourceId) || x.sourceId }));
const aliases = [...routeAliases.entries()].map(([aliasId, routeId]) => ({ aliasId, routeId, reason: 'legacy route id consolidated into current concrete route id' }));

write('meta.json', { schemaVersion: 1, generatedFromLegacyAt: new Date().toISOString(), policy: 'Canonical normalized Phone data foundation. Public eligibility remains evidence-gated; missing data stays missing.' });
write('markets.json', [...markets.values()].sort((a,b)=>a.id.localeCompare(b.id)));
write('networks.json', [...networks.values()].sort((a,b)=>a.id.localeCompare(b.id)));
write('brands.json', [...brands.values()].sort((a,b)=>a.id.localeCompare(b.id)));
write('routes.json', [...routes.values()].sort((a,b)=>a.id.localeCompare(b.id)));
write('sources.json', [...sources.values()].sort((a,b)=>a.id.localeCompare(b.id)));
write('observations.json', observations);
write('events.json', events);
write('snapshots.json', snapshots.sort((a,b)=>a.id.localeCompare(b.id)));
write('aliases.json', aliases);

console.log(`Phone DB seed: ${markets.size} markets, ${networks.size} networks, ${brands.size} brands, ${routes.size} routes, ${sources.size} sources, ${observations.length} observations, ${events.length} events, ${snapshots.length} snapshots.`);
