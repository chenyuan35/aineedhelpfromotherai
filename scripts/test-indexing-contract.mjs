import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = resolve(process.argv[2] || join(repoRoot, 'frontend', 'dist'));
const base = 'https://aineedhelpfromotherai.com';

const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

assert.ok(urls.length > 0, 'sitemap must contain URLs');
assert.equal(new Set(urls).size, urls.length, 'sitemap URLs must be unique');

for (const raw of urls) {
  const url = new URL(raw);
  assert.equal(url.origin, base, `sitemap URL must stay on canonical origin: ${raw}`);
  assert.ok(!url.pathname.startsWith('/api/'), `API route must not enter sitemap: ${raw}`);
  assert.ok(!url.pathname.startsWith('/mcp'), `MCP route must not enter sitemap: ${raw}`);
  const relative = url.pathname === '/' ? 'index.html' : join(url.pathname.replace(/^\//, ''), 'index.html');
  assert.ok(existsSync(join(dist, relative)), `sitemap URL has no built HTML target: ${raw}`);
}

const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
assert.match(robots, /^Disallow: \/api\/$/m, 'robots must keep generic API crawling blocked');
assert.match(robots, /^Allow: \/api\/tiktok\/$/m, 'TikTok API must be crawlable so X-Robots-Tag: noindex can be observed');
assert.match(robots, /^Allow: \/api\/mcp\/$/m, 'legacy /api/mcp must be crawlable so its 404 can be observed');
assert.doesNotMatch(robots, /^Disallow: \/mcp\/?$/m, 'legacy /mcp 404 must not be hidden from crawlers');

const tiktok = readFileSync(join(dist, 'tiktok-publish', 'index.html'), 'utf8');
assert.doesNotMatch(tiktok, /<a\b[^>]*href=["']\/api\/tiktok\/auth["']/i, 'OAuth endpoint must not be exposed as a crawlable anchor');
assert.match(tiktok, /<button\b[^>]*id=["']connect-button["']/i, 'TikTok connect action must remain a button');

console.log(`Indexing contract OK: ${urls.length} sitemap URLs have built HTML targets; robots/noindex discovery rules are coherent.`);
