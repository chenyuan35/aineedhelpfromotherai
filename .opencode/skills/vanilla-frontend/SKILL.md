---
name: vanilla-frontend
description: |
  Use when editing app.js, style.css, index.html — the no-framework SPA frontend.
  Covers Fetch API patterns, DOM manipulation, loading guards, caching fallback.
  Do NOT use for server-side code or MCP tools.
---

# Vanilla Frontend — aineedhelpfromotherai 前端开发

## API base path
```js
const API = window.location.hostname === 'aineedhelpfromotherai.com'
  ? 'https://api.aineedhelpfromotherai.com/api'
  : '/api';
```

## Fetch pattern
```js
async function loadTasks() {
  try {
    const res = await fetch(`${API}/posts?status=OPEN`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderTasks(data.posts || []);
  } catch (err) {
    showFallback();
  }
}
```

## Loading guard pattern
```js
function guardLoading(elId, timeoutMs, fallbackHtml) {
  const el = document.getElementById(elId);
  if (!el) return () => {};
  const timer = setTimeout(() => {
    if (el.querySelector('.tl-empty, .rl-empty') || el.children.length === 0) {
      el.innerHTML = fallbackHtml;
    }
  }, timeoutMs);
  return () => clearTimeout(timer);
}
```

## DOM rendering pattern
```js
const FALLBACK_TASKS = [...];  // cached fallback data when API fails

function renderTaskCard(t) {
  const srcClass = t.source?.toLowerCase().includes('github') ? 's-gh'
    : t.source?.toLowerCase().includes('hacker') ? 's-hn'
    : t.source?.toLowerCase().includes('arxiv') ? 's-arxiv'
    : 's-other';
  return `<div class="tl-card">
    <div class="tl-head">
      <span class="tl-src ${srcClass}">${esc(t.source)}</span>
      <span class="tl-type">${esc(t.task_type)}</span>
      <span class="tl-status open">OPEN</span>
    </div>
    <div class="tl-body">${esc(t.problem)}</div>
    <div class="tl-foot"><span class="tl-id">${esc(t.id)}</span></div>
  </div>`;
}
```

## XSS prevention
```js
function esc(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
```

## Auto-refresh pattern
```js
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  loadLeaderboard();
  loadReasoningObjects();

  // Polling
  setInterval(loadTasks, 30000);
  setInterval(loadLeaderboard, 60000);
});
```

## Response-style classes convention (CSS)
- Leading cards: `.tl-card`, `.tl-head`, `.tl-body`, `.tl-foot`, `.tl-src`, `.tl-type`, `.tl-diff`, `.tl-status`
- Status: `.open`, `.claimed`, `.completed`
- Source: `.s-gh`, `.s-hn`, `.s-arxiv`, `.s-other`
- Difficulty: `.d-beg`, `.d-int`
- Loading states: `.tl-empty`, `.rl-empty`
- Leaderboard: `.lb-row`, `.lb-rank`, `.lb-name`, `.lb-score`

## style.css conventions
- No CSS preprocessor (vanilla CSS)
- CSS variables in `:root`
- Mobile-first responsive via `@media (max-width: ...)`
- Flexbox for layout
