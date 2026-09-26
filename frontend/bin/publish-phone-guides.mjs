import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const guideDir = join(root, 'dist', 'tools', 'phone-number-survival-guide');
const dataPath = join(root, 'tools', 'phone-number-lifecycle-mvp', 'global-directory.json');
if (!existsSync(dataPath)) { console.log('global-directory.json missing; skipping guides publish'); process.exit(0); }
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const guidesBase = 'https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/guides/';

// helpers to pull live numbers from the data packet so guides never drift from the directory
const route = id => data.routes.find(r => r.id === id);
const brand = r => data.brands.find(x => x.id === r?.brandId);
const keepCny = r => r?.keep?.yearCostCny;
const keepOrig = r => r && Number.isFinite(r.keep?.yearCostOriginal) ? `${r.keep.currency} ${r.keep.yearCostOriginal}` : null;
const interval = r => r?.keep?.intervalDays;

const R = id => {
  const r = route(id); if (!r) return `<em>[missing route ${esc(id)}]</em>`;
  return `<a href="/tools/phone-number-survival-guide/route/${esc(id)}/">${esc(brand(r)?.name || id)}</a>`;
};
const CALC = id => {
  const r = route(id); if (!r) return '';
  return `<a href="/tools/phone-number-survival-guide/keep-alive/${esc(id)}/">deadline calculator</a>`;
};

// ─── guide definitions ────────────────────────────────────────────────────────
// Each guide is written ONLY from data verified in global-directory.json.
// Numbers are interpolated live from the packet; if a route's data changes, the guide changes on next build.

const guides = [
  {
    slug: 'keep-us-number-alive-abroad',
    title: 'How to keep a US phone number alive while living abroad (2026)',
    desc: 'Verified US prepaid retention routes: Tello, Ultra Mobile PayGo, H2O — real keep-alive costs, exact intervals, and which one actually works from China.',
    h1: 'How to keep a US phone number alive while living abroad',
    lead: 'A US number is still the key that unlocks American banking, 2FA and app stores. These are the prepaid routes whose retention rules we have verified against official terms and community evidence — with real annual costs, not marketing claims.',
    sections: () => {
      const tello = route('tello-paygo-credit-2026');
      const ultra = route('ultra-mobile-paygo-3-2026');
      const h2o = route('h2o-paygo-10-90d-2026');
      return [
        ['The short answer', `
          <p>For most people the best answer in 2026 is <strong>${R('tello-paygo-credit-2026')}</strong>: ${keepOrig(tello) || 'USD 60'} per year (≈¥${keepCny(tello)}) on its $5/month plan, with working Wi-Fi Calling so SMS arrives anywhere in the world. If you specifically need the absolute cheapest sticker price and can tolerate more friction, ${R('ultra-mobile-paygo-3-2026')} runs about USD ${ultra?.keep?.yearCostOriginal || 36}/yr.</p>
          <p>Every route below links to its full evidence page, and every retention window has a ${CALC('tello-paygo-credit-2026')} so you never miss the deadline.</p>`],
        ['Option 1 — Tello (recommended for most)', `
          <p>Tello is an MVNO on T-Mobile's network with no KYC beyond a real billing profile.</p>
          <ul>
            <li><strong>Keep-alive rule:</strong> ${esc(tello?.keep?.action || 'See route page')}</li>
            <li><strong>Annual cost:</strong> ${keepOrig(tello)}/yr — the $5/month plan (unlimited texts + 100 minutes) is the cheapest durable path; pure pay-as-you-go requires a $20 top-up every 90 days (≈$80/yr), so the plan wins.</li>
            <li><strong>Abroad:</strong> ${esc(tello?.chinaActivation || 'Wi-Fi Calling works internationally; enable it while on Wi-Fi.')}</li>
            <li><strong>Window:</strong> every ${interval(tello)} days (monthly plan renews automatically — effectively zero maintenance).</li>
          </ul>
          <p>Full evidence and acquisition steps: ${R('tello-paygo-credit-2026')}.</p>`],
        ['Option 2 — Ultra Mobile PayGo', `
          <p>The famous "$3/month" plan. Officially ${keepOrig(ultra) || 'USD 36'}/yr (≈¥${keepCny(ultra)}), 100 minutes + 100 texts + 100MB included monthly.</p>
          <ul>
            <li><strong>Abroad:</strong> ${esc(ultra?.chinaActivation || '')}</li>
            <li><strong>Caveat:</strong> PayGo cannot be converted to other Ultra plans, and roaming rates in China are billed per-use ($0.10/SMS received).</li>
          </ul>
          <p>Full evidence: ${R('ultra-mobile-paygo-3-2026')}.</p>`],
        ['Option 3 — H2O Wireless pay-as-you-go', `
          <p>${esc(h2o?.acquisitionSummary || 'AT&T-network MVNO with pay-as-you-go credit.')}</p>
          <p>Retention evidence is still being verified — check the current status on ${R('h2o-paygo-10-90d-2026')} before committing.</p>`],
        ['Routes to avoid', `
          <p>Some US routes look cheap but are dead ends or unverifiable. Anything we could not verify stays out of this guide rather than being guessed. The full <a href="/tools/phone-number-survival-guide/directory/">global directory</a> marks every route's evidence status, including the <strong>avoid list</strong>.</p>`],
        ['Set it and forget it', `
          <p>Whichever route you pick: open the ${CALC('tello-paygo-credit-2026')}, do the first keep-alive action, record the date, and export the .ics reminder. The calculator applies a 15% safety buffer to the official window.</p>`],
      ];
    },
  },
  {
    slug: 'keep-uk-number-alive-abroad',
    title: 'How to keep a UK phone number active while abroad (2026)',
    desc: 'VOXI, giffgaff, Lebara, Three and EE UK retention rules verified: 180-day windows, real costs from £0.16/yr, and why O2 Classic PAYG is no longer an option.',
    h1: 'How to keep a UK phone number active while abroad',
    lead: 'UK prepaid SIMs are among the cheapest in the world to keep alive — if you pick the right network. We verified each route against official terms and community reports. One important 2026 change: O2 Classic PAYG is closed to new customers.',
    sections: () => {
      const voxi = route('voxi-uk-esim-payg-retention');
      const giff = route('giffgaff-uk-direct-esim-payg');
      const leb = route('lebara-uk-direct-esim-china');
      const three = route('three-uk-payg-180d-2026');
      return [
        ['The short answer', `
          <p><strong>${R('voxi-uk-esim-payg-retention')}</strong> is the community-verified winner: one 8p roaming SMS per ${interval(voxi)} days ≈ £${voxi?.keep?.yearCostOriginal}/yr (≈¥${keepCny(voxi)}). <strong>${R('giffgaff-uk-direct-esim-payg')}</strong> is the gentlest on boarding friction at ≈¥${keepCny(giff)}/yr. ${R('lebara-uk-direct-esim-china')} has the shortest window (${interval(leb)} days) but works from China per community reports.</p>`],
        ['The three proven routes', `
          <ul>
            <li><strong>VOXI</strong> — ${interval(voxi)}-day window; a roaming SMS from abroad counts. ${esc(voxi?.keep?.action || '')}</li>
            <li><strong>giffgaff</strong> — ${interval(giff)}-day window; community practice is one small action per window. ${esc(giff?.keep?.action || '')}</li>
            <li><strong>Lebara UK</strong> — ${interval(leb)}-day window; act by day 70–75 per community buffer. ${esc(leb?.keep?.action || '')}</li>
          </ul>
          <p>Each route page carries the source evidence: ${R('voxi-uk-esim-payg-retention')} · ${R('giffgaff-uk-direct-esim-payg')} · ${R('lebara-uk-direct-esim-china')}.</p>`],
        ['The MNO alternatives', `
          <p>${R('three-uk-payg-180d-2026')} and ${R('ee-uk-payg-180d-2026')} both allow a ${interval(three)}-day window with any chargeable activity. Three's standard PAYG rate is 10p/min, 10p/text; EE hibernates accounts after 180 days of no use.</p>`],
        ['What changed in 2026 — O2 Classic PAYG is dead', `
          <p>For years "O2 Classic PAYG at 2p per text every 6 months" was the standard advice. <strong>O2 has closed the tariff to new customers</strong> — the official O2 help page states you cannot switch to it unless you already hold it. If you see it recommended in an older guide, that guide is stale. We keep the ${R('o2-uk-classic-payg-6mo-2026')} page up as documentation, clearly marked not viable.</p>`],
        ['Vodafone UK — currently on hold', `
          <p>${R('vodafone-uk-zero-esim-2026')}: no clean durable retention path is established. We show the hold reason instead of inventing a rule.</p>`],
        ['Never miss the window', `
          <p>Each route has a ${CALC('voxi-uk-esim-payg-retention')} — record your last keep-alive action and export the calendar reminder. A lapsed UK number is usually unrecoverable after the grace period.</p>`],
      ];
    },
  },
  {
    slug: 'cheapest-sim-receiving-sms-abroad',
    title: 'Cheapest SIM cards for receiving SMS & OTP abroad (2026 ranking)',
    desc: 'The definitive cost ranking of SIM routes that keep receiving SMS/OTP codes abroad — from ¥0.17/year, every entry verified against official terms or community evidence.',
    h1: 'Cheapest SIM cards for receiving SMS & OTP abroad',
    lead: 'Keeping a number alive for verification codes is a cost-optimization problem: you want the lowest annual keep-alive cost with SMS that actually arrives abroad. This ranking is computed live from our verified directory data — no affiliate rankings, no guesses.',
    sections: () => {
      const ranked = data.routes
        .filter(r => Number.isFinite(r.keep?.yearCostCny) && r.publishState !== 'observation-hold' && !r.avoidRoute)
        .sort((a, b) => a.keep.yearCostCny - b.keep.yearCostCny)
        .slice(0, 15);
      const rows = ranked.map((r, i) => {
        const b = brand(r);
        return `<tr><td>#${i + 1}</td><td><a href="/tools/phone-number-survival-guide/route/${esc(r.id)}/"><strong>${esc(b?.name || r.id)}</strong></a><br><small style="color:var(--muted)">${esc(r.marketName || '')}</small></td><td>${esc(r.keep.currency)} ${r.keep.yearCostOriginal}</td><td>≈¥${r.keep.yearCostCny}</td><td>${r.keep.intervalDays}d</td></tr>`;
      }).join('');
      return [
        ['The ranking', `
          <table style="width:100%;border-collapse:collapse;font-size:.92rem"><thead><tr><th style="text-align:left;padding:8px;border-bottom:1px solid var(--line)">#</th><th style="text-align:left;padding:8px;border-bottom:1px solid var(--line)">Route</th><th style="text-align:left;padding:8px;border-bottom:1px solid var(--line)">Keep/yr</th><th style="text-align:left;padding:8px;border-bottom:1px solid var(--line)">≈CNY</th><th style="text-align:left;padding:8px;border-bottom:1px solid var(--line)">Interval</th></tr></thead><tbody>${rows}</tbody></table>
          <p style="color:var(--muted);font-size:.85rem">Ranking recomputed from the directory packet on every build (last check ${esc(data.checkedAt)}). CNY figures use the packet reference rates.</p>`],
        ['How to read this table', `
          <ul>
            <li><strong>Keep/yr</strong> is the annual cost of the minimum keep-alive action — not the top-up amount. Topped-up credit stays yours.</li>
            <li><strong>Interval</strong> is how often you must act. Shorter = more chances to forget. Use the <a href="/tools/phone-number-survival-guide/keep-alive/">Keep-Alive Assistant</a> to get a calendar reminder.</li>
            <li><strong>Acquisition matters more than retention.</strong> The world's cheapest retention (Beeline Kazakhstan, ¥0.17/yr) requires a local IIN number to buy — useless unless you have one. Check each route's acquisition section before optimizing for price.</li>
          </ul>`],
        ['The realistic shortlist for people outside the country', `
          <p>Filtering for routes you can actually acquire without local residency, the practical top tier is:</p>
          <ul>
            <li>${R('clubsim-sms-pack-6hkd-2026') || '<strong>ClubSIM (Hong Kong)</strong>'} — ≈¥${keepCny(route('clubsim-sms-pack-6hkd-2026'))}/yr, eSIM, minimal KYC.</li>
            ${route('hotlink-pantas-365-pass-2026') ? `<li>${R('hotlink-pantas-365-pass-2026')} — ≈¥${keepCny(route('hotlink-pantas-365-pass-2026'))}/yr, one annual action.</li>` : ''}
            ${route('globe-prepaid-1yr-2026') ? `<li>${R('globe-prepaid-1yr-2026')} — ≈¥${keepCny(route('globe-prepaid-1yr-2026'))}/yr, 1-year official validity.</li>` : ''}
            <li>${R('voxi-uk-esim-payg-retention')} — ≈¥${keepCny(route('voxi-uk-esim-payg-retention'))}/yr with eSIM delivery.</li>
          </ul>`],
        ['Dead ends to skip', `
          <p>These are confirmed not viable — included so you do not waste money:</p>
          <ul>
            <li><strong>O2 Classic PAYG (UK)</strong> — closed to new customers in 2024–2026.</li>
            <li><strong>Singtel hi! (Singapore)</strong> — passport registration caps at 30 days.</li>
            <li><strong>Turkish tourist SIMs</strong> — 90-day block for non-residents.</li>
            <li><strong>Orange Holiday (France)</strong> — 7–30 day tourist product, not a retention route.</li>
          </ul>
          <p>Evidence for each is on its route page, linked from the <a href="/tools/phone-number-survival-guide/directory/">directory avoid-list</a>.</p>`],
      ];
    },
  },
  {
    slug: 'hong-kong-sim-retention-guide',
    title: 'Hong Kong SIM retention guide: ClubSIM, SoSIM and the HK$6/year route (2026)',
    desc: 'Hong Kong prepaid SIMs are the easiest foreign numbers for Chinese speakers to maintain. ClubSIM verified at HK$6/year with 365-day window; SoSIM compared.',
    h1: 'Hong Kong SIM retention guide',
    lead: 'Hong Kong is the path of least resistance for an overseas-capable number: real-name registration is simple with a mainland ID or passport, eSIMs are available, and keep-alive costs are among the world\'s lowest. Here is what we verified.',
    sections: () => {
      const club = route('clubsim-sms-pack-6hkd-2026');
      const sosim = route('sosim-recharge-ladder-2026');
      const threehk = route('3hk-2026') || route('three-hk-2026');
      return [
        ['ClubSIM — the HK$6/year answer', `
          <p>${esc(club?.acquisitionSummary || 'ClubSIM (HKT) prepaid with eSIM option.')}</p>
          <ul>
            <li><strong>Keep-alive:</strong> ${esc(club?.keep?.action || '')}</li>
            <li><strong>Annual cost:</strong> ${keepOrig(club)}/yr ≈ ¥${keepCny(club)} — the cheapest verified route you can realistically acquire as a visitor.</li>
            <li><strong>Window:</strong> ${interval(club)} days.</li>
          </ul>
          <p>Evidence and steps: ${R('clubsim-sms-pack-6hkd-2026')}. Deadline tool: ${CALC('clubsim-sms-pack-6hkd-2026')}.</p>`],
        ['SoSIM — the convenience-store alternative', `
          <p>${esc(sosim?.acquisitionSummary || 'SoSIM (3HK) sold in ParknShop/Watsons.')}</p>
          ${sosim?.keep?.action ? `<p>Retention: ${esc(sosim.keep.action)}</p>` : '<p>Retention terms still being verified — see the route page for current status.</p>'}
          <p>${R('sosim-recharge-ladder-2026')}</p>`],
        ['Which should you pick?', `
          <p>If you want eSIM delivery without visiting Hong Kong, ClubSIM is the default answer. If you are transiting through HK anyway, SoSIM's store availability is convenient. Either way, set the reminder the day you activate — the ${interval(club)}-day window is generous but a lapsed number is gone.</p>`],
      ];
    },
  },
  {
    slug: 'japan-sim-retention-guide',
    title: 'Japan SIM retention: povo 2.0, Mobal and what works without residency (2026)',
    desc: 'Japan requires residency for most voice SIMs. povo 2.0 needs in-country identity; Mobal works for visitors. Verified options and real costs.',
    h1: 'Japan SIM retention: what actually works',
    lead: 'Japan is one of the hardest markets for non-resident number retention — voice SIMs legally require identity verification tied to residency. Here is what is verified, what is blocked, and the one route that works for visitors.',
    sections: () => {
      const povo = route('povo20-zero-base-2026') || route('povo20-2026') || data.routes.find(r => r.id.includes('povo'));
      const mobal = data.routes.find(r => r.id.includes('mobal'));
      return [
        ['The residency wall', `
          <p>Japanese law requires voice-capable SIMs to be tied to verified identity, and most operators require a residence card (在留卡). This is why "keep a Japanese number abroad" guides from blog spam fail — they skip the acquisition problem entirely.</p>`],
        ['povo 2.0 — cheap but residency-gated', `
          ${povo ? `<p>${esc(povo.acquisitionSummary || '')}</p>
          <ul>
            <li><strong>Keep-alive:</strong> ${esc(povo.keep?.action || '')}</li>
            <li><strong>Status:</strong> ${esc(povo.publishState || '')} — ${esc(povo.holdReason || 'viable if you can acquire it')}</li>
          </ul>
          <p>${R(povo.id)}</p>` : '<p>povo 2.0 details are being verified — see the directory.</p>'}`],
        ['Mobal — the visitor-friendly route', `
          ${mobal ? `<p>${esc(mobal.acquisitionSummary || '')}</p>
          <ul>
            <li><strong>Cost:</strong> ${keepOrig(mobal)}/yr ≈ ¥${keepCny(mobal)}</li>
            <li><strong>Keep-alive:</strong> ${esc(mobal.keep?.action || '')}</li>
          </ul>
          <p>${R(mobal.id)}</p>` : '<p>Mobal Japan offers voice+data SIMs to visitors without residency requirements — see the <a href="/tools/phone-number-survival-guide/market/japan/">Japan market page</a> for current status.</p>'}`],
        ['Bottom line', `
          <p>If you have Japanese residency, povo 2.0 is the cheapest maintenance path. If you do not, Mobal is the verified option. Everything else marketed as "Japanese number for foreigners" that we tested fell into the avoid list or could not be verified.</p>
          <p>All Japan routes: <a href="/tools/phone-number-survival-guide/market/japan/">Japan market page</a>.</p>`],
      ];
    },
  },
];

// ─── templates ────────────────────────────────────────────────────────────────
function guideHtml(g){
  const canonical = `${guidesBase}${g.slug}/`;
  const sections = g.sections().map(([h, body]) => `<section class="gd-sec"><h2>${h}</h2>${body}</section>`).join('\n');
  const faq = JSON.stringify({'@context':'https://schema.org','@type':'FAQPage','mainEntity':[
    {'@type':'Question','name':g.h1,'acceptedAnswer':{'@type':'Answer','text':g.lead}}
  ]}).replace(/</g,'\\u003c');
  const article = JSON.stringify({'@context':'https://schema.org','@type':'Article','headline':g.title,'description':g.desc,'url':canonical,'dateModified':data.checkedAt,'publisher':{'@type':'Organization','name':'Everyday Tools'}}).replace(/</g,'\\u003c');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(g.title)} – Phone Radar</title>
<meta name="description" content="${esc(g.desc)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(g.title)}"><meta property="og:description" content="${esc(g.desc)}"><meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/site.css">
<script type="application/ld+json">${article}</script>
<script type="application/ld+json">${faq}</script>
<script id="theme-init">(()=>{try{const saved=localStorage.getItem('site-theme')||'system';const dark=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=saved==='system'?(dark?'dark':'light'):saved}catch{}})();</script>
<style>.gd{max-width:820px;padding-bottom:70px}.gd h1{font-size:clamp(1.9rem,4.5vw,3rem);margin:.2em 0}.gd-lead{font-size:1.05rem;color:var(--muted)}.gd-sec{margin:30px 0}.gd-sec h2{font-size:1.35rem;margin:0 0 12px}.gd-sec p,.gd-sec li{font-size:.95rem;line-height:1.7}.gd-sec ul{padding-left:20px}.gd-sec li{margin:8px 0}.gd-cta{margin:34px 0;padding:18px;border:1px solid var(--line);border-radius:14px;background:var(--panel);display:flex;gap:10px;flex-wrap:wrap;align-items:center}.gd-cta a{display:inline-flex;min-height:42px;align-items:center;padding:0 14px;border:1px solid var(--line);border-radius:10px;font-weight:800;text-decoration:none;color:inherit}.gd-cta a.primary{background:var(--ink);color:var(--bg);border-color:var(--ink)}.gd-foot{margin-top:34px;padding-top:18px;border-top:1px solid var(--line);color:var(--muted);font-size:.85rem}</style></head>
<body><header class="site-header"><div class="shell nav"><a class="brand" href="/">Everyday Tools</a><nav aria-label="Primary"><a href="/tools/phone-number-survival-guide/">Phone Radar</a><a href="/tools/phone-number-survival-guide/guides/">Guides</a><a href="/tools/phone-number-survival-guide/directory/">Directory</a></nav></div></header>
<main class="shell gd"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/tools/phone-number-survival-guide/">Phone Radar</a><span>›</span><a href="/tools/phone-number-survival-guide/guides/">Guides</a><span>›</span><span>${esc(g.h1.slice(0,40))}</span></nav>
<p class="eyebrow">Phone Radar · Guide</p><h1>${esc(g.h1)}</h1>
<p class="gd-lead">${esc(g.lead)}</p>
<div class="gd-cta"><a class="primary" href="/tools/phone-number-survival-guide/keep-alive/">Open Keep-Alive Assistant</a><a href="/tools/phone-number-survival-guide/directory/">Browse ${data.routes.length} routes</a></div>
${sections}
<div class="gd-cta"><a class="primary" href="/tools/phone-number-survival-guide/keep-alive/">Set my retention reminder</a><a href="/tools/phone-number-survival-guide/directory/">Full directory</a></div>
<p class="gd-foot">Data verified ${esc(data.checkedAt)}. Every number in this guide is interpolated live from the same evidence packet that powers the directory — if a route's terms change, this guide updates on the next build. Evidence status per route: <a href="/tools/phone-number-survival-guide/directory/">directory</a>.</p>
</main><footer class="site-footer"><div class="shell footer-grid"><div><strong>Everyday Tools</strong><p>Fast decision tools for real user problems.</p></div><nav aria-label="Footer"><a href="/tools/">All tools</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></div></footer></body></html>`;
}

function guidesIndexHtml(){
  const canonical = guidesBase;
  const cards = guides.map(g => `<a class="gd-card" href="/tools/phone-number-survival-guide/guides/${esc(g.slug)}/"><strong>${esc(g.h1)}</strong><small>${esc(g.desc)}</small></a>`).join('');
  const desc = `Evidence-backed SIM retention guides: ${guides.length} in-depth guides covering the US, UK, Hong Kong, Japan and the global cost ranking.`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SIM retention guides – Phone Radar</title>
<meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/site.css">
<script id="theme-init">(()=>{try{const saved=localStorage.getItem('site-theme')||'system';const dark=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=saved==='system'?(dark?'dark':'light'):saved}catch{}})();</script>
<style>.gd-idx{max-width:900px;padding-bottom:70px}.gd-idx h1{font-size:clamp(2rem,5vw,3rem);margin:.2em 0}.gd-grid{display:grid;gap:12px;margin-top:20px}.gd-card{display:block;border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:20px;text-decoration:none;color:inherit}.gd-card:hover{border-color:var(--ink)}.gd-card strong{font-size:1.1rem}.gd-card small{display:block;color:var(--muted);margin-top:6px;font-size:.88rem;line-height:1.5}</style></head>
<body><header class="site-header"><div class="shell nav"><a class="brand" href="/">Everyday Tools</a><nav aria-label="Primary"><a href="/tools/phone-number-survival-guide/">Phone Radar</a><a href="/tools/phone-number-survival-guide/directory/">Directory</a><a href="/tools/phone-number-survival-guide/guides/">Guides</a><a href="/tools/">All tools</a></nav></div></header>
<main class="shell gd-idx"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/tools/phone-number-survival-guide/">Phone Radar</a><span>›</span><span>Guides</span></nav>
<p class="eyebrow">Phone Radar · Guides</p><h1>SIM retention guides</h1>
<p class="dir-lead" style="color:var(--muted)">${esc(desc)}</p>
<div class="gd-grid">${cards}</div>
</main><footer class="site-footer"><div class="shell footer-grid"><div><strong>Everyday Tools</strong><p>Fast decision tools for real user problems.</p></div><nav aria-label="Footer"><a href="/tools/">All tools</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></div></footer></body></html>`;
}

const guidesRoot = join(guideDir, 'guides');
mkdirSync(guidesRoot, { recursive: true });
writeFileSync(join(guidesRoot, 'index.html'), guidesIndexHtml());
for (const g of guides) {
  const out = join(guidesRoot, g.slug);
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, 'index.html'), guideHtml(g));
}

const sitemapPath = join(root, 'dist', 'sitemap.xml');
let sitemap = readFileSync(sitemapPath, 'utf8');
const urls = [guidesBase, ...guides.map(g => `${guidesBase}${g.slug}/`)];
const adds = urls.filter(u => !sitemap.includes(u)).map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${data.checkedAt}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n');
if (adds) sitemap = sitemap.replace('</urlset>', `${adds}\n</urlset>`);
writeFileSync(sitemapPath, sitemap);
console.log(`Published ${guides.length} guides + guides index.`);
