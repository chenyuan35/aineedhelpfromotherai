import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const toolsDir = join(root, 'tools');
const BASE = 'https://aineedhelpfromotherai.com';
const ADSENSE = 'ca-pub-8244441500123371';
const TODAY = new Date().toISOString().slice(0,10);

const AI_STYLE = `
<style>
.reset-panel{display:grid;gap:1rem}.countdown-box{padding:1.1rem;border:1px solid var(--border,#d9d9df);border-radius:16px;background:rgba(127,127,127,.05)}
.countdown-label{font-size:.85rem;opacity:.72;text-transform:uppercase;letter-spacing:.06em}.countdown-big{font-size:clamp(2rem,7vw,4.2rem);font-weight:800;line-height:1.05;margin:.25rem 0}.metric-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.8rem}.metric{padding:.85rem;border:1px solid var(--border,#d9d9df);border-radius:14px}.metric strong{display:block;font-size:1.05rem;margin-top:.2rem}.quick-row{display:flex;flex-wrap:wrap;gap:.6rem}.quick-row button{width:auto}.source-note{font-size:.92rem;opacity:.8}.source-note a{text-decoration:underline}.reset-note{padding:.9rem 1rem;border-left:4px solid currentColor;background:rgba(127,127,127,.06);border-radius:10px}.progress{height:10px;border-radius:999px;background:rgba(127,127,127,.16);overflow:hidden}.progress>span{display:block;height:100%;background:currentColor;width:0}.muted-small{font-size:.88rem;opacity:.72}.status-good{font-weight:700}.status-warn{font-weight:700}
</style>`;

const SHARED_CLIENT = `
const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,'0');
function fmtDuration(ms){
  if(!Number.isFinite(ms)) return '—';
  if(ms<=0) return '00:00:00';
  const s=Math.floor(ms/1000),d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60),sec=s%60;
  return (d?d+'d ':'')+pad(h)+':'+pad(m)+':'+pad(sec);
}
function localInputValue(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes())}
function parseLocal(v){return v?new Date(v):null}
function niceDate(d){return new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(d)}
function downloadIcs(title,start,description){
  const end=new Date(start.getTime()+15*60*1000);
  const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const safe=s=>String(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Everyday Tools//Reset Tracker//EN','BEGIN:VEVENT','UID:'+Date.now()+'@aineedhelpfromotherai.com','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:'+safe(title),'DESCRIPTION:'+safe(description||''),'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));
  const a=document.createElement('a');a.href=url;a.download=title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.ics';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
`;

const tools = [
  {
    slug:'manus-credits-reset',
    title:'Manus Credits Reset Timer',
    description:'See exactly when Manus daily refresh credits reset, translated to your local timezone, with a live countdown and simple credit-use planner.',
    eyebrow:'AI usage tracker',
    intro:'Manus daily refresh credits reset at 00:00 UTC. This page converts that fixed reset to your local time and counts down to it live.',
    sourceUrl:'https://help.manus.im/en/articles/11711121-will-my-daily-refresh-credits-accumulate-or-reset',
    sourceLabel:'Manus Help Center',
    policy:'Official policy checked Sep 13, 2026: 300 daily refresh credits, reset at 00:00 UTC, unused daily credits do not roll over. Free users also have a 1,500-credit monthly cap on daily refresh credits.',
    body:`
<section class="calculator-card calculator-wide reset-panel">
  <div class="countdown-box"><div class="countdown-label">Next Manus daily refresh</div><div class="countdown-big" id="manusCountdown">—</div><div id="manusExact" class="result-details"></div></div>
  <div class="metric-grid"><div class="metric"><span>Reset rule</span><strong>00:00 UTC daily</strong></div><div class="metric"><span>Your local reset time</span><strong id="manusLocal">—</strong></div><div class="metric"><span>Daily grant</span><strong>300 credits</strong></div><div class="metric"><span>Free monthly cap</span><strong>1,500 credits</strong></div></div>
  <div class="input-row"><label>Daily credits left<input id="manusLeft" type="number" min="0" max="300" step="1" value="300"></label><label>Planned use before reset<input id="manusPlan" type="number" min="0" step="1" value="0"></label></div>
  <div class="quick-row"><button type="button" id="manusCalc">Update plan</button><button type="button" id="manusCalendar">Add reset to calendar</button></div>
  <div class="result" id="manusOut" aria-live="polite">300 credits available before the next reset.</div><div class="result-details" id="manusDetails"></div>
</section>`,
    script:`
const MKEY='everyday.manus-reset.v1';
function nextManusReset(){const n=new Date(),r=new Date(n);r.setUTCHours(24,0,0,0);return r}
function renderManus(){const r=nextManusReset(),now=new Date();$('manusCountdown').textContent=fmtDuration(r-now);$('manusExact').textContent='Resets '+niceDate(r);$('manusLocal').textContent=new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(r)}
function calcManus(){const left=Math.max(0,Number($('manusLeft').value)||0),plan=Math.max(0,Number($('manusPlan').value)||0),remain=Math.max(0,left-plan);$('manusOut').textContent=plan>left?'Planned use exceeds your remaining daily credits by '+Math.round(plan-left)+'.':'Planned use leaves '+Math.round(remain)+' daily credits before reset.';$('manusDetails').textContent=left>0?'Using '+Math.min(100,plan/left*100).toFixed(0)+'% of the daily credits you currently have left. Unused daily refresh credits disappear at reset.':'No daily credits left to plan.';localStorage.setItem(MKEY,JSON.stringify({left:$('manusLeft').value,plan:$('manusPlan').value}))}
try{const s=JSON.parse(localStorage.getItem(MKEY)||'{}');if(s.left!=null)$('manusLeft').value=s.left;if(s.plan!=null)$('manusPlan').value=s.plan}catch{}
$('manusCalc').addEventListener('click',calcManus);$('manusCalendar').addEventListener('click',()=>downloadIcs('Manus daily credits reset',nextManusReset(),'Daily refresh credits reset at 00:00 UTC.'));
renderManus();calcManus();setInterval(renderManus,1000);
`,
    sections:[
      ['When do Manus credits reset?',`<p>Manus says daily refresh credits reset every day at <strong>00:00 UTC</strong>. Because the official reset is anchored to UTC, your local reset time can change when your region enters or leaves daylight saving time. The live clock above always converts the next UTC midnight using your browser timezone.</p>`],
      ['What happens to unused daily credits?',`<p>Unused daily refresh credits do not carry over. Manus replaces the daily balance at the next refresh instead of stacking yesterday’s unused credits on top of today’s grant. That makes a countdown useful when you are deciding whether to use remaining daily credits before they disappear.</p>`],
      ['A second limit free users can hit',`<p>Manus also documents a monthly cap of 1,500 credits from the daily refresh pool for Free users. Hitting that monthly cap can stop daily refresh credits from appearing even though the daily timer itself has reached the next 00:00 UTC reset.</p>`]
    ],
    faqs:[
      ['What time do Manus credits reset?','Daily refresh credits reset at 00:00 UTC. The timer above converts that moment to your local timezone.'],
      ['Do unused Manus daily credits roll over?','No. Daily refresh credits do not accumulate; unused daily credits are removed at the next daily reset.'],
      ['How many daily refresh credits does Manus give?','The current official help article states 300 daily refresh credits for eligible active accounts.'],
      ['Why did my free daily credits stop refreshing?','Free users can also hit a monthly cap on daily refresh credits. Check your account usage and the current Manus help documentation.']
    ]
  },
  {
    slug:'replit-usage-reset',
    title:'Replit Usage Reset Timer',
    description:'Track the next Replit Free Mode usage reset with a 5-hour countdown, local saved anchor, usage pace meter and calendar reminder.',
    eyebrow:'AI usage tracker',
    intro:'Replit says Core and Pro Free Mode usage limits reset every 5 hours. Anchor this timer to the reset time shown in Replit, or start a fresh 5-hour estimate when your window resets.',
    sourceUrl:'https://replit.com/blog/replit-introduces-free-mode',
    sourceLabel:'Replit official blog',
    policy:'Official launch post checked Sep 13, 2026: Core and Pro users can use Free Mode until their usage limit, which resets every 5 hours. Replit does not publish one universal clock time for every account.',
    body:`
<section class="calculator-card calculator-wide reset-panel">
  <div class="countdown-box"><div class="countdown-label">Tracked Replit reset</div><div class="countdown-big" id="replitCountdown">Set a reset</div><div id="replitExact" class="result-details">Use the timestamp shown in Replit for best accuracy.</div></div>
  <div class="input-row"><label>Next reset date and time<input id="replitReset" type="datetime-local"></label><label>Usage used in this window (%)<input id="replitUsed" type="number" min="0" max="100" step="1" placeholder="60"></label></div>
  <div class="quick-row"><button type="button" id="replitSave">Track this reset</button><button type="button" id="replitNow">My 5-hour window just reset</button><button type="button" id="replitCalendar">Add to calendar</button></div>
  <div class="result" id="replitOut" aria-live="polite">No reset anchored yet.</div><div class="result-details" id="replitDetails"></div>
</section>`,
    script:`
const RKEY='everyday.replit-reset.v1';let replitTarget=null;
function setReplitTarget(d){replitTarget=d;$('replitReset').value=localInputValue(d);saveReplit();renderReplit()}
function saveReplit(){localStorage.setItem(RKEY,JSON.stringify({reset:$('replitReset').value,used:$('replitUsed').value}))}
function renderReplit(){const v=parseLocal($('replitReset').value);replitTarget=v;if(!v||!Number.isFinite(v.getTime())){$('replitCountdown').textContent='Set a reset';$('replitExact').textContent='Use the timestamp shown in Replit for best accuracy.';return}const ms=v-new Date();$('replitCountdown').textContent=ms>0?fmtDuration(ms):'Check Replit';$('replitExact').textContent=ms>0?'Tracked reset '+niceDate(v):'The tracked time passed. Confirm the new window in Replit and re-anchor.'}
function calcReplit(){renderReplit();const v=parseLocal($('replitReset').value),used=Math.min(100,Math.max(0,Number($('replitUsed').value)||0));if(!v||v<=new Date()){$('replitOut').textContent='Set a future reset time first.';$('replitDetails').textContent='';return}const hours=(v-new Date())/3600000,remaining=100-used,pace=remaining/Math.max(hours,.01);$('replitOut').textContent=remaining.toFixed(0)+'% of your entered window allowance remains.';$('replitDetails').textContent='To spread it evenly until reset: about '+pace.toFixed(1)+' percentage points per hour for the next '+hours.toFixed(1)+' hours. This is a planning estimate, not Replit account data.';saveReplit()}
try{const s=JSON.parse(localStorage.getItem(RKEY)||'{}');if(s.reset)$('replitReset').value=s.reset;if(s.used!=null)$('replitUsed').value=s.used}catch{}
$('replitSave').addEventListener('click',calcReplit);$('replitNow').addEventListener('click',()=>{setReplitTarget(new Date(Date.now()+5*3600000));$('replitUsed').value='0';calcReplit()});$('replitCalendar').addEventListener('click',()=>{const d=parseLocal($('replitReset').value);if(d)downloadIcs('Replit Free Mode usage reset',d,'Tracked five-hour usage reset. Confirm the live account state in Replit.')});
renderReplit();if($('replitReset').value)calcReplit();setInterval(renderReplit,1000);
`,
    sections:[
      ['How the Replit 5-hour reset works',`<p>Replit’s August 2026 Free Mode announcement says Core and Pro users can keep using Free Mode until they reach a usage limit and that those limits <strong>reset every 5 hours</strong>. The announcement does not define one universal reset clock shared by every account.</p>`],
      ['Why this tracker asks you to anchor the time',`<p>The safest pattern is the same one used by successful quota trackers: let the product itself provide the authoritative reset signal, then keep the countdown locally in the browser. If Replit shows a next-reset timestamp, copy it into the field above. If you know a new window has just begun, the “just reset” button starts a five-hour estimate.</p>`],
      ['Keep account data private',`<p>This page does not connect to Replit and cannot see your actual quota. The saved reset time and optional usage percentage stay in local browser storage so you can reopen the page without entering them again.</p>`]
    ],
    faqs:[
      ['How often does Replit Free Mode usage reset?','Replit’s current official launch post says Core and Pro Free Mode usage limits reset every 5 hours.'],
      ['Is there one global Replit reset time?','The official post specifies the five-hour interval, not a single universal clock time. Use the reset time displayed in your own account when available.'],
      ['Does this page connect to my Replit account?','No. It only stores the timestamp and optional usage percentage you enter in your browser.'],
      ['Why does the timer say “Check Replit”?','The saved reset time has passed. Confirm the new live window in Replit, then save the next reset time again.']
    ]
  },
  {
    slug:'cursor-usage-reset',
    title:'Cursor Usage Reset Calculator',
    description:'Track when Cursor monthly included usage resets, save the next billing-cycle reset locally, and calculate a safe remaining usage pace.',
    eyebrow:'AI usage tracker',
    intro:'Cursor says included usage resets monthly with your billing cycle. Copy the reset date from Cursor’s Spending tab and this page keeps the countdown for you.',
    sourceUrl:'https://prod.cursor.com/help/models-and-usage/usage-limits',
    sourceLabel:'Cursor Docs',
    policy:'Official docs checked Sep 13, 2026: included usage resets monthly with the billing cycle, unused included usage does not roll over, and the reset date is shown in the Spending tab.',
    body:`
<section class="calculator-card calculator-wide reset-panel">
  <div class="countdown-box"><div class="countdown-label">Tracked Cursor billing-cycle reset</div><div class="countdown-big" id="cursorCountdown">Set a reset</div><div id="cursorExact" class="result-details">Copy the date shown in Cursor Spending.</div></div>
  <div class="input-row"><label>Next reset date and time<input id="cursorReset" type="datetime-local"></label><label>Included usage used (%)<input id="cursorUsed" type="number" min="0" max="100" step="1" placeholder="70"></label></div>
  <div class="quick-row"><button type="button" id="cursorSave">Track this reset</button><button type="button" id="cursorCalendar">Add to calendar</button><button type="button" id="cursorClear">Clear saved data</button></div>
  <div class="result" id="cursorOut" aria-live="polite">No reset anchored yet.</div><div class="result-details" id="cursorDetails"></div>
</section>`,
    script:`
const CKEY='everyday.cursor-reset.v1';
function saveCursor(){localStorage.setItem(CKEY,JSON.stringify({reset:$('cursorReset').value,used:$('cursorUsed').value}))}
function renderCursor(){const d=parseLocal($('cursorReset').value);if(!d||!Number.isFinite(d.getTime())){$('cursorCountdown').textContent='Set a reset';$('cursorExact').textContent='Copy the date shown in Cursor Spending.';return}const ms=d-new Date();$('cursorCountdown').textContent=ms>0?fmtDuration(ms):'Check Cursor';$('cursorExact').textContent=ms>0?'Tracked reset '+niceDate(d):'The saved billing-cycle reset has passed. Copy the new date from Cursor Spending.'}
function calcCursor(){renderCursor();const d=parseLocal($('cursorReset').value),used=Math.min(100,Math.max(0,Number($('cursorUsed').value)||0));if(!d||d<=new Date()){$('cursorOut').textContent='Set a future reset time first.';$('cursorDetails').textContent='';return}const days=(d-new Date())/86400000,remaining=100-used,budget=remaining/Math.max(days,.01);$('cursorOut').textContent=remaining.toFixed(0)+'% of your entered included usage remains.';$('cursorDetails').textContent='Even-pace budget: about '+budget.toFixed(1)+' percentage points per day for the next '+days.toFixed(1)+' days. Cursor remains the source of truth for your actual usage.';saveCursor()}
try{const s=JSON.parse(localStorage.getItem(CKEY)||'{}');if(s.reset)$('cursorReset').value=s.reset;if(s.used!=null)$('cursorUsed').value=s.used}catch{}
$('cursorSave').addEventListener('click',calcCursor);$('cursorCalendar').addEventListener('click',()=>{const d=parseLocal($('cursorReset').value);if(d)downloadIcs('Cursor usage reset',d,'Cursor included usage resets with the billing cycle. Confirm the live date in Cursor Spending.')});$('cursorClear').addEventListener('click',()=>{localStorage.removeItem(CKEY);$('cursorReset').value='';$('cursorUsed').value='';$('cursorOut').textContent='Saved data cleared.';$('cursorDetails').textContent='';renderCursor()});
renderCursor();if($('cursorReset').value)calcCursor();setInterval(renderCursor,1000);
`,
    sections:[
      ['When does Cursor usage reset?',`<p>Cursor’s current documentation says included usage resets <strong>monthly with your billing cycle</strong>. It is not a universal first-of-the-month reset. Your account’s reset date is shown in the Spending tab.</p>`],
      ['Does unused Cursor usage roll over?',`<p>Cursor says unused included usage does not roll over to the next billing cycle. If you have a meaningful amount left near the reset date, the pace calculation above can help you decide how quickly you can use the remainder without exhausting it too early.</p>`],
      ['Why enter the exact reset shown in Cursor?',`<p>Billing systems can have account-specific timestamps, plan changes and edge cases. Rather than invent a universal reset hour, this calculator lets Cursor remain the source of truth and turns the date it shows you into a persistent local countdown.</p>`]
    ],
    faqs:[
      ['Does Cursor usage reset daily?','Current Cursor documentation says included usage resets monthly with the billing cycle, not daily.'],
      ['When is my Cursor reset date?','Open Cursor’s Spending tab. Cursor says the reset date for your account is shown there.'],
      ['Does unused Cursor usage carry over?','No. Cursor says unused included usage does not roll over to the next billing cycle.'],
      ['Can this calculator see my Cursor usage?','No. It only uses the reset date and optional usage percentage you enter locally.']
    ]
  },
  {
    slug:'ai-credit-burn-rate-calculator',
    title:'AI Credit Burn Rate Calculator',
    description:'Calculate how many AI credits you can safely spend per day before reset, expected tasks remaining, depletion date and unused credits.',
    eyebrow:'AI cost calculator',
    intro:'Turn “credits left” and “time until reset” into a usable daily budget. Works with any AI product that uses expiring credits or a recurring quota.',
    sourceUrl:'',
    sourceLabel:'',
    policy:'This is a generic planning calculator. It does not know any provider’s live balance or rollover rules unless you enter them.',
    body:`
<section class="calculator-card calculator-wide reset-panel">
  <div class="input-row"><label>Credits remaining<input id="burnCredits" type="number" min="0" step="any" placeholder="1200"></label><label>Reset date and time<input id="burnReset" type="datetime-local"></label></div>
  <div class="input-row"><label>Your current average credits/day<input id="burnDaily" type="number" min="0" step="any" placeholder="150"></label><label>Average credits per task<input id="burnTask" type="number" min="0" step="any" placeholder="40"></label></div>
  <label class="check"><input id="burnExpires" type="checkbox" checked> Unused credits expire at reset</label>
  <button type="button" id="burnCalc">Calculate burn rate</button>
  <div class="metric-grid"><div class="metric"><span>Safe daily budget</span><strong id="safeDaily">—</strong></div><div class="metric"><span>Safe hourly budget</span><strong id="safeHourly">—</strong></div><div class="metric"><span>Tasks remaining</span><strong id="tasksLeft">—</strong></div><div class="metric"><span>Projected balance at reset</span><strong id="projectedLeft">—</strong></div></div>
  <div class="result" id="burnOut" aria-live="polite">Enter your balance and reset time.</div><div class="result-details" id="burnDetails"></div>
</section>`,
    script:`
const BKEY='everyday.ai-burn.v1';
function calcBurn(){const credits=Math.max(0,Number($('burnCredits').value)||0),reset=parseLocal($('burnReset').value),daily=Math.max(0,Number($('burnDaily').value)||0),task=Math.max(0,Number($('burnTask').value)||0);if(!reset||reset<=new Date()){$('burnOut').textContent='Choose a future reset date and time.';return}const days=(reset-new Date())/86400000,hours=(reset-new Date())/3600000,safe=credits/Math.max(days,.001),hourly=credits/Math.max(hours,.001),tasks=task>0?credits/task:null,projected=Math.max(0,credits-daily*days),exhaustDays=daily>0?credits/daily:Infinity;$('safeDaily').textContent=safe.toFixed(1)+' credits/day';$('safeHourly').textContent=hourly.toFixed(1)+' credits/hour';$('tasksLeft').textContent=tasks==null?'Set task cost':tasks.toFixed(1);$('projectedLeft').textContent=projected.toFixed(0)+' credits';if(daily===0){$('burnOut').textContent='Safe pace: '+safe.toFixed(1)+' credits per day until reset.';$('burnDetails').textContent='Add your current average daily use to compare your real burn rate with the safe pace.'}else if(daily>safe){const d=new Date(Date.now()+exhaustDays*86400000);$('burnOut').textContent='At your current pace, credits run out before reset.';$('burnDetails').textContent='Projected depletion: '+niceDate(d)+' · current pace '+daily.toFixed(1)+'/day vs safe pace '+safe.toFixed(1)+'/day.'}else{$('burnOut').textContent='Your current pace should last until reset.';const unused=$('burnExpires').checked?' If usage stays flat, about '+projected.toFixed(0)+' credits may expire unused.':'';$('burnDetails').textContent='Current pace '+daily.toFixed(1)+'/day vs safe pace '+safe.toFixed(1)+'/day.'+unused}localStorage.setItem(BKEY,JSON.stringify({credits:$('burnCredits').value,reset:$('burnReset').value,daily:$('burnDaily').value,task:$('burnTask').value,expires:$('burnExpires').checked}))}
try{const s=JSON.parse(localStorage.getItem(BKEY)||'{}');if(s.credits!=null)$('burnCredits').value=s.credits;if(s.reset)$('burnReset').value=s.reset;if(s.daily!=null)$('burnDaily').value=s.daily;if(s.task!=null)$('burnTask').value=s.task;if(s.expires!=null)$('burnExpires').checked=s.expires}catch{}
$('burnCalc').addEventListener('click',calcBurn);if($('burnReset').value)calcBurn();
`,
    sections:[
      ['What is an AI credit burn rate?',`<p>Your burn rate is how quickly you consume a limited credit balance. If 1,200 credits must last eight more days, the neutral pace is 150 credits per day. Spending faster than that predicts an early lockout; spending much slower can leave credits unused if they expire at reset.</p>`],
      ['Safe daily budget formula',`<p>The basic calculation is <strong>remaining credits ÷ time remaining</strong>. This page uses the exact reset timestamp so partial days count correctly. The hourly budget is useful when the reset is less than a day away.</p><div class="formula-grid"><code>1,200 credits ÷ 8 days = 150 credits/day</code></div>`],
      ['Estimate how many tasks you have left',`<p>If you know a typical task costs around 40 credits, 1,200 remaining credits represent roughly 30 similar tasks. Real AI workloads vary, so treat this as a planning estimate rather than a billing guarantee.</p>`]
    ],
    faqs:[
      ['How do I calculate credits per day?','Divide the credits remaining by the number of days until the reset or expiry date.'],
      ['How do I know when I will run out?','Divide remaining credits by your current average credits used per day, then add that many days to the current time.'],
      ['What if unused credits roll over?','Uncheck the expiry option. The safe pace still tells you how much you could spend before reset, but unused credits are not treated as waste.'],
      ['Does this calculator connect to my AI account?','No. All values are entered manually and calculations run locally in your browser.']
    ]
  }
];

function escapeJson(v){return JSON.stringify(v).replace(/</g,'\\u003c')}
function nav(){return `<header class="site-header"><div class="shell nav"><a class="brand" href="/">Everyday Tools</a><nav aria-label="Primary"><a href="/tools/">Tools</a><a href="/about/">About</a><a href="/contact/">Contact</a></nav></div></header>`}
function footer(){return `<footer class="site-footer"><div class="shell footer-grid"><div><strong>Everyday Tools</strong><p>Fast, free browser tools with no sign-up.</p></div><nav aria-label="Footer"><a href="/tools/">All tools</a><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></div></footer>`}
function relatedCards(current){return tools.filter(t=>t.slug!==current.slug).slice(0,3).map(t=>`<a class="related-card" href="/tools/${t.slug}/"><strong>${t.title}</strong><span>${t.description}</span></a>`).join('')}
function faqHtml(t){return t.faqs.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}
function sourceHtml(t){if(!t.sourceUrl)return `<p class="source-note">${t.policy}</p>`;return `<p class="source-note">${t.policy} <a href="${t.sourceUrl}" target="_blank" rel="noopener noreferrer">Source: ${t.sourceLabel} ↗</a></p>`}
function page(t){
  const url=BASE+'/tools/'+t.slug+'/';
  const schema={"@context":"https://schema.org","@type":"WebApplication","name":t.title,"applicationCategory":"UtilitiesApplication","operatingSystem":"Any","description":t.description,"isAccessibleForFree":true,"offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"url":url,"dateModified":TODAY};
  const crumb={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":BASE+'/'},{"@type":"ListItem","position":2,"name":"Tools","item":BASE+'/tools/'},{"@type":"ListItem","position":3,"name":t.title,"item":url}]};
  const faq={"@context":"https://schema.org","@type":"FAQPage","mainEntity":t.faqs.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))};
  const sections=t.sections.map(([h,b])=>`<section class="content-section"><h2>${h}</h2>${b}</section>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${t.title} – Free Online Tool</title><meta name="description" content="${t.description}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/site.css">${AI_STYLE}<meta property="og:type" content="website"><meta property="og:title" content="${t.title}"><meta property="og:description" content="${t.description}"><meta property="og:url" content="${url}"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}" crossorigin="anonymous"></script><script type="application/ld+json">${escapeJson(schema)}</script><script type="application/ld+json">${escapeJson(crumb)}</script><script type="application/ld+json">${escapeJson(faq)}</script></head><body>${nav()}<main class="shell tool-page"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/tools/">Tools</a><span>›</span><span>${t.title}</span></nav><section class="tool-hero"><p class="eyebrow">${t.eyebrow}</p><h1>${t.title}</h1><p>${t.intro}</p></section>${t.body}<div class="trust-strip"><span>✓ No sign-up</span><span>✓ Saved locally</span><span>✓ Mobile friendly</span></div><section class="content-section"><h2>Current policy source</h2><div class="reset-note">${sourceHtml(t)}</div></section>${sections}<section class="content-section"><h2>Frequently asked questions</h2><div class="faq">${faqHtml(t)}</div></section><section class="content-section"><h2>Related AI usage tools</h2><div class="related-grid">${relatedCards(t)}</div></section></main>${footer()}<script>${SHARED_CLIENT}\n${t.script}</script></body></html>`;
}

mkdirSync(toolsDir,{recursive:true});
for(const t of tools){const dir=join(toolsDir,t.slug);mkdirSync(dir,{recursive:true});writeFileSync(join(dir,'index.html'),page(t));}

const familyCards=tools.map(t=>`<a class="tool-card" href="/tools/${t.slug}/"><span class="pill">${t.eyebrow}</span><h2>${t.title}</h2><p>${t.description}</p><span class="text-link">Open tool →</span></a>`).join('');
const familySection=`<section><p class="eyebrow">AI usage & reset tools</p><h2>Know when your AI allowance comes back.</h2><p>Live reset clocks and burn-rate calculators inspired by the best single-purpose quota trackers: exact answer first, private local state, calendar reminders, and official policy sources.</p><div class="tools-grid">${familyCards}</div></section>`;

function injectBefore(file,marker,html){let s=readFileSync(file,'utf8');if(!s.includes(marker))throw new Error('Marker not found in '+file);s=s.replace(marker,html+marker);writeFileSync(file,s)}
injectBefore(join(root,'index.html'),'<section><p class="eyebrow">How we build tools</p>',familySection);
injectBefore(join(toolsDir,'index.html'),'<section class="content-section"><h2>Built for quick answers</h2>',familySection);

const sitemapPath=join(root,'sitemap.xml');
let sitemap=readFileSync(sitemapPath,'utf8');
const sitemapRows=tools.map(t=>`  <url>\n    <loc>${BASE}/tools/${t.slug}/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${t.slug==='ai-credit-burn-rate-calculator'?'monthly':'weekly'}</changefreq>\n    <priority>0.9</priority>\n  </url>`).join('\n');
if(!sitemap.includes('</urlset>'))throw new Error('Sitemap closing tag not found');
sitemap=sitemap.replace('</urlset>',sitemapRows+'\n</urlset>');
writeFileSync(sitemapPath,sitemap);

console.log('Generated '+tools.length+' AI usage/reset tools and linked them into the site.');
