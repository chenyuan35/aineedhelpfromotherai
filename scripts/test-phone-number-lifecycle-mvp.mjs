import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const toolDir = path.join(repoRoot, 'frontend', 'tools', 'phone-number-lifecycle-mvp');
const html = fs.readFileSync(path.join(toolDir, 'index.html'), 'utf8');
const read = name => JSON.parse(fs.readFileSync(path.join(toolDir, name), 'utf8'));
const catalog = read('catalog.json');
const tutorial = read('tutorial-insights.json');
const audit = read('audit-rules.json');
const radar = read('radar-view.json');
const retention = read('retention-intelligence.json');
const purchase = read('purchase-intelligence.json');

const routes = [...catalog.routes];
for (const source of [tutorial, audit]) {
  for (const route of source.additionalRoutes || []) {
    if (!routes.some(r => r.id === route.id)) routes.push(route);
  }
}
const byId = id => routes.find(r => r.id === id);
const entries = Object.entries(radar.routes).map(([id, view]) => ({ id, view, route: byId(id) }));

const checks = [];
function check(name, fn) { fn(); checks.push(name); }

check('page is route-first, not questionnaire-first', () => {
  assert.match(html, /Find the right phone route fast\./);
  assert.match(html, /Long-term SMS \/ OTP/);
  assert.match(html, /Data SIM \/ eSIM/);
  assert.match(html, /Temporary SMS/);
  assert.match(html, /Full guide/);
  assert.doesNotMatch(html, /Register an app or service/);
  assert.doesNotMatch(html, /Travel or move abroad/);
  assert.doesNotMatch(html, /Evidence rule:/);
  assert.doesNotMatch(html, /<form\b/i);
});

check('three route families are fixed', () => {
  assert.deepEqual(Object.keys(radar.families).sort(), ['data','long-term','temporary']);
});

check('every frontstage route resolves to real route data', () => {
  for (const { id, route } of entries) assert(route, `${id} missing from merged route catalog`);
});

check('family classes stay separated', () => {
  for (const { id, view, route } of entries) {
    if (view.family === 'long-term') assert.equal(route.numberClass, 'carrier-mobile', `${id} must be carrier-mobile`);
    if (view.family === 'data') assert.equal(route.numberClass, 'data-only', `${id} must be data-only`);
    if (view.family === 'temporary') assert.equal(route.numberClass, 'temporary-activation', `${id} must be temporary-activation`);
  }
});

check('each family has a useful default shortlist', () => {
  const counts = Object.fromEntries(Object.keys(radar.families).map(f => [f, entries.filter(x => x.view.family === f && x.view.shortlist).length]));
  assert(counts['long-term'] >= 4, 'long-term shortlist too small');
  assert(counts.data >= 3, 'data shortlist must include the admitted long-duration route');
  assert(counts.temporary >= 2, 'temporary shortlist too small');
});

check('long-term cards expose decision fields without fake percentages', () => {
  for (const { id, view } of entries.filter(x => x.view.family === 'long-term')) {
    for (const key of ['smsSignal','keepCost','setup','remote','stability','caveat']) assert(view[key], `${id} missing ${key}`);
    assert.doesNotMatch(view.smsSignal, /%/, `${id} must not publish fake OTP percentage`);
  }
});

check('data cards use data metrics instead of OTP metrics', () => {
  for (const { id, view } of entries.filter(x => x.view.family === 'data')) {
    for (const key of ['dataCost','allowance','coverage','setup','reuse','numberIncluded','caveat']) assert(view[key], `${id} missing ${key}`);
  }
  assert.match(radar.routes['airalo-data'].numberIncluded, /No normal SMS number/i);
  assert.match(radar.routes['mobal-japan-data-physical'].dataCost, /7,920/);
});

check('CMLink exact annual SKU is current, data-only and separated from other product incidents', () => {
  const id = 'cmlink-52-country-365d';
  const route = byId(id);
  const view = radar.routes[id];
  const cap = audit.additionalCapabilities[id];
  assert(route, 'CMLink annual data route missing');
  assert.equal(route.numberClass, 'data-only');
  assert.equal(view.shortlist, true, 'CMLink annual route should fill the default Data-family depth gap');
  assert.match(view.dataCost, /\$12\.50 \/ 365 days/);
  assert.match(view.allowance, /10GB.*512 Kbps/);
  assert.match(view.coverage, /52 countries \/ regions/);
  assert.match(view.numberIncluded, /Data only/i);
  assert.match(view.reuse, /No top-up \/ reinstall/i);
  assert.match(route.purchaseUrl, /mesimgo\.com\/en\/products\/cmlink-52-country-unlimited-10gb-19/);
  assert.match(route.cost.purchase, /USD 12\.50/);
  assert.doesNotMatch(route.cost.purchase, /\$?7\.9/);
  assert(route.evidence.some(e => e.type === 'community' && /nodeseek\.com\/post-932285-1/.test(e.url)), 'recent first-hand CMLink evidence missing');
  assert(route.evidence.some(e => e.type === 'seller-commercial' && /mesimgo\.com/.test(e.url)), 'exact seller SKU evidence missing');
  assert.match(cap.roamingSms.note, /data-only/i);
  assert.match(cap.termination.note, /non-top-up and non-reinstall/i);
  assert.match(cap.incidentSeparation.note, /different MeSIM Singapore eSIM/i);
  assert.doesNotMatch(view.caveat, /failed.*mainland China/i);
});

check('temporary SMS cards disclose durability and privacy tradeoffs', () => {
  for (const { id, view } of entries.filter(x => x.view.family === 'temporary')) {
    for (const key of ['smsSignal','price','coverage','numberType','privacyRisk','availability','caveat']) assert(view[key], `${id} missing ${key}`);
  }
  assert.match(radar.routes['smspool-temp'].numberType, /One-time/i);
  assert.match(radar.routes['5sim-temp'].privacyRisk, /High/i);
});

check('known retention values are represented without pretending suspension means SMS', () => {
  assert.equal(retention.routes['tello-us'].minimum_expected_cost.amount, 5);
  assert.equal(retention.routes['ultra-paygo-us'].minimum_expected_cost.amount, 3);
  assert.equal(retention.routes['sakura-japan-voice-data'].minimum_expected_cost.amount, 220);
  assert.match(radar.routes['sakura-japan-voice-data'].keepCost, /Active plan for SMS/i);
  assert.match(radar.routes['sakura-japan-voice-data'].caveat, /preserves the number only/i);
});

check('A1 Croatia separates current commercial cost from community operating evidence', () => {
  const id = 'a1-croatia-prepaid-esim';
  const route = byId(id);
  const view = radar.routes[id];
  const cap = audit.additionalCapabilities[id];
  assert(route, 'A1 Croatia route missing');
  assert.equal(route.numberClass, 'carrier-mobile');
  assert.equal(view.shortlist, false, 'A1 Croatia must not expand the default five-route shortlist');
  assert.equal(view.stability, 'Watch');
  assert.match(view.keepCost, /€5\/yr/);
  assert.doesNotMatch(view.keepCost, /€2/);
  assert.match(route.purchaseUrl, /a1\.hr\/privatni\/mobiteli\/sim-promo/);
  assert.match(route.cost.recurring, /online top-up page offers EUR 5/i);
  assert.match(route.retention.rule, /community-reported validity window/i);
  assert(route.evidence.some(e => e.type === 'community' && /nodeloc\.com\/t\/topic\/81137/.test(e.url)), 'A1 Croatia community workflow evidence missing');
  assert.match(cap.roamingSms.note, /China Unicom/i);
  assert.match(cap.numberDuration.note, /362 days/i);
  assert.match(cap.termination.note, /not verified/i);
});

check('core acquisition intelligence remains available behind the dashboard', () => {
  for (const id of ['tello-us','ultra-paygo-us','h2o-paygo-us','mobal-japan-voice-data','sakura-japan-voice-data','giffgaff-uk','smspool-temp','5sim-temp']) {
    assert(purchase.routes[id], `${id} missing purchase intelligence`);
  }
});

check('giffgaff incident/trust state is visible as watch rather than buried in prose', () => {
  assert.equal(radar.routes['giffgaff-uk'].stability, 'Watch');
  assert.match(radar.routes['giffgaff-uk'].caveat, /recycling complaints/i);
});

check('page has closed-loop analytics without sensitive data collection', () => {
  for (const event of ['phone_family_select','phone_filter_change','phone_guide_open','phone_outbound_click']) assert(html.includes(event), `missing ${event}`);
  assert.doesNotMatch(html, /type=["'](?:tel|password)["']/i);
  assert.doesNotMatch(html, /name=["']otp["']/i);
});

check('full guide covers action loop', () => {
  for (const marker of ['What to get','What you need','Open / use it','Keep / expiry','Main risk / recovery']) assert(html.includes(marker), `missing guide marker ${marker}`);
  assert.match(html, /Receive a test SMS before linking important accounts/);
  assert.match(html, /do not use an ordinary one-time number as long-term recovery/i);
});

console.log(`phone-radar contract audit: PASS (${checks.length} checks)`);
