// lib/commit-log.js — Sequenced event commit log with reducers
// Single entry point for all runtime state mutations.
// Events are sequenced, persisted, and dispatched to subscribed reducers.
// This is the foundation for event sourcing: reducers build materialized views.

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const writeAuthority = require('./write-authority');
const writeQueue = require('./write-queue');

const LOG_PATH = path.join(__dirname, '..', 'data', 'commit-log.jsonl');
const HOT_BUFFER_MAX = 1000;

let seq = 0;
const hotBuffer = [];
const reducers = new Map(); // eventType → [reducerFn, ...]

let _flushedSeq = 0;

// Known event types. Unknown types are rejected (default: deny).
// This prevents typos and rogue event emission.
const KNOWN_EVENT_TYPES = new Set([
  'resolve_cache/set',
  'resolve_cache/clear',
  'resolve_cache/outcome',
  'resolve_cache/decay',
  'execution_log/append',
  'execution_log/compact',
  'verification/save',
  'elo/save',
  'memory_api/log',
  'fs_safe/write_json',
  'fs_safe/append_jsonl',
  'fs_safe/atomic_write',
]);

function ensureDir() {
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Load existing sequence from warm storage on boot
function init() {
  if (!fs.existsSync(LOG_PATH)) return;
  try {
    const lines = fs.readFileSync(LOG_PATH, 'utf8').split('\n').filter(Boolean);
    for (const line of lines) {
      const ev = JSON.parse(line);
      if (ev.seq > seq) seq = ev.seq;
    }
  } catch {}
  _flushedSeq = seq;
}

// Register a reducer for a specific event type.
// Reducer signature: (seqEvent) => void
function on(eventType, reducer) {
  if (!reducers.has(eventType)) reducers.set(eventType, []);
  reducers.get(eventType).push(reducer);
}

// Commit an event: sequence → persist → dispatch
// cap: write-authority capability token
// event: { type, source, payload }
// queueKey: optional write-queue key for same-queue ordering (enables Rule A:
//   commit flush happens before the caller's write on the same queue chain)
function commit(cap, event, queueKey) {
  writeAuthority.authorizeWrite(cap);

  // Policy: unknown event types are rejected (default deny).
  // This prevents typos and guards against unauthorized event emission.
  if (!KNOWN_EVENT_TYPES.has(event.type)) {
    const err = new Error('Unknown commit-log event type: "' + event.type + '". Known: ' + [...KNOWN_EVENT_TYPES].sort().join(', '));
    err.code = 'UNKNOWN_EVENT_TYPE';
    throw err;
  }

  const seqEvent = {
    version: 1,
    event_id: crypto.randomUUID(),
    seq: ++seq,
    ts: new Date().toISOString(),
    type: event.type,
    source: event.source || '',
    payload: event.payload || {},
  };

  // Hot buffer (memory)
  hotBuffer.push(seqEvent);
  if (hotBuffer.length > HOT_BUFFER_MAX) hotBuffer.shift();

  // Persist to warm storage on the same queue as the caller (or LOG_PATH if no queueKey).
  // This ensures commit-first ordering: the event is flushed before the caller's write
  // when both use the same queueKey.
  const enqueueKey = queueKey || LOG_PATH;
  writeQueue.enqueue(enqueueKey, () => {
    ensureDir();
    fs.appendFileSync(LOG_PATH, JSON.stringify(seqEvent) + '\n', 'utf8');
    _flushedSeq = seq;
  });

  // Dispatch to reducers
  const handlers = reducers.get(event.type) || [];
  for (const handler of handlers) {
    try { handler(seqEvent); } catch (e) { console.error('[commit-log] Reducer error for', event.type, e.message); }
  }

  return seqEvent;
}

// Read events from warm storage (optionally filtered)
function getEvents(opts = {}) {
  if (!fs.existsSync(LOG_PATH)) return [];
  const lines = fs.readFileSync(LOG_PATH, 'utf8').split('\n').filter(Boolean);
  const events = [];
  for (const line of lines) {
    try {
      const ev = JSON.parse(line);
      if (opts.type && ev.type !== opts.type) continue;
      if (opts.source && ev.source !== opts.source) continue;
      if (opts.afterSeq && ev.seq <= opts.afterSeq) continue;
      events.push(ev);
    } catch {}
  }
  if (opts.limit && events.length > opts.limit) return events.slice(-opts.limit);
  return events;
}

// Get recent events from hot buffer
function getRecent(limit = 50) {
  return hotBuffer.slice(-limit);
}

// Get current sequence number
function getSeq() { return seq; }

// Get flushed sequence number (persisted to disk)
function getFlushedSeq() { return _flushedSeq; }

// Check if all events up to seq have been flushed
function isFlushed(upToSeq) { return _flushedSeq >= (upToSeq || seq); }

// Replay events from warm storage starting at afterSeq (inclusive/exclusive).
// Calls each event's registered reducers in order, WITHOUT persisting to disk
// or bumping `seq`. Returns { count, lastSeq }.
// Used for: boot recovery, snapshot rebuild, state verification.
function replay(afterSeq, opts = {}) {
  if (!fs.existsSync(LOG_PATH)) return { count: 0, lastSeq: afterSeq };
  const lines = fs.readFileSync(LOG_PATH, 'utf8').split('\n').filter(Boolean);
  let count = 0;
  let lastSeq = afterSeq;
  let errors = 0;
  for (const line of lines) {
    try {
      const ev = JSON.parse(line);
      if (ev.seq <= afterSeq) continue;
      if (opts.maxSeq && ev.seq > opts.maxSeq) break;
      const handlers = reducers.get(ev.type) || [];
      for (const handler of handlers) {
        try { handler(ev); } catch (e) {
          console.error('[commit-log] Replay reducer error (seq=%d, type=%s):', ev.seq, ev.type, e.message);
          errors++;
        }
      }
      count++;
      lastSeq = ev.seq;
    } catch { errors++; }
  }
  return { count, lastSeq, errors };
}

// Get total event count in warm storage
function getTotalCount() {
  if (!fs.existsSync(LOG_PATH)) return 0;
  return fs.readFileSync(LOG_PATH, 'utf8').split('\n').filter(Boolean).length;
}

// Compact warm storage: remove events older than keepSeq
// Keeps only events with seq > keepSeq
function compact(keepSeq) {
  return writeQueue.enqueue(LOG_PATH, () => {
    if (!fs.existsSync(LOG_PATH)) return { removed: 0, kept: 0 };
    const lines = fs.readFileSync(LOG_PATH, 'utf8').split('\n').filter(Boolean);
    const kept = [];
    let removed = 0;
    for (const line of lines) {
      try {
        const ev = JSON.parse(line);
        if (ev.seq <= keepSeq) { removed++; continue; }
        kept.push(line);
      } catch { removed++; }
    }
    if (kept.length === 0) {
      fs.writeFileSync(LOG_PATH, '', 'utf8');
    } else {
      const tmpPath = LOG_PATH + '.compact.tmp';
      fs.writeFileSync(tmpPath, kept.join('\n') + '\n', 'utf8');
      fs.renameSync(tmpPath, LOG_PATH);
    }
    return { removed, kept: kept.length };
  });
}

// Initialize sequence from existing log
init();

module.exports = {
  commit,
  on,
  getEvents,
  getRecent,
  getSeq,
  getFlushedSeq,
  isFlushed,
  replay,
  getTotalCount,
  compact,
  KNOWN_EVENT_TYPES,
  LOG_PATH,
};
