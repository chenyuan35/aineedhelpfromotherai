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
assert.match(page, /Top decision shortcuts/);
assert.match(page, /Lowest setup cost/);
assert.match(page, /Lowest yearly keep/);
assert.match(page, /Longest verified keep window/);
assert.match(page, /Best app-verification evidence/);
assert.match(page, /Best-documented continuity/);
assert.match(page, /HOLD\/backstage rows never win/);
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
const canonicalRoutes = JSON.parse(fs.readFileSync(path.join(root, 'data', 'phone', 'v1', 'routes.json'), 'utf8'));
assert.equal(canonicalIndex.routes.length, canonicalRoutes.length, 'public finder index must expose every canonical route');
assert.deepEqual(canonicalIndex.routes.map(r => r.id).sort(), canonicalRoutes.map(r => r.id).sort(), 'public finder IDs must match canonical route IDs');
assert.deepEqual(
  Object.fromEntries([...new Set(canonicalIndex.routes.map(r => r.family))].map(f => [f, canonicalIndex.routes.filter(r => r.family === f).length])),
  Object.fromEntries([...new Set(canonicalRoutes.map(r => r.family))].map(f => [f, canonicalRoutes.filter(r => r.family === f).length])),
  'public finder family totals must match canonical data'
);
for (const route of canonicalIndex.routes) {
  assert(fs.existsSync(path.join(publicDir, 'phone-route-data', `${route.id}.json`)), `${route.id} must have a lazy detail bundle`);
  assert.equal(typeof route.decisionFacts?.sourceCount, 'number', `${route.id} must expose source count for decision ranking`);
  for (const evidence of route.serviceEvidence || []) {
    if (evidence.successRatePct !== null) {
      assert.equal(evidence.percentageEligible, true, `${route.id} percentage must be explicitly eligible`);
      assert(evidence.sampleSize >= 5, `${route.id} percentage needs at least five observations`);
      assert(evidence.independentSourceCount >= 5, `${route.id} percentage needs at least five distinct source records`);
    }
  }
}

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
const expectedLongTermCount = canonicalRoutes.filter(r => r.family === 'long-term').length;
await waitFor(() => dom.window.document.querySelector('#route-count')?.textContent.includes(`${expectedLongTermCount} reviewed routes`), 'canonical long-term market overview');
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('Top decision shortcuts'), 'top decision shortcuts render');
const leaderButtons = [...dom.window.document.querySelectorAll('.pr-leader-route[data-index-route]')];
assert(leaderButtons.length > 0, 'at least one evidence-qualified Top route must render');
for (const button of leaderButtons) {
  const route = canonicalIndex.routes.find(r => r.id === button.dataset.indexRoute);
  assert(route, 'Top route must exist in canonical index');
  assert.equal(route.family, 'long-term', 'Top route must be long-term');
  assert.equal(route.numberClass, 'real-mobile', 'Top route must be a real mobile number');
  assert.equal(route.evidenceState, 'admitted', 'Top route must be admitted');
  assert.notEqual(route.surfaceState, 'backstage-only', 'Top route must not promote backstage-only evidence');
}

// Task-first finder acceptance: ten independent user jobs and negative/unknown cases.
const taskDoc = dom.window.document;
const taskList = () => [...taskDoc.querySelectorAll('[data-task-route]')].map(el=>el.dataset.taskRoute);
const taskFilter = (id,value) => {
  const select = taskDoc.getElementById('pr-task-'+id);
  assert(select, 'task filter '+id+' must exist');
  select.value=value;
  assert.equal(select.value,value,'requested filter option must exist: '+id+'/'+value);
  select.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
};
const taskReset = () => {
  for(const [id,value] of Object.entries({job:'buy',location:'any',market:'any',form:'any',service:'any',start:'any',keep:'any'})) taskFilter(id,value);
};
const eligibleIndex = canonicalIndex.routes.filter(r =>
  r.family==='long-term' && r.numberClass==='real-mobile' && r.evidenceState==='admitted' &&
  ['public-legacy','public-pilot'].includes(r.surfaceState)
);
assert.match(page,/id="pr-task-finder"/,'task finder must ship on existing Phone URL');
await waitFor(()=>taskList().length===Math.min(5,eligibleIndex.length),'first-screen honest shortlist');
assert(eligibleIndex.length>0,'an evidence-eligible shortlist must exist');
assert(eligibleIndex.length<canonicalIndex.routes.length,'a shortlist must not be all canonical research routes');
for(const id of taskList()) {
  const r=canonicalIndex.routes.find(x=>x.id===id);
  assert(r&&eligibleIndex.includes(r),'shortlist may contain only admitted public real-mobile');
}
assert(taskDoc.getElementById('pr-task-summary').textContent.includes('evidence-screened'),'honest evidence summary');

// Scenario 1: visitor in China does not receive an unverified first-activation guarantee.
taskFilter('location','china');
assert.match(taskDoc.getElementById('pr-task-summary').textContent,/NOT established/i);
assert.match(taskDoc.getElementById('pr-task-results').textContent,/unverified/i);

// Scenario 2: outside-number-country use is explicitly conditional rather than confirmed.
taskFilter('location','abroad');
assert.match(taskDoc.getElementById('pr-task-summary').textContent,/NOT established/i);
taskFilter('location','any');

// Scenario 3: eSIM filter cannot admit a physical-only product.
taskFilter('form','esim');
for(const id of taskList())assert(/\besim\b/i.test(canonicalIndex.routes.find(r=>r.id===id).form||''),'eSIM support must be explicit');
taskFilter('form','any');

// Scenarios 4-6: service filters require observed success, never assume universal app compatibility.
for(const service of ['telegram','whatsapp','openai']){
  taskFilter('service',service);
  for(const id of taskList()){
    const r=eligibleIndex.find(x=>x.id===id);
    assert(r&&(r.serviceEvidence||[]).some(e=>e.serviceId===service&&e.successCount>0),
      'selected app cannot be inferred from the presence of a brand or ordinary SMS');
  }
  assert.match(taskDoc.getElementById('pr-task-summary').textContent,/not guarantee|No evidence-eligible/i);
}
taskFilter('service','any');

// Scenario 7: ongoing cost budget must exclude unknown price and high-cost offers.
taskFilter('keep','10');
for(const id of taskList()){
  const r=eligibleIndex.find(x=>x.id===id);
  assert(Number.isFinite(r.metrics.keepYearCostCny)&&r.metrics.keepYearCostCny<=10,'keep budget is strict');
}
taskFilter('keep','any');

// Scenario 8: requested US number cannot silently turn into UK or a backstage suggestion.
taskFilter('market','United States');
assert.equal(taskList().length,0,'no approved US candidate in this audited baseline');
assert.match(taskDoc.getElementById('pr-task-summary').textContent,/No evidence-eligible matches/i);
taskFilter('market','any');

// Scenario 9: keep/port an existing number is a distinct unresolved job.
taskFilter('job','keep');
assert.equal(taskList().length,0,'a new SIM is not a proven port-in path');
assert.match(taskDoc.getElementById('pr-task-summary').textContent,/portability/i);
taskFilter('job','buy');

// Scenario 10: bank short-code SMS is not proven by generic verification evidence.
taskFilter('service','bank');
assert.equal(taskList().length,0,'banking SMS must be bank/operation specific');
assert.match(taskDoc.getElementById('pr-task-summary').textContent,/bank-specific/i);
taskFilter('service','any');

// Save/restore semantics remain device-local, ID-only, and require no sign-in or network.
taskReset();
const chosenId=taskList()[0];
taskDoc.querySelector('[data-task-save="'+chosenId+'"]').click();
const savedRaw=JSON.parse(dom.window.localStorage.getItem('phone-radar-shortlist-v1'));
assert.deepEqual(savedRaw,[chosenId],'only whitelisted route IDs may be stored');
taskDoc.getElementById('pr-task-saved').click();
assert.deepEqual(taskList(),[chosenId],'saved-only browser view must be deterministic');
taskDoc.getElementById('pr-task-clear').click();
assert.equal(taskList().length,0,'clear saved removes all selections');
assert.deepEqual(JSON.parse(dom.window.localStorage.getItem('phone-radar-shortlist-v1')),[]);
taskDoc.getElementById('pr-task-saved').click();

// Route evidence in a task result must open the existing lazy canonical detail.
const inspectId=taskList()[0];
taskDoc.querySelector('[data-task-open="'+inspectId+'"]').click();
await waitFor(()=>taskDoc.querySelector('#pr-task-detail')?.dataset.route===inspectId,'task detail lazy view');
assert.equal(taskDoc.querySelector('#pr-task-detail').hidden,false,'task detail should be shown');
assert.match(taskDoc.querySelector('#pr-task-detail').textContent,/Evidence boundary/i);

const search = dom.window.document.querySelector('#route-search');
search.value = 'eSIM.GG'; search.dispatchEvent(new dom.window.Event('input', { bubbles:true }));
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('eSIM.GG Estonia +372'), 'eSIM.GG canonical search');
dom.window.document.querySelector('[data-index-route="esimgg-estonia-372-2026"]')?.click();
await waitFor(() => dom.window.document.querySelector('#directory-guide-panel')?.textContent.includes('Backstage reviewed'), 'lazy canonical detail');
search.value = 'CMLink'; search.dispatchEvent(new dom.window.Event('input', { bubbles:true }));
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('CMLink UK'), 'HOLD route search');
dom.window.document.querySelector('[data-index-route="cmlink-uk-keep-number-2026"]')?.click();
await waitFor(() => dom.window.document.querySelector('#directory-guide-panel')?.textContent.includes('HOLD — unresolved constraints remain'), 'HOLD warning in lazy detail');
search.value = 'Saily'; search.dispatchEvent(new dom.window.Event('input', { bubbles:true }));
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('Saily U.S. Phone Number'), 'Saily VoIP HOLD route search');
dom.window.document.querySelector('[data-index-route="saily-us-phone-number-2026"]')?.click();
await waitFor(() => dom.window.document.querySelector('#directory-guide-panel')?.textContent.includes('HOLD — unresolved constraints remain'), 'Saily HOLD warning in lazy detail');
assert.match(dom.window.document.querySelector('#directory-guide-panel')?.textContent||'', /VoIP|second-line/i, 'Saily detail must preserve non-cellular classification');
search.value = 'LuckySIM'; search.dispatchEvent(new dom.window.Event('input', { bubbles:true }));
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('LuckySIM Hong Kong Prepaid'), 'LuckySIM HOLD route search');
dom.window.document.querySelector('[data-index-route="luckysim-hk-prepaid-2026"]')?.click();
await waitFor(() => dom.window.document.querySelector('#directory-guide-panel')?.textContent.includes('HOLD — unresolved constraints remain'), 'LuckySIM HOLD warning in lazy detail');
assert.match(dom.window.document.querySelector('#directory-guide-panel')?.textContent||'', /HKD100|365 days|LuckySIM/i, 'LuckySIM detail must preserve verified retention rule');
search.value = 'Easy PASS'; search.dispatchEvent(new dom.window.Event('input', { bubbles:true }));
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('China Telecom Macau Easy PASS'), 'Macau Easy PASS HOLD route search');
dom.window.document.querySelector('[data-index-route="china-telecom-macau-easy-pass-2026"]')?.click();
await waitFor(() => dom.window.document.querySelector('#directory-guide-panel')?.textContent.includes('HOLD — unresolved constraints remain'), 'Macau Easy PASS HOLD warning in lazy detail');
assert.match(dom.window.document.querySelector('#directory-guide-panel')?.textContent||'', /180 days|MOP50|Easy PASS/i, 'Macau Easy PASS detail must preserve verified retention rule');
search.value = ''; search.dispatchEvent(new dom.window.Event('input', { bubbles:true }));
const japan = dom.window.document.querySelector('#country-filter'); japan.value = 'Japan'; japan.dispatchEvent(new dom.window.Event('change', { bubbles:true }));
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('Japan comparison view'), 'Japan market view');
assert.equal(dom.window.document.querySelector('[data-index-route="sakura-japan-voice-data"]'), null, 'canonical Sakura alias must not duplicate the historical comparison row in market view');
assert.match(dom.window.document.querySelector('#route-list')?.textContent||'', /Sakura Mobile/, 'Japan market must still show the Sakura product once as a route');
dom.window.document.querySelector('[data-family="data"]')?.click();
search.value = 'Mobal Japan Tourist Data'; search.dispatchEvent(new dom.window.Event('input', { bubbles:true }));
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('Mobal Japan Tourist Data SIM'), 'data-family canonical search');
dom.window.document.querySelector('[data-family="temporary"]')?.click();
search.value = 'Turkcell Tourist'; search.dispatchEvent(new dom.window.Event('input', { bubbles:true }));
await waitFor(() => dom.window.document.querySelector('#route-list')?.textContent.includes('Turkcell Tourist SIM'), 'temporary-family canonical search');
dom.window.close();

console.log('phone-radar public release audit: PASS');
