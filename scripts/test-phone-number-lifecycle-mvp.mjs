import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const toolDir = path.join(repoRoot, 'frontend', 'tools', 'phone-number-lifecycle-mvp');
const html = fs.readFileSync(path.join(toolDir, 'index.html'), 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert(scriptMatch, 'inline phone lifecycle script must exist');

const jsonFiles = new Map();
for (const name of ['catalog.json', 'location-constraints.json', 'route-capabilities.json', 'tutorial-insights.json', 'audit-rules.json', 'purchase-intelligence.json']) {
  const raw = fs.readFileSync(path.join(toolDir, name), 'utf8');
  jsonFiles.set(`./${name}`, JSON.parse(raw));
}

class FakeClassList { toggle() {} }
class FakeElement {
  constructor(id = '') {
    this.id = id;
    this.value = '';
    this.innerHTML = '';
    this.hidden = false;
    this.disabled = false;
    this.textContent = '';
    this.dataset = {};
    this.classList = new FakeClassList();
    this.listeners = {};
  }
  setAttribute(name, value) { this[name] = value; }
  addEventListener(name, fn) { this.listeners[name] = fn; }
  scrollIntoView() {}
  click() { this.clicked = true; }
  remove() { this.removed = true; }
}

const ids = [
  'results', 'service', 'reg-location', 'duration', 'country', 'priority',
  'travel-location', 'destination', 'stay', 'local-number', 'otp', 'keep-home', 'esim',
  'tab-register', 'tab-travel', 'panel-register', 'panel-travel', 'register-form', 'travel-form'
];
const elements = Object.fromEntries(ids.map(id => [id, new FakeElement(id)]));
const submitButtons = [new FakeElement('register-submit'), new FakeElement('travel-submit')];
let lastAnchor = null;
let lastBlob = null;

class FakeBlob {
  constructor(parts, options) {
    this.parts = parts;
    this.options = options;
    lastBlob = this;
  }
}

const document = {
  getElementById(id) {
    if (!elements[id]) elements[id] = new FakeElement(id);
    return elements[id];
  },
  querySelectorAll(selector) {
    if (selector === '.pn-submit') return submitButtons;
    if (selector === '[data-reminder]') return [];
    return [];
  },
  createElement(tag) {
    const el = new FakeElement(tag);
    if (tag === 'a') lastAnchor = el;
    return el;
  },
  body: { appendChild() {} }
};

const context = vm.createContext({
  console,
  document,
  Blob: FakeBlob,
  URL: {
    createObjectURL() { return 'blob:test'; },
    revokeObjectURL() {}
  },
  setTimeout(fn) { fn(); return 1; },
  clearTimeout() {},
  fetch: async url => {
    const data = jsonFiles.get(String(url));
    if (!data) return { ok: false, async json() { throw new Error(`missing fixture ${url}`); } };
    return { ok: true, async json() { return structuredClone(data); } };
  },
  structuredClone
});

// The page calls init() once itself. Add an awaited copy so the test has a reliable readiness barrier.
vm.runInContext(`${scriptMatch[1]}\nglobalThis.__auditReady = init();`, context, { filename: 'phone-number-lifecycle-mvp/index.html' });
await context.__auditReady;

const run = expression => vm.runInContext(expression, context);
const getRoute = id => run(`catalog.routes.find(r=>r.id===${JSON.stringify(id)})`);

function setValues(values) {
  for (const [id, value] of Object.entries(values)) elements[id].value = value;
}
function renderRegistration(values) {
  setValues(values);
  run('renderRegistration({preventDefault(){}})');
  return elements.results.innerHTML;
}
function renderTravel(values) {
  setValues(values);
  run('renderTravel({preventDefault(){}})');
  return elements.results.innerHTML;
}

const checks = [];
function check(name, fn) {
  fn();
  checks.push(name);
}

check('runtime merges tutorial and audit routes', () => {
  assert(getRoute('sakura-japan-voice-data'));
  assert(getRoute('local-data-physical'));
});

check('Claude blocks mapped unsupported physical location', () => {
  assert.equal(run(`serviceAccess(catalog.serviceRules.find(r=>r.id==='claude'),'Mainland China','United States').state`), 'blocked');
});

check('OpenAI API blocks mapped unsupported physical location', () => {
  assert.equal(run(`serviceAccess(catalog.serviceRules.find(r=>r.id==='openai-api'),'Mainland China','United States').state`), 'blocked');
});

check('unmapped Other physical location never gets guessed', () => {
  for (const service of ['claude', 'openai-api', 'whatsapp', 'telegram', 'google']) {
    assert.equal(run(`serviceAccess(catalog.serviceRules.find(r=>r.id==='${service}'),'Other','United States').state`), 'unknown');
  }
});

check('unverified Mainland China app-access cases stop rather than assume phone-only solution', () => {
  for (const service of ['whatsapp', 'telegram', 'google']) {
    assert.equal(run(`serviceAccess(catalog.serviceRules.find(r=>r.id==='${service}'),'Mainland China','Mainland China').state`), 'unknown');
  }
  const out = renderRegistration({
    service: 'whatsapp', 'reg-location': 'Mainland China', duration: 'long', country: 'Mainland China', priority: 'safe'
  });
  assert.match(out, /No number recommendation is shown/);
  assert.doesNotMatch(out, /Best current match/);
});

check('Another country is not treated as an actual mapped number country', () => {
  assert.equal(run(`serviceAccess(catalog.serviceRules.find(r=>r.id==='whatsapp'),'Japan','other').state`), 'unknown');
  const out = renderRegistration({
    service: 'whatsapp', 'reg-location': 'Japan', duration: 'once', country: 'other', priority: 'cheap'
  });
  assert.match(out, /No number recommendation is shown/);
});

check('Claude rejects mapped unsupported number country', () => {
  assert.equal(run(`serviceAccess(catalog.serviceRules.find(r=>r.id==='claude'),'Japan','Mainland China').state`), 'blocked');
});

check('unsupported service location renders no number recommendation', () => {
  const out = renderRegistration({
    service: 'claude', 'reg-location': 'Mainland China', duration: 'long', country: 'United States', priority: 'safe'
  });
  assert.match(out, /No number recommendation is shown/);
  assert.doesNotMatch(out, /Best current match/);
  assert.match(out, /will not guess an unmapped location or use a foreign number as a workaround/i);
});

check('No preference cannot silently choose an arbitrary foreign carrier', () => {
  const eligibleForeign = run(`catalog.routes.filter(r=>registrationRouteEligible(r,'long','any','United States') && r.numberClass==='carrier-mobile' && r.country!=='United States').map(r=>r.id)`);
  assert.deepEqual(Array.from(eligibleForeign), []);
  const out = renderRegistration({
    service: 'whatsapp', 'reg-location': 'United States', duration: 'long', country: 'any', priority: 'safe'
  });
  assert.doesNotMatch(out, /Mobal|Sakura|giffgaff|Lebara/);
});

check('one-time SMS products are eligible only for one-verification duration', () => {
  for (const route of ['activatex-temp', 'smspool-temp', '5sim-temp']) {
    assert.equal(run(`registrationRouteEligible(catalog.routes.find(r=>r.id==='${route}'),'once','United States','United States')`), true);
    assert.equal(run(`registrationRouteEligible(catalog.routes.find(r=>r.id==='${route}'),'short','United States','United States')`), false);
    assert.equal(run(`registrationRouteEligible(catalog.routes.find(r=>r.id==='${route}'),'long','United States','United States')`), false);
  }
});

check('registration never treats data-only route as a phone-number candidate', () => {
  assert.equal(run(`registrationRouteEligible(catalog.routes.find(r=>r.id==='airalo-data'),'long','Japan','Japan')`), false);
  assert.equal(run(`registrationRouteEligible(catalog.routes.find(r=>r.id==='local-data-physical'),'long','Japan','Japan')`), false);
});

check('carrier number class is not mislabeled as provider-specific OTP proof', () => {
  const state = run(`compatibility(catalog.serviceRules.find(r=>r.id==='whatsapp'),catalog.routes.find(r=>r.id==='tello-us'),'long').state`);
  assert.equal(state, 'class-match');
  const out = renderRegistration({
    service: 'whatsapp', 'reg-location': 'United States', duration: 'long', country: 'United States', priority: 'safe'
  });
  assert.match(out, /Provider-specific delivery not proven/);
  assert.match(out, /has not been independently verified/i);
});

check('real local-number travel requirement excludes every data-only route', () => {
  for (const destination of ['Mainland China', 'Japan', 'United Kingdom', 'United States', 'Other']) {
    const classes = run(`travelCandidates(${JSON.stringify(destination)},true,true,true,'Japan',false).map(x=>x.route.numberClass)`);
    assert(Array.from(classes).every(x => x === 'carrier-mobile'), `${destination} leaked a non-carrier route`);
  }
});

check('actual travel render with local number does not show Airalo or physical data fallback', () => {
  const out = renderTravel({
    'travel-location': 'Japan', destination: 'Mainland China', stay: 'short', 'local-number': 'yes', otp: 'yes', 'keep-home': 'yes', esim: 'yes'
  });
  assert.doesNotMatch(out, /Travel data eSIM|Destination local physical data SIM/);
  assert.match(out, /Mainland China official carrier SIM/);
});

check('data-only traveler without eSIM gets a physical data route, not a voice route', () => {
  const ids = run(`travelCandidates('Japan',false,false,false,'United States',false).map(x=>x.route.id)`);
  assert.deepEqual(Array.from(ids), ['mobal-japan-data-physical']);
  const out = renderTravel({
    'travel-location': 'United States', destination: 'Japan', stay: 'short', 'local-number': 'no', otp: 'no', 'keep-home': 'no', esim: 'no'
  });
  assert.match(out, /Mobal Japan Tourist Data SIM/);
  assert.doesNotMatch(out, /Local carrier prepaid SIM\/eSIM/);
});

check('data-only route does not pretend to solve OTP when home line is dropped', () => {
  const out = renderTravel({
    'travel-location': 'United States', destination: 'Japan', stay: 'short', 'local-number': 'no', otp: 'yes', 'keep-home': 'no', esim: 'yes'
  });
  assert.match(out, /requirements leave OTP unresolved/i);
  assert.match(out, /data-only route cannot receive ordinary verification SMS/i);
});

check('long-stay input changes route scoring', () => {
  const short = run(`travelCandidates('Japan',true,true,true,'Japan',false).find(x=>x.route.id==='mobal-japan-voice-data').score`);
  const long = run(`travelCandidates('Japan',true,true,true,'Japan',true).find(x=>x.route.id==='mobal-japan-voice-data').score`);
  assert(long > short, `expected long-stay score (${long}) to exceed short-stay score (${short})`);
});

check('giffgaff first-use and long-term overseas cautions are contextual, not universal', () => {
  const giff = getRoute('giffgaff-uk');
  const comp = { state: 'class-match', note: 'test' };
  const outside = run(`routeCard(catalog.routes.find(r=>r.id==='giffgaff-uk'),0,${JSON.stringify(comp)},activationFit(catalog.routes.find(r=>r.id==='giffgaff-uk'),'Japan'),{currentLocation:'Japan',maintainAbroad:true})`);
  const inside = run(`routeCard(catalog.routes.find(r=>r.id==='giffgaff-uk'),0,${JSON.stringify(comp)},activationFit(catalog.routes.find(r=>r.id==='giffgaff-uk'),'United Kingdom'),{currentLocation:'United Kingdom',maintainAbroad:false})`);
  assert(giff);
  assert.match(outside, /First-use policy risk/);
  assert.match(outside, /Keep-alive is not the whole story/);
  assert.doesNotMatch(inside, /First-use policy risk/);
  assert.doesNotMatch(inside, /Keep-alive is not the whole story/);
});

check('tutorial-derived claims expose provenance links', () => {
  const block = run(`capabilityBlock('Test',{state:'x',label:'Claim',note:'Note',sourceUrl:'https://example.com/source'})`);
  assert.match(block, /https:\/\/example\.com\/source/);
  const tello = run(`insightBlocks(catalog.routes.find(r=>r.id==='tello-us'),{currentLocation:'United States',maintainAbroad:false})`);
  assert.match(tello, /reddit\.com\/r\/Tello/);
  assert.match(tello, /not an official rule/i);
});

check('temporary SMS refund semantics remain separated', () => {
  assert.equal(run(`caps(catalog.routes.find(r=>r.id==='smspool-temp')).refund.state`), 'clear-no-code');
  assert.equal(run(`caps(catalog.routes.find(r=>r.id==='5sim-temp')).refund.state`), 'conditional');
});

check('Mobal assignment and termination facts reach the tool model', () => {
  assert.equal(run(`caps(catalog.routes.find(r=>r.id==='mobal-japan-voice-data')).numberAssignment.state`), 'after-activation');
  assert.equal(run(`caps(catalog.routes.find(r=>r.id==='mobal-japan-voice-data')).termination.state`), 'number-lost');
});

check('Claude and OpenAI temporary-number routes remain rejected', () => {
  for (const service of ['claude', 'openai-api']) {
    for (const route of ['activatex-temp', 'smspool-temp', '5sim-temp']) {
      assert.equal(run(`compatibility(catalog.serviceRules.find(r=>r.id==='${service}'),catalog.routes.find(r=>r.id==='${route}'),'once').state`), 'no');
    }
  }
});

check('purchase intelligence is loaded and exposes core audited routes', () => {
  for (const route of ['tello-us','ultra-paygo-us','h2o-paygo-us','mobal-japan-voice-data','sakura-japan-voice-data','giffgaff-uk','smspool-temp','5sim-temp']) {
    assert(run(`purchaseInfo(catalog.routes.find(r=>r.id==='${route}'))`), `${route} missing purchase intelligence`);
  }
});

check('unknown purchase evidence remains unknown instead of receiving a neutral score', () => {
  const route = getRoute('lebara-uk');
  assert(route);
  assert.equal(run(`purchaseInfo(catalog.routes.find(r=>r.id==='lebara-uk'))`), null);
  const block = run(`purchaseBlock(catalog.routes.find(r=>r.id==='lebara-uk'))`);
  assert.match(block, /Unknown — verify before paying/);
});

check('Tello cost windows model 30 90 and 365 day base costs without hiding tax', () => {
  const p = run(`purchaseInfo(catalog.routes.find(r=>r.id==='tello-us'))`);
  assert.equal(p.price.currency, 'USD');
  assert.equal(p.price.costWindows['30'].amount, 5);
  assert.equal(p.price.costWindows['90'].amount, 15);
  assert.equal(p.price.costWindows['365'].amount, 65);
  assert.match(p.price.tax.note, /tax|surcharge|location/i);
});

check('Ultra PayGo separates recurring service cost from acquisition cost', () => {
  const p = run(`purchaseInfo(catalog.routes.find(r=>r.id==='ultra-paygo-us'))`);
  assert.equal(p.price.setup.amount, null);
  assert.equal(p.price.setup.status, 'channel-specific');
  assert.equal(p.price.recurring.amount, 3);
  assert.equal(p.price.costWindows['30'].amount, 3);
  assert.equal(p.price.costWindows['90'].amount, 9);
  assert.equal(p.price.costWindows['365'].amount, 39);
  assert.match(p.price.costWindows['365'].note, /excludes acquisition price/i);
});

check('Ultra provider-linked eBay option is a reference snapshot, not guaranteed stock', () => {
  const p = run(`purchaseInfo(catalog.routes.find(r=>r.id==='ultra-paygo-us'))`);
  const option = p.purchaseOptions.find(x=>x.id==='ultra-official-ebay-285112988423');
  assert(option);
  assert.equal(option.sellerRelationship, 'official-linked-marketplace');
  assert.equal(option.productClass, 'sealed-physical-sim');
  assert.equal(option.price.allInBeforeTax, 13);
  assert.equal(option.availability.state, 'observed-unavailable');
  assert.match(option.availability.note, /out of stock|ended/i);
});

check('Ultra third-party sealed SIM price gap is like-for-like and explanatory', () => {
  const p = run(`purchaseInfo(catalog.routes.find(r=>r.id==='ultra-paygo-us'))`);
  const option = p.purchaseOptions.find(x=>x.id==='ultra-third-party-sealed-354076563615');
  assert(option);
  assert.equal(option.comparableToReference, true);
  assert.equal(option.price.amount, 48.85);
  assert.equal(option.price.shippingAmount, 5);
  assert.equal(option.price.allInBeforeTax, 53.85);
  assert.equal(option.priceComparison.deltaAmount, 40.85);
  assert.match(option.priceComparison.note, /price-gap signal|not a claim of unfair/i);
});

check('Ultra pre-activated eSIM is not treated as equivalent to a sealed physical SIM', () => {
  const p = run(`purchaseInfo(catalog.routes.find(r=>r.id==='ultra-paygo-us'))`);
  const option = p.purchaseOptions.find(x=>x.id==='ultra-third-party-preactivated-esim-358131980470');
  assert(option);
  assert.equal(option.productClass, 'preactivated-esim');
  assert.equal(option.comparableToReference, false);
  assert.match(option.ownershipWarning, /whose account controls the number|service clock starts/i);
  assert.doesNotMatch(option.ownershipWarning, /VPN|bypass/i);
});

check('Ultra purchase UI shows where-to-buy choices without converting seller metrics into a trust score', () => {
  const block = run(`purchaseBlock(catalog.routes.find(r=>r.id==='ultra-paygo-us'),'365')`);
  assert.match(block, /Where to buy now/);
  assert.match(block, /Acquisition cost is separate from recurring service cost/);
  assert.match(block, /Ultra Mobile Official on eBay/);
  assert.match(block, /Third-party sealed physical SIM on eBay/);
  assert.match(block, /Third-party pre-activated eSIM on eBay/);
  assert.match(block, /marketplace context, not a trust score/i);
  assert.match(block, /out of stock|ended/i);
});

check('Ultra lifecycle evidence preserves roaming limits and does not invent activation geography', () => {
  const route = getRoute('ultra-paygo-us');
  const caps = run(`caps(catalog.routes.find(r=>r.id==='ultra-paygo-us'))`);
  assert.match(caps.roamingSms.note, /does not include data roaming/i);
  assert.equal(caps.termination.state, 'suspension-then-cancellation');
  assert.match(caps.activationFlow.note, /11-character ACT CODE|different activation\/ownership path/i);
  assert.equal(run(`locationConstraints.routes['ultra-paygo-us'].mode`), 'unknown');
  assert.match(run(`locationConstraints.routes['ultra-paygo-us'].summary`), /not yet verified/i);
});

check('Mobal durable cost does not substitute a temporary promotion for the regular price', () => {
  const p = run(`purchaseInfo(catalog.routes.find(r=>r.id==='mobal-japan-voice-data'))`);
  assert.equal(p.price.promotion.status, 'temporary-observed');
  assert.equal(p.price.costWindows['30'].amount, 6600);
  assert.equal(p.price.costWindows['365'].amount, 24750);
  const block = run(`purchaseBlock(catalog.routes.find(r=>r.id==='mobal-japan-voice-data'))`);
  assert.match(block, /Temporary price observed/);
  assert.match(block, /Durable totals use the regular price/i);
});

check('giffgaff free SIM is not misrepresented as known zero total cost', () => {
  const p = run(`purchaseInfo(catalog.routes.find(r=>r.id==='giffgaff-uk'))`);
  assert.equal(p.price.setup.amount, 0);
  assert.equal(p.price.costWindows['30'].status, 'unknown');
  const block = run(`purchaseBlock(catalog.routes.find(r=>r.id==='giffgaff-uk'))`);
  assert.match(block, /30-day base cost<\/dt><dd>Unknown — verify before paying/);
});

check('temporary SMS marketplace prices are not converted into fake successful-verification totals', () => {
  for (const route of ['smspool-temp','5sim-temp']) {
    const p = run(`purchaseInfo(catalog.routes.find(r=>r.id==='${route}'))`);
    assert.equal(p.price.costWindows['30'].amount, null);
    assert.match(p.price.costWindows['30'].note, /expected successful cost|low list price/i);
    assert.equal(p.purchaseSafety.numberControl.state, 'temporary-not-owned');
  }
});

check('independent review snapshots are rendered as context and explicitly not a trust score', () => {
  const block = run(`purchaseBlock(catalog.routes.find(r=>r.id==='tello-us'))`);
  assert.match(block, /snapshot, not a trust score/i);
  assert.match(block, /Trustpilot/);
});

check('safe priority rewards strong direct purchase evidence and penalizes long-term temporary ownership', () => {
  const tello = run(`purchaseSafetyAdjustment(catalog.routes.find(r=>r.id==='tello-us'),'safe','long')`);
  const sms = run(`purchaseSafetyAdjustment(catalog.routes.find(r=>r.id==='smspool-temp'),'safe','long')`);
  const unknown = run(`purchaseSafetyAdjustment(catalog.routes.find(r=>r.id==='lebara-uk'),'safe','long')`);
  assert(tello > 0);
  assert(sms < 0);
  assert(unknown < 0);
});

check('cheap preference compares only known numeric cost windows in one currency', () => {
  const out = run(`(()=>{const a={route:catalog.routes.find(r=>r.id==='tello-us'),score:0};const b={route:catalog.routes.find(r=>r.id==='h2o-paygo-us'),score:0};applyCostPreference([a,b],'cheap','long');return [a.score,b.score]})()`);
  assert(Array.from(out).some(x=>x>0));
  const mixed = run(`(()=>{const a={route:catalog.routes.find(r=>r.id==='tello-us'),score:0};const b={route:catalog.routes.find(r=>r.id==='mobal-japan-voice-data'),score:0};applyCostPreference([a,b],'cheap','long');return [a.score,b.score]})()`);
  assert.deepEqual(Array.from(mixed), [0,0]);
});

check('short-duration cheap comparison uses the 90-day window', () => {
  const result = run(`(()=>{const orig1=purchaseIntelligence.routes['tello-us'].price.costWindows;const orig2=purchaseIntelligence.routes['h2o-paygo-us'].price.costWindows;const a={route:catalog.routes.find(r=>r.id==='tello-us'),score:0};const b={route:catalog.routes.find(r=>r.id==='h2o-paygo-us'),score:0};applyCostPreference([a,b],'cheap','short');return [a.score,b.score,orig1['90'].amount,orig2['90'].amount]})()`);
  assert.notEqual(result[0], result[1]);
  assert.equal(result[2], 15);
});

check('rendered route card puts cost and purchase safety before activation details', () => {
  const out = run(`routeCard(catalog.routes.find(r=>r.id==='tello-us'),0,{state:'class-match',note:'test'},activationFit(catalog.routes.find(r=>r.id==='tello-us'),'United States'),{currentLocation:'United States'})`);
  assert.match(out, /Cost &amp; purchase safety|Cost & purchase safety/);
  assert(out.indexOf('Cost &amp; purchase safety') < out.indexOf('Activation') || out.indexOf('Cost & purchase safety') < out.indexOf('Activation'));
  assert.match(out, /30-day base cost/);
  assert.match(out, /Refund clarity/);
  assert.match(out, /Number control/);
  assert.match(out, /Last verified/);
});

check('registration result surfaces cost purchase safety in the actual user path', () => {
  const out = renderRegistration({
    service: 'whatsapp', 'reg-location': 'United States', duration: 'long', country: 'United States', priority: 'safe'
  });
  assert.match(out, /Cost &amp; purchase safety|Cost & purchase safety/);
  assert.match(out, /30-day base cost/);
  assert.match(out, /Purchase evidence confidence/);
  assert.match(out, /Last verified/);
});

check('acceptance scenario 01: US long-term WhatsApp shows durable cost, purchase safety and OTP uncertainty', () => {
  const out = renderRegistration({service:'whatsapp','reg-location':'United States',duration:'long',country:'United States',priority:'safe'});
  assert.match(out, /Tello US mobile number/);
  assert.match(out, /365-day base cost/);
  assert.match(out, /Official direct/);
  assert.match(out, /Provider-specific delivery not proven/);
  assert.match(out, /Keep alive/);
});

check('acceptance scenario 02: US one-time WhatsApp can surface temporary marketplaces with ownership warnings', () => {
  const out = renderRegistration({service:'whatsapp','reg-location':'United States',duration:'once',country:'United States',priority:'cheap'});
  assert.match(out, /SMSPool|5SIM|ActivateX/);
  assert.match(out, /temporary|one-time|Marketplace/i);
  assert.match(out, /Number control/);
});

check('acceptance scenario 03: UK long-term WhatsApp does not turn free SIM into a zero-cost promise', () => {
  const out = renderRegistration({service:'whatsapp','reg-location':'United Kingdom',duration:'long',country:'United Kingdom',priority:'safe'});
  assert.match(out, /giffgaff UK mobile number/);
  assert.match(out, /30-day base cost<\/dt><dd>Unknown — verify before paying/);
  assert.match(out, /UK-address only|UK address/i);
});

check('acceptance scenario 04: Japan long-term WhatsApp shows identity, real cost and number-loss consequences', () => {
  const out = renderRegistration({service:'whatsapp','reg-location':'Japan',duration:'long',country:'Japan',priority:'safe'});
  assert.match(out, /Mobal Japan Voice\+Data 5G number|Sakura Mobile Japan Voice\+Data/);
  assert.match(out, /JPY/);
  assert.match(out, /KYC \/ identity/);
  assert.match(out, /If service ends/);
});

check('acceptance scenario 05: Claude in Japan never falls back to temporary activation marketplaces', () => {
  const out = renderRegistration({service:'claude','reg-location':'Japan',duration:'long',country:'Japan',priority:'safe'});
  assert.doesNotMatch(out, /SMSPool|5SIM|ActivateX/);
  assert.match(out, /Provider-specific delivery not proven|Compatibility not proven/);
});

check('acceptance scenario 06: Claude from Mainland China stops before purchase advice', () => {
  const out = renderRegistration({service:'claude','reg-location':'Mainland China',duration:'long',country:'United States',priority:'safe'});
  assert.match(out, /No number recommendation is shown/);
  assert.doesNotMatch(out, /Official direct|Marketplace \/ temporary-number seller/);
});

check('acceptance scenario 07: unmapped Google location refuses to invent a buying route', () => {
  const out = renderRegistration({service:'google','reg-location':'Other',duration:'long',country:'United States',priority:'safe'});
  assert.match(out, /No number recommendation is shown/);
});

check('acceptance scenario 08: OpenAI API US long-term route keeps temporary sellers out', () => {
  const out = renderRegistration({service:'openai-api','reg-location':'United States',duration:'long',country:'United States',priority:'safe'});
  assert.doesNotMatch(out, /SMSPool|5SIM|ActivateX/);
  assert.match(out, /Tello US mobile number|H2O Wireless Pay As You Go US number|Ultra Mobile PayGo/);
});

check('acceptance scenario 09: short Japan trip needing a local number shows a Japanese carrier purchase path', () => {
  const out = renderTravel({'travel-location':'United States',destination:'Japan',stay:'short','local-number':'yes',otp:'yes','keep-home':'yes',esim:'yes'});
  assert.match(out, /Mobal Japan Voice\+Data 5G number|Sakura Mobile Japan Voice\+Data/);
  assert.match(out, /Cost & purchase safety/);
  assert.match(out, /KYC \/ identity/);
});

check('acceptance scenario 10: long Japan stay visibly weights durable control and cancellation risk', () => {
  const out = renderTravel({'travel-location':'United States',destination:'Japan',stay:'long','local-number':'yes',otp:'yes','keep-home':'yes',esim:'yes'});
  assert.match(out, /Long stay:/);
  assert.match(out, /Number control/);
  assert.match(out, /If service ends/);
});

check('acceptance scenario 11: data-only Japan trip with eSIM does not pretend the product includes a number', () => {
  const out = renderTravel({'travel-location':'United States',destination:'Japan',stay:'short','local-number':'no',otp:'no','keep-home':'no',esim:'yes'});
  assert.match(out, /Travel data eSIM/);
  assert.match(out, /You probably do not need a new phone number/);
  assert.match(out, /Cost & purchase safety/);
  assert.doesNotMatch(out, /You need a real Japan number route/);
});

check('acceptance scenario 12: non-eSIM data traveler is told the physical-data purchase layer is still unverified', () => {
  const out = renderTravel({'travel-location':'United States',destination:'Japan',stay:'short','local-number':'no',otp:'no','keep-home':'no',esim:'no'});
  assert.match(out, /Mobal Japan Tourist Data SIM/);
  assert.match(out, /JPY 7,920|7,920/);
});

check('acceptance scenario 13: traveler to the US sees US carrier activation constraints rather than a foreign shortcut', () => {
  const out = renderTravel({'travel-location':'Japan',destination:'United States',stay:'short','local-number':'yes',otp:'yes','keep-home':'yes',esim:'yes'});
  assert.match(out, /Tello US mobile number|H2O Wireless Pay As You Go US number|Ultra Mobile PayGo/);
  assert.match(out, /after arrival|activation|United States/i);
});

check('acceptance scenario 14: traveler to the UK sees UK carrier routes and purchase evidence', () => {
  const out = renderTravel({'travel-location':'United States',destination:'United Kingdom',stay:'short','local-number':'yes',otp:'yes','keep-home':'yes',esim:'yes'});
  assert.match(out, /giffgaff UK mobile number|Lebara UK PAYG mobile number/);
  assert.match(out, /Cost & purchase safety/);
});

check('acceptance scenario 15: traveler to Mainland China gets an official-carrier route but no invented price', () => {
  const out = renderTravel({'travel-location':'Japan',destination:'Mainland China',stay:'short','local-number':'yes',otp:'no','keep-home':'yes',esim:'yes'});
  assert.match(out, /Mainland China official carrier SIM/);
  assert.match(out, /Unknown — verify before paying/);
  assert.match(out, /official|self-operated/i);
});

check('acceptance scenario 16: travel data without either SMS-capable line keeps OTP unresolved', () => {
  const out = renderTravel({'travel-location':'United States',destination:'Japan',stay:'short','local-number':'no',otp:'yes','keep-home':'no',esim:'yes'});
  assert.match(out, /requirements leave OTP unresolved/i);
  assert.match(out, /data-only route cannot receive ordinary verification SMS/i);
});

check('Japan Airalo data route uses destination-specific current package pricing', () => {
  const p = run(`purchaseInfo(catalog.routes.find(r=>r.id==='airalo-data'),'Japan')`);
  assert.equal(p.price.currency, 'USD');
  assert.equal(p.price.costWindows['30'].amount, 11);
  const out = renderTravel({'travel-location':'United States',destination:'Japan',stay:'short','local-number':'no',otp:'no','keep-home':'no',esim:'yes'});
  assert.match(out, /Estimated base cost for this scenario:<\/strong> USD 11/);
  assert.match(out, /data-only/i);
});

check('Japan physical-data fallback is now a concrete current product rather than a generic research route', () => {
  const route = getRoute('mobal-japan-data-physical');
  assert(route);
  const p = run(`purchaseInfo(catalog.routes.find(r=>r.id==='mobal-japan-data-physical'),'Japan')`);
  assert.equal(p.price.costWindows['30'].amount, 7920);
  assert.equal(route.numberClass, 'data-only');
});

check('Mainland China official-carrier purchase channel shows official process but no invented plan total', () => {
  const p = run(`purchaseInfo(catalog.routes.find(r=>r.id==='china-official-carrier'),'Mainland China')`);
  assert.equal(p.sellerRelationship, 'official-channel');
  assert.equal(p.price.setup.amount, 0);
  assert.equal(p.price.costWindows['30'].amount, null);
  const out = renderTravel({'travel-location':'Japan',destination:'Mainland China',stay:'short','local-number':'yes',otp:'no','keep-home':'yes',esim:'yes'});
  assert.match(out, /Carrier-owned China Mobile \/ China Unicom \/ China Telecom service hall/);
  assert.match(out, /Official channel, plan price varies/);
});

check('Mobal Voice+Data cost model matches the route product instead of a cheaper voice-only baseline', () => {
  const p = run(`purchaseInfo(catalog.routes.find(r=>r.id==='mobal-japan-voice-data'),'Japan')`);
  assert.match(p.price.basis, /Voice\+Data 5G/);
  assert.equal(p.price.recurring.amount, 1650);
  assert.equal(p.price.costWindows['30'].amount, 6600);
  assert.equal(p.price.costWindows['365'].amount, 24750);
});

check('keep-alive export still emits a valid calendar shell', () => {
  lastBlob = null;
  lastAnchor = null;
  run(`exportReminder(catalog.routes.find(r=>r.id==='giffgaff-uk'))`);
  assert(lastBlob, 'calendar blob was not created');
  const body = lastBlob.parts.join('');
  assert.match(body, /BEGIN:VCALENDAR/);
  assert.match(body, /BEGIN:VEVENT/);
  assert.match(body, /END:VCALENDAR/);
  assert.equal(lastAnchor?.download, 'phone-number-keepalive-giffgaff-uk.ics');
  assert.equal(lastAnchor?.clicked, true);
});

console.log(`phone-number-lifecycle audit: ${checks.length} checks passed`);
