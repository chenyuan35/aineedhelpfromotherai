import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const oldBorder = 'var(--border,#d9d9df)';
const resetSlugs = [
  'cursor-usage-reset',
  'claude-code-limit-reset',
  'github-copilot-credits-reset',
  'manus-credits-reset',
  'replit-usage-reset',
  'bolt-tokens-reset',
  'ai-credit-burn-rate-calculator',
];

for (const slug of resetSlugs) {
  const path = join(root, 'tools', slug, 'index.html');
  let html = readFileSync(path, 'utf8');
  html = html.replaceAll(oldBorder, 'var(--line)');
  if (html.includes(oldBorder)) throw new Error(`Reset border token repair failed: ${slug}`);
  writeFileSync(path, html);
}

const relayPath = join(root, 'tools', 'relay-exit-risk-checker', 'index.html');
let relay = readFileSync(relayPath, 'utf8');
const oldRelay = '.choice-button{background:var(--panel);color:var(--text);border:1px solid var(--line);box-shadow:none;padding:10px 8px}.choice-button[aria-pressed="true"]{background:var(--text);color:var(--panel);border-color:var(--text)}';
const fixedRelay = '.choice-button{background:var(--panel);color:var(--ink);border:1px solid var(--line);box-shadow:none;padding:10px 8px}.choice-button[aria-pressed="true"]{background:var(--ink);color:var(--panel);border-color:var(--ink)}html[data-theme="dark"] body .choice-button{background:var(--panel);color:var(--ink);border-color:var(--line)}html[data-theme="dark"] body .choice-button[aria-pressed="true"]{background:var(--ink);color:var(--panel);border-color:var(--ink)}';
if (relay.includes(oldRelay)) relay = relay.replace(oldRelay, fixedRelay);
if (!relay.includes(fixedRelay) || relay.includes('choice-button{background:var(--panel);color:var(--text)')) {
  throw new Error('Relay selected-state token repair failed');
}
writeFileSync(relayPath, relay);

console.log('Fixed cross-site visual tokens for Reset borders and Relay selected states.');
