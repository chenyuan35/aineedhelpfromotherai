// lib/reality-ingestor.js — Continuous real-world issue ingestion
// Polls GitHub Issues, Stack Overflow, HN bug threads, MCP repos, npm breakages, Docker issues
// Stores as reality-tasks.json for system contamination

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DATA_PATH = path.join(__dirname, '..', 'data', 'reality-tasks.json');
const MAX_TASKS_PER_SOURCE = 10;
const REQUEST_TIMEOUT = 15000;

// --- GitHub Issues (bugs + feature requests in AI/ML ecosystem) ---
const GITHUB_REPOS = [
  { owner: 'vercel', repo: 'next.js', label: 'bug', difficulty: 'intermediate' },
  { owner: 'langchain-ai', repo: 'langchain', label: 'bug', difficulty: 'intermediate' },
  { owner: 'modelcontextprotocol', repo: 'servers', label: 'bug', difficulty: 'intermediate' },
  { owner: 'huggingface', repo: 'transformers', label: 'bug', difficulty: 'advanced' },
  { owner: 'openai', repo: 'openai-python', label: 'bug', difficulty: 'intermediate' },
  { owner: 'microsoft', repo: 'vscode', label: 'bug', difficulty: 'intermediate' },
  { owner: 'npm', repo: 'cli', label: 'bug', difficulty: 'intermediate' },
  { owner: 'docker', repo: 'docker.github.io', label: 'bug', difficulty: 'beginner' },
  { owner: 'nodejs', repo: 'node', label: 'bug', difficulty: 'advanced' },
  { owner: 'expressjs', repo: 'express', label: 'bug', difficulty: 'beginner' },
];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const mod = parsed.protocol === 'https:' ? https : http;
    const req = mod.get(url, { ...options, timeout: REQUEST_TIMEOUT, headers: { 'User-Agent': 'aineedhelp-ingestor/1.0', ...(GITHUB_TOKEN && url.includes('api.github.com') ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}) } }, (res) => {
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

async function fetchGitHubIssues() {
  const tasks = [];
  for (const repo of GITHUB_REPOS) {
    try {
      const labelQ = repo.label ? `+label:${repo.label}` : '';
      const url = `https://api.github.com/search/issues?q=repo:${repo.owner}/${repo.repo}+state:open+type:issue${labelQ}&sort=created&order=desc&per_page=${MAX_TASKS_PER_SOURCE}`;
      const { status, data } = await fetchJSON(url);
      if (status !== 200 || !data?.items) continue;
      for (const issue of data.items.slice(0, MAX_TASKS_PER_SOURCE)) {
        tasks.push({
          id: `RL_GH_${issue.id}`,
          source: 'github',
          source_url: issue.html_url,
          title: issue.title,
          body: (issue.body || '').slice(0, 2000),
          difficulty: repo.difficulty || 'intermediate',
          tags: (issue.labels || []).map(l => l.name),
          created_at: issue.created_at,
          comments_count: issue.comments || 0,
          repo: `${repo.owner}/${repo.repo}`,
          reality_type: 'bug',
          priority: issue.score > 5 ? 'HIGH' : 'NORMAL',
        });
      }
    } catch (e) { /* skip repo on error */ }
  }
  return tasks;
}

// --- Stack Overflow (unanswered questions in high-traffic tags) ---
const SO_TAGS = ['javascript', 'python', 'node.js', 'react', 'docker', 'typescript', 'next.js', 'api', 'express', 'debugging'];
const SO_KEY = process.env.STACKEXCHANGE_KEY || '';

async function fetchStackOverflow() {
  const tasks = [];
  for (const tag of SO_TAGS) {
    try {
      const keyParam = SO_KEY ? `&key=${SO_KEY}` : '';
      const url = `https://api.stackexchange.com/2.3/questions/unanswered?order=desc&sort=creation&tagged=${tag}&site=stackoverflow&pagesize=5${keyParam}`;
      const { status, data } = await fetchJSON(url);
      if (status !== 200 || !data?.items) continue;
      for (const q of data.items.slice(0, 3)) {
        tasks.push({
          id: `RL_SO_${q.question_id}`,
          source: 'stackoverflow',
          source_url: q.link,
          title: q.title,
          body: (q.body_markdown || q.body || '').slice(0, 1500),
          difficulty: q.score > 2 ? 'advanced' : q.score > 0 ? 'intermediate' : 'beginner',
          tags: q.tags || [],
          created_at: new Date(q.creation_date * 1000).toISOString(),
          comments_count: q.comment_count || 0,
          score: q.score || 0,
          answer_count: q.answer_count || 0,
          reality_type: 'unanswered_question',
          priority: q.answer_count === 0 && q.score > 0 ? 'HIGH' : 'NORMAL',
        });
      }
    } catch (e) { /* skip */ }
  }
  return tasks;
}

// --- Hacker News (bug threads + AI discussions) ---
const HN_KEYWORDS = ['bug', 'error', 'issue', 'crash', 'vulnerability', 'attack', 'breach', 'fail', 'broken', 'regression'];

async function fetchHackerNews() {
  const tasks = [];
  try {
    const { data: ids } = await fetchJSON('https://hacker-news.firebaseio.com/v0/newstories.json');
    if (!Array.isArray(ids)) return tasks;
    const batch = ids.slice(0, 30);
    for (const id of batch) {
      try {
        const { data: item } = await fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        if (!item || !item.title) continue;
        const text = ((item.title || '') + ' ' + (item.text || '')).toLowerCase();
        const isBugRelevant = HN_KEYWORDS.some(kw => text.includes(kw));
        if (!isBugRelevant && !item.url) continue;
        tasks.push({
          id: `RL_HN_${id}`,
          source: 'hacker_news',
          source_url: item.url || `https://news.ycombinator.com/item?id=${id}`,
          title: item.title,
          body: (item.text || '').slice(0, 1000),
          difficulty: item.descendants > 20 ? 'advanced' : 'intermediate',
          tags: item.url?.includes('github.com') ? ['github'] : [],
          created_at: new Date(item.time * 1000).toISOString(),
          comments_count: item.descendants || 0,
          score: item.score || 0,
          reality_type: 'bug_discussion',
          priority: item.descendants > 10 ? 'HIGH' : 'NORMAL',
        });
      } catch { /* skip */ }
    }
  } catch { /* skip */ }
  return tasks;
}

// --- MCP Ecosystem (modelcontextprotocol repos + server issues) ---
const MCP_REPOS = [
  { owner: 'modelcontextprotocol', repo: 'servers' },
  { owner: 'modelcontextprotocol', repo: 'specification' },
  { owner: 'modelcontextprotocol', repo: 'typescript-sdk' },
  { owner: 'modelcontextprotocol', repo: 'python-sdk' },
];

async function fetchMCPIssues() {
  const tasks = [];
  for (const repo of MCP_REPOS) {
    try {
      const url = `https://api.github.com/search/issues?q=repo:${repo.owner}/${repo.repo}+state:open+type:issue&sort=updated&order=desc&per_page=5`;
      const { status, data } = await fetchJSON(url);
      if (status !== 200 || !data?.items) continue;
      for (const issue of data.items.slice(0, 3)) {
        tasks.push({
          id: `RL_MCP_${issue.id}`,
          source: 'mcp_ecosystem',
          source_url: issue.html_url,
          title: `[MCP] ${issue.title}`,
          body: (issue.body || '').slice(0, 1500),
          difficulty: 'intermediate',
          tags: ['mcp', ...(issue.labels || []).map(l => l.name)],
          created_at: issue.created_at,
          comments_count: issue.comments || 0,
          repo: `${repo.owner}/${repo.repo}`,
          reality_type: 'mcp_issue',
          priority: 'HIGH',
        });
      }
    } catch { /* skip */ }
  }
  return tasks;
}

// --- npm breakages (recent package issues, deprecated packages) ---
async function fetchNpmIssues() {
  const tasks = [];
  const npmPackages = ['express', 'react', 'next', 'typescript', 'eslint', 'webpack', 'babel', 'nodemon', 'pm2', 'axios'];
  for (const pkg of npmPackages) {
    try {
      const { status, data } = await fetchJSON(`https://registry.npmjs.org/${encodeURIComponent(pkg)}/latest`);
      if (status !== 200 || !data) continue;
      const depCount = data.dependencies ? Object.keys(data.dependencies).length : 0;
      if (depCount > 20) {
        tasks.push({
          id: `RL_NPM_${pkg}`,
          source: 'npm',
          source_url: `https://www.npmjs.com/package/${pkg}`,
          title: `npm package: ${pkg}@${data.version || 'latest'} (${depCount} dependencies)`,
          body: `Package ${pkg} v${data.version || '?'} published. Dependencies: ${depCount}. Description: ${(data.description || '').slice(0, 300)}`,
          difficulty: 'intermediate',
          tags: ['npm', pkg],
          created_at: new Date().toISOString(),
          comments_count: 0,
          reality_type: 'npm_package',
          priority: depCount > 30 ? 'HIGH' : 'NORMAL',
          metadata: { version: data.version, dep_count: depCount },
        });
      }
    } catch { /* skip */ }
  }
  // Fetch known vulnerabilities
  try {
    const { status, data } = await fetchJSON('https://registry.npmjs.org/-/npm/v1/security/advisories?perPage=10');
    if (status === 200 && data?.advisories) {
      for (const [id, adv] of Object.entries(data.advisories).slice(0, 5)) {
        tasks.push({
          id: `RL_NPM_SEC_${id}`,
          source: 'npm',
          source_url: adv.url || `https://www.npmjs.com/advisories/${id}`,
          title: `[SECURITY] ${adv.title || 'npm advisory'}`,
          body: (adv.overview || adv.description || '').slice(0, 1500),
          difficulty: 'advanced',
          tags: ['npm', 'security', 'vulnerability'],
          created_at: adv.created_at || new Date().toISOString(),
          comments_count: 0,
          reality_type: 'vulnerability',
          priority: adv.cvss_score > 7 ? 'HIGH' : 'NORMAL',
          metadata: { cvss: adv.cvss_score, package: adv.module_name },
        });
      }
    }
  } catch { /* skip */ }
  return tasks;
}

// --- Docker issues (common Docker problems, image issues) ---
async function fetchDockerIssues() {
  const tasks = [];
  const dockerRepos = [
    { owner: 'docker', repo: 'compose' },
    { owner: 'docker', repo: 'docker-pinata' },
    { owner: 'moby', repo: 'moby' },
  ];
  for (const repo of dockerRepos) {
    try {
      const url = `https://api.github.com/search/issues?q=repo:${repo.owner}/${repo.repo}+state:open+type:issue+label:bug&sort=updated&order=desc&per_page=5`;
      const { status, data } = await fetchJSON(url);
      if (status !== 200 || !data?.items) continue;
      for (const issue of data.items.slice(0, 3)) {
        tasks.push({
          id: `RL_DOCKER_${issue.id}`,
          source: 'docker',
          source_url: issue.html_url,
          title: `[Docker] ${issue.title}`,
          body: (issue.body || '').slice(0, 1500),
          difficulty: 'intermediate',
          tags: ['docker', ...(issue.labels || []).map(l => l.name)],
          created_at: issue.created_at,
          comments_count: issue.comments || 0,
          repo: `${repo.owner}/${repo.repo}`,
          reality_type: 'docker_issue',
          priority: issue.labels?.some(l => l.name === 'critical' || l.name === 'priority/high') ? 'HIGH' : 'NORMAL',
        });
      }
    } catch { /* skip */ }
  }
  return tasks;
}

// --- Deduplicate by checking existing tasks ---
function deduplicate(newTasks) {
  let existing = [];
  try {
    if (fs.existsSync(DATA_PATH)) {
      existing = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    }
  } catch { /* ignore */ }
  const existingIds = new Set((existing.tasks || []).map(t => t.id));
  const existingUrls = new Set((existing.tasks || []).map(t => t.source_url));
  const unique = newTasks.filter(t => !existingIds.has(t.id) && !existingUrls.has(t.source_url));
  return { existing: existing.tasks || [], new: unique };
}

function loadRealityTasks() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    }
  } catch { /* ignore */ }
  return { tasks: [], last_fetched: null, source_stats: {} };
}

function saveTasks(tasks) {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(tasks, null, 2));
}

// --- Main ingestion ---
async function ingestAllSources() {
  const results = { github: [], stackoverflow: [], hackernews: [], mcp: [], npm: [], docker: [] };
  const errors = [];

  await Promise.all([
    fetchGitHubIssues().then(r => results.github = r).catch(e => errors.push(`github: ${e.message}`)),
    fetchStackOverflow().then(r => results.stackoverflow = r).catch(e => errors.push(`stackoverflow: ${e.message}`)),
    fetchHackerNews().then(r => results.hackernews = r).catch(e => errors.push(`hackernews: ${e.message}`)),
    fetchMCPIssues().then(r => results.mcp = r).catch(e => errors.push(`mcp: ${e.message}`)),
    fetchNpmIssues().then(r => results.npm = r).catch(e => errors.push(`npm: ${e.message}`)),
    fetchDockerIssues().then(r => results.docker = r).catch(e => errors.push(`docker: ${e.message}`)),
  ]);

  const allNew = Object.values(results).flat();
  const { existing, new: newTasks } = deduplicate(allNew);

  const updated = {
    tasks: [...existing, ...newTasks.map(t => ({ ...t, ingested_at: new Date().toISOString(), status: 'fresh' }))],
    last_fetched: new Date().toISOString(),
    source_stats: {
      github: results.github.length,
      stackoverflow: results.stackoverflow.length,
      hackernews: results.hackernews.length,
      mcp: results.mcp.length,
      npm: results.npm.length,
      docker: results.docker.length,
      total_new: newTasks.length,
      total_cumulative: existing.length + newTasks.length,
    },
    errors,
  };

  saveTasks(updated);
  return updated;
}

function getRecentTasks(limit = 20) {
  const data = loadRealityTasks();
  return (data.tasks || []).slice(-limit).reverse();
}

function getSourceStats() {
  const data = loadRealityTasks();
  return data.source_stats || {};
}

function getIngestionHealth() {
  const data = loadRealityTasks();
  const tasks = data.tasks || [];
  const bySource = {};
  for (const t of tasks) {
    bySource[t.source] = (bySource[t.source] || 0) + 1;
  }
  return {
    total_tasks: tasks.length,
    by_source: bySource,
    last_fetched: data.last_fetched,
    error_count: (data.errors || []).length,
    recent_errors: (data.errors || []).slice(-3),
    fresh_tasks: tasks.filter(t => t.status === 'fresh').length,
  };
}

// Auto-ingest every 30 minutes
const INTERVAL = 30 * 60 * 1000;
let ingestInterval = null;

function startAutoIngest() {
  if (ingestInterval) return;
  ingestInterval = setInterval(() => {
    ingestAllSources().catch(e => console.error('[reality-ingestor] Auto-ingest error:', e.message));
  }, INTERVAL).unref();
  // Also do immediate first ingest
  ingestAllSources().catch(e => console.error('[reality-ingestor] Initial ingest error:', e.message));
}

function stopAutoIngest() {
  if (ingestInterval) {
    clearInterval(ingestInterval);
    ingestInterval = null;
  }
}

module.exports = {
  ingestAllSources,
  getRecentTasks,
  getSourceStats,
  getIngestionHealth,
  loadRealityTasks,
  startAutoIngest,
  stopAutoIngest,
};
