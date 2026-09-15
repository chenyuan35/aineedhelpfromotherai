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
for (const name of ['catalog.json', 'location-constraints.json', 'route-capabilities.json', 'tutorial-insights.json', 'audit-rules.json']) {
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
  assert.deepEqual(Array.from(ids), ['local-data-physical']);
  const out = renderTravel({
    'travel-location': 'United States', destination: 'Japan', stay: 'short', 'local-number': 'no', otp: 'no', 'keep-home': 'no', esim: 'no'
  });
  assert.match(out, /Destination local physical data SIM/);
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
