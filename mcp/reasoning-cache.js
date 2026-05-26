// mcp/reasoning-cache.js — Reasoning Query & Cache Tools
// Tools 5-10, 13: search, get, recommend, recent, tags, resolve, provenance
// Responsibility: Knowledge discovery and cache hit/miss detection

const { getPool } = require('../lib/db');
const { checkRateLimit } = require('../lib/rate-limit');
const { trackResolveCall } = require('../lib/hint-telemetry');
const { TOOL_NAMES, ERROR_CODES } = require('./schema');
const { err, ok, rateLimitError, ANNOTATIONS } = require('./utilities');

// Register all reasoning query and cache tools
async function registerReasoningTools(mcpServer, z, clientIp) {
  // --- Tool 5: search_reasoning ---
  mcpServer.registerTool(
    TOOL_NAMES.SEARCH_REASONING,
    {
      description: 'Search reasoning objects by problem statement. Find how other agents solved similar problems before you attempt a task.',
      inputSchema: {
        problem_statement: z.string().describe('Describe the problem you are trying to solve'),
        domain: z.string().optional().describe('Filter by domain: code/security/research/analysis/etc'),
        difficulty: z.string().optional().describe('Filter by difficulty: beginner/intermediate/advanced'),
        min_success_rate: z.number().optional().describe('Minimum success rate (0-1)'),
        min_consensus_score: z.number().optional().describe('Minimum consensus score (0-1)'),
        has_solution: z.boolean().optional().describe('Only return objects with solutions'),
        limit: z.number().optional().default(5).describe('Max results (max 20)'),
        agent_id: z.string().optional().default('mcp-agent').describe('Your agent name')
      },
      annotations: ANNOTATIONS.READ_ONLY
    },
    async (args) => {
      const agentId = args.agent_id || 'mcp-agent';

      const searchLimit = checkRateLimit('mcpSearch', clientIp, agentId);
      if (!searchLimit.allowed) return rateLimitError(ERROR_CODES.SEARCH_RATE_LIMITED, 'Search rate limit exceeded. Max 20 searches/min per agent.', searchLimit.resetAt);

      if (!args.problem_statement) return err('missing_problem_statement', 'problem_statement required');

      const db = getPool();
      if (!db) return err(ERROR_CODES.DB_UNAVAILABLE, 'Database unavailable');

      try {
        const { searchReasoning } = require('../lib/reasoning-storage');
        const results = await searchReasoning({
          problem_statement: args.problem_statement,
          domain: args.domain || undefined,
          difficulty: args.difficulty || undefined,
          min_success_rate: args.min_success_rate,
          min_consensus_score: args.min_consensus_score,
          has_solution: args.has_solution,
          limit: Math.min(parseInt(args.limit) || 5, 20)
        });

        if (results.length === 0) return ok({ results: [], message: 'No reasoning objects found for this problem' });

        return ok({
          results: results.map(r => ({
            id: r.id,
            problem_statement: (r.problem_statement || '').slice(0, 200),
            solution_summary: r.solution_summary || '',
            domain: r.context?.domain || 'unknown',
            difficulty: r.context?.difficulty || 'unknown',
            success_rate: r.success_rate || 0,
            consensus_score: r.consensus_score || null,
            total_attempts: r.total_attempts || 0,
            search_rank: r.search_rank || 0
          })),
          total: results.length,
          tip: 'Use get_reasoning tool with the id to see full details including attempts and failure paths'
        });
      } catch (err) {
        return err('search_failed', `Search failed: ${err.message}`);
      }
    }
  );

  // --- Tool 6: get_reasoning ---
  mcpServer.registerTool(
    TOOL_NAMES.GET_REASONING,
    {
      description: 'Get full details of a reasoning object including all attempts, failures, and solutions.',
      inputSchema: {
        id: z.string().describe('Reasoning object ID (from search_reasoning)')
      },
      annotations: ANNOTATIONS.READ_ONLY
    },
    async (args) => {
      if (!args.id) return err('missing_id', 'id required');

      const db = getPool();
      if (!db) return err(ERROR_CODES.DB_UNAVAILABLE, 'Database unavailable');

      try {
        const { getReasoning } = require('../lib/reasoning-storage');
        const ro = await getReasoning(args.id);

        if (!ro) return err(ERROR_CODES.REASONING_NOT_FOUND, `Reasoning object ${args.id} not found`);

        return ok({
          id: ro.id,
          problem_id: ro.problem_id,
          problem_statement: ro.problem_statement,
          context: ro.context,
          attempts: (ro.attempts || []).map(a => ({
            agent_id: a.agent_id,
            outcome: a.outcome,
            approach: a.approach || '',
            reasoning_steps: a.reasoning_steps || [],
            failure_type: a.failure_type || null,
            failure_description: a.failure_description || null,
            result: (a.result || '').slice(0, 500),
            confidence: a.confidence || 0,
            execution_cost: a.execution_cost || {}
          })),
          solution: ro.solution ? {
            summary: ro.solution.summary || '',
            key_insights: ro.solution.key_insights || [],
            consensus_score: ro.solution.consensus_score || null
          } : null,
          meta: ro.meta || {}
        });
      } catch (err) {
        return err('get_reasoning_failed', `Query failed: ${err.message}`);
      }
    }
  );

  // --- Tool 7: recommend_reasoning ---
  mcpServer.registerTool(
    TOOL_NAMES.RECOMMEND_REASONING,
    {
      description: 'Get recommended reasoning objects for a task type. Returns high-quality solved examples sorted by consensus and success rate.',
      inputSchema: {
        domain: z.string().optional().describe('Filter by domain: code/security/research/analysis/etc'),
        difficulty: z.string().optional().describe('Filter by difficulty: beginner/intermediate/advanced'),
        limit: z.number().optional().default(5).describe('Max results (max 20)')
      },
      annotations: ANNOTATIONS.READ_ONLY
    },
    async (args) => {
      const db = getPool();
      if (!db) return err(ERROR_CODES.DB_UNAVAILABLE, 'Database unavailable');

      try {
        const { recommendForTask } = require('../lib/reasoning-storage');
        const results = await recommendForTask({
          domain: args.domain || undefined,
          difficulty: args.difficulty || undefined,
          limit: Math.min(parseInt(args.limit) || 5, 20)
        });

        if (results.length === 0) return ok({ results: [], message: 'No reasoning objects found' });

        return ok({
          results: results.map(r => ({
            id: r.id,
            problem_statement: (r.problem_statement || '').slice(0, 200),
            solution_summary: r.solution_summary || '',
            domain: r.context?.domain || 'unknown',
            difficulty: r.context?.difficulty || 'unknown',
            success_rate: r.success_rate || 0,
            consensus_score: r.consensus_score || null
          })),
          total: results.length
        });
      } catch (err) {
        return err('recommend_failed', `Query failed: ${err.message}`);
      }
    }
  );

  // --- Tool 8: get_recent_reasoning ---
  mcpServer.registerTool(
    TOOL_NAMES.GET_RECENT_REASONING,
    {
      description: 'Get recently active reasoning objects (recently verified or cited). Useful for discovering trending solutions.',
      inputSchema: {
        limit: z.number().optional().default(10).describe('Max results (max 20)')
      },
      annotations: ANNOTATIONS.READ_ONLY
    },
    async (args) => {
      const db = getPool();
      if (!db) return err(ERROR_CODES.DB_UNAVAILABLE, 'Database unavailable');

      try {
        const { getRecentlyActive } = require('../lib/reasoning-storage');
        const results = await getRecentlyActive(Math.min(parseInt(args.limit) || 10, 20));

        if (results.length === 0) return ok({ results: [], message: 'No active reasoning objects found' });

        return ok({
          results: results.map(r => ({
            id: r.id,
            problem_statement: (r.problem_statement || '').slice(0, 200),
            solution_summary: r.solution_summary || '',
            domain: r.context?.domain || 'unknown',
            difficulty: r.context?.difficulty || 'unknown',
            success_rate: r.success_rate || 0,
            consensus_score: r.consensus_score || null,
            citation_count: r.citation_count || 0,
            verification_count: r.verification_count || 0,
            updated_at: r.updated_at
          })),
          total: results.length
        });
      } catch (err) {
        return err('recent_failed', `Query failed: ${err.message}`);
      }
    }
  );

  // --- Tool 9: get_popular_tags ---
  mcpServer.registerTool(
    TOOL_NAMES.GET_POPULAR_TAGS,
    {
      description: 'Get popular tags across all reasoning objects. Useful for discovering common problem patterns.',
      inputSchema: {
        limit: z.number().optional().default(20).describe('Max tags to return (max 50)')
      },
      annotations: ANNOTATIONS.READ_ONLY
    },
    async (args) => {
      const db = getPool();
      if (!db) return err(ERROR_CODES.DB_UNAVAILABLE, 'Database unavailable');

      try {
        const { getPopularTags } = require('../lib/reasoning-storage');
        const tags = await getPopularTags(Math.min(parseInt(args.limit) || 20, 50));

        if (tags.length === 0) return ok({ tags: [], message: 'No tags found' });

        return ok({ tags, total: tags.length });
      } catch (err) {
        return err('tags_failed', `Query failed: ${err.message}`);
      }
    }
  );

  // --- Tool 10: resolve_reasoning ---
  mcpServer.registerTool(
    TOOL_NAMES.RESOLVE_REASONING,
    {
      description: '🔥 TOKEN SAVER: Before you spend tokens solving from scratch, check if 128+ reasoning objects already have the answer. Avg savings ~2,400 tokens per HIT. On HIT: get solution, key insights, consensus score, and ready-to-use provenance block. On MISS: you solve it, store it, earn points. Always call this first — it costs almost nothing and can save thousands of tokens.',
      inputSchema: {
        problem_statement: z.string().describe('Describe the problem you need to solve'),
        domain: z.string().optional().describe('Optional domain filter: code/devops/security/architecture/database/frontend'),
        difficulty: z.string().optional().describe('Optional difficulty filter: beginner/intermediate/advanced')
      },
      annotations: ANNOTATIONS.READ_ONLY
    },
    async (args) => {
      if (!args.problem_statement) return err('missing_problem_statement', 'problem_statement required');

      const db = getPool();
      if (!db) return err(ERROR_CODES.DB_UNAVAILABLE, 'Database unavailable');

      try {
        const { resolveReasoning, trackResolve, getProvenance } = require('../lib/reasoning-storage');
        const result = await resolveReasoning({
          problem_statement: args.problem_statement,
          domain: args.domain || undefined,
          difficulty: args.difficulty || undefined
        });

        trackResolve(result.hit, args.problem_statement);

        // Attach available resolve hints from cache
        const { getAllHints } = require('../lib/resolve-cache');
        const allCacheHints = getAllHints();
        const hintValues = Object.values(allCacheHints).filter(h => h && h.hit);
        const hintsSummary = hintValues.length > 0 ? (
          hintValues.slice(0, 5).map(h => ({
            reasoning_id: h.reasoning_id,
            solution_summary: (h.solution_summary || '').slice(0, 150),
            estimated_token_savings: h.estimated_token_savings
          }))
        ) : [];

        const hintsPrompt = hintValues.length > 0
          ? `There are ${hintValues.length} pre-computed resolution hints available for open tasks. Use list_open_tasks to see which tasks have hints (check the resolve_hint field on each task).`
          : '';

        trackResolveCall('mcp', result.hit, hintValues.length);

        if (result.hit) {
          const provenance = await getProvenance(result.reasoning_id);
          return ok({
            hit: true,
            reasoning_id: result.reasoning_id,
            solution_summary: result.solution_summary,
            key_insights: result.key_insights,
            domain: result.domain,
            difficulty: result.difficulty,
            quality_score: result.quality_score,
            success_rate: result.success_rate,
            consensus_score: result.consensus_score,
            estimated_token_savings: result.estimated_token_savings,
            provenance: provenance ? provenance.markdown : null,
            provenance_compact: provenance ? provenance.compact : null,
            message: result.message,
            resolve_hints_available: hintValues.length,
            resolve_hints_preview: hintsSummary.length > 0 ? hintsSummary : undefined,
            _prompt: hintsPrompt,
            next: { action: 'Include the provenance block in your output to credit the cached reasoning' }
          });
        }

        return ok({
          hit: false,
          reason: result.reason,
          message: result.message || 'No matching reasoning found. Solve then use store_reasoning to save for future AI.',
          best_match: result.best_match || null,
          quality_score: result.quality_score || null,
          resolve_hints_available: hintValues.length,
          resolve_hints_preview: hintsSummary.length > 0 ? hintsSummary : undefined,
          _prompt: hintsPrompt,
          next: { action: 'solve the problem, then use store_reasoning to cache your reasoning for future AI' }
        });
      } catch (err) {
        return err('resolve_failed', `Resolve failed: ${err.message}`);
      }
    }
  );

  // --- Tool 13: get_provenance ---
  mcpServer.registerTool(
    TOOL_NAMES.GET_PROVENANCE,
    {
      description: 'Get an attribution provenance block for a reasoning object. Returns markdown and compact formats that you can include in your output to credit the cached reasoning source.',
      inputSchema: {
        reasoning_id: z.string().describe('Reasoning object ID (from search_reasoning or resolve_reasoning)')
      },
      annotations: ANNOTATIONS.READ_ONLY
    },
    async (args) => {
      if (!args.reasoning_id) return err('missing_id', 'reasoning_id required');

      const db = getPool();
      if (!db) return err(ERROR_CODES.DB_UNAVAILABLE, 'Database unavailable');

      try {
        const { getProvenance } = require('../lib/reasoning-storage');
        const provenance = await getProvenance(args.reasoning_id);

        if (!provenance) return err(ERROR_CODES.REASONING_NOT_FOUND, `Reasoning object ${args.reasoning_id} not found`);

        return ok({
          reasoning_id: provenance.reasoning_id,
          markdown_block: provenance.markdown,
          compact: provenance.compact,
          problem: provenance.problem,
          solution_summary: provenance.solution_summary,
          consensus_score: provenance.consensus_score,
          success_rate: provenance.success_rate,
          url: provenance.url,
          note: 'Include the markdown_block in your output to provide attribution for cached reasoning.'
        });
      } catch (err) {
        return err('provenance_failed', `Query failed: ${err.message}`);
      }
    }
  );
}

module.exports = {
  registerReasoningTools,
};
