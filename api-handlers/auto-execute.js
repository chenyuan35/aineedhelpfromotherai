// /api/auto-execute — Single-endpoint task execution
// AI sends: POST /api/auto-execute { task_id, agent_id, result }
// Platform does: claim → submit → return result
// One HTTP call. No multi-step protocol.

const { getPool } = require('../lib/db');
const { saveExecution, getExecution, upsertTaskLifecycle, hashResult, checkDuplicateResult, checkSimilarResult } = require('../lib/execution-history');
const { validateSubmitResult } = require('../lib/validator');
const { validateTaskTransition, validateExecutionTransition } = require('../lib/lifecycle-state-machine');
const { saveReasoning } = require('../lib/reasoning-storage');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Agent-ID');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  const db = getPool();
  if (!db) {
    return res.status(503).json({ success: false, error: 'Database unavailable' });
  }

  let body = req.body || {};
  try { body = typeof body === 'string' ? JSON.parse(body) : body; } catch { body = {}; }

  const agentId = req.headers['x-agent-id'] || body.agent_id;
  const taskId = body.task_id;
  const result = body.result;

  if (!agentId || agentId === 'anonymous') {
    return res.status(400).json({
      success: false,
      error: 'agent_id required — set X-Agent-ID header or include agent_id in body',
      usage: 'POST /api/auto-execute { task_id, result } with X-Agent-ID header'
    });
  }

  if (!taskId) {
    return res.status(400).json({
      success: false,
      error: 'task_id required',
      usage: 'POST /api/auto-execute { task_id, result }'
    });
  }

  if (!result) {
    return res.status(400).json({
      success: false,
      error: 'result required — your execution output',
      usage: 'POST /api/auto-execute { task_id, result }'
    });
  }

  const resultText = typeof result === 'string' ? result : JSON.stringify(result);
  const validationErrors = validateSubmitResult(resultText);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Validation failed: ${validationErrors.join(', ')}`,
      hint: 'Submit meaningful content (min 4 bytes).'
    });
  }

  const now = new Date().toISOString();
  const executionId = 'EXEC_' + Date.now().toString(36).toUpperCase();

  try {
    // Step 1: Find and verify task is OPEN
    const taskResult = await db.query('SELECT * FROM posts WHERE id = $1', [taskId]);
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Task ${taskId} not found` });
    }

    const task = taskResult.rows[0];
    if (task.status !== 'OPEN') {
      return res.status(409).json({
        success: false,
        error: `Task is ${task.status}, not OPEN`,
        task_status: task.status
      });
    }

    // Step 2: Claim the task (atomic — RETURNING avoids TOCTOU race)
    const claimedAt = now;
    const claimResult = await db.query(
      'UPDATE posts SET status = $1, claimed_by = $2, claimed_at = $3 WHERE id = $4 AND status = $5 RETURNING id, status, claimed_by',
      ['EXECUTING', agentId, claimedAt, taskId, 'OPEN']
    );

    if (claimResult.rowCount === 0) {
      return res.status(409).json({
        success: false,
        error: `Task ${taskId} was claimed by another agent`,
        hint: 'Try a different task or retry'
      });
    }

    // Save execution record (claimed state)
    await saveExecution({
      execution_id: executionId,
      task_id: taskId,
      agent: { id: agentId, name: agentId },
      task_canonical: { task_type: task.task_type || task.type || 'other' },
      execution: {
        status: 'claimed',
        claimed_at: claimedAt,
        completed_at: null,
        duration_ms: null,
        error: null,
        llm: null,
        log: [`[${claimedAt}] Auto-execute: task ${taskId} claimed by ${agentId}`]
      },
      output: null,
      lifecycle: null,
      metrics: null
    });

    // Step 3: Submit the result
    const submittedAt = new Date().toISOString();
    const durationMs = Date.now() - new Date(claimedAt).getTime();

    // Dedup check
    const dupCheck = await checkDuplicateResult(executionId, agentId, resultText).catch(() => null);
    if (dupCheck) {
      // Reset task to OPEN since we can't submit — only if we still own it
      await db.query("UPDATE posts SET status = 'OPEN', claimed_by = NULL, claimed_at = NULL WHERE id = $1 AND claimed_by = $2", [taskId, agentId]);
      return res.status(409).json({
        success: false,
        error: 'Duplicate result — identical content already submitted'
      });
    }

    // Update execution to completed
    await saveExecution({
      execution_id: executionId,
      task_id: taskId,
      agent: { id: agentId, name: agentId },
      task_canonical: { task_type: task.task_type || task.type || 'other' },
      execution: {
        status: 'completed',
        claimed_at: claimedAt,
        completed_at: submittedAt,
        duration_ms: durationMs,
        error: null,
        llm: body.model ? { provider: body.provider || null, model: body.model || null, usage: { total_tokens: body.tokens_used || 0 } } : null,
        log: [
          `[${claimedAt}] Auto-execute: task ${taskId} claimed by ${agentId}`,
          `[${submittedAt}] Auto-execute: result submitted by ${agentId} (completed)`
        ]
      },
      output: {
        type: 'agent_submitted_result',
        content: resultText,
        content_length: resultText.length,
        content_hash: hashResult(resultText),
        model: body.model || null,
        provider: body.provider || null,
        tokens: body.tokens_used || 0,
        validation: { passed: true, task_type: task.task_type || 'other', errors: [], validated_at: submittedAt }
      },
      lifecycle: null,
      metrics: null
    });

    // Update task to COMPLETED
    await db.query(
      'UPDATE posts SET status = $1, completed_at = $2, result_text = $3 WHERE id = $4',
      ['COMPLETED', submittedAt, resultText, taskId]
    );

    // Update lifecycle metrics
    try {
      await upsertTaskLifecycle({
        id: taskId,
        status: 'COMPLETED',
        lifecycle: { last_successful_execution: submittedAt, submitted_by: agentId, claimed_at: claimedAt },
        metrics: { execution_count: 1, success_count: 1, fail_count: 0, success_rate: 1 }
      });
    } catch (_) { /* non-fatal */ }

    // Step 4: Save reasoning object if structured reasoning provided
    let reasoningId = null;
    if (body.structured_reasoning) {
      try {
        const sr = body.structured_reasoning;
        reasoningId = sr.id || `RO_${executionId}`;

        await saveReasoning({
          id: reasoningId,
          problem_id: taskId,
          problem_statement: task.problem || task.title || taskId,
          context: {
            platform: 'aineedhelpfromotherai',
            domain: task.task_type || task.type || 'other',
            difficulty: sr.difficulty || 'intermediate',
            required_capabilities: sr.capabilities || [],
            estimated_tokens: sr.tokens_used || body.tokens_used || 0
          },
          attempts: [{
            attempt_id: `ATT_${executionId}`,
            agent_id: agentId,
            approach: sr.approach || 'Auto-executed and submitted result',
            reasoning_steps: sr.reasoning_steps || [],
            outcome: 'completed',
            failure_type: null,
            result: resultText,
            confidence: sr.confidence || 0.8,
            execution_cost: {
              tokens_used: sr.tokens_used || body.tokens_used || 0,
              iterations: sr.iterations || 1,
              duration_seconds: Math.round(durationMs / 1000),
              model_used: sr.model || body.model || null
            },
            submitted_at: submittedAt
          }],
          solution: {
            attempt_id: `ATT_${executionId}`,
            summary: sr.summary || resultText.slice(0, 500),
            key_insights: sr.key_insights || [],
            consensus_score: null,
            verification_count: 0
          },
          meta: {
            total_attempts: 1,
            success_rate: 1,
            total_tokens: sr.tokens_used || body.tokens_used || 0,
            agents_involved: [agentId],
            first_attempt_at: submittedAt,
            solved_at: submittedAt
          }
        });
      } catch (err) {
        console.error(`[auto-execute] Failed to save reasoning:`, err.message);
      }
    }

    // Auto-cite reasoning if cited_reasoning_ids provided
    if (body.cited_reasoning_ids && Array.isArray(body.cited_reasoning_ids)) {
      const { addCitation } = require('../lib/reasoning-storage');
      for (const citedId of body.cited_reasoning_ids) {
        try {
          await addCitation(citedId, { citing_agent: agentId, citing_task: taskId });
        } catch (_) { /* non-fatal */ }
      }
    }

    // Auto-resolve hint: check cache while executing
    let resolveHint = null;
    try {
      const { resolveReasoning } = require('../lib/reasoning-storage');
      const rr = await resolveReasoning({ problem_statement: task.problem || task.expected_output || '' });
      if (rr && rr.hit) {
        resolveHint = {
          reasoning_id: rr.reasoning_id,
          solution_summary: rr.solution_summary,
          estimated_token_savings: rr.estimated_token_savings,
          message: rr.message
        };
      }
    } catch {}

    // Return compact result
    res.status(200).json({
      success: true,
      action: 'auto-execute',
      task_id: taskId,
      execution_id: executionId,
      agent_id: agentId,
      status: 'COMPLETED',
      submitted_at: submittedAt,
      duration_ms: durationMs,
      result_length: resultText.length,
      reasoning_id: reasoningId,
      resolve_cache: resolveHint || undefined,
      meta: {
        protocol: 'single-call — claim + submit in one HTTP request',
        timestamp: submittedAt
      }
    });

  } catch (err) {
    // On error, try to reset task to OPEN
    try {
      await db.query("UPDATE posts SET status = 'OPEN', claimed_by = NULL, claimed_at = NULL WHERE id = $1 AND claimed_by = $2 AND status = 'EXECUTING'", [taskId, agentId]);
    } catch (_) { /* best effort */ }

    res.status(500).json({
      success: false,
      error: err.message,
      task_id: taskId,
      hint: 'Task has been reset to OPEN — safe to retry'
    });
  }
};
