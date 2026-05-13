// /api/execute — Task execution loop (canonical-driven, Phase 2: real LLM calls)
// Claims a task for an agent, calls real LLM API, produces result
// This closes the loop: task → route → match → claim → execute → result

const fs = require('fs');
const path = require('path');

const POSTS_SEED_PATH = path.join(__dirname, 'posts-seed.json');
const AGENTS_SEED_PATH = path.join(__dirname, 'agents-seed.json');

// In-memory execution state (resets on serverless cold start — Phase 2 KV coming)
const executions = new Map();

// --- Real LLM Provider Configuration ---
const LLM_PROVIDERS = {
  'kilo': {
    baseUrl: 'https://api.kilo.ai/v1',
    model: 'kilo-auto',
    apiKeyEnv: 'KILO_API_KEY',
    timeout: 120000,
    capabilities: ['research', 'writing', 'reasoning', 'code']
  },
  'poolside': {
    baseUrl: 'https://inference.poolside.ai/v1',
    model: 'poolside/laguna-m.1',
    apiKeyEnv: 'POOLSIDE_API_KEY',
    timeout: 300000,
    capabilities: ['code', 'debug', 'refactor', 'test']
  }
};

// Agent-to-provider mapping
const AGENT_PROVIDER_MAP = {
  'deepseek-v3': { provider: 'kilo', model: 'deepseek-ai/deepseek-v3' },
  'kimi-k2-5': { provider: 'kilo', model: 'moonshotai/kimi-k2.5' },
  'glm-5-1': { provider: 'kilo', model: 'z-ai/glm-5.1' },
  'mimo-v2-5-pro': { provider: 'kilo', model: 'xiaomi/mimo-v2.5-pro' },
  'claude-code': { provider: 'poolside', model: 'poolside/laguna-m.1' },
  'gpt-5-5-codex': { provider: 'poolside', model: 'poolside/laguna-m.1' },
  'grok-3': { provider: 'kilo', model: 'x-ai/grok-3' },
  'gemini-2-5-pro': { provider: 'kilo', model: 'google/gemini-2.5-pro' },
  'mistral-large': { provider: 'kilo', model: 'mistral/large' },
  'llama-4-maverick': { provider: 'kilo', model: 'meta/llama-4-maverick' }
};

function loadPostsSeed() {
  try { return JSON.parse(fs.readFileSync(POSTS_SEED_PATH, 'utf8')); } catch { return { posts: [] }; }
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

// --- Real LLM Call ---
async function callLLM(provider, prompt, systemPrompt) {
  const config = LLM_PROVIDERS[provider];
  if (!config) throw new Error(`Unknown LLM provider: ${provider}`);

  const apiKey = process.env[config.apiKeyEnv];
  if (!apiKey) throw new Error(`Missing API key: ${config.apiKeyEnv}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  const model = config.model;

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt || 'You are an AI agent executing a task. Produce a concrete, actionable result.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2048,
        temperature: 0.3
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => 'unknown error');
      throw new Error(`LLM API error ${response.status}: ${errText.substring(0, 500)}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const usage = data.usage || {};

    return {
      content,
      model: data.model || model,
      provider,
      usage: {
        prompt_tokens: usage.prompt_tokens || 0,
        completion_tokens: usage.completion_tokens || 0,
        total_tokens: usage.total_tokens || 0
      },
      raw_response_id: data.id || null
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error(`LLM call timed out after ${config.timeout}ms`);
    throw err;
  }
}

// Build execution prompt from task
function buildExecutionPrompt(task, canonicalTask) {
  return `Execute the following task and produce a concrete result.

TASK ID: ${task.id}
TASK TYPE: ${canonicalTask.task_type}
PROBLEM: ${canonicalTask.problem}
EXPECTED OUTPUT: ${canonicalTask.expected_output || 'A concrete, actionable solution'}
URGENCY: ${canonicalTask.urgency}

INSTRUCTIONS:
1. Analyze the problem
2. Produce a concrete, actionable result
3. If it's a code task, write the code
4. If it's a research task, provide findings
5. If it's a writing task, produce the content

Format your output clearly. This is a real execution, not a simulation.`;
}

// --- POST /api/execute ---
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

  // Find task
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

  // Load agents
  const agentsData = loadAgentsSeed();
  const agents = agentsData.workers.map(buildCanonicalAgent);

  // Select agent
  let selectedAgent = null;
  let routingResult = null;

  if (body.agent_id) {
    selectedAgent = agents.find(a => a.id === body.agent_id);
    if (!selectedAgent) {
      return res.status(404).json({ success: false, error: `Agent ${body.agent_id} not found in worker registry` });
    }
  } else {
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

  // --- REAL EXECUTION ---
  const executionId = 'EXEC_' + Date.now().toString(36).toUpperCase();
  const claimedAt = new Date().toISOString();
  const executionLog = [];

  // 1. Claim
  task.status = 'CLAIMED';
  task.claimed_by = selectedAgent.name;
  executionLog.push(`[${claimedAt}] Task ${taskId} claimed by ${selectedAgent.name} (${selectedAgent.id})`);

  // 2. Resolve LLM provider for this agent
  const agentMapping = AGENT_PROVIDER_MAP[selectedAgent.id];
  let llmResult = null;
  let executionStatus = 'completed';
  let executionError = null;

  if (agentMapping) {
    const provider = agentMapping.provider;
    executionLog.push(`[${new Date().toISOString()}] Routing to LLM provider: ${provider}, model: ${agentMapping.model}`);
    executionLog.push(`[${new Date().toISOString()}] Agent capabilities: ${selectedAgent.capabilities.join(', ')}`);
    executionLog.push(`[${new Date().toISOString()}] Task type: ${canonicalTask.task_type}`);
    executionLog.push(`[${new Date().toISOString()}] Building execution prompt...`);

    const prompt = buildExecutionPrompt(task, canonicalTask);
    const systemPrompt = `You are ${selectedAgent.name}, an AI agent with capabilities: ${selectedAgent.capabilities.join(', ')}. You are executing task ${taskId} on the AI Labor Exchange platform. Produce a concrete, actionable result.`;

    executionLog.push(`[${new Date().toISOString()}] Calling LLM API (${provider})...`);

    try {
      // Override model if agent mapping specifies one
      const originalModel = LLM_PROVIDERS[provider].model;
      LLM_PROVIDERS[provider].model = agentMapping.model;
      llmResult = await callLLM(provider, prompt, systemPrompt);
      LLM_PROVIDERS[provider].model = originalModel; // restore

      executionLog.push(`[${new Date().toISOString()}] LLM response received (${llmResult.usage.total_tokens} tokens)`);
      executionLog.push(`[${new Date().toISOString()}] Model used: ${llmResult.model}`);
      executionLog.push(`[${new Date().toISOString()}] Execution complete.`);
    } catch (err) {
      executionStatus = 'failed';
      executionError = err.message;
      executionLog.push(`[${new Date().toISOString()}] LLM call FAILED: ${err.message}`);
      // Fallback: try kilo if poolside fails
      if (provider === 'poolside') {
        executionLog.push(`[${new Date().toISOString()}] Attempting fallback to kilo provider...`);
        try {
          const fallbackConfig = Object.assign({}, LLM_PROVIDERS['kilo']);
          LLM_PROVIDERS['kilo'].model = 'kilo-auto';
          llmResult = await callLLM('kilo', prompt, systemPrompt);
          executionStatus = 'completed_with_fallback';
          executionLog.push(`[${new Date().toISOString()}] Fallback succeeded (${llmResult.usage.total_tokens} tokens)`);
        } catch (fallbackErr) {
          executionLog.push(`[${new Date().toISOString()}] Fallback also FAILED: ${fallbackErr.message}`);
        }
      }
    }
  } else {
    // No provider mapping — use kilo-auto as default
    executionLog.push(`[${new Date().toISOString()}] No provider mapping for ${selectedAgent.id}, using kilo-auto`);
    try {
      const prompt = buildExecutionPrompt(task, canonicalTask);
      const systemPrompt = `You are an AI agent executing task ${taskId}. Produce a concrete, actionable result.`;
      llmResult = await callLLM('kilo', prompt, systemPrompt);
      executionLog.push(`[${new Date().toISOString()}] Default LLM call succeeded (${llmResult.usage.total_tokens} tokens)`);
    } catch (err) {
      executionStatus = 'failed';
      executionError = err.message;
      executionLog.push(`[${new Date().toISOString()}] Default LLM call FAILED: ${err.message}`);
    }
  }

  // 3. Mark completed
  task.status = executionStatus === 'failed' ? 'FAILED' : 'COMPLETED';
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
      duration_ms: Date.now() - new Date(claimedAt).getTime(),
      status: executionStatus,
      error: executionError,
      log: executionLog,
      llm: llmResult ? {
        provider: llmResult.provider,
        model: llmResult.model,
        usage: llmResult.usage,
        response_id: llmResult.raw_response_id
      } : null
    },
    output: llmResult ? {
      type: 'real_llm_execution_result',
      content: llmResult.content,
      content_length: llmResult.content.length,
      model: llmResult.model,
      provider: llmResult.provider,
      tokens: llmResult.usage.total_tokens
    } : {
      type: 'execution_failed',
      error: executionError,
      note: 'LLM API call failed. Check execution.log for details.'
    }
  };

  // Save execution record
  executions.set(executionId, result);

  res.status(200).json({
    success: executionStatus !== 'failed',
    execution: result,
    meta: {
      request_id: executionId,
      timestamp: new Date().toISOString(),
      endpoint: '/api/execute',
      engine: 'canonical-driven-execution-phase2',
      phase: 2,
      description: 'Real LLM execution loop: canonical routing → agent selection → claim → real LLM call → result'
    }
  });
}

// GET /api/execute
function handleStatus(req, res) {
  const url = req.url || '';
  const idMatch = url.match(/[?&]execution_id=([^&]+)/);
  const execId = idMatch ? idMatch[1] : null;

  if (execId) {
    const record = executions.get(execId);
    if (!record) {
      return res.status(404).json({ success: false, error: `Execution ${execId} not found (in-memory only — state resets on cold start)` });
    }
    return res.status(200).json({ success: true, execution: record });
  }

  const all = Array.from(executions.values());
  res.status(200).json({
    success: true,
    executions: all,
    total: all.length,
    meta: {
      endpoint: '/api/execute',
      phase: 2,
      description: 'GET: check execution status. POST: execute a task with real LLM call.',
      usage: {
        execute: 'POST /api/execute { "task_id": "TASK_SEED_001" }',
        auto_route: 'POST /api/execute { "task_id": "TASK_SEED_001" } — agent + LLM auto-selected',
        manual_agent: 'POST /api/execute { "task_id": "TASK_SEED_001", "agent_id": "deepseek-v3" }',
        check_status: 'GET /api/execute?execution_id=EXEC_xxx'
      },
      available_providers: Object.keys(LLM_PROVIDERS),
      agent_provider_map: Object.keys(AGENT_PROVIDER_MAP)
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
