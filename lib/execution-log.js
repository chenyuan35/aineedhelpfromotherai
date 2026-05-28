// lib/execution-log.js — Append-only execution trace log (JSONL)
// Records every step of the agent pipeline: task → memory → prompt → output → verify → submit
// Log path: data/execution_log.jsonl
// Phase 2: Event sourcing — public API is commit-only, reducers handle persistence.

const fs = require('fs');
const path = require('path');
const replayAuthority = require('./replay-authority');
const writeAuthority = require('./write-authority');
const writeQueue = require('./write-queue');
const commitLog = require('./commit-log');

const LOG_PATH = path.join(__dirname, '..', 'data', 'execution_log.jsonl');

const APPEND_CAP = {};
const COMPACT_CAP = {};
const REDUCER_CAP = {};

function registerCapabilities(registerFn) {
  registerFn(APPEND_CAP);
  registerFn(COMPACT_CAP);
  registerFn(REDUCER_CAP);
}

function ensureDir() {
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Phase 2 reducer: append entry to log file
commitLog.on('execution_log/append', (event) => {
  writeAuthority.authorizeWrite(REDUCER_CAP);
  ensureDir();
  fs.appendFileSync(LOG_PATH, JSON.stringify(event.payload) + '\n', 'utf8');
});

// Append a structured execution event to the log
// Required: run_id, event_type
// Optional but recommended: task_id, agent_id
// input/output: arbitrary JSON payloads describing the stage
function append({ run_id, event_type, task_id, agent_id, input, output, memory_ids, verification_tier, latency_ms, parent_run_id, failure_type, evidence_refs, _source }) {
  if (!run_id) throw new Error('execution-log: run_id is required');
  if (!event_type) throw new Error('execution-log: event_type is required');

  // Replay authority check — enforces event classification policy
  replayAuthority.authorizeAppend({ event_type }, _source || 'execution-log');
  // Write authority check — capability-based, blocks unauthorized callers
  writeAuthority.authorizeWrite(APPEND_CAP);

  const entry = {
    run_id,
    timestamp: new Date().toISOString(),
    event_type,
    task_id: task_id || '',
    agent_id: agent_id || '',
    input: input || {},
    output: output || {},
    memory_ids: memory_ids || [],
    verification_tier: verification_tier || '',
    latency_ms: latency_ms || 0,
  };

  // Semantic fields (v0.3 — optional, only written when present)
  if (parent_run_id) entry.parent_run_id = parent_run_id;
  if (failure_type) entry.failure_type = failure_type;
  if (evidence_refs && evidence_refs.length > 0) entry.evidence_refs = evidence_refs;

  // Phase 2: commit-only (reducer persists)
  commitLog.commit(APPEND_CAP, { type: 'execution_log/append', source: 'execution-log', payload: entry }, LOG_PATH);
  return entry;
}

// Read all events. Options:
//   run_id — filter to specific run
//   event_type — filter by event type
//   task_id — filter by task
//   agent_id — filter by agent
//   limit — max results
//   after — ISO timestamp, only events after this time
function query({ run_id, event_type, task_id, agent_id, limit, after, parent_run_id, failure_type } = {}) {
  if (!fs.existsSync(LOG_PATH)) return [];

  const lines = fs.readFileSync(LOG_PATH, 'utf8').split('\n').filter(Boolean);
  const events = [];
  for (const line of lines) {
    try {
      const ev = JSON.parse(line);
      if (run_id && ev.run_id !== run_id) continue;
      if (event_type && ev.event_type !== event_type) continue;
      if (task_id && ev.task_id !== task_id) continue;
      if (agent_id && ev.agent_id !== agent_id) continue;
      if (after && ev.timestamp < after) continue;
      if (parent_run_id && ev.parent_run_id !== parent_run_id) continue;
      if (failure_type && ev.failure_type !== failure_type) continue;
      events.push(ev);
    } catch  { /* skip malformed lines */ }
  }
  if (limit && events.length > limit) return events.slice(0, limit);
  return events;
}

// Get all events for a single run, sorted by timestamp
function getRun(runId) {
  const events = query({ run_id: runId });
  events.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  return events;
}

// List all unique run_ids with event count and time range
function getRunIds() {
  if (!fs.existsSync(LOG_PATH)) return [];

  const lines = fs.readFileSync(LOG_PATH, 'utf8').split('\n').filter(Boolean);
  const runs = {};
  for (const line of lines) {
    try {
      const ev = JSON.parse(line);
      if (!runs[ev.run_id]) {
        runs[ev.run_id] = { run_id: ev.run_id, event_count: 0, first_seen: ev.timestamp, last_seen: ev.timestamp, task_id: ev.task_id, agent_id: ev.agent_id, parent_run_id: ev.parent_run_id || null };
      }
      runs[ev.run_id].event_count++;
      if (ev.timestamp < runs[ev.run_id].first_seen) runs[ev.run_id].first_seen = ev.timestamp;
      if (ev.timestamp > runs[ev.run_id].last_seen) runs[ev.run_id].last_seen = ev.timestamp;
      if (ev.task_id && !runs[ev.run_id].task_id) runs[ev.run_id].task_id = ev.task_id;
      if (ev.agent_id && !runs[ev.run_id].agent_id) runs[ev.run_id].agent_id = ev.agent_id;
    } catch  {}
  }
  return Object.values(runs).sort((a, b) => b.last_seen.localeCompare(a.last_seen));
}

// Get all event types present in the log
function getEventTypes() {
  if (!fs.existsSync(LOG_PATH)) return [];
  const types = new Set();
  const lines = fs.readFileSync(LOG_PATH, 'utf8').split('\n').filter(Boolean);
  for (const line of lines) {
    try { types.add(JSON.parse(line).event_type); } catch  {}
  }
  return [...types].sort();
}

// Replay log compaction: prune forbidden events, thin ephemeral events
// Retention: forbidden → removed, ephemeral → keep max EPHEMERAL_PER_RUN latest per run_id, durable → kept
const EPHEMERAL_TTL_MS = parseInt(process.env.REPLAY_EPHEMERAL_TTL_MS || '86400000', 10);
const EPHEMERAL_PER_RUN = parseInt(process.env.REPLAY_EPHEMERAL_PER_RUN || '10', 10);

// Phase 2 reducer: compaction — read, filter, write back
commitLog.on('execution_log/compact', () => {
  writeAuthority.authorizeWrite(REDUCER_CAP);
  if (!fs.existsSync(LOG_PATH)) return { removed: 0, kept: 0, thinned: 0 };

  const raw = fs.readFileSync(LOG_PATH, 'utf8');
  const lines = raw.split('\n').filter(Boolean);
  if (lines.length === 0) return { removed: 0, kept: 0, thinned: 0 };

  const kept = [];
  let removed = 0;
  let thinned = 0;
  const ephemeralPerRun = {};

  for (const line of lines) {
    let ev;
    try { ev = JSON.parse(line); } catch { removed++; continue; }
    const eventType = ev.event_type || '';
    if (replayAuthority.isForbidden(eventType)) { removed++; continue; }
    if (replayAuthority.isEphemeral(eventType)) {
      if (!ephemeralPerRun[ev.run_id]) ephemeralPerRun[ev.run_id] = [];
      ephemeralPerRun[ev.run_id].push(line);
      continue;
    }
    kept.push(line);
  }

  for (const epLines of Object.values(ephemeralPerRun)) {
    const sorted = epLines.sort();
    const keepCount = Math.min(sorted.length, EPHEMERAL_PER_RUN);
    thinned += sorted.length - keepCount;
    for (let i = sorted.length - keepCount; i < sorted.length; i++) kept.push(sorted[i]);
  }

  const tmpPath = LOG_PATH + '.compact.tmp';
  fs.writeFileSync(tmpPath, kept.join('\n') + '\n', 'utf8');
  fs.renameSync(tmpPath, LOG_PATH);
});

function compact() {
  writeAuthority.authorizeWrite(COMPACT_CAP);
  // Phase 2: commit-only (reducer handles write)
  commitLog.commit(COMPACT_CAP, { type: 'execution_log/compact', source: 'execution-log', payload: {} }, LOG_PATH);
}

function getStats() {
  if (!fs.existsSync(LOG_PATH)) return { total: 0, file_size_bytes: 0 };
  const stat = fs.statSync(LOG_PATH);
  const lines = fs.readFileSync(LOG_PATH, 'utf8').split('\n').filter(Boolean);
  return { total: lines.length, file_size_bytes: stat.size };
}

function close() {
  // No-op: sync writes don't need cleanup
}

module.exports = { append, query, getRun, getRunIds, getEventTypes, compact, getStats, close, registerCapabilities, LOG_PATH };
