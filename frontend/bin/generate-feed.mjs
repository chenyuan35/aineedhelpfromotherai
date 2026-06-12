import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const repoRoot = join(root, '..');
const siteUrl = 'https://aineedhelpfromotherai.com';
const cases = JSON.parse(readFileSync(join(repoRoot, 'data', 'failure-cases.json'), 'utf-8'));
const generatedAt = process.env.FEED_DATE || new Date().toISOString();
const pubDate = new Date(generatedAt).toUTCString();

const escapeXml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

function minutesFor(c) {
  return Number(c.time_wasted_minutes || c.time_lost_min || 0);
}

function item({ title, link, description, categories = [] }) {
  const categoryXml = categories
    .filter(Boolean)
    .slice(0, 5)
    .map(c => `      <category>${escapeXml(c)}</category>`)
    .join('\n');
  return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
${categoryXml}
    </item>`;
}

const caseItems = [...cases]
  .sort((a, b) => minutesFor(b) - minutesFor(a))
  .map(c => {
    const id = String(c.id).toLowerCase();
    const minutes = minutesFor(c);
    return item({
      title: `${c.id}: ${c.title}`,
      link: `${siteUrl}/cases/${id}.html`,
      description: `${c.key_insight || c.description || c.root_cause || 'Observed AI debugging failure.'} Observed waste: ${minutes.toLocaleString()} minutes.`,
      categories: [...(c.dynamics || []), ...(c.tags || [])]
    });
  });

const primaryItems = [
  item({
    title: 'Failure Memory for AI Coding Agents',
    link: `${siteUrl}/`,
    description: 'Search known AI coding-agent failures before retrying, check traps before executing, and store verified fixes through MCP and REST.',
    categories: ['AI debugging', 'MCP', 'agent memory']
  }),
  item({
    title: 'MCP and REST integration for coding agents',
    link: `${siteUrl}/for-agents/`,
    description: 'Agent-native protocol page with MCP endpoint, REST memory endpoints, discovery files, and recommended call order.',
    categories: ['MCP', 'REST', 'integration']
  }),
  item({
    title: 'Failure case library',
    link: `${siteUrl}/cases/`,
    description: `${cases.length} documented AI debugging failures with symptoms, wrong turns, root causes, fastest verification, and reusable memory.`,
    categories: ['failure cases', 'debugging']
  })
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Failure Observatory</title>
    <link>${siteUrl}/</link>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Machine-readable failure memory updates for AI coding agents.</description>
    <language>en</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <ttl>1440</ttl>
${[...primaryItems, ...caseItems].join('\n')}
  </channel>
</rss>
`;

writeFileSync(join(root, 'feed.xml'), xml);
writeFileSync(join(repoRoot, 'feed.xml'), xml);
console.log(`Generated feed.xml with ${primaryItems.length + caseItems.length} items`);
