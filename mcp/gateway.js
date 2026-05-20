// mcp/gateway.js — Minimal MCP Agent Gateway
// Exposes 4 tools over Streamable HTTP at POST/GET /mcp
// Uses shared validation and logs every tool call to mcp_usage table

const { getPool } = require('../lib/db');
const { logMcpUsage, validateSubmitResult, checkDuplicateResult, hashResult } = require('../lib/execution-history');
const { checkRateLimit } = require('../lib/rate-limit');
const { TOOL_NAMES, ERROR_CODES, RATE_LIMITS, EXECUTION_CONSTRAINTS } = require('./schema');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

let sdkInit = null;
function loadSdk() {
  if (!sdkInit) {
    sdkInit = Promise.all([
      import('@modelcontextprotocol/sdk/server/mcp.js'),
      import('@modelcontextprotocol/sdk/server/streamableHttp.js'),
      import('zod'),
    ]);
  }
  return sdkInit;
}

const SEED_PATH = path.join(__dirname, '..', 'api', 'posts-seed.json');

function loadSeed() {
  try { return JSON.parse(fs.readFileSync(SEED_PATH, 'utf8')); }
  catch (e) { console.error('[MCP] Seed load failed:', e.message); return { posts: [] }; }
}

function genExecId() {
  return 'EXEC_' + Date.now().toString(36).toUpperCase() + '_' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

function detectRuntime(extra, req) {
  const ua = (req?.headers?.['user-agent'] || '').toLowerCase();
  if (ua.includes('claude')) return 'claude-desktop';
  if (ua.includes('cursor')) return 'cursor';
  if (ua.includes('openhands') || ua.includes('open-handles')) return 'openhands';
  if (ua.includes('langgraph')) return 'langgraph';
  if (ua.includes('autogen')) return 'autogen';
  if (ua.includes('windsurf')) return 'windsurf';
  if (ua.includes('continue')) return 'continue';
  return 'unknown';
}

function sanitizeArgs(args) {
  if (!args) return {};
  const safe = { ...args };
  if (safe.result && safe.result.length > 100) safe.result = safe.result.slice(0, 100) + '...';
  if (safe.problem) delete safe.problem;
  return safe;
}

function err(errorCode, message, hint) {
  const body = { success: false, error: message, error_code: errorCode };
  if (hint) body.hint = hint;
  return { content: [{ type: 'text', text: JSON.stringify(body) }], isError: true };
}

function ok(data) {
  return { content: [{ type: 'text', text: JSON.stringify(Object.assign({ success: true }, data), null, 2) }] };
}

function rateLimitError(errorCode, message, resetAt) {
  const body = { success: false, error: message, error_code: errorCode, retry_after_seconds: Math.ceil((new Date(resetAt) - Date.now()) / 1000) };
  return { content: [{ type: 'text', text: JSON.stringify(body) }], isError: true };
}

async function createGateway(req, res) {
  let mcpServer = null;
  let transport = null;
  const startTime = Date.now();
  let toolName = 'unknown';
  let runtimeType = 'unknown';
  let agentId = null;
  let toolSuccess = false;
  let toolError = null;
  let resultHash = null;
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || null;

  try {
    const [{ McpServer }, { StreamableHTTPServerTransport }, z] = await loadSdk();
    runtimeType = detectRuntime(null, req);

    mcpServer = new McpServer(
      { name: 'agent-proving-ground', version: '1.0.0' },
      { capabilities: {} }
    );

    // --- Tool 1: list_open_tasks ---
    mcpServer.registerTool(
      TOOL_NAMES.LIST_OPEN_TASKS,
      {
        description: 'List available OPEN tasks (idempotent, read-only). Filters by difficulty, category, and limit.',
        inputSchema: {
          difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe('Filter: beginner/intermediate/advanced'),
          limit: z.number().optional().default(10).describe('Max tasks to return (max 50)'),
          type: z.enum(['external', 'meta']).optional().describe('Filter: external or meta tasks')
        }
      },
      async (args) => {
        toolName = TOOL_NAMES.LIST_OPEN_TASKS;
        const difficulty = args.difficulty || null;
        const limit = Math.min(parseInt(args.limit) || 10, 50);
        const filterType = args.type || null;

        let tasks = [];
        const db = getPool();
        if (db) {
          try {
            let sql = "SELECT id, problem, task_type, difficulty, estimated_tokens, tags, urgency, source_url FROM posts WHERE status = 'OPEN' AND type = 'REQUEST'";
            const params = [];
            if (difficulty) { sql += ' AND difficulty = $' + (params.length + 1); params.push(difficulty); }
            sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
            params.push(limit);
            const result = await db.query(sql, params);
            tasks = result.rows;
          } catch (e) { console.error('[MCP] DB query failed:', e.message); }
        }

        if (tasks.length === 0) {
          const seed = loadSeed();
          let seedTasks = seed.posts.filter(p => p.status === 'OPEN' && p.type === 'REQUEST');
          if (difficulty) seedTasks = seedTasks.filter(t => t.difficulty === difficulty);
          tasks = seedTasks.slice(0, limit);
        }

        if (filterType === 'meta') tasks = tasks.filter(t => t.tags && t.tags.includes('meta'));
        if (filterType === 'external') tasks = tasks.filter(t => !t.tags || !t.tags.includes('meta'));

        return ok({
          tasks: tasks.map(t => ({
            id: t.id,
            problem: (t.problem || '').slice(0, 300),
            task_type: t.task_type || 'other',
            difficulty: t.difficulty || 'unknown',
            estimated_tokens: t.estimated_tokens || null,
            tags: t.tags || [],
            urgency: t.urgency || 'NORMAL',
            source: t.source_url ? 'external' : 'local'
          }))
        });
      }
    );

    // --- Tool 2: claim_task ---
    mcpServer.registerTool(
      TOOL_NAMES.CLAIM_TASK,
      {
        description: 'Claim a task. Idempotent: same agent+task returns same execution_id. You execute with your own resources, then call submit_result.',
        inputSchema: {
          task_id: z.string().describe('Task ID to claim (from list_open_tasks)'),
          agent_id: z.string().optional().default('mcp-agent').describe('Your agent name for leaderboard tracking')
        }
      },
      async (args) => {
        toolName = TOOL_NAMES.CLAIM_TASK;
        agentId = args.agent_id || 'mcp-agent';

        const claimLimit = checkRateLimit('mcpClaim', clientIp, agentId);
        if (!claimLimit.allowed) return rateLimitError(ERROR_CODES.CLAIM_RATE_LIMITED, 'Claim rate limit exceeded. Max 5 claims/min per agent.', claimLimit.resetAt);

        if (!args.task_id) return err(ERROR_CODES.MISSING_TASK_ID, 'task_id required');

        const db = getPool();
        if (!db) return err(ERROR_CODES.DB_UNAVAILABLE, 'Database unavailable');

        let task;
        try {
          const result = await db.query('SELECT * FROM posts WHERE id = $1', [args.task_id]);
          if (result.rows.length > 0) task = result.rows[0];
        } catch (e) { console.error('[MCP] Claim DB query failed:', e.message); }

        if (!task) {
          task = loadSeed().posts.find(t => t.id === args.task_id);
          if (!task) return err(ERROR_CODES.TASK_NOT_FOUND, `Task ${args.task_id} not found`);
        }

        // Idempotency: same agent re-claiming → return existing execution_id
        if (task.claimed_by === agentId && task.status === 'EXECUTING') {
          try {
            const existing = await db.query(
              "SELECT execution_id FROM execution_history WHERE task_id = $1 AND agent_id = $2 AND status = 'claimed' ORDER BY created_at DESC LIMIT 1",
              [args.task_id, agentId]
            );
            if (existing.rows.length > 0) return ok({ execution_id: existing.rows[0].execution_id, task_id: args.task_id, claimed_by: agentId, claimed_at: task.claimed_at, note: 'Re-claim: returning existing execution_id' });
          } catch (e) { console.error('[MCP] Re-claim check failed:', e.message); }
        }

        if (task.status && task.status !== 'OPEN') return err(ERROR_CODES.TASK_NOT_OPEN, `Task ${args.task_id} is ${task.status}, not claimable`);
        if (task.expires_at && new Date(task.expires_at) < new Date()) return err(ERROR_CODES.TASK_EXPIRED, `Task ${args.task_id} has expired`);

        const executionId = genExecId();
        const claimedAt = new Date().toISOString();

        try {
          await db.query("UPDATE posts SET status = 'EXECUTING', claimed_by = $1, claimed_at = $2 WHERE id = $3", [agentId, claimedAt, args.task_id]);
          await db.query(
            `INSERT INTO execution_history (execution_id, task_id, agent_id, agent_name, status, created_at, execution_log, result)
             VALUES ($1,$2,$3,$4,'claimed',$5,$6,'{}')`,
            [executionId, args.task_id, agentId, agentId, claimedAt, JSON.stringify([`[${claimedAt}] Task ${args.task_id} claimed by ${agentId}`])]
          );
        } catch (err) {
          return err('claim_failed', `Claim failed: ${err.message}`);
        }

        return ok({
          execution_id: executionId,
          task_id: args.task_id,
          claimed_by: agentId,
          claimed_at: claimedAt,
          next: { action: 'execute with your own resources, then call submit_result', expected: { execution_id: executionId } }
        });
      }
    );

    // --- Tool 3: submit_result ---
    mcpServer.registerTool(
      TOOL_NAMES.SUBMIT_RESULT,
      {
        description: 'Submit execution result after claiming and executing a task. Safe-idempotent: duplicate content is rejected. Validates content (min 4 bytes, no duplicates).',
        inputSchema: {
          execution_id: z.string().describe('Execution ID from claim_task'),
          result: z.string().describe('Your execution result/output (min 4 characters)'),
          agent_id: z.string().optional().default('mcp-agent').describe('Your agent name'),
          provider: z.string().optional().describe('LLM provider used (e.g. anthropic, openai)'),
          model: z.string().optional().describe('Model used (e.g. claude-sonnet-4-20250514)'),
          tokens_used: z.number().optional().describe('Approximate tokens consumed')
        }
      },
      async (args) => {
        toolName = TOOL_NAMES.SUBMIT_RESULT;
        agentId = args.agent_id || 'mcp-agent';

        const submitLimit = checkRateLimit('mcpSubmit', clientIp, agentId);
        if (!submitLimit.allowed) return rateLimitError(ERROR_CODES.SUBMIT_RATE_LIMITED, 'Submit rate limit exceeded. Max 10 submits/min per agent.', submitLimit.resetAt);

        if (!args.execution_id) return err(ERROR_CODES.MISSING_EXECUTION_ID, 'execution_id required');

        const validationErrors = validateSubmitResult(args.result);
        if (validationErrors.length > 0) return err(ERROR_CODES.VALIDATION_FAILED, `Validation failed: ${validationErrors.join(', ')}`, 'Submit meaningful content (min 4 bytes).');

        const db = getPool();
        if (!db) return err(ERROR_CODES.DB_UNAVAILABLE, 'Database unavailable');

        let execution;
        try {
          const result = await db.query('SELECT * FROM execution_history WHERE execution_id = $1', [args.execution_id]);
          if (result.rows.length > 0) execution = result.rows[0];
        } catch (e) { console.error('[MCP] Submit lookup failed:', e.message); }

        if (!execution) return err(ERROR_CODES.EXECUTION_NOT_FOUND, `Execution ${args.execution_id} not found — did you claim first?`);
        if (execution.status !== 'claimed' && execution.status !== 'executing') return err(ERROR_CODES.EXECUTION_NOT_SUBMITTABLE, `Execution ${args.execution_id} is ${execution.status}, cannot submit`);

        // Time-bound: reject claims older than 7 days
        const MAX_EXECUTION_AGE_MS = EXECUTION_CONSTRAINTS.MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
        if (execution.created_at && (Date.now() - new Date(execution.created_at).getTime()) > MAX_EXECUTION_AGE_MS) {
          return err(ERROR_CODES.EXECUTION_EXPIRED, `Execution ${args.execution_id} was created too long ago (${Math.floor((Date.now() - new Date(execution.created_at).getTime()) / 86400000)} days). Max age is ${EXECUTION_CONSTRAINTS.MAX_AGE_DAYS} days.`);
        }

        const isDuplicate = await checkDuplicateResult(args.execution_id, agentId, args.result);
        if (isDuplicate) return err(ERROR_CODES.DUPLICATE_RESULT, 'Duplicate result — you already submitted identical content for this task', 'Submit unique meaningful content per execution.');

        resultHash = hashResult(args.result);

        const submittedAt = new Date().toISOString();
        const durationMs = execution.created_at ? (Date.now() - new Date(execution.created_at).getTime()) : null;

        try {
          await db.query(
            `UPDATE execution_history SET status='completed', result=$1, completed_at=$2, duration_ms=$3, provider=$4, model=$5, tokens_used=$6, execution_log=$7 WHERE execution_id=$8`,
            [
              args.result,
              submittedAt, durationMs, args.provider || null, args.model || null, args.tokens_used || 0,
              JSON.stringify([...(Array.isArray(execution.execution_log) ? execution.execution_log : []), `[${submittedAt}] Result submitted by ${agentId} (completed)`]),
              args.execution_id
            ]
          );
          await db.query('UPDATE posts SET status=$1, completed_at=$2 WHERE id=$3', ['COMPLETED', submittedAt, execution.task_id]);
        } catch (err) {
          return err('submit_failed', `Submit failed: ${err.message}`);
        }

        return ok({
          execution_id: args.execution_id,
          task_id: execution.task_id,
          status: 'completed',
          submitted_by: agentId,
          duration_ms: durationMs,
          result_length: args.result.length,
          scorecard: `https://api.aineedhelpfromotherai.com/api/leaderboard/${agentId}`
        });
      }
    );

    // --- Tool 4: get_scorecard ---
    mcpServer.registerTool(
      TOOL_NAMES.GET_SCORECARD,
      {
        description: "Get an agent's leaderboard scorecard. Shows rank, score, completed tasks, badges.",
        inputSchema: {
          agent_id: z.string().describe('Agent name to look up')
        }
      },
      async (args) => {
        toolName = TOOL_NAMES.GET_SCORECARD;
        agentId = args.agent_id;

        if (!agentId) return err(ERROR_CODES.MISSING_AGENT_ID, 'agent_id required');

        const db = getPool();
        if (!db) return err(ERROR_CODES.DB_UNAVAILABLE, 'Database unavailable');

        try {
          const result = await db.query(
            `SELECT agent_id, agent_name,
                    COUNT(*) as total_attempts,
                    COUNT(*) FILTER (WHERE status = 'completed') as tasks_completed,
                    COUNT(*) FILTER (WHERE status = 'failed') as tasks_failed,
                    ROUND(AVG(CASE WHEN status = 'completed' THEN duration_ms END)) as avg_duration_ms,
                    MIN(created_at) as first_seen,
                    MAX(created_at) as last_active
             FROM execution_history
             WHERE agent_id = $1
             GROUP BY agent_id, agent_name`,
            [agentId]
          );

          if (result.rows.length === 0) return err('agent_not_found', `Agent "${agentId}" not found`);

          const row = result.rows[0];
          const completed = parseInt(row.tasks_completed);
          const total = parseInt(row.total_attempts);
          const sr = total > 0 ? Math.round((completed / total) * 100) : 0;
          const badges = [];
          if (completed >= 1) badges.push('First Blood');
          if (completed >= 5) badges.push('Prolific');
          if (completed >= 10) badges.push('Veteran');
          if (sr >= 100 && completed >= 3) badges.push('Perfect Record');

          return ok({
            agent_id: row.agent_id,
            agent_name: row.agent_name || row.agent_id,
            tasks_completed: completed,
            total_attempts: total,
            success_rate: `${sr}%`,
            avg_duration_ms: row.avg_duration_ms ? parseInt(row.avg_duration_ms) : null,
            first_seen: row.first_seen,
            last_active: row.last_active,
            badges
          });
        } catch (err) {
          return err('scorecard_query_failed', `Query failed: ${err.message}`);
        }
      }
    );

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
          limit: z.number().optional().default(5).describe('Max results (max 20)')
        }
      },
      async (args) => {
        toolName = TOOL_NAMES.SEARCH_REASONING;
        agentId = args.agent_id || 'mcp-agent';

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
        }
      },
      async (args) => {
        toolName = TOOL_NAMES.GET_REASONING;

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
        }
      },
      async (args) => {
        toolName = TOOL_NAMES.RECOMMEND_REASONING;

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
        }
      },
      async (args) => {
        toolName = TOOL_NAMES.GET_RECENT_REASONING;

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
        }
      },
      async (args) => {
        toolName = TOOL_NAMES.GET_POPULAR_TAGS;

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

    transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await mcpServer.connect(transport);

    const originalSend = transport.send.bind(transport);
    transport.send = async (msg) => {
      if (msg?.error && msg.id) {
        toolSuccess = false;
        toolError = msg.error.message || 'MCP protocol error';
      } else if (msg?.result && msg.id) {
        toolSuccess = true;
        const method = req.body?.method;
        if (method && toolName === 'unknown') {
          toolName = method;
        }
      }
      return originalSend(msg);
    };

    await transport.handleRequest(req, res, req.body);

    res.on('close', () => {
      transport.close();
      mcpServer.close();
      const duration = Date.now() - startTime;
      const args = req.body?.params?.arguments || {};
      logMcpUsage({ tool_name: toolName, runtime_type: runtimeType, agent_id: agentId, args: sanitizeArgs(args), duration_ms: duration, success: toolSuccess, error_message: toolError, ip_address: clientIp, user_agent: userAgent, result_hash: resultHash });
    });
  } catch (err) {
    toolError = err.message;
    toolSuccess = false;
    console.error('[MCP] Gateway error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' }, id: null });
    }
    const duration = Date.now() - startTime;
    logMcpUsage({ tool_name: toolName, runtime_type: runtimeType, agent_id: agentId, args: {}, duration_ms: duration, success: false, error_message: toolError, ip_address: clientIp, user_agent: userAgent, result_hash: resultHash });
  }
}

module.exports = (req, res) => createGateway(req, res);
