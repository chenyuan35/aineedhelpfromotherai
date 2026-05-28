// experimental/lib/experimental-log.js — Experimental-only log (writes to experimental/data/)
// Experimental modules that need to log events should use this instead of runtime execution-log.
// This log is isolated from runtime state and not replayed in production.

const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '..', 'data', 'experimental-log.jsonl');

function append(event) {
  try {
    const dir = path.dirname(LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(LOG_PATH, JSON.stringify(event) + '\n', 'utf8');
  } catch {}
}

function makeEvent(runId, eventType, data = {}) {
  return {
    run_id: runId,
    timestamp: new Date().toISOString(),
    event_type: eventType,
    ...data,
    _experimental: true,
  };
}

module.exports = { append, makeEvent, LOG_PATH };
