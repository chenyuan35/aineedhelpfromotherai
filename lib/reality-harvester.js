// lib/reality-harvester.js — Deep Reality Sampling Engine
// Extends reality-ingestor with: deep issue parsing, SO answer mining,
// breakage pattern detection, AI-agent-ecosystem repos.
// Extracts problem/expected/environment/failed_attempts/logs from raw text.

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const HARVEST_DIR = path.join(__dirname, '..', 'data', 'harvest');
const REQUEST_TIMEOUT = 15000;
const MAX_PER_REPO = 15;

// AI-agent ecosystem repos the user specifically called out
const AI_AGENT_REPOS = [
  { owner: 'langchain-ai', repo: 'langchain', label: 'bug' },
  { owner: 'langchain-ai', repo: 'langgraph', label: 'bug' },
  { owner: 'All-Hands-AI', repo: 'OpenHands', label: 'bug' },
  { owner: 'crewAIInc', repo: 'crewAI', label: 'bug' },
  { owner: 'n8n-io', repo: 'n8n', label: 'bug' },
  { owner: 'OpenDevin', repo: 'OpenDevin', label: 'bug' },
  { owner: 'continuedev', repo: 'continue', label: 'bug' },
  { owner: 'Significant-Gravitas', repo: 'AutoGPT', label: 'bug' },
  { owner: 'modelcontextprotocol', repo: 'servers', label: 'bug' },
  { owner: 'modelcontextprotocol', repo: 'specification', label: 'bug' },
  { owner: 'modelcontextprotocol', repo: 'typescript-sdk', label: 'bug' },
  { owner: 'anthropics', repo: 'claude-code', label: 'bug' },
  { owner: 'openai', repo: 'openai-python', label: 'bug' },
  { owner: 'openai', repo: 'openai-node', label: 'bug' },
  { owner: 'vercel', repo: 'ai', label: 'bug' },
  { owner: 'microsoft', repo: 'genaiscript', label: 'bug' },
];

// Docker/npm/pip breakage repos
const BREAKAGE_REPOS = [
  { owner: 'docker', repo: 'compose', label: 'bug' },
  { owner: 'docker', repo: 'docker-pinata', label: 'bug' },
  { owner: 'moby', repo: 'moby', label: 'bug' },
  { owner: 'npm', repo: 'cli', label: 'bug' },
  { owner: 'nodejs', repo: 'node', label: 'bug' },
  { owner: 'pypa', repo: 'pip', label: 'bug' },
  { owner: 'pypa', repo: 'setuptools', label: 'bug' },
  { owner: 'rust-lang', repo: 'cargo', label: 'bug' },
];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const mod = parsed.protocol === 'https:' ? https : http;
    const req = mod.get(url, {
      timeout: REQUEST_TIMEOUT,
      headers: {
        'User-Agent': 'reality-harvester/2.0',
        Accept: 'application/vnd.github.v3+json',
        ...(GITHUB_TOKEN && url.includes('api.github.com') ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
      },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data: null }); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// --- Section Extraction Heuristics ---
// Parses issue body into problem/expected/environment/failed_attempts/logs

const SECTION_MARKERS = [
  { field: 'problem', patterns: [/problem/i, /issue/i, /what happened/i, /bug description/i, /description/i, /current behavior/i] },
  { field: 'expected', patterns: [/expected/i, /expected behavior/i, /what should happen/i, /desired/i] },
  { field: 'environment', patterns: [/environment/i, /system/i, /setup/i, /versions?/i, /os/i, /platform/i] },
  { field: 'failed_attempts', patterns: [/tried/i, /attempted/i, /what i.*?tried/i, /steps to reproduce/i, /to reproduce/i] },
  { field: 'logs', patterns: [/error (log|output)/i, /stack trace/i, /logs?/i, /output/i, /traceback/i] },
];

function extractSections(body) {
  if (!body) return { problem: body || '', expected: '', environment: '', failed_attempts: '', logs: '' };

  const text = body.replace(/\r\n/g, '\n');
  const sections = { problem: '', expected: '', environment: '', failed_attempts: '', logs: '' };

  // Try markdown headings first
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(text)) !== null) {
    headings.push({ index: match.index, heading: match[1].toLowerCase(), raw: match[1] });
  }

  if (headings.length >= 2) {
    for (let i = 0; i < headings.length; i++) {
      const start = headings[i].index;
      const end = headings[i + 1] ? headings[i + 1].index : text.length;
      const content = text.slice(start, end).trim();
      const headingLower = headings[i].heading;

      for (const marker of SECTION_MARKERS) {
        if (marker.patterns.some(p => p.test(headingLower))) {
          const bodyText = content.replace(/^#{1,6}\s+.*$/m, '').trim();
          if (bodyText) sections[marker.field] = bodyText.slice(0, 2000);
          break;
        }
      }
    }
  } else {
    // No structured headings — put everything in problem and try to split by keywords
    sections.problem = text.slice(0, 2000);
    // Search for stack traces
    const stackMatch = text.match(/(at\s+.+?\(.+?\)\s*\n?){2,}/);
    if (stackMatch) sections.logs = stackMatch[0].slice(0, 1500);
    const errorMatch = text.match(/(Error|Exception|Traceback).{0,100}([\s\S]{0,500})/i);
    if (errorMatch && !sections.logs) sections.logs = errorMatch[0].slice(0, 1000);
  }

  return sections;
}

// --- GitHub Issue Harvesting (deep) ---
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function harvestGitHubIssues(repos) {
  const items = [];
  for (const repo of repos) {
    try {
      await delay(200); // rate limit throttle
      const labelQ = repo.label ? `+label:${repo.label}` : '';
      const url = `https://api.github.com/search/issues?q=repo:${repo.owner}/${repo.repo}+state:open+type:issue${labelQ}&sort=updated&order=desc&per_page=${MAX_PER_REPO}`;
      const { status, data } = await fetchJSON(url);
      if (status !== 200 || !data?.items) {
        if (status === 403) break; // rate limited
        continue;
      }

      for (const issue of data.items.slice(0, MAX_PER_REPO)) {
        const sections = extractSections(issue.body || '');
        const body = issue.body || '';
        const category = classifyIssue(repo, body, issue.labels || []);

        items.push({
          id: `HARVEST_GH_${issue.id}`,
          source: 'github',
          repo: `${repo.owner}/${repo.repo}`,
          source_url: issue.html_url,
          title: issue.title,
          difficulty: repo.label === 'bug' ? 'intermediate' : 'beginner',
          tags: (issue.labels || []).map(l => l.name).slice(0, 5),
          category,
          created_at: issue.created_at,
          comments: issue.comments || 0,
          state: issue.state,
          extract: sections,
          raw_body: body.slice(0, 3000),
          priority: sections.logs ? 'HIGH' : sections.failed_attempts ? 'NORMAL' : 'LOW',
        });
      }
    } catch (e) {
      if (e.message === 'Timeout') continue;
    }
  }
  return items;
}

// --- Classify issue by failure pattern ---
function classifyIssue(repo, body, labels) {
  const text = (body || '').toLowerCase();
  const labelNames = (labels || []).map(l => l.name.toLowerCase()).join(' ');

  if (labelNames.includes('docker') || repo.repo.includes('docker') || repo.repo === 'compose' || text.includes('docker')) return 'docker';
  if (labelNames.includes('npm') || repo.repo === 'cli' || text.includes('npm') || text.includes('node_modules') || text.includes('package.json')) return 'npm';
  if (labelNames.includes('pip') || labelNames.includes('python') || text.includes('pip ') || text.includes('requirements.txt')) return 'pip';
  if (text.includes('cargo') || text.includes('rustc') || labelNames.includes('rust')) return 'rust';
  if (text.includes('deprecated') || text.includes('breaking change') || text.includes('removed')) return 'dependency';
  if (text.includes('cli') || text.includes('--flag') || text.includes('command not found') || text.includes('option')) return 'cli';
  if (text.includes('timeout') || text.includes('stuck') || text.includes('hang')) return 'reliability';
  if (labelNames.includes('mcp') || text.includes('modelcontextprotocol')) return 'mcp';
  if (text.includes('cache') || text.includes('stale')) return 'cache';
  if (text.includes('conflict') || text.includes('version mismatch') || text.includes('incompatible')) return 'dependency';

  return repo.repo || 'unknown';
}

// --- Stack Overflow Answer Mining ---
// Fetches answered questions + accepted answer bodies
async function mineStackOverflow() {
  const items = [];
  const tags = ['docker', 'npm', 'node.js', 'typescript', 'python', 'rust', 'next.js', 'react', 'api', 'cli', 'debugging', 'error'];
  const SO_KEY = process.env.STACKEXCHANGE_KEY || '';

  for (const tag of tags) {
    try {
      await delay(300); // rate limit throttle
      const keyParam = SO_KEY ? `&key=${SO_KEY}` : '';
      const url = `https://api.stackexchange.com/2.3/questions?order=desc&sort=votes&tagged=${tag}&site=stackoverflow&pagesize=10&filter=withbody${keyParam}`;
      const { status, data } = await fetchJSON(url);
      if (status !== 200 || !data?.items) continue;

      for (const q of data.items) {
        if (!q.is_answered || !q.accepted_answer_id) continue;
        const sections = extractSections(q.body_markdown || q.body || '');
        const category = classifyIssue({ repo: tag }, q.body_markdown || '', []);

        // Fetch accepted answer body
        let acceptedAnswerBody = '';
        try {
          const ansUrl = `https://api.stackexchange.com/2.3/answers/${q.accepted_answer_id}?order=desc&sort=votes&site=stackoverflow&filter=withbody${keyParam}`;
          const { status: ansStatus, data: ansData } = await fetchJSON(ansUrl);
          if (ansStatus === 200 && ansData?.items?.[0]) {
            acceptedAnswerBody = (ansData.items[0].body_markdown || ansData.items[0].body || '').slice(0, 2000);
          }
        } catch {}

        items.push({
          id: `HARVEST_SO_${q.question_id}`,
          source: 'stackoverflow',
          source_url: q.link,
          accepted_answer_id: q.accepted_answer_id,
          title: q.title,
          body: (q.body_markdown || q.body || '').slice(0, 2000),
          accepted_answer_body: acceptedAnswerBody,
          difficulty: q.score > 5 ? 'advanced' : q.score > 0 ? 'intermediate' : 'beginner',
          tags: q.tags || [],
          category,
          score: q.score || 0,
          answer_count: q.answer_count || 0,
          extract: sections,
          created_at: new Date(q.creation_date * 1000).toISOString(),
          priority: q.score > 10 ? 'HIGH' : 'NORMAL',
        });
      }
    } catch (e) {
      if (e.message === 'Timeout') continue;
    }
  }
  return items;
}

// --- Breakage Pattern Detector ---
function detectBreakagePattern(item) {
  const text = (item.extract?.problem + ' ' + item.extract?.logs + ' ' + item.raw_body).toLowerCase();
  const patterns = [];

  if (text.includes('version mismatch') || text.includes('incompatible version') || text.includes('requires') && text.includes('but you have')) patterns.push('version_mismatch');
  if (text.includes('stale cache') || text.includes('cache') && text.includes('old') || text.includes('not updating')) patterns.push('stale_cache');
  if (text.includes('--') && text.includes('unknown option') || text.includes('unrecognized') && text.includes('flag')) patterns.push('hallucinated_flag');
  if (text.includes('deprecated') || text.includes('removed in') || text.includes('no longer supported')) patterns.push('deprecated_api');
  if (text.includes('lockfile') || text.includes('package-lock') || text.includes('yarn.lock')) patterns.push('lockfile_conflict');
  if (text.includes('not found') && text.includes('module') || text.includes('cannot find module')) patterns.push('missing_module');
  if (text.includes('timeout') || text.includes('timed out')) patterns.push('timeout');
  if (text.includes('permission') || text.includes('denied') || text.includes('EACCES')) patterns.push('permission_error');
  if (text.includes('conflict') && (text.includes('dependency') || text.includes('merge'))) patterns.push('conflict');
  if (text.includes('out of memory') || text.includes('OOM') || text.includes('heap')) patterns.push('out_of_memory');
  if (text.includes('connection refused') || text.includes('ECONNREFUSED')) patterns.push('connection_error');
  if (text.includes('port') && text.includes('in use')) patterns.push('port_conflict');
  if (text.includes('ETIMEDOUT') || text.includes('ENOTFOUND')) patterns.push('network_error');
  if (text.includes('tls') || text.includes('ssl') || text.includes('certificate')) patterns.push('tls_error');
  if (text.includes('cors') || text.includes('cross-origin')) patterns.push('cors_error');

  return patterns.length > 0 ? patterns : ['unknown'];
}

// --- Closed Issue Verifier ---
// Checks if harvested GitHub issues were closed/resolved
async function verifyClosedIssues(items) {
  for (const item of items) {
    if (item.source !== 'github' || !item.source_url) continue;
    const match = item.source_url.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
    if (!match) continue;
    try {
      const url = `https://api.github.com/repos/${match[1]}/${match[2]}/issues/${match[3]}`;
      const { status, data } = await fetchJSON(url);
      if (status === 200 && data) {
        item.current_state = data.state;
        item.closed_at = data.closed_at || null;
        if (data.state === 'closed' && data.closed_at) {
          item.resolution_status = 'closed';
          // Check if there's a linked PR that resolved it
          if (data.pull_request) item.has_pr = true;
          // Take the issue body as verified solution hint
          if (data.body) item.extract.resolution = data.body.slice(0, 1000);
        } else if (data.state === 'open') {
          item.resolution_status = 'open';
        }
      }
    } catch {}
  }
  return items;
}

// --- Main Harvest ---
async function runHarvest() {
  const results = {
    ai_agent_issues: await harvestGitHubIssues(AI_AGENT_REPOS),
    breakage_issues: await harvestGitHubIssues(BREAKAGE_REPOS),
    stackoverflow: await mineStackOverflow(),
  };

  // Enrich with breakage patterns + verify closed issues
  const allItems = Object.values(results).flat();
  for (const item of allItems) {
    item.breakage_patterns = detectBreakagePattern(item);
  }
  await verifyClosedIssues(allItems.filter(i => i.source === 'github'));

  // Clean old harvest files (keep last 10)
  try {
    const oldFiles = fs.readdirSync(HARVEST_DIR).filter(f => f.startsWith('harvest-') && f.endsWith('.json')).sort();
    while (oldFiles.length > 10) {
      fs.unlinkSync(path.join(HARVEST_DIR, oldFiles.shift()));
    }
  } catch {}

  // Save to disk
  ensureDir(HARVEST_DIR);
  const harvestFile = path.join(HARVEST_DIR, `harvest-${Date.now()}.json`);
  fs.writeFileSync(harvestFile, JSON.stringify({
    harvested_at: new Date().toISOString(),
    summary: {
      ai_agent_issues: results.ai_agent_issues.length,
      breakage_issues: results.breakage_issues.length,
      stackoverflow: results.stackoverflow.length,
      total: allItems.length,
      by_category: {},
      by_breakage: {},
    },
    items: allItems,
  }, null, 2));

  // Compute summary
  const byCategory = {};
  const byBreakage = {};
  for (const item of allItems) {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    for (const bp of item.breakage_patterns) {
      byBreakage[bp] = (byBreakage[bp] || 0) + 1;
    }
  }

  return {
    harvested_at: new Date().toISOString(),
    saved_to: harvestFile,
    ai_agent_issues: results.ai_agent_issues.length,
    breakage_issues: results.breakage_issues.length,
    stackoverflow: results.stackoverflow.length,
    total: allItems.length,
    by_category: byCategory,
    by_breakage: byBreakage,
  };
}

// Load latest harvest
function loadLatestHarvest() {
  ensureDir(HARVEST_DIR);
  const files = fs.readdirSync(HARVEST_DIR)
    .filter(f => f.startsWith('harvest-') && f.endsWith('.json'))
    .sort()
    .reverse();
  if (files.length === 0) return null;
  try {
    return JSON.parse(fs.readFileSync(path.join(HARVEST_DIR, files[0]), 'utf8'));
  } catch { return null; }
}

module.exports = {
  runHarvest,
  loadLatestHarvest,
  extractSections,
  classifyIssue,
  detectBreakagePattern,
  AI_AGENT_REPOS,
  BREAKAGE_REPOS,
  HARVEST_DIR,
};
