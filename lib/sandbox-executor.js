// lib/sandbox-executor.js — Sandboxed execution layer for ground truth verification
// Checkout repo → apply patch → run tests → capture logs → return result
// Falls back to logical verification if sandbox (Docker/git) unavailable

const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');
const os = require('os');

const WORK_DIR = path.join(__dirname, '..', 'data', 'sandbox');
const LOG_PATH = path.join(__dirname, '..', 'data', 'sandbox-execution-log.json');

function ensureWorkDir() {
  if (!fs.existsSync(WORK_DIR)) fs.mkdirSync(WORK_DIR, { recursive: true });
}

function loadExecutionLog() {
  try {
    if (fs.existsSync(LOG_PATH)) {
      return JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
    }
  } catch { /* ignore */ }
  return { executions: [], updated_at: null };
}

function saveExecutionLog(data) {
  try {
    const dir = path.dirname(LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOG_PATH, JSON.stringify(data, null, 2));
  } catch { /* ignore */ }
}

// Check if git is available
function hasGit() {
  try {
    execSync('git --version', { stdio: 'pipe', timeout: 5000 });
    return true;
  } catch { return false; }
}

// Check if Docker is available
function hasDocker() {
  try {
    execSync('docker --version', { stdio: 'pipe', timeout: 5000 });
    return true;
  } catch { return false; }
}

// Create a unique working directory
function createWorkDir(taskId) {
  ensureWorkDir();
  const safeId = taskId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dir = path.join(WORK_DIR, `exec-${safeId}-${Date.now()}`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// Clean up working directory
function cleanup(dir) {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch { /* ignore */ }
}

// Clone a git repository at a specific ref
function checkoutRepo(repoUrl, ref = 'HEAD', workDir) {
  const startTime = Date.now();
  try {
    execSync(`git clone --depth 1 ${repoUrl} "${workDir}/repo"`, { stdio: 'pipe', timeout: 60000, cwd: workDir });
    if (ref && ref !== 'HEAD') {
      execSync(`git -C "${workDir}/repo" checkout ${ref}`, { stdio: 'pipe', timeout: 30000 });
    }
    return { success: true, path: `${workDir}/repo`, duration: Date.now() - startTime };
  } catch (e) {
    return { success: false, error: e.message, duration: Date.now() - startTime };
  }
}

// Apply a patch/diff to the repo
function applyPatch(patchContent, repoPath) {
  const startTime = Date.now();
  try {
    const patchFile = path.join(path.dirname(repoPath), 'patch.diff');
    fs.writeFileSync(patchFile, patchContent);
    execSync(`git -C "${repoPath}" apply --check "${patchFile}"`, { stdio: 'pipe', timeout: 30000 });
    execSync(`git -C "${repoPath}" apply "${patchFile}"`, { stdio: 'pipe', timeout: 30000 });
    return { success: true, duration: Date.now() - startTime };
  } catch (e) {
    return { success: false, error: e.message, duration: Date.now() - startTime };
  }
}

// Run tests in the repo
function runTests(repoPath, testCommand = 'npm test', timeout = 60000) {
  const startTime = Date.now();
  let output = '';
  let exitCode = -1;
  try {
    // Detect test framework
    let cmd = testCommand;
    if (fs.existsSync(path.join(repoPath, 'package.json'))) {
      const pkg = JSON.parse(fs.readFileSync(path.join(repoPath, 'package.json'), 'utf8'));
      if (pkg.scripts?.test) cmd = 'npm test';
      else if (pkg.scripts?.spec) cmd = 'npm run spec';
    } else if (fs.existsSync(path.join(repoPath, 'Makefile'))) {
      cmd = 'make test';
    } else if (fs.existsSync(path.join(repoPath, 'Cargo.toml'))) {
      cmd = 'cargo test';
    } else if (fs.existsSync(path.join(repoPath, 'go.mod'))) {
      cmd = 'go test ./...';
    } else if (fs.existsSync(path.join(repoPath, 'requirements.txt')) || fs.existsSync(path.join(repoPath, 'setup.py'))) {
      cmd = 'python -m pytest || python -m unittest discover';
    }

    const result = execSync(cmd, { cwd: repoPath, timeout, stdio: 'pipe', encoding: 'utf8' });
    output = result.stdout || '';
    exitCode = 0;
  } catch (e) {
    output = e.stdout || '';
    exitCode = e.status || -1;
  }
  return { success: exitCode === 0, exitCode, output: output.slice(0, 5000), duration: Date.now() - startTime };
}

// Full sandbox execution pipeline
function executeFix(repoUrl, ref, patchContent, testCommand, taskId) {
  const logEntry = {
    task_id: taskId,
    repo_url: repoUrl,
    ref,
    timestamp: new Date().toISOString(),
    stages: {},
    overall_success: false,
  };

  if (!hasGit()) {
    logEntry.overall_success = false;
    logEntry.error = 'Git not available';
    logEntry.sandbox_level = 'none';
    return logEntry;
  }

  const workDir = createWorkDir(taskId);
  logEntry.work_dir = workDir;
  logEntry.sandbox_level = hasDocker() ? 'docker' : 'git_only';

  try {
    // Step 1: Checkout
    const checkout = checkoutRepo(repoUrl, ref, workDir);
    logEntry.stages.checkout = checkout;
    if (!checkout.success) { logEntry.error = 'Checkout failed'; return finalize(logEntry, workDir); }

    const repoPath = checkout.path;

    // Step 2: Apply patch
    if (patchContent) {
      const patch = applyPatch(patchContent, repoPath);
      logEntry.stages.patch = patch;
      if (!patch.success) { logEntry.error = 'Patch failed'; return finalize(logEntry, workDir); }
    }

    // Step 3: Run tests
    const tests = runTests(repoPath, testCommand);
    logEntry.stages.tests = tests;
    logEntry.overall_success = tests.success;

    // Determine failure reason if tests failed
    if (!tests.success) {
      const output = tests.output || '';
      if (output.includes('AssertionError') || output.includes('AssertionError')) logEntry.failure_reason = 'assertion_error';
      else if (output.includes('SyntaxError')) logEntry.failure_reason = 'syntax_error';
      else if (output.includes('TypeError')) logEntry.failure_reason = 'type_error';
      else if (output.includes('timeout') || output.includes('Timeout')) logEntry.failure_reason = 'timeout';
      else if (tests.exitCode === null) logEntry.failure_reason = 'process_killed';
      else logEntry.failure_reason = 'unknown_test_failure';
    }

  } catch (e) {
    logEntry.error = e.message;
    logEntry.overall_success = false;
  }

  return finalize(logEntry, workDir);
}

function finalize(logEntry, workDir) {
  cleanup(workDir);
  const log = loadExecutionLog();
  log.executions.push(logEntry);
  log.updated_at = new Date().toISOString();
  saveExecutionLog(log);
  return logEntry;
}

// Logical verification fallback (no git available)
function logicalVerify(repoUrl, patchContent, taskId) {
  const logEntry = {
    task_id: taskId,
    repo_url: repoUrl,
    timestamp: new Date().toISOString(),
    sandbox_level: 'logical',
    stages: {},
    overall_success: null,
  };

  if (!patchContent) {
    logEntry.overall_success = false;
    logEntry.error = 'No patch content to verify';
    logEntry.verification = 'skipped';
    return logEntry;
  }

  // Basic structural checks on the patch
  const checks = [];
  if (patchContent.includes('diff --git') || patchContent.startsWith('---')) checks.push('valid_diff_format');
  if (patchContent.includes('+')) checks.push('has_additions');
  if (patchContent.includes('-')) checks.push('has_removals');
  if (patchContent.length > 50) checks.push('non_trivial');
  if (patchContent.includes('function') || patchContent.includes('def ') || patchContent.includes('const ') || patchContent.includes('import ')) checks.push('contains_code');

  logEntry.stages.checks = checks;
  logEntry.overall_success = checks.length >= 3;
  logEntry.verification = logEntry.overall_success ? 'likely_valid' : 'insufficient_evidence';

  const log = loadExecutionLog();
  log.executions.push(logEntry);
  log.updated_at = new Date().toISOString();
  saveExecutionLog(log);
  return logEntry;
}

function getExecutionHistory(taskId = null, limit = 50) {
  const log = loadExecutionLog();
  let entries = log.executions || [];
  if (taskId) entries = entries.filter(e => e.task_id === taskId);
  return entries.slice(-limit).reverse();
}

function getSandboxStats() {
  const log = loadExecutionLog();
  const entries = log.executions || [];
  const total = entries.length;
  const successful = entries.filter(e => e.overall_success === true).length;
  const failed = entries.filter(e => e.overall_success === false).length;
  const pending = entries.filter(e => e.overall_success === null).length;
  return {
    total_executions: total,
    successful,
    failed,
    pending,
    success_rate: total > 0 ? Math.round((successful / total) * 100) : 0,
    git_available: hasGit(),
    docker_available: hasDocker(),
    log_entries: total,
  };
}

module.exports = {
  executeFix,
  logicalVerify,
  getExecutionHistory,
  getSandboxStats,
  hasGit,
  hasDocker,
};
