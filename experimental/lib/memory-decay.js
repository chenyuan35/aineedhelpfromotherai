// lib/memory-decay.js — Replay-driven Auto Memory Decay
// Three rules:
//   1. memory repeatedly ignored (not cited despite injection) → decay faster
//   2. memory associated with hallucination increase → quarantine faster
//   3. memory that improves solve rate → preserve longer (slow decay)
//
// Integrates with resolve-cache.js by adjusting scores based on replay evidence.

const executionLog = require('./execution-log');
const resolveCache = require('./resolve-cache');

// Analyze replay data and return decay adjustments for each cache entry
function analyze() {
  if (!require('fs').existsSync(executionLog.LOG_PATH)) return [];

  const lines = require('fs').readFileSync(executionLog.LOG_PATH, 'utf8').split('\n').filter(Boolean);
  const events = lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

  // Group by run_id
  const runs = {};
  for (const ev of events) {
    if (!runs[ev.run_id]) runs[ev.run_id] = { run_id: ev.run_id, memory_ids: [], has_submit: false, solved: false, memory_ignored: true, hallucination_events: 0 };
    if (ev.memory_ids && ev.memory_ids.length > 0) {
      for (const id of ev.memory_ids) {
        if (!runs[ev.run_id].memory_ids.includes(id)) runs[ev.run_id].memory_ids.push(id);
      }
    }
    if (ev.event_type === 'result_submitted') {
      runs[ev.run_id].has_submit = true;
      runs[ev.run_id].solved = ev.output?.status === 'COMPLETED';
      // If model_output exists after memory_injected, memory was used (not ignored)
      const hasModelOutput = events.filter(e => e.run_id === ev.run_id && e.event_type === 'model_output').length > 0;
      if (hasModelOutput) runs[ev.run_id].memory_ignored = false;
    }
    if (ev.event_type === 'memory_injected' && ev.output?.blocked_memories?.length > 0) {
      runs[ev.run_id].hallucination_events++;
    }
    if (ev.event_type === 'result_verified' && ev.output?.errors > 0) {
      runs[ev.run_id].hallucination_events++;
    }
  }

  // Per memory_id: count ignored runs, hallucination runs, solved runs
  const memStats = {};
  for (const r of Object.values(runs)) {
    for (const memId of r.memory_ids) {
      if (!memStats[memId]) memStats[memId] = { used_count: 0, ignored_count: 0, hallucination_count: 0, solved_count: 0, total_runs: 0 };
      memStats[memId].total_runs++;
      if (r.memory_ignored) memStats[memId].ignored_count++;
      else memStats[memId].used_count++;
      if (r.hallucination_events > 0) memStats[memId].hallucination_count++;
      if (r.solved) memStats[memId].solved_count++;
    }
  }

  // Compute decay adjustments
  const adjustments = [];
  for (const [memId, stats] of Object.entries(memStats)) {
    const ignoreRate = stats.total_runs > 0 ? stats.ignored_count / stats.total_runs : 0;
    const hallucRate = stats.total_runs > 0 ? stats.hallucination_count / stats.total_runs : 0;
    const solveRate = stats.total_runs > 0 ? stats.solved_count / stats.total_runs : 0;

    // Decay factor: higher = decay faster (range ~0.5 to 2.0)
    let decayFactor = 1.0;
    if (ignoreRate > 0.5) decayFactor += 0.5;   // ignored more than half the time → 50% faster decay
    if (hallucRate > 0.3) decayFactor += 0.8;   // hallucination in >30% of runs → much faster decay/quarantine
    if (solveRate > 0.7) decayFactor -= 0.4;    // solves >70% of the time → slower decay
    if (solveRate > 0.9) decayFactor -= 0.2;    // exceptional → even slower
    if (stats.total_runs < 3) decayFactor = 1.0; // not enough data — use default

    decayFactor = Math.max(0.3, Math.min(2.5, decayFactor));

    adjustments.push({
      memory_id: memId,
      total_runs: stats.total_runs,
      ignored_rate: +ignoreRate.toFixed(3),
      hallucination_rate: +hallucRate.toFixed(3),
      solve_rate: +solveRate.toFixed(3),
      decay_factor: +decayFactor.toFixed(2),
      action: ignoreRate > 0.7 ? 'accelerate_decay' :
              hallucRate > 0.5 ? 'mark_quarantine' :
              solveRate > 0.8 && ignoreRate < 0.2 ? 'preserve' : 'adjust_decay',
    });
  }

  adjustments.sort((a, b) => b.decay_factor - a.decay_factor);
  return adjustments;
}

// Apply decay adjustments to resolve-cache
function applyAdjustments(dryRun = false) {
  const adjustments = analyze();
  const cache = resolveCache.load();
  let changed = false;
  const applied = [];

  for (const adj of adjustments) {
    // Find matching hint in cache (by reasoning_id or task_id key)
    for (const [taskId, hint] of Object.entries(cache.hints || {})) {
      if (hint.reasoning_id === adj.memory_id || taskId === adj.memory_id) {
        if (dryRun) {
          applied.push({ ...adj, hint_task_id: taskId, hint_reasoning_id: hint.reasoning_id, dry_run: true });
          continue;
        }

        const oldScore = hint.score || 1.0;
        const oldStatus = hint.status || 'active';

        // Apply decay factor on top of existing staleness
        const ageDays = (Date.now() - new Date(hint.updated_at || Date.now()).getTime()) / 86400000;
        const baseDecay = Math.min(ageDays * 0.1, 2);
        const adjustedDecay = baseDecay * adj.decay_factor;

        if (adj.action === 'accelerate_decay' && hint.score > -0.5) {
          hint.score = Math.max(-1, (hint.score || 1.0) - adjustedDecay * 0.5);
          if (hint.score < 0.3) hint.status = 'decaying';
        } else if (adj.action === 'mark_quarantine') {
          hint.score = Math.max(-1.5, (hint.score || 1.0) - adjustedDecay);
          if (hint.score < -0.3) hint.status = 'quarantined';
        } else if (adj.action === 'preserve') {
          hint.score = Math.min(3, (hint.score || 1.0) + 0.1);
          hint.status = 'active';
        } else {
          hint.score = Math.max(-3, Math.min(3, (hint.score || 1.0) - (adjustedDecay - baseDecay)));
        }

        hint.decay_factor = adj.decay_factor;
        hint.last_decay_adjustment = new Date().toISOString();

        if (hint.score !== oldScore || hint.status !== oldStatus) changed = true;
        applied.push({ ...adj, hint_task_id: taskId, score_before: oldScore, score_after: hint.score, status_before: oldStatus, status_after: hint.status });
        break;
      }
    }
  }

  if (changed && !dryRun) {
    cache.updated_at = new Date().toISOString();
    const fs = require('fs');
    const path = require('path');
    fs.writeFileSync(path.join(__dirname, '..', 'data', 'resolve-cache.json'), JSON.stringify(cache, null, 2));
  }

  return { applied_count: applied.length, changed, dry_run: dryRun, adjustments: applied };
}

// One-shot: run full pipeline — analyze patterns, compute MIS, apply decay
function runFullPipeline() {
  const patterns = require('./replay-patterns').getSummary();
  const influence = require('./memory-influence').enrich();
  const decay = applyAdjustments();
  return { patterns_available: patterns.total_patterns, scores_applied: influence.scores_applied, decay_applied: decay.applied_count, decay_changed: decay.changed };
}

module.exports = { analyze, applyAdjustments, runFullPipeline };
