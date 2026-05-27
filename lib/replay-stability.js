// lib/replay-stability.js — Replay Stability Score (RSS)
// Measures trajectory consistency: same replay, same config, same task → identical behavior?
// Higher RSS = more deterministic = more reliable.

const executionLog = require('./execution-log');
const evalHarness = require('./eval-harness');

// Compute RSS for a single task by running it N times and comparing trajectories
function computeRSS(taskId, runCount = 5) {
  const task = evalHarness.loadTask(taskId);
  if (!task) return { error: `Task ${taskId} not found`, rss: 0 };

  // Run the task N times with memory enabled
  const runs = [];
  for (let i = 0; i < runCount; i++) {
    const result = evalHarness.evalTask(taskId);
    const events = executionLog.getRun(result.with_memory.run_id);
    runs.push({
      run_id: result.with_memory.run_id,
      solved: result.with_memory.solved,
      duration_ms: result.with_memory.duration_ms,
      trajectory: events.map(e => ({
        event_type: e.event_type,
        has_input: Object.keys(e.input || {}).length > 0,
        has_output: Object.keys(e.output || {}).length > 0,
        memory_count: (e.memory_ids || []).length,
        verification_tier: e.verification_tier,
      })),
    });
  }

  // Compare trajectories
  if (runs.length < 2) return { rss: 1, runs: runs.length, note: 'single run' };

  // 1. Outcome consistency: all runs produce same solved/failed?
  const outcomes = runs.map(r => r.solved);
  const allSameOutcome = outcomes.every(o => o === outcomes[0]);
  const outcomeScore = allSameOutcome ? 1 : (outcomes.filter(o => o).length / runs.length);

  // 2. Trajectory length consistency: all runs have same number of events?
  const lengths = runs.map(r => r.trajectory.length);
  const maxLen = Math.max(...lengths);
  const minLen = Math.min(...lengths);
  const lengthScore = maxLen > 0 ? 1 - (maxLen - minLen) / maxLen : 1;

  // 3. Trajectory structure: event_type sequence match
  let seqScore = 1;
  if (runs.length >= 2) {
    const firstSeq = runs[0].trajectory.map(e => e.event_type).join(',');
    let matchCount = 0;
    for (let i = 1; i < runs.length; i++) {
      const seq = runs[i].trajectory.map(e => e.event_type).join(',');
      if (seq === firstSeq) matchCount++;
    }
    seqScore = runs.length > 1 ? matchCount / (runs.length - 1) : 1;
  }

  // 4. Duration consistency: coefficient of variation (lower = more consistent)
  const durations = runs.map(r => r.duration_ms).filter(d => d > 0);
  let durationScore = 1;
  if (durations.length >= 2) {
    const mean = durations.reduce((s, d) => s + d, 0) / durations.length;
    const variance = durations.reduce((s, d) => s + (d - mean) ** 2, 0) / durations.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
    durationScore = Math.max(0, 1 - cv);
  }

  // Composite RSS (all weighted equally)
  const rss = +(outcomeScore * 0.3 + lengthScore * 0.2 + seqScore * 0.3 + durationScore * 0.2).toFixed(4);

  return {
    rss,
    task_id: taskId,
    run_count: runs.length,
    components: {
      outcome_consistency: +outcomeScore.toFixed(3),
      trajectory_length_consistency: +lengthScore.toFixed(3),
      event_sequence_consistency: +seqScore.toFixed(3),
      duration_consistency: +durationScore.toFixed(3),
    },
    runs: runs.map(r => ({ run_id: r.run_id, solved: r.solved, duration_ms: r.duration_ms, trajectory_len: r.trajectory.length })),
  };
}

// Compute RSS across the entire golden set
function computeGlobalRSS(runCount = 3) {
  const tasks = evalHarness.loadGoldenSet();
  const results = [];
  for (const task of tasks) {
    const rss = computeRSS(task.id, runCount);
    if (!rss.error) results.push(rss);
  }

  if (results.length === 0) return { global_rss: 0, tasks: 0 };

  const globalRss = +(results.reduce((s, r) => s + r.rss, 0) / results.length).toFixed(4);
  const minRss = Math.min(...results.map(r => r.rss));
  const countBelowThreshold = results.filter(r => r.rss < 0.95).length;

  return {
    global_rss: globalRss,
    min_rss: +minRss.toFixed(4),
    tasks_tested: results.length,
    runs_per_task: runCount,
    tasks_below_threshold: countBelowThreshold,
    per_task: results.map(r => ({ task_id: r.task_id, rss: r.rss, components: r.components })),
  };
}

module.exports = { computeRSS, computeGlobalRSS };
