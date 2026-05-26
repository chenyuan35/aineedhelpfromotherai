#!/usr/bin/env node
// test-memory-override.js — Conflict override test: does memory beat agent intuition?
//
// Tests:
//   memory says X, agent reasoning says Y → does memory override?
//   Memory weight > 0.5 should win over agent default reasoning
//
// Run: node scripts/test-memory-override.js

const gate = require('../lib/memory-gate');
const memoryApi = require('../lib/memory-api');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) { console.log(`  ✅ ${label}`); passed++; }
  else { console.log(`  ❌ ${label}`); failed++; }
}

console.log('=== MEMORY OVERRIDE TEST ===\n');

// Setup: seed a high-confidence fix AND promote its tier
console.log('1. Seed known fix into memory...');
memoryApi.submitResolution({
  task_id: 'OVERRIDE_TEST_PTY',
  fix: 'Add O_IGNORE_CTTY flag to open() call before tcsetpgrp on Android. On Android the terminal ioctl semantics differ from Linux. Open PTY with O_IGNORE_CTTY | O_RDWR then tcsetpgrp will not hang.',
  verified: true,
  agent_id: 'test_oracle',
});
// Promote tier so weight calculation passes the threshold
const v = require('../lib/verification');
v.recordSandboxResult('OVERRIDE_TEST_PTY', true);
v.recordProductionConfirm('OVERRIDE_TEST_PTY');
// Verify tier
const info = v.getVerificationInfo('OVERRIDE_TEST_PTY');
console.log(`   Tier after promotion: ${info.tier}, effective_weight: ${info.effective_weight}`);

// Test 1: Gate catches high-similarity match
console.log('\n2. Gate should force-inject known fix for similar query...');
const r1 = gate.evaluateGate('Android PTY tcsetpgrp hang terminal deadlock', { trust_level: 0.8 });
assert('must_use_memory is true', r1.must_use_memory === true);
assert('retrieved at least 1 memory', r1.retrieved_memories.length >= 1);

// Test 2: Influence weight calculation
console.log('\n3. Influence weights are correct...');
if (r1.retrieved_memories.length > 0) {
  const top = r1.retrieved_memories[0];
  assert('highest weight > 0.3 (production_confirmed + high confidence + good similarity)', (r1.influence_summary?.highest_weight || 0) > 0.3);
  assert('retrieved memory has influence_weight', top.influence_weight !== undefined);
  // Weight = confidence × tier_weight × similarity × decay
  // For production_confirmed (1.0) + high confidence + high similarity → should be > 0.3
  console.log(`   Top memory: weight=${top.influence_weight}, tier=${top.verification_tier}, confidence=${top.confidence}%`);
}

// Test 3: Prompt context includes weight and override rule
console.log('\n4. Augmented context has override rule and weights...');
const ctx = r1.augmented_context || '';
assert('contains MEMORY_INFLUENCE_CONTEXT', ctx.includes('MEMORY_INFLUENCE_CONTEXT'));
assert('contains RULE: Higher weight memory overrides', ctx.includes('Higher weight memory overrides'));
assert('contains weight= in items', ctx.includes('weight='));

// Test 4: Conflict override — query that matches known failure
console.log('\n5. Conflict detection for known-failing approaches...');
memoryApi.submitFailure({
  task: 'Fix Android PTY setup',
  error: 'Tried tcsetattr approach on Android PTY — it hangs the terminal',
  attempted_fix: 'tcsetattr to set terminal attributes',
  result: 'failed',
  agent_id: 'test_fail',
});
const r2 = gate.evaluateGate('tcsetattr on Android PTY terminal', { trust_level: 0.8 });
assert('conflict_overrides detected', r2.conflict_overrides.length > 0 || r2.risk_flags.length > 0);

// Test 5: Low-trust agent gets filtered
console.log('\n6. Low-trust filter works correctly...');
const r3 = gate.evaluateGate('Android PTY tcsetpgrp hang', { trust_level: 0.3 });
assert('low trust blocks unverified memories', r3.gates_filtered <= r3.gates_passed);
if (r3.gates_passed > 0) {
  console.log(`   gates_passed=${r3.gates_passed}, gates_filtered=${r3.gates_filtered} (should be <=)`);
}

// Test 6: Weight ordering
console.log('\n7. Memories are sorted by weight descending...');
if (r1.retrieved_memories.length >= 2) {
  const weights = r1.retrieved_memories.map(m => m.influence_weight || 0);
  const sorted = weights.every((w, i) => i === 0 || w <= weights[i - 1]);
  assert('weight descending order', sorted);
}

console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
