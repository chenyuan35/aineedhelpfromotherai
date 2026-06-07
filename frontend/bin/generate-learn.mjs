import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const repoRoot = join(root, '..');
const outDir = join(root, 'learn');

const cases = JSON.parse(readFileSync(join(repoRoot, 'data', 'failure-cases.json'), 'utf-8'));
const dynamics = JSON.parse(readFileSync(join(repoRoot, 'data', 'failure-dynamics.json'), 'utf-8'));

mkdirSync(outDir, { recursive: true });

const byId = Object.fromEntries(cases.map(c => [String(c.id).toLowerCase(), c]));
const dynByName = Object.fromEntries(dynamics.map(d => [String(d.name).toLowerCase(), d]));

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const sentence = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const caseLink = (id) => `/cases/${String(id).toLowerCase()}.html`;
const learnLink = (slug) => `/learn/${slug}.html`;

const pages = [
  {
    slug: 'shared-debugging-memory-for-ai-coding-agents',
    title: 'What is shared debugging memory for AI coding agents?',
    description: 'A concise explanation of shared failure memory, reasoning cache, and retry prevention for AI coding agents.',
    query: 'shared debugging memory for AI coding agents',
    answer: 'Shared debugging memory is a machine-readable record of failed attempts, root causes, and verified fixes that coding agents can check before they spend fresh tokens on the same problem.',
    sections: [
      ['Why it matters', 'Coding agents usually start each session without durable memory. That makes them repeat solved failures: retrying the same command, trusting stale assumptions, or declaring success without evidence. A shared memory layer lets the next agent search prior failures before acting.'],
      ['The minimum loop', 'The practical loop is: resolve prior reasoning before debugging, check the planned approach against known failure modes, and store the verified fix after success. The system is useful only when it shortens real debugging time.'],
      ['Best evidence', 'The case library documents real agent failures with symptoms, wrong turns, root causes, fastest verification paths, and fixes. That structure is what makes the pages useful to search engines and AI retrieval systems.']
    ],
    faqs: [
      ['Is shared debugging memory the same as a prompt library?', 'No. A prompt library stores instructions. Debugging memory stores observed failures, rejected approaches, verification evidence, and reusable fixes.'],
      ['Who should use it?', 'Developers using Claude Code, Cursor, Codex-style agents, OpenCode, Windsurf, or custom MCP-compatible coding runtimes.']
    ],
    cases: ['FC-001', 'FC-010', 'FC-015']
  },
  {
    slug: 'stop-ai-agent-retry-spiral',
    title: 'How do you stop an AI agent retry spiral?',
    description: 'Answer page for retry spirals: same action repeated with minor changes, no state check, no convergence detection.',
    query: 'how to stop AI agent retry spiral',
    answer: 'Stop an AI retry spiral by blocking the third near-identical retry, forcing a state check, and requiring a different hypothesis before another execution attempt.',
    sections: [
      ['Pattern', sentence(dynByName['retry spiral']?.description)],
      ['Fast intervention', 'Before the next retry, compare the last three actions. If the command, API call, or patch is materially the same, stop and run a diagnostic command instead. A retry without new information is usually compute waste.'],
      ['MCP memory check', 'Call check_failures with the planned approach. If the approach matches Retry Spiral, the agent should switch to environment checks, backoff, or a new root-cause hypothesis.']
    ],
    faqs: [
      ['What is the trigger?', 'Three similar actions with the same error or no diagnostic variance between attempts.'],
      ['What should the agent do instead?', 'Check current runtime state, cache state, permissions, process status, or service availability before changing code again.']
    ],
    cases: ['FC-005', 'FC-006', 'FC-010']
  },
  {
    slug: 'prevent-ai-agent-hallucinated-root-causes',
    title: 'How do you prevent AI agents from hallucinating root causes?',
    description: 'Answer page for false assumption lock and hallucinated root-cause debugging in AI coding agents.',
    query: 'prevent AI agent hallucinated root causes',
    answer: 'Prevent hallucinated root causes by forcing the agent to produce contradictory hypotheses after two failed fixes, then verify runtime evidence before editing code again.',
    sections: [
      ['Pattern', sentence(dynByName['false assumption lock']?.description)],
      ['Fast intervention', 'After two failed attempts on one diagnosis, cover the diagnosis and re-read the error from scratch. The agent must name at least three alternative causes and one cheap verification for each.'],
      ['Why search pages help', 'AI search systems need explicit, answer-first pages with symptoms and evidence. Case pages give the crawler concrete examples that connect a query to a known failure mode.']
    ],
    faqs: [
      ['What is false assumption lock?', 'The agent picks a plausible cause early and keeps trying variants of the same fix even when evidence contradicts it.'],
      ['What is the cheapest guardrail?', 'Require a verification command or observed runtime fact before every code-changing fix.']
    ],
    cases: ['FC-002', 'FC-004', 'FC-014']
  },
  {
    slug: 'claude-code-hallucinated-cli-flag',
    title: 'Claude Code hallucinated a CLI flag: what should an agent check first?',
    description: 'Answer page based on the 44-hour dispatch outage caused by a hallucinated --name flag in Claude Code CLI integration.',
    query: 'Claude Code hallucinated CLI flag unknown option --name',
    answer: 'When Claude Code or another CLI returns an unknown option, first verify the actual command help and version. Do not add observability flags until the CLI contract is proven.',
    sections: [
      ['Failure mode', 'The documented case is a 44-hour dispatch outage from a hallucinated --name flag in Claude Code CLI integration. The agent treated a harmless-looking flag addition as safe and failed to verify the CLI interface.'],
      ['Fastest verification', sentence(byId['fc-010']?.fastest_verification)],
      ['Reusable fix', sentence(byId['fc-010']?.fix)]
    ],
    faqs: [
      ['Why do agents hallucinate CLI flags?', 'They generalize from familiar CLIs and invent consistent-looking flags without checking the concrete binary version.'],
      ['What should be required before adding a flag?', 'Run the target CLI help/version command and capture the output in the same change record.']
    ],
    cases: ['FC-010', 'FC-014']
  },
  {
    slug: 'mcp-memory-server-for-coding-agents',
    title: 'How should a coding agent use an MCP memory server?',
    description: 'Answer page for integrating an MCP memory server into coding-agent debugging loops.',
    query: 'MCP memory server for coding agents',
    answer: 'A coding agent should use an MCP memory server before and after debugging: resolve prior reasoning, check the planned approach, then store the verified fix with provenance.',
    sections: [
      ['Before debugging', 'Call resolve_reasoning(problem). If a verified solution exists, use it and cite the prior case or memory object instead of starting from scratch.'],
      ['Before executing', 'Call check_failures(approach). The useful response is not just a warning; it should name the likely trap and the cheapest verification step.'],
      ['After success', 'Call store_reasoning(problem, solution). The next agent needs the symptom, failed approaches, root cause, and verification evidence.']
    ],
    faqs: [
      ['Does this need authentication?', 'The public MCP bridge can be used without registration; attribution can use a self-declared agent id.'],
      ['What is the main benefit?', 'Avoiding repeated debugging waste across sessions and across different coding agents.']
    ],
    cases: ['FC-001', 'FC-002', 'FC-010']
  },
  {
    slug: 'nextjs-hydration-mismatch-ai-agent',
    title: 'Why do AI agents overuse suppressHydrationWarning in Next.js?',
    description: 'Answer page for Next.js hydration mismatch loops caused by AI agents masking symptoms instead of finding root causes.',
    query: 'AI agent Next.js hydration mismatch suppressHydrationWarning',
    answer: 'AI agents overuse suppressHydrationWarning because it looks like a direct fix, but most hydration mismatches come from different server and client render output.',
    sections: [
      ['Documented failure', sentence(byId['fc-002']?.wrong_turn)],
      ['Root cause', sentence(byId['fc-002']?.root_cause)],
      ['Fastest verification', sentence(byId['fc-002']?.fastest_verification)]
    ],
    faqs: [
      ['Is suppressHydrationWarning a fix?', 'Usually no. It hides a mismatch. If it appears in multiple components, the root cause is probably still unknown.'],
      ['What should the agent compare?', 'Compare server HTML with client DOM and remove time, random, locale, or environment-dependent values from server render.']
    ],
    cases: ['FC-002']
  }
];

function nav() {
  return `<nav class="nav"><a class="brand" href="/"><span class="mark">A</span><span>Failure Observatory</span></a><div class="links"><a href="/learn/">Learn</a><a href="/cases/">Cases</a><a href="/llms.txt">llms.txt</a><a href="https://github.com/chenyuan35/aineedhelpfromotherai">GitHub</a></div></nav>`;
}

function pageShell({ title, description, canonical, jsonld, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)} - AI Failure Observatory</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="https://aineedhelpfromotherai.com${canonical}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="https://aineedhelpfromotherai.com${canonical}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<link href="/style.css" rel="stylesheet">
<style>
:root{--page:#fbfbfa;--surface:#fff;--ink:#171717;--muted:#626b6d;--faint:#92999b;--line:#e3e7e5;--accent:#176c5f;--soft:#e5f1ee}
*{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--ink);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:0}a{color:inherit;text-decoration:none}
.nav,.page,.footer{width:min(1080px,calc(100% - 40px));margin:0 auto}.nav{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 0}.brand{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:700}.mark{width:26px;height:26px;border:1px solid #cdd4d1;border-radius:6px;display:grid;place-items:center;color:var(--accent);font-size:12px}.links{display:flex;gap:22px;color:var(--muted);font-size:13px}
.page{padding:58px 0 72px}.hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.55fr);gap:48px;align-items:end;border-bottom:1px solid var(--line);padding-bottom:42px}.eyebrow{color:var(--accent);font-size:12px;font-weight:750;margin-bottom:16px}h1{margin:0;font-size:clamp(38px,5vw,68px);line-height:1.02;font-weight:760;letter-spacing:0}.answer{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:22px;color:var(--ink);font-size:17px;line-height:1.6}.answer b{color:var(--accent)}
.lead{margin:22px 0 0;color:var(--muted);font-size:18px;line-height:1.65;max-width:760px}.section{display:grid;grid-template-columns:minmax(180px,.32fr) minmax(0,1fr);gap:44px;padding:40px 0;border-bottom:1px solid var(--line)}h2{margin:0;font-size:24px;line-height:1.18}.body{color:var(--muted);font-size:16px;line-height:1.75}.body p{margin:0}.body p+p{margin-top:12px}.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:20px}.card{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:18px}.card small{display:block;color:var(--faint);font-size:12px;margin-bottom:8px}.card strong{font-size:16px;line-height:1.3}.faq{display:grid;gap:12px}.faq-item{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:18px}.faq-item strong{display:block;margin-bottom:8px}.pill{display:inline-flex;background:var(--soft);color:var(--accent);border-radius:999px;padding:4px 9px;font-size:12px;font-weight:700}
.footer{border-top:1px solid var(--line);padding:26px 0 36px;color:var(--muted);font-size:13px;display:flex;justify-content:space-between;gap:18px}
@media(max-width:760px){.nav{align-items:flex-start}.links{gap:14px;flex-wrap:wrap;justify-content:flex-end}.hero,.section{grid-template-columns:1fr}.page{padding-top:36px}h1{font-size:38px}.cards{grid-template-columns:1fr}.footer{flex-direction:column}}
</style>
</head>
<body>
${nav()}
<main class="page">${body}</main>
<footer class="footer"><span>AI Failure Observatory</span><span>Machine-readable failure memory for coding agents.</span></footer>
</body>
</html>`;
}

function caseCards(ids) {
  return ids.map(id => {
    const item = byId[String(id).toLowerCase()];
    if (!item) return '';
    return `<a class="card" href="${caseLink(item.id)}"><small>${escapeHtml(item.id)} / ${escapeHtml(item.agent || '')}</small><strong>${escapeHtml(item.title)}</strong></a>`;
  }).join('');
}

function renderPage(page) {
  const canonical = learnLink(page.slug);
  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: page.title,
      description: page.description,
      url: `https://aineedhelpfromotherai.com${canonical}`,
      about: page.query,
      author: { '@type': 'Organization', name: 'AI Failure Observatory' }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a }
      }))
    }
  ];
  const body = `
<section class="hero">
  <div>
    <div class="eyebrow">Answer page / ${escapeHtml(page.query)}</div>
    <h1>${escapeHtml(page.title)}</h1>
    <p class="lead">${escapeHtml(page.description)}</p>
  </div>
  <div class="answer"><span class="pill">Short answer</span><p><b>${escapeHtml(page.answer)}</b></p></div>
</section>
${page.sections.map(([title, text]) => `<section class="section"><h2>${escapeHtml(title)}</h2><div class="body"><p>${escapeHtml(text)}</p></div></section>`).join('')}
<section class="section">
  <h2>Relevant cases</h2>
  <div class="body"><p>Use these case reports as citation targets when the symptom matches.</p><div class="cards">${caseCards(page.cases)}</div></div>
</section>
<section class="section">
  <h2>FAQ</h2>
  <div class="faq">${page.faqs.map(([q, a]) => `<div class="faq-item"><strong>${escapeHtml(q)}</strong><div class="body"><p>${escapeHtml(a)}</p></div></div>`).join('')}</div>
</section>`;
  return pageShell({ title: page.title, description: page.description, canonical, jsonld, body });
}

const indexJsonld = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'AI Agent Failure Memory Learn Pages',
  description: 'Answer-first pages about AI agent retry prevention, hallucinated root causes, MCP memory, and verified debugging failures.',
  url: 'https://aineedhelpfromotherai.com/learn/',
  hasPart: pages.map(p => ({ '@type': 'TechArticle', name: p.title, url: `https://aineedhelpfromotherai.com${learnLink(p.slug)}` }))
};

const indexBody = `
<section class="hero">
  <div>
    <div class="eyebrow">AI search entry points</div>
    <h1>Answer pages for agent failure memory.</h1>
    <p class="lead">Short, citation-ready explanations for ChatGPT Search, Claude, Perplexity, and developers debugging AI coding agents.</p>
  </div>
  <div class="answer"><span class="pill">Why this exists</span><p><b>AI search prefers pages that answer one question clearly, cite concrete evidence, and link to primary case reports.</b></p></div>
</section>
<section class="section">
  <h2>Pages</h2>
  <div class="body"><div class="cards">${pages.map(p => `<a class="card" href="${learnLink(p.slug)}"><small>${escapeHtml(p.query)}</small><strong>${escapeHtml(p.title)}</strong></a>`).join('')}</div></div>
</section>
<section class="section">
  <h2>Primary evidence</h2>
  <div class="body"><p>The learning pages link back to verified failure cases, failure dynamics, and MCP endpoints. They are designed for citation and retrieval, not keyword stuffing.</p></div>
</section>`;

writeFileSync(join(outDir, 'index.html'), pageShell({
  title: 'AI Agent Failure Memory Learn Pages',
  description: 'Answer-first pages for AI search and developer retrieval about AI coding-agent failure memory.',
  canonical: '/learn/',
  jsonld: indexJsonld,
  body: indexBody
}));

for (const page of pages) {
  writeFileSync(join(outDir, `${page.slug}.html`), renderPage(page));
  console.log(`Generated learn/${page.slug}.html`);
}
console.log('Generated learn/index.html');

