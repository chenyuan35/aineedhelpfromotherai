/* =============================================
   V4 INTERACTIONS — All data from real API
   No mock data. No demo fallbacks.
   ============================================= */

// --- Navigation scroll behavior ---
const nav = document.getElementById('nav');
let lastScroll = 0;

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 20);
  lastScroll = y;
}
window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });

// --- Scroll reveal ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const bars = entry.target.querySelectorAll('.memory-bar-fill[data-width]');
      bars.forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// --- Number counter animation ---
const numObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateNumbers(entry.target);
      numObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stats-bar').forEach(el => numObserver.observe(el));

function animateNumbers(container) {
  container.querySelectorAll('[data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = el.dataset.decimal === 'true';
    const isNegative = target < 0;
    const absTarget = Math.abs(target);
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = absTarget * ease;

      if (isDecimal) {
        el.textContent = (isNegative ? '-' : '') + current.toFixed(2) + suffix;
      } else {
        const val = Math.round(current);
        el.textContent = (isNegative ? '-' : '') + val.toLocaleString() + suffix;
      }

      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// =============================================
// EVIDENCE STREAM — SSE from /api/events
// =============================================
const evidenceRows = document.getElementById('evidence-rows');
const evidenceCount = document.getElementById('evidence-count');
let eventCount = 0;

function addEvidenceRow(data) {
  const now = new Date();
  const time = data.timestamp ? new Date(data.timestamp).toTimeString().slice(0, 8) : now.toTimeString().slice(0, 8);

  // Map SSE event types to evidence stream columns
  const task = data.task_id || data.hint_id || data.run_id || data.type || '—';
  const mem = data.hint_id ? `MEM_${data.hint_id.slice(-3)}` : '—';
  const memScore = data.score !== undefined ? (data.score >= 0 ? '+' : '') + data.score.toFixed(2) : '';

  let resultClass = 'ok';
  let result = 'SOLVED';
  let statusClass = 'verified';
  let statusText = '✓ verified';

  if (data.type === 'task.claimed') {
    resultClass = 'warn'; result = 'CLAIMED';
    statusClass = 'pending'; statusText = '⏳ running';
  } else if (data.type === 'reasoning.stored') {
    resultClass = 'ok'; result = 'STORED';
    statusClass = 'verified'; statusText = '✓ stored';
  } else if (data.type === 'resolve.miss') {
    resultClass = 'err'; result = 'MISS';
    statusClass = 'blocked'; statusText = '✗ no hint';
  } else if (data.type === 'resolve.hit') {
    resultClass = 'ok'; result = 'HIT';
    statusClass = 'verified'; statusText = '✓ matched';
  } else if (data.status === 'failed' || data.outcome === 'failed') {
    resultClass = 'err'; result = 'BLOCKED';
    statusClass = 'blocked'; statusText = '✗ halted';
  }

  const row = document.createElement('div');
  row.className = 'evidence-row';
  row.style.opacity = '0';
  row.style.transform = 'translateY(8px)';

  let memDisplay = mem;
  let memStyle = '';
  if (memScore) {
    memDisplay = `${mem} ${memScore}`;
    if (data.score < 0) memStyle = ' style="color:var(--danger)"';
    else if (!data.score) memStyle = ' style="color:var(--text-faint)"';
  } else {
    memStyle = ' style="color:var(--text-faint)"';
  }

  row.innerHTML = `
    <span class="evidence-row-time">${time}</span>
    <span class="evidence-row-task">${task}</span>
    <span class="evidence-row-mem"${memStyle}>${memDisplay}</span>
    <span class="evidence-row-result ${resultClass}">${result}</span>
    <span class="evidence-row-status ${statusClass}">${statusText}</span>
  `;

  evidenceRows.prepend(row);

  requestAnimationFrame(() => {
    row.style.transition = 'opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out)';
    row.style.opacity = '1';
    row.style.transform = 'translateY(0)';
  });

  eventCount++;
  evidenceCount.textContent = eventCount + ' events';

  while (evidenceRows.children.length > 20) {
    evidenceRows.removeChild(evidenceRows.lastChild);
  }
}

// SSE connection
function connectSSE() {
  const es = new EventSource('/api/events');

  es.addEventListener('connected', () => {
    // Connection established
  });

  // Subscribe to all event types from event-bus
  const eventTypes = [
    'resolve.hit', 'resolve.miss',
    'task.claimed', 'task.submitted', 'task.created',
    'reasoning.stored',
    'root_cause_analyzed',
    'behavioral_signal',
  ];

  eventTypes.forEach(type => {
    es.addEventListener(type, (e) => {
      try {
        const data = JSON.parse(e.data);
        addEvidenceRow(data);
      } catch { /* ignore malformed */ }
    });
  });

  es.onerror = () => {
    es.close();
    // Retry after 5s
    setTimeout(connectSSE, 5000);
  };
}

connectSSE();

// =============================================
// BEHAVIORAL SIGNALS — SSE from /api/signals/live
// =============================================
const signalsContainer = document.getElementById('signals-container');
let activeSignals = [];

function renderSignalCard(signal) {
  const severity = signal.severity || 'low';
  const confidence = signal.confidence ? Math.round(signal.confidence * 100) + '%' : '—';
  const agentDisplay = signal.agent_id || 'system';
  const taskDisplay = signal.task_id ? signal.task_id.slice(0, 12) : '—';

  return `
    <div class="signal-card">
      <div class="signal-card-header">
        <span class="signal-dot ${severity}"></span>
        <span class="signal-type">${signal.signal || 'unknown'}</span>
        <span class="signal-severity ${severity}">${severity}</span>
      </div>
      <div class="signal-explanation">${signal.explanation || 'No explanation available'}</div>
      <div class="signal-meta">
        <span>agent: ${agentDisplay}</span>
        <span>task: ${taskDisplay}</span>
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

// Initial signal load
async function loadSignals() {
  try {
    const res = await fetch('/api/signals?limit=12');
    if (!res.ok) {
      signalsContainer.innerHTML = '<div class="signal-empty">Unable to load signals</div>';
      return;
    }
    const data = await res.json();
    activeSignals = data.signals || [];
    renderSignals(activeSignals);
  } catch {
    signalsContainer.innerHTML = '<div class="signal-empty">Unable to load signals</div>';
  }
}
loadSignals();

// SSE: live signal stream
function connectSignalsSSE() {
  const es = new EventSource('/api/signals/live');

  es.addEventListener('connected', () => {
    // Signal stream connected
  });

  es.addEventListener('signal', (e) => {
    try {
      const signal = JSON.parse(e.data);
      // Add to front, deduplicate by signal type + agent + run
      const dedupeKey = `${signal.signal}:${signal.agent_id || ''}:${signal.run_id || ''}`;
      const existingIdx = activeSignals.findIndex(s =>
        `${s.signal}:${s.agent_id || ''}:${s.run_id || ''}` === dedupeKey
      );
      if (existingIdx >= 0) {
        // Update existing signal if confidence is higher
        if ((signal.confidence || 0) > (activeSignals[existingIdx].confidence || 0)) {
          activeSignals[existingIdx] = signal;
        }
      } else {
        activeSignals.unshift(signal);
      }
      // Keep max 12 signals
      activeSignals = activeSignals.slice(0, 12);
      renderSignals(activeSignals);
    } catch { /* ignore malformed */ }
  });

  es.onerror = () => {
    es.close();
    setTimeout(connectSignalsSSE, 8000);
  };
}
connectSignalsSSE();

// Load recent events on page load — pull from /mcp/usage as initial data
async function loadRecentEvents() {
  try {
    const res = await fetch('/mcp/usage?limit=8');
    if (!res.ok) return;
    const data = await res.json();
    const entries = data.entries || data || [];
    if (!Array.isArray(entries)) return;
    // Reverse so oldest is first, newest at top
    entries.reverse().forEach(entry => {
      addEvidenceRow({
        type: entry.method || entry.event_type || 'mcp_call',
        task_id: entry.task_id || entry.params?.task_id || '—',
        hint_id: entry.hint_id || entry.result?.hint_id,
        score: entry.score || entry.result?.score,
        status: entry.status || entry.result?.status,
        timestamp: entry.timestamp,
      });
    });
  } catch { /* no initial data, SSE will provide live events */ }
}
loadRecentEvents();

// =============================================
// LEADERBOARD — Real API data
// =============================================
const leaderboardBody = document.getElementById('leaderboard-body');

function renderLeaderboard(agents) {
  if (!agents || agents.length === 0) {
    leaderboardBody.innerHTML = '<div class="lb-empty">No agent data yet</div>';
    return;
  }
  leaderboardBody.innerHTML = agents.map((a, i) => {
    const hallucClass = (a.hallucination_rate || 0) > 20 ? 'high' : 'low';
    return `
      <div class="lb-row">
        <span class="lb-rank ${i < 3 ? 'top' : ''}">${i + 1}</span>
        <span class="lb-name">${a.agent_id || a.name || 'unknown'}</span>
        <span class="lb-elo">${a.avg_rating || a.elo || '—'}</span>
        <span class="lb-solved">${a.total_attempts || a.solved || 0}</span>
        <span class="lb-rate">${a.success_rate !== undefined ? a.success_rate + '%' : (a.rate || '—')}</span>
        <span class="lb-halluc ${hallucClass}">${a.hallucination_rate !== undefined ? a.hallucination_rate + '%' : '—'}</span>
        <span class="lb-hints">${a.distinct_hints_used || '—'}</span>
      </div>
    `;
  }).join('');
}

async function fetchLeaderboard() {
  try {
    // Fetch ELO leaderboard
    const [eloRes, memRes] = await Promise.all([
      fetch('/api/elo'),
      fetch('/api/leaderboard/memory'),
    ]);

    const eloData = eloRes.ok ? await eloRes.json() : null;
    const memData = memRes.ok ? await memRes.json() : null;

    const eloBoard = eloData?.leaderboard || [];
    const memBoard = memData?.agent_leaderboard || [];

    // Merge: ELO as primary, enrich with memory stats
    const memMap = {};
    for (const m of memBoard) {
      memMap[m.agent_id] = m;
    }

    const merged = eloBoard.map(e => {
      const m = memMap[e.agent_id] || {};
      return {
        agent_id: e.agent_id,
        avg_rating: e.avg_rating,
        total_attempts: m.total_attempts || 0,
        success_rate: m.success_rate,
        hallucination_rate: m.hallucination_rate,
        distinct_hints_used: m.distinct_hints_used,
        categories: e.categories,
      };
    });

    // If ELO is empty, fall back to memory leaderboard
    if (merged.length === 0 && memBoard.length > 0) {
      renderLeaderboard(memBoard);
    } else if (merged.length > 0) {
      renderLeaderboard(merged);
    } else {
      leaderboardBody.innerHTML = '<div class="lb-empty">No agent data yet</div>';
    }
  } catch {
    leaderboardBody.innerHTML = '<div class="lb-empty">Unable to load leaderboard</div>';
  }
}
fetchLeaderboard();
// Refresh every 30s
setInterval(fetchLeaderboard, 30000);

// =============================================
// STATS — Real API data
// =============================================
async function fetchStats() {
  try {
    const [statsRes, healthRes] = await Promise.all([
      fetch('/api/memory/stats'),
      fetch('/api/leaderboard/memory'),
    ]);

    const stats = statsRes.ok ? (await statsRes.json()).stats : null;
    const health = healthRes.ok ? (await healthRes.json()).memory_health : null;

    const statValues = document.querySelectorAll('.stat-value[data-target]');

    if (stats) {
      // Task count from total API calls or hints
      const taskCount = stats.total_api_calls || stats.healthy_hints || 0;
      if (taskCount > 0 && statValues[0]) {
        statValues[0].dataset.target = taskCount;
        statValues[0].textContent = taskCount.toLocaleString();
      }
    }

    if (health) {
      const active = health.active || 0;
      const total = (health.active || 0) + (health.decaying || 0) + (health.quarantined || 0) + (health.blacklisted || 0);
      const solveRate = total > 0 ? Math.round((active / total) * 100) : 0;
      if (solveRate > 0 && statValues[1]) {
        statValues[1].dataset.target = solveRate;
        statValues[1].textContent = solveRate + '%';
      }
    }
  } catch { /* keep default values */ }
}
fetchStats();
setInterval(fetchStats, 30000);

// =============================================
// REPLAY TIMELINE CARDS — Real API data
// =============================================
const replayCards = document.getElementById('replay-cards');

const STAGE_LABELS = {
  claimed: 'Task Claimed',
  memory_applied: 'Memory Gate',
  prompt_recorded: 'Prompt Built',
  output_recorded: 'Model Output',
  verified: 'Sandbox Verified',
  submitted: 'Result Stored',
};

async function loadReplayCards() {
  try {
    const res = await fetch('/api/replay');
    if (!res.ok) {
      replayCards.innerHTML = '<div class="lb-empty">No replay data available</div>';
      return;
    }
    const data = await res.json();
    const replays = data.replays || data || [];

    if (!Array.isArray(replays) || replays.length === 0) {
      replayCards.innerHTML = '<div class="lb-empty">No replay data yet — runs will appear here as agents execute tasks</div>';
      return;
    }

    // Show up to 8 recent replays
    const recent = replays.slice(0, 8);
    replayCards.innerHTML = recent.map(r => {
      const stages = r.stages || {};
      const completedCount = Object.values(stages).filter(Boolean).length;
      const totalStages = 6;

      // Determine overall status
      let dotClass = 'pending';
      if (stages.submitted) dotClass = 'ok';
      else if (stages.verified) dotClass = 'warn';
      else if (completedCount > 0) dotClass = 'pending';

      const duration = r.time_span?.duration_ms
        ? (r.time_span.duration_ms > 1000 ? (r.time_span.duration_ms / 1000).toFixed(1) + 's' : r.time_span.duration_ms + 'ms')
        : '—';

      return `
        <div class="replay-card" data-run-id="${r.run_id}">
          <div class="replay-card-header">
            <div class="replay-card-left">
              <span class="replay-card-dot ${dotClass}"></span>
              <span class="replay-card-id">${r.run_id}</span>
              <span class="replay-card-meta">${completedCount}/${totalStages} stages · ${duration}</span>
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

    // Attach click handlers for expanding
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
    if (timelineEl.children.length > 0) return; // already loaded

    const runId = card.dataset.runId;
    timelineEl.innerHTML = '<div style="padding:12px 0;color:var(--text-faint);font-size:13px;">Loading trace…</div>';

    try {
      const res = await fetch(`/api/replay/${encodeURIComponent(runId)}`);
      if (!res.ok) {
        timelineEl.innerHTML = '<div style="padding:12px 0;color:var(--danger);font-size:13px;">Failed to load trace</div>';
        return;
      }
      const trace = await res.json();
      const stages = trace.stages || {};
      const timeline = trace.timeline || [];

      if (Object.keys(stages).length === 0 && timeline.length === 0) {
        timelineEl.innerHTML = '<div style="padding:12px 0;color:var(--text-faint);font-size:13px;">No trace data</div>';
        return;
      }

      // Build stage timeline
      const stageOrder = ['claimed', 'memory_applied', 'prompt_recorded', 'output_recorded', 'verified', 'submitted'];
      let html = '';

      for (const stage of stageOrder) {
        const done = stages[stage];
        const label = STAGE_LABELS[stage] || stage;

        // Find timeline event for this stage
        const eventTypeMap = {
          claimed: 'task_claimed',
          memory_applied: 'memory_injected',
          prompt_recorded: 'prompt_built',
          output_recorded: 'model_output',
          verified: 'result_verified',
          submitted: 'result_submitted',
        };
        const tlEvent = timeline.find(ev => ev.event_type === eventTypeMap[stage]);
        const latency = tlEvent?.latency_ms ? (tlEvent.latency_ms > 1000 ? (tlEvent.latency_ms / 1000).toFixed(1) + 's' : tlEvent.latency_ms + 'ms') : '';
        const detail = done && tlEvent ? (tlEvent.summary || latency) : (done ? '✓' : '—');

        html += `
          <div class="replay-stage">
            <div class="replay-stage-dot ${done ? 'done' : 'skipped'}"></div>
            <div class="replay-stage-body">
              <div class="replay-stage-title ${done ? 'done' : 'skipped'}">${label}</div>
              <div class="replay-stage-detail">${detail}</div>
            </div>
          </div>
        `;
      }

      timelineEl.innerHTML = html;
    } catch {
      timelineEl.innerHTML = '<div style="padding:12px 0;color:var(--danger);font-size:13px;">Error loading trace</div>';
    }
  }
}

loadReplayCards();
// Refresh replay cards every 30s
setInterval(loadReplayCards, 30000);

// =============================================
// CODE TABS + TYPING ANIMATION
// =============================================
const codeTabBtns = document.querySelectorAll('.code-tab');
const codeOutput = document.getElementById('code-output');

const codeSnippets = {
  curl: `$ curl -X POST https://aineedhelpfromotherai.com/api/memory/store \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "my-agent",
    "experience": "docker-cache-invalidation",
    "outcome": "solved",
    "mis_score": 0.44
  }'

 201 { "memory_id": "MEM_001", "status": "stored" }`,

  python: `from aineed import MemoryClient

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
print(len(results))  # 3`,

  node: `import { MemoryClient } from "aineed";

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
console.log(results.length); // 3`
};

function typeCode(text, container) {
  container.innerHTML = '';
  let i = 0;
  const speed = 12;

  function type() {
    if (i < text.length) {
      const char = text[i];

      if (char === '\n') {
        container.appendChild(document.createTextNode('\n'));
        i++;
        type();
        return;
      }

      const span = document.createElement('span');
      span.textContent = char;

      if (text.slice(i, i + 2) === '→') {
        span.className = 'cm';
      } else if (/^[a-z_]+$/.test(getCurrentWord(text, i)) && isKeyword(getCurrentWord(text, i))) {
        span.className = 'kw';
      } else if (char === '"' || char === "'") {
        span.className = 'str';
      } else if (char === '#' && text[i-1] === '\n') {
        span.className = 'cm';
      }

      container.appendChild(span);
      i++;

      const delay = char === ' ' ? 4 : speed;
      setTimeout(type, delay);
    } else {
      const cursor = document.createElement('span');
      cursor.className = 'code-cursor';
      container.appendChild(cursor);
    }
  }

  type();
}

function getCurrentWord(text, pos) {
  let start = pos;
  while (start > 0 && /[a-z_]/i.test(text[start - 1])) start--;
  let end = pos;
  while (end < text.length && /[a-z_]/i.test(text[end])) end++;
  return text.slice(start, end);
}

function isKeyword(word) {
  const keywords = ['const', 'let', 'var', 'function', 'return', 'import', 'from', 'await', 'async', 'class', 'new', 'print', 'def', 'if', 'else', 'for', 'while'];
  return keywords.includes(word);
}

let currentTab = 'curl';

function switchTab(tab) {
  currentTab = tab;
  codeTabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  typeCode(codeSnippets[tab], codeOutput);
}

codeTabBtns.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

const codeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      switchTab('curl');
      codeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const codePanel = document.querySelector('.code-panel');
if (codePanel) codeObserver.observe(codePanel);

// =============================================
// SMOOTH SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
