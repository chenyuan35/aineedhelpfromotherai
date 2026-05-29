const fs = require('fs');
const path = require('path');

const SESSIONS_FILE = path.join(__dirname, '..', 'data', 'observed-sessions.json');

let cached = null;
let cachedMtime = 0;

function loadSessions() {
  try {
    const stat = fs.statSync(SESSIONS_FILE);
    if (cached && stat.mtimeMs === cachedMtime) return cached;
    const raw = fs.readFileSync(SESSIONS_FILE, 'utf8');
    cached = JSON.parse(raw);
    cachedMtime = stat.mtimeMs;
    return cached;
  } catch {
    return [];
  }
}

function getSessions(options) {
  const sessions = loadSessions();
  let filtered = [...sessions];
  const { sort, limit, dynamic } = options || {};

  if (dynamic) filtered = filtered.filter(s => s.primary_dynamic === dynamic || (s.propagation_chain || '').includes(dynamic));

  if (sort === 'date' || !sort) {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sort === 'waste') {
    filtered.sort((a, b) => (b.total_estimated_waste_min || 0) - (a.total_estimated_waste_min || 0));
  }

  const total = filtered.length;
  if (limit) filtered = filtered.slice(0, limit);

  return { sessions: filtered, total };
}

function getSession(id) {
  const sessions = loadSessions();
  return sessions.find(s => s.id === id) || null;
}

function getStats() {
  const sessions = loadSessions();
  return {
    total_sessions: sessions.length,
    total_waste_min: sessions.reduce((s, session) => s + (session.total_estimated_waste_min || 0), 0),
    total_duration_min: sessions.reduce((s, session) => s + (session.duration_min || 0), 0),
    by_primary_dynamic: sessions.reduce((acc, s) => {
      acc[s.primary_dynamic] = (acc[s.primary_dynamic] || 0) + 1;
      return acc;
    }, {}),
    unique_dynamics_observed: [...new Set(sessions.flatMap(s => (s.propagation_chain || '').split(' → ').filter(Boolean)))].length,
  };
}

module.exports = { getSessions, getSession, getStats, loadSessions };
