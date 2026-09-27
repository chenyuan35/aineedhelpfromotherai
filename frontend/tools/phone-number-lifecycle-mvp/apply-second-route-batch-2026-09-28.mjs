#!/usr/bin/env node
// Second-route batch (2026-09-28) — apply to global-directory.json
// Markets: NL(Simyo) PL(nju) IT(WindTre) IN(Airtel, observation) + DE(O2, core-market bonus)
// Community-first per 2026-09-26 steering; official verification via Exa /contents extraction.
// Evidence: auto-ops/phone-discovery/evidence/second-route-{discovery,official-verify,official-contents}-2026-09-28.json
// FX: 1 EUR = 7.8 CNY, 1 PLN = 1.8 CNY, 1 INR = 0.085 CNY (2026-09-28)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const file = join(dir, 'global-directory.json');
const data = JSON.parse(readFileSync(file, 'utf8'));
const TODAY = '2026-09-28';

const nets = [
  { id: 'windtre-it', name: 'Wind Tre (Italy)' },
  { id: 'airtel-in', name: 'Bharti Airtel (India)' },
];
for (const n of nets) if (!data.networks.some((x) => x.id === n.id)) data.networks.push(n);

const brands = [
  { id: 'o2-de-prepaid', networkId: 'telefonica-de', name: 'O2 Germany Prepaid (Freikarte)' },
  { id: 'simyo-nl', networkId: 'kpn-nl', name: 'Simyo (KPN)' },
  { id: 'nju-mobile-pl', networkId: 'orange-pl', name: 'nju mobile (Orange)' },
  { id: 'windtre-it', networkId: 'windtre-it', name: 'WINDTRE' },
  { id: 'airtel-in', networkId: 'airtel-in', name: 'Airtel' },
];
for (const b of brands) if (!data.brands.some((x) => x.id === b.id)) data.brands.push(b);

const sources = [
  // DE O2
  { id: 'de-o2-official-faq-prepaid', url: 'https://www.o2online.de/ratgeber/hacks-tipps/prepaid-faq/', type: 'provider-official', reportedAt: TODAY },
  { id: 'de-o2-official-hilfe-gueltigkeit-663172', url: 'https://hilfe.o2online.de/o2-prepaid-19/klaerungsfrage-zur-gueltigkeit-der-sim-karten-und-des-guthabens-bei-prepaid-tarifen-663172', type: 'provider-community-forum', reportedAt: TODAY },
  { id: 'de-o2-community-nodeseek-683180', url: 'https://www.nodeseek.com/post-683180-5', type: 'community-report', reportedAt: TODAY },
  { id: 'de-o2-community-nodeloc-81901', url: 'https://www.nodeloc.com/t/topic/81901', type: 'community-report', reportedAt: TODAY },
  { id: 'de-o2-community-guige-2277', url: 'https://blog.gui.ge/archives/2277', type: 'community-report', reportedAt: TODAY },
  { id: 'de-o2-community-me2fun', url: 'https://www.me2.fun/archives/sim-card', type: 'community-report', reportedAt: TODAY },
  // NL Simyo
  { id: 'nl-simyo-official-verlopen', url: 'https://www.simyo.nl/klantenservice/simkaart/prepaid-simkaart-verlopen', type: 'provider-official', reportedAt: TODAY },
  { id: 'nl-simyo-official-beltegoed', url: 'https://www.simyo.nl/en/klantenservice/beltegoed-en-opwaarderen', type: 'provider-official', reportedAt: TODAY },
  { id: 'nl-simyo-community-v2ex-982756', url: 'https://www.v2ex.com/t/982756', type: 'community-report', reportedAt: TODAY },
  { id: 'nl-simyo-community-nodeloc-52402', url: 'https://www.nodeloc.com/t/topic/52402', type: 'community-report', reportedAt: TODAY },
  { id: 'nl-simyo-community-nodeseek-885214', url: 'https://www.nodeseek.com/post-885214-1', type: 'community-report', reportedAt: TODAY },
  { id: 'nl-simyo-community-nodeloc-104365', url: 'https://www.nodeloc.com/t/topic/104365', type: 'community-report', reportedAt: TODAY },
  // PL nju
  { id: 'pl-nju-official-bezterminowa', url: 'https://www.njumobile.pl/oferta/bezterminowa-waznosc-srodkow-po-doladowaniu', type: 'provider-official', reportedAt: TODAY },
  // IT WindTre
  { id: 'it-windtre-official-riattivare-sim', url: 'https://www.windtre.it/supporto/procedure-e-assistenza/come-faccio-per/come-posso-riattivare-una-sim-scaduta', type: 'provider-official', reportedAt: TODAY },
  { id: 'it-community-nodeloc-106482', url: 'https://www.nodeloc.com/t/topic/106482', type: 'community-report', reportedAt: TODAY },
  // IN Airtel
  { id: 'in-airtel-official-validity-plans', url: 'https://www.airtel.in/blog/prepaid/validity-plans/', type: 'provider-official', reportedAt: TODAY },
  { id: 'in-community-broadband-forum-207743', url: 'https://broadband.forum/threads/what-is-the-minimum-recharge-amount-to-keep-alive-airtel-jio-vi-and-bsnl-incoming-calling-services.207743/', type: 'community-report', reportedAt: TODAY },
  { id: 'in-selectra-min-recharge-compare', url: 'https://selectra.in/mobile/compare/minimum-prepaid-recharge-plans', type: 'community-report', reportedAt: TODAY },
];
for (const s of sources) if (!data.sources.some((x) => x.id === s.id)) data.sources.push(s);

const routes = [
  {
    id: 'o2-de-freikarte-2026',
    brandId: 'o2-de-prepaid',
    publishState: 'candidate',
    numberType: 'real-mobile',
    simType: 'eSIM + physical',
    acquisitionSummary: 'Free O2 Freikarte (community: €0 starter, eSIM available). VideoIdent with Chinese passport confirmed workable by multiple community walkthroughs; no German address needed per community reports.',
    landedCost: { currency: 'EUR', providerOrCommunityPrice: 0, mandatoryTopup: null, shipping: 0, adapterCostCny: null, landedOriginal: 0, landedCny: 0, fxCheckedAt: TODAY, state: 'community-reported' },
    keep: { currency: 'EUR', observedActionCost: 0.01, yearCostOriginal: 0.02, yearCostCny: 0.2, action: 'Official Freikarte terms: stays active indefinitely — top up ANY amount (community: min €0.01) once every 6 months. NOTE: an official page also shows a conflicting "28 days" marketing line; the provider-community answer (Dec 2025) confirms 6 months.', intervalDays: 180, state: 'official-confirmed' },
    chinaActivation: 'Community-confirmed: VideoIdent accepts Chinese passport; activation from China documented in multiple 2025-2026 walkthroughs.',
    kyc: 'German telecom ID check via VideoIdent — Chinese passport accepted per community.',
    payment: 'Online top-up via Mein O2 (PayPal/cards/SEPA) or vouchers.',
    wifiCalling: 'Supported on O2 DE (device-dependent).',
    roamingSms: 'Community-reported receiving SMS in China works (used for verification codes); EU-first tariff.',
    refund: 'Standard prepaid; unused credit handling per O2 terms.',
    trend: 'stable',
    guideEligible: true,
    holdReason: null,
    lastVerifiedAt: TODAY,
    acquireUrl: 'https://www.o2online.de/mobilfunk/prepaid/',
    tariffSummary: 'Freikarte €0 base; 6-monthly any-amount top-up keeps the line alive (floor ≈ €0.02/yr).',
    sourceIds: ['de-o2-official-faq-prepaid', 'de-o2-official-hilfe-gueltigkeit-663172', 'de-o2-community-nodeseek-683180', 'de-o2-community-nodeloc-81901', 'de-o2-community-guige-2277', 'de-o2-community-me2fun'],
    guideSteps: [
      'Order free O2 Freikarte eSIM online; complete VideoIdent with passport.',
      'Top up any amount (min €0.01) once every 6 months.',
      'Ignore the "28 days" marketing line on some pages — provider community confirms the 6-month rule.',
    ],
    marketName: 'Germany',
  },
  {
    id: 'simyo-nl-prepaid-2026',
    brandId: 'simyo-nl',
    publishState: 'candidate',
    numberType: 'real-mobile',
    simType: 'eSIM + physical',
    acquisitionSummary: 'Community: €5 starter with €7.5 bonus credit; no real-name requirement reported by multiple Chinese-community users; eSIM available.',
    landedCost: { currency: 'EUR', providerOrCommunityPrice: 5, mandatoryTopup: null, shipping: 0, adapterCostCny: null, landedOriginal: 5, landedCny: 39, fxCheckedAt: TODAY, state: 'community-reported' },
    keep: { currency: 'EUR', observedActionCost: 0.01, yearCostOriginal: 0.02, yearCostCny: 0.2, action: 'Official: credit AND number stay valid indefinitely with any usage once per 6 months (one outgoing SMS suffices). Two email warnings before expiry. Expired numbers are NOT recoverable (cooldown then reissued).', intervalDays: 180, state: 'official-confirmed' },
    chinaActivation: 'Community: activation from China documented (v2ex/nodeloc walkthroughs); KPN network eSIM.',
    kyc: 'No real-name requirement per multiple community reports (NL prepaid has no mandatory ID law).',
    payment: 'iDEAL/cards online; community reports CN-friendly payment paths.',
    wifiCalling: 'KPN network VoWiFi (device-dependent).',
    roamingSms: 'Community: receiving SMS abroad incl. China works.',
    refund: 'Standard prepaid terms.',
    trend: 'stable',
    guideEligible: true,
    holdReason: null,
    lastVerifiedAt: TODAY,
    acquireUrl: 'https://www.simyo.nl/en/prepaid',
    tariffSummary: '€5 starter; keep-alive = any usage per 6 months (≈ €0/yr via one SMS).',
    sourceIds: ['nl-simyo-official-verlopen', 'nl-simyo-official-beltegoed', 'nl-simyo-community-v2ex-982756', 'nl-simyo-community-nodeloc-52402', 'nl-simyo-community-nodeseek-885214', 'nl-simyo-community-nodeloc-104365'],
    guideSteps: [
      'Order Simyo prepaid (eSIM) online — community reports no real-name needed.',
      'Use the line at least once per 6 months (one SMS is enough).',
      'Watch for the two email expiry warnings; expired numbers cannot be recovered.',
    ],
    marketName: 'Netherlands',
  },
  {
    id: 'nju-mobile-pl-bezterminowa-2026',
    brandId: 'nju-mobile-pl',
    publishState: 'candidate',
    numberType: 'real-mobile',
    simType: 'physical + eSIM',
    acquisitionSummary: 'nju mobile na kartę (Orange network). Official: after the FIRST top-up of any amount, the number and balance become valid indefinitely.',
    landedCost: { currency: 'PLN', providerOrCommunityPrice: 5, mandatoryTopup: null, shipping: 0, adapterCostCny: null, landedOriginal: 5, landedCny: 9, fxCheckedAt: TODAY, state: 'official-starter-price' },
    keep: { currency: 'PLN', observedActionCost: 0, yearCostOriginal: 0, yearCostCny: 0, action: 'Official: validity is indefinite after first top-up; keep it by topping up any amount (min 5 zł) once per 6 months OR simply replying to the free reminder SMS from nju — reply path = zero-cost retention.', intervalDays: 180, state: 'official-confirmed' },
    chinaActivation: 'PL prepaid registration requires ID (PL law); activation from China unverified — likely needs PL presence or helper.',
    kyc: 'Polish prepaid SIM registration law applies.',
    payment: 'Online top-up (bank/blik/cards), scratch codes, *620# free top-up call.',
    wifiCalling: 'Orange PL network (device-dependent).',
    roamingSms: 'EU roaming; China receiving unverified.',
    refund: 'nju documents unused-credit refund process on its support site.',
    trend: 'stable',
    guideEligible: false,
    holdReason: null,
    lastVerifiedAt: TODAY,
    acquireUrl: 'https://www.njumobile.pl/oferta/bezterminowa-waznosc-srodkow-po-doladowaniu',
    tariffSummary: 'First top-up → indefinite validity; 6-monthly top-up or free SMS reply to retain.',
    sourceIds: ['pl-nju-official-bezterminowa'],
    guideSteps: [
      'Acquire nju SIM in Poland (registration with ID required).',
      'First top-up makes number+balance valid indefinitely.',
      'Every 6 months: top up any amount or reply to the free nju reminder SMS.',
    ],
    marketName: 'Poland',
  },
  {
    id: 'windtre-it-prepaid-13mo-2026',
    brandId: 'windtre-it',
    publishState: 'candidate',
    numberType: 'real-mobile',
    simType: 'physical + eSIM',
    acquisitionSummary: 'WINDTRE ricaricabile. Official support page: prepaid SIMs without an attached offer are deactivated after 13 months without a top-up.',
    landedCost: { currency: 'EUR', providerOrCommunityPrice: 10, mandatoryTopup: null, shipping: 0, adapterCostCny: null, landedOriginal: 10, landedCny: 78, fxCheckedAt: TODAY, state: 'community-reported' },
    keep: { currency: 'EUR', observedActionCost: 5, yearCostOriginal: 5, yearCostCny: 39, action: 'Official: SIM deactivates after 13 months without a top-up; within the following 11 months the number CAN be recovered (via an active WINDTRE SIM under the same identity, in-store or PEC form). Minimum top-up amount not officially verified in this batch — community floor ≈ €5.', intervalDays: 395, state: 'official-window-community-cost' },
    chinaActivation: 'Italian prepaid requires ID; activation from China impractical — needs IT presence or helper.',
    kyc: 'Italian telecom ID verification.',
    payment: 'Online/voucher top-ups.',
    wifiCalling: 'Device-dependent.',
    roamingSms: 'Receiving SMS abroad generally works; China unverified.',
    refund: 'Per WINDTRE terms.',
    trend: 'stable',
    guideEligible: false,
    holdReason: null,
    lastVerifiedAt: TODAY,
    acquireUrl: 'https://www.windtre.it/',
    tariffSummary: '13-month no-top-up window + 11-month number-recovery grace.',
    sourceIds: ['it-windtre-official-riattivare-sim', 'it-community-nodeloc-106482'],
    guideSteps: [
      'Acquire WINDTRE prepaid in Italy with ID.',
      'Top up at least once every 13 months.',
      'If lapsed: recover the number within 11 months via an active WINDTRE SIM under the same identity.',
    ],
    marketName: 'Italy',
  },
  {
    id: 'airtel-in-validity-2026',
    brandId: 'airtel-in',
    publishState: 'observation',
    numberType: 'real-mobile',
    simType: 'physical + eSIM',
    acquisitionSummary: 'Airtel prepaid under the TRAI validity framework (same 90-day inactivity disconnection regime as the existing Jio route). Validity recharges keep the number alive.',
    landedCost: { currency: 'INR', providerOrCommunityPrice: null, mandatoryTopup: null, shipping: 0, adapterCostCny: null, landedOriginal: null, landedCny: null, fxCheckedAt: TODAY, state: 'unverified' },
    keep: { currency: 'INR', observedActionCost: null, yearCostOriginal: null, yearCostCny: null, action: 'Community (broadband.forum): operators auto-deduct ~₹46-49 per 28 days for validity; Airtel official blog lists unlimited plans from ₹199/28d and ₹1999/365d. Minimum validity-tier price NOT officially verified in this batch.', intervalDays: 28, state: 'community-reported' },
    chinaActivation: 'Indian SIM acquisition requires local KYC (Aadhaar/passport for foreigners); from-China activation impractical.',
    kyc: 'Indian telecom KYC (passport + local address for foreigners).',
    payment: 'Online recharge via Airtel site/app.',
    wifiCalling: 'Supported (device-dependent).',
    roamingSms: 'International roaming needs a paid IR pack; China receiving unverified.',
    refund: 'Per TRAI/operator terms.',
    trend: 'stable',
    guideEligible: false,
    holdReason: 'Minimum validity-tier price not officially verified in this batch (community reports ₹46-99/28d auto-deduct bands); kept observation-level until an official tariff page is captured.',
    lastVerifiedAt: TODAY,
    acquireUrl: 'https://www.airtel.in/recharge/prepaid/',
    tariffSummary: 'TRAI 90-day regime; validity recharges from ~₹99/28d (community) — official minimum unverified.',
    sourceIds: ['in-airtel-official-validity-plans', 'in-community-broadband-forum-207743', 'in-selectra-min-recharge-compare'],
    guideSteps: [
      'Acquire Airtel prepaid in India with KYC.',
      'Maintain validity with the lowest validity recharge tier (price unverified).',
      'TRAI framework: ~90 days of inactivity leads to disconnection.',
    ],
    marketName: 'India',
  },
];

let added = 0;
for (const r of routes) {
  if (!data.routes.some((x) => x.id === r.id)) { data.routes.push(r); added++; }
}
writeFileSync(file, JSON.stringify(data, null, 1) + '\n');
console.log(`added ${added} routes; total ${data.routes.length} routes / ${new Set(data.routes.map(r=>r.marketName)).size} markets / ${data.sources.length} sources`);
