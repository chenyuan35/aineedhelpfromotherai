// lib/behavioral-signals.js — Behavioral Signals Engine v0
// Purpose: Runtime immune system — detect anomalous agent behavior BEFORE it cascades
// Philosophy: "from post-mortem forensics to runtime immune system"
//
// This is NOT AI/ML. It's rule-based behavioral detection on top of existing data.
// All data comes from: execution-log, execution-history, mcp_usage, root-cause-engine
//
// Incremental path:
//   events → replay → lineage → taxonomy → root cause → behavioral signals ← HERE
//
// 6 Signals:
//   1. retry_explosion     — same task, abnormal repeat claims/submits
//   2. tool_drift          — tool call sequence deviates from expected pattern
//   3. hallucination_cascade — hallucination propagates through lineage
//   4. goal_drift          — task objective diverges from final behavior
//   5. timeout_cluster     — temporal grouping of timeouts
//   6. wandering_agent     — abnormal tool/action count per task

const executionLog = require('./execution-log');
const { getSeverity, FAILURE_TYPES } = require('./failure-taxonomy');

// ─── Configuration ───
const CONFIG = {
  // Scan window: how far back to look (ms)
  scan_window_ms: 30 * 60 * 1000, // 30 minutes

  // retry_explosion thresholds
  retry_explosion: {
    claim_threshold: 3,       // >3 claims on same task = signal
    submit_threshold: 3,      // >3 submits on same task = signal
    same_agent_multiplier: 2, // same agent retrying = more severe
  },

  // tool_drift: expected tool sequences per task_type
  tool_drift: {
    default_sequence: ['list_open_tasks', 'claim_task', 'store_reasoning', 'submit_result'],
    max_repetition: 3, // same tool called >3 times in a run = drift
    task_type_sequences: {
      reasoning: ['list_open_tasks', 'claim_task', 'store_reasoning', 'submit_result'],
      coding: ['list_open_tasks', 'claim_task', 'submit_result'],
      meta: ['list_open_tasks', 'claim_task', 'store_reasoning', 'submit_result'],
    },
  },

  // hallucination_cascade
  hallucination_cascade: {
    min_lineage_depth: 2,    // need at least 2 runs in lineage
    confidence_threshold: 0.6,
  },

  // goal_drift: keyword overlap threshold
  goal_drift: {
    min_overlap: 0.15,        // <15% keyword overlap = drift signal
    min_task_length: 10,      // only check tasks with >10 char description
  },

  // timeout_cluster
  timeout_cluster: {
    window_ms: 5 * 60 * 1000, // 5 minute window
    threshold: 3,              // >3 timeouts in window = cluster
  },

  // wandering_agent
  wandering_agent: {
    max_tools_per_task: 12,    // >12 tool calls on one task = wandering
    max_same_tool: 4,          // same tool >4 times = wandering
    max_duration_ms: 10 * 60 * 1000, // >10 min on one task = wandering
  },
};

// ─── Signal Output Format ───
// Each detector returns null (no signal) or:
// {
//   signal: string,          // e.g. 'retry_explosion'
//   severity: string,        // 'low' | 'medium' | 'high' | 'critical'
//   confidence: number,      // 0-1
//   run_id: string | null,   // primary run if applicable
//   agent_id: string | null,
//   task_id: string | null,
//   explanation: string,
//   evidence: array,         // data supporting this signal
//   detected_at: string,     // ISO timestamp
//   recommendation: string,  // suggested action
// }

// ─── 1. Retry Explosion ───
// Detect: same task_id has abnormal number of claims or submits
function detectRetryExplosion(windowMs) {
  const after = new Date(Date.now() - (windowMs || CONFIG.scan_window_ms)).toISOString();
  const events = executionLog.query({ after });

  // Group by task_id
  const taskActivity = {};
  for (const ev of events) {
    if (!ev.task_id) continue;
    if (!taskActivity[ev.task_id]) {
      taskActivity[ev.task_id] = { claims: [], submits: [], agents: new Set() };
    }
    if (ev.event_type === 'task_claimed') {
      taskActivity[ev.task_id].claims.push(ev);
      if (ev.agent_id) taskActivity[ev.task_id].agents.add(ev.agent_id);
    }
    if (ev.event_type === 'result_submitted') {
      taskActivity[ev.task_id].submits.push(ev);
      if (ev.agent_id) taskActivity[ev.task_id].agents.add(ev.agent_id);
    }
  }

  const signals = [];
  for (const [taskId, activity] of Object.entries(taskActivity)) {
    const totalAttempts = activity.claims.length + activity.submits.length;
    const claimCount = activity.claims.length;
    const submitCount = activity.submits.length;
    const agentCount = activity.agents.size;

    let severity = null;
    let explanation = '';
    let confidence = 0;

    // Same agent retrying same task many times
    if (claimCount >= CONFIG.retry_explosion.claim_threshold) {
      // Check if one agent dominates
      const agentClaims = {};
      for (const c of activity.claims) {
        const aid = c.agent_id || 'unknown';
        agentClaims[aid] = (agentClaims[aid] || 0) + 1;
      }
      const maxAgentClaims = Math.max(...Object.values(agentClaims));
      const dominantAgent = Object.entries(agentClaims).find(([, v]) => v === maxAgentClaims)?.[0];

      if (maxAgentClaims >= CONFIG.retry_explosion.claim_threshold * CONFIG.retry_explosion.same_agent_multiplier) {
        severity = 'critical';
        confidence = 0.9;
        explanation = `Agent "${dominantAgent}" claimed task ${taskId} ${maxAgentClaims} times — likely stuck in retry loop`;
      } else if (claimCount >= CONFIG.retry_explosion.claim_threshold) {
        severity = 'high';
        confidence = 0.75;
        explanation = `Task ${taskId} claimed ${claimCount} times by ${agentCount} agent(s) — abnormal retry activity`;
      }

      if (severity) {
        const lastClaim = activity.claims[activity.claims.length - 1];
        signals.push({
          signal: 'retry_explosion',
          severity,
          confidence,
          run_id: lastClaim.run_id || null,
          agent_id: dominantAgent || null,
          task_id: taskId,
          explanation,
          evidence: activity.claims.map(c => ({
            run_id: c.run_id,
            agent_id: c.agent_id,
            timestamp: c.timestamp,
          })),
          detected_at: new Date().toISOString(),
          recommendation: severity === 'critical'
            ? 'Agent likely in retry loop — consider auto-freeze and rollback to last stable checkpoint'
            : 'High retry rate detected — monitor for escalation, check if task definition is ambiguous',
        });
      }
    }

    // Submit explosion (many failed submissions)
    if (submitCount >= CONFIG.retry_explosion.submit_threshold) {
      const failedSubmits = activity.submits.filter(s => s.failure_type);
      if (failedSubmits.length >= CONFIG.retry_explosion.submit_threshold) {
        signals.push({
          signal: 'retry_explosion',
          severity: 'high',
          confidence: 0.8,
          run_id: failedSubmits[failedSubmits.length - 1].run_id || null,
          agent_id: failedSubmits[failedSubmits.length - 1].agent_id || null,
          task_id: taskId,
          explanation: `Task ${taskId} has ${failedSubmits.length} failed submissions — agents repeatedly failing`,
          evidence: failedSubmits.map(s => ({
            run_id: s.run_id,
            agent_id: s.agent_id,
            failure_type: s.failure_type,
            timestamp: s.timestamp,
          })),
          detected_at: new Date().toISOString(),
          recommendation: 'Investigate task difficulty or agent capability mismatch — consider adding resolve hints',
        });
      }
    }
  }

  return signals;
}

// ─── 2. Tool Drift ───
// Detect: agent's tool call sequence deviates from expected pattern
function detectToolDrift(windowMs) {
  const after = new Date(Date.now() - (windowMs || CONFIG.scan_window_ms)).toISOString();
  const runs = executionLog.getRunIds();
  const signals = [];

  for (const run of runs.slice(0, 50)) { // Check recent 50 runs max
    const events = executionLog.getRun(run.run_id);
    if (events.length === 0) continue;

    // Check if events are within window
    const firstTs = events[0].timestamp;
    if (firstTs < after) continue;

    // Build tool call sequence from events
    const toolSequence = events
      .filter(e => e.event_type)
      .map(e => e.event_type);

    if (toolSequence.length === 0) continue;

    // Detect repetition: same event_type appearing too many times
    const typeCounts = {};
    for (const t of toolSequence) {
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    }

    const repetitions = Object.entries(typeCounts)
      .filter(([, count]) => count > CONFIG.tool_drift.max_repetition)
      .map(([type, count]) => ({ type, count }));

    if (repetitions.length > 0) {
      const worst = repetitions.sort((a, b) => b.count - a.count)[0];
      const severity = worst.count > CONFIG.tool_drift.max_repetition * 2 ? 'critical' : 'high';
      const confidence = Math.min(0.5 + (worst.count - CONFIG.tool_drift.max_repetition) * 0.1, 0.95);

      signals.push({
        signal: 'tool_drift',
        severity,
        confidence,
        run_id: run.run_id,
        agent_id: run.agent_id || null,
        task_id: run.task_id || null,
        explanation: `Run ${run.run_id} repeated "${worst.type}" ${worst.count} times (threshold: ${CONFIG.tool_drift.max_repetition}) — agent stuck in behavioral loop`,
        evidence: repetitions.map(r => ({ event_type: r.type, count: r.count })),
        detected_at: new Date().toISOString(),
        recommendation: 'Agent is repeating actions without progress — likely needs different strategy or memory intervention',
      });
    }

    // Detect missing expected steps
    const hasClaim = toolSequence.includes('task_claimed');
    const hasSubmit = toolSequence.includes('result_submitted');
    const hasReasoning = toolSequence.includes('reasoning_stored');

    if (hasSubmit && !hasClaim) {
      signals.push({
        signal: 'tool_drift',
        severity: 'medium',
        confidence: 0.7,
        run_id: run.run_id,
        agent_id: run.agent_id || null,
        task_id: run.task_id || null,
        explanation: `Run ${run.run_id} submitted result without claiming task — protocol sequence violation`,
        evidence: [{ missing_step: 'task_claimed', present_steps: toolSequence }],
        detected_at: new Date().toISOString(),
        recommendation: 'Agent skipped claim step — verify execution was legitimate, may indicate protocol confusion',
      });
    }

    if (hasClaim && hasSubmit && !hasReasoning) {
      // Not necessarily bad, but worth noting for reasoning-heavy tasks
      const taskType = events.find(e => e.input?.task_type)?.input?.task_type;
      if (taskType === 'reasoning' || taskType === 'meta') {
        signals.push({
          signal: 'tool_drift',
          severity: 'low',
          confidence: 0.5,
          run_id: run.run_id,
          agent_id: run.agent_id || null,
          task_id: run.task_id || null,
          explanation: `Run ${run.run_id} on ${taskType} task completed without storing reasoning — traceability gap`,
          evidence: [{ missing_step: 'reasoning_stored', task_type: taskType }],
          detected_at: new Date().toISOString(),
          recommendation: 'Encourage agent to store reasoning for reasoning/meta tasks — improves traceability and memory',
        });
      }
    }
  }

  return signals;
}

// ─── 3. Hallucination Cascade ───
// Detect: hallucination failure propagates through parent_run_id lineage
function detectHallucinationCascade(windowMs) {
  const after = new Date(Date.now() - (windowMs || CONFIG.scan_window_ms)).toISOString();
  const runs = executionLog.getRunIds();
  const signals = [];

  for (const run of runs.slice(0, 50)) {
    const events = executionLog.getRun(run.run_id);
    if (events.length === 0) continue;
    if (events[0].timestamp < after) continue;

    // Check if this run has hallucination failure
    const hallucinationEvents = events.filter(e =>
      e.failure_type === 'hallucination' || e.failure_type === 'invalid_reasoning'
    );

    if (hallucinationEvents.length === 0) continue;

    // Build lineage using parent_run_id
    const lineage = [];
    let currentParentId = events[0]?.parent_run_id || run.parent_run_id;
    const visited = new Set([run.run_id]);
    let depth = 0;

    while (currentParentId && !visited.has(currentParentId) && depth < 10) {
      visited.add(currentParentId);
      const parentEvents = executionLog.getRun(currentParentId);
      if (parentEvents.length === 0) break;

      const parentFailure = parentEvents.find(e => e.failure_type);
      lineage.push({
        run_id: currentParentId,
        failure_type: parentFailure?.failure_type || null,
        timestamp: parentEvents[0].timestamp,
        agent_id: parentEvents[0].agent_id || null,
      });

      currentParentId = parentEvents[0]?.parent_run_id;
      depth++;
    }

    // Check children (runs that have this run as parent)
    const allRuns = executionLog.getRunIds();
    const children = allRuns.filter(r =>
      r.parent_run_id === run.run_id && r.run_id !== run.run_id
    );

    // Check if hallucination cascaded
    const failedChildren = children.filter(child => {
      const childEvents = executionLog.getRun(child.run_id);
      return childEvents.some(e => e.failure_type);
    });

    const hallucinatedChildren = children.filter(child => {
      const childEvents = executionLog.getRun(child.run_id);
      return childEvents.some(e =>
        e.failure_type === 'hallucination' || e.failure_type === 'invalid_reasoning'
      );
    });

    if (lineage.length >= CONFIG.hallucination_cascade.min_lineage_depth - 1 || hallucinatedChildren.length > 0) {
      const totalInfected = 1 + hallucinatedChildren.length + lineage.filter(l =>
        l.failure_type === 'hallucination' || l.failure_type === 'invalid_reasoning'
      ).length;

      if (totalInfected >= 2) {
        const severity = totalInfected >= 4 ? 'critical' : totalInfected >= 3 ? 'high' : 'medium';
        const confidence = Math.min(0.6 + totalInfected * 0.1, 0.95);

        signals.push({
          signal: 'hallucination_cascade',
          severity,
          confidence,
          run_id: run.run_id,
          agent_id: run.agent_id || null,
          task_id: run.task_id || null,
          explanation: `Hallucination cascade detected — ${totalInfected} run(s) contaminated in lineage from run ${run.run_id}`,
          evidence: {
            source_run: run.run_id,
            source_failure: 'hallucination',
            infected_runs: hallucinatedChildren.map(c => c.run_id),
            lineage_failures: lineage.filter(l => l.failure_type).map(l => ({
              run_id: l.run_id,
              failure_type: l.failure_type,
            })),
          },
          detected_at: new Date().toISOString(),
          recommendation: 'Quarantine hallucinated reasoning — block from memory, rollback dependent runs, re-execute from last stable checkpoint',
        });
      }
    }
  }

  return signals;
}

// ─── 4. Goal Drift ───
// Detect: task objective diverges from final behavior
// Method: keyword overlap between task description and submitted result
function detectGoalDrift(windowMs) {
  const after = new Date(Date.now() - (windowMs || CONFIG.scan_window_ms)).toISOString();
  const events = executionLog.query({ event_type: 'result_submitted', after });
  const signals = [];

  for (const submitEvent of events) {
    if (!submitEvent.task_id || !submitEvent.run_id) continue;

    // Get the task claim event for the objective
    const claimEvents = executionLog.query({
      task_id: submitEvent.task_id,
      event_type: 'task_claimed',
    });

    if (claimEvents.length === 0) continue;
    const claimEvent = claimEvents[0];

    // Extract task objective from claim input
    const taskObjective = extractText(claimEvent.input) ||
      claimEvent.input?.title ||
      claimEvent.input?.problem ||
      '';

    // Extract result content
    const resultContent = extractText(submitEvent.output) ||
      submitEvent.input?.result ||
      '';

    if (taskObjective.length < CONFIG.goal_drift.min_task_length) continue;
    if (resultContent.length < 10) continue;

    // Compute keyword overlap
    const objectiveKeywords = extractKeywords(taskObjective);
    const resultKeywords = extractKeywords(resultContent);

    if (objectiveKeywords.length === 0) continue;

    let overlapCount = 0;
    for (const kw of objectiveKeywords) {
      if (resultKeywords.has(kw)) overlapCount++;
    }

    const overlapRatio = overlapCount / objectiveKeywords.length;

    if (overlapRatio < CONFIG.goal_drift.min_overlap) {
      const severity = overlapRatio < 0.05 ? 'critical' : overlapRatio < 0.1 ? 'high' : 'medium';
      const confidence = Math.min(0.5 + (CONFIG.goal_drift.min_overlap - overlapRatio) * 3, 0.9);

      signals.push({
        signal: 'goal_drift',
        severity,
        confidence,
        run_id: submitEvent.run_id,
        agent_id: submitEvent.agent_id || null,
        task_id: submitEvent.task_id,
        explanation: `Goal drift: task objective and result have only ${(overlapRatio * 100).toFixed(0)}% keyword overlap — agent may have diverged from intended goal`,
        evidence: {
          objective_keywords: [...objectiveKeywords].slice(0, 10),
          overlap_ratio: overlapRatio,
          overlap_count: overlapCount,
          objective_preview: taskObjective.slice(0, 150),
          result_preview: resultContent.slice(0, 150),
        },
        detected_at: new Date().toISOString(),
        recommendation: 'Review submission — agent may have worked on wrong problem. Consider re-execution with stronger task framing',
      });
    }
  }

  return signals;
}

// ─── 5. Timeout Cluster ───
// Detect: temporal grouping of timeout failures
function detectTimeoutCluster(windowMs) {
  const after = new Date(Date.now() - (windowMs || CONFIG.scan_window_ms)).toISOString();
  const events = executionLog.query({ after });

  // Collect all timeout events
  const timeoutEvents = events.filter(e =>
    e.failure_type === 'timeout' ||
    e.event_type === 'result_submitted' && e.failure_type === 'timeout'
  );

  if (timeoutEvents.length < CONFIG.timeout_cluster.threshold) return [];

  // Group by sliding window
  const sorted = timeoutEvents.sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  const signals = [];
  let windowStart = 0;

  for (let i = 0; i < sorted.length; i++) {
    const windowEnd = new Date(sorted[i].timestamp).getTime();
    const windowBegin = windowEnd - CONFIG.timeout_cluster.window_ms;

    // Count timeouts in this window
    let count = 0;
    const affectedAgents = new Set();
    const affectedTasks = new Set();

    for (let j = windowStart; j < sorted.length; j++) {
      const ts = new Date(sorted[j].timestamp).getTime();
      if (ts < windowBegin) {
        windowStart = j + 1;
        continue;
      }
      if (ts > windowEnd) break;
      count++;
      if (sorted[j].agent_id) affectedAgents.add(sorted[j].agent_id);
      if (sorted[j].task_id) affectedTasks.add(sorted[j].task_id);
    }

    if (count >= CONFIG.timeout_cluster.threshold) {
      const severity = count >= CONFIG.timeout_cluster.threshold * 3 ? 'critical'
        : count >= CONFIG.timeout_cluster.threshold * 2 ? 'high' : 'medium';
      const confidence = Math.min(0.6 + count * 0.05, 0.95);

      signals.push({
        signal: 'timeout_cluster',
        severity,
        confidence,
        run_id: sorted[i].run_id || null,
        agent_id: null, // systemic, not agent-specific
        task_id: null,
        explanation: `Timeout cluster: ${count} timeout(s) within ${CONFIG.timeout_cluster.window_ms / 60000}min window across ${affectedAgents.size} agent(s), ${affectedTasks.size} task(s)`,
        evidence: {
          timeout_count: count,
          window_minutes: CONFIG.timeout_cluster.window_ms / 60000,
          affected_agents: [...affectedAgents],
          affected_tasks: [...affectedTasks],
          time_range: {
            start: sorted[windowStart]?.timestamp,
            end: sorted[i].timestamp,
          },
        },
        detected_at: new Date().toISOString(),
        recommendation: 'Systemic timeout pattern — likely infrastructure issue or resource contention, not individual agent failure',
      });

      break; // One signal per cluster detection pass
    }
  }

  return signals;
}

// ─── 6. Wandering Agent ───
// Detect: agent takes abnormal number of actions on a single task
function detectWanderingAgent(windowMs) {
  const after = new Date(Date.now() - (windowMs || CONFIG.scan_window_ms)).toISOString();
  const runs = executionLog.getRunIds();
  const signals = [];

  for (const run of runs.slice(0, 50)) {
    const events = executionLog.getRun(run.run_id);
    if (events.length === 0) continue;
    if (events[0].timestamp < after) continue;

    const eventCount = events.length;
    const agentId = run.agent_id || events[0]?.agent_id || null;

    // Count same event type repetitions
    const typeCounts = {};
    for (const e of events) {
      typeCounts[e.event_type] = (typeCounts[e.event_type] || 0) + 1;
    }

    const maxSameType = Math.max(...Object.values(typeCounts));
    const dominantType = Object.entries(typeCounts).find(([, v]) => v === maxSameType)?.[0];

    // Check duration
    let durationMs = 0;
    if (events.length >= 2) {
      durationMs = new Date(events[events.length - 1].timestamp) - new Date(events[0].timestamp);
    }

    let severity = null;
    let explanation = '';
    let confidence = 0;

    if (eventCount > CONFIG.wandering_agent.max_tools_per_task) {
      severity = eventCount > CONFIG.wandering_agent.max_tools_per_task * 2 ? 'critical' : 'high';
      confidence = Math.min(0.6 + (eventCount - CONFIG.wandering_agent.max_tools_per_task) * 0.03, 0.9);
      explanation = `Agent ${agentId || 'unknown'} used ${eventCount} actions on task ${run.task_id || 'unknown'} — likely wandering without focus`;
    } else if (maxSameType > CONFIG.wandering_agent.max_same_tool) {
      severity = maxSameType > CONFIG.wandering_agent.max_same_tool * 2 ? 'critical' : 'medium';
      confidence = Math.min(0.5 + (maxSameType - CONFIG.wandering_agent.max_same_tool) * 0.1, 0.85);
      explanation = `Agent ${agentId || 'unknown'} called "${dominantType}" ${maxSameType} times on task ${run.task_id || 'unknown'} — repeating without progress`;
    } else if (durationMs > CONFIG.wandering_agent.max_duration_ms && !events.some(e => e.event_type === 'result_submitted')) {
      severity = 'medium';
      confidence = 0.6;
      explanation = `Agent ${agentId || 'unknown'} spent ${Math.round(durationMs / 60000)}min on task ${run.task_id || 'unknown'} without submitting — likely stuck`;
    }

    if (severity) {
      signals.push({
        signal: 'wandering_agent',
        severity,
        confidence,
        run_id: run.run_id,
        agent_id: agentId,
        task_id: run.task_id || null,
        explanation,
        evidence: {
          total_events: eventCount,
          event_type_distribution: typeCounts,
          duration_ms: durationMs,
          dominant_type: dominantType || null,
          dominant_type_count: maxSameType,
        },
        detected_at: new Date().toISOString(),
        recommendation: 'Agent is spending excessive effort without progress — consider intervention with memory injection or task re-scoping',
      });
    }
  }

  return signals;
}

// ─── Utility: Text Extraction ───
function extractText(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  // Try common field names
  return obj.content || obj.result || obj.text || obj.summary || '';
}

// ─── Utility: Keyword Extraction ───
// Simple keyword extraction — split, lowercase, remove stop words, deduplicate
function extractKeywords(text) {
  if (!text || typeof text !== 'string') return new Set();

  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
    'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'just', 'because', 'but', 'and',
    'or', 'if', 'while', 'about', 'up', 'it', 'its', 'this', 'that',
    'these', 'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he',
    'him', 'his', 'she', 'her', 'they', 'them', 'their', 'what', 'which',
    'who', 'whom',
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  return new Set(words);
}

// ─── Core: Scan all signals ───
// Returns all detected signals sorted by severity
function scanAllSignals(windowMs) {
  const allSignals = [
    ...detectRetryExplosion(windowMs),
    ...detectToolDrift(windowMs),
    ...detectHallucinationCascade(windowMs),
    ...detectGoalDrift(windowMs),
    ...detectTimeoutCluster(windowMs),
    ...detectWanderingAgent(windowMs),
  ];

  // Sort by severity (critical first)
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  allSignals.sort((a, b) => {
    const sa = severityOrder[a.severity] ?? 4;
    const sb = severityOrder[b.severity] ?? 4;
    if (sa !== sb) return sa - sb;
    return b.confidence - a.confidence;
  });

  return allSignals;
}

// ─── Core: Scan a specific agent ───
function scanAgent(agentId, windowMs) {
  const all = scanAllSignals(windowMs);
  return all.filter(s => s.agent_id === agentId);
}

// ─── Core: Get signal summary ───
function getSignalSummary(windowMs) {
  const signals = scanAllSignals(windowMs);
  const byType = {};
  const bySeverity = { critical: 0, high: 0, medium: 0, low: 0 };

  for (const s of signals) {
    byType[s.signal] = (byType[s.signal] || 0) + 1;
    bySeverity[s.severity] = (bySeverity[s.severity] || 0) + 1;
  }

  return {
    total_signals: signals.length,
    by_type: byType,
    by_severity: bySeverity,
    scan_window_ms: windowMs || CONFIG.scan_window_ms,
    scanned_at: new Date().toISOString(),
  };
}

module.exports = {
  scanAllSignals,
  scanAgent,
  getSignalSummary,
  // Individual detectors (for testing / targeted use)
  detectRetryExplosion,
  detectToolDrift,
  detectHallucinationCascade,
  detectGoalDrift,
  detectTimeoutCluster,
  detectWanderingAgent,
  CONFIG,
};
