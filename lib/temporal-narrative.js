// lib/temporal-narrative.js — Time-bucketed runtime storytelling
// Pure projection: reads from event-bus ring buffer, no write path.
// Aggregate recent events into human-readable time windows with summaries.

const BUCKET_MS = 5 * 60 * 1000; // 5 minute buckets
const WINDOW_MS = 30 * 60 * 1000; // look back 30 min

const EVENT_LABELS = {
  'resolve.hit': 'cache hits',
  'resolve.miss': 'cache misses',
  'task.claimed': 'tasks claimed',
  'task.submitted': 'tasks completed',
  'task.created': 'tasks created',
  'reasoning.stored': 'reasoning stored',
  'behavioral_signal': 'signals detected',
  'root_cause_analyzed': 'root causes analyzed',
};

const EVENT_ICONS = {
  'resolve.hit': '✔',
  'resolve.miss': '✕',
  'task.claimed': '▶',
  'task.submitted': '●',
  'task.created': '+',
  'reasoning.stored': '◆',
  'behavioral_signal': '⚡',
  'root_cause_analyzed': '◎',
};

function getNarrative(windowMs = WINDOW_MS) {
  const eb = require('./event-bus');
  const events = eb.getRecentEvents(500);

  const now = Date.now();
  const cutoff = now - windowMs;
  const recent = events.filter(e => (e.flushed_at || 0) > cutoff);

  // Bucket by time window
  const buckets = {};
  for (const evt of recent) {
    const ts = evt.flushed_at || now;
    const bucketKey = Math.floor(ts / BUCKET_MS) * BUCKET_MS;
    if (!buckets[bucketKey]) buckets[bucketKey] = { time: bucketKey, counts: {}, agents: new Set(), events: [] };
    buckets[bucketKey].counts[evt.type] = (buckets[bucketKey].counts[evt.type] || 0) + (evt.aggregated || 1);
    if (evt.data?.agent_id) buckets[bucketKey].agents.add(evt.data.agent_id);
    buckets[bucketKey].events.push(evt);
  }

  const windowed = Object.values(buckets)
    .sort((a, b) => b.time - a.time)
    .map(b => {
      const label = formatBucketLabel(b.time);
      const summary = buildSummary(b.counts);
      const agentSummary = b.agents.size > 0 ? `${b.agents.size} agents` : '';
      const highlights = buildHighlights(b.events.slice(0, 3));
      return { time: b.time, label, summary, agent_summary: agentSummary, highlights, total_events: b.events.length };
    });

  // Current period summary
  const lastBucket = windowed[0] || null;
  const totalByType = {};
  let totalEvents = 0;
  let uniqueAgents = new Set();
  for (const evt of recent) {
    totalByType[evt.type] = (totalByType[evt.type] || 0) + (evt.aggregated || 1);
    totalEvents += (evt.aggregated || 1);
    if (evt.data?.agent_id) uniqueAgents.add(evt.data.agent_id);
  }

  return {
    windows: windowed,
    current: {
      total_events: totalEvents,
      unique_agents: uniqueAgents.size,
      by_type: totalByType,
      summary: buildSummary(totalByType),
    },
    window_minutes: Math.round(windowMs / 60000),
  };
}

function formatBucketLabel(ts) {
  const d = new Date(ts);
  const end = new Date(ts + BUCKET_MS);
  const fmt = (dt) => dt.toTimeString().slice(0, 5);
  return `${fmt(d)} - ${fmt(end)}`;
}

function buildSummary(counts) {
  const parts = Object.entries(counts)
    .filter(([, c]) => c > 0)
    .map(([type, count]) => {
      const label = EVENT_LABELS[type] || type.replace(/\./g, ' ');
      return `${count} ${label}`;
    });
  return parts.length > 0 ? parts.join(', ') : 'no activity';
}

function buildHighlights(events) {
  return events.map(evt => {
    const icon = EVENT_ICONS[evt.type] || '○';
    const narrative = evt.data?.narrative || '';
    const agent = evt.data?.agent_id || '';
    if (narrative) return { icon, text: narrative };
    if (agent) return { icon, text: `${agent} — ${evt.type}` };
    return { icon, text: evt.type };
  });
}

module.exports = { getNarrative };
