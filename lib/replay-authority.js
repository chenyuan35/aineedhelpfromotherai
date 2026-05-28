// lib/replay-authority.js — Replay Event Classification & Append Authorization
// Enforces the Replay Event Classification policy from Notion.
// Every event must be authorized before entering the execution log.

// Durable Events — long-term replay storage allowed
const DURABLE_EVENTS = new Set([
  'task_claimed',
  'result_submitted',
  'root_cause_analyzed',
  'memory_injected',
  'result_verified',
]);

// Ephemeral Events — short-lived, TTL only, excluded from snapshots
const EPHEMERAL_EVENTS = new Set([
  'agent_event',
]);

// Forbidden Events — must never enter replay persistence
const FORBIDDEN_EVENT_PREFIXES = [
  'prompt_',
  'model_',
  'projection_',
  'analytics_',
  'leaderboard_',
  'observability_',
  'viz_',
  'derived_',
];

function classifyEvent(eventType) {
  if (!eventType || typeof eventType !== 'string') {
    return { classification: 'forbidden', reason: 'Invalid event type' };
  }
  if (DURABLE_EVENTS.has(eventType)) {
    return { classification: 'durable' };
  }
  if (EPHEMERAL_EVENTS.has(eventType)) {
    return { classification: 'ephemeral' };
  }
  for (const prefix of FORBIDDEN_EVENT_PREFIXES) {
    if (eventType.startsWith(prefix)) {
      return { classification: 'forbidden', reason: `Event type "${eventType}" matches forbidden prefix "${prefix}"` };
    }
  }
  return { classification: 'forbidden', reason: `Event type "${eventType}" is not classified. Must be added to DURABLE_EVENTS or EPHEMERAL_EVENTS in replay-authority.js` };
}

function authorizeAppend(event, source) {
  const classification = classifyEvent(event.event_type);
  const sourceLabel = source || 'unknown';

  if (classification.classification === 'forbidden') {
    console.warn('[replay-authority] BLOCKED: %s event "%s" from %s — %s', classification.classification, event.event_type, sourceLabel, classification.reason);
    const err = new Error(`Replay authority violation: "${event.event_type}" is ${classification.classification}. ${classification.reason}`);
    err.code = 'REPLAY_AUTHORITY_VIOLATION';
    throw err;
  }

  if (classification.classification === 'ephemeral') {
    event._ephemeral = true;
  }

  return true;
}

function isDurable(eventType) {
  return DURABLE_EVENTS.has(eventType);
}

function isEphemeral(eventType) {
  return EPHEMERAL_EVENTS.has(eventType);
}

function isForbidden(eventType) {
  return classifyEvent(eventType).classification === 'forbidden';
}

module.exports = {
  authorizeAppend,
  classifyEvent,
  isDurable,
  isEphemeral,
  isForbidden,
  DURABLE_EVENTS: [...DURABLE_EVENTS],
  EPHEMERAL_EVENTS: [...EPHEMERAL_EVENTS],
  FORBIDDEN_EVENT_PREFIXES,
};
