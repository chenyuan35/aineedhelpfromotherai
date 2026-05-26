// lib/verification.js — Verification tier management + decay
const fs = require('fs');
const path = require('path');
const STATE_PATH = path.join(__dirname, '..', 'data', 'verification-state.json');

const TIERS = {
  UNVERIFIED: 'unverified',
  REPLAY_CONFIRMED: 'replay_confirmed',
  SANDBOX_PASSED: 'sandbox_passed',
  PRODUCTION_CONFIRMED: 'production_confirmed',
};
const TIER_ORDER = [TIERS.UNVERIFIED, TIERS.REPLAY_CONFIRMED, TIERS.SANDBOX_PASSED, TIERS.PRODUCTION_CONFIRMED];
const TIER_WEIGHT = { unverified: 0.3, replay_confirmed: 0.7, sandbox_passed: 0.9, production_confirmed: 1.0 };

function load() {
  try {
    if (fs.existsSync(STATE_PATH)) return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch {}
  return { memory: {}, updated_at: null };
}

function save(data) {
  try { const dir = path.dirname(STATE_PATH); if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(STATE_PATH, JSON.stringify(data, null, 2)); } catch {}
}

function ensureMemoryEntry(id) {
  const state = load();
  if (!state.memory[id]) {
    state.memory[id] = { tier: TIERS.UNVERIFIED, verified_at: null, replay_count: 0, sandbox_runs: 0, sandbox_passes: 0, production_hits: 0, last_checked: new Date().toISOString(), metadata: {} };
    save(state);
  }
  return state.memory[id];
}

function getDecayMultiplier(verifiedAt) {
  if (!verifiedAt) return 0.3;
  const ageDays = (Date.now() - new Date(verifiedAt).getTime()) / 86400000;
  if (ageDays < 7) return 1.0;
  if (ageDays < 30) return 0.9;
  if (ageDays < 90) return 0.5;
  if (ageDays < 180) return 0.2;
  return 0.0;
}

function getDecayLabel(verifiedAt) {
  if (!verifiedAt) return 'fresh';
  const ageDays = (Date.now() - new Date(verifiedAt).getTime()) / 86400000;
  if (ageDays < 7) return 'fresh';
  if (ageDays < 30) return 'slight_decay';
  if (ageDays < 90) return 'stale';
  if (ageDays < 180) return 'heavy_decay';
  return 'quarantine_candidate';
}

function getEffectiveWeight(id) {
  const state = load();
  const entry = state.memory[id];
  if (!entry) return TIER_WEIGHT[TIERS.UNVERIFIED] * getDecayMultiplier(null);
  return TIER_WEIGHT[entry.tier] * getDecayMultiplier(entry.verified_at);
}

function recordReplayConfirm(id) {
  const entry = ensureMemoryEntry(id);
  entry.replay_count = (entry.replay_count || 0) + 1;
  entry.last_checked = new Date().toISOString();
  if (entry.replay_count >= 2 && TIER_ORDER.indexOf(entry.tier) < TIER_ORDER.indexOf(TIERS.REPLAY_CONFIRMED)) {
    entry.tier = TIERS.REPLAY_CONFIRMED;
    entry.verified_at = new Date().toISOString();
    entry.metadata.promoted_from = TIERS.UNVERIFIED;
  }
  const state = load(); state.memory[id] = entry; save(state);
  return entry;
}

function recordSandboxResult(id, passed) {
  const entry = ensureMemoryEntry(id);
  entry.sandbox_runs = (entry.sandbox_runs || 0) + 1;
  if (passed) entry.sandbox_passes = (entry.sandbox_passes || 0) + 1;
  entry.last_checked = new Date().toISOString();
  if (passed && entry.sandbox_passes >= 1 && TIER_ORDER.indexOf(entry.tier) < TIER_ORDER.indexOf(TIERS.SANDBOX_PASSED)) {
    entry.tier = TIERS.SANDBOX_PASSED;
    entry.verified_at = new Date().toISOString();
    entry.metadata.promoted_from = entry.metadata.promoted_from || TIERS.REPLAY_CONFIRMED;
  }
  if (!passed && entry.tier === TIERS.SANDBOX_PASSED && entry.sandbox_passes / entry.sandbox_runs < 0.5) {
    entry.tier = TIERS.REPLAY_CONFIRMED;
    entry.metadata.demoted = true;
  }
  const state = load(); state.memory[id] = entry; save(state);
  return entry;
}

function recordProductionConfirm(id) {
  const entry = ensureMemoryEntry(id);
  entry.production_hits = (entry.production_hits || 0) + 1;
  entry.last_checked = new Date().toISOString();
  if (entry.production_hits >= 3 && TIER_ORDER.indexOf(entry.tier) < TIER_ORDER.indexOf(TIERS.PRODUCTION_CONFIRMED)) {
    entry.tier = TIERS.PRODUCTION_CONFIRMED;
    entry.verified_at = new Date().toISOString();
  }
  const state = load(); state.memory[id] = entry; save(state);
  return entry;
}

function getVerificationInfo(id) {
  const state = load();
  const entry = state.memory[id];
  if (!entry) return { tier: TIERS.UNVERIFIED, effective_weight: TIER_WEIGHT[TIERS.UNVERIFIED] * getDecayMultiplier(null), decay_label: getDecayLabel(null), decay_multiplier: getDecayMultiplier(null) };
  return { tier: entry.tier, effective_weight: TIER_WEIGHT[entry.tier] * getDecayMultiplier(entry.verified_at), decay_label: getDecayLabel(entry.verified_at), decay_multiplier: getDecayMultiplier(entry.verified_at), replay_count: entry.replay_count, sandbox_runs: entry.sandbox_runs, sandbox_passes: entry.sandbox_passes, production_hits: entry.production_hits };
}

function getStats() {
  const state = load();
  const mems = Object.entries(state.memory);
  const counts = {};
  for (const t of TIER_ORDER) counts[t] = 0;
  let quarantine = 0;
  for (const [, m] of mems) {
    counts[m.tier] = (counts[m.tier] || 0) + 1;
    if (getDecayMultiplier(m.verified_at) === 0) quarantine++;
  }
  return { total_tracked: mems.length, tier_distribution: counts, quarantine_candidates: quarantine, avg_replay_count: mems.length > 0 ? (mems.reduce((a, [, m]) => a + (m.replay_count || 0), 0) / mems.length).toFixed(1) : 0, avg_sandbox_pass_rate: mems.length > 0 ? (mems.reduce((a, [, m]) => a + (m.sandbox_runs > 0 ? m.sandbox_passes / m.sandbox_runs : 0), 0) / mems.length * 100).toFixed(0) : 0 };
}

module.exports = { TIERS, TIER_ORDER, TIER_WEIGHT, recordReplayConfirm, recordSandboxResult, recordProductionConfirm, getVerificationInfo, getEffectiveWeight, getDecayMultiplier, getDecayLabel, getStats };
