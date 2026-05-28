// lib/human-intervention.js — Kill switch, quarantine, rollback, audit
// Human oversight layer for autonomous AI ecology

const fs = require('fs');
const path = require('path');

const FREEZE_PATH = path.join(__dirname, '..', 'data', 'freeze-state.json');
const AUDIT_PATH = path.join(__dirname, '..', 'data', 'audit-log.json');
const BACKUP_DIR = path.join(__dirname, '..', 'data', 'backups');

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function loadFreezeState() {
  try {
    if (fs.existsSync(FREEZE_PATH)) {
      return JSON.parse(fs.readFileSync(FREEZE_PATH, 'utf8'));
    }
  } catch (e) { console.error('[intervention] Load freeze error:', e.message); }
  return { system_frozen: false, frozen_agents: [], updated_at: null };
}

function saveFreezeState(state) {
  try {
    const dir = path.dirname(FREEZE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(FREEZE_PATH, JSON.stringify(state, null, 2));
  } catch (e) { console.error('[intervention] Save freeze error:', e.message); }
}

function loadAuditLog() {
  try {
    if (fs.existsSync(AUDIT_PATH)) {
      return JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf8'));
    }
  } catch (e) { console.error('[intervention] Load audit error:', e.message); }
  return { entries: [], updated_at: null };
}

function saveAuditLog(data) {
  try {
    fs.writeFileSync(AUDIT_PATH, JSON.stringify(data, null, 2));
  } catch (e) { console.error('[intervention] Save audit error:', e.message); }
}

function logAudit(action, actor, details = {}) {
  const data = loadAuditLog();
  data.entries.push({
    action,
    actor: actor || 'system',
    timestamp: new Date().toISOString(),
    details,
  });
  data.updated_at = new Date().toISOString();
  saveAuditLog(data);
}

// --- Freeze / Thaw System ---
function freezeSystem(reason, actor = 'human') {
  const state = loadFreezeState();
  state.system_frozen = true;
  state.frozen_at = new Date().toISOString();
  state.reason = reason;
  state.updated_at = new Date().toISOString();
  saveFreezeState(state);
  logAudit('system_freeze', actor, { reason });
  return state;
}

function thawSystem(actor = 'human') {
  const state = loadFreezeState();
  state.system_frozen = false;
  state.frozen_at = null;
  state.reason = null;
  state.updated_at = new Date().toISOString();
  saveFreezeState(state);
  logAudit('system_thaw', actor, {});
  return state;
}

function isSystemFrozen() {
  const state = loadFreezeState();
  return state.system_frozen === true;
}

// --- Freeze / Thaw Agent ---
function freezeAgent(agentId, reason, actor = 'human') {
  const state = loadFreezeState();
  if (!state.frozen_agents) state.frozen_agents = [];
  if (!state.frozen_agents.find(a => a.agent_id === agentId)) {
    state.frozen_agents.push({
      agent_id: agentId,
      reason: reason || 'Manual freeze',
      frozen_at: new Date().toISOString(),
      frozen_by: actor,
    });
    state.updated_at = new Date().toISOString();
    saveFreezeState(state);
  }
  logAudit('agent_freeze', actor, { agent_id: agentId, reason });
  return state;
}

function thawAgent(agentId, actor = 'human') {
  const state = loadFreezeState();
  if (!state.frozen_agents) state.frozen_agents = [];
  state.frozen_agents = state.frozen_agents.filter(a => a.agent_id !== agentId);
  state.updated_at = new Date().toISOString();
  saveFreezeState(state);
  logAudit('agent_thaw', actor, { agent_id: agentId });
  return state;
}

function isAgentFrozen(agentId) {
  const state = loadFreezeState();
  if (state.system_frozen) return true;
  return (state.frozen_agents || []).some(a => a.agent_id === agentId);
}

// --- Quarantine Agent ---
function quarantineAgent(agentId, reason, actor = 'human') {
  logAudit('agent_quarantine', actor, { agent_id: agentId, reason });
  // This triggers the resolve-cache quarantine for all hints from this agent
  return { quarantined: true, agent_id: agentId, reason };
}

// --- Rollback Memory ---
function rollbackMemory(taskId, actor = 'human') {
  ensureBackupDir();
  const resolveCachePath = path.join(__dirname, '..', 'data', 'resolve-cache.json');
  const backupPath = path.join(BACKUP_DIR, `resolve-cache-${Date.now()}.json`);

  // Create backup first
  if (fs.existsSync(resolveCachePath)) {
    fs.copyFileSync(resolveCachePath, backupPath);
  }

  // Read-only: report what would be rolled back without mutating runtime
  try {
    const rc = require('./read-only-cache');
    const hint = rc.getHint(taskId);
    if (hint) {
      logAudit('memory_rollback_attempt', actor, { task_id: taskId, backup_path: backupPath, mode: 'read-only' });
      return { rolled_back: false, task_id: taskId, backup: backupPath, mode: 'read-only', note: 'Runtime rollback blocked. Experimental systems cannot mutate runtime state. Use human-intervention API directly.' };
    }
    return { rolled_back: false, task_id: taskId, reason: 'Task not found in cache' };
  } catch (e) {
    return { rolled_back: false, error: e.message };
  }
}

// --- Full system rollback to checkpoint ---
function rollbackToCheckpoint(backupFile, actor = 'human') {
  ensureBackupDir();
  const resolveCachePath = path.join(__dirname, '..', 'data', 'resolve-cache.json');
  const backupPath = path.join(BACKUP_DIR, backupFile);

  if (!fs.existsSync(backupPath)) {
    return { rolled_back: false, reason: `Backup ${backupFile} not found` };
  }

  // Save current state as a pre-rollback backup
  const preRollbackPath = path.join(BACKUP_DIR, `pre-rollback-${Date.now()}.json`);
  if (fs.existsSync(resolveCachePath)) {
    fs.copyFileSync(resolveCachePath, preRollbackPath);
  }

  fs.copyFileSync(backupPath, resolveCachePath);
  logAudit('system_rollback', actor, { backup_file: backupFile, pre_rollback_backup: preRollbackPath });
  return { rolled_back: true, backup: backupFile, pre_rollback_backup: preRollbackPath };
}

// --- List available backups ---
function listBackups() {
  ensureBackupDir();
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const stat = fs.statSync(path.join(BACKUP_DIR, f));
        return { file: f, size: stat.size, modified: stat.mtime.toISOString() };
      })
      .sort((a, b) => new Date(b.modified) - new Date(a.modified));
    return files;
  } catch { return []; }
}

// --- Audit trail ---
function getAuditLog(limit = 100, filterAction = null) {
  const data = loadAuditLog();
  let entries = data.entries || [];
  if (filterAction) {
    entries = entries.filter(e => e.action === filterAction);
  }
  return entries.slice(-limit).reverse();
}

function getFreezeState() {
  return loadFreezeState();
}

// --- Interceptor middleware for Express ---
function interventionMiddleware(req, res, next) {
  // Check system freeze on mutating operations
  const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (mutatingMethods.includes(req.method) && isSystemFrozen()) {
    const state = loadFreezeState();
    return res.status(503).json({
      error: 'system_frozen',
      message: state.reason || 'System is frozen by administrator',
      frozen_at: state.frozen_at,
      status_code: 503,
    });
  }
  next();
}

module.exports = {
  freezeSystem,
  thawSystem,
  isSystemFrozen,
  freezeAgent,
  thawAgent,
  isAgentFrozen,
  quarantineAgent,
  rollbackMemory,
  rollbackToCheckpoint,
  listBackups,
  getAuditLog,
  getFreezeState,
  logAudit,
  interventionMiddleware,
};
