import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const routes = read('data/phone/v1/routes.json');
const sources = read('data/phone/v1/sources.json');
const observations = read('data/phone/v1/observations.json');
const events = read('data/phone/v1/events.json');
const summaries = read('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json').routes;
const byId = new Map(sources.map(source => [source.id, source]));
const seen = new Set(observations.map(o => o.routeId));
const hasCommunityTag = route => (route.sourceIds || []).some(id => /community|first.hand/i.test(byId.get(id)?.type || ''));
const unavailable = key => summaries.filter(r => !Number.isFinite(r.metrics?.[key])).length;
const stateCount = type => routes.filter(r => r.evidenceState === type).length;
const queue = routes.filter(r => r.evidenceState === 'admitted' && !hasCommunityTag(r) && !seen.has(r.id) && r.sourceIds.length >= 6).sort((a,b) => b.sourceIds.length-a.sourceIds.length || a.id.localeCompare(b.id));
const tick = String.fromCharCode(96);
const rows = [
  '# Phone Radar: reproducible evidence gap audit',
  '',
  'Snapshot: generated from the checked-out canonical JSON data using: node scripts/audit-phone-evidence-gaps.mjs --write. This report does **not** verify a production deployment, externally sampled coverage, or 90%/100% real user-demand coverage.',
  '',
  '## Measured canonical gaps',
  '',
  '| Field | Count | Notes |',
  '| --- | ---: | --- |',
  '| Canonical routes | ' + routes.length + ' | Internal model, not real-world demand denominator |',
  '| Sources | ' + sources.length + ' | Source record count, not count of real-world buyers |',
  '| Lifecycle/incident events | ' + events.length + ' | Not equivalent to app OTP outcomes |',
  '| App-specific observations | ' + observations.length + ' | Author-and-operation evidence, not independent original URLs |',
  '| Routes with any app observation | ' + seen.size + ' | Might be positive, negative or mixed |',
  '| Routes without any app observation | ' + (routes.length-seen.size) + ' | App reliability unknown |',
  '| Routes without linked community-tagged source | ' + routes.filter(r=>!hasCommunityTag(r)).length + ' | Only a source-label proxy; review types before claiming missing testimony |',
  '| Acquisition price unknown in native currency | ' + unavailable('acquisitionCostOriginal') + ' | Missing numeric acquisition costs |',
  '| Annual keep cost unknown in native currency | ' + unavailable('keepYearCostOriginal') + ' | Missing numeric annual costs |',
  '| Acquisition price missing comparable CNY figure | ' + unavailable('acquisitionCostCny') + ' | Native price may exist but vetted conversion missing |',
  '| Annual keep price missing comparable CNY figure | ' + unavailable('keepYearCostCny') + ' | Do not rank unknown CNY costs as cheap |',
  '| KYC unknown or unclear | ' + summaries.filter(x=>['unknown','unclear'].includes(x.decisionFacts?.kycState)).length + ' | Unknown must not imply KYC-free |',
  '| Admitted / HOLD / reconciliation | ' + [stateCount('admitted'),stateCount('hold'),stateCount('needs-reconciliation')].join(' / ') + ' | Admitted does not imply user recommendation |',
  '',
  '## Firsthand-source acquisition priorities (mechanical gap queue, not demand rank)',
  '',
  'Each row below is admitted, has at least six source records, lacks a community-tagged source record and has no app-specific observation. This is a review queue, not a claim that each record has no independent testimony; check original forum evidence before adding an outcome.',
  '',
  '| Route | Linked sources |',
  '| --- | ---: |',
  ...queue.map(r=>'| '+tick+r.id+tick+' | '+r.sourceIds.length+' |'),
  '',
  '## Operational rules',
  '',
  '1. Seek original buyer testimony (acquisition, checkout, payment, KYC, first activation, named-app OTP operation, number loss, recovery, cancellation) before official-page repetition. Original discussion URL and author are separate independence dimensions.',
  '2. Do not infer app signup from mere SMS reception, or mainland-first activation from roaming SMS. Preserve negative and contradictory reports and unknown coordinates.',
  '3. Use existing Phone URL and local browser search. Query matches are text/evidence discovery, not recommendations; unsupported queries fail closed. Normalize only a small number of verified route-name/country aliases.',
  '4. Global price ranks must use comparable currency values; a raw HKD or GBP amount is not comparable numerically to a EUR price, and unconverted CNY stays unknown.',
  '5. Maintain 160 routes, 135 comparison rows, 3 indexable route pages and 31 sitemap URLs until separate demand and release gates clear; no extra backend or per-query paid API.',
  ''
];
const output = rows.join('\n');
if (process.argv.includes('--write')) {
  const file = path.join(root,'docs/PHONE_EVIDENCE_GAPS_2026-10-10.md');
  fs.writeFileSync(file, output + '\n');
  console.log('Wrote '+file);
} else console.log(output);
