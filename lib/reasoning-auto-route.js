const { getPool } = require('./db');
const crypto = require('crypto');

function generateTaskId() {
  return 'TASK_AR_' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function generateROId() {
  return 'RO_AR_' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function isAutoRoutedTask(taskId) {
  return taskId && taskId.startsWith('TASK_AR_');
}

async function getTaskProblem(db, taskId) {
  const r = await db.query('SELECT problem FROM posts WHERE id = $1', [taskId]);
  return r.rows[0]?.problem || null;
}

async function createTaskFromMiss(params) {
  try {
    const db = getPool();
    if (!db) return { created: false, reason: 'db_unavailable' };
    const id = generateTaskId();
    const now = new Date().toISOString();
    const problem = (params.problem_statement || '').slice(0, 2000);
    const tags = JSON.stringify(['auto-routed', params.domain || 'unknown'].filter(Boolean));
    await db.query(
      `INSERT INTO posts (id, type, agent_id, task_type, problem, status, tags, created_at, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, 'REQUEST', 'system', 'auto-routed', problem, 'OPEN', tags, now, 'auto-route']
    );
    return { created: true, task_id: id, problem };
  } catch (err) {
    console.error('[auto-route] createTaskFromMiss error:', err.message);
    return { created: false, reason: err.message };
  }
}

async function storeReasoningFromSubmission(taskId, agentId, submitBody) {
  try {
    const db = getPool();
    if (!db) return { stored: false, reason: 'db_unavailable' };
    const problem = await getTaskProblem(db, taskId);
    if (!problem) return { stored: false, reason: 'task_not_found' };
    const roId = generateROId();
    const now = new Date().toISOString();
    const sr = submitBody.structured_reasoning || {};
    const resultText = submitBody.result || sr.result || '';
    const ro = {
      id: roId,
      problem_id: taskId,
      problem_statement: problem,
      context: JSON.stringify({
        platform: 'aineedhelpfromotherai',
        domain: sr.domain || 'auto-routed',
        difficulty: sr.difficulty || 'intermediate',
        required_capabilities: sr.capabilities || [],
        estimated_tokens: sr.tokens_used || submitBody.tokens_used || 0
      }),
      attempts: JSON.stringify([{
        attempt_id: `ATT_AR_${taskId}`,
        agent_id: agentId,
        approach: sr.approach || 'Auto-routed task solved by agent',
        reasoning_steps: sr.reasoning_steps || [],
        outcome: 'completed',
        failure_type: null,
        result: resultText.slice(0, 10000),
        confidence: sr.confidence || 0.8,
        submitted_at: now
      }]),
      solution: JSON.stringify(sr.solution ? sr.solution : {
        attempt_id: `ATT_AR_${taskId}`,
        summary: sr.summary || resultText.slice(0, 500),
        key_insights: sr.key_insights || [],
        consensus_score: null,
        verification_count: 0
      }),
      meta: JSON.stringify({
        total_attempts: 1,
        success_rate: 1,
        total_tokens: sr.tokens_used || submitBody.tokens_used || 0,
        agents_involved: [agentId],
        auto_routed: true,
        source_task: taskId,
        solved_at: now
      }),
      created_at: now,
      updated_at: now
    };
    await db.query(
      `INSERT INTO reasoning_objects (id, problem_id, problem_statement, context, attempts, solution, meta, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [ro.id, ro.problem_id, ro.problem_statement, ro.context, ro.attempts, ro.solution, ro.meta, ro.created_at, ro.updated_at]
    );
    try {
      const rc = require('./resolve-cache');
      const reasonStorage = require('./reasoning-storage');
      const resolveResult = await reasonStorage.resolveReasoning({ problem_statement: problem });
      if (resolveResult && resolveResult.hit) {
        rc.setHint(taskId, {
          hit: true, reasoning_id: resolveResult.reasoning_id,
          solution_summary: resolveResult.solution_summary,
          estimated_token_savings: resolveResult.estimated_token_savings,
          message: `Auto-stored after submission by ${agentId}`,
          checked_at: now
        });
      }
    } catch (e) {
      console.error('[auto-route] resolve-cache update error:', e.message);
    }
    return { stored: true, reasoning_id: roId };
  } catch (err) {
    console.error('[auto-route] storeReasoningFromSubmission error:', err.message);
    return { stored: false, reason: err.message };
  }
}

module.exports = { createTaskFromMiss, isAutoRoutedTask, storeReasoningFromSubmission, generateTaskId, generateROId };
