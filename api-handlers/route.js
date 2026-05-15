// /api/route — Canonical-driven task-agent routing engine
// Reads _canonical models from all sources, matches tasks to agents
// This is the FIRST endpoint that uses canonical as runtime truth

const fs = require('fs');
const path = require('path');
const { buildCanonicalTask, buildCanonicalAgent, validateCanonicalTask, validateCanonicalAgent } = require('../lib/canonical-models');
const { queryAgentRegistry } = require('../lib/execution-history');

const POSTS_SEED_PATH = path.join(__dirname, 'posts-seed.json');
const AGGREGATED_PATH = path.join(__dirname, 'aggregated-seed.json');
const AGENTS_SEED_PATH = path.join(__dirname, 'agents-seed.json');
const V2_SEED_PATH = path.join(__dirname, 'channels-seed.v2.json');

// Canonical model builders moved to canonical-models.js (shared module)

// --- Matching engine ---

const TASK_TYPE_TO_CAPABILITY = {
  'research': ['research', 'reasoning'],
  'script': ['code', 'debug'],
  'writing': ['writing'],
  'data': ['data', 'research'],
  'automation': ['code', 'debug'],
  'code': ['code', 'debug', 'refactor'],
  'other': ['code', 'research', 'reasoning'],
  'inference': ['inference', 'multimodal']
};

function scoreMatch(task, agent) {
  const taskType = task.task_type || 'other';
  const requiredCaps = TASK_TYPE_TO_CAPABILITY[taskType] || ['code'];
  const agentCaps = agent.capabilities || [];

  let matchScore = 0;
  let matchedCaps = [];
  let missingCaps = [];

  for (const cap of requiredCaps) {
    if (agentCaps.includes(cap)) {
      matchScore += 1;
      matchedCaps.push(cap);
    } else {
      missingCaps.push(cap);
    }
  }

  // Normalize to 0-1
  const capRatio = requiredCaps.length > 0 ? matchScore / requiredCaps.length : 0;
  const confidence = agent.confidence || 0.5;
  const finalScore = capRatio * 0.7 + confidence * 0.3;

  return {
    agent_id: agent.id,
    agent_name: agent.name,
    agent_mode: agent.mode,
    agent_source: agent.source,
    score: Math.round(finalScore * 100) / 100,
    matched_capabilities: matchedCaps,
    missing_capabilities: missingCaps,
    capability_coverage: capRatio,
    confidence_weight: confidence
  };
}

function routeTask(task, agents) {
  const results = agents
    .map(agent => scoreMatch(task, agent))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    task: task,
    candidates: results,
    best_match: results[0] || null,
    total_candidates: results.length
  };
}

// --- Main handler ---

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=60');

  const url = req.url || '';
  const getParam = (name) => {
    const m = url.match(new RegExp(`[?&]${name}=([^&]+)`));
    return m ? decodeURIComponent(m[1]) : null;
  };

  // Load canonical tasks
  let allTasks = [];
  try {
    const postsData = JSON.parse(fs.readFileSync(POSTS_SEED_PATH, 'utf8'));
    const localPosts = (postsData.posts || [])
      .filter(p => p.type === 'REQUEST' && p.status === 'OPEN')
      .map(p => buildCanonicalTask(p, 'local'));
    allTasks = allTasks.concat(localPosts);
  } catch {}

  try {
    const aggData = JSON.parse(fs.readFileSync(AGGREGATED_PATH, 'utf8'));
    const extPosts = (aggData.posts || [])
      .filter(p => p.type === 'REQUEST' && p.status === 'OPEN')
      .map(p => buildCanonicalTask(p, 'external'));
    allTasks = allTasks.concat(extPosts);
  } catch {}

 // Load canonical agents (seed + PG registry)
 let allAgents = [];
 const seedAgentIds = new Set();
 try {
 const agentsData = JSON.parse(fs.readFileSync(AGENTS_SEED_PATH, 'utf8'));
 allAgents = (agentsData.workers || []).map(a => {
 const canonical = buildCanonicalAgent(a);
 seedAgentIds.add(canonical.id);
 return canonical;
 });
 } catch {}

 // Supplement with PG-registered agents not already in seed
 try {
 const pgAgents = await queryAgentRegistry({});
 for (const pg of pgAgents) {
 if (!seedAgentIds.has(pg.agent_id)) {
 allAgents.push({
 id: pg.agent_id,
 name: pg.agent_name,
 mode: 'registered',
 source: 'agent_registry',
 provider: pg.provider || null,
 type: 'ai_model',
 capabilities: pg.capabilities || [],
 confidence: 0.7, // registered but not verified
 status: pg.status || 'active'
 });
 }
 }
 } catch { /* PG down, seed-only */ }

 // Load channel entities for cross-platform awareness
 let channelEntities = [];
 try {
 const v2Data = JSON.parse(fs.readFileSync(V2_SEED_PATH, 'utf8'));
 channelEntities = (v2Data.entities || []).filter(e => e.api_available !== false);
 } catch {}

  // --- Route modes ---

  // ?task=TASK_ID — route a specific task
  const taskId = getParam('task');
  if (taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task ${taskId} not found or not OPEN`,
        meta: { endpoint: '/api/route', description: 'Canonical-driven task-agent routing engine' }
      });
    }
    const result = routeTask(task, allAgents);
    return res.status(200).json({
      success: true,
      routing: result,
      meta: {
        request_id: `RTE_${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        endpoint: '/api/route',
        engine: 'canonical-driven',
        description: 'Task routed using canonical Agent model (mode, capabilities, confidence). This is NOT schema decoration — this IS the runtime.'
      }
    });
  }

  // ?task_type=research — route all tasks of a type
  const taskType = getParam('task_type');
  if (taskType) {
    const filtered = allTasks.filter(t => t.task_type === taskType);
    const routings = filtered.map(t => routeTask(t, allAgents));
    return res.status(200).json({
      success: true,
      task_type: taskType,
      routings,
      total_tasks: filtered.length,
      meta: {
        request_id: `RTE_${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        endpoint: '/api/route',
        engine: 'canonical-driven'
      }
    });
  }

  // Default: route all OPEN tasks, show top match per task
  const allRoutings = allTasks.map(t => {
    const r = routeTask(t, allAgents);
    // Compact: only show best match per task
    return {
      task_id: t.id,
      task_type: t.task_type,
      problem_preview: t.problem.substring(0, 80),
      mode: t.mode,
      origin: t.origin.source,
      best_match: r.best_match,
      total_candidates: r.total_candidates
    };
  });

 res.status(200).json({
 success: true,
 routing_summary: allRoutings,
 total_tasks_routed: allRoutings.length,
 total_agents_available: allAgents.length,
 cross_platform_channels: channelEntities.map(e => ({
 id: e.id,
 name: e.name,
 type: e.type,
 sub_type: e.sub_type || null,
 ai_friendliness: e.scoring?.overall ?? null,
 agent_can_self_register: e.registration?.agent_can_self_register ?? false,
 api_available: e.api_available ?? false
 })),
 meta: {
      request_id: `RTE_${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      endpoint: '/api/route',
      engine: 'canonical-driven',
      description: 'All OPEN tasks routed to best canonical Agent match. Use ?task=TASK_ID for full detail, ?task_type=research for type filtering.',
      scoring_formula: 'final_score = capability_coverage * 0.7 + agent_confidence * 0.3',
      task_type_capability_map: TASK_TYPE_TO_CAPABILITY
    }
  });
};
