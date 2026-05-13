// lib/lifecycle.js — Task lifecycle detection: freshness, stale, expired
//
// freshness_score = w1*time + w2*success + w3*barrier
// STALE = barrier changed but not expired
// EXPIRED = past expires_at

const FRESHNESS_WEIGHTS = { time: 0.4, success: 0.4, barrier: 0.2 };
const TIME_HALF_LIFE_HOURS = 168; // 7 days

/**
 * Compute freshness score for a task (0.0 to 1.0)
 */
function computeFreshnessScore(task) {
  const lifecycle = task.lifecycle || {};
  const metrics = task.metrics || {};
  const barrier = task.barrier || {};

  // Time freshness: exponential decay, 7-day half-life
  const lastSuccess = lifecycle.last_successful_execution
    ? new Date(lifecycle.last_successful_execution)
    : new Date(lifecycle.created_at || task.created_at || Date.now());
  const ageHours = (Date.now() - lastSuccess.getTime()) / (1000 * 60 * 60);
  const timeFreshness = Math.exp(-ageHours / TIME_HALF_LIFE_HOURS);

  // Success freshness: direct success_rate
  const successFreshness = metrics.success_rate != null ? metrics.success_rate : (metrics.execution_count === 0 ? 1.0 : 0.5);

  // Barrier freshness: clean = 1.0, any barrier = 0.3
  const hasBarrier = barrier.auth_required || barrier.captcha || barrier.cloudflare || barrier.payment;
  const barrierFreshness = hasBarrier ? 0.3 : 1.0;

  const score =
    FRESHNESS_WEIGHTS.time * timeFreshness +
    FRESHNESS_WEIGHTS.success * successFreshness +
    FRESHNESS_WEIGHTS.barrier * barrierFreshness;

  return Math.round(score * 100) / 100;
}

/**
 * Check if a task is EXPIRED (past expires_at)
 */
function detectExpired(task) {
  const expiresAt = task.lifecycle?.expires_at || task.expires_at;
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

/**
 * Check if a task is STALE (barrier changed / execution degraded but not expired)
 * Returns reason string or null
 */
function detectStale(task) {
  const metrics = task.metrics || {};
  const barrier = task.barrier || {};
  const lifecycle = task.lifecycle || {};

  // Already has stale reason
  if (lifecycle.stale_reason) return lifecycle.stale_reason;

  // Barrier appeared after initial creation (all were false)
  if (barrier.auth_required || barrier.captcha || barrier.cloudflare || barrier.payment) {
    return 'auth_barrier_changed';
  }

  // Success rate dropped below 50% with 3+ attempts
  if (metrics.execution_count >= 3 && metrics.success_rate < 0.5) {
    return 'low_success_rate';
  }

  // Last execution failed 3 times in a row
  if (metrics.fail_count >= 3 && metrics.success_count === 0 && metrics.execution_count >= 3) {
    return 'persistent_failure';
  }

  return null;
}

/**
 * Full lifecycle evaluation — returns recommended status and computed fields
 */
function evaluateLifecycle(task) {
  const metrics = task.metrics || {};
  const barrier = task.barrier || {};

  // Compute freshness
  const freshnessScore = computeFreshnessScore(task);

  // Check expiration first (hard rule)
  if (detectExpired(task)) {
    return {
      recommended_status: 'EXPIRED',
      freshness_score: freshnessScore,
      stale_reason: null,
      expired: true
    };
  }

  // Check stale (soft rule — task exists but degraded)
  const staleReason = detectStale(task);
  if (staleReason) {
    return {
      recommended_status: 'STALE',
      freshness_score: freshnessScore,
      stale_reason: staleReason,
      expired: false
    };
  }

  // Check if should be ARCHIVED (completed 7+ days ago)
  if (task.status === 'COMPLETED' && task.completed_at) {
    const daysSinceCompletion = (Date.now() - new Date(task.completed_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCompletion >= 7) {
      return {
        recommended_status: 'ARCHIVED',
        freshness_score: freshnessScore,
        stale_reason: null,
        archived_reason: 'completed_7d_ago',
        expired: false
      };
    }
  }

  // Healthy task
  return {
    recommended_status: task.status || 'OPEN',
    freshness_score: freshnessScore,
    stale_reason: null,
    expired: false
  };
}

/**
 * Update task with lifecycle evaluation results
 */
function applyLifecycleEvaluation(task) {
  const evaluation = evaluateLifecycle(task);

  // Update metrics.freshness_score
  if (task.metrics) {
    task.metrics.freshness_score = evaluation.freshness_score;
  }

  // Update lifecycle fields
  if (task.lifecycle) {
    task.lifecycle.stale_reason = evaluation.stale_reason;
    if (evaluation.archived_reason) {
      task.lifecycle.archived_reason = evaluation.archived_reason;
    }
  }

  // Only auto-transition status for EXPIRED and ARCHIVED
  // STALE requires manual acknowledgment (zero-barrier: warn, don't block)
  if (evaluation.recommended_status === 'EXPIRED') {
    task.status = 'EXPIRED';
  } else if (evaluation.recommended_status === 'ARCHIVED') {
    task.status = 'ARCHIVED';
  }

  return evaluation;
}

module.exports = {
  computeFreshnessScore,
  detectExpired,
  detectStale,
  evaluateLifecycle,
  applyLifecycleEvaluation,
  FRESHNESS_WEIGHTS,
  TIME_HALF_LIFE_HOURS
};
