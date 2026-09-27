import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const toolDir = path.join(root, 'frontend', 'tools', 'phone-number-lifecycle-mvp');
const catalog = JSON.parse(fs.readFileSync(path.join(toolDir, 'catalog.json'), 'utf8'));
const tutorial = JSON.parse(fs.readFileSync(path.join(toolDir, 'tutorial-insights.json'), 'utf8'));
const data = JSON.parse(fs.readFileSync(path.join(toolDir, 'retention-intelligence.json'), 'utf8'));
const routes = [...catalog.routes, ...(tutorial.additionalRoutes || [])];
const carrierIds = routes.filter(r => r.numberClass === 'carrier-mobile').map(r => r.id);
const required = [
  'status','confidence','last_verified_at','inactivity_window','clock_start_or_reset',
  'qualifying_activity','non_qualifying_or_unknown_activity','lowest_cost_documented_action',
  'safest_documented_action','minimum_expected_cost','recommended_buffer',
  'grace_or_rescue_window','termination_and_recycling','sources','reminder'
];

let checks = 0;
const check = (name, fn) => { fn(); checks += 1; };

check('all carrier-mobile routes have retention records', () => {
  assert.deepEqual([...carrierIds].sort(), Object.keys(data.routes).sort());
});

for (const id of carrierIds) {
  check(`${id} has complete retention schema`, () => {
    const r = data.routes[id];
    assert(r, `${id} missing retention record`);
    for (const field of required) assert(Object.hasOwn(r, field), `${id} missing ${field}`);
    assert.match(r.last_verified_at, /^\d{4}-\d{2}-\d{2}$/);
    assert(Array.isArray(r.qualifying_activity));
    assert(Array.isArray(r.non_qualifying_or_unknown_activity));
    assert(Array.isArray(r.sources));
    assert(['anchor-offset','manual-deadline','calendar-recurring','unavailable'].includes(r.reminder.status));
  });
}

check('verified routes use first-party sources', () => {
  for (const r of Object.values(data.routes)) {
    if (r.status === 'verified') {
      assert(r.sources.length > 0);
      assert(r.sources.every(s => s.type === 'official' && /^https:\/\//.test(s.url)));
    }
  }
});

check('unknown routes do not invent cost or reminder windows', () => {
  for (const id of ['china-official-carrier', 'local-carrier']) {
    const r = data.routes[id];
    assert.equal(r.status, 'unknown');
    assert.equal(r.confidence, 'unknown');
    assert.equal(r.minimum_expected_cost, null);
    assert.equal(r.recommended_buffer, null);
    assert.equal(r.reminder.status, 'unavailable');
  }
});

check('giffgaff models six-month activity and 30-day PAC rescue', () => {
  const r = data.routes['giffgaff-uk'];
  assert.match(r.inactivity_window, /Six months/i);
  assert.equal(r.minimum_expected_cost.amount, 0.10);
  assert.equal(r.minimum_expected_cost.currency, 'GBP');
  assert.match(r.grace_or_rescue_window, /30 days/i);
  assert.match(r.termination_and_recycling, /recycled/i);
});

check('Lebara separates 90-day barring from further 365-day expiry', () => {
  const r = data.routes['lebara-uk'];
  assert.match(r.inactivity_window, /90 days/i);
  assert.match(r.inactivity_window, /365 days/i);
  assert.equal(r.minimum_expected_cost.amount, 0.19);
  assert.match(r.clock_start_or_reset, /does not explicitly say/i);
});

check('Tello uses paid renewal and 12-day number grace', () => {
  const r = data.routes['tello-us'];
  assert.equal(r.minimum_expected_cost.amount, 5);
  assert.equal(r.minimum_expected_cost.period, '30 days');
  assert.match(r.grace_or_rescue_window, /12 days/i);
  assert.match(r.termination_and_recycling, /no recovery/i);
});

check('Ultra PayGo preserves suspension and conditional extension semantics', () => {
  const r = data.routes['ultra-paygo-us'];
  assert.equal(r.minimum_expected_cost.amount, 3);
  assert.match(r.grace_or_rescue_window, /60 days/i);
  assert.match(r.grace_or_rescue_window, /additional 30-day extension/i);
});

check('H2O separates refill expiry from zero-balance cancellation', () => {
  const r = data.routes['h2o-paygo-us'];
  assert.equal(r.minimum_expected_cost.amount, 9);
  assert.equal(r.minimum_expected_cost.period, '90 days');
  assert.match(r.grace_or_rescue_window, /30 consecutive days/i);
});

check('Mobal keeps unknown non-payment grace explicit', () => {
  const r = data.routes['mobal-japan-voice-data'];
  assert.equal(r.status, 'partial');
  assert.equal(r.minimum_expected_cost.amount, 1650);
  assert.match(r.grace_or_rescue_window, /^Unknown\./);
});

check('Sakura suspension preserves number without pretending SMS continuity', () => {
  const r = data.routes['sakura-japan-voice-data'];
  assert.equal(r.minimum_expected_cost.amount, 220);
  assert.match(r.lowest_cost_documented_action, /suspension/i);
  assert.match(r.non_qualifying_or_unknown_activity.join(' '), /no calls, SMS or data/i);
  assert.match(r.termination_and_recycling, /MNP/i);
});


check('reminder rules preserve route-specific clocks instead of a universal interval', () => {
  assert.deepEqual(data.routes['giffgaff-uk'].reminder.due_offset, { value: 6, unit: 'months' });
  assert.deepEqual(data.routes['lebara-uk'].reminder.due_offset, { value: 90, unit: 'days' });
  assert.deepEqual(data.routes['tello-us'].reminder.due_offset, { value: 30, unit: 'days' });
  assert.deepEqual(data.routes['ultra-paygo-us'].reminder.due_offset, { value: 30, unit: 'days' });
  assert.equal(data.routes['h2o-paygo-us'].reminder.status, 'manual-deadline');
});

check('calendar reminder availability follows evidence completeness', () => {
  assert.equal(data.routes['mobal-japan-voice-data'].reminder.status, 'calendar-recurring');
  assert.equal(data.routes['mobal-japan-voice-data'].reminder.day_of_month, 8);
  assert.equal(data.routes['sakura-japan-voice-data'].reminder.status, 'unavailable');
});

console.log(`phone-number retention audit: ${checks} checks passed`);
