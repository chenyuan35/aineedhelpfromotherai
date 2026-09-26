import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJsonl, validateCandidateRows, hashRecord } from './lib/phone-candidate-pack.mjs';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = process.argv[2];
if (!input) throw new Error('usage: node scripts/stage-phone-candidates.mjs <candidate.jsonl> [output.jsonl]');
const output = path.resolve(process.argv[3] || path.join(repo, 'data/phone/staging/review-queue.jsonl'));
const policy = JSON.parse(fs.readFileSync(path.join(repo, 'data/phone/research-policy.json'), 'utf8'));
const rows = readJsonl(input); const validation = validateCandidateRows(rows); const blocked = new Set(validation.issues.map(x => x.recordId));
const community = row => !/official-catalog-led/i.test(row.provenance || '') || (row.discovery_urls || []).some(u => /reddit|v2ex|nodeseek|nodeloc|linux\.do|lowyat|forum/i.test(u));
const priority = row => {
  if (row.inventory_status === 'DROP' || row.record_type !== 'route') return 'exclude';
  if (blocked.has(row.record_id)) return 'blocked-correction-required';
  if (row.inventory_status === 'HOLD') return 'hold-reopen';
  if (row.family === 'data-esim') return community(row) ? 'P1-data-value' : 'P3-needs-community';
  if (row.family === 'long-term-sms-otp') {
    if (Number.isFinite(row.keep_cost_year_cny) && row.keep_cost_year_cny > policy.longTermResearch.defaultMaxKeepCostCny) return 'P4-high-cost-reference';
    return community(row) ? 'P1-low-cost-retention' : 'P3-needs-community';
  }
  return 'P4-out-of-primary-scope';
};
const staged = rows.filter(x => x.record_type === 'route' && !['DROP','EVIDENCE_SCAN'].includes(x.inventory_status)).map(row => ({
  schemaVersion: 1, recordId: row.record_id, marketCode: row.market_code, marketName: row.market_name, hostNetwork: row.host_network || null,
  brand: row.brand, routeName: row.route_name, family: row.family, inventoryStatus: row.inventory_status, researchPriority: priority(row),
  provenance: row.provenance, discoveryUrls: row.discovery_urls || [], discoveryDates: row.discovery_dates || [], lastVerifiedAt: row.last_verified_at || null,
  keepCost: Number.isFinite(row.keep_cost_year_original) ? { amount: row.keep_cost_year_original, currency: row.keep_cost_currency || null, cny: Number.isFinite(row.keep_cost_year_cny) ? row.keep_cost_year_cny : null } : null,
  keepAction: row.keep_action || null, acquisitionSummary: row.acquisition_summary || null, holdReason: row.internal_hold_reason || null,
  sourceRefs: row.source_ids || [], evidenceFiles: row.evidence_files || [], canonicalBasis: row.canonical_basis || null, notes: row.notes || null,
  validationState: blocked.has(row.record_id) ? 'blocked' : 'reviewable', rawHash: hashRecord(row)
}));
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, staged.map(x => JSON.stringify(x)).join('\n') + '\n');
const counts = Object.fromEntries([...new Set(staged.map(x => x.researchPriority))].sort().map(k => [k, staged.filter(x => x.researchPriority === k).length]));
console.log(`Staged ${staged.length} routes -> ${output}`); console.log(JSON.stringify(counts, null, 2));
if (validation.issues.length) console.log(`Blocked ${blocked.size} route(s) pending reviewed correction: ${[...blocked].join(', ')}`);
