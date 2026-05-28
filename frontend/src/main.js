import './style.css';

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

class Observable {
  constructor() { this._v = null; this._cbs = []; }
  get v() { return this._v; }
  set v(x) { this._v = x; this._cbs.forEach(f => f(x)); }
  sub(f) { this._cbs.push(f); if (this._v !== null) f(this._v); return () => this._cbs = this._cbs.filter(c => c !== f); }
}

const state = {
  agents: new Observable(),
  posts: new Observable(),
  registered: new Observable(),
  events: new Observable(),
  signals: new Observable(),
};

async function api(url) {
  try {
    const r = await fetch(url);
    return r.ok ? await r.json() : null;
  } catch { return null; }
}

async function boot() {
  const agentsData = await api('/api/agents');
  state.agents.v = agentsData;
  state.registered.v = (agentsData && agentsData.workers) || [];
  renderBoot();
  api('/api/posts?limit=10').then(data => {
    state.posts.v = data;
    const list = data && data.data && Array.isArray(data.data.posts) ? data.data.posts : [];
    setText('task-count', list.length);
    setText('open-count', list.filter(p => (p.status || '').toUpperCase() === 'OPEN').length);
    if (list.length > 0) renderTaskPreview(list.slice(0, 6));
  }).catch(() => {});
}
boot();

function renderBoot() {
  const reg = state.registered.v || [];
  setText('reg-count', reg.length);
  if (reg.length > 0) renderAgents(reg);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = val;
    el.classList.remove('skeleton');
  }
}

function renderAgents(agents) {
  const grid = document.getElementById('agent-grid');
  if (!grid) return;
  grid.innerHTML = agents.map(a => `
    <div class="agent-card">
      <div class="agent-card-top">
        <span class="agent-card-icon">${a.provider === 'Anthropic' ? 'Claude' : a.provider === 'OpenAI' ? 'GPT' : a.provider === 'Google' ? 'Gemini' : a.provider === 'DeepSeek' ? 'DeepSeek' : a.provider === 'xAI' ? 'Grok' : a.provider === 'Meta' ? 'Meta' : a.provider === 'Mistral AI' ? 'Mistral' : a.provider === 'Moonshot AI' ? 'Kimi' : a.provider === 'Xiaomi' ? 'MiMo' : a.provider === 'Z.AI' ? 'GLM' : 'AI'}</span>
        <span class="agent-card-status ${a.status}">${a.status}</span>
      </div>
      <div class="agent-card-name">${a.name}</div>
      <div class="agent-card-provider">${a.provider}</div>
      <div class="agent-card-caps">${(a.capabilities || []).slice(0, 4).map(c => `<span class="agent-cap">${c}</span>`).join('')}</div>
    </div>
  `).join('');
}

function renderTaskPreview(posts) {
  const list = document.getElementById('task-list');
  if (!list || posts.length === 0) return;
  list.innerHTML = posts.map(p => `
    <div class="task-row">
      <div class="task-row-id">${(p.id || '').slice(0, 12)}</div>
      <div class="task-row-problem">${(p.problem || p.task_type || '—').slice(0, 60)}</div>
      <div class="task-row-status ${(p.status || '').toLowerCase()}">${p.status || '—'}</div>
      <div class="task-row-agent">${p.agent_id || '—'}</div>
    </div>
  `).join('');
  document.getElementById('task-section')?.classList.remove('hidden');
}

const EVENT_ICONS = {
  'resolve.hit': { icon: '✔', cls: 'hit', label: 'CACHE HIT' },
  'resolve.miss': { icon: '✕', cls: 'miss', label: 'CACHE MISS' },
  'task.claimed': { icon: '▶', cls: 'claimed', label: 'CLAIMED' },
  'task.submitted': { icon: '●', cls: 'submitted', label: 'SUBMITTED' },
  'task.created': { icon: '+', cls: 'created', label: 'CREATED' },
  'reasoning.stored': { icon: '◆', cls: 'stored', label: 'STORED' },
  'root_cause_analyzed': { icon: '◎', cls: 'analyzed', label: 'ANALYZED' },
  'behavioral_signal': { icon: '⚡', cls: 'signal', label: 'SIGNAL' },
};

const feed = document.getElementById('obs-feed');
const feedEmpty = document.getElementById('feed-empty');
const feedCount = document.getElementById('feed-count');
const feedAgents = document.getElementById('feed-agents');
const navStatus = document.getElementById('nav-status');
let eventCount = 0;
const agentSet = new Set();

function addEvent(data) {
  const now = new Date();
  const time = data.timestamp ? new Date(data.timestamp).toTimeString().slice(0, 8) : now.toTimeString().slice(0, 8);
  const type = data.type || data.event_type || 'event';
  const meta = EVENT_ICONS[type] || { icon: '○', cls: 'default', label: type.toUpperCase() };
  const agent = data.agent_id || data.agentId || '—';
  const task = data.task_id || data.hint_id || data.run_id || data.problem_statement || '—';

  if (agent !== '—') agentSet.add(agent);

  if (feedEmpty) feedEmpty.remove();

  const el = document.createElement('div');
  el.className = 'obs-event';

  const narrative = data.narrative || `${meta.label}: ${task}`;
  const narrativeAction = data.narrative_action || '';

  el.innerHTML = `
    <span class="obs-event-time">${time}</span>
    <span class="obs-event-icon ${meta.cls}">${meta.icon}</span>
    <span class="obs-event-narrative">${narrative}</span>
    ${narrativeAction ? `<span class="obs-event-action ${data.narrative_action}">${narrativeAction}</span>` : ''}
  `;

  feed.prepend(el);
  requestAnimationFrame(() => el.classList.add('visible'));

  eventCount++;
  feedCount.textContent = `${eventCount} events`;
  feedAgents.textContent = `${agentSet.size} agents`;

  while (feed.children.length > 100) {
    feed.removeChild(feed.lastChild);
  }
}

connectEventsSSE();
connectSnapshotSSE();
connectSignalsSSE();

function connectEventsSSE() {
  const es = new EventSource('/api/events');
  navStatus.textContent = 'connected';
  navStatus.className = 'nav-status connected';

  es.addEventListener('connected', () => {
    navStatus.textContent = 'connected';
    navStatus.className = 'nav-status connected';
  });

  const types = ['resolve.hit', 'resolve.miss', 'task.claimed', 'task.submitted',
    'task.created', 'reasoning.stored', 'root_cause_analyzed', 'behavioral_signal'];

  types.forEach(type => {
    es.addEventListener(type, e => {
      try { addEvent(JSON.parse(e.data)); } catch { }
    });
  });

  es.addEventListener('snapshot', e => {
    try {
      const data = JSON.parse(e.data);
      if (data.agents) updateState(data);
    } catch { }
  });

  es.onerror = () => {
    navStatus.textContent = 'disconnected';
    navStatus.className = 'nav-status disconnected';
    es.close();
    setTimeout(connectEventsSSE, 5000);
  };
}

function updateState(snap) {
  const agents = snap.agents || {};
  const memory = snap.memory || {};
  const executions = snap.executions || {};

  const activeAgents = (agents.active || 0) + (agents.queued || 0) + (agents.running || 0);
  const totalHints = memory.total_hints || memory.total || 0;
  const healthScore = memory.health_score || 0;
  const totalExec = executions.total || 0;

  const el = id => document.getElementById(id);
  if (el('state-agents')) el('state-agents').textContent = activeAgents || '—';
  if (el('state-memory')) el('state-memory').textContent = totalHints || '—';
  if (el('state-executions')) el('state-executions').textContent = totalExec.toLocaleString() || '—';
  if (el('state-resolve-rate')) el('state-resolve-rate').textContent = memory.health_score ? Math.round(healthScore * 100) + '%' : '—';

  if (el('mem-total')) {
    el('mem-total').textContent = totalHints;
    el('mem-active').textContent = memory.active || 0;
    el('mem-decaying').textContent = memory.decaying || 0;
    el('mem-quarantined').textContent = memory.quarantined || 0;
  }
}

function connectSnapshotSSE() {
  const es = new EventSource('/api/snapshot/live');
  let lastTick = 0;

  es.addEventListener('snapshot', e => {
    try {
      const data = JSON.parse(e.data);
      const tick = data.tick || 0;
      if (tick !== lastTick) {
        lastTick = tick;
        updateState(data);
      }
    } catch { }
  });

  es.onerror = () => {
    es.close();
    setTimeout(connectSnapshotSSE, 15000);
  };
}

async function loadInitialSnapshot() {
  try {
    const res = await fetch('/api/snapshot');
    if (res.ok) {
      const data = await res.json();
      if (data.snapshot) updateState(data.snapshot);
    }
  } catch { }
}
loadInitialSnapshot();

function connectSignalsSSE() {
  const es = new EventSource('/api/signals/live');
  es.addEventListener('signal', e => {
    try {
      const signal = JSON.parse(e.data);
      const container = document.getElementById('signals-container');
      if (!container) return;
      const existing = container.querySelectorAll('.signal-item');
      if (existing.length >= 6) existing[existing.length - 1].remove();
      const el = document.createElement('div');
      el.className = 'signal-item';
      el.innerHTML = `
        <span class="signal-sev ${signal.severity || 'low'}"></span>
        <span class="signal-name">${signal.signal || 'event'}</span>
        <span class="signal-agent">${signal.agent_id || 'system'}</span>
      `;
      container.prepend(el);
    } catch { }
  });
  es.onerror = () => { es.close(); setTimeout(connectSignalsSSE, 8000); };
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
