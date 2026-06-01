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
<script type="application/ld+json">${jsonld}</script>
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600&display=swap" rel="stylesheet">
<style>body{font-family:'Inter',-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}</style>
</head>
<body class="min-h-screen bg-[#F4F5F7] text-[#1E1E1E] selection:bg-[#3B5E6B] selection:text-white antialiased">
<div class="h-0.5 bg-[#3B5E6B]/30"></div>
<nav class="w-full max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center text-sm font-medium">
  <a href="/" class="hover:opacity-60 font-semibold tracking-tight">Failure Observatory</a>
  <div class="flex gap-x-5 text-[#6B6B6B] text-xs md:text-sm">
    <a href="/" class="hover:text-[#1E1E1E]">Home</a>
    <a href="/cases/" class="hover:text-[#1E1E1E]">All cases</a>
  </div>
</nav>
<main class="max-w-4xl mx-auto px-6 py-12">${content}</main>
<footer class="text-center text-[11px] tracking-wide text-[#8A8A8A] pb-8">
  <span>© 2026 AI Failure Observatory</span>
</footer>
</body>
</html>`;
}

function cardHTML(c) {
  const dynLinks = (c.dynamics || []).map(d => {
    const dkey = d.toLowerCase().replace(/\s+/g, '-');
    return `<a href="/cases/#${dkey}" class="text-[#3B5E6B] underline underline-offset-2 decoration-1 decoration-[#3B5E6B]/30">${d}</a>`;
  }).join(', ');
  return `<div class="bg-white border border-[#DCDCDC] p-6 hover:border-[#3B5E6B]/40 transition-colors">
    <div class="text-[11px] text-[#8A8A8A] tracking-wide mb-1">${c.id} · ${c.agent} · ${c.environment} · ${c.time_wasted_minutes} min lost</div>
    <h2 class="text-lg font-medium mb-2 leading-snug">
      <a href="/cases/${c.id.toLowerCase()}.html" class="text-[#1E1E1E] hover:text-[#3B5E6B] transition-colors">${c.title}</a>
    </h2>
    <p class="text-sm text-[#5A5A5A] mb-2">${c.symptoms[0]}</p>
    <div class="text-xs text-[#6B6B6B] flex flex-wrap gap-x-3 gap-y-1">
      <span>Root cause: ${c.root_cause.substring(0, 120)}…</span>
    </div>
    ${dynLinks ? `<div class="text-xs text-[#6B6B6B] mt-2">Dynamics: ${dynLinks}</div>` : ''}
  </div>`;
}

for (const c of cases) {
  const caseId = c.id.toLowerCase();
  const dynLinks = (c.dynamics || []).map(d => {
    const dkey = d.toLowerCase().replace(/\s+/g, '-');
    return `<a href="/cases/#${dkey}" class="text-[#3B5E6B] underline underline-offset-2 decoration-1 decoration-[#3B5E6B]/30">${d}</a>`;
  }).join(', ');

  const tags = (c.tags || []).map(t =>
    `<span class="inline-block bg-[#EDEDED] text-[#5A5A5A] text-[11px] px-2.5 py-1 tracking-wide">${t}</span>`
  ).join('');

  const evidence = (c.evidence_refs || []).map(r =>
    `<li><a href="${r}" class="text-[#3B5E6B] underline underline-offset-2 decoration-1 decoration-[#3B5E6B]/30 text-sm break-all">${r}</a></li>`
  ).join('');

  const content = `
<div class="mb-8">
  <div class="text-xs text-[#8A8A8A] tracking-wide mb-2 flex flex-wrap gap-x-4 gap-y-1">
    <span>${c.id}</span>
    <span>${c.agent}</span>
    <span>${c.framework}</span>
    <span>${c.environment}</span>
    <span class="font-medium text-[#1E1E1E]">${c.time_wasted_minutes} min wasted</span>
    ${c.priority_tier ? `<span class="font-medium ${c.priority_tier === 'S' ? 'text-red-600' : 'text-amber-600'}">${severityLabel(c.priority_tier)}</span>` : ''}
  </div>
  <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mb-6">${c.title}</h1>
</div>

<div class="space-y-8">
  <section>
    <h2 class="text-xs text-[#8A8A8A] tracking-widest uppercase mb-2">Symptoms</h2>
    <ul class="list-disc pl-5 text-sm text-[#5A5A5A] space-y-1">
      ${(c.symptoms || []).map(s => `<li>${s}</li>`).join('')}
    </ul>
  </section>

  <section class="bg-white border border-[#DCDCDC] p-5">
    <h2 class="text-xs text-[#8A8A8A] tracking-widest uppercase mb-2">The Trap</h2>
    <p class="text-sm text-[#5A5A5A]"><strong class="text-[#1E1E1E]">Initial assumption:</strong> ${c.initial_ai_assumption}</p>
    <p class="text-sm text-[#5A5A5A] mt-2"><strong class="text-[#1E1E1E]">Wrong turn:</strong> ${c.wrong_turn}</p>
    ${c.retry_pattern ? `<p class="text-sm text-[#5A5A5A] mt-2"><strong class="text-[#1E1E1E]">Pattern:</strong> ${c.retry_pattern}</p>` : ''}
  </section>

  <section>
    <h2 class="text-xs text-[#8A8A8A] tracking-widest uppercase mb-2">Root Cause</h2>
    <p class="text-sm text-[#5A5A5A]">${c.root_cause}</p>
  </section>

  <section>
    <h2 class="text-xs text-[#8A8A8A] tracking-widest uppercase mb-2">Fastest Verification</h2>
    <p class="text-sm text-[#5A5A5A]">${c.fastest_verification}</p>
  </section>

  <section>
    <h2 class="text-xs text-[#8A8A8A] tracking-widest uppercase mb-2">Fix</h2>
    <p class="text-sm text-[#5A5A5A]">${c.fix}</p>
  </section>

  <section class="bg-[#3B5E6B]/5 border-l-4 border-[#3B5E6B] p-5">
    <h2 class="text-xs text-[#8A8A8A] tracking-widest uppercase mb-2">Key Insight</h2>
    <p class="text-sm text-[#1E1E1E] font-medium italic">"${c.key_insight}"</p>
  </section>

  ${dynLinks ? `<section><h2 class="text-xs text-[#8A8A8A] tracking-widest uppercase mb-2">Related Dynamics</h2><div class="text-sm">${dynLinks}</div></section>` : ''}

  ${tags ? `<section><h2 class="text-xs text-[#8A8A8A] tracking-widest uppercase mb-2">Tags</h2><div class="flex flex-wrap gap-2">${tags}</div></section>` : ''}

  ${evidence ? `<section><h2 class="text-xs text-[#8A8A8A] tracking-widest uppercase mb-2">Evidence</h2><ul class="space-y-1">${evidence}</ul></section>` : ''}
</div>`;

  writeFileSync(join(outDir, `${caseId}.html`), pageHTML(content, {
    title: c.title,
    tags: c.tags || [],
    insight: c.key_insight,
    canonical: `/cases/${caseId}.html`
  }));
  console.log(`Generated cases/${caseId}.html`);
}

// Generate index page
const cards = cases.map(c => cardHTML(c)).join('\n');

const dynSections = dynamics.map(d => {
  const relatedCases = cases.filter(c => (c.dynamics || []).includes(d.name));
  if (relatedCases.length === 0) return '';
  const caseLinks = relatedCases.map(c =>
    `<a href="/cases/${c.id.toLowerCase()}.html" class="text-[#3B5E6B] underline underline-offset-2 decoration-1 decoration-[#3B5E6B]/30">${c.title}</a>`
  ).join(', ');
  return `<section id="${d.id}" class="scroll-mt-16">
    <h2 class="text-lg font-medium mb-1">${d.name}</h2>
    <p class="text-sm text-[#5A5A5A] mb-2">${d.description}</p>
    <div class="text-xs text-[#6B6B6B] flex flex-wrap gap-x-4 mb-2">
      <span>${relatedCases.length} cases</span>
      <span>${d.total_time_wasted_min} min total</span>
    </div>
    <div class="text-sm">${caseLinks}</div>
  </section>`;
}).filter(Boolean).join('\n<hr class="border-[#DCDCDC] my-6">\n');

const indexContent = pageHTML(`
<div class="mb-10">
  <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">Failure Cases</h1>
  <p class="text-sm text-[#5A5A5A] max-w-2xl">Real documented AI debugging failures with verified root causes and fixes. Each case includes symptoms, wrong turns, root cause analysis, and the fastest path to resolution.</p>
</div>

<div class="space-y-4 mb-12">
  ${cards}
</div>

<hr class="border-[#DCDCDC] my-12">

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
