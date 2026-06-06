// lib/drift-detector.test.js — Plain Node.js tests using actual module with test path
const fs = require('fs');
const path = require('path');

const testStatePath = path.join(__dirname, '..', 'data', 'drift-state-test.json');

// Create test module with test state path
function createTestModule(moduleName) {
  const moduleSource = fs.readFileSync(path.join(__dirname, moduleName + '.js'), 'utf8');
  const testSource = moduleSource.replace(
    "const STATE_PATH = path.join(__dirname, '..', 'data', 'drift-state.json');",
    `const STATE_PATH = '${testStatePath.replace(/\\/g, '\\\\')}';`
  );
  const tempPath = path.join(__dirname, moduleName + '-test-temp.js');
  fs.writeFileSync(tempPath, testSource);
  return require(tempPath);
}

// Create test modules
const driftStateTest = createTestModule('drift-state');
const driftDetectorTest = createTestModule('drift-detector');

// Link drift-detector to use drift-state's test module
driftDetectorTest.setStateModule(driftStateTest);

const { analyze, computeArgsHash, DRIFT_RULES } = driftDetectorTest;
const { addCall, getAgentState, loadState, saveState } = driftStateTest;

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
  ['drift-state-test-temp.js', 'drift-detector-test-temp.js'].forEach(f => {
    const p = path.join(__dirname, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });
}

console.log('\n=== drift-detector tests ===\n');

cleanup();

// Test computeArgsHash
console.log('\nTest: computeArgsHash');
const hash1 = computeArgsHash({ command: 'bash', arg: 'test' });
const hash2 = computeArgsHash({ arg: 'test', command: 'bash' });
assertEqual(hash1, hash2, 'hash is order-independent');
assert(hash1.length === 12, 'hash length 12');

// Compute the hash for the test args
const testArgs = { command: 'same command' };
const testArgsHash = computeArgsHash(testArgs);

// Test DR-001: Retry Spiral (different errors to avoid false_assumption_lock)
console.log('\nTest: DR-001 Retry Spiral');
cleanup();
// Use DIFFERENT errors for each past call, same args_hash for retry_spiral
const errors = ['ERROR_A', 'ERROR_B', 'ERROR_C'];
for (let i = 0; i < 3; i++) {
  addCall('spiral-agent', { 
    tool: 'bash', 
    args_hash: testArgsHash,  // Same args_hash for retry_spiral
    success: false, 
    error: errors[i],  // Different errors
    ts: new Date().toISOString() 
  });
}
// Current call has a new error
const currentError = 'CURRENT_ERROR_' + Date.now();
const result1 = analyze({
  tool_name: 'bash',
  agent_id: 'spiral-agent',
  success: false,
  error: currentError,
  duration_ms: 5000,
  args: testArgs,  // Same args
  timestamp: new Date().toISOString()
});
assert(result1.drift_detected === true, 'drift detected');
assert(result1.drift_type === 'retry_spiral', 'drift_type retry_spiral');
assert(result1.severity === 'medium', 'severity medium');

// Test DR-002: False Assumption Lock (same error, different args = different approaches)
console.log('\nTest: DR-002 False Assumption Lock');
cleanup();
const lockError = 'ECONNRESET';
for (let i = 0; i < 3; i++) {
  addCall('lock-agent', { 
    tool: 'bash', 
    args_hash: computeArgsHash({ command: 'curl http://api', attempt: i }),  // Different args each time
    success: false, 
    error: lockError, 
    ts: new Date().toISOString() 
  });
}
const result2 = analyze({
  tool_name: 'bash',
  agent_id: 'lock-agent',
  success: false,
  error: lockError,
  duration_ms: 5000,
  args: { command: 'curl http://api', attempt: 3 },  // 4th attempt
  timestamp: new Date().toISOString()
});
assert(result2.drift_detected === true, 'drift detected');
assert(result2.drift_type === 'false_assumption_lock', 'drift_type false_assumption_lock');
assert(result2.severity === 'high', 'severity high');

// Test DR-003: Verification Collapse
console.log('\nTest: DR-003 Verification Collapse');
cleanup();
addCall('verify-agent', { 
  tool: 'submit_result', 
  args_hash: 'submit1', 
  success: true, 
  ts: new Date().toISOString() 
});
const result3 = analyze({
  tool_name: 'submit_result',
  agent_id: 'verify-agent',
  success: true,
  duration_ms: 100,
  args: { result: 'done' },
  timestamp: new Date().toISOString()
});
assert(result3.drift_detected === true, 'drift detected');
assert(result3.drift_type === 'verification_collapse', 'drift_type verification_collapse');
assert(result3.severity === 'low', 'severity low');

// Test DR-004: Environment Blindness
console.log('\nTest: DR-004 Environment Blindness');
cleanup();
addCall('env-agent', { 
  tool: 'bash', 
  args_hash: 'docker1', 
  success: false, 
  error: 'permission denied', 
  ts: new Date().toISOString() 
});
const result4 = analyze({
  tool_name: 'bash',
  agent_id: 'env-agent',
  success: false,
  error: 'permission denied',
  duration_ms: 5000,
  args: { command: 'docker build .' },
  timestamp: new Date().toISOString()
});
assert(result4.drift_detected === true, 'drift detected');
assert(result4.drift_type === 'environment_blindness', 'drift_type environment_blindness');
assert(result4.severity === 'low', 'severity low');

// Test DR-005: Duration Anomaly
console.log('\nTest: DR-005 Duration Anomaly');
cleanup();
// Use different args_hash for each call to avoid retry_spiral
for (let i = 0; i < 10; i++) {
  addCall('duration-agent', { 
    tool: 'bash', 
    args_hash: computeArgsHash({ command: 'normal command', iteration: i }),
    success: true, 
    duration_ms: 100,
    ts: new Date().toISOString() 
  });
}
// Now a slow call with same tool but different args
const result5 = analyze({
  tool_name: 'bash',
  agent_id: 'duration-agent',
  success: true,
  duration_ms: 5000,
  args: { command: 'slow command' },
  timestamp: new Date().toISOString()
});
console.log('DR-005 result:', result5.drift_type, result5.severity);
assert(result5.drift_detected === true, 'drift detected');
assert(result5.drift_type === 'duration_anomaly', 'drift_type duration_anomaly');
assert(result5.severity === 'medium', 'severity medium');

// Test DR-006: Context Drift
console.log('\nTest: DR-006 Context Drift');
cleanup();
const tools = ['bash', 'webfetch', 'grep', 'read', 'edit', 'glob', 'task_tool'];
// Add 20 calls with 3 tools, all fast (no duration_anomaly)
for (let i = 0; i < 20; i++) {
  addCall('drift-agent', { 
    tool: tools[i % 3], // only 3 tools: bash, webfetch, grep
    args_hash: computeArgsHash({ tool: tools[i % 3], call: i }), 
    success: true, 
    duration_ms: 50,
    ts: new Date().toISOString() 
  });
}
// Now 10 calls with 3 NEW tools (read, edit, glob), all fast
for (let i = 0; i < 10; i++) {
  addCall('drift-agent', { 
    tool: tools[3 + (i % 3)], // read, edit, glob - 3 new tools
    args_hash: computeArgsHash({ tool: tools[3 + (i % 3)], call: i }), 
    success: true, 
    duration_ms: 50,
    ts: new Date().toISOString() 
  });
}
// Analyze with a 4th new tool (task_tool), fast duration
const result6 = analyze({
  tool_name: 'task_tool',
  agent_id: 'drift-agent',
  success: true,
  duration_ms: 50,  // Fast, no duration_anomaly
  args: {},
  timestamp: new Date().toISOString()
});
console.log('DR-006 result:', result6.drift_type, result6.severity);
assert(result6.drift_detected === true, 'drift detected');
assert(result6.drift_type === 'context_drift', 'drift_type context_drift');
assert(result6.severity === 'low', 'severity low');

// Test: No drift when conditions not met
console.log('\nTest: No drift when conditions not met');
cleanup();
addCall('clean-agent', { 
  tool: 'bash', 
  args_hash: 'hash1', 
  success: true, 
  ts: new Date().toISOString() 
});
const result7 = analyze({
  tool_name: 'bash',
  agent_id: 'clean-agent',
  success: true,
  duration_ms: 100,
  args: { command: 'echo hello' },
  timestamp: new Date().toISOString()
});
assert(result7.drift_detected === false, 'no drift detected');

// Test: New agent (no history) - no drift
console.log('\nTest: New agent no drift');
cleanup();
const result8 = analyze({
  tool_name: 'bash',
  agent_id: 'brand-new-agent-' + Date.now(),  // Unique agent ID
  success: false,
  error: 'timeout',
  duration_ms: 5000,
  args: { command: 'echo hello' },  // Non-fragile command
  timestamp: new Date().toISOString()
});
assert(result8.drift_detected === false, 'new agent no drift');

// Test: Verification call prevents verification_collapse
console.log('\nTest: check_failures prevents verification_collapse');
cleanup();
const verifyArgsHash = computeArgsHash({ approach_description: 'test approach' });
addCall('verify-agent2', { 
  tool: 'check_failures', 
  args_hash: verifyArgsHash,
  success: true, 
  ts: new Date().toISOString() 
});
const result9 = analyze({
  tool_name: 'submit_result',
  agent_id: 'verify-agent2',
  success: true,
  duration_ms: 100,
  args: { result: 'done' },
  timestamp: new Date().toISOString()
});
assert(result9.drift_detected === false, 'no drift when verification done');

cleanup();

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);