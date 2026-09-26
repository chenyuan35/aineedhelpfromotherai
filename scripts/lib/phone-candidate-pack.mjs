import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export function readJsonl(input) {
  return fs.readFileSync(path.resolve(input), 'utf8').split(/\r?\n/).filter(Boolean).map((line, i) => {
    try { return JSON.parse(line); } catch (e) { throw new Error(`line ${i + 1}: invalid JSON: ${e.message}`); }
  });
}

export function validateCandidateRows(rows) {
  const allowedFamily = new Set(['long-term-sms-otp', 'data-esim', 'temporary-sms', 'unknown']);
  const allowedStatus = new Set(['already-admitted', 'HOLD', 'RESEARCH_CANDIDATE', 'DROP', 'EVIDENCE_SCAN']);
  const seen = new Map(), issues = [], warnings = [];
  const issue = (row, code, message) => issues.push({ recordId: row.record_id || null, code, message });
  const warn = (row, code, message) => warnings.push({ recordId: row.record_id || null, code, message });
  rows.forEach((row, index) => {
    if (!row.record_type || !row.record_id) { issue(row, 'missing-identity', 'record_type and record_id are required'); return; }
    if (seen.has(row.record_id)) issue(row, 'duplicate-record-id', `duplicate of line ${seen.get(row.record_id)}`); else seen.set(row.record_id, index + 1);
    if (!allowedStatus.has(row.inventory_status)) issue(row, 'invalid-status', `unsupported inventory_status ${row.inventory_status}`);
    if (!allowedFamily.has(row.family)) warn(row, 'unknown-family', `unrecognized family ${row.family}`);
    if (row.record_type !== 'route') return;
    if (!row.market_code || !row.brand || !row.route_name) issue(row, 'incomplete-route-identity', 'market_code, brand and route_name are required');
    if (!row.provenance) issue(row, 'missing-provenance', 'provenance is required');
    if (!Array.isArray(row.discovery_urls)) issue(row, 'missing-discovery-urls', 'discovery_urls must be an array');
    const text = `${row.notes || ''} ${row.internal_hold_reason || ''} ${row.canonical_basis || ''}`.toLowerCase();
    if (/(refuted|overturned|推翻)/i.test(text) && Number.isFinite(row.keep_cost_year_original)) issue(row, 'refuted-numeric-claim', 'numeric keep-cost is present while the record says the prior numeric claim was refuted; reviewed override required');
    if (row.inventory_status === 'RESEARCH_CANDIDATE' && /official-catalog-led/i.test(row.provenance || '') && !(row.discovery_urls || []).some(u => /reddit|v2ex|nodeseek|nodeloc|linux\.do|lowyat|forum/i.test(u))) warn(row, 'official-led-only', 'candidate still lacks independent community/operational discovery');
  });
  return { issues, warnings };
}

export const hashRecord = row => crypto.createHash('sha256').update(JSON.stringify(row)).digest('hex').slice(0, 16);
