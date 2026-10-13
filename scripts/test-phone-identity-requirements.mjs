import assert from 'node:assert/strict';
import fs from 'node:fs';
import {classifyIdentity} from './phone-identity-requirements.mjs';
const root=new URL('../',import.meta.url);
const r=JSON.parse(fs.readFileSync(new URL('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json',root),'utf8')).routes;
const by=new Map(r.map(x=>[x.id,x.decisionFacts.identity]));
assert.equal(r.length,160);
for(const id of [
 'hotmobile-il-2026','speakout-711-365voucher-2026','telemach-prepaid-si-2026','vodafone-nl-prepaid-2026'
])assert.equal(by.get(id).status,'unverified','invalid historical no-KYC assertion must not become a no-doc conclusion: '+id);
assert.equal(by.get('esimgg-estonia-372-2026').status,'unknown');
assert.equal(by.get('sunrise-prepaid-2026').status,'required');
assert.equal(by.get('sunrise-prepaid-2026').passport,'documented-for-described-flow');
for(const id of ['clubsim-sms-pack-6hkd-2026','cmhk-mysim-hk-2026','csl-711-prepaid-hk-2026']){
 assert.equal(by.get(id).status,'required');
 assert.equal(by.get(id).passport,'documented-for-described-flow');
 assert.match(by.get(id).scopeCaution,/BN\(O\) passports/);
}
for(const id of ['ee-uk-payg-180d-2026','tello-paygo-credit-2026','h2o-paygo-10-90d-2026']){
 assert.equal(by.get(id).status,'no-photo-id-reported');
 assert.match(by.get(id).scopeCaution,/not an anonymous-SIM guarantee/i);
}
assert.equal(by.get('o2-cz-prepaid-2026').passport,'mentioned-only','SIM replacement identity is not new-line eligibility');
assert.equal(by.get('kyivstar-prepaid-274-91-2026').passport,'mentioned-only','without passport does not imply anonymous');
assert.equal(by.get('starhub-prepaid-sg-2026').status,'required');
assert.match(by.get('starhub-prepaid-sg-2026').scopeCaution,/30-day tourist path/);
assert.equal(by.get('singtel-hi-prepaid-passport-30d-2026').passport,'documented-for-described-flow');
assert.match(by.get('singtel-hi-prepaid-passport-30d-2026').scopeCaution,/NOT a long-term retention route/);
assert.equal(by.get('saily-us-phone-number-2026').status,'required');
// Generated UI decisions must agree with original, negated/unknown identity text.
for(const id of [
 'tesco-mobile-payg-uk-2026','three-uk-payg-180d-2026',
 '1pmobile-uk-2026','id-mobile-uk-2026','smarty-uk-2026',
 'mint-mobile-us-2026','lycamobile-us-2026','google-fi-flexible-2026'
])assert.equal(by.get(id).status,'unverified','identity false positive: '+id);
assert.equal(by.get('ultra-mobile-paygo-3-2026').status,'no-photo-id-reported');
assert.equal(by.get('optus-flex-plus-au-2026').status,'required');
const polarityCases=[
 ['No mandatory prepaid identity-registration flow was found for Tesco Mobile PAYG.','unverified'],
 ['No identity check is required for this prepaid path.','unverified'],
 ['No universal PAYG identity-document requirement established.','unverified'],
 ['A valid form of ID is required for prepaid activation.','required']
];
for(const [raw,want] of polarityCases)assert.equal(classifyIdentity('test-unreviewed',raw).status,want,raw);
const fake=[
 ['The legacy blanket no-KYC claim was withdrawn; current requirements remain unverified','unverified'],
 ['No credit check advertised, ID requirements not established','unverified'],
 ['Provider states no ID verification for this PAYG signup','unverified'], // no override: not proof of legal scope
 ['Identity registration is mandatory; visa acceptance is not confirmed','required'],
 ['No passport required in that path; other ID unknown','unverified']
];
for(const [raw,want] of fake)assert.equal(classifyIdentity('test-unreviewed',raw).status,want,raw);
const src=fs.readFileSync(new URL('frontend/tools/phone-number-lifecycle-mvp/index.html',root),'utf8');
assert.match(src,/id="identity-filter"/);
assert.match(src,/value="passport">Passport path documented/);
assert.match(src,/value="no-id">No photo-ID check reported/);
assert.match(src,/function identityStatusText\(r\)/);
assert.match(src,/function passportStatusText\(r\)/);
assert.match(src,/function identityMatches\(r\)/);
assert.match(src,/function dirIdentityText\(r\)/);
assert.match(src,/Identity documents \/ requirements/);
assert(!src.includes('KYC not required'));
assert(!src.includes('KYC: ${kyc}'));
console.log('KYC/identity: 160 paths conservative, misclassified no-KYC retracted, verified passport scoped, 5 photo-ID reports caveated — PASS');
