import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'frontend', 'tools', 'phone-number-lifecycle-mvp');
const dist = path.join(root, 'frontend', 'dist');
const publicDir = path.join(dist, 'tools', 'phone-number-survival-guide');
const oldDist = path.join(dist, 'tools', 'phone-number-lifecycle-mvp');
const page = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const tools = fs.readFileSync(path.join(dist, 'tools', 'index.html'), 'utf8');
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const url = '/tools/phone-number-survival-guide/';
const canonical = `https://aineedhelpfromotherai.com${url}`;

assert(fs.existsSync(publicDir), 'public Phone Survival directory must exist');
assert(!fs.existsSync(oldDist), 'hidden canary slug must not ship in dist');
assert.match(page, new RegExp(`<link rel="canonical" href="${canonical.replaceAll('/', '\\/')}">`));
assert.match(page, /<meta name="robots" content="index,follow,max-image-preview:large">/);
assert.doesNotMatch(page, /noindex/);
assert.match(page, /Choose a number you can still control when you need it months from now\./);
assert.match(page, /Phone Number Survival Guide · Choose, activate, keep it working/);
assert.match(page, /Survival answer/);
assert.match(page, /"@type":"FAQPage"/);
assert.match(page, /phone_route_result/);
assert.match(page, /source_path:'\/tools\/phone-number-survival-guide\/'/);
assert.match(page, /Phone Radar action-first public view/);
assert.match(page, /\.pn-wrap \.pn-hero \.pn-note\{display:none\}/);
assert.match(page, /\.pn-wrap \.pn-card>\.pn-insights/);
assert.match(page, /\.pn-wrap \.pn-card>\.pn-route-top\+\.pn-cap:has\(>\.pn-kv\)\{display:grid\}/);
assert.equal((home.match(/\/tools\/phone-number-survival-guide\//g)||[]).length >= 1, true);
assert.equal((tools.match(/\/tools\/phone-number-survival-guide\//g)||[]).length, 1);
assert.equal((sitemap.match(new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length, 1);
assert.doesNotMatch(sitemap, /phone-number-lifecycle-mvp/);

for (const name of ['audit-rules.json','catalog.json','location-constraints.json','number-supply-intelligence.json','purchase-intelligence.json','retention-intelligence.json','route-capabilities.json','tutorial-insights.json']) {
  assert.equal(fs.readFileSync(path.join(publicDir,name),'utf8'), fs.readFileSync(path.join(source,name),'utf8'), `${name} must be byte-identical to canary evidence`);
}
console.log('phone-number public release audit: PASS');
