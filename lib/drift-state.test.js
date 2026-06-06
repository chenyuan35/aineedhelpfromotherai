// lib/drift-state.test.js — Plain Node.js tests using actual module with test path
const fs = require('fs');
const path = require('path');

const originalStatePath = path.join(__dirname, '..', 'data', 'drift-state.json');
const testStatePath = path.join(__dirname, '..', 'data', 'drift-state-test.json');

// Monkey-patch the module's STATE_PATH by creating a wrapper
function createTestModule() {
  // Read the actual module source
  const moduleSource = fs.readFileSync(path.join(__dirname, 'drift-state.js'), 'utf8');
  // Replace the STATE_PATH constant
  const testSource = moduleSource.replace(
    "const STATE_PATH = path.join(__dirname, '..', 'data', 'drift-state.json');",
    `const STATE_PATH = '${testStatePath.replace(/\\/g, '\\\\')}';`
  );
  // Write to a temp file and require it
  const tempPath = path.join(__dirname, 'drift-state-test-temp.js');
  fs.writeFileSync(tempPath, testSource);
  return require(tempPath);
}

const { loadState, saveState, getAgentState, updateAgentState, addCall, getReport, parseTimeWindow, getMostFailedTool, getMostCommonError, generateRecommendations } = createTestModule();

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ ${message}`);
    failed++;
  }
}

function assertEqual(actual, expected, message) {
  const match = JSON.stringify(actual) === JSON.stringify(expected);
  assert(match, `${message} — expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(actual)}`);
}

function cleanup() {
  [testStatePath, originalStatePath].forEach(p => {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });
  const tempPath = path.join(__dirname, 'drift-state-test-temp.js');
  if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
}

console.log('\n=== drift-state tests ===\n');

cleanup();

// Test 1: loadState returns default state when file doesn't exist
console.log('\nTest: loadState default');
const state1 = loadState();
assertEqual(state1, { agents: {}, updated_at: state1.updated_at }, 'default state structure');

// Test 2: saveState writes file
console.log('\nTest: saveState');
const state2 = { agents: { 'test-agent': { drift_score: 0.5 } }, updated_at: '2026-01-01' };
saveState(state2);
assert(fs.existsSync(testStatePath), 'file created');
const loaded = JSON.parse(fs.readFileSync(testStatePath, 'utf8'));
assertEqual(loaded.agents['test-agent'].drift_score, 0.5, 'persisted drift_score');

// Test 3: loadState returns parsed state when file exists
console.log('\nTest: loadState from file');
const state3 = loadState();
assertEqual(state3.agents['test-agent'].drift_score, 0.5, 'parsed state');

// Test 4: loadState handles corrupt file gracefully
console.log('\nTest: loadState corrupt file');
fs.writeFileSync(testStatePath, 'invalid json');
const originalWarn = console.warn;
let warnCalled = false;
console.warn = () => { warnCalled = true; };
const state4 = loadState();
console.warn = originalWarn;
assert(warnCalled, 'warning logged');
assertEqual(state4, { agents: {}, updated_at: state4.updated_at }, 'fallback to default');

// Test 5: getAgentState creates default agent state if not exists
console.log('\nTest: getAgentState creates default');
cleanup();
const agentState = getAgentState('new-agent');
assertEqual(agentState.recent_calls, [], 'empty recent_calls');
assertEqual(agentState.drift_score, 0, 'drift_score 0');
assertEqual(agentState.active_drifts, [], 'empty active_drifts');
assertEqual(agentState.stats.total_calls, 0, 'stats total_calls 0');

// Test 6: updateAgentState updates and persists
console.log('\nTest: updateAgentState');
cleanup();
const updated = updateAgentState('test-agent', { drift_score: 0.7 });
assertEqual(updated.drift_score, 0.7, 'updated drift_score');
const persisted = JSON.parse(fs.readFileSync(testStatePath, 'utf8'));
assertEqual(persisted.agents['test-agent'].drift_score, 0.7, 'persisted drift_score');

// Test 7: addCall maintains ring buffer max 20
console.log('\nTest: addCall ring buffer');
cleanup();
for (let i = 0; i < 25; i++) {
  addCall('buffer-agent', { tool: 'bash', args_hash: `hash${i}`, success: true, ts: new Date().toISOString() });
}
const bufferAgent = getAgentState('buffer-agent');
assert(bufferAgent.recent_calls.length === 20, 'ring buffer max 20');
assert(bufferAgent.recent_calls[0].args_hash === 'hash5', 'keeps last 20');

// Test 8: addCall updates stats
console.log('\nTest: addCall stats');
cleanup();
addCall('stats-agent', { tool: 'bash', success: false, error: 'timeout', ts: new Date().toISOString() });
addCall('stats-agent', { tool: 'bash', success: true, ts: new Date().toISOString() });
const statsAgent = getAgentState('stats-agent');
assertEqual(statsAgent.stats.total_calls, 2, 'total_calls');
assertEqual(statsAgent.stats.failed_calls, 1, 'failed_calls');

// Test 9: getReport returns correct structure
console.log('\nTest: getReport structure');
cleanup();
const now = Date.now();
addCall('report-agent', { tool: 'bash', success: false, error: 'timeout', ts: new Date(now - 1000).toISOString() });
addCall('report-agent', { tool: 'bash', success: true, ts: new Date(now - 2000).toISOString() });

const report = getReport('report-agent', '1h');
assert(report.agent_id === 'report-agent', 'agent_id');
assert(report.time_window === '1h', 'time_window');
assert(report.summary.total_calls === 2, 'total_calls');
assert(report.summary.failed_calls === 1, 'failed_calls');
assert(report.summary.failure_rate === 0.5, 'failure_rate');
assert(report.patterns !== undefined, 'patterns');
assert(report.recommendations !== undefined, 'recommendations');

// Test 10: getReport filters by time window
console.log('\nTest: getReport time window filter');
cleanup();
const now2 = Date.now();
addCall('window-agent', { tool: 'bash', success: false, error: 'old', ts: new Date(now2 - 2 * 3600 * 1000).toISOString() });
addCall('window-agent', { tool: 'bash', success: false, error: 'new', ts: new Date(now2 - 1000).toISOString() });

const report2 = getReport('window-agent', '1h');
assertEqual(report2.summary.total_calls, 1, 'filtered to 1h');
assertEqual(report2.summary.failed_calls, 1, 'failed in window');

// Test 11: parseTimeWindow
console.log('\nTest: parseTimeWindow');
assertEqual(parseTimeWindow('1h'), 1, '1h');
assertEqual(parseTimeWindow('24h'), 24, '24h default');
assertEqual(parseTimeWindow('7d'), 168, '7d');
assertEqual(parseTimeWindow('unknown'), 24, 'unknown defaults to 24h');

// Test 12: getMostFailedTool
console.log('\nTest: getMostFailedTool');
assertEqual(getMostFailedTool([{tool:'bash',success:false},{tool:'bash',success:false},{tool:'webfetch',success:false}]), 'bash', 'bash most failed');
assertEqual(getMostFailedTool([]), 'none', 'empty returns none');

// Test 13: getMostCommonError
console.log('\nTest: getMostCommonError');
assertEqual(getMostCommonError([{error:'timeout'},{error:'timeout'},{error:'not found'}]), 'timeout', 'timeout most common');
assertEqual(getMostCommonError([]), 'none', 'empty returns none');

// Test 14: generateRecommendations
console.log('\nTest: generateRecommendations');
const mockAgentState = { active_drifts: [{type:'retry_spiral'}] };
const mockFailedCalls = [{error:'e1'},{error:'e2'},{error:'e3'},{error:'e4'},{error:'e5'},{error:'e6'}];
const recs = generateRecommendations(mockAgentState, mockFailedCalls);
assert(recs.includes('High failure rate. Consider checking environment before executing.'), 'high failure rate rec');
assert(recs.includes('Retry spiral detected. Run diagnostics before retrying.'), 'retry spiral rec');

// Test 15: addCall creates agent state if not exists
console.log('\nTest: addCall creates agent state');
cleanup();
addCall('new-agent-from-addcall', { tool: 'bash', success: true, ts: new Date().toISOString() });
const newAgent = getAgentState('new-agent-from-addcall');
assertEqual(newAgent.stats.total_calls, 1, 'total_calls 1');

// Cleanup
cleanup();

// Summary
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);