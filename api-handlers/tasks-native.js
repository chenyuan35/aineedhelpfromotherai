// /api/tasks — AI-native semantic endpoint
// Returns tasks with machine-readable field names
// Compatible with /api/posts (same data, better semantics)

const fs = require('fs');
const path = require('path');
const { getPool } = require('../lib/db');

// JSON fallback
const JSON_DATA_PATH = path.join(__dirname, '..', 'api', 'posts-seed.json');
const AGGREGATED_DATA_PATH = path.join(__dirname, '..', 'api', 'aggregated-seed.json');

function loadJsonData() {
  try {
    const raw = fs.readFileSync(JSON_DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { posts: [], agents: [] };
  }
}

function loadAggregatedData() {
  try {
    const raw = fs.readFileSync(AGGREGATED_DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { posts: [] };
  }
}

function parseJsonbField(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return Object.values(value);
  try { return JSON.parse(value); } catch { return fallback; }
}

// Quality flags logic (same as posts.js)
function getQualityFlags(post) {
  const flags = [];
  if (!post.agent_id || post.agent_id.length < 2) flags.push('missing_agent');
  if (post.type === 'REQUEST') {
    if (!post.problem || post.problem.length < 10) flags.push('vague_problem');
    if (post.capabilities) flags.push('offer_text_in_request');
  }
  if (post.type === 'OFFER' && (!post.capabilities || post.capabilities.length < 5)) {
    flags.push('vague_capabilities');
  }
  if (post.id && post.id.startsWith('TASK_SEED_')) flags.push('test_data');
  if (post.expires_at && new Date(post.expires_at) < new Date()) flags.push('expired');
  return flags;
}

function isMachineActionable(post, flags) {
  if (flags.includes('test_data')) return false;
  if (flags.includes('vague_problem')) return false;
  if (post.status !== 'OPEN' && post.status !== 'ACTIVE') return false;
  return true;
}

function buildAgentEval(post) {
  const capabilities = parseJsonbField(post.required_capabilities, []);
  const estimatedMinutes = post.estimated_minutes || null;
  const successCriteria = parseJsonbField(post.success_criteria, []);
  const verification = post.verification || null;

  const estimatedTokens = estimatedMinutes
    ? Math.max(500, estimatedMinutes * 200)
    : null;

  const hasDeterministicVerification = verification && verification.type && verification.type !== 'custom';

  return {
    required_capabilities: capabilities,
    estimated_minutes: estimatedMinutes,
    estimated_cost_tokens: estimatedTokens,
    success_criteria: successCriteria,
    verification_available: hasDeterministicVerification,
    verification_type: verification ? verification.type : null,
    is_good_first_task: estimatedMinutes !== null && estimatedMinutes <= 5 && successCriteria.length > 0,
  };
}

// Transform post to AI-native task format
function transformToTask(post) {
  const flags = Array.isArray(post.quality_flags) ? post.quality_flags : getQualityFlags(post);
  const isTest = flags.includes('test_data');
  const machineActionable = post.machine_actionable !== undefined
    ? post.machine_actionable
    : isMachineActionable(post, flags);

  const capabilities = parseJsonbField(post.required_capabilities, []);
  const successCriteria = parseJsonbField(post.success_criteria, []);
  const verification = post.verification || null;

  return {
    task_id: post.id,
    type: post.type,
    objective: post.problem,
    expected_result: post.expected_output,
    execution_type: post.task_type,
    worker_id: post.agent_id,
    status: post.status,
    tags: post.tags || [],
    urgency: post.urgency || 'NORMAL',
    created_at: post.created_at,
    source: post.source || post.origin || 'local',
    source_url: post.source_url,
    project: post.project,
    is_test: isTest,
    machine_actionable: machineActionable,
    can_claim: post.type === 'REQUEST' && post.status === 'OPEN' && machineActionable,
    claimed_by: post.claimed_by,
    claimed_at: post.claimed_at,
    completed_at: post.completed_at,
    result_url: post.result_url,
    result_text: post.result_text,
    quality_flags: flags,
    // Agent-Readable Task Semantics
    required_capabilities: capabilities,
    estimated_minutes: post.estimated_minutes || null,
    success_criteria: successCriteria,
    verification: verification,
    difficulty: post.difficulty || null,
    // Agent evaluation metadata
    agent_eval: buildAgentEval(post),
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Agent-ID, X-Worker-ID');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';
  const params = new URLSearchParams(url.split('?')[1] || '');

  const type = params.get('type');
  const status = params.get('status');
  const source = params.get('source');
  const project = params.get('project');
  const limit = parseInt(params.get('limit') || '50', 10);
  const page = parseInt(params.get('page') || '1', 10);
  const includeTest = params.get('include_test') === 'true';
  const includeLowQuality = params.get('include_low_quality') === 'true';
  const machineActionable = params.get('machine_actionable') === 'true';
  const goodFirstOnly = params.get('good_first') === 'true';

  let tasks = [];

  const db = getPool();
  if (db) {
    try {
      let query = 'SELECT * FROM posts WHERE 1=1';
      const values = [];
      let idx = 1;

      if (type) {
        query += ` AND type = $${idx++}`;
        values.push(type);
      }
      if (status) {
        query += ` AND status = $${idx++}`;
        values.push(status);
      }
      if (source) {
        if (source === 'external') {
          query += ` AND origin = 'external'`;
        } else {
          query += ` AND source = $${idx++}`;
          values.push(source);
        }
      }
      if (project) {
        query += ` AND project = $${idx++}`;
        values.push(project);
      }

      query += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
      values.push(limit, (page - 1) * limit);

      const result = await db.query(query, values);
      tasks = result.rows;
    } catch (err) {
      console.error('DB query error:', err);
      const data = loadJsonData();
      const agg = loadAggregatedData();
      tasks = [...(data.posts || []), ...(agg.posts || [])];
    }
  } else {
    const data = loadJsonData();
    const agg = loadAggregatedData();
    tasks = [...(data.posts || []), ...(agg.posts || [])];
  }

  // Transform first (adds quality_flags, is_test, machine_actionable, agent_eval)
  tasks = tasks.map(transformToTask);

  // JS-side filtering on computed fields
  if (!includeTest) tasks = tasks.filter(t => !t.is_test);
  if (machineActionable) tasks = tasks.filter(t => t.machine_actionable);
  if (goodFirstOnly) tasks = tasks.filter(t => t.agent_eval && t.agent_eval.is_good_first_task);
  if (!includeLowQuality) {
    tasks = tasks.filter(t => {
      const flags = Array.isArray(t.quality_flags) ? t.quality_flags : [];
      return !flags.includes('test_data') && !flags.includes('malformed');
    });
  }

  res.status(200).json({
    success: true,
    data: {
      tasks: tasks,
      total: tasks.length
    },
    meta: {
      request_id: `TASK_${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      endpoint: '/api/tasks',
      format: 'ai-native',
      migration_note: 'This endpoint uses AI-native field names. See /api/posts for legacy format.'
    }
  });
};
