import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const summary=read('frontend/tools/phone-number-lifecycle-mvp/phone-route-summaries.json').routes;
const routes=read('data/phone/v1/routes.json'),snapshots=read('data/phone/v1/snapshots.json'),sources=read('data/phone/v1/sources.json');
const src=new Map(sources.map(s=>[s.id,s]));
const counts={required:0,'no-photo-id-reported':0,unverified:0,unknown:0};
const passportCounts={'documented-for-described-flow':0,'mentioned-only':0,'not-established':0};
const rows=[];
const identity=new Map(summary.map(r=>[r.id,r.decisionFacts.identity]));
const special=['hotmobile-il-2026','speakout-711-365voucher-2026','sunrise-prepaid-2026','telemach-prepaid-si-2026','vodafone-nl-prepaid-2026','kyivstar-prepaid-274-91-2026','o2-cz-prepaid-2026','esimgg-estonia-372-2026'];
for(const id of special)assert(summary.some(r=>r.id===id));
for(const r of summary){
 const item=r.decisionFacts.identity;
 assert(item && ['required','no-photo-id-reported','unverified','unknown'].includes(item.status),r.id+' identity status');
 assert(['documented-for-described-flow','mentioned-only','not-established'].includes(item.passport),r.id+' passport scope');
 assert(typeof item.identityNotes==='string' && item.identityNotes.length>5,r.id+' original KYC provenance');
 assert(typeof item.scopeCaution==='string'&&item.scopeCaution.length>20,r.id+' new-buyer caution');
 counts[item.status]++;passportCounts[item.passport]++;
 assert(!(/\b(?:no[ -]kyc|kyc not required|completely anonymous|no documents at all)\b/i.test(item.status)),r.id);
 if(item.passport==='documented-for-described-flow')assert(item.identityNotes.toLowerCase().includes('passport'),r.id+' documented passport needs evidence');
 const route=routes.find(x=>x.id===r.id);
 const official=route?.sourceIds.map(id=>src.get(id)).find(s=>s && /official|regulator/.test(s.type));
 const officialLink=official?.url||'not independently anchored in this report';
 rows.push({id:r.id,market:r.marketName,number:r.numberClass,status:item.status,passport:item.passport,
    hints:item.documentHints?.join(', ')||'not documented',source:officialLink,
    notes:item.identityNotes.replaceAll('|','/')});
}
assert.equal(summary.length,160);
for(const x of ['hotmobile-il-2026','speakout-711-365voucher-2026','telemach-prepaid-si-2026','vodafone-nl-prepaid-2026','esimgg-estonia-372-2026'])assert(!['required','no-photo-id-reported'].includes(identity.get(x).status));
assert.equal(identity.get('sunrise-prepaid-2026').status,'required');
assert.equal(identity.get('sunrise-prepaid-2026').passport,'documented-for-described-flow');
assert.equal(identity.get('clubsim-sms-pack-6hkd-2026').status,'required');
assert.equal(identity.get('clubsim-sms-pack-6hkd-2026').passport,'documented-for-described-flow');
assert.equal(identity.get('tello-paygo-credit-2026').status,'no-photo-id-reported');
assert.equal(identity.get('ee-uk-payg-180d-2026').status,'no-photo-id-reported');
assert.equal(identity.get('kyivstar-prepaid-274-91-2026').passport,'mentioned-only');
assert.equal(identity.get('o2-cz-prepaid-2026').passport,'mentioned-only');
assert.equal(identity.get('singtel-hi-prepaid-passport-30d-2026').status,'required');
assert.match(identity.get('singtel-hi-prepaid-passport-30d-2026').scopeCaution,/30 days/);
const internal=path.join(root,'docs/PHONE_IDENTITY_REQUIREMENTS_AUDIT_2026-10-11.md');
const report=[
'# Phone Radar identity/passport requirements coverage audit — 2026-10-11',
'',
'**STAGED LOCAL DATA ONLY, NOT LIVE, NOT A LEGAL OR PURCHASE ELIGIBILITY CERTIFICATION.** Parent #486, then local one-release QA batch. See issue #487. User requests specific documents vs. no ID: there is no justified universal no-KYC label. Values below describe the **current route-specific evidence** rather than independently verified legal status for every one of 160 products.',
'',
'## Mutually exclusive identity/document statuses (160 total)',
'',
...Object.entries(counts).map(([k,v])=>'- `'+k+'`: **'+v+'**'),
'',
'## Passport path scope (independent dimension; not an extra 160 routes)',
'',
...Object.entries(passportCounts).map(([k,v])=>'- `'+k+'`: **'+v+'**'),
'',
'**Definitions:** `required` means reviewed text explicitly describes an identity-registration/check; exact national eligibility can still be unresolved. `no-photo-id-reported` means one particular prepaid path is reported to omit an ID-photo check, **not** that all account/purchase/recovery paths are anonymous or KYC-free. `unverified` means reviewed materials did not settle a new-line document requirement, including items about credit checks and different operations. `unknown` means no directly qualifying current route KYC record or negative disclaimer. `documented-for-described-flow` means the reviewed specific operation mentions an accepted passport; it does not prove an arbitrary Chinese/foreign passport works online abroad. `mentioned-only` means passport was referenced without proved applicability to NEW number registration. `not-established` must never be advertised as passport prohibited or no ID needed.',
'',
'## Important primary-source checks and exceptions',
'',
'- **Sunrise Switzerland:** [Sunrise prepaid](https://www.sunrise.ch/en/mobile/prepaid) says a valid ID or passport is required for registration; [Sunrise digital identification](https://www.sunrise.ch/en/support/contracts-and-customer-information/passwords-and-logins/digital-identification) details ID/passport/residence permit and a short video. A foreign address does **not** waive verification. Earlier keyword classifier incorrectly called it no-KYC.',
'- **HK ClubSIM, CMHK MySIM and csl:** [Hong Kong OFCA](https://www.ofca.gov.hk/en/consumer_focus/guide/hot_topics/sim_registration/faq/index.html) requires real-name registration for prepaid SIMs before activation; HKID holders normally use HKID, a customer without HKID may use another permitted valid travel document/passport, with exclusions for HKSAR/BN(O) passports. A pre-registered SIM from another person is not a legal alternative. Provider-specific foreign passport/onboarding acceptance still needs checking.',
'- **Slovenia Telemach Free2Go:** [provider Free2Go RLAH registration](https://telemach.si/pomoc/mobilna-telefonija/registracija-free2go) imposes residence or stable-ties proof for EU/EEA domestic-rate roaming benefit. That does **not** prove unconditional ID requirements or exemption for initial SIM purchase. Former false no-KYC label has been replaced by unverified.',
'- **Israel HOT Mobile and Canada 7-Eleven SpeakOut:** older no-KYC claims are withdrawn/unproven; no credit check is not a SIM identity exemption. Both are unverified until a matching original activation/ID evidence source is obtained.',
'- **Vodafone Netherlands:** prepaid product and top-up pages do not settle universal new-SIM identity checks; lack of a line mentioning KYC is not a legal no-ID finding.',
'- **EE UK / Tello US / Ultra PayGo / H2O / Lyca UK:** narrowly worded prepaid no-photo-ID-check reports, not proven anonymous registration, first activation abroad, accepted payment or future replacement.',
'- **O2 Czech:** passport/ID in replacement-SIM process and generic country anonymous prepaid comments are not proof of passport or no passport needed for a new O2 prepaid line.',
'- **Kyivstar Ukraine:** connection without a passport does not rule out other forms of registration or national ID.',
'- **Singtel Singapore tourist and StarHub:** short-stay passport route may last only 30 days and continuing registration requires a Singapore-issued eligible ID/work pass; not a long-term roaming-number win.',
'',
'## Audit all 160 normalized route records',
'',
'These provider links are **related references already associated with the route**, not a guarantee that that specific URL proves the document assertion. User-visible details show the untruncated current source KYC notes, method/eligibility warning and all available linked sources. Additional passport-country, payment and remote activation corroboration requires source-by-source review.',
'',
'| Route | Market | Current ID evidence | Passport scope | Other document cues (mentions only) | Related source reference |',
'| --- | --- | --- | --- | --- | --- |',
...rows.map(r=>`| \`${r.id}\` | ${r.market} | ${r.status} | ${r.passport} | ${r.hints} | ${r.source==='not independently anchored in this report'?'Not independently linked':`[Source](${r.source})`} |`),
'',
'## Follow-on evidence queue',
'',
'1. Audit the `unverified` and `unknown` routes in descending real user-interest order; gather route/SKU-specific original buyer success/failure and current primary legal or carrier method, not just broad country rules.',
'2. Treat nationality, address, residency, biometric selfie, visa, local payment and in-country first activation as separate fields when exact source supports them.',
'3. Never infer that passport alone is sufficient when a product needs a local ID, residence permit, specific channel, 30-day tourist period or face-check.',
'4. Keep original KYC sentences and current snapshot/sources intact; do not convert generic no-credit-check marketing into no-KYC.',
'5. Frontend filter choices must be scoped to current evidence; a research-only result cannot become a purchase recommendation or guarantee of SMS for a named bank.',
''
].join('\n');
if(process.argv.includes('--write')){fs.writeFileSync(internal,report);console.log('Wrote 160-route evidence audit / internal only')}
else if(process.argv.includes('--check'))assert.equal(fs.readFileSync(internal,'utf8'),report,'Identity audit must be refreshed before release');
else console.log(JSON.stringify({counts,passportCounts}));
console.log('Identity document audit:',JSON.stringify(counts),JSON.stringify(passportCounts),'PASS');
