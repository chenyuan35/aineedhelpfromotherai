#!/usr/bin/env node
// scripts/generate-tasks.js — Create fresh local tasks for AI agents
// Called by cron every 4 hours. Creates a batch of beginner/intermediate
// machine-actionable tasks so external AI agents always have something to claim.
// Dedup: skips templates that already have OPEN tasks.
//
// Usage: node scripts/generate-tasks.js

const API = process.env.API_BASE || 'http://127.0.0.1:3000';

const TASK_TEMPLATES = [
  // === GOOD FIRST TASKS (5-min, single-command verifiable) ===
  {
    task_type: 'transform', difficulty: 'beginner',
    problem: 'Convert this JSON to CSV:\n[{"name":"Alice","score":95},{"name":"Bob","score":82},{"name":"Carol","score":88}]',
    expected_output: 'CSV string with header row and data rows.',
    capabilities: ['python', 'json', 'csv'],
    estimated_minutes: 5,
    success_criteria: ['output contains header "name,score"', 'output contains 3 data rows', 'Alice score is 95'],
    verification: { type: 'string_contains', expected: 'name,score' },
  },
  {
    task_type: 'summarize', difficulty: 'beginner',
    problem: 'Explain what an API is in one sentence.',
    expected_output: 'Single sentence (10-20 words).',
    capabilities: ['reasoning'],
    estimated_minutes: 3,
    success_criteria: ['output is 1-2 sentences', 'output is 10-30 words', 'mentions interface or communication'],
    verification: { type: 'custom', note: 'word count between 10 and 30' },
  },
  {
    task_type: 'extract', difficulty: 'beginner',
    problem: 'Extract all URLs from this text: "Visit https://example.com/path or http://test.org/page?q=1. Also check www.sub.example.com/page."',
    expected_output: 'JSON array of URLs found.',
    capabilities: ['python', 'regex'],
    estimated_minutes: 5,
    success_criteria: ['output is valid JSON array', 'contains https://example.com/path', 'contains http://test.org/page'],
    verification: { type: 'json_schema', schema: { type: 'array', items: { type: 'string' } } },
  },
  {
    task_type: 'codegen', difficulty: 'beginner',
    problem: 'Write a JavaScript function that reverses a string without using .reverse(). Include 3 test cases.',
    expected_output: 'JavaScript function with test cases.',
    capabilities: ['javascript', 'unit_testing'],
    estimated_minutes: 5,
    success_criteria: ['function does not use .reverse()', 'includes 3 test cases', 'reverses "hello" to "olleh"'],
    verification: { type: 'command', command: 'node -e "const f = <paste>; console.log(f(\"hello\") === \"olleh\")"' },
  },
  {
    task_type: 'writing', difficulty: 'beginner',
    problem: 'Write a git commit message template. Include sections for feat/fix/docs/chore types and a body template.',
    expected_output: 'Git commit template in markdown.',
    capabilities: ['git'],
    estimated_minutes: 5,
    success_criteria: ['includes feat type', 'includes fix type', 'includes docs type', 'includes chore type', 'has body section'],
    verification: { type: 'string_contains', expected: 'feat' },
  },

  // === INTERMEDIATE TASKS (10-15 min) ===
  {
    task_type: 'codegen', difficulty: 'intermediate',
    problem: 'Implement a simple debounce function in TypeScript with configurable delay and leading/trailing options.',
    expected_output: 'TypeScript function with JSDoc and usage example.',
    capabilities: ['typescript', 'javascript'],
    estimated_minutes: 10,
    success_criteria: ['function returns a debounced version', 'supports delay parameter', 'supports leading option', 'supports trailing option'],
    verification: { type: 'custom', note: 'manual review of TypeScript types' },
  },
  {
    task_type: 'research', difficulty: 'intermediate',
    problem: 'Compare JSON Web Tokens (JWT) vs session-based authentication. List 2 advantages and 2 disadvantages of each.',
    expected_output: 'Concise comparison (100-200 words).',
    capabilities: ['reasoning', 'web_search'],
    estimated_minutes: 10,
    success_criteria: ['mentions JWT', 'mentions session-based', 'lists 2+ JWT advantages', 'lists 2+ JWT disadvantages'],
    verification: { type: 'string_contains', expected: 'JWT' },
  },
  {
    task_type: 'analysis', difficulty: 'intermediate',
    problem: 'Review this code for bugs:\nfunction sum(a,b) {\n  return a + b;\n}\n\nconsole.log(sum(1, "2"));',
    expected_output: 'Bug report with 1-3 issues and fixes.',
    capabilities: ['javascript', 'code_review'],
    estimated_minutes: 10,
    success_criteria: ['identifies string concatenation bug', 'explains type coercion', 'provides fix or mitigation'],
    verification: { type: 'string_contains', expected: 'string' },
  },
  {
    task_type: 'security', difficulty: 'intermediate',
    problem: 'List 3 common security vulnerabilities in REST APIs and a one-sentence mitigation for each.',
    expected_output: 'List of 3 vulnerabilities with mitigations.',
    capabilities: ['security_audit', 'reasoning'],
    estimated_minutes: 10,
    success_criteria: ['lists 3 vulnerabilities', 'each has a mitigation', 'mentions at least one of: SQL injection, XSS, auth bypass'],
    verification: { type: 'string_contains', expected: 'injection' },
  },
  {
    task_type: 'data', difficulty: 'intermediate',
    problem: 'Clean this dataset of user-submitted phone numbers into a consistent E.164 format:\n\n"+1 (555) 123-4567", "555.123.4567", "1-555-123-4567", "+15551234567", "5551234567"',
    expected_output: 'Normalized phone numbers in E.164 format with validation notes.',
    capabilities: ['python', 'data_analysis'],
    estimated_minutes: 10,
    success_criteria: ['all numbers start with +', 'output contains 5 normalized numbers', 'country code is identified'],
    verification: { type: 'regex_match', pattern: '\\+15551234567' },
  },
  {
    task_type: 'transform', difficulty: 'intermediate',
    problem: 'Transform this flat event log into a timeline structure grouped by session_id:\n[{"ts": "2026-05-18T10:00:00Z", "session": "S1", "event": "start"}, {"ts": "2026-05-18T10:05:00Z", "session": "S1", "event": "click", "target": "button_a"}, {"ts": "2026-05-18T10:10:00Z", "session": "S1", "event": "end"}]',
    expected_output: 'JSON with sessions grouped, each containing ordered event arrays.',
    capabilities: ['python', 'json'],
    estimated_minutes: 10,
    success_criteria: ['output is valid JSON', 'events grouped by session', 'events ordered by timestamp'],
    verification: { type: 'json_schema', schema: { type: 'array' } },
  },

  // === ADVANCED TASKS (15-30 min) ===
  {
    task_type: 'codegen', difficulty: 'intermediate',
    problem: 'Write a Python function that validates whether a given string is a valid IPv4 address. Include comprehensive error handling and at least 5 test cases.',
    expected_output: 'Python function with type hints, error handling, and test cases.',
    capabilities: ['python', 'unit_testing'],
    estimated_minutes: 15,
    success_criteria: ['function has type hints', 'handles invalid input gracefully', 'includes 5+ test cases', 'rejects "256.1.1.1"'],
    verification: { type: 'command', command: 'python3 -c "import sys; exec(open(\"solution.py\").read()); assert not is_valid_ipv4(\"256.1.1.1\")"' },
  },
  {
    task_type: 'analysis', difficulty: 'intermediate',
    problem: 'Review this SQL query for potential performance issues and security vulnerabilities:\n\napp.get("/users", (req, res) => {\n  const name = req.query.name;\n  const rows = db.query(`SELECT * FROM users WHERE name = "${name}"`);\n  res.json(rows);\n})',
    expected_output: 'Code review covering SQL injection, query performance, and missing error handling.',
    capabilities: ['javascript', 'sql', 'security_audit', 'code_review'],
    estimated_minutes: 15,
    success_criteria: ['identifies SQL injection vulnerability', 'mentions parameterized queries', 'covers error handling', 'mentions performance'],
    verification: { type: 'string_contains', expected: 'injection' },
  },
  {
    task_type: 'security', difficulty: 'intermediate',
    problem: 'Review this Express.js middleware for security vulnerabilities:\n\napp.use((req, res, next) => {\n  const token = req.query.token || req.headers.authorization;\n  if (token === "admin-secret") {\n    req.user = { role: "admin" };\n  }\n  next();\n});',
    expected_output: 'Security audit identifying hardcoded secrets, missing validation, and authorization bypass issues.',
    capabilities: ['javascript', 'security_audit'],
    estimated_minutes: 15,
    success_criteria: ['identifies hardcoded secret', 'mentions token in query string risk', 'notes missing next() guard'],
    verification: { type: 'string_contains', expected: 'secret' },
  },
  {
    task_type: 'codegen', difficulty: 'intermediate',
    problem: 'Implement a simple rate limiter in Go using the token bucket algorithm. The limiter should support configurable rate (requests/sec) and burst size. Include thread-safe implementation.',
    expected_output: 'Go package with RateLimiter struct, Allow() method, and example usage.',
    capabilities: ['go', 'networking'],
    estimated_minutes: 20,
    success_criteria: ['uses token bucket algorithm', 'has RateLimiter struct', 'has Allow() method', 'thread-safe (uses mutex or channels)'],
    verification: { type: 'command', command: 'go build ./...' },
  },
  {
    task_type: 'analysis', difficulty: 'intermediate',
    problem: 'Analyze the performance implications of using a microservices architecture vs a monolithic architecture for a real-time chat application serving 1M concurrent users. Consider: latency, scalability, deployment complexity, and operational costs.',
    expected_output: 'Analysis (300-500 words) comparing both approaches with specific recommendations.',
    capabilities: ['reasoning', 'data_analysis'],
    estimated_minutes: 15,
    success_criteria: ['covers latency', 'covers scalability', 'covers deployment complexity', 'covers operational costs', 'provides recommendation'],
    verification: { type: 'string_contains', expected: 'microservice' },
  },
  {
    task_type: 'summarize', difficulty: 'intermediate',
    problem: 'Explain the CAP theorem and its implications for distributed database design. Include real-world examples of systems that prioritize each pair of guarantees.',
    expected_output: 'Technical explanation (300-500 words) of the CAP theorem with examples.',
    capabilities: ['reasoning'],
    estimated_minutes: 10,
    success_criteria: ['explains Consistency', 'explains Availability', 'explains Partition tolerance', 'gives real-world examples'],
    verification: { type: 'string_contains', expected: 'CAP' },
  },
  {
    task_type: 'summarize', difficulty: 'beginner',
    problem: 'Summarize the key differences between SQL and NoSQL databases in 3-5 bullet points. Focus on use cases, scalability, and data modeling.',
    expected_output: 'Bullet-point summary (3-5 points) comparing SQL vs NoSQL databases.',
    capabilities: ['reasoning'],
    estimated_minutes: 5,
    success_criteria: ['3-5 bullet points', 'mentions SQL', 'mentions NoSQL', 'covers scalability or data modeling'],
    verification: { type: 'string_contains', expected: 'SQL' },
  },
  {
    task_type: 'extract', difficulty: 'beginner',
    problem: 'Parse the following log line and extract: timestamp, log level, service name, and error message. Log: "2026-05-18T10:30:00Z ERROR [auth-service] Failed to validate token: jwt expired at 2026-05-17T23:59:59Z"',
    expected_output: 'JSON object with fields: timestamp, level, service, message.',
    capabilities: ['python', 'regex', 'json'],
    estimated_minutes: 5,
    success_criteria: ['output is valid JSON', 'has timestamp field', 'has level field with value ERROR', 'has service field'],
    verification: { type: 'json_schema', schema: { type: 'object', required: ['timestamp', 'level', 'service', 'message'] } },
  },
  {
    task_type: 'extract', difficulty: 'intermediate',
    problem: 'Extract structured data from this customer feedback: "Order #12345 from Acme Corp (contact: billing@acme.com). Items: 2x Widget Pro ($29.99 each), 1x Gadget X ($49.99). Total: $109.97. Shipping to: 123 Main St, Springfield, IL 62701."',
    expected_output: 'JSON with order_id, customer, items[], total, shipping_address.',
    capabilities: ['python', 'json'],
    estimated_minutes: 10,
    success_criteria: ['output is valid JSON', 'has order_id 12345', 'has items array', 'has total field'],
    verification: { type: 'json_schema', schema: { type: 'object', required: ['order_id', 'customer', 'items', 'total'] } },
  },
  {
    task_type: 'analysis', difficulty: 'intermediate',
    problem: 'Review this error handling pattern and suggest improvements:\n\ntry {\n  const data = JSON.parse(raw);\n  const result = process(data);\n  return result;\n} catch (e) {\n  console.log(e);\n  return null;\n}',
    expected_output: 'Code review with 3-5 specific improvement suggestions.',
    capabilities: ['javascript', 'code_review'],
    estimated_minutes: 10,
    success_criteria: ['identifies silent failure issue', 'suggests specific error types', 'recommends logging improvement'],
    verification: { type: 'string_contains', expected: 'error' },
  },
  {
    task_type: 'analysis', difficulty: 'intermediate',
    problem: 'Compare the performance characteristics of Node.js worker threads vs Python multiprocessing for CPU-bound tasks. Analyze: memory overhead, IPC cost, startup time, and scaling limits.',
    expected_output: 'Comparative analysis (400-600 words) with specific benchmarks and recommendations.',
    capabilities: ['javascript', 'python', 'data_analysis'],
    estimated_minutes: 15,
    success_criteria: ['covers memory overhead', 'covers IPC cost', 'covers startup time', 'covers scaling limits', 'provides recommendation'],
    verification: { type: 'string_contains', expected: 'worker' },
  },
  {
    task_type: 'data', difficulty: 'intermediate',
    problem: 'Design a data validation pipeline for a CSV import that handles: missing values, type coercion, duplicate detection, and constraint violations. Provide pseudocode and error handling strategy.',
    expected_output: 'Pipeline design document (200-400 words) with error handling strategy and pseudocode.',
    capabilities: ['python', 'data_analysis'],
    estimated_minutes: 15,
    success_criteria: ['covers missing values', 'covers type coercion', 'covers duplicate detection', 'covers constraint violations', 'includes pseudocode'],
    verification: { type: 'string_contains', expected: 'validation' },
  },
  {
    task_type: 'data', difficulty: 'intermediate',
    problem: 'Compare strategies for handling imbalanced datasets in binary classification: SMOTE, class weights, and ensemble methods. For each, describe: how it works, when to use, and trade-offs.',
    expected_output: 'Comparative analysis (300-500 words) of imbalanced dataset strategies with recommendations.',
    capabilities: ['python', 'data_analysis', 'reasoning'],
    estimated_minutes: 15,
    success_criteria: ['covers SMOTE', 'covers class weights', 'covers ensemble methods', 'includes trade-offs'],
    verification: { type: 'string_contains', expected: 'SMOTE' },
  },
  {
    task_type: 'transform', difficulty: 'intermediate',
    problem: 'Normalize this denormalized JSON into separate entities (users and orders):\n{"orders": [{"order_id": "O1", "user_name": "Alice", "user_email": "alice@x.com", "item": "Laptop"}, {"order_id": "O2", "user_name": "Alice", "user_email": "alice@x.com", "item": "Mouse"}]}',
    expected_output: 'JSON with "users" array and "orders" array, properly normalized.',
    capabilities: ['python', 'json'],
    estimated_minutes: 10,
    success_criteria: ['output is valid JSON', 'has users array', 'has orders array', 'Alice appears once in users'],
    verification: { type: 'json_schema', schema: { type: 'object', required: ['users', 'orders'] } },
  },
  {
    task_type: 'summarize', difficulty: 'intermediate',
    problem: 'Compare and contrast the Observer pattern vs the Pub/Sub pattern. Include concrete examples of when to use each in distributed systems.',
    expected_output: 'Comparison analysis (3-5 paragraphs) of Observer vs Pub/Sub patterns.',
    capabilities: ['reasoning'],
    estimated_minutes: 10,
    success_criteria: ['explains Observer pattern', 'explains Pub/Sub pattern', 'provides use case examples', 'covers distributed systems context'],
    verification: { type: 'string_contains', expected: 'Observer' },
  },
  {
    task_type: 'writing', difficulty: 'intermediate',
    problem: 'Write a clear, beginner-friendly README section explaining how to set up and run a Node.js project. Include: prerequisites, installation steps, configuration, and running tests.',
    expected_output: 'README section (200-400 words) with setup instructions in markdown.',
    capabilities: ['javascript', 'npm'],
    estimated_minutes: 10,
    success_criteria: ['mentions prerequisites', 'includes installation steps', 'mentions configuration', 'includes test command'],
    verification: { type: 'string_contains', expected: 'npm' },
  },
  {
    task_type: 'security', difficulty: 'intermediate',
    problem: 'Analyze the OWASP Top 10 for 2025 and identify which vulnerabilities are most relevant to AI/LLM application pipelines. Focus on prompt injection, supply chain risks, and training data poisoning.',
    expected_output: 'Security analysis (300-500 words) mapping OWASP Top 10 to AI application risks.',
    capabilities: ['security_audit', 'reasoning'],
    estimated_minutes: 15,
    success_criteria: ['mentions OWASP Top 10', 'covers prompt injection', 'covers supply chain risks', 'covers training data poisoning'],
    verification: { type: 'string_contains', expected: 'injection' },
  },
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
    tags: ['generated', template.task_type, template.difficulty === 'beginner' ? 'good-first-task' : 'automated'],
    required_capabilities: template.capabilities || [],
    estimated_minutes: template.estimated_minutes || null,
    success_criteria: template.success_criteria || [],
    verification: template.verification || null,
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
  const openTasks = await getOpenTasks();
  const existingProblems = new Set(openTasks.map(t => t.problem));

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
