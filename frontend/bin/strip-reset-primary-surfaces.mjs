import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const repoRoot = join(root, '..');
const resetSlugs = [
  'cursor-usage-reset',
  'claude-code-limit-reset',
  'github-copilot-credits-reset',
  'manus-credits-reset',
  'replit-usage-reset',
  'bolt-tokens-reset',
];

function update(path, transform) {
  if (!existsSync(path)) return;
  const before = readFileSync(path, 'utf8');
  const after = transform(before);
  if (after !== before) writeFileSync(path, after);
}

update(join(root, 'index.html'), html => {
  html = html
    .replace('<title>AI Help for Usage Limits, Account Access & Relay Risk</title>', '<title>Phone Number Routes & Relay Risk | AI Need Help</title>')
    .replace('AI stopped? Check when usage resets, keep control of phone numbers important accounts may need again, and assess relay exit risk with evidence-backed tools.', 'Find currently workable phone-number routes, keep control of important numbers, and assess relay exit risk with evidence-backed tools.')
    .replace('Reset timing, account-access phone numbers and relay-risk checks for the interruptions that strand AI users.', 'Phone-number routes, account-access continuity and relay-risk checks for the interruptions that strand AI users.')
    .replace('Tools for AI usage limits, account-access phone numbers and relay reliability.', 'Tools for account-access phone numbers, practical phone routes and relay reliability.')
    .replace('<small>reset · access · reliability</small>', '<small>phone routes · access · reliability</small>')
    .replace('<a href="#phone-survival">Account access</a><a href="#ai-reset-tools">Usage resets</a><a href="#relay-risk">Relay risk</a>', '<a href="#phone-survival">Phone routes</a><a href="#relay-risk">Relay risk</a>')
    .replace('Hit a usage limit, worried an account may need your phone number again, or relying on a relay? Pick the interruption and get a concrete next step.', 'Need a phone route that works in practice, worried an account may need your number again, or relying on a relay? Pick the problem and get a concrete next step.')
    .replace('<div class="continuity-actions"><a class="continuity-primary" href="#ai-reset-tools">I hit a limit <span aria-hidden="true">→</span></a><a class="continuity-secondary" href="/tools/phone-number-survival-guide/">Protect account access</a></div>', '<div class="continuity-actions"><a class="continuity-primary" href="/tools/phone-number-survival-guide/">Find a phone route <span aria-hidden="true">→</span></a><a class="continuity-secondary" href="/tools/relay-exit-risk-checker/">Check relay risk</a></div>')
    .replace('aria-label="Three interruptions this site helps you plan around"', 'aria-label="Two problems this site helps you plan around"')
    .replace('<a href="#ai-reset-tools"><span class="continuity-num">01</span><span class="continuity-state"><small>USAGE LIMIT</small><strong>When can I use AI again?</strong><em>Reset timing &amp; usage →</em></span></a>', '')
    .replace('<span class="continuity-num">02</span><span class="continuity-state"><small>ACCOUNT ACCESS</small>', '<span class="continuity-num">01</span><span class="continuity-state"><small>ACCOUNT ACCESS</small>')
    .replace('<span class="continuity-num">03</span><span class="continuity-state"><small>RELAY RISK</small>', '<span class="continuity-num">02</span><span class="continuity-state"><small>RELAY RISK</small>')
    .replace('<div class="continuity-memory"><b>RESET</b><i></i><b>ACCESS</b><i></i><b>RELIABILITY</b></div>', '<div class="continuity-memory"><b>ACCESS</b><i></i><b>RELIABILITY</b></div>')
    .replace('Try “Cursor reset”, “keep number alive”, or “relay risk”…', 'Try “keep number alive”, “OTP abroad”, or “relay risk”…')
    .replace('<a href="#ai-reset-tools">I am blocked by a limit instead</a>', '')
    .replace('Reset timing, account access and relay-risk checks for the moments AI work gets stuck.', 'Phone-route, account-access and relay-risk checks for the moments AI work gets stuck.');

  html = html.replace(/<section class="scene-hero" id="ai-reset-tools">[\s\S]*?<\/section>\s*/g, '');
  for (const slug of resetSlugs) {
    const tuple = new RegExp('\\["[^"]+","/tools/' + slug + '/","[^"]*"\\],?', 'g');
    html = html.replace(tuple, '');
  }
  return html;
});

update(join(root, 'tools', 'index.html'), html => {
  html = html
    .replace('<title>Phone Number, AI Usage & Utility Tools | Everyday Tools</title>', '<title>Phone Number & Browser Tools | AI Need Help</title>')
    .replace('Phone number survival guidance, AI usage reset trackers, relay risk checks and fast browser utilities — free, private-first and no sign-up required.', 'Phone-number route guidance, relay risk checks and fast browser utilities — free, private-first and no sign-up required.')
    .replace('"name":"Phone Number, AI Usage & Utility Tools"', '"name":"Phone Number & Browser Tools"')
    .replace('<p class="eyebrow">Phone number &amp; AI utility tools</p>', '<p class="eyebrow">Phone number &amp; browser tools</p>')
    .replace('Start with phone-number survival, then use focused AI reset, relay-risk and browser utilities. No account is required.', 'Start with phone-number routes, then use relay-risk and lightweight browser utilities. No account is required.');
  html = html.replace(/<section><p class="eyebrow">AI usage &amp; reset tools<\/p>[\s\S]*?<\/section>/g, '');
  html = html.replace(/<section><p class="eyebrow">New AI quota tools<\/p>[\s\S]*?<\/section>/g, '');
  return html;
});

for (const path of [join(root, 'sitemap.xml'), join(repoRoot, 'sitemap.xml')]) {
  update(path, xml => {
    for (const slug of resetSlugs) {
      const block = new RegExp('\\s*<url>\\s*<loc>https://aineedhelpfromotherai\\.com/tools/' + slug + '/<\\/loc>[\\s\\S]*?<\\/url>', 'g');
      xml = xml.replace(block, '');
    }
    return xml;
  });
}

console.log('Removed Reset from primary product surfaces while preserving direct Reset URLs.');
