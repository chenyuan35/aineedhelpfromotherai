// lib/memory-economy.js — Token-based memory economy
// Each hint has a cost based on score/status/reliability.
// Each agent has a budget. Using high-value hints costs more.
// Prevents infinite context dump and forces strategic memory selection.

const fs = require('fs');
const path = require('path');
const rc = require('./resolve-cache');
const elo = require('./elo-rating');

const ECONOMY_PATH = path.join(__dirname, '..', 'data', 'memory-economy.json');
const DEFAULT_BUDGET = { memory: 50, compute: 100, risk: 10 };
const BUDGET_REPLENISH_RATE = { memory: 5, compute: 10, risk: 1 }; // per cycle

function load() {
  try { if (fs.existsSync(ECONOMY_PATH)) return JSON.parse(fs.readFileSync(ECONOMY_PATH, 'utf8')); } catch {}
  return { agents: {}, pricing: {}, transactions: [], updated_at: null };
}

function save(data) {
  try { const dir = path.dirname(ECONOMY_PATH); if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(ECONOMY_PATH, JSON.stringify(data, null, 2)); } catch {}
}

function getHintCost(hint) {
  if (!hint || !hint.hit) return { memory: 0, compute: 0, risk: 0 };

  const baseCost = { memory: 1, compute: 2, risk: 0 };
  const score = hint.score ?? 1;

  // High-score hints cost more (they're more valuable)
  if (score >= 2) { baseCost.memory = 8; baseCost.compute = 15; baseCost.risk = 0; }
  else if (score >= 1.5) { baseCost.memory = 5; baseCost.compute = 10; baseCost.risk = 0; }
  else if (score >= 0.7) { baseCost.memory = 3; baseCost.compute = 5; baseCost.risk = 1; }
  else if (score >= 0.3) { baseCost.memory = 2; baseCost.compute = 4; baseCost.risk = 2; }
  else { baseCost.memory = 1; baseCost.compute = 3; baseCost.risk = 3; } // Low score hints are cheap but risky

  // Status adjustments
  const status = hint.status || 'active';
  if (status === 'quarantined') { baseCost.memory = 1; baseCost.risk = 8; }
  if (status === 'blacklisted') { baseCost.memory = 0; baseCost.compute = 0; baseCost.risk = 10; }

  return baseCost;
}

function getAgentBudget(agentId) {
  const data = load();
  if (!data.agents[agentId]) {
    data.agents[agentId] = { ...DEFAULT_BUDGET, memory: DEFAULT_BUDGET.memory + (agentId.includes('careful') ? 30 : agentId.includes('minimal') ? -20 : 0), last_replenished: new Date().toISOString() };
    save(data);
  }
  return data.agents[agentId];
}

function replenishBudgets() {
  const data = load();
  const now = Date.now();
  for (const [agentId, budget] of Object.entries(data.agents)) {
    const last = new Date(budget.last_replenished || now).getTime();
    const cyclesSince = Math.floor((now - last) / 300000); // 5 min cycles
    if (cyclesSince > 0) {
      budget.memory = Math.min(DEFAULT_BUDGET.memory + (agentId.includes('careful') ? 30 : agentId.includes('minimal') ? -20 : 0), (budget.memory || 0) + BUDGET_REPLENISH_RATE.memory * cyclesSince);
      budget.compute = Math.min(DEFAULT_BUDGET.compute, (budget.compute || 0) + BUDGET_REPLENISH_RATE.compute * cyclesSince);
      budget.risk = Math.min(DEFAULT_BUDGET.risk, (budget.risk || 0) + BUDGET_REPLENISH_RATE.risk * cyclesSince);
      budget.last_replenished = new Date().toISOString();
    }
  }
  data.updated_at = new Date().toISOString();
  save(data);
}

function canAfford(agentId, hint) {
  const budget = getAgentBudget(agentId);
  const cost = getHintCost(hint);
  return budget.memory >= cost.memory && budget.compute >= cost.compute && budget.risk >= cost.risk;
}

function spend(agentId, hint) {
  const data = load();
  const budget = data.agents[agentId];
  if (!budget) return false;
  const cost = getHintCost(hint);
  if (budget.memory < cost.memory || budget.compute < cost.compute || budget.risk < cost.risk) return false;

  budget.memory -= cost.memory;
  budget.compute -= cost.compute;
  budget.risk -= cost.risk;

  data.transactions.push({
    ts: new Date().toISOString(),
    agent_id: agentId,
    type: 'hint_purchase',
    hint_id: hint.reasoning_id || 'unknown',
    cost,
    remaining: { memory: budget.memory, compute: budget.compute, risk: budget.risk },
  });
  if (data.transactions.length > 10000) data.transactions = data.transactions.slice(-10000);
  save(data);
  return true;
}

/** Get hints that an agent can afford, sorted by value/cost ratio */
function getAffordableHints(agentId, taskId) {
  const budget = getAgentBudget(agentId);
  const allHints = rc.getAllHints();
  const hint = allHints[taskId];
  if (!hint || !hint.hit) return [];

  const cost = getHintCost(hint);
  const valueRatio = hint.score / (cost.memory + cost.compute + cost.risk + 1);
  return [{
    task_id: taskId,
    reasoning_id: hint.reasoning_id,
    score: hint.score,
    cost,
    value_ratio: Math.round(valueRatio * 100) / 100,
    affordable: canAfford(agentId, hint),
    status: hint.status || 'active',
  }];
}

function getSystemSummary() {
  const data = load();
  const agents = Object.keys(data.agents).length;
  const avgBudget = { memory: 0, compute: 0, risk: 0 };
  for (const b of Object.values(data.agents)) {
    avgBudget.memory += b.memory || 0;
    avgBudget.compute += b.compute || 0;
    avgBudget.risk += b.risk || 0;
  }
  if (agents > 0) { avgBudget.memory = Math.round(avgBudget.memory / agents); avgBudget.compute = Math.round(avgBudget.compute / agents); avgBudget.risk = Math.round(avgBudget.risk / agents); }
  return {
    status: 'active',
    total_agents: agents,
    avg_budget: avgBudget,
    total_transactions: data.transactions.length,
    last_tx: data.transactions[data.transactions.length - 1] || null,
  };
}

// Replenish every 5 minutes
setInterval(replenishBudgets, 5 * 60 * 1000).unref();

module.exports = { getHintCost, getAgentBudget, canAfford, spend, getAffordableHints, getSystemSummary, DEFAULT_BUDGET };