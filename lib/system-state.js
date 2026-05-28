// lib/system-state.js — Unified system state aggregation with caching
// Breaks the API→event→replay→API recursive loop by caching all state reads
// v2: backed by projection-snapshot for zero-cost reads

const projectionSnapshot = require('./projection-snapshot');

async function collectState() {
  const snap = projectionSnapshot.getSnapshot();

  // Fast path: snapshot is ready
  if (snap && snap.timestamp) {
    return {
      system_id: 'aineedhelpfromotherai',
      protocol_version: '2.0',
      timestamp: snap.timestamp,
      health: snap.agents.active > 0 ? 'stable' : 'degraded',
      agents: {
        active: snap.agents.active,
        queued: snap.agents.queued_tasks,
        running: snap.agents.running_tasks,
      },
      memory: {
        total_records: snap.memory.total_records,
        total_hints: snap.memory.hints.total,
        active_hints: snap.memory.hints.active,
        health_score: snap.memory.health_score,
        active_ratio: snap.memory.active_ratio,
      },
      mcp: {
        status: 'ok',
        tools_available: 13,
        last_initialize: Math.floor(Date.now() / 1000),
        _backed_by: 'snapshot',
      },
      snapshot: {
        tick: snap.tick,
        age_ms: snap.snapshot_age_ms,
      },
    };
  }

  // Slow path: first snapshot not ready yet
  const { getPool } = require('./db');
  const db = getPool();
  return {
    system_id: 'aineedhelpfromotherai',
    protocol_version: '2.0',
    timestamp: new Date().toISOString(),
    health: db ? 'cold_start' : 'degraded',
    agents: { active: 0 },
    memory: { total_records: 0 },
    mcp: { status: 'starting' },
  };
}

module.exports = { collectState };
