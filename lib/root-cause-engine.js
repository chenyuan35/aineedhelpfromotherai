// lib/root-cause-engine.js — Root Cause Engine v0
// Purpose: Rule-based causal inference over agent execution traces
// Philosophy: "explain behavior" — not just record it
// This is NOT AI/ML. It's structural inference from semantic fields.
//
// Incremental path: event system → semantics → replay → causal inference → recovery primitives
// This module sits at "causal inference" — it reads what the semantic layer wrote
// and produces root cause hypotheses.
//
// Design constraints:
//   - No graph DB, no ML model, no external inference service
//   - Purely rule-based, deterministic, reproducible
//   - All data comes from execution-log + execution-history + failure-taxonomy
//   - Output is a hypothesis with confidence, not a verdict

const { getSeverity, FAILURE_TYPES } = require('./failure-taxonomy');

// ─── Inference Rules ───
// Each rule examines execution trace data and produces a root cause hypothesis.
// Rules are ordered by specificity — more specific rules run first.

const INFERENCE_RULES = [
  // Rule 1: Retry Loop Detection
  // If a chain of parent_run_ids shows the same failure_type repeating, it's a retry loop
  {
    name: 'retry_loop',
    detect: (trace) => {
      const failedRuns = trace.lineage.filter(r => r.failure_type);
      if (failedRuns.length < 2) return null;

      const sameTypeCount = failedRuns.filter(r => r.failure_type === trace.primaryRun.failure_type).length;
      if (sameTypeCount < 2) return null;

      const sameTaskCount = failedRuns.filter(r => r.task_id === trace.primaryRun.task_id).length;
      if (sameTaskCount < 2) return null;

      return {
        root_cause: `execution_loop/retry_loop`,
        confidence: Math.min(0.5 + sameTypeCount * 0.1, 0.95),
        derived_from: failedRuns.map(r => r.run_id),
        explanation: `Agent retried same failing action ${sameTypeCount} times with failure_type "${trace.primaryRun.failure_type}"`,
        recoverability: sameTypeCount >= 4 ? 0.1 : 0.3,
      };
    },
  },

  // Rule 2: Failure Propagation
  // If parent_run has a failure_type and child inherits the same or related failure
  {
    name: 'failure_propagation',
    detect: (trace) => {
      const parentRun = trace.lineage.find(r => r.run_id === trace.primaryRun.parent_run_id);
      if (!parentRun || !parentRun.failure_type) return null;

      const sameType = parentRun.failure_type === trace.primaryRun.failure_type;
      const sameFamily = isSameFailureFamily(parentRun.failure_type, trace.primaryRun.failure_type);

      if (!sameType && !sameFamily) return null;

      return {
        root_cause: `${trace.primaryRun.failure_type}/propagated_from_${parentRun.run_id}`,
        confidence: sameType ? 0.85 : 0.65,
        derived_from: [parentRun.run_id, `parent_failure:${parentRun.failure_type}`],
        explanation: `Failure propagated from parent run ${parentRun.run_id} (${parentRun.failure_type})`,
        recoverability: 0.4,
      };
    },
  },

  // Rule 3: Missing Evidence
  // If failure_type is hallucination/invalid_reasoning and evidence_refs is empty
  {
    name: 'missing_evidence',
    detect: (trace) => {
      const hallucinationTypes = ['hallucination', 'invalid_reasoning'];
      if (!hallucinationTypes.includes(trace.primaryRun.failure_type)) return null;

      const hasEvidence = trace.primaryRun.evidence_refs && trace.primaryRun.evidence_refs.length > 0;
      if (hasEvidence) return null;

      return {
        root_cause: `${trace.primaryRun.failure_type}/unsupported_claim`,
        confidence: 0.75,
        derived_from: ['evidence_missing'],
        explanation: `Agent made a ${trace.primaryRun.failure_type} claim without any supporting evidence`,
        recoverability: 0.6,
      };
    },
  },

  // Rule 4: Evidence Contradiction
  // If evidence_refs exist but the run still failed — the evidence may have been misleading
  {
    name: 'evidence_contradiction',
    detect: (trace) => {
      if (!trace.primaryRun.evidence_refs || trace.primaryRun.evidence_refs.length === 0) return null;

      const contradictionTypes = ['contradiction', 'hallucination'];
      if (!contradictionTypes.includes(trace.primaryRun.failure_type)) return null;

      // Check if parent also had evidence but failed differently
      const parentRun = trace.lineage.find(r => r.run_id === trace.primaryRun.parent_run_id);
      if (!parentRun) return null;

      const parentHadEvidence = parentRun.evidence_refs && parentRun.evidence_refs.length > 0;
      if (!parentHadEvidence) return null;

      // Check for overlapping evidence refs
      const overlap = trace.primaryRun.evidence_refs.filter(ref =>
        parentRun.evidence_refs.includes(ref)
      );

      if (overlap.length === 0) return null;

      return {
        root_cause: `contradiction/conflicting_evidence`,
        confidence: 0.7,
        derived_from: overlap,
        explanation: `Evidence ${overlap.join(', ')} used by both parent (${parentRun.failure_type || 'unknown'}) and this run (${trace.primaryRun.failure_type}) — evidence may be ambiguous`,
        recoverability: 0.5,
      };
    },
  },

  // Rule 5: Stale Memory
  // If failure_type is memory_conflict and there's a long gap between parent and current run
  {
    name: 'stale_memory',
    detect: (trace) => {
      if (trace.primaryRun.failure_type !== 'memory_conflict') return null;

      const parentRun = trace.lineage.find(r => r.run_id === trace.primaryRun.parent_run_id);
      if (!parentRun) {
        // No parent but memory_conflict — likely stale cache
        return {
          root_cause: `memory_conflict/stale_memory`,
          confidence: 0.6,
          derived_from: ['no_parent_found'],
          explanation: `Memory conflict detected without a direct parent run — likely stale cached reasoning`,
          recoverability: 0.7,
        };
      }

      const timeGap = new Date(trace.primaryRun.timestamp) - new Date(parentRun.timestamp);
      const hoursGap = timeGap / (1000 * 60 * 60);

      if (hoursGap > 1) {
        return {
          root_cause: `memory_conflict/stale_memory`,
          confidence: Math.min(0.5 + hoursGap * 0.05, 0.9),
          derived_from: [parentRun.run_id, `time_gap:${hoursGap.toFixed(1)}h`],
          explanation: `Memory conflict after ${hoursGap.toFixed(1)}h gap from parent run ${parentRun.run_id} — cached result likely stale`,
          recoverability: 0.7,
        };
      }

      return null;
    },
  },

  // Rule 6: Protocol Sequence Violation
  // If failure_type is protocol_violation and we can see the event sequence
  {
    name: 'protocol_sequence',
    detect: (trace) => {
      if (trace.primaryRun.failure_type !== 'protocol_violation') return null;

      // Check event sequence for this run
      const events = trace.events || [];
      const eventTypes = events.map(e => e.event_type);

      // Expected: claim → ... → submit
      const claimIdx = eventTypes.indexOf('task_claimed');
      const submitIdx = eventTypes.indexOf('result_submitted');

      if (claimIdx === -1 && submitIdx !== -1) {
        return {
          root_cause: `protocol_violation/missing_step`,
          confidence: 0.8,
          derived_from: ['missing_claim_step'],
          explanation: `Agent submitted result without claiming the task first`,
          recoverability: 0.5,
        };
      }

      // Check if store_reasoning happened before submit
      const reasoningIdx = eventTypes.indexOf('reasoning_stored');
      if (submitIdx !== -1 && reasoningIdx !== -1 && reasoningIdx > submitIdx) {
        return {
          root_cause: `protocol_violation/wrong_sequence`,
          confidence: 0.7,
          derived_from: ['reasoning_after_submit'],
          explanation: `Agent stored reasoning after submitting result — reasoning should precede submission`,
          recoverability: 0.6,
        };
      }

      return {
        root_cause: `protocol_violation/unknown_sequence`,
        confidence: 0.4,
        derived_from: eventTypes.length > 0 ? eventTypes : ['no_events'],
        explanation: `Protocol violation detected but specific sequence error not identified`,
        recoverability: 0.5,
      };
    },
  },

  // Rule 7: Timeout Cascade
  // If multiple runs in lineage show timeout, likely a systemic timeout cascade
  {
    name: 'timeout_cascade',
    detect: (trace) => {
      if (trace.primaryRun.failure_type !== 'timeout') return null;

      const timeoutInLineage = trace.lineage.filter(r => r.failure_type === 'timeout');
      if (timeoutInLineage.length < 2) return null;

      return {
        root_cause: `timeout/cascade`,
        confidence: 0.8,
        derived_from: timeoutInLineage.map(r => r.run_id),
        explanation: `Timeout cascade detected — ${timeoutInLineage.length} runs in lineage timed out`,
        recoverability: 0.2,
      };
    },
  },

  // Rule 8: Fallback — Unknown root cause
  // If we have a failure but no specific rule matched
  {
    name: 'unknown_failure',
    detect: (trace) => {
      if (!trace.primaryRun.failure_type) return null;

      return {
        root_cause: `${trace.primaryRun.failure_type}/unclassified`,
        confidence: 0.3,
        derived_from: [],
        explanation: `Failure type "${trace.primaryRun.failure_type}" detected but root cause pattern not recognized`,
        recoverability: 0.4,
      };
    },
  },
];

// ─── Helper: Check if two failure types are in the same "family" ───
function isSameFailureFamily(typeA, typeB) {
  const families = {
    reasoning: ['hallucination', 'invalid_reasoning', 'contradiction'],
    execution: ['timeout', 'execution_loop', 'tool_misuse'],
    memory: ['memory_conflict'],
    protocol: ['protocol_violation'],
  };

  for (const family of Object.values(families)) {
    if (family.includes(typeA) && family.includes(typeB)) return true;
  }
  return false;
}

// ─── Core: Build execution trace for a run ───
// Collects all data needed for root cause analysis
function buildTrace(runId, { executionLog, executionHistory }) {
  const events = executionLog.getRun(runId);
  const runsIndex = executionLog.getRunIds();

  // Find this run's metadata
  const runMeta = runsIndex.find(r => r.run_id === runId) || {};
  const primaryEvent = events[0] || {};

  const primaryRun = {
    run_id: runId,
    failure_type: primaryEvent.failure_type || null,
    failure_subtype: primaryEvent.failure_subtype || null,
    evidence_refs: primaryEvent.evidence_refs || [],
    parent_run_id: primaryEvent.parent_run_id || runMeta.parent_run_id || null,
    task_id: primaryEvent.task_id || runMeta.task_id || '',
    agent_id: primaryEvent.agent_id || runMeta.agent_id || '',
    timestamp: primaryEvent.timestamp || runMeta.first_seen || new Date().toISOString(),
  };

  // Build lineage chain (walk parent_run_id upward)
  const lineage = [primaryRun];
  let currentParentId = primaryRun.parent_run_id;
  const visited = new Set([runId]);
  const MAX_DEPTH = 10;

  while (currentParentId && !visited.has(currentParentId) && lineage.length < MAX_DEPTH) {
    visited.add(currentParentId);
    const parentEvents = executionLog.getRun(currentParentId);
    const parentMeta = runsIndex.find(r => r.run_id === currentParentId) || {};
    const parentFirst = parentEvents[0] || {};

    lineage.push({
      run_id: currentParentId,
      failure_type: parentFirst.failure_type || null,
      failure_subtype: parentFirst.failure_subtype || null,
      evidence_refs: parentFirst.evidence_refs || [],
      parent_run_id: parentFirst.parent_run_id || parentMeta.parent_run_id || null,
      task_id: parentFirst.task_id || parentMeta.task_id || '',
      agent_id: parentFirst.agent_id || parentMeta.agent_id || '',
      timestamp: parentFirst.timestamp || parentMeta.first_seen || '',
    });

    currentParentId = parentFirst.parent_run_id || parentMeta.parent_run_id || null;
  }

  return {
    primaryRun,
    lineage,
    events,
    lineageDepth: lineage.length,
  };
}

// ─── Core: Analyze a run for root cause ───
// Returns a root cause hypothesis with confidence
function analyzeRun(runId, deps = {}) {
  // Dependency injection — default to real modules
  const executionLog = deps.executionLog || require('./execution-log');
  const executionHistory = deps.executionHistory || null; // Optional, for DB queries

  // Build trace
  const trace = buildTrace(runId, { executionLog, executionHistory });

  // No failure on this run? No root cause to find
  if (!trace.primaryRun.failure_type) {
    return {
      run_id: runId,
      root_cause: null,
      confidence: 0,
      derived_from: [],
      explanation: 'No failure_type detected on this run — root cause analysis not applicable',
      recoverability: 1.0,
      lineage_depth: trace.lineageDepth,
      rules_evaluated: INFERENCE_RULES.length,
      rules_matched: 0,
    };
  }

  // Run inference rules in order — first match wins (most specific first)
  let match = null;
  let rulesEvaluated = 0;

  for (const rule of INFERENCE_RULES) {
    rulesEvaluated++;
    const result = rule.detect(trace);
    if (result) {
      match = result;
      break;
    }
  }

  if (!match) {
    // Shouldn't happen (fallback rule always matches), but defensive
    return {
      run_id: runId,
      root_cause: 'unknown',
      confidence: 0,
      derived_from: [],
      explanation: 'No inference rule matched',
      recoverability: 0,
      lineage_depth: trace.lineageDepth,
      rules_evaluated: rulesEvaluated,
      rules_matched: 0,
    };
  }

  // Build timeline from events
  const timeline = trace.events.map((ev, idx) => ({
    step: idx + 1,
    event: ev.event_type,
    timestamp: ev.timestamp,
    failure_type: ev.failure_type || undefined,
    parent_run_id: ev.parent_run_id || undefined,
  }));

  return {
    run_id: runId,
    root_cause: match.root_cause,
    confidence: match.confidence,
    derived_from: match.derived_from,
    explanation: match.explanation,
    recoverability: match.recoverability,
    severity: getSeverity(trace.primaryRun.failure_type),
    failure_type: trace.primaryRun.failure_type,
    failure_subtype: trace.primaryRun.failure_subtype || null,
    lineage_depth: trace.lineageDepth,
    timeline,
    rules_evaluated: rulesEvaluated,
    rules_matched: 1,
    analysis_version: '0.1.0',
  };
}

// ─── Batch: Analyze recent failures ───
function analyzeRecentFailures(limit = 10, deps = {}) {
  const executionLog = deps.executionLog || require('./execution-log');

  // Find all runs with failure_type
  const failedEvents = executionLog.query({ failure_type: undefined }); // Can't filter by "has" failure_type easily
  // Instead, get all run IDs and check for failures
  const allRuns = executionLog.getRunIds();
  const analyses = [];

  for (const run of allRuns) {
    if (analyses.length >= limit) break;
    const events = executionLog.getRun(run.run_id);
    const hasFailure = events.some(e => e.failure_type);
    if (hasFailure) {
      analyses.push(analyzeRun(run.run_id, deps));
    }
  }

  return {
    total_analyzed: analyses.length,
    analyses,
  };
}

module.exports = {
  analyzeRun,
  analyzeRecentFailures,
  buildTrace,
  INFERENCE_RULES,
};
