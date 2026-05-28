// lib/projection-snapshot.js — Periodic state snapshots for read endpoints
// Breaks the amplification chain: snapshot + delta, never replay full history

const SNAPSHOT_INTERVAL_MS = parseInt(process.env.PROJECTION_SNAPSHOT_INTERVAL_MS || '30000', 10);
let _snapshot = null;
let _snapshotTime = 0;
let _tick = 0;

async function takeSnapshot() {
  _tick++;
  const rc = require('./resolve-cache');
  const { getPool } = require('./db');
  const db = getPool();

  const memHealth = rc.getMemoryHealth();
  const allHints = rc.getAllHints();

  let dbStats = { activeAgents: 0, queued: 0, running: 0, reasoningTotal: 0, executionTotal: 0 };
  if (db) {
    try {
      const results = await Promise.allSettled([
        db.query("SELECT COUNT(DISTINCT agent_id) as c FROM execution_history WHERE agent_id IS NOT NULL AND agent_id != 'anonymous'"),
        db.query("SELECT status, COUNT(*) as c FROM posts WHERE status IN ('OPEN','EXECUTING') GROUP BY status"),
        db.query("SELECT COUNT(*) as c FROM reasoning_objects"),
        db.query("SELECT COUNT(*) as c FROM execution_history"),
      ]);
      if (results[0].status === 'fulfilled') dbStats.activeAgents = parseInt(results[0].value.rows[0].c);
      if (results[1].status === 'fulfilled') {
        for (const row of results[1].value.rows) {
          if (row.status === 'OPEN') dbStats.queued = parseInt(row.c);
          if (row.status === 'EXECUTING') dbStats.running = parseInt(row.c);
        }
      }
      if (results[2].status === 'fulfilled') dbStats.reasoningTotal = parseInt(results[2].value.rows[0].c);
      if (results[3].status === 'fulfilled') dbStats.executionTotal = parseInt(results[3].value.rows[0].c);
    } catch {}
  }

  const hintValues = Object.values(allHints);
  const hintCount = hintValues.length;
  const activeHints = hintValues.filter(h => h.status === 'active').length;
  const decayingHints = hintValues.filter(h => h.status === 'decaying').length;
  const quarantinedHints = hintValues.filter(h => h.status === 'quarantined').length;
  const totalScore = hintValues.reduce((s, h) => s + (h.score || 0), 0);

  _snapshot = {
    tick: _tick,
    timestamp: new Date().toISOString(),
    agents: {
      active: dbStats.activeAgents,
      queued_tasks: dbStats.queued,
      running_tasks: dbStats.running,
    },
    memory: {
      total_records: dbStats.reasoningTotal || hintCount,
      hints: {
        total: hintCount,
        active: activeHints,
        decaying: decayingHints,
        quarantined: quarantinedHints,
        avg_score: hintCount > 0 ? +(totalScore / hintCount).toFixed(3) : 0,
      },
      active_ratio: hintCount > 0 ? +((activeHints / hintCount) * 100).toFixed(1) : 0,
      health_score: hintCount > 0 ? +((activeHints * 1.0 + decayingHints * 0.3) / Math.max(hintCount, 1) * 100).toFixed(1) : 0,
    },
    executions: { total: dbStats.executionTotal },
    snapshot_age_ms: Date.now() - _snapshotTime,
  };
  _snapshotTime = Date.now();
  return _snapshot;
}

function getSnapshot() {
  if (_snapshot) {
    _snapshot.snapshot_age_ms = Date.now() - _snapshotTime;
  }
  return _snapshot || { status: 'pending', message: 'Initial snapshot in progress' };
}

function getDelta(previousTick) {
  if (!_snapshot) return null;
  return {
    tick: _snapshot.tick,
    since_tick: previousTick,
    delta: previousTick ? _snapshot.tick - previousTick : 0,
    timestamp: _snapshot.timestamp,
    agents: _snapshot.agents,
    memory: {
      total_records: _snapshot.memory.total_records,
      hints_total: _snapshot.memory.hints.total,
      health_score: _snapshot.memory.health_score,
    },
  };
}

// Start periodic snapshot
const intervalHandle = setInterval(takeSnapshot, SNAPSHOT_INTERVAL_MS);
intervalHandle.unref();

// Immediate first snapshot
takeSnapshot().catch(() => {});

module.exports = { getSnapshot, getDelta, takeSnapshot };
