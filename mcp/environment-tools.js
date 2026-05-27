// mcp/environment-tools.js — MCP tools for Environment Memory Layer
// Registers check_environment and get_known_failures MCP tools.
// Agents call these BEFORE executing fragile operations.

async function registerEnvironmentTools(mcpServer, z) {
  // Tool 1: check_environment — query environment-aware memory
  mcpServer.tool(
    'check_environment',
    'Query the environment-aware memory layer for known failure patterns matching your current environment. BEFORE executing fragile operations like docker build, npm install, or pip install, call this to check if your environment has known issues.',
    {
      problem: z.string().describe('What you are trying to do or what error you see: e.g. "docker build cache corruption", "npm install fails with ERR_INVALID_PACKAGE_TARGET"'),
      environment: z.string().optional().describe('Your environment context: e.g. "node20 docker27 ubuntu22", "python3.11 macos14", "npm10 windows"'),
      limit: z.number().max(10).optional().describe('Max results to return (default 3)'),
    },
    async (args) => {
      try {
        const envApi = require('../lib/environment-api');
        const result = envApi.query({
          problem: args.problem,
          environment: args.environment || '',
          limit: args.limit || 3,
        });

        if (result.total_matches === 0) {
          return {
            content: [{ type: 'text', text: JSON.stringify({
              query: args.problem,
              detected_environment: result.detected_environment,
              total_matches: 0,
              results: [],
              note: 'No known failure patterns match your query. The environment memory layer has not yet encountered this combination. Consider proceeding with caution and contributing a memory entry if you hit an issue.',
            }, null, 2) }],
          };
        }

        return {
          content: [{ type: 'text', text: JSON.stringify({
            query: args.problem,
            detected_environment: result.detected_environment,
            total_matches: result.total_matches,
            results: result.results.map(r => ({
              summary: r.summary.slice(0, 300),
              relevance_score: r.score,
              verification_tier: r.verification_tier,
              status: r.status,
              category: r.category,
              tags: r.tags,
              breakage_patterns: r.breakage_patterns,
              source: r.source,
              source_url: r.source_url || undefined,
            })),
            _tip: result.total_matches > 0
              ? 'These memory entries match your environment and problem. Review them before executing to avoid known pitfalls.'
              : undefined,
          }, null, 2) }],
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: 'query_failed', message: e.message }, null, 2) }],
          isError: true,
        };
      }
    }
  );

  // Tool 2: get_known_failures — list all known failure patterns
  mcpServer.tool(
    'get_known_failures',
    'Get all known failure patterns with task counts and severity. Use this to understand what types of failures the system has learned before executing. Filter by pattern name or category.',
    {
      pattern: z.string().optional().describe('Filter by breakage pattern: stale_cache, hallucinated_flag, deprecated_api, version_mismatch, lockfile_conflict, missing_module, timeout, permission_error, network_error, out_of_memory'),
      category: z.string().optional().describe('Filter by category: docker, npm, pip, rust, cli, reliability, dependency'),
    },
    async (args) => {
      try {
        const registry = require('../lib/failure-registry');
        if (args.pattern || args.category) {
          const q = args.pattern ? args.pattern : 'category:' + args.category;
          const result = registry.query(q);
          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          };
        }
        const summary = registry.getSummary();
        return {
          content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }],
        };
      } catch (e) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: 'query_failed', message: e.message }, null, 2) }],
          isError: true,
        };
      }
    }
  );
}

module.exports = { registerEnvironmentTools };
