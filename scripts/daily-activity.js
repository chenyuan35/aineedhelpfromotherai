// scripts/daily-activity.js — Automated daily content generator
// Zero API keys required. Generates content from templates + existing data.
// Runs via GitHub Actions daily-activity.yml

const fs = require('fs');
const path = require('path');

// Templates for daily case studies — rotate through them
const CASE_TEMPLATES = [
  {
    id: 'FC-AUTO',
    title: 'AI agent debugging failure: {topic}',
    short: '{topic}',
    description: 'An AI agent spent {time} debugging {topic}. Root cause: {cause}. Fix: {fix}. This case was added automatically.',
    severity: 'high',
    environments: ['node', 'docker', 'ci'],
  }
];

const TOPICS = [
  { topic: 'Docker layer cache invalidation', time: '38 minutes', cause: 'build context includes .git (80MB) every time', fix: 'add .dockerignore with .git and node_modules' },
  { topic: 'npm peer dependency conflict', time: '22 minutes', cause: 'react 19 installed alongside react 18', fix: 'npm ls react to find duplicate, dedupe' },
  { topic: 'Python venv activation in shell scripts', time: '15 minutes', cause: 'shebang uses system python instead of venv', fix: 'use $(which python) or source venv/bin/activate explicitly' },
  { topic: 'PostgreSQL connection pool exhaustion', time: '45 minutes', cause: 'transactions not closed in error paths', fix: 'add pool.on(\'error\') handler and ensure client.release() in finally blocks' },
  { topic: 'Git merge conflict in lock files', time: '12 minutes', cause: 'package-lock.json auto-merged incorrectly', fix: 'git checkout --ours package-lock.json && npm install' },
  { topic: 'SSL certificate verification in private npm registry', time: '30 minutes', cause: 'NODE_TLS_REJECT_UNAUTHORIZED=0 in production config', fix: 'configure CA cert via NODE_EXTRA_CA_CERTS' },
  { topic: 'WebSocket reconnection loop with exponential backoff', time: '25 minutes', cause: 'backoff reset on each reconnect attempt', fix: 'persist attempt count outside reconnect handler' },
  { topic: 'Environment-specific CORS configuration', time: '18 minutes', cause: 'CORS origin list missing production domain', fix: 'use ALLOWED_ORIGINS env var with comma-separated list' },
  { topic: 'Node.js memory leak from unclosed EventSource connections', time: '40 minutes', cause: 'SSE connections not cleaned up on page navigation', fix: 'add beforeunload listener + AbortController' },
  { topic: 'TypeScript path aliases not resolved at runtime', time: '20 minutes', cause: 'tsconfig paths only work with tsc, not ts-node', fix: 'use tsconfig-paths module or switch to tsc-alias' },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCase() {
  const t = pick(TOPICS);
  const now = new Date().toISOString();
  return {
    id: `FC_AUTO_${Date.now().toString(36).toUpperCase()}`,
    title: `AI agent debugging failure: ${t.topic}`,
    description: `An AI agent spent ${t.time} debugging ${t.topic}. Root cause: ${t.cause}. Fix: ${t.fix}. This case was added automatically.`,
    severity: 'high',
    environments: ['node', 'docker', 'ci'],
    root_cause: t.cause,
    fix: t.fix,
    time_lost_min: parseInt(t.time.match(/\d+/)[0]),
    added_at: now,
    source: 'daily-auto-generate',
  };
}

function main() {
  const dataDir = path.join(__dirname, '..', 'data');

  // Ensure data dir exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Load existing failure cases
  const casesPath = path.join(dataDir, 'failure-cases.json');
  let cases = [];
  try {
    cases = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
    if (!Array.isArray(cases)) cases = [];
  } catch {
    cases = [];
  }

  // Add new case
  const newCase = generateCase();
  cases.push(newCase);
  console.log(`[daily-activity] Added case: ${newCase.id} — ${newCase.title}`);

  // Keep last 500 cases max
  if (cases.length > 500) {
    cases = cases.slice(-500);
  }

  fs.writeFileSync(casesPath, JSON.stringify(cases, null, 2));
  console.log(`[daily-activity] Total cases: ${cases.length}`);

  // Update daily digest
  const digestPath = path.join(__dirname, '..', 'data', 'daily-digest.json');
  const digest = {
    last_updated: new Date().toISOString(),
    cases_added_today: 1,
    total_cases: cases.length,
    latest_case: newCase.title,
    update_count: 0,
  };
  try {
    const prev = JSON.parse(fs.readFileSync(digestPath, 'utf8'));
    digest.update_count = (prev.update_count || 0) + 1;
  } catch {
    digest.update_count = 1;
  }
  fs.writeFileSync(digestPath, JSON.stringify(digest, null, 2));

  // Update the PROGRESS.md with daily entry
  const progressPath = path.join(__dirname, '..', 'PROGRESS.md');
  const date = new Date().toISOString().split('T')[0];
  const entry = `\n## ${date} (Auto): Daily content refresh\n\n- Auto-generated case: ${newCase.title}\n- Root cause: ${newCase.root_cause}\n- Total failure cases: ${cases.length}\n`;
  try {
    const progress = fs.readFileSync(progressPath, 'utf8');
    fs.writeFileSync(progressPath, entry + progress);
  } catch (e) {
    console.error('[daily-activity] Failed to update PROGRESS.md:', e.message);
  }

  console.log('[daily-activity] Done');
}

main();
