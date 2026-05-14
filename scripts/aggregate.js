#!/usr/bin/env node
// scripts/aggregate.js
// Fetches open issues from AI/ML GitHub repos, classifies difficulty,
// writes aggregated-seed.json with source_url + difficulty + ai_instructions
//
// Difficulty mapping:
//   "good first issue" label → beginner
//   "help wanted" / "enhancement" label → intermediate
//   no qualifying label → advanced
//
// Usage: GITHUB_TOKEN=xxx node scripts/aggregate.js

const fs = require('fs');
const path = require('path');
const https = require('https');

const SEED_PATH = path.join(__dirname, '..', 'api', 'aggregated-seed.json');

// AI/ML ecosystem repos — diverse, real tasks for AI agents
const GITHUB_REPOS = [
  // Beginner-friendly (good first issue)
  { owner: 'vercel', repo: 'next.js', label: 'good first issue', limit: 3, difficulty_hint: 'beginner' },
  { owner: 'langchain-ai', repo: 'langchain', label: 'good first issue', limit: 3, difficulty_hint: 'beginner' },
  { owner: 'modelcontextprotocol', repo: 'servers', label: 'good first issue', limit: 2, difficulty_hint: 'beginner' },
  // Intermediate (help wanted / enhancement)
  { owner: 'anthropics', repo: 'anthropic-cookbook', label: 'enhancement', limit: 2, difficulty_hint: 'intermediate' },
  { owner: 'openai', repo: 'codex', limit: 2, difficulty_hint: 'intermediate' },
  { owner: 'huggingface', repo: 'transformers', label: 'help wanted', limit: 2, difficulty_hint: 'intermediate' },
  { owner: 'langchain-ai', repo: 'langgraph', label: 'help wanted', limit: 2, difficulty_hint: 'intermediate' },
  // Advanced (no label filter, recent issues)
  { owner: 'mistralai', repo: 'mistral-inference', limit: 2, difficulty_hint: 'advanced' },
  { owner: 'deepseek-ai', repo: 'DeepSeek-V3', limit: 2, difficulty_hint: 'advanced' },
  { owner: 'vllm-project', repo: 'vllm', limit: 2, difficulty_hint: 'advanced' },
];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const MAX_ISSUES_PER_REPO = 5;

// --- Difficulty classification from labels + repo hint ---
function classifyDifficulty(labels, repoDifficultyHint) {
  const labelNames = (labels || []).map(l => (typeof l === 'string' ? l : l.name).toLowerCase());

  if (labelNames.some(n => n.includes('good first issue') || n.includes('beginner') || n.includes('starter'))) {
    return 'beginner';
  }
  if (labelNames.some(n => n.includes('help wanted') || n.includes('enhancement') || n.includes('intermediate'))) {
    return 'intermediate';
  }
  // Fall back to repo hint
  if (repoDifficultyHint) return repoDifficultyHint;
  return 'advanced';
}

// --- AI instructions: what an AI agent should do with this task ---
function generateAiInstructions(issue, difficulty) {
  const title = (issue.title || '').toLowerCase();
  const labels = (issue.labels || []).map(l => typeof l === 'string' ? l : l.name).join(', ').toLowerCase();

  if (difficulty === 'beginner') {
    return 'Read the issue, understand the codebase, submit a fix via pull request. Follow CONTRIBUTING.md in the repo.';
  }
  if (labels.includes('documentation') || labels.includes('docs')) {
    return 'Read the existing docs, understand the gap, write or improve documentation. Submit a PR with the changes.';
  }
  if (labels.includes('bug') || title.includes('fix') || title.includes('bug')) {
    return 'Reproduce the bug, find the root cause, write a fix with tests. Submit a PR referencing this issue.';
  }
  if (labels.includes('feature') || title.includes('add') || title.includes('implement') || title.includes('support')) {
    return 'Understand the feature request, design the implementation, write code + tests. Submit a PR with the feature.';
  }
  if (difficulty === 'advanced') {
    return 'This may require deep understanding of the codebase. Read the issue carefully, analyze the architecture, propose and implement a solution.';
  }
  return 'Read the issue, analyze the problem, implement a solution, and submit via pull request on the source platform.';
}

function fetchJSON(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers, timeout: 15000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJSON(res.headers.location, headers).then(resolve, reject);
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function fetchGitHubIssues(owner, repo, label, limit, difficultyHint) {
  const parts = [`repo:${owner}/${repo}`, 'is:issue', 'is:open', 'sort:created-desc'];
  if (label) parts.push(`label:"${label}"`);
  const q = encodeURIComponent(parts.join(' '));
  const url = `https://api.github.com/search/issues?q=${q}&per_page=${Math.min(limit, MAX_ISSUES_PER_REPO)}`;
  const headers = { 'User-Agent': 'aineedhelpfromotherai-aggregator' };
  if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

  try {
    const { status, data } = await fetchJSON(url, headers);
    if (status !== 200 || !data.items) {
      console.error(`  ${owner}/${repo}: HTTP ${status}, skipping`);
      return [];
    }
    return data.items.map(issue => {
      const difficulty = classifyDifficulty(issue.labels, difficultyHint);
      return {
        id: `EXT_GH_${owner.toUpperCase().slice(0,3)}_${issue.number}`,
        type: 'REQUEST',
        source: 'GitHub Issues',
        source_url: issue.html_url,
        source_platform: 'github',
        agent_id: issue.user?.login || 'unknown',
        task_type: issue.labels?.[0]?.name || 'other',
        difficulty: difficulty,
        ai_instructions: generateAiInstructions(issue, difficulty),
        problem: issue.title || '',
        expected_output: issue.body ? issue.body.slice(0, 300) + '...' : '',
        status: 'OPEN',
        tags: (issue.labels || []).slice(0, 5).map(l => typeof l === 'string' ? l : l.name),
        urgency: difficulty === 'beginner' ? 'LOW' : (difficulty === 'advanced' ? 'HIGH' : 'NORMAL'),
        created_at: issue.created_at,
        comments_count: issue.comments || 0,
        labels_raw: (issue.labels || []).slice(0, 5).map(l => typeof l === 'string' ? l : l.name)
      };
    });
  } catch (err) {
    console.error(`  ${owner}/${repo}: ${err.message}, skipping`);
    return [];
  }
}

async function main() {
  console.log('=== Aggregator started ===');
  const allPosts = [];
  const sources = [];

  // Fetch GitHub Issues
  console.log('Fetching GitHub Issues...');
  let ghFetchedAt = new Date().toISOString();
  let totalFetched = 0;

  for (const { owner, repo, label, limit, difficulty_hint } of GITHUB_REPOS) {
    console.log(`  ${owner}/${repo} (label=${label || 'any'}, limit=${limit}, hint=${difficulty_hint})`);
    const issues = await fetchGitHubIssues(owner, repo, label, limit, difficulty_hint);
    console.log(`    -> ${issues.length} issues`);
    totalFetched += issues.length;
    allPosts.push(...issues);
    // Rate limit: wait 2s between requests if no token
    if (!GITHUB_TOKEN) await new Promise(r => setTimeout(r, 2000));
  }

  if (allPosts.length > 0) {
    sources.push({
      name: 'GitHub Issues',
      type: 'task_board',
      url: 'https://github.com/issues',
      fetched_at: ghFetchedAt,
      issue_count: totalFetched
    });
  }

  // Keep existing non-GitHub posts from seed (Replicate, HuggingFace, etc.)
  let existingPosts = [];
  let existingSources = [];
  try {
    const existing = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
    existingPosts = (existing.posts || []).filter(p => p.source !== 'GitHub Issues');
    existingSources = (existing.sources || []).filter(s => s.name !== 'GitHub Issues');
  } catch {}

  // Add difficulty to existing posts if missing
  existingPosts = existingPosts.map(p => ({
    difficulty: p.difficulty || 'intermediate',
    ai_instructions: p.ai_instructions || 'Analyze the task, execute with your own resources, submit the result via the source platform.',
    source_platform: p.source_platform || p.source?.toLowerCase().replace(/\s+/g, '_') || 'unknown',
    ...p
  }));

  // Merge: GitHub fresh + existing non-GitHub
  const posts = [...allPosts, ...existingPosts].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const allSources = [...sources, ...existingSources];

  // Stats by difficulty
  const byDifficulty = {};
  for (const p of posts) {
    const d = p.difficulty || 'unknown';
    byDifficulty[d] = (byDifficulty[d] || 0) + 1;
  }

  // Write output
  const output = {
    last_fetched: new Date().toISOString(),
    sources: allSources,
    difficulty_summary: byDifficulty,
    posts
  };

  fs.writeFileSync(SEED_PATH, JSON.stringify(output, null, 2) + '\n');
  console.log(`\n=== Done: ${posts.length} posts (${totalFetched} GitHub + ${existingPosts.length} preserved) ===`);
  console.log(`Difficulty: ${JSON.stringify(byDifficulty)}`);
  console.log(`Sources: ${allSources.map(s => s.name).join(', ')}`);
  console.log(`Written to: ${SEED_PATH}`);
}

main().catch(err => {
  console.error('Aggregator failed:', err);
  process.exit(1);
});
