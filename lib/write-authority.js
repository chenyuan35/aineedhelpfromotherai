// lib/write-authority.js — Runtime Write Authority Guard (Capability + CallSite)
// Enforces: experimental modules cannot mutate runtime state.
// 
// Protection layers:
//   1. Capability tokens — registered at boot, locked before request handling.
//      Tokens are required, but insufficient alone (experimental code can call
//      runtime functions that hold tokens).
//   2. CallSite verification — uses V8 structured CallSite API to verify the
//      caller is from the runtime directory, not experimental/.
//   3. Boot lock — after lockRegistration(), no new capabilities can be created.
//   4. realpath normalization — resolveAuthorizedPath() prevents symlink escape
//      by resolving the real (canonical) path and rejecting any path outside
//      the RUNTIME_DATA_DIR boundary. This closes path traversal attacks via
//      symlinks, junction points, and ../ variants.

const path = require('path');

const RUNTIME_DIR = path.resolve(__dirname);
const RUNTIME_DATA_DIR = path.resolve(__dirname, '..', 'data');
const EXPERIMENTAL_DIR = path.resolve(__dirname, '..', 'experimental');
const VIOLATIONS = [];
const MAX_VIOLATIONS = 100;

const capabilities = new Set();
let locked = false;

// Runtime modules that are authorized to call authorizeWrite (write paths).
// These are skipped during caller verification to find the actual caller.
const AUTHORIZED_WRITERS = new Set([
  'write-authority.js',
  'commit-log.js',
  'resolve-cache.js',
  'execution-log.js',
  'memory-api.js',
  'verification.js',
  'elo-rating.js',
  'fs-safe.js',
]);

// Register a write capability token at boot time.
function registerCapability(token) {
  if (locked) {
    const err = new Error('Cannot register capabilities after boot lock');
    err.code = 'CAPABILITY_LOCKED';
    throw err;
  }
  capabilities.add(token);
  return true;
}

// Lock registration — called after all core modules have registered.
function lockRegistration() {
  locked = true;
}

// Check if a capability token is authorized AND no experimental module is in the call chain.
function authorizeWrite(token) {
  // Layer 1: capability check
  if (!token || !capabilities.has(token)) {
    recordViolation('capability_missing', getCallerFile());
    throw createViolationError('Write authority violation: missing or invalid capability token.');
  }

  // Layer 2: full call chain verification — walk ALL frames to find experimental callers
  const experimentalCaller = findExperimentalCaller();
  if (experimentalCaller) {
    recordViolation('caller_experimental', experimentalCaller);
    throw createViolationError('Write authority violation: experimental module "' + experimentalCaller + '" cannot write to runtime state.');
  }

  return true;
}

function recordViolation(reason, callerFile) {
  const violation = {
    ts: new Date().toISOString(),
    reason,
    caller: callerFile || 'unknown',
    stack: new Error().stack.split('\n').slice(2, 6).join('\n'),
  };
  VIOLATIONS.push(violation);
  if (VIOLATIONS.length > MAX_VIOLATIONS) VIOLATIONS.shift();
  console.error('[WRITE-AUTHORITY] BLOCKED (reason=%s): %s', reason, callerFile || 'unknown');
}

function createViolationError(msg) {
  const err = new Error(msg);
  err.code = 'WRITE_AUTHORITY_VIOLATION';
  return err;
}

// Walk the V8 structured call stack to find the first frame that is NOT
// an authorized writer (write-authority.js itself or one of the AUTHORIZED_WRITERS).
// Returns the file path of the first non-authorized caller.
function getCallerFile() {
  const frames = getStructuredStack();
  for (const frame of frames) {
    const file = frame.getFileName() || '';
    if (!file || file.includes('node_modules')) continue;
    const basename = file.split(/[/\\]/).pop();
    if (basename === 'write-authority.js') continue;
    if (AUTHORIZED_WRITERS.has(basename)) continue;
    return path.resolve(file);
  }
  return '';
}

// Walk the full call stack to find if ANY caller is from experimental/.
// This catches cases like: experimental → runtime_A → runtime_B → authorizeWrite
function findExperimentalCaller() {
  const frames = getStructuredStack();
  for (const frame of frames) {
    const file = frame.getFileName() || '';
    if (!file || file.includes('node_modules')) continue;
    if (file.startsWith(EXPERIMENTAL_DIR)) return file;
  }
  return null;
}

// Get structured call stack using V8 CallSite API, starting from the caller of this module.
function getStructuredStack() {
  const oldPrepare = Error.prepareStackTrace;
  Error.prepareStackTrace = (err, stack) => stack;
  const err = new Error();
  Error.captureStackTrace(err, getStructuredStack);
  const stack = err.stack;
  Error.prepareStackTrace = oldPrepare;
  return stack;
}

function isExperimentalPath(filePath) {
  return filePath && filePath.startsWith(EXPERIMENTAL_DIR);
}

function getViolations() {
  return VIOLATIONS.slice();
}

function clearViolations() {
  VIOLATIONS.length = 0;
}

// Resolve a file path to its real (canonical) path, preventing symlink escape.
// Uses fs.realpathSync to resolve symlinks. If the file doesn't exist yet,
// resolves the parent directory to detect symlink escapes at the directory level.
// Throws with code 'PATH_RESOLVE_ERROR' or 'SYMLINK_ESCAPE' on failure.
function resolveAuthorizedPath(filePath) {
  const fs = require('fs');
  const resolved = path.resolve(filePath);
  let realPath;
  try {
    realPath = fs.realpathSync(resolved);
  } catch (e) {
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

module.exports = {
  registerCapability,
  lockRegistration,
  authorizeWrite,
  isExperimentalPath,
  getViolations,
  clearViolations,
  resolveAuthorizedPath,
  EXPERIMENTAL_DIR,
  RUNTIME_DIR,
  RUNTIME_DATA_DIR,
};
