import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cases = JSON.parse(readFileSync(join(__dirname, '..', '..', 'data', 'failure-cases.json'), 'utf-8'));
const dynamics = JSON.parse(readFileSync(join(__dirname, '..', '..', 'data', 'failure-dynamics.json'), 'utf-8'));
const outDir = join(__dirname, '..', 'cases');

mkdirSync(outDir, { recursive: true });

const dynMap = {};
for (const d of dynamics) {
  dynMap[d.id] = d;
}

const severityLabel = (tier) => {
  if (tier === 'S') return 'Critical';
  if (tier === 'A') return 'High';
  return 'Medium';
};

const safe = (v, fallback = '—') => (v === undefined || v === null || v === '' ? fallback : v);
const safeArr = (v) => (Array.isArray(v) ? v : []);

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
<title>${meta.title} — AI Failure Observatory</title>
<meta name="description" content="${meta.insight}">
<meta name="keywords" content="${meta.tags.join(', ')}">
<link rel="canonical" href="https://aineedhelpfromotherai.com${canonical}">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.insight}">
<meta property="og:url" content="https://aineedhelpfromotherai.com${canonical}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${jsonld}</script>
<link href="/style.css" rel="stylesheet">
</head>
<body class="min-h-screen bg-[#FAFAF7] text-[#2C2A29] selection:bg-[#D97757] selection:text-white antialiased">
<div class="h-0.5 bg-[#D97757]/30"></div>
<nav class="w-full max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center text-sm font-medium">
  <a href="/" class="hover:opacity-60 font-semibold tracking-tight">Failure Observatory</a>
  <div class="flex gap-x-5 text-[#8B8682] text-xs md:text-sm">
    <a href="/" class="hover:text-[#2C2A29]">Home</a>
    <a href="/cases/" class="hover:text-[#2C2A29]">All cases</a>
  </div>
</nav>
<main class="max-w-4xl mx-auto px-6 py-12">${content}</main>
<footer class="text-center text-[11px] tracking-wide text-[#A09894] pb-8">
  <span>© 2026 AI Failure Observatory</span>
</footer>
</body>
</html>`;
}

function cardHTML(c) {
  const dynLinks = safeArr(c.dynamics).map(d => {
    const dkey = d.toLowerCase().replace(/\s+/g, '-');
    return `<a href="/cases/#${dkey}" class="text-[#D97757] underline underline-offset-2 decoration-1 decoration-[#D97757]/30">${d}</a>`;
  }).join(', ');
  const env = safe(c.environment, (Array.isArray(c.environments) ? c.environments[0] : null));
  const timeMin = safe(c.time_wasted_minutes, safe(c.time_lost_min, 0));
  return `<div class="bg-white p-6 shadow-warm transition-shadow hover:shadow-warm-md">
    <div class="text-[11px] text-[#A09894] tracking-wide mb-1">${c.id} · ${safe(c.agent)} · ${env} · ${timeMin} min lost</div>
    <h2 class="text-lg font-medium mb-2 leading-snug">
      <a href="/cases/${c.id.toLowerCase()}.html" class="text-[#2C2A29] hover:text-[#D97757] transition-colors">${c.title}</a>
    </h2>
    <p class="text-sm text-[#6B6560] mb-2">${safe(safeArr(c.symptoms)[0], c.description, 'No symptoms recorded')}</p>
    <div class="text-xs text-[#8B8682] flex flex-wrap gap-x-3 gap-y-1">
      <span>Root cause: ${safe(c.root_cause, '').substring(0, 120)}…</span>
    </div>
    ${dynLinks ? `<div class="text-xs text-[#8B8682] mt-2">Dynamics: ${dynLinks}</div>` : ''}
  </div>`;
}

for (const c of cases) {
  const caseId = c.id.toLowerCase();
  const dynLinks = safeArr(c.dynamics).map(d => {
    const dkey = d.toLowerCase().replace(/\s+/g, '-');
    return `<a href="/cases/#${dkey}" class="text-[#D97757] underline underline-offset-2 decoration-1 decoration-[#D97757]/30">${d}</a>`;
  }).join(', ');

  const tags = safeArr(c.tags).map(t =>
    `<span class="inline-block bg-[#F0ECE8] text-[#6B6560] text-[11px] px-2.5 py-1 tracking-wide">${t}</span>`
  ).join('');

  const evidence = safeArr(c.evidence_refs).map(r =>
    `<li><a href="${r}" class="text-[#D97757] underline underline-offset-2 decoration-1 decoration-[#D97757]/30 text-sm break-all">${r}</a></li>`
  ).join('');

  const env = safe(c.environment, (Array.isArray(c.environments) ? c.environments[0] : null));
  const timeMin = safe(c.time_wasted_minutes, safe(c.time_lost_min, 0));
  const symptomsHTML = safeArr(c.symptoms).map(s => `<li>${s}</li>`).join('')
    || (c.description ? `<li>${c.description}</li>` : '');

  const content = `
<div class="mb-8">
  <div class="text-xs text-[#A09894] tracking-wide mb-2 flex flex-wrap gap-x-4 gap-y-1">
    <span>${c.id}</span>
    <span>${safe(c.agent)}</span>
    <span>${safe(c.framework)}</span>
    <span>${env}</span>
    <span class="font-medium text-[#2C2A29]">${timeMin} min wasted</span>
    ${c.priority_tier ? `<span class="font-medium ${c.priority_tier === 'S' ? 'text-red-600' : 'text-amber-600'}">${severityLabel(c.priority_tier)}</span>` : ''}
  </div>
  <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mb-6">${c.title}</h1>
</div>

<div class="space-y-8">
  <section>
    <h2 class="text-xs text-[#A09894] tracking-widest uppercase mb-2">Symptoms</h2>
    <ul class="list-disc pl-5 text-sm text-[#6B6560] space-y-1">
      ${symptomsHTML}
    </ul>
  </section>

  <section class="bg-white p-6 shadow-warm">
    <h2 class="text-xs text-[#A09894] tracking-widest uppercase mb-2">The Trap</h2>
    <p class="text-sm text-[#6B6560]"><strong class="text-[#2C2A29]">Initial assumption:</strong> ${safe(c.initial_ai_assumption, c.description)}</p>
    <p class="text-sm text-[#6B6560] mt-2"><strong class="text-[#2C2A29]">Wrong turn:</strong> ${safe(c.wrong_turn)}</p>
    ${c.retry_pattern ? `<p class="text-sm text-[#6B6560] mt-2"><strong class="text-[#2C2A29]">Pattern:</strong> ${c.retry_pattern}</p>` : ''}
  </section>

  <section>
    <h2 class="text-xs text-[#A09894] tracking-widest uppercase mb-2">Root Cause</h2>
    <p class="text-sm text-[#6B6560]">${safe(c.root_cause)}</p>
  </section>

  <section>
    <h2 class="text-xs text-[#A09894] tracking-widest uppercase mb-2">Fastest Verification</h2>
    <p class="text-sm text-[#6B6560]">${safe(c.fastest_verification)}</p>
  </section>

  <section>
    <h2 class="text-xs text-[#A09894] tracking-widest uppercase mb-2">Fix</h2>
    <p class="text-sm text-[#6B6560]">${safe(c.fix)}</p>
  </section>

  <section class="bg-[#D97757]/5 border-l-4 border-[#D97757] p-5">
    <h2 class="text-xs text-[#A09894] tracking-widest uppercase mb-2">Key Insight</h2>
    <p class="text-sm text-[#2C2A29] font-medium italic">"${safe(c.key_insight, c.description)}"</p>
  </section>

  ${dynLinks ? `<section><h2 class="text-xs text-[#A09894] tracking-widest uppercase mb-2">Related Dynamics</h2><div class="text-sm">${dynLinks}</div></section>` : ''}

  ${tags ? `<section><h2 class="text-xs text-[#A09894] tracking-widest uppercase mb-2">Tags</h2><div class="flex flex-wrap gap-2">${tags}</div></section>` : ''}

  ${evidence ? `<section><h2 class="text-xs text-[#A09894] tracking-widest uppercase mb-2">Evidence</h2><ul class="space-y-1">${evidence}</ul></section>` : ''}
</div>`;

  writeFileSync(join(outDir, `${caseId}.html`), pageHTML(content, {
    title: c.title,
    tags: safeArr(c.tags),
    insight: safe(c.key_insight, c.description, 'Failure case'),
    canonical: `/cases/${caseId}.html`
  }));
  console.log(`Generated cases/${caseId}.html`);
}

// Generate index page
const cards = cases.map(c => cardHTML(c)).join('\n');

const dynSections = dynamics.map(d => {
  const relatedCases = cases.filter(c => safeArr(c.dynamics).includes(d.name));
  if (relatedCases.length === 0) return '';
  const caseLinks = relatedCases.map(c =>
    `<a href="/cases/${c.id.toLowerCase()}.html" class="text-[#D97757] underline underline-offset-2 decoration-1 decoration-[#D97757]/30">${c.title}</a>`
  ).join(', ');
  return `<section id="${d.id}" class="scroll-mt-16">
    <h2 class="text-lg font-medium mb-1">${d.name}</h2>
    <p class="text-sm text-[#6B6560] mb-2">${d.description}</p>
    <div class="text-xs text-[#8B8682] flex flex-wrap gap-x-4 mb-2">
      <span>${relatedCases.length} cases</span>
      <span>${d.total_time_wasted_min} min total</span>
    </div>
    <div class="text-sm">${caseLinks}</div>
  </section>`;
}).filter(Boolean).join('\n<hr class="border-[#E8E4DF] my-6">\n');

const indexContent = pageHTML(`
<div class="mb-10">
  <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">Failure Cases</h1>
  <p class="text-sm text-[#6B6560] max-w-2xl">Real documented AI debugging failures with verified root causes and fixes. Each case includes symptoms, wrong turns, root cause analysis, and the fastest path to resolution.</p>
</div>

<div class="space-y-4 mb-12">
  ${cards}
</div>

<hr class="border-[#E8E4DF] my-12">

<h2 class="text-2xl font-semibold tracking-tight mb-6">Failure Dynamics</h2>
<div class="space-y-6">
  ${dynSections}
</div>
`, {
  title: 'Failure Cases — AI Failure Observatory',
  tags: ['AI debugging', 'failure cases', 'agent errors'],
  insight: 'Documented AI debugging failures with verified root causes and fixes.',
  canonical: '/cases/'
});

writeFileSync(join(outDir, 'index.html'), indexContent);
console.log('Generated cases/index.html');
console.log('Done.');
