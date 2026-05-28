// lib/feedback-loop.js — Real-Time Memory Seed Feedback
// Watches execution_log for memory seed usage, updates scores.
// Good outcome → score++, bad outcome → score--.
// Threshold breaches → quarantine/blacklist.

const fs = require('fs');
const path = require('path');
const executionLog = require('./execution-log');
const resolveCache = require('./resolve-cache');

const FEEDBACK_LOG = path.join(__dirname, '..', 'data', 'feedback-log.json');
const BATCH_SIZE = 50;

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function loadFeedbackState() {
  try {
    if (fs.existsSync(FEEDBACK_LOG)) return JSON.parse(fs.readFileSync(FEEDBACK_LOG, 'utf8'));
  } catch {}
  return { processed_events: 0, updates: [], last_ran: null };
}

function saveFeedbackState(state) {
  ensureDir(path.dirname(FEEDBACK_LOG));
  fs.writeFileSync(FEEDBACK_LOG, JSON.stringify(state, null, 2));
}

// Process new execution_log events and update memory seed scores
function processBatch() {
  const state = loadFeedbackState();
  const logPath = executionLog.LOG_PATH;
  if (!fs.existsSync(logPath)) return { processed: 0, updated: 0, quarantined: 0 };

  const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
  const totalEvents = lines.length;

  // Skip already-processed events
  const newLines = lines.slice(state.processed_events);
  if (newLines.length === 0) return { processed: 0, updated: 0, quarantined: 0 };

  const updates = [];
  const limited = newLines.slice(0, BATCH_SIZE);

  for (const line of limited) {
    try {
      const ev = JSON.parse(line);
      if (!ev.memory_ids || ev.memory_ids.length === 0) continue;

      const isSuccess = ev.event_type === 'result_submitted' && ev.output?.status === 'COMPLETED';
      const isFailure = ev.event_type === 'result_submitted' && ev.output?.status === 'FAILED';
      const isMemoryEvent = ['memory_injected', 'memory_gate'].includes(ev.event_type);

      if (!isSuccess && !isFailure && !isMemoryEvent) continue;

      for (const memId of ev.memory_ids) {
        const hint = resolveCache.getHint(memId);
        if (!hint) continue;

        if (isSuccess) {
          resolveCache.recordOutcome(memId, ev.agent_id || 'anonymous', 'success');
          hint.score = Math.min(1.5, (hint.score || 0.9) + 0.1);
          updates.push({ memory_id: memId, event: ev.event_type, outcome: 'success', new_score: hint.score });
        } else if (isFailure) {
          resolveCache.recordOutcome(memId, ev.agent_id || 'anonymous', 'failure');
          hint.score = Math.max(-1, (hint.score || 0.9) - 0.2);
          updates.push({ memory_id: memId, event: ev.event_type, outcome: 'failure', new_score: hint.score });
        } else if (isMemoryEvent) {
          hint.citation_count = (hint.citation_count || 0) + 1;
          hint.score = Math.min(1.5, (hint.score || 0.9) + 0.05);
        }

        // Check threshold for quarantine (persist changes after evaluation)
        const cache = resolveCache.load();
        const cachedHint = cache.hints[memId];
        if (cachedHint) {
          const total = (cachedHint.success_count || 0) + (cachedHint.failure_count || 0);
          if (total >= 3) {
            const failRate = (cachedHint.failure_count || 0) / total;
            if (failRate > 0.8 && cachedHint.status !== resolveCache.HINT_STATUS.BLACKLISTED) {
              cachedHint.status = resolveCache.HINT_STATUS.BLACKLISTED;
              updates.push({ memory_id: memId, action: 'blacklisted', fail_rate: failRate });
            } else if (failRate > 0.5 && cachedHint.status !== resolveCache.HINT_STATUS.QUARANTINED && cachedHint.status !== resolveCache.HINT_STATUS.BLACKLISTED) {
              cachedHint.status = resolveCache.HINT_STATUS.QUARANTINED;
              cachedHint.score = Math.min(cachedHint.score || 0, resolveCache.MIN_SCORE - 0.1);
              updates.push({ memory_id: memId, action: 'quarantined', fail_rate: failRate });
            }
          }
          cachedHint.updated_at = new Date().toISOString();
          // force persist: write the entire cache back
          const fs = require('fs');
          fs.writeFileSync(require('path').join(__dirname, '..', 'data', 'resolve-cache.json'), JSON.stringify(cache, null, 2));
        }
      }
    } catch {}
  }

  const quarantined = updates.filter(u => u.action === 'quarantined' || u.action === 'blacklisted').length;

  state.processed_events += limited.length;
  state.updates.push({
    ran_at: new Date().toISOString(),
    events_scanned: limited.length,
    memory_updates: updates.length,
    quarantined,
  });
  state.last_ran = new Date().toISOString();
  if (state.updates.length > 100) state.updates = state.updates.slice(-100);
  saveFeedbackState(state);

  return {
    processed: limited.length,
    updated: updates.length,
    quarantined,
    total_events_scanned: state.processed_events,
  };
}

// Run batch process with a small delay to let events accumulate
function runBatch() {
  return processBatch();
}

function getFeedbackStats() {
  const state = loadFeedbackState();
  const recent = state.updates.slice(-10).reverse();
  return {
    total_events_scanned: state.processed_events,
    last_ran: state.last_ran,
    recent_updates: recent,
    total_update_rounds: state.updates.length,
  };
}

// Auto-run every 5 minutes
let _interval = null;
function startAutoFeedback() {
  if (_interval) return;
  _interval = setInterval(() => {
    try { processBatch(); } catch {}
  }, 5 * 60 * 1000).unref();
}

function stopAutoFeedback() {
  if (_interval) { clearInterval(_interval); _interval = null; }
}

module.exports = { runBatch, getFeedbackStats, startAutoFeedback, stopAutoFeedback };
