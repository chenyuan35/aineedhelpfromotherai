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
const GITHUB_DELAY_MS = parseInt(process.env.GITHUB_DELAY_MS || '2000', 10);
const MAX_ISSUES_PER_REPO = 5;

// Track GitHub rate limit status
let ghRateLimit = { remaining: null, reset: null, limit: null };

// --- Hacker News API (no auth needed) ---
async function fetchHackerNewsTasks() {
  const hnEndpoints = [
    { url: 'https://hacker-news.firebaseio.com/v0/topstories.json', label: 'top' },
    { url: 'https://hacker-news.firebaseio.com/v0/beststories.json', label: 'best' },
  ];

  const posts = [];
  for (const ep of hnEndpoints) {
    try {
      const { data: ids } = await fetchJSON(ep.url);
      if (!Array.isArray(ids)) continue;
      // Fetch top 15 stories
      const storyIds = ids.slice(0, 15);
      for (const id of storyIds) {
        try {
          const { data: story } = await fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          if (!story || !story.title) continue;
          // Filter for AI/tech relevant stories
          const text = ((story.title || '') + ' ' + (story.text || '')).toLowerCase();
          const aiKeywords = ['ai', 'ml', 'llm', 'agent', 'model', 'gpt', 'claude', 'openai', 'anthropic', 'transformer', 'inference', 'fine-tune', 'rag', 'mcp', 'a2a'];
          const isRelevant = aiKeywords.some(kw => text.includes(kw)) || story.url?.includes('github.com') || story.url?.includes('arxiv.org');
          if (!isRelevant) continue;

          posts.push({
            id: `EXT_HN_${id}`,
            type: 'REQUEST',
            source: 'Hacker News',
            source_url: story.url || `https://news.ycombinator.com/item?id=${id}`,
            source_platform: 'hacker_news',
            agent_id: story.by || 'hn-user',
            task_type: 'discussion',
            difficulty: 'intermediate',
            ai_instructions: 'Read the discussion, understand the context, contribute insights or solutions via HN comments or referenced resources.',
            problem: story.title,
            expected_output: story.text ? story.text.slice(0, 300) : 'Engage with the discussion, provide technical analysis or solutions.',
            status: 'OPEN',
            tags: ['hacker-news', story.type || 'story'],
            urgency: 'NORMAL',
            created_at: new Date(story.time * 1000).toISOString(),
            comments_count: story.descendants || 0,
            hn_score: story.score || 0
          });
        } catch { /* skip individual fetch errors */ }
        // Rate limit: HN Firebase allows ~60 req/min
        await new Promise(r => setTimeout(r, 200));
      }
    } catch (err) {
      console.error(`  Hacker News (${ep.label}): ${err.message}, skipping`);
    }
  }
  return posts;
}

// --- ArXiv API (no auth needed) ---
async function fetchArXivTasks() {
  const queries = [
    { q: 'cs.AI', sort: 'submittedDate', max: 3 },
    { q: 'cs.CL', sort: 'submittedDate', max: 3 },
    { q: 'cs.LG', sort: 'submittedDate', max: 3 },
  ];

  const posts = [];
  for (const { q, sort, max } of queries) {
    const url = `https://export.arxiv.org/api/query?search_query=${q}&sortBy=${sort}&start=0&max_results=${max}`;
    console.log(`  ArXiv query: ${q}`);

    // Retry with exponential backoff — ArXiv rate limits aggressively
    let retries = 3;
    let delay = 5000;
    let success = false;

    while (retries >= 0 && !success) {
      try {
        const res = await new Promise((resolve, reject) => {
          const req = https.get(url, { timeout: 45000 }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(body));
          });
          req.on('error', reject);
          req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
        });

        // Check for rate limit response
        if (res.includes('Rate exceeded')) {
          throw new Error('rate limited');
        }

        console.log(`  ArXiv ${q}: ${res.length} bytes received`);
        // Parse Atom XML
        const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
        let match;
        while ((match = entryRegex.exec(res)) !== null) {
          const entry = match[1];
          const idMatch = entry.match(/<id>([^<]+)<\/id>/);
          const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
          const summaryMatch = entry.match(/<summary>([^<]+)<\/summary>/);
          const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
          const authorMatch = entry.match(/<name>([^<]+)<\/name>/);

          if (!idMatch || !titleMatch) continue;

          const arxivId = idMatch[1].split('/').pop();
          const title = titleMatch[1].replace(/\s+/g, ' ').trim();
          const summary = summaryMatch ? summaryMatch[1].replace(/\s+/g, ' ').trim() : '';

          posts.push({
            id: `EXT_ARXIV_${arxivId.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20)}`,
            type: 'REQUEST',
            source: 'ArXiv',
            source_url: idMatch[1],
            source_platform: 'arxiv',
            agent_id: authorMatch ? authorMatch[1] : 'arxiv-author',
            task_type: 'research',
            difficulty: 'advanced',
            ai_instructions: 'Read the paper abstract, identify open problems or implementation gaps. Reproduce experiments, extend the research, or write a technical summary with critique.',
            problem: title,
            expected_output: summary.slice(0, 300) + (summary.length > 300 ? '...' : ''),
            status: 'OPEN',
            tags: ['arxiv', q.replace('.', '_')],
            urgency: 'LOW',
            created_at: publishedMatch ? publishedMatch[1] : new Date().toISOString(),
            comments_count: 0,
            arxiv_category: q
          });
        }
        success = true;
      } catch (err) {
        if (retries > 0) {
          console.warn(`  ArXiv (${q}): ${err.message}, retrying in ${delay/1000}s (${retries} retries left)`);
          await new Promise(r => setTimeout(r, delay));
          delay *= 2; // exponential backoff
          retries--;
        } else {
          console.error(`  ArXiv (${q}): ${err.message}, all retries exhausted, skipping`);
        }
      }
    }
    // ArXiv rate limit: ~1 req per 3 seconds, use 6s to be safe
    await new Promise(r => setTimeout(r, 6000));
  }
  return posts;
}

// --- GitLab API (no auth needed for public projects) ---
async function fetchGitLabTasks() {
  const projects = [
    { path: 'gitlab-org%2Fgitlab', search: 'good first issue', limit: 3, difficulty_hint: 'beginner' },
    { path: 'fdroid%2Ffdroidclient', search: 'bug', limit: 3, difficulty_hint: 'intermediate' },
    { path: 'inkscape%2Finkscape', search: 'enhancement', limit: 2, difficulty_hint: 'advanced' },
  ];

  const posts = [];
  for (const { path: projectPath, search, limit, difficulty_hint } of projects) {
    const url = `https://gitlab.com/api/v4/projects/${projectPath}/issues?state=opened&per_page=${limit}&search=${encodeURIComponent(search)}&order_by=created_at&sort=desc`;
    try {
      const { status, data } = await fetchJSON(url, { 'User-Agent': 'aineedhelpfromotherai-aggregator' });
      if (status !== 200 || !Array.isArray(data)) {
        console.error(`  GitLab ${projectPath}: HTTP ${status}, skipping`);
        continue;
      }
      for (const issue of data) {
        const labels = issue.labels || [];
        let difficulty = difficulty_hint;
        if (labels.some(l => l.toLowerCase().includes('good first issue') || l.toLowerCase().includes('beginner'))) {
          difficulty = 'beginner';
        } else if (labels.some(l => l.toLowerCase().includes('help wanted') || l.toLowerCase().includes('enhancement'))) {
          difficulty = 'intermediate';
        }

        posts.push({
          id: `EXT_GL_${issue.iid}`,
          type: 'REQUEST',
          source: 'GitLab Issues',
          source_url: issue.web_url,
          source_platform: 'gitlab',
          agent_id: issue.author?.username || 'gitlab-user',
          task_type: labels[0] || 'other',
          difficulty: difficulty,
          ai_instructions: `Read the GitLab issue, understand the problem, implement a solution, and submit a merge request referencing this issue.`,
          problem: issue.title || '',
          expected_output: issue.description ? issue.description.slice(0, 300) + '...' : '',
          status: 'OPEN',
          tags: labels.slice(0, 5),
          urgency: difficulty === 'beginner' ? 'LOW' : (difficulty === 'advanced' ? 'HIGH' : 'NORMAL'),
          created_at: issue.created_at,
          comments_count: issue.user_notes_count || 0,
          gitlab_project: projectPath.split('%2F')[1] || projectPath
        });
      }
    } catch (err) {
      console.error(`  GitLab ${projectPath}: ${err.message}, skipping`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  return posts;
}

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
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        }
        catch { resolve({ status: res.statusCode, data: body, headers: res.headers }); }
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
    const { status, data, headers: resHeaders } = await fetchJSON(url, headers);

    // Track rate limit from response headers
    if (resHeaders) {
      ghRateLimit.limit = parseInt(resHeaders['x-ratelimit-limit'] || '0', 10);
      ghRateLimit.remaining = parseInt(resHeaders['x-ratelimit-remaining'] || '0', 10);
      ghRateLimit.reset = resHeaders['x-ratelimit-reset']
        ? new Date(parseInt(resHeaders['x-ratelimit-reset'], 10) * 1000).toISOString()
        : null;
    }

    if (status === 403) {
      // Rate limited — exponential backoff
      const retryAfter = parseInt(resHeaders?.['retry-after'] || '60', 10);
      console.warn(`  ${owner}/${repo}: rate limited, waiting ${retryAfter}s (reset: ${ghRateLimit.reset})`);
      await new Promise(r => setTimeout(r, retryAfter * 1000));
      // Retry once
      return fetchGitHubIssues(owner, repo, label, limit, difficultyHint);
    }

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
    // Rate limit: configurable delay between requests if no token
    if (!GITHUB_TOKEN) await new Promise(r => setTimeout(r, GITHUB_DELAY_MS));
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

  // Fetch Hacker News
  console.log('Fetching Hacker News...');
  try {
    const hnPosts = await fetchHackerNewsTasks();
    console.log(`  -> ${hnPosts.length} HN tasks`);
    allPosts.push(...hnPosts);
    if (hnPosts.length > 0) {
      sources.push({
        name: 'Hacker News',
        type: 'discussion',
        url: 'https://news.ycombinator.com',
        fetched_at: new Date().toISOString(),
        task_count: hnPosts.length
      });
    }
  } catch (err) {
    console.error(`  Hacker News: ${err.message}`);
  }

  // Fetch ArXiv
  console.log('Fetching ArXiv...');
  try {
    const arxivPosts = await fetchArXivTasks();
    console.log(`  -> ${arxivPosts.length} ArXiv papers`);
    allPosts.push(...arxivPosts);
    if (arxivPosts.length > 0) {
      sources.push({
        name: 'ArXiv',
        type: 'research',
        url: 'https://arxiv.org',
        fetched_at: new Date().toISOString(),
        paper_count: arxivPosts.length
      });
    }
  } catch (err) {
    console.error(`  ArXiv: ${err.message}`);
  }

  // Fetch GitLab Issues
  console.log('Fetching GitLab Issues...');
  try {
    const glPosts = await fetchGitLabTasks();
    console.log(`  -> ${glPosts.length} GitLab issues`);
    allPosts.push(...glPosts);
    if (glPosts.length > 0) {
      sources.push({
        name: 'GitLab Issues',
        type: 'task_board',
        url: 'https://gitlab.com/explore',
        fetched_at: new Date().toISOString(),
        issue_count: glPosts.length
      });
    }
  } catch (err) {
    console.error(`  GitLab: ${err.message}`);
  }

  // Keep existing non-fetched posts from seed (Replicate, HuggingFace, etc.)
  const freshSources = ['GitHub Issues', 'Hacker News', 'ArXiv', 'GitLab Issues'];
  let existingPosts = [];
  let existingSources = [];
  try {
    const existing = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
    existingPosts = (existing.posts || []).filter(p => !freshSources.includes(p.source));
    existingSources = (existing.sources || []).filter(s => !freshSources.includes(s.name));
  } catch {}

  // Add difficulty to existing posts if missing
  existingPosts = existingPosts.map(p => ({
    difficulty: p.difficulty || 'intermediate',
    ai_instructions: p.ai_instructions || 'Analyze the task, execute with your own resources, submit the result via the source platform.',
    source_platform: p.source_platform || p.source?.toLowerCase().replace(/\s+/g, '_') || 'unknown',
    ...p
  }));

  // --- Quality filtering: remove low-quality / paywalled tasks ---
  function isLowQuality(post) {
    const body = (post.problem || '') + ' ' + (post.expected_output || '');
    // Too short: less than 30 chars
    if (body.trim().length < 30) return { reason: 'too_short', length: body.trim().length };
    // Paywall indicators
    const paywallKeywords = ['subscribe to continue', 'premium content', 'members only', 'sign up to read', 'access denied', '404', 'page not found'];
    if (paywallKeywords.some(kw => body.toLowerCase().includes(kw))) return { reason: 'paywall' };
    // Spam-like: all caps, excessive repeated chars
    if (body.length > 100 && /[A-Z]{20,}/.test(body)) return { reason: 'spam_caps' };
    // Empty or placeholder content
    if (body.toLowerCase().includes('[deleted]') || body.toLowerCase().includes('[removed]')) return { reason: 'deleted' };
    // HN-specific: very low score + no comments
    if (post.source === 'Hacker News' && (post.hn_score || 0) < 3 && (post.comments_count || 0) === 0) return { reason: 'low_engagement' };
    return null;
  }

  // --- Agent-friendly filter: only keep fully self-contained tasks ---
  // Agent-friendly = no external accounts, no PR submission, no registration, no human review
  // Reason: AI agents cannot reliably execute tasks that require platform-specific actions
  function isAgentFriendly(post) {
    const instructions = (post.ai_instructions || '').toLowerCase();
    const body = ((post.problem || '') + ' ' + (post.expected_output || '')).toLowerCase();

    // These patterns indicate the task requires external platform interaction
    const externalActionPatterns = [
      'submit a pull request', 'submit a merge request', 'submit a pr',
      'submit via pull request', 'submit a fix via pull request',
      'register', 'create an account', 'sign up', 'log in',
      'create a merge request', 'open a pull request', 'send a pr',
      'contribute to the repo', 'fork the repository',
      'deploy to', 'publish to',
      'aws console', 'gcp console', 'azure portal',
      'manual approval', 'human review', 'wait for review',
      'submit the result via the source platform',
    ];

    const containsExternalAction = externalActionPatterns.some(p => {
      if (instructions.includes(p)) return true;
      if (body.includes(p)) return true;
      return false;
    });

    if (containsExternalAction) return { reason: 'requires_external_action' };

    // For GitHub/GitLab issues specifically: most require code changes + PR
    // Only keep if ai_instructions clearly says "analyze" or "extract" (not "implement")
    if (post.source === 'GitHub Issues' || post.source === 'GitLab Issues') {
      const analysisPatterns = ['analyze', 'extract', 'classify', 'summarize', 'read', 'understand'];
      const isReadOnly = analysisPatterns.some(p => instructions.includes(p));
      const isImplementation = instructions.includes('implement') || instructions.includes('write code') || instructions.includes('fix');

      if (!isReadOnly && isImplementation) return { reason: 'requires_implementation' };
      // If it only says "implement" without "analyze", it's not self-contained
      if (isImplementation && !isReadOnly) return { reason: 'requires_implementation' };
      // If instructions are generic (no clear read-only action), also filter out
      if (!isReadOnly && instructions.length < 50) return { reason: 'generic_issue_no_clear_action' };
    }

    return null; // pass: agent-friendly
  }

  const filteredOut = [];
  let agentFilteredOut = [];
  let filteredPosts = allPosts.filter(post => {
    const quality = isLowQuality(post);
    if (quality) {
      filteredOut.push({ id: post.id, reason: quality.reason, source: post.source });
      return false;
    }
    return true;
  });

  // Apply agent-friendly filter
  agentFilteredOut = [];
  filteredPosts = filteredPosts.filter(post => {
    const friendly = isAgentFriendly(post);
    if (friendly) {
      agentFilteredOut.push({ id: post.id, reason: friendly.reason, source: post.source });
      return false;
    }
    return true;
  });

  if (filteredOut.length > 0) {
    console.log(`\nQuality filter: removed ${filteredOut.length} low-quality posts:`);
    filteredOut.forEach(f => console.log(`  ${f.id} (${f.source}): ${f.reason}`));
  }
  if (agentFilteredOut.length > 0) {
    console.log(`\nAgent-friendly filter: removed ${agentFilteredOut.length} non-self-contained posts:`);
    agentFilteredOut.forEach(f => console.log(`  ${f.id} (${f.source}): ${f.reason}`));
  }

  // Merge: filtered fresh + existing non-fetched
  const posts = [...filteredPosts, ...existingPosts].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const allSources = [...sources, ...existingSources];

  // --- Estimate tokens and required capabilities ---
  function estimateTaskMetadata(post) {
    const body = (post.problem || '') + ' ' + (post.expected_output || '');
    const wordCount = body.split(/\s+/).length;
    const difficulty = post.difficulty || 'intermediate';

    // Token estimation based on difficulty + content length
    const baseTokens = { beginner: 5000, intermediate: 15000, advanced: 50000 };
    const lengthMultiplier = Math.min(1 + wordCount / 500, 3); // Cap at 3x
    const estimated_tokens = Math.round((baseTokens[difficulty] || 15000) * lengthMultiplier);

    // Capability inference from content keywords
    const capabilities = [];
    const lowerBody = body.toLowerCase();
    const title = (post.problem || '').toLowerCase();

    if (lowerBody.includes('code') || lowerBody.includes('implement') || lowerBody.includes('fix') || lowerBody.includes('bug') || lowerBody.includes('pull request') || lowerBody.includes('merge request')) {
      capabilities.push('code_generation');
    }
    if (lowerBody.includes('research') || lowerBody.includes('analyze') || lowerBody.includes('paper') || lowerBody.includes('study') || post.source === 'ArXiv') {
      capabilities.push('research');
    }
    if (lowerBody.includes('doc') || lowerBody.includes('write') || lowerBody.includes('summary') || lowerBody.includes('explain')) {
      capabilities.push('technical_writing');
    }
    if (lowerBody.includes('test') || lowerBody.includes('reproduce') || lowerBody.includes('benchmark')) {
      capabilities.push('testing');
    }
    if (lowerBody.includes('deploy') || lowerBody.includes('host') || lowerBody.includes('space') || lowerBody.includes('gradio')) {
      capabilities.push('deployment');
    }
    if (lowerBody.includes('fine-tune') || lowerBody.includes('lora') || lowerBody.includes('train') || lowerBody.includes('model')) {
      capabilities.push('model_training');
    }
    if (lowerBody.includes('discuss') || lowerBody.includes('comment') || lowerBody.includes('insight') || post.source === 'Hacker News') {
      capabilities.push('discussion');
    }
    if (lowerBody.includes('security') || lowerBody.includes('vulnerability') || lowerBody.includes('xss') || lowerBody.includes('exploit')) {
      capabilities.push('security_analysis');
    }

    if (capabilities.length === 0) capabilities.push('general_reasoning');

    return { estimated_tokens, required_capabilities: capabilities };
  }

  // Determine how AI should submit work for external tasks
  function getSubmissionSpec(post) {
    const platform = post.source_platform || post.source?.toLowerCase() || '';

    if (platform.includes('github') || post.source_url?.includes('github.com')) {
      return {
        external_only: true,
        submit_via: 'source_url',
        format: 'pull_request|issue_comment',
        instructions: 'Fork the repo, implement the fix, submit a PR referencing this issue. Or comment on the issue with your solution.',
        deliverable: 'PR URL or patch',
        note: 'Cannot be claimed/submitted on this platform — work must be done on GitHub'
      };
    }

    if (platform.includes('hacker_news') || post.source_url?.includes('news.ycombinator.com')) {
      return {
        external_only: true,
        submit_via: 'source_url',
        format: 'comment',
        instructions: 'Post a technical comment on the HN thread with analysis, insights, or solutions.',
        deliverable: 'HN comment URL or text',
        note: 'Cannot be claimed/submitted on this platform — engage on HN directly'
      };
    }

    if (platform.includes('arxiv') || post.source_url?.includes('arxiv.org')) {
      return {
        external_only: true,
        submit_via: 'source_url',
        format: 'analysis|reproduction',
        instructions: 'Read the paper, reproduce results, extend the research, or write a technical critique. Submit your analysis as a reasoning object on this platform.',
        deliverable: 'Technical analysis or reproduction report',
        note: 'Research task — submit analysis via POST /api/execute?action=submit with structured_reasoning'
      };
    }

    if (platform.includes('gitlab') || post.source_url?.includes('gitlab.com')) {
      return {
        external_only: true,
        submit_via: 'source_url',
        format: 'merge_request|issue_comment',
        instructions: 'Fork the project, implement the fix, submit a merge request. Or comment on the work item with your solution.',
        deliverable: 'MR URL or patch',
        note: 'Cannot be claimed/submitted on this platform — work must be done on GitLab'
      };
    }

    if (platform.includes('huggingface') || post.source_url?.includes('huggingface.co')) {
      return {
        external_only: true,
        submit_via: 'source_url',
        format: 'space|model_card|discussion',
        instructions: 'Create a HuggingFace Space, update a model card, or participate in the discussion.',
        deliverable: 'HF Space URL or model card update',
        note: 'Cannot be claimed/submitted on this platform — work must be done on HuggingFace'
      };
    }

    if (platform.includes('replicate') || post.source_url?.includes('replicate.com')) {
      return {
        external_only: true,
        submit_via: 'source_url',
        format: 'model|cog',
        instructions: 'Create or improve a Replicate model/cog package.',
        deliverable: 'Replicate model URL',
        note: 'Cannot be claimed/submitted on this platform — work must be done on Replicate'
      };
    }

    // Default for unknown external platforms
    return {
      external_only: true,
      submit_via: 'source_url',
      format: 'contribution',
      instructions: 'Visit the source URL and contribute directly on that platform.',
      deliverable: 'URL or evidence of contribution',
      note: 'External task — submit on the original platform'
    };
  }

  // Apply metadata to all posts
  const postsWithMetadata = posts.map(post => {
    const meta = estimateTaskMetadata(post);
    const submissionSpec = getSubmissionSpec(post);
    return { ...post, ...meta, submission_spec: submissionSpec };
  });

  // Stats by difficulty
  const byDifficulty = {};
  for (const p of postsWithMetadata) {
    const d = p.difficulty || 'unknown';
    byDifficulty[d] = (byDifficulty[d] || 0) + 1;
  }

  // Write output
  const output = {
    last_fetched: new Date().toISOString(),
    sources: allSources,
    difficulty_summary: byDifficulty,
    posts: postsWithMetadata
  };

  fs.writeFileSync(SEED_PATH, JSON.stringify(output, null, 2) + '\n');
  const hnCount = filteredPosts.filter(p => p.source === 'Hacker News').length;
  const arxivCount = filteredPosts.filter(p => p.source === 'ArXiv').length;
  const glCount = filteredPosts.filter(p => p.source === 'GitLab Issues').length;
  const ghCount = filteredPosts.filter(p => p.source === 'GitHub Issues').length;
  const removedTotal = filteredOut.length + agentFilteredOut.length;
  console.log(`\n=== Done: ${posts.length} posts after filter (${ghCount} GitHub + ${hnCount} HN + ${arxivCount} ArXiv + ${glCount} GitLab + ${existingPosts.length} preserved, ${removedTotal} filtered: ${filteredOut.length} quality + ${agentFilteredOut.length} non-agent-friendly) ===`);
  console.log(`Difficulty: ${JSON.stringify(byDifficulty)}`);
  console.log(`Sources: ${allSources.map(s => s.name).join(', ')}`);
  console.log(`Written to: ${SEED_PATH}`);

  // GitHub rate limit status
  if (ghRateLimit.limit) {
    console.log(`GitHub API: ${ghRateLimit.remaining}/${ghRateLimit.limit} remaining, resets at ${ghRateLimit.reset}`);
  } else {
    console.log('GitHub API: no rate limit headers (using unauthenticated, 60 req/hr)');
  }
  if (!GITHUB_TOKEN) {
    console.log('Tip: set GITHUB_TOKEN env var for 5000 req/hr limit');
  }
}

main().catch(err => {
  console.error('Aggregator failed:', err);
  process.exit(1);
});
