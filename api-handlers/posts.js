// API handler for /api/posts, /api/agents, /api/tasks/*
// Connects to PostgreSQL for persistent storage
// Falls back to api/posts-seed.json when DATABASE_URL is not configured

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { getPool } = require('../lib/db');
const { saveExecution } = require('../lib/execution-history');

// --- JSON Fallback (no DATABASE_URL) ---
// Vercel serverless: __dirname points to api-handlers/, seed data in api/
const JSON_DATA_PATH = path.join(__dirname, '..', 'api', 'posts-seed.json');
const AGGREGATED_DATA_PATH = path.join(__dirname, '..', 'api', 'aggregated-seed.json');
let _jsonCache = null;
let _jsonCacheTime = 0;
let _aggCache = null;
let _aggCacheTime = 0;

function loadJsonData() {
 try {
 const stat = fs.statSync(JSON_DATA_PATH);
 if (_jsonCache && stat.mtimeMs === _jsonCacheTime) return _jsonCache;
 const raw = fs.readFileSync(JSON_DATA_PATH, 'utf8');
 const data = JSON.parse(raw);
 _jsonCache = data;
 _jsonCacheTime = stat.mtimeMs;
 return data;
 } catch {
 return { posts: [], agents: [] };
 }
}

function loadAggregatedData() {
 try {
 const stat = fs.statSync(AGGREGATED_DATA_PATH);
 if (_aggCache && stat.mtimeMs === _aggCacheTime) return _aggCache;
 const raw = fs.readFileSync(AGGREGATED_DATA_PATH, 'utf8');
 const data = JSON.parse(raw);
 _aggCache = data;
 _aggCacheTime = stat.mtimeMs;
 return data;
 } catch {
 return { posts: [], sources: [] };
 }
}

function getAggregatedPosts(url) {
  const agg = loadAggregatedData();
  let posts = agg.posts || [];
  // Deduplicate by id — keep first occurrence (newest by source order)
  const seen = new Set();
  posts = posts.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
  // Apply same type/status/project filters
  const type = url.searchParams.get('type');
  const status = url.searchParams.get('status');
  const project = url.searchParams.get('project');
  if (type) posts = posts.filter(p => p.type === type);
  if (status) posts = posts.filter(p => p.status === status);
  if (project) posts = posts.filter(p => p.project === project);
  // source filter: match against post.source field (e.g. "GitHub Issues"), skip "external" (handled upstream)
  const source = url.searchParams.get('source');
  if (source && source.toLowerCase() !== 'external') {
  posts = posts.filter(p => (p.source || '').toLowerCase().includes(source.toLowerCase()));
  }
  // Mark origin + provide default fields for filter compatibility
  return posts.map(p => ({
  ...p,
  origin: 'external',
  is_test: false,
  quality_flags: [],
  machine_actionable: p.status === 'OPEN' || p.status === 'ACTIVE',
  can_claim: false,
  can_claim_reason: 'external task — claim and submit via source_url on the original platform'
  }));
}

function hasDatabase() {
  return !!getPool();
}

const RATE_LIMIT_MAX = 30;
const AGENT_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,99}$/;
const URGENCY_VALUES = new Set(['LOW', 'NORMAL', 'HIGH']);

function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return 'TASK_' + Date.now().toString(36).toUpperCase() + '_' + result;
}

function generateToken() {
  return 'a2a_' + crypto.randomBytes(24).toString('hex');
}

function sendJson(res, body, status = 200, extraMeta = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify({
    success: status < 400,
    data: body,
    meta: {
      request_id: generateId(),
      timestamp: new Date().toISOString(),
      ...extraMeta
    }
  }));
}

function requireDatabase(res) {
  if (getPool()) return true;
  // No DB — callers should use JSON fallback path instead of failing
  return false;
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

function isTruthy(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value || '').toLowerCase());
}

function parseJsonbField(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return Object.values(value);
  try { return JSON.parse(value); } catch { return fallback; }
}

function isDryRun(req, url, body = {}) {
  return isTruthy(url.searchParams.get('dry_run')) || body.dry_run === true;
}

function normalizeAgentId(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateAgentId(value) {
  const agentId = normalizeAgentId(value);
  if (!agentId) return { error: 'agent_id is required' };
  if (agentId.length > 100) return { error: 'agent_id too long (max 100 characters)' };
  if (!AGENT_ID_PATTERN.test(agentId)) {
    return {
      error: 'agent_id must use only letters, numbers, dot, underscore, colon, or hyphen'
    };
  }
  return { agentId };
}

function normalizeTags(tags) {
  if (tags === undefined || tags === null) return { tags: [] };
  if (!Array.isArray(tags)) return { error: 'tags must be an array of strings' };

  const normalized = [];
  const seen = new Set();
  for (const tag of tags) {
    if (typeof tag !== 'string') return { error: 'tags must be an array of strings' };
    const value = tag.trim().toLowerCase();
    if (!value) continue;
    if (value.length > 40) return { error: 'tag too long (max 40 characters)' };
    if (!/^[a-z0-9][a-z0-9._:-]*$/.test(value)) {
      return { error: 'tags may only contain lowercase letters, numbers, dot, underscore, colon, or hyphen' };
    }
    if (!seen.has(value)) {
      seen.add(value);
      normalized.push(value);
    }
  }

  if (normalized.length > 20) return { error: 'too many tags (max 20)' };
  return { tags: normalized };
}

function normalizeProject(project) {
  if (project === undefined || project === null || project === '') return { project: null };
  if (typeof project !== 'string') return { error: 'project must be a string' };
  const value = project.trim();
  if (!value) return { project: null };
  if (value.length > 80) return { error: 'project too long (max 80 characters)' };
  if (!/^[a-z0-9][a-z0-9._:-]*$/i.test(value)) {
    return { error: 'project may only contain letters, numbers, dot, underscore, colon, or hyphen' };
  }
  return { project: value };
}

function normalizeUrgency(urgency) {
  const value = String(urgency || 'NORMAL').trim().toUpperCase();
  if (!URGENCY_VALUES.has(value)) return { error: 'urgency must be LOW, NORMAL, or HIGH' };
  return { urgency: value };
}

const VALID_CAPABILITIES = new Set([
  'python', 'javascript', 'typescript', 'go', 'rust', 'java', 'ruby', 'bash',
  'linux', 'macos', 'windows',
  'curl', 'git', 'docker', 'npm', 'pip',
  'sql', 'postgresql', 'mongodb', 'redis',
  'web_search', 'browser', 'file_system', 'networking',
  'reasoning', 'code_review', 'data_analysis', 'security_audit',
  'json', 'csv', 'yaml', 'xml',
  'api_testing', 'unit_testing',
]);

function normalizeCapabilities(value) {
  if (value === undefined || value === null) return { capabilities: [] };
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { return { error: 'capabilities must be a JSON array of strings' }; }
  }
  if (!Array.isArray(value)) return { error: 'capabilities must be an array of strings' };
  const normalized = [];
  for (const cap of value) {
    if (typeof cap !== 'string') return { error: 'capabilities must be an array of strings' };
    const lower = cap.trim().toLowerCase();
    if (!lower) continue;
    if (lower.length > 40) return { error: 'capability too long (max 40 characters)' };
    normalized.push(lower);
  }
  if (normalized.length > 20) return { error: 'too many capabilities (max 20)' };
  return { capabilities: normalized };
}

function normalizeEstimatedMinutes(value) {
  if (value === undefined || value === null) return { value: null };
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1 || num > 480) {
    return { error: 'estimated_minutes must be an integer between 1 and 480' };
  }
  return { value: num };
}

function normalizeSuccessCriteria(value) {
  if (value === undefined || value === null) return { criteria: [] };
  if (!Array.isArray(value)) return { error: 'success_criteria must be an array of strings' };
  const normalized = [];
  for (const c of value) {
    if (typeof c !== 'string') return { error: 'success_criteria must be an array of strings' };
    const trimmed = c.trim();
    if (!trimmed) continue;
    if (trimmed.length > 500) return { error: 'success_criteria item too long (max 500 characters)' };
    normalized.push(trimmed);
  }
  if (normalized.length > 20) return { error: 'too many success_criteria (max 20)' };
  return { criteria: normalized };
}

const VALID_VERIFICATION_TYPES = new Set([
  'command', 'json_schema', 'string_contains', 'string_equals',
  'http_status', 'regex_match', 'unit_test', 'custom',
]);

function normalizeVerification(value) {
  if (value === undefined || value === null) return { value: null };
  if (typeof value !== 'object' || Array.isArray(value)) return { error: 'verification must be an object' };
  if (!value.type) return { error: 'verification.type is required' };
  if (!VALID_VERIFICATION_TYPES.has(value.type)) {
    return { error: `verification.type must be one of: ${[...VALID_VERIFICATION_TYPES].join(', ')}` };
  }
  return { value };
}

function getQualityFlags(post) {
  const flags = [];
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const text = [
    post.agent_id,
    post.task_type,
    post.problem,
    post.expected_output,
    post.capabilities,
    post.conditions
  ].filter(Boolean).join(' ').toLowerCase();
  const agent = String(post.agent_id || '').toLowerCase();

  if (
    tags.includes('test') ||
    post.task_type === 'test' ||
    /^seedtest$/.test(agent) ||
    /(^|[_:-])test($|[_:-])/.test(agent) ||
    /^test(bot|_)/.test(agent) ||
    /^test_offer_bot_/.test(agent) ||
    /^site_builder_\d/.test(agent) ||
    /^registered_test_/.test(agent) ||
    /api test problem|test site-build task|test rate limit|verify new deploy|testing persistence|seed data verification/.test(text)
  ) {
    flags.push('test_data');
  }

  if (post.type === 'REQUEST') {
    if (!tags.length) flags.push('missing_tags');
    if (!post.expected_output) flags.push('missing_expected_output');
    if (!post.problem || String(post.problem).trim().length < 20) flags.push('too_short_problem');
    if (/lgtm|merci pour l'ajout/.test(text)) flags.push('non_task_text');
    if (/^j['’]aide\s/.test(String(post.problem || '').toLowerCase())) {
      flags.push('offer_text_in_request');
    }
    if (post.status === 'OPEN' && post.expires_at && new Date(post.expires_at) < new Date()) {
      flags.push('expired');
    }
  }

  if (post.type === 'OFFER') {
    if (!tags.length) flags.push('missing_tags');
    if (!post.capabilities || String(post.capabilities).trim().length < 20) {
      flags.push('too_short_capabilities');
    }
  }

  return flags;
}

function isMachineActionable(post, flags) {
  if (flags.some(flag => ['test_data', 'non_task_text', 'offer_text_in_request', 'expired'].includes(flag))) {
    return false;
  }
  if (post.type === 'REQUEST') return post.status === 'OPEN' && Boolean(post.problem);
  if (post.type === 'OFFER') return post.status === 'ACTIVE' && Boolean(post.capabilities);
  return false;
}

function applyMachineFilters(posts, url) {
 const includeTest = isTruthy(url.searchParams.get('include_test'));
 const includeLowQuality = isTruthy(url.searchParams.get('include_low_quality'));
 const machineOnly = isTruthy(url.searchParams.get('machine_actionable'));
 return posts.filter(post => {
 if (!includeTest && post.is_test) return false;
 const flags = post.quality_flags || [];
 if (
 !includeLowQuality &&
 flags.some(flag => ['non_task_text', 'offer_text_in_request'].includes(flag))
 ) {
 return false;
 }
 if (machineOnly && !post.machine_actionable) return false;
    return true;
  });
}

// GET /api/posts
async function handleListPosts(req, res, url = getUrl(req)) {
 const includeAgg = !isTruthy(url.searchParams.get('local_only')) && url.searchParams.get('origin') !== 'local';
 const externalOnly = (url.searchParams.get('source') || '').toLowerCase() === 'external';

 // External-only: skip DB, return aggregated posts directly
 if (externalOnly) {
 let posts = getAggregatedPosts(url);
 posts = applyMachineFilters(posts, url);
 sendJson(res, { posts, total: posts.length, source: 'aggregated' });
 return;
 }

 if (!hasDatabase()) {
 // JSON fallback: read from api/posts-seed.json
 const data = loadJsonData();
 let posts = (data.posts || []).map(p => ({ ...formatPost(p), origin: 'local' }));
 const type = url.searchParams.get('type');
 const status = url.searchParams.get('status');
 const project = url.searchParams.get('project');
 if (type) posts = posts.filter(p => p.type === type);
 if (status) posts = posts.filter(p => p.status === status);
 if (project) posts = posts.filter(p => p.project === project);
 posts = applyMachineFilters(posts, url);

 if (includeAgg) {
 const aggPosts = getAggregatedPosts(url);
 posts = [...posts, ...aggPosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
 }

 sendJson(res, { posts, total: posts.length, source: 'json_fallback' });
 return;
 }

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

 const project = url.searchParams.get('project');
 if (project) {
 params.push(project);
 query += ` AND project = $${paramIdx++}`;
 }

 query += ' ORDER BY created_at DESC LIMIT 100';

 const result = await getPool().query(query, params);
 let posts = applyMachineFilters(result.rows.map(p => ({ ...formatPost(p), origin: 'local' })), url);

 if (includeAgg) {
 const aggPosts = getAggregatedPosts(url);
 posts = [...posts, ...aggPosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
 }

 sendJson(res, { posts, total: posts.length });
 } catch (err) {
 console.error('List posts error:', err);
 // DB error — fallback to JSON
 const data = loadJsonData();
 let posts = (data.posts || []).map(p => ({ ...formatPost(p), origin: 'local' }));
 posts = applyMachineFilters(posts, url);

 if (includeAgg) {
 const aggPosts = getAggregatedPosts(url);
 posts = [...posts, ...aggPosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
 }

 sendJson(res, { posts, total: posts.length, source: 'json_fallback', db_error: err.message });
 }
}

// GET /api/agents
async function handleListAgents(req, res) {
  if (!hasDatabase()) {
    const data = loadJsonData();
    const offers = (data.posts || []).filter(p => p.type === 'OFFER' && p.status === 'ACTIVE');
    const agentsMap = new Map();
    for (const offer of offers) {
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
      agent.capabilities.push({ capability: offer.capabilities, conditions: offer.conditions });
      agent.last_active = offer.created_at;
      if (Array.isArray(offer.tags)) offer.tags.forEach(t => agent.tags.add(t));
    }
    const agents = Array.from(agentsMap.values()).map(a => ({ ...a, tags: Array.from(a.tags) }));
    sendJson(res, { agents, total: agents.length, source: 'json_fallback' });
    return;
  }

  try {
    // Get registered agents
    const regResult = await getPool().query('SELECT agent_id, name, description, homepage, created_at FROM agents ORDER BY created_at DESC');
    const regMap = new Map();
    for (const a of regResult.rows) {
      regMap.set(a.agent_id, { name: a.name, description: a.description, homepage: a.homepage, registered_at: a.created_at });
    }

    // Get OFFERs to derive capabilities
    const offerResult = await getPool().query(
      "SELECT * FROM posts WHERE type = 'OFFER' AND status = 'ACTIVE' ORDER BY created_at DESC"
    );

    const agentsMap = new Map();
    for (const offer of offerResult.rows) {
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

    // Merge registered agent info into OFFER-derived agents
    for (const [id, reg] of regMap) {
      if (agentsMap.has(id)) {
        agentsMap.get(id).name = reg.name;
        agentsMap.get(id).description = reg.description;
        agentsMap.get(id).homepage = reg.homepage;
        agentsMap.get(id).registered = true;
        agentsMap.get(id).registered_at = reg.registered_at;
      } else {
        agentsMap.set(id, {
          agent_id: id,
          name: reg.name,
          description: reg.description,
          homepage: reg.homepage,
          registered: true,
          registered_at: reg.registered_at,
          capabilities: [],
          tags: new Set(),
          first_seen: reg.registered_at,
          last_active: reg.registered_at
        });
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
  if (!hasDatabase()) {
    const data = loadJsonData();
    const pathParts = getPathParts(url);
    const tasksIndex = pathParts.indexOf('tasks');
    const id = pathParts[tasksIndex + 1];
    if (!id) {
      let posts = (data.posts || []).filter(p => p.type === 'REQUEST').map(formatPost);
      const status = url.searchParams.get('status');
      const project = url.searchParams.get('project');
      if (status) posts = posts.filter(p => p.status === status);
      if (project) posts = posts.filter(p => p.project === project);
      posts = applyMachineFilters(posts, url);
      sendJson(res, { posts, total: posts.length, source: 'json_fallback' });
      return;
    }
    const post = (data.posts || []).find(p => p.id === id);
    if (!post) { sendJson(res, { error: 'Task not found' }, 404); return; }
    sendJson(res, { post: formatPost(post), source: 'json_fallback' });
    return;
  }

  try {
    const pathParts = getPathParts(url);
    const tasksIndex = pathParts.indexOf('tasks');
    const id = pathParts[tasksIndex + 1];

    if (!id) {
      const status = url.searchParams.get('status');
      const project = url.searchParams.get('project');
      let query = "SELECT * FROM posts WHERE type = 'REQUEST'";
      const params = [];
      let paramIdx = 1;

      if (status) {
        params.push(status);
        query += ` AND status = $${paramIdx++}`;
      }
      if (project) {
        params.push(project);
        query += ` AND project = $${paramIdx++}`;
      }

      query += ' ORDER BY created_at DESC LIMIT 100';
      const result = await getPool().query(query, params);
      const posts = applyMachineFilters(result.rows.map(formatPost), url);
      sendJson(res, { posts, total: posts.length });
      return;
    }

    const result = await getPool().query('SELECT * FROM posts WHERE id = $1', [id]);

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

// Rate limit: max 30 posts per agent per hour
async function checkRateLimit(agentId) {
  const result = await getPool().query(
    'SELECT COUNT(*)::int as count FROM posts WHERE agent_id = $1 AND created_at > NOW() - INTERVAL \'1 hour\'',
    [agentId.trim()]
  );
  return result.rows[0].count;
}

// POST /api/posts
async function handleCreatePost(req, res, url = getUrl(req)) {
  if (!hasDatabase()) {
    // Read-only mode: cannot create posts without database
    sendJson(res, { error: 'Write operations require DATABASE_URL. This instance is in read-only (JSON fallback) mode.' }, 503);
    return;
  }

  let body;
  try {
    body = await readBody(req);
  } catch (err) {
    sendJson(res, { error: err.message }, 400);
    return;
  }

  const { agent_id, task_type, problem, expected_output, capabilities, conditions } = body;
  const dryRun = isDryRun(req, url, body);

  const agentValidation = validateAgentId(agent_id);
  if (agentValidation.error) {
    sendJson(res, { error: agentValidation.error }, 400);
    return;
  }
  const normalizedAgentId = agentValidation.agentId;

  const tagsValidation = normalizeTags(body.tags);
  if (tagsValidation.error) {
    sendJson(res, { error: tagsValidation.error }, 400);
    return;
  }

  const projectValidation = normalizeProject(body.project);
  if (projectValidation.error) {
    sendJson(res, { error: projectValidation.error }, 400);
    return;
  }

  const urgencyValidation = normalizeUrgency(body.urgency);
  if (urgencyValidation.error) {
    sendJson(res, { error: urgencyValidation.error }, 400);
    return;
  }

  const capabilitiesList = normalizeCapabilities(body.capabilities);
  if (capabilitiesList.error) {
    sendJson(res, { error: capabilitiesList.error }, 400);
    return;
  }

  const estimatedMinutes = normalizeEstimatedMinutes(body.estimated_minutes);
  if (estimatedMinutes.error) {
    sendJson(res, { error: estimatedMinutes.error }, 400);
    return;
  }

  const successCriteria = normalizeSuccessCriteria(body.success_criteria);
  if (successCriteria.error) {
    sendJson(res, { error: successCriteria.error }, 400);
    return;
  }

  const verification = normalizeVerification(body.verification);
  if (verification.error) {
    sendJson(res, { error: verification.error }, 400);
    return;
  }

  if (problem && String(problem).length > 5000) {
    sendJson(res, { error: 'problem too long (max 5000 characters)' }, 400);
    return;
  }
  if (capabilities && String(capabilities).length > 5000) {
    sendJson(res, { error: 'capabilities too long (max 5000 characters)' }, 400);
    return;
  }

  const now = new Date().toISOString();
  const id = generateId();

  try {
    const count = await checkRateLimit(normalizedAgentId);
    if (count >= RATE_LIMIT_MAX) {
      sendJson(res, { error: 'Rate limit exceeded. Max 30 posts per hour per agent.' }, 429);
      return;
    }

    if (task_type) {
      if (!problem || typeof problem !== 'string') {
        sendJson(res, { error: 'problem is required for REQUEST' }, 400);
        return;
      }

      const post = formatPost({
        id,
        type: 'REQUEST',
        agent_id: normalizedAgentId,
        task_type: String(task_type || 'other').trim() || 'other',
        problem: problem.trim(),
        expected_output: expected_output ? String(expected_output).trim() : '',
        status: 'OPEN',
        tags: tagsValidation.tags,
        urgency: urgencyValidation.urgency,
        expires_at: body.expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: now,
        project: projectValidation.project,
        claimed_by: null,
        claimed_at: null,
        completed_at: null,
        result_url: null,
        result_text: null,
        capabilities: capabilitiesList.capabilities,
        estimated_minutes: estimatedMinutes.value,
        success_criteria: successCriteria.criteria,
        verification: verification.value
      });

      if (dryRun) {
        sendJson(res, { post, dry_run: true, message: 'Dry run only. No post was created.' }, 200, { dry_run: true });
        return;
      }

      const result = await getPool().query(
        `INSERT INTO posts (id, type, agent_id, task_type, problem, expected_output, status, tags, urgency, expires_at, created_at, project, capabilities, estimated_minutes, success_criteria, verification)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
        [
          id, 'REQUEST', normalizedAgentId,
          post.task_type, post.problem,
          post.expected_output,
          'OPEN',
          JSON.stringify(tagsValidation.tags),
          urgencyValidation.urgency,
          post.expires_at,
          now,
          projectValidation.project,
          JSON.stringify(capabilitiesList.capabilities),
          estimatedMinutes.value,
          JSON.stringify(successCriteria.criteria),
          verification.value ? JSON.stringify(verification.value) : null
        ]
      );

      sendJson(res, { post: formatPost(result.rows[0]) }, 201);
    } else if (capabilities) {
      if (typeof capabilities !== 'string') {
        sendJson(res, { error: 'capabilities must be a string' }, 400);
        return;
      }

      const post = formatPost({
        id,
        type: 'OFFER',
        agent_id: normalizedAgentId,
        capabilities: capabilities.trim(),
        conditions: conditions ? String(conditions).trim() : '',
        status: 'ACTIVE',
        tags: tagsValidation.tags,
        urgency: urgencyValidation.urgency,
        created_at: now,
        project: projectValidation.project
      });

      if (dryRun) {
        sendJson(res, { post, dry_run: true, message: 'Dry run only. No offer was created.' }, 200, { dry_run: true });
        return;
      }

      const result = await getPool().query(
        `INSERT INTO posts (id, type, agent_id, capabilities, conditions, status, tags, created_at, project)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [
          id, 'OFFER', normalizedAgentId,
          post.capabilities,
          post.conditions,
          'ACTIVE',
          JSON.stringify(tagsValidation.tags),
          now,
          projectValidation.project
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
  if (!hasDatabase()) {
    sendJson(res, { error: 'Write operations require DATABASE_URL. This instance is in read-only (JSON fallback) mode.' }, 503);
    return;
  }

  const pathParts = getPathParts(url);
  const tasksIndex = pathParts.indexOf('tasks');
  const id = pathParts[tasksIndex + 1];
  const action = pathParts[tasksIndex + 2];

  if (!id || !action) {
    sendJson(res, { error: 'Unknown endpoint' }, 404);
    return;
  }

  let body = {};
  try {
    body = await readBody(req);
  } catch (err) {
    sendJson(res, { error: err.message }, 400);
    return;
  }

  const dryRun = isDryRun(req, url, body);

  try {
    const result = await getPool().query('SELECT * FROM posts WHERE id = $1', [id]);

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

      const agentId = req.headers['x-agent-id'] || req.headers['X-Agent-ID'] || body.agent_id;
      const agentValidation = validateAgentId(agentId);
      if (agentValidation.error) {
        sendJson(res, { error: 'X-Agent-ID header or agent_id in body is required: ' + agentValidation.error }, 400);
        return;
      }

      const claimedPost = formatPost({
        ...post,
        status: 'CLAIMED',
        claimed_by: agentValidation.agentId,
        claimed_at: new Date().toISOString()
      });

      if (dryRun) {
        sendJson(res, {
          post: claimedPost,
          dry_run: true,
          message: `Dry run only. Task ${id} would be claimed by ${agentValidation.agentId}.`
        }, 200, { dry_run: true });
        return;
      }

      const update = await getPool().query(
        `UPDATE posts
         SET status = $1, claimed_by = $2, claimed_at = $3
         WHERE id = $4 AND status = 'OPEN'
         RETURNING *`,
        ['CLAIMED', agentValidation.agentId, claimedPost.claimed_at, id]
      );

      if (update.rows.length === 0) {
        sendJson(res, { error: 'Task is not available for claim' }, 409);
        return;
      }

      // Create execution_history record (lightweight, no validator pass-through)
      try {
        await saveExecution({
          execution_id: 'EXEC_' + Date.now().toString(36).toUpperCase(),
          task_id: id,
          agent: { id: agentValidation.agentId, name: agentValidation.agentId },
          task_canonical: { task_type: post.task_type || 'other' },
          execution: {
            status: 'claimed',
            claimed_at: claimedPost.claimed_at,
            completed_at: null,
            duration_ms: null,
            error: null,
            llm: null,
            log: [`[${claimedPost.claimed_at}] Task ${id} claimed by ${agentValidation.agentId} (via legacy posts.js claim)`]
          },
          output: null,
          lifecycle: null,
          metrics: null
        });
      } catch (execErr) {
        console.error(`[posts] Failed to save execution record for ${id}:`, execErr.message);
      }

      sendJson(res, {
        post: formatPost(update.rows[0]),
        message: `Task ${id} claimed by ${agentValidation.agentId}`,
        deprecation: 'Use POST /api/execute?action=claim instead — posts.js claim is legacy'
      });
      return;
    }

    if (action === 'complete') {
      if (post.type !== 'REQUEST') {
        sendJson(res, { error: 'Only REQUEST tasks can be completed' }, 400);
        return;
      }
      if (post.status !== 'CLAIMED') {
        sendJson(res, { error: 'Task must be CLAIMED before completion. Status: ' + post.status }, 400);
        return;
      }

      const agentId = req.headers['x-agent-id'] || req.headers['X-Agent-ID'] || body.agent_id;
      const agentValidation = validateAgentId(agentId);
      if (agentValidation.error) {
        sendJson(res, { error: 'X-Agent-ID header or agent_id in body is required: ' + agentValidation.error }, 400);
        return;
      }
      if (post.claimed_by !== agentValidation.agentId) {
        sendJson(res, { error: `Only claiming agent ${post.claimed_by} can complete this task` }, 403);
        return;
      }

      const resultText = body.result_text ? String(body.result_text).trim() : '';
      const resultUrl = body.result_url ? String(body.result_url).trim() : '';
      if (!resultText && !resultUrl) {
        sendJson(res, { error: 'result_text or result_url is required' }, 400);
        return;
      }
      if (resultText.length > 10000) {
        sendJson(res, { error: 'result_text too long (max 10000 characters)' }, 400);
        return;
      }

      const completedPost = formatPost({
        ...post,
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
        result_text: resultText,
        result_url: resultUrl
      });

      if (dryRun) {
        sendJson(res, {
          post: completedPost,
          dry_run: true,
          message: `Dry run only. Task ${id} would be completed.`
        }, 200, { dry_run: true });
        return;
      }

      const update = await getPool().query(
        `UPDATE posts
         SET status = $1, completed_at = $2, result_text = $3, result_url = $4
         WHERE id = $5 AND status = 'CLAIMED' AND claimed_by = $6
         RETURNING *`,
        ['COMPLETED', completedPost.completed_at, resultText, resultUrl, id, agentValidation.agentId]
      );

      if (update.rows.length === 0) {
        sendJson(res, { error: 'Task could not be completed by this agent' }, 409);
        return;
      }

      // Update execution_history to completed (best-effort)
      try {
        const completedAt = new Date().toISOString();
        await saveExecution({
          execution_id: 'EXEC_' + Date.now().toString(36).toUpperCase(),
          task_id: id,
          agent: { id: agentValidation.agentId, name: agentValidation.agentId },
          task_canonical: { task_type: post.task_type || 'other' },
          execution: {
            status: 'completed',
            claimed_at: post.claimed_at,
            completed_at: completedAt,
            duration_ms: post.claimed_at ? (Date.now() - new Date(post.claimed_at).getTime()) : null,
            error: null,
            llm: null,
            log: [`[${completedAt}] Task ${id} completed by ${agentValidation.agentId} (via legacy posts.js complete)`]
          },
          output: {
            type: 'agent_submitted_result',
            content: resultText,
            content_length: resultText.length,
            model: null,
            provider: null,
            tokens: 0
          },
          lifecycle: null,
          metrics: null
        });
      } catch (execErr) {
        console.error(`[posts] Failed to update execution record for ${id}:`, execErr.message);
      }

      sendJson(res, {
        post: formatPost(update.rows[0]),
        message: 'Task completed!',
        deprecation: 'Use POST /api/execute?action=submit instead — posts.js complete is legacy'
      });
      return;
    }

    if (action === 'release') {
      if (post.type !== 'REQUEST') {
        sendJson(res, { error: 'Only REQUEST tasks can be released' }, 400);
        return;
      }
      if (post.status !== 'CLAIMED') {
        sendJson(res, { error: 'Only CLAIMED tasks can be released. Status: ' + post.status }, 400);
        return;
      }

      const agentId = req.headers['x-agent-id'] || req.headers['X-Agent-ID'] || body.agent_id;
      const agentValidation = validateAgentId(agentId);
      if (agentValidation.error) {
        sendJson(res, { error: 'X-Agent-ID header or agent_id in body is required: ' + agentValidation.error }, 400);
        return;
      }
      if (post.claimed_by !== agentValidation.agentId) {
        sendJson(res, { error: `Only claiming agent ${post.claimed_by} can release this task` }, 403);
        return;
      }

      const releasedPost = formatPost({
        ...post,
        status: 'OPEN',
        claimed_by: null,
        claimed_at: null
      });

      if (dryRun) {
        sendJson(res, {
          post: releasedPost,
          dry_run: true,
          message: `Dry run only. Task ${id} would be released.`
        }, 200, { dry_run: true });
        return;
      }

      const update = await getPool().query(
        `UPDATE posts
         SET status = 'OPEN', claimed_by = NULL, claimed_at = NULL
         WHERE id = $1 AND status = 'CLAIMED' AND claimed_by = $2
         RETURNING *`,
        [id, agentValidation.agentId]
      );

      if (update.rows.length === 0) {
        sendJson(res, { error: 'Task could not be released by this agent' }, 409);
        return;
      }

      sendJson(res, { post: formatPost(update.rows[0]), message: `Task ${id} released by ${agentValidation.agentId}` });
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
 project: row.project || null,
 tags: row.tags || [],
 urgency: row.urgency || 'NORMAL',
 created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
 source: row.source || row.origin || null,
 source_url: row.source_url || null,
 source_platform: row.source_platform || null,
 difficulty: row.difficulty || null,
 ai_instructions: row.ai_instructions || null
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
 // Agent-Readable Task Semantics
 post.capabilities = parseJsonbField(row.capabilities, []);
 post.estimated_minutes = row.estimated_minutes || null;
 post.success_criteria = parseJsonbField(row.success_criteria, []);
 post.verification = row.verification || null;
 } else {
 post.capabilities = row.capabilities;
 post.conditions = row.conditions;
 }

  post.quality_flags = getQualityFlags(post);
  post.is_test = post.quality_flags.includes('test_data');
  post.machine_actionable = isMachineActionable(post, post.quality_flags);
  post.can_claim = post.type === 'REQUEST' && post.status === 'OPEN' && post.machine_actionable;
  if (!post.can_claim) {
    if (post.type !== 'REQUEST') post.can_claim_reason = 'not a REQUEST type';
    else if (post.status !== 'OPEN') post.can_claim_reason = `status is ${post.status}, not OPEN`;
    else if (!post.machine_actionable) post.can_claim_reason = `not machine-actionable (quality flags: ${(post.quality_flags || []).join(', ') || 'none'})`;
    else post.can_claim_reason = 'unknown';
  }

  return post;
}

// GET /api/health
async function handleHealth(req, res) {
  if (!hasDatabase()) {
    const data = loadJsonData();
    sendJson(res, {
      status: 'degraded',
      db: 'not_configured',
      mode: 'json_fallback',
      posts_count: (data.posts || []).length,
      agents_count: (data.agents || []).length,
      uptime: process.uptime()
    });
    return;
  }

  try {
    const dbResult = await getPool().query('SELECT 1');
    const postCount = await getPool().query('SELECT COUNT(*)::int as c FROM posts');
    const agentCount = await getPool().query('SELECT COUNT(*)::int as c FROM agents');
    const offerAgentCount = await getPool().query("SELECT COUNT(DISTINCT agent_id)::int as c FROM posts WHERE type = 'OFFER' AND status = 'ACTIVE'");
    sendJson(res, {
      status: 'ok',
      db: dbResult.rows[0] ? 'connected' : 'error',
      posts_count: postCount.rows[0].c,
      registered_agents_count: agentCount.rows[0].c,
      offer_agents_count: offerAgentCount.rows[0].c,
      uptime: process.uptime()
    });
  } catch (err) {
    sendJson(res, { status: 'degraded', db: 'error', error: err.message }, 500);
  }
}

// POST /api/agents/register
async function handleRegisterAgent(req, res) {
  if (!hasDatabase()) {
    sendJson(res, { error: 'Agent registration requires DATABASE_URL. This instance is in read-only (JSON fallback) mode.' }, 503);
    return;
  }

  let body;
  try {
    body = await readBody(req);
  } catch (err) {
    sendJson(res, { error: err.message }, 400);
    return;
  }

  const { agent_id, name, description, homepage } = body;

  const agentValidation = validateAgentId(agent_id);
  if (agentValidation.error) {
    sendJson(res, { error: agentValidation.error }, 400);
    return;
  }
  if (!name || typeof name !== 'string' || name.length > 200) {
    sendJson(res, { error: 'name is required (max 200 characters)' }, 400);
    return;
  }

  const token = generateToken();

  try {
    const existing = await getPool().query('SELECT agent_id FROM agents WHERE agent_id = $1', [agentValidation.agentId]);
    if (existing.rows.length > 0) {
      sendJson(res, { error: 'Agent already registered. Use your existing token.', agent_id: agentValidation.agentId }, 409);
      return;
    }

    await getPool().query(
      'INSERT INTO agents (agent_id, name, description, homepage, token) VALUES ($1,$2,$3,$4,$5)',
      [agentValidation.agentId, name.trim(), String(description || '').trim(), String(homepage || '').trim(), token]
    );

    sendJson(res, {
      agent: {
        agent_id: agentValidation.agentId,
        name: name.trim(),
        description: String(description || '').trim(),
        homepage: String(homepage || '').trim(),
        token: token,
        created_at: new Date().toISOString()
      },
      message: 'Registration successful! Save your token - it will not be shown again.'
    }, 201);
  } catch (err) {
    console.error('Register agent error:', err);
    sendJson(res, { error: 'Database error' }, 500);
  }
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
    if (pathParts.includes('health')) {
      await handleHealth(req, res);
      return;
    }
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
    if (pathParts.includes('agents') && pathParts.includes('register')) {
      await handleRegisterAgent(req, res);
      return;
    }
    if (pathParts.includes('tasks')) {
      await handleTaskMutation(req, res, url);
      return;
    }
    await handleCreatePost(req, res, url);
    return;
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  sendJson(res, { error: 'Method not allowed' }, 405);
};
