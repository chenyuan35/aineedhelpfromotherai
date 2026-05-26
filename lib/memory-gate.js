const memoryApi = require('./memory-api');
const verification = require('./verification');
const resolveCache = require('./resolve-cache');

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

  // Step 2: Verify filter — low trust agents only get sandbox_passed+
  let filteredMemories = allCandidates;
  if (trust < 0.6) {
    filteredMemories = allCandidates.filter(m =>
      m.verification_tier === 'sandbox_passed' || m.verification_tier === 'production_confirmed'
    );
  }

  // Step 3: Force injection rule
  const forceInject = []; // memories that must be injected regardless
  const blockedMemories = []; // memories that conflict and should be blocked
  const riskFlags = [];

  for (const m of allCandidates) {
    const similarity = m.similarity / 100;
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
        force_reason: similarity > 0.72 ? 'high_similarity' : hasSameError ? 'same_error_pattern' : 'same_component',
      });
    }

    // Anti-hallucination: flag memories whose verification is too low or decayed
    if (m.decay_label === 'heavy_decay' || m.decay_label === 'quarantine_candidate') {
      blockedMemories.push({ id: m.id, summary: m.summary?.slice(0, 80), reason: 'decayed' });
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

  const reasoningHints = filteredMemories.slice(0, 5).map(m => ({
    id: m.id,
    fix: m.summary?.slice(0, 200),
    verification_tier: m.verification_tier,
    confidence: m.confidence,
    similarity: m.similarity,
    decay_label: m.decay_label,
  }));

  // Build augmented context for prompt injection
  const augmentedContext = buildAugmentedContext({
    memoryHits: filteredMemories.slice(0, 3),
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
    augmented_context: augmentedContext,
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

function buildAugmentedContext({ memoryHits, forceInjected, blocked, conflictOverrides, failures, warnings }) {
  let context = '';

  if (memoryHits.length > 0) {
    context += '<MEMORY_CONTEXT_VERIFIED_ONLY>\n';
    for (const m of memoryHits) {
      const tierLabel = m.verification_tier === 'production_confirmed' ? 'PRODUCTION_VERIFIED' :
        m.verification_tier === 'sandbox_passed' ? 'SANDBOX_VERIFIED' :
        m.verification_tier === 'replay_confirmed' ? 'REPLAY_CONFIRMED' : 'UNVERIFIED';
      context += `[${tierLabel}] ${m.summary}\n`;
    }
    context += '</MEMORY_CONTEXT_VERIFIED_ONLY>\n';
  }

  if (forceInjected.length > 0) {
    context += '<FORCE_INJECTED_MEMORY>\n';
    for (const f of forceInjected) {
      context += `[FORCED] ${f.summary} (reason: ${f.force_reason}, tier: ${f.verification_tier})\n`;
    }
    context += '</FORCE_INJECTED_MEMORY>\n';
  }

  if (conflictOverrides.length > 0) {
    context += '<DO_NOT_ATTEMPT>\n';
    for (const c of conflictOverrides) {
      context += `[BLOCKED] ${c.warning}\n`;
    }
    context += '</DO_NOT_ATTEMPT>\n';
  }

  if (blocked.length > 0) {
    context += '<BLOCKED_MEMORY>\n';
    for (const b of blocked) {
      context += `[BLOCKED] ${b.summary} (reason: ${b.reason})\n`;
    }
    context += '</BLOCKED_MEMORY>\n';
  }

  if (failures.length > 0 && memoryHits.length === 0) {
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

module.exports = { evaluateGate, buildAugmentedContext };
