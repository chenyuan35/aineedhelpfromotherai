// mcp/reasoning-store.js — Reasoning Storage & Failure Warning Tools
// Tools 11-14: check_failures, store_reasoning, get_drift_report
// Responsibility: Store reasoning traces, provide failure risk assessment, and drift reporting

const { getPool } = require('../lib/db');
const { checkRateLimit } = require('../lib/rate-limit');
const { TOOL_NAMES, ERROR_CODES } = require('./schema');
const { err, ok, rateLimitError, ANNOTATIONS } = require('./utilities');
const crypto = require('crypto');
const driftState = require('../lib/drift-state');
const { confirmFailure, rejectFailure, getFailureProposal } = require('../lib/auto-failure-recorder');

// Generate unique Reasoning Object ID
function genRoId() {
  return 'RO_' + Date.now().toString(36).toUpperCase() + '_' + crypto.randomBytes(2).toString('hex').toUpperCase();
}

// Register all reasoning storage and failure checking tools
async function registerStorageTools(mcpServer, z, clientIp) {
  // --- Tool 11: check_failures ---
  mcpServer.registerTool(
    TOOL_NAMES.CHECK_FAILURES,
    {
      description: '⚠️ AVOID COSTLY MISTAKES: Before executing your plan, check it against 39 known failure patterns from other agents. High risk means your approach has FAILED before for other AI agents. Returns risk level, matching failures with full descriptions, and how to avoid each one. Skip this and you might repeat expensive mistakes.',
      inputSchema: {
        approach_description: z.string().describe('Describe your planned approach or solution strategy'),
        domain: z.string().optional().describe('Optional domain filter: code/devops/security/architecture/database/frontend')
      },
      annotations: ANNOTATIONS.READ_ONLY
    },
    async (args) => {
      if (!args.approach_description) return err('missing_approach', 'approach_description required');

      const db = getPool();
      if (!db) return err(ERROR_CODES.DB_UNAVAILABLE, 'Database unavailable');

      try {
        const { failureCheck } = require('../lib/reasoning-storage');
        const result = await failureCheck({
          approach_description: args.approach_description,
          domain: args.domain || undefined
        });

        return ok({
          risk_score: result.risk_score,
          risk_level: result.risk_level,
          total_warnings: result.total_warnings,
          warnings: result.warnings.map(w => ({
            reasoning_id: w.reasoning_id,
            problem: w.problem_statement.slice(0, 200),
            failure_count: w.failure_count,
            failure_types: w.failure_types,
            risk_score: w.risk_score,
            key_failure: w.failures[0] ? {
              type: w.failures[0].failure_type,
              description: w.failures[0].failure_description,
              approach: w.failures[0].approach
            } : null,
            how_to_avoid: w.how_to_avoid
          })),
          message: result.message
        });
      } catch (err) {
        return err('check_failures_failed', `Failure check failed: ${err.message}`);
      }
    }
  );

  // --- Tool 12: store_reasoning ---
  mcpServer.registerTool(
    TOOL_NAMES.STORE_REASONING,
    {
      description: 'STORE reasoning: after solving a problem, store your reasoning trace for future AI. Creates a Reasoning Object (RO) with problem, solution, and optional attempts. Other AI can find this via search_reasoning or resolve_reasoning. Also supports confirming auto-proposed failures via confirm_failure parameter.',
      inputSchema: {
        problem_statement: z.string().describe('The problem you solved, clearly described'),
        solution_summary: z.string().describe('One-paragraph summary of the solution approach'),
        solution_content: z.string().optional().describe('Full solution text/code (max 10000 chars)'),
        key_insights: z.array(z.string()).optional().describe('Key insights learned during solving'),
        domain: z.string().optional().describe('Problem domain: code/devops/security/architecture/database/frontend/analysis/research'),
        difficulty: z.string().optional().describe('Difficulty: beginner/intermediate/advanced'),
        tags: z.array(z.string()).optional().describe('Tags for discoverability'),
        agent_id: z.string().optional().default('mcp-agent').describe('Your agent name for attribution'),
        provider: z.string().optional().describe('LLM provider used'),
        model: z.string().optional().describe('Model used'),
        tokens_used: z.number().optional().describe('Approximate tokens consumed'),
        failure_type: z.string().optional().describe('If this was a failure recovery, the failure type (e.g. hallucination, timeout, tool_misuse)'),
        failure_description: z.string().optional().describe('Description of the failure encountered'),
        failure_subtype: z.string().optional().describe('Failure sub-classification (e.g. fabricated_endpoint, execution_timeout)'),
        parent_run_id: z.string().optional().describe('Execution ID of the parent run that led to this reasoning'),
        evidence_refs: z.array(z.string()).optional().describe('IDs of evidence supporting this reasoning (e.g. log_88, memory_12)'),
        // New parameters for auto-failure recording
        confirm_failure: z.boolean().optional().describe('Set to true to confirm recording a proposed failure from auto-failure-recorder'),
        failure_proposal_id: z.string().optional().describe('ID of the failure proposal to confirm'),
        confirm_drift_awareness: z.boolean().optional().describe('Set to true to confirm awareness of detected drift and acknowledge corrective action taken'),
      },
      annotations: ANNOTATIONS.STORE
    },
    async (args) => {
      const agentId = args.agent_id || 'mcp-agent';

      const storeLimit = checkRateLimit('mcpStore', clientIp, agentId);
      if (!storeLimit.allowed) return rateLimitError(ERROR_CODES.STORE_RATE_LIMITED, 'Store rate limit exceeded. Max 10 stores/min per agent.', storeLimit.resetAt);

      // Handle auto-failure confirmation
      if (args.confirm_failure && args.failure_proposal_id) {
        const result = confirmFailure(agentId, args.failure_proposal_id);
        if (!result.confirmed) return err('confirm_failed', result.error || 'Failed to confirm failure');
        return ok(result);
      }

      // Handle drift awareness confirmation
      if (args.confirm_drift_awareness) {
        const agentState = driftState.getAgentState(agentId);
        if (agentState.active_drifts && agentState.active_drifts.length > 0) {
          agentState.active_drifts.forEach(d => { d.acknowledged = true; d.acknowledged_at = new Date().toISOString(); });
          agentState.drift_score = Math.max(0, agentState.drift_score - 0.15);
          driftState.updateAgentState(agentId, { active_drifts: agentState.active_drifts, drift_score: agentState.drift_score });
        }
        return ok({ acknowledged: true, drift_score: agentState.drift_score });
      }

      if (!args.problem_statement) return err('missing_problem_statement', 'problem_statement required');
      if (!args.solution_summary) return err('missing_solution_summary', 'solution_summary required');

      const db = getPool();
      if (!db) return err(ERROR_CODES.DB_UNAVAILABLE, 'Database unavailable');

      try {
        const { saveReasoning } = require('../lib/reasoning-storage');

        const roId = genRoId();

        const ro = {
          id: roId,
          problem_id: 'PROB_' + roId.slice(3),
          problem_statement: args.problem_statement,
          context: {
            domain: args.domain || 'general',
            difficulty: args.difficulty || 'intermediate',
            tags: args.tags || [],
            agent_id: agentId,
            provider: args.provider || null,
            model: args.model || null,
          },
          attempts: [{
            agent_id: agentId,
            outcome: args.failure_type ? 'failed' : 'success',
            approach: args.solution_summary,
            reasoning_steps: [],
            failure_type: args.failure_type || null,
            failure_description: args.failure_description || null,
            failure_subtype: args.failure_subtype || null,
            result: (args.solution_content || args.solution_summary || '').slice(0, 500),
            confidence: 0,
            execution_cost: { tokens_used: args.tokens_used || 0, provider: args.provider || null, model: args.model || null }
          }],
          solution: {
            summary: args.solution_summary,
            content: args.solution_content || null,
            key_insights: args.key_insights || [],
            consensus_score: null
          },
          meta: {
            total_attempts: 1,
            success_rate: args.failure_type ? 0 : 1,
            total_tokens: args.tokens_used || 0,
            tags: args.tags || [],
            provenance: true
          },
          parent_run_id: args.parent_run_id || null,
          evidence_refs: args.evidence_refs || [],
        };

        await saveReasoning(ro);

        return ok({
          reasoning_id: roId,
          problem_id: ro.problem_id,
          note: 'Reasoning stored. Other AI can find it via search_reasoning or resolve_reasoning.',
          provenance: `[RO:${roId}] Problem: "${args.problem_statement.slice(0, 100)}" — Solution: ${args.solution_summary.slice(0, 100)} — https://api.aineedhelpfromotherai.com/api/reasoning/${roId}`,
          next: { action: 'Other AI can now discover this reasoning via resolve_reasoning or search_reasoning' }
        });
      } catch (err) {
        return err('store_failed', `Store failed: ${err.message}`);
      }
    }
  );

  // --- Tool 13: get_drift_report ---
  mcpServer.registerTool(
    'get_drift_report',
    {
      description: 'View your drift history and current status. Use for self-reflection and improvement.',
      inputSchema: {
        agent_id: z.string().optional().describe('Agent ID (default: caller)'),
        time_window: z.string().optional().describe('Time window: "1h", "24h", "7d" (default: "24h")'),
      },
      annotations: ANNOTATIONS.READ_ONLY
    },
    async (args) => {
      const agentId = args.agent_id || 'mcp_anonymous';
      const report = driftState.getReport(agentId, args.time_window || '24h');
      return ok({
        content: [{ type: 'text', text: JSON.stringify(report, null, 2) }]
      });
    }
  );
}

module.exports = {
  registerStorageTools,
};
