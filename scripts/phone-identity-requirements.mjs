// Conservative, source-scoped identity metadata for SIM purchase/activation.
// Never infer legal 'no-KYC' status from negative assertions, credit checks,
// generic account login, replacement-SIM ID checks, or passport mentions alone.
const explicitRequired = new Set([
 'sunrise-prepaid-2026','clubsim-sms-pack-6hkd-2026',
 'beeline-uz-2026','cellcard-kh-2026','claro-pre-br-90d-2026','cyta-soeasy-cy-2026','dialog-lk-365d-2026','go-payasyougo-mt-2026','kt-prepaid-kr-2026','labas-90-120d-2026','ncell-np-2026','one-me-2026','proximus-paygo-be-2026','rakuten-mobile-jp-2026','saily-us-phone-number-2026','skt-prepaid-kr-2026','starhub-prepaid-sg-2026','telcel-amigo-lifecycle-2026','telstra-prepaid-longexpiry-2026',
 'cmhk-mysim-hk-2026','csl-711-prepaid-hk-2026','singtel-hi-prepaid-passport-30d-2026',
 'ais-sim2fly-365d-2026','dito-prepaid-ph-2026',
 'hotlink-pantas-365-pass-2026'
]);
const scopedNoPhotoIdReports = new Set([
 'ee-uk-payg-180d-2026','h2o-paygo-10-90d-2026',
 'lycamobile-uk-keep-number-2026','tello-paygo-credit-2026',
 'ultra-mobile-paygo-3-2026'
]);
// Curated from the normalized route's own KYC text and provider-specific
// original evidence. Scoped to the described SIM/new-line onboarding path;
// never means all nationalities, addresses, visas, payments or remote activation.
const documentedPassportPaths = new Set([
 'a1-hr-prepaid-2026','ais-sim2fly-365d-2026',
 'beeline-kz-simka-v-seyfe-2026','bhtelecom-ba-2026',
 'claro-pre-ar-2026','claro-pre-br-90d-2026',
 'clubsim-sms-pack-6hkd-2026','cmhk-mysim-hk-2026',
 'csl-711-prepaid-hk-2026','cyta-soeasy-cy-2026',
 'dialog-lk-365d-2026','digicel-jm-2026',
 'digi-reload-validity-my-2026','dito-prepaid-ph-2026',
 'globe-prepaid-1yr-2026','hotlink-pantas-365-pass-2026',
 'jazz-pk-2026','jio-prepaid-90d-trai-2026',
 'kt-prepaid-kr-2026','labas-90-120d-2026',
 'linemo-jp-2026','magticom-number-maintenance-2026',
 'mobal-japan-voice-2026','movistar-prepago-6mo-2026',
 'sunrise-prepaid-2026','singtel-hi-prepaid-passport-30d-2026','ncell-np-2026','proximus-paygo-be-2026','skt-prepaid-kr-2026','starhub-prepaid-sg-2026','telcel-amigo-lifecycle-2026','telstra-prepaid-longexpiry-2026'
]);
const unsafeNoKycClaims = new Set([
 'hotmobile-il-2026','speakout-711-365voucher-2026',
 'telemach-prepaid-si-2026','vodafone-nl-prepaid-2026','esimgg-estonia-372-2026'
]);
const tooNarrowPassportCases = new Set([
 'ais-local-prepaid-th-2026','claro-pre-cl-2026','claro-pre-co-2026',
 'go-payasyougo-mt-2026','kolbi-cr-2026',
 'mobitel-lk-retention-2026','o2-cz-prepaid-2026'
]);
const qualifiersOnly = new Set([
 'btc-bs-2026','id-mobile-uk-2026','free-mobile-fr-2026',
 'lycamobile-us-2026','mint-mobile-us-2026',
 'tmobile-prepaid-connect-2026','redpocket-ebay-30-2026',
 'redpocket-annual-2026','one-nz-prepay-2026',
 'kyivstar-prepaid-274-91-2026'
]);
const notEstablished = /(not (?:established|verified|confirmed|reconciled|documented)|unverified|unknown|unclear|not fully normalized|not cleanly reconciled|not proof|does not (?:prove|establish)|no (?:universal|clear|specific) .*requirement|no .*requirements? (?:was|were) established)/i;
const noIdPattern=/(?:\bno\s+(?:id|photo[ -]?id|identity|document)\s+(?:check|verification)(?:\s+for\s+prepaid)?\b)/i;
const strongNeed=/(?:\b(?:identity|subscriber|sim|prepaid|real.name|passport|document|id|kyc|biometric|registration|verification)\b.{0,85}\b(?:required|mandatory|obligatory|needs|must|compulsory)\b|\b(?:required|mandatory|must|needs?)\b.{0,85}\b(?:identity|subscriber|sim registration|real.name|passport|document|id verification|kyc|biometric)\b|\breal.name registration\b|\bregister(?:ed|ing)?\s+.*\b(?:passport|identity|sim card)\b|\bpassport\s+(?:is\s+)?(?:mandatory|required)\b)/i;
export const classifyIdentity = (routeId, value, extra = {}) => {
 const raw = String(value||'').trim();
 const lower=raw.toLowerCase();
 const passportMentioned=/\bpassport\b/i.test(raw)||routeId==='sunrise-prepaid-2026';
 const noPhotoId=scopedNoPhotoIdReports.has(routeId)&&noIdPattern.test(raw);
 // A negative statement cannot become an asserted no-ID exception.
 const negatedRequirement = /\b(?:no\s+(?:mandatory|universal|compulsory)\b|no\s+(?:id|identity|document|passport|registration|photo[ -]?id)\b.{0,60}\b(?:required|mandatory|needed|found|verification|check)\b|(?:id|identity|document|passport|registration)\b.{0,40}\bnot\s+(?:required|mandatory|needed|established)\b|does\s+not\s+(?:require|establish|prove)\b|without\s+(?:photo[ -]?)?id\b)/i;
 const positiveSentences=raw.split(/[.;\n]+/).filter(sentence=>
   strongNeed.test(sentence) && !notEstablished.test(sentence) && !negatedRequirement.test(sentence)
   && !/\b(?:no credit check|no id check|does not require|not required|not mandatory|no (?:id|passport|identity|documentation|registration) (?:is )?required|without id|without passport)\b/i.test(sentence));
 const needs=explicitRequired.has(routeId)||(positiveSentences.length>0
   && !unsafeNoKycClaims.has(routeId)&&!qualifiersOnly.has(routeId)
   && !scopedNoPhotoIdReports.has(routeId));

 // If still ambiguous, leave it unverified. 'No credit check' is about debt.
 const status=needs?'required':(noPhotoId?'no-photo-id-reported':(unsafeNoKycClaims.has(routeId)&&routeId==='esimgg-estonia-372-2026'?'unknown':(raw?'unverified':'unknown')));
 const acceptedForFlow=passportMentioned&&documentedPassportPaths.has(routeId)&&!tooNarrowPassportCases.has(routeId);
 const passport=acceptedForFlow?'documented-for-described-flow':passportMentioned?'mentioned-only':'not-established';
 const documentHints=[
   passportMentioned?'passport':null,
   /\b(?:national|government|photo|identity|local|chipped|hong kong)\s*(?:id|identification|identity card)|\b(?:id card|hkid|mykad|aadhaar|cccd|nid)\b/i.test(raw)?'national-or-local-ID':null,
   /\b(?:residence card|residence permit|residency card|arc|foreigner.*registration|emirates id)\b/i.test(raw)?'residence-permit-or-local-status':null,
   /\b(?:biometric|video.ident|face id|video selfie|face verification|fingerprint)\b/i.test(raw)?'biometric-or-face-check':null,
   /\bvisa\b/i.test(raw)?'visa-or-stay-conditions':null,
   /\b(?:proof of address|address proof|utility bill)\b/i.test(raw)?'address-proof':null
 ].filter(Boolean);
 let scopeCaution='Document mentions do not establish remote purchase, every nationality, every payment method or first activation abroad.';
 if(tooNarrowPassportCases.has(routeId))scopeCaution='Passport is mentioned only for another operation or channel; new-number eligibility with that passport is NOT established.';
 if(routeId==='telemach-prepaid-si-2026')scopeCaution='Slovenian residence/stable-ties registration governs EU/EEA domestic-rate roaming, NOT proof of mandatory ID registration for every new Free2Go SIM.';
 if(routeId==='vodafone-nl-prepaid-2026')scopeCaution='Provider pages reviewed did not settle prepaid new-line ID checks. No-ID evidence is NOT established.';
 if(['clubsim-sms-pack-6hkd-2026','cmhk-mysim-hk-2026','csl-711-prepaid-hk-2026'].includes(routeId))scopeCaution='Hong Kong prepaid needs real-name registration before activation. HKID holders normally must use HKID; other permitted passports/travel documents are for applicants without HKID. HKSAR and BN(O) passports are not valid SIM-reg ID under current OFCA FAQ. Provider/online KYC method and payment eligibility remain separate.';
 if(routeId==='starhub-prepaid-sg-2026')scopeCaution='Passport-only registration is a 30-day tourist path; a Singapore-issued ID/work pass is required for continued service. Not a long-term anonymous passport SIM.';
 if(routeId==='singtel-hi-prepaid-passport-30d-2026')scopeCaution='A foreign passport can register the SHORT-STAY tourist data product for 30 days. Continuing the number requires eligible Singapore-issued identification or an approved conversion; passport alone is NOT a long-term retention route.';
 if(routeId==='sunrise-prepaid-2026')scopeCaution='Prepaid registration requires a valid ID or passport; foreign address in the eSIM flow does not waive the ID check.';
 if(noPhotoId)scopeCaution='A specific prepaid path reports no photo-ID check; account details, card/payment, anti-fraud, recovery checks and other jurisdictions may still apply. Not an anonymous-SIM guarantee.';
 if(unsafeNoKycClaims.has(routeId))scopeCaution=scopeCaution+(routeId==='telemach-prepaid-si-2026'?'':' Original no-KYC assertion was withdrawn or never verified.');
 if(routeId==='kyivstar-prepaid-274-91-2026')scopeCaution='Provider says prepaid can be connected without a passport. That alone does not establish that all ID/number/device registration is unnecessary.';
 const passportVerifiedNote=routeId==='sunrise-prepaid-2026'?' Current official Sunrise prepaid FAQ explicitly accepts a valid passport or ID for prepaid registration; travel eSIM permits a foreign address and still requires identity verification.':'';
 const note=(raw+passportVerifiedNote).length>600?(raw+passportVerifiedNote).slice(0,599)+'…':(raw+passportVerifiedNote)||'No current route-specific identity document evidence in this dataset.';
 return {status,passport,documentHints,identityNotes:note,scopeCaution,sourceScope:'current-route-profile'};
};
export const identityAuditCategories={explicitRequired,scopedNoPhotoIdReports,documentedPassportPaths,unsafeNoKycClaims,tooNarrowPassportCases};
