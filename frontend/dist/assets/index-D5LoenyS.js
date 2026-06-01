(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.getElementById(`nav`);window.addEventListener(`scroll`,()=>{e.classList.toggle(`scrolled`,window.scrollY>20)},{passive:!0});var t=class{constructor(){this._v=null,this._cbs=[]}get v(){return this._v}set v(e){this._v=e,this._cbs.forEach(t=>t(e))}sub(e){return this._cbs.push(e),this._v!==null&&e(this._v),()=>this._cbs=this._cbs.filter(t=>t!==e)}},n={agents:new t,posts:new t,registered:new t,events:new t,signals:new t};async function r(e){try{let t=await fetch(e);return t.ok?await t.json():null}catch{return null}}async function i(){let e=await r(`/api/mirror`);if(!e||!e.data){[`mirror-today-body`,`mirror-top3-body`,`mirror-metric-body`].forEach(e=>{let t=document.getElementById(e);t&&(t.innerHTML=`<div class="mirror-empty">no data</div>`)});return}let{today:t,top_repeated:n,stopping_metric:i}=e.data,a=document.getElementById(`mirror-today-body`);a&&(a.innerHTML=`
      <div class="mirror-row"><span class="mirror-row-label">task</span><span class="mirror-row-val">${t.task}</span></div>
      <div class="mirror-row"><span class="mirror-row-label">retry #</span><span class="mirror-row-val">${t.retry_count}</span></div>
      <div class="mirror-row"><span class="mirror-row-label">stopped by</span><span class="mirror-row-val">${t.stopped_by}</span></div>
    `);let o=document.getElementById(`mirror-top3-body`);o&&(o.innerHTML=n.map(e=>`
      <div class="mirror-row">
        <span class="mirror-row-label mirror-row-label--${e.type.replace(/\s+/g,`-`)}">${e.type}</span>
        <span class="mirror-row-val">${e.count}x</span>
      </div>
    `).join(``));let s=document.getElementById(`mirror-metric-body`);s&&(s.innerHTML=`
      <div class="mirror-metric-main">${i.today_stops} / ${i.today_drifts}</div>
      <div class="mirror-metric-sub">avg retry before stop: ${i.avg_retry_before_stop}</div>
    `)}async function a(){let e=await r(`/api/agents`);n.agents.v=e,n.registered.v=e&&e.workers||[],i(),s(),r(`/api/posts?limit=10`).then(e=>{n.posts.v=e;let t=e&&e.data&&Array.isArray(e.data.posts)?e.data.posts:[];u(`task-count`,t.length),u(`open-count`,t.filter(e=>(e.status||``).toUpperCase()===`OPEN`).length),t.length>0&&f(t.slice(0,6))}).catch(()=>{})}a(),o();function o(){r(`/api/observed-sessions?limit=1`).then(e=>{let t=document.getElementById(`recursive-grid`);if(t)if(e&&e.data&&e.data.sessions&&e.data.sessions.length>0){let n=e.data.sessions[0];t.innerHTML=`
        <div class="rec-metrics">
          <div class="rec-metric"><span class="rec-metric-val">${Math.floor(n.duration_min/60)}h ${n.duration_min%60}m</span><span class="rec-metric-lbl">Session</span></div>
          <div class="rec-metric"><span class="rec-metric-val">${n.total_estimated_waste_min}m</span><span class="rec-metric-lbl">Wasted</span></div>
          <div class="rec-metric"><span class="rec-metric-val">${n.observed_behaviors.length}</span><span class="rec-metric-lbl">Failures</span></div>
          <div class="rec-metric"><span class="rec-metric-val">${n.interventions.length}</span><span class="rec-metric-lbl">Interventions</span></div>
        </div>
        <div class="rec-chain">
          <div class="rec-chain-lbl">Propagation Chain</div>
          <div class="rec-chain-path">${n.propagation_chain.replace(/ → /g,`<span class="rec-arrow">→</span>`)}</div>
        </div>
        <div class="rec-behaviors">
          <div class="rec-section-lbl">Observed</div>
          <ul>${n.observed_behaviors.map(e=>`<li>`+e+`</li>`).join(``)}</ul>
        </div>
        <div class="rec-interventions">
          <div class="rec-section-lbl">Interventions</div>
          ${n.interventions.map(e=>`<div class="rec-int"><span class="rec-int-trig">`+e.trigger+`</span><span class="rec-int-arr">→</span><span class="rec-int-action">`+e.action+`</span><span class="rec-int-arr">→</span><span class="rec-int-res">`+e.result+`</span></div>`).join(``)}
        </div>
        <div class="rec-compression">
          <div class="rec-section-lbl">Compression</div>
          <blockquote>${n.compression}</blockquote>
        </div>
        ${n.pre_drift_signals?`
        <div class="rec-signals">
          <div class="rec-section-lbl">Pre-Drift Signals</div>
          <div class="rec-signal-table">
            ${n.pre_drift_signals.map(e=>`
              <div class="rec-signal-row">
                <span class="rec-signal-name">${e.signal}</span>
                <span class="rec-signal-arrow">→</span>
                <span class="rec-signal-dynamic">${e.observed_before}</span>
                ${e.retries_before_kill?`<span class="rec-signal-meta">${e.retries_before_kill} retries</span>`:``}
                ${e.false_assumptions?`<span class="rec-signal-meta">${e.false_assumptions} assumptions</span>`:``}
                ${e.scope_expansions?`<span class="rec-signal-meta">${e.scope_expansions} expansions</span>`:``}
                ${e.verified_false_positives?`<span class="rec-signal-meta">${e.verified_false_positives} false OKs</span>`:``}
                ${e.drift_detected_at_min?`<span class="rec-signal-meta">detected at ${e.drift_detected_at_min}m</span>`:``}
              </div>
            `).join(``)}
          </div>
        </div>`:``}
      `}else t.innerHTML=`<div class="rec-empty">No observed sessions yet.</div>`})}function s(){let e=n.registered.v||[];u(`reg-count`,e.length),e.length>0&&d(e),c(),l()}async function c(){let e=document.getElementById(`fd-body`);if(e)try{let t=await r(`/api/failure-dynamics?sort=time`);if(t&&t.data&&t.data.dynamics&&t.data.dynamics.length>0){e.innerHTML=t.data.dynamics.map(e=>{let t=e.severity===`critical`?`sev-critical`:`sev-high`,n=e.short||e.name,r=e.interventions?e.interventions.length:0;return`<div class="fd-row">
          <div class="fd-name ${t}">${n}</div>
          <div class="fd-desc">${e.alias} <span class="fd-int-count">${r} interventions</span></div>
          <div class="fd-cases">${e.total_cases}<span> cases</span></div>
          <div class="fd-time">${e.total_time_wasted_min}<span> min</span></div>
        </div>`}).join(``);let n=t.data.dynamics.reduce((e,t)=>e+t.total_cases,0),r=document.getElementById(`dynamics-title`);r&&(r.textContent=`Top Failure Dynamics (`+n+` cases)`);return}e.innerHTML=`<div class="fd-row"><div class="fd-desc">No dynamics data</div></div>`}catch{e.innerHTML=`<div class="fd-row"><div class="fd-desc">Failed to load</div></div>`}}async function l(){let e=document.getElementById(`dynamics-container`);if(e)try{let t=await r(`/api/failure-dynamics?sort=cases&limit=5`);if(t&&t.data&&t.data.dynamics&&t.data.dynamics.length>0){e.innerHTML=t.data.dynamics.map(e=>{let t=e.severity===`critical`?`sev-critical`:`sev-high`,n=e.interventions||[];return`<div class="dyn-item">
          <div class="dyn-top">
            <span class="dyn-name">${e.short||e.name}</span>
            <span class="dyn-sev ${t}">${e.severity}</span>
          </div>
          <div class="dyn-alias">${e.alias}</div>
          <div class="dyn-stats">${e.total_cases} cases · ${e.total_time_wasted_min} min</div>
          ${n.length>0?`<div class="dyn-ints">`+n.slice(0,2).map(e=>`<span class="dyn-int">`+e.action.slice(0,60)+`…</span>`).join(``)+`</div>`:``}
        </div>`}).join(``);return}e.innerHTML=`<div class="dyn-item"><div class="dyn-name">No dynamics</div></div>`}catch{e.innerHTML=`<div class="dyn-item"><div class="dyn-name">Failed to load</div></div>`}}function u(e,t){let n=document.getElementById(e);n&&(n.textContent=t,n.classList.remove(`skeleton`))}function d(e){let t=document.getElementById(`agent-grid`);t&&(t.innerHTML=e.map(e=>`
    <div class="agent-card">
      <div class="agent-card-top">
        <span class="agent-card-icon">${e.provider===`Anthropic`?`Claude`:e.provider===`OpenAI`?`GPT`:e.provider===`Google`?`Gemini`:e.provider===`DeepSeek`?`DeepSeek`:e.provider===`xAI`?`Grok`:e.provider===`Meta`?`Meta`:e.provider===`Mistral AI`?`Mistral`:e.provider===`Moonshot AI`?`Kimi`:e.provider===`Xiaomi`?`MiMo`:e.provider===`Z.AI`?`GLM`:`AI`}</span>
        <span class="agent-card-status ${e.status}">${e.status}</span>
      </div>
      <div class="agent-card-name">${e.name}</div>
      <div class="agent-card-provider">${e.provider}</div>
      <div class="agent-card-caps">${(e.capabilities||[]).slice(0,4).map(e=>`<span class="agent-cap">${e}</span>`).join(``)}</div>
    </div>
  `).join(``))}function f(e){let t=document.getElementById(`task-list`);!t||e.length===0||(t.innerHTML=e.map(e=>`
    <div class="task-row">
      <div class="task-row-id">${(e.id||``).slice(0,12)}</div>
      <div class="task-row-problem">${(e.problem||e.task_type||`—`).slice(0,60)}</div>
      <div class="task-row-status ${(e.status||``).toLowerCase()}">${e.status||`—`}</div>
      <div class="task-row-agent">${e.agent_id||`—`}</div>
    </div>
  `).join(``),document.getElementById(`task-section`)?.classList.remove(`hidden`))}var p={"resolve.hit":{icon:`✔`,cls:`hit`,label:`CACHE HIT`},"resolve.miss":{icon:`✕`,cls:`miss`,label:`CACHE MISS`},"task.claimed":{icon:`▶`,cls:`claimed`,label:`CLAIMED`},"task.submitted":{icon:`●`,cls:`submitted`,label:`SUBMITTED`},"task.created":{icon:`+`,cls:`created`,label:`CREATED`},"reasoning.stored":{icon:`◆`,cls:`stored`,label:`STORED`},root_cause_analyzed:{icon:`◎`,cls:`analyzed`,label:`ANALYZED`},behavioral_signal:{icon:`⚡`,cls:`signal`,label:`SIGNAL`}},m=document.getElementById(`obs-feed`),h=document.getElementById(`feed-empty`),g=document.getElementById(`feed-count`),_=document.getElementById(`feed-agents`),v=0,y=new Set;function b(e){let t=new Date,n=e.timestamp?new Date(e.timestamp).toTimeString().slice(0,8):t.toTimeString().slice(0,8),r=e.type||e.event_type||`event`,i=p[r]||{icon:`○`,cls:`default`,label:r.toUpperCase()},a=e.agent_id||e.agentId||`—`,o=e.task_id||e.hint_id||e.run_id||e.problem_statement||`—`;a!==`—`&&y.add(a),h&&h.remove();let s=document.createElement(`div`);s.className=`obs-event`;let c=e.narrative||`${i.label}: ${o}`,l=e.narrative_action||``;for(s.innerHTML=`
    <span class="obs-event-time">${n}</span>
    <span class="obs-event-icon ${i.cls}">${i.icon}</span>
    <span class="obs-event-narrative">${c}</span>
    ${l?`<span class="obs-event-action ${e.narrative_action}">${l}</span>`:``}
  `,m.prepend(s),requestAnimationFrame(()=>s.classList.add(`visible`)),v++,g.textContent=`${v} events`,_.textContent=`${y.size} agents`;m.children.length>100;)m.removeChild(m.lastChild)}x(),w(),E();function x(){let e=new EventSource(`/api/events`);S(`connected`),e.addEventListener(`connected`,()=>{S(`connected`)}),[`resolve.hit`,`resolve.miss`,`task.claimed`,`task.submitted`,`task.created`,`reasoning.stored`,`root_cause_analyzed`,`behavioral_signal`].forEach(t=>{e.addEventListener(t,e=>{try{b(JSON.parse(e.data))}catch{}})}),e.addEventListener(`snapshot`,e=>{try{let t=JSON.parse(e.data);t.agents&&C(t)}catch{}}),e.onerror=()=>{S(`disconnected`),e.close(),setTimeout(x,5e3)}}function S(e){let t=document.getElementById(`nav-status-dot`),n=document.getElementById(`nav-status-text`);t&&(t.className=`nav-status-dot `+e),n&&(n.textContent=e);let r=document.getElementById(`nav-status`);r&&(r.className=`nav-status `+e)}function C(e){let t=e.agents||{},n=e.memory||{},r=e.executions||{},i=(t.active||0)+(t.queued||0)+(t.running||0),a=n.total_hints||n.total||0,o=n.health_score||0,s=r.total||0,c=e=>document.getElementById(e);c(`state-agents`)&&(c(`state-agents`).textContent=i||`—`),c(`state-memory`)&&(c(`state-memory`).textContent=a||`—`),c(`state-executions`)&&(c(`state-executions`).textContent=s.toLocaleString()||`—`),c(`state-resolve-rate`)&&(c(`state-resolve-rate`).textContent=n.health_score?Math.round(o*100)+`%`:`—`),document.querySelectorAll(`.side-stat.skeleton`).forEach(e=>e.classList.remove(`skeleton`)),c(`mem-total`)&&(c(`mem-total`).textContent=a,c(`mem-active`).textContent=n.active||0,c(`mem-decaying`).textContent=n.decaying||0,c(`mem-quarantined`).textContent=n.quarantined||0)}function w(){let e=new EventSource(`/api/snapshot/live`),t=0;e.addEventListener(`snapshot`,e=>{try{let n=JSON.parse(e.data),r=n.tick||0;r!==t&&(t=r,C(n))}catch{}}),e.onerror=()=>{e.close(),setTimeout(w,15e3)}}async function T(){try{let e=await fetch(`/api/snapshot`);if(e.ok){let t=await e.json();t.snapshot&&C(t.snapshot)}}catch{}}T();function E(){let e=new EventSource(`/api/signals/live`);e.addEventListener(`signal`,e=>{try{let t=JSON.parse(e.data),n=document.getElementById(`signals-container`);if(!n)return;let r=n.querySelectorAll(`.signal-item`);r.length>=6&&r[r.length-1].remove();let i=document.createElement(`div`);i.className=`signal-item`,i.innerHTML=`
        <span class="signal-sev ${t.severity||`low`}"></span>
        <span class="signal-name">${t.signal||`event`}</span>
        <span class="signal-agent">${t.agent_id||`system`}</span>
      `,n.prepend(i)}catch{}}),e.onerror=()=>{e.close(),setTimeout(E,8e3)}}(function(){let e=document.getElementById(`neural-canvas`);if(!e)return;let t=e.getContext(`2d`),n,r,i;function a(){i=Math.min(window.devicePixelRatio||1,2);let a=e.getBoundingClientRect();n=a.width,r=a.height,e.width=n*i,e.height=r*i,t.setTransform(i,0,0,i,0,0)}a(),window.addEventListener(`resize`,a);let o=Array.from({length:14},(e,t)=>({x:40+Math.random()*(n-80),y:30+Math.random()*(r-60),vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:2+Math.random()*3,phase:Math.random()*Math.PI*2,hue:t<5?160:t<9?230:260})),s=[];function c(e,t){s.push({x:e.x,y:e.y,tx:t.x,ty:t.y,progress:0,speed:.008+Math.random()*.012,size:1+Math.random()*1.5,alpha:.6+Math.random()*.4})}let l=0;function u(){t.clearRect(0,0,n,r),l++,o.forEach(e=>{e.x+=e.vx,e.y+=e.vy,(e.x<20||e.x>n-20)&&(e.vx*=-1),(e.y<20||e.y>r-20)&&(e.vy*=-1),e.x=Math.max(10,Math.min(n-10,e.x)),e.y=Math.max(10,Math.min(r-10,e.y))});for(let e=0;e<o.length;e++)for(let n=e+1;n<o.length;n++){let r=o[n].x-o[e].x,i=o[n].y-o[e].y,a=Math.sqrt(r*r+i*i);if(a<130){let r=(1-a/130)*.15;t.beginPath(),t.moveTo(o[e].x,o[e].y),t.lineTo(o[n].x,o[n].y),t.strokeStyle=`rgba(129,140,248,${r})`,t.lineWidth=.5,t.stroke(),Math.random()<.003&&c(o[e],o[n])}}for(let e=s.length-1;e>=0;e--){let n=s[e];if(n.progress+=n.speed,n.progress>=1){s.splice(e,1);continue}let r=n.x+(n.tx-n.x)*n.progress,i=n.y+(n.ty-n.y)*n.progress,a=n.alpha*Math.sin(n.progress*Math.PI);t.beginPath(),t.arc(r,i,n.size,0,Math.PI*2),t.fillStyle=`rgba(52,211,153,${a})`,t.fill()}o.forEach(e=>{let n=.6+.4*Math.sin(l*.02+e.phase),r=t.createRadialGradient(e.x,e.y,0,e.x,e.y,e.r*4);r.addColorStop(0,`hsla(${e.hue},70%,65%,${.15*n})`),r.addColorStop(1,`hsla(${e.hue},70%,65%,0)`),t.beginPath(),t.arc(e.x,e.y,e.r*4,0,Math.PI*2),t.fillStyle=r,t.fill(),t.beginPath(),t.arc(e.x,e.y,e.r*n,0,Math.PI*2),t.fillStyle=`hsla(${e.hue},70%,75%,${.8*n})`,t.fill()}),requestAnimationFrame(u)}u()})(),document.querySelectorAll(`a[href^="#"]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let n=document.querySelector(e.getAttribute(`href`));n&&n.scrollIntoView({behavior:`smooth`,block:`start`})})});