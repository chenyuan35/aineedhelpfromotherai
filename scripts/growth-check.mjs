import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const generatedAt = process.env.GROWTH_CHECK_DATE || new Date().toISOString();
const timeoutMs = Number(process.env.GROWTH_CHECK_TIMEOUT_MS || 12000);

const targets = [
  { name: 'home', method: 'GET', url: 'https://aineedhelpfromotherai.com/' },
  { name: 'cases', method: 'GET', url: 'https://aineedhelpfromotherai.com/cases/' },
  { name: 'for-agents', method: 'GET', url: 'https://aineedhelpfromotherai.com/for-agents/' },
  { name: 'learn', method: 'GET', url: 'https://aineedhelpfromotherai.com/learn/' },
  { name: 'stats', method: 'GET', url: 'https://aineedhelpfromotherai.com/stats/' },
  { name: 'api-docs', method: 'GET', url: 'https://aineedhelpfromotherai.com/api/docs/' },
  { name: 'health', method: 'GET', url: 'https://api.aineedhelpfromotherai.com/api/health' },
  {
    name: 'memory-search',
    method: 'POST',
    url: 'https://api.aineedhelpfromotherai.com/api/memory/search',
    body: { query: 'Claude Code hallucinated CLI flag', limit: 3 }
  }
];

function readSitemapCount() {
  const path = join(root, 'frontend', 'sitemap.xml');
  if (!existsSync(path)) return 0;
  const xml = readFileSync(path, 'utf8');
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).length;
}

async function fetchWithTimeout(target) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  try {
    const response = await fetch(target.url, {
      method: target.method,
      headers: target.body ? { 'Content-Type': 'application/json' } : undefined,
      body: target.body ? JSON.stringify(target.body) : undefined,
      signal: controller.signal
    });
    const text = await response.text();
    return {
      ...target,
      ok: response.ok,
      status: response.status,
      ms: Date.now() - started,
      sample: text.replace(/\s+/g, ' ').trim().slice(0, 180)
    };
  } catch (error) {
    return {
      ...target,
      ok: false,
      status: 'ERR',
      ms: Date.now() - started,
      sample: error.message
    };
  } finally {
    clearTimeout(timer);
  }
}

const results = [];
for (const target of targets) {
  results.push(await fetchWithTimeout(target));
}

const sitemapCount = readSitemapCount();
const okCount = results.filter(r => r.ok).length;
const failed = results.filter(r => !r.ok);
const report = [
  '# Growth check report',
  '',
  `Generated: ${generatedAt}`,
  `Sitemap URLs: ${sitemapCount}`,
  `Targets OK: ${okCount}/${results.length}`,
  '',
  '| Target | Status | Latency | URL |',
  '|--------|--------|---------|-----|',
  ...results.map(r => `| ${r.name} | ${r.status} | ${r.ms}ms | ${r.url} |`),
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

if (failed.length) {
  console.error(`Growth check failed: ${failed.map(f => f.name).join(', ')}`);
  process.exitCode = 1;
}
