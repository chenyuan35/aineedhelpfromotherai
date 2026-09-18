import { existsSync, rmSync, renameSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distTools = join(root, 'dist', 'tools');
const oldDir = join(distTools, 'phone-number-lifecycle-mvp');
const newDir = join(distTools, 'phone-number-survival-guide');

if (!existsSync(oldDir)) throw new Error('Phone Radar source build output missing');
rmSync(newDir, { recursive: true, force: true });
renameSync(oldDir, newDir);

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

console.log('Published Phone Radar at canonical public URL.');
