// lib/event-bus.js — hardened SSE event bus for low-memory deployments
// Events: resolve.hit, resolve.miss, task.claimed, task.submitted, reasoning.stored, task.created

const clients = new Set();
const MAX_CLIENTS = parseInt(process.env.SSE_MAX_CLIENTS || '100', 10);
const HEARTBEAT_INTERVAL_MS = parseInt(process.env.SSE_HEARTBEAT_INTERVAL_MS || '30000', 10);

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

function emit(type, data = {}) {
  if (clients.size === 0) {
    return;
  }

  const payload = `event: ${type}\ndata: ${JSON.stringify({
    type,
    ...data,
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

function getClientCount() {
  return clients.size;
}

module.exports = {
  subscribe,
  emit,
  getClientCount,
};