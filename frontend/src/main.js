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

// Load observed session for recursive observability section
loadObservedSession();

function loadObservedSession() {
  api('/api/observed-sessions?limit=1').then(data => {
    const grid = document.getElementById('recursive-grid');
    if (!grid) return;
    if (data && data.sessions && data.sessions.length > 0) {
      const s = data.sessions[0];
      grid.innerHTML = `
        <div class="rec-metrics">
          <div class="rec-metric"><span class="rec-metric-val">${Math.floor(s.duration_min / 60)}h ${s.duration_min % 60}m</span><span class="rec-metric-lbl">Session</span></div>
          <div class="rec-metric"><span class="rec-metric-val">${s.total_estimated_waste_min}m</span><span class="rec-metric-lbl">Wasted</span></div>
          <div class="rec-metric"><span class="rec-metric-val">${s.observed_behaviors.length}</span><span class="rec-metric-lbl">Failures</span></div>
          <div class="rec-metric"><span class="rec-metric-val">${s.interventions.length}</span><span class="rec-metric-lbl">Interventions</span></div>
        </div>
        <div class="rec-chain">
          <div class="rec-chain-lbl">Propagation Chain</div>
          <div class="rec-chain-path">${s.propagation_chain.replace(/ → /g, '<span class="rec-arrow">→</span>')}</div>
        </div>
        <div class="rec-behaviors">
          <div class="rec-section-lbl">Observed</div>
          <ul>${s.observed_behaviors.map(b => '<li>' + b + '</li>').join('')}</ul>
        </div>
        <div class="rec-interventions">
          <div class="rec-section-lbl">Interventions</div>
          ${s.interventions.map(i => '<div class="rec-int"><span class="rec-int-trig">' + i.trigger + '</span><span class="rec-int-arr">→</span><span class="rec-int-action">' + i.action + '</span><span class="rec-int-arr">→</span><span class="rec-int-res">' + i.result + '</span></div>').join('')}
        </div>
        <div class="rec-compression">
          <div class="rec-section-lbl">Compression</div>
          <blockquote>${s.compression}</blockquote>
        </div>
        ${s.pre_drift_signals ? `
        <div class="rec-signals">
          <div class="rec-section-lbl">Pre-Drift Signals</div>
          <div class="rec-signal-table">
            ${s.pre_drift_signals.map(sig => `
              <div class="rec-signal-row">
                <span class="rec-signal-name">${sig.signal}</span>
                <span class="rec-signal-arrow">→</span>
                <span class="rec-signal-dynamic">${sig.observed_before}</span>
                ${sig.retries_before_kill ? `<span class="rec-signal-meta">${sig.retries_before_kill} retries</span>` : ''}
                ${sig.false_assumptions ? `<span class="rec-signal-meta">${sig.false_assumptions} assumptions</span>` : ''}
                ${sig.scope_expansions ? `<span class="rec-signal-meta">${sig.scope_expansions} expansions</span>` : ''}
                ${sig.verified_false_positives ? `<span class="rec-signal-meta">${sig.verified_false_positives} false OKs</span>` : ''}
                ${sig.drift_detected_at_min ? `<span class="rec-signal-meta">detected at ${sig.drift_detected_at_min}m</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}
      `;
    } else {
      grid.innerHTML = '<div class="rec-empty">No observed sessions yet.</div>';
    }
  });
}

function renderBoot() {
  const reg = state.registered.v || [];
  setText('reg-count', reg.length);
  if (reg.length > 0) renderAgents(reg);
  loadDynamics();
  loadDynamicsSidebar();
}

async function loadDynamics() {
  const body = document.getElementById('fd-body');
  if (!body) return;
  try {
    const data = await api('/api/failure-dynamics?sort=time');
    if (data && data.dynamics && data.dynamics.length > 0) {
      body.innerHTML = data.dynamics.map(d => {
        const sevCls = d.severity === 'critical' ? 'sev-critical' : 'sev-high';
        const nameShort = d.short || d.name;
        const intCount = d.interventions ? d.interventions.length : 0;
        return `<div class="fd-row">
          <div class="fd-name ${sevCls}">${nameShort}</div>
          <div class="fd-desc">${d.alias} <span class="fd-int-count">${intCount} interventions</span></div>
          <div class="fd-cases">${d.total_cases}<span> cases</span></div>
          <div class="fd-time">${d.total_time_wasted_min}<span> min</span></div>
        </div>`;
      }).join('');
      const total = data.dynamics.reduce((s, d) => s + d.total_cases, 0);
      const title = document.getElementById('dynamics-title');
      if (title) title.textContent = 'Top Failure Dynamics (' + total + ' cases)';
      return;
    }
    body.innerHTML = '<div class="fd-row"><div class="fd-desc">No dynamics data</div></div>';
  } catch(e) {
    body.innerHTML = '<div class="fd-row"><div class="fd-desc">Failed to load</div></div>';
  }
}

async function loadDynamicsSidebar() {
  const container = document.getElementById('dynamics-container');
  if (!container) return;
  try {
    const data = await api('/api/failure-dynamics?sort=cases&limit=5');
    if (data && data.dynamics && data.dynamics.length > 0) {
      container.innerHTML = data.dynamics.map(d => {
        const sevCls = d.severity === 'critical' ? 'sev-critical' : 'sev-high';
        const interventions = d.interventions || [];
        return `<div class="dyn-item">
          <div class="dyn-top">
            <span class="dyn-name">${d.short || d.name}</span>
            <span class="dyn-sev ${sevCls}">${d.severity}</span>
          </div>
          <div class="dyn-alias">${d.alias}</div>
          <div class="dyn-stats">${d.total_cases} cases · ${d.total_time_wasted_min} min</div>
          ${interventions.length > 0 ? '<div class="dyn-ints">' + interventions.slice(0, 2).map(i => '<span class="dyn-int">' + i.action.slice(0, 60) + '…</span>').join('') + '</div>' : ''}
        </div>`;
      }).join('');
      return;
    }
    container.innerHTML = '<div class="dyn-item"><div class="dyn-name">No dynamics</div></div>';
  } catch {
    container.innerHTML = '<div class="dyn-item"><div class="dyn-name">Failed to load</div></div>';
  }
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
  setNavStatus('connected');

  es.addEventListener('connected', () => {
    setNavStatus('connected');
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
    setNavStatus('disconnected');
    es.close();
    setTimeout(connectEventsSSE, 5000);
  };
}

function setNavStatus(status) {
  const dot = document.getElementById('nav-status-dot');
  const text = document.getElementById('nav-status-text');
  if (dot) {
    dot.className = 'nav-status-dot ' + status;
  }
  if (text) {
    text.textContent = status;
  }
  const el = document.getElementById('nav-status');
  if (el) {
    el.className = 'nav-status ' + status;
  }
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

  // Remove skeleton from side-stats when data arrives
  document.querySelectorAll('.side-stat.skeleton').forEach(s => s.classList.remove('skeleton'));

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

// ====== Neural Network Canvas Animation ======
(function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Nodes
  const NODE_COUNT = 14;
  const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
    x: 40 + Math.random() * (w - 80),
    y: 30 + Math.random() * (h - 60),
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: 2 + Math.random() * 3,
    phase: Math.random() * Math.PI * 2,
    hue: i < 5 ? 160 : (i < 9 ? 230 : 260), // emerald → indigo → purple
  }));

  // Connection threshold
  const CONN_DIST = 130;

  // Particles traveling along connections
  const particles = [];

  function spawnParticle(from, to) {
    particles.push({
      x: from.x, y: from.y,
      tx: to.x, ty: to.y,
      progress: 0,
      speed: 0.008 + Math.random() * 0.012,
      size: 1 + Math.random() * 1.5,
      alpha: 0.6 + Math.random() * 0.4,
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, w, h);
    frame++;

    // Update node positions (slow drift)
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 20 || n.x > w - 20) n.vx *= -1;
      if (n.y < 20 || n.y > h - 20) n.vy *= -1;
      n.x = Math.max(10, Math.min(w - 10, n.x));
      n.y = Math.max(10, Math.min(h - 10, n.y));
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONN_DIST) {
          const alpha = (1 - dist / CONN_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(129,140,248,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Randomly spawn traveling particle
          if (Math.random() < 0.003) {
            spawnParticle(nodes[i], nodes[j]);
          }
        }
      }
    }

    // Draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.progress += p.speed;
      if (p.progress >= 1) {
        particles.splice(i, 1);
        continue;
      }
      const px = p.x + (p.tx - p.x) * p.progress;
      const py = p.y + (p.ty - p.y) * p.progress;
      const fadeAlpha = p.alpha * Math.sin(p.progress * Math.PI);
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(52,211,153,${fadeAlpha})`;
      ctx.fill();
    }

    // Draw nodes
    nodes.forEach(n => {
      const pulse = 0.6 + 0.4 * Math.sin(frame * 0.02 + n.phase);

      // Outer glow
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
      grad.addColorStop(0, `hsla(${n.hue},70%,65%,${0.15 * pulse})`);
      grad.addColorStop(1, `hsla(${n.hue},70%,65%,0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${n.hue},70%,75%,${0.8 * pulse})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
