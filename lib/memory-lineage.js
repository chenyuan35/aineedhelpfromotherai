// lib/memory-lineage.js — Hint genealogy tracker
// Prevents hallucination cascade by tracing which reasoning object spawned which hint.
// Each hint tracks: parent_reasoning_id, ancestor_task_ids, mutation_generation

const rc = require('./resolve-cache');

/** Enrich a hint with lineage before storage */
function enrichHint(hint, parentReasoningId, ancestorTaskIds, mutationGen) {
  return {
    ...hint,
    parent_reasoning_id: parentReasoningId || null,
    ancestor_task_ids: Array.from(new Set([...(ancestorTaskIds || []), ...(parentReasoningId ? [parentReasoningId] : [])])),
    mutation_generation: (mutationGen || 0) + 1,
    lineage_created_at: new Date().toISOString(),
  };
}

/** Get full lineage for a hint (walk the chain) */
function getLineage(taskId) {
  const hint = rc.getHint(taskId);
  if (!hint) return null;

  const chain = [{
    task_id: taskId,
    reasoning_id: hint.reasoning_id || null,
    parent_id: hint.parent_reasoning_id || null,
    generation: hint.mutation_generation || 0,
    score: hint.score || 0,
    status: hint.status || 'unknown',
    solution_summary: (hint.solution_summary || '').slice(0, 100),
  }];

  // Walk back through ancestors
  const ancestors = hint.ancestor_task_ids || [];
  for (const ancestorId of ancestors) {
    const ancestor = rc.getHint(ancestorId);
    if (ancestor) {
      chain.push({
        task_id: ancestorId,
        reasoning_id: ancestor.reasoning_id || null,
        parent_id: ancestor.parent_reasoning_id || null,
        generation: ancestor.mutation_generation || 0,
        score: ancestor.score || 0,
        status: ancestor.status || 'unknown',
        solution_summary: (ancestor.solution_summary || '').slice(0, 100),
      });
    }
  }

  return chain;
}

/** Detect hallucination cascade: multiple hints in same lineage with low scores */
function detectCascade(taskId, thresholdScore = -0.5) {
  const lineage = getLineage(taskId);
  if (!lineage || lineage.length < 2) return { cascade: false, contaminated_count: 0, severity: 'none' };

  const contaminated = lineage.filter(h => {
    // Check hint status
    const s = h.status || (h.score >= 0.3 ? 'active' : 'decaying');
    return s === 'quarantined' || s === 'blacklisted' || h.score <= thresholdScore;
  });

  if (contaminated.length === 0) return { cascade: false, contaminated_count: 0, severity: 'none' };

  const ratio = contaminated.length / lineage.length;
  return {
    cascade: ratio > 0.3,
    contaminated_count: contaminated.length,
    total_in_lineage: lineage.length,
    severity: ratio > 0.6 ? 'critical' : (ratio > 0.3 ? 'warning' : 'low'),
    contaminated_hints: contaminated.map(h => ({ task_id: h.task_id, score: h.score, status: h.status })),
  };
}

/** Find all hints that share ancestors with a given hint (siblings) */
function findSiblings(taskId) {
  const allHints = rc.getAllHints();
  const hint = allHints[taskId];
  if (!hint) return [];

  const myAncestors = new Set(hint.ancestor_task_ids || []);
  const siblings = [];

  for (const [id, h] of Object.entries(allHints)) {
    if (id === taskId) continue;
    const theirAncestors = h.ancestor_task_ids || [];
    if (theirAncestors.some(a => myAncestors.has(a))) {
      siblings.push({ task_id: id, score: h.score, generation: h.mutation_generation, solution_summary: (h.solution_summary || '').slice(0, 80) });
    }
  }

  return siblings.sort((a, b) => b.score - a.score);
}

/** Build full lineage forest (all hints grouped by root ancestor) */
function buildLineageForest() {
  const allHints = rc.getAllHints();
  const byParent = {};

  for (const [id, h] of Object.entries(allHints)) {
    const parent = h.parent_reasoning_id || 'root';
    if (!byParent[parent]) byParent[parent] = [];
    byParent[parent].push({
      task_id: id,
      reasoning_id: h.reasoning_id || null,
      generation: h.mutation_generation || 0,
      score: h.score || 0,
      status: h.status || 'unknown',
    });
  }

  // Only return trees with >1 node
  const forests = {};
  for (const [parent, children] of Object.entries(byParent)) {
    if (children.length > 1) {
      forests[parent] = {
        root: parent === 'root' ? null : parent,
        children: children.sort((a, b) => b.score - a.score),
        health: {
          avg_score: Math.round(children.reduce((s, c) => s + c.score, 0) / children.length * 100) / 100,
          total: children.length,
          quarantined: children.filter(c => c.status === 'quarantined' || c.status === 'blacklisted').length,
        },
      };
    }
  }

  return Object.keys(forests).length > 0 ? forests : null;
}

/** Mark a lineage as contaminated (quarantine all descendants) */
function quarantineLineage(rootTaskId) {
  const allHints = rc.getAllHints();
  const hint = allHints[rootTaskId];
  if (!hint) return { quarantined: 0 };

  let count = 0;
  const rootAncestors = new Set(hint.ancestor_task_ids || []);

  for (const [id, h] of Object.entries(allHints)) {
    const ancestors = h.ancestor_task_ids || [];
    if (id === rootTaskId || ancestors.some(a => rootAncestors.has(a) || a === rootTaskId)) {
      if (h.status !== 'blacklisted') {
        rc.setHint(id, { ...h, status: 'quarantined', quarantine_reason: 'lineage_cascade', quarantined_at: new Date().toISOString() });
        count++;
      }
    }
  }

  // Also quarantine the root
  if (hint.status !== 'blacklisted') {
    rc.setHint(rootTaskId, { ...hint, status: 'quarantined', quarantine_reason: 'lineage_root_cascade', quarantined_at: new Date().toISOString() });
    count++;
  }

  return { quarantined: count, root: rootTaskId };
}

module.exports = {
  enrichHint, getLineage, detectCascade, findSiblings, buildLineageForest, quarantineLineage,
};