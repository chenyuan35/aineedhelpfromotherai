// lib/write-levels.js — Runtime Write Level Classification
// L0: Canonical State — single source of truth, never deleted
// L1: Audit Log — append-only, compactable/thinnable
// L2: Derived State — recomputed from L0 + L1

const fs = require('fs');
const path = require('path');

const RUNTIME_DATA_DIR = path.resolve(__dirname, '..', 'data');

const LEVELS = {
  L0: 'L0',
  L1: 'L1',
  L2: 'L2',
};

const LEVEL_ORDER = ['L0', 'L1', 'L2'];

const LEVEL_LABELS = {
  L0: 'Canonical State',
  L1: 'Audit Log',
  L2: 'Derived State',
};

const LEVEL_DESCRIPTIONS = {
  L0: 'Single source of truth. Never deleted. All mutations go through authorized write paths.',
  L1: 'Append-only audit trail. Compactable/thinnable. Not canonical but needed for replay.',
  L2: 'Computed from L0 + L1. Can be rebuilt if missing on startup. Most aggressively compactable.',
};

// L2 rebuild rules: if L2 file is missing on boot, it is rebuilt from L0 + L1 sources.
// L0 is the authoritative runtime state (materialized in resolve-cache.json).
// ai-state.js defines the canonical schema boundary (field classification, projection rules),
// but resolve-cache.json is the current canonical store.
// L2 files are never required for L0/L1 integrity; they are derived views.

// Allowlist: the ONLY runtime data files that may be written.
// Any write to a path not in this list is a violation, even if under data/.
const FILE_ALLOWLIST = new Set([
  'resolve-cache.json',
  'execution_log.jsonl',
  'memory-api-log.jsonl',
  'memory-api-log-compact.json',
  'verification-state.json',
  'elo-ratings.json',
  'commit-log.jsonl',
]);

// Map: data file → write level
const FILE_LEVELS = {
  'data/resolve-cache.json': LEVELS.L0,
  'data/execution_log.jsonl': LEVELS.L1,
  'data/memory-api-log.jsonl': LEVELS.L1,
  'data/verification-state.json': LEVELS.L2,
  'data/elo-ratings.json': LEVELS.L2,
  'data/memory-api-log-compact.json': LEVELS.L2,
  'data/commit-log.jsonl': LEVELS.L1,
};

// Map: module name → write level
const MODULE_LEVELS = {
  'resolve-cache': LEVELS.L0,
  'execution-log': LEVELS.L1,
  'memory-api': LEVELS.L1,
  'verification': LEVELS.L2,
  'elo-rating': LEVELS.L2,
  'fs-safe': LEVELS.L1,  // wrapper, level depends on usage
};

// Resolve a path to its real (canonical) path, preventing symlink escape.
// Throws if the path cannot be resolved or escapes RUNTIME_DATA_DIR.
function resolveAuthorizedPath(filePath) {
  const resolved = path.resolve(filePath);
  // Resolve symlinks: if the file exists, use realpath; otherwise resolve parent dirs
  let realPath;
  try {
    realPath = fs.realpathSync(resolved);
  } catch (e) {
    // File doesn't exist yet — resolve parent directory to check for symlink escape
    const dir = path.dirname(resolved);
    let realDir;
    try {
      realDir = fs.realpathSync(dir);
    } catch {
      throw Object.assign(new Error('Cannot resolve path: ' + resolved), { code: 'PATH_RESOLVE_ERROR' });
    }
    realPath = path.join(realDir, path.basename(resolved));
  }
  if (!realPath.startsWith(RUNTIME_DATA_DIR)) {
    throw Object.assign(new Error('Symlink escape detected: ' + realPath + ' is outside runtime data directory'), { code: 'SYMLINK_ESCAPE' });
  }
  return realPath;
}

// Validate that a path is in the known runtime data allowlist.
// This replaces the generic "starts with data/" check.
// Returns true if the real (canonical) path matches an allowlist entry.
function isAllowedPath(filePath) {
  let realPath;
  try {
    realPath = resolveAuthorizedPath(filePath);
  } catch {
    // Path doesn't exist yet — verify the directory is under RUNTIME_DATA_DIR
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(RUNTIME_DATA_DIR)) return false;
    const basename = path.basename(resolved);
    return FILE_ALLOWLIST.has(basename);
  }
  // Must be under runtime data dir (redundant with resolveAuthorizedPath, but defensive)
  if (!realPath.startsWith(RUNTIME_DATA_DIR)) return false;
  const basename = path.basename(realPath);
  return FILE_ALLOWLIST.has(basename);
}

function getLevelForFile(filePath) {
  return FILE_LEVELS[filePath] || null;
}

function getLevelForModule(moduleName) {
  return MODULE_LEVELS[moduleName] || null;
}

module.exports = {
  LEVELS,
  LEVEL_ORDER,
  LEVEL_LABELS,
  LEVEL_DESCRIPTIONS,
  FILE_LEVELS,
  FILE_ALLOWLIST,
  MODULE_LEVELS,
  RUNTIME_DATA_DIR,
  isAllowedPath,
  resolveAuthorizedPath,
  getLevelForFile,
  getLevelForModule,
};
