// lib/hint-telemetry.js — Hint consumption observability
// Tracks: hints served, prompts injected, citations detected
// Persisted to data/hint-telemetry.json for querying

const fs = require('fs');
const path = require('path');

const TELEMETRY_PATH = path.join(__dirname, '..', 'data', 'hint-telemetry.json');
const EVENT_LOG = []; // ring buffer in memory, last 1000 events
const MAX_LOG = 1000;

// Accumulators reset daily
let today = new Date().toISOString().slice(0, 10);

const COUNTERS = {
  hints_served: 0,        // hint objects attached to responses
  prompts_injected: 0,    // _prompt fields included
  hints_cited: 0,         // citations detected in submissions
  resolve_with_hints: 0,  // resolve_reasoning calls that had hints available
  list_with_hints: 0,     // list_open_tasks calls that had hints
  total_list_calls: 0,    // total list_open_tasks calls
  total_resolve_calls: 0, // total resolve_reasoning calls
  total_submit_calls: 0,  // total submit_result calls
};

function load() {
  try {
    if (fs.existsSync(TELEMETRY_PATH)) {
      return JSON.parse(fs.readFileSync(TELEMETRY_PATH, 'utf8'));
    }
  } catch (e) {
    console.error('[hint-telemetry] Load error:', e.message);
  }
  return { days: {} };
}

function save(data) {
  try {
    const dir = path.dirname(TELEMETRY_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(TELEMETRY_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('[hint-telemetry] Save error:', e.message);
  }
}

function getDayKey() {
  const d = new Date().toISOString().slice(0, 10);
  if (d !== today) {
    // Persist current day before switching
    const data = load();
    data.days[today] = { ...COUNTERS };
    save(data);
    today = d;
    Object.keys(COUNTERS).forEach(k => COUNTERS[k] = 0);
  }
  return d;
}

function persist() {
  const data = load();
  data.days[today] = { ...COUNTERS };
  save(data);
}

function logEvent(type, payload) {
  EVENT_LOG.unshift({ ts: new Date().toISOString(), type, ...payload });
  if (EVENT_LOG.length > MAX_LOG) EVENT_LOG.length = MAX_LOG;
}

// Called when hints are served in a response
function trackHintsServed(source, agentId, count) {
  COUNTERS.hints_served += count;
  COUNTERS.prompts_injected += count > 0 ? 1 : 0;
  if (source === 'list_open_tasks') COUNTERS.list_with_hints += count > 0 ? 1 : 0;
  if (source === 'resolve_reasoning') COUNTERS.resolve_with_hints += count > 0 ? 1 : 0;
  logEvent('hints_served', { source, agent_id: agentId, count });
}

// Called when list_open_tasks is called
function trackListCall(agentId, hintCount) {
  COUNTERS.total_list_calls++;
  trackHintsServed('list_open_tasks', agentId, hintCount);
}

// Called when resolve_reasoning is called
function trackResolveCall(agentId, hit, hintCount) {
  COUNTERS.total_resolve_calls++;
  if (hintCount > 0) COUNTERS.resolve_with_hints++;
  trackHintsServed('resolve_reasoning', agentId, hintCount);
  logEvent('resolve_call', { agent_id: agentId, hit, hint_count: hintCount });
}

// Called when submit_result is called — detect citation
function trackSubmitCall(agentId, taskId, resultText, hint) {
  COUNTERS.total_submit_calls++;
  if (hint && hint.hit) {
    const cited = detectCitation(resultText, hint);
    if (cited) {
      COUNTERS.hints_cited++;
      logEvent('hints_cited', { agent_id: agentId, task_id: taskId, reasoning_id: hint.reasoning_id, confidence: cited });
    }
    logEvent('submit_with_hint', { agent_id: agentId, task_id: taskId, cited: !!cited });
  }
}

// Simple citation detection: check if result mentions the hint's reasoning_id
// or shares significant key terms from the solution_summary
function detectCitation(resultText, hint) {
  if (!resultText || !hint) return false;
  const text = resultText.toLowerCase();

  // Exact reasoning_id match
  if (hint.reasoning_id && text.includes(hint.reasoning_id.toLowerCase())) {
    return 'direct_id';
  }

  // Solution summary key terms (only for hints with meaningful summaries)
  const summary = (hint.solution_summary || '');
  if (summary.length > 30) {
    // Extract key technical terms (words 4+ chars, not common stop words)
    const stopWords = new Set(['this', 'that', 'with', 'from', 'have', 'been', 'will', 'were', 'they', 'their', 'what', 'when', 'where', 'which', 'there', 'about', 'would', 'could', 'should', 'after', 'before', 'between', 'without', 'through', 'during', 'because']);
    const terms = summary.toLowerCase().split(/[^a-zA-Z0-9_+#-]+/).filter(w => w.length >= 4 && !stopWords.has(w));

    // Count matches
    let matches = 0;
    for (const term of terms) {
      if (text.includes(term)) matches++;
    }

    if (terms.length >= 3 && matches >= Math.ceil(terms.length * 0.3)) {
      return `partial_match (${matches}/${terms.length} terms)`;
    }
  }

  return false;
}

function getSummary() {
  const data = load();
  const days = Object.keys(data.days).sort();
  const totals = { hints_served: 0, prompts_injected: 0, hints_cited: 0, total_list_calls: 0, total_resolve_calls: 0, total_submit_calls: 0 };
  for (const day of days) {
    const d = data.days[day];
    for (const k of Object.keys(totals)) {
      totals[k] += d[k] || 0;
    }
  }
  // Merge current day
  for (const k of Object.keys(totals)) {
    totals[k] += COUNTERS[k] || 0;
  }
  return {
    totals,
    today: { ...COUNTERS },
    days,
    recent_events: EVENT_LOG.slice(0, 50),
    updated_at: new Date().toISOString(),
  };
}

// Auto-persist every 60s
setInterval(persist, 60000).unref();
// Persist on exit
process.on('exit', persist);
process.on('SIGINT', () => { persist(); process.exit(); });
process.on('SIGTERM', () => { persist(); process.exit(); });

module.exports = {
  trackListCall,
  trackResolveCall,
  trackSubmitCall,
  trackHintsServed,
  getSummary,
  detectCitation,
  persist,
};
