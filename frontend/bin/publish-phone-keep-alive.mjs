import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const guideDir = join(root, 'dist', 'tools', 'phone-number-survival-guide');
const dataPath = join(root, 'tools', 'phone-number-lifecycle-mvp', 'global-directory.json');
if (!existsSync(dataPath)) throw new Error('Phone Radar global directory packet missing; run merge-global-directory.py first');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

const DAY = 86400000;
const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const money = (value, currency='GBP') => Number.isFinite(value)
  ? `${currency==='GBP'?'£':currency+' '}${Number(value).toLocaleString('en-GB',{maximumFractionDigits:2})}`
  : 'n/a';

const stateLabels = {
  'community-reproduced-multi-source': 'Community-reproduced · multi-source',
  'community-reproduced': 'Community-reproduced',
  'account-specific-confirmed-with-conflicting-long-idle-report': 'Account-specific confirmed · conflicting long-idle report',
  'insufficient-evidence': 'Insufficient evidence',
  'official-confirmed': 'Official terms confirmed',
  'official-confirmed-nuanced': 'Official terms confirmed · nuanced',
  'official-policy-verified-2026-09-26': 'Official policy verified 2026-09-26',
  'official-faq-via-specialist-media': 'Official FAQ via specialist media',
  'official-window-plus-community-practice': 'Official window + community practice',
  'official-partial-plus-community': 'Official partial + community evidence',
  'official-confirmed-cumulative-validity': 'Official confirmed · cumulative validity',
  'official-staff-community-confirmed': 'Official staff + community confirmed',
  'official-fee-abolished-validity-ladder': 'Official · fee abolished, validity ladder',
  'official-policy-plus-community-practice': 'Official policy + community practice',
  'operator-rules-via-simcontrol-south-africa': 'Operator rules via specialist source',
  'retailer-listing-plus-community': 'Retailer listing + community evidence',
  'regulatory-norm-media-confirmed': 'Regulatory norm, media-confirmed',
  'community-wiki-needs-official-confirmation': 'Community wiki · needs official confirmation'
};

// Keep-alive action steps, derived from each route's sourced keep.action / guideSteps text
// in uk-directory-pilot.json. Do not add unsourced operational claims here.
const stepsByRoute = {
  'voxi-uk-esim-payg-retention': [
    'Make sure the line holds PAYG credit: VOXI plans carry no balance, so an initial £5 top-up is required first.',
    'Enable roaming or Wi-Fi Calling on the device.',
    'Send one SMS. Community-measured cost: about £0.08 roaming; a Wi-Fi Calling SMS (about £0.24) also qualifies.',
    'Verify the charge appears in your usage history, so the 180-day balance-activity window resets.',
    'Record the date below so this tool computes your next safe deadline.'
  ],
  'lebara-uk-direct-esim-china': [
    'Generate a real chargeable activity (a chargeable call, SMS or small data usage).',
    'Confirm the activity appears in your Lebara account usage history; one account/support interaction confirmed a 90-day reset.',
    'Act by day 70 of each 90-day window (community practical buffer: 70–75 days).',
    'Record the date below so this tool computes your next safe deadline.'
  ],
  'giffgaff-uk-direct-esim-payg': [
    'Create a balance-changing activity; an SMS or small data usage are community-reproduced examples.',
    'Keep enough credit on the line for the activity (official minimum top-up is £10).',
    'Verify the balance changed, so the 180-day window resets.',
    'Keep a recovery / port-out plan: a major overseas closure wave occurred in July 2026.',
    'Record the date below so this tool computes your next safe deadline.'
  ]
};

const shortActionByRoute = {
  'voxi-uk-esim-payg-retention': 'send one SMS',
  'lebara-uk-direct-esim-china': 'make a chargeable activity',
  'giffgaff-uk-direct-esim-payg': 'make a balance-changing activity'
};

const models = (data.routes || []).filter(r => Number.isFinite(r.keep?.intervalDays) && r.keep?.action && r.publishState !== 'observation-hold').map(r => {
  const brand = (data.brands || []).find(b => b.id === r.brandId) || {};
  const keep = r.keep || {};
  const interval = Number.isFinite(keep.intervalDays) ? keep.intervalDays : null;
  const hold = r.publishState === 'observation-hold' || !interval;
  let safe = null;
  let bufferNote = '';
  if (interval) {
    if (keep.practicalBufferDays) {
      const m = String(keep.practicalBufferDays).match(/\d+/);
      if (m) {
        safe = parseInt(m[0], 10);
        bufferNote = `Community practical buffer: act around day ${keep.practicalBufferDays} of the ${interval}-day window; this tool uses day ${safe}.`;
      }
    }
    if (!safe) {
      safe = interval - Math.ceil(interval * 0.15);
      bufferNote = `Default safety buffer: 15% of the ${interval}-day window, so repeat the action at least every ${safe} days.`;
    }
  }
  const verifiedDaysAgo = r.lastVerifiedAt && data.checkedAt
    ? Math.round((Date.parse(data.checkedAt) - Date.parse(r.lastVerifiedAt)) / DAY)
    : null;
  return {
    id: r.id,
    brandName: brand.name || r.id,
    hold,
    holdReason: r.holdReason || 'Current durable retention is not established.',
    action: keep.action || '',
    interval,
    safe,
    perYearActions: interval ? Math.floor(365 / interval) : null,
    bufferNote,
    perAction: Number.isFinite(keep.observedActionCost) ? keep.observedActionCost : null,
    yearOriginal: Number.isFinite(keep.yearCostOriginal) ? keep.yearCostOriginal : null,
    yearCny: Number.isFinite(keep.yearCostCny) ? keep.yearCostCny : null,
    currency: keep.currency || 'GBP',
    stateLabel: stateLabels[keep.state] || keep.state || 'Unknown',
    lastVerifiedAt: r.lastVerifiedAt || 'unknown',
    stale: verifiedDaysAgo !== null && verifiedDaysAgo > 90,
    steps: stepsByRoute[r.id] || (interval && keep.action ? [
      'Perform the keep-alive action described above, exactly as sourced.',
      'Verify the action registered with the operator (usage history, credit change or validity extension).',
      'Record the date below so this tool computes your next safe deadline.'
    ] : []),
    shortAction: shortActionByRoute[r.id] || 'perform the keep-alive activity',
    marketName: r.marketName || 'Global',
    continuityWarning: r.id === 'giffgaff-uk-direct-esim-payg'
      ? 'A major overseas closure wave occurred in July 2026 — keep a recovery / port-out plan alongside any keep-alive routine.'
      : ''
  };
});

const fx = data.fxSnapshot || {};
const base = 'https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/keep-alive/';
const themeInit = '<script id="theme-init">(()=>{try{const saved=localStorage.getItem(\'site-theme\')||\'system\';const dark=window.matchMedia(\'(prefers-color-scheme: dark)\').matches;document.documentElement.dataset.theme=saved===\'system\'?(dark?\'dark\':\'light\'):saved}catch{}})();</script>';

const pageStyle = `<style>
.ka-wrap{max-width:900px;padding-bottom:70px}
.ka-wrap h1{font-size:clamp(2rem,5vw,3.2rem);margin:.2em 0}
.ka-lead{font-size:1.05rem;color:var(--muted);max-width:780px}
.ka-sel{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:22px 0 26px}
.ka-sel-btn{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:14px 12px;text-align:left;cursor:pointer;font:inherit;color:inherit}
.ka-sel-btn.active{outline:2px solid var(--ink)}
.ka-sel-btn strong{display:block;font-size:.98rem}
.ka-sel-btn small{display:block;color:var(--muted);margin-top:4px;font-size:.76rem}
.ka-brand-panel{border:1px solid var(--line);border-radius:16px;background:var(--panel);padding:20px;margin:16px 0}
.ka-hidden{display:none}
.ka-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:14px 0}
.ka-stats div{border:1px solid var(--line);border-radius:12px;padding:12px}
.ka-stats small{display:block;color:var(--muted);text-transform:uppercase;font-size:.66rem;font-weight:850;letter-spacing:.05em}
.ka-stats strong{display:block;margin-top:5px;font-size:1rem}
.ka-pill{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:4px 9px;font-size:.74rem;font-weight:800;margin:0 6px 6px 0}
.ka-pill.ka-stale{border-color:#d9a441;color:#9a6700}
.ka-note{font-size:.86rem;color:var(--muted)}
.ka-hold{border:1px solid #d9a441;border-radius:14px;background:#fff8e8;padding:14px 16px;margin:14px 0;color:#5b4308}
.ka-warnbox{border:1px solid #d9a441;border-radius:12px;padding:12px 14px;margin:12px 0;font-size:.88rem}
.ka-steps{margin:10px 0 18px}
.ka-steps li{margin:6px 0;font-size:.93rem}
.ka-calc{border-top:1px solid var(--line);margin-top:16px;padding-top:16px}
.ka-calc label{font-weight:800;font-size:.88rem;display:block;margin-bottom:8px}
.ka-calc input[type=date]{font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:inherit}
.ka-countdown{display:flex;gap:12px;align-items:baseline;border-radius:12px;padding:12px 14px;margin:14px 0;flex-wrap:wrap}
.ka-countdown strong{font-size:1.25rem}
.ka-ok{background:#e7f6ec;color:#14532d}
.ka-warn{background:#fff8e8;color:#9a6700}
.ka-bad{background:#fdeaea;color:#b42318}
.ka-cal-actions{display:flex;gap:10px;flex-wrap:wrap;margin:6px 0 4px}
.ka-cal-actions button,.ka-cal-actions a{display:inline-flex;min-height:40px;align-items:center;padding:0 14px;border-radius:10px;border:1px solid var(--ink);background:var(--ink);color:var(--bg);font-weight:800;font:inherit;cursor:pointer;text-decoration:none}
.ka-cal-actions a{background:transparent;color:var(--ink)}
.ka-muted{color:var(--muted);font-size:.86rem}
.ka-links{display:flex;gap:14px;flex-wrap:wrap;margin-top:14px;font-size:.9rem}
.ka-discipline,.ka-faq{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:16px 18px;margin:22px 0}
.ka-discipline h2,.ka-faq h2{font-size:1rem;margin:0 0 8px}
.ka-faq h3{font-size:.93rem;margin:14px 0 4px}
.ka-faq p,.ka-discipline p,.ka-faq li,.ka-discipline li{font-size:.9rem}
@media(max-width:760px){.ka-sel,.ka-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>`;

const header = '<header class="site-header"><div class="shell nav"><a class="brand" href="/">Everyday Tools</a><nav aria-label="Primary"><a href="/tools/phone-number-survival-guide/">Phone Radar</a><a href="/tools/">All tools</a></nav></div></header>';
const footer = '<footer class="site-footer"><div class="shell footer-grid"><div><strong>Everyday Tools</strong><p>Fast decision tools for real user problems.</p></div><nav aria-label="Footer"><a href="/tools/">All tools</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></div></footer>';

function crumbs(items){
  return JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((x,i)=>({'@type':'ListItem',position:i+1,name:x[0],item:x[1]}))}).replace(/</g,'\\u003c');
}


const clientJs = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'phone-keep-alive-client.js'), 'utf8');
if (clientJs.includes('</script>')) throw new Error('Keep-alive client script must not contain a closing script tag');

function statBox(label, value){
  return `<div><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`;
}

function badgesHtml(m){
  return `<span class="ka-pill">${esc(m.stateLabel)}</span><span class="ka-pill">Verified ${esc(m.lastVerifiedAt)}</span>${m.stale ? '<span class="ka-pill ka-stale">Re-verification due</span>' : ''}`;
}

function selBtn(m){
  const sub = `${m.marketName} · ${m.interval}-day window · ${money(m.yearOriginal, m.currency)}/yr`;
  return `<button type="button" class="ka-sel-btn" data-route="${esc(m.id)}" data-q="${esc((m.brandName + ' ' + m.marketName).toLowerCase())}"><strong>${esc(m.brandName)}</strong><small>${esc(sub)}</small></button>`;
}

function panelHtml(m){
  if (m.hold) {
    return `<section class="ka-brand-panel" id="ka-panel-${esc(m.id)}" aria-label="${esc(m.brandName)}">
<h2>${esc(m.brandName)}</h2>
<div style="margin:10px 0">${badgesHtml(m)}</div>
<div class="ka-hold"><strong>On hold — no calculator offered.</strong><br>${esc(m.holdReason)}</div>
<p class="ka-note">This tool only computes deadlines where a durable retention rule is established on current evidence. ${esc(m.brandName)} does not currently qualify, so no date math is shown rather than a guessed one.</p>
<div class="ka-links"><a href="/tools/phone-number-survival-guide/route/${esc(m.id)}/">Full ${esc(m.brandName)} route evidence →</a></div>
</section>`;
  }
  const perAction = m.perAction !== null ? `~${money(m.perAction, m.currency)}` : 'n/a';
  const perYear = m.yearOriginal !== null
    ? `${money(m.yearOriginal, m.currency)}${m.yearCny !== null ? ` · ≈ ¥${Number(m.yearCny).toLocaleString('en-GB', { maximumFractionDigits: 2 })}` : ''}`
    : 'n/a';
  return `<section class="ka-brand-panel" id="ka-panel-${esc(m.id)}" aria-label="${esc(m.brandName)}">
<h2>${esc(m.brandName)}</h2>
<div style="margin:10px 0">${badgesHtml(m)}</div>
${m.continuityWarning ? `<div class="ka-warnbox"><strong>Continuity warning:</strong> ${esc(m.continuityWarning)}</div>` : ''}
<div class="ka-stats">
${statBox('Window', `${m.interval} days`)}
${statBox('Safe rhythm', `every ${m.safe} days`)}
${statBox('Cost per action', perAction)}
${statBox('Keep cost / year', perYear)}
</div>
<p><strong>What to do:</strong> ${esc(m.action)}</p>
<p class="ka-note">${esc(m.bufferNote)} Repeats needed: about ${m.perYearActions}× per year.</p>
<ol class="ka-steps">${m.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
<div class="ka-calc">
<label for="ka-date-${esc(m.id)}">Last keep-alive action date</label>
<input type="date" class="ka-date-input" id="ka-date-${esc(m.id)}" data-route="${esc(m.id)}">
<div id="ka-result-${esc(m.id)}" aria-live="polite"></div>
</div>
<div class="ka-links"><a href="/tools/phone-number-survival-guide/keep-alive/${esc(m.id)}/">Static ${esc(m.brandName)} keep-alive page →</a><a href="/tools/phone-number-survival-guide/route/${esc(m.id)}/">Full route evidence →</a></div>
</section>`;
}

const faqEntries = [
  ['How often do I need to keep a prepaid number active?',
   'It depends on the operator. Windows range from 60 days to a full year depending on the route. Pick your operator above to see its exact window and a safe repeat rhythm with a 15% buffer.'],
  ['What does it cost per year to keep a number alive?',
   'The cheapest established routes cost under a few CNY per year — a single small SMS or top-up inside the window. Costs shown are community-measured action costs; any balance you top up remains yours.'],
  ['Why is a route missing from this tool?',
   'Only routes with an established, evidence-backed retention window get a calculator. Routes still under observation stay in the directory with their evidence status instead of an invented date rule.']
];

function hubHtml(){
  const canonical = base;
  const title = `Keep-Alive Assistant – SIM retention deadlines & reminders (${models.length} routes) – Phone Radar`;
  const desc = 'Pick your SIM to get its exact keep-alive action, cost per action, safe repeat window, next deadline and a calendar reminder (.ics / Google Calendar). Evidence-graded; unproven routes are marked, not guessed.';
  const webApp = JSON.stringify({'@context':'https://schema.org','@type':'WebApplication','name':'Phone Radar Keep-Alive Assistant','applicationCategory':'UtilitiesApplication','operatingSystem':'Any','description':desc,'isAccessibleForFree':true,'offers':{'@type':'Offer','price':'0','priceCurrency':'USD'},'url':canonical}).replace(/</g, '\\u003c');
  const faqLd = JSON.stringify({'@context':'https://schema.org','@type':'FAQPage','mainEntity':faqEntries.map(q => ({'@type':'Question','name':q[0],'acceptedAnswer':{'@type':'Answer','text':q[1]}}))}).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/site.css">
<script type="application/ld+json">${webApp}</script>
<script type="application/ld+json">${faqLd}</script>
<script type="application/ld+json">${crumbs([['Home','https://aineedhelpfromotherai.com/'],['Phone Radar','https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/'],['Keep-Alive Assistant',canonical]])}</script>
${themeInit}
${pageStyle}</head>
<body>${header}
<main class="shell ka-wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/tools/phone-number-survival-guide/">Phone Radar</a><span>›</span><span>Keep-Alive Assistant</span></nav>
<p class="eyebrow">Phone Radar · Global</p><h1>Keep-Alive Assistant</h1>
<p class="ka-lead">Pick your SIM and get the exact retention action, what it costs, how often to repeat it and your next safe deadline — then export a calendar reminder so the number never lapses. Every rule is evidence-graded; routes without an established rule are excluded rather than guessed.</p>
<input id="ka-q" type="search" placeholder="Filter routes by brand or market..." aria-label="Filter routes" style="width:100%;min-height:44px;padding:0 14px;border:1px solid var(--line);border-radius:12px;background:var(--panel);color:inherit;font:inherit;margin:14px 0 4px">
<div class="ka-sel">${models.map(selBtn).join('')}</div>
${models.map(panelHtml).join('')}
<section class="ka-discipline"><h2>How this tool treats evidence</h2>
<ul>
<li>All rules come from the same normalized global directory packet that backs the Phone Radar route guides (packet checked ${esc(data.checkedAt)}).</li>
<li>Costs are community-measured action costs; any balance you top up remains yours.</li>
<li>CNY figures use the packet reference rates captured on ${esc(data.checkedAt)}; your card FX may differ.</li>
<li>Reminders are generated locally in your browser (.ics download or Google Calendar link). No account, no backend; your date is stored only in this browser.</li>
<li>Where a route lacks an established retention rule, no calculator is offered — missing rules stay missing rather than becoming guesses.</li>
</ul></section>
<section class="ka-faq"><h2>Keep-alive questions</h2>
${faqEntries.map(q => `<h3>${esc(q[0])}</h3><p>${esc(q[1])}</p>`).join('')}
</section>
</main>${footer}
<script>window.KA_DATA=${JSON.stringify({'checkedAt':data.checkedAt,'routes':models.map(m => ({'id':m.id,'brandName':m.brandName,'hold':m.hold,'action':m.action,'interval':m.interval,'safe':m.safe,'shortAction':m.shortAction,'perActionLabel':m.perAction !== null ? `~${money(m.perAction, m.currency)}` : 'n/a'}))}).replace(/</g, '\\u003c')};</script>
<script>${clientJs}</script>
<script>(()=>{const q=document.getElementById('ka-q');if(!q)return;const btns=[...document.querySelectorAll('.ka-sel-btn')];q.addEventListener('input',()=>{const t=q.value.trim().toLowerCase();for(const b of btns){b.style.display=!t||b.dataset.q.includes(t)?'':'none';}});})();</script>
</body></html>`;
}

function brandHtml(m){
  const canonical = `${base}${m.id}/`;
  const title = `${m.brandName} keep-alive rules – ${m.marketName} SIM retention – Phone Radar`;
  const desc = m.hold
    ? `${m.brandName} keep-alive status: on observation hold — no clean durable retention path is currently established. Hold reason and re-open conditions.`
    : `${m.brandName} keep-alive rules (${m.marketName}): ${m.interval}-day window, act at least every ${m.safe} days, about ${money(m.perAction, m.currency)} per action and ${money(m.yearOriginal, m.currency)} per year. Steps, evidence state and a deadline calculator.`;
  const pageLd = JSON.stringify({'@context':'https://schema.org','@type':'WebPage','name':`${m.brandName} keep-alive rules`,'description':desc,'url':canonical,'dateModified':m.lastVerifiedAt !== 'unknown' ? m.lastVerifiedAt : data.checkedAt,'isPartOf':{'@type':'WebSite','name':'Phone Radar','url':'https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/'}}).replace(/</g, '\\u003c');
  const bodyBlock = m.hold
    ? `<div class="ka-hold"><strong>On hold — no calculator offered.</strong><br>${esc(m.holdReason)}</div>
<p>This route stays backstage until a durable retention rule is established on current evidence. Re-open condition: a verified, lawful, reproducible keep-alive path.</p>`
    : `${m.continuityWarning ? `<div class="ka-warnbox"><strong>Continuity warning:</strong> ${esc(m.continuityWarning)}</div>` : ''}
<div class="ka-stats">
${statBox('Window', `${m.interval} days`)}
${statBox('Safe rhythm', `every ${m.safe} days`)}
${statBox('Cost per action', m.perAction !== null ? `~${money(m.perAction, m.currency)}` : 'n/a')}
${statBox('Keep cost / year', m.yearOriginal !== null ? money(m.yearOriginal, m.currency) : 'n/a')}
</div>
<p><strong>What to do:</strong> ${esc(m.action)}</p>
<p class="ka-note">${esc(m.bufferNote)} Repeats needed: about ${m.perYearActions}× per year.</p>
<ol class="ka-steps">${m.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/site.css">
<script type="application/ld+json">${pageLd}</script>
<script type="application/ld+json">${crumbs([['Home','https://aineedhelpfromotherai.com/'],['Phone Radar','https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/'],['Keep-Alive Assistant',base],[m.brandName,canonical]])}</script>
${themeInit}
${pageStyle}</head>
<body>${header}
<main class="shell ka-wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/tools/phone-number-survival-guide/">Phone Radar</a><span>›</span><a href="/tools/phone-number-survival-guide/keep-alive/">Keep-Alive Assistant</a><span>›</span><span>${esc(m.brandName)}</span></nav>
<p class="eyebrow">Phone Radar · Keep-Alive Assistant</p><h1>${esc(m.brandName)} keep-alive rules</h1>
<div style="margin:10px 0">${badgesHtml(m)}</div>
${bodyBlock}
<div class="ka-links"><a href="/tools/phone-number-survival-guide/keep-alive/#${esc(m.id)}">Open in the deadline calculator →</a><a href="/tools/phone-number-survival-guide/route/${esc(m.id)}/">Full route evidence →</a></div>
</main>${footer}
</body></html>`;
}

const outRoot = join(guideDir, 'keep-alive');
mkdirSync(outRoot, { recursive: true });
writeFileSync(join(outRoot, 'index.html'), hubHtml());
for (const m of models) {
  const dir = join(outRoot, m.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), brandHtml(m));
}

const hubPath = join(guideDir, 'index.html');
let hub = readFileSync(hubPath, 'utf8');
const anchor = '<nav class="pr-related" aria-label="Related tools">';
if (!hub.includes('pr-keep-alive-tool')) {
  if (!hub.includes(anchor)) throw new Error('Phone Radar hub related-tools nav anchor missing');
  const link = `<nav class="pr-related pr-keep-alive-tool" aria-label="Keep-alive tool"><a href="/tools/phone-number-survival-guide/keep-alive/">Keep-Alive Assistant — turn each route's retention window into a deadline and a calendar reminder</a></nav>`;
  hub = hub.replace(anchor, link + anchor);
  writeFileSync(hubPath, hub);
}

const sitemapPath = join(root, 'dist', 'sitemap.xml');
let sitemap = readFileSync(sitemapPath, 'utf8');
const urls = [base, ...models.map(m => `${base}${m.id}/`)];
const additions = urls.filter(u => !sitemap.includes(u)).map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${data.checkedAt}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u === base ? '0.8' : '0.7'}</priority>\n  </url>`).join('\n');
if (additions) {
  sitemap = sitemap.replace('</urlset>', `${additions}\n</urlset>`);
  writeFileSync(sitemapPath, sitemap);
}

const hubOut = readFileSync(join(outRoot, 'index.html'), 'utf8');
for (const marker of ['<title>Keep-Alive Assistant', `<link rel="canonical" href="${base}">`, 'RRULE:FREQ=DAILY;INTERVAL=', 'phone_keepalive_calculate', 'phone_keepalive_ics', 'ka-date-']) {
  if (!hubOut.includes(marker)) throw new Error(`Keep-alive hub marker missing: ${marker}`);
}
console.log(`Published Keep-Alive Assistant hub + ${models.length} brand pages.`);
