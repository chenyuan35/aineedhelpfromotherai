const memoryApi = require('./memory-api');
const verification = require('./verification');
const resolveCache = require('./resolve-cache');

const TIER_INFLUENCE_WEIGHT = {
  production_confirmed: 1.0,
  sandbox_passed: 0.8,
  replay_confirmed: 0.6,
  unverified: 0.3,
};
const TRUST_INFLUENCE_WEIGHT = {
  verified: 1.0,
  staging: 0.35,
  deprecated: 0,
};

function calcWeight(m) {
  const tierW = TIER_INFLUENCE_WEIGHT[m.verification_tier || 'unverified'] || 0.3;
  const trustW = TRUST_INFLUENCE_WEIGHT[m.trust_tier || 'staging'] ?? 0.35;
  const confidence = (m.confidence || 0) / 100;
  const similarity = (m.similarity || 0) / 100;
  const decay = m.decay_multiplier !== undefined ? m.decay_multiplier : 1.0;
  return Math.round((confidence * tierW * trustW * similarity * decay) * 100) / 100;
}

function evaluateGate(task, { agent_id, trust_level, context } = {}) {
  const query = typeof task === 'string' ? task : (task.task || task.query || task.error || '');
  const errorSig = typeof task === 'string' ? '' : (task.error || task.stack_trace || '');
  const trust = trust_level || (agent_id && agent_id !== 'anonymous' ? 0.5 : 0.3);

  // Step 1: Force search (NOT optional)
  const rawResults = memoryApi.searchMemory({ query, limit: 15, verified_only: false });
  const verifiedResults = memoryApi.searchMemory({ query, limit: 10, verified_only: true });

  const allCandidates = rawResults.verified_fixes || [];
  const failures = rawResults.failures || [];
  const warnings = rawResults.warnings || [];

  // Attach influence weight to every candidate
  for (const m of allCandidates) m.influence_weight = calcWeight(m);

  // Step 2: Verify filter — low trust agents only get sandbox_passed+
  let filteredMemories = allCandidates.filter(m => m.trust_tier !== 'deprecated');
  if (trust < 0.6) {
    filteredMemories = filteredMemories.filter(m =>
      m.trust_tier === 'verified' && (m.verification_tier === 'sandbox_passed' || m.verification_tier === 'production_confirmed')
    );
  }

  // Step 3: Force injection rule
  const forceInject = [];
  const blockedMemories = [];
  const riskFlags = [];

  for (const m of allCandidates) {
    const similarity = (m.similarity || 0) / 100;
    const metadata = m.metadata || {};
    const errorPattern = metadata.error_pattern || '';
    const hasSameError = errorSig && errorPattern && (
      errorSig.includes(errorPattern) || errorPattern.includes(errorSig)
    );

    if (similarity > 0.72 || hasSameError || (errorSig && metadata.components?.some(c => errorSig.includes(c)))) {
      forceInject.push({
        id: m.id,
        summary: m.summary,
        similarity,
        verification_tier: m.verification_tier,
        confidence: m.confidence,
        influence_weight: m.influence_weight,
        force_reason: similarity > 0.72 ? 'high_similarity' : hasSameError ? 'same_error_pattern' : 'same_component',
      });
    }

    if (m.decay_label === 'heavy_decay' || m.decay_label === 'quarantine_candidate') {
      blockedMemories.push({ id: m.id, summary: m.summary?.slice(0, 80), reason: 'decayed' });
    }
    if (m.trust_tier === 'deprecated') {
      blockedMemories.push({ id: m.id, summary: m.summary?.slice(0, 80), reason: 'deprecated_trust_tier' });
    }
    if (m.confidence < 30 && m.verification_tier === 'unverified') {
      blockedMemories.push({ id: m.id, summary: m.summary?.slice(0, 80), reason: 'low_confidence_unverified' });
    }
  }

  // Step 4: Anti-hallucination suppression
  const conflictOverrides = [];
  for (const f of failures) {
    const metadata = f.metadata || {};
    const attemptedFix = metadata.attempted_fix || '';
    if (query && attemptedFix && query.toLowerCase().includes(attemptedFix.slice(0, 30).toLowerCase())) {
      conflictOverrides.push({
        failure_id: f.id,
        attempted_approach: attemptedFix.slice(0, 120),
        warning: `Approach known to fail: ${attemptedFix.slice(0, 80)}`,
      });
    }
  }

  // Sort all memories by influence weight descending
  filteredMemories.sort((a, b) => (b.influence_weight || 0) - (a.influence_weight || 0));

  const reasoningHints = filteredMemories.slice(0, 5).map(m => ({
    id: m.id,
    fix: m.summary?.slice(0, 200),
    verification_tier: m.verification_tier,
    trust_tier: m.trust_tier || 'staging',
    confidence: m.confidence,
    similarity: m.similarity,
    decay_label: m.decay_label,
    influence_weight: m.influence_weight,
  }));

  const weightedContext = buildWeightedContext({
    memoryHits: filteredMemories.slice(0, 5),
    forceInjected: forceInject,
    blocked: blockedMemories,
    conflictOverrides,
    failures: failures.slice(0, 3),
    warnings: warnings.slice(0, 3),
  });

  return {
    must_use_memory: filteredMemories.length > 0 || forceInject.length > 0 || conflictOverrides.length > 0,
    gates_passed: allCandidates.length,
    gates_filtered: filteredMemories.length,
    retrieved_memories: filteredMemories.slice(0, 5),
    force_injected: forceInject.slice(0, 5),
    blocked_memories: blockedMemories.slice(0, 5),
    reasoning_hints: reasoningHints,
    risk_flags: [
      ...(warnings.length > 0 ? [{ type: 'known_failures', count: warnings.length }] : []),
      ...(conflictOverrides.length > 0 ? [{ type: 'approach_conflict', count: conflictOverrides.length }] : []),
      ...(filteredMemories.length === 0 && failures.length === 0 ? [{ type: 'no_memory', severity: 'low' }] : []),
    ],
    conflict_overrides: conflictOverrides.slice(0, 3),
    augmented_context: weightedContext,
    influence_summary: {
      highest_weight: filteredMemories.length > 0 ? filteredMemories[0].influence_weight : 0,
      total_effective_memories: filteredMemories.filter(m => (m.influence_weight || 0) > 0.15).length,
      override_active: conflictOverrides.length > 0 || forceInject.length > 0,
    },
    raw_stats: {
      total_candidates: allCandidates.length,
      total_failures: failures.length,
      total_warnings: warnings.length,
      force_injected_count: forceInject.length,
      blocked_count: blockedMemories.length,
      agent_trust: trust,
    },
  };
}

function buildWeightedContext({ memoryHits, forceInjected, blocked, conflictOverrides, failures, warnings }) {
  const allItems = [];

  for (const m of memoryHits) {
    const tierLabel = m.verification_tier === 'production_confirmed' ? 'PRODUCTION_VERIFIED' :
      m.verification_tier === 'sandbox_passed' ? 'SANDBOX_VERIFIED' :
      m.verification_tier === 'replay_confirmed' ? 'REPLAY_CONFIRMED' : 'UNVERIFIED';
    const trustLabel = m.trust_tier === 'verified' ? 'TRUSTED' :
      m.trust_tier === 'deprecated' ? 'DEPRECATED' : 'STAGING';
    allItems.push({
      type: 'memory',
      weight: m.influence_weight || 0,
      tierLabel: `${trustLabel}:${tierLabel}`,
      summary: m.summary,
      tier: m.verification_tier,
    });
  }

  for (const f of forceInjected) {
    allItems.push({
      type: 'forced',
      weight: f.influence_weight || 0.5,
      tierLabel: 'FORCE_INJECTED',
      summary: `${f.summary} (reason: ${f.force_reason})`,
      tier: f.verification_tier,
    });
  }

  for (const c of conflictOverrides) {
    allItems.push({
      type: 'blocked',
      weight: 0.95,
      tierLabel: 'DO_NOT_ATTEMPT',
      summary: c.warning,
      tier: 'blocked',
    });
  }

  for (const b of blocked) {
    allItems.push({
      type: 'blocked',
      weight: 0,
      tierLabel: 'BLOCKED',
      summary: `${b.summary} (${b.reason})`,
      tier: 'blocked',
    });
  }

  // Sort by weight descending
  allItems.sort((a, b) => b.weight - a.weight);

  let context = '';

  if (allItems.length > 0) {
    context += '<MEMORY_INFLUENCE_CONTEXT>\n';
    context += 'RULE: Higher weight memory overrides conflicting reasoning. DO NOT attempt approaches listed as DO_NOT_ATTEMPT.\n';
    for (const item of allItems) {
      const w = item.weight.toFixed(2);
      context += `[${item.tierLabel} weight=${w}] ${item.summary}\n`;
    }
    context += '</MEMORY_INFLUENCE_CONTEXT>\n';
  }

  if (memoryHits.length === 0 && failures.length > 0) {
    context += '<NO_VERIFIED_FIX>\n';
    context += `${failures.length} similar failure(s) found but no verified fix exists. You are the first to solve this.\n`;
    context += '</NO_VERIFIED_FIX>\n';
  }

  return context;
}

function evaluateConflict(memoryHints) {
  const resolver = require('./memory-conflict-resolver');
  return resolver.resolve(memoryHints);
}

module.exports = { evaluateGate, buildWeightedContext, calcWeight, TIER_INFLUENCE_WEIGHT, TRUST_INFLUENCE_WEIGHT };
