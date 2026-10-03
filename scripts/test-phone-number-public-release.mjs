import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

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
assert.match(page, /Find a real phone route that still works later\./);
assert.match(page, /What Phone Radar answers/);
assert.match(page, /<dt>Buy<\/dt>/);
assert.match(page, /<dt>Keep<\/dt>/);
assert.match(page, /<dt>Verify<\/dt>/);
assert.match(page, /<dt>Recover<\/dt>/);
assert.match(page, /phone-first-identity\.css/);
assert.match(page, /id="route-search"/);
assert.match(page, /Global long-term number finder\./);
assert.match(page, /phone-route-summaries\.json/);
assert.match(page, /phone-route-data\//);
assert.match(page, /phone_canonical_detail_open/);
assert.doesNotMatch(page, /const files=\[[^\]]*uk-directory-pilot\.json/);
assert.match(page, /fetch\('\.\/global-directory\.json'/);
assert.doesNotMatch(page, /UK long-term-number pilot\./);
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
assert.match(home, /Choose a phone number you can actually keep\./);
assert.match(home, /Phone Radar · evidence-backed number intelligence/);
assert.match(home, /phone-first-identity\.css/);
assert.doesNotMatch(home, /AI stopped\? Start here\./);
assert.equal((home.match(/\/tools\/phone-number-survival-guide\//g)||[]).length >= 1, true);
assert.equal((tools.match(/\/tools\/phone-number-survival-guide\//g)||[]).length, 1);
assert.equal((sitemap.match(new RegExp(`<loc>${canonical.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}<\/loc>`,'g'))||[]).length, 1);
assert.doesNotMatch(sitemap, /phone-number-lifecycle-mvp/);

for (const name of ['audit-rules.json','catalog.json','location-constraints.json','number-supply-intelligence.json','purchase-intelligence.json','retention-intelligence.json','route-capabilities.json','tutorial-insights.json','radar-view.json','uk-directory-pilot.json','comparison-route-index.json','phone-search-index.json','phone-route-summaries.json']) {
  assert.equal(fs.readFileSync(path.join(publicDir,name),'utf8'), fs.readFileSync(path.join(source,name),'utf8'), `${name} must be byte-identical to source data`);
}

const ukPilot = JSON.parse(fs.readFileSync(path.join(source, 'uk-directory-pilot.json'), 'utf8'));
const publication = JSON.parse(fs.readFileSync(path.join(source, 'publication-policy.json'), 'utf8'));
const detailStates = new Set(['detail-eligible', 'indexable']);
const routeState = (route) => publication.routeStates?.[route.id] || publication.defaultRouteState || 'database-only';
assert.match(page, /class="pr-related pr-static-guides"/);
for (const route of ukPilot.routes) {
  const routeUrl = `${url}route/${route.id}/`;
  const routeCanonical = `https://aineedhelpfromotherai.com${routeUrl}`;
  const routePagePath = path.join(publicDir, 'route', route.id, 'index.html');
  const state = routeState(route);
  if (!detailStates.has(state)) {
    assert(!fs.existsSync(routePagePath), `${route.id} must remain comparison-only without a route page`);
    assert.doesNotMatch(page, new RegExp(`href="${routeUrl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`), `${route.id} must not have a crawler-visible hub link`);
    assert.equal((sitemap.match(new RegExp(`<loc>${routeCanonical.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}<\/loc>`,'g')) || []).length, 0, `${route.id} must not appear in sitemap`);
    continue;
  }
  assert(fs.existsSync(routePagePath), `${route.id} admitted route page must exist`);
  const routePage = fs.readFileSync(routePagePath, 'utf8');
  assert.equal((routePage.match(/<h1\b/g) || []).length, 1, `${route.id} must have one H1`);
  assert.match(routePage, new RegExp(`<link rel="canonical" href="${routeCanonical.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}">`));
  const sitemapMatches = (sitemap.match(new RegExp(`<loc>${routeCanonical.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}<\/loc>`,'g')) || []).length;
  assert.equal(sitemapMatches, state === 'indexable' ? 1 : 0, `${route.id} sitemap state must match publication policy`);
  assert.match(page, new RegExp(`href="${routeUrl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`), `${route.id} must have a crawler-visible hub link`);
  for (let n = 1; n <= 9; n += 1) assert.match(routePage, new RegExp(`<h2>${n}\.`), `${route.id} missing section ${n}`);
}


const canonicalIndex = JSON.parse(fs.readFileSync(path.join(publicDir, 'phone-route-summaries.json'), 'utf8'));
assert.equal(canonicalIndex.routes.length, 156, 'public finder index must expose every canonical route');
assert.deepEqual(Object.fromEntries([...new Set(canonicalIndex.routes.map(r => r.family))].map(f => [f, canonicalIndex.routes.filter(r => r.family === f).length])), { 'long-term': 149, temporary: 5, data: 2 });
for (const route of canonicalIndex.routes) assert(fs.existsSync(path.join(publicDir, 'phone-route-data', `${route.id}.json`)), `${route.id} must have a lazy detail bundle`);

const waitFor = async (fn, message, timeout = 3000) => {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (fn()) return;
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  throw new Error(`Timed out: ${message}`);
};
const dom = new JSDOM(page, {
  url: canonical,
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  beforeParse(window) {
    window.matchMedia = () => ({ matches:false, addEventListener(){}, removeEventListener(){} });
    window.HTMLElement.prototype.scrollIntoView = () => {};
    window.fetch = async (input) => {
      const rel = String(input).replace(/^\.\//, '').split('?')[0];
      const file = path.join(publicDir, rel);
      return { ok: fs.existsSync(file), json: async () => JSON.parse(fs.readFileSync(file, 'utf8')) };
    };
  }
});
await waitFor(() => dom.window.document.querySelector('#route-count')?.textContent.includes('149 reviewed routes'), 'canonical long-term market overview');
const search = dom.window.document.querySelector('#route-search');
search.value = 'eSIM.GG'; search.dispatchEvent(new dom.window.Event('input', { bubbles:true }));
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('eSIM.GG Estonia +372'), 'eSIM.GG canonical search');
dom.window.document.querySelector('[data-index-route="esimgg-estonia-372-2026"]')?.click();
await waitFor(() => dom.window.document.querySelector('#directory-guide-panel')?.textContent.includes('Backstage reviewed'), 'lazy canonical detail');
search.value = 'CMLink'; search.dispatchEvent(new dom.window.Event('input', { bubbles:true }));
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('CMLink UK'), 'HOLD route search');
dom.window.document.querySelector('[data-index-route="cmlink-uk-keep-number-2026"]')?.click();
await waitFor(() => dom.window.document.querySelector('#directory-guide-panel')?.textContent.includes('HOLD — unresolved constraints remain'), 'HOLD warning in lazy detail');
dom.window.document.querySelector('[data-family="data"]')?.click();
search.value = 'Mobal Japan Tourist Data'; search.dispatchEvent(new dom.window.Event('input', { bubbles:true }));
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('Mobal Japan Tourist Data SIM'), 'data-family canonical search');
dom.window.document.querySelector('[data-family="temporary"]')?.click();
search.value = 'Turkcell Tourist'; search.dispatchEvent(new dom.window.Event('input', { bubbles:true }));
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('Turkcell Tourist SIM'), 'temporary-family canonical search');
dom.window.close();

console.log('phone-radar public release audit: PASS');
