const fs = require('fs');
const path = require('path');

const DYNAMICS_FILE = path.join(__dirname, '..', 'data', 'failure-dynamics.json');

let cached = null;
let cachedMtime = 0;

function loadDynamics() {
  try {
    const stat = fs.statSync(DYNAMICS_FILE);
    if (cached && stat.mtimeMs === cachedMtime) return cached;
    const raw = fs.readFileSync(DYNAMICS_FILE, 'utf8');
    cached = JSON.parse(raw);
    cachedMtime = stat.mtimeMs;
    return cached;
  } catch {
    return [];
  }
}

function getDynamics(options) {
  const dynamics = loadDynamics();
  let filtered = [...dynamics];
  const { severity, sort, limit } = options || {};

  if (severity) filtered = filtered.filter(d => d.severity === severity);

  if (sort === 'time') {
    filtered.sort((a, b) => b.total_time_wasted_min - a.total_time_wasted_min);
  } else if (sort === 'cases') {
    filtered.sort((a, b) => b.total_cases - a.total_cases);
  } else {
    const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    filtered.sort((a, b) => (sevOrder[a.severity] || 99) - (sevOrder[b.severity] || 99));
  }

  const total = filtered.length;
  if (limit) filtered = filtered.slice(0, limit);

  return { dynamics: filtered, total };
}

function getDynamic(id) {
  const dynamics = loadDynamics();
  return dynamics.find(d => d.id === id) || null;
}

function getStats() {
  const dynamics = loadDynamics();
  return {
    total_dynamics: dynamics.length,
    total_cases: dynamics.reduce((s, d) => s + d.total_cases, 0),
    total_time_wasted_min: dynamics.reduce((s, d) => s + d.total_time_wasted_min, 0),
    by_severity: dynamics.reduce((acc, d) => {
      acc[d.severity] = (acc[d.severity] || 0) + 1;
      return acc;
    }, {}),
    propagation_count: dynamics.filter(d => d.total_cases > 0).length,
  };
}

module.exports = { getDynamics, getDynamic, getStats, loadDynamics };
