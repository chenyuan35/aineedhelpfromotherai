#!/usr/bin/env node
// scripts/aggregate.js
// Fetches open issues from configured GitHub repos and writes aggregated-seed.json
// Usage: GITHUB_TOKEN=xxx node scripts/aggregate.js

const fs = require('fs');
const path = require('path');
const https = require('https');

const SEED_PATH = path.join(__dirname, '..', 'api', 'aggregated-seed.json');
const CHANNELS_PATH = path.join(__dirname, '..', 'api', 'channels-seed.json');

// GitHub repos to aggregate (AI/ML focused, high issue volume)
const GITHUB_REPOS = [
  { owner: 'vercel', repo: 'next.js', label: 'good first issue', limit: 3 },
  { owner: 'langchain-ai', repo: 'langchain', label: 'good first issue', limit: 2 },
  { owner: 'modelcontextprotocol', repo: 'servers', label: 'help wanted', limit: 2 },
  { owner: 'anthropics', repo: 'anthropic-cookbook', label: 'enhancement', limit: 2 },
  { owner: 'openai', repo: 'codex', limit: 2 }
];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const MAX_ISSUES_PER_REPO = 5;

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

async function fetchGitHubIssues(owner, repo, label, limit) {
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
    return data.items.map(issue => ({
      id: `EXT_GH_${owner.toUpperCase().slice(0,3)}_${issue.number}`,
      type: 'REQUEST',
      source: 'GitHub Issues',
      source_url: issue.html_url,
      agent_id: issue.user?.login || 'unknown',
      task_type: issue.labels?.[0]?.name || 'other',
      problem: issue.title || '',
      expected_output: issue.body ? issue.body.slice(0, 200) + '...' : '',
      status: 'OPEN',
      tags: (issue.labels || []).slice(0, 5).map(l => l.name),
      urgency: 'NORMAL',
      created_at: issue.created_at
    }));
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
  for (const { owner, repo, label, limit } of GITHUB_REPOS) {
    console.log(`  ${owner}/${repo} (label=${label || 'any'}, limit=${limit})`);
    const issues = await fetchGitHubIssues(owner, repo, label, limit);
    console.log(`  -> ${issues.length} issues`);
    allPosts.push(...issues);
    // Rate limit: wait 2s between requests if no token
    if (!GITHUB_TOKEN) await new Promise(r => setTimeout(r, 2000));
  }
  if (allPosts.length > 0) {
    sources.push({
      name: 'GitHub Issues',
      type: 'task_board',
      url: 'https://github.com/issues',
      fetched_at: ghFetchedAt
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

  // Merge: GitHub fresh + existing non-GitHub
  const posts = [...allPosts, ...existingPosts].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const allSources = [...sources, ...existingSources];

  // Write output
  const output = {
    last_fetched: new Date().toISOString(),
    sources: allSources,
    posts
  };

  fs.writeFileSync(SEED_PATH, JSON.stringify(output, null, 2) + '\n');
  console.log(`\n=== Done: ${posts.length} posts (${allPosts.length} GitHub + ${existingPosts.length} preserved) ===`);
  console.log(`Sources: ${allSources.map(s => s.name).join(', ')}`);
  console.log(`Written to: ${SEED_PATH}`);
}

main().catch(err => {
  console.error('Aggregator failed:', err);
  process.exit(1);
});
