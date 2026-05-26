// mcp/task-execution.js — Task Lifecycle Tools (claim, submit, scorecard)
// Tools 1-4: list_open_tasks, claim_task, submit_result, get_scorecard
// Responsibility: Execution workflow from task discovery to leaderboard tracking

const { getPool } = require('../lib/db');
const { logMcpUsage, validateSubmitResult, checkDuplicateResult, hashResult } = require('../lib/execution-history');
const { checkRateLimit } = require('../lib/rate-limit');
const { getResolveHintsForTasks, buildResolvePrompt } = require('../lib/resolve-cache');
const { TOOL_NAMES, ERROR_CODES, EXECUTION_CONSTRAINTS } = require('./schema');
const { genExecId, loadSeed, err, ok, rateLimitError, ANNOTATIONS } = require('./utilities');

// Register all task execution tools
async function registerTaskTools(mcpServer, z, clientIp) {
  // --- Tool 1: list_open_tasks ---
  mcpServer.registerTool(
    TOOL_NAMES.LIST_OPEN_TASKS,
    {
      description: 'List available OPEN tasks (idempotent, read-only). Filters by difficulty, category, and limit.',
      inputSchema: {
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe('Filter: beginner/intermediate/advanced'),
        limit: z.number().optional().default(10).describe('Max tasks to return (max 50)'),
        type: z.enum(['external', 'meta']).optional().describe('Filter: external or meta tasks')
      },
      annotations: ANNOTATIONS.READ_ONLY
    },
    async (args) => {
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

      if (filterType === 'meta') tasks = tasks.filter(t => { if (!t.tags) return false; const tags = Array.isArray(t.tags) ? t.tags : [t.tags]; return tags.includes('meta'); });
      if (filterType === 'external') tasks = tasks.filter(t => { if (!t.tags) return true; const tags = Array.isArray(t.tags) ? t.tags : [t.tags]; return !tags.includes('meta'); });

      const resolveHints = getResolveHintsForTasks(tasks);
      const promptText = buildResolvePrompt(resolveHints);

      return ok({
        tasks: tasks.map(t => ({
          id: t.id,
          problem: (t.problem || '').slice(0, 300),
          task_type: t.task_type || 'other',
          difficulty: t.difficulty || 'unknown',
          estimated_tokens: t.estimated_tokens || null,
          tags: t.tags || [],
          urgency: t.urgency || 'NORMAL',
          source: t.source_url ? 'external' : 'local',
          resolve_hint: resolveHints[t.id] ? {
            solution_summary: (resolveHints[t.id].solution_summary || '').slice(0, 200),
            estimated_token_savings: resolveHints[t.id].estimated_token_savings || null,
            reasoning_id: resolveHints[t.id].reasoning_id || null
          } : null
        })),
        total: tasks.length,
        resolve_hints_available: Object.keys(resolveHints).length,
        _prompt: promptText
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
      },
      annotations: ANNOTATIONS.CLAIM
    },
    async (args) => {
      const agentId = args.agent_id || 'mcp-agent';

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
        const updateResult = await db.query(
          "UPDATE posts SET status = 'EXECUTING', claimed_by = $1, claimed_at = $2 WHERE id = $3 AND status = 'OPEN' RETURNING id",
          [agentId, claimedAt, args.task_id]
        );
        if (updateResult.rows.length === 0) {
          return err(ERROR_CODES.TASK_NOT_OPEN, `Task ${args.task_id} was already claimed by another agent`);
        }
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
        resolve_hint: (() => { try { const h = getResolveHintsForTasks([{ id: args.task_id }]); const hint = h[args.task_id]; return hint ? { solution_summary: (hint.solution_summary || '').slice(0, 200), reasoning_id: hint.reasoning_id, estimated_token_savings: hint.estimated_token_savings } : null; } catch { return null; } })(),
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
      },
      annotations: ANNOTATIONS.SUBMIT
    },
    async (args) => {
      const agentId = args.agent_id || 'mcp-agent';

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

      const MAX_EXECUTION_AGE_MS = EXECUTION_CONSTRAINTS.MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
      if (execution.created_at && (Date.now() - new Date(execution.created_at).getTime()) > MAX_EXECUTION_AGE_MS) {
        return err(ERROR_CODES.EXECUTION_EXPIRED, `Execution ${args.execution_id} was created too long ago (${Math.floor((Date.now() - new Date(execution.created_at).getTime()) / 86400000)} days). Max age is ${EXECUTION_CONSTRAINTS.MAX_AGE_DAYS} days.`);
      }

      const isDuplicate = await checkDuplicateResult(args.execution_id, agentId, args.result);
      if (isDuplicate) return err(ERROR_CODES.DUPLICATE_RESULT, 'Duplicate result — you already submitted identical content for this task', 'Submit unique meaningful content per execution.');

      const resultHash = hashResult(args.result);
      const submittedAt = new Date().toISOString();
      const durationMs = execution.created_at ? (Date.now() - new Date(execution.created_at).getTime()) : null;

      try {
        await db.query(
          `UPDATE execution_history SET status='completed', result=$1, completed_at=$2, duration_ms=$3, provider=$4, model=$5, tokens_used=$6, execution_log=$7 WHERE execution_id=$8`,
          [
            JSON.stringify({
              content: args.result,
              content_length: args.result.length,
              content_hash: resultHash,
              validation: {
                passed: true,
                task_type: execution.task_type || 'other',
                errors: [],
                validated_at: submittedAt
              },
              provider: args.provider || null,
              model: args.model || null,
              tokens: args.tokens_used || 0
            }),
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
      },
      annotations: ANNOTATIONS.READ_ONLY
    },
    async (args) => {
      const agentId = args.agent_id;

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
}

module.exports = {
  registerTaskTools,
};
