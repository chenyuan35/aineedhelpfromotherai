// lib/execution-log.js — Append-only execution trace log (JSONL)
// Records every step of the agent pipeline: task → memory → prompt → output → verify → submit
// Log path: data/execution_log.jsonl
// Uses sync writes for immediate durability (critical for causal traceability).

const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '..', 'data', 'execution_log.jsonl');

function ensureDir() {
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Append a structured execution event to the log
// Required: run_id, event_type
// Optional but recommended: task_id, agent_id
// input/output: arbitrary JSON payloads describing the stage
function append({ run_id, event_type, task_id, agent_id, input, output, memory_ids, verification_tier, latency_ms }) {
  if (!run_id) throw new Error('execution-log: run_id is required');
  if (!event_type) throw new Error('execution-log: event_type is required');

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

  ensureDir();
  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n', 'utf8');
  return entry;
}

// Read all events. Options:
//   run_id — filter to specific run
//   event_type — filter by event type
//   task_id — filter by task
//   agent_id — filter by agent
//   limit — max results
//   after — ISO timestamp, only events after this time
function query({ run_id, event_type, task_id, agent_id, limit, after } = {}) {
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
        runs[ev.run_id] = { run_id: ev.run_id, event_count: 0, first_seen: ev.timestamp, last_seen: ev.timestamp, task_id: ev.task_id, agent_id: ev.agent_id };
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

function close() {
  // No-op: sync writes don't need cleanup
}

module.exports = { append, query, getRun, getRunIds, getEventTypes, close, LOG_PATH };
