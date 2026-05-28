// lib/drift-remediation.js — Auto-Remediation on Drift Detection
// When eval shows regression (solve rate drop >3%), auto-quarantine
// the worst-performing memory seeds from the affected category.
// Re-runs eval after quarantine to verify improvement.

// experimental/lib/drift-remediation.js — READ-ONLY MODE
// Identifies regressing categories and produces remediation recommendations.
// Does NOT mutate runtime resolve-cache. Reports stored in experimental store.

const fs = require('fs');
const path = require('path');
const driftDetector = require('./drift-detector');
const readOnlyCache = require('./read-only-cache');

const REMEDIATION_LOG = path.join(__dirname, '..', 'data', 'remediation-log.json');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function loadLog() {
  try {
    if (fs.existsSync(REMEDIATION_LOG)) return JSON.parse(fs.readFileSync(REMEDIATION_LOG, 'utf8'));
  } catch {}
  return { analyses: [], total_recommendations: 0 };
}

function saveLog(log) {
  ensureDir(path.dirname(REMEDIATION_LOG));
  fs.writeFileSync(REMEDIATION_LOG, JSON.stringify(log, null, 2));
}

function findRegressingCategories(driftReport) {
  const categories = new Set();
  for (const reg of (driftReport.regressions || [])) {
    if (reg.category) categories.add(reg.category);
  }
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

function findWorstSeeds(category, limit = 3) {
  const allHints = readOnlyCache.getAllHints();
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

// Analyze drift and produce remediation recommendations (no runtime mutation)
function runRemediation() {
  const drift = driftDetector.getReport();
  const totalBefore = drift.total_regressions_detected;

  if (totalBefore === 0) {
    return { status: 'ok', message: 'No regressions detected', quarantined: 0, mode: 'read-only' };
  }

  const regressing = findRegressingCategories(drift);
  if (regressing.length === 0) {
    return { status: 'ok', message: 'No regressing categories identified', quarantined: 0, mode: 'read-only' };
  }

  const candidates = [];
  for (const cat of regressing) {
    const worst = findWorstSeeds(cat, 3);
    for (const seed of worst) {
      candidates.push({
        seed_id: seed.id,
        category: cat,
        fail_rate: seed.fail_rate,
        current_score: seed.score,
        suggested_action: 'quarantine',
        reason: 'Fail rate ' + (seed.fail_rate * 100).toFixed(0) + '% over ' + seed.total + ' attempts',
      });
    }
  }

  const log = loadLog();
  log.analyses.push({
    ran_at: new Date().toISOString(),
    regressions_detected: totalBefore,
    categories_affected: regressing,
    candidates_for_remediation: candidates.length,
    candidates,
    note: 'READ-ONLY: Automated quarantine blocked. Manual review required.',
  });
  log.total_recommendations += candidates.length;
  saveLog(log);

  return {
    status: 'analysis_only',
    regressions_detected: totalBefore,
    categories_affected: regressing,
    candidates_for_remediation: candidates.length,
    candidates,
    mode: 'read-only',
    note: 'Remediation candidates identified but NOT auto-applied. Experimental systems cannot mutate runtime state.',
  };
}

function getRemediationHistory() {
  const log = loadLog();
  return {
    total_recommendations: log.total_recommendations,
    analyses: log.analyses.slice(-20).reverse(),
    mode: 'read-only',
  };
}

module.exports = { runRemediation, getRemediationHistory, findRegressingCategories, findWorstSeeds };
