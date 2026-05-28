// lib/event-bus.js — hardened SSE event bus with compaction
// Events: resolve.hit, resolve.miss, task.claimed, task.submitted, reasoning.stored, task.created
// v2: debounce window + periodic flush to prevent event amplification

const clients = new Set();
const MAX_CLIENTS = parseInt(process.env.SSE_MAX_CLIENTS || '100', 10);
const HEARTBEAT_INTERVAL_MS = parseInt(process.env.SSE_HEARTBEAT_INTERVAL_MS || '30000', 10);
const DEBOUNCE_WINDOW_MS = parseInt(process.env.SSE_DEBOUNCE_WINDOW_MS || '2000', 10);
const MAX_PENDING_EVENTS = parseInt(process.env.SSE_MAX_PENDING_EVENTS || '50', 10);

const _pending = []; // { type, data, aggregated }
let _flushScheduled = false;

function safeCleanup(res) {
  try {
    if (!res.writableEnded) {
      res.end();
    }
  } catch {}

  clients.delete(res);
}

function subscribe(res) {
  if (clients.size >= MAX_CLIENTS) {
    try {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'too_many_sse_clients',
        message: 'SSE client limit reached',
      }));
    } catch {}

    return;
  }

  res.write(': connected\n\n');

  const heartbeat = setInterval(() => {
    try {
      if (res.writableEnded || res.destroyed) {
        clearInterval(heartbeat);
        clients.delete(res);
        return;
      }

      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
      safeCleanup(res);
    }
  }, HEARTBEAT_INTERVAL_MS);

  clients.add(res);

  const cleanup = () => {
    clearInterval(heartbeat);
    clients.delete(res);
  };

  res.on('close', cleanup);
  res.on('error', cleanup);
}

function flushPending() {
  _flushScheduled = false;
  if (_pending.length === 0 || clients.size === 0) {
    _pending.length = 0;
    return;
  }

  // Flush all pending events to connected clients
  for (const evt of _pending) {
    const payload = `event: ${evt.type}\ndata: ${JSON.stringify({
      type: evt.type,
      ...evt.data,
      compacted: evt.aggregated ? evt.aggregated : undefined,
      timestamp: new Date().toISOString(),
    })}\n\n`;

    for (const res of [...clients]) {
      try {
        if (res.writableEnded || res.destroyed) {
          clients.delete(res);
          continue;
        }
        res.write(payload);
      } catch {
        safeCleanup(res);
      }
    }
  }

  _pending.length = 0;
}

function scheduleFlush() {
  if (_flushScheduled) return;
  _flushScheduled = true;
  setTimeout(flushPending, DEBOUNCE_WINDOW_MS);
}

function emit(type, data = {}) {
  if (clients.size === 0) return;

  // Compaction: merge duplicate events within debounce window
  const existing = _pending.find(e => e.type === type);
  if (existing) {
    existing.aggregated = (existing.aggregated || 1) + 1;
    existing.data = { ...existing.data, ...data };
  } else {
    if (_pending.length >= MAX_PENDING_EVENTS) {
      _pending.shift();
    }
    _pending.push({ type, data, aggregated: null });
  }

  scheduleFlush();
}

function getClientCount() {
  return clients.size;
}

function getPendingCount() {
  return _pending.length;
}

module.exports = {
  subscribe,
  emit,
  getClientCount,
  getPendingCount,
};