// lib/memory-influence.js — Memory Influence Score (MIS)
// MIS = (success_delta × 0.5) + (latency_improvement × 0.2) + (hallucination_reduction × 0.3)
//
// Each memory in resolve-cache gets a real influence score based on replay evidence.
// This replaces subjective sorting (verification tier / recency) with causal impact.

const executionLog = require('./execution-log');
const resolveCache = require('./resolve-cache');

const MIS_WEIGHTS = { SUCCESS_DELTA: 0.5, LATENCY_IMPROVEMENT: 0.2, HALLUCINATION_REDUCTION: 0.3 };

// For each memory (identified by idea/concept, not just id), compute MIS
// by comparing runs that used it against runs that didn't for the same task.

function compute() {
  if (!require('fs').existsSync(executionLog.LOG_PATH)) return [];

  const lines = require('fs').readFileSync(executionLog.LOG_PATH, 'utf8').split('\n').filter(Boolean);
  const events = lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

  // Group by run_id
  const runs = {};
  for (const ev of events) {
    if (!runs[ev.run_id]) runs[ev.run_id] = { run_id: ev.run_id, task_id: ev.task_id, agent_id: ev.agent_id, memory_ids: new Set(), events: [], solved: false };
    runs[ev.run_id].events.push(ev);
    if (ev.memory_ids && ev.memory_ids.length > 0) ev.memory_ids.forEach(id => runs[ev.run_id].memory_ids.add(id));
    if (ev.event_type === 'result_submitted' && ev.output?.status === 'COMPLETED') runs[ev.run_id].solved = true;
  }

  // For each unique memory_id, find runs that used it vs runs without it (same task)
  const allMemoryIds = new Set();
  for (const r of Object.values(runs)) r.memory_ids.forEach(id => allMemoryIds.add(id));

  const scores = [];
  for (const memId of allMemoryIds) {
    // Find all tasks where this memory was used
    const memRuns = Object.values(runs).filter(r => r.memory_ids.has(memId));
    if (memRuns.length === 0) continue;

    // For each task where this memory was used, find counterpart runs without this memory
    const tasksWithMem = new Set(memRuns.map(r => r.task_id));
    let totalWith = 0, solvedWith = 0, latencyWith = 0;
    let totalWithout = 0, solvedWithout = 0, latencyWithout = 0;
    let hallucWith = 0, hallucWithout = 0;

  // Helper: compute total real duration of a run (sum of individual event latencies)
  function runDuration(r) {
    return r.events.reduce((s, e) => s + (e.latency_ms || 0), 0);
  }

  for (const r of memRuns) {
    totalWith++;
    if (r.solved) solvedWith++;
    latencyWith += runDuration(r);
    const hasHalluc = r.events.some(e => e.event_type === 'memory_injected' && e.output?.blocked_memories?.length > 0) ||
      r.events.some(e => e.event_type === 'result_verified' && e.output?.errors > 0);
    if (hasHalluc) hallucWith++;
  }

  // Find all runs in same tasks that did NOT include this memory_id
  for (const r of Object.values(runs)) {
    if (!tasksWithMem.has(r.task_id)) continue;
    if (r.memory_ids.has(memId)) continue;
    totalWithout++;
    if (r.solved) solvedWithout++;
    latencyWithout += runDuration(r);
    const hasHalluc = r.events.some(e => e.event_type === 'memory_injected' && e.output?.blocked_memories?.length > 0) ||
      r.events.some(e => e.event_type === 'result_verified' && e.output?.errors > 0);
    if (hasHalluc) hallucWithout++;
  }

    if (totalWithout === 0) continue;

    const solveRateWith = solvedWith / totalWith;
    const solveRateWithout = solvedWithout / totalWithout;
    const successDelta = solveRateWith - solveRateWithout;

    const avgLatencyWith = totalWith > 0 ? latencyWith / totalWith : 0;
    const avgLatencyWithout = totalWithout > 0 ? latencyWithout / totalWithout : 0;
    const latencyImprovement = avgLatencyWithout > 0 ? (avgLatencyWithout - avgLatencyWith) / avgLatencyWithout : 0;

    const hallucRateWith = hallucWith / totalWith;
    const hallucRateWithout = hallucWithout / totalWithout;
    const hallucReduction = hallucRateWithout - hallucRateWith;

    const mis = +(successDelta * MIS_WEIGHTS.SUCCESS_DELTA + latencyImprovement * MIS_WEIGHTS.LATENCY_IMPROVEMENT + hallucReduction * MIS_WEIGHTS.HALLUCINATION_REDUCTION).toFixed(4);

    scores.push({
      memory_id: memId,
      total_runs_with: totalWith,
      total_runs_without_comparison: totalWithout,
      solve_rate_with: +solveRateWith.toFixed(3),
      solve_rate_without: +solveRateWithout.toFixed(3),
      success_delta: +successDelta.toFixed(3),
      latency_improvement: +latencyImprovement.toFixed(3),
      hallucination_reduction: +hallucReduction.toFixed(3),
      mis,
    });
  }

  scores.sort((a, b) => b.mis - a.mis);
  return scores;
}

// Get MIS for a specific memory_id
function getMIS(memoryId) {
  return compute().find(s => s.memory_id === memoryId) || null;
}

// Get MIS as a projection (derived, not stored in runtime state)
function enrich() {
  const scores = compute();
  return {
    enriched: false,
    scores_applied: 0,
    scores_available: scores.length,
    projections: scores.slice(0, 50),
    mode: 'projection-only',
    note: 'MIS enrichment to runtime blocked (projection isolation). Use compute() for on-demand MIS scores.',
  };
}

module.exports = { compute, getMIS, enrich, MIS_WEIGHTS };
