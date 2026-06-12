// scripts/daily-activity.js - Automated daily evidence snapshot.
// Keeps the project active without inventing failure cases.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function readJson(relativePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  } catch {
    return fallback;
  }
}

function writeFile(relativePath, body) {
  const file = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body);
  console.log(`[daily-activity] wrote ${relativePath}`);
}

function minutesFor(c) {
  return Number(c.time_wasted_minutes || c.time_lost_min || 0);
}

function isPublicCase(c) {
  return c?.source !== 'daily-auto-generate' && !String(c?.id || '').startsWith('FC_AUTO_');
}

function firstLine(value, fallback = '') {
  const text = String(value || fallback).replace(/\s+/g, ' ').trim();
  return text.length > 180 ? `${text.slice(0, 177)}...` : text;
}

function buildReport(snapshot) {
  return [
    '# Daily Ops Report',
    '',
    `Generated: ${snapshot.last_updated}`,
    '',
    '## Evidence Health',
    '',
    '| Metric | Value |',
    '| --- | --- |',
    `| Public real failure cases | ${snapshot.public_cases} |`,
    `| Suppressed generated cases | ${snapshot.suppressed_generated_cases} |`,
    `| Observed debugging waste | ${snapshot.observed_minutes.toLocaleString()} minutes |`,
    `| Failure dynamics | ${snapshot.failure_dynamics} |`,
    `| Interventions pending measurement | ${snapshot.pending_interventions} |`,
    '',
    '## Next Automatic Action',
    '',
    `- ${snapshot.next_action}`,
    '',
    '## Guardrail',
    '',
    'Daily automation must refresh evidence, reports, and discovery surfaces without fabricating failure cases.',
    '',
    'Compression: daily automation keeps the growth loop alive by publishing current evidence, not synthetic debugging stories.',
    ''
  ].join('\n');
}

function updateProgress(snapshot) {
  const date = snapshot.last_updated.slice(0, 10);
  const marker = `<!-- daily-activity:${date} -->`;
  const progressPath = path.join(root, 'PROGRESS.md');
  const current = fs.existsSync(progressPath) ? fs.readFileSync(progressPath, 'utf8') : '';
  if (current.includes(marker)) {
    console.log(`[daily-activity] PROGRESS.md already has ${date} evidence snapshot.`);
    return;
  }

  const entry = [
    marker,
    `## ${date} (Auto): Daily evidence refresh`,
    '',
    `- Public real failure cases: ${snapshot.public_cases}`,
    `- Suppressed generated cases: ${snapshot.suppressed_generated_cases}`,
    `- Observed debugging waste: ${snapshot.observed_minutes.toLocaleString()} minutes`,
    `- Next automatic action: ${snapshot.next_action}`,
    ''
  ].join('\n');
  fs.writeFileSync(progressPath, `${entry}\n${current}`);
  console.log('[daily-activity] updated PROGRESS.md');
}

function main() {
  const cases = readJson('data/failure-cases.json', []);
  const dynamics = readJson('data/failure-dynamics.json', []);
  const previous = readJson('data/daily-digest.json', null);
  const publicCases = Array.isArray(cases) ? cases.filter(isPublicCase) : [];
  const suppressed = Array.isArray(cases) ? cases.length - publicCases.length : 0;
  const interventions = Array.isArray(dynamics) ? dynamics.flatMap(d => d.interventions || []) : [];
  const pendingInterventions = interventions.filter(i => i.effectiveness_tracking === 'pending').length;
  const observedMinutes = publicCases.reduce((sum, c) => sum + minutesFor(c), 0);

  const nextAction = pendingInterventions > 0
    ? 'Collect measured effectiveness for pending interventions before adding new claims.'
    : 'Keep production growth checks green and look for real debugging sessions to add.';

  const snapshot = {
    last_updated: new Date().toISOString(),
    cases_added_today: 0,
    public_cases: publicCases.length,
    suppressed_generated_cases: suppressed,
    total_case_records: Array.isArray(cases) ? cases.length : 0,
    observed_minutes: observedMinutes,
    failure_dynamics: Array.isArray(dynamics) ? dynamics.length : 0,
    interventions: interventions.length,
    pending_interventions: pendingInterventions,
    latest_public_case: publicCases.at(-1)?.title || null,
    top_public_case: publicCases
      .slice()
      .sort((a, b) => minutesFor(b) - minutesFor(a))
      .map(c => `${c.id}: ${firstLine(c.title)}`)
      .at(0) || null,
    next_action: nextAction,
    update_count: previous ? (previous.update_count || 0) + 1 : 1
  };

  writeFile('data/daily-digest.json', `${JSON.stringify(snapshot, null, 2)}\n`);
  writeFile('tasks/daily-ops-report.md', buildReport(snapshot));
  updateProgress(snapshot);
  console.log(`[daily-activity] Public cases: ${snapshot.public_cases}; suppressed generated cases: ${suppressed}`);
}

main();
