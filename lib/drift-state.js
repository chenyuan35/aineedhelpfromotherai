// lib/drift-state.js — Drift state persistence (JSON file)
const fs = require('fs');
const path = require('path');

const STATE_PATH = path.join(__dirname, '..', 'data', 'drift-state.json');

function loadState() {
  try {
    if (fs.existsSync(STATE_PATH)) {
      return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
    }
  } catch (e) {
    console.warn('[drift-state] Corrupt state file, starting fresh:', e.message);
  }
  return { agents: {}, updated_at: new Date().toISOString() };
}

function saveState(state) {
  state.updated_at = new Date().toISOString();
  const dir = path.dirname(STATE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function getAgentState(agentId) {
  const state = loadState();
  if (!state.agents[agentId]) {
    state.agents[agentId] = {
      recent_calls: [],
      drift_score: 0,
      active_drifts: [],
      history: [],
      stats: { total_calls: 0, failed_calls: 0, drift_events: 0, avg_recovery_minutes: 0 }
    };
  }
  return state.agents[agentId];
}

function updateAgentState(agentId, updates) {
  const state = loadState();
  if (!state.agents[agentId]) {
    state.agents[agentId] = {
      recent_calls: [],
      drift_score: 0,
      active_drifts: [],
      history: [],
      stats: { total_calls: 0, failed_calls: 0, drift_events: 0, avg_recovery_minutes: 0 }
    };
  }
  Object.assign(state.agents[agentId], updates);
  saveState(state);
  return state.agents[agentId];
}

function addCall(agentId, callData) {
  const state = loadState();
  const agentState = state.agents[agentId] || {
    recent_calls: [],
    drift_score: 0,
    active_drifts: [],
    history: [],
    stats: { total_calls: 0, failed_calls: 0, drift_events: 0, avg_recovery_minutes: 0 }
  };
  
  agentState.recent_calls.push(callData);
  if (agentState.recent_calls.length > 20) agentState.recent_calls.shift();
  agentState.stats.total_calls++;
  if (!callData.success) agentState.stats.failed_calls++;
  
  state.agents[agentId] = agentState;
  saveState(state);
  return agentState;
}

function parseTimeWindow(window) {
  if (window === '1h') return 1;
  if (window === '7d') return 168;
  return 24; // default 24h
}

function getMostFailedTool(calls) {
  const counts = {};
  for (const c of calls) if (!c.success) counts[c.tool] = (counts[c.tool] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
}

function getMostCommonError(calls) {
  const counts = {};
  for (const c of calls) if (c.error) counts[c.error] = (counts[c.error] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
}

function generateRecommendations(agentState, failedCalls) {
  const recs = [];
  if (failedCalls.length > 5) recs.push('High failure rate. Consider checking environment before executing.');
  if (agentState.active_drifts.some(d => d.type === 'retry_spiral')) recs.push('Retry spiral detected. Run diagnostics before retrying.');
  if (agentState.active_drifts.some(d => d.type === 'false_assumption_lock')) recs.push('False assumption lock. Generate alternative hypotheses.');
  return recs;
}

function getReport(agentId, timeWindow = '24h') {
  const agentState = getAgentState(agentId);
  const hours = parseTimeWindow(timeWindow);
  const cutoff = Date.now() - hours * 3600000;
  
  const recentCalls = agentState.recent_calls.filter(c => new Date(c.ts).getTime() > cutoff);
  const failedCalls = recentCalls.filter(c => !c.success);
  
  return {
    agent_id: agentId,
    time_window: timeWindow,
    summary: {
      total_calls: recentCalls.length,
      failed_calls: failedCalls.length,
      failure_rate: recentCalls.length > 0 ? failedCalls.length / recentCalls.length : 0,
      drift_score: agentState.drift_score,
      drift_trend: agentState.drift_score > 0.5 ? 'worsening' : agentState.drift_score > 0.2 ? 'stable' : 'improving'
    },
    drift_history: agentState.history,
    patterns: {
      most_failed_tool: getMostFailedTool(recentCalls),
      most_common_error: getMostCommonError(failedCalls),
      avg_recovery_time_minutes: agentState.stats.avg_recovery_minutes
    },
    recommendations: generateRecommendations(agentState, failedCalls)
  };
}

module.exports = { loadState, saveState, getAgentState, updateAgentState, addCall, getReport, parseTimeWindow, getMostFailedTool, getMostCommonError, generateRecommendations };