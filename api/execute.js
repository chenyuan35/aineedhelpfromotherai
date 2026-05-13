// /api/execute — Task execution loop (canonical-driven, Phase 2: real LLM calls)
// Claims a task for an agent, calls real LLM API, produces result
// This closes the loop: task → route → match → claim → execute → result

const fs = require('fs');
const path = require('path');
const { saveExecution, queryExecutions, getExecution, registerAgentToken, verifyAgentToken, parseAgentAuth } = require('./execution-history');
const { buildCanonicalTask, buildCanonicalAgent, buildCanonicalExecution, validateCanonicalTask } = require('./canonical-models');

const POSTS_SEED_PATH = path.join(__dirname, 'posts-seed.json');
const AGENTS_SEED_PATH = path.join(__dirname, 'agents-seed.json');

// In-memory execution state (resets on serverless cold start — Phase 2 KV coming)
const executions = new Map();

// --- Real LLM Provider Configuration (5 providers, all verified working) ---
const LLM_PROVIDERS = {
  'poolside': {
    baseUrl: 'https://inference.poolside.ai/v1',
    model: 'poolside/laguna-m.1',
    apiKeyEnv: 'POOLSIDE_API_KEY',
    timeout: 300000,
    capabilities: ['code', 'debug', 'refactor', 'test', 'reasoning']
  },
  'groq': {
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    apiKeyEnv: 'GROQ_API_KEY',
    timeout: 30000,
    capabilities: ['code', 'research', 'writing', 'reasoning', 'fast_inference']
  },
  'zhipu': {
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-flash',
    apiKeyEnv: 'ZHIPU_API_KEY',
    timeout: 60000,
    capabilities: ['code', 'research', 'writing', 'reasoning']
  },
  'hunyuan': {
    baseUrl: 'https://api.hunyuan.cloud.tencent.com/v1',
    model: 'hunyuan-lite',
    apiKeyEnv: 'HUNYUAN_API_KEY',
    timeout: 60000,
    capabilities: ['research', 'writing', 'reasoning']
  },
  'spark': {
    baseUrl: 'https://spark-api-open.xf-yun.com/v1',
    model: 'generalv3.5',
    apiKeyEnv: 'SPARK_APP_CREDENTIALS',
    timeout: 60000,
    capabilities: ['research', 'writing', 'chinese']
  }
};

// Agent-to-provider mapping (diversified across 5 providers)
// Each agent maps to its "native" provider where possible
const AGENT_PROVIDER_MAP = {
  'deepseek-v3': { provider: 'poolside', model: 'poolside/laguna-m.1' },
  'kimi-k2-5': { provider: 'poolside', model: 'poolside/laguna-m.1' },
  'glm-5-1': { provider: 'zhipu', model: 'glm-4-flash' },
  'mimo-v2-5-pro': { provider: 'groq', model: 'llama-3.3-70b-versatile' },
  'claude-code': { provider: 'poolside', model: 'poolside/laguna-m.1' },
  'gpt-5-5-codex': { provider: 'groq', model: 'llama-3.3-70b-versatile' },
  'grok-3': { provider: 'groq', model: 'llama-3.3-70b-versatile' },
  'gemini-2-5-pro': { provider: 'hunyuan', model: 'hunyuan-lite' },
  'mistral-large': { provider: 'hunyuan', model: 'hunyuan-lite' },
  'llama-4-maverick': { provider: 'groq', model: 'llama-3.3-70b-versatile' }
};

function loadPostsSeed() {
  try { return JSON.parse(fs.readFileSync(POSTS_SEED_PATH, 'utf8')); } catch { return { posts: [] }; }
}

function loadAgentsSeed() {
  try { return JSON.parse(fs.readFileSync(AGENTS_SEED_PATH, 'utf8')); } catch { return { workers: [] }; }
}

// buildCanonicalAgent moved to canonical-models.js (shared module)

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

// --- Real LLM Call (multi-provider, all OpenAI-compatible) ---
async function callLLM(provider, prompt, systemPrompt, overrideModel) {
  const config = LLM_PROVIDERS[provider];
  if (!config) throw new Error(`Unknown LLM provider: ${provider}`);

  const apiKey = process.env[config.apiKeyEnv];
  if (!apiKey) throw new Error(`Missing API key: ${config.apiKeyEnv}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  const model = overrideModel || config.model;

  // Build auth header — Spark uses "Bearer APPID:APISecret" format
  let authHeader = `Bearer ${apiKey}`;
  // Spark credentials already in APPID:APISecret format from env var

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
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
  // --- Agent authentication (X-Agent-Token or Authorization) ---
  const authHeader = req.headers['x-agent-token'] || req.headers['authorization'] || '';
  const agentAuth = parseAgentAuth(authHeader);

  // Phase 2: auth is optional but logged — unauthenticated requests get a warning
  // Phase 3: auth will be required
  let authResult = { authenticated: false, agent_id: null };

  if (agentAuth) {
    const verified = await verifyAgentToken(agentAuth.agent_id, agentAuth.token);
    if (verified) {
      authResult = { authenticated: true, agent_id: agentAuth.agent_id };
    }
  }

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
  // Use override model from agent mapping
  llmResult = await callLLM(provider, prompt, systemPrompt, agentMapping.model);

      executionLog.push(`[${new Date().toISOString()}] LLM response received (${llmResult.usage.total_tokens} tokens)`);
      executionLog.push(`[${new Date().toISOString()}] Model used: ${llmResult.model}`);
      executionLog.push(`[${new Date().toISOString()}] Execution complete.`);
  } catch (err) {
    executionStatus = 'failed';
    executionError = err.message;
    executionLog.push(`[${new Date().toISOString()}] LLM call FAILED: ${err.message}`);
    // Multi-provider fallback chain
    const FALLBACK_PROVIDERS = ['groq', 'zhipu', 'hunyuan', 'spark', 'poolside'].filter(p => p !== provider);
    for (const fallbackProvider of FALLBACK_PROVIDERS) {
      const fallbackConfig = LLM_PROVIDERS[fallbackProvider];
      if (!fallbackConfig || !process.env[fallbackConfig.apiKeyEnv]) continue;
      executionLog.push(`[${new Date().toISOString()}] Attempting fallback to ${fallbackProvider}...`);
      try {
        llmResult = await callLLM(fallbackProvider, prompt, systemPrompt);
        executionStatus = 'completed_with_fallback';
        executionLog.push(`[${new Date().toISOString()}] Fallback to ${fallbackProvider} succeeded (${llmResult.usage.total_tokens} tokens)`);
        provider = fallbackProvider;
        break;
      } catch (fallbackErr) {
        executionLog.push(`[${new Date().toISOString()}] Fallback to ${fallbackProvider} FAILED: ${fallbackErr.message}`);
      }
    }
  }
  } else {
    // No provider mapping — use poolside as default (confirmed working)
    executionLog.push(`[${new Date().toISOString()}] No provider mapping for ${selectedAgent.id}, using poolside/laguna-m.1`);
    try {
      const prompt = buildExecutionPrompt(task, canonicalTask);
      const systemPrompt = `You are an AI agent executing task ${taskId}. Produce a concrete, actionable result.`;
      llmResult = await callLLM('poolside', prompt, systemPrompt);
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

  // Save execution record (in-memory + PostgreSQL)
  executions.set(executionId, result);

  // Persist to PostgreSQL (must await — serverless kills async after response)
  try {
    await saveExecution(result);
  } catch (err) {
    console.error(`[execution-history] Failed to save ${executionId}:`, err.message);
  }

  res.status(200).json({
    success: executionStatus !== 'failed',
    execution: result,
  meta: {
    request_id: executionId,
    timestamp: new Date().toISOString(),
    endpoint: '/api/execute',
    engine: 'canonical-driven-execution-phase2',
    phase: 2,
    auth: authResult,
    description: 'Real LLM execution loop: canonical routing → agent selection → claim → real LLM call → result'
  }
  });
}

// GET /api/execute
async function handleStatus(req, res) {
  const url = req.url || '';
  const params = Object.fromEntries(new URL(url, 'http://localhost').searchParams);

  // Single execution lookup — try PG first, then in-memory
  if (params.execution_id) {
    try {
      const pgRecord = await getExecution(params.execution_id);
      if (pgRecord) {
        return res.status(200).json({ success: true, execution: pgRecord, source: 'postgresql' });
      }
    } catch (e) { /* pg error, fall through */ }

    const record = executions.get(params.execution_id);
    if (!record) {
      return res.status(404).json({ success: false, error: `Execution ${params.execution_id} not found` });
    }
    return res.status(200).json({ success: true, execution: record, source: 'memory' });
  }

  // List executions — prefer PG for history, supplement with in-memory
  try {
    const result = await queryExecutions({
      task_id: params.task_id,
      agent_id: params.agent_id,
      status: params.status,
      provider: params.provider,
      limit: params.limit,
      offset: params.offset
    });
    return res.status(200).json({
      success: true,
      executions: result.executions,
      total: result.total,
      limit: result.limit,
      offset: result.offset,
      source: 'postgresql',
      meta: {
        endpoint: '/api/execute',
        phase: 2,
        description: 'Execution history persisted in PostgreSQL. Survives cold starts.',
        usage: {
          execute: 'POST /api/execute { "task_id": "TASK_SEED_001" }',
          auto_route: 'POST /api/execute { "task_id": "TASK_SEED_001" } — agent + LLM auto-selected',
          manual_agent: 'POST /api/execute { "task_id": "TASK_SEED_001", "agent_id": "deepseek-v3" }',
          history: 'GET /api/execute?task_id=TASK_SEED_001',
          by_agent: 'GET /api/execute?agent_id=deepseek-v3',
          by_status: 'GET /api/execute?status=completed',
          single: 'GET /api/execute?execution_id=EXEC_xxx'
        },
        available_providers: Object.keys(LLM_PROVIDERS),
        agent_provider_map: Object.keys(AGENT_PROVIDER_MAP)
      }
    });
  } catch (e) {
    // PG down — fall back to in-memory
    const all = Array.from(executions.values());
    return res.status(200).json({
      success: true,
      executions: all,
      total: all.length,
      source: 'memory (postgresql unavailable: ' + e.message + ')',
      meta: { endpoint: '/api/execute', phase: 2, note: 'Database connection failed. Showing in-memory only.' }
    });
  }
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST') {
    return handleExecute(req, res);
  }
  return handleStatus(req, res);
};
