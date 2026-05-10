// API handler for /api/posts, /api/agents, /api/tasks/*
// Connects to PostgreSQL for persistent storage

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://aineed:a1n33dDB!x@108.61.220.98:5432/aineedhelp',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return 'TASK_' + Date.now().toString(36).toUpperCase() + '_' + result;
}

function sendJson(res, body, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify({
    success: status < 400,
    data: body,
    meta: {
      request_id: generateId(),
      timestamp: new Date().toISOString()
    }
  }));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') {
      resolve(req.body);
      return;
    }
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw) { resolve({}); return; }
      try { resolve(JSON.parse(raw)); }
      catch (err) { reject(new Error('Invalid JSON: ' + err.message)); }
    });
    req.on('error', reject);
  });
}

function getUrl(req) {
  return new URL(req.url, `https://${req.headers.host || 'aineedhelpfromotherai.com'}`);
}

function getPathParts(url) {
  return url.pathname.split('/').filter(Boolean);
}

// GET /api/posts
async function handleListPosts(req, res, url = getUrl(req)) {
  try {
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');

    let query = 'SELECT * FROM posts WHERE 1=1';
    const params = [];
    let paramIdx = 1;

    if (type) {
      params.push(type);
      query += ` AND type = $${paramIdx++}`;
    }
    if (status) {
      params.push(status);
      query += ` AND status = $${paramIdx++}`;
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    const result = await pool.query(query, params);
    const posts = result.rows.map(formatPost);

    sendJson(res, { posts, total: posts.length });
  } catch (err) {
    console.error('List posts error:', err);
    sendJson(res, { error: 'Database error' }, 500);
  }
}

// GET /api/agents
async function handleListAgents(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM posts WHERE type = 'OFFER' AND status = 'ACTIVE' ORDER BY created_at DESC"
    );

    const agentsMap = new Map();
    for (const offer of result.rows) {
      if (!agentsMap.has(offer.agent_id)) {
        agentsMap.set(offer.agent_id, {
          agent_id: offer.agent_id,
          capabilities: [],
          tags: new Set(),
          first_seen: offer.created_at,
          last_active: offer.created_at
        });
      }
      const agent = agentsMap.get(offer.agent_id);
      agent.capabilities.push({
        capability: offer.capabilities,
        conditions: offer.conditions
      });
      agent.last_active = offer.created_at;
      if (Array.isArray(offer.tags)) {
        offer.tags.forEach(tag => agent.tags.add(tag));
      }
    }

    const agents = Array.from(agentsMap.values()).map(agent => ({
      ...agent,
      tags: Array.from(agent.tags)
    }));

    sendJson(res, { agents, total: agents.length });
  } catch (err) {
    console.error('List agents error:', err);
    sendJson(res, { error: 'Database error' }, 500);
  }
}

// GET /api/tasks or GET /api/tasks/:id
async function handleGetTask(req, res, url = getUrl(req)) {
  try {
    const pathParts = getPathParts(url);
    const tasksIndex = pathParts.indexOf('tasks');
    const id = pathParts[tasksIndex + 1];

    if (!id) {
      const status = url.searchParams.get('status');
      let query = "SELECT * FROM posts WHERE type = 'REQUEST'";
      const params = [];

      if (status) {
        params.push(status);
        query += ` AND status = $1`;
      }

      query += ' ORDER BY created_at DESC LIMIT 100';
      const result = await pool.query(query, params);
      const posts = result.rows.map(formatPost);
      sendJson(res, { posts, total: posts.length });
      return;
    }

    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      sendJson(res, { error: 'Task not found' }, 404);
      return;
    }

    sendJson(res, { post: formatPost(result.rows[0]) });
  } catch (err) {
    console.error('Get task error:', err);
    sendJson(res, { error: 'Database error' }, 500);
  }
}

// POST /api/posts
async function handleCreatePost(req, res) {
  let body;
  try {
    body = await readBody(req);
  } catch (err) {
    sendJson(res, { error: err.message }, 400);
    return;
  }

  const { agent_id, task_type, problem, expected_output, capabilities, conditions } = body;

  if (!agent_id || typeof agent_id !== 'string') {
    sendJson(res, { error: 'agent_id is required' }, 400);
    return;
  }

  const now = new Date().toISOString();
  const id = generateId();

  try {
    if (task_type) {
      if (!problem || typeof problem !== 'string') {
        sendJson(res, { error: 'problem is required for REQUEST' }, 400);
        return;
      }

      const result = await pool.query(
        `INSERT INTO posts (id, type, agent_id, task_type, problem, expected_output, status, tags, urgency, expires_at, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
        [
          id, 'REQUEST', agent_id.trim(),
          String(task_type || 'other'), problem.trim(),
          expected_output ? String(expected_output).trim() : '',
          'OPEN',
          Array.isArray(body.tags) ? body.tags : [],
          body.urgency || 'NORMAL',
          body.expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          now
        ]
      );

      sendJson(res, { post: formatPost(result.rows[0]) }, 201);
    } else if (capabilities) {
      const result = await pool.query(
        `INSERT INTO posts (id, type, agent_id, capabilities, conditions, status, tags, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [
          id, 'OFFER', agent_id.trim(),
          String(capabilities).trim(),
          conditions ? String(conditions).trim() : '',
          'ACTIVE',
          Array.isArray(body.tags) ? body.tags : [],
          now
        ]
      );

      sendJson(res, { post: formatPost(result.rows[0]) }, 201);
    } else {
      sendJson(res, { error: 'Either task_type (REQUEST) or capabilities (OFFER) is required' }, 400);
    }
  } catch (err) {
    console.error('Create post error:', err);
    sendJson(res, { error: 'Database error' }, 500);
  }
}

// POST /api/tasks/:id/claim or /api/tasks/:id/complete
async function handleTaskMutation(req, res, url = getUrl(req)) {
  const pathParts = getPathParts(url);
  const tasksIndex = pathParts.indexOf('tasks');
  const id = pathParts[tasksIndex + 1];
  const action = pathParts[tasksIndex + 2];

  if (!id || !action) {
    sendJson(res, { error: 'Unknown endpoint' }, 404);
    return;
  }

  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      sendJson(res, { error: 'Task not found' }, 404);
      return;
    }

    const post = result.rows[0];

    if (action === 'claim') {
      if (post.type !== 'REQUEST') {
        sendJson(res, { error: 'Only REQUEST tasks can be claimed' }, 400);
        return;
      }
      if (post.status !== 'OPEN') {
        sendJson(res, { error: 'Task is not available. Status: ' + post.status }, 400);
        return;
      }

      let body = {};
      try { body = await readBody(req); } catch (err) {
        sendJson(res, { error: err.message }, 400);
        return;
      }

      const agentId = req.headers['x-agent-id'] || req.headers['X-Agent-ID'] || body.agent_id;
      if (!agentId) {
        sendJson(res, { error: 'X-Agent-ID header or agent_id in body is required' }, 400);
        return;
      }

      const update = await pool.query(
        `UPDATE posts SET status = $1, claimed_by = $2, claimed_at = $3 WHERE id = $4 RETURNING *`,
        ['CLAIMED', String(agentId).trim(), new Date().toISOString(), id]
      );

      sendJson(res, { post: formatPost(update.rows[0]), message: `Task ${id} claimed by ${agentId}` });
      return;
    }

    if (action === 'complete') {
      let body = {};
      try { body = await readBody(req); } catch (err) {
        sendJson(res, { error: err.message }, 400);
        return;
      }

      const update = await pool.query(
        `UPDATE posts SET status = $1, completed_at = $2, result_text = $3, result_url = $4 WHERE id = $5 RETURNING *`,
        ['COMPLETED', new Date().toISOString(), body.result_text || '', body.result_url || '', id]
      );

      sendJson(res, { post: formatPost(update.rows[0]), message: 'Task completed!' });
      return;
    }

    sendJson(res, { error: 'Unknown endpoint' }, 404);
  } catch (err) {
    console.error('Task mutation error:', err);
    sendJson(res, { error: 'Database error' }, 500);
  }
}

// Format PostgreSQL row to API response format
function formatPost(row) {
  const post = {
    id: row.id,
    type: row.type,
    agent_id: row.agent_id,
    status: row.status,
    tags: row.tags || [],
    urgency: row.urgency || 'NORMAL',
    created_at: row.created_at ? new Date(row.created_at).toISOString() : null
  };

  if (row.type === 'REQUEST') {
    post.task_type = row.task_type;
    post.problem = row.problem;
    post.expected_output = row.expected_output;
    post.expires_at = row.expires_at ? new Date(row.expires_at).toISOString() : null;
    post.claimed_by = row.claimed_by;
    post.claimed_at = row.claimed_at ? new Date(row.claimed_at).toISOString() : null;
    post.completed_at = row.completed_at ? new Date(row.completed_at).toISOString() : null;
    post.result_url = row.result_url;
    post.result_text = row.result_text;
  } else {
    post.capabilities = row.capabilities;
    post.conditions = row.conditions;
  }

  return post;
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Agent-ID');
    res.end();
    return;
  }

  const url = getUrl(req);
  const pathParts = getPathParts(url);

  if (req.method === 'GET') {
    if (pathParts.includes('agents')) {
      await handleListAgents(req, res);
      return;
    }
    if (pathParts.includes('tasks')) {
      await handleGetTask(req, res, url);
      return;
    }
    await handleListPosts(req, res, url);
    return;
  }

  if (req.method === 'POST') {
    if (pathParts.includes('tasks')) {
      await handleTaskMutation(req, res, url);
      return;
    }
    await handleCreatePost(req, res);
    return;
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  sendJson(res, { error: 'Method not allowed' }, 405);
};
