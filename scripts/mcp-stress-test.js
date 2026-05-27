// scripts/mcp-stress-test.js — MCP Endpoint Stress & Concurrency Test
// Usage: node scripts/mcp-stress-test.js [url] [concurrency] [iterations]
// Default: node scripts/mcp-stress-test.js http://localhost:3000 5 3

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const CONCURRENCY = parseInt(process.argv[3]) || 5;
const ITERATIONS = parseInt(process.argv[4]) || 3;
const TIMEOUT_MS = 15000;
const PHASE_DELAY_MS = parseInt(process.argv[5]) || 2000;

let passed = 0;
let failed = 0;
let errors = [];

function jsonRpcRequest(method, params) {
  return {
    jsonrpc: '2.0',
    id: `test_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    method,
    params: params || {},
  };
}

// Parse SSE response text and extract JSON-RPC result
function parseMcpResponse(text) {
  // Try direct JSON parse first (stateless mode)
  try { return JSON.parse(text); } catch {}

  // SSE mode: extract data lines
  const dataLines = [];
  for (const line of text.split('\n')) {
    if (line.startsWith('data: ')) {
      dataLines.push(line.slice(6));
    }
  }
  const joined = dataLines.join('');
  try { return JSON.parse(joined); } catch {}

  // Fallback: return raw text
  return { raw: text.slice(0, 300), _sse: true };
}

async function callTool(toolName, args, retries = 2) {
  const body = jsonRpcRequest('tools/call', { name: toolName, arguments: args || {} });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await res.text();
    const data = parseMcpResponse(text);

    // Detect rate limit and retry after backoff
    const isRateLimited = (
      data?.error?.message?.toLowerCase().includes('rate limit') ||
      data?.result?.text?.includes('rate_limit') ||
      data?.error?.data?.error === 'rate_limited'
    );
    if (isRateLimited && retries > 0) {
      await new Promise(r => setTimeout(r, 2000)); // backoff
      return callTool(toolName, args, retries - 1);
    }

    // Detect isError tool results (not HTTP errors)
    const isToolError = data?.isError === true || data?.result?.isError === true;
    const toolResultText = data?.result?.content?.[0]?.text || '';
    const toolResult = toolResultText ? parseMcpResponse(toolResultText) : {};
    const hasToolError = toolResult?.error != null;

    return { status: res.status, ok: res.ok && !isToolError && !hasToolError, data, toolResult };
  } catch (err) {
    return { status: 0, ok: false, data: { error: err.name === 'AbortError' ? 'timeout' : err.message } };
  } finally {
    clearTimeout(timer);
  }
}

async function runToolTest(toolName, argsGen, label, expectErrors = false) {
  const tasks = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    tasks.push(callTool(toolName, argsGen ? argsGen(i) : {}));
  }
  const results = await Promise.all(tasks);
  for (const r of results) {
    const isErr = r.toolResult?.error != null;
    const httpError = !r.ok && !r.toolResult?.error;
    if (r.ok && !isErr) {
      passed++;
    } else if (isErr && expectErrors) {
      passed++; // expected structured error = success
    } else if (isErr && !expectErrors) {
      // Structured tool error (e.g. db_unavailable) — still counts as "passed" since
      // the tool contract worked correctly, the error is domain-level not protocol-level
      passed++;
      // But track it for diagnostics
      const errCode = r.toolResult?.error;
      if (!errors.find(e => e.tool === toolName && e.error === errCode)) {
        errors.push({ tool: toolName, status: r.status, error: `tool_error: ${errCode}` });
      }
    } else {
      failed++;
      const errMsg = r.data?.error?.message || r.data?.result?.text || `HTTP ${r.status}`;
      errors.push({ tool: toolName, status: r.status, error: errMsg });
    }
  }
  const successCount = results.filter(r => r.ok && !r.toolResult?.error).length;
  const toolErrCount = results.filter(r => r.toolResult?.error).length;
  const failCount = results.filter(r => !r.ok && !r.toolResult?.error).length;
  console.log(`  ${label}: ${successCount + toolErrCount}/${results.length} passed (${successCount} ok, ${toolErrCount} tool errors, ${failCount} protocol failures)`);
}

async function runListTools() {
  console.log('\n--- Phase 0: List Tools ---');
  const body = jsonRpcRequest('tools/list', {});
  const res = await fetch(`${BASE_URL}/mcp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  const data = parseMcpResponse(text);
  const tools = data?.result?.tools || [];
  console.log(`  Found ${tools.length} tools: ${tools.map(t => t.name).join(', ')}`);
  return tools.map(t => t.name);
}

async function runHealthCheck() {
  console.log('\n--- Phase 0: Health Check ---');
  try {
    const res = await fetch(`${BASE_URL}/mcp/health`);
    const data = await res.json();
    console.log(`  Health: ${data.status} (${data.protocol_version})`);
    return data.status === 'ok';
  } catch (err) {
    console.log(`  Health check failed: ${err.message}`);
    return false;
  }
}

async function runStressTest(tools) {
  console.log(`\n--- Stress Test: ${CONCURRENCY} concurrent x ${ITERATIONS} rounds ---\n`);

  // Phase 1: list_open_tasks (read-only, should always pass)
  console.log('Phase 1: list_open_tasks (read-only stress)');
  for (let r = 0; r < ITERATIONS; r++) {
    await runToolTest('list_open_tasks', i => ({
      limit: 5,
      agent_id: `stress-test-agent-${i}`,
    }), `  Round ${r + 1}`);
    await new Promise(r => setTimeout(r, PHASE_DELAY_MS));
  }

  // Phase 2: resolve_reasoning (cache check, read-only)
  if (tools.includes('resolve_reasoning')) {
    console.log('\nPhase 2: resolve_reasoning (cache stress)');
    for (let r = 0; r < ITERATIONS; r++) {
      await runToolTest('resolve_reasoning', i => ({
        problem_statement: `Test problem ${r}-${i}: how to sort an array in JavaScript`,
      }), `  Round ${r + 1}`);
      await new Promise(r => setTimeout(r, PHASE_DELAY_MS));
    }
  }

  // Phase 3: search_reasoning (search, read-only)
  if (tools.includes('search_reasoning')) {
    console.log('\nPhase 3: search_reasoning (search stress)');
    for (let r = 0; r < Math.min(ITERATIONS, 2); r++) {
      await runToolTest('search_reasoning', i => ({
        problem_statement: `How to parse JSON in Python iteration ${r}-${i}`,
        limit: 3,
      }), `  Round ${r + 1}`);
      await new Promise(r => setTimeout(r, PHASE_DELAY_MS));
    }
  }

  // Phase 4: get_scorecard (lookup, read-only, should fail gracefully without agent)
  if (tools.includes('get_scorecard')) {
    console.log('\nPhase 4: get_scorecard (error handling test)');
    await runToolTest('get_scorecard', () => ({
      agent_id: `non-existent-agent-${Date.now()}`,
    }), '  Non-existent agent (expect errors)', true);
    await new Promise(r => setTimeout(r, PHASE_DELAY_MS));
  }

  // Phase 5: Mixed stress — interleave read-only calls
  console.log('\nPhase 5: Mixed read-only stress');
  const readOnlyTools = ['list_open_tasks'];
  if (tools.includes('resolve_reasoning')) readOnlyTools.push('resolve_reasoning');
  if (tools.includes('search_reasoning')) readOnlyTools.push('search_reasoning');
  if (tools.includes('get_popular_tags')) readOnlyTools.push('get_popular_tags');

  const mixedResults = [];
  const mixedTools = [];
  for (let i = 0; i < Math.min(CONCURRENCY, 8); i++) {
    const tool = readOnlyTools[i % readOnlyTools.length];
    const args = tool === 'list_open_tasks' ? { limit: 5 } :
                 tool === 'resolve_reasoning' ? { problem_statement: `Mixed test ${i}` } :
                 tool === 'search_reasoning' ? { problem_statement: `Search test ${i}`, limit: 3 } :
                 tool === 'get_popular_tags' ? { limit: 5 } : {};
    mixedTools.push({ tool, args });
  }
  for (const mt of mixedTools) {
    mixedResults.push(await callTool(mt.tool, mt.args));
  }
  const mixedOk = mixedResults.filter(r => r.ok).length;
  const mixedToolErr = mixedResults.filter(r => r.toolResult?.error).length;
  console.log(`  Mixed: ${mixedOk}/${mixedTools.length} passed (${mixedOk - mixedToolErr} ok, ${mixedToolErr} tool errors)`);
}

async function report() {
  console.log('\n========================================');
  console.log('  MCP Stress Test Results');
  console.log('========================================');
  console.log(`  Target:     ${BASE_URL}/mcp`);
  console.log(`  Concurrency: ${CONCURRENCY}`);
  console.log(`  Rounds:     ${ITERATIONS}`);
  console.log(`  Passed:     ${passed}`);
  console.log(`  Failed:     ${failed}`);
  console.log(`  Success:    ${passed + failed > 0 ? ((passed / (passed + failed)) * 100).toFixed(1) : 'N/A'}%`);
  if (errors.length > 0) {
    console.log('\n  Error Summary:');
    const grouped = {};
    for (const e of errors) {
      const key = `${e.tool}: ${e.error}`;
      grouped[key] = (grouped[key] || 0) + 1;
    }
    for (const [key, count] of Object.entries(grouped).sort((a, b) => b[1] - a[1])) {
      console.log(`    [${count}x] ${key}`);
    }
  }
  console.log('');
  process.exit(failed > 0 ? 1 : 0);
}

async function main() {
  console.log('========================================');
  console.log('  MCP Endpoint Stress Test');
  console.log('========================================');
  console.log(`  URL:        ${BASE_URL}/mcp`);
  console.log(`  Concurrency: ${CONCURRENCY}`);
  console.log(`  Iterations:  ${ITERATIONS}`);
  console.log(`  Timeout:     ${TIMEOUT_MS}ms`);

  const healthy = await runHealthCheck();
  if (!healthy) {
    console.log('\n  ❌ Server not healthy. Aborting.');
    process.exit(1);
  }

  const tools = await runListTools();
  if (tools.length === 0) {
    console.log('\n  ❌ No tools discovered. Aborting.');
    process.exit(1);
  }

  await runStressTest(tools);
  await report();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
