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
  'ai-credit-burn-rate-calculator',
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
    .replace('<p class="home-kicker"><span class="status-dot" aria-hidden="true"></span>Primary · Account access continuity</p><h2>Do not treat a phone number as disposable if an account may need it again.</h2><p class="phone-lead">Choose a route you can actually buy, activate, use, keep alive and recover. The guide separates documented carrier rules from unknowns instead of pretending every number has the same lifecycle.</p>', '<p class="home-kicker"><span class="status-dot" aria-hidden="true"></span>Primary · Phone routes</p><h2>Compare real-number SMS/OTP, travel data and temporary SMS routes that work in practice.</h2><p class="phone-lead">Use current user/community outcomes for operating reality, then check provider pages for live price, package and purchase details. Keep a durable number when recovery matters; choose data-only or temporary SMS when that is the actual job.</p>')
    .replace('Build my survival plan <span aria-hidden="true">→</span>', 'Compare current routes <span aria-hidden="true">→</span>')
    .replace('Official rules first · explicit unknowns · no phone number or SMS code collection', 'Current operating outcomes · provider price/purchase data · no phone number or SMS code collection')
    .replace('aria-label="Phone number lifecycle"', 'aria-label="Long-term phone number lifecycle"')
    .replace('The real question is not “Can I verify today?” It is “Will I still control it later?”', 'For a durable number, the real question is not only “Can I verify today?” but “Will I still control it later?”')
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
  html = html.replace(/<section><p class="eyebrow">AI usage & reset tools<\/p>[\s\S]*?<\/section>/g, '');
  html = html.replace(/<section><p class="eyebrow">New AI quota tools<\/p>[\s\S]*?<\/section>/g, '');
  return html;
});

for (const path of [join(root, 'ai.txt'), join(repoRoot, 'ai.txt')]) {
  update(path, text => text
    .replace('The current site focuses on three related continuity jobs for AI users: usage-limit resets, account-access phone-number continuity, and AI relay dependency risk.', 'The current site focuses on account-access phone-number continuity and AI relay dependency risk, with lightweight browser utilities remaining available.')
    .replace('- https://aineedhelpfromotherai.com/tools/cursor-usage-reset/\n', '')
    .replace('- https://aineedhelpfromotherai.com/tools/claude-code-limit-reset/\n', '')
    .replace('3. Treat reset countdowns and pacing outputs as user-specific calculations, not universal provider policy.\n', '')
    .replace('4. Treat Phone Number Survival guidance as a lifecycle decision aid, not a guarantee that a given service will accept a number.\n', '3. Treat Phone Number Survival guidance as a decision aid, not a guarantee that a given service will accept a number.\n')
    .replace('5. Treat the Relay Exit Risk Index as a 0–100 risk signal derived from available evidence, not a shutdown probability, fraud/scam score, or factual accusation.\n', '4. Treat the Relay Exit Risk Index as a 0–100 risk signal derived from available evidence, not a shutdown probability, fraud/scam score, or factual accusation.\n')
    .replace('6. Prefer current canonical pages over historical repository material describing the former AI-agent debugging/MCP product.\n', '5. Prefer current canonical pages over historical repository material describing the former AI-agent debugging/MCP product.\n')
    .replace('Last reviewed: 2026-09-17', 'Last reviewed: 2026-09-23'));
}

for (const path of [join(root, 'llms.txt'), join(repoRoot, 'llms.txt')]) {
  update(path, text => text
    .replace('# AI Need Help — Reset, Access & Reliability Tools', '# AI Need Help — Phone Access & Relay Risk Tools')
    .replace('> Use this site when AI work is blocked by a usage limit, when account access depends on keeping control of a phone number, or when relying on a third-party AI relay creates dependency risk.', '> Use this site when account access depends on finding or keeping control of a workable phone number, or when relying on a third-party AI relay creates dependency risk.')
    .replace('- https://aineedhelpfromotherai.com/tools/cursor-usage-reset/ — Cursor reset timing and usage pacing\n', '')
    .replace('- https://aineedhelpfromotherai.com/tools/claude-code-limit-reset/ — Claude Code session/weekly reset calculator based on the reset information shown to the user\n', '')
    .replace('The current product is organized around three related continuity jobs:', 'The current product is organized around two primary continuity jobs:')
    .replace('2. **Usage continuity** — understand when AI usage limits reset and when work can resume.\n3. **Dependency continuity** — assess relay exit risk without presenting the score as a shutdown, fraud, scam, or calibrated probability.', '2. **Dependency continuity** — assess relay exit risk without presenting the score as a shutdown, fraud, scam, or calibrated probability.')
    .replace('Phone Number Lifecycle is the primary product surface. Reset tools and Relay Exit Risk are supporting surfaces. Older general calculators and image tools remain available but are not the product focus.', 'Phone Radar is the primary product surface. Relay Exit Risk remains a supporting data product. Older general calculators and image tools remain available but are not the product focus.')
    .replace('Last reviewed: 2026-09-17', 'Last reviewed: 2026-09-23'));
}

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
