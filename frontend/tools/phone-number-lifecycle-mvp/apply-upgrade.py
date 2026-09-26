#!/usr/bin/env python3
"""Apply visual-UX upgrade to phone-number-lifecycle-mvp/index.html.
All anchors are exact strings copied from the live file. Each must match exactly once."""
import sys

path = 'index.html'
html = open(path, encoding='utf-8').read()

def rep(old, new, label):
    global html
    n = html.count(old)
    if n != 1:
        print(f'FAIL [{label}]: anchor found {n} times (need exactly 1)')
        print('anchor head:', repr(old[:90]))
        sys.exit(1)
    html = html.replace(old, new)
    print(f'OK   [{label}]')

# ──────────────────────────── 1. CSS block ────────────────────────────
CSS = r'''
    /* ── Visual components: cost bar / keep timeline / app chips / freshness ── */
    .pr-costbar{margin-top:7px;height:8px;border-radius:5px;overflow:hidden;background:var(--soft);display:flex;border:1px solid var(--line)}
    .pr-costbar i{height:100%;display:block}
    .pr-costbar .seg-purchase{background:var(--accent)}.pr-costbar .seg-topup{background:var(--accent2)}.pr-costbar .seg-ship{background:#d97706}
    .pr-costbar-legend{display:flex;gap:8px;flex-wrap:wrap;margin-top:5px;font-size:.66rem;color:var(--muted)}
    .pr-costbar-legend i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:3px;vertical-align:-1px}
    .pr-costbar-legend .lg-purchase{background:var(--accent)}.pr-costbar-legend .lg-topup{background:var(--accent2)}.pr-costbar-legend .lg-ship{background:#d97706}
    .pr-keepline{margin-top:8px;max-width:180px}
    .pr-keepline-track{position:relative;height:6px;background:var(--soft);border-radius:4px;border:1px solid var(--line)}
    .pr-keepline-remind{position:absolute;right:0;top:-1px;bottom:-1px;width:22%;background:rgba(14,165,164,.28);border-radius:0 4px 4px 0;border-left:1px dashed var(--accent2)}
    .pr-keepline-dot{position:absolute;left:-1px;top:-3px;width:10px;height:10px;border-radius:50%;background:var(--accent);border:2px solid var(--panel)}
    .pr-keepline-labels{display:flex;justify-content:space-between;font-size:.64rem;color:var(--muted);margin-top:4px;white-space:nowrap}
    .pr-appchips{display:flex;flex-wrap:wrap;gap:4px}
    .pr-appchip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:999px;font-size:.68rem;font-weight:800;border:1px solid var(--line);background:var(--soft);color:var(--muted);white-space:nowrap}
    .pr-appchip.tone-success{background:rgba(15,157,110,.14);color:#0c8a5e;border-color:rgba(15,157,110,.35)}
    .pr-appchip.tone-mixed{background:rgba(184,92,0,.12);color:#b45c00;border-color:rgba(184,92,0,.3)}
    .pr-appchip.tone-blocked{background:rgba(193,57,43,.12);color:var(--danger);border-color:rgba(193,57,43,.3)}
    .pr-fresh{display:inline-flex;align-items:center;gap:5px;font-size:.7rem;font-weight:800;padding:3px 9px;border-radius:999px;border:1px solid var(--line);white-space:nowrap}
    .pr-fresh.fresh-new{background:rgba(15,157,110,.13);color:#0c8a5e;border-color:rgba(15,157,110,.35)}
    .pr-fresh.fresh-mid{background:var(--soft);color:var(--muted)}
    .pr-fresh.fresh-old{background:rgba(184,92,0,.12);color:#b45c00;border-color:rgba(184,92,0,.3)}
    .pr-fresh-src{display:block;margin-top:4px;font-size:.66rem;color:var(--muted)}
    /* ── Pin to compare ── */
    .pr-pin{margin:5px 0 0;padding:3px 10px;border-radius:999px;border:1px solid var(--line);background:var(--panel);color:var(--muted);font-size:.68rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:4px}
    .pr-pin:hover{border-color:var(--accent);color:var(--accent)}
    .pr-pin.on{background:rgba(37,99,235,.14);color:var(--accent);border-color:rgba(37,99,235,.5)}
    .pr-compare-tray{position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:60;display:none;align-items:center;gap:10px;background:var(--panel);border:1px solid var(--line);border-radius:999px;padding:8px 10px 8px 16px;box-shadow:0 12px 34px rgba(15,23,42,.22);max-width:calc(100vw - 20px)}
    .pr-compare-tray.show{display:flex}
    .pr-tray-chips{display:flex;gap:6px;overflow:auto}
    .pr-tray-chip{display:inline-flex;align-items:center;gap:5px;background:var(--soft);border:1px solid var(--line);border-radius:999px;padding:3px 7px 3px 10px;font-size:.7rem;font-weight:700;white-space:nowrap;color:var(--ink)}
    .pr-tray-chip button{border:none;background:none;color:var(--muted);cursor:pointer;font-size:.82rem;padding:0 2px;line-height:1}
    .pr-compare-open{margin:0;border-radius:999px;padding:7px 16px;font-size:.78rem;white-space:nowrap;border:1px solid var(--ink);background:var(--ink);color:var(--bg);font-weight:800;cursor:pointer}
    .pr-compare-open:disabled{opacity:.45;cursor:not-allowed}
    .pr-compare-clear{border:none;background:none;color:var(--muted);font-size:.72rem;cursor:pointer;text-decoration:underline;white-space:nowrap}
    .pr-compare-overlay{position:fixed;inset:0;z-index:70;background:rgba(15,23,42,.5);display:none;align-items:flex-start;justify-content:center;padding:4vh 12px;overflow:auto}
    .pr-compare-overlay.show{display:flex}
    .pr-compare-panel{background:var(--panel);border:1px solid var(--line);border-radius:18px;max-width:1120px;width:100%;padding:22px 22px 26px;box-shadow:var(--shadow)}
    .pr-compare-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
    .pr-compare-head h3{margin:0 0 2px;font-size:1.08rem}
    .pr-compare-head p{margin:0;font-size:.75rem;color:var(--muted)}
    .pr-compare-grid{display:grid;gap:0;border:1px solid var(--line);border-radius:12px;overflow:hidden;margin-top:14px;overflow-x:auto}
    .pr-cg-row{display:contents}
    .pr-cg-cell{padding:9px 12px;border-top:1px solid var(--line);font-size:.78rem;line-height:1.45;min-width:150px}
    .pr-cg-cell.cg-head{background:var(--soft);font-weight:800;border-top:none}
    .pr-cg-cell.cg-label{background:var(--soft);font-weight:800;color:var(--muted);font-size:.68rem;text-transform:uppercase;letter-spacing:.4px;min-width:118px}
    .pr-cg-cell.cg-group{background:rgba(14,165,164,.1);color:var(--accent2);font-weight:900;font-size:.68rem;letter-spacing:.6px;text-transform:uppercase;padding:7px 12px}
    /* ── Directory compact / details mode + sort ── */
    .pr-matrix.pr-compact{min-width:0}
    .pr-matrix.pr-compact th.pr-col-detail,.pr-matrix.pr-compact td.pr-col-detail{display:none}
    .pr-details-toggle{height:34px;border-radius:999px;border:1px solid var(--line);background:var(--panel);padding:0 13px;font-size:.74rem;font-weight:700;color:var(--ink);cursor:pointer;white-space:nowrap}
    .pr-details-toggle.on{background:rgba(37,99,235,.12);color:var(--accent);border-color:rgba(37,99,235,.4)}
    .pr-sort{height:34px;border-radius:999px;border:1px solid var(--line);background:var(--panel);padding:0 12px;font-size:.74rem;font-weight:700;color:var(--ink)}
    .pr-sort,.pr-details-toggle{display:none}
    body.is-directory .pr-sort,body.is-directory .pr-details-toggle{display:inline-flex}
'''
rep("    @media(max-width:900px){.pr-card-main{grid-template-columns:1fr}",
    CSS + "    @media(max-width:900px){.pr-card-main{grid-template-columns:1fr}",
    'css-components')

# ──────────────────────────── 2. pr-tools toolbar ────────────────────────────
rep('''  <div class="pr-tools">
    <div class="pr-filter"><label for="country-filter">Country / region</label><select id="country-filter"><option value="all">All countries</option></select></div>
    <span class="pr-count" id="route-count" aria-live="polite"></span>
  </div>''',
'''  <div class="pr-tools">
    <div class="pr-filter"><label for="country-filter">Country / region</label><select id="country-filter"><option value="all">All countries</option></select></div>
    <select class="pr-sort" id="dir-sort" aria-label="Sort routes">
      <option value="recommended">Sort: Recommended</option>
      <option value="start-cost">Lowest start cost</option>
      <option value="keep-cost">Lowest keep-alive / year</option>
      <option value="fresh">Recently checked</option>
    </select>
    <button type="button" class="pr-details-toggle" id="details-toggle" aria-pressed="false">All details</button>
    <span class="pr-count" id="route-count" aria-live="polite"></span>
  </div>''',
    'toolbar-html')

# ──────────────────────────── 3. state ────────────────────────────
rep("const state={family:'long-term',showAll:false,country:'all'}",
    "const state={family:'long-term',showAll:false,country:'all',dirSort:'recommended',details:false,pins:new Set()}",
    'state')

# ──────────────────────────── 4. new helper functions (insert before dirRow) ────────────────────────────
NEWFUNCS = r'''function dirDaysSince(s){const t=new Date(s).getTime();if(!t||isNaN(t))return null;return Math.floor((Date.now()-t)/86400000)}
function fmtDay(s){if(!s)return'—';const d=new Date(s);if(isNaN(d))return s;return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function dirFreshBadge(r){const at=r.lastVerifiedAt||ukDirectory.checkedAt;const days=dirDaysSince(at);const cls=days==null?'fresh-mid':days<=21?'fresh-new':days<=60?'fresh-mid':'fresh-old';const label=days==null?`Checked ${fmtDay(at)}`:days<=1?'Checked today':`Checked ${days}d ago`;return `<span class="pr-fresh ${cls}" title="Last verified ${esc(fmtDay(at))}">${label}</span><span class="pr-fresh-src">${(r.sourceIds||[]).length} sources</span>`}
function dirAppChips(r){return `<span class="pr-appchips">${[['OpenAI/Codex','ChatGPT'],['Telegram','TG'],['WhatsApp','WA']].map(([svc,short])=>{const x=dirService(r.id,svc);return `<span class="pr-appchip tone-${esc(x.tone)}" title="${esc(svc)}: ${esc(x.label)}">${short}${x.n?` ${x.n}`:''}</span>`}).join('')}</span>`}
function dirCostBar(r){const x=r.landedCost||{};if(!Number.isFinite(x.landedOriginal)||x.landedOriginal<=0)return'';const parts=[['purchase',x.providerOrCommunityPrice,'SIM'],['topup',x.mandatoryTopup,'Top-up'],['ship',x.shipping,'Shipping']].filter(p=>Number.isFinite(p[1])&&p[1]>0);const sum=parts.reduce((a,p)=>a+p[1],0);if(parts.length<2||Math.abs(sum-x.landedOriginal)>0.011)return'';return `<div class="pr-costbar" role="img" aria-label="Landed cost breakdown: ${parts.map(p=>`${p[2]} ${p[1]}`).join(', ')}">${parts.map(p=>`<i class="seg-${p[0]}" style="width:${Math.max(6,Math.round(p[1]/sum*100))}%"></i>`).join('')}</div><div class="pr-costbar-legend">${parts.map(p=>`<span><i class="lg-${p[0]}"></i>${p[2]} ${gbp(p[1])}</span>`).join('')}</div>`}
function dirKeepTimeline(r){const k=r.keep||{};if(!Number.isFinite(k.intervalDays)||k.intervalDays<=0)return'';const n=k.intervalDays;return `<div class="pr-keepline" role="img" aria-label="Keep-alive: one balance-changing activity needed every ${n} days"><div class="pr-keepline-track"><i class="pr-keepline-dot"></i><i class="pr-keepline-remind"></i></div><div class="pr-keepline-labels"><span>Last activity</span><span>act by day ${n}</span></div></div>`}
function pinBtn(id){const on=state.pins.has(id);return `<button type="button" class="pr-pin${on?' on':''}" data-pin="${esc(id)}" aria-pressed="${on}">${on?'✓ Pinned':'📌 Compare'}</button>`}
function togglePin(id){if(state.pins.has(id))state.pins.delete(id);else{if(state.pins.size>=4)return;state.pins.add(id)}trackPhone('phone_pin_toggle',{route:id,pinned:state.pins.has(id)});renderDirectory();renderCompareTray()}
function dirSortVal(v){return Number.isFinite(v)?v:Number.POSITIVE_INFINITY}
function sortedDirRoutes(routes){const arr=[...routes];if(state.dirSort==='start-cost')arr.sort((a,b)=>dirSortVal(a.landedCost?.landedOriginal)-dirSortVal(b.landedCost?.landedOriginal));else if(state.dirSort==='keep-cost')arr.sort((a,b)=>dirSortVal(a.keep?.yearCostOriginal)-dirSortVal(b.keep?.yearCostOriginal));else if(state.dirSort==='fresh')arr.sort((a,b)=>String(b.lastVerifiedAt||'').localeCompare(String(a.lastVerifiedAt||'')));return arr}
function renderCompareTray(){const tray=document.getElementById('pr-compare-tray');if(!tray)return;const ids=[...state.pins].filter(id=>dirRoute(id));if(!ids.length){tray.classList.remove('show');tray.innerHTML='';return}tray.innerHTML=`<div class="pr-tray-chips">${ids.map(id=>{const r=dirRoute(id),b=dirBrand(r.brandId);return `<span class="pr-tray-chip">${esc(b?.name||id)}<button type="button" data-unpin="${esc(id)}" aria-label="Remove ${esc(b?.name||id)}">×</button></span>`}).join('')}</div><button type="button" class="pr-compare-open" id="compare-open" ${ids.length<2?'disabled':''}>Compare ${ids.length}</button><button type="button" class="pr-compare-clear" id="compare-clear">Clear</button>`;tray.classList.add('show')}
function closeCompare(){const ov=document.getElementById('pr-compare-overlay');if(!ov)return;ov.classList.remove('show');document.body.style.overflow=''}
function openCompare(){const ids=[...state.pins].filter(id=>dirRoute(id)).slice(0,4);if(ids.length<2)return;trackPhone('phone_compare_open',{routes:ids.join(',')});const ov=document.getElementById('pr-compare-overlay');ov.innerHTML=renderComparePanel(ids);ov.classList.add('show');document.body.style.overflow='hidden'}
function renderComparePanel(ids){
  const rs=ids.map(dirRoute);
  const cols=`grid-template-columns:128px repeat(${rs.length},minmax(150px,1fr))`;
  const head=r=>{const b=dirBrand(r.brandId);return `<div class="pr-cg-cell cg-head">${esc(b?.name||r.id)}<span class="pr-cost-sub">${esc(r.simType)} · ${esc(dirNetwork(b?.networkId)?.name||'')}</span></div>`};
  const row=(label,fn)=>`<div class="pr-cg-row"><div class="pr-cg-cell cg-label">${label}</div>${rs.map(r=>`<div class="pr-cg-cell">${fn(r)}</div>`).join('')}</div>`;
  const grp=t=>`<div class="pr-cg-row"><div class="pr-cg-cell cg-group" style="grid-column:1/-1">${t}</div></div>`;
  const cost=r=>{const c=dirStartCost(r);return `<strong>${esc(c[0])}</strong> <span class="pr-cost-sub">${esc(c[1])}</span>${dirCostBar(r)}`};
  const keep=r=>`${esc(dirKeepCost(r))}${dirKeepTimeline(r)}`;
  const keepAct=r=>{const k=r.keep||{};return `${esc(k.action||'Unknown')}${Number.isFinite(k.intervalDays)?` <span class="pr-cost-sub">every ${k.intervalDays} days</span>`:''}`};
  const app=(r,s)=>{const x=dirService(r.id,s);return `<span class="pr-app-state" data-tone="${esc(x.tone)}">${esc(x.label)}</span>`};
  const loss=r=>`<span class="pr-trend" data-tone="${esc(r.trend)}">${esc(r.trend)}</span> <span class="pr-cost-sub">${esc(dirIncidents(r))}</span>`;
  const status=r=>{const hold=r.publishState==='observation-hold';return `<span class="pr-dir-status" data-state="${hold?'hold':'candidate'}">${hold?'Observation / hold':'Pilot candidate'}</span>`};
  const act=r=>`<div class="pr-dir-actions"><button type="button" data-directory-guide="${esc(r.id)}">Guide</button>${r.guideEligible!==false&&r.acquireUrl?`<a href="${esc(r.acquireUrl)}" target="_blank" rel="noopener noreferrer" data-outbound data-route="${esc(r.id)}">Acquire ↗</a>`:''}</div>`;
  return `<div class="pr-compare-panel"><div class="pr-compare-head"><div><h3>Compare ${rs.length} routes side by side</h3><p>Missing data stays missing — blanks mean not verified yet.</p></div><button type="button" class="pr-close" data-compare-close>Close ✕</button></div><div class="pr-compare-grid" style="${cols}"><div class="pr-cg-row"><div class="pr-cg-cell cg-head"></div>${rs.map(head).join('')}</div>${grp('Cost')}${row('Start landed',cost)}${row('Keep / year',keep)}${row('Keep action',keepAct)}${grp('Setup')}${row('KYC',r=>esc(r.kyc||'Unknown'))}${row('China / overseas',r=>esc(r.chinaActivation||'Unknown'))}${row('Payment',r=>esc(r.payment||'—'))}${row('Plan / data',r=>esc(r.tariffSummary||'—'))}${row('Wi-Fi / roaming SMS',r=>`${esc(r.wifiCalling||'Unknown')} <span class="pr-cost-sub">SMS: ${esc(r.roamingSms||'Unknown')}</span>`)}${grp('App evidence')}${row('ChatGPT / Codex',r=>app(r,'OpenAI/Codex'))}${row('Telegram',r=>app(r,'Telegram'))}${row('WhatsApp',r=>app(r,'WhatsApp'))}${grp('Continuity &amp; evidence')}${row('Loss / closure history',loss)}${row('Refund / recovery',r=>esc(r.refund||'No evidence'))}${row('Checked',r=>dirFreshBadge(r))}${row('Status',status)}${grp('Actions')}${row('Next step',act)}</div></div>`;
}
'''
rep('function dirRow(r){', NEWFUNCS + 'function dirRow(r){', 'new-functions')

# ──────────────────────────── 5. dirRow ────────────────────────────
OLD_ROW = """function dirRow(r){const b=dirBrand(r.brandId),cost=dirStartCost(r),hold=r.publishState==='observation-hold';return `<tr><td><span class="pr-route-name">${esc(b?.name||r.id)}</span><span class="pr-route-sub">${esc(r.simType)} · ${esc(r.numberType)}</span><span class="pr-dir-status" data-state="${hold?'hold':'candidate'}">${hold?'Observation / hold':'Pilot candidate'}</span></td><td><span class="pr-cost-main">${esc(cost[0])}</span><span class="pr-cost-sub">${esc(cost[1])}</span></td><td>${esc(dirKeepCost(r))}</td><td>${esc(r.keep?.action||'Unknown')} ${r.keep?.intervalDays?`<span class="pr-cost-sub">within ${esc(r.keep.intervalDays)} days</span>`:''}</td><td>${esc(r.tariffSummary||'—')}</td><td>${esc(r.chinaActivation||'Unknown')}</td><td>${esc(r.kyc||'Unknown')}<span class="pr-cost-sub">${esc(r.payment||'')}</span></td><td>${esc(r.wifiCalling||'Unknown')}<span class="pr-cost-sub">SMS: ${esc(r.roamingSms||'Unknown')}</span></td><td class="pr-app-cell">${dirAppCell(r,'OpenAI/Codex')}</td><td class="pr-app-cell">${dirAppCell(r,'Telegram')}</td><td class="pr-app-cell">${dirAppCell(r,'WhatsApp')}</td><td>${esc(dirIncidents(r))}</td><td>${esc(r.refund||'No evidence')}</td><td><span class="pr-trend" data-tone="${esc(r.trend)}">${esc(r.trend)}</span></td><td>${esc(dirEvidence(r))}</td><td><div class="pr-dir-actions"><button type="button" data-directory-guide="${esc(r.id)}">Guide</button>${r.guideEligible!==false&&r.acquireUrl?`<a href="${esc(r.acquireUrl)}" target="_blank" rel="noopener noreferrer" data-outbound data-route="${esc(r.id)}">Acquire ↗</a>`:''}</div></td></tr>`}"""
NEW_ROW = """function dirRow(r){const b=dirBrand(r.brandId),cost=dirStartCost(r),hold=r.publishState==='observation-hold';return `<tr><td><span class="pr-route-name">${esc(b?.name||r.id)}</span><span class="pr-route-sub">${esc(r.simType)} · ${esc(r.numberType)}</span><span class="pr-dir-status" data-state="${hold?'hold':'candidate'}">${hold?'Observation / hold':'Pilot candidate'}</span>${pinBtn(r.id)}</td><td><span class="pr-cost-main">${esc(cost[0])}</span><span class="pr-cost-sub">${esc(cost[1])}</span>${dirCostBar(r)}</td><td>${esc(dirKeepCost(r))}${dirKeepTimeline(r)}</td><td class="pr-col-detail">${esc(r.keep?.action||'Unknown')} ${r.keep?.intervalDays?`<span class="pr-cost-sub">within ${esc(r.keep.intervalDays)} days</span>`:''}</td><td class="pr-col-detail">${esc(r.tariffSummary||'—')}</td><td class="pr-col-detail">${esc(r.chinaActivation||'Unknown')}</td><td class="pr-col-detail">${esc(r.kyc||'Unknown')}<span class="pr-cost-sub">${esc(r.payment||'')}</span></td><td class="pr-col-detail">${esc(r.wifiCalling||'Unknown')}<span class="pr-cost-sub">SMS: ${esc(r.roamingSms||'Unknown')}</span></td><td class="pr-app-cell">${dirAppChips(r)}</td><td class="pr-app-cell pr-col-detail">${dirAppCell(r,'OpenAI/Codex')}</td><td class="pr-app-cell pr-col-detail">${dirAppCell(r,'Telegram')}</td><td class="pr-app-cell pr-col-detail">${dirAppCell(r,'WhatsApp')}</td><td><span class="pr-trend" data-tone="${esc(r.trend)}">${esc(r.trend)}</span> <span class="pr-cost-sub">${esc(dirIncidents(r))}</span></td><td class="pr-col-detail">${esc(r.refund||'No evidence')}</td><td class="pr-col-detail"><span class="pr-trend" data-tone="${esc(r.trend)}">${esc(r.trend)}</span></td><td>${dirFreshBadge(r)}</td><td><div class="pr-dir-actions"><button type="button" data-directory-guide="${esc(r.id)}">Guide</button>${r.guideEligible!==false&&r.acquireUrl?`<a href="${esc(r.acquireUrl)}" target="_blank" rel="noopener noreferrer" data-outbound data-route="${esc(r.id)}">Acquire ↗</a>`:''}</div></td></tr>`}"""
rep(OLD_ROW, NEW_ROW, 'dirRow')

# ──────────────────────────── 6. dirMobileCard ────────────────────────────
OLD_CARD = """function dirMobileCard(r){const b=dirBrand(r.brandId),cost=dirStartCost(r),network=dirNetwork(b?.networkId);return `<article class="pr-dir-card"><div class="pr-dir-card-head"><div><h3>${esc(b?.name||r.id)}</h3><span class="pr-route-sub">${esc(network?.name||'')} · ${esc(r.simType)}</span></div><span class="pr-trend" data-tone="${esc(r.trend)}">${esc(r.trend)}</span></div><div class="pr-dir-mobile-grid"><div class="pr-dir-mobile-metric"><small>Start</small><strong>${esc(cost[0])}</strong><span class="pr-cost-sub">${esc(cost[1])}</span></div><div class="pr-dir-mobile-metric"><small>Keep / year</small><strong>${esc(dirKeepCost(r))}</strong></div><div class="pr-dir-mobile-metric"><small>China / abroad</small><strong>${esc(r.chinaActivation||'Unknown')}</strong></div><div class="pr-dir-mobile-metric"><small>Continuity</small><strong>${esc(dirIncidents(r))}</strong></div></div><div class="pr-dir-apps"><span class="pr-dir-chip">ChatGPT: ${esc(dirService(r.id,'OpenAI/Codex').label)}</span><span class="pr-dir-chip">Telegram: ${esc(dirService(r.id,'Telegram').label)}</span><span class="pr-dir-chip">WhatsApp: ${esc(dirService(r.id,'WhatsApp').label)}</span></div><div class="pr-evidence">${esc(dirEvidence(r))}</div><div class="pr-dir-actions"><button type="button" data-directory-guide="${esc(r.id)}">Guide</button>${r.guideEligible!==false&&r.acquireUrl?`<a href="${esc(r.acquireUrl)}" target="_blank" rel="noopener noreferrer" data-outbound data-route="${esc(r.id)}">Acquire ↗</a>`:''}</div></article>`}"""
NEW_CARD = """function dirMobileCard(r){const b=dirBrand(r.brandId),cost=dirStartCost(r),network=dirNetwork(b?.networkId);return `<article class="pr-dir-card"><div class="pr-dir-card-head"><div><h3>${esc(b?.name||r.id)}</h3><span class="pr-route-sub">${esc(network?.name||'')} · ${esc(r.simType)}</span>${dirFreshBadge(r)}</div><span class="pr-trend" data-tone="${esc(r.trend)}">${esc(r.trend)}</span></div><div class="pr-dir-mobile-grid"><div class="pr-dir-mobile-metric"><small>Start</small><strong>${esc(cost[0])}</strong><span class="pr-cost-sub">${esc(cost[1])}</span>${dirCostBar(r)}</div><div class="pr-dir-mobile-metric"><small>Keep / year</small><strong>${esc(dirKeepCost(r))}</strong>${dirKeepTimeline(r)}</div><div class="pr-dir-mobile-metric"><small>China / abroad</small><strong>${esc(r.chinaActivation||'Unknown')}</strong></div><div class="pr-dir-mobile-metric"><small>Continuity</small><strong>${esc(dirIncidents(r))}</strong></div></div><div class="pr-dir-apps">${dirAppChips(r)}</div><div class="pr-dir-actions">${pinBtn(r.id)}<button type="button" data-directory-guide="${esc(r.id)}">Guide</button>${r.guideEligible!==false&&r.acquireUrl?`<a href="${esc(r.acquireUrl)}" target="_blank" rel="noopener noreferrer" data-outbound data-route="${esc(r.id)}">Acquire ↗</a>`:''}</div></article>`}"""
rep(OLD_CARD, NEW_CARD, 'dirMobileCard')

# ──────────────────────────── 7. renderDirectory ────────────────────────────
OLD_RD = """function renderDirectory(){
  showMore.hidden=true;const routes=ukDirectory.routes.filter(r=>state.country==='all'||state.country===ukDirectory.market.name);routeCount.textContent=`${routes.length} UK pilot routes`;if(!routes.length){routeList.innerHTML='<div class="pr-empty">No pilot route in this filter.</div>';return}
  const groups=ukDirectory.networks.map(n=>({network:n,routes:routes.filter(r=>dirBrand(r.brandId)?.networkId===n.id)})).filter(g=>g.routes.length);
  const fx=ukDirectory.fxSnapshot;const header='<thead><tr><th>Brand / route</th><th>Start cost</th><th>Keep / year</th><th>Keep action</th><th>Plan / data</th><th>China / overseas</th><th>KYC / payment</th><th>Wi-Fi / roaming SMS</th><th>ChatGPT / Codex</th><th>Telegram</th><th>WhatsApp</th><th>Loss / closure history</th><th>Refund / recovery</th><th>Trend</th><th>Evidence</th><th>Actions</th></tr></thead>';
  routeList.innerHTML=`<div class="pr-directory-note"><div><strong>UK long-term-number pilot.</strong> Forum outcomes are structured here so cost, keep-alive, app evidence and number-loss history can be compared without reading every thread. Missing data stays missing.</div><div class="pr-directory-fx">FX snapshot: £1 ≈ ¥${esc(fx?.rate||'—')} · ${esc(fx?.checkedAt||'')}</div></div>${groups.map(g=>`<section class="pr-network-group"><div class="pr-network-head"><h2>${esc(g.network.name)}</h2><span>${g.routes.length} route${g.routes.length===1?'':'s'}</span></div><div class="pr-matrix-wrap"><table class="pr-matrix">${header}<tbody>${g.routes.map(dirRow).join('')}</tbody></table></div><div class="pr-dir-mobile">${g.routes.map(dirMobileCard).join('')}</div></section>`).join('')}<section class="pr-guide pr-directory-guide" id="directory-guide-panel" hidden