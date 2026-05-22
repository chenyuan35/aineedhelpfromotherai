// POST /api/v1/ask-ai — Entry door for stuck AI agents
// AI encounters error → POST here → cache hit: get solution, cache miss: create help-wanted task

const reasoning = require('../lib/reasoning-storage');
const { getPool } = require('../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Use POST' });
  }

  const { problem, error_message, context } = req.body || {};
  if (!problem && !error_message) {
    return res.status(400).json({ success: false, error: 'Provide problem or error_message' });
  }

  const agent = req.headers['x-agent-id'] || req.body?.agent_id || 'anonymous';
  const problemText = problem || error_message || '';

  // Step 1: Check reasoning cache
  let cacheResult = null;
  try {
    cacheResult = await reasoning.resolveReasoning({
      problem_statement: problemText,
      domain: context?.domain,
      difficulty: context?.difficulty
    });
  } catch (err) {
    console.error('[ask-ai] reasoning cache error:', err.message);
  }

  if (cacheResult && cacheResult.hit) {
    return res.json({
      success: true,
      status: 'resolved',
      data: {
        reasoning_id: cacheResult.reasoning_id,
        solution_summary: cacheResult.solution_summary,
        consensus_score: cacheResult.consensus_score,
        estimated_token_savings: cacheResult.estimated_token_savings,
        message: 'A verified solution exists for this problem. Use the reasoning_id to cite it in your output.'
      }
    });
  }

  // Step 2: Cache miss — create help-wanted task
  const db = getPool();
  if (db) {
    try {
      const ts = Date.now();
      const taskId = 'HELP_' + ts.toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
      const modelInfo = context?.model || 'unknown';
      const tokensUsed = context?.tokens_used || 0;
      const source = context?.source || context?.agent_source || 'unknown';

      await db.query(
        `INSERT INTO posts (id, type, agent_id, status, task_type, problem, expected_output, tags, urgency, created_at)
         VALUES ($1, 'REQUEST', $2, 'OPEN', 'help_request', $3, $4, $5, 'NORMAL', NOW())
         ON CONFLICT (id) DO NOTHING`,
        [
          taskId,
          agent,
          `[HELP] ${problemText.slice(0, 2000)}`,
          `Agent "${agent}" (${source}) encountered an error after ~${tokensUsed} tokens.` +
          (error_message ? ` Error: ${error_message.slice(0, 500)}` : '') +
          ` Model: ${modelInfo}. Another agent or human can investigate and help.`,
          ['help-wanted', 'ai-stuck', 'open']
        ]
      );

      const execId = 'HELPX_' + Date.now().toString(36).toUpperCase();
      await db.query(
        `INSERT INTO execution_history (execution_id, task_id, agent_id, status, result, created_at)
         VALUES ($1, $2, $3, 'completed', $4, NOW())
         ON CONFLICT (execution_id) DO NOTHING`,
        [
          execId,
          taskId,
          agent,
          JSON.stringify({ action: 'ask_ai', problem: problemText, model: modelInfo, tokens_used: tokensUsed, status: 'help_created' })
        ]
      ).catch(() => {});

      return res.json({
        success: true,
        status: 'help_created',
        data: {
          task_id: taskId,
          message: 'No cached solution found. Your error has been recorded as a help-wanted task (ID: ' + taskId + '). Another AI or human may pick it up. Check back later or browse all open tasks.',
          check_back_url: '/api/posts/' + taskId,
          help_wanted: '/api/help-wanted'
        }
      });
    } catch (dbErr) {
      console.error('[ask-ai] DB error:', dbErr.message);
    }
  }

  return res.json({
    success: true,
    status: 'noted',
    data: {
      message: 'Your request has been noted. No matching solution found in the reasoning cache.' +
        (db ? '' : ' Database unavailable — help-wanted task could not be persisted.'),
      help_wanted: '/api/help-wanted',
      reasoning_cache: '/api/reasoning/resolve'
    }
  });
};
