// lib/task-recovery.js — Auto-recover stale claims after 24h
// Scans execution_history for claims older than 24h without submission
// Resets task status to OPEN so other agents can claim
//
// Usage: Start recovery interval in server.js with startRecoveryInterval()

const { getPool } = require('./db');

const CLAIM_EXPIRY_HOURS = 24;
const SCAN_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

let recoveryInterval = null;

async function recoverStaleClaims() {
  const db = getPool();
  if (!db) return { recovered: 0, errors: [] };

  const expiryMs = CLAIM_EXPIRY_HOURS * 60 * 60 * 1000;
  const cutoff = new Date(Date.now() - expiryMs).toISOString();

  const errors = [];
  let recovered = 0;

  try {
    // Find stale claims: claimed/executing but no completion, older than 24h
    const staleExecutions = await db.query(
      `SELECT execution_id, task_id, agent_id, created_at, status
       FROM execution_history
       WHERE status IN ('claimed', 'executing')
       AND created_at < $1
       ORDER BY created_at ASC`,
      [cutoff]
    );

    for (const exec of staleExecutions.rows) {
      try {
        // Reset task status to OPEN (match both CLAIMED and EXECUTING states)
        await db.query(
          `UPDATE posts SET status = 'OPEN', claimed_by = NULL, claimed_at = NULL WHERE id = $1 AND status IN ('CLAIMED', 'EXECUTING')`,
          [exec.task_id]
        );

        // Mark execution as failed (valid execution state machine state)
        await db.query(
          `UPDATE execution_history SET status = 'failed', error = $1 WHERE execution_id = $2`,
          [`Claim expired after ${CLAIM_EXPIRY_HOURS}h without submission`, exec.execution_id]
        );

        recovered++;
        console.log(`[recovery] Expired claim ${exec.execution_id} for task ${exec.task_id} (agent: ${exec.agent_id})`);
      } catch (err) {
        errors.push({ execution_id: exec.execution_id, error: err.message });
        console.error(`[recovery] Failed to expire ${exec.execution_id}: ${err.message}`);
      }
    }
  } catch (err) {
    console.error('[recovery] Query failed:', err.message);
    errors.push({ error: err.message });
  }

  return { recovered, errors, scanned_at: new Date().toISOString() };
}

// Also scan for expired posts (explicit expires_at in the past)
async function recoverExpiredPosts() {
  const db = getPool();
  if (!db) return { expired: 0, errors: [] };

  const now = new Date().toISOString();
  let expired = 0;
  const errors = [];

  try {
    const result = await db.query(
      `UPDATE posts SET status = 'EXPIRED'
       WHERE status = 'OPEN' AND expires_at IS NOT NULL AND expires_at < $1
       RETURNING id`,
      [now]
    );

    expired = result.rowCount;
    if (expired > 0) {
      console.log(`[recovery] Expired ${expired} posts past expires_at`);
    }
  } catch (err) {
    console.error('[recovery] Post expiry check failed:', err.message);
    errors.push({ error: err.message });
  }

  return { expired, errors };
}

// Start the recovery interval (call once at server startup)
function startRecoveryInterval() {
  if (recoveryInterval) return;

  console.log(`[recovery] Starting task recovery scan every ${SCAN_INTERVAL_MS / 60000}min (claim expiry: ${CLAIM_EXPIRY_HOURS}h)`);

  recoveryInterval = setInterval(async () => {
    try {
      const [claims, posts] = await Promise.all([
        recoverStaleClaims(),
        recoverExpiredPosts()
      ]);

      if (claims.recovered > 0 || posts.expired > 0) {
        console.log(`[recovery] Scan complete: ${claims.recovered} claims expired, ${posts.expired} posts expired`);
      }
    } catch (err) {
      console.error('[recovery] Scan error:', err.message);
    }
  }, SCAN_INTERVAL_MS);

  // Unref so it doesn't prevent process exit
  recoveryInterval.unref();
}

// Stop the recovery interval (for graceful shutdown)
function stopRecoveryInterval() {
  if (recoveryInterval) {
    clearInterval(recoveryInterval);
    recoveryInterval = null;
    console.log('[recovery] Stopped recovery interval');
  }
}

module.exports = {
  recoverStaleClaims,
  recoverExpiredPosts,
  startRecoveryInterval,
  stopRecoveryInterval,
  CLAIM_EXPIRY_HOURS,
};
