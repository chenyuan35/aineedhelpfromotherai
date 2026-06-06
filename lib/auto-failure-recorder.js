// lib/auto-failure-recorder.js — Auto failure recorder (propose + confirm + write)
const crypto = require('crypto');
const { getAgentState, loadState, saveState } = require('./drift-state');

let memoryApi = null;
let reasoningStorage = null;

try { memoryApi = require('./memory-api'); } catch {}
try { reasoningStorage = require('./reasoning-storage'); } catch {}

const { searchMemory } = memoryApi || { searchMemory: () => ({ failures: [] }) };
const { saveReasoning } = reasoningStorage || { saveReasoning: () => {} };

const FAILURE_SIMILARITY_THRESHOLD = 0.7;

function generateProposalId() {
  return 'FAIL_' + Date.now().toString(36) + '_' + crypto.randomBytes(4).toString('hex');
}

function generateReasoningId() {
  return 'RO_' + Date.now().toString(36).toUpperCase() + '_' + crypto.randomBytes(2).toString('hex').toUpperCase();
}

function computeErrorSignature(error, tool, args) {
  const cmd = args?.command || JSON.stringify(args);
  return `${tool}:${error}:${cmd.slice(0, 100)}`.toLowerCase();
}

function computeErrorSignatureSimple(error, tool) {
  return `${tool}:${error}`.toLowerCase();
}

function findSimilarFailure(agentId, errorSig) {
  const agentState = getAgentState(agentId);
  const recentCalls = agentState.recent_calls || [];
  
  for (const call of recentCalls) {
    if (!call.success && call.error) {
      const callSig = computeErrorSignature(call.error, call.tool, call.args);
      if (callSig === errorSig) return call;
    }
  }
  return null;
}

function findSimilarInMemory(errorSig) {
  const results = searchMemory({ query: errorSig, limit: 5, verified_only: false });
  return results.failures || [];
}

function proposeFailure(callData) {
  const { tool_name, agent_id, success, error, duration_ms, args, timestamp } = callData;
  
  if (success) {
    return { proposed: false, reason: 'success' };
  }
  
  const errorSig = computeErrorSignature(error, tool_name, args);
  const errorSigSimple = computeErrorSignatureSimple(error, tool_name);
  const existingCall = findSimilarFailure(agent_id, errorSig);
  
  const agentState = getAgentState(agent_id);
  const existingProposal = agentState.failure_proposal;
  
  // If there's an existing proposal for the same agent, check if it's the same error (simple match)
  if (existingProposal && existingProposal.error_sig_simple === errorSigSimple) {
    // Same error - increment count
    existingProposal.failure_count = (existingProposal.failure_count || 1) + 1;
    existingProposal.last_seen = timestamp;
    
    // Save updated proposal to state
    const state = loadState();
    state.agents[agent_id] = state.agents[agent_id] || getAgentState(agent_id);
    state.agents[agent_id].failure_proposal = existingProposal;
    saveState(state);
    
    if (existingProposal.failure_count === 2) {
      return { ...existingProposal, auto_merged: true, failure_count: 2 };
    } else if (existingProposal.failure_count === 3) {
      existingProposal.verification_tier = 'replay_confirmed';
      return { ...existingProposal, tier_upgraded: true, failure_count: 3, verification_tier: 'replay_confirmed' };
    }
    return { ...existingProposal, failure_count: existingProposal.failure_count };
  }
  
  // New failure proposal
  const proposalId = generateProposalId();
  const proposal = {
    proposal_id: proposalId,
    failure_info: {
      tool: tool_name,
      error,
      agent_id,
      approach: args?.command || JSON.stringify(args).slice(0, 200),
    },
    error_sig: errorSig,
    error_sig_simple: errorSigSimple,
    failure_count: 1,
    verification_tier: 'unverified',
    similar_failures: findSimilarInMemory(errorSig).map(f => ({
      id: f.id,
      title: f.summary,
      similarity: f.similarity / 100,
    })),
    proposed_at: timestamp,
    status: 'pending',
  };
  
  // Store in agent state
  const state = loadState();
  state.agents[agent_id] = state.agents[agent_id] || getAgentState(agent_id);
  state.agents[agent_id].failure_proposal = proposal;
  saveState(state);
  
  return {
    proposed: true,
    ...proposal,
  };
}

function confirmFailure(agentId, proposalId) {
  const agentState = getAgentState(agentId);
  const proposal = agentState.failure_proposal;
  
  if (!proposal || proposal.proposal_id !== proposalId) {
    return { confirmed: false, error: 'Proposal not found or ID mismatch' };
  }
  
  // Create reasoning object for the failure
  const reasoningId = generateReasoningId();
  const ro = {
    id: reasoningId,
    problem_id: 'PROB_' + reasoningId.slice(3),
    problem_statement: `FAILURE: ${proposal.failure_info.tool} — ${proposal.failure_info.error.slice(0, 200)}`,
    context: {
      domain: 'code',
      difficulty: 'intermediate',
      tags: ['auto-recorded', 'failure', proposal.failure_info.tool],
      agent_id: agentId,
      provider: 'auto-failure-recorder',
      model: 'drift-detector',
    },
    attempts: [{
      agent_id: agentId,
      outcome: 'failed',
      approach: proposal.failure_info.approach,
      reasoning_steps: [],
      failure_type: 'auto_detected',
      failure_description: proposal.failure_info.error,
      failure_subtype: proposal.failure_info.tool,
      result: `Auto-recorded failure after ${proposal.failure_count} occurrence(s)`,
      confidence: 0,
      execution_cost: { tokens_used: 0, provider: 'auto', model: 'drift-detector' }
    }],
    solution: {
      summary: `Failure auto-recorded: ${proposal.failure_info.error}`,
      content: null,
      key_insights: [
        `Tool: ${proposal.failure_info.tool}`,
        `Error: ${proposal.failure_info.error}`,
        `Occurrences: ${proposal.failure_count}`,
        `Approach: ${proposal.failure_info.approach}`,
      ],
      consensus_score: null
    },
    meta: {
      total_attempts: 1,
      success_rate: 0,
      total_tokens: 0,
      tags: ['auto-recorded', 'failure', proposal.failure_info.tool],
      provenance: true
    },
    parent_run_id: null,
    evidence_refs: [],
  };
  
  // Save to reasoning storage
  saveReasoning(ro);
  
  // Update proposal status
  const state = loadState();
  if (state.agents[agentId]?.failure_proposal?.proposal_id === proposalId) {
    state.agents[agentId].failure_proposal.status = 'confirmed';
    state.agents[agentId].failure_proposal.confirmed_at = new Date().toISOString();
    state.agents[agentId].failure_proposal.reasoning_id = reasoningId;
    saveState(state);
  }
  
  return {
    confirmed: true,
    reasoning_id: reasoningId,
    proposal_id: proposalId,
    verification_tier: proposal.verification_tier,
    note: 'Failure recorded in shared memory. Other agents will see this in drift detection.',
  };
}

function rejectFailure(agentId, proposalId) {
  const agentState = getAgentState(agentId);
  const proposal = agentState.failure_proposal;
  
  if (!proposal || proposal.proposal_id !== proposalId) {
    return { rejected: false, error: 'Proposal not found or ID mismatch' };
  }
  
  // Record rejection in state
  const state = loadState();
  if (state.agents[agentId]?.failure_proposal?.proposal_id === proposalId) {
    state.agents[agentId].failure_proposal = null;
    saveState(state);
  }
  
  return {
    rejected: true,
    proposal_id: proposalId,
    note: 'Failure recording rejected by agent.',
  };
}

function getFailureProposal(agentId) {
  const agentState = getAgentState(agentId);
  return agentState.failure_proposal || null;
}

module.exports = { proposeFailure, confirmFailure, rejectFailure, getFailureProposal, computeErrorSignature, findSimilarFailure };