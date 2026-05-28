// experimental/lib/execution-log.js — READ-ONLY wrapper for runtime execution-log
// Experimental modules MUST use this instead of requiring lib/execution-log directly.
// Only exposes read/query methods. Append is blocked by write-authority in the real log.

const runtimeLog = require('../../lib/execution-log');

module.exports = {
  query: runtimeLog.query,
  getRun: runtimeLog.getRun,
  getRunIds: runtimeLog.getRunIds,
  getEventTypes: runtimeLog.getEventTypes,
  getStats: runtimeLog.getStats,
  compact: runtimeLog.compact,
  LOG_PATH: runtimeLog.LOG_PATH,

  append: function() {
    const err = new Error('WRITE_AUTHORITY_VIOLATION: experimental module cannot append to runtime execution-log. Use experimental/data/experimental-log.jsonl instead.');
    err.code = 'WRITE_AUTHORITY_VIOLATION';
    console.error('[experimental-execution-log] BLOCKED: %s', err.message);
    throw err;
  },
};
