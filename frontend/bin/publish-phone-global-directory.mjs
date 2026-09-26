import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const guideDir = join(root, 'dist', 'tools', 'phone-number-survival-guide');
const dataPath = join(root, 'tools', 'phone-number-lifecycle-mvp', 'global-directory.json');
if (!existsSync(dataPath)) { console.log('global-directory.json missing; skipping global directory publish'); process.exit(0); }
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const routeBase = 'https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/route/';
const dirBase = 'https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/directory/';
const money = (value, currency='') => Number.isFinite(value) ? `${currency} ${Number(value).toLocaleString('en-GB',{maximumFractionDigits:2})}` : 'Not established';

function statusLabel(r){
  if (r.publishState === 'observation-hold') return 'Observation / hold';
  if (r.publishState === 'candidate') return 'Candidate — evidence captured';
  if (r.publishState === 'observation') return 'Observation — terms pending';
  return 'Pilot route';
}

function serviceSummary(data, routeId, service){
  const rows=(data.serviceObservations||[]).filter(x=>x.routeId===routeId&&x.service===service);
  if(!rows.length)return 'No normalized community observation yet.';
  const success=rows.filter(x=>x.outcome==='success').length;
  const failure=rows.filter(x=>x.outcome!=='success').length;
  const latest=[...rows].sort((a,b)=>String(b.reportedAt).localeCompare(String(a.reportedAt)))[0];
  return `${rows.length} report${rows.length===1?'':'s'} · ${success} success · ${failure} non-success · latest ${latest.reportedAt}`;
}

function routeHtml(r){
  const brand=data.brands.find(x=>x.id===r.brandId);
  const network=data.networks.find(x=>x.id===brand?.networkId);
  const market=r.marketName||'Global';
  const events=(data.continuityEvents||[]).filter(x=>x.routeId===r.id);
  const sources=(r.sourceIds||[]).map(id=>data.sources.find(x=>x.id===id)).filter(Boolean);
  const canonical=`${routeBase}${r.id}/`;
  const status=statusLabel(r);
  const appRows=['OpenAI/Codex','Telegram','WhatsApp'].map(service=>`<li><strong>${esc(service)}:</strong> ${esc(serviceSummary(data,r.id,service))}</li>`).join('');
  const eventRows=events.length?`<ul>${events.map(e=>`<li><strong>${esc(e.reportedAt)}</strong> — ${esc(e.outcome)}</li>`).join('')}</ul>`:`<p>${esc(r.holdReason||'No continuity incident recorded for this route yet.')}</p>`;
  const sourceRows=sources.map(x=>`<li><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.reportedAt||data.checkedAt)} · ${esc(x.type)}</a></li>`).join('');
  const hold=r.publishState==='observation-hold'||r.publishState==='observation';
  const keepCost=money(r.keep?.yearCostOriginal,r.keep?.currency||'');
  const startCost=money(r.landedCost?.landedOriginal,r.landedCost?.currency||'');
  const desc=`${brand?.name||r.id} (${market}) — SIM number retention: acquisition cost, keep-alive cost and interval, overseas activation, KYC and evidence. Verified ${r.lastVerifiedAt||data.checkedAt}.`;
  const schema=JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:`${brand?.name||r.id} ${market} number retention guide`,description:desc,url:canonical,dateModified:r.lastVerifiedAt||data.checkedAt,isPartOf:{'@type':'WebSite',name:'Phone Radar',url:'https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/'}}).replace(/</g,'<');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(brand?.name||r.id)} ${esc(market)} number retention guide – Phone Radar</title>
<meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(brand?.name||r.id)} ${esc(market)} retention guide"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/site.css">
<script type="application/ld+json">${schema}</script>
<script id="theme-init">(()=>{try{const saved=localStorage.getItem('site-theme')||'system';const dark=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=saved==='system'?(dark?'dark':'light'):saved}catch{}})();</script>
<style>.route-detail{max-width:900px;padding-bottom:70px}.route-detail h1{font-size:clamp(2rem,5vw,3.4rem);margin:.2em 0}.route-lead{font-size:1.05rem;color:var(--muted);max-width:760px}.route-meta{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 24px}.route-pill{border:1px solid var(--line);border-radius:999px;padding:5px 9px;background:var(--panel);font-size:.76rem;font-weight:800}.route-hold{padding:14px 16px;border:1px solid #d9a441;border-radius:14px;background:#fff8e8;margin:18px 0}.route-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0 28px}.route-summary div,.route-section{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:16px}.route-summary small{display:block;color:var(--muted);text-transform:uppercase;font-size:.68rem;font-weight:850;letter-spacing:.05em}.route-summary strong{display:block;margin-top:5px;font-size:1rem}.route-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.route-section.wide{grid-column:1/-1}.route-section h2{font-size:1rem;margin:0 0 9px}.route-section p,.route-section li{font-size:.91rem}.route-actions{display:flex;gap:9px;flex-wrap:wrap;margin:24px 0}.route-actions a{display:inline-flex;min-height:40px;align-items:center;padding:0 13px;border:1px solid var(--line);border-radius:10px;font-weight:800}.route-actions .primary{background:var(--ink);color:var(--bg);border-color:var(--ink)}.route-sources{margin-top:26px}.route-sources a{overflow-wrap:anywhere}@media(max-width:700px){.route-summary,.route-grid{grid-template-columns:1fr}.route-section.wide{grid-column:auto}}</style></head>
<body><header class="site-header"><div class="shell nav"><a class="brand" href="/">Everyday Tools</a><nav aria-label="Primary"><a href="/tools/phone-number-survival-guide/">Phone Radar</a><a href="/tools/phone-number-survival-guide/directory/">Directory</a><a href="/tools/">All tools</a></nav></div></header>
<main class="shell route-detail"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/tools/phone-number-survival-guide/">Phone Radar</a><span>›</span><a href="/tools/phone-number-survival-guide/directory/">Directory</a><span>›</span><span>${esc(brand?.name||r.id)}</span></nav>
<p class="eyebrow">Phone Radar · ${esc(market)}</p><h1>${esc(brand?.name||r.id)} — ${esc(market)} number retention</h1><p class="route-lead">${esc(network?.name||'')} · ${esc(r.simType||'')} · ${esc(r.numberType||'')}. ${esc(r.acquisitionSummary||'')}</p>
<div class="route-meta"><span class="route-pill">${esc(status)}</span><span class="route-pill">Last verified ${esc(r.lastVerifiedAt||data.checkedAt)}</span><span class="route-pill">${sources.length} sources</span>${r.trend?`<span class="route-pill">Trend: ${esc(r.trend)}</span>`:''}</div>
${r.holdReason?`<div class="route-hold"><strong>Note:</strong> ${esc(r.holdReason)}</div>`:''}
<div class="route-summary"><div><small>Start cost</small><strong>${esc(startCost)}</strong></div><div><small>Keep / year</small><strong>${esc(keepCost)}</strong></div><div><small>Keep interval</small><strong>${Number.isFinite(r.keep?.intervalDays)?`${r.keep.intervalDays} days`:'Not established'}</strong></div></div>
<div class="route-grid">
<section class="route-section"><h2>1. What it costs</h2><p>${esc(startCost)} landed baseline when established. ${esc(r.tariffSummary||'')}</p></section>
<section class="route-section"><h2>2. Requirements</h2><p>${esc(r.kyc||'Unknown')} ${esc(r.payment||'')}</p></section>
<section class="route-section wide"><h2>3. Step by step</h2><ol>${(r.guideSteps||[]).map(x=>`<li>${esc(x)}</li>`).join('')||'<li>Steps not documented yet.</li>'}</ol></section>
<section class="route-section wide"><h2>4. Activate / use abroad</h2><p>${esc(r.chinaActivation||'Unknown')}</p></section>
<section class="route-section"><h2>5. Keep it alive</h2><p>${esc(keepCost)} / year when established. ${esc(r.keep?.action||'Unknown')}</p></section>
<section class="route-section"><h2>6. Wi-Fi Calling / SMS</h2><p>${esc(r.wifiCalling||'Unknown')} SMS: ${esc(r.roamingSms||'Unknown')}</p></section>
<section class="route-section"><h2>7. App evidence</h2><ul>${appRows}</ul></section>
<section class="route-section"><h2>8. Refund / recovery</h2><p>${esc(r.refund||'No normalized evidence')}</p></section>
<section class="route-section wide"><h2>9. Continuity history</h2>${eventRows}</section>
</div>
<div class="route-actions"><a href="/tools/phone-number-survival-guide/directory/">← All markets</a>${!hold&&r.guideEligible!==false&&r.acquireUrl?`<a class="primary" href="${esc(r.acquireUrl)}" target="_blank" rel="noopener noreferrer">Acquire / open ↗</a>`:''}</div>
<section class="route-sources"><h2>Evidence sources</h2><p>Provider-controlled facts and independent operational reports are kept distinct. Unverified items stay marked as pending rather than becoming invented numbers.</p><ul>${sourceRows}</ul></section>
</main><footer class="site-footer"><div class="shell footer-grid"><div><strong>Everyday Tools</strong><p>Fast decision tools for real user problems.</p></div><nav aria-label="Footer"><a href="/tools/">All tools</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></div></footer></body></html>`;
}

function directoryHtml(){
  const canonical=dirBase;
  const byMarket=new Map();
  for(const r of data.routes){const m=r.marketName||'Global';if(!byMarket.has(m))byMarket.set(m,[]);byMarket.get(m).push(r);}
  const markets=[...byMarket.keys()].sort((a,b)=>a.localeCompare(b));

  // cheapest leaderboard: routes with a finite annual keep-alive cost, sorted ascending
  const ranked=data.routes
    .filter(r=>Number.isFinite(r.keep?.yearCostOriginal)&&r.keep?.yearCostCny!=null&&r.publishState!=='observation-hold')
    .map(r=>({r,brand:data.brands.find(x=>x.id===r.brandId)}))
    .sort((a,b)=>(a.r.keep.yearCostCny??9e9)-(b.r.keep.yearCostCny??9e9));
  const top10=ranked.slice(0,10);
  const leaderboardRows=top10.map((x,i)=>{
    const r=x.r;
    return `<tr><td class="rank">#${i+1}</td><td><a href="/tools/phone-number-survival-guide/route/${esc(r.id)}/"><strong>${esc(x.brand?.name||r.id)}</strong></a><small class="mkt">${esc(r.marketName||'')}</small></td><td class="cost">${esc(r.keep.currency)} ${r.keep.yearCostOriginal}</td><td class="cny">≈¥${r.keep.yearCostCny}</td><td>${Number.isFinite(r.keep?.intervalDays)?r.keep.intervalDays+'d':'—'}</td></tr>`;
  }).join('');

  // rows with data attributes for client-side filter/sort
  const sections=markets.map(m=>{
    const rows=byMarket.get(m).map(r=>{
      const brand=data.brands.find(x=>x.id===r.brandId);
      const keep=Number.isFinite(r.keep?.yearCostOriginal)?`${r.keep.currency} ${r.keep.yearCostOriginal}/yr`:'—';
      const cny=Number.isFinite(r.keep?.yearCostCny)?r.keep.yearCostCny:'';
      const searchable=`${(brand?.name||'').toLowerCase()} ${r.id.toLowerCase()} ${m.toLowerCase()}`;
      return `<tr data-q="${esc(searchable)}" data-cny="${cny}" data-market="${esc(m)}"><td><a href="/tools/phone-number-survival-guide/route/${esc(r.id)}/"><strong>${esc(brand?.name||r.id)}</strong></a></td><td>${esc(statusLabel(r))}</td><td>${esc(keep)}</td><td>${Number.isFinite(r.keep?.intervalDays)?r.keep.intervalDays+'d':'—'}</td><td>${esc(r.lastVerifiedAt||'')}</td></tr>`;
    }).join('');
    return `<section class="dir-market" data-market="${esc(m)}"><h2>${esc(m)} <small>${byMarket.get(m).length} route${byMarket.get(m).length===1?'':'s'}</small></h2><table><thead><tr><th>Route</th><th>Status</th><th>Keep/yr</th><th>Interval</th><th>Verified</th></tr></thead><tbody>${rows}</tbody></table></section>`;
  }).join('\n');

  const desc=`Global SIM number retention directory: ${data.routes.length} routes across ${markets.length} markets — cheapest keep-alive routes ranked, acquisition cost, keep-alive cost and interval, KYC and evidence status per route.`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cheapest SIM to keep a number alive — ${data.routes.length} routes, ${markets.length} markets – Phone Radar</title>
<meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${canonical}"><meta property="og:title" content="Cheapest SIM number retention directory"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/site.css">
<script id="theme-init">(()=>{try{const saved=localStorage.getItem('site-theme')||'system';const dark=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=saved==='system'?(dark?'dark':'light'):saved}catch{}})();</script>
<style>
.dir{max-width:1000px;padding-bottom:70px}.dir h1{font-size:clamp(2rem,5vw,3.2rem);margin:.2em 0}.dir-lead{color:var(--muted);max-width:760px}
.dir-toolbar{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0 8px;position:sticky;top:0;background:var(--bg);padding:10px 0;z-index:5}
.dir-toolbar input,.dir-toolbar select{min-height:40px;padding:0 12px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);font-size:.92rem}
.dir-toolbar input{flex:1;min-width:200px}
.lb{margin:22px 0 8px;border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:18px;overflow-x:auto}
.lb h2{margin:0 0 4px;font-size:1.2rem}.lb p{margin:0 0 12px;color:var(--muted);font-size:.88rem}
.lb table{width:100%;border-collapse:collapse;font-size:.9rem}.lb th,.lb td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);white-space:nowrap}
.lb th{font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
.lb .rank{font-weight:850;color:var(--muted)}.lb .cost{font-weight:800}.lb .cny{color:var(--muted)}.lb .mkt{display:block;font-size:.74rem;color:var(--muted);font-weight:400}
.dir-count{margin:6px 0 0;color:var(--muted);font-size:.85rem}
.dir-market{margin:26px 0}.dir-market h2{font-size:1.15rem}.dir-market small{color:var(--muted);font-weight:400}
.dir-market table{width:100%;border-collapse:collapse;font-size:.88rem}.dir-market th,.dir-market td{text-align:left;padding:7px 9px;border-bottom:1px solid var(--line)}
.dir-market th{font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
tr.hidden,section.hidden{display:none}
</style></head>
<body><header class="site-header"><div class="shell nav"><a class="brand" href="/">Everyday Tools</a><nav aria-label="Primary"><a href="/tools/phone-number-survival-guide/">Phone Radar</a><a href="/tools/">All tools</a></nav></div></header>
<main class="shell dir"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/tools/phone-number-survival-guide/">Phone Radar</a><span>›</span><span>Directory</span></nav>
<p class="eyebrow">Phone Radar · Global directory</p><h1>SIM number retention — ${data.routes.length} routes, ${markets.length} markets</h1>
<p class="dir-lead">Every route is marked with its evidence status. Candidate routes have official terms captured; observation routes are still pending verification. Unverified fields are shown as pending — never invented. Last global check ${esc(data.checkedAt)}.</p>

<section class="lb"><h2>Cheapest keep-alive routes</h2><p>Ranked by annual keep-alive cost, normalized to CNY. Only routes with an established yearly cost are ranked.</p>
<table><thead><tr><th>#</th><th>Route</th><th>Keep/yr</th><th>≈CNY</th><th>Interval</th></tr></thead><tbody>${leaderboardRows}</tbody></table></section>

<div class="dir-toolbar">
<input id="dir-q" type="search" placeholder="Search brand, route or market…" aria-label="Search routes">
<select id="dir-market" aria-label="Filter by market"><option value="">All markets</option>${markets.map(m=>`<option value="${esc(m)}">${esc(m)}</option>`).join('')}</select>
<select id="dir-sort" aria-label="Sort"><option value="market">Group by market</option><option value="cny-asc">Cheapest first</option><option value="cny-desc">Most expensive first</option></select>
</div>
<p class="dir-count" id="dir-count">${data.routes.length} routes</p>
<div id="dir-list">${sections}</div>
</main><footer class="site-footer"><div class="shell footer-grid"><div><strong>Everyday Tools</strong><p>Fast decision tools for real user problems.</p></div><nav aria-label="Footer"><a href="/tools/">All tools</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></div></footer>
<script>
(()=>{
  const q=document.getElementById('dir-q'),mk=document.getElementById('dir-market'),so=document.getElementById('dir-sort');
  const rows=[...document.querySelectorAll('#dir-list tr[data-q]')];
  const sections=[...document.querySelectorAll('.dir-market')];
  const count=document.getElementById('dir-count');
  function apply(){
    const term=(q.value||'').trim().toLowerCase();
    const market=mk.value;
    let visible=0;
    for(const row of rows){
      const okQ=!term||row.dataset.q.includes(term);
      const okM=!market||row.dataset.market===market;
      row.classList.toggle('hidden',!(okQ&&okM));
      if(okQ&&okM)visible++;
    }
    for(const s of sections){
      s.classList.toggle('hidden',![...s.querySelectorAll('tr[data-q]')].some(r=>!r.classList.contains('hidden')));
    }
    count.textContent=visible+' route'+(visible===1?'':'s');
  }
  q.addEventListener('input',apply);mk.addEventListener('change',apply);
  so.addEventListener('change',()=>{
    const v=so.value;
    if(v==='market'){location.hash='';apply();return;}
    // flat sort mode: rebuild rows inside a single table
    const list=document.getElementById('dir-list');
    let flat=document.getElementById('dir-flat');
    if(!flat){
      flat=document.createElement('section');flat.id='dir-flat';flat.className='dir-market';
      flat.innerHTML='<table><thead><tr><th>Route</th><th>Status</th><th>Keep/yr</th><th>Interval</th><th>Verified</th></tr></thead><tbody></tbody></table>';
      list.appendChild(flat);
    }
    const tbody=flat.querySelector('tbody');tbody.innerHTML='';
    const sorted=[...rows].sort((a,b)=>{
      const ca=parseFloat(a.dataset.cny)||Infinity,cb=parseFloat(b.dataset.cny)||Infinity;
      return v==='cny-asc'?ca-cb:cb-ca;
    });
    for(const r of sorted){tbody.appendChild(r);}
    sections.forEach(s=>s.classList.add('hidden'));flat.classList.remove('hidden');
    apply();
    // when switching back to market grouping, put rows back
    if(v==='market'){ /* handled above by reload-less restore */ }
  });
  // restore grouping when 'market' selected
  const origParents=new Map();
  rows.forEach(r=>origParents.set(r,r.parentElement));
  so.addEventListener('change',()=>{
    if(so.value==='market'){
      const flat=document.getElementById('dir-flat');
      rows.forEach(r=>{const p=origParents.get(r);if(p)p.appendChild(r);});
      if(flat)flat.classList.add('hidden');
      apply();
    }
  });
})();
</script>
</body></html>`;
}

const routeRoot=join(guideDir,'route');mkdirSync(routeRoot,{recursive:true});
for(const r of data.routes){const out=join(routeRoot,r.id);mkdirSync(out,{recursive:true});writeFileSync(join(out,'index.html'),routeHtml(r));}
const dirRoot=join(guideDir,'directory');mkdirSync(dirRoot,{recursive:true});
writeFileSync(join(dirRoot,'index.html'),directoryHtml());

const hubPath=join(guideDir,'index.html');
if(existsSync(hubPath)){
  let hub=readFileSync(hubPath,'utf8');
  if(!hub.includes('/directory/')){
    const link=`<p style="margin:18px 0"><a class="text-link" href="/tools/phone-number-survival-guide/directory/">Browse the global directory — ${data.routes.length} routes across ${new Set(data.routes.map(r=>r.marketName||'Global')).size} markets →</a></p>`;
    hub=hub.replace('</main>',`${link}</main>`);
    writeFileSync(hubPath,hub);
  }
}

const sitemapPath=join(root,'dist','sitemap.xml');let sitemap=readFileSync(sitemapPath,'utf8');
const urls=[dirBase,...data.routes.map(r=>`${routeBase}${r.id}/`)];
const additions=urls.filter(u=>!sitemap.includes(u)).map(u=>`  <url>\n    <loc>${u}</loc>\n    <lastmod>${data.checkedAt}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join('\n');
if(additions)sitemap=sitemap.replace('</urlset>',`${additions}\n</urlset>`);
writeFileSync(sitemapPath,sitemap);
console.log(`Published global Phone Radar directory: ${data.routes.length} route pages + directory index.`);

// ── market pages ──────────────────────────────────────────────────────────────
const marketBase = 'https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/market/';
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function marketHtml(market, routes){
  const slug = slugify(market);
  const canonical = `${marketBase}${slug}/`;
  const withCost = routes.filter(r=>Number.isFinite(r.keep?.yearCostCny)&&r.publishState!=='observation-hold').sort((a,b)=>a.keep.yearCostCny-b.keep.yearCostCny);
  const cheapest = withCost[0];
  const readyCount = routes.filter(r=>r.publishState!=='observation-hold'&&Number.isFinite(r.keep?.intervalDays)).length;

  const rows = routes.map(r=>{
    const brand=data.brands.find(x=>x.id===r.brandId);
    const keep=Number.isFinite(r.keep?.yearCostOriginal)?`${r.keep.currency} ${r.keep.yearCostOriginal}/yr`:'—';
    const cny=Number.isFinite(r.keep?.yearCostCny)?`≈¥${r.keep.yearCostCny}`:'—';
    const hasCalc = r.publishState!=='observation-hold'&&Number.isFinite(r.keep?.intervalDays)&&r.keep?.action;
    const calcLink = hasCalc?` <a href="/tools/phone-number-survival-guide/keep-alive/${esc(r.id)}/" title="Deadline calculator">⏰</a>`:'';
    return `<tr><td><a href="/tools/phone-number-survival-guide/route/${esc(r.id)}/"><strong>${esc(brand?.name||r.id)}</strong></a>${calcLink}</td><td>${esc(statusLabel(r))}</td><td>${esc(keep)}</td><td>${cny}</td><td>${Number.isFinite(r.keep?.intervalDays)?r.keep.intervalDays+'d':'—'}</td></tr>`;
  }).join('');

  const desc = cheapest
    ? `${routes.length} SIM retention routes in ${market}. Cheapest keep-alive: ${data.brands.find(x=>x.id===cheapest.brandId)?.name} at ${cheapest.keep.currency} ${cheapest.keep.yearCostOriginal}/yr (≈¥${cheapest.keep.yearCostCny}). Verified ${data.checkedAt}.`
    : `${routes.length} SIM retention routes in ${market}. Evidence status per route; unverified fields marked pending. Verified ${data.checkedAt}.`;

  const faq = cheapest ? JSON.stringify({'@context':'https://schema.org','@type':'FAQPage','mainEntity':[
    {'@type':'Question','name':`What is the cheapest way to keep a ${market} phone number active?`,'acceptedAnswer':{'@type':'Answer','text':`${data.brands.find(x=>x.id===cheapest.brandId)?.name} — ${cheapest.keep.currency} ${cheapest.keep.yearCostOriginal} per year (≈¥${cheapest.keep.yearCostCny}). Keep-alive action: ${(cheapest.keep?.action||'').slice(0,200)}`}},
    {'@type':'Question','name':`How many SIM retention routes exist in ${market}?`,'acceptedAnswer':{'@type':'Answer','text':`${routes.length} routes tracked; ${readyCount} have an established evidence-backed retention window with a deadline calculator.`}}
  ]}).replace(/</g,'\\u003c') : '';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(market)} SIM retention — keep your number alive – Phone Radar</title>
<meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(market)} SIM retention routes"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/site.css">
${faq?`<script type="application/ld+json">${faq}</script>`:''}
<script id="theme-init">(()=>{try{const saved=localStorage.getItem('site-theme')||'system';const dark=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=saved==='system'?(dark?'dark':'light'):saved}catch{}})();</script>
<style>.mkt-page{max-width:900px;padding-bottom:70px}.mkt-page h1{font-size:clamp(1.9rem,4.5vw,3rem);margin:.2em 0}.mkt-lead{color:var(--muted);max-width:740px}.mkt-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0 26px}.mkt-summary div{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:14px}.mkt-summary small{display:block;color:var(--muted);text-transform:uppercase;font-size:.68rem;font-weight:850;letter-spacing:.05em}.mkt-summary strong{display:block;margin-top:5px}.mkt-page table{width:100%;border-collapse:collapse;font-size:.9rem}.mkt-page th,.mkt-page td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line)}.mkt-page th{font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}@media(max-width:640px){.mkt-summary{grid-template-columns:1fr}}</style></head>
<body><header class="site-header"><div class="shell nav"><a class="brand" href="/">Everyday Tools</a><nav aria-label="Primary"><a href="/tools/phone-number-survival-guide/">Phone Radar</a><a href="/tools/phone-number-survival-guide/directory/">Directory</a><a href="/tools/">All tools</a></nav></div></header>
<main class="shell mkt-page"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/tools/phone-number-survival-guide/">Phone Radar</a><span>›</span><a href="/tools/phone-number-survival-guide/directory/">Directory</a><span>›</span><span>${esc(market)}</span></nav>
<p class="eyebrow">Phone Radar · Market</p><h1>${esc(market)} SIM retention</h1>
<p class="mkt-lead">${esc(desc)}</p>
<div class="mkt-summary"><div><small>Routes tracked</small><strong>${routes.length}</strong></div><div><small>With calculator</small><strong>${readyCount}</strong></div><div><small>Cheapest keep-alive</small><strong>${cheapest?esc((data.brands.find(x=>x.id===cheapest.brandId)?.name||'')+' ≈¥'+cheapest.keep.yearCostCny+'/yr'):'—'}</strong></div></div>
<table><thead><tr><th>Route</th><th>Status</th><th>Keep/yr</th><th>≈CNY</th><th>Interval</th></tr></thead><tbody>${rows}</tbody></table>
<p style="margin-top:22px"><a class="text-link" href="/tools/phone-number-survival-guide/directory/">← All ${new Set(data.routes.map(r=>r.marketName||'Global')).size} markets</a> · <a class="text-link" href="/tools/phone-number-survival-guide/keep-alive/">Keep-Alive Assistant →</a></p>
</main><footer class="site-footer"><div class="shell footer-grid"><div><strong>Everyday Tools</strong><p>Fast decision tools for real user problems.</p></div><nav aria-label="Footer"><a href="/tools/">All tools</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></div></footer></body></html>`;
}

// market index page
function marketIndexHtml(byMarket){
  const canonical = marketBase;
  const markets = [...byMarket.keys()].sort((a,b)=>a.localeCompare(b));
  const cards = markets.map(m=>{
    const routes = byMarket.get(m);
    const withCost = routes.filter(r=>Number.isFinite(r.keep?.yearCostCny)).sort((a,b)=>a.keep.yearCostCny-b.keep.yearCostCny);
    const cheapest = withCost[0];
    const cheapestTxt = cheapest ? `from ≈¥${cheapest.keep.yearCostCny}/yr` : 'cost pending';
    return `<a class="mkt-card" href="/tools/phone-number-survival-guide/market/${slugify(m)}/"><strong>${esc(m)}</strong><small>${routes.length} route${routes.length===1?'':'s'} · ${esc(cheapestTxt)}</small></a>`;
  }).join('');
  const desc = `SIM number retention by market: ${markets.length} markets, ${data.routes.length} routes. Pick a market for local routes, keep-alive costs and deadline calculators.`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SIM retention by market – ${markets.length} markets – Phone Radar</title>
<meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/site.css">
<script id="theme-init">(()=>{try{const saved=localStorage.getItem('site-theme')||'system';const dark=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=saved==='system'?(dark?'dark':'light'):saved}catch{}})();</script>
<style>.mkt-idx{max-width:1000px;padding-bottom:70px}.mkt-idx h1{font-size:clamp(2rem,5vw,3rem);margin:.2em 0}.mkt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px;margin-top:20px}.mkt-card{display:block;border:1px solid var(--line);border-radius:12px;background:var(--panel);padding:14px;text-decoration:none;color:inherit}.mkt-card:hover{border-color:var(--ink)}.mkt-card small{display:block;color:var(--muted);margin-top:4px;font-size:.8rem}</style></head>
<body><header class="site-header"><div class="shell nav"><a class="brand" href="/">Everyday Tools</a><nav aria-label="Primary"><a href="/tools/phone-number-survival-guide/">Phone Radar</a><a href="/tools/">All tools</a></nav></div></header>
<main class="shell mkt-idx"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/tools/phone-number-survival-guide/">Phone Radar</a><span>›</span><span>Markets</span></nav>
<p class="eyebrow">Phone Radar · Markets</p><h1>SIM retention by market</h1>
<p class="dir-lead" style="color:var(--muted)">${esc(desc)}</p>
<div class="mkt-grid">${cards}</div>
</main><footer class="site-footer"><div class="shell footer-grid"><div><strong>Everyday Tools</strong><p>Fast decision tools for real user problems.</p></div><nav aria-label="Footer"><a href="/tools/">All tools</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></div></footer></body></html>`;
}

const byMarketAll=new Map();
for(const r of data.routes){const m=r.marketName||'Global';if(!byMarketAll.has(m))byMarketAll.set(m,[]);byMarketAll.get(m).push(r);}
const marketRoot=join(guideDir,'market');mkdirSync(marketRoot,{recursive:true});
writeFileSync(join(marketRoot,'index.html'),marketIndexHtml(byMarketAll));
for(const [m,routes] of byMarketAll){
  const out=join(marketRoot,slugify(m));mkdirSync(out,{recursive:true});
  writeFileSync(join(out,'index.html'),marketHtml(m,routes));
}

// add market URLs to sitemap
const sitemapPath2=join(root,'dist','sitemap.xml');let sitemap2=readFileSync(sitemapPath2,'utf8');
const murls=[marketBase,...[...byMarketAll.keys()].map(m=>`${marketBase}${slugify(m)}/`)];
const madds=murls.filter(u=>!sitemap2.includes(u)).map(u=>`  <url>\n    <loc>${u}</loc>\n    <lastmod>${data.checkedAt}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join('\n');
if(madds)sitemap2=sitemap2.replace('</urlset>',`${madds}\n</urlset>`);
writeFileSync(sitemapPath2,sitemap2);
console.log(`Published ${byMarketAll.size} market pages + market index.`);
