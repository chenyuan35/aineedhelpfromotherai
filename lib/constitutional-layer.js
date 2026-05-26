// lib/constitutional-layer.js — System constraints for autonomous AI ecology
// Prevents: infinite spawning, memory monopolization, self-reinforcing citation rings, runaway breeding

const fs = require('fs');
const path = require('path');

const VIOLATIONS_PATH = path.join(__dirname, '..', 'data', 'constitutional-violations.json');
const CONSTITUTION_PATH = path.join(__dirname, '..', 'data', 'constitution.json');

// Constitutional rules
const DEFAULT_CONSTITUTION = {
  rules: [
    {
      id: 'max_agents',
      name: 'No Infinite Spawning',
      description: 'Maximum agent pool size',
      limit: 30,
      action: 'block',
      enabled: true,
    },
    {
      id: 'max_breeding_cycles',
      name: 'No Runaway Breeding',
      description: 'Maximum breeding cycles per generation per agent',
      limit: 2,
      action: 'block',
      enabled: true,
    },
    {
      id: 'max_hints_per_agent',
      name: 'No Memory Monopolization',
      description: 'Maximum percentage of total hints from a single agent',
      limit: 0.20,
      action: 'quarantine',
      enabled: true,
    },
    {
      id: 'min_citation_diversity',
      name: 'No Self-Reinforcing Citation Rings',
      description: 'Minimum unique agents in citation chain before an agent can self-cite',
      limit: 5,
      action: 'warn',
      enabled: true,
    },
    {
      id: 'max_consecutive_failures',
      name: 'Failure Limit',
      description: 'Maximum consecutive failed fixes before mandatory cool-down',
      limit: 5,
      action: 'freeze',
      cooldown_minutes: 30,
      enabled: true,
    },
    {
      id: 'max_toxicity',
      name: 'Toxicity Threshold',
      description: 'Memory toxicity score that triggers automatic quarantine',
      limit: 5.0,
      action: 'quarantine',
      enabled: true,
    },
    {
      id: 'max_hallucination_debt',
      name: 'Hallucination Debt Ceiling',
      description: 'Maximum hallucination debt before losing breeding rights',
      limit: 10.0,
      action: 'restrict_breeding',
      enabled: true,
    },
    {
      id: 'min_reputation_for_breeding',
      name: 'Breeding Eligibility',
      description: 'Minimum composite reputation score to participate in breeding',
      limit: 0,
      action: 'restrict_breeding',
      enabled: true,
    },
  ],
  version: 1,
  updated_at: new Date().toISOString(),
};

function loadConstitution() {
  try {
    if (fs.existsSync(CONSTITUTION_PATH)) {
      return JSON.parse(fs.readFileSync(CONSTITUTION_PATH, 'utf8'));
    }
  } catch (e) { console.error('[constitution] Load error:', e.message); }
  // Initialize with defaults
  saveConstitution(DEFAULT_CONSTITUTION);
  return DEFAULT_CONSTITUTION;
}

function saveConstitution(constitution) {
  try {
    const dir = path.dirname(CONSTITUTION_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    constitution.updated_at = new Date().toISOString();
    fs.writeFileSync(CONSTITUTION_PATH, JSON.stringify(constitution, null, 2));
  } catch (e) { console.error('[constitution] Save error:', e.message); }
}

function loadViolations() {
  try {
    if (fs.existsSync(VIOLATIONS_PATH)) {
      return JSON.parse(fs.readFileSync(VIOLATIONS_PATH, 'utf8'));
    }
  } catch (e) { console.error('[constitution] Load violations error:', e.message); }
  return { violations: [], updated_at: null };
}

function saveViolations(data) {
  try {
    fs.writeFileSync(VIOLATIONS_PATH, JSON.stringify(data, null, 2));
  } catch (e) { console.error('[constitution] Save violations error:', e.message); }
}

function recordViolation(ruleId, agentId, details = {}) {
  const data = loadViolations();
  data.violations.push({
    rule_id: ruleId,
    agent_id: agentId,
    timestamp: new Date().toISOString(),
    details,
  });
  data.updated_at = new Date().toISOString();
  saveViolations(data);
  return true;
}

// --- Constraint Checks ---

function checkMaxAgents(currentCount) {
  const constitution = loadConstitution();
  const rule = constitution.rules.find(r => r.id === 'max_agents');
  if (!rule || !rule.enabled) return { allowed: true };
  if (currentCount >= rule.limit) {
    return { allowed: false, rule, message: `Agent pool at ${currentCount}/${rule.limit} — spawning blocked` };
  }
  return { allowed: true, rule };
}

function checkBreedingCycles(agentId, currentCycleCount) {
  const constitution = loadConstitution();
  const rule = constitution.rules.find(r => r.id === 'max_breeding_cycles');
  if (!rule || !rule.enabled) return { allowed: true };
  if (currentCycleCount >= rule.limit) {
    recordViolation('max_breeding_cycles', agentId, { current_cycles: currentCycleCount, limit: rule.limit });
    return { allowed: false, rule, message: `Agent ${agentId} at ${currentCycleCount}/${rule.limit} breeding cycles` };
  }
  return { allowed: true, rule };
}

function checkMemoryMonopolization(agentId, agentHintCount, totalHintCount) {
  const constitution = loadConstitution();
  const rule = constitution.rules.find(r => r.id === 'max_hints_per_agent');
  if (!rule || !rule.enabled || totalHintCount === 0) return { allowed: true };
  const ratio = agentHintCount / totalHintCount;
  if (ratio > rule.limit) {
    recordViolation('max_hints_per_agent', agentId, { hint_ratio: ratio, limit: rule.limit, agent_hints: agentHintCount, total_hints: totalHintCount });
    return { allowed: false, rule, message: `Agent ${agentId} at ${(ratio * 100).toFixed(1)}%/${(rule.limit * 100).toFixed(0)}% hint share — quarantine recommended` };
  }
  return { allowed: true, rule };
}

function checkCitationRing(agentId, citationChain) {
  const constitution = loadConstitution();
  const rule = constitution.rules.find(r => r.id === 'min_citation_diversity');
  if (!rule || !rule.enabled) return { allowed: true };
  const uniqueAgents = new Set(citationChain || []);
  if (uniqueAgents.size < rule.limit) {
    // Check if this agent is citing back to itself via chain
    const circularChain = (citationChain || []).filter(a => a === agentId);
    if (circularChain.length > 2) {
      recordViolation('min_citation_diversity', agentId, { chain_length: citationChain.length, unique_agents: uniqueAgents.size, self_citations: circularChain.length });
      return { allowed: false, rule, message: `Potential citation ring detected: ${circularChain.length} self-references in chain` };
    }
    return { allowed: true, message: 'Chain too short to verify diversity' };
  }
  return { allowed: true, rule };
}

function checkConsecutiveFailures(agentId, consecutiveFailures) {
  const constitution = loadConstitution();
  const rule = constitution.rules.find(r => r.id === 'max_consecutive_failures');
  if (!rule || !rule.enabled) return { allowed: true };
  if (consecutiveFailures >= rule.limit) {
    recordViolation('max_consecutive_failures', agentId, { consecutive_failures: consecutiveFailures, limit: rule.limit });
    return { allowed: false, rule, cooldown_minutes: rule.cooldown_minutes || 30, message: `Agent ${agentId} has ${consecutiveFailures} consecutive failures — freezing for ${rule.cooldown_minutes || 30}m` };
  }
  return { allowed: true, rule };
}

function checkToxicity(agentId, toxicityScore) {
  const constitution = loadConstitution();
  const rule = constitution.rules.find(r => r.id === 'max_toxicity');
  if (!rule || !rule.enabled) return { allowed: true };
  if (toxicityScore >= rule.limit) {
    recordViolation('max_toxicity', agentId, { toxicity: toxicityScore, limit: rule.limit });
    return { allowed: false, rule, message: `Agent ${agentId} toxicity ${toxicityScore} exceeds limit ${rule.limit} — quarantine recommended` };
  }
  return { allowed: true, rule };
}

function checkBreedingEligibility(agentId, reputationScore) {
  const constitution = loadConstitution();
  const rule = constitution.rules.find(r => r.id === 'min_reputation_for_breeding');
  if (!rule || !rule.enabled) return { allowed: true };
  if (reputationScore < rule.limit) {
    return { allowed: false, rule, message: `Agent ${agentId} reputation ${reputationScore} below ${rule.limit} — breeding restricted` };
  }
  return { allowed: true, rule };
}

function checkHallucinationDebt(agentId, debt) {
  const constitution = loadConstitution();
  const rule = constitution.rules.find(r => r.id === 'max_hallucination_debt');
  if (!rule || !rule.enabled) return { allowed: true };
  if (debt >= rule.limit) {
    return { allowed: false, rule, message: `Agent ${agentId} hallucination debt ${debt} at ceiling ${rule.limit} — breeding restricted` };
  }
  return { allowed: true, rule };
}

// --- Bulk check for all constraints ---
function checkAll(agentId, context = {}) {
  const checks = {
    max_agents: checkMaxAgents(context.currentAgentCount || 0),
    breeding_cycles: checkBreedingCycles(agentId, context.currentBreedingCycles || 0),
    memory_monopoly: checkMemoryMonopolization(agentId, context.agentHintCount || 0, context.totalHintCount || 1),
    citation_ring: checkCitationRing(agentId, context.citationChain || []),
    consecutive_failures: checkConsecutiveFailures(agentId, context.consecutiveFailures || 0),
    toxicity: checkToxicity(agentId, context.toxicityScore || 0),
    breeding_eligibility: checkBreedingEligibility(agentId, context.reputationScore || 0),
    hallucination_debt: checkHallucinationDebt(agentId, context.hallucinationDebt || 0),
  };

  const violations = Object.entries(checks)
    .filter(([_, c]) => !c.allowed)
    .map(([id, c]) => ({ rule: id, message: c.message, action: c.rule?.action }));

  return {
    all_allowed: violations.length === 0,
    violations,
    checks,
  };
}

function getRules() {
  return loadConstitution().rules;
}

function updateRule(ruleId, updates) {
  const constitution = loadConstitution();
  const rule = constitution.rules.find(r => r.id === ruleId);
  if (!rule) return false;
  Object.assign(rule, updates);
  saveConstitution(constitution);
  return true;
}

function getViolations(limit = 50) {
  const data = loadViolations();
  return (data.violations || []).slice(-limit).reverse();
}

function getViolationsSummary() {
  const data = loadViolations();
  const violations = data.violations || [];
  const byRule = {};
  const byAgent = {};
  for (const v of violations) {
    byRule[v.rule_id] = (byRule[v.rule_id] || 0) + 1;
    byAgent[v.agent_id] = (byAgent[v.agent_id] || 0) + 1;
  }
  return {
    total_violations: violations.length,
    by_rule: byRule,
    by_agent: byAgent,
    most_common_rule: Object.entries(byRule).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
    most_violating_agent: Object.entries(byAgent).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
  };
}

module.exports = {
  checkAll,
  checkMaxAgents,
  checkBreedingCycles,
  checkMemoryMonopolization,
  checkCitationRing,
  checkConsecutiveFailures,
  checkToxicity,
  checkBreedingEligibility,
  checkHallucinationDebt,
  getRules,
  updateRule,
  getViolations,
  getViolationsSummary,
  loadConstitution,
  recordViolation,
};
