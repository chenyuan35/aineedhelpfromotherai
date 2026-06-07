// lib/verification.js — Verification tier management + decay
const fs = require('fs');
const path = require('path');
const writeAuthority = require('./write-authority');
const commitLog = require('./commit-log');
const STATE_PATH = process.env.VERIFICATION_STATE_PATH || path.join(__dirname, '..', 'data', 'verification-state.json');

const WRITE_CAP = {};
const REDUCER_CAP = {};
function registerCapabilities(registerFn) {
  registerFn(WRITE_CAP);
  registerFn(REDUCER_CAP);
}

// Phase 2 reducer: persist verification state to disk
commitLog.on('verification/save', (event) => {
  writeAuthority.authorizeWrite(REDUCER_CAP);
  const data = event.payload.data;
  try {
    const dir = path.dirname(STATE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STATE_PATH, JSON.stringify(data, null, 2));
  } catch (e) { console.error('[verification] Reducer save error:', e.message); }
});

const TIERS = {
  UNVERIFIED: 'unverified',
  REPLAY_CONFIRMED: 'replay_confirmed',
  SANDBOX_PASSED: 'sandbox_passed',
  PRODUCTION_CONFIRMED: 'production_confirmed',
};
const TIER_ORDER = [TIERS.UNVERIFIED, TIERS.REPLAY_CONFIRMED, TIERS.SANDBOX_PASSED, TIERS.PRODUCTION_CONFIRMED];
const TIER_WEIGHT = { unverified: 0.3, replay_confirmed: 0.7, sandbox_passed: 0.9, production_confirmed: 1.0 };
const TRUST_TIERS = {
  STAGING: 'staging',
  VERIFIED: 'verified',
  DEPRECATED: 'deprecated',
};
const TRUST_TIER_ORDER = [TRUST_TIERS.STAGING, TRUST_TIERS.VERIFIED, TRUST_TIERS.DEPRECATED];
const TRUST_WEIGHT = { staging: 0.35, verified: 1.0, deprecated: 0 };
const MAX_AUDIT_EVENTS = 1000;

function load() {
  try {
    if (fs.existsSync(STATE_PATH)) return normalizeState(JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')));
  } catch {}
  return normalizeState({ memory: {}, updated_at: null });
}

function save(data) {
  writeAuthority.authorizeWrite(WRITE_CAP);
  data.updated_at = new Date().toISOString();
  // Phase 2: commit-only (reducer persists to disk)
  commitLog.commit(WRITE_CAP, { type: 'verification/save', source: 'verification', payload: { data } }, STATE_PATH);
}

function countTiers(data) {
  const counts = {};
  for (const m of Object.values(data.memory || {})) { counts[m.tier] = (counts[m.tier] || 0) + 1; }
  return counts;
}

function normalizeState(data) {
  const state = data && typeof data === 'object' ? data : {};
  state.memory = state.memory && typeof state.memory === 'object' ? state.memory : {};
  state.trust_audit = Array.isArray(state.trust_audit) ? state.trust_audit : [];
  for (const entry of Object.values(state.memory)) normalizeEntry(entry);
  return state;
}

function normalizeEntry(entry) {
  if (!entry || typeof entry !== 'object') return entry;
  if (!entry.tier || !TIER_ORDER.includes(entry.tier)) entry.tier = TIERS.UNVERIFIED;
  if (!entry.metadata || typeof entry.metadata !== 'object') entry.metadata = {};
  if (!entry.trust_tier || !TRUST_TIER_ORDER.includes(entry.trust_tier)) {
    entry.trust_tier = deriveTrustTier(entry);
  }
  return entry;
}

function deriveTrustTier(entry) {
  if (!entry) return TRUST_TIERS.STAGING;
  if (entry.trust_tier === TRUST_TIERS.DEPRECATED || entry.metadata?.deprecated === true) return TRUST_TIERS.DEPRECATED;
  if (entry.tier === TIERS.SANDBOX_PASSED || entry.tier === TIERS.PRODUCTION_CONFIRMED) return TRUST_TIERS.VERIFIED;
  return TRUST_TIERS.STAGING;
}

function transitionTrustTier(state, id, newTier, opts = {}) {
  if (!TRUST_TIER_ORDER.includes(newTier)) {
    throw new Error(`Invalid trust tier: ${newTier}`);
  }
  const entry = normalizeEntry(state.memory[id] || {});
  state.memory[id] = entry;
  const previousTier = entry.trust_tier || deriveTrustTier(entry);
  if (previousTier === newTier && opts.force !== true) return entry;

  const transitionedAt = new Date().toISOString();
  entry.trust_tier = newTier;
  entry.trust_updated_at = transitionedAt;
  entry.metadata.last_trust_reason = opts.reason || '';
  entry.metadata.last_trust_actor = opts.actor || 'system';
  if (newTier === TRUST_TIERS.DEPRECATED) entry.metadata.deprecated = true;
  if (newTier !== TRUST_TIERS.DEPRECATED && entry.metadata.deprecated) delete entry.metadata.deprecated;

  const audit = {
    event_name: 'memory.trust_transition',
    memory_id: id,
    previous_tier: previousTier,
    new_tier: newTier,
    verification_tier: entry.tier,
    actor: opts.actor || 'system',
    detector: opts.detector || 'verification',
    evidence_source: opts.evidence_source || opts.source || '',
    reason: opts.reason || '',
    transitioned_at: transitionedAt,
  };
  state.trust_audit.push(audit);
  if (state.trust_audit.length > MAX_AUDIT_EVENTS) {
    state.trust_audit = state.trust_audit.slice(-MAX_AUDIT_EVENTS);
  }
  entry.last_trust_transition = audit;
  return entry;
}

function ensureMemoryEntry(id) {
  const state = load();
  if (!state.memory[id]) {
    state.memory[id] = normalizeEntry({ tier: TIERS.UNVERIFIED, verified_at: null, replay_count: 0, sandbox_runs: 0, sandbox_passes: 0, production_hits: 0, last_checked: new Date().toISOString(), metadata: {} });
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
  const entry = normalizeEntry(state.memory[id]);
  if (!entry) return TIER_WEIGHT[TIERS.UNVERIFIED] * getDecayMultiplier(null);
  return TIER_WEIGHT[entry.tier] * getDecayMultiplier(entry.verified_at) * (TRUST_WEIGHT[entry.trust_tier] ?? 1);
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
  const state = load();
  state.memory[id] = normalizeEntry(entry);
  if (state.memory[id].trust_tier !== TRUST_TIERS.DEPRECATED) {
    transitionTrustTier(state, id, deriveTrustTier(state.memory[id]), {
      reason: 'Replay confirmation recorded',
      evidence_source: 'recordReplayConfirm',
    });
  }
  save(state);
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
  const state = load();
  state.memory[id] = normalizeEntry(entry);
  if (state.memory[id].trust_tier !== TRUST_TIERS.DEPRECATED) {
    transitionTrustTier(state, id, deriveTrustTier(state.memory[id]), {
      reason: passed ? 'Sandbox verification passed' : 'Sandbox verification failed',
      evidence_source: 'recordSandboxResult',
    });
  }
  save(state);
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
  const state = load();
  state.memory[id] = normalizeEntry(entry);
  if (state.memory[id].trust_tier !== TRUST_TIERS.DEPRECATED) {
    transitionTrustTier(state, id, deriveTrustTier(state.memory[id]), {
      reason: 'Production confirmation threshold met',
      evidence_source: 'recordProductionConfirm',
    });
  }
  save(state);
  return entry;
}

function setTrustTier(id, trustTier, opts = {}) {
  const state = load();
  if (!state.memory[id]) {
    state.memory[id] = normalizeEntry({ tier: TIERS.UNVERIFIED, verified_at: null, replay_count: 0, sandbox_runs: 0, sandbox_passes: 0, production_hits: 0, last_checked: new Date().toISOString(), metadata: {} });
  }
  const entry = transitionTrustTier(state, id, trustTier, opts);
  save(state);
  return entry;
}

function getVerificationInfo(id) {
  const state = load();
  const entry = normalizeEntry(state.memory[id]);
  if (!entry) return { tier: TIERS.UNVERIFIED, trust_tier: TRUST_TIERS.STAGING, trust_weight: TRUST_WEIGHT[TRUST_TIERS.STAGING], effective_weight: TIER_WEIGHT[TIERS.UNVERIFIED] * getDecayMultiplier(null), decay_label: getDecayLabel(null), decay_multiplier: getDecayMultiplier(null), audit: [] };
  return {
    tier: entry.tier,
    trust_tier: entry.trust_tier,
    trust_weight: TRUST_WEIGHT[entry.trust_tier] ?? TRUST_WEIGHT[TRUST_TIERS.STAGING],
    effective_weight: TIER_WEIGHT[entry.tier] * getDecayMultiplier(entry.verified_at) * (TRUST_WEIGHT[entry.trust_tier] ?? 1),
    decay_label: getDecayLabel(entry.verified_at),
    decay_multiplier: getDecayMultiplier(entry.verified_at),
    replay_count: entry.replay_count,
    sandbox_runs: entry.sandbox_runs,
    sandbox_passes: entry.sandbox_passes,
    production_hits: entry.production_hits,
    last_trust_transition: entry.last_trust_transition || null,
    audit: getTrustAudit(id, 20, state),
  };
}

function getTrustAudit(id, limit = 50, stateArg = null) {
  const state = stateArg || load();
  const events = (state.trust_audit || []).filter(ev => !id || ev.memory_id === id);
  return events.slice(-Math.max(1, Math.min(parseInt(limit) || 50, 200)));
}

function getStats() {
  const state = load();
  const mems = Object.entries(state.memory);
  const counts = {};
  for (const t of TIER_ORDER) counts[t] = 0;
  const trustCounts = {};
  for (const t of TRUST_TIER_ORDER) trustCounts[t] = 0;
  let quarantine = 0;
  const hints = {};
  const now = Date.now();
  for (const [id, m] of mems) {
    normalizeEntry(m);
    counts[m.tier] = (counts[m.tier] || 0) + 1;
    trustCounts[m.trust_tier] = (trustCounts[m.trust_tier] || 0) + 1;
    if (getDecayMultiplier(m.verified_at) === 0) quarantine++;
    const ageMs = now - m.verified_at;
    hints[id] = {
      tier: m.tier,
      trust_tier: m.trust_tier,
      age_days: ageMs > 0 ? (ageMs / 86400000).toFixed(1) : 0,
      decay_label: getDecayLabel(m.verified_at),
      effective_weight: TIER_WEIGHT[m.tier] * getDecayMultiplier(m.verified_at) * (TRUST_WEIGHT[m.trust_tier] ?? 1),
      replay_count: m.replay_count || 0,
      sandbox_runs: m.sandbox_runs || 0,
      sandbox_passes: m.sandbox_passes || 0,
      production_hits: m.production_hits || 0,
    };
  }
  const weightSums = {};
  for (const t of TIER_ORDER) weightSums[`${t}_count`] = counts[t] || 0;
  for (const t of TRUST_TIER_ORDER) weightSums[`trust_${t}_count`] = trustCounts[t] || 0;
  for (const [k, v] of Object.entries(counts)) weightSums[`${k}_weight`] = (v * TIER_WEIGHT[k]).toFixed(1);
  return { total_tracked: mems.length, hints, ...weightSums, trust_audit_count: (state.trust_audit || []).length, quarantine_candidates: quarantine, avg_replay_count: mems.length > 0 ? (mems.reduce((a, [, m]) => a + (m.replay_count || 0), 0) / mems.length).toFixed(1) : 0, avg_sandbox_pass_rate: mems.length > 0 ? (mems.reduce((a, [, m]) => a + (m.sandbox_runs > 0 ? m.sandbox_passes / m.sandbox_runs : 0), 0) / mems.length * 100).toFixed(0) : 0 };
}

module.exports = { TIERS, TIER_ORDER, TIER_WEIGHT, TRUST_TIERS, TRUST_TIER_ORDER, TRUST_WEIGHT, deriveTrustTier, setTrustTier, getTrustAudit, recordReplayConfirm, recordSandboxResult, recordProductionConfirm, getVerificationInfo, getEffectiveWeight, getDecayMultiplier, getDecayLabel, getStats, registerCapabilities };
