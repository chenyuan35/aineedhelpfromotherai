// lib/feedback-loop.js — Real-Time Memory Seed Feedback
// Watches execution_log for memory seed usage, updates scores.
// Good outcome → score++, bad outcome → score--.
// Threshold breaches → quarantine/blacklist.

// experimental/lib/feedback-loop.js — READ-ONLY MODE
// Feedback analysis without mutating runtime resolve-cache.
// Produces analysis reports in experimental-only store.

const fs = require('fs');
const path = require('path');
const executionLog = require('./execution-log');
const readOnlyCache = require('./read-only-cache');

const FEEDBACK_LOG = path.join(__dirname, '..', 'data', 'feedback-log.json');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function loadFeedbackState() {
  try {
    if (fs.existsSync(FEEDBACK_LOG)) return JSON.parse(fs.readFileSync(FEEDBACK_LOG, 'utf8'));
  } catch {}
  return { processed_events: 0, analyses: [], last_ran: null };
}

function saveFeedbackState(state) {
  ensureDir(path.dirname(FEEDBACK_LOG));
  fs.writeFileSync(FEEDBACK_LOG, JSON.stringify(state, null, 2));
}

function analyzeBatch() {
  const state = loadFeedbackState();
  const logPath = executionLog.LOG_PATH;
  if (!fs.existsSync(logPath)) return { analyzed: 0, recommendations: 0 };

  const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
  const newLines = lines.slice(state.processed_events);
  if (newLines.length === 0) return { analyzed: 0, recommendations: 0 };

  const BATCH_SIZE = 50;
  const limited = newLines.slice(0, BATCH_SIZE);
  const recommendations = [];

  for (const line of limited) {
    try {
      const ev = JSON.parse(line);
      if (!ev.memory_ids || ev.memory_ids.length === 0) continue;

      const isSuccess = ev.event_type === 'result_submitted' && ev.output?.status === 'COMPLETED';
      const isFailure = ev.event_type === 'result_submitted' && ev.output?.status === 'FAILED';
      if (!isSuccess && !isFailure) continue;

      for (const memId of ev.memory_ids) {
        const hint = readOnlyCache.getHint(memId);
        if (!hint) continue;

        const total = (hint.success_count || 0) + (hint.failure_count || 0);
        const failRate = total > 0 ? (hint.failure_count || 0) / total : 0;

        recommendations.push({
          memory_id: memId,
          outcome: isSuccess ? 'success' : 'failure',
          current_score: hint.score,
          current_status: hint.status,
          fail_rate: failRate,
          suggested_action: failRate > 0.8 ? 'review_blacklist' : failRate > 0.5 ? 'review_quarantine' : 'monitor',
        });
      }
    } catch {}
  }

  state.processed_events += limited.length;
  if (recommendations.length > 0) {
    state.analyses.push({
      ran_at: new Date().toISOString(),
      events_analyzed: limited.length,
      recommendations: recommendations.length,
      sample: recommendations.slice(0, 5),
    });
    if (state.analyses.length > 100) state.analyses = state.analyses.slice(-100);
  }
  state.last_ran = new Date().toISOString();
  saveFeedbackState(state);

  return {
    analyzed: limited.length,
    recommendations: recommendations.length,
  };
}

function runBatch() {
  return analyzeBatch();
}

function getFeedbackStats() {
  const state = loadFeedbackState();
  const recent = state.analyses.slice(-10).reverse();
  return {
    total_events_analyzed: state.processed_events,
    last_ran: state.last_ran,
    recent_analyses: recent,
    total_analysis_rounds: state.analyses.length,
    status: 'read-only',
  };
}

let _interval = null;
function startAutoFeedback() {
  if (_interval) return;
  _interval = setInterval(() => {
    try { analyzeBatch(); } catch {}
  }, 5 * 60 * 1000).unref();
}

function stopAutoFeedback() {
  if (_interval) { clearInterval(_interval); _interval = null; }
}

module.exports = { runBatch, getFeedbackStats, startAutoFeedback, stopAutoFeedback };
