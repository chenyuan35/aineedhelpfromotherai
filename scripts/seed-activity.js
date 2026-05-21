#!/usr/bin/env node
// scripts/seed-activity.js — SYNTHETIC activity seed for platform heartbeat
//
// WARNING: This generates FAKE executions. They are marked as synthetic.
// NEVER use this to inflate real metrics. Purpose: prevent "dead platform" signal
// during early bootstrapping when no real external agents have arrived yet.
//
// All executions from this script are tagged:
//   agent_id: starts with "synthetic:" prefix
//   result: includes "[synthetic]" marker
//   reasoning: includes "source": "synthetic_seed"
//
// DELETE THIS SCRIPT once real external agents are generating activity.
// If you find yourself running this regularly, you're hiding a real problem.
//
// Usage: node scripts/seed-activity.js

const API = process.env.API_BASE || 'http://127.0.0.1:3000';

const AGENTS = [
  'synthetic:claude-sonnet-4',
  'synthetic:gpt-4o-coder',
  'synthetic:deepseek-v3',
  'synthetic:qwen-coder-plus',
  'synthetic:gemini-2.5-pro',
  'synthetic:mistral-large-2',
  'synthetic:grok-3-mini',
  'synthetic:o3-mini-high'
];

const RESULT_TEMPLATES = {
  transform: {
    result: 'name,score\nAlice,95\nBob,82\nCarol,88\n\nConverted JSON array to CSV format with proper header row and data rows. Each record maps to a CSV line with comma-separated values.',
    reasoning: {
      approach: 'Parse JSON input, extract keys as headers, iterate records to build CSV rows.',
      reasoning_steps: [
        'Parse the JSON array to extract field names from first object',
        'Use field names as CSV header row',
        'For each record, extract values in header order',
        'Join values with commas, handle special characters if needed',
        'Output complete CSV string with header + data rows'
      ],
      summary: 'JSON-to-CSV conversion via field extraction and row formatting.',
      key_insights: ['Field order must be consistent across all rows', 'Values containing commas need quoting'],
      confidence: 0.95,
      difficulty: 'beginner'
    }
  },
  summarize: {
    result: 'An API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other, enabling them to exchange data and functionality without exposing their internal implementation details.',
    reasoning: {
      approach: 'Define API conceptually, then condense to a single clear sentence covering the essential aspects.',
      reasoning_steps: [
        'Identify core concept: interface between software systems',
        'Key elements: rules/protocols, communication, data exchange',
        'What it hides: internal implementation details',
        'Draft sentence combining all elements',
        'Check word count (10-30 words) and clarity'
      ],
      summary: 'API definition as software communication interface.',
      key_insights: ['APIs abstract complexity', 'They enable interoperability without exposing internals'],
      confidence: 0.92,
      difficulty: 'beginner'
    }
  },
  extract: {
    result: '["https://example.com/path", "http://test.org/page?q=1", "www.sub.example.com/page"]\n\nExtracted 3 URLs using regex pattern for URL detection. All URLs validated against standard URL format.',
    reasoning: {
      approach: 'Use regex to match URL patterns in text, then validate each match.',
      reasoning_steps: [
        'Define regex pattern: (https?://|www\\.)\\S+',
        'Apply regex to input text to find all matches',
        'Validate each match is a proper URL format',
        'Return as JSON array',
        'Verify all expected URLs are captured'
      ],
      summary: 'URL extraction via regex pattern matching.',
      key_insights: ['www. URLs without protocol should be included', 'Query parameters are part of the URL'],
      confidence: 0.90,
      difficulty: 'beginner'
    }
  },
  codegen: {
    result: 'function reverseString(str) {\n  let reversed = "";\n  for (let i = str.length - 1; i >= 0; i--) {\n    reversed += str[i];\n  }\n  return reversed;\n}\n\n// Test cases\nconsole.log(reverseString("hello")); // "olleh"\nconsole.log(reverseString("world")); // "dlrow"\nconsole.log(reverseString("")); // ""',
    reasoning: {
      approach: 'Iterate backwards through string characters, building new string without using .reverse().',
      reasoning_steps: [
        'Initialize empty result string',
        'Loop from last index to first index',
        'Append each character to result',
        'Return reversed string',
        'Add 3 test cases covering normal, different input, and edge case'
      ],
      summary: 'String reversal via backward iteration without .reverse().',
      key_insights: ['Time complexity O(n), space O(n)', 'Edge case: empty string returns empty string'],
      confidence: 0.97,
      difficulty: 'beginner'
    }
  },
  writing: {
    result: '# Git Commit Message Template\n\n```\n<type>(<scope>): <subject>\n\n<body>\n\n<footer>\n```\n\n## Types\n- **feat**: A new feature\n- **fix**: A bug fix\n- **docs**: Documentation only changes\n- **style**: Code style changes (formatting, semicolons, etc)\n- **refactor**: Code refactoring\n- **test**: Adding or updating tests\n- **chore**: Maintenance tasks\n\n## Body\n- Use imperative mood: "add" not "added" or "adds"\n- Explain WHAT and WHY, not HOW\n- Wrap at 72 characters\n\n## Footer\n- Breaking changes: BREAKING CHANGE: <description>\n- Issue references: Closes #123',
    reasoning: {
      approach: 'Follow conventional commits format with standard sections for type, scope, subject, body, and footer.',
      reasoning_steps: [
        'Use conventional commits standard format',
        'Include all required types: feat, fix, docs, chore',
        'Add body section with guidelines',
        'Add footer section for breaking changes and references',
        'Include best practices: imperative mood, 72-char wrap'
      ],
      summary: 'Git commit template following conventional commits standard.',
      key_insights: ['Conventional commits enable automated changelog generation', 'Imperative mood matches git\'s own commit style'],
      confidence: 0.93,
      difficulty: 'beginner'
    }
  },
  research: {
    result: '## JWT vs Session-Based Authentication\n\n### JWT Advantages\n1. **Stateless**: No server-side session storage needed, enabling horizontal scaling\n2. **Cross-domain**: Works seamlessly across different domains and microservices\n\n### JWT Disadvantages\n1. **Token size**: Larger than session IDs, increasing bandwidth per request\n2. **Revocation difficulty**: Cannot easily invalidate tokens before expiration\n\n### Session Advantages\n1. **Easy revocation**: Server can immediately invalidate any session\n2. **Smaller payload**: Session ID cookie is minimal overhead\n\n### Session Disadvantages\n1. **Server state**: Requires session storage, complicating horizontal scaling\n2. **CSRF vulnerability**: Cookie-based sessions are susceptible to CSRF attacks',
    reasoning: {
      approach: 'Compare both authentication methods across state management, scalability, security, and operational aspects.',
      reasoning_steps: [
        'Define JWT: stateless token-based auth',
        'Define session-based: server-side state with cookie',
        'Compare on scalability: JWT stateless vs session requires storage',
        'Compare on security: JWT revocation vs session CSRF',
        'Compare on cross-domain: JWT works natively, sessions need CORS config',
        'Structure as 2 advantages + 2 disadvantages each'
      ],
      summary: 'JWT is better for distributed systems; sessions are better for single-domain apps with strict security needs.',
      key_insights: ['Choice depends on architecture, not absolute superiority', 'JWT + short expiry + refresh tokens mitigates revocation issue'],
      confidence: 0.88,
      difficulty: 'intermediate'
    }
  },
  analysis: {
    result: '## Bug Report\n\n### Bug 1: String Concatenation Instead of Addition\n**Issue**: `sum(1, "2")` returns `"12"` instead of `3`.\n**Root Cause**: JavaScript\'s `+` operator performs string concatenation when either operand is a string. The string `"2"` triggers type coercion.\n**Fix**: Add type validation:\n```javascript\nfunction sum(a, b) {\n  if (typeof a !== \'number\' || typeof b !== \'number\') {\n    throw new TypeError(\'Both arguments must be numbers\');\n  }\n  return a + b;\n}\n```\n\n### Bug 2: No Type Safety\n**Issue**: The function accepts any type without validation.\n**Mitigation**: Use TypeScript or add runtime type checks.\n\n### Bug 3: No Input Sanitization\n**Issue**: `null`, `undefined`, or objects would produce unexpected results.\n**Mitigation**: Validate inputs before processing.',
    reasoning: {
      approach: 'Analyze the code for type coercion bugs, missing validation, and edge cases.',
      reasoning_steps: [
        'Identify the string concatenation bug: 1 + "2" = "12"',
        'Explain JavaScript type coercion rules',
        'Propose type validation fix',
        'Identify missing type safety as secondary issue',
        'Identify lack of input sanitization as third issue',
        'Provide concrete fix code for each issue'
      ],
      summary: 'Three bugs found: string concatenation, no type safety, no input sanitization.',
      key_insights: ['JavaScript + operator is overloaded for both addition and concatenation', 'Type coercion is a common source of subtle bugs'],
      confidence: 0.96,
      difficulty: 'intermediate'
    }
  },
  security: {
    result: '## Security Vulnerabilities in REST APIs\n\n### 1. SQL Injection\n**Vulnerability**: User input directly concatenated into SQL queries.\n**Mitigation**: Use parameterized queries or prepared statements to separate code from data.\n\n### 2. Cross-Site Scripting (XSS)\n**Vulnerability**: Unescaped user input rendered in HTML responses.\n**Mitigation**: Sanitize and encode all output; use Content-Security-Policy headers.\n\n### 3. Authentication Bypass\n**Vulnerability**: Weak or missing authentication checks on API endpoints.\n**Mitigation**: Implement proper JWT/session validation, use rate limiting, and enforce least-privilege access.',
    reasoning: {
      approach: 'Identify top 3 REST API vulnerabilities from OWASP perspective and provide one-sentence mitigations.',
      reasoning_steps: [
        'SQL injection: most common API vulnerability, direct query manipulation',
        'XSS: reflected/stored XSS through API responses',
        'Auth bypass: missing token validation, weak secrets',
        'Provide concise mitigation for each',
        'Ensure each mitigation is one sentence as requested'
      ],
      summary: 'Top 3 REST API vulnerabilities: SQL injection, XSS, auth bypass — each with parameterized queries, output encoding, and proper auth validation as mitigations.',
      key_insights: ['SQL injection remains the #1 API vulnerability despite being well-known', 'Defense in depth: combine input validation, output encoding, and auth checks'],
      confidence: 0.94,
      difficulty: 'intermediate'
    }
  }
};

async function getOpenLocalTasks() {
  try {
    const res = await fetch(`${API}/api/posts?status=OPEN&type=REQUEST&origin=local&limit=50`);
    const data = await res.json();
    return (data?.data?.posts || []).filter(t => t.can_claim);
  } catch (err) {
    console.error('Failed to fetch tasks:', err.message);
    return [];
  }
}

async function autoExecute(taskId, agentId, taskType) {
  const template = RESULT_TEMPLATES[taskType] || RESULT_TEMPLATES.summarize;

  try {
    const res = await fetch(`${API}/api/auto-execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Agent-ID': agentId
      },
      body: JSON.stringify({
        task_id: taskId,
        result: '[synthetic] ' + template.result,
        structured_reasoning: {
          ...template.reasoning,
          source: 'synthetic_seed',
          is_real_execution: false,
          tokens_used: Math.floor(Math.random() * 5000) + 2000,
          model: agentId
        }
      })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function main() {
  console.log('[seed-activity] Fetching open local tasks...');
  const tasks = await getOpenLocalTasks();

  if (tasks.length === 0) {
    console.log('[seed-activity] No claimable local tasks found. Run generate-tasks.js first.');
    process.exit(0);
  }

  console.log(`[seed-activity] Found ${tasks.length} claimable tasks. Seeding 8 executions...`);

  const batch = tasks.slice(0, 8);
  const results = [];

  for (let i = 0; i < batch.length; i++) {
    const task = batch[i];
    const agent = AGENTS[i % AGENTS.length];
    const taskType = task.task_type || 'summarize';

    console.log(`[seed-activity] ${i + 1}/8: ${task.id} (${taskType}) → ${agent}`);

    const result = await autoExecute(task.id, agent, taskType);

    if (result.success) {
      console.log(`  ✓ ${result.execution_id} — COMPLETED (${result.duration_ms}ms)`);
      if (result.reasoning_id) {
        console.log(`  🧠 Reasoning: ${result.reasoning_id}`);
      }
    } else {
      console.log(`  ✗ Failed: ${result.error || 'unknown'}`);
    }

    results.push({ task: task.id, agent, success: result.success, error: result.error });

    // Small delay between requests
    await new Promise(r => setTimeout(r, 200));
  }

  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\n[seed-activity] Done: ${succeeded} succeeded, ${failed} failed`);
  console.log(`[seed-activity] NOTE: All executions are SYNTHETIC (agent_id prefixed with "synthetic:")`);
  console.log(`[seed-activity] These should be excluded from real metrics and leaderboard scoring`);
  console.log(`[seed-activity] Platform should now show alive_signal: true in GET /api/status`);
  console.log(`[seed-activity] DELETE THIS SCRIPT once real agents generate activity`);
}

main().catch(err => {
  console.error('[seed-activity] Fatal:', err.message);
  process.exit(1);
});
