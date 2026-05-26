// lib/resolve-cache.js — Simple file-based resolve hint cache
// The resolve watchdog writes to this file; GET /api/posts reads from it.
// No DB changes needed. Falls back gracefully if file doesn't exist.
// v2: Memory decay — hints have scores, garbage is filtered.

const fs = require('fs');
const path = require('path');

const CACHE_PATH = path.join(__dirname, '..', 'data', 'resolve-cache.json');
const MIN_SCORE = 0.3;   // hints below this are hidden from API/MCP
const DECAY_PER_DAY = 0.1;
const INITIAL_SCORE = 1.0;

function getCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    }
  } catch {}
  return { hints: {}, updated_at: null };
}

function save(cache) {
  try {
    const dir = path.dirname(CACHE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch (e) {
    console.error('[resolve-cache] Failed to write cache:', e.message);
  }
}

function getHint(taskId) {
  const cache = getCache();
  return cache.hints[taskId] || null;
}

function setHint(taskId, hint) {
  const cache = getCache();
  cache.hints[taskId] = { ...hint, score: hint.score ?? INITIAL_SCORE, updated_at: new Date().toISOString() };
  cache.updated_at = new Date().toISOString();
  save(cache);
}

function clearTask(taskId) {
  const cache = getCache();
  delete cache.hints[taskId];
  cache.updated_at = new Date().toISOString();
  save(cache);
}

function getAllHints() {
  return getCache().hints || {};
}

// --- Memory decay ---

/** Adjust a hint's score based on outcome. Negative = demote, positive = promote. */
function scoreHint(taskId, delta) {
  const cache = getCache();
  const h = cache.hints[taskId];
  if (!h) return;
  h.score = (h.score ?? INITIAL_SCORE) + delta;
  h.updated_at = new Date().toISOString();
  if (h.score < -2) h.score = -2; // floor
  if (h.score > 3) h.score = 3;  // ceiling
  save(cache);
}

/** Permanently blacklist a hallucinated/bad hint. */
function blacklistHint(taskId) {
  scoreHint(taskId, -10); // guarantees below MIN_SCORE
}

/** Decay all hints — run periodically to age out stale entries. */
function decayAll() {
  const cache = getCache();
  const now = Date.now();
  let changed = false;
  for (const [id, h] of Object.entries(cache.hints)) {
    const ageDays = (now - new Date(h.updated_at || now).getTime()) / 86400000;
    if (ageDays > 1) {
      const decay = Math.floor(ageDays) * DECAY_PER_DAY;
      if (decay > 0) {
        h.score = (h.score ?? INITIAL_SCORE) - decay;
        changed = true;
      }
    }
  }
  if (changed) { cache.updated_at = new Date().toISOString(); save(cache); }
}

/** Return only hints with score >= MIN_SCORE. */
function getActiveHints() {
  const all = getAllHints();
  const active = {};
  for (const [id, h] of Object.entries(all)) {
    if ((h.score ?? INITIAL_SCORE) >= MIN_SCORE) {
      active[id] = h;
    }
  }
  return active;
}

// Run decay every 6 hours
setInterval(decayAll, 6 * 3600000).unref();

/**
 * For an array of objects with .id, return a map of id -> hint (active only).
 * Single attach logic shared by API and MCP.
 */
function getResolveHintsForTasks(tasks) {
  const allHints = getActiveHints();
  const hints = {};
  for (const t of tasks) {
    const hint = allHints[t.id];
    if (hint && hint.hit) hints[t.id] = hint;
  }
  return hints;
}

// --- Prompt building (unchanged logic, uses filtered hints) ---

function buildResolvePrompt(hintsMap) {
  const ids = Object.keys(hintsMap);
  if (ids.length === 0) return '';
  if (ids.length === 1) {
    const h = hintsMap[ids[0]];
    const score = h.score ?? INITIAL_SCORE;
    return `Resolution hint available (score: ${score.toFixed(1)}): "${h.solution_summary?.slice(0, 120)}" — estimated savings ~${h.estimated_token_savings || 'unknown'} tokens.`;
  }
  let prompt = `Resolution hints available for ${ids.length} open tasks:\n`;
  let count = 0;
  for (const id of ids) {
    if (count++ >= 5) { prompt += `... and ${ids.length - 5} more tasks with hints.\n`; break; }
    const h = hintsMap[id];
    const score = h.score ?? INITIAL_SCORE;
    prompt += `- Task ${id} (score: ${score.toFixed(1)}): ${(h.solution_summary || 'Solution available').slice(0, 100)} (~${h.estimated_token_savings || '?'} tokens saved)\n`;
  }
  prompt += 'Use the resolve_reasoning tool with the problem statement to get full provenance and attribution block.';
  return prompt;
}

module.exports = {
  getHint, setHint, clearTask, getAllHints, getCache,
  getResolveHintsForTasks, buildResolvePrompt,
  scoreHint, blacklistHint, decayAll, getActiveHints, MIN_SCORE,
};
