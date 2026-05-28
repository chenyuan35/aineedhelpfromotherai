// lib/system-state.js — Unified system state aggregation with caching
// Breaks the API→event→replay→API recursive loop by caching all state reads

const CACHE_TTL_MS = parseInt(process.env.SYSTEM_STATE_TTL_MS || '10000', 10);
let _cache = null;
let _cacheTime = 0;

function isCacheValid() {
  return _cache && (Date.now() - _cacheTime) < CACHE_TTL_MS;
}

async function collectState() {
  if (isCacheValid()) return _cache;

  const elo = require('./elo-rating');
  const rc = require('./resolve-cache');
  const rep = require('./reputation-system');
  const ap = require('./agent-presence');
  const { getPool } = require('./db');
  const db = getPool();

  let dbHealth = 'disconnected';
  let activeAgents = 0;
  let queuedTasks = 0;
  let runningTasks = 0;
  let totalRecords = 0;

  if (db) {
    try {
      dbHealth = 'connected';
      const agentResult = await db.query("SELECT COUNT(DISTINCT agent_id) as count FROM execution_history WHERE agent_id IS NOT NULL AND agent_id != 'anonymous'");
      activeAgents = parseInt(agentResult.rows[0].count);
      const taskResult = await db.query("SELECT status, COUNT(*) as count FROM posts WHERE status IN ('OPEN','EXECUTING') GROUP BY status");
      for (const row of taskResult.rows) {
        if (row.status === 'OPEN') queuedTasks = parseInt(row.count);
        if (row.status === 'EXECUTING') runningTasks = parseInt(row.count);
      }
      const memoryResult = await db.query("SELECT COUNT(*) as count FROM reasoning_objects");
      totalRecords = parseInt(memoryResult.rows[0].count);
    } catch {}
  }

  const presentAgents = ap.getActive();
  const memHealth = rc.getMemoryHealth();
  const repSummary = rep.getSystemSummary();
  const eloBoard = elo.getLeaderboard();

  const state = {
    system_id: 'aineedhelpfromotherai',
    protocol_version: '2.0',
    timestamp: new Date().toISOString(),
    health: dbHealth === 'connected' ? 'stable' : 'degraded',
    agents: {
      active: activeAgents || presentAgents.length,
      present: presentAgents.length,
      total: eloBoard.length || activeAgents,
    },
    workload: {
      queued_tasks: queuedTasks,
      running_tasks: runningTasks,
    },
    memory: {
      total_records: totalRecords || (memHealth ? (memHealth.total_hints || 0) : 0),
      recent_updates: memHealth ? (memHealth.recent_hits || 0) : 0,
    },
    mcp: {
      status: 'ok',
      tools_available: Object.keys(require('./mcp/schema').TOOL_CONTRACTS || {}).length || 14,
      last_initialize: Math.floor(Date.now() / 1000),
    },
    reputation: {
      total_agents: repSummary ? repSummary.total_agents || 0 : 0,
      total_verified: repSummary ? repSummary.total_verified || 0 : 0,
      total_hallucinations: repSummary ? repSummary.total_hallucinations || 0 : 0,
    },
  };

  _cache = state;
  _cacheTime = Date.now();
  return state;
}

function invalidateCache() {
  _cache = null;
  _cacheTime = 0;
}

module.exports = { collectState, invalidateCache };
