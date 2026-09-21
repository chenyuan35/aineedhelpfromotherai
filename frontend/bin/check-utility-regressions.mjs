import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const element = (value = '') => ({ value, textContent: '' });
const scriptFor = (slug, marker) => {
  const html = readFileSync(join(root, 'tools', slug, 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1]);
  const script = scripts.find(text => text.includes(marker));
  if (!script) throw new Error(`Client script not found for ${slug}`);
  return script;
};
const run = (slug, marker, globals) => {
  const document = { querySelectorAll: () => [], querySelector: () => null };
  const context = vm.createContext({ Intl, Number, Date, Math, document, ...globals });
  vm.runInContext(scriptFor(slug, marker), context, { filename: `${slug}.js` });
  return context;
};
const equal = (actual, expected, label) => {
  if (actual !== expected) throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
};

{
  const p1x=element(), p1y=element(), p1r=element(), ctx=run('percentage-calculator','function calcP1()',{p1x,p1y,p1r});
  ctx.calcP1(); equal(p1r.textContent,'Enter both values','Percentage blank validation');
  p1x.value='15'; p1y.value='80'; ctx.calcP1(); equal(p1r.textContent,'12','Percentage known value');
}
{
  const price=element(), disc1=element(), disc2=element(), out=element(), saved=element();
  const ctx=run('discount-calculator','function go()',{price,disc1,disc2,out,saved});
  ctx.go(); equal(out.textContent,'Enter price and discount','Discount blank validation');
  price.value='100'; disc1.value='150'; ctx.go();
  equal(out.textContent,'Discounts must be between 0% and 100%','Discount upper bound');
  disc1.value='20'; disc2.value='10'; ctx.go();
  equal(out.textContent,'Final price: 72','Discount known final price');
  equal(saved.textContent,'You save 28 · Effective discount 28%','Discount stacked formula');
}
{
  const dob=element(), asof=element(), out=element(), details=element();
  const ctx=run('age-calculator','function calendarParts',{dob,asof,out,details});
  dob.value='2000-01-15'; asof.value='2026-09-21'; ctx.go();
  equal(out.textContent,'26 years, 8 months, 6 days','Age known value');
  dob.value='2000-01-31'; asof.value='2026-03-01'; ctx.go();
  equal(out.textContent,'26 years, 1 months, 1 days','Age month-end decomposition');
  dob.value='2000-02-29'; asof.value='2024-02-29'; ctx.go();
  equal(out.textContent,'24 years, 0 months, 0 days','Age leap-day anniversary');
  dob.value='2000-02-29'; asof.value='2026-03-01'; ctx.go();
  equal(out.textContent,'26 years, 0 months, 1 days','Age leap-day non-leap span');
}
console.log('Utility regression checks passed: U-01/U-02/U-03 plus known values.');
