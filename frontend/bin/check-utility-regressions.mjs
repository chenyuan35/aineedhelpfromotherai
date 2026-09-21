import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = slug => readFileSync(join(root, 'tools', slug, 'index.html'), 'utf8');
const scriptFor = (slug, marker) => {
  const scripts = [...html(slug).matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
  const script = scripts.find(code => code.includes(marker));
  if (!script) throw new Error(`Regression script marker not found: ${slug} / ${marker}`);
  return script;
};
const run = (slug, marker, context) => {
  context.document = { querySelectorAll: () => [], querySelector: () => null };
  vm.createContext(context);
  vm.runInContext(scriptFor(slug, marker), context);
  return context;
};
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const field = value => ({ value, textContent: '' });

{
  const ctx = run('percentage-calculator', 'function calcP1()', { p1x:field(''), p1y:field(''), p1r:field('') });
  ctx.calcP1();
  assert(ctx.p1r.textContent === 'Enter both values', 'U-01: blank percentage inputs must not return zero');
  ctx.p1x.value='15'; ctx.p1y.value='80'; ctx.calcP1();
  assert(ctx.p1r.textContent === '12', 'U-01: valid percentage math regressed');
}

{
  const ctx = run('discount-calculator', 'Final price:', { price:field(''), disc1:field(''), disc2:field(''), out:field(''), saved:field('') });
  ctx.go();
  assert(ctx.out.textContent === 'Enter price and discount', 'U-02: blank required discount inputs must be rejected');
  ctx.price.value='100'; ctx.disc1.value='150'; ctx.go();
  assert(ctx.out.textContent === 'Discount must be between 0% and 100%', 'U-02: discounts over 100% must be rejected');
  ctx.disc1.value='20'; ctx.disc2.value='10'; ctx.go();
  assert(ctx.out.textContent === 'Final price: 72' && ctx.saved.textContent.includes('Effective discount 28%'), 'U-02: stacked discount math regressed');
}

{
  const ctx = run('age-calculator', 'addMonthsClamped', { dob:field('2000-01-31'), asof:field('2026-03-01'), out:field(''), details:field('') });
  ctx.dob.value='2000-01-31'; ctx.asof.value='2026-03-01'; ctx.go();
  assert(ctx.out.textContent === '26 years, 1 months, 1 days', 'U-03: month-end decomposition regressed');
  ctx.dob.value='2000-02-29'; ctx.asof.value='2021-03-01'; ctx.go();
  assert(ctx.out.textContent === '21 years, 0 months, 1 days', 'U-03: leap-date decomposition regressed');
  ctx.dob.value='2000-02-29'; ctx.asof.value='2020-02-29'; ctx.go();
  assert(ctx.out.textContent === '20 years, 0 months, 0 days', 'U-03: leap anniversary regressed');
}

console.log('Utility regressions passed: U-01/U-02/U-03.');
