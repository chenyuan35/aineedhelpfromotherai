// lib/drift-detector.js — Drift detection engine (rules + state)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let stateModule = require('./drift-state');

const STATE_PATH = path.join(__dirname, '..', 'data', 'drift-state.json');

function setStateModule(module) {
  stateModule = module;
}

function getAgentState(agentId) { return stateModule.getAgentState(agentId); }
function addCall(agentId, callData) { return stateModule.addCall(agentId, callData); }
function loadState() { return stateModule.loadState(); }
function saveState(state) { return stateModule.saveState(state); }

function computeArgsHash(args) {
  const sorted = JSON.stringify(args, Object.keys(args).sort());
  return crypto.createHash('md5').update(sorted).digest('hex').slice(0, 12);
}

function calculateDriftScore(agentState) {
  let score = 0;
  const activeDrifts = agentState.active_drifts || [];
  
  for (const drift of activeDrifts) {
    switch (drift.severity) {
      case 'high': score += 0.3; break;
      case 'medium': score += 0.15; break;
      case 'low': score += 0.05; break;
    }
  }
  
  return Math.min(score, 1.0);
}

function getRecentCalls(agentState, count = 20) {
  return agentState.recent_calls.slice(-count);
}

function checkRetrySpiral(agentState, toolName, argsHash) {
  const calls = getRecentCalls(agentState, 5);
  let matches = 0;
  for (const c of calls) {
    if (c.tool === toolName && c.args_hash === argsHash) matches++;
  }
  return matches >= 3 ? { detected: true, count: matches } : { detected: false };
}

function checkFalseAssumptionLock(agentState, error) {
  const calls = getRecentCalls(agentState, 5);
  // Exclude the most recent call (current attempt) from the check
  const pastCalls = calls.slice(0, -1);
  let matches = 0;
  for (const c of pastCalls) {
    if (c.error && c.error.includes(error)) matches++;
  }
  return matches >= 3 ? { detected: true, count: matches, error } : { detected: false };
}

function checkVerificationCollapse(agentState, toolName) {
  if (toolName !== 'submit_result') return { detected: false };
  const calls = getRecentCalls(agentState, 10);
  // Check if check_failures or memory_gate was called in recent history
  const hasVerification = calls.some(c => 
    c.tool === 'check_failures' || c.tool === 'memory_gate'
  );
  return hasVerification ? { detected: false } : { detected: true };
}

function checkEnvironmentBlindness(agentState, toolName, args) {
  if (toolName !== 'bash') return { detected: false };
  const command = args?.command || '';
  const fragileOps = ['docker build', 'npm install', 'pip install', 'cargo build', 'yarn install'];
  const isFragile = fragileOps.some(op => command.includes(op));
  if (!isFragile) return { detected: false };
  
  const calls = getRecentCalls(agentState, 10);
  const hasEnvCheck = calls.some(c => c.tool === 'check_environment');
  return hasEnvCheck ? { detected: false } : { detected: true, command };
}

function checkDurationAnomaly(agentState, toolName, durationMs) {
  const calls = getRecentCalls(agentState, 10).filter(c => c.tool === toolName && c.duration_ms);
  if (calls.length < 3) return { detected: false };
  
  const avgDuration = calls.reduce((sum, c) => sum + c.duration_ms, 0) / calls.length;
  return durationMs > avgDuration * 3 ? { detected: true, avg: avgDuration, current: durationMs } : { detected: false };
}

function checkContextDrift(agentState, toolName) {
  const calls = getRecentCalls(agentState, 30);
  if (calls.length < 20) return { detected: false };
  
  const previous20 = calls.slice(-20, -10);
  const recent10 = calls.slice(-10);
  
  const prevTools = new Set(previous20.map(c => c.tool));
  const newTools = recent10.filter(c => !prevTools.has(c.tool));
  const uniqueNewTools = new Set(newTools.map(c => c.tool));
  
  return uniqueNewTools.size >= 3 ? { detected: true, newTools: Array.from(uniqueNewTools) } : { detected: false };
}

const DRIFT_RULES = {
  retry_spiral: { severity: 'medium', check: checkRetrySpiral },
  false_assumption_lock: { severity: 'high', check: checkFalseAssumptionLock },
  verification_collapse: { severity: 'low', check: checkVerificationCollapse },
  environment_blindness: { severity: 'low', check: checkEnvironmentBlindness },
  duration_anomaly: { severity: 'medium', check: checkDurationAnomaly },
  context_drift: { severity: 'low', check: checkContextDrift },
};

function analyze(callData) {
  const { tool_name, agent_id, success, error, duration_ms, args, timestamp } = callData;
  const argsHash = computeArgsHash(args || {});
  
  // Add this call to state FIRST
  addCall(agent_id, { tool: tool_name, args_hash: argsHash, success, error, duration_ms, ts: timestamp });
  
  // Get UPDATED agent state after addCall
  const agentState = getAgentState(agent_id);
  
  // Run all drift checks
  const detectedDrifts = [];
  
  for (const [driftType, rule] of Object.entries(DRIFT_RULES)) {
    let checkResult;
    switch (driftType) {
      case 'retry_spiral':
        checkResult = rule.check(agentState, tool_name, argsHash);
        break;
      case 'false_assumption_lock':
        checkResult = rule.check(agentState, error || '');
        break;
      case 'verification_collapse':
        checkResult = rule.check(agentState, tool_name);
        break;
      case 'environment_blindness':
        checkResult = rule.check(agentState, tool_name, args);
        break;
      case 'duration_anomaly':
        checkResult = rule.check(agentState, tool_name, duration_ms);
        break;
      case 'context_drift':
        checkResult = rule.check(agentState, tool_name);
        break;
      default:
        checkResult = { detected: false };
    }
    
    if (checkResult.detected) {
      // Check if this drift is already active
      const existing = agentState.active_drifts.find(d => d.type === driftType);
      if (!existing) {
        agentState.active_drifts.push({
          type: driftType,
          detected_at: timestamp,
          evidence: JSON.stringify(checkResult)
        });
      }
      detectedDrifts.push({ type: driftType, severity: rule.severity, evidence: checkResult });
    } else {
      // Remove resolved drift
      const idx = agentState.active_drifts.findIndex(d => d.type === driftType);
      if (idx >= 0) {
        const resolved = agentState.active_drifts.splice(idx, 1)[0];
        agentState.history.push({
          type: driftType,
          resolved_at: timestamp,
          waste_minutes: Math.round((Date.now() - new Date(resolved.detected_at).getTime()) / 60000)
        });
        // Keep only last 7 days of history
        const weekAgo = Date.now() - 7 * 24 * 3600000;
        agentState.history = agentState.history.filter(h => new Date(h.resolved_at).getTime() > weekAgo);
      }
    }
  }
  
  // Update drift score
  agentState.drift_score = calculateDriftScore(agentState);
  agentState.stats.drift_events = agentState.active_drifts.length;
  
  // Save updated state
  const state = loadState();
  state.agents[agent_id] = agentState;
  saveState(state);
  
  if (detectedDrifts.length === 0) {
    return {
      drift_detected: false,
      drift_score: agentState.drift_score,
      intervention: null
    };
  }
  
  // Return the highest severity drift
  const primaryDrift = detectedDrifts.sort((a, b) => {
    const order = { high: 3, medium: 2, low: 1 };
    return order[b.severity] - order[a.severity];
  })[0];
  
  return {
    drift_detected: true,
    drift_type: primaryDrift.type,
    severity: primaryDrift.severity,
    evidence: primaryDrift.evidence,
    all_drifts: detectedDrifts,
    drift_score: agentState.drift_score,
    drift_score_delta: 0.1 // approximate
  };
}

module.exports = { analyze, computeArgsHash, DRIFT_RULES, calculateDriftScore, checkRetrySpiral, checkFalseAssumptionLock, checkVerificationCollapse, checkEnvironmentBlindness, checkDurationAnomaly, checkContextDrift, setStateModule };