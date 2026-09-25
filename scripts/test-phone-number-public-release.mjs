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
assert.doesNotMatch(page, /\/theme-toggle\.js/);
assert.match(page, /id="theme-runtime"/);
assert.match(page, /Find the right phone route fast\./);
assert.match(page, /Long-term SMS \/ OTP/);
assert.match(page, /Data SIM \/ eSIM/);
assert.match(page, /Temporary SMS/);
assert.match(page, /Full guide/);
assert.match(page, /"@type":"FAQPage"/);
assert.match(page, /phone_family_select/);
assert.match(page, /phone_filter_change/);
assert.match(page, /phone_show_more/);
assert.match(page, /phone_guide_open/);
assert.match(page, /phone_outbound_click/);
assert.match(page, /source_path:'\/tools\/phone-number-survival-guide\/'/);
assert.doesNotMatch(page, /Register an app or service/);
assert.doesNotMatch(page, /Travel or move abroad/);
assert.doesNotMatch(page, /Evidence rule:/);
assert.equal((home.match(/\/tools\/phone-number-survival-guide\//g)||[]).length >= 1, true);
assert.equal((tools.match(/\/tools\/phone-number-survival-guide\//g)||[]).length, 1);
assert.equal((sitemap.match(new RegExp(`<loc>${canonical.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}<\/loc>`,'g'))||[]).length, 1);
assert.doesNotMatch(sitemap, /phone-number-lifecycle-mvp/);

for (const name of ['audit-rules.json','catalog.json','location-constraints.json','number-supply-intelligence.json','purchase-intelligence.json','retention-intelligence.json','route-capabilities.json','tutorial-insights.json','radar-view.json','uk-directory-pilot.json']) {
  assert.equal(fs.readFileSync(path.join(publicDir,name),'utf8'), fs.readFileSync(path.join(source,name),'utf8'), `${name} must be byte-identical to source data`);
}

const ukPilot = JSON.parse(fs.readFileSync(path.join(source, 'uk-directory-pilot.json'), 'utf8'));
assert.match(page, /class="pr-related pr-static-guides"/);
for (const route of ukPilot.routes) {
  const routeUrl = `${url}route/${route.id}/`;
  const routeCanonical = `https://aineedhelpfromotherai.com${routeUrl}`;
  const routePagePath = path.join(publicDir, 'route', route.id, 'index.html');
  assert(fs.existsSync(routePagePath), `${route.id} static route page must exist`);
  const routePage = fs.readFileSync(routePagePath, 'utf8');
  assert.equal((routePage.match(/<h1\b/g) || []).length, 1, `${route.id} must have one H1`);
  assert.match(routePage, new RegExp(`<link rel="canonical" href="${routeCanonical.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}">`));
  assert.equal((sitemap.match(new RegExp(`<loc>${routeCanonical.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}<\/loc>`,'g')) || []).length, 1, `${route.id} must appear once in sitemap`);
  assert.match(page, new RegExp(`href="${routeUrl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`), `${route.id} must have a crawler-visible hub link`);
  for (let n = 1; n <= 9; n += 1) assert.match(routePage, new RegExp(`<h2>${n}\.`), `${route.id} missing section ${n}`);
  if (route.publishState === 'observation-hold') {
    assert.match(routePage, /Why this route is on hold:/);
    assert.doesNotMatch(routePage, /Acquire \/ open ↗/);
  }
}

console.log('phone-radar public release audit: PASS');
