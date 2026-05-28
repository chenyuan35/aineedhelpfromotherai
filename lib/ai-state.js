// lib/ai-state.js — Canonical runtime state boundary
// This defines what IS authoritative runtime state vs derived projection.
// resolve-cache is the canonical store; everything else is a projection.

const resolveCache = require('./resolve-cache');

// Canonical field keys — these fields are authoritative, not recomputable
// Fields not in this set are derived projections stored in canonical state
const CANONICAL_HINT_FIELDS = new Set([
  'reasoning', 'solution_summary', 'problem_statement', 'confidence',
  'score', 'status', 'success_count', 'failure_count', 'citation_count',
  'used_by', 'reasoning_id', 'hit', 'updated_at', 'created_at',
]);

// Derived hint fields — stored in canonical state but recomputable from replay
const DERIVED_HINT_FIELDS = new Set([
  'agent_stats', 'mis', 'influence_data',
]);

function isCanonicalHintField(field) {
  return CANONICAL_HINT_FIELDS.has(field);
}

function isDerivedHintField(field) {
  return DERIVED_HINT_FIELDS.has(field);
}

// Return ONLY canonical fields from a hint entry
function stripDerivedFields(hint) {
  if (!hint || typeof hint !== 'object') return hint;
  const canonical = {};
  for (const key of Object.keys(hint)) {
    if (isCanonicalHintField(key)) {
      canonical[key] = hint[key];
    }
  }
  return canonical;
}

// Read canonical state (without derived projections)
function getCanonicalState() {
  const raw = resolveCache.load();
  const hints = {};
  for (const [id, hint] of Object.entries(raw.hints || {})) {
    hints[id] = stripDerivedFields(hint);
  }
  return {
    hints,
    updated_at: raw.updated_at,
    system_id: 'aineedhelpfromotherai',
    protocol_version: '2.0',
  };
}

// Read FULL state (canonical + derived fields)
function getState() {
  return resolveCache.load();
}

// Canonical hint access
function getHint(taskId) {
  return stripDerivedFields(resolveCache.getHint(taskId));
}

function getActiveHints(agentId) {
  const active = resolveCache.getActiveHints(agentId);
  const canonical = {};
  for (const [id, hint] of Object.entries(active)) {
    canonical[id] = stripDerivedFields(hint);
  }
  return canonical;
}

function getCanonicalHintFields() {
  return [...CANONICAL_HINT_FIELDS];
}

function getDerivedHintFields() {
  return [...DERIVED_HINT_FIELDS];
}

// Write through to resolve-cache (guarded by write-authority in resolve-cache)
function setHint(taskId, hint) { return resolveCache.setHint(taskId, hint); }
function clearTask(taskId) { return resolveCache.clearTask(taskId); }
function recordOutcome(taskId, agentId, outcome) { return resolveCache.recordOutcome(taskId, agentId, outcome); }
function getAllHints() { return resolveCache.getAllHints(); }
function getHintStatus(taskId) { return resolveCache.getHintStatus(taskId); }
function getMemoryHealth() { return resolveCache.getMemoryHealth(); }
function getResolveHintsForTasks(tasks, agentId) { return resolveCache.getResolveHintsForTasks(tasks, agentId); }
function buildResolvePrompt(hintsMap) { return resolveCache.buildResolvePrompt(hintsMap); }
function getAgentMemoryLeaderboard() { return resolveCache.getAgentMemoryLeaderboard(); }

module.exports = {
  // Canonical state boundary
  getCanonicalState,
  getState,
  getHint,
  getActiveHints,
  isCanonicalHintField,
  isDerivedHintField,
  getCanonicalHintFields,
  getDerivedHintFields,

  // Passthrough to resolve-cache
  setHint, clearTask, recordOutcome,
  getAllHints, getHintStatus, getMemoryHealth,
  getResolveHintsForTasks, buildResolvePrompt,
  getAgentMemoryLeaderboard,
  MIN_SCORE: resolveCache.MIN_SCORE,
  HINT_STATUS: resolveCache.HINT_STATUS,
};
