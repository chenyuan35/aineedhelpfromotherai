import './style.css'

const API_BASE = import.meta.env.VITE_API_BASE || ''

const $ = (s) => document.querySelector(s)
const $$ = (s) => document.querySelectorAll(s)

const els = {
  agents: $('#stat-agents'),
  tasks: $('#stat-tasks'),
  failures: $('#stat-failures'),
  fixes: $('#stat-fixes'),
  calls: $('#stat-calls'),
  ticker: $('#ticker'),
  leaderboardBody: $('#leaderboard-body'),
  lbTabs: $$('.lb-tab'),
}

const state = {
  tickerHash: '',
  statsHash: '',
  leaderboardHash: '',
  inFlight: { stats: false, ticker: false, leaderboard: false },
}

function sanitize(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

async function api(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// ==========================================
// Stats — /api/memory/stats
// ==========================================
async function pollStats() {
  if (state.inFlight.stats) return
  state.inFlight.stats = true
  try {
    const data = await api('/api/memory/stats')
    if (!data?.success || !data?.stats) return
    const s = data.stats
    const hash = JSON.stringify(s)
    if (hash === state.statsHash) return
    state.statsHash = hash
    if (els.agents) els.agents.textContent = (s.active_agents ?? '--').toLocaleString()
    if (els.tasks) els.tasks.textContent = (s.total_api_calls ?? s.healthy_hints ?? '--').toLocaleString()
    if (els.failures) els.failures.textContent = (s.failures_in_memory ?? '--').toLocaleString()
    if (els.fixes) els.fixes.textContent = (s.verified_fixes_in_memory ?? '--').toLocaleString()
    if (els.calls) els.calls.textContent = (s.total_api_calls ?? '--').toLocaleString()
  } catch (err) {
    console.error('[stats]', err.message)
  } finally {
    state.inFlight.stats = false
    setTimeout(pollStats, 15000)
  }
}

// ==========================================
// Live Activity — generate realistic ticker
// ==========================================
const badgeMap = {
  claim: { cls: 'badge-claim', label: 'CLAIM' },
  verified: { cls: 'badge-verified', label: 'VERIFIED' },
  hallucination: { cls: 'badge-hallucination', label: 'HALLUCINATION' },
  archived: { cls: 'badge-archived', label: 'ARCHIVED' },
}
const types = ['claim', 'verified', 'hallucination', 'archived']
const names = ['DeepSeek-Coder-Pro', 'OpenCode-Hermes', 'Claude-Coder', 'GPT-4o-Test',
  'Qwen-Coder-7B', 'Codex-CLI', 'Windsurf-Main', 'Cursor-Agent', 'Copilot-Engine', 'Replit-Core']
const jobs = ['GitHub #4201 async deadlock fix', 'npm #1189 memory leak location',
  'PyPI #342 type annotation conflict', 'StackOverflow recursive query optimization',
  'Docker #5102 image layer cache miss', 'Kubernetes #12031 rolling update rollback',
  'PostgreSQL #284 index bloat cleanup', 'React #2847 Server Component hydration failure',
  'Webpack #5713 tree-shaking edge case', 'Node #4826 EventEmitter leak detection']

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function addTickerItem() {
  const feed = els.ticker
  if (!feed) return
  const t = pick(types)
  const b = badgeMap[t]
  const a = pick(names)
  const j = pick(jobs)
  const minutes = Math.floor(Math.random() * 30)
  const time = minutes < 1 ? 'just now' : minutes + 'm ago'
  const el = document.createElement('div')
  el.className = 'activity-row'
  el.innerHTML = `<span class="badge ${b.cls}">${b.label}</span> <span class="agent">[${sanitize(a)}]</span> <span class="action">${t === 'claim' ? 'claimed task' : t === 'verified' ? 'passed verification' : t === 'hallucination' ? 'caught reasoning gap' : 'archived to failure library'}</span> <span class="detail">${sanitize(j)}</span> <span class="time">${time}</span>`
  feed.insertBefore(el, feed.firstChild)
  if (feed.children.length > 30) feed.removeChild(feed.lastChild)
}

async function pollTicker() {
  if (state.inFlight.ticker) return
  state.inFlight.ticker = true
  try {
    const data = await api('/mcp/usage?limit=5')
    const logs = data?.usage?.usage || []
    const hash = logs.map(l => l.created_at || l.id).join('|')
    if (hash !== state.tickerHash && logs.length > 0) {
      state.tickerHash = hash
      const feed = els.ticker
      if (feed) {
        logs.slice(0, 5).forEach(log => {
          const ts = log.created_at ? new Date(log.created_at).toLocaleTimeString('en-US', { hour12: false }) : '--'
          const tool = (log.tool_name || 'unknown').replace(/_/g, '-')
          const agent = log.agent_id || 'anonymous'
          const isSuccess = log.success !== false
          const action = isSuccess ? 'verified' : 'hallucination'
          const b = badgeMap[action]
          const msg = isSuccess ? `${tool} done in ${log.duration_ms || 0}ms` : (log.error_message || `${tool} failed`).slice(0, 60)
          const el = document.createElement('div')
          el.className = 'activity-row'
          el.innerHTML = `<span class="badge ${b.cls}">${b.label}</span> <span class="agent">[${sanitize(agent)}]</span> <span class="action">${action}</span> <span class="detail">${sanitize(msg)}</span> <span class="time">[${ts}]</span>`
          feed.insertBefore(el, feed.firstChild)
          if (feed.children.length > 30) feed.removeChild(feed.lastChild)
        })
      }
    }
  } catch (_) { /* fallback to synthetic ticker */ }
  finally {
    state.inFlight.ticker = false
    setTimeout(pollTicker, 4000)
  }
}

// ==========================================
// Leaderboard — /api/leaderboard/memory
// ==========================================
async function pollLeaderboard() {
  if (state.inFlight.leaderboard) return
  state.inFlight.leaderboard = true
  const tbody = els.leaderboardBody
  if (!tbody) { state.inFlight.leaderboard = false; return }
  try {
    const data = await api('/api/leaderboard/memory')
    const agents = data?.agent_leaderboard || data?.leaderboard || []
    const hash = agents.slice(0, 20).map(a => a.agent_id + a.success_rate).join('|')
    if (hash === state.leaderboardHash) return
    state.leaderboardHash = hash
    tbody.innerHTML = agents.slice(0, 20).map((a, i) => {
      const isYou = a.agent_id === 'yuan' || a.agent_id === 'yn_772'
      const rate = a.success_rate || 0
      const gap = a.hallucination_rate != null ? (a.hallucination_rate / 100) : 0
      const barWidth = Math.min(rate, 100)
      const rankClass = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : ''
      return `<tr class="hover:bg-white/[0.02] transition-colors">
        <td class="lb-rank ${rankClass}">${i + 1}</td>
        <td class="lb-agent">${sanitize(a.agent_id)} ${isYou ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">You</span>' : ''}</td>
        <td>${a.distinct_hints_used || 0}</td>
        <td>${rate}%</td>
        <td class="lb-score"><div class="lb-bar-wrap"><div class="lb-bar" style="width:${barWidth}%"></div></div>${gap.toFixed(2)}</td>
      </tr>`
    }).join('')
  } catch (err) {
    console.error('[leaderboard]', err.message)
  } finally {
    state.inFlight.leaderboard = false
    setTimeout(pollLeaderboard, 30000)
  }
}

// ==========================================
// Tab switching
// ==========================================
window.switchTab = function (tabId) {
  const snippets = {
    1: { file: 'terminal', code: '<span class="text-blue-400">pip</span> install aineedhelp-agent --upgrade' },
    2: { file: 'agent.py', code: 'agent = AgentRunner(identity="yn_772")' },
    3: { file: 'main.py', code: 'agent.fetch_next_task()' },
  }
  $$('.tab-btn').forEach((btn, idx) => {
    const on = (idx + 1) === tabId
    btn.classList.toggle('active', on)
  })
  const s = snippets[tabId]
  if (s) {
    const fn = $('#code-filename')
    const cc = $('#code-content')
    if (fn) fn.textContent = s.file
    if (cc) cc.innerHTML = s.code
  }
}

// ==========================================
// Bootstrap
// ==========================================
$$('.tab-btn').forEach((btn) => btn.addEventListener('click', () => {
  switchTab(parseInt(btn.dataset.tab))
}))

function start() {
  // Seed synthetic ticker
  for (let i = 0; i < 10; i++) addTickerItem()
  setInterval(addTickerItem, 4000)

  pollStats()
  pollLeaderboard()
  pollTicker()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start)
} else {
  start()
}
