import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const toolDir = path.join(root, 'frontend', 'tools', 'phone-number-lifecycle-mvp');
const data = JSON.parse(fs.readFileSync(path.join(toolDir, 'number-supply-intelligence.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(toolDir, 'catalog.json'), 'utf8'));
let checks = 0;
const check = (name, fn) => { fn(); checks += 1; };

check('research layer cannot auto-become recommendation routes', () => {
  assert.equal(data.status, 'research-only');
  for (const id of ['longsms', 'textverified']) assert(!catalog.routes.some(r => r.id.includes(id)));
});

check('provider facts have traceable official sources', () => {
  for (const provider of Object.values(data.providers)) {
    for (const product of Object.values(provider.products)) {
      assert(product.sources?.length > 0);
      assert(product.sources.every(s => s.type === 'provider-official' && /^https:\/\//.test(s.url) && /^\d{4}-\d{2}-\d{2}$/.test(s.checked_on)));
    }
  }
});

check('community claims require traceability instead of copied forum metrics', () => {
  assert(Array.isArray(data.community_signals));
  for (const signal of data.community_signals) {
    assert(/^https:\/\//.test(signal.source_url));
    assert(/^\d{4}-\d{2}-\d{2}$/.test(signal.source_date));
  }
  assert.match(data.policy.communitySignalRule, /source URL/i);
});

check('performance claims are reserved for our measured samples', () => {
  assert(Array.isArray(data.our_measurements));
  assert.match(data.policy.measurementRule, /attempt counts/i);
  assert.doesNotMatch(JSON.stringify(data.providers), /"success_rate"|"median_latency_seconds"|"p90_latency_seconds"/);
});

check('LongSMS long-term rental keeps unverified number type and API unknown', () => {
  const p = data.providers.longsms.products['long-term-rental'];
  assert.equal(p.product_class, 'renewable-rental');
  assert.equal(p.provider_claimed_number_type, 'unknown');
  assert.equal(p.capabilities.api_available, null);
  assert.equal(p.rental_term.maximum_duration, null);
});

check('LongSMS only records the current public price basis and renewal claim', () => {
  const p = data.providers.longsms.products['long-term-rental'];
  assert.equal(p.price.starting_amount, 0.52);
  assert.equal(p.price.basis, '7 days');
  assert.equal(p.rental_term.renewable, true);
  assert.match(p.expiration_rule, /Exact post-expiry.*unknown/i);
});

check('LongSMS dedicated rental is separated from one-time OTP', () => {
  const rental = data.providers.longsms.products['long-term-rental'];
  const otp = data.providers.longsms.products['short-term-otp'];
  assert.equal(rental.number_control.state, 'dedicated-rental');
  assert.equal(otp.product_class, 'one-time-verification');
  assert.equal(otp.price.starting_amount, 0.01);
});

check('TextVerified rental records provider-claimed US non-VoIP without pretending independent verification', () => {
  const p = data.providers.textverified.products.rental;
  assert.equal(p.provider_claimed_number_type, 'US non-VoIP');
  assert.equal(p.independently_verified_number_type, false);
  assert.deepEqual(p.country_coverage.countries, ['United States']);
});

check('TextVerified rental captures renewable control and conditional expired-line recovery', () => {
  const p = data.providers.textverified.products.rental;
  assert.equal(p.rental_term.minimum_duration.value, 1);
  assert.equal(p.rental_term.renewable, true);
  assert.match(p.expiration_rule, /still has the number/i);
  assert.match(p.expiration_rule, /\$10 reactivation fee/i);
});

check('TextVerified rental API and long-term SMS access are explicit', () => {
  const p = data.providers.textverified.products.rental;
  assert.equal(p.capabilities.sms_receive, true);
  assert.equal(p.capabilities.api_available, true);
  assert.equal(p.capabilities.public_inbox, false);
});

check('TextVerified current public rental starting price stays dynamic', () => {
  const p = data.providers.textverified.products.rental;
  assert.equal(p.price.starting_amount, 1.5);
  assert.equal(p.price.currency, 'USD');
  assert.equal(p.price.dynamic, true);
});

check('TextVerified one-time verification is a separate short-lived product', () => {
  const p = data.providers.textverified.products['one-time-verification'];
  assert.equal(p.product_class, 'one-time-verification');
  assert.equal(p.verification_window.minimum_minutes, 5);
  assert.equal(p.verification_window.maximum_minutes, 15);
  assert.match(p.number_control.note, /may be removed at any time/i);
});

check('TextVerified no-code refund rule is stored without inventing success rate', () => {
  const p = data.providers.textverified.products['one-time-verification'];
  assert.match(p.refund_rule, /automatically refunded/i);
  assert.equal(p.price.starting_amount, 0.25);
});

check('unknown lifecycle details remain literal unknowns', () => {
  const p = data.providers.longsms.products['long-term-rental'];
  assert.equal(p.number_reuse_rule, 'unknown');
  assert.equal(p.message_retention_rule, 'unknown');
});

console.log(`phone-number supply intelligence audit: ${checks} checks passed`);
