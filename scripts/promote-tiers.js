// scripts/promote-tiers.js — Bulk promote seed data hints based on usage history
// Maps resolve-cache success_count/failure_count to verification tiers
// Run: node scripts/promote-tiers.js

const rc = require('../lib/resolve-cache');
const v = require('../lib/verification');

const all = rc.getAllHints();
let promoted = { replay: 0, sandbox: 0, production: 0, unchanged: 0, errors: 0 };

for (const [id, hint] of Object.entries(all)) {
  try {
    const isFix = hint.hit === true || hint.task_type === 'verified_resolution';
    const isFailure = hint.task_type === 'failure_report' || hint.metadata?.result === 'failed';
    if (!isFix && !isFailure) continue;

    const existing = v.getVerificationInfo(id);
    let tierBefore = existing.tier;

    // Replay promotion: success_count >= 1 = survived at least one use
    if ((hint.success_count || 0) >= 1) {
      v.recordReplayConfirm(id);
      v.recordReplayConfirm(id); // second call → promotes to replay_confirmed
    }

    // Sandbox promotion: success_count >= 1 AND failure_count === 0 (seed data ground truth)
    if ((hint.success_count || 0) >= 1 && (hint.failure_count || 0) === 0) {
      v.recordSandboxResult(id, true);
    }

    // Production confirmation: success_count >= 3
    if ((hint.success_count || 0) >= 3) {
      v.recordProductionConfirm(id);
      v.recordProductionConfirm(id);
      v.recordProductionConfirm(id); // third call → promotes to production_confirmed
    }

    const after = v.getVerificationInfo(id);
    if (tierBefore !== after.tier) {
      if (after.tier === 'replay_confirmed') promoted.replay++;
      else if (after.tier === 'sandbox_passed') promoted.sandbox++;
      else if (after.tier === 'production_confirmed') promoted.production++;
    } else {
      promoted.unchanged++;
    }
  } catch(e) {
    console.error(`Error on ${id}:`, e.message);
    promoted.errors++;
  }
}

const stats = v.getStats();
console.log('=== Tier Promotion Complete ===');
console.log(JSON.stringify(promoted, null, 2));
console.log(`\nTotal tracked: ${stats.total_tracked}`);
for (const t of v.TIER_ORDER) {
  const count = stats[`${t}_count`] || 0;
  const weight = stats[`${t}_weight`] || '0.0';
  console.log(`  ${t}: ${count} (weight sum: ${weight})`);
}
console.log(`Quarantine candidates: ${stats.quarantine_candidates}`);
console.log(`Avg replay count: ${stats.avg_replay_count}`);
console.log(`Avg sandbox pass rate: ${stats.avg_sandbox_pass_rate}%`);
