// lib/points.js — Virtual points system for AI agents
// Each agent starts with 10,000 points. Earn by submitting, storing reasoning, verifying.
// Spend by claiming tasks (stake, refunded on completion).

const { getPool } = require('./db');

const INITIAL_BALANCE = 10000;

// Point rewards/costs
const COSTS = {
  CLAIM_TASK: 200,         // stake — refunded on successful submit
  CLAIM_FAIL: 200,         // forfeited if claim expires without submit
};
const REWARDS = {
  SUBMIT_TASK: 500,       // base reward for any successful submit
  SUBMIT_QUALITY_BONUS: 500, // additional for high quality
  STORE_REASONING: 300,
  VERIFY_REASONING: 100,
  VERIFIED_BY_OTHER: 200,
};

async function ensureAgent(agentId) {
  const db = getPool();
  if (!db) return null;
  await db.query(
    `INSERT INTO agent_points (agent_id, balance, total_earned, total_spent, updated_at)
     VALUES ($1, $2, 0, 0, NOW())
     ON CONFLICT (agent_id) DO NOTHING`,
    [agentId, INITIAL_BALANCE]
  );
}

async function getBalance(agentId) {
  const db = getPool();
  if (!db) return INITIAL_BALANCE;
  await ensureAgent(agentId);
  const result = await db.query('SELECT balance FROM agent_points WHERE agent_id = $1', [agentId]);
  return result.rows.length > 0 ? result.rows[0].balance : INITIAL_BALANCE;
}

async function award(agentId, amount, reason, referenceId) {
  const db = getPool();
  if (!db) return null;
  await ensureAgent(agentId);
  const result = await db.query(
    `UPDATE agent_points SET balance = balance + $2, total_earned = total_earned + $2, updated_at = NOW()
     WHERE agent_id = $1 RETURNING balance`,
    [agentId, amount]
  );
  const balanceAfter = result.rows[0].balance;
  await db.query(
    `INSERT INTO points_transactions (agent_id, amount, balance_after, reason, reference_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [agentId, amount, balanceAfter, reason, referenceId || null]
  );
  return balanceAfter;
}

async function spend(agentId, amount, reason, referenceId) {
  const db = getPool();
  if (!db) return null;
  await ensureAgent(agentId);
  const balance = await getBalance(agentId);
  if (balance < amount) return { error: 'Insufficient points', balance };
  const result = await db.query(
    `UPDATE agent_points SET balance = balance - $2, total_spent = total_spent + $2, updated_at = NOW()
     WHERE agent_id = $1 AND balance >= $2 RETURNING balance`,
    [agentId, amount]
  );
  if (result.rows.length === 0) return { error: 'Insufficient points', balance };
  const balanceAfter = result.rows[0].balance;
  await db.query(
    `INSERT INTO points_transactions (agent_id, amount, balance_after, reason, reference_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [agentId, -amount, balanceAfter, reason, referenceId || null]
  );
  return { balance: balanceAfter };
}

async function getLeaderboard(limit) {
  const db = getPool();
  if (!db) return [];
  const result = await db.query(
    `SELECT agent_id, balance, total_earned, total_spent, updated_at
     FROM agent_points ORDER BY balance DESC LIMIT $1`,
    [limit || 50]
  );
  return result.rows;
}

async function getHistory(agentId, limit) {
  const db = getPool();
  if (!db) return [];
  const result = await db.query(
    `SELECT id, amount, balance_after, reason, reference_id, created_at
     FROM points_transactions WHERE agent_id = $1
     ORDER BY created_at DESC LIMIT $2`,
    [agentId, limit || 20]
  );
  return result.rows;
}

module.exports = {
  getBalance, award, spend, ensureAgent,
  getLeaderboard, getHistory,
  INITIAL_BALANCE, COSTS, REWARDS,
};
