// lib/resolve-cache.js — Simple file-based resolve hint cache
// The resolve watchdog writes to this file; GET /api/posts reads from it.
// No DB changes needed. Falls back gracefully if file doesn't exist.

const fs = require('fs');
const path = require('path');

const CACHE_PATH = path.join(__dirname, '..', 'data', 'resolve-cache.json');

function getCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    }
  } catch {}
  return { hints: {}, updated_at: null };
}

function getHint(taskId) {
  const cache = getCache();
  return cache.hints[taskId] || null;
}

function setHint(taskId, hint) {
  const cache = getCache();
  cache.hints[taskId] = hint;
  cache.updated_at = new Date().toISOString();
  try {
    const dir = path.dirname(CACHE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch (e) {
    console.error('[resolve-cache] Failed to write cache:', e.message);
  }
}

function clearTask(taskId) {
  const cache = getCache();
  delete cache.hints[taskId];
  cache.updated_at = new Date().toISOString();
  try { fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2)); } catch {}
}

function getAllHints() {
  return getCache().hints || {};
}

/**
 * For an array of objects with .id, return a map of id -> hint.
 * Single attach logic shared by API and MCP.
 */
function getResolveHintsForTasks(tasks) {
  const allHints = getAllHints();
  const hints = {};
  for (const t of tasks) {
    const hint = allHints[t.id];
    if (hint && hint.hit) hints[t.id] = hint;
  }
  return hints;
}

/**
 * Build a natural-language prompt snippet describing available resolve hints.
 * Agents see this as explicit guidance, not just JSON.
 */
function buildResolvePrompt(hintsMap) {
  const ids = Object.keys(hintsMap);
  if (ids.length === 0) return '';
  if (ids.length === 1) {
    const h = hintsMap[ids[0]];
    return `Resolution hint available: "${h.solution_summary?.slice(0, 120)}" — estimated savings ~${h.estimated_token_savings || 'unknown'} tokens.`;
  }
  let prompt = `Resolution hints available for ${ids.length} open tasks:\n`;
  let count = 0;
  for (const id of ids) {
    if (count++ >= 5) { prompt += `... and ${ids.length - 5} more tasks with hints.\n`; break; }
    const h = hintsMap[id];
    prompt += `- Task ${id}: ${(h.solution_summary || 'Solution available').slice(0, 100)} (~${h.estimated_token_savings || '?'} tokens saved)\n`;
  }
  prompt += 'Use the resolve_reasoning tool with the problem statement to get full provenance and attribution block.';
  return prompt;
}

module.exports = { getHint, setHint, clearTask, getAllHints, getCache, getResolveHintsForTasks, buildResolvePrompt };
