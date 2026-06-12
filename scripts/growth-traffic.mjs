import { mkdirSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const repo = process.env.GITHUB_REPOSITORY || 'chenyuan35/aineedhelpfromotherai';
const generatedAt = process.env.GROWTH_TRAFFIC_DATE || new Date().toISOString();
const reportPath = join(root, 'tasks', 'growth-traffic-report.md');
const retries = Number(process.env.GROWTH_TRAFFIC_RETRIES || 3);

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  try {
    return execSync('gh auth token', { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

async function getTraffic(path, token) {
  let last = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}${path}`, {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'aineedhelpfromotherai-growth-traffic',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const text = await response.text();
      let body = null;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = { message: text.slice(0, 300) };
      }
      if (response.ok) {
        return { ok: true, status: response.status, body };
      }
      last = { ok: false, status: response.status, body };
    } catch (error) {
      last = { ok: false, status: 'ERR', body: { message: error.message } };
    }
    if (attempt < retries) await wait(1500 * attempt);
  }
  return last;
}

function table(headers, rows) {
  return [
    `| ${headers.join(' |')} |`,
    `| ${headers.map(() => '---').join(' |')} |`,
    ...rows
  ].join('\n');
}

function countRows(items, columns) {
  if (!Array.isArray(items) || items.length === 0) {
    return [`| ${['_none reported_', ...Array(Math.max(columns.length - 1, 0)).fill('')].join(' | ')} |`];
  }
  return items.slice(0, 10).map(item => `| ${columns.map(c => String(item[c] ?? '').replace(/\|/g, '/')).join(' | ')} |`);
}

function writeReport(markdown) {
  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${markdown.trimEnd()}\n`);
  console.log(`wrote ${reportPath}`);
}

const token = getToken();
const [views, clones, paths, referrers] = await Promise.all([
  getTraffic('/traffic/views', token),
  getTraffic('/traffic/clones', token),
  getTraffic('/traffic/popular/paths', token),
  getTraffic('/traffic/popular/referrers', token)
]);

const failures = [views, clones, paths, referrers].filter(r => !r.ok);
if (!token || failures.length) {
  const reasons = [
    !token ? 'missing GitHub token' : '',
    ...failures.map(f => `GitHub traffic API ${f.status}: ${f.body?.message || 'unavailable'}`)
  ].filter(Boolean);
  writeReport([
    '# Growth Traffic Report',
    '',
    `Generated: ${generatedAt}`,
    `Repository: https://github.com/${repo}`,
    '',
    '## Status',
    '',
    `Traffic data unavailable: ${reasons.join('; ')}`,
    '',
    'This report is intentionally non-blocking so growth automation can keep running when GitHub traffic data is temporarily unavailable or the token lacks traffic permissions.'
  ].join('\n'));
  process.exit(0);
}

const viewBody = views.body || {};
const cloneBody = clones.body || {};
const topPath = Array.isArray(paths.body) && paths.body[0] ? paths.body[0] : null;
const topReferrer = Array.isArray(referrers.body) && referrers.body[0] ? referrers.body[0] : null;

writeReport([
  '# Growth Traffic Report',
  '',
  `Generated: ${generatedAt}`,
  `Repository: https://github.com/${repo}`,
  '',
  '## Summary',
  '',
  table(
    ['Metric', 'Count', 'Unique'],
    [
      `| Repository views (14d) | ${viewBody.count ?? 0} | ${viewBody.uniques ?? 0} |`,
      `| Repository clones (14d) | ${cloneBody.count ?? 0} | ${cloneBody.uniques ?? 0} |`,
      `| Top path | ${topPath ? topPath.path : '_none_'} | ${topPath ? topPath.uniques : 0} |`,
      `| Top referrer | ${topReferrer ? topReferrer.referrer : '_none_'} | ${topReferrer ? topReferrer.uniques : 0} |`
    ]
  ),
  '',
  '## Popular Paths',
  '',
  table(['Path', 'Title', 'Views', 'Unique'], countRows(paths.body, ['path', 'title', 'count', 'uniques'])),
  '',
  '## Referrers',
  '',
  table(['Referrer', 'Views', 'Unique'], countRows(referrers.body, ['referrer', 'count', 'uniques'])),
  '',
  '## Daily Views',
  '',
  table(['Date', 'Views', 'Unique'], countRows(viewBody.views || [], ['timestamp', 'count', 'uniques'])),
  '',
  '## Daily Clones',
  '',
  table(['Date', 'Clones', 'Unique'], countRows(cloneBody.clones || [], ['timestamp', 'count', 'uniques'])),
  '',
  'Compression: traffic report captures real GitHub interest signals without tracking users or generating artificial clicks.'
].join('\n'));
