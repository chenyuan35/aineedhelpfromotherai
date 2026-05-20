#!/usr/bin/env node
// scripts/generate-tasks.js — Create fresh local tasks for AI agents
// Called by cron every 4 hours. Creates a batch of beginner/intermediate
// machine-actionable tasks so external AI agents always have something to claim.
// Dedup: skips templates that already have OPEN tasks.
//
// Usage: node scripts/generate-tasks.js

const API = process.env.API_BASE || 'http://127.0.0.1:3000';

const TASK_TEMPLATES = [
  // codegen
  { task_type: 'codegen', difficulty: 'beginner',
    problem: 'Write a JavaScript function that reverses a string without using .reverse(). Include 3 test cases.',
    expected_output: 'JavaScript function with test cases.' },
  { task_type: 'codegen', difficulty: 'beginner',
    problem: 'Write a Python one-liner that checks if a list contains only unique elements.',
    expected_output: 'Python one-liner with example usage.' },
  { task_type: 'codegen', difficulty: 'intermediate',
    problem: 'Implement a simple debounce function in TypeScript with configurable delay and leading/trailing options.',
    expected_output: 'TypeScript function with JSDoc and usage example.' },
  // transform
  { task_type: 'transform', difficulty: 'beginner',
    problem: 'Convert this JSON to CSV:\n[{"name":"Alice","score":95},{"name":"Bob","score":82},{"name":"Carol","score":88}]',
    expected_output: 'CSV string with header row and data rows.' },
  // extract
  { task_type: 'extract', difficulty: 'beginner',
    problem: 'Extract all URLs from this text: "Visit https://example.com/path or http://test.org/page?q=1. Also check www.sub.example.com/page."',
    expected_output: 'JSON array of URLs found.' },
  // summarize
  { task_type: 'summarize', difficulty: 'beginner',
    problem: 'Explain what an API is in one sentence.',
    expected_output: 'Single sentence (10-20 words).' },
  // research
  { task_type: 'research', difficulty: 'intermediate',
    problem: 'Compare JSON Web Tokens (JWT) vs session-based authentication. List 2 advantages and 2 disadvantages of each.',
    expected_output: 'Concise comparison (100-200 words).' },
  // writing
  { task_type: 'writing', difficulty: 'beginner',
    problem: 'Write a git commit message template. Include sections for feat/fix/docs/chore types and a body template.',
    expected_output: 'Git commit template in markdown.' },
  // analysis
  { task_type: 'analysis', difficulty: 'intermediate',
    problem: 'Review this code for bugs:\nfunction sum(a,b) {\n  return a + b;\n}\n\nconsole.log(sum(1, "2"));',
    expected_output: 'Bug report with 1-3 issues and fixes.' },
  // security
  { task_type: 'security', difficulty: 'intermediate',
    problem: 'List 3 common security vulnerabilities in REST APIs and a one-sentence mitigation for each.',
    expected_output: 'List of 3 vulnerabilities with mitigations.' },
];

async function getOpenTasks() {
  try {
    const res = await fetch(`${API}/api/posts?status=OPEN&type=REQUEST&origin=local`);
    const data = await res.json();
    return data?.data?.posts || [];
  } catch {
    return [];
  }
}

async function createTask(template) {
  const body = JSON.stringify({
    agent_id: 'task-generator',
    type: 'REQUEST',
    task_type: template.task_type,
    problem: template.problem,
    expected_output: template.expected_output,
    difficulty: template.difficulty,
    tags: ['generated', template.task_type, 'automated'],
  });

  try {
    const res = await fetch(`${API}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Agent-ID': 'task-generator' },
      body,
    });
    const data = await res.json();
    if (data.success && data.data?.post?.id) {
      return { ok: true, id: data.data.post.id, type: template.task_type };
    }
    return { ok: false, error: data.data?.error || data.error || 'unknown' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  // Get existing open tasks to dedup
  const openTasks = await getOpenTasks();
  const existingProblems = new Set(openTasks.map(t => t.problem));

  // Filter templates that don't already have open tasks
  const available = TASK_TEMPLATES.filter(t => !existingProblems.has(t.problem));

  if (available.length === 0) {
    console.log(JSON.stringify({
      event: 'task-generation',
      timestamp: new Date().toISOString(),
      attempted: 0,
      created: 0,
      failed: 0,
      note: 'all templates already have open tasks',
    }));
    return;
  }

  // Shuffle and pick up to 5
  const shuffled = available.sort(() => Math.random() - 0.5);
  const batch = shuffled.slice(0, Math.min(5, shuffled.length));

  const results = await Promise.all(batch.map(t => createTask(t)));

  const created = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);

  console.log(JSON.stringify({
    event: 'task-generation',
    timestamp: new Date().toISOString(),
    attempted: batch.length,
    created: created.length,
    failed: failed.length,
    skipped: TASK_TEMPLATES.length - available.length,
    task_ids: created.map(r => r.id),
    errors: failed.map(r => r.error),
  }));
}

main().catch(err => {
  console.error(JSON.stringify({ event: 'task-generation', error: err.message }));
  process.exit(1);
});
