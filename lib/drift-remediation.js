// lib/drift-remediation.js — Auto-Remediation on Drift Detection
// When eval shows regression (solve rate drop >3%), auto-quarantine
// the worst-performing memory seeds from the affected category.
// Re-runs eval after quarantine to verify improvement.

const fs = require('fs');
const path = require('path');
const driftDetector = require('./drift-detector');
const resolveCache = require('./resolve-cache');
const evalHarness = require('./eval-harness');

const REMEDIATION_LOG = path.join(__dirname, '..', 'data', 'remediation-log.json');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function loadLog() {
  try {
    if (fs.existsSync(REMEDIATION_LOG)) return JSON.parse(fs.readFileSync(REMEDIATION_LOG, 'utf8'));
  } catch {}
  return { remediations: [], total_quarantined: 0 };
}

function saveLog(log) {
  ensureDir(path.dirname(REMEDIATION_LOG));
  fs.writeFileSync(REMEDIATION_LOG, JSON.stringify(log, null, 2));
}

// Identify which categories are regressing
function findRegressingCategories(driftReport) {
  const categories = new Set();
  for (const reg of (driftReport.regressions || [])) {
    if (reg.category) categories.add(reg.category);
  }
  // Also check the per-category breakdown
  if (driftReport.per_category) {
    for (const [cat, data] of Object.entries(driftReport.per_category)) {
      if (data.solve_rate_trend && data.solve_rate_trend.length >= 2) {
        const latest = data.solve_rate_trend[data.solve_rate_trend.length - 1];
        const prev = data.solve_rate_trend[data.solve_rate_trend.length - 2];
        if (latest < prev - 3) categories.add(cat);
      }
    }
  }
  return [...categories];
}

// Find worst memory seeds for a category (by failure count or score)
function findWorstSeeds(category, limit = 3) {
  const allHints = resolveCache.getAllHints();
  const candidates = [];

  for (const [id, hint] of Object.entries(allHints)) {
    if (hint.status === 'blacklisted' || hint.status === 'quarantined') continue;
    if (hint.category !== category && category !== 'all') continue;

    const total = (hint.success_count || 0) + (hint.failure_count || 0);
    if (total === 0) continue;

    const failRate = (hint.failure_count || 0) / total;
    if (failRate > 0.3) {
      candidates.push({ id, fail_rate: failRate, score: hint.score ?? 0.9, failures: hint.failure_count || 0, total });
    }
  }

  return candidates.sort((a, b) => b.fail_rate - a.fail_rate).slice(0, limit);
}

// Auto-remediate: quarantine worst seeds from regressing categories
function runRemediation() {
  const drift = driftDetector.getReport();
  const totalBefore = drift.total_regressions_detected;

  if (totalBefore === 0) {
    return { status: 'ok', message: 'No regressions detected, nothing to remediate', quarantined: 0 };
  }

  const regressing = findRegressingCategories(drift);
  if (regressing.length === 0) {
    return { status: 'ok', message: 'No regressing categories identified', quarantined: 0 };
  }

  const quarantined = [];
  const log = loadLog();

  for (const cat of regressing) {
    const worst = findWorstSeeds(cat, 3);
    for (const seed of worst) {
      const hint = resolveCache.getHint(seed.id);
      if (!hint) continue;
      if (hint.status === 'quarantined' || hint.status === 'blacklisted') continue;

      hint.status = resolveCache.HINT_STATUS.QUARANTINED;
      hint.score = Math.min(hint.score || 0, resolveCache.MIN_SCORE - 0.1);
      hint.updated_at = new Date().toISOString();
      hint.remediation_reason = 'Auto-quarantined by drift remediation. Fail rate: ' + (seed.fail_rate * 100).toFixed(0) + '% over ' + seed.total + ' attempts';
      quarantined.push(seed);
    }
  }

  // Re-check drift after quarantine
  let postDrift = null;
  try {
    postDrift = driftDetector.getReport();
  } catch {}

  const entry = {
    ran_at: new Date().toISOString(),
    regressions_before: totalBefore,
    categories_affected: regressing,
    quarantined: quarantined.length,
    seeds_quarantined: quarantined.map(s => s.id),
    regressions_after: postDrift?.total_regressions_detected ?? null,
  };

  log.remediations.push(entry);
  log.total_quarantined += quarantined.length;
  saveLog(log);

  return {
    status: quarantined.length > 0 ? 'remediated' : 'no_action',
    regressions_before: totalBefore,
    categories_affected: regressing,
    quarantined: quarantined.length,
    seeds: quarantined,
    regressions_after: entry.regressions_after,
  };
}

function getRemediationHistory() {
  const log = loadLog();
  return {
    total_quarantined: log.total_quarantined,
    remediations: log.remediations.slice(-20).reverse(),
  };
}

module.exports = { runRemediation, getRemediationHistory, findRegressingCategories, findWorstSeeds };
