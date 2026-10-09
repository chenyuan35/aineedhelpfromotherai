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

// Task-first finder: fail-closed S4 task validation against canonical data.
// These are deterministic simulated browser interactions, NOT real people/actual checkout.
const taskDoc = dom.window.document;
const taskList = () => [...taskDoc.querySelectorAll('[data-task-route]')].map(el=>el.dataset.taskRoute);
const researchList = () => [...taskDoc.querySelectorAll('[data-task-research-route]')].map(el=>el.dataset.taskResearchRoute);
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
assert.match(page,/id="pr-task-research"/,'research candidates must have a separate opt-in disclosure');
assert.match(page,/id="pr-task-advanced"/,'extra filters must be optionally expandable');
assert.match(page,/@media\(max-width:345px\)/,'375 and 390 layouts keep two columns, narrow screens degrade to one');
await waitFor(()=>taskList().length===Math.min(5,eligibleIndex.length),'first-screen evidence shortlist');
assert(eligibleIndex.length>0&&eligibleIndex.length<canonicalIndex.routes.length,'only vetted routes should be shortlisted');
for(const id of taskList()) assert(eligibleIndex.some(r=>r.id===id),'default shortlist must be admitted/public/real-mobile');
assert.match(taskDoc.getElementById('pr-task-summary').textContent,/evidence-screened/);

// S3-derived scenarios: 5 P0 mainland China (3 with deliberately weak app reports),
// 3 P1 existing-US-number preservation/port-in, 2 negative cases. None can claim a
// confirmed China-first activation / bank SMS / US port route from this evidence.
const cases = [
  {id:'P0-1',job:'verify',location:'china',market:'United Kingdom',form:'esim',service:'telegram',research:2},
  {id:'P0-2',job:'verify',location:'china',market:'United Kingdom',form:'any',service:'openai',research:1},
  {id:'P0-3',job:'verify',location:'china',market:'Hong Kong',form:'any',service:'telegram',research:0},
  {id:'P0-4',job:'buy',location:'china',market:'Croatia',form:'esim',service:'any',research:0},
  {id:'P0-5',job:'verify',location:'china',market:'United Kingdom',form:'any',service:'whatsapp',research:2},
  {id:'P1-6',job:'keep',location:'abroad',market:'United States',form:'esim',service:'bank',research:0},
  {id:'P1-7',job:'keep',location:'abroad',market:'United States',form:'any',service:'any',research:0},
  {id:'P1-8',job:'keep',location:'abroad',market:'United States',form:'any',service:'bank',research:0},
  {id:'NEG-9',job:'buy',location:'china',market:'United States',form:'esim',service:'bank',research:0},
  {id:'NEG-10',job:'buy',location:'china',market:'United States',form:'esim',service:'any',research:0}
];
let passedTasks=0;
for(const scenario of cases){
  taskReset();
  for(const field of ['job','location','market','form','service']) taskFilter(field,scenario[field]);
  assert.equal(taskList().length,0,scenario.id+': remote first activation / port / bank requests must not have verified winners');
  assert.match(taskDoc.getElementById('pr-task-summary').textContent,/No verified matches/i,scenario.id+': explicit no-verified-match copy');
  assert.equal(researchList().length,scenario.research,scenario.id+': only eligible optional research candidates are shown');
  assert.equal(taskDoc.getElementById('pr-task-research').hidden,scenario.research===0,scenario.id+': research section disclosure visibility');
  for(const id of researchList()){
    const r=eligibleIndex.find(x=>x.id===id);
    assert(r,scenario.id+': HOLD/backstage/VoIP/data must never be a research candidate');
    const el=taskDoc.querySelector('[data-task-research-route="'+id+'"]');
    assert.match(el.textContent,/Research only.+NOT verified/i,scenario.id+': research must be labeled as not verified');
    assert.match(el.textContent,/UNVERIFIED/i,scenario.id+': research must state remote activation unknown');
    assert.match(el.textContent,/independent source/i,scenario.id+': distinguish sources from raw observations');
  }
  passedTasks++;
}
assert.equal(passedTasks,10,'ten S3-derived scenarios must produce safe, deterministic S4 answers');

// S5: reviewed primary continuity reports and Lebara's explicit UK-activation
// policy must be visible without promoting remote candidates to winners.
taskReset();
const giffCard=taskDoc.querySelector('[data-task-route="giffgaff-uk-direct-esim-payg"]');
const lebaraCard=taskDoc.querySelector('[data-task-route="lebara-uk-direct-esim-china"]');
assert(giffCard && lebaraCard,'both UK research routes must remain eligible only in the ordinary shortlist');
assert.match(giffCard.textContent,/some numbers were closed, some stayed active/,'continuity must preserve contradictory user outcomes');
assert.match(giffCard.textContent,/Recovery and refunds are NOT guaranteed/,'no recovery promise');
assert(giffCard.querySelector('a[href="https://linux.do/t/topic/2996513"]'),'dated Oct 8 firsthand refund source is linked');
assert(giffCard.querySelector('a[href="https://linux.do/t/topic/2894665"]'),'dated firsthand port-out source is linked');
assert.match(lebaraCard.textContent,/Lebara requires UK service activation/,'official Lebara overseas activation restriction visible');
assert.match(lebaraCard.textContent,/does NOT establish supported, complete first activation abroad/,'one mainland SMS report cannot be promoted');
assert(lebaraCard.querySelector('a[href="https://www.lebara.co.uk/en/help/esim.html"]'),'Lebara official constraint linked');
assert(lebaraCard.querySelector('a[href="https://linux.do/t/topic/2745784"]'),'Lebara first-hand mainland exception linked');


// Disclosure click and source drill-down should work from research cards without
// turning the research suggestion into a verified recommendation.
taskReset();
taskFilter('location','china');taskFilter('market','United Kingdom');taskFilter('service','telegram');
const researchId=researchList()[0];
assert(researchId,'China research flow must show a genuine candidate after explicit disclosure');
taskDoc.getElementById('pr-task-research').open=true;
taskDoc.querySelector('[data-task-research-route="'+researchId+'"] [data-task-open]').click();
await waitFor(()=>taskDoc.querySelector('#pr-task-detail')?.dataset.route===researchId,'research-only detail opens existing lazy source');
assert.match(taskDoc.querySelector('#pr-task-detail').textContent,/Evidence boundary/i);
assert.match(taskDoc.getElementById('pr-task-research-results').textContent,/independent source/);
assert.match(taskDoc.getElementById('pr-task-research-results').textContent,/last observed/i);
assert.match(taskDoc.getElementById('pr-task-research-results').textContent,/setup|activation|UNVERIFIED/i);
taskReset();

// Non-remote candidates, strict eSIM and documented cost filters still work.
taskFilter('form','esim');
for(const id of taskList())assert(/\besim\b/i.test(eligibleIndex.find(r=>r.id===id).form||''),'eSIM filter must be explicit');
taskFilter('form','any');
for(const service of ['telegram','whatsapp','openai']){
  taskFilter('service',service);
  for(const id of taskList()){
    const r=eligibleIndex.find(x=>x.id===id);
    assert((r.serviceEvidence||[]).some(e=>e.serviceId===service&&e.successCount>0),
      'app evidence must be positive before a named-app shortlist');
  }
  assert.match(taskDoc.getElementById('pr-task-summary').textContent,/NOT verified|No verified matches/);
}
taskFilter('service','any');
taskFilter('keep','10');
for(const id of taskList()){
  const r=eligibleIndex.find(x=>x.id===id);
  assert(Number.isFinite(r.metrics.keepYearCostCny)&&r.metrics.keepYearCostCny<=10,'keep budget strict');
}
taskFilter('keep','any');
taskFilter('market','United States');
assert.equal(taskList().length,0,'US region cannot turn into UK winner');
assert.match(taskDoc.getElementById('pr-task-summary').textContent,/No verified matches/);
taskFilter('market','any');
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
