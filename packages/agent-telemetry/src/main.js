import './style.css'
import { getTheme, successRateTheme, varianceLabel } from './theme.js'

const API_BASE = import.meta.env.VITE_API_BASE || ''

// DOM cache
const $ = (s) => document.querySelector(s)
const $$ = (s) => document.querySelectorAll(s)

const els = {
  agents: $('#stat-agents'),
  tasks: $('#stat-tasks'),
  failures: $('#stat-failures'),
  fixes: $('#stat-fixes'),
  telemetryFeed: $('#telemetry-feed'),
  leaderboardBody: $('#leaderboard-body'),
}

// Internal state machine — prevents redundant renders and concurrent requests
const state = {
  telemetryHash: '',
  statsHash: '',
  leaderboardHash: '',
  inFlight: { stats: false, telemetry: false, leaderboard: false },
}

// XSS guard: all agent-provided text passes through here
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
// Response: { success: true, stats: { total_api_calls, failures_in_memory, verified_fixes_in_memory, total_hints, healthy_hints } }
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
    if (els.agents) els.agents.textContent = s.total_api_calls ?? '\u2014'
    if (els.tasks) els.tasks.textContent = s.healthy_hints ?? '\u2014'
    if (els.failures) els.failures.textContent = s.failures_in_memory ?? '\u2014'
    if (els.fixes) els.fixes.textContent = s.verified_fixes_in_memory ?? '\u2014'
  } catch (err) {
    console.error('[stats]', err.message)
  } finally {
    state.inFlight.stats = false
    setTimeout(pollStats, 15000)
  }
}

// ==========================================
// Leaderboard — /api/leaderboard/memory
// Response: { success: true, agent_leaderboard: [{ agent_id, success_rate, hallucination_rate, distinct_hints_used }] }
// ==========================================
async function pollLeaderboard() {
  if (state.inFlight.leaderboard) return
  state.inFlight.leaderboard = true
  const tbody = els.leaderboardBody
  if (!tbody) { state.inFlight.leaderboard = false; return }
  try {
    const data = await api('/api/leaderboard/memory')
    if (!data?.success || !data?.agent_leaderboard) {
      tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-white/20">No leaderboard data available</td></tr>`
      return
    }
    const agents = data.agent_leaderboard.slice(0, 20)
    const hash = agents.map(a => a.agent_id + a.success_rate).join('|')
    if (hash === state.leaderboardHash) return
    state.leaderboardHash = hash
    tbody.innerHTML = agents.map((a, i) => {
      const isYou = a.agent_id === 'yuan' || a.agent_id === 'yn_772'
      const rate = a.success_rate || 0
      const theme = successRateTheme(rate)
      const gap = a.hallucination_rate != null ? (a.hallucination_rate / 100) : 0
      const v = varianceLabel(gap)
      return `<tr class="hover:bg-white/[0.02] transition-colors">
        <td class="p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-white/20 w-4 shrink-0">#${i + 1}</span>
            <div class="min-w-0">
              <div class="font-semibold text-white flex items-center gap-1.5">
                <span class="truncate">${sanitize(a.agent_id)}</span>
                ${isYou ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider shrink-0">You</span>' : ''}
              </div>
              <div class="text-xs text-white/30 font-mono truncate">${a.distinct_hints_used || 0} hints</div>
            </div>
          </div>
        </td>
        <td class="p-4 sm:p-5 text-white/50 text-xs font-mono">memory-agent</td>
        <td class="p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <span class="font-semibold ${theme.text} font-mono">${rate}%</span>
            <div class="w-20 sm:w-24 bg-white/5 h-1.5 rounded-full overflow-hidden hidden sm:block">
              <div class="${theme.bar} h-full rounded-full" style="width:${rate}%"></div>
            </div>
          </div>
        </td>
        <td class="p-4 sm:p-5 font-mono text-xs ${v.theme.text} hidden md:table-cell">${gap.toFixed(2)} (${v.label})</td>
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
// Telemetry — /mcp/usage?limit=10
// Response: { success: true, usage: { usage: [{ tool_name, agent_id, success, error_message, duration_ms, created_at }] } }
// ==========================================
async function pollTelemetry() {
  if (state.inFlight.telemetry) return
  state.inFlight.telemetry = true
  const feed = els.telemetryFeed
  if (!feed) { state.inFlight.telemetry = false; return }
  try {
    const data = await api('/mcp/usage?limit=10')
    const logs = data?.usage?.usage || []
    if (logs.length === 0) {
      feed.innerHTML = `<div class="flex items-center justify-center py-8 text-white/20 text-xs">No telemetry events recorded</div>`
      return
    }
    const hash = logs.map(l => l.created_at || l.id).join('|')
    if (hash === state.telemetryHash) return
    state.telemetryHash = hash
    feed.innerHTML = logs.map(log => {
      const ts = log.created_at
        ? new Date(log.created_at).toLocaleTimeString('en-US', { hour12: false })
        : '--'
      const tool = (log.tool_name || 'unknown').replace(/_/g, '-')
      const agent = log.agent_id || 'anonymous'
      const isSuccess = log.success !== false
      const msg = isSuccess
        ? `${tool} completed in ${log.duration_ms || 0}ms`
        : (log.error_message || `${tool} failed`).slice(0, 80)
      const theme = getTheme(isSuccess ? 'emerald' : 'rose')
      return `<div class="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all gap-1">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-white/20 text-[10px] shrink-0">[${sanitize(ts)}]</span>
          <span class="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${theme.bg} ${theme.border} ${theme.text}">${sanitize(tool)}</span>
          <span class="text-white/40 text-xs truncate max-w-[120px] sm:max-w-none">${sanitize(agent)}</span>
          <span class="text-white/20 hidden sm:inline">\u2192</span>
          <span class="${theme.text} text-xs truncate">${sanitize(msg)}</span>
        </div>
      </div>`
    }).join('')
  } catch (err) {
    console.error('[telemetry]', err.message)
  } finally {
    state.inFlight.telemetry = false
    setTimeout(pollTelemetry, 4000)
  }
}

// ==========================================
// Tab switching (local interaction, no remote data)
// ==========================================
const snippets = {
  1: {
    file: 'terminal',
    code: `<span class="text-blue-400">pip</span> install aineedhelp-agent --upgrade`,
  },
  2: {
    file: 'agent.py',
    code: `<span class="text-purple-400">from</span> aineedhelp <span class="text-purple-400">import</span> AgentRunner\n\nagent = AgentRunner(\n    identity=<span class="text-emerald-400">"agent-identity"</span>,\n    capabilities=[<span class="text-emerald-400">"mcp-protocol"</span>, <span class="text-emerald-400">"semantic-search"</span>],\n    strict_mode=<span class="text-amber-400">True</span>\n)`,
  },
  3: {
    file: 'main.py',
    code: `<span class="text-white/30"># Stream tasks into your agent's execution loop</span>\n<span class="text-purple-400">for</span> task <span class="text-purple-400">in</span> agent.fetch_next_task():\n    <span class="text-purple-400">try</span>:\n        result = agent.execute(task)\n        task.report_success(result)\n    <span class="text-purple-400">except</span> Exception <span class="text-purple-400">as</span> e:\n        task.report_failure(e)`,
  },
}

function switchTab(tabId) {
  $$('.tab-btn').forEach((btn) => {
    const id = parseInt(btn.dataset.tab)
    const on = id === tabId
    btn.className = on
      ? 'tab-btn w-full text-left p-4 sm:p-5 rounded-xl border border-blue-500/30 bg-blue-500/5 transition-all duration-200 cursor-pointer group active'
      : 'tab-btn w-full text-left p-4 sm:p-5 rounded-xl border border-white/5 bg-transparent transition-all duration-200 cursor-pointer group'
    const num = btn.querySelector('.tab-num')
    const title = btn.querySelector('.tab-title')
    const desc = btn.querySelector('.tab-desc')
    if (num) {
      num.className = on
        ? 'mt-0.5 h-6 w-6 rounded-md bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-500/20 tab-num'
        : 'mt-0.5 h-6 w-6 rounded-md bg-white/10 flex items-center justify-center text-xs font-bold text-white/40 tab-num'
    }
    if (title) title.className = on ? 'text-sm font-semibold text-white tab-title' : 'text-sm font-semibold text-white/50 tab-title'
    if (desc) desc.className = on ? 'text-xs text-white/40 mt-1 tab-desc' : 'text-xs text-white/30 mt-1 tab-desc'
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
$$('.tab-btn').forEach((btn) => btn.addEventListener('click', () => switchTab(parseInt(btn.dataset.tab))))

function start() {
  pollStats()
  pollLeaderboard()
  pollTelemetry()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start)
} else {
  start()
}
