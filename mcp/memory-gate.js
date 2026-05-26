// mcp/memory-gate.js — MCP tool for Memory Inference Gate
// Registers memory_gate MCP tool: force retrieval + verify filter + anti-hallucination

async function registerMemoryGateTools(mcpServer, z, clientIp) {
  mcpServer.tool(
    'memory_gate',
    'Force memory retrieval before agent reasoning. Returns verified fixes, force-injected memories, blocked memories, and conflict overrides.',
    {
      query: z.string().describe('Task description or error message to search for'),
      agent_id: z.string().optional().describe('Agent identifier for trust-level evaluation'),
      trust_level: z.number().min(0).max(1).optional().describe('Override trust level (0-1). Low trust agents only get sandbox_passed+ memories'),
      strict_verified: z.boolean().optional().describe('If true, only return sandbox_passed or production_confirmed memories'),
    },
    async (args, ctx) => {
      const memoryGate = require('../lib/memory-gate');
      const result = memoryGate.evaluateGate(args.query, {
        agent_id: args.agent_id || 'mcp_anonymous',
        trust_level: args.trust_level,
      });

      // Apply strict_verified filter if requested
      let finalMemories = result;
      if (args.strict_verified) {
        finalMemories.retrieved_memories = finalMemories.retrieved_memories.filter(m =>
          m.verification_tier === 'sandbox_passed' || m.verification_tier === 'production_confirmed'
        );
        finalMemories.force_injected = finalMemories.force_injected.filter(m =>
          m.verification_tier === 'sandbox_passed' || m.verification_tier === 'production_confirmed'
        );
      }

      const res = {
        content: [{
          type: 'text',
          text: [
            `Memory Gate for: "${args.query}"`,
            '',
            mustUseMemory(result) ? '⚠️ MEMORY MUST BE USED — relevant fixes exist' : 'No relevant memory found — proceeding without context',
            '',
            result.augmented_context,
            ...(result.risk_flags.length > 0 ? ['', 'Risk flags:', ...result.risk_flags.map(f => `  - ${f.type}${f.count ? ` (${f.count})` : ''}`)] : []),
            '',
            `Gates: ${result.gates_passed} passed, ${result.gates_filtered} after filter`,
            `Force injected: ${result.force_injected.length}`,
            `Blocked: ${result.blocked_memories.length}`,
            `Conflict overrides: ${result.conflict_overrides.length}`,
          ].filter(Boolean).join('\n'),
        }],
      };

      if (mustUseMemory(result)) {
        res.content.push({
          type: 'text',
          text: `\n[MEMORY DIRECTIVE] You MUST read and apply the above memory context before starting. Do not attempt approaches listed in <DO_NOT_ATTEMPT>.`,
        });
      }

      return res;
    }
  );
}

function mustUseMemory(result) {
  return result.must_use_memory === true ||
    result.force_injected.length > 0 ||
    result.retrieved_memories.length > 0 ||
    result.conflict_overrides.length > 0;
}

module.exports = { registerMemoryGateTools };
