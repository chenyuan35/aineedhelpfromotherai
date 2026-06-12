const fs = require('fs');
const path = require('path');

const CASES_FILE = path.join(__dirname, '..', 'data', 'failure-cases.json');

let cached = null;
let cachedMtime = 0;

function loadCases() {
  try {
    const stat = fs.statSync(CASES_FILE);
    if (cached && stat.mtimeMs === cachedMtime) return cached;
    const raw = fs.readFileSync(CASES_FILE, 'utf8');
    cached = JSON.parse(raw);
    cachedMtime = stat.mtimeMs;
    return cached;
  } catch {
    return [];
  }
}

function minutesFor(c) {
  return Number(c.time_wasted_minutes || c.time_lost_min || 0);
}

function isPublicCase(c) {
  return c?.source !== 'daily-auto-generate' && !String(c?.id || '').startsWith('FC_AUTO_');
}

function getCases(options) {
  const cases = loadCases().filter(isPublicCase);
  let filtered = [...cases];

  const { type, env, agent, tag, limit, sort } = options || {};

  if (type) filtered = filtered.filter(c => c.failure_type === type);
  if (env) filtered = filtered.filter(c => c.environment === env);
  if (agent) filtered = filtered.filter(c => c.agent?.toLowerCase().includes(agent.toLowerCase()));
  if (tag) filtered = filtered.filter(c => c.tags?.includes(tag));

  if (sort === 'time') filtered.sort((a, b) => minutesFor(b) - minutesFor(a));

  const total = filtered.length;
  const totalTimeWasted = filtered.reduce((s, c) => s + minutesFor(c), 0);

  if (limit) filtered = filtered.slice(0, limit);

  return { cases: filtered, total, total_time_wasted_minutes: totalTimeWasted };
}

function getCase(id) {
  const cases = loadCases().filter(isPublicCase);
  return cases.find(c => c.id === id) || null;
}

function getStats() {
  const cases = loadCases().filter(isPublicCase);
  const totalCases = cases.length;
  const totalTimeWasted = cases.reduce((s, c) => s + minutesFor(c), 0);

  const typeCounts = {};
  cases.forEach(c => {
    typeCounts[c.failure_type] = (typeCounts[c.failure_type] || 0) + 1;
  });

  const envCounts = {};
  cases.forEach(c => {
    envCounts[c.environment] = (envCounts[c.environment] || 0) + 1;
  });

  const allTags = [...new Set(cases.flatMap(c => c.tags || []))];

  return {
    total_cases: totalCases,
    total_time_wasted_minutes: totalTimeWasted,
    avg_time_wasted_minutes: totalCases ? Math.round(totalTimeWasted / totalCases) : 0,
    by_type: typeCounts,
    by_environment: envCounts,
    unique_tags: allTags.length,
  };
}

module.exports = { getCases, getCase, getStats, loadCases, isPublicCase };
