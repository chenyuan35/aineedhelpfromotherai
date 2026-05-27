// lib/replay-to-eval.js — Replay-to-Eval conversion
// Automatically extracts regression test cases from failed replays.
// Failed run → distilled benchmark case → added to golden set.

const fs = require('fs');
const path = require('path');
const executionLog = require('./execution-log');

const GOLDEN_DIR = path.join(__dirname, '..', 'evals', 'golden');

// Check if a task_id already exists in the golden set
function isGoldenTask(taskId) {
  if (!fs.existsSync(GOLDEN_DIR)) return false;
  return fs.readdirSync(GOLDEN_DIR).some(f => {
    try {
      const t = JSON.parse(fs.readFileSync(path.join(GOLDEN_DIR, f), 'utf8'));
      return t.id === taskId;
    } catch { return false; }
  });
}

// Extract an eval task from a failed run in execution_log
function extractFromRun(runId) {
  const events = executionLog.getRun(runId);
  if (events.length === 0) return null;

  const claimed = events.find(e => e.event_type === 'task_claimed');
  const submitted = events.find(e => e.event_type === 'result_submitted');
  const modelOutput = events.find(e => e.event_type === 'model_output');
  const injected = events.find(e => e.event_type === 'memory_injected');

  // Only extract from failed runs
  if (!submitted || submitted.output?.status === 'COMPLETED') return null;
  if (!claimed) return null;

  const taskId = claimed.task_id;
  if (isGoldenTask(taskId)) return null; // already covered

  const problem = claimed.input?.title || claimed.input?.task_id || taskId || '';
  const rawOutput = modelOutput?.output?.raw_output || submitted.input?.result_text || '';
  const difficulty = claimed.input?.difficulty || 'intermediate';
  const category = claimed.input?.category || 'unknown';

  const evalTask = {
    id: `auto-regression-${runId.slice(-8)}`,
    source_run_id: runId,
    category,
    problem: problem.slice(0, 500),
    expected_solution_keywords: [],
    difficulty,
    tags: ['auto-generated', 'regression', 'from_replay'],
    memory_hint: injected?.output?.augmented_context?.slice(0, 200) || '',
    failure_without_memory: rawOutput.slice(0, 200) || 'Failed during execution',
    generated_at: new Date().toISOString(),
  };

  return evalTask;
}

// Process all failed runs and return new eval tasks (don't auto-write)
function extractRegressionSuite() {
  if (!require('fs').existsSync(executionLog.LOG_PATH)) return [];

  const lines = require('fs').readFileSync(executionLog.LOG_PATH, 'utf8').split('\n').filter(Boolean);
  const runIds = new Set();
  for (const line of lines) {
    try {
      const ev = JSON.parse(line);
      if (ev.event_type === 'result_submitted' && ev.output?.status !== 'COMPLETED') {
        runIds.add(ev.run_id);
      }
    } catch  {}
  }

  const newTasks = [];
  for (const runId of runIds) {
    const task = extractFromRun(runId);
    if (task) newTasks.push(task);
  }
  return newTasks;
}

// Write a new golden task file
function writeGoldenTask(task) {
  if (!task.id) task.id = `auto-${Date.now()}`;
  const filePath = path.join(GOLDEN_DIR, `${task.id}.json`);
  if (fs.existsSync(filePath)) return false;
  fs.writeFileSync(filePath, JSON.stringify(task, null, 2));
  return true;
}

module.exports = { extractFromRun, extractRegressionSuite, writeGoldenTask, isGoldenTask };
