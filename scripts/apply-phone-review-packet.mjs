import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(repo, 'data/phone/v1');
const input = process.argv[2];
const apply = process.argv.includes('--apply');
if (!input || (!process.argv.includes('--check') && !apply)) throw new Error('usage: node scripts/apply-phone-review-packet.mjs <packet.json> --check|--apply');
const packet = JSON.parse(fs.readFileSync(path.resolve(input), 'utf8'));
if (packet.schemaVersion !== 1 || packet.operation !== 'add' || packet.reviewState !== 'approved-backstage') throw new Error('packet must be schemaVersion=1, operation=add, reviewState=approved-backstage');
if (!packet.route?.id || !packet.route.marketId || !packet.route.brandId || !packet.route.displayName || !packet.route.family) throw new Error('route identity is incomplete');
if (packet.route.surfaceState !== 'backstage-only') throw new Error('review packet may only add backstage-only routes');
if (!['research-candidate','hold','admitted'].includes(packet.route.evidenceState)) throw new Error('invalid route evidenceState');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const tables = { markets: read('markets.json'), networks: read('networks.json'), brands: read('brands.json'), routes: read('routes.json'), sources: read('sources.json'), observations: read('observations.json'), events: read('events.json'), snapshots: read('snapshots.json'), numberRanges: read('number-ranges.json') };
const has = (table, id) => tables[table].some(x => x.id === id);
if (has('routes', packet.route.id)) throw new Error(`route already exists: ${packet.route.id}`);
if (!has('markets', packet.route.marketId)) throw new Error(`missing market: ${packet.route.marketId}`);
if (packet.route.networkId && !has('networks', packet.route.networkId) && packet.network?.id !== packet.route.networkId) throw new Error(`missing network: ${packet.route.networkId}`);
if (!has('brands', packet.route.brandId) && packet.brand?.id !== packet.route.brandId) throw new Error(`missing brand: ${packet.route.brandId}`);
const incomingIds = new Set();
for (const [kind, rows] of Object.entries({ sources: packet.sources || [], observations: packet.observations || [], events: packet.events || [], snapshots: packet.snapshots || [], numberRanges: packet.numberRanges || [] })) {
  for (const row of rows) {
    if (!row.id) throw new Error(`${kind}: missing id`);
    if (incomingIds.has(row.id)) throw new Error(`duplicate packet id: ${row.id}`); incomingIds.add(row.id);
    if (has(kind, row.id)) throw new Error(`${kind}: id already exists: ${row.id}`);
  }
}
const sourceIds = new Set([...tables.sources.map(x => x.id), ...(packet.sources || []).map(x => x.id)]);
const routeSourceIds = packet.sourceIds || packet.route.sourceIds || [];
for (const id of routeSourceIds) if (!sourceIds.has(id)) throw new Error(`route source missing: ${id}`);
for (const row of [...(packet.observations || []), ...(packet.events || [])]) {
  if (row.routeId !== packet.route.id) throw new Error(`${row.id}: routeId must equal ${packet.route.id}`);
  if (row.sourceId && !sourceIds.has(row.sourceId)) throw new Error(`${row.id}: source missing ${row.sourceId}`);
}
for (const row of packet.snapshots || []) if (row.routeId !== packet.route.id) throw new Error(`${row.id}: snapshot routeId must equal ${packet.route.id}`);
for (const row of packet.numberRanges || []) if (!has('markets', row.marketId)) throw new Error(`${row.id}: missing range market ${row.marketId}`);
const route = { ...packet.route, sourceIds: [...routeSourceIds].sort() };
const changes = { route: route.id, addBrand: packet.brand && !has('brands', packet.brand.id), addNetwork: packet.network && !has('networks', packet.network.id), sources: (packet.sources || []).length, observations: (packet.observations || []).length, events: (packet.events || []).length, snapshots: (packet.snapshots || []).length, numberRanges: (packet.numberRanges || []).length };
console.log(JSON.stringify(changes, null, 2));
if (!apply) { console.log('CHECK ONLY: canonical data unchanged.'); process.exit(0); }
if (changes.addNetwork) tables.networks.push(packet.network);
if (changes.addBrand) tables.brands.push(packet.brand);
tables.routes.push(route); tables.sources.push(...(packet.sources || [])); tables.observations.push(...(packet.observations || [])); tables.events.push(...(packet.events || [])); tables.snapshots.push(...(packet.snapshots || [])); tables.numberRanges.push(...(packet.numberRanges || []));
const atomic = (name, value) => { const file = path.join(root, name); const tmp = `${file}.tmp-${process.pid}`; fs.writeFileSync(tmp, JSON.stringify(value.sort((a,b)=>String(a.id).localeCompare(String(b.id))), null, 2) + '\n'); fs.renameSync(tmp, file); };
atomic('networks.json', tables.networks); atomic('brands.json', tables.brands); atomic('routes.json', tables.routes); atomic('sources.json', tables.sources); atomic('observations.json', tables.observations); atomic('events.json', tables.events); atomic('snapshots.json', tables.snapshots); atomic('number-ranges.json', tables.numberRanges);
console.log(`APPLIED ${route.id}. Run node scripts/build-phone-database.mjs and tests before committing.`);
