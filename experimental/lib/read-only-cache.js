// experimental/lib/read-only-cache.js — Read-only view of runtime resolve-cache
// Experimental modules MUST use this instead of requiring resolve-cache directly.
// Only exposes read operations. Write attempts throw WRITE_AUTHORITY_VIOLATION.

const resolveCache = require('../../lib/resolve-cache');

function assertReadOnly(name) {
  const err = new Error('WRITE_AUTHORITY_VIOLATION: experimental module attempted "' + name + '" which is a write operation. Use the authorized runtime write path instead.');
  err.code = 'WRITE_AUTHORITY_VIOLATION';
  console.error('[read-only-cache] BLOCKED: %s', err.message);
  throw err;
}

module.exports = {
  getHint: resolveCache.getHint,
  getAllHints: resolveCache.getAllHints,
  getActiveHints: resolveCache.getActiveHints,
  getHintStatus: resolveCache.getHintStatus,
  getMemoryHealth: resolveCache.getMemoryHealth,
  getAgentMemoryLeaderboard: resolveCache.getAgentMemoryLeaderboard,
  getResolveHintsForTasks: resolveCache.getResolveHintsForTasks,
  buildResolvePrompt: resolveCache.buildResolvePrompt,
  load: resolveCache.load,
  MIN_SCORE: resolveCache.MIN_SCORE,
  HINT_STATUS: resolveCache.HINT_STATUS,

  setHint: function() { assertReadOnly('setHint'); },
  clearTask: function() { assertReadOnly('clearTask'); },
  recordOutcome: function() { assertReadOnly('recordOutcome'); },
};
