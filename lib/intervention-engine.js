// lib/intervention-engine.js — Three-level intervention engine
const INTERVENTION_RULES = {
  retry_spiral: { 
    level: 2, 
    escape_route: 'Run a diagnostic command before retrying. If error is transient, add exponential backoff.' 
  },
  false_assumption_lock: { 
    level: 3, 
    escape_route: 'Force-generate 3 alternative hypotheses. Check runtime reality (env vars, process state, versions) before any code modification.' 
  },
  verification_collapse: { 
    level: 3, 
    escape_route: 'Run verification commands to confirm actual state before submitting.' 
  },
  environment_blindness: { 
    level: 1, 
    escape_route: 'Call check_environment before executing fragile operations.' 
  },
  duration_anomaly: { 
    level: 1, 
    escape_route: 'Check if the operation is unusually slow. Consider timeout or reducing complexity.' 
  },
  context_drift: { 
    level: 1, 
    escape_route: 'Refocus on the original task. Review your last 10 tool calls.' 
  },
};

function getInterventionLevel(driftType, driftScore) {
  // Drift score thresholds are PRIMARY
  if (driftScore >= 0.7) return 3;
  if (driftScore >= 0.4) return 2;
  return 1;
}

function generateLevel1Warning(driftType, rule, evidence) {
  const messages = {
    retry_spiral: 'Potential retry spiral detected: you\'ve called the same tool with same arguments multiple times. Consider a different approach.',
    false_assumption_lock: 'Potential false assumption lock: you may be trying the same fix repeatedly. Consider alternative hypotheses.',
    verification_collapse: 'Verification recommended before submitting results.',
    environment_blindness: 'Consider checking environment before executing fragile operations.',
    duration_anomaly: 'Operation took unusually long. Check for timeouts or reduce complexity.',
    context_drift: 'Task focus may have shifted. Review your recent tool calls.',
  };
  
  return {
    level: 1,
    needs_confirmation: false,
    isError: false,
    content: {
      _drift_warning: {
        level: 1,
        type: driftType,
        message: `⚠️ ${messages[driftType] || 'Drift detected.'}`,
        suggestion: rule.escape_route,
      }
    }
  };
}

function generateLevel2Confirm(driftType, rule, evidence) {
  const messages = {
    retry_spiral: 'Retry spiral detected: you\'ve called the same tool with same arguments 3+ times.',
    false_assumption_lock: 'False Assumption Lock detected: you\'ve tried the same fix 3+ times for the same error.',
    verification_collapse: 'Verification Collapse risk: you declared success without running verification.',
    environment_blindness: 'Environment Blindness risk: executing fragile operation without checking environment.',
    duration_anomaly: 'Duration anomaly: operation took unusually long.',
    context_drift: 'Context drift: you\'ve introduced 3+ new tool types recently.',
  };
  
  return {
    level: 2,
    needs_confirmation: true,
    isError: false,
    content: {
      _drift_warning: {
        level: 2,
        type: driftType,
        message: `⚠️ ${messages[driftType] || 'Drift detected.'}`,
        evidence: evidence ? JSON.stringify(evidence) : 'Pattern detected in recent calls.',
        escape_route: rule.escape_route,
        action_required: 'Please confirm you\'ve taken corrective action. Reply "confirmed" to continue, or "abort" to stop.',
      }
    }
  };
}

function generateLevel3Block(driftType, rule, evidence) {
  const messages = {
    retry_spiral: 'Execution blocked: Severe retry spiral. You must change approach.',
    false_assumption_lock: 'Execution blocked: False Assumption Lock. You must generate alternative hypotheses.',
    verification_collapse: 'Execution blocked: Verification Collapse risk. You must verify before submitting.',
    environment_blindness: 'Execution blocked: Environment Blindness. You must check environment first.',
    duration_anomaly: 'Execution blocked: Severe duration anomaly. Operation too slow.',
    context_drift: 'Execution blocked: Severe context drift. Refocus on original task.',
  };
  
  const alternatives = {
    retry_spiral: [
      { tool: 'check_failures', args: { approach_description: 'your current approach' } },
      { tool: 'memory_gate', args: { query: 'your current problem' } }
    ],
    false_assumption_lock: [
      { tool: 'check_failures', args: { approach_description: 'your current approach' } },
      { tool: 'memory_gate', args: { query: 'your current problem' } }
    ],
    verification_collapse: [
      { tool: 'check_failures', args: { approach_description: 'your current approach' } },
      { tool: 'memory_gate', args: { query: 'your current problem' } }
    ],
    environment_blindness: [
      { tool: 'check_environment', args: { problem: 'your current operation', environment: '' } }
    ],
    duration_anomaly: [
      { tool: 'check_failures', args: { approach_description: 'your current approach' } }
    ],
    context_drift: [
      { tool: 'memory_gate', args: { query: 'your current problem' } }
    ],
  };
  
  return {
    level: 3,
    needs_confirmation: false,
    isError: true,
    content: {
      _drift_warning: {
        level: 3,
        type: driftType,
        message: `🛑 ${messages[driftType] || 'Execution blocked due to severe drift.'}`,
        evidence: evidence ? JSON.stringify(evidence) : 'Pattern detected in recent calls.',
        escape_route: rule.escape_route,
        alternatives: alternatives[driftType] || [
          { tool: 'check_failures', args: { approach_description: 'your current approach' } }
        ],
        action_required: 'Please run the verification tools above, confirm results, then submit.',
      }
    }
  };
}

function generateIntervention(driftType, driftScore, callResult) {
  const rule = INTERVENTION_RULES[driftType] || { level: 1, escape_route: 'Review your approach.' };
  const level = getInterventionLevel(driftType, driftScore);
  
  switch (level) {
    case 1:
      return generateLevel1Warning(driftType, rule, callResult);
    case 2:
      return generateLevel2Confirm(driftType, rule, callResult);
    case 3:
      return generateLevel3Block(driftType, rule, callResult);
    default:
      return generateLevel1Warning(driftType, rule, callResult);
  }
}

module.exports = { generateIntervention, INTERVENTION_RULES, getInterventionLevel };