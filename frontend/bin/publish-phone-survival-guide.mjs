import { existsSync, rmSync, renameSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distTools = join(root, 'dist', 'tools');
const oldDir = join(distTools, 'phone-number-lifecycle-mvp');
const newDir = join(distTools, 'phone-number-survival-guide');

if (!existsSync(oldDir)) throw new Error('Phone Radar source build output missing');
rmSync(newDir, { recursive: true, force: true });
renameSync(oldDir, newDir);

const page = join(newDir, 'index.html');
let html = readFileSync(page, 'utf8');
const showMoreWithoutAnalytics = "showMore.addEventListener('click',()=>{state.showAll=true;renderRoutes()});";
const showMoreWithAnalytics = "showMore.addEventListener('click',()=>{trackPhone('phone_show_more',{family:state.family,country:state.country});state.showAll=true;renderRoutes()});";
if (!html.includes('phone_show_more')) {
  if (!html.includes(showMoreWithoutAnalytics)) throw new Error('Phone Radar show-more handler missing');
  html = html.replace(showMoreWithoutAnalytics, showMoreWithAnalytics);
  writeFileSync(page, html);
}

const required = [
  '<title>Phone Radar',
  '<meta name="robots" content="index,follow,max-image-preview:large">',
  '<link rel="canonical" href="https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/">',
  'Long-term SMS / OTP',
  'Data SIM / eSIM',
  'Temporary SMS',
  'Full guide',
  'phone_family_select',
  'phone_filter_change',
  'phone_show_more',
  'phone_guide_open',
  'phone_outbound_click'
];
for (const marker of required) {
  if (!html.includes(marker)) throw new Error(`Phone Radar public marker missing: ${marker}`);
}
if (html.includes('Register an app or service') || html.includes('Travel or move abroad')) {
  throw new Error('Legacy Phone questionnaire leaked into public build');
}

const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const routeBase = 'https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/route/';
const money = (value, currency='GBP') => Number.isFinite(value) ? `${currency==='GBP'?'£':currency+' '}${Number(value).toLocaleString('en-GB',{maximumFractionDigits:2})}` : 'Unknown';

function serviceSummary(data, routeId, service){
  const rows=(data.serviceObservations||[]).filter(x=>x.routeId===routeId&&x.service===service);
  if(!rows.length)return 'No normalized community observation yet.';
  const success=rows.filter(x=>x.outcome==='success').length;
  const failure=rows.filter(x=>x.outcome!=='success').length;
  const latest=[...rows].sort((a,b)=>String(b.reportedAt).localeCompare(String(a.reportedAt)))[0];
  return `${rows.length} report${rows.length===1?'':'s'} · ${success} success · ${failure} non-success · latest ${latest.reportedAt}`;
}

function routeHtml(data,r){
  const brand=data.brands.find(x=>x.id===r.brandId);
  const network=data.networks.find(x=>x.id===brand?.networkId);
  const events=(data.continuityEvents||[]).filter(x=>x.routeId===r.id);
  const sources=(r.sourceIds||[]).map(id=>data.sources.find(x=>x.id===id)).filter(Boolean);
  const canonical=`${routeBase}${r.id}/`;
  const status=r.publishState==='observation-hold'?'Observation / hold':'Evidence-qualified pilot route';
  const appRows=['OpenAI/Codex','Telegram','WhatsApp'].map(service=>`<li><strong>${esc(service)}:</strong> ${esc(serviceSummary(data,r.id,service))}</li>`).join('');
  const eventRows=events.length?`<ul>${events.map(e=>`<li><strong>${esc(e.reportedAt)}</strong> — ${esc(e.outcome)}</li>`).join('')}</ul>`:`<p>${esc(r.holdReason||'No normalized continuity incident is recorded in the current pilot packet.')}</p>`;
  const sourceRows=sources.map(x=>`<li><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.reportedAt)} · ${esc(x.type)}</a></li>`).join('');
  const desc=`${brand?.name||r.id} UK route: current acquisition, keep-alive cost, overseas setup, app verification evidence, continuity incidents and sources. Verified ${r.lastVerifiedAt}.`;
  const schema=JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:`${brand?.name||r.id} UK route guide`,description:desc,url:canonical,dateModified:r.lastVerifiedAt,isPartOf:{'@type':'WebSite',name:'Phone Radar',url:'https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/'}}).replace(/</g,'\u003c');
  const crumbs=JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://aineedhelpfromotherai.com/'},{'@type':'ListItem',position:2,name:'Phone Radar',item:'https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/'},{'@type':'ListItem',position:3,name:brand?.name||r.id,item:canonical}]}).replace(/</g,'\u003c');
  const keepCost=money(r.keep?.yearCostOriginal,r.keep?.currency||'GBP');
  const startCost=money(r.landedCost?.landedOriginal,r.landedCost?.currency||'GBP');
  const hold=r.publishState==='observation-hold';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(brand?.name||r.id)} UK route guide – Phone Radar</title>
<meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(brand?.name||r.id)} UK route guide"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/site.css">
<script type="application/ld+json">${schema}</script><script type="application/ld+json">${crumbs}</script>
<script id="theme-init">(()=>{try{const saved=localStorage.getItem('site-theme')||'system';const dark=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=saved==='system'?(dark?'dark':'light'):saved}catch{}})();</script>
<style>.route-detail{max-width:900px;padding-bottom:70px}.route-detail h1{font-size:clamp(2rem,5vw,3.4rem);margin:.2em 0}.route-lead{font-size:1.05rem;color:var(--muted);max-width:760px}.route-meta{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 24px}.route-pill{border:1px solid var(--line);border-radius:999px;padding:5px 9px;background:var(--panel);font-size:.76rem;font-weight:800}.route-hold{padding:14px 16px;border:1px solid #d9a441;border-radius:14px;background:#fff8e8;margin:18px 0}.route-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0 28px}.route-summary div,.route-section{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:16px}.route-summary small{display:block;color:var(--muted);text-transform:uppercase;font-size:.68rem;font-weight:850;letter-spacing:.05em}.route-summary strong{display:block;margin-top:5px;font-size:1rem}.route-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.route-section.wide{grid-column:1/-1}.route-section h2{font-size:1rem;margin:0 0 9px}.route-section p,.route-section li{font-size:.91rem}.route-actions{display:flex;gap:9px;flex-wrap:wrap;margin:24px 0}.route-actions a{display:inline-flex;min-height:40px;align-items:center;padding:0 13px;border:1px solid var(--line);border-radius:10px;font-weight:800}.route-actions .primary{background:var(--ink);color:var(--bg);border-color:var(--ink)}.route-sources{margin-top:26px}.route-sources a{overflow-wrap:anywhere}@media(max-width:700px){.route-summary,.route-grid{grid-template-columns:1fr}.route-section.wide{grid-column:auto}}</style></head>
<body><header class="site-header"><div class="shell nav"><a class="brand" href="/">Everyday Tools</a><nav aria-label="Primary"><a href="/tools/phone-number-survival-guide/">Phone Radar</a><a href="/tools/">All tools</a></nav></div></header>
<main class="shell route-detail"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/tools/phone-number-survival-guide/">Phone Radar</a><span>›</span><span>${esc(brand?.name||r.id)}</span></nav>
<p class="eyebrow">Phone Radar · United Kingdom</p><h1>${esc(brand?.name||r.id)} — UK route guide</h1><p class="route-lead">${esc(network?.name||'')} · ${esc(r.simType)} · ${esc(r.numberType)}. ${esc(r.acquisitionSummary||'')}</p>
<div class="route-meta"><span class="route-pill">${esc(status)}</span><span class="route-pill">Last verified ${esc(r.lastVerifiedAt)}</span><span class="route-pill">${sources.length} sources</span><span class="route-pill">Trend: ${esc(r.trend)}</span></div>
${hold?`<div class="route-hold"><strong>Why this route is on hold:</strong> ${esc(r.holdReason||'Current durable retention is not established.')}</div>`:''}
<div class="route-summary"><div><small>Start cost</small><strong>${esc(startCost)}</strong></div><div><small>Keep / year</small><strong>${esc(keepCost)}</strong></div><div><small>Keep interval</small><strong>${Number.isFinite(r.keep?.intervalDays)?`${r.keep.intervalDays} days`:'Not established'}</strong></div></div>
<div class="route-grid">
<section class="route-section"><h2>1. What it costs</h2><p>${esc(startCost)} landed baseline when established. ${esc(r.tariffSummary||'Current tariff needs a live refresh before purchase.')}</p></section>
<section class="route-section"><h2>2. Requirements</h2><p>${esc(r.kyc||'Unknown')} ${esc(r.payment||'')}</p></section>
<section class="route-section wide"><h2>3. Step by step</h2><ol>${(r.guideSteps||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>
<section class="route-section wide"><h2>4. Activate / use abroad</h2><p>${esc(r.chinaActivation||'Unknown')}</p></section>
<section class="route-section"><h2>5. Keep it alive</h2><p>${esc(keepCost)} / year when established. ${esc(r.keep?.action||'Unknown')}</p></section>
<section class="route-section"><h2>6. Wi-Fi Calling / SMS</h2><p>${esc(r.wifiCalling||'Unknown')} SMS: ${esc(r.roamingSms||'Unknown')}</p></section>
<section class="route-section"><h2>7. App evidence</h2><ul>${appRows}</ul></section>
<section class="route-section"><h2>8. Refund / recovery</h2><p>${esc(r.refund||'No normalized evidence')}</p></section>
<section class="route-section wide"><h2>9. Continuity history</h2>${eventRows}</section>
</div>
<div class="route-actions"><a href="/tools/phone-number-survival-guide/">← Compare all UK routes</a>${!hold&&r.guideEligible!==false&&r.acquireUrl?`<a class="primary" href="${esc(r.acquireUrl)}" target="_blank" rel="noopener noreferrer">Acquire / open ↗</a>`:''}</div>
<section class="route-sources"><h2>Evidence sources</h2><p>Provider-controlled facts and independent operational reports are kept distinct in the normalized packet. Missing app observations remain missing rather than becoming a percentage.</p><ul>${sourceRows}</ul></section>
</main><footer class="site-footer"><div class="shell footer-grid"><div><strong>Everyday Tools</strong><p>Fast decision tools for real user problems.</p></div><nav aria-label="Footer"><a href="/tools/">All tools</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></div></footer></body></html>`;
}

function publishStaticRoutePages(){
  const dataPath=join(newDir,'uk-directory-pilot.json');
  if(!existsSync(dataPath))throw new Error('Phone Radar UK directory packet missing from public build');
  const data=JSON.parse(readFileSync(dataPath,'utf8'));
  const routeRoot=join(newDir,'route');mkdirSync(routeRoot,{recursive:true});
  for(const r of data.routes||[]){const out=join(routeRoot,r.id);mkdirSync(out,{recursive:true});writeFileSync(join(out,'index.html'),routeHtml(data,r));}
  const hubPath=join(newDir,'index.html');let hub=readFileSync(hubPath,'utf8');
  const routeLinks=(data.routes||[]).map(r=>{const brand=data.brands.find(x=>x.id===r.brandId);return `<a href="/tools/phone-number-survival-guide/route/${esc(r.id)}/">${esc(brand?.name||r.id)} route guide</a>`}).join('');
  const staticNav=`<nav class="pr-related pr-static-guides" aria-label="UK route guides">${routeLinks}</nav>`;
  if(!hub.includes('class="pr-related pr-static-guides"'))hub=hub.replace('<nav class="pr-related" aria-label="Related tools">',`${staticNav}<nav class="pr-related" aria-label="Related tools">`);
  writeFileSync(hubPath,hub);
  const sitemapPath=join(root,'dist','sitemap.xml');let sitemap=readFileSync(sitemapPath,'utf8');
  const additions=(data.routes||[]).filter(r=>!sitemap.includes(`${routeBase}${r.id}/`)).map(r=>`  <url>\n    <loc>${routeBase}${r.id}/</loc>\n    <lastmod>${r.lastVerifiedAt||data.checkedAt}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n');
  if(additions)sitemap=sitemap.replace('</urlset>',`${additions}\n</urlset>`);
  writeFileSync(sitemapPath,sitemap);
  console.log(`Published ${(data.routes||[]).length} static Phone Radar route pages.`);
}

publishStaticRoutePages();

console.log('Published Phone Radar at canonical public URL.');
