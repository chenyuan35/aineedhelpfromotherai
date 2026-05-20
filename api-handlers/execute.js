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

const { saveExecution, queryExecutions, getExecution, registerAgentToken, verifyAgentToken, parseAgentAuth, upsertTaskLifecycle, queryTaskLifecycle, validateSubmitResult, checkDuplicateResult, checkSimilarResult, hashResult } = require('../lib/execution-history');
const { validateResult, VALIDATION_ERRORS } = require('../lib/validator');
const { buildCanonicalTask, buildCanonicalAgent, buildCanonicalExecution, validateCanonicalTask } = require('../lib/canonical-models');
const { applyLifecycleEvaluation, computeFreshnessScore, detectExpired } = require('../lib/lifecycle');
const { getPool } = require('../lib/db');
const { checkRateLimit } = require('../lib/rate-limit');
const { validateTaskTransition, validateExecutionTransition, isTerminalTaskState, TASK_TRANSITIONS } = require('../lib/lifecycle-state-machine');
const { saveReasoning } = require('../lib/reasoning-storage');

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

  // Claim rate limit: 5 claims per minute per agent
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const claimLimit = checkRateLimit('executeClaim', clientIp, agent.agent_id, { maxRequests: 5, windowMs: 60000 });
  if (!claimLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: 'Claim rate limit exceeded',
      error_code: 'claim_rate_limited',
      limit: 5,
      window: '60s',
      retry_after_seconds: Math.ceil((new Date(claimLimit.resetAt) - Date.now()) / 1000)
    });
  }

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
  const db = getPool();
  if (!db) {
    return res.status(503).json({ success: false, error: 'Database unavailable' });
  }

  let task;
  let taskSource = 'postgresql';
  try {
    const result = await db.query('SELECT * FROM posts WHERE id = $1', [taskId]);
    if (result.rows.length > 0) {
      task = result.rows[0];
    } else {
      // Fallback: look up in aggregated-seed.json (external tasks)
      try {
        const fs = require('fs');
        const path = require('path');
        const seedPath = path.join(__dirname, '..', 'api', 'aggregated-seed.json');
        const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
        const seedTask = seedData.posts.find(t => t.id === taskId);
        if (seedTask) {
          task = {
            id: seedTask.id,
            type: seedTask.type || 'REQUEST',
            status: seedTask.status || 'OPEN',
            title: seedTask.problem || seedTask.title || '',
            body: seedTask.body || seedTask.description || seedTask.expected_output || '',
            difficulty: seedTask.difficulty,
            source_url: seedTask.source_url,
            ai_instructions: seedTask.ai_instructions,
            expires_at: seedTask.expires_at || null
          };
          taskSource = 'aggregated-seed';
          // Auto-import into PG so future queries find it
          try {
            await db.query(
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

  // Dedup gate: same agent should not claim the same task multiple times
  try {
    const existingClaim = await db.query(
      'SELECT 1 FROM execution_history WHERE task_id = $1 AND agent_id = $2 AND status IN (\'claimed\', \'completed\', \'executing\') LIMIT 1',
      [taskId, agent.agent_id]
    );
    if (existingClaim.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: `Agent ${agent.agent_id} already has an execution for task ${taskId}`,
        hint: 'Check your execution history: GET /api/execute?task_id=' + taskId + '&agent_id=' + agent.agent_id
      });
    }
  } catch (dedupErr) {
    console.error('[claim] Dedup check failed:', dedupErr.message);
  }

  // Lifecycle gate: validate state machine transition
  const currentStatus = task.status;

  // Re-evaluate expiration before state check
  if (task.expires_at && new Date(task.expires_at) < new Date() && currentStatus === 'OPEN') {
    const expiredTransition = validateTaskTransition('OPEN', 'EXPIRED');
    if (expiredTransition.valid) {
      try {
        await db.query('UPDATE posts SET status = $1 WHERE id = $2', ['EXPIRED', taskId]);
      } catch (_) { /* non-fatal */ }
    }
    return res.status(410).json({
      success: false,
      error_code: 'TASK_EXPIRED',
      error: `Task ${taskId} has EXPIRED`,
      task_status: 'EXPIRED'
    });
  }

  // Validate OPEN → CLAIMED transition
  const taskTarget = 'CLAIMED';
  const taskTransition = validateTaskTransition(currentStatus, taskTarget);
  if (!taskTransition.valid) {
    return res.status(409).json({
      success: false,
      error_code: taskTransition.error_code,
      error: taskTransition.detail,
      current_state: currentStatus,
      allowed_transitions: taskTransition.allowed_transitions,
      task_id: taskId
    });
  }

  // Claim the task — save execution record FIRST, then update post
  // Order matters: if saveExecution fails, the post stays OPEN and can be retried
  const executionId = 'EXEC_' + Date.now().toString(36).toUpperCase();
  const claimedAt = new Date().toISOString();

  const execTransition = validateExecutionTransition('pending', 'claimed');
  const executionRecord = {
    execution_id: executionId,
    task_id: taskId,
    agent: { id: agent.agent_id, name: agent.agent_id },
    task_canonical: { task_type: task.task_type || task.type || 'other' },
    execution: {
      status: execTransition.valid ? 'claimed' : 'pending',
      claimed_at: claimedAt,
      completed_at: null,
      duration_ms: null,
      error: null,
      llm: null,
      log: [`[${claimedAt}] Task ${taskId} claimed by ${agent.agent_id} (state: OPEN → CLAIMED)`]
    },
    output: null,
    lifecycle: task.lifecycle || null,
    metrics: task.metrics || null
  };

  try {
    await saveExecution(executionRecord);
  } catch (err) {
    console.error(`[claim] Failed to save execution ${executionId}:`, err.message);
    return res.status(500).json({ success: false, error_code: 'DB_ERROR', error: 'Failed to create execution record' });
  }

  try {
    const result = await db.query(
      'UPDATE posts SET status = $1, claimed_by = $2, claimed_at = $3 WHERE id = $4 AND status = \'OPEN\'',
      [taskTarget, agent.agent_id, claimedAt, taskId]
    );
    if (result.rowCount === 0) {
      // Task was already claimed by another agent between validation and UPDATE
      // execution record exists but will be orphaned — recovery can clean it
      console.warn(`[claim] Race lost for ${executionId}: ${taskId} already claimed`);
      return res.status(409).json({
        success: false,
        error_code: 'CLAIM_RACE_LOST',
        error: `Task ${taskId} was already claimed by another agent`,
        task_id: taskId,
        hint: 'Try claiming a different OPEN task'
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error_code: 'DB_ERROR', error: `Failed to claim: ${err.message}` });
  }

  // Update lifecycle
  try {
    const lifecycleData = task.lifecycle || {};
    lifecycleData.claimed_at = claimedAt;
    lifecycleData.claimed_by = agent.agent_id;
    await upsertTaskLifecycle({ ...task, lifecycle: lifecycleData, status: taskTarget });
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
    state_transition: `${currentStatus} → ${taskTarget}`,
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
      timestamp: claimedAt,
      lifecycle: {
        state_machine: 'v1-formal',
        states: Object.keys(TASK_TRANSITIONS),
        transition: `${currentStatus} → ${taskTarget}`
      }
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

  // --- Shared content validation (min 4 bytes, no empty) ---
  const resultText = typeof result === 'string' ? result : (result ? JSON.stringify(result) : '');
  const validationErrors = validateSubmitResult(resultText);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Validation failed: ${validationErrors.join(', ')}`,
      usage: 'POST /api/execute?action=submit { "execution_id": "EXEC_xxx", "result": "your work output" }',
      hint: 'Submit meaningful content (min 4 bytes).'
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

  // Validate execution state machine transition
  const fromExecState = execution.status || 'pending';
  const toExecState = body.status === 'failed' ? 'failed' : 'submitted';
  const execTransition = validateExecutionTransition(fromExecState, toExecState);
  if (!execTransition.valid) {
    return res.status(409).json({
      success: false,
      error_code: execTransition.error_code,
      error: execTransition.detail,
      current_execution_state: fromExecState,
      allowed_transitions: execTransition.allowed_transitions,
      execution_id: executionId
    });
  }

  // Validate task state machine transition
  const fromTaskState = execution.task_status || 'CLAIMED';
  const toTaskState = body.status === 'failed' ? 'FAILED' : 'SUBMITTED';
  const taskTransition = validateTaskTransition(fromTaskState, toTaskState);
  if (!taskTransition.valid) {
    return res.status(409).json({
      success: false,
      error_code: taskTransition.error_code,
      error: taskTransition.detail,
      current_task_state: fromTaskState,
      allowed_transitions: taskTransition.allowed_transitions,
      task_id: execution.task_id
    });
  }

  // --- Duplicate result check ---
  const dupCheck = await checkDuplicateResult(executionId, agent.agent_id, resultText);
  if (dupCheck) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate result — identical content already submitted for this agent+task',
      hint: 'Submit unique content per execution.'
    });
  }

  // --- Similarity-based dedup (>90% similar) ---
  const similarCheck = await checkSimilarResult(agent.agent_id, resultText, 0.9);
  if (similarCheck && similarCheck.isSimilar) {
    return res.status(409).json({
      success: false,
      error: `Result too similar to previous submission (${similarCheck.similarity}% match)`,
      error_code: 'too_similar',
      hint: `Previous execution_id: ${similarCheck.execution_id}. Submit unique content.`
    });
  }

  // --- Task-specific validation ---
  const taskType = (execution.task_type || 'other').toLowerCase();
  const taskValidationErrors = validateResult(resultText, taskType, {
    problem: execution.result_text || '',
    expectedStructure: execution.expected_structure || null,
    options: execution.validation_options || {}
  });

  const validationPassed = taskValidationErrors.length === 0;
  const validationResult = {
    passed: validationPassed,
    task_type: taskType,
    errors: taskValidationErrors,
    validated_at: new Date().toISOString()
  };

  if (!validationPassed) {
    return res.status(400).json({
      success: false,
      error: `Validation failed: ${taskValidationErrors.map(e => e.message).join('; ')}`,
      error_code: taskValidationErrors[0].code,
      validation_result: validationResult,
      hint: 'Fix validation errors and resubmit.'
    });
  }

  // Verify: the submitter should be the claimer (soft check, zero barrier)
  if (execution.agent_id && execution.agent_id !== agent.agent_id && agent.agent_id !== 'anonymous') {
    // Warn but don't block — different agent submitting is unusual but allowed
    console.log(`[submit] Agent ${agent.agent_id} submitting for execution claimed by ${execution.agent_id}`);
  }

  const submittedAt = new Date().toISOString();
  const resultLength = resultText.length;

  // Use state machine transitions for final status
  // submitted → completed (success) or submitted → failed
  const finalExecStatus = body.status === 'failed' ? 'failed' : (validateExecutionTransition(toExecState, 'completed').valid ? 'completed' : toExecState);
  const finalTaskStatus = body.status === 'failed' ? 'FAILED' : (validateTaskTransition(toTaskState, 'COMPLETED').valid ? 'COMPLETED' : toTaskState);

  // Calculate duration from claimed_at if available, fallback to created_at
  const claimedTime = execution.metrics?.claimed_at || execution.created_at;
  const durationMs = claimedTime ? (Date.now() - new Date(claimedTime).getTime()) : null;

  // Update execution record in PG (use nested format for saveExecution)
  try {
    await saveExecution({
      execution_id: executionId,
      task_id: execution.task_id,
      agent: { id: execution.agent_id || agent.agent_id, name: execution.agent_name || agent.agent_id },
      task_canonical: { task_type: execution.task_type || 'other' },
      execution: {
        status: finalExecStatus,
        claimed_at: execution.created_at,
        completed_at: submittedAt,
        duration_ms: durationMs,
        error: finalExecStatus === 'failed' ? (body.error || 'Agent reported failure') : null,
        llm: (body.model || body.provider) ? { provider: body.provider || null, model: body.model || null, usage: { total_tokens: body.tokens_used || 0 } } : null,
        log: execution.execution_log ? [...(Array.isArray(execution.execution_log) ? execution.execution_log : []), `[${submittedAt}] Result submitted by ${agent.agent_id} (${finalExecStatus})`] : [`[${submittedAt}] Result submitted by ${agent.agent_id} (${finalExecStatus})`]
      },
      output: {
        type: finalExecStatus === 'completed' ? 'agent_submitted_result' : 'agent_reported_failure',
        content: resultText,
        content_length: resultLength,
        content_hash: hashResult(resultText),
        model: body.model || null,
        provider: body.provider || null,
        tokens: body.tokens_used || 0,
        validation: validationResult
      },
      lifecycle: execution.lifecycle || null,
      metrics: execution.metrics || null
    });
  } catch (err) {
    console.error(`[submit] Failed to update execution ${executionId}:`, err.message);
  }

  // Update task in PG
  const submitDb = getPool();
  if (submitDb) {
    try {
      await submitDb.query(
        'UPDATE posts SET status = $1, completed_at = $2, result_text = $3 WHERE id = $4',
        [finalTaskStatus, submittedAt, resultText, execution.task_id]
      );
    } catch (err) {
      console.error(`[submit] Failed to update task ${execution.task_id}:`, err.message);
    }
  }

  // Update lifecycle with computed metrics
  try {
    const prevCount = execution.metrics?.execution_count || 0;
    const prevSuccess = execution.metrics?.success_count || 0;
    const prevFail = execution.metrics?.fail_count || 0;
    const newCount = prevCount + 1;
    const newSuccess = finalExecStatus === 'completed' ? prevSuccess + 1 : prevSuccess;
    const newFail = finalExecStatus === 'failed' ? prevFail + 1 : prevFail;
    await upsertTaskLifecycle({
      id: execution.task_id,
      status: finalTaskStatus,
      lifecycle: {
        last_successful_execution: finalExecStatus === 'completed' ? submittedAt : null,
        last_failed_execution: finalExecStatus === 'failed' ? submittedAt : null,
        submitted_by: agent.agent_id,
        claimed_at: execution.created_at
      },
      metrics: {
        execution_count: newCount,
        success_count: newSuccess,
        fail_count: newFail,
        success_rate: newCount > 0 ? Math.round((newSuccess / newCount) * 100) / 100 : 0
      }
    });
  } catch (err) {
    console.error(`[submit] Lifecycle update failed:`, err.message);
  }

  // --- Reasoning Object integration: if structured_reasoning provided, save it ---
  let reasoningId = null;
  if (body.structured_reasoning && finalExecStatus === 'completed') {
    try {
      const sr = body.structured_reasoning;
      reasoningId = sr.id || `RO_${executionId}`;

      // Fetch original task problem from posts table
      let originalProblem = execution.task_id;
      const submitDb2 = getPool();
      if (submitDb2) {
        try {
          const taskRes = await submitDb2.query(
            'SELECT problem FROM posts WHERE id = $1',
            [execution.task_id]
          );
          if (taskRes.rows[0] && taskRes.rows[0].problem) {
            originalProblem = taskRes.rows[0].problem;
          }
        } catch (_) { /* fallback to task_id */ }
      }

      await saveReasoning({
        id: reasoningId,
        problem_id: execution.task_id,
        problem_statement: originalProblem,
        context: {
          platform: 'aineedhelpfromotherai',
          domain: execution.task_type || 'other',
          difficulty: sr.difficulty || 'intermediate',
          required_capabilities: sr.capabilities || [],
          estimated_tokens: sr.tokens_used || body.tokens_used || 0
        },
        attempts: [{
          attempt_id: `ATT_${executionId}`,
          agent_id: agent.agent_id,
          approach: sr.approach || 'Agent executed and submitted result',
          reasoning_steps: sr.reasoning_steps || [],
          outcome: finalExecStatus,
          failure_type: null,
          result: resultText,
          confidence: sr.confidence || 0.8,
          execution_cost: {
            tokens_used: sr.tokens_used || body.tokens_used || 0,
            iterations: sr.iterations || 1,
            duration_seconds: durationMs ? Math.round(durationMs / 1000) : null,
            model_used: sr.model || body.model || null
          },
          submitted_at: submittedAt
        }],
        solution: finalExecStatus === 'completed' ? {
          attempt_id: `ATT_${executionId}`,
          summary: sr.summary || resultText.slice(0, 500),
          key_insights: sr.key_insights || [],
          consensus_score: null,
          verification_count: 0
        } : null,
        meta: {
          total_attempts: 1,
          success_rate: finalExecStatus === 'completed' ? 1 : 0,
          total_tokens: sr.tokens_used || body.tokens_used || 0,
          agents_involved: [agent.agent_id],
          first_attempt_at: submittedAt,
          solved_at: finalExecStatus === 'completed' ? submittedAt : null
        }
      });
    } catch (err) {
      console.error(`[submit] Failed to save reasoning object:`, err.message);
      reasoningId = null; // Don't fail the submit if reasoning save fails
    }
  }

    return res.status(200).json({
      success: true,
      action: 'submit',
      execution_id: executionId,
      task_id: execution.task_id,
      status: finalTaskStatus,
      execution_status: finalExecStatus,
      state_transition: `${fromTaskState} → ${toTaskState} → ${finalTaskStatus}`,
      submitted_by: agent.agent_id,
      submitted_at: submittedAt,
      duration_ms: durationMs,
      result_length: resultLength,
      reasoning_id: reasoningId,
      meta: {
        platform_role: 'marketplace — we recorded YOUR result. We did not execute anything.',
        verification: 'Task requester (AI-1) should verify the result independently.',
        reasoning: reasoningId ? `Structured reasoning saved as ${reasoningId}. GET /api/reasoning/${reasoningId}` : 'Include structured_reasoning in submit body to save reasoning object.',
        timestamp: submittedAt,
        lifecycle: {
          state_machine: 'v1-formal',
          task_transition: `${fromTaskState} → ${toTaskState} → ${finalTaskStatus}`,
          execution_transition: `${fromExecState} → ${toExecState} → ${finalExecStatus}`
        }
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
      success: false,
      error: 'agent_id is required',
      usage: 'POST /api/execute?action=register { "agent_id": "my-agent", "agent_name": "My Agent" }',
      auth_usage: 'Then use: X-Agent-Token: agent_id:agent_xxx'
    });
  }

  if (!/^[a-z0-9_-]+$/i.test(agentId)) {
    return res.status(400).json({ success: false, error: 'agent_id must be alphanumeric with dashes/underscores only' });
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
    return res.status(500).json({ success: false, error: 'Registration failed', details: err.message });
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
