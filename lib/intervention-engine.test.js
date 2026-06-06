// lib/intervention-engine.test.js
const { generateIntervention, INTERVENTION_RULES } = require('./intervention-engine');

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

console.log('\n=== intervention-engine tests ===\n');

// Test Level 1: Warning
console.log('\nTest: Level 1 Warning');
const level1 = generateIntervention('retry_spiral', 0.3, { message: 'test' });
assert(level1.level === 1, 'level 1');
assert(level1.needs_confirmation !== true, 'no confirmation needed');
assert(level1.isError !== true, 'not an error');
assert(level1.content && level1.content._drift_warning, 'has warning');
assert(level1.content._drift_warning.level === 1, 'warning level 1');

// Test Level 2: Confirm
console.log('\nTest: Level 2 Confirm');
const level2 = generateIntervention('false_assumption_lock', 0.5, { message: 'test' });
assert(level2.level === 2, 'level 2');
assert(level2.needs_confirmation === true, 'needs confirmation');
assert(level2.isError !== true, 'not an error');
assert(level2.content._drift_warning.level === 2, 'warning level 2');
assert(level2.content._drift_warning.action_required, 'has action_required');

// Test Level 3: Block
console.log('\nTest: Level 3 Block');
const level3 = generateIntervention('verification_collapse', 0.8, { message: 'test' });
assert(level3.level === 3, 'level 3');
assert(level3.needs_confirmation !== true, 'no confirmation');
assert(level3.isError === true, 'is error');
assert(level3.content._drift_warning.level === 3, 'warning level 3');
assert(level3.content._drift_warning.alternatives, 'has alternatives');

// Test drift_score thresholds
console.log('\nTest: drift_score thresholds');
const t1 = generateIntervention('retry_spiral', 0.39, {}); // < 0.4 = level 1
assert(t1.level === 1, '0.39 -> level 1');

const t2 = generateIntervention('retry_spiral', 0.4, {}); // 0.4 = level 2
assert(t2.level === 2, '0.4 -> level 2');

const t3 = generateIntervention('retry_spiral', 0.69, {}); // < 0.7 = level 2
assert(t3.level === 2, '0.69 -> level 2');

const t4 = generateIntervention('retry_spiral', 0.7, {}); // >= 0.7 = level 3
assert(t4.level === 3, '0.7 -> level 3');

// Test escape routes
console.log('\nTest: escape routes');
const er = generateIntervention('retry_spiral', 0.5, {});
assert(er.content._drift_warning.escape_route, 'has escape route');
assert(er.content._drift_warning.escape_route.includes('diagnostic'), 'mentions diagnostic');

// Test unknown drift type defaults to level 1 (with low drift_score)
console.log('\nTest: unknown drift type');
const unknown = generateIntervention('unknown_type', 0.3, {});
assert(unknown.level === 1, 'unknown defaults to level 1 with low drift_score');

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);