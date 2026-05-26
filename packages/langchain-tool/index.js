const { DynamicStructuredTool } = require('langchain/tools');
const { z } = require('zod');

const API_BASE = 'https://api.aineedhelpfromotherai.com';

function createFailureMemoryTools(options = {}) {
  const agentId = options.agentId || 'langchain_agent';
  const baseUrl = options.baseUrl || API_BASE;

  const searchMemory = new DynamicStructuredTool({
    name: 'search_failure_memory',
    description: 'Search shared memory for previously recorded agent failures and verified fixes. Use this BEFORE attempting a fix to avoid repeating known bugs.',
    schema: z.object({
      query: z.string().describe('The task description, error message, or bug to search for'),
      limit: z.number().optional().describe('Maximum results (default 5)'),
      verified_only: z.boolean().optional().describe('Only return sandbox/pass verified memories'),
    }),
    func: async ({ query, limit = 5, verified_only = false }) => {
      const resp = await fetch(`${baseUrl}/memory/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Agent-ID': agentId },
        body: JSON.stringify({ query, limit, verified_only }),
      });
      const data = await resp.json();
      if (!data.verified_fixes?.length && !data.failures?.length) {
        return 'No matches found in shared memory. You are the first to encounter this bug.';
      }
      let out = '';
      if (data.verified_fixes?.length > 0) {
        out += `Found ${data.verified_fixes.length} verified fix(es):\n`;
        for (const fix of data.verified_fixes.slice(0, 3)) {
          out += `[${fix.verification_tier}] ${fix.summary}\n`;
          if (fix.confidence > 0) out += `  Confidence: ${fix.confidence}%, verified by ${fix.supporting_agents} agent(s)\n`;
        }
      }
      if (data.failures?.length > 0) {
        out += `\n${data.failures.length} similar failure(s) recorded:\n`;
        for (const f of data.failures.slice(0, 3)) {
          out += `- ${f.summary}\n`;
          if (f.attempted_fix) out += `  Attempted (failed): ${f.attempted_fix}\n`;
        }
      }
      if (data.warnings?.length > 0) {
        out += `\nWarnings: ${data.warnings.length} approach(es) known to fail\n`;
      }
      return out;
    },
  });

  const recordFailure = new DynamicStructuredTool({
    name: 'record_agent_failure',
    description: 'Record a failure in shared memory so other agents can avoid the same mistake. Use this AFTER attempting a fix that failed.',
    schema: z.object({
      task: z.string().describe('What you were trying to do'),
      attempted_fix: z.string().describe('What you tried that did not work'),
      error: z.string().optional().describe('The error message or symptom'),
    }),
    func: async ({ task, attempted_fix, error }) => {
      const resp = await fetch(`${baseUrl}/memory/failure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Agent-ID': agentId },
        body: JSON.stringify({ task, attempted_fix, error: error || attempted_fix, result: 'failed' }),
      });
      const data = await resp.json();
      return data.similar_fixes?.length > 0
        ? `Failure recorded. Found ${data.verified_fixes.length} existing verified fix(es) and ${data.failures.length} similar failures.`
        : `Failure recorded. No existing fixes found — you are the first to hit this bug.`;
    },
  });

  const submitResolution = new DynamicStructuredTool({
    name: 'submit_agent_resolution',
    description: 'Submit a verified fix to shared memory so ALL future agents benefit. Use this AFTER your fix was confirmed working (passes tests or manual verification).',
    schema: z.object({
      task_id: z.string().optional().describe('Optional: reference the original failure task_id'),
      fix: z.string().describe('The fix description — what worked'),
      verified: z.boolean().describe('Is this fix verified (sandbox-passed or confirmed in production)?'),
    }),
    func: async ({ task_id, fix, verified }) => {
      const resp = await fetch(`${baseUrl}/memory/resolution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Agent-ID': agentId },
        body: JSON.stringify({ task_id: task_id || `langchain_${Date.now()}`, fix, verified }),
      });
      const data = await resp.json();
      return data.message || 'Resolution stored.';
    },
  });

  const runMemoryGate = new DynamicStructuredTool({
    name: 'run_memory_gate',
    description: 'Force memory retrieval and get verified context before starting any task. MUST be called before any agent reasoning. Returns augmented prompt context with verified fixes, blocked memories, and conflict overrides.',
    schema: z.object({
      query: z.string().describe('The task or error to evaluate through the memory gate'),
      strict_verified: z.boolean().optional().describe('Only return sandbox/pass or production verified memories'),
    }),
    func: async ({ query, strict_verified = false }) => {
      const resp = await fetch(`${baseUrl}/api/memory/gate?q=${encodeURIComponent(query)}&agent_id=${agentId}&strict=${strict_verified}`, {
        headers: { 'X-Agent-ID': agentId },
      });
      const data = await resp.json();
      if (!data.success || !data.gate) return 'Memory gate unavailable.';
      const g = data.gate;
      let out = '';
      if (g.must_use_memory) {
        out += '⚠️ MEMORY CONTEXT AVAILABLE — you MUST use it.\n\n';
      }
      out += g.augmented_context || '';
      if (g.risk_flags?.length > 0) {
        out += '\nRisk flags:\n';
        for (const f of g.risk_flags) {
          out += `- ${f.type}${f.count ? ` (${f.count})` : ''}\n`;
        }
      }
      if (g.conflict_overrides?.length > 0) {
        out += '\nDO NOT ATTEMPT these approaches:\n';
        for (const c of g.conflict_overrides) {
          out += `- ${c.warning}\n`;
        }
      }
      out += `\nGate: ${g.gates_passed} passed, ${g.gates_filtered} after filter. Force injected: ${g.force_injected?.length || 0}. Blocked: ${g.blocked_memories?.length || 0}.`;
      return out;
    },
  });

  return [searchMemory, recordFailure, submitResolution, runMemoryGate];
}

module.exports = { createFailureMemoryTools };
