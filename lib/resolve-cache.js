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

module.exports = { getHint, setHint, clearTask, getAllHints, getCache };
