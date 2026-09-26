import path from 'node:path';
import { readJsonl, validateCandidateRows } from './lib/phone-candidate-pack.mjs';
const input = process.argv[2];
if (!input) throw new Error('usage: node scripts/validate-phone-candidate-pack.mjs <candidate.jsonl> [--json]');
const rows = readJsonl(input); const { issues, warnings } = validateCandidateRows(rows);
const summary = { input: path.resolve(input), total: rows.length, routes: rows.filter(x => x.record_type === 'route').length, errors: issues.length, warnings: warnings.length, issues, warnings };
if (process.argv.includes('--json')) console.log(JSON.stringify(summary, null, 2)); else {
  console.log(`Candidate pack: ${summary.total} records / ${summary.routes} routes / ${summary.errors} errors / ${summary.warnings} warnings`);
  for (const x of issues) console.log(`ERROR ${x.recordId || '-'} ${x.code}: ${x.message}`);
  for (const x of warnings) console.log(`WARN  ${x.recordId || '-'} ${x.code}: ${x.message}`);
}
if (issues.length) process.exitCode = 2;
