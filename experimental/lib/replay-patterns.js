// lib/replay-patterns.js — Replay Pattern Extractor (P0)
// Automatically analyzes execution_log.jsonl to answer:
// "Which memories actually improve solve rate?"
// Compares with-memory vs without-memory runs per problem.

const executionLog = require('./execution-log');

// Group execution_log events into runs, organized by task_id
function getRunMap() {
  if (!require('fs').existsSync(executionLog.LOG_PATH)) return {};

  const lines = require('fs').readFileSync(executionLog.LOG_PATH, 'utf8').split('\n').filter(Boolean);
  const runs = {};
  for (const line of lines) {
    try {
      const ev = JSON.parse(line);
      if (!runs[ev.run_id]) runs[ev.run_id] = { run_id: ev.run_id, task_id: ev.task_id, agent_id: ev.agent_id, events: [] };
      runs[ev.run_id].events.push(ev);
    } catch  {}
  }
  // Sort events within each run by timestamp
  for (const r of Object.values(runs)) {
    r.events.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    r.has_memory = r.events.some(e => e.event_type === 'memory_injected');
    r.is_solved = r.events.some(e => e.event_type === 'result_submitted' && e.output?.status === 'COMPLETED');
    r.task_problem = r.events.find(e => e.event_type === 'task_claimed')?.input?.title || r.task_id;
    r.total_memories = r.events.filter(e => e.event_type === 'memory_injected').reduce((s, e) => s + (e.memory_ids?.length || 0), 0);
    r.has_hallucination_signal = r.events.some(e => e.event_type === 'memory_injected' && e.output?.blocked_memories?.length > 0) ||
      r.events.some(e => e.event_type === 'result_verified' && e.output?.errors > 0);
  }
  return runs;
}

// Group runs by task_id, compare with-memory vs without-memory performance
function extractPatterns() {
  const runs = getRunMap();

  // Group by task_id
  const byTask = {};
  for (const r of Object.values(runs)) {
    if (!byTask[r.task_id]) byTask[r.task_id] = { task_id: r.task_id, problem: r.task_problem || r.task_id, with_memory: [], without_memory: [] };
    if (r.has_memory) byTask[r.task_id].with_memory.push(r);
    else byTask[r.task_id].without_memory.push(r);
  }

  const patterns = [];
  for (const t of Object.values(byTask)) {
    const wm = t.with_memory;
    const wo = t.without_memory;

    if (wm.length === 0 || wo.length === 0) continue;

    const wmSolved = wm.filter(r => r.is_solved).length;
    const woSolved = wo.filter(r => r.is_solved).length;
    const wmSolveRate = wmSolved / wm.length;
    const woSolveRate = woSolved / wo.length;
    const wmHalluc = wm.filter(r => r.has_hallucination_signal).length / wm.length;
    const woHalluc = wo.filter(r => r.has_hallucination_signal).length / wo.length;

    patterns.push({
      task_id: t.task_id,
      problem: t.problem.slice(0, 200),
      total_runs: wm.length + wo.length,
      with_memory: { runs: wm.length, solved: wmSolved, solve_rate: +wmSolveRate.toFixed(3), hallucination_rate: +wmHalluc.toFixed(3) },
      without_memory: { runs: wo.length, solved: woSolved, solve_rate: +woSolveRate.toFixed(3), hallucination_rate: +woHalluc.toFixed(3) },
      solve_rate_delta: +(wmSolveRate - woSolveRate).toFixed(3),
      hallucination_delta: +(wmHalluc - woHalluc).toFixed(3),
      effect_size: +(wmSolveRate - woSolveRate - (wmHalluc - woHalluc) * 0.5).toFixed(3),
    });
  }

  patterns.sort((a, b) => Math.abs(b.effect_size) - Math.abs(a.effect_size));
  return patterns;
}

// Get patterns for a specific task
function getPattern(taskId) {
  return extractPatterns().find(p => p.task_id === taskId) || null;
}

// Summarize: top memory-improved patterns and top memory-worsened patterns
function getSummary(limit = 10) {
  const all = extractPatterns();
  return {
    total_patterns: all.length,
    improved: all.filter(p => p.solve_rate_delta > 0.05).length,
    worsened: all.filter(p => p.solve_rate_delta < -0.05).length,
    neutral: all.filter(p => Math.abs(p.solve_rate_delta) <= 0.05).length,
    top_improved: all.filter(p => p.solve_rate_delta > 0).slice(0, limit),
    top_worsened: all.filter(p => p.solve_rate_delta < 0).slice(0, limit).reverse(),
    most_investigated: all.sort((a, b) => b.total_runs - a.total_runs).slice(0, limit),
  };
}

module.exports = { extractPatterns, getPattern, getSummary, getRunMap };
