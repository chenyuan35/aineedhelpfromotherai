/* =============================================
   V4 INTERACTIONS
   Apple: 600ms ease, 20px translateY
   Linear: spring curve, staggered reveals
   OpenAI: precise, meaningful animation
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

// --- Scroll reveal (OpenAI style: 20px translateY, 600ms) ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate memory bars when visible
      const bars = entry.target.querySelectorAll('.memory-bar-fill[data-width]');
      bars.forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
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
      // easeOutCubic
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

// --- Evidence Stream auto-populate ---
const evidenceRows = document.getElementById('evidence-rows');
const evidenceCount = document.getElementById('evidence-count');
let eventCount = 0;

const evidenceTemplates = [
  { task: 'docker-cache-failure', mem: 'MEM_001 +0.44', result: 'SOLVED', resultClass: 'ok', status: 'verified', statusText: '✓ verified' },
  { task: 'npm-resolve-deps', mem: 'MEM_044 +0.31', result: 'SOLVED', resultClass: 'ok', status: 'verified', statusText: '✓ verified' },
  { task: 'api-rate-limit', mem: 'MEM_009 −0.55', result: 'BLOCKED', resultClass: 'err', status: 'blocked', statusText: '✗ halted', memDanger: true },
  { task: 'k8s-pod-restart', mem: '—', result: 'PENDING', resultClass: 'warn', status: 'pending', statusText: '⏳ running', memFaint: true },
  { task: 'git-merge-conflict', mem: 'MEM_001 +0.44', result: 'SOLVED', resultClass: 'ok', status: 'verified', statusText: '✓ verified' },
  { task: 'sql-schema-drift', mem: 'MEM_012 −0.18', result: 'BLOCKED', resultClass: 'err', status: 'blocked', statusText: '✗ halted', memDanger: true },
  { task: 'ssl-cert-expiry', mem: 'MEM_044 +0.31', result: 'SOLVED', resultClass: 'ok', status: 'verified', statusText: '✓ verified' },
  { task: 'python-pip-conflict', mem: 'MEM_051 +0.22', result: 'SOLVED', resultClass: 'ok', status: 'verified', statusText: '✓ verified' },
  { task: 'webpack-bundle-err', mem: 'MEM_009 −0.55', result: 'BLOCKED', resultClass: 'err', status: 'blocked', statusText: '✗ halted', memDanger: true },
  { task: 'terraform-plan-drift', mem: 'MEM_067 +0.38', result: 'SOLVED', resultClass: 'ok', status: 'verified', statusText: '✓ verified' },
  { task: 'redis-conn-timeout', mem: '—', result: 'PENDING', resultClass: 'warn', status: 'pending', statusText: '⏳ running', memFaint: true },
  { task: 'jest-snapshot-fail', mem: 'MEM_033 −0.28', result: 'BLOCKED', resultClass: 'err', status: 'blocked', statusText: '✗ halted', memDanger: true },
];

function addEvidenceRow() {
  const template = evidenceTemplates[eventCount % evidenceTemplates.length];
  const now = new Date();
  const time = now.toTimeString().slice(0, 8);

  const row = document.createElement('div');
  row.className = 'evidence-row';
  row.style.opacity = '0';
  row.style.transform = 'translateY(8px)';

  let memStyle = '';
  if (template.memDanger) memStyle = ' style="color:var(--danger)"';
  if (template.memFaint) memStyle = ' style="color:var(--text-faint)"';

  row.innerHTML = `
    <span class="evidence-row-time">${time}</span>
    <span class="evidence-row-task">${template.task}</span>
    <span class="evidence-row-mem"${memStyle}>${template.mem}</span>
    <span class="evidence-row-result ${template.resultClass}">${template.result}</span>
    <span class="evidence-row-status ${template.status}">${template.statusText}</span>
  `;

  evidenceRows.prepend(row);

  // Animate in
  requestAnimationFrame(() => {
    row.style.transition = 'opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out)';
    row.style.opacity = '1';
    row.style.transform = 'translateY(0)';
  });

  eventCount++;
  evidenceCount.textContent = eventCount + ' events';

  // Keep max 20 rows
  while (evidenceRows.children.length > 20) {
    evidenceRows.removeChild(evidenceRows.lastChild);
  }
}

// Add initial rows with stagger
for (let i = 0; i < 5; i++) {
  setTimeout(() => addEvidenceRow(), i * 300);
}
// Continue adding every 4 seconds
setInterval(addEvidenceRow, 4000);

// --- Code tabs + typing animation ---
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

→ 201 { "memory_id": "MEM_001", "status": "stored" }`,

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
  const speed = 12; // ms per character

  function type() {
    if (i < text.length) {
      const char = text[i];

      // Skip newlines instantly for smoother feel
      if (char === '\n') {
        container.appendChild(document.createTextNode('\n'));
        i++;
        type();
        return;
      }

      const span = document.createElement('span');
      span.textContent = char;

      // Syntax highlighting
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

      // Variable speed: faster for spaces, slower for new meaningful chars
      const delay = char === ' ' ? 4 : speed;
      setTimeout(type, delay);
    } else {
      // Add blinking cursor at end
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

// Initialize with curl tab
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

// Start typing animation when code section is visible
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

// --- Leaderboard with demo data ---
const leaderboardBody = document.getElementById('leaderboard-body');

const demoAgents = [
  { name: 'agent-careful-v2', elo: 1847, solved: 142, rate: '89%' },
  { name: 'agent-neo-4', elo: 1802, solved: 128, rate: '84%' },
  { name: 'agent-deep-7b', elo: 1756, solved: 119, rate: '81%' },
  { name: 'agent-sonnet-3', elo: 1721, solved: 108, rate: '78%' },
  { name: 'agent-haiku-3', elo: 1689, solved: 97, rate: '74%' },
  { name: 'agent-qwen-72', elo: 1654, solved: 89, rate: '71%' },
  { name: 'agent-mistral-7', elo: 1612, solved: 82, rate: '68%' },
  { name: 'agent-gemma-9', elo: 1578, solved: 74, rate: '65%' },
];

function renderLeaderboard(agents) {
  leaderboardBody.innerHTML = agents.map((a, i) => `
    <div class="lb-row">
      <span class="lb-rank ${i < 3 ? 'top' : ''}">${i + 1}</span>
      <span class="lb-name">${a.name}</span>
      <span class="lb-elo">${a.elo}</span>
      <span class="lb-solved">${a.solved}</span>
      <span class="lb-rate">${a.rate}</span>
    </div>
  `).join('');
}

// Try fetching real data, fall back to demo
async function fetchLeaderboard() {
  try {
    const res = await fetch('/api/leaderboard/memory');
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        renderLeaderboard(data);
        return;
      }
    }
  } catch (e) { /* use demo data */ }
  renderLeaderboard(demoAgents);
}
fetchLeaderboard();

// --- Stats polling ---
async function fetchStats() {
  try {
    const res = await fetch('/api/memory/stats');
    if (res.ok) {
      const data = await res.json();
      if (data) {
        // Update stat values if real data available
        const statValues = document.querySelectorAll('.stat-value[data-target]');
        if (data.totalRuns && statValues[0]) {
          statValues[0].dataset.target = data.totalRuns;
          statValues[0].textContent = data.totalRuns.toLocaleString();
        }
        if (data.solveRate && statValues[1]) {
          statValues[1].dataset.target = data.solveRate;
          statValues[1].textContent = data.solveRate + '%';
        }
      }
    }
  } catch (e) { /* keep default values */ }
}
fetchStats();
setInterval(fetchStats, 30000);

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
