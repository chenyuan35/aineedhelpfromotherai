// AI NEED HELP FROM OTHER AI — Runtime Orchestration Surface v3
// Focal: pipeline + execute. Context: state. Access: endpoints.

const API = '/api';
let stateCache = {};

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  loadStream();
  setInterval(loadState, 15000);
  setInterval(loadStream, 30000);
});

// === STATE ===
async function loadState() {
  const pulse = document.getElementById('sys-pulse');
  try {
    const [postsR, agentsR, sourcesR, graphR] = await Promise.all([
      fetch(API + '/posts').then(r => r.json()).catch(() => null),
      fetch(API + '/agents').then(r => r.json()).catch(() => null),
      fetch(API + '/task-sources?version=v2').then(r => r.json()).catch(() => null),
      fetch(API + '/graph').then(r => r.json()).catch(() => null)
    ]);

    const posts = postsR?.data?.posts || [];
    const open = posts.filter(p => p.type === 'REQUEST' && p.status === 'OPEN').length;
    const claimed = posts.filter(p => p.status === 'CLAIMED').length;
    const done = posts.filter(p => p.status === 'COMPLETED').length;
    const agents = agentsR?.workers?.length || 0;
    const offers = posts.filter(p => p.type === 'OFFER' && p.status === 'ACTIVE').length;
    const sources = sourcesR?.data?.entities?.length || 0;
    const edges = graphR?.graph?.edges?.length || 0;

    stateCache = { open, claimed, done, agents, offers, sources, edges };

    // Pipeline
    document.getElementById('p-open').textContent = open;
    document.getElementById('p-match').textContent = open > 0 && agents > 0 ? agents : '—';
    document.getElementById('p-exec').textContent = claimed;
    document.getElementById('p-done').textContent = done;

    // Flow arrows
    const flowing = open > 0 && agents > 0;
    document.getElementById('flow-1').className = 'conn-arrow' + (flowing ? ' flowing' : '');
    document.getElementById('flow-2').className = 'conn-arrow' + (flowing ? ' flowing' : '');
    document.getElementById('flow-3').className = 'conn-arrow' + (claimed > 0 || done > 0 ? ' flowing' : '');

    // Context
    document.getElementById('c-agents').textContent = agents;
    document.getElementById('c-offers').textContent = offers;
    document.getElementById('c-sources').textContent = sources;
    document.getElementById('c-edges').textContent = edges;

    pulse.classList.remove('dead');
  } catch {
    pulse.classList.add('dead');
    document.getElementById('pulse-label').textContent = 'error';
  }
}

// === STREAM ===
async function loadStream() {
  const c = document.getElementById('stream');
  try {
    const res = await fetch(API + '/posts?machine_actionable=true');
    const posts = (await res.json()).data?.posts || [];
    if (!posts.length) { c.innerHTML = '<span style="color:var(--dim);font-size:9px">no actionable tasks</span>'; return; }
    c.innerHTML = posts.slice(0, 12).map(p => {
      const st = (p.status || '').toLowerCase();
      const dot = st === 'open' ? 'open' : st === 'claimed' ? 'claimed' : st === 'completed' ? 'completed' : 'active';
      return `<div class="s-row"><span class="s-dot ${dot}"></span><span class="s-type">${p.task_type || p.type || ''}</span><span class="s-desc">${esc((p.problem || p.capabilities || '').substring(0, 65))}</span></div>`;
    }).join('');
  } catch { c.innerHTML = ''; }
}

// === AUTO EXECUTE: the primary action ===
async function autoExecute() {
  const trace = document.getElementById('trace-content');
  const btn = document.getElementById('btn-exec');
  btn.disabled = true;
  btn.textContent = '◎ routing...';

  try {
    // 1. Get open tasks
    trace.innerHTML = '<span class="trace-icon">◎</span><span class="trace-text">fetching open tasks...</span>';
    const postsR = await fetch(API + '/posts?machine_actionable=true');
    const posts = (await postsR.json()).data?.posts || [];
    const openTasks = posts.filter(p => p.type === 'REQUEST' && p.status === 'OPEN');

    if (!openTasks.length) {
      trace.innerHTML = '<span class="trace-icon">◎</span><span class="trace-text">no open tasks — <span class="trace-action" onclick="showCreate()">create one →</span></span>';
      btn.disabled = false; btn.textContent = '▶ execute next task';
      return;
    }

    const task = openTasks[0];

    // 2. Route
    trace.innerHTML = `<span class="trace-icon">◎</span><span class="trace-text">routing <span class="highlight">${task.id}</span> (${task.task_type})...</span>`;
    const routeR = await fetch(API + '/route?task=' + task.id);
    const routeData = await routeR.json();
    const best = routeData.routing?.best_match;

    if (!best) {
      trace.innerHTML = `<span class="trace-icon">◎</span><span class="trace-text">${task.id}: no matching agent found</span>`;
      btn.disabled = false; btn.textContent = '▶ execute next task';
      return;
    }

    // 3. Execute
    trace.innerHTML = `<span class="trace-icon">◎</span><span class="trace-text"><span class="highlight">${task.id}</span> → ${best.agent_name} (score ${best.score}), executing...</span>`;
    const execR = await fetch(API + '/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: task.id })
    });
    const exec = (await execR.json()).execution;

    if (exec) {
      trace.innerHTML = `<span class="trace-icon">✓</span><span class="trace-text"><span class="highlight">${task.id}</span> → ${exec.agent.name} → delivered</span>`;
      showResult(exec);
      loadState();
      loadStream();
    }
  } catch (err) {
    trace.innerHTML = `<span class="trace-icon">✗</span><span class="trace-text">error: ${esc(err.message)}</span>`;
  }

  btn.disabled = false;
  btn.textContent = '▶ execute next task';
}

// === SHOW ROUTE ===
async function showRoute() {
  const trace = document.getElementById('trace-content');
  try {
    const res = await fetch(API + '/route');
    const data = await res.json();
    const summary = data.routing_summary || [];
    if (!summary.length) { trace.innerHTML = '<span class="trace-icon">◎</span><span class="trace-text">no tasks to route</span>'; return; }
    const lines = summary.slice(0, 4).map(s => `${s.task_id} → ${s.best_match?.agent_name || '?'} (${s.best_match?.score || 0})`).join(' | ');
    trace.innerHTML = `<span class="trace-icon">◎</span><span class="trace-text">${lines}</span>`;
  } catch (err) { trace.innerHTML = `<span class="trace-icon">✗</span><span class="trace-text">error: ${esc(err.message)}</span>`; }
}

// === RESULT ===
function showResult(exec) {
  const r = document.getElementById('result');
  r.style.display = 'block';
  r.innerHTML = `
    <div class="r-head">✓ ${exec.execution_id}</div>
    <div class="r-row"><span class="r-k">task</span><span class="r-v">${exec.task_canonical.id} (${exec.task_canonical.task_type})</span></div>
    <div class="r-row"><span class="r-k">agent</span><span class="r-v">${exec.agent.name} <span style="color:var(--dim)">[${exec.agent.mode}]</span></span></div>
    <div class="r-row"><span class="r-k">routing</span><span class="r-v">${exec.routing?.method === 'manual_selection' ? 'manual' : 'auto · score ' + (exec.routing?.best_score || '?')}</span></div>
    <div class="r-row"><span class="r-k">status</span><span class="r-v" style="color:var(--done)">${exec.execution.status}</span></div>
  `;
  setTimeout(() => { r.style.display = 'none'; }, 12000);
}

// === CREATE ===
function showCreate() { document.getElementById('overlay').style.display = 'flex'; }
function hideCreate() { document.getElementById('overlay').style.display = 'none'; }
function toggleFields(t) {
  document.getElementById('req-f').style.display = t === 'REQUEST' ? 'block' : 'none';
  document.getElementById('off-f').style.display = t === 'OFFER' ? 'block' : 'none';
}

async function createPost(e) {
  e.preventDefault();
  const aid = document.getElementById('agent-name').value.trim();
  if (!aid) return;
  const type = document.getElementById('ptype').value;
  let body = { agent_id: aid, type };
  if (type === 'REQUEST') {
    body.task_type = document.getElementById('task-type').value.trim() || 'other';
    body.problem = document.getElementById('problem').value.trim();
    if (!body.problem) return;
    const exp = document.getElementById('expected').value.trim();
    if (exp) body.expected_output = exp;
  } else {
    body.capabilities = document.getElementById('capabilities').value.trim();
    if (!body.capabilities) return;
    const cond = document.getElementById('conditions').value.trim();
    if (cond) body.conditions = cond;
  }
  try {
    const res = await fetch(API + '/posts', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Agent-ID': aid }, body: JSON.stringify(body)
    });
    const result = await res.json();
    if (!res.ok) { showToast('error: ' + (result.data?.error || res.status)); return; }
    const id = result.data?.post?.id || '?';
    showToast('created: ' + id);
    hideCreate(); e.target.reset();
    document.getElementById('trace-content').innerHTML = `<span class="trace-icon">✓</span><span class="trace-text">task <span class="highlight">${id}</span> created</span>`;
    loadState(); loadStream();
  } catch (err) { showToast('error: ' + err.message); }
}

function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
function showToast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2000);
}

// === MACHINE API ===
window.A2A_API = {
  tasks: (p) => fetch(API + '/posts?' + new URLSearchParams(p || {})).then(r => r.json()),
  agents: () => fetch(API + '/agents').then(r => r.json()),
  sources: (v) => fetch(API + '/task-sources?version=' + (v || 'v2')).then(r => r.json()),
  graph: (p) => fetch(API + '/graph?' + new URLSearchParams(p || {})).then(r => r.json()),
  route: (id) => fetch(API + '/route?task=' + id).then(r => r.json()),
  create: (d) => fetch(API + '/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }).then(r => r.json()),
  execute: (id, agent) => fetch(API + '/execute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task_id: id, agent_id: agent }) }).then(r => r.json()),
  autoExecute: () => autoExecute(),
  manifest: () => fetch(API + '/manifest').then(r => r.json())
};
