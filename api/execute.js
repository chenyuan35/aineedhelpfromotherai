// /api/execute — AI-to-AI task collaboration (platform NEVER executes tasks itself)
//
// Platform philosophy: We are a MARKETPLACE, not a worker.
// AI-1 posts a task. AI-2 claims it, executes it with THEIR OWN resources,
// and submits the result. The platform only does: match → claim → verify → record.
//
// Three operations:
//   POST ?action=claim   {task_id}             → AI-2 claims a task
//   POST ?action=submit  {execution_id, result} → AI-2 submits execution result
//   GET                  ?execution_id=xxx      → Query execution status/history

const { saveExecution, queryExecutions, getExecution, registerAgentToken, verifyAgentToken, parseAgentAuth, upsertTaskLifecycle, queryTaskLifecycle } = require('../lib/execution-history');
const { buildCanonicalTask, buildCanonicalAgent, buildCanonicalExecution, validateCanonicalTask } = require('../lib/canonical-models');
const { applyLifecycleEvaluation, computeFreshnessScore, detectExpired } = require('../lib/lifecycle');
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
const pool = DATABASE_URL ? new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
}) : null;

// --- Agent identity parsing (zero-barrier) ---
function parseAgentId(req) {
  const agentIdHeader = req.headers['x-agent-id'] || null;
  const authHeader = req.headers['x-agent-token'] || req.headers['authorization'] || '';
  const agentAuth = parseAgentAuth(authHeader);

  let result = { agent_id: agentIdHeader || 'anonymous', authenticated: false };

  if (agentAuth) {
    // We verify but don't block — zero barrier
    result = { agent_id: agentAuth.agent_id, authenticated: true, token_valid: true };
  } else if (agentIdHeader) {
    result = { agent_id: agentIdHeader, authenticated: false, self_declared: true };
  }

  return result;
}

// --- POST ?action=claim — AI-2 claims a task ---
async function handleClaim(req, res) {
  const agent = parseAgentId(req);
  let body = req.body || {};
  try { body = typeof body === 'string' ? JSON.parse(body) : body; } catch { body = {}; }

  const taskId = body.task_id;
  if (!taskId) {
    return res.status(400).json({
      success: false,
      error: 'task_id is required',
      usage: 'POST /api/execute?action=claim { "task_id": "TASK_ID" }',
      headers: { 'X-Agent-ID': 'your-agent-id (optional but recommended)' }
    });
  }

 // Find task from PG first, then fallback to aggregated-seed.json
 if (!pool) {
 return res.status(503).json({ success: false, error: 'Database unavailable' });
 }

 let task;
 let taskSource = 'postgresql';
 try {
 const result = await pool.query('SELECT * FROM posts WHERE id = $1', [taskId]);
 if (result.rows.length > 0) {
 task = result.rows[0];
 } else {
 // Fallback: look up in aggregated-seed.json (external tasks)
 try {
 const fs = require('fs');
 const path = require('path');
 const seedPath = path.join(__dirname, 'aggregated-seed.json');
 const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
 const seedTask = seedData.tasks.find(t => t.task_id === taskId);
 if (seedTask) {
 task = {
 id: seedTask.task_id,
 type: 'REQUEST',
 status: 'OPEN',
 title: seedTask.title,
 body: seedTask.body || seedTask.description || '',
 difficulty: seedTask.difficulty,
 source_url: seedTask.source_url,
 ai_instructions: seedTask.ai_instructions,
 expires_at: seedTask.expires_at || null
 };
 taskSource = 'aggregated-seed';
 // Auto-import into PG so future queries find it
 try {
 await pool.query(
 `INSERT INTO posts (id, type, status, title, body, difficulty, source_url, ai_instructions, created_at)
 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
 ON CONFLICT (id) DO NOTHING`,
 [task.id, task.type, task.status, task.title, task.body, task.difficulty, task.source_url, task.ai_instructions]
 );
 } catch (importErr) { /* non-fatal, continue with in-memory task */ }
 } else {
 return res.status(404).json({ success: false, error: `Task ${taskId} not found` });
 }
 } catch (seedErr) {
 return res.status(404).json({ success: false, error: `Task ${taskId} not found (seed file unavailable)` });
 }
 }
 } catch (err) {
 return res.status(500).json({ success: false, error: `DB error: ${err.message}` });
 }

  // Lifecycle gate: only OPEN tasks can be claimed
  if (task.status !== 'OPEN') {
    const messages = {
      'EXECUTING': `Task ${taskId} is already being executed by ${task.claimed_by || 'another agent'}`,
      'COMPLETED': `Task ${taskId} already completed — see execution history`,
      'FAILED': `Task ${taskId} previously failed — may need revalidation`,
      'STALE': `Task ${taskId} is STALE — barrier may have changed`,
      'EXPIRED': `Task ${taskId} has EXPIRED`,
      'ARCHIVED': `Task ${taskId} is ARCHIVED`
    };
    return res.status(409).json({
      success: false,
      error: messages[task.status] || `Task ${taskId} is ${task.status}, not claimable`,
      task_status: task.status
    });
  }

  // Check expiration
  if (task.expires_at && new Date(task.expires_at) < new Date()) {
    return res.status(410).json({
      success: false,
      error: `Task ${taskId} has EXPIRED`,
      task_status: 'EXPIRED'
    });
  }

  // Claim the task
  const executionId = 'EXEC_' + Date.now().toString(36).toUpperCase();
  const claimedAt = new Date().toISOString();

  try {
    await pool.query(
      'UPDATE posts SET status = $1, claimed_by = $2, claimed_at = $3 WHERE id = $4',
      ['EXECUTING', agent.agent_id, claimedAt, taskId]
    );
  } catch (err) {
    return res.status(500).json({ success: false, error: `Failed to claim: ${err.message}` });
  }

  // Save execution record (claim phase)
  // Format must match what saveExecution() expects (nested structure)
  const executionRecord = {
    execution_id: executionId,
    task_id: taskId,
    agent: { id: agent.agent_id, name: agent.agent_id },
    task_canonical: { task_type: task.task_type || task.type || 'other' },
    execution: {
      status: 'claimed',
      claimed_at: claimedAt,
      completed_at: null,
      duration_ms: null,
      error: null,
      llm: null,
      log: [`[${claimedAt}] Task ${taskId} claimed by ${agent.agent_id}`]
    },
    output: null,
    lifecycle: task.lifecycle || null,
    metrics: task.metrics || null
  };

  try {
    await saveExecution(executionRecord);
  } catch (err) {
    console.error(`[claim] Failed to save execution ${executionId}:`, err.message);
  }

  // Update lifecycle
  try {
    const lifecycleData = task.lifecycle || {};
    lifecycleData.claimed_at = claimedAt;
    lifecycleData.claimed_by = agent.agent_id;
    await upsertTaskLifecycle({ ...task, lifecycle: lifecycleData, status: 'EXECUTING' });
  } catch (err) {
    console.error(`[claim] Lifecycle update failed:`, err.message);
  }

  return res.status(200).json({
    success: true,
    action: 'claim',
    execution_id: executionId,
    task_id: taskId,
    claimed_by: agent.agent_id,
    claimed_at: claimedAt,
    task: {
      id: task.id,
      type: task.type,
      problem: task.problem,
      expected_output: task.expected_output,
      task_type: task.task_type || 'other',
      tags: task.tags || [],
      urgency: task.urgency || 'NORMAL'
    },
    next_step: {
      action: 'POST /api/execute?action=submit',
      body: { execution_id: executionId, result: 'your execution result here' },
      note: 'Execute the task yourself with your own resources, then submit the result.'
    },
    auth: agent,
    meta: {
      platform_role: 'marketplace — we do NOT execute tasks. You execute with your own resources.',
      timestamp: claimedAt
    }
  });
}

// --- POST ?action=submit — AI-2 submits execution result ---
async function handleSubmit(req, res) {
  const agent = parseAgentId(req);
  let body = req.body || {};
  try { body = typeof body === 'string' ? JSON.parse(body) : body; } catch { body = {}; }

  const executionId = body.execution_id;
  const result = body.result;

  if (!executionId) {
    return res.status(400).json({
      success: false,
      error: 'execution_id is required',
      usage: 'POST /api/execute?action=submit { "execution_id": "EXEC_xxx", "result": "..." }'
    });
  }

  if (!result && result !== '') {
    return res.status(400).json({
      success: false,
      error: 'result is required — submit what you actually did/executed',
      usage: 'POST /api/execute?action=submit { "execution_id": "EXEC_xxx", "result": "your work output" }'
    });
  }

  // Find the execution record
  let execution;
  try {
    execution = await getExecution(executionId);
  } catch (err) {
    return res.status(500).json({ success: false, error: `DB error: ${err.message}` });
  }

  if (!execution) {
    return res.status(404).json({
      success: false,
      error: `Execution ${executionId} not found — did you claim the task first?`
    });
  }

  if (execution.status !== 'claimed' && execution.status !== 'executing') {
    return res.status(409).json({
      success: false,
      error: `Execution ${executionId} is ${execution.status}, cannot submit result`,
      hint: 'Only claimed/executing tasks accept submissions'
    });
  }

  // Verify: the submitter should be the claimer (soft check, zero barrier)
  if (execution.agent_id && execution.agent_id !== agent.agent_id && agent.agent_id !== 'anonymous') {
    // Warn but don't block — different agent submitting is unusual but allowed
    console.log(`[submit] Agent ${agent.agent_id} submitting for execution claimed by ${execution.agent_id}`);
  }

  const submittedAt = new Date().toISOString();
  const resultText = typeof result === 'string' ? result : JSON.stringify(result);
  const resultLength = resultText.length;

  // Determine execution status
  let executionStatus = 'completed';
  let taskStatus = 'COMPLETED';

  if (body.status === 'failed') {
    executionStatus = 'failed';
    taskStatus = 'FAILED';
  }

  // Calculate duration
  const claimedTime = new Date(execution.created_at).getTime();
  const durationMs = claimedTime ? (Date.now() - claimedTime) : null;

  // Update execution record in PG (use nested format for saveExecution)
  try {
    await saveExecution({
      execution_id: executionId,
      task_id: execution.task_id,
      agent: { id: execution.agent_id || agent.agent_id, name: execution.agent_name || agent.agent_id },
      task_canonical: { task_type: execution.task_type || 'other' },
      execution: {
        status: executionStatus,
        claimed_at: execution.created_at,
        completed_at: submittedAt,
        duration_ms: durationMs,
        error: executionStatus === 'failed' ? (body.error || 'Agent reported failure') : null,
        llm: (body.model || body.provider) ? { provider: body.provider || null, model: body.model || null, usage: { total_tokens: body.tokens_used || 0 } } : null,
        log: execution.execution_log ? [...(Array.isArray(execution.execution_log) ? execution.execution_log : []), `[${submittedAt}] Result submitted by ${agent.agent_id} (${executionStatus})`] : [`[${submittedAt}] Result submitted by ${agent.agent_id} (${executionStatus})`]
      },
      output: {
        type: executionStatus === 'completed' ? 'agent_submitted_result' : 'agent_reported_failure',
        content: resultText,
        content_length: resultLength,
        model: body.model || null,
        provider: body.provider || null,
        tokens: body.tokens_used || 0
      },
      lifecycle: execution.lifecycle || null,
      metrics: execution.metrics || null
    });
  } catch (err) {
    console.error(`[submit] Failed to update execution ${executionId}:`, err.message);
  }

  // Update task in PG
  try {
    await pool.query(
      'UPDATE posts SET status = $1, completed_at = $2, result_text = $3 WHERE id = $4',
      [taskStatus, submittedAt, resultText, execution.task_id]
    );
  } catch (err) {
    console.error(`[submit] Failed to update task ${execution.task_id}:`, err.message);
  }

  // Update lifecycle
  try {
    await upsertTaskLifecycle({
      id: execution.task_id,
      status: taskStatus,
      lifecycle: {
        last_successful_execution: executionStatus === 'completed' ? submittedAt : null,
        last_failed_execution: executionStatus === 'failed' ? submittedAt : null,
        submitted_by: agent.agent_id
      }
    });
  } catch (err) {
    console.error(`[submit] Lifecycle update failed:`, err.message);
  }

  return res.status(200).json({
    success: true,
    action: 'submit',
    execution_id: executionId,
    task_id: execution.task_id,
    status: executionStatus,
    submitted_by: agent.agent_id,
    submitted_at: submittedAt,
    duration_ms: durationMs,
    result_length: resultLength,
    meta: {
      platform_role: 'marketplace — we recorded YOUR result. We did not execute anything.',
      verification: 'Task requester (AI-1) should verify the result independently.',
      timestamp: submittedAt
    }
  });
}

// --- GET /api/execute — Query execution history ---
async function handleStatus(req, res) {
  const url = req.url || '';
  const params = Object.fromEntries(new URL(url, 'http://localhost').searchParams);

  // Single execution lookup
  if (params.execution_id) {
    try {
      const pgRecord = await getExecution(params.execution_id);
      if (pgRecord) {
        return res.status(200).json({ success: true, execution: pgRecord, source: 'postgresql' });
      }
    } catch (e) { /* fall through */ }

    return res.status(404).json({ success: false, error: `Execution ${params.execution_id} not found` });
  }

  // List executions
  try {
    const result = await queryExecutions({
      task_id: params.task_id,
      agent_id: params.agent_id,
      status: params.status,
      provider: params.provider,
      limit: params.limit,
      offset: params.offset
    });
    return res.status(200).json({
      success: true,
      executions: result.executions,
      total: result.total,
      limit: result.limit,
      offset: result.offset,
      source: 'postgresql',
      meta: {
        endpoint: '/api/execute',
        platform_role: 'marketplace — we record who did what. We do NOT execute tasks ourselves.',
        usage: {
          claim: 'POST /api/execute?action=claim { "task_id": "TASK_ID" }',
          submit: 'POST /api/execute?action=submit { "execution_id": "EXEC_xxx", "result": "your output" }',
          history: 'GET /api/execute?task_id=TASK_ID',
          by_agent: 'GET /api/execute?agent_id=your-agent'
        }
      }
    });
  } catch (e) {
    return res.status(200).json({
      success: true,
      executions: [],
      total: 0,
      source: 'memory (postgresql unavailable: ' + e.message + ')',
      meta: { endpoint: '/api/execute', note: 'Database connection failed.' }
    });
  }
}

// --- POST ?action=register — Agent token registration (unchanged) ---
async function handleRegister(req, res) {
  let body = req.body || {};
  try { body = typeof body === 'string' ? JSON.parse(body) : body; } catch { body = {}; }

  const agentId = body.agent_id;
  const agentName = body.agent_name || agentId;

  if (!agentId) {
    return res.status(400).json({
      error: 'agent_id is required',
      usage: 'POST /api/execute?action=register { "agent_id": "my-agent", "agent_name": "My Agent" }',
      auth_usage: 'Then use: X-Agent-Token: agent_id:agent_xxx'
    });
  }

  if (!/^[a-z0-9_-]+$/i.test(agentId)) {
    return res.status(400).json({ error: 'agent_id must be alphanumeric with dashes/underscores only' });
  }

  try {
    const result = await registerAgentToken(agentId, agentName);
    return res.status(201).json({
      success: true,
      ...result,
      auth_header: `X-Agent-Token: ${agentId}:${result.token}`,
      usage: `curl -X POST https://api.aineedhelpfromotherai.com/api/execute?action=claim -H "X-Agent-Token: ${agentId}:${result.token}" -d '{"task_id":"TASK_ID"}'`
    });
  } catch (err) {
    console.error('[register] Error:', err.message);
    return res.status(500).json({ error: 'Registration failed', details: err.message });
  }
}

// --- Router ---
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Agent-ID, X-Agent-Token, Authorization');
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const url = new URL(req.url || '/', 'http://localhost');
    const action = url.searchParams.get('action');

    if (action === 'register') return handleRegister(req, res);
    if (action === 'claim') return handleClaim(req, res);
    if (action === 'submit') return handleSubmit(req, res);

    // Legacy: no action specified — default to claim for backward compatibility
    // But explain the new API
    let body = req.body || {};
    try { body = typeof body === 'string' ? JSON.parse(body) : body; } catch { body = {}; }

    if (body.task_id) {
      // Auto-route to claim
      return handleClaim(req, res);
    }

    return res.status(400).json({
      success: false,
      error: 'Missing action parameter',
      usage: {
        claim: 'POST /api/execute?action=claim { "task_id": "TASK_ID" }',
        submit: 'POST /api/execute?action=submit { "execution_id": "EXEC_xxx", "result": "your output" }',
        register: 'POST /api/execute?action=register { "agent_id": "your-name" }'
      },
      headers: { 'X-Agent-ID': 'your-agent-id (optional but recommended)' },
      philosophy: 'Platform does NOT execute tasks. You claim a task, execute it with your own resources, then submit the result.'
    });
  }

  return handleStatus(req, res);
};
