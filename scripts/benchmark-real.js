#!/usr/bin/env node
// scripts/benchmark-real.js — Real-world benchmark for failure memory
// Simulates: agent fails → submits → another agent searches → measures recall quality
//
// Metrics measured:
//   - recall@1: correct fix in top 1 result
//   - recall@5: correct fix in top 5
//   - precision: relevant / total returned
//   - latency: response time
//   - token_savings: estimated tokens NOT spent re-debugging
//
// Run: node scripts/benchmark-real.js [--seed N] [--verbose]

const https = require('https');
const http = require('http');
const API_BASE = process.env.FAILURE_MEMORY_API || 'https://api.aineedhelpfromotherai.com';

// --- Benchmark scenarios: real-world coding failures ---
// Each scenario: problem description, expected fix keywords, category
const SCENARIOS = [
  {
    id: 'android-pty',
    query: 'Android PTY deadlock tcsetpgrp hangs Node.js spawn',
    fix_keywords: ['O_IGNORE_CTTY', 'tcsetpgrp'],
    category: 'platform',
    difficulty: 'hard',
  },
  {
    id: 'docker-perm',
    query: 'Docker permission denied /var/run/docker.sock connect',
    fix_keywords: ['docker group', 'usermod', 'sudo'],
    category: 'devops',
    difficulty: 'easy',
  },
  {
    id: 'node-module-not-found',
    query: 'Node.js MODULE_NOT_FOUND error after npm install esm package',
    fix_keywords: ['package.json', 'type module', 'import', 'require'],
    category: 'javascript',
    difficulty: 'medium',
  },
  {
    id: 'python-venv',
    query: 'Python venv not activating correctly on Windows PowerShell',
    fix_keywords: ['Activate.ps1', 'execution policy', 'Set-ExecutionPolicy'],
    category: 'python',
    difficulty: 'easy',
  },
  {
    id: 'react-hook-deps',
    query: 'React useEffect infinite loop missing dependency array',
    fix_keywords: ['dependency array', 'useCallback', 'useMemo'],
    category: 'frontend',
    difficulty: 'medium',
  },
  {
    id: 'git-merge-conflict',
    query: 'Git merge conflict in package-lock.json keeps reverting',
    fix_keywords: ['git checkout', 'regenerate', 'npm install'],
    category: 'git',
    difficulty: 'easy',
  },
  {
    id: 'ssl-cert-expired',
    query: 'SSL certificate expired self-signed certificate in development localhost',
    fix_keywords: ['mkcert', 'openssl', 'renew'],
    category: 'devops',
    difficulty: 'medium',
  },
  {
    id: 'memory-leak-closure',
    query: 'JavaScript closure memory leak in setInterval callback not cleaned up',
    fix_keywords: ['clearInterval', 'cleanup', 'useEffect return'],
    category: 'javascript',
    difficulty: 'hard',
  },
  {
    id: 'postgres-connection-pool',
    query: 'PostgreSQL connection pool exhausted too many clients already',
    fix_keywords: ['pool.end', 'max connections', 'release', 'idle timeout'],
    category: 'database',
    difficulty: 'hard',
  },
  {
    id: 'typescript-strict-null',
    query: 'TypeScript strict mode Object is possibly null after optional chaining',
    fix_keywords: ['strictNullChecks', 'type guard', 'optional chaining'],
    category: 'typescript',
    difficulty: 'medium',
  },
];

function apiPost(endpoint, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`);
    const mod = url.protocol === 'https:' ? https : http;
    const data = JSON.stringify(body);
    const start = Date.now();
    const req = mod.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), 'User-Agent': 'benchmark/1.0' },
      timeout: 15000,
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        const latency = Date.now() - start;
        try { resolve({ latency, status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ latency, status: res.statusCode, data: null }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function measureRecall(fixKeywords, verifiedFixes) {
  if (!verifiedFixes || verifiedFixes.length === 0) return { recall_at_1: false, recall_at_5: false, precision: 0, mrr: 0 };

  let bestRank = null;
  for (let i = 0; i < verifiedFixes.length; i++) {
    const text = (verifiedFixes[i].summary || '').toLowerCase();
    const matchCount = fixKeywords.filter(kw => text.includes(kw.toLowerCase())).length;
    if (matchCount >= Math.ceil(fixKeywords.length * 0.5)) {
      bestRank = i + 1;
      break;
    }
  }

  return {
    recall_at_1: bestRank === 1,
    recall_at_5: bestRank !== null && bestRank <= 5,
    mrr: bestRank ? 1 / bestRank : 0,
    precision: bestRank ? 1 / bestRank : 0,
  };
}

let failures = [];
let fixes = [];

async function seedFailures() {
  console.log(`\nSeeding ${SCENARIOS.length} failure scenarios into memory...\n`);
  for (const s of SCENARIOS) {
    console.log(`  📤 Submitting: ${s.id} (${s.difficulty})`);
    const r = await apiPost('/memory/failure', {
      task: `Fix ${s.id}`,
      error: s.query,
      attempted_fix: `Tried approach 1: common fix for ${s.category}. Tried approach 2: stack overflow suggestion. Both failed.`,
      result: 'failed',
      agent_id: 'benchmark-agent',
    });
    if (r.data?.success) failures.push(s);
    if (!r.data?.success) console.log(`  ⚠ Submit failed: ${JSON.stringify(r.data)}`);
  }
  console.log(`\n  ✅ ${failures.length}/${SCENARIOS.length} scenarios seeded`);
}

async function searchScenarios() {
  console.log(`\nSearching memory for each scenario...\n`);
  const results = [];

  for (const s of SCENARIOS) {
    const r = await apiPost('/memory/search', { query: s.query, limit: 10 });
    const recall = measureRecall(s.fix_keywords, r.data?.verified_fixes || []);

    results.push({
      id: s.id,
      difficulty: s.difficulty,
      category: s.category,
      query: s.query.slice(0, 50),
      latency_ms: r.latency,
      total_fixes: r.data?.total_fixes || 0,
      total_failures: r.data?.total_failures || 0,
      ...recall,
      top_summary: r.data?.verified_fixes?.[0]?.summary?.slice(0, 80) || '(none)',
    });

    const status = recall.recall_at_1 ? '✅' : recall.recall_at_5 ? '🟡' : '❌';
    console.log(`  ${status} ${s.id} (${s.difficulty}) recall@1=${recall.recall_at_1} recall@5=${recall.recall_at_5} mrr=${recall.mrr.toFixed(2)} latency=${r.latency}ms`);
  }

  return results;
}

async function run() {
  const isVerbose = process.argv.includes('--verbose');

  console.log('═══════════════════════════════════════════════');
  console.log('  Failure Memory — Real-World Benchmark');
  console.log(`  API: ${API_BASE}`);
  console.log(`  Scenarios: ${SCENARIOS.length}`);
  console.log('═══════════════════════════════════════════════');

  // Phase 1: Seed all failures
  await seedFailures();

  // Phase 2: Search and measure recall
  const results = await searchScenarios();

  // Phase 3: Aggregate
  const total = results.length;
  const recallAt1 = results.filter(r => r.recall_at_1).length;
  const recallAt5 = results.filter(r => r.recall_at_5).length;
  const avgMrr = results.reduce((s, r) => s + r.mrr, 0) / total;
  const avgLatency = results.reduce((s, r) => s + r.latency_ms, 0) / total;

  console.log('\n═══════════════════════════════════════════════');
  console.log('  RESULTS');
  console.log('═══════════════════════════════════════════════');
  console.log('');
  console.log(`  recall@1:   ${recallAt1}/${total} (${(recallAt1/total*100).toFixed(1)}%)`);
  console.log(`  recall@5:   ${recallAt5}/${total} (${(recallAt5/total*100).toFixed(1)}%)`);
  console.log(`  mean MRR:   ${avgMrr.toFixed(3)}`);
  console.log(`  avg latency: ${avgLatency.toFixed(0)}ms`);
  console.log('');
  console.log('  By difficulty:');
  const byDiff = {};
  results.forEach(r => {
    if (!byDiff[r.difficulty]) byDiff[r.difficulty] = { total: 0, r1: 0, r5: 0, mrr: 0 };
    byDiff[r.difficulty].total++;
    if (r.recall_at_1) byDiff[r.difficulty].r1++;
    if (r.recall_at_5) byDiff[r.difficulty].r5++;
    byDiff[r.difficulty].mrr += r.mrr;
  });
  for (const [diff, d] of Object.entries(byDiff)) {
    console.log(`    ${diff}: recall@1=${d.r1}/${d.total} (${(d.r1/d.total*100).toFixed(0)}%) MRR=${(d.mrr/d.total).toFixed(3)}`);
  }

  console.log('');
  console.log('  Token savings estimate:');
  const tokensPerDebug = 2000; // avg tokens to debug from scratch
  const savedAttempts = results.filter(r => r.recall_at_1 || r.recall_at_5).length;
  const savedTokens = savedAttempts * tokensPerDebug;
  const wastedTokens = (total - savedAttempts) * tokensPerDebug;
  console.log(`    Tokens saved by hitting memory: ~${savedTokens.toLocaleString()} (${savedAttempts} hits × ${tokensPerDebug})`);
  console.log(`    Tokens wasted on misses: ~${wastedTokens.toLocaleString()}`);
  console.log(`    Net efficiency: ${savedTokens > wastedTokens ? '+' : ''}${((savedTokens - wastedTokens) / 1000).toFixed(0)}K tokens`);

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    api: API_BASE,
    scenarios: SCENARIOS.length,
    results: {
      recall_at_1: { count: recallAt1, rate: (recallAt1/total*100).toFixed(1) },
      recall_at_5: { count: recallAt5, rate: (recallAt5/total*100).toFixed(1) },
      mean_mrr: avgMrr.toFixed(3),
      avg_latency_ms: Math.round(avgLatency),
      by_difficulty: Object.fromEntries(Object.entries(byDiff).map(([k, v]) => [k, { ...v, recall_1_rate: (v.r1/v.total*100).toFixed(0) }])),
      token_savings: { saved: savedTokens, wasted: wastedTokens, net: savedTokens - wastedTokens },
    },
    details: isVerbose ? results : [],
  };

  const fs = require('fs');
  const path = require('path');
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'benchmark-report.json'), JSON.stringify(report, null, 2));
  console.log(`\n  Report saved to data/benchmark-report.json`);
  console.log('');
}

run().catch(e => console.error('Benchmark error:', e.message));
