import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const repoRoot = join(root, '..');
const siteUrl = 'https://aineedhelpfromotherai.com';
const apiUrl = 'https://api.aineedhelpfromotherai.com';
const generatedAt = process.env.FAILURE_INDEX_DATE || new Date().toISOString();

function readJson(path) {
  return JSON.parse(readFileSync(join(repoRoot, path), 'utf8'));
}

function oneLine(value, max = 280) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 3).trim()}...` : text;
}

function minutesFor(record) {
  return Number(record.time_wasted_minutes || record.time_lost_min || 0);
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

const allCases = readJson('data/failure-cases.json');
const cases = allCases.filter(c => c?.source !== 'daily-auto-generate' && !String(c?.id || '').startsWith('FC_AUTO_'));
const dynamics = readJson('data/failure-dynamics.json');
const interventions = dynamics.flatMap(d => safeArray(d.interventions).map(i => ({ ...i, dynamic: d.name })));
const totalMinutes = cases.reduce((sum, c) => sum + minutesFor(c), 0);

const payload = {
  name: 'AI Failure Observatory failure index',
  version: 1,
  generated_at: generatedAt,
  purpose: 'Machine-readable index of real AI coding-agent debugging failures, root causes, fastest verification steps, and guardrail interventions.',
  core_question: 'What interventions reduce AI debugging time waste?',
  canonical_url: `${siteUrl}/failure-index.json`,
  license: 'MIT',
  stats: {
    failure_cases: cases.length,
    observed_minutes: totalMinutes,
    observed_hours: Math.round((totalMinutes / 60) * 10) / 10,
    failure_dynamics: dynamics.length,
    interventions: interventions.length,
    pending_interventions: interventions.filter(i => i.effectiveness_tracking === 'pending').length
  },
  discovery: {
    site: siteUrl,
    failure_index: `${siteUrl}/failure-index.json`,
    cases: `${siteUrl}/cases/`,
    learn: `${siteUrl}/learn/`,
    api_docs: `${siteUrl}/api/docs/`,
    llms_txt: `${siteUrl}/llms.txt`,
    ai_policy: `${siteUrl}/ai.txt`,
    sitemap: `${siteUrl}/sitemap.xml`,
    feed: `${siteUrl}/feed.xml`,
    mcp_server_card: `${siteUrl}/.well-known/mcp`,
    agent_card: `${siteUrl}/.well-known/agent-card.json`,
    openapi: `${siteUrl}/openapi.json`,
    api_manifest: `${apiUrl}/api/manifest`
  },
  recommended_agent_loop: [
    'Before debugging, call resolve_reasoning(problem) or POST /api/memory/search.',
    'Before executing a plausible fix, call check_failures(approach).',
    'If the planned action matches a failure dynamic, run the fastest verification before editing code.',
    'After a verified fix, store the solution with root cause and evidence.'
  ],
  dynamics: dynamics.map(d => ({
    id: d.id,
    name: d.name,
    alias: d.alias,
    description: oneLine(d.description),
    trigger: oneLine(d.indicator),
    escape_route: oneLine(d.escape_route),
    total_cases: Number(d.total_cases || 0),
    observed_minutes: Number(d.total_time_wasted_min || 0),
    related_cases: safeArray(d.related_cases),
    interventions: safeArray(d.interventions).map(i => ({
      name: i.name,
      action: oneLine(i.action),
      effectiveness_tracking: i.effectiveness_tracking || 'pending',
      applied_count: Number(i.applied_count || 0),
      avg_time_saved_min: Number(i.avg_time_saved_min || 0)
    }))
  })),
  cases: cases.map(c => {
    const id = String(c.id || '').toLowerCase();
    const tags = [...new Set([...safeArray(c.tags), ...safeArray(c.dynamics), c.agent, c.environment].filter(Boolean))];
    return {
      id: c.id,
      title: c.title,
      url: `${siteUrl}/cases/${id}.html`,
      agent: c.agent || null,
      environment: c.environment || safeArray(c.environments)[0] || null,
      observed_minutes: minutesFor(c),
      severity: c.priority_tier || null,
      dynamics: safeArray(c.dynamics),
      tags,
      symptoms: safeArray(c.symptoms).map(s => oneLine(s, 180)),
      wrong_turn: oneLine(c.wrong_turn),
      root_cause: oneLine(c.root_cause),
      fastest_verification: oneLine(c.fastest_verification),
      fix: oneLine(c.fix),
      reusable_memory: oneLine(c.key_insight || c.description || c.root_cause),
      query_terms: tags.concat([c.title, c.id]).filter(Boolean)
    };
  })
};

const json = `${JSON.stringify(payload, null, 2)}\n`;
writeFileSync(join(root, 'failure-index.json'), json);
writeFileSync(join(repoRoot, 'failure-index.json'), json);
console.log(`Generated failure-index.json with ${cases.length} cases and ${dynamics.length} dynamics`);
