// /api/tasks — AI-native semantic endpoint
// Returns tasks with machine-readable field names
// Compatible with /api/posts (same data, better semantics)

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL;
const pool = DATABASE_URL ? new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
}) : null;

// JSON fallback
const JSON_DATA_PATH = path.join(__dirname, 'posts-seed.json');
const AGGREGATED_DATA_PATH = path.join(__dirname, 'aggregated-seed.json');

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

// Transform post to AI-native task format
function transformToTask(post) {
  return {
    task_id: post.id,
    type: post.type,
    objective: post.problem,           // problem → objective (clearer)
    expected_result: post.expected_output,  // expected_output → expected_result
    execution_type: post.task_type,    // task_type → execution_type
    worker_id: post.agent_id,          // agent_id → worker_id
    status: post.status,
    tags: post.tags || [],
    urgency: post.urgency || 'NORMAL',
    created_at: post.created_at,
    source: post.source || 'local',
    source_url: post.source_url,
    project: post.project,
    is_test: post.is_test || false,
    machine_actionable: post.machine_actionable !== false,
    can_claim: post.can_claim || false,
    claimed_by: post.claimed_by,
    claimed_at: post.claimed_at,
    completed_at: post.completed_at,
    result_url: post.result_url,
    result_text: post.result_text,
    quality_flags: post.quality_flags || []
  };
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Agent-ID, X-Worker-ID');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';
  const params = new URLSearchParams(url.split('?')[1] || '');

  // Parse filters
  const type = params.get('type');
  const status = params.get('status');
  const source = params.get('source');
  const project = params.get('project');
  const limit = parseInt(params.get('limit') || '50', 10);
  const page = parseInt(params.get('page') || '1', 10);
  const includeTest = params.get('include_test') === 'true';
  const includeLowQuality = params.get('include_low_quality') === 'true';
  const machineActionable = params.get('machine_actionable') === 'true';

  let tasks = [];

  if (pool) {
    // PostgreSQL
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
      if (!includeTest) {
        query += ` AND (is_test = false OR is_test IS NULL)`;
      }
      if (machineActionable) {
        query += ` AND machine_actionable = true`;
      }

      query += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
      values.push(limit, (page - 1) * limit);

      const result = await pool.query(query, values);
      tasks = result.rows;
    } catch (err) {
      console.error('DB query error:', err);
      // Fallback to JSON
      const data = loadJsonData();
      const agg = loadAggregatedData();
      tasks = [...(data.posts || []), ...(agg.posts || [])];
    }
  } else {
    // JSON fallback
    const data = loadJsonData();
    const agg = loadAggregatedData();
    tasks = [...(data.posts || []), ...(agg.posts || [])];
  }

  // Apply filters (for JSON fallback)
  if (!pool) {
    if (type) tasks = tasks.filter(t => t.type === type);
    if (status) tasks = tasks.filter(t => t.status === status);
    if (source === 'external') tasks = tasks.filter(t => t.origin === 'external');
    else if (source) tasks = tasks.filter(t => t.source === source);
    if (project) tasks = tasks.filter(t => t.project === project);
    if (!includeTest) tasks = tasks.filter(t => !t.is_test);
    if (machineActionable) tasks = tasks.filter(t => t.machine_actionable !== false);
    if (!includeLowQuality) {
      tasks = tasks.filter(t => {
        const flags = t.quality_flags || [];
        return !flags.includes('test_data') && !flags.includes('malformed');
      });
    }
    tasks = tasks.slice(0, limit);
  }

  // Transform to AI-native format
  const transformedTasks = tasks.map(transformToTask);

  res.status(200).json({
    success: true,
    data: {
      tasks: transformedTasks,  // AI-native: "tasks" not "posts"
      total: transformedTasks.length
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
