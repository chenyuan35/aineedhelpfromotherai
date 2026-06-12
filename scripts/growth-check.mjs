import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const generatedAt = process.env.GROWTH_CHECK_DATE || new Date().toISOString();
const timeoutMs = Number(process.env.GROWTH_CHECK_TIMEOUT_MS || 12000);
const retries = Number(process.env.GROWTH_CHECK_RETRIES || 1);
const retryDelayMs = Number(process.env.GROWTH_CHECK_RETRY_DELAY_MS || 15000);
const cacheBustSeed = process.env.GROWTH_CHECK_CACHE_BUST || Date.now().toString(36);

const targets = [
  { name: 'home', method: 'GET', url: 'https://aineedhelpfromotherai.com/' },
  { name: 'cases', method: 'GET', url: 'https://aineedhelpfromotherai.com/cases/' },
  { name: 'for-agents', method: 'GET', url: 'https://aineedhelpfromotherai.com/for-agents/' },
  { name: 'learn', method: 'GET', url: 'https://aineedhelpfromotherai.com/learn/' },
  { name: 'stats', method: 'GET', url: 'https://aineedhelpfromotherai.com/stats/' },
  { name: 'api-docs', method: 'GET', url: 'https://aineedhelpfromotherai.com/api/docs/' },
  { name: 'sitemap', method: 'GET', url: 'https://aineedhelpfromotherai.com/sitemap.xml' },
  { name: 'feed', method: 'GET', url: 'https://aineedhelpfromotherai.com/feed.xml' },
  { name: 'health', method: 'GET', url: 'https://aineedhelpfromotherai.com/api/health' },
  {
    name: 'memory-search',
    method: 'POST',
    url: 'https://aineedhelpfromotherai.com/api/memory/search',
    body: { query: 'Claude Code hallucinated CLI flag', limit: 3 }
  }
];

function minutesFor(c) {
  return Number(c.time_wasted_minutes || c.time_lost_min || 0);
}

function readFailureStats() {
  const path = join(root, 'data', 'failure-cases.json');
  if (!existsSync(path)) return { count: 0, minutes: 0, minutesLabel: '0' };
  const records = JSON.parse(readFileSync(path, 'utf8'));
  const cases = Array.isArray(records)
    ? records.filter(c => c?.source !== 'daily-auto-generate' && !String(c?.id || '').startsWith('FC_AUTO_'))
    : [];
  const minutes = Array.isArray(cases) ? cases.reduce((sum, c) => sum + minutesFor(c), 0) : 0;
  return {
    count: Array.isArray(cases) ? cases.length : 0,
    minutes,
    minutesLabel: minutes.toLocaleString()
  };
}

function readSitemapCount() {
  const path = join(root, 'frontend', 'sitemap.xml');
  if (!existsSync(path)) return 0;
  const xml = readFileSync(path, 'utf8');
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).length;
}

function cacheBustedUrl(url, attempt) {
  const parsed = new URL(url);
  parsed.searchParams.set('growth_check', `${cacheBustSeed}-${attempt}-${Date.now().toString(36)}`);
  return parsed.toString();
}

async function fetchWithTimeout(target, attempt) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  const requestUrl = target.method === 'GET' ? cacheBustedUrl(target.url, attempt) : target.url;
  const headers = {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    ...(target.body ? { 'Content-Type': 'application/json' } : {})
  };
  try {
    const response = await fetch(requestUrl, {
      method: target.method,
      headers,
      body: target.body ? JSON.stringify(target.body) : undefined,
      signal: controller.signal
    });
    const text = await response.text();
    return {
      ...target,
      requestUrl,
      ok: response.ok,
      status: response.status,
      ms: Date.now() - started,
      body: text,
      sample: text.replace(/\s+/g, ' ').trim().slice(0, 180)
    };
  } catch (error) {
    return {
      ...target,
      requestUrl,
      ok: false,
      status: 'ERR',
      ms: Date.now() - started,
      body: '',
      sample: error.message
    };
  } finally {
    clearTimeout(timer);
  }
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAttempt(attempt) {
  const results = [];
  for (const target of targets) {
    results.push(await fetchWithTimeout(target, attempt));
  }

  const byName = Object.fromEntries(results.map(r => [r.name, r]));
  const sitemapCount = readSitemapCount();
  const failureStats = readFailureStats();
  const liveSitemapCount = (byName.sitemap?.body.match(/<loc>/g) || []).length;
  const liveFeedItemCount = (byName.feed?.body.match(/<item>/g) || []).length;
  const casesBody = byName.cases?.body || '';
  const assertions = [
    {
      name: 'public case count matches curated data/failure-cases.json records',
      ok: casesBody.includes(`<strong>${failureStats.count}</strong>`)
    },
    {
      name: 'observed minutes matches curated data/failure-cases.json records',
      ok: casesBody.includes(failureStats.minutesLabel)
    },
    {
      name: 'live sitemap URL count matches generated sitemap',
      ok: liveSitemapCount === sitemapCount,
      detail: `${liveSitemapCount}/${sitemapCount}`
    },
    {
      name: 'RSS feed includes primary pages and failure cases',
      ok: liveFeedItemCount >= failureStats.count + 3,
      detail: `${liveFeedItemCount}/${failureStats.count + 3}`
    }
  ];

  return { results, assertions, sitemapCount, failureStats, liveSitemapCount };
}

let last = null;
for (let attempt = 1; attempt <= retries; attempt += 1) {
  last = await runAttempt(attempt);
  const failedTargets = last.results.filter(r => !r.ok);
  const failedAssertions = last.assertions.filter(a => !a.ok);
  if (!failedTargets.length && !failedAssertions.length) break;
  if (attempt < retries) {
    console.log(`Growth check attempt ${attempt}/${retries} failed; retrying in ${retryDelayMs}ms...`);
    await wait(retryDelayMs);
  }
}

const results = last.results;
const sitemapCount = last.sitemapCount;
const okCount = results.filter(r => r.ok).length;
const failed = results.filter(r => !r.ok);
const failedAssertions = last.assertions.filter(a => !a.ok);
const report = [
  '# Growth check report',
  '',
  `Generated: ${generatedAt}`,
  `Failure cases expected: ${last.failureStats.count}`,
  `Observed minutes expected: ${last.failureStats.minutesLabel}`,
  `Sitemap URLs expected: ${sitemapCount}`,
  `Targets OK: ${okCount}/${results.length}`,
  '',
  '| Target | Status | Latency | URL |',
  '|--------|--------|---------|-----|',
  ...results.map(r => `| ${r.name} | ${r.status} | ${r.ms}ms | ${r.url} |`),
  '',
  '## Content assertions',
  '',
  '| Assertion | Result | Detail |',
  '|-----------|--------|--------|',
  ...last.assertions.map(a => `| ${a.name} | ${a.ok ? 'OK' : 'FAIL'} | ${a.detail || ''} |`),
  '',
  '## Response samples',
  '',
  ...results.map(r => `### ${r.name}\n\n${r.sample || '(empty response)'}`),
  ''
].join('\n');

const reportPath = join(root, 'tasks', 'growth-check-report.md');
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, report);
console.log(report);

if (failed.length || failedAssertions.length) {
  const targetNames = failed.map(f => f.name).join(', ');
  const assertionNames = failedAssertions.map(a => a.name).join(', ');
  console.error(`Growth check failed: ${[targetNames, assertionNames].filter(Boolean).join(' / ')}`);
  process.exitCode = 1;
}
