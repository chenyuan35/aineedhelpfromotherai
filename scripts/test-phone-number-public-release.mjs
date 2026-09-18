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

assert(fs.existsSync(publicDir), 'public Phone Radar directory must exist');
assert(!fs.existsSync(oldDist), 'hidden source slug must not ship in dist');
assert.match(page, new RegExp(`<link rel="canonical" href="${canonical.replaceAll('/', '\\/')}">`));
assert.match(page, /<meta name="robots" content="index,follow,max-image-preview:large">/);
assert.doesNotMatch(page, /noindex/);
assert.match(page, /Find the right phone route fast\./);
assert.match(page, /Long-term SMS \/ OTP/);
assert.match(page, /Data SIM \/ eSIM/);
assert.match(page, /Temporary SMS/);
assert.match(page, /Full guide/);
assert.match(page, /"@type":"FAQPage"/);
assert.match(page, /phone_family_select/);
assert.match(page, /phone_guide_open/);
assert.match(page, /phone_outbound_click/);
assert.match(page, /source_path:'\/tools\/phone-number-survival-guide\/'/);
assert.doesNotMatch(page, /Register an app or service/);
assert.doesNotMatch(page, /Travel or move abroad/);
assert.doesNotMatch(page, /Evidence rule:/);
assert.equal((home.match(/\/tools\/phone-number-survival-guide\//g)||[]).length >= 1, true);
assert.equal((tools.match(/\/tools\/phone-number-survival-guide\//g)||[]).length, 1);
assert.equal((sitemap.match(new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length, 1);
assert.doesNotMatch(sitemap, /phone-number-lifecycle-mvp/);

for (const name of ['audit-rules.json','catalog.json','location-constraints.json','number-supply-intelligence.json','purchase-intelligence.json','retention-intelligence.json','route-capabilities.json','tutorial-insights.json','radar-view.json']) {
  assert.equal(fs.readFileSync(path.join(publicDir,name),'utf8'), fs.readFileSync(path.join(source,name),'utf8'), `${name} must be byte-identical to source data`);
}

console.log('phone-radar public release audit: PASS');
