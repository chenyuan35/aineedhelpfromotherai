(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.getElementById(`nav`);window.addEventListener(`scroll`,()=>{e.classList.toggle(`scrolled`,window.scrollY>20)},{passive:!0});var t=document.getElementById(`obs-feed`),n=document.getElementById(`feed-empty`),r=document.getElementById(`feed-count`),i=document.getElementById(`feed-agents`),a=document.getElementById(`nav-status`),o=0,s=new Set,c={"resolve.hit":{icon:`✔`,cls:`hit`,label:`CACHE HIT`},"resolve.miss":{icon:`✕`,cls:`miss`,label:`CACHE MISS`},"task.claimed":{icon:`▶`,cls:`claimed`,label:`CLAIMED`},"task.submitted":{icon:`●`,cls:`submitted`,label:`SUBMITTED`},"task.created":{icon:`+`,cls:`created`,label:`CREATED`},"reasoning.stored":{icon:`◆`,cls:`stored`,label:`STORED`},root_cause_analyzed:{icon:`◎`,cls:`analyzed`,label:`ANALYZED`},behavioral_signal:{icon:`⚡`,cls:`signal`,label:`SIGNAL`}};function l(e){let a=new Date,l=e.timestamp?new Date(e.timestamp).toTimeString().slice(0,8):a.toTimeString().slice(0,8),u=e.type||e.event_type||`event`,d=c[u]||{icon:`○`,cls:`default`,label:u.toUpperCase()},f=e.agent_id||e.agentId||`—`,p=e.task_id||e.hint_id||e.run_id||e.problem_statement||`—`;f!==`—`&&s.add(f),n&&n.remove();let m=document.createElement(`div`);m.className=`obs-event ${d.cls}`,e.score===void 0?e.hint_id&&e.hint_id.slice(0,8):(e.score>=0?`+`:``)+Number(e.score).toFixed(2);let h=e.narrative||`${d.label}: ${p}`,g=e.narrative_action||``;for(m.innerHTML=`
    <span class="obs-event-time">${l}</span>
    <span class="obs-event-icon ${d.cls}">${d.icon}</span>
    <span class="obs-event-narrative">${h}</span>
    ${g?`<span class="obs-event-action ${e.narrative_action}">${g}</span>`:``}
  `,t.prepend(m),requestAnimationFrame(()=>m.classList.add(`visible`)),o++,r.textContent=`${o} events`,i.textContent=`${s.size} agents`;t.children.length>100;)t.removeChild(t.lastChild)}function u(){let e=new EventSource(`/api/events`);a.textContent=`connected`,a.className=`nav-status connected`,e.addEventListener(`connected`,()=>{a.textContent=`connected`,a.className=`nav-status connected`}),[`resolve.hit`,`resolve.miss`,`task.claimed`,`task.submitted`,`task.created`,`reasoning.stored`,`root_cause_analyzed`,`behavioral_signal`].forEach(t=>{e.addEventListener(t,e=>{try{l(JSON.parse(e.data))}catch{}})}),e.addEventListener(`snapshot`,e=>{try{let t=JSON.parse(e.data);t.agents&&d(t)}catch{}}),e.onerror=()=>{a.textContent=`disconnected`,a.className=`nav-status disconnected`,e.close(),setTimeout(u,5e3)}}u();function d(e){let t=e.agents||{},n=e.memory||{},r=e.executions||{},i=(t.active||0)+(t.queued||0)+(t.running||0),a=n.total_hints||n.total||0,o=n.active||0,s=n.health_score||0,c=r.total||0,l=e=>document.getElementById(e);if(l(`state-agents`)&&(l(`state-agents`).textContent=i,l(`state-bar-agents`).style.width=Math.min(i*8,100)+`%`),l(`state-memory`)&&(l(`state-memory`).textContent=Math.round(s*100)+`%`,l(`state-bar-memory`).style.width=Math.round(s*100)+`%`),l(`state-executions`)&&(l(`state-executions`).textContent=c.toLocaleString(),l(`state-bar-executions`).style.width=Math.min(c/30,100)+`%`),l(`mem-total`)&&(l(`mem-total`).textContent=a,l(`mem-active`).textContent=o,l(`mem-decaying`).textContent=n.decaying||0,l(`mem-quarantined`).textContent=n.quarantined||0,a>0)){let e=o/a*100,t=(n.decaying||0)/a*100,r=(n.quarantined||0)/a*100;l(`mem-active-seg`).style.background=`conic-gradient(var(--success) 0% ${e}%, var(--warning) ${e}% ${e+t}%, var(--danger) ${e+t}% ${e+t+r}%)`}}function f(){let e=new EventSource(`/api/snapshot/live`),t=0;e.addEventListener(`snapshot`,e=>{try{let n=JSON.parse(e.data),r=n.tick||0;r!==t&&(t=r,d(n))}catch{}}),e.onerror=()=>{e.close(),setTimeout(f,15e3)}}async function p(){try{let e=await fetch(`/api/snapshot`);if(e.ok){let t=await e.json();t.snapshot&&d(t.snapshot)}}catch{}}p(),f();var m=new Map;async function h(){try{let e=await fetch(`/api/agents/profiles`);if(!e.ok)return;let t=await e.json();if(!t.profiles)return;m.clear();for(let e of t.profiles)m.set(e.agent_id,e);b(y)}catch{}}function g(e){if(!e||e.length===0)return``;let t={high_consensus_reliability:`reliable`,moderate_success_rate:`moderate`,frequent_failures:`unstable`,skilled_executor:`skilled`,competent_executor:`competent`,hallucination_prone:`hallucinates`,retries_excessively:`retries`,unfocused_execution:`unfocused`,deviates_from_objective:`deviates`,long_execution_paths:`wanders`,clean_behavior_record:`clean`};return e.slice(0,3).map(e=>`<span class="lb-trait ${e}">${t[e]||e.replace(/_/g,` `).slice(0,10)}</span>`).join(``)}function _(e){return{high_reliability:`🛡`,high_risk:`⚡`,security:`🔐`,generalist:`○`}[e]||`○`}var v=document.getElementById(`leaderboard-body`),y=[];function b(e){if(y=e||[],!e||e.length===0){v.innerHTML=`<div class="lb-empty">No agent data yet</div>`;return}v.innerHTML=e.map((e,t)=>{let n=(e.hallucination_rate||0)>20?`high`:`low`,r=m.get(e.agent_id||e.name),i=r?.behavioral_traits||[],a=r?.specialty||``,o=r?.trust?.level||``;return`
      <div class="lb-row" data-agent="${e.agent_id||e.name}">
        <span class="lb-rank ${t<3?`top`:``}">${t+1}</span>
        <span class="lb-name">
          ${a?`<span class="lb-specialty-icon">${_(a)}</span>`:``}
          ${e.agent_id||e.name||`unknown`}
          ${o?`<span class="lb-trust ${o}"></span>`:``}
        </span>
        <span class="lb-elo">${e.avg_rating||e.elo||`—`}</span>
        <span class="lb-solved">${e.total_attempts||e.solved||0}</span>
        <span class="lb-rate">${e.success_rate===void 0?e.rate||`—`:e.success_rate+`%`}</span>
        <span class="lb-halluc ${n}">${e.hallucination_rate===void 0?`—`:e.hallucination_rate+`%`}</span>
        <span class="lb-traits-cell">${g(i)}</span>
      </div>
    `}).join(``)}async function x(){try{let[e,t]=await Promise.all([fetch(`/api/elo`),fetch(`/api/leaderboard/memory`)]),n=e.ok?await e.json():null,r=t.ok?await t.json():null,i=n?.leaderboard||[],a=r?.agent_leaderboard||[],o={};for(let e of a)o[e.agent_id]=e;let s=i.map(e=>{let t=o[e.agent_id]||{};return{agent_id:e.agent_id,avg_rating:e.avg_rating,total_attempts:t.total_attempts||0,success_rate:t.success_rate,hallucination_rate:t.hallucination_rate,distinct_hints_used:t.distinct_hints_used}});s.length>0?b(s):a.length>0?b(a):v.innerHTML=`<div class="lb-empty">No agent data yet</div>`}catch{v.innerHTML=`<div class="lb-empty">Unable to load leaderboard</div>`}}x(),h(),setInterval(x,3e4),setInterval(h,6e4);var S=document.getElementById(`signals-container`),C=[];function w(e){let t=e.severity||`low`,n=e.confidence?Math.round(e.confidence*100)+`%`:`—`;return`
    <div class="signal-card">
      <div class="signal-card-header">
        <span class="signal-dot ${t}"></span>
        <span class="signal-type">${e.signal||`unknown`}</span>
        <span class="signal-severity ${t}">${t}</span>
      </div>
      <div class="signal-explanation">${e.explanation||`No explanation available`}</div>
      <div class="signal-meta">
        <span>agent: ${e.agent_id||`system`}</span>
        <span>task: ${e.task_id?e.task_id.slice(0,12):`—`}</span>
        <span class="signal-confidence">conf: ${n}</span>
      </div>
    </div>
  `}function T(e){if(!e||e.length===0){S.innerHTML=`<div class="signal-all-clear">✓ All systems nominal — no behavioral anomalies detected</div>`;return}S.innerHTML=e.map(w).join(``)}async function E(){try{let e=await fetch(`/api/signals?limit=12`);if(!e.ok){S.innerHTML=`<div class="signal-empty">Unable to load signals</div>`;return}C=(await e.json()).signals||[],T(C)}catch{S.innerHTML=`<div class="signal-empty">Unable to load signals</div>`}}E();function D(){let e=new EventSource(`/api/signals/live`);e.addEventListener(`signal`,e=>{try{let t=JSON.parse(e.data),n=`${t.signal}:${t.agent_id||``}:${t.run_id||``}`,r=C.findIndex(e=>`${e.signal}:${e.agent_id||``}:${e.run_id||``}`===n);r>=0?(t.confidence||0)>(C[r].confidence||0)&&(C[r]=t):C.unshift(t),C=C.slice(0,12),T(C)}catch{}}),e.onerror=()=>{e.close(),setTimeout(D,8e3)}}D();var O=document.getElementById(`narrative-container`);async function k(){try{let e=await fetch(`/api/runtime/narrative?window=1800000`);if(!e.ok){O.innerHTML=`<div class="lb-empty">Unable to load narrative</div>`;return}let t=await e.json();if(!t.windows||t.windows.length===0){O.innerHTML=`<div class="lb-empty">No recent activity to summarize</div>`;return}let n=t.current||{};O.innerHTML=`
      <div class="narrative-current">
        <span class="narrative-current-label">Current period</span>
        <span class="narrative-current-summary">${n.summary||`no activity`}</span>
        <span class="narrative-current-meta">${n.total_events||0} events · ${n.unique_agents||0} agents</span>
      </div>
      <div class="narrative-windows">
        ${t.windows.map(e=>`
          <div class="narrative-window">
            <div class="narrative-window-head">
              <span class="narrative-window-time">${e.label}</span>
              <span class="narrative-window-count">${e.total_events} events</span>
              ${e.agent_summary?`<span class="narrative-window-agents">${e.agent_summary}</span>`:``}
            </div>
            <div class="narrative-window-summary">${e.summary}</div>
            ${e.highlights&&e.highlights.length>0?`
              <div class="narrative-highlights">
                ${e.highlights.map(e=>`<span class="narrative-highlight"><span class="narrative-hl-icon">${e.icon}</span> ${e.text}</span>`).join(``)}
              </div>
            `:``}
          </div>
        `).join(``)}
      </div>
    `}catch{O.innerHTML=`<div class="lb-empty">Unable to load narrative</div>`}}k(),setInterval(k,3e4);var A=document.getElementById(`profile-overlay`),j=document.getElementById(`profile-panel`),M=document.getElementById(`profile-content`),N=document.getElementById(`profile-close`);function P(e){A.style.display=`block`,M.innerHTML=`<div class="lb-empty">Loading profile…</div>`,requestAnimationFrame(()=>{A.classList.add(`visible`),j.classList.add(`visible`)}),fetch(`/api/agents/${encodeURIComponent(e)}/profile`).then(e=>e.ok?e.json():Promise.reject()).then(e=>{let t=e.profile,n=t.behavioral_traits||[],r=t.trust?.level||`unknown`,i=t.recent_signals||[];M.innerHTML=`
        <div class="profile-identity">
          <div class="profile-name-row">
            <span class="profile-name">${t.agent_id}</span>
            <span class="profile-trust ${r}">${r}</span>
          </div>
          <div class="profile-specialty">${t.specialty||`generalist`}</div>
          <div class="profile-status ${t.status}">${t.status===`active`?`● active`:`○ inactive`}</div>
        </div>
        <div class="profile-section">
          <div class="profile-section-title">Behavioral Traits</div>
          <div class="profile-traits">
            ${n.length>0?n.map(e=>`<span class="profile-trait ${e}">${e.replace(/_/g,` `)}</span>`).join(``):`<span class="profile-empty">Insufficient data to determine traits</span>`}
          </div>
        </div>
        <div class="profile-section">
          <div class="profile-section-title">Performance</div>
          <div class="profile-stats">
            <div class="profile-stat"><span class="profile-stat-value">${t.stats?.success_rate||`—`}%</span><span class="profile-stat-label">Success Rate</span></div>
            <div class="profile-stat"><span class="profile-stat-value">${t.total_executions||0}</span><span class="profile-stat-label">Executions</span></div>
            <div class="profile-stat"><span class="profile-stat-value">${t.stats?.task_types||`—`}</span><span class="profile-stat-label">Task Types</span></div>
            <div class="profile-stat"><span class="profile-stat-value">${t.stats?.elo_rating||`—`}</span><span class="profile-stat-label">ELO Rating</span></div>
          </div>
        </div>
        <div class="profile-section">
          <div class="profile-section-title">Memory Profile</div>
          <div class="profile-memory">
            <span><strong>${t.memory_profile?.hints_used||0}</strong> hints used</span>
            <span><strong>${t.memory_profile?.hints_contributed||0}</strong> hints contributed</span>
          </div>
        </div>
        ${i.length>0?`
        <div class="profile-section">
          <div class="profile-section-title">Recent Signals</div>
          <div class="profile-signals">
            ${i.map(e=>`
              <div class="profile-signal">
                <span class="signal-dot ${e.severity}"></span>
                <span class="profile-signal-name">${e.signal}</span>
                <span class="profile-signal-conf">${Math.round((e.confidence||0)*100)}%</span>
              </div>
            `).join(``)}
          </div>
        </div>`:``}
      `}).catch(()=>{M.innerHTML=`<div class="lb-empty">Unable to load profile</div>`})}function F(){A.classList.remove(`visible`),j.classList.remove(`visible`),setTimeout(()=>{A.style.display=`none`},300)}N.addEventListener(`click`,F),A.addEventListener(`click`,e=>{e.target===A&&F()}),document.addEventListener(`click`,e=>{let t=e.target.closest(`.lb-row`);if(t){let e=t.querySelector(`.lb-name`)?.textContent?.trim();e&&e!==`unknown`&&P(e)}});var I=document.getElementById(`replay-cards`),L={claimed:`Task Claimed`,memory_applied:`Memory Gate`,prompt_recorded:`Prompt Built`,output_recorded:`Model Output`,verified:`Sandbox Verified`,submitted:`Result Stored`};async function R(){try{let e=await fetch(`/api/replay`);if(!e.ok){I.innerHTML=`<div class="lb-empty">No replay data available</div>`;return}let t=await e.json(),n=t.replays||t||[];if(!Array.isArray(n)||n.length===0){I.innerHTML=`<div class="lb-empty">No replay data yet — runs will appear as agents execute tasks</div>`;return}I.innerHTML=n.slice(0,8).map(e=>{let t=e.stages||{},n=Object.values(t).filter(Boolean).length,r=`pending`;t.submitted?r=`ok`:t.verified&&(r=`warn`);let i=e.time_span?.duration_ms?e.time_span.duration_ms>1e3?(e.time_span.duration_ms/1e3).toFixed(1)+`s`:e.time_span.duration_ms+`ms`:`—`;return`
        <div class="replay-card" data-run-id="${e.run_id}">
          <div class="replay-card-header">
            <div class="replay-card-left">
              <span class="replay-card-dot ${r}"></span>
              <span class="replay-card-id">${e.run_id}</span>
              <span class="replay-card-meta">${n}/6 stages · ${i}</span>
            </div>
            <div class="replay-card-right">
              <span class="replay-card-agent">${e.agent_id||`unknown`}</span>
              <span class="replay-card-chevron">›</span>
            </div>
          </div>
          <div class="replay-card-timeline"></div>
        </div>
      `}).join(``),I.querySelectorAll(`.replay-card-header`).forEach(e=>{e.addEventListener(`click`,()=>z(e.parentElement))})}catch{I.innerHTML=`<div class="lb-empty">Unable to load replay data</div>`}}async function z(e){let t=e.classList.contains(`expanded`);if(e.classList.toggle(`expanded`),!t){let t=e.querySelector(`.replay-card-timeline`);if(t.children.length>0)return;let n=e.dataset.runId;t.innerHTML=`<div style="padding:12px 0;color:var(--text-faint);font-size:13px;">Loading trace…</div>`;try{let e=await fetch(`/api/replay/${encodeURIComponent(n)}`);if(!e.ok){t.innerHTML=`<div style="padding:12px 0;color:var(--danger);font-size:13px;">Failed to load trace</div>`;return}let r=await e.json(),i=r.stages||{},a=r.timeline||[],o=[`claimed`,`memory_applied`,`prompt_recorded`,`output_recorded`,`verified`,`submitted`],s={claimed:`task_claimed`,memory_applied:`memory_injected`,prompt_recorded:`prompt_built`,output_recorded:`model_output`,verified:`result_verified`,submitted:`result_submitted`},c=``;for(let e of o){let t=i[e],n=L[e]||e,r=a.find(t=>t.event_type===s[e]),o=r?.latency_ms?r.latency_ms>1e3?(r.latency_ms/1e3).toFixed(1)+`s`:r.latency_ms+`ms`:``,l=t&&r?r.summary||o:t?`✓`:`—`;c+=`<div class="replay-stage"><div class="replay-stage-dot ${t?`done`:`skipped`}"></div><div class="replay-stage-body"><div class="replay-stage-title ${t?`done`:`skipped`}">${n}</div><div class="replay-stage-detail">${l}</div></div></div>`}t.innerHTML=c}catch{t.innerHTML=`<div style="padding:12px 0;color:var(--danger);font-size:13px;">Error loading trace</div>`}}}R(),setInterval(R,3e4),document.querySelectorAll(`a[href^="#"]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let n=document.querySelector(e.getAttribute(`href`));n&&n.scrollIntoView({behavior:`smooth`,block:`start`})})});