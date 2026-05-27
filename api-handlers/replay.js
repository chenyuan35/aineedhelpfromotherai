// api-handlers/replay.js — Execution replay & diff endpoints
// Phase 2: GET /api/replay/:runId — full trace from task to submit
// Phase 3: GET /api/replay/:runId/diff?otherRunId=... — causal comparison

const executionLog = require('../lib/execution-log');

// Build a structured trace from raw events for a given run
function buildTrace(events) {
  if (!events || events.length === 0) return null;

  const byType = {};
  for (const ev of events) {
    if (!byType[ev.event_type]) byType[ev.event_type] = [];
    byType[ev.event_type].push(ev);
  }

  return {
    run_id: events[0].run_id,
    agent_id: events[0].agent_id,
    task_id: events[0].task_id,
    event_count: events.length,
    time_span: events.length > 1 ? {
      start: events[0].timestamp,
      end: events[events.length - 1].timestamp,
      duration_ms: new Date(events[events.length - 1].timestamp) - new Date(events[0].timestamp),
    } : null,
    trace: {
      task: byType['task_claimed'] ? byType['task_claimed'][0] : null,
      memory_gate: byType['memory_injected'] ? byType['memory_injected'][0] : null,
      filtered_memories: byType['memory_injected']
        ? (byType['memory_injected'][0].output?.retrieved_memories || [])
            .concat(byType['memory_injected'][0].output?.force_injected || [])
        : [],
      prompt_built: byType['prompt_built'] ? byType['prompt_built'][0] : null,
      model_output: byType['model_output'] ? byType['model_output'][0] : null,
      verification: byType['result_verified'] ? byType['result_verified'][0] : null,
      submit: byType['result_submitted'] ? byType['result_submitted'][0] : null,
    },
    timeline: events.map(ev => ({
      event_type: ev.event_type,
      timestamp: ev.timestamp,
      latency_ms: ev.latency_ms,
      summary: ev.input?.summary || ev.output?.summary || ev.output?.status || ev.event_type,
    })),
    stages: {
      claimed: !!byType['task_claimed'],
      memory_applied: !!byType['memory_injected'],
      prompt_recorded: !!byType['prompt_built'],
      output_recorded: !!byType['model_output'],
      verified: !!byType['result_verified'],
      submitted: !!byType['result_submitted'],
    },
  };
}

// Compute diff metrics between two runs
function computeDiff(traceA, traceB) {
  if (!traceA || !traceB) return null;

  const getMemoryCount = (t) => t.trace.filtered_memories?.length || 0;
  const getLatencyMs = (t, stage) => t?.trace?.[stage]?.latency_ms || 0;
  const getEventLatency = (t) => t.time_span?.duration_ms || 0;

  const diff = {
    run_a: traceA.run_id,
    run_b: traceB.run_id,
    task_id: traceA.task_id || traceB.task_id,
    agent_id: traceA.agent_id || traceB.agent_id,
    memory_usage: {
      a_memories: getMemoryCount(traceA),
      b_memories: getMemoryCount(traceB),
      delta: getMemoryCount(traceB) - getMemoryCount(traceA),
    },
    latency: {
      a_total_ms: getEventLatency(traceA),
      b_total_ms: getEventLatency(traceB),
      delta_ms: getEventLatency(traceB) - getEventLatency(traceA),
    },
    stages: {
      a_completed: Object.values(traceA.stages).filter(Boolean).length,
      b_completed: Object.values(traceB.stages).filter(Boolean).length,
      a_missing: Object.entries(traceA.stages).filter(([,v]) => !v).map(([k]) => k),
      b_missing: Object.entries(traceB.stages).filter(([,v]) => !v).map(([k]) => k),
    },
    outcome: {
      a_status: traceA.trace.submit?.output?.status || 'unknown',
      b_status: traceB.trace.submit?.output?.status || 'unknown',
      a_solved: traceA.trace.submit?.output?.status === 'COMPLETED' || traceA.trace.submit?.output?.status === 'completed',
      b_solved: traceB.trace.submit?.output?.status === 'COMPLETED' || traceB.trace.submit?.output?.status === 'completed',
    },
    hallucination_signals: {
      a_blocked_memories: traceA.trace.memory_gate?.output?.blocked_memories?.length || 0,
      b_blocked_memories: traceB.trace.memory_gate?.output?.blocked_memories?.length || 0,
      a_conflict_overrides: traceA.trace.memory_gate?.output?.conflict_overrides?.length || 0,
      b_conflict_overrides: traceB.trace.memory_gate?.output?.conflict_overrides?.length || 0,
    },
  };

  // Prompt divergence — compare prompt_built if both exist
  if (traceA.trace.prompt_built?.output?.final_prompt &&
      traceB.trace.prompt_built?.output?.final_prompt) {
    const pA = traceA.trace.prompt_built.output.final_prompt;
    const pB = traceB.trace.prompt_built.output.final_prompt;
    const maxLen = Math.max(pA.length, pB.length);
    let diffCount = 0;
    for (let i = 0; i < Math.min(pA.length, pB.length); i++) {
      if (pA[i] !== pB[i]) diffCount++;
    }
    diff.prompt_divergence = {
      a_length: pA.length,
      b_length: pB.length,
      char_diff: Math.abs(pA.length - pB.length),
      diff_rate: maxLen > 0 ? (diffCount / maxLen).toFixed(4) : 0,
    };
  } else {
    diff.prompt_divergence = null;
  }

  return diff;
}

// GET /api/replay — list available replay runs
async function handleListReplays(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  try {
    const runs = executionLog.getRunIds();
    const types = executionLog.getEventTypes();
    res.json({
      success: true,
      total_runs: runs.length,
      runs: runs.slice(0, parseInt(req.query.limit) || 50),
      event_types: types,
      hint: 'GET /api/replay/:runId for full trace, GET /api/replay/:runId/diff?otherRunId=... for comparison',
      log_path: executionLog.LOG_PATH,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/replay/:runId — full trace
async function handleReplay(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { runId } = req.params;
  if (!runId) {
    return res.status(400).json({ success: false, error: 'runId is required' });
  }

  try {
    const events = executionLog.getRun(runId);
    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Run ${runId} not found`,
        hint: 'GET /api/replay to list available runs',
      });
    }

    const trace = buildTrace(events);
    res.json({ success: true, trace });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/replay/:runId/diff?otherRunId=... — causal comparison
async function handleReplayDiff(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { runId } = req.params;
  const otherRunId = req.query.otherRunId;
  if (!runId || !otherRunId) {
    return res.status(400).json({
      success: false,
      error: 'Both :runId and ?otherRunId= are required',
      usage: 'GET /api/replay/runA/diff?otherRunId=runB',
    });
  }

  if (runId === otherRunId) {
    return res.status(400).json({
      success: false,
      error: 'Cannot diff a run against itself',
      hint: 'Use different run_ids for comparison (e.g., with and without memory)',
    });
  }

  try {
    const eventsA = executionLog.getRun(runId);
    const eventsB = executionLog.getRun(otherRunId);
    if (eventsA.length === 0 || eventsB.length === 0) {
      const notFound = [];
      if (eventsA.length === 0) notFound.push(runId);
      if (eventsB.length === 0) notFound.push(otherRunId);
      return res.status(404).json({
        success: false,
        error: `Run(s) not found: ${notFound.join(', ')}`,
        hint: 'GET /api/replay to list available runs',
      });
    }

    const traceA = buildTrace(eventsA);
    const traceB = buildTrace(eventsB);
    const diff = computeDiff(traceA, traceB);

    res.json({
      success: true,
      diff,
      run_a: traceA,
      run_b: traceB,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// POST /api/replay/analyze — compare multiple runs by task_id (batch analysis)
async function handleBatchAnalyze(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { task_id, run_ids, tag } = req.body || {};

  try {
    let runs;
    if (run_ids && Array.isArray(run_ids)) {
      runs = run_ids.map(id => ({ run_id: id, events: executionLog.getRun(id) })).filter(r => r.events.length > 0);
    } else if (task_id) {
      const allEvents = executionLog.query({ task_id });
      const byRun = {};
      for (const ev of allEvents) {
        if (!byRun[ev.run_id]) byRun[ev.run_id] = [];
        byRun[ev.run_id].push(ev);
      }
      runs = Object.entries(byRun).map(([run_id, events]) => ({ run_id, events }));
    } else {
      return res.status(400).json({
        success: false,
        error: 'Provide task_id or run_ids[] in body',
      });
    }

    const traces = runs.map(r => buildTrace(r.events)).filter(Boolean);
    const withMemory = traces.filter(t => t.stages.memory_applied);
    const withoutMemory = traces.filter(t => !t.stages.memory_applied);

    const solveRate = (arr) => arr.length === 0 ? 0 : arr.filter(t => t.trace.submit?.output?.status === 'COMPLETED').length / arr.length;
    const avgLatency = (arr) => arr.length === 0 ? 0 : arr.reduce((s, t) => s + (t.time_span?.duration_ms || 0), 0) / arr.length;

    res.json({
      success: true,
      total_runs: traces.length,
      with_memory: withMemory.length,
      without_memory: withoutMemory.length,
      aggregate: {
        with_memory: {
          solve_rate: solveRate(withMemory),
          avg_latency_ms: Math.round(avgLatency(withMemory)),
          count: withMemory.length,
        },
        without_memory: {
          solve_rate: solveRate(withoutMemory),
          avg_latency_ms: Math.round(avgLatency(withoutMemory)),
          count: withoutMemory.length,
        },
      },
      runs: traces.map(t => ({
        run_id: t.run_id,
        agent_id: t.agent_id,
        stages: t.stages,
        duration_ms: t.time_span?.duration_ms,
        solved: t.trace.submit?.output?.status === 'COMPLETED',
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/replay/:runId/influence — "Why did the agent do this?"
// Shows top influences with weights, linked to specific memories and patterns.
async function handleInfluenceTrace(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { runId } = req.params;
  if (!runId) {
    return res.status(400).json({ success: false, error: 'runId is required' });
  }

  try {
    const replayPatterns = require('../lib/replay-patterns');
    const memoryInfluence = require('../lib/memory-influence');
    const executionLog = require('../lib/execution-log');

    const events = executionLog.getRun(runId);
    if (events.length === 0) {
      return res.status(404).json({ success: false, error: `Run ${runId} not found` });
    }

    // Extract memory use from this run
    const memEvents = events.filter(e => e.event_type === 'memory_injected');
    const usedMemoryIds = new Set();
    for (const me of memEvents) {
      if (me.memory_ids) me.memory_ids.forEach(id => usedMemoryIds.add(id));
    }

    const taskId = events[0]?.task_id || '';
    const taskPattern = taskId ? replayPatterns.getPattern(taskId) : null;

    // Build top influences
    const topInfluences = [];
    const misScores = memoryInfluence.compute();

    for (const memId of usedMemoryIds) {
      const mis = misScores.find(s => s.memory_id === memId);
      topInfluences.push({
        type: 'memory',
        memory_id: memId,
        mis: mis?.mis || 0,
        solve_rate_effect: mis?.success_delta || 0,
        hallucination_effect: mis?.hallucination_reduction || 0,
        source: 'execution_log',
      });
    }

    // Add pattern-based influences
    if (taskPattern) {
      topInfluences.push({
        type: 'task_pattern',
        task_id: taskPattern.task_id,
        problem: taskPattern.problem,
        solve_rate_delta: taskPattern.solve_rate_delta,
        hallucination_delta: taskPattern.hallucination_delta,
        total_comparable_runs: taskPattern.total_runs,
        source: 'replay_patterns',
      });
    }

    // Add conflict/hallucination signals
    const conflictOverrides = memEvents.flatMap(e => e.output?.conflict_overrides || []);
    for (const co of conflictOverrides) {
      topInfluences.push({
        type: 'conflict_override',
        failure_id: co.failure_id,
        warning: co.warning?.slice(0, 200) || '',
        weight: 0.95,
        source: 'memory_gate',
      });
    }

    const blockedMemories = memEvents.flatMap(e => e.output?.blocked_memories || []);
    for (const bm of blockedMemories) {
      topInfluences.push({
        type: 'blocked_memory',
        memory_id: bm.id,
        summary: bm.summary?.slice(0, 120) || '',
        reason: bm.reason || 'unknown',
        weight: 0,
        source: 'memory_gate',
      });
    }

    // Sort by weight/impact descending
    topInfluences.sort((a, b) => {
      const wA = a.mis || a.solve_rate_delta || a.weight || 0;
      const wB = b.mis || b.solve_rate_delta || b.weight || 0;
      return Math.abs(wB) - Math.abs(wA);
    });

    res.json({
      success: true,
      run_id: runId,
      task_id: taskId,
      agent_id: events[0]?.agent_id || '',
      total_influences: topInfluences.length,
      top_influences: topInfluences.slice(0, 10),
      explanation: buildExplanation(topInfluences, taskPattern),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

function buildExplanation(influences, taskPattern) {
  const lines = [];
  if (taskPattern && taskPattern.solve_rate_delta > 0.05) {
    lines.push(`Memory improved solve rate for this problem type by ${(taskPattern.solve_rate_delta * 100).toFixed(1)}% across ${taskPattern.total_runs} comparable runs.`);
  } else if (taskPattern && taskPattern.solve_rate_delta < -0.05) {
    lines.push(`Warning: memory was associated with ${(Math.abs(taskPattern.solve_rate_delta) * 100).toFixed(1)}% lower solve rate for this problem type.`);
  }

  const topMem = influences.find(i => i.type === 'memory' && i.mis > 0.1);
  if (topMem) {
    lines.push(`Strongest memory influence: ${topMem.memory_id} (MIS ${topMem.mis.toFixed(3)}, solve effect ${(topMem.solve_rate_effect * 100).toFixed(1)}%).`);
  }

  const conflicts = influences.filter(i => i.type === 'conflict_override');
  if (conflicts.length > 0) {
    const w = conflicts[0];
    lines.push(`Approach blocked: "${w.warning}" (known failure pattern).`);
  }

  const blocks = influences.filter(i => i.type === 'blocked_memory');
  if (blocks.length > 0) {
    lines.push(`${blocks.length} memory(s) blocked due to ${blocks[0].reason || 'quality concerns'}.`);
  }

  if (lines.length === 0) {
    lines.push('No significant influences detected — run used no memory or has insufficient replay data.');
  }

  return lines.join(' ');
}

// Intelligence pipeline endpoints
async function handleIntelligenceSummary(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  try {
    const patterns = require('../lib/replay-patterns');
    const influence = require('../lib/memory-influence');
    const decay = require('../lib/memory-decay');

    const patternSummary = patterns.getSummary(parseInt(req.query.limit) || 10);
    const allMIS = influence.compute();
    const decayAnalysis = decay.analyze();

    res.json({
      success: true,
      patterns: patternSummary,
      memory_influence: {
        total_memories_scored: allMIS.length,
        top_positive: allMIS.filter(m => m.mis > 0.1).slice(0, 5),
        top_negative: allMIS.filter(m => m.mis < -0.1).slice(0, 5).reverse(),
        mean_mis: allMIS.length > 0 ? +(allMIS.reduce((s, m) => s + m.mis, 0) / allMIS.length).toFixed(4) : 0,
      },
      decay: {
        total_analyzed: decayAnalysis.length,
        accelerated: decayAnalysis.filter(d => d.action === 'accelerate_decay').length,
        quarantined: decayAnalysis.filter(d => d.action === 'mark_quarantine').length,
        preserved: decayAnalysis.filter(d => d.action === 'preserve').length,
        top_adjustments: decayAnalysis.slice(0, 5),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// POST /api/replay/run-pipeline — run the full intelligence pipeline
async function handleRunPipeline(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  try {
    const lr = require('../lib/memory-decay');
    const result = lr.runFullPipeline();
    res.json({ success: true, pipeline: result, message: 'Pattern extraction → MIS enrichment → decay adjustment complete.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { handleListReplays, handleReplay, handleReplayDiff, handleBatchAnalyze, handleInfluenceTrace, handleIntelligenceSummary, handleRunPipeline };
