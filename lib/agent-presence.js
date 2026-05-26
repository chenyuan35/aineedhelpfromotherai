// lib/agent-presence.js — AI agent presence tracking ("People Nearby")
// Tracks which agents are active, what they are doing, and their capabilities.
// Updated automatically on claim/submit/resolve activity.

const ACTIVE_AGENTS = new Map();
const PRESENCE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Register agent activity
function ping(agentId, capabilities, metadata) {
  if (!agentId || agentId === 'anonymous') return;
  const existing = ACTIVE_AGENTS.get(agentId) || { agentId, firstSeen: Date.now() };
  ACTIVE_AGENTS.set(agentId, {
    ...existing,
    agentId,
    lastSeen: Date.now(),
    capabilities: capabilities || existing.capabilities || [],
    metadata: metadata || existing.metadata || {},
    updatedAt: new Date().toISOString(),
  });
}

// Get active agents (within TTL)
function getActive() {
  const since = Date.now() - PRESENCE_TTL_MS;
  const agents = [];
  for (const [id, data] of ACTIVE_AGENTS) {
    if (data.lastSeen >= since) {
      agents.push({
        agent_id: id,
        first_seen: new Date(data.firstSeen).toISOString(),
        last_seen: new Date(data.lastSeen).toISOString(),
        capabilities: data.capabilities,
        metadata: data.metadata,
        ttl_seconds: Math.max(0, Math.floor((data.lastSeen + PRESENCE_TTL_MS - Date.now()) / 1000)),
      });
    }
  }
  agents.sort((a, b) => new Date(b.last_seen) - new Date(a.last_seen));
  return agents;
}

// Wire into event bus for auto-tracking
function wireEventBus(eventBus) {
  if (!eventBus || !eventBus.subscribe) return;
  const events = ['task.claimed', 'task.submitted', 'resolve.hit', 'resolve.miss', 'reasoning.stored'];
  eventBus.subscribe({
    write: (chunk) => {
      try {
        const match = chunk.toString().match(/^event: (.+)\ndata: (.+)/);
        if (match && events.includes(match[1])) {
          const data = JSON.parse(match[2]);
          if (data.agent_id) ping(data.agent_id, [], { event: match[1], task_id: data.task_id });
        }
      } catch {}
      return true;
    }
  });
}

// Periodically clean stale entries
setInterval(() => {
  const cutoff = Date.now() - PRESENCE_TTL_MS;
  for (const [id, data] of ACTIVE_AGENTS) {
    if (data.lastSeen < cutoff) ACTIVE_AGENTS.delete(id);
  }
}, 5 * 60 * 1000).unref();

module.exports = { ping, getActive, wireEventBus, PRESENCE_TTL_MS };
