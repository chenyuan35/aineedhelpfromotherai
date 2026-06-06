// lib/auto-failure-recorder.test.js
const fs = require('fs');
const path = require('path');

const testStatePath = path.join(__dirname, '..', 'data', 'drift-state-test.json');

function createTestModule(moduleName) {
  const moduleSource = fs.readFileSync(path.join(__dirname, moduleName + '.js'), 'utf8');
  let testSource = moduleSource.replace(
    "const STATE_PATH = path.join(__dirname, '..', 'data', 'drift-state.json');",
    `const STATE_PATH = '${testStatePath.replace(/\\/g, '\\\\')}';`
  );
  // Also replace memory-api require to use mock
  testSource = testSource.replace(
    "const { searchMemory } = require('./memory-api');",
    "const { searchMemory } = { searchMemory: () => ({ failures: [], verified_fixes: [], warnings: [], total_fixes: 0, total_failures: 0 }) };"
  );
  testSource = testSource.replace(
    "let memoryApi = null;",
    "let memoryApi = { searchMemory: () => ({ failures: [], verified_fixes: [], warnings: [], total_fixes: 0, total_failures: 0 }) };"
  );
  testSource = testSource.replace(
    "try { memoryApi = require('./memory-api'); } catch {}",
    ""
  );
  testSource = testSource.replace(
    "const { searchMemory } = memoryApi || { searchMemory: () => ({ failures: [] }) };",
    "const { searchMemory } = { searchMemory: () => ({ failures: [], verified_fixes: [], warnings: [], total_fixes: 0, total_failures: 0 }) };"
  );
  // Replace drift-state require
  testSource = testSource.replace(
    "const { getAgentState, loadState, saveState } = require('./drift-state');",
    "const { getAgentState, loadState, saveState } = require('./drift-state-test-temp');"
  );
  testSource = testSource.replace(
    "const { saveReasoning } = require('./reasoning-storage');",
    "const { saveReasoning } = { saveReasoning: () => {} };"
  );
  const tempPath = path.join(__dirname, moduleName + '-test-temp.js');
  fs.writeFileSync(tempPath, testSource);
  return require(tempPath);
}

const driftStateTest = createTestModule('drift-state');
const autoFailureTest = createTestModule('auto-failure-recorder');

const { proposeFailure, confirmFailure, rejectFailure, getFailureProposal } = autoFailureTest;
const { addCall, getAgentState } = driftStateTest;

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
  if (fs.existsSync(testStatePath)) fs.unlinkSync(testStatePath);
  ['drift-state-test-temp.js', 'auto-failure-recorder-test-temp.js'].forEach(f => {
    const p = path.join(__dirname, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });
}

console.log('\n=== auto-failure-recorder tests ===\n');

cleanup();

// Test: Propose failure on first occurrence
console.log('\nTest: Propose failure on first occurrence');
const callData1 = {
  tool_name: 'bash',
  agent_id: 'fail-agent-1',
  success: false,
  error: 'timeout after 30000ms',
  duration_ms: 30000,
  args: { command: 'docker build .' },
  timestamp: new Date().toISOString(),
};

const proposal1 = proposeFailure(callData1);
assert(proposal1.proposed === true, 'proposed true');
assert(proposal1.failure_info.tool === 'bash', 'tool');
assert(proposal1.failure_info.error === 'timeout after 30000ms', 'error');
assert(proposal1.proposal_id, 'has proposal_id');

// Check proposal stored in agent state
const agentState1 = getAgentState('fail-agent-1');
assert(agentState1.failure_proposal, 'proposal stored in state');
assertEqual(agentState1.failure_proposal.proposal_id, proposal1.proposal_id, 'proposal_id matches');

// Test: Confirm failure writes to reasoning_objects (simulated)
console.log('\nTest: Confirm failure');
const confirmResult = confirmFailure('fail-agent-1', proposal1.proposal_id);
assert(confirmResult.confirmed === true, 'confirmed true');
assert(confirmResult.reasoning_id, 'has reasoning_id');
assertEqual(confirmResult.proposal_id, proposal1.proposal_id, 'proposal_id matches');

// Test: Reject failure
console.log('\nTest: Reject failure');
cleanup();
const callData2 = {
  tool_name: 'bash',
  agent_id: 'fail-agent-2',
  success: false,
  error: 'permission denied',
  duration_ms: 5000,
  args: { command: 'npm install' },
  timestamp: new Date().toISOString(),
};
const proposal2 = proposeFailure(callData2);
const rejectResult = rejectFailure('fail-agent-2', proposal2.proposal_id);
assert(rejectResult.rejected === true, 'rejected true');
assertEqual(rejectResult.proposal_id, proposal2.proposal_id, 'proposal_id matches');

// Check proposal removed
const agentState2 = getAgentState('fail-agent-2');
assert(!agentState2.failure_proposal, 'proposal removed after reject');

// Test: Second same failure auto-merges
console.log('\nTest: Second same failure auto-merges');
cleanup();
const callData3 = {
  tool_name: 'bash',
  agent_id: 'fail-agent-3',
  success: false,
  error: 'ECONNRESET',
  duration_ms: 5000,
  args: { command: 'curl http://api' },
  timestamp: new Date().toISOString(),
};
proposeFailure(callData3);
// Same error, different args (same tool, similar error)
const callData3b = {
  tool_name: 'bash',
  agent_id: 'fail-agent-3',
  success: false,
  error: 'ECONNRESET',
  duration_ms: 5000,
  args: { command: 'curl http://api v2' },
  timestamp: new Date().toISOString(),
};
const proposal3b = proposeFailure(callData3b);
assert(proposal3b.auto_merged === true, 'auto_merged true');
assertEqual(proposal3b.failure_count, 2, 'failure_count 2');

// Test: Third same failure upgrades tier
console.log('\nTest: Third same failure upgrades tier');
const callData3c = {
  tool_name: 'bash',
  agent_id: 'fail-agent-3',
  success: false,
  error: 'ECONNRESET',
  duration_ms: 5000,
  args: { command: 'curl http://api v3' },
  timestamp: new Date().toISOString(),
};
const proposal3c = proposeFailure(callData3c);
assert(proposal3c.tier_upgraded === true, 'tier_upgraded true');
assertEqual(proposal3c.verification_tier, 'replay_confirmed', 'tier replay_confirmed');

// Test: Get failure proposal
console.log('\nTest: Get failure proposal');
cleanup();
const callData4 = {
  tool_name: 'bash',
  agent_id: 'fail-agent-4',
  success: false,
  error: 'ENOENT',
  duration_ms: 1000,
  args: { command: 'ls /nonexistent' },
  timestamp: new Date().toISOString(),
};
const proposal4 = proposeFailure(callData4);
const retrieved = getFailureProposal('fail-agent-4');
assert(retrieved, 'retrieved proposal');
assertEqual(retrieved.proposal_id, proposal4.proposal_id, 'proposal_id matches');

// Test: No proposal for success
console.log('\nTest: No proposal for success');
cleanup();
const callData5 = {
  tool_name: 'bash',
  agent_id: 'success-agent',
  success: true,
  error: null,
  duration_ms: 100,
  args: { command: 'echo hello' },
  timestamp: new Date().toISOString(),
};
const proposal5 = proposeFailure(callData5);
assert(proposal5.proposed === false, 'not proposed for success');
assert(!proposal5.proposal_id, 'no proposal_id');

cleanup();

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);