const fs = require('fs');
const path = require('path');

const TRAPS_FILE = path.join(__dirname, '..', 'data', 'agent-traps.json');

let cached = null;
let cachedMtime = 0;

function loadTraps() {
  try {
    const stat = fs.statSync(TRAPS_FILE);
    if (cached && stat.mtimeMs === cachedMtime) return cached;
    const raw = fs.readFileSync(TRAPS_FILE, 'utf8');
    cached = JSON.parse(raw);
    cachedMtime = stat.mtimeMs;
    return cached;
  } catch {
    return [];
  }
}

function getTraps(options) {
  const traps = loadTraps();
  let filtered = [...traps];

  const { severity, tag, limit } = options || {};

  if (severity) filtered = filtered.filter(t => t.severity === severity);
  if (tag) filtered = filtered.filter(t => t.tags?.includes(tag));

  const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  filtered.sort((a, b) => (sevOrder[a.severity] || 99) - (sevOrder[b.severity] || 99));

  const total = filtered.length;
  if (limit) filtered = filtered.slice(0, limit);

  return { traps: filtered, total };
}

function getTrap(id) {
  const traps = loadTraps();
  return traps.find(t => t.id === id) || null;
}

function getStats() {
  const traps = loadTraps();
  return {
    total_traps: traps.length,
    by_severity: traps.reduce((acc, t) => {
      acc[t.severity] = (acc[t.severity] || 0) + 1;
      return acc;
    }, {}),
    unique_tags: [...new Set(traps.flatMap(t => t.tags || []))].length,
  };
}

module.exports = { getTraps, getTrap, getStats, loadTraps };
