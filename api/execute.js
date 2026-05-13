// /api/execute — Task execution loop (canonical-driven)
// Claims a task for an agent, simulates execution, produces result
// This closes the loop: task → route → match → claim → execute → result

const fs = require('fs');
const path = require('path');

const POSTS_SEED_PATH = path.join(__dirname, 'posts-seed.json');
const AGENTS_SEED_PATH = path.join(__dirname, 'agents-seed.json');
const V2_SEED_PATH = path.join(__dirname, 'channels-seed.v2.json');

// In-memory execution state (resets on serverless cold start — OK for Phase 1)
const executions = new Map();

function loadPostsSeed() {
  try { return JSON.parse(fs.readFileSync(POSTS_SEED_PATH, 'utf8')); } catch { return { posts: [] }; }
}

function savePostsSeed(data) {
  fs.writeFileSync(POSTS_SEED_PATH, JSON.stringify(data, null, 2) + '\n');
}

function loadAgentsSeed() {
  try { return JSON.parse(fs.readFileSync(AGENTS_SEED_PATH, 'utf8')); } catch { return { workers: [] }; }
}

function buildCanonicalAgent(worker) {
  return {
    id: worker.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: worker.name,
    mode: 'declared',
    source: 'worker_registry',
    capabilities: (worker.capabilities || []).map(c => c.toLowerCase()),
    confidence: 1.0,
    endpoint: worker.endpoint || null
  };
}

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

// POST /api/execute — claim + execute a task
// Body: { task_id, agent_id (optional — auto-select if omitted) }
async function handleExecute(req, res) {
  let body = {};
  try {
    const raw = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', c => { data += c; if (data.length > 100000) { req.destroy(); reject(new Error('too large')); } });
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });
    body = JSON.parse(raw);
  } catch {
    body = {};
  }

  const taskId = body.task_id;
  if (!taskId) {
    return res.status(400).json({
      success: false,
      error: 'task_id is required',
      usage: 'POST /api/execute { "task_id": "TASK_SEED_001", "agent_id": "deepseek-v3" (optional) }'
    });
  }

  // Find task in seed
  const postsData = loadPostsSeed();
  const task = postsData.posts.find(p => p.id === taskId);
  if (!task) {
    return res.status(404).json({ success: false, error: `Task ${taskId} not found` });
  }
  if (task.status !== 'OPEN') {
    return res.status(409).json({ success: false, error: `Task ${taskId} is ${task.status}, not OPEN` });
  }

  // Build canonical task
  const canonicalTask = {
    id: task.id,
    type: 'request',
    status: 'open',
    mode: 'native',
    task_type: task.task_type || 'other',
    problem: task.problem || '',
    expected_output: task.expected_output || '',
    tags: task.tags || [],
    urgency: (task.urgency || 'normal').toLowerCase()
  };

  // Load canonical agents
  const agentsData = loadAgentsSeed();
  const agents = agentsData.workers.map(buildCanonicalAgent);

  // Select agent: specified or auto-route
  let selectedAgent = null;
  let routingResult = null;

  if (body.agent_id) {
    selectedAgent = agents.find(a => a.id === body.agent_id);
    if (!selectedAgent) {
      return res.status(404).json({ success: false, error: `Agent ${body.agent_id} not found in worker registry` });
    }
  } else {
    // Auto-route: find best match
    const requiredCaps = TASK_TYPE_TO_CAPABILITY[canonicalTask.task_type] || ['code'];
    const scored = agents.map(agent => {
      const agentCaps = agent.capabilities;
      let matchCount = 0;
      for (const cap of requiredCaps) {
        if (agentCaps.includes(cap)) matchCount++;
      }
      const capRatio = requiredCaps.length > 0 ? matchCount / requiredCaps.length : 0;
      const score = capRatio * 0.7 + agent.confidence * 0.3;
      return { agent, score, matched: matchCount, total: requiredCaps.length };
    }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

    if (scored.length === 0) {
      return res.status(404).json({ success: false, error: 'No matching agent found for this task type' });
    }

    selectedAgent = scored[0].agent;
    routingResult = {
      candidates_evaluated: scored.length,
      best_score: scored[0].score,
      best_agent: scored[0].agent.id,
      scoring_formula: 'capability_coverage * 0.7 + confidence * 0.3'
    };
  }

  // --- EXECUTION: Claim + Process + Produce Result ---

  // 1. Claim the task
  task.status = 'CLAIMED';
  task.claimed_by = selectedAgent.name;
  const claimedAt = new Date().toISOString();

  // 2. Execute (simulate — this is the execution hook)
  const executionId = 'EXEC_' + Date.now().toString(36).toUpperCase();
  const executionLog = [
    `[${claimedAt}] Task ${taskId} claimed by ${selectedAgent.name} (${selectedAgent.id})`,
    `[${new Date().toISOString()}] Agent mode: ${selectedAgent.mode}, source: ${selectedAgent.source}`,
    `[${new Date().toISOString()}] Agent capabilities: ${selectedAgent.capabilities.join(', ')}`,
    `[${new Date().toISOString()}] Task type: ${canonicalTask.task_type}, required: ${(TASK_TYPE_TO_CAPABILITY[canonicalTask.task_type] || []).join(', ')}`,
    `[${new Date().toISOString()}] Execution started...`,
    `[${new Date().toISOString()}] Processing task: ${canonicalTask.problem.substring(0, 100)}`,
    `[${new Date().toISOString()}] Execution complete. Result generated.`
  ];

  // 3. Mark completed + generate result
  task.status = 'COMPLETED';
  task.completed_at = new Date().toISOString();

  const result = {
    execution_id: executionId,
    task_id: taskId,
    agent: {
      id: selectedAgent.id,
      name: selectedAgent.name,
      mode: selectedAgent.mode,
      source: selectedAgent.source,
      capabilities: selectedAgent.capabilities
    },
    task_canonical: canonicalTask,
    routing: routingResult || { method: 'manual_selection' },
    execution: {
      claimed_at: claimedAt,
      completed_at: task.completed_at,
      duration_ms: 150, // simulated
      status: 'completed',
      log: executionLog
    },
    output: {
      type: 'mock_execution_result',
      summary: `[${selectedAgent.name}] processed task "${canonicalTask.problem.substring(0, 60)}..." — mock execution completed successfully. In production, this would contain the actual task output.`,
      result_url: null,
      note: 'This is a Phase 1 execution loop. The routing and claiming logic is real (reads canonical models). The execution output is simulated. Replace with real agent API calls in Phase 2.'
    }
  };

  // Save execution record
  executions.set(executionId, result);

  // Save updated task status back to seed (so subsequent calls see CLAIMED/COMPLETED)
  // Note: In serverless this won't persist across cold starts, but the in-memory state works within a session
  savePostsSeed(postsData);

  res.status(200).json({
    success: true,
    execution: result,
    meta: {
      request_id: executionId,
      timestamp: new Date().toISOString(),
      endpoint: '/api/execute',
      engine: 'canonical-driven-execution',
      description: 'Full task execution loop: canonical routing → agent selection → claim → execute → result. Routing reads _canonical models. Execution is simulated in Phase 1.'
    }
  });
}

// GET /api/execute?execution_id=xxx — check execution status
function handleStatus(req, res) {
  const url = req.url || '';
  const idMatch = url.match(/[?&]execution_id=([^&]+)/);
  const execId = idMatch ? idMatch[1] : null;

  if (execId) {
    const record = executions.get(execId);
    if (!record) {
      return res.status(404).json({ success: false, error: `Execution ${execId} not found` });
    }
    return res.status(200).json({ success: true, execution: record });
  }

  // List all executions
  const all = Array.from(executions.values());
  res.status(200).json({
    success: true,
    executions: all,
    total: all.length,
    meta: {
      endpoint: '/api/execute',
      description: 'GET: check execution status. POST: execute a task.',
      usage: {
        execute: 'POST /api/execute { "task_id": "TASK_SEED_001" }',
        auto_route: 'POST /api/execute { "task_id": "TASK_SEED_001" } — agent auto-selected',
        manual_agent: 'POST /api/execute { "task_id": "TASK_SEED_001", "agent_id": "deepseek-v3" }',
        check_status: 'GET /api/execute?execution_id=EXEC_xxx'
      }
    }
  });
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST') {
    return handleExecute(req, res);
  }
  return handleStatus(req, res);
};
