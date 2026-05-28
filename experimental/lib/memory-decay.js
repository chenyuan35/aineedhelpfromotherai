// experimental/lib/memory-decay.js — READ-ONLY MODE
// Analyzes replay data and produces decay recommendations.
// Does NOT mutate runtime resolve-cache. Reports are stored in experimental store.

const readOnlyCache = require('./read-only-cache');

function analyze() {
  if (!require('fs').existsSync(require('./execution-log').LOG_PATH)) return [];

  const lines = require('fs').readFileSync(require('./execution-log').LOG_PATH, 'utf8').split('\n').filter(Boolean);
  const events = lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

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

  const adjustments = [];
  for (const [memId, stats] of Object.entries(memStats)) {
    const ignoreRate = stats.total_runs > 0 ? stats.ignored_count / stats.total_runs : 0;
    const hallucRate = stats.total_runs > 0 ? stats.hallucination_count / stats.total_runs : 0;
    const solveRate = stats.total_runs > 0 ? stats.solved_count / stats.total_runs : 0;

    let decayFactor = 1.0;
    if (ignoreRate > 0.5) decayFactor += 0.5;
    if (hallucRate > 0.3) decayFactor += 0.8;
    if (solveRate > 0.7) decayFactor -= 0.4;
    if (solveRate > 0.9) decayFactor -= 0.2;
    if (stats.total_runs < 3) decayFactor = 1.0;

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
      current_score: readOnlyCache.getHint(memId)?.score || null,
      current_status: readOnlyCache.getHint(memId)?.status || null,
    });
  }

  adjustments.sort((a, b) => b.decay_factor - a.decay_factor);
  return adjustments;
}

function applyAdjustments(dryRun = true) {
  // READ-ONLY MODE: only dryRun=true is allowed (analysis only)
  const adjustments = analyze();
  return {
    applied_count: adjustments.length,
    changed: false,
    dry_run: true,
    note: 'Experimental write blocked. Only analysis mode is available. Adjustments not applied to runtime.',
    adjustments,
  };
}

function runFullPipeline() {
  const patterns = require('./replay-patterns').getSummary();
  const decay = analyze();
  return {
    patterns_available: patterns.total_patterns,
    decay_analyses: decay.length,
    note: 'READ-ONLY: memory-influence enrichment and decay application blocked. Only analysis produced.',
  };
}

module.exports = { analyze, applyAdjustments, runFullPipeline };
