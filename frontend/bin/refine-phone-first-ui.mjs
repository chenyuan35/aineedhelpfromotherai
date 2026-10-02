import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const homePath = join(dist, 'index.html');
const phoneDir = join(dist, 'tools', 'phone-number-survival-guide');
const phonePath = join(phoneDir, 'index.html');
const comparisonPath = join(phoneDir, 'comparison-route-index.json');
const stylesheet = '/media/phone-first-identity.css';

function must(condition, message) {
  if (!condition) throw new Error(`Phone-first UI refinement failed: ${message}`);
}

function replaceRegex(html, pattern, replacement, label) {
  must(pattern.test(html), `${label} marker missing`);
  return html.replace(pattern, replacement);
}

function replaceBetween(html, start, end, replacement, label) {
  const a = html.indexOf(start);
  const b = html.indexOf(end, a + start.length);
  must(a >= 0 && b > a, `${label} boundary missing`);
  return html.slice(0, a) + replacement + html.slice(b);
}

function setMetaName(html, name, value) {
  return replaceRegex(html, new RegExp(`<meta name="${name}" content="[^"]*">`), `<meta name="${name}" content="${value}">`, `meta[name=${name}]`);
}

function setMetaProperty(html, property, value) {
  return replaceRegex(html, new RegExp(`<meta property="${property}" content="[^"]*">`), `<meta property="${property}" content="${value}">`, `meta[property=${property}]`);
}

function setJsonLd(html, type, value) {
  const pattern = new RegExp(`<script type="application/ld\\+json">\\{(?=[^<]*"@type":"${type}")[^<]*\\}<\\/script>`);
  return replaceRegex(html, pattern, `<script type="application/ld+json">${JSON.stringify(value)}</script>`, `${type} JSON-LD`);
}

function addStylesheet(html, label) {
  if (html.includes(stylesheet)) return html;
  must(html.includes('</head>'), `${label} </head> missing`);
  return html.replace('</head>', `<link rel="stylesheet" href="${stylesheet}"></head>`);
}

must(existsSync(homePath), 'built homepage missing');
must(existsSync(phonePath), 'built Phone Radar hub missing');
must(existsSync(comparisonPath), 'built comparison route index missing');
const comparison = JSON.parse(readFileSync(comparisonPath, 'utf8'));
const routeCount = Array.isArray(comparison.routes) ? comparison.routes.length : Number(comparison.routeCount || 0);
must(Number.isFinite(routeCount) && routeCount > 0, 'comparison route count unavailable');

let home = readFileSync(homePath, 'utf8');
home = replaceRegex(home, /<title>[^<]*<\/title>/, '<title>Phone Radar — Compare Real Phone Number Routes | AI Need Help</title>', 'homepage title');
home = setMetaName(home, 'description', 'Compare real phone-number routes by buy cost, yearly keep cost, SMS/OTP evidence, KYC friction, roaming behavior and recent user outcomes.');
home = setMetaProperty(home, 'og:title', 'Phone Radar — Choose a number you can actually keep');
home = setMetaProperty(home, 'og:description', 'Compare real phone-number routes by acquisition, keep-alive cost, SMS/OTP evidence, KYC and roaming before you trust a number with an important account.');
home = setJsonLd(home, 'WebPage', {
  '@context':'https://schema.org', '@type':'WebPage',
  name:'Phone Radar — Compare Real Phone Number Routes',
  description:'Compare real phone-number routes by acquisition cost, keep-alive economics, SMS/OTP evidence, KYC friction, roaming behavior and recent operating outcomes.',
  url:'https://aineedhelpfromotherai.com/'
});
home = setJsonLd(home, 'WebSite', {
  '@context':'https://schema.org', '@type':'WebSite', name:'AI Need Help',
  url:'https://aineedhelpfromotherai.com/',
  description:'Phone Radar and evidence-backed decision tools for phone-number continuity and relay reliability.'
});
home = replaceRegex(home, /<a class="brand home-brand" href="\/">AI Need Help<small>[\s\S]*?<\/small><\/a>/, '<a class="brand home-brand" href="/">AI Need Help<small>phone radar · evidence · continuity</small></a>', 'homepage brand');
home = replaceRegex(home, /<nav aria-label="Primary">[\s\S]*?<\/nav>/, '<nav aria-label="Primary"><a href="/tools/phone-number-survival-guide/">Phone Radar</a><a href="#phone-survival">How it works</a><a href="#relay-risk">Relay risk</a><a href="/tools/">All tools</a></nav>', 'homepage primary nav');

const homeHero = `<section class="continuity-hero phone-first-hero"><div class="shell phone-first-shell"><div class="phone-first-copy"><p class="phone-first-kicker"><span aria-hidden="true"></span>Phone Radar · evidence-backed number intelligence</p><h1>Choose a phone number you can actually keep.</h1><p class="phone-first-lead">Compare real phone-number routes by what they cost to buy and maintain, whether SMS/OTP still works abroad, how hard signup is, and what recent evidence says before you trust the number with an important account.</p><div class="continuity-actions phone-first-actions"><a class="continuity-primary phone-first-primary" href="/tools/phone-number-survival-guide/">Compare phone routes <span aria-hidden="true">→</span></a><a class="continuity-secondary phone-first-secondary" href="#phone-survival">How Phone Radar works</a></div><div class="phone-first-proof" aria-label="Phone Radar product facts"><div><strong>${routeCount}</strong><span>routes compared</span></div><div><strong>Buy + keep</strong><span>real cost model</span></div><div><strong>SMS / OTP</strong><span>route-specific evidence</span></div><div><strong>No sign-up</strong><span>browse first</span></div></div></div><aside class="phone-first-panel" aria-label="Phone Radar decision shortcuts"><div class="phone-first-panel-head"><p>Start from the job</p><h2>What matters most for this number?</h2><span>Use one decision shortcut, then open the route evidence before you buy.</span></div><div class="phone-first-job-grid"><a href="/tools/phone-number-survival-guide/"><b>01</b><strong>Lowest keep cost</strong><small>Compare known yearly retention economics.</small></a><a href="/tools/phone-number-survival-guide/"><b>02</b><strong>ChatGPT evidence</strong><small>See normalized OpenAI / Codex reports.</small></a><a href="/tools/phone-number-survival-guide/"><b>03</b><strong>Longest keep window</strong><small>Reduce how often the route needs attention.</small></a><a href="/tools/phone-number-survival-guide/"><b>04</b><strong>Recently checked</strong><small>Start with fresher reviewed evidence.</small></a></div><div class="phone-first-answer-strip"><span><b>BUY</b> acquisition</span><span><b>KEEP</b> retention</span><span><b>VERIFY</b> OTP</span><span><b>RECOVER</b> continuity</span></div></aside></div></section>\n`;
home = replaceBetween(home, '<section class="continuity-hero">', '<section class="home-search-band continuity-search">', homeHero, 'homepage hero');

const explainer = `<section class="phone-hero phone-first-explainer" id="phone-survival"><div class="shell phone-hero-shell"><div class="phone-copy"><p class="home-kicker"><span class="status-dot" aria-hidden="true"></span>How Phone Radar works</p><h2>Compare the route before you trust the number.</h2><p class="phone-lead">Carrier pages tell you what they sell. Phone Radar combines current provider facts with community operating outcomes, keep-alive rules, signup friction and known unknowns so you can compare the actual route instead of a marketing plan.</p><div class="phone-actions"><a class="phone-primary" href="/tools/phone-number-survival-guide/">Open Phone Radar <span aria-hidden="true">→</span></a><a href="/tools/phone-number-survival-guide/directory/">Browse the global directory</a></div><p class="phone-proof">Community outcomes · current provider facts · explicit unknowns · no SMS code collection</p></div><div class="phone-lifecycle-card phone-first-lifecycle" aria-label="Four Phone Radar decisions"><p class="phone-card-question">A useful route has to survive more than the first verification code.</p><div class="phone-lifecycle-grid"><div><span>01</span><strong>Buy</strong><small>real cost &amp; channel</small></div><div><span>02</span><strong>Keep</strong><small>action &amp; interval</small></div><div><span>03</span><strong>Verify</strong><small>service evidence</small></div><div><span>04</span><strong>Recover</strong><small>closure &amp; recycle risk</small></div></div></div></div></section>\n`;
home = replaceBetween(home, '<section class="phone-hero" id="phone-survival">', '<section class="relay-wrap" id="relay-risk">', explainer, 'homepage Phone explainer');
home = home.replace('Phone-route, account-access and relay-risk checks for the moments AI work gets stuck.', 'Phone-route intelligence and relay-risk checks for decisions that are expensive to get wrong.');
home = addStylesheet(home, 'homepage');
writeFileSync(homePath, home);

let phone = readFileSync(phonePath, 'utf8');
phone = replaceRegex(phone, /<title>[^<]*<\/title>/, '<title>Phone Radar — Compare Real SMS/OTP Number Routes</title>', 'Phone Radar title');
phone = setMetaName(phone, 'description', 'Compare real phone-number routes by acquisition cost, yearly keep cost, SMS/OTP evidence, KYC friction, roaming behavior, continuity incidents and recent verification.');
phone = setMetaProperty(phone, 'og:title', 'Phone Radar — Find a real phone route that still works later');
phone = setMetaProperty(phone, 'og:description', 'Compare what a real number costs to buy and keep, whether SMS/OTP works abroad, signup friction and recent evidence before you rely on it.');
phone = phone.replace('<a class="brand" href="/">Everyday Tools</a>', '<a class="brand" href="/">AI Need Help</a>');
phone = phone.replace('<footer class="site-footer"><div class="shell footer-grid"><div><strong>Everyday Tools</strong><p>Fast decision tools for real user problems.</p></div>', '<footer class="site-footer"><div class="shell footer-grid"><div><strong>AI Need Help</strong><p>Evidence-backed route intelligence for phone-number continuity and other high-friction decisions.</p></div>');

const phoneHero = `<section class="pr-hero pr-product-hero"><div class="pr-product-copy"><p class="pr-product-kicker"><span aria-hidden="true"></span>Phone Radar · real-number route intelligence</p><h1>Find a real phone route that still works later.</h1><p>Compare what it costs to buy and keep a number, whether it receives SMS/OTP abroad, how hard signup is, and what recent evidence says before you rely on it.</p><div class="pr-product-proof"><span>${routeCount} routes compared</span><span>Keep-alive economics</span><span>Service-specific evidence</span><span>Explicit unknowns</span></div></div><aside class="pr-product-answers" aria-label="What Phone Radar answers"><p>What Phone Radar answers</p><dl><div><dt>Buy</dt><dd>Real acquisition cost and channel</dd></div><div><dt>Keep</dt><dd>Exact action, interval and yearly cost</dd></div><div><dt>Verify</dt><dd>Observed SMS / OTP service evidence</dd></div><div><dt>Recover</dt><dd>Closure, recycling and continuity risk</dd></div></dl></aside></section>\n\n  `;
phone = replaceBetween(phone, '<section class="pr-hero">', '<p class="pr-prompt">', phoneHero, 'Phone Radar hero');
phone = phone.replace('<p class="pr-prompt">What do you need?</p>', '<p class="pr-prompt">Choose the route type</p>');
phone = addStylesheet(phone, 'Phone Radar');
writeFileSync(phonePath, phone);

for (const [label, html] of [['homepage', home], ['Phone Radar', phone]]) {
  for (const marker of ['Choose a phone number you can actually keep.', 'phone-first-identity.css']) {
    if (label === 'Phone Radar' && marker.startsWith('Choose a phone')) continue;
    must(html.includes(marker), `${label} final marker missing: ${marker}`);
  }
}
must(phone.includes('Find a real phone route that still works later.'), 'Phone Radar new H1 missing');
must(phone.includes('id="route-search"') && phone.includes('data-family="long-term"'), 'Phone Radar interaction controls were lost');

console.log(`Phone-first UI refined: homepage + Phone Radar (${routeCount} comparison routes preserved).`);
