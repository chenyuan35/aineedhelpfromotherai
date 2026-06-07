// scripts/test-trust-tiers.js — local trust-tier transition smoke test
// Uses a temp verification state file so real runtime state is not mutated.

const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aineedhelp-trust-'));
process.env.VERIFICATION_STATE_PATH = path.join(tmpDir, 'verification-state.json');

const writeAuth = require('../lib/write-authority');
const verification = require('../lib/verification');

verification.registerCapabilities(writeAuth.registerCapability);
writeAuth.lockRegistration();

const memoryId = 'TRUST_TEST_MEMORY';

verification.recordSandboxResult(memoryId, true);
let info = verification.getVerificationInfo(memoryId);
assert.strictEqual(info.tier, verification.TIERS.SANDBOX_PASSED);
assert.strictEqual(info.trust_tier, verification.TRUST_TIERS.VERIFIED);
assert.ok(info.audit.length >= 1, 'sandbox promotion should create a trust audit event');

verification.setTrustTier(memoryId, verification.TRUST_TIERS.DEPRECATED, {
  actor: 'test',
  detector: 'smoke-test',
  evidence_source: 'scripts/test-trust-tiers.js',
  reason: 'contradiction found in smoke test',
});
info = verification.getVerificationInfo(memoryId);
assert.strictEqual(info.trust_tier, verification.TRUST_TIERS.DEPRECATED);
assert.strictEqual(info.trust_weight, verification.TRUST_WEIGHT.deprecated);

const audit = verification.getTrustAudit(memoryId);
assert.ok(audit.some((event) => event.new_tier === verification.TRUST_TIERS.DEPRECATED));

fs.rmSync(tmpDir, { recursive: true, force: true });
console.log('trust-tier smoke test passed');
