import './style.css';

/* =============================================
   AI ACTIVITY OBSERVATORY
   All data from real API — no mocks, no fallbacks
   ============================================= */

// --- Nav scroll ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// =============================================
// 1. LIVE ACTIVITY FEED — SSE from /api/events
// =============================================
const feed = document.getElementById('obs-feed');
const feedEmpty = document.getElementById('feed-empty');
const feedCount = document.getElementById('feed-count');
const feedAgents = document.getElementById('feed-agents');
const navStatus = document.getElementById('nav-status');
let eventCount = 0;
const agentSet = new Set();
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
  el.className = `obs-event ${meta.cls}`;

  const memDisplay = data.score !== undefined
    ? (data.score >= 0 ? '+' : '') + Number(data.score).toFixed(2)
    : data.hint_id
      ? data.hint_id.slice(0, 8)
      : '';

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
      try { addEvent(JSON.parse(e.data)); } catch { /* skip malformed */ }
    });
  });

  es.addEventListener('snapshot', e => {
    try {
      const data = JSON.parse(e.data);
      if (data.agents) updateState(data);
    } catch { /* skip */ }
  });

  es.onerror = () => {
    navStatus.textContent = 'disconnected';
    navStatus.className = 'nav-status disconnected';
    es.close();
    setTimeout(connectEventsSSE, 5000);
  };
}
connectEventsSSE();

// =============================================
// 2. SYSTEM STATE — SSE from /api/snapshot/live
// =============================================
function updateState(snap) {
  const agents = snap.agents || {};
  const memory = snap.memory || {};
  const executions = snap.executions || {};

  const activeAgents = (agents.active || 0) + (agents.queued || 0) + (agents.running || 0);
  const totalHints = memory.total_hints || memory.total || 0;
  const activeHints = memory.active || 0;
  const healthScore = memory.health_score || 0;
  const totalExec = executions.total || 0;

  const el = id => document.getElementById(id);
  const bar = id => document.getElementById(id);

  if (el('state-agents')) {
    el('state-agents').textContent = activeAgents;
    el('state-bar-agents').style.width = Math.min(activeAgents * 8, 100) + '%';
  }
  if (el('state-memory')) {
    el('state-memory').textContent = Math.round(healthScore * 100) + '%';
    el('state-bar-memory').style.width = Math.round(healthScore * 100) + '%';
  }
  if (el('state-executions')) {
    el('state-executions').textContent = totalExec.toLocaleString();
    el('state-bar-executions').style.width = Math.min(totalExec / 30, 100) + '%';
  }

  if (el('mem-total')) {
    el('mem-total').textContent = totalHints;
    el('mem-active').textContent = activeHints;
    el('mem-decaying').textContent = memory.decaying || 0;
    el('mem-quarantined').textContent = memory.quarantined || 0;

    if (totalHints > 0) {
      const aPct = (activeHints / totalHints) * 100;
      const dPct = ((memory.decaying || 0) / totalHints) * 100;
      const qPct = ((memory.quarantined || 0) / totalHints) * 100;
      el('mem-active-seg').style.background = `conic-gradient(var(--success) 0% ${aPct}%, var(--warning) ${aPct}% ${aPct + dPct}%, var(--danger) ${aPct + dPct}% ${aPct + dPct + qPct}%)`;
    }
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
    } catch { /* skip */ }
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
  } catch { /* will get data from SSE */ }
}
loadInitialSnapshot();
connectSnapshotSSE();

// =============================================
// 3. AGENT PROFILES — behavioral identity
// =============================================
const agentProfileCache = new Map(); // agent_id → profile

async function fetchAgentProfiles() {
  try {
    const res = await fetch('/api/agents/profiles');
    if (!res.ok) return;
    const data = await res.json();
    if (!data.profiles) return;
    agentProfileCache.clear();
    for (const p of data.profiles) {
      agentProfileCache.set(p.agent_id, p);
    }
    // Re-render leaderboard with profile data
    renderLeaderboard(currentLeaderboard);
  } catch { /* profiles are enrichment, not required */ }
}

function getTraitsHtml(traits) {
  if (!traits || traits.length === 0) return '';
  const LABELS = {
    high_consensus_reliability: 'reliable',
    moderate_success_rate: 'moderate',
    frequent_failures: 'unstable',
    skilled_executor: 'skilled',
    competent_executor: 'competent',
    hallucination_prone: 'hallucinates',
    retries_excessively: 'retries',
    unfocused_execution: 'unfocused',
    deviates_from_objective: 'deviates',
    long_execution_paths: 'wanders',
    clean_behavior_record: 'clean',
  };
  return traits.slice(0, 3).map(t => {
    const label = LABELS[t] || t.replace(/_/g, ' ').slice(0, 10);
    return `<span class="lb-trait ${t}">${label}</span>`;
  }).join('');
}

function getSpecialtyIcon(specialty) {
  const icons = {
    high_reliability: '🛡',
    high_risk: '⚡',
    security: '🔐',
    generalist: '○',
  };
  return icons[specialty] || '○';
}

// =============================================
// 4. LEADERBOARD — REST API + Profiles
// =============================================
const leaderboardBody = document.getElementById('leaderboard-body');
let currentLeaderboard = [];

function renderLeaderboard(agents) {
  currentLeaderboard = agents || [];
  if (!agents || agents.length === 0) {
    leaderboardBody.innerHTML = '<div class="lb-empty">No agent data yet</div>';
    return;
  }
  leaderboardBody.innerHTML = agents.map((a, i) => {
    const hc = (a.hallucination_rate || 0) > 20 ? 'high' : 'low';
    const profile = agentProfileCache.get(a.agent_id || a.name);
    const traits = profile?.behavioral_traits || [];
    const specialty = profile?.specialty || '';
    const trustLevel = profile?.trust?.level || '';
    return `
      <div class="lb-row" data-agent="${a.agent_id || a.name}">
        <span class="lb-rank ${i < 3 ? 'top' : ''}">${i + 1}</span>
        <span class="lb-name">
          ${specialty ? `<span class="lb-specialty-icon">${getSpecialtyIcon(specialty)}</span>` : ''}
          ${a.agent_id || a.name || 'unknown'}
          ${trustLevel ? `<span class="lb-trust ${trustLevel}"></span>` : ''}
        </span>
        <span class="lb-elo">${a.avg_rating || a.elo || '—'}</span>
        <span class="lb-solved">${a.total_attempts || a.solved || 0}</span>
        <span class="lb-rate">${a.success_rate !== undefined ? a.success_rate + '%' : (a.rate || '—')}</span>
        <span class="lb-halluc ${hc}">${a.hallucination_rate !== undefined ? a.hallucination_rate + '%' : '—'}</span>
        <span class="lb-traits-cell">${getTraitsHtml(traits)}</span>
      </div>
    `;
  }).join('');
}

async function fetchLeaderboard() {
  try {
    const [eloRes, memRes] = await Promise.all([
      fetch('/api/elo'),
      fetch('/api/leaderboard/memory'),
    ]);
    const eloData = eloRes.ok ? await eloRes.json() : null;
    const memData = memRes.ok ? await memRes.json() : null;
    const eloBoard = eloData?.leaderboard || [];
    const memBoard = memData?.agent_leaderboard || [];
    const memMap = {};
    for (const m of memBoard) memMap[m.agent_id] = m;

    const merged = eloBoard.map(e => {
      const m = memMap[e.agent_id] || {};
      return {
        agent_id: e.agent_id,
        avg_rating: e.avg_rating,
        total_attempts: m.total_attempts || 0,
        success_rate: m.success_rate,
        hallucination_rate: m.hallucination_rate,
        distinct_hints_used: m.distinct_hints_used,
      };
    });

    if (merged.length > 0) renderLeaderboard(merged);
    else if (memBoard.length > 0) renderLeaderboard(memBoard);
    else leaderboardBody.innerHTML = '<div class="lb-empty">No agent data yet</div>';
  } catch {
    leaderboardBody.innerHTML = '<div class="lb-empty">Unable to load leaderboard</div>';
  }
}
fetchLeaderboard();
fetchAgentProfiles();
setInterval(fetchLeaderboard, 30000);
setInterval(fetchAgentProfiles, 60000);

// =============================================
// 4. BEHAVIORAL SIGNALS — SSE + REST
// =============================================
const signalsContainer = document.getElementById('signals-container');
let activeSignals = [];

function renderSignalCard(signal) {
  const severity = signal.severity || 'low';
  const confidence = signal.confidence ? Math.round(signal.confidence * 100) + '%' : '—';
  return `
    <div class="signal-card">
      <div class="signal-card-header">
        <span class="signal-dot ${severity}"></span>
        <span class="signal-type">${signal.signal || 'unknown'}</span>
        <span class="signal-severity ${severity}">${severity}</span>
      </div>
      <div class="signal-explanation">${signal.explanation || 'No explanation available'}</div>
      <div class="signal-meta">
        <span>agent: ${signal.agent_id || 'system'}</span>
        <span>task: ${signal.task_id ? signal.task_id.slice(0, 12) : '—'}</span>
        <span class="signal-confidence">conf: ${confidence}</span>
      </div>
    </div>
  `;
}

function renderSignals(signals) {
  if (!signals || signals.length === 0) {
    signalsContainer.innerHTML = '<div class="signal-all-clear">✓ All systems nominal — no behavioral anomalies detected</div>';
    return;
  }
  signalsContainer.innerHTML = signals.map(renderSignalCard).join('');
}

async function loadSignals() {
  try {
    const res = await fetch('/api/signals?limit=12');
    if (!res.ok) { signalsContainer.innerHTML = '<div class="signal-empty">Unable to load signals</div>'; return; }
    const data = await res.json();
    activeSignals = data.signals || [];
    renderSignals(activeSignals);
  } catch {
    signalsContainer.innerHTML = '<div class="signal-empty">Unable to load signals</div>';
  }
}
loadSignals();

function connectSignalsSSE() {
  const es = new EventSource('/api/signals/live');
  es.addEventListener('signal', e => {
    try {
      const signal = JSON.parse(e.data);
      const dedupeKey = `${signal.signal}:${signal.agent_id || ''}:${signal.run_id || ''}`;
      const existingIdx = activeSignals.findIndex(s =>
        `${s.signal}:${s.agent_id || ''}:${s.run_id || ''}` === dedupeKey
      );
      if (existingIdx >= 0) {
        if ((signal.confidence || 0) > (activeSignals[existingIdx].confidence || 0)) {
          activeSignals[existingIdx] = signal;
        }
      } else {
        activeSignals.unshift(signal);
      }
      activeSignals = activeSignals.slice(0, 12);
      renderSignals(activeSignals);
    } catch { /* skip */ }
  });
  es.onerror = () => { es.close(); setTimeout(connectSignalsSSE, 8000); };
}
connectSignalsSSE();

// =============================================
// 5. TEMPORAL NARRATIVE — time-bucketed summaries
// =============================================
const narrativeContainer = document.getElementById('narrative-container');

async function fetchNarrative() {
  try {
    const res = await fetch('/api/runtime/narrative?window=1800000');
    if (!res.ok) { narrativeContainer.innerHTML = '<div class="lb-empty">Unable to load narrative</div>'; return; }
    const data = await res.json();
    if (!data.windows || data.windows.length === 0) {
      narrativeContainer.innerHTML = '<div class="lb-empty">No recent activity to summarize</div>';
      return;
    }
    const current = data.current || {};
    narrativeContainer.innerHTML = `
      <div class="narrative-current">
        <span class="narrative-current-label">Current period</span>
        <span class="narrative-current-summary">${current.summary || 'no activity'}</span>
        <span class="narrative-current-meta">${current.total_events || 0} events · ${current.unique_agents || 0} agents</span>
      </div>
      <div class="narrative-windows">
        ${data.windows.map(w => `
          <div class="narrative-window">
            <div class="narrative-window-head">
              <span class="narrative-window-time">${w.label}</span>
              <span class="narrative-window-count">${w.total_events} events</span>
              ${w.agent_summary ? `<span class="narrative-window-agents">${w.agent_summary}</span>` : ''}
            </div>
            <div class="narrative-window-summary">${w.summary}</div>
            ${w.highlights && w.highlights.length > 0 ? `
              <div class="narrative-highlights">
                ${w.highlights.map(h => `<span class="narrative-highlight"><span class="narrative-hl-icon">${h.icon}</span> ${h.text}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  } catch {
    narrativeContainer.innerHTML = '<div class="lb-empty">Unable to load narrative</div>';
  }
}
fetchNarrative();
setInterval(fetchNarrative, 30000);

// =============================================
// 6. AGENT PROFILE PANEL — slide-in
// =============================================
const profileOverlay = document.getElementById('profile-overlay');
const profilePanel = document.getElementById('profile-panel');
const profileContent = document.getElementById('profile-content');
const profileClose = document.getElementById('profile-close');

function openProfile(agentId) {
  profileOverlay.style.display = 'block';
  profileContent.innerHTML = '<div class="lb-empty">Loading profile…</div>';
  // Animate in
  requestAnimationFrame(() => {
    profileOverlay.classList.add('visible');
    profilePanel.classList.add('visible');
  });

  fetch(`/api/agents/${encodeURIComponent(agentId)}/profile`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      const p = data.profile;
      const traits = p.behavioral_traits || [];
      const trustLevel = p.trust?.level || 'unknown';
      const signals = p.recent_signals || [];

      profileContent.innerHTML = `
        <div class="profile-identity">
          <div class="profile-name-row">
            <span class="profile-name">${p.agent_id}</span>
            <span class="profile-trust ${trustLevel}">${trustLevel}</span>
          </div>
          <div class="profile-specialty">${p.specialty || 'generalist'}</div>
          <div class="profile-status ${p.status}">${p.status === 'active' ? '● active' : '○ inactive'}</div>
        </div>
        <div class="profile-section">
          <div class="profile-section-title">Behavioral Traits</div>
          <div class="profile-traits">
            ${traits.length > 0 ? traits.map(t =>
              `<span class="profile-trait ${t}">${t.replace(/_/g, ' ')}</span>`
            ).join('') : '<span class="profile-empty">Insufficient data to determine traits</span>'}
          </div>
        </div>
        <div class="profile-section">
          <div class="profile-section-title">Performance</div>
          <div class="profile-stats">
            <div class="profile-stat"><span class="profile-stat-value">${p.stats?.success_rate || '—'}%</span><span class="profile-stat-label">Success Rate</span></div>
            <div class="profile-stat"><span class="profile-stat-value">${p.total_executions || 0}</span><span class="profile-stat-label">Executions</span></div>
            <div class="profile-stat"><span class="profile-stat-value">${p.stats?.task_types || '—'}</span><span class="profile-stat-label">Task Types</span></div>
            <div class="profile-stat"><span class="profile-stat-value">${p.stats?.elo_rating || '—'}</span><span class="profile-stat-label">ELO Rating</span></div>
          </div>
        </div>
        <div class="profile-section">
          <div class="profile-section-title">Memory Profile</div>
          <div class="profile-memory">
            <span><strong>${p.memory_profile?.hints_used || 0}</strong> hints used</span>
            <span><strong>${p.memory_profile?.hints_contributed || 0}</strong> hints contributed</span>
          </div>
        </div>
        ${signals.length > 0 ? `
        <div class="profile-section">
          <div class="profile-section-title">Recent Signals</div>
          <div class="profile-signals">
            ${signals.map(s => `
              <div class="profile-signal">
                <span class="signal-dot ${s.severity}"></span>
                <span class="profile-signal-name">${s.signal}</span>
                <span class="profile-signal-conf">${Math.round((s.confidence || 0) * 100)}%</span>
              </div>
            `).join('')}
          </div>
        </div>` : ''}
      `;
    })
    .catch(() => {
      profileContent.innerHTML = '<div class="lb-empty">Unable to load profile</div>';
    });
}

function closeProfile() {
  profileOverlay.classList.remove('visible');
  profilePanel.classList.remove('visible');
  setTimeout(() => { profileOverlay.style.display = 'none'; }, 300);
}

profileClose.addEventListener('click', closeProfile);
profileOverlay.addEventListener('click', (e) => {
  if (e.target === profileOverlay) closeProfile();
});

document.addEventListener('click', (e) => {
  const lbRow = e.target.closest('.lb-row');
  if (lbRow) {
    const agentName = lbRow.querySelector('.lb-name')?.textContent?.trim();
    if (agentName && agentName !== 'unknown') openProfile(agentName);
  }
});

// =============================================
// 5. REPLAY CARDS — REST API
// =============================================
const replayCards = document.getElementById('replay-cards');
const STAGE_LABELS = {
  claimed: 'Task Claimed', memory_applied: 'Memory Gate',
  prompt_recorded: 'Prompt Built', output_recorded: 'Model Output',
  verified: 'Sandbox Verified', submitted: 'Result Stored',
};

async function loadReplayCards() {
  try {
    const res = await fetch('/api/replay');
    if (!res.ok) { replayCards.innerHTML = '<div class="lb-empty">No replay data available</div>'; return; }
    const data = await res.json();
    const replays = data.replays || data || [];
    if (!Array.isArray(replays) || replays.length === 0) {
      replayCards.innerHTML = '<div class="lb-empty">No replay data yet — runs will appear as agents execute tasks</div>';
      return;
    }
    const recent = replays.slice(0, 8);
    replayCards.innerHTML = recent.map(r => {
      const stages = r.stages || {};
      const completedCount = Object.values(stages).filter(Boolean).length;
      let dotClass = 'pending';
      if (stages.submitted) dotClass = 'ok';
      else if (stages.verified) dotClass = 'warn';
      const duration = r.time_span?.duration_ms
        ? (r.time_span.duration_ms > 1000 ? (r.time_span.duration_ms / 1000).toFixed(1) + 's' : r.time_span.duration_ms + 'ms')
        : '—';
      return `
        <div class="replay-card" data-run-id="${r.run_id}">
          <div class="replay-card-header">
            <div class="replay-card-left">
              <span class="replay-card-dot ${dotClass}"></span>
              <span class="replay-card-id">${r.run_id}</span>
              <span class="replay-card-meta">${completedCount}/6 stages · ${duration}</span>
            </div>
            <div class="replay-card-right">
              <span class="replay-card-agent">${r.agent_id || 'unknown'}</span>
              <span class="replay-card-chevron">›</span>
            </div>
          </div>
          <div class="replay-card-timeline"></div>
        </div>
      `;
    }).join('');
    replayCards.querySelectorAll('.replay-card-header').forEach(header => {
      header.addEventListener('click', () => toggleReplayCard(header.parentElement));
    });
  } catch {
    replayCards.innerHTML = '<div class="lb-empty">Unable to load replay data</div>';
  }
}

async function toggleReplayCard(card) {
  const isExpanded = card.classList.contains('expanded');
  card.classList.toggle('expanded');
  if (!isExpanded) {
    const timelineEl = card.querySelector('.replay-card-timeline');
    if (timelineEl.children.length > 0) return;
    const runId = card.dataset.runId;
    timelineEl.innerHTML = '<div style="padding:12px 0;color:var(--text-faint);font-size:13px;">Loading trace…</div>';
    try {
      const res = await fetch(`/api/replay/${encodeURIComponent(runId)}`);
      if (!res.ok) { timelineEl.innerHTML = '<div style="padding:12px 0;color:var(--danger);font-size:13px;">Failed to load trace</div>'; return; }
      const trace = await res.json();
      const stages = trace.stages || {};
      const timeline = trace.timeline || [];
      const stageOrder = ['claimed', 'memory_applied', 'prompt_recorded', 'output_recorded', 'verified', 'submitted'];
      const eventTypeMap = { claimed: 'task_claimed', memory_applied: 'memory_injected', prompt_recorded: 'prompt_built', output_recorded: 'model_output', verified: 'result_verified', submitted: 'result_submitted' };
      let html = '';
      for (const stage of stageOrder) {
        const done = stages[stage];
        const label = STAGE_LABELS[stage] || stage;
        const tlEvent = timeline.find(ev => ev.event_type === eventTypeMap[stage]);
        const latency = tlEvent?.latency_ms ? (tlEvent.latency_ms > 1000 ? (tlEvent.latency_ms / 1000).toFixed(1) + 's' : tlEvent.latency_ms + 'ms') : '';
        const detail = done && tlEvent ? (tlEvent.summary || latency) : (done ? '✓' : '—');
        html += `<div class="replay-stage"><div class="replay-stage-dot ${done ? 'done' : 'skipped'}"></div><div class="replay-stage-body"><div class="replay-stage-title ${done ? 'done' : 'skipped'}">${label}</div><div class="replay-stage-detail">${detail}</div></div></div>`;
      }
      timelineEl.innerHTML = html;
    } catch {
      timelineEl.innerHTML = '<div style="padding:12px 0;color:var(--danger);font-size:13px;">Error loading trace</div>';
    }
  }
}
loadReplayCards();
setInterval(loadReplayCards, 30000);

// =============================================
// 6. NAV SMOOTH SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
