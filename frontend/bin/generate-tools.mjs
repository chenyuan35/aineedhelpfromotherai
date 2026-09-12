import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { imageTools } from './image-tools.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const toolsDir = join(root, 'tools');
mkdirSync(toolsDir, { recursive: true });

const BASE = 'https://aineedhelpfromotherai.com';
const ADSENSE = 'ca-pub-8244441500123371';

const tools = [
  {
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    description: 'Calculate percentages instantly: X% of Y, X is what percent of Y, reverse percentages, and percentage change.',
    eyebrow: 'Math calculator',
    intro: 'Solve the four percentage questions people use most often without memorizing a formula.',
    body: `
      <section class="calculator-grid" aria-label="Percentage calculations">
        <article class="calculator-card">
          <h2>What is X% of Y?</h2>
          <div class="input-row"><input id="p1x" inputmode="decimal" type="number" step="any" placeholder="15" aria-label="Percentage"><span>% of</span><input id="p1y" inputmode="decimal" type="number" step="any" placeholder="80" aria-label="Number"></div>
          <button type="button" onclick="calcP1()">Calculate</button><div class="result" id="p1r" aria-live="polite">—</div>
        </article>
        <article class="calculator-card">
          <h2>X is what percent of Y?</h2>
          <div class="input-row"><input id="p2x" inputmode="decimal" type="number" step="any" placeholder="12" aria-label="Part"><span>of</span><input id="p2y" inputmode="decimal" type="number" step="any" placeholder="80" aria-label="Whole"></div>
          <button type="button" onclick="calcP2()">Calculate</button><div class="result" id="p2r" aria-live="polite">—</div>
        </article>
        <article class="calculator-card">
          <h2>X is P% of what number?</h2>
          <div class="input-row"><input id="p3x" inputmode="decimal" type="number" step="any" placeholder="12" aria-label="Part"><span>is</span><input id="p3p" inputmode="decimal" type="number" step="any" placeholder="15" aria-label="Percentage"><span>% of ?</span></div>
          <button type="button" onclick="calcP3()">Calculate</button><div class="result" id="p3r" aria-live="polite">—</div>
        </article>
        <article class="calculator-card">
          <h2>Percentage change</h2>
          <div class="input-row"><input id="p4a" inputmode="decimal" type="number" step="any" placeholder="80" aria-label="Old value"><span>to</span><input id="p4b" inputmode="decimal" type="number" step="any" placeholder="100" aria-label="New value"></div>
          <button type="button" onclick="calcP4()">Calculate</button><div class="result" id="p4r" aria-live="polite">—</div>
        </article>
      </section>`,
    script: `
      const fmt=n=>Number.isFinite(n)?new Intl.NumberFormat(undefined,{maximumFractionDigits:8}).format(n):'—';
      function calcP1(){const x=Number(p1x.value),y=Number(p1y.value);p1r.textContent=fmt(x*y/100)}
      function calcP2(){const x=Number(p2x.value),y=Number(p2y.value);p2r.textContent=y!==0?fmt(x/y*100)+'%':'Whole cannot be zero'}
      function calcP3(){const x=Number(p3x.value),p=Number(p3p.value);p3r.textContent=p!==0?fmt(x*100/p):'Percentage cannot be zero'}
      function calcP4(){const a=Number(p4a.value),b=Number(p4b.value);p4r.textContent=a!==0?fmt((b-a)/Math.abs(a)*100)+'%':'Old value cannot be zero'}
    `,
    sections: [
      ['How percentage calculations work', `<p>A percentage is a ratio out of 100. The most common formula is <strong>part = whole × percentage ÷ 100</strong>. Reverse percentage questions use the same relationship rearranged to solve for the missing value.</p><div class="formula-grid"><code>15% of 80 = 80 × 15 ÷ 100 = 12</code><code>12 is what % of 80 = 12 ÷ 80 × 100 = 15%</code></div>`],
      ['Percentage change vs. percentage points', `<p>Percentage change measures the relative change from an old value to a new value. A move from 80 to 100 is a 25% increase. When comparing two percentages directly, the simple difference is usually described in <em>percentage points</em>.</p>`],
      ['Common uses', `<p>Percentage calculations are useful for discounts, tips, grades, tax, growth rates, margins, survey results, investment returns, and everyday comparisons.</p>`]
    ],
    faqs: [
      ['What is 20% of 50?', '10. Multiply 50 by 20 and divide by 100.'],
      ['How do I find what percent one number is of another?', 'Divide the first number by the second number, then multiply by 100.'],
      ['How do I calculate a percentage increase?', 'Subtract the old value from the new value, divide by the absolute old value, then multiply by 100.'],
      ['Can percentages be greater than 100%?', 'Yes. A percentage above 100% means the part is larger than the reference whole.']
    ],
    related: ['percentage-increase-calculator','discount-calculator','age-calculator']
  },
  {
    slug: 'percentage-increase-calculator',
    title: 'Percentage Increase Calculator',
    description: 'Calculate percentage increase or decrease between two values, plus the absolute difference and change multiplier.',
    eyebrow: 'Math calculator',
    intro: 'Compare an old value with a new value and see the relative change clearly.',
    body: `
      <section class="calculator-card calculator-wide">
        <div class="input-row"><label>Old value<input id="oldv" inputmode="decimal" type="number" step="any" placeholder="80"></label><span>→</span><label>New value<input id="newv" inputmode="decimal" type="number" step="any" placeholder="100"></label></div>
        <button type="button" onclick="go()">Calculate change</button>
        <div class="result" id="out" aria-live="polite">—</div>
        <div class="result-details" id="details"></div>
      </section>`,
    script: `
      const fmt=n=>new Intl.NumberFormat(undefined,{maximumFractionDigits:8}).format(n);
      function go(){const a=Number(oldv.value),b=Number(newv.value);if(a===0){out.textContent='Old value cannot be zero';details.textContent='';return}const diff=b-a,p=diff/Math.abs(a)*100,m=b/a;out.textContent=(p>=0?'+':'')+fmt(p)+'%';details.textContent='Difference: '+fmt(diff)+' · Multiplier: '+fmt(m)+'×'}
    `,
    sections: [
      ['Percentage increase formula', `<p>Use <strong>(new − old) ÷ |old| × 100</strong>. If the result is positive, the value increased. If it is negative, the value decreased.</p><div class="formula-grid"><code>(100 − 80) ÷ 80 × 100 = 25%</code></div>`],
      ['Why the starting value matters', `<p>A change of 20 does not always mean the same percentage. Moving from 80 to 100 is a 25% increase, while moving from 100 to 120 is a 20% increase. The original value is the reference point.</p>`],
      ['Where this is useful', `<p>Use percentage change for prices, revenue, traffic, grades, weight, investment performance, population data, and any before-and-after comparison.</p>`]
    ],
    faqs: [
      ['What is the percentage increase from 80 to 100?', '25%. The increase is 20, and 20 divided by the original 80 is 0.25.'],
      ['What is the percentage decrease from 100 to 80?', '20%. The decrease is 20 relative to the original 100.'],
      ['Why are increase and decrease percentages not symmetrical?', 'Because each calculation uses a different starting value as the denominator.'],
      ['What if the old value is zero?', 'A standard percentage change from zero is undefined because it would require division by zero.']
    ],
    related: ['percentage-calculator','discount-calculator','date-difference-calculator']
  },
  {
    slug: 'discount-calculator',
    title: 'Discount Calculator',
    description: 'Calculate final sale price, total savings, stacked discounts, and effective discount percentage.',
    eyebrow: 'Shopping calculator',
    intro: 'Work out the real sale price, including an optional second stacked discount.',
    body: `
      <section class="calculator-card calculator-wide">
        <div class="input-row"><label>Original price<input id="price" inputmode="decimal" type="number" step="any" min="0" placeholder="100"></label><label>Discount %<input id="disc1" inputmode="decimal" type="number" step="any" placeholder="20"></label><label>Extra discount % <span class="muted">optional</span><input id="disc2" inputmode="decimal" type="number" step="any" placeholder="10"></label></div>
        <button type="button" onclick="go()">Calculate discount</button>
        <div class="result" id="out" aria-live="polite">—</div><div class="result-details" id="saved"></div>
      </section>`,
    script: `
      const money=n=>new Intl.NumberFormat(undefined,{maximumFractionDigits:2}).format(n);
      function go(){const p=Math.max(0,Number(price.value)||0),a=Number(disc1.value)||0,b=Number(disc2.value)||0;const final=p*(1-a/100)*(1-b/100),save=p-final,eff=p?save/p*100:0;out.textContent='Final price: '+money(final);saved.textContent='You save '+money(save)+' · Effective discount '+money(eff)+'%'}
    `,
    sections: [
      ['Discount formula', `<p>For one percentage discount, use <strong>sale price = original price × (1 − discount ÷ 100)</strong>. A 20% discount on 100 gives a final price of 80.</p>`],
      ['How stacked discounts work', `<p>Two discounts are applied one after another, not simply added. A 20% discount followed by another 10% discount turns 100 into 80, then 72. The effective discount is 28%, not 30%.</p><div class="formula-grid"><code>100 × 0.80 × 0.90 = 72</code></div>`],
      ['When to use this calculator', `<p>Use it for store sales, coupon stacking, seasonal promotions, markdown comparisons, and checking whether a claimed deal matches the final price.</p>`]
    ],
    faqs: [
      ['How much is 20% off 50?', 'The final price is 40 and the amount saved is 10.'],
      ['Can I add two discounts together?', 'Usually no. Stacked percentage discounts are applied sequentially, so 20% off and then 10% off equals a 28% effective discount.'],
      ['How do I calculate the amount saved?', 'Subtract the final price from the original price.'],
      ['Does this calculator include sales tax?', 'No. It calculates discounts only so the result is easy to verify.']
    ],
    related: ['percentage-calculator','percentage-increase-calculator','date-difference-calculator']
  },
  {
    slug: 'age-calculator',
    title: 'Age Calculator',
    description: 'Calculate exact age in years, months and days, total days and weeks lived, and days until the next birthday.',
    eyebrow: 'Date calculator',
    intro: 'Enter a date of birth and calculate age on today or any other date.',
    body: `
      <section class="calculator-card calculator-wide">
        <div class="input-row"><label>Date of birth<input id="dob" type="date"></label><label>Age on date<input id="asof" type="date"></label></div>
        <button type="button" onclick="go()">Calculate age</button>
        <div class="result" id="out" aria-live="polite">—</div><div class="result-details" id="details"></div>
      </section>`,
    script: `
      asof.value=new Date().toISOString().slice(0,10);
      function utc(v){const [y,m,d]=v.split('-').map(Number);return new Date(Date.UTC(y,m-1,d))}
      function go(){if(!dob.value||!asof.value){out.textContent='Choose both dates';details.textContent='';return}const a=utc(dob.value),b=utc(asof.value);if(b<a){out.textContent='Comparison date must be after birth date';details.textContent='';return}let y=b.getUTCFullYear()-a.getUTCFullYear(),m=b.getUTCMonth()-a.getUTCMonth(),d=b.getUTCDate()-a.getUTCDate();if(d<0){m--;d+=new Date(Date.UTC(b.getUTCFullYear(),b.getUTCMonth(),0)).getUTCDate()}if(m<0){y--;m+=12}const days=Math.floor((b-a)/86400000);let next=new Date(Date.UTC(b.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate()));if(next<=b)next=new Date(Date.UTC(b.getUTCFullYear()+1,a.getUTCMonth(),a.getUTCDate()));const until=Math.ceil((next-b)/86400000);out.textContent=y+' years, '+m+' months, '+d+' days';details.textContent=days.toLocaleString()+' total days · '+Math.floor(days/7).toLocaleString()+' full weeks · '+until+' days until next birthday'}
    `,
    sections: [
      ['How exact age is calculated', `<p>Calendar age is counted in completed years, then completed months, then remaining days. This is more useful than dividing total days by 365 because months and leap years have different lengths.</p>`],
      ['Age in total days and weeks', `<p>The calculator also shows elapsed calendar days and full weeks. Total-day calculations use UTC calendar dates so daylight-saving changes do not add or remove an hour.</p>`],
      ['Common uses', `<p>Age calculations are commonly needed for forms, school or sports eligibility, travel documents, anniversaries, planning, and checking age on a historical or future date.</p>`]
    ],
    faqs: [
      ['How old am I if I enter my birthday?', 'The result shows completed years, months and days as of the comparison date.'],
      ['Does the calculator handle leap years?', 'Yes. It uses real calendar dates, including leap years.'],
      ['Can I calculate how old I was on a past date?', 'Yes. Change the “Age on date” field to any date after the birth date.'],
      ['Why does exact age differ from total days divided by 365?', 'Calendar years and months are not all the same length, so exact calendar age and simple day division answer different questions.']
    ],
    related: ['date-difference-calculator','percentage-calculator','discount-calculator']
  },
  {
    slug: 'date-difference-calculator',
    title: 'Date Difference Calculator',
    description: 'Calculate days and weeks between two dates, optionally count both endpoints, and estimate weekdays between dates.',
    eyebrow: 'Date calculator',
    intro: 'Measure elapsed time between two calendar dates without timezone surprises.',
    body: `
      <section class="calculator-card calculator-wide">
        <div class="input-row"><label>Start date<input id="d1" type="date"></label><label>End date<input id="d2" type="date"></label></div>
        <label class="check"><input id="inclusive" type="checkbox"> Count both start and end date</label>
        <button type="button" onclick="go()">Calculate difference</button>
        <div class="result" id="out" aria-live="polite">—</div><div class="result-details" id="detail"></div>
      </section>`,
    script: `
      function utc(v){const [y,m,d]=v.split('-').map(Number);return new Date(Date.UTC(y,m-1,d))}
      function weekdays(a,b,inc){let lo=a<b?a:b,hi=a<b?b:a,count=0;for(let t=new Date(lo);t<hi||inc&&t<=hi;t.setUTCDate(t.getUTCDate()+1)){const w=t.getUTCDay();if(w!==0&&w!==6)count++}return count}
      function go(){if(!d1.value||!d2.value){out.textContent='Choose both dates';detail.textContent='';return}const a=utc(d1.value),b=utc(d2.value),inc=inclusive.checked;let days=Math.abs(Math.round((b-a)/86400000))+(inc?1:0);out.textContent=days.toLocaleString()+' days';detail.textContent=(days/7).toFixed(2)+' weeks · '+weekdays(a,b,inc).toLocaleString()+' weekdays'}
    `,
    sections: [
      ['Elapsed days vs. inclusive days', `<p>Elapsed days measure the time from the start date to the end date. If you need to count every calendar date touched by a period, enable “Count both start and end date.” For example, January 1 to January 2 is 1 elapsed day but 2 inclusive dates.</p>`],
      ['How weekday counting works', `<p>The weekday figure counts Monday through Friday and excludes Saturdays and Sundays. It does not subtract public holidays because holiday calendars differ by country and region.</p>`],
      ['Common uses', `<p>Use date differences for deadlines, travel, project schedules, contract periods, anniversaries, countdown planning, and checking how many weekdays sit inside a date range.</p>`]
    ],
    faqs: [
      ['How many days are between two dates?', 'Choose a start and end date. The calculator returns elapsed calendar days and weeks.'],
      ['What does inclusive counting mean?', 'Inclusive counting includes both the start date and the end date in the total.'],
      ['Does the weekday count include holidays?', 'No. It excludes weekends only because holidays vary by location.'],
      ['Does daylight saving time affect the result?', 'No. The calculation uses UTC calendar dates rather than local elapsed hours.']
    ],
    related: ['age-calculator','percentage-calculator','percentage-increase-calculator']
  },
  ...imageTools
];

const bySlug = new Map(tools.map(t => [t.slug, t]));

function escapeJson(value){return JSON.stringify(value).replace(/</g,'\\u003c')}
function faqSchema(faqs){return {"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))}}
function breadcrumbSchema(t){return {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":BASE+'/'},{"@type":"ListItem","position":2,"name":"Tools","item":BASE+'/tools/'},{"@type":"ListItem","position":3,"name":t.title,"item":BASE+'/tools/'+t.slug+'/'}]}}
function appSchema(t){return {"@context":"https://schema.org","@type":"WebApplication","name":t.title,"applicationCategory":"UtilitiesApplication","operatingSystem":"Any","description":t.description,"isAccessibleForFree":true,"offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"url":BASE+'/tools/'+t.slug+'/'}}

function nav(){return `<header class="site-header"><div class="shell nav"><a class="brand" href="/">Everyday Tools</a><nav aria-label="Primary"><a href="/tools/">Calculators</a><a href="/about/">About</a><a href="/contact/">Contact</a></nav></div></header>`}
function footer(){return `<footer class="site-footer"><div class="shell footer-grid"><div><strong>Everyday Tools</strong><p>Fast, free browser tools with no sign-up.</p></div><nav aria-label="Footer"><a href="/tools/">All calculators</a><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></div></footer>`}

function relatedCards(t){return t.related.map(s=>{const r=bySlug.get(s);return `<a class="related-card" href="/tools/${r.slug}/"><strong>${r.title}</strong><span>${r.description}</span></a>`}).join('')}
function faqHtml(faqs){return faqs.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}

function page(t){
  const sections=t.sections.map(([h,html])=>`<section class="content-section"><h2>${h}</h2>${html}</section>`).join('');
  const title=`${t.title} – Free Online Calculator`;
  const url=`${BASE}/tools/${t.slug}/`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><meta name="description" content="${t.description}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${url}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/site.css">
<meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${t.description}"><meta property="og:url" content="${url}">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}" crossorigin="anonymous"></script>
<script type="application/ld+json">${escapeJson(appSchema(t))}</script><script type="application/ld+json">${escapeJson(breadcrumbSchema(t))}</script><script type="application/ld+json">${escapeJson(faqSchema(t.faqs))}</script>
</head><body>${nav()}<main class="shell tool-page">
<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/tools/">Calculators</a><span>›</span><span>${t.title}</span></nav>
<section class="tool-hero"><p class="eyebrow">${t.eyebrow}</p><h1>${t.title}</h1><p>${t.intro} Calculations run locally in your browser.</p></section>
${t.body}
<div class="trust-strip"><span>✓ No sign-up</span><span>✓ No data upload</span><span>✓ Mobile friendly</span></div>
${sections}
<section class="content-section"><h2>Frequently asked questions</h2><div class="faq">${faqHtml(t.faqs)}</div></section>
<section class="content-section"><h2>Related calculators</h2><div class="related-grid">${relatedCards(t)}</div></section>
</main>${footer()}<script>${t.script}\nfor(const el of document.querySelectorAll('input'))el.addEventListener('keydown',e=>{if(e.key==='Enter'){const b=e.target.closest('.calculator-card')?.querySelector('button')||document.querySelector('.calculator-card button');b?.click()}});</script></body></html>`;
}

for (const t of tools){const dir=join(toolsDir,t.slug);mkdirSync(dir,{recursive:true});writeFileSync(join(dir,'index.html'),page(t));}

const cards=tools.map(t=>`<a class="tool-card" href="/tools/${t.slug}/"><span class="pill">${t.eyebrow}</span><h2>${t.title}</h2><p>${t.description}</p><span class="text-link">Open calculator →</span></a>`).join('');
const collectionSchema={"@context":"https://schema.org","@type":"CollectionPage","name":"Free Online Calculators","url":BASE+'/tools/'};
writeFileSync(join(toolsDir,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Free Online Calculators – Fast, Private, No Sign-Up</title><meta name="description" content="Free online percentage, discount, age and date calculators. Fast, mobile-friendly tools that run directly in your browser."><meta name="robots" content="index,follow"><link rel="canonical" href="${BASE}/tools/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/site.css"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}" crossorigin="anonymous"></script><script type="application/ld+json">${escapeJson(collectionSchema)}</script></head><body>${nav()}<main class="shell"><section class="listing-hero"><p class="eyebrow">Free online calculators</p><h1>Useful calculations without the clutter.</h1><p>Open a calculator, enter your numbers, and get the answer. No account, no installation, and no AI usage required.</p></section><section class="tools-grid">${cards}</section><section class="content-section"><h2>Built for quick answers</h2><p>Each calculator is designed around one clear task, works on phones and desktops, and includes the formula or method so you can verify the result yourself.</p></section></main>${footer()}</body></html>`);
console.log(`Generated ${tools.length} calculator pages plus tools index`);
