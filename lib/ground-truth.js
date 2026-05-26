// lib/ground-truth.js — Ground truth verification system
// Verifies agent fixes against real-world outcomes
// Connects sandbox-executor + reputation-system + reality-ingestor

const fs = require('fs');
const path = require('path');

const VERIFICATION_PATH = path.join(__dirname, '..', 'data', 'ground-truth.json');
const MIN_SANDBOX_CONFIDENCE = 0.7;

function load() {
  try {
    if (fs.existsSync(VERIFICATION_PATH)) {
      return JSON.parse(fs.readFileSync(VERIFICATION_PATH, 'utf8'));
    }
  } catch (e) { console.error('[ground-truth] Load error:', e.message); }
  return { verifications: [], updated_at: null, stats: { total: 0, verified: 0, failed: 0, pending: 0 } };
}

function save(data) {
  try {
    const dir = path.dirname(VERIFICATION_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(VERIFICATION_PATH, JSON.stringify(data, null, 2));
  } catch (e) { console.error('[ground-truth] Save error:', e.message); }
}

// Verify a fix: tries sandbox execution first, falls back to logical verification
async function verifyFix(taskId, agentId, fixData) {
  const sandbox = require('./sandbox-executor');
  const reputation = require('./reputation-system');
  const reality = require('./reality-ingestor');

  const result = {
    task_id: taskId,
    agent_id: agentId,
    verified_at: new Date().toISOString(),
    method: 'none',
    success: false,
    confidence: 0,
    details: null,
  };

  // Find the reality task for context
  const realityTasks = reality.loadRealityTasks();
  const task = (realityTasks.tasks || []).find(t => t.id === taskId);

  if (!fixData) {
    result.method = 'no_data';
    result.confidence = 0;
    result.success = false;
    result.error = 'No fix data provided for verification';
    recordResult(result);
    return result;
  }

  const repoUrl = fixData.repo_url || task?.source_url;
  const patchContent = fixData.patch || fixData.solution || fixData.fix;
  const testCommand = fixData.test_command;

  // Try sandbox execution if we have a repo and patch
  if (sandbox.hasGit() && repoUrl && patchContent) {
    const execResult = sandbox.executeFix(repoUrl, fixData.ref, patchContent, testCommand, taskId);
    result.method = 'sandbox';
    result.success = execResult.overall_success === true;
    result.confidence = result.success ? 0.95 : 0.8;
    result.details = {
      sandbox_result: execResult,
      stages: execResult.stages,
      failure_reason: execResult.failure_reason,
    };

    if (result.success) {
      reputation.recordVerifiedFix(agentId, taskId, { method: 'sandbox', confidence: result.confidence });
    } else {
      const severity = execResult.failure_reason === 'assertion_error' ? 1.5 : 0.8;
      reputation.recordHallucination(agentId, taskId, severity, { method: 'sandbox', failure_reason: execResult.failure_reason });
    }

    recordResult(result);
    return result;
  }

  // Fallback: logical verification
  if (patchContent) {
    const logicalResult = sandbox.logicalVerify(repoUrl, patchContent, taskId);
    result.method = 'logical';
    result.success = logicalResult.overall_success === true;
    result.confidence = 0.5;
    result.details = {
      logical_result: logicalResult,
      checks: logicalResult.stages.checks,
    };

    if (result.success) {
      reputation.recordVerifiedFix(agentId, taskId, { method: 'logical', confidence: 0.5 });
    } else {
      reputation.recordHallucination(agentId, taskId, 0.5, { method: 'logical' });
    }

    recordResult(result);
    return result;
  }

  // No verification possible
  result.method = 'unverifiable';
  result.confidence = 0;
  result.success = null;
  result.error = 'Cannot verify — no patch content and no sandbox available';
  recordResult(result);
  return result;
}

function recordResult(result) {
  const data = load();
  data.verifications.push({
    ...result,
    recorded_at: new Date().toISOString(),
  });
  data.stats.total++;
  if (result.success === true) data.stats.verified++;
  else if (result.success === false) data.stats.failed++;
  else data.stats.pending++;
  data.updated_at = new Date().toISOString();
  save(data);
}

function getVerification(taskId) {
  const data = load();
  return (data.verifications || []).filter(v => v.task_id === taskId).slice(-1)[0] || null;
}

function getAllVerifications(limit = 50) {
  const data = load();
  return (data.verifications || []).slice(-limit).reverse();
}

function getStats() {
  const data = load();
  const verifications = data.verifications || [];
  const byMethod = {};
  for (const v of verifications) {
    byMethod[v.method] = (byMethod[v.method] || 0) + 1;
  }
  const sandboxRuns = verifications.filter(v => v.method === 'sandbox');
  const sandboxSuccess = sandboxRuns.filter(v => v.success === true).length;
  return {
    total_verifications: verifications.length,
    verified: data.stats?.verified || 0,
    failed: data.stats?.failed || 0,
    pending: data.stats?.pending || 0,
    verified_rate: verifications.length > 0 ? Math.round(((data.stats?.verified || 0) / verifications.length) * 100) : 0,
    by_method: byMethod,
    sandbox_success_rate: sandboxRuns.length > 0 ? Math.round((sandboxSuccess / sandboxRuns.length) * 100) : 0,
    sandbox_total: sandboxRuns.length,
    reality_divergence_score: calculateRealityDivergence(verifications),
  };
}

function calculateRealityDivergence(verifications) {
  // How much does the system's self-assessment diverge from ground truth?
  // Higher = system is living in a fantasy world
  if (verifications.length < 5) return 0;
  const failedSandbox = verifications.filter(v => v.method === 'sandbox' && v.success === false);
  const logicalAccepted = verifications.filter(v => v.method === 'logical' && v.success === true);
  if (failedSandbox.length === 0 && logicalAccepted.length === 0) return 0;
  const divergence = (failedSandbox.length + logicalAccepted.length) / verifications.length;
  return Math.round(divergence * 100);
}

// Run batch verification on recent unfixed reality tasks
async function batchVerify(agentId, fixMap) {
  // fixMap: { taskId: { repo_url, patch, test_command } }
  const results = [];
  for (const [taskId, fixData] of Object.entries(fixMap)) {
    const result = await verifyFix(taskId, agentId, fixData);
    results.push(result);
  }
  return results;
}

module.exports = {
  verifyFix,
  batchVerify,
  getVerification,
  getAllVerifications,
  getStats,
  calculateRealityDivergence,
};
