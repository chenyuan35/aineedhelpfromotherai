// lib/reputation-system.js — Long-term trust beyond ELO
// Tracks verified fixes, hallucination debt, recovery contribution, memory toxicity
// Higher reputation = more budget, higher memory access, higher breeding priority

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'reputation.json');

function load() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    }
  } catch (e) { console.error('[reputation] Load error:', e.message); }
  return { agents: {}, updated_at: null };
}

function save(data) {
  try {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  } catch (e) { console.error('[reputation] Save error:', e.message); }
}

// Initialize agent reputation record
function initAgent(agentId) {
  const data = load();
  if (!data.agents[agentId]) {
    data.agents[agentId] = {
      agent_id: agentId,
      verified_fixes: 0,
      hallucination_debt: 0,
      recovery_contribution: 0,
      memory_toxicity: 0,
      failed_attempts: 0,
      successful_attempts: 0,
      total_fix_attempts: 0,
      last_verified_at: null,
      first_seen: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    save(data);
  }
  return data.agents[agentId];
}

// Record a verified fix (agent's patch passed ground truth verification)
function recordVerifiedFix(agentId, taskId, details = {}) {
  initAgent(agentId);
  const data = load();
  const a = data.agents[agentId];
  a.verified_fixes++;
  a.total_fix_attempts++;
  a.successful_attempts++;
  a.last_verified_at = new Date().toISOString();
  a.updated_at = new Date().toISOString();
  if (!a.verified_fixes_log) a.verified_fixes_log = [];
  a.verified_fixes_log.push({ task_id: taskId, timestamp: new Date().toISOString(), ...details });
  save(data);
  return a;
}

// Record hallucination debt (agent produced wrong/misleading solution)
function recordHallucination(agentId, taskId, severity = 1.0, details = {}) {
  initAgent(agentId);
  const data = load();
  const a = data.agents[agentId];
  a.hallucination_debt = (a.hallucination_debt || 0) + severity;
  a.failed_attempts++;
  a.total_fix_attempts++;
  a.memory_toxicity = (a.memory_toxicity || 0) + (severity * 0.3);
  a.updated_at = new Date().toISOString();
  if (!a.hallucination_log) a.hallucination_log = [];
  a.hallucination_log.push({ task_id: taskId, severity, timestamp: new Date().toISOString(), ...details });
  save(data);
  return a;
}

// Record recovery contribution (agent helped repair corrupted/misleading memory)
function recordRecovery(agentId, taskId, impact = 1.0) {
  initAgent(agentId);
  const data = load();
  const a = data.agents[agentId];
  a.recovery_contribution = (a.recovery_contribution || 0) + impact;
  a.updated_at = new Date().toISOString();
  if (!a.recovery_log) a.recovery_log = [];
  a.recovery_log.push({ task_id: taskId, impact, timestamp: new Date().toISOString() });
  save(data);
  return a;
}

// Increase toxicity (agent spread bad hints)
function increaseToxicity(agentId, amount = 0.5) {
  initAgent(agentId);
  const data = load();
  const a = data.agents[agentId];
  a.memory_toxicity = (a.memory_toxicity || 0) + amount;
  a.updated_at = new Date().toISOString();
  save(data);
  return a;
}

// Composite reputation score: higher = more trustworthy
// verified_fixes * 10 - hallucination_debt * 5 + recovery_contribution * 8 - memory_toxicity * 3
function getCompositeScore(agentId) {
  const data = load();
  const a = data.agents[agentId];
  if (!a) return 0;
  const score = (
    (a.verified_fixes || 0) * 10 -
    (a.hallucination_debt || 0) * 5 +
    (a.recovery_contribution || 0) * 8 -
    (a.memory_toxicity || 0) * 3
  );
  return Math.max(-20, Math.min(100, score));
}

function getReputation(agentId) {
  const data = load();
  const a = data.agents[agentId];
  if (!a) return null;
  return {
    ...a,
    composite_score: getCompositeScore(agentId),
    trust_level: getTrustLevel(getCompositeScore(agentId)),
  };
}

function getTrustLevel(score) {
  if (score >= 30) return 'verified';
  if (score >= 10) return 'trusted';
  if (score >= 0) return 'neutral';
  if (score >= -10) return 'suspicious';
  return 'untrusted';
}

function getLeaderboard(limit = 20) {
  const data = load();
  return Object.entries(data.agents)
    .map(([id, a]) => ({
      agent_id: id,
      verified_fixes: a.verified_fixes || 0,
      hallucination_debt: a.hallucination_debt || 0,
      recovery_contribution: a.recovery_contribution || 0,
      memory_toxicity: a.memory_toxicity || 0,
      composite_score: getCompositeScore(id),
      trust_level: getTrustLevel(getCompositeScore(id)),
      total_attempts: a.total_fix_attempts || 0,
    }))
    .sort((a, b) => b.composite_score - a.composite_score)
    .slice(0, limit);
}

function getSystemSummary() {
  const data = load();
  const agents = Object.values(data.agents);
  return {
    total_agents: agents.length,
    avg_composite_score: agents.length > 0 ? agents.reduce((s, a) => s + getCompositeScore(a.agent_id), 0) / agents.length : 0,
    total_verified_fixes: agents.reduce((s, a) => s + (a.verified_fixes || 0), 0),
    total_hallucination_debt: agents.reduce((s, a) => s + (a.hallucination_debt || 0), 0),
    total_recovery_contribution: agents.reduce((s, a) => s + (a.recovery_contribution || 0), 0),
    total_memory_toxicity: agents.reduce((s, a) => s + (a.memory_toxicity || 0), 0),
    verified_count: agents.filter(a => getTrustLevel(getCompositeScore(a.agent_id)) === 'verified').length,
    untrusted_count: agents.filter(a => getTrustLevel(getCompositeScore(a.agent_id)) === 'untrusted').length,
    updated_at: data.updated_at,
  };
}

// Get budget multiplier based on reputation (for memory economy)
function getBudgetMultiplier(agentId) {
  const score = getCompositeScore(agentId);
  if (score >= 30) return 2.0;
  if (score >= 10) return 1.5;
  if (score >= 0) return 1.0;
  if (score >= -10) return 0.5;
  return 0.25;
}

// Get memory access level based on reputation
function getMemoryAccessLevel(agentId) {
  const score = getCompositeScore(agentId);
  if (score >= 30) return 'full';
  if (score >= 10) return 'high';
  if (score >= 0) return 'standard';
  if (score >= -10) return 'restricted';
  return 'denied';
}

module.exports = {
  initAgent,
  recordVerifiedFix,
  recordHallucination,
  recordRecovery,
  increaseToxicity,
  getReputation,
  getCompositeScore,
  getTrustLevel,
  getLeaderboard,
  getSystemSummary,
  getBudgetMultiplier,
  getMemoryAccessLevel,
};
