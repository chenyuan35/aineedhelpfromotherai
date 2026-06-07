import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cases = JSON.parse(readFileSync(join(__dirname, '..', '..', 'data', 'failure-cases.json'), 'utf-8'));
const dynamics = JSON.parse(readFileSync(join(__dirname, '..', '..', 'data', 'failure-dynamics.json'), 'utf-8'));
const outDir = join(__dirname, '..', 'cases');

mkdirSync(outDir, { recursive: true });

const safe = (v, fallback = '-') => (v === undefined || v === null || v === '' ? fallback : v);
const safeArr = (v) => (Array.isArray(v) ? v : []);
const caseHref = (id) => `/cases/${String(id).toLowerCase()}.html`;
const dynHref = (name) => `/cases/#${String(name).toLowerCase().replace(/\s+/g, '-')}`;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function minutesLabel(value) {
  const n = Number(value || 0);
  if (n >= 1440) return `${Math.round(n / 60)} hours`;
  if (n >= 60) return `${Math.round((n / 60) * 10) / 10} hours`;
  return `${n} min`;
}

function truncate(value, length = 150) {
  const s = String(value || '').trim();
  return s.length > length ? `${s.slice(0, length).trim()}...` : s;
}

function severityLabel(tier) {
  if (tier === 'S') return 'Critical';
  if (tier === 'A') return 'High';
  return 'Medium';
}

function pageHTML(content, meta) {
  const canonical = meta.canonical || '/';
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: meta.title,
    description: meta.insight,
    datePublished: '2026-01-01',
    author: { '@type': 'Organization', name: 'AI Failure Observatory' },
    about: `AI debugging failure case: ${meta.title}`,
    keywords: meta.tags.join(', ')
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(meta.title)} - AI Failure Observatory</title>
<meta name="description" content="${escapeHtml(meta.insight)}">
<meta name="keywords" content="${escapeHtml(meta.tags.join(', '))}">
<link rel="canonical" href="https://aineedhelpfromotherai.com${canonical}">
<meta property="og:title" content="${escapeHtml(meta.title)}">
<meta property="og:description" content="${escapeHtml(meta.insight)}">
<meta property="og:url" content="https://aineedhelpfromotherai.com${canonical}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${jsonld}</script>
<link href="/style.css" rel="stylesheet">
<style>
:root {
  --page: #fbfbfa;
  --surface: #ffffff;
  --ink: #171717;
  --muted: #626b6d;
  --faint: #92999b;
  --line: #e3e7e5;
  --line-strong: #cdd4d1;
  --accent: #176c5f;
  --accent-soft: #e5f1ee;
  --danger: #b95b31;
}
* { box-sizing: border-box; }
html { background: var(--page); scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100vh;
  background: var(--page);
  color: var(--ink);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  letter-spacing: 0;
}
a { color: inherit; text-decoration: none; }
.nav, .page, .footer { width: min(1120px, calc(100% - 40px)); margin: 0 auto; }
.nav {
  padding: 22px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.brand { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 650; }
.brand-mark {
  width: 26px;
  height: 26px;
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  display: grid;
  place-items: center;
  background: var(--surface);
}
.brand-mark svg { width: 17px; height: 17px; }
.nav-links { display: flex; gap: 22px; color: var(--muted); font-size: 13px; }
.nav-links a:hover { color: var(--ink); }
.page { padding: 58px 0 68px; }
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.9fr);
  gap: 56px;
  align-items: end;
  padding-bottom: 42px;
  border-bottom: 1px solid var(--line);
}
.eyebrow { color: var(--accent); font-size: 12px; font-weight: 700; margin-bottom: 16px; }
h1 { margin: 0; font-size: clamp(36px, 3.9vw, 54px); line-height: 1.05; font-weight: 720; letter-spacing: 0; }
.lead { margin: 20px 0 0; color: var(--muted); font-size: 17px; line-height: 1.65; max-width: 680px; }
.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface);
}
.stat { padding: 20px; }
.stat + .stat { border-left: 1px solid var(--line); }
.stat strong { display: block; font-size: 26px; line-height: 1.08; margin-bottom: 8px; overflow-wrap: anywhere; }
.stat span { color: var(--muted); font-size: 13px; }
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 32px;
}
.case-card {
  display: flex;
  flex-direction: column;
  min-height: 250px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 22px;
}
.case-card:hover { border-color: var(--line-strong); box-shadow: 0 16px 48px rgba(20, 24, 23, 0.07); }
.meta { display: flex; flex-wrap: wrap; gap: 8px; color: var(--faint); font-size: 12px; margin-bottom: 14px; }
.pill {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 12px;
  font-weight: 650;
}
.case-card h2 { margin: 0; font-size: 20px; line-height: 1.22; letter-spacing: 0; }
.case-card p { margin: 14px 0 0; color: var(--muted); font-size: 14px; line-height: 1.6; }
.root { margin-top: auto; padding-top: 18px; color: var(--muted); font-size: 13px; line-height: 1.5; }
.root b { color: var(--ink); }
.section {
  display: grid;
  grid-template-columns: minmax(220px, 0.38fr) minmax(0, 1fr);
  gap: 44px;
  padding: 44px 0;
  border-bottom: 1px solid var(--line);
}
.section h2 { margin: 0; font-size: 24px; line-height: 1.15; letter-spacing: 0; }
.section-body { color: var(--muted); font-size: 15px; line-height: 1.7; }
.section-body p { margin: 0; }
.section-body p + p { margin-top: 12px; }
.detail-list { margin: 0; padding-left: 18px; }
.detail-list li + li { margin-top: 6px; }
.detail-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 22px;
}
.callout {
  background: var(--accent-soft);
  border: 1px solid #c9e3dc;
  border-radius: 8px;
  color: var(--ink);
  padding: 22px;
  font-weight: 620;
}
.links { display: flex; flex-wrap: wrap; gap: 8px; }
.text-link { color: var(--accent); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
.dynamics {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-top: 24px;
}
.dynamic-card {
  min-height: 150px;
  padding: 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
}
.dynamic-card h3 { margin: 0 0 10px; font-size: 15px; }
.dynamic-card p { margin: 0; color: var(--muted); font-size: 12.5px; line-height: 1.5; }
.dynamic-card .numbers { margin-top: 14px; color: var(--faint); font-size: 12px; }
.footer {
  padding: 28px 0 34px;
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  gap: 20px;
  color: var(--faint);
  font-size: 12px;
}
@media (max-width: 980px) {
  .hero, .section { grid-template-columns: 1fr; }
  .dynamics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px) {
  .nav, .page, .footer { width: min(100% - 28px, 1120px); }
  .nav { align-items: flex-start; }
  .nav-links { gap: 14px; flex-wrap: wrap; justify-content: flex-end; }
  .page { padding-top: 34px; }
  h1 { font-size: 38px; }
  .grid, .stats, .dynamics { grid-template-columns: 1fr; }
  .stat + .stat { border-left: 0; border-top: 1px solid var(--line); }
  .footer { flex-direction: column; }
}
</style>
</head>
<body>
<nav class="nav" aria-label="Primary">
  <a class="brand" href="/">
    <span class="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 17h16"/>
        <path d="M7 17a5 5 0 0 1 10 0"/>
        <path d="M12 4v5"/>
        <path d="M9 7h6"/>
      </svg>
    </span>
    <span>Failure Observatory</span>
  </a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/cases/">Cases</a>
    <a href="/llms.txt">llms.txt</a>
  </div>
</nav>
<main class="page">${content}</main>
<footer class="footer">
  <span>Open source failure intelligence for coding agents.</span>
  <span><a href="https://github.com/chenyuan35/aineedhelpfromotherai">GitHub</a> / <a href="/api/manifest">API manifest</a></span>
</footer>
</body>
</html>`;
}

function dynLinksHTML(names) {
  return safeArr(names).map(d =>
    `<a class="pill" href="${dynHref(d)}">${escapeHtml(d)}</a>`
  ).join('');
}

function cardHTML(c) {
  const env = safe(c.environment, Array.isArray(c.environments) ? c.environments[0] : null);
  const timeMin = safe(c.time_wasted_minutes, safe(c.time_lost_min, 0));
  const symptom = safe(safeArr(c.symptoms)[0], c.description, 'No symptoms recorded');
  return `<a class="case-card" href="${caseHref(c.id)}">
    <div class="meta">
      <span>${escapeHtml(c.id)}</span>
      <span>${escapeHtml(safe(c.agent))}</span>
      <span>${escapeHtml(env)}</span>
      <span>${escapeHtml(minutesLabel(timeMin))} lost</span>
    </div>
    <h2>${escapeHtml(c.title)}</h2>
    <p>${escapeHtml(symptom)}</p>
    <div class="root"><b>Root cause</b> ${escapeHtml(truncate(safe(c.root_cause, ''), 135))}</div>
  </a>`;
}

for (const c of cases) {
  const caseId = String(c.id).toLowerCase();
  const env = safe(c.environment, Array.isArray(c.environments) ? c.environments[0] : null);
  const timeMin = safe(c.time_wasted_minutes, safe(c.time_lost_min, 0));
  const symptomsHTML = safeArr(c.symptoms).map(s => `<li>${escapeHtml(s)}</li>`).join('')
    || (c.description ? `<li>${escapeHtml(c.description)}</li>` : '');
  const tags = safeArr(c.tags).map(t => `<span class="pill">${escapeHtml(t)}</span>`).join('');
  const evidence = safeArr(c.evidence_refs).map(r =>
    `<li><a class="text-link" href="${escapeHtml(r)}">${escapeHtml(r)}</a></li>`
  ).join('');
  const runtimeLabel = [safe(c.agent), env].filter(Boolean).join(' / ') || safe(c.framework, 'runtime');

  const content = `
<section class="hero">
  <div>
    <div class="eyebrow">${escapeHtml(c.id)} / ${escapeHtml(safe(c.agent))} / ${escapeHtml(env)}</div>
    <h1>${escapeHtml(c.title)}</h1>
    <p class="lead">${escapeHtml(safe(c.key_insight, c.description, 'Failure case'))}</p>
  </div>
  <div class="stats">
    <div class="stat"><strong>${escapeHtml(minutesLabel(timeMin))}</strong><span>observed waste</span></div>
    <div class="stat"><strong>${escapeHtml(runtimeLabel)}</strong><span>runtime context</span></div>
    <div class="stat"><strong>${escapeHtml(c.priority_tier ? severityLabel(c.priority_tier) : 'Case')}</strong><span>severity tier</span></div>
  </div>
</section>

<section class="section">
  <h2>Symptoms</h2>
  <div class="section-body"><ul class="detail-list">${symptomsHTML}</ul></div>
</section>

<section class="section">
  <h2>The trap</h2>
  <div class="section-body detail-card">
    <p><b>Initial assumption:</b> ${escapeHtml(safe(c.initial_ai_assumption, c.description))}</p>
    <p><b>Wrong turn:</b> ${escapeHtml(safe(c.wrong_turn))}</p>
    ${c.retry_pattern ? `<p><b>Pattern:</b> ${escapeHtml(c.retry_pattern)}</p>` : ''}
  </div>
</section>

<section class="section">
  <h2>Root cause</h2>
  <div class="section-body"><p>${escapeHtml(safe(c.root_cause))}</p></div>
</section>

<section class="section">
  <h2>Fastest path</h2>
  <div class="section-body">
    <p><b>Verify:</b> ${escapeHtml(safe(c.fastest_verification))}</p>
    <p><b>Fix:</b> ${escapeHtml(safe(c.fix))}</p>
  </div>
</section>

<section class="section">
  <h2>Reusable memory</h2>
  <div class="section-body callout">${escapeHtml(safe(c.key_insight, c.description))}</div>
</section>

${safeArr(c.dynamics).length || tags || evidence ? `<section class="section">
  <h2>Links</h2>
  <div class="section-body">
    ${safeArr(c.dynamics).length ? `<p>Dynamics</p><div class="links">${dynLinksHTML(c.dynamics)}</div>` : ''}
    ${tags ? `<p style="margin-top:18px">Tags</p><div class="links">${tags}</div>` : ''}
    ${evidence ? `<p style="margin-top:18px">Evidence</p><ul class="detail-list">${evidence}</ul>` : ''}
  </div>
</section>` : ''}`;

  writeFileSync(join(outDir, `${caseId}.html`), pageHTML(content, {
    title: c.title,
    tags: safeArr(c.tags),
    insight: safe(c.key_insight, c.description, 'Failure case'),
    canonical: `/cases/${caseId}.html`
  }));
  console.log(`Generated cases/${caseId}.html`);
}

const totalMinutes = cases.reduce((sum, c) => sum + Number(safe(c.time_wasted_minutes, safe(c.time_lost_min, 0))), 0);
const cards = cases.map(c => cardHTML(c)).join('\n');

const dynSections = dynamics.map(d => {
  const relatedCases = cases.filter(c => safeArr(c.dynamics).includes(d.name));
  if (relatedCases.length === 0) return '';
  return `<article class="dynamic-card" id="${escapeHtml(d.id)}">
    <h3>${escapeHtml(d.name)}</h3>
    <p>${escapeHtml(d.description)}</p>
    <div class="numbers">${relatedCases.length} cases / ${escapeHtml(minutesLabel(d.total_time_wasted_min))}</div>
  </article>`;
}).filter(Boolean).join('\n');

const indexContent = pageHTML(`
<section class="hero">
  <div>
    <div class="eyebrow">Failure case library</div>
    <h1>Measured agent failures with verified fixes.</h1>
    <p class="lead">A compact library of real debugging failures: symptoms, wrong turns, root causes, and the fastest verification path. Built to feed the MCP memory layer, not to become a content maze.</p>
  </div>
  <div class="stats">
    <div class="stat"><strong>${cases.length}</strong><span>documented cases</span></div>
    <div class="stat"><strong>${dynamics.length}</strong><span>failure dynamics</span></div>
    <div class="stat"><strong>${totalMinutes.toLocaleString()}</strong><span>minutes observed</span></div>
  </div>
</section>

<div class="grid">
  ${cards}
</div>

<section class="section" style="border-bottom:0">
  <div>
    <div class="eyebrow">Failure dynamics</div>
    <h2>Patterns that repeat across agents.</h2>
  </div>
  <div class="section-body">
    <p>These dynamics are the product layer: they turn isolated failures into interventions that future agents can check before acting.</p>
    <div class="dynamics">${dynSections}</div>
  </div>
</section>
`, {
  title: 'Failure Cases',
  tags: ['AI debugging', 'failure cases', 'agent errors'],
  insight: 'Documented AI debugging failures with verified root causes and fixes.',
  canonical: '/cases/'
});

writeFileSync(join(outDir, 'index.html'), indexContent);
console.log('Generated cases/index.html');
console.log('Done.');
