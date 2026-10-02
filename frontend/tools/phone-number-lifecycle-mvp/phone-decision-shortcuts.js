(()=>{
  const host=document.querySelector('.pr-tools');
  if(!host)return;

  const VISIBLE_STATES=new Set(['comparison-visible','detail-eligible','indexable']);
  const shortcuts=[
    ['cheap-keep','Lowest keep cost','Known yearly keep cost, compared in CNY'],
    ['long-window','Longest keep window','More days between qualifying keep-alive actions'],
    ['chatgpt','ChatGPT evidence','Routes with normalized OpenAI / Codex reports'],
    ['fresh','Recently checked','Newest reviewed candidate evidence']
  ];

  const panel=document.createElement('section');
  panel.className='pr-decisions';
  panel.setAttribute('aria-labelledby','pr-decisions-title');
  panel.innerHTML=`<div class="pr-decisions-head"><div><p class="pr-decisions-kicker">Decision shortcuts</p><h2 id="pr-decisions-title">Start from the job, not the carrier list.</h2><p>Shortcuts rank the current comparison dataset by one explicit field. They do not turn HOLD observations into recommendations.</p></div><button type="button" class="pr-decisions-clear" hidden>Clear</button></div><div class="pr-decision-chips" role="group" aria-label="Phone route decision shortcuts">${shortcuts.map(([id,title,desc])=>`<button type="button" data-decision="${id}" aria-pressed="false"><strong>${title}</strong><span>${desc}</span></button>`).join('')}</div><div class="pr-decision-results" id="pr-decision-results" hidden aria-live="polite"></div>`;
  host.insertAdjacentElement('afterend',panel);

  const results=panel.querySelector('#pr-decision-results');
  const clear=panel.querySelector('.pr-decisions-clear');
  let active='';

  const waitFor=(test,timeout=6000)=>new Promise((resolve,reject)=>{
    const started=Date.now();
    const tick=()=>{
      let value;
      try{value=test()}catch{}
      if(value)return resolve(value);
      if(Date.now()-started>=timeout)return reject(new Error('Phone comparison data is still loading.'));
      setTimeout(tick,60);
    };
    tick();
  });

  const visibleRows=()=>((comparisonIndex?.routes)||[]).filter(r=>VISIBLE_STATES.has(r.publicationState));
  const isHold=r=>String(r.publishState||'').includes('hold');
  const fmtMoney=(value,currency)=>Number.isFinite(value)?money(value,currency):'Unknown';
  const fmtCny=value=>Number.isFinite(value)?`≈ ¥${Number(value).toFixed(2)}`:'';
  const routeState=r=>isHold(r)?'Observation / hold':String(r.publishState||'candidate').replaceAll('-',' ');
  const checked=r=>r.lastVerifiedAt?fmtDay(r.lastVerifiedAt):'—';
  const candidateRows=()=>visibleRows().filter(r=>!isHold(r));

  function baseCard(r,extra=''){
    const start=[fmtMoney(r.acquisitionCostOriginal,r.acquisitionCurrency),fmtCny(r.acquisitionCostCny)].filter(Boolean).join(' · ');
    const keep=[Number.isFinite(r.keepYearCostOriginal)?`${fmtMoney(r.keepYearCostOriginal,r.keepCurrency)} / yr`:'Not established',fmtCny(r.keepYearCostCny)].filter(Boolean).join(' · ');
    return `<article class="pr-decision-card"><div class="pr-decision-card-head"><div><h3>${esc(r.brandName||r.id)}</h3><p>${esc(r.marketName||'')} · ${esc(r.networkName||'')} · ${esc(r.simType||'')}</p></div><span class="pr-decision-state" data-hold="${isHold(r)}">${esc(routeState(r))}</span></div><div class="pr-decision-metrics"><div><small>Start</small><strong>${esc(start)}</strong></div><div><small>Keep / year</small><strong>${esc(keep)}</strong></div><div><small>Keep window</small><strong>${Number.isFinite(r.keepIntervalDays)?`${r.keepIntervalDays} days`:'Not established'}</strong></div><div><small>Checked</small><strong>${esc(checked(r))}</strong></div></div>${extra}<div class="pr-decision-meta">${esc(r.evidenceState||'evidence state unknown')} · ${Number.isFinite(r.sourceCount)?r.sourceCount:0} sources</div><button type="button" class="pr-decision-open" data-decision-route="${esc(r.id)}">Open route evidence</button></article>`;
  }

  function renderRows(title,note,rows,extraById=new Map()){
    if(!rows.length){results.innerHTML=`<div class="pr-empty"><strong>${esc(title)}</strong><p>No route currently meets this shortcut.</p></div>`;results.hidden=false;return;}
    results.innerHTML=`<div class="pr-decision-result-head"><div><strong>${esc(title)}</strong><span>${esc(note)}</span></div><span>${rows.length} routes</span></div><div class="pr-decision-grid">${rows.map(r=>baseCard(r,extraById.get(r.id)||'')).join('')}</div>`;
    results.hidden=false;
  }

  async function applyShortcut(kind){
    active=kind;
    panel.querySelectorAll('[data-decision]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.decision===kind)));
    clear.hidden=false;
    results.hidden=false;
    results.innerHTML='<p class="pr-loading">Building this decision view…</p>';
    trackPhone('phone_decision_shortcut',{shortcut:kind});
    await waitFor(()=>typeof comparisonIndex!=='undefined'&&comparisonIndex);

    if(kind==='cheap-keep'){
      const rows=candidateRows().filter(r=>Number.isFinite(r.keepYearCostCny)).sort((a,b)=>a.keepYearCostCny-b.keepYearCostCny||String(a.brandName).localeCompare(String(b.brandName))).slice(0,8);
      renderRows('Lowest known yearly keep cost','Cross-currency order uses the stored CNY comparison value; live FX and fees can differ.',rows);
      return;
    }
    if(kind==='long-window'){
      const rows=candidateRows().filter(r=>Number.isFinite(r.keepIntervalDays)).sort((a,b)=>b.keepIntervalDays-a.keepIntervalDays||String(a.brandName).localeCompare(String(b.brandName))).slice(0,8);
      renderRows('Longest documented keep-alive windows','A longer window is convenience, not a reliability score. Open the route for the exact qualifying action.',rows);
      return;
    }
    if(kind==='fresh'){
      const rows=candidateRows().filter(r=>r.lastVerifiedAt).sort((a,b)=>String(b.lastVerifiedAt).localeCompare(String(a.lastVerifiedAt))||Number(b.sourceCount||0)-Number(a.sourceCount||0)).slice(0,8);
      renderRows('Most recently checked candidate routes','Ordered by the latest stored verification date, then source count.',rows);
      return;
    }
    if(kind==='chatgpt'){
      await waitFor(()=>typeof ensureGlobalDirectory==='function');
      await ensureGlobalDirectory();
      const extras=new Map();
      const rows=visibleRows().map(r=>({r,s:dirService(r.id,'OpenAI/Codex')})).filter(x=>x.s.n>0).sort((a,b)=>b.s.n-a.s.n||String(b.r.lastVerifiedAt||'').localeCompare(String(a.r.lastVerifiedAt||''))).slice(0,8);
      for(const x of rows)extras.set(x.r.id,`<div class="pr-decision-app"><small>Observed OpenAI / Codex evidence</small><strong data-tone="${esc(x.s.tone)}">${esc(x.s.label)}</strong></div>`);
      renderRows('Routes with OpenAI / Codex reports','Report counts are evidence samples, not guaranteed OTP success rates. HOLD routes remain visibly marked.',rows.map(x=>x.r),extras);
    }
  }

  panel.addEventListener('click',ev=>{
    const btn=ev.target.closest('[data-decision]');
    if(btn){applyShortcut(btn.dataset.decision).catch(err=>{results.hidden=false;results.innerHTML=`<div class="pr-error"><strong>Decision view could not load.</strong><p>${esc(err.message)}</p></div>`});return;}
    const route=ev.target.closest('[data-decision-route]');
    if(route){trackPhone('phone_decision_route_open',{shortcut:active,route:route.dataset.decisionRoute});openIndexedRoute(route.dataset.decisionRoute);return;}
    if(ev.target.closest('.pr-decisions-clear')){
      active='';
      panel.querySelectorAll('[data-decision]').forEach(x=>x.setAttribute('aria-pressed','false'));
      results.hidden=true;results.innerHTML='';clear.hidden=true;
      trackPhone('phone_decision_shortcut_clear');
    }
  });
})();
