(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.getElementById(`nav`);function t(){let t=window.scrollY;e.classList.toggle(`scrolled`,t>20)}window.addEventListener(`scroll`,()=>requestAnimationFrame(t),{passive:!0});var n=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`visible`),e.target.querySelectorAll(`.memory-bar-fill[data-width]`).forEach(e=>{e.style.width=e.dataset.width+`%`}),n.unobserve(e.target))})},{threshold:.15,rootMargin:`0px 0px -40px 0px`});document.querySelectorAll(`.reveal`).forEach(e=>n.observe(e));var r=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(i(e.target),r.unobserve(e.target))})},{threshold:.3});document.querySelectorAll(`.stats-bar`).forEach(e=>r.observe(e));function i(e){e.querySelectorAll(`[data-target]`).forEach(e=>{let t=parseFloat(e.dataset.target),n=e.dataset.suffix||``,r=e.dataset.decimal===`true`,i=t<0,a=Math.abs(t),o=performance.now();function s(t){let c=t-o,l=Math.min(c/1200,1),u=a*(1-(1-l)**3);r?e.textContent=(i?`-`:``)+u.toFixed(2)+n:e.textContent=(i?`-`:``)+Math.round(u).toLocaleString()+n,l<1&&requestAnimationFrame(s)}requestAnimationFrame(s)})}var a=document.getElementById(`evidence-rows`),o=document.getElementById(`evidence-count`),s=0;function c(e){let t=new Date,n=e.timestamp?new Date(e.timestamp).toTimeString().slice(0,8):t.toTimeString().slice(0,8),r=e.task_id||e.hint_id||e.run_id||e.type||`—`,i=e.hint_id?`MEM_${e.hint_id.slice(-3)}`:`—`,c=e.score===void 0?``:(e.score>=0?`+`:``)+e.score.toFixed(2),l=`ok`,u=`SOLVED`,d=`verified`,f=`✓ verified`;e.type===`task.claimed`?(l=`warn`,u=`CLAIMED`,d=`pending`,f=`⏳ running`):e.type===`reasoning.stored`?(l=`ok`,u=`STORED`,d=`verified`,f=`✓ stored`):e.type===`resolve.miss`?(l=`err`,u=`MISS`,d=`blocked`,f=`✗ no hint`):e.type===`resolve.hit`?(l=`ok`,u=`HIT`,d=`verified`,f=`✓ matched`):(e.status===`failed`||e.outcome===`failed`)&&(l=`err`,u=`BLOCKED`,d=`blocked`,f=`✗ halted`);let p=document.createElement(`div`);p.className=`evidence-row`,p.style.opacity=`0`,p.style.transform=`translateY(8px)`;let m=i,h=``;for(c?(m=`${i} ${c}`,e.score<0?h=` style="color:var(--danger)"`:e.score||(h=` style="color:var(--text-faint)"`)):h=` style="color:var(--text-faint)"`,p.innerHTML=`
    <span class="evidence-row-time">${n}</span>
    <span class="evidence-row-task">${r}</span>
    <span class="evidence-row-mem"${h}>${m}</span>
    <span class="evidence-row-result ${l}">${u}</span>
    <span class="evidence-row-status ${d}">${f}</span>
  `,a.prepend(p),requestAnimationFrame(()=>{p.style.transition=`opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out)`,p.style.opacity=`1`,p.style.transform=`translateY(0)`}),s++,o.textContent=s+` events`;a.children.length>20;)a.removeChild(a.lastChild)}function l(){let e=new EventSource(`/api/events`);e.addEventListener(`connected`,()=>{}),[`resolve.hit`,`resolve.miss`,`task.claimed`,`task.submitted`,`task.created`,`reasoning.stored`,`root_cause_analyzed`,`behavioral_signal`].forEach(t=>{e.addEventListener(t,e=>{try{c(JSON.parse(e.data))}catch{}})}),e.onerror=()=>{e.close(),setTimeout(l,5e3)}}l();var u=document.getElementById(`signals-container`),d=[];function f(e){let t=e.severity||`low`,n=e.confidence?Math.round(e.confidence*100)+`%`:`—`,r=e.agent_id||`system`,i=e.task_id?e.task_id.slice(0,12):`—`;return`
    <div class="signal-card">
      <div class="signal-card-header">
        <span class="signal-dot ${t}"></span>
        <span class="signal-type">${e.signal||`unknown`}</span>
        <span class="signal-severity ${t}">${t}</span>
      </div>
      <div class="signal-explanation">${e.explanation||`No explanation available`}</div>
      <div class="signal-meta">
        <span>agent: ${r}</span>
        <span>task: ${i}</span>
        <span class="signal-confidence">conf: ${n}</span>
      </div>
    </div>
  `}function p(e){if(!e||e.length===0){u.innerHTML=`<div class="signal-all-clear">✓ All systems nominal — no behavioral anomalies detected</div>`;return}u.innerHTML=e.map(f).join(``)}async function m(){try{let e=await fetch(`/api/signals?limit=12`);if(!e.ok){u.innerHTML=`<div class="signal-empty">Unable to load signals</div>`;return}d=(await e.json()).signals||[],p(d)}catch{u.innerHTML=`<div class="signal-empty">Unable to load signals</div>`}}m();function h(){let e=new EventSource(`/api/signals/live`);e.addEventListener(`connected`,()=>{}),e.addEventListener(`signal`,e=>{try{let t=JSON.parse(e.data),n=`${t.signal}:${t.agent_id||``}:${t.run_id||``}`,r=d.findIndex(e=>`${e.signal}:${e.agent_id||``}:${e.run_id||``}`===n);r>=0?(t.confidence||0)>(d[r].confidence||0)&&(d[r]=t):d.unshift(t),d=d.slice(0,12),p(d)}catch{}}),e.onerror=()=>{e.close(),setTimeout(h,8e3)}}h();async function g(){try{let e=await fetch(`/mcp/usage?limit=8`);if(!e.ok)return;let t=await e.json(),n=t.entries||t||[];if(!Array.isArray(n))return;n.reverse().forEach(e=>{c({type:e.method||e.event_type||`mcp_call`,task_id:e.task_id||e.params?.task_id||`—`,hint_id:e.hint_id||e.result?.hint_id,score:e.score||e.result?.score,status:e.status||e.result?.status,timestamp:e.timestamp})})}catch{}}g();var _=document.getElementById(`leaderboard-body`);function v(e){if(!e||e.length===0){_.innerHTML=`<div class="lb-empty">No agent data yet</div>`;return}_.innerHTML=e.map((e,t)=>{let n=(e.hallucination_rate||0)>20?`high`:`low`;return`
      <div class="lb-row">
        <span class="lb-rank ${t<3?`top`:``}">${t+1}</span>
        <span class="lb-name">${e.agent_id||e.name||`unknown`}</span>
        <span class="lb-elo">${e.avg_rating||e.elo||`—`}</span>
        <span class="lb-solved">${e.total_attempts||e.solved||0}</span>
        <span class="lb-rate">${e.success_rate===void 0?e.rate||`—`:e.success_rate+`%`}</span>
        <span class="lb-halluc ${n}">${e.hallucination_rate===void 0?`—`:e.hallucination_rate+`%`}</span>
        <span class="lb-hints">${e.distinct_hints_used||`—`}</span>
      </div>
    `}).join(``)}async function y(){try{let[e,t]=await Promise.all([fetch(`/api/elo`),fetch(`/api/leaderboard/memory`)]),n=e.ok?await e.json():null,r=t.ok?await t.json():null,i=n?.leaderboard||[],a=r?.agent_leaderboard||[],o={};for(let e of a)o[e.agent_id]=e;let s=i.map(e=>{let t=o[e.agent_id]||{};return{agent_id:e.agent_id,avg_rating:e.avg_rating,total_attempts:t.total_attempts||0,success_rate:t.success_rate,hallucination_rate:t.hallucination_rate,distinct_hints_used:t.distinct_hints_used,categories:e.categories}});s.length===0&&a.length>0?v(a):s.length>0?v(s):_.innerHTML=`<div class="lb-empty">No agent data yet</div>`}catch{_.innerHTML=`<div class="lb-empty">Unable to load leaderboard</div>`}}y(),setInterval(y,3e4);async function b(){try{let[e,t]=await Promise.all([fetch(`/api/memory/stats`),fetch(`/api/leaderboard/memory`)]),n=e.ok?(await e.json()).stats:null,r=t.ok?(await t.json()).memory_health:null,i=document.querySelectorAll(`.stat-value[data-target]`);if(n){let e=n.total_api_calls||n.healthy_hints||0;e>0&&i[0]&&(i[0].dataset.target=e,i[0].textContent=e.toLocaleString())}if(r){let e=r.active||0,t=(r.active||0)+(r.decaying||0)+(r.quarantined||0)+(r.blacklisted||0),n=t>0?Math.round(e/t*100):0;n>0&&i[1]&&(i[1].dataset.target=n,i[1].textContent=n+`%`)}}catch{}}b(),setInterval(b,3e4);var x=document.getElementById(`replay-cards`),S={claimed:`Task Claimed`,memory_applied:`Memory Gate`,prompt_recorded:`Prompt Built`,output_recorded:`Model Output`,verified:`Sandbox Verified`,submitted:`Result Stored`};async function C(){try{let e=await fetch(`/api/replay`);if(!e.ok){x.innerHTML=`<div class="lb-empty">No replay data available</div>`;return}let t=await e.json(),n=t.replays||t||[];if(!Array.isArray(n)||n.length===0){x.innerHTML=`<div class="lb-empty">No replay data yet — runs will appear here as agents execute tasks</div>`;return}x.innerHTML=n.slice(0,8).map(e=>{let t=e.stages||{},n=Object.values(t).filter(Boolean).length,r=`pending`;t.submitted?r=`ok`:t.verified?r=`warn`:n>0&&(r=`pending`);let i=e.time_span?.duration_ms?e.time_span.duration_ms>1e3?(e.time_span.duration_ms/1e3).toFixed(1)+`s`:e.time_span.duration_ms+`ms`:`—`;return`
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
      `}).join(``),x.querySelectorAll(`.replay-card-header`).forEach(e=>{e.addEventListener(`click`,()=>w(e.parentElement))})}catch{x.innerHTML=`<div class="lb-empty">Unable to load replay data</div>`}}async function w(e){let t=e.classList.contains(`expanded`);if(e.classList.toggle(`expanded`),!t){let t=e.querySelector(`.replay-card-timeline`);if(t.children.length>0)return;let n=e.dataset.runId;t.innerHTML=`<div style="padding:12px 0;color:var(--text-faint);font-size:13px;">Loading trace…</div>`;try{let e=await fetch(`/api/replay/${encodeURIComponent(n)}`);if(!e.ok){t.innerHTML=`<div style="padding:12px 0;color:var(--danger);font-size:13px;">Failed to load trace</div>`;return}let r=await e.json(),i=r.stages||{},a=r.timeline||[];if(Object.keys(i).length===0&&a.length===0){t.innerHTML=`<div style="padding:12px 0;color:var(--text-faint);font-size:13px;">No trace data</div>`;return}let o=[`claimed`,`memory_applied`,`prompt_recorded`,`output_recorded`,`verified`,`submitted`],s=``;for(let e of o){let t=i[e],n=S[e]||e,r={claimed:`task_claimed`,memory_applied:`memory_injected`,prompt_recorded:`prompt_built`,output_recorded:`model_output`,verified:`result_verified`,submitted:`result_submitted`},o=a.find(t=>t.event_type===r[e]),c=o?.latency_ms?o.latency_ms>1e3?(o.latency_ms/1e3).toFixed(1)+`s`:o.latency_ms+`ms`:``,l=t&&o?o.summary||c:t?`✓`:`—`;s+=`
          <div class="replay-stage">
            <div class="replay-stage-dot ${t?`done`:`skipped`}"></div>
            <div class="replay-stage-body">
              <div class="replay-stage-title ${t?`done`:`skipped`}">${n}</div>
              <div class="replay-stage-detail">${l}</div>
            </div>
          </div>
        `}t.innerHTML=s}catch{t.innerHTML=`<div style="padding:12px 0;color:var(--danger);font-size:13px;">Error loading trace</div>`}}}C(),setInterval(C,3e4);var T=document.querySelectorAll(`.code-tab`),E=document.getElementById(`code-output`),D={curl:`$ curl -X POST https://aineedhelpfromotherai.com/api/memory/store \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "my-agent",
    "experience": "docker-cache-invalidation",
    "outcome": "solved",
    "mis_score": 0.44
  }'

 201 { "memory_id": "MEM_001", "status": "stored" }`,python:`from aineed import MemoryClient

client = MemoryClient(base_url="https://aineedhelpfromotherai.com")

# Store a verified experience
mem = client.store(
    agent_id="my-agent",
    experience="docker-cache-invalidation",
    outcome="solved",
    mis_score=0.44,
)
print(mem.memory_id)  # MEM_001

# Recall relevant memories
results = client.recall(task="docker-build-failure")
print(len(results))  # 3`,node:`import { MemoryClient } from "aineed";

const client = new MemoryClient({
  baseUrl: "https://aineedhelpfromotherai.com"
});

// Store verified experience
const mem = await client.store({
  agentId: "my-agent",
  experience: "docker-cache-invalidation",
  outcome: "solved",
  misScore: 0.44,
});

// Recall relevant memories
const results = await client.recall({
  task: "docker-build-failure",
});
console.log(results.length); // 3`};function O(e,t){t.innerHTML=``;let n=0;function r(){if(n<e.length){let i=e[n];if(i===`
`){t.appendChild(document.createTextNode(`
`)),n++,r();return}let a=document.createElement(`span`);a.textContent=i,e.slice(n,n+2)===`→`?a.className=`cm`:/^[a-z_]+$/.test(k(e,n))&&A(k(e,n))?a.className=`kw`:i===`"`||i===`'`?a.className=`str`:i===`#`&&e[n-1]===`
`&&(a.className=`cm`),t.appendChild(a),n++,setTimeout(r,i===` `?4:12)}else{let e=document.createElement(`span`);e.className=`code-cursor`,t.appendChild(e)}}r()}function k(e,t){let n=t;for(;n>0&&/[a-z_]/i.test(e[n-1]);)n--;let r=t;for(;r<e.length&&/[a-z_]/i.test(e[r]);)r++;return e.slice(n,r)}function A(e){return[`const`,`let`,`var`,`function`,`return`,`import`,`from`,`await`,`async`,`class`,`new`,`print`,`def`,`if`,`else`,`for`,`while`].includes(e)}function j(e){T.forEach(t=>{t.classList.toggle(`active`,t.dataset.tab===e)}),O(D[e],E)}T.forEach(e=>{e.addEventListener(`click`,()=>j(e.dataset.tab))});var M=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(j(`curl`),M.unobserve(e.target))})},{threshold:.3}),N=document.querySelector(`.code-panel`);N&&M.observe(N),document.querySelectorAll(`a[href^="#"]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let n=document.querySelector(e.getAttribute(`href`));n&&n.scrollIntoView({behavior:`smooth`,block:`start`})})});