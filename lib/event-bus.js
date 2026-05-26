// lib/event-bus.js — Simple in-memory event bus for SSE streaming
// Events: resolve.hit, resolve.miss, task.claimed, task.submitted, reasoning.stored, task.created

const clients = new Set();

function subscribe(res) {
  clients.add(res);
  res.on('close', () => clients.delete(res));
}

function emit(type, data) {
  const payload = `event: ${type}\ndata: ${JSON.stringify({ type, ...data, timestamp: new Date().toISOString() })}\n\n`;
  for (const res of clients) {
    try { res.write(payload); } catch { clients.delete(res); }
  }
}

function getClientCount() { return clients.size; }

module.exports = { subscribe, emit, getClientCount };
