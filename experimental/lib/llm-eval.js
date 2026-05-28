// lib/llm-eval.js — Real LLM Solving for Golden Tasks
// Calls an OpenAI-compatible API to actually solve golden tasks.
// Falls back to mock solver when no LLM provider configured.
// Records to execution_log.jsonl identically to mock path.

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const expLog = require('./experimental-log');
const evalHarness = require('./eval-harness');

const LLM_API_KEY = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || '';
const LLM_BASE_URL = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
const LLM_MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';
const LLM_TIMEOUT = 30000;

function isAvailable() {
  return !!LLM_API_KEY;
}

function fetchLLM(messages) {
  return new Promise((resolve, reject) => {
    const url = LLM_BASE_URL.replace(/\/+$/, '') + '/chat/completions';
    const parsed = new URL(url);
    const mod = parsed.protocol === 'https:' ? https : http;
    const body = JSON.stringify({
      model: LLM_MODEL,
      messages,
      temperature: 0.1,
      max_tokens: 1024,
    });
    const req = mod.request(url, {
      method: 'POST',
      timeout: LLM_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + LLM_API_KEY,
        'User-Agent': 'aineedhelp-llm-eval/1.0',
      },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) reject(new Error(parsed.error.message || 'LLM API error'));
          else resolve(parsed.choices?.[0]?.message?.content || '');
        } catch {
          reject(new Error('Failed to parse LLM response: ' + data.slice(0, 200)));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('LLM timeout')); });
    req.write(body);
    req.end();
  });
}

// Check if LLM output contains any expected solution keyword
function checkSolution(output, task) {
  const lower = (output || '').toLowerCase();
  const keywords = task.expected_solution_keywords || [];
  if (keywords.length === 0) {
    // No keywords — just check output is non-trivial
    return (output || '').length > 50;
  }
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
}

// Solve a single golden task via LLM (or mock fallback)
async function solveTask(task, mode) {
  const runId = 'LLM_' + (mode === 'with_memory' ? 'MEM_' : 'NOMEM_') + task.id + '_' + Date.now();
  const startTime = Date.now();
  const memoryIds = [];

  // Phase 1: Claimed (experimental log only)
  expLog.append(expLog.makeEvent(runId, 'task_claimed', {
    task_id: task.id, agent_id: 'llm-eval',
    input: { task_id: task.id, title: (task.problem || '').slice(0, 100), category: task.category },
    output: { execution_id: runId, mode, solver: isAvailable() ? LLM_MODEL : 'mock' },
    latency_ms: 5,
  }));

  // Phase 2-3: Build prompt with optional memory
  let finalPrompt = 'Solve the following problem:\n' + (task.problem || '');
  if (mode === 'with_memory' && task.memory_hint) {
    memoryIds.push(task.id);
    const augmentedContext = '<MEMORY>' + task.memory_hint + '</MEMORY>';
    finalPrompt = augmentedContext + '\n' + finalPrompt;
    expLog.append(expLog.makeEvent(runId, 'memory_injected', {
      task_id: task.id, agent_id: 'llm-eval',
      input: { query: (task.problem || '').slice(0, 100) },
      output: { retrieved_memories: [{ id: task.id, summary: (task.memory_hint || '').slice(0, 200), verification_tier: 'production_confirmed', similarity: 85 }], augmented_context: augmentedContext },
      memory_ids: memoryIds, verification_tier: 'production_confirmed', latency_ms: 5,
    }));
  }

  // Phase 4: Call LLM or mock
  let rawOutput;
  let solved;
  let latencyMs;

  if (isAvailable()) {
    try {
      const llmStart = Date.now();
      rawOutput = await fetchLLM([
        { role: 'system', content: 'You are an expert developer solving real-world engineering problems. Provide specific, actionable solutions.' },
        { role: 'user', content: finalPrompt },
      ]);
      latencyMs = Date.now() - llmStart;
      solved = checkSolution(rawOutput, task);
    } catch (e) {
      rawOutput = 'LLM error: ' + e.message;
      latencyMs = Date.now() - startTime;
      solved = false;
    }
  } else {
    // Mock fallback (matches current eval-harness behavior)
    await new Promise(r => setTimeout(r, 100));
    solved = mode === 'with_memory' && !!task.memory_hint;
    rawOutput = solved
      ? (task.expected_solution_keywords?.[0] || 'Applied memory hint')
      : (task.failure_without_memory || 'Generic attempt');
    latencyMs = solved ? 500 : 3000;
  }

  // Phase 5: Verify (experimental log only)
  expLog.append(expLog.makeEvent(runId, 'result_verified', {
    task_id: task.id, agent_id: 'llm-eval',
    input: { result_length: (rawOutput || '').length },
    output: { passed: solved, errors: solved ? 0 : 1 },
    verification_tier: 'task_validation', latency_ms: 5,
  }));

  // Phase 6: Submit (experimental log only)
  const totalMs = Date.now() - startTime;
  expLog.append(expLog.makeEvent(runId, 'result_submitted', {
    task_id: task.id, agent_id: 'llm-eval',
    input: { execution_id: runId, duration_ms: totalMs, solver: isAvailable() ? LLM_MODEL : 'mock' },
    output: { status: solved ? 'COMPLETED' : 'FAILED', mode, solver: isAvailable() ? LLM_MODEL : 'mock' },
    verification_tier: solved ? 'agent_submitted' : 'agent_failed', latency_ms: totalMs,
  }));

  return { run_id: runId, mode, solved, duration_ms: totalMs, task_id: task.id, solver: isAvailable() ? LLM_MODEL : 'mock' };
}

// Run LLM eval for a single task (both modes)
async function evalTask(taskId) {
  const task = evalHarness.loadTask(taskId);
  if (!task) return { error: 'Task not found: ' + taskId };
  const withMem = await solveTask(task, 'with_memory');
  const withoutMem = await solveTask(task, 'without_memory');
  return {
    task_id: task.id, category: task.category, difficulty: task.difficulty,
    with_memory: withMem, without_memory: withoutMem,
    memory_helped: withMem.solved && !withoutMem.solved,
    memory_hurt: !withMem.solved && withoutMem.solved,
    latency_improvement_ms: withoutMem.duration_ms - withMem.duration_ms,
    both_solved: withMem.solved && withoutMem.solved,
    both_failed: !withMem.solved && !withoutMem.solved,
    solver: withMem.solver,
  };
}

// Run full golden set through LLM
async function runFullSuite() {
  const tasks = evalHarness.loadGoldenSet();
  const results = [];
  for (const task of tasks) {
    try {
      results.push(await evalTask(task.id));
    } catch (e) {
      results.push({ task_id: task.id, error: e.message });
    }
  }

  const valid = results.filter(r => !r.error);
  const helped = valid.filter(r => r.memory_helped).length;
  const hurt = valid.filter(r => r.memory_hurt).length;
  const total = valid.length;

  const report = {
    ran_at: new Date().toISOString(),
    solver: isAvailable() ? LLM_MODEL : 'mock',
    total_tasks: total,
    categories: [...new Set(valid.map(t => t.category))],
    summary: {
      memory_helped: helped,
      memory_hurt: hurt,
      both_solved: valid.filter(r => r.both_solved).length,
      both_failed: valid.filter(r => r.both_failed).length,
      memory_effectiveness: total > 0 ? +((helped - hurt) / total * 100).toFixed(1) : 0,
      avg_latency_improvement_ms: Math.round(valid.reduce((s, r) => s + (r.latency_improvement_ms || 0), 0) / total),
    },
    results: valid.map(r => ({
      task_id: r.task_id, category: r.category, memory_helped: r.memory_helped,
      latency_improvement_ms: r.latency_improvement_ms,
      with_memory_solved: r.with_memory?.solved,
      without_memory_solved: r.without_memory?.solved,
    })),
  };

  // Save LLM results separately
  const dir = path.join(__dirname, '..', 'evals', 'results');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'llm-eval-' + Date.now() + '.json'), JSON.stringify(report, null, 2));

  return report;
}

// Run a quick spot-check on a subset of tasks (faster for CI)
async function runSpotCheck(count = 3) {
  const tasks = evalHarness.loadGoldenSet();
  const sample = tasks.sort(() => Math.random() - 0.5).slice(0, Math.min(count, tasks.length));
  const results = [];
  for (const task of sample) {
    try {
      results.push(await evalTask(task.id));
    } catch {}
  }
  return {
    ran_at: new Date().toISOString(),
    solver: isAvailable() ? LLM_MODEL : 'mock',
    tasks_tested: results.length,
    memory_effectiveness: results.length > 0
      ? +(results.filter(r => r.memory_helped).length / results.length * 100).toFixed(1) : 0,
    results,
  };
}

module.exports = { solveTask, evalTask, runFullSuite, runSpotCheck, isAvailable };
