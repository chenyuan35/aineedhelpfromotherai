import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = resolve(process.argv[2] || join(repoRoot, 'frontend', 'dist'));
const results = [];

function check(name, run) {
  try {
    run();
    results.push({ name, ok: true });
  } catch (error) {
    results.push({ name, ok: false, error: error.message });
  }
}
function page(path) {
  const target = join(dist, path);
  assert.ok(existsSync(target), `Missing built page: ${target}`);
  return readFileSync(target, 'utf8');
}
function includesAll(text, values, label) {
  for (const value of values) assert.ok(text.toLowerCase().includes(value.toLowerCase()), `${label} is missing: ${value}`);
}

check('built TikTok tool route exists and has a creator-facing title', () => {
  const html = page('tiktok-publish/index.html');
  includesAll(html, ['TikTok', 'Publisher'], 'Built route');
});

check('tools directory retains the TikTok card after final build transforms', () => {
  const html = page('tools/index.html');
  assert.match(html, /<a\b[^>]*href="\/tiktok-publish\/"[^>]*class="tool-card"|<a\b[^>]*class="tool-card"[^>]*href="\/tiktok-publish\/"/i,
    'Tools directory must include a real TikTok tool card linking to /tiktok-publish/');
  includesAll(html, ['TikTok Video Publisher', 'MP4 or MOV'], 'TikTok directory card');
});

check('homepage tool-search index includes the TikTok route and searchable terms', () => {
  const html = page('index.html');
  assert.ok(html.includes('/tiktok-publish/'), 'Homepage search data must retain /tiktok-publish/');
  assert.match(html, /\["TikTok Video Publisher","\/tiktok-publish\/","[^\]]*(?:video|publish|creator)[^\]]*"\]/i,
    'Homepage search tuple must identify and describe the TikTok publisher');
});

check('built privacy policy describes the implemented TikTok OAuth and transfer data flow', () => {
  const html = page('privacy/index.html');
  includesAll(html, [
    'AI Need Help', 'OAuth', 'encrypted', 'HttpOnly', '7 days', 'refresh token',
    'temporary signed upload URL', 'metadata', 'caption', 'status', 'original video bytes',
    'operational or security logs', 'IP address', 'Clearing this browser\'s site data removes its TikTok session cookie',
    'manage connected-app permissions', 'does not prove that TikTok has revoked',
    'Posts already published or uploaded are managed through TikTok', 'automatic server-side revocation or deletion',
  ], 'Privacy policy');
  assert.doesNotMatch(html, /no server storage|nothing collected|all browser-only|no sign-up required/i,
    'Privacy policy must not make site-wide claims contradicted by the OAuth connector');
});

check('built terms and about pages describe ordinary lawful creator use without fabricated audience claims', () => {
  const terms = page('terms/index.html');
  const about = page('about/index.html');
  includesAll(terms, [
    'AI Need Help', 'finished MP4 or MOV', 'content you own', 'lawful rights',
    'explicit consent', 'manual review', 'does not automatically post', 'mass-automated posting',
    'not an internal audit tool', 'TikTok terms and policies',
  ], 'Terms');
  includesAll(about, [
    'AI Need Help', 'creator utility', 'choose a finished video',
    'TikTok account', 'review the post settings', 'individual creators',
  ], 'About page');
  assert.doesNotMatch(`${terms}\n${about}`, /thousands of creators|enterprise customers|customer approval|approved by TikTok/i,
    'Public copy must not invent user counts, enterprise use or TikTok approval');
});

for (const result of results) {
  console.log(`${result.ok ? 'PASS' : 'FAIL'} ${result.name}${result.error ? ` — ${result.error}` : ''}`);
}
console.log(`TikTok public surface: ${results.filter(result => result.ok).length}/${results.length} checks passed.`);
if (results.some(result => !result.ok)) process.exitCode = 1;
