import { existsSync, rmSync, cpSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Publishes the interactive Phone Radar hub (prebuilt by the lifecycle-mvp tool)
// into dist/tools/phone-number-survival-guide/, merging with the content surface
// that Astro already generated there (route / directory / market / keep-alive /
// guides pages — see frontend/site). Route pages and the sitemap are no longer
// generated here; Astro + bin/generate-sitemap-from-dist.mjs own them.

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distTools = join(root, 'dist', 'tools');
const oldDir = join(distTools, 'phone-number-lifecycle-mvp');
const newDir = join(distTools, 'phone-number-survival-guide');

if (!existsSync(oldDir)) throw new Error('Phone Radar source build output missing');
if (!existsSync(newDir)) throw new Error('Phone Radar content surface missing; run the Astro build first');
cpSync(oldDir, newDir, { recursive: true });
rmSync(oldDir, { recursive: true, force: true });

const page = join(newDir, 'index.html');
let html = readFileSync(page, 'utf8');
const showMoreWithoutAnalytics = "showMore.addEventListener('click',()=>{state.showAll=true;renderRoutes()});";
const showMoreWithAnalytics = "showMore.addEventListener('click',()=>{trackPhone('phone_show_more',{family:state.family,country:state.country});state.showAll=true;renderRoutes()});";
if (!html.includes('phone_show_more')) {
  if (!html.includes(showMoreWithoutAnalytics)) throw new Error('Phone Radar show-more handler missing');
  html = html.replace(showMoreWithoutAnalytics, showMoreWithAnalytics);
  writeFileSync(page, html);
}

const required = [
  '<title>Phone Radar',
  '<meta name="robots" content="index,follow,max-image-preview:large">',
  '<link rel="canonical" href="https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/">',
  'Long-term SMS / OTP',
  'Data SIM / eSIM',
  'Temporary SMS',
  'Full guide',
  'phone_family_select',
  'phone_filter_change',
  'phone_show_more',
  'phone_guide_open',
  'phone_outbound_click'
];
for (const marker of required) {
  if (!html.includes(marker)) throw new Error(`Phone Radar public marker missing: ${marker}`);
}
if (html.includes('Register an app or service') || html.includes('Travel or move abroad')) {
  throw new Error('Legacy Phone questionnaire leaked into public build');
}

// Inject static navigation into the hub (route guides + content surface links).
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const dataPath = join(newDir, 'uk-directory-pilot.json');
if (!existsSync(dataPath)) throw new Error('Phone Radar UK directory packet missing from public build');
const pilot = JSON.parse(readFileSync(dataPath, 'utf8'));
const routeLinks = (pilot.routes || []).map(r => {
  const brand = (pilot.brands || []).find(x => x.id === r.brandId);
  return `<a href="/tools/phone-number-survival-guide/route/${esc(r.id)}/">${esc(brand?.name || r.id)} route guide</a>`;
}).join('');
const extraLinks = `<a href="/tools/phone-number-survival-guide/guides/">Retention guides</a><a href="/tools/phone-number-survival-guide/directory/">Global directory</a><a href="/tools/phone-number-survival-guide/market/">Markets</a><a href="/tools/phone-number-survival-guide/keep-alive/">Keep-Alive Assistant</a>`;
const staticNav = `<nav class="pr-related pr-static-guides" aria-label="UK route guides">${extraLinks}${routeLinks}</nav>`;
let hub = readFileSync(page, 'utf8');
if (!hub.includes('class="pr-related pr-static-guides"')) {
  hub = hub.replace('<nav class="pr-related" aria-label="Related tools">', `${staticNav}<nav class="pr-related" aria-label="Related tools">`);
}
if (!hub.includes('pr-keep-alive-tool')) {
  const anchor = '<nav class="pr-related" aria-label="Related tools">';
  if (!hub.includes(anchor)) throw new Error('Phone Radar hub related-tools nav anchor missing');
  const link = `<nav class="pr-related pr-keep-alive-tool" aria-label="Keep-alive tool"><a href="/tools/phone-number-survival-guide/keep-alive/">Keep-Alive Assistant — turn each route's retention window into a deadline and a calendar reminder</a></nav>`;
  hub = hub.replace(anchor, link + anchor);
}
writeFileSync(page, hub);

console.log('Published Phone Radar at canonical public URL (hub merged with Astro content surface).');
