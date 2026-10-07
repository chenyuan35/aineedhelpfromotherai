import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('frontend/dist/media/phone-first-identity.css', 'utf8');
const home = readFileSync('frontend/dist/index.html', 'utf8');

assert.match(home, /class="shell phone-first-shell"/);
assert.match(home, /class="phone-first-panel"/);
assert.match(css, /\.phone-first-shell\{[^}]*grid-template-columns:minmax\(0,1fr\) 480px;[^}]*gap:52px;[^}]*min-height:600px;/);
assert.match(css, /\.phone-first-copy\{max-width:720px\}/);
assert.match(css, /\.phone-first-copy h1\{[^}]*max-width:720px;[^}]*font-size:clamp\(3\.25rem,5vw,4\.85rem\);[^}]*line-height:\.96;/);
assert.match(css, /\.phone-first-panel\{[^}]*max-width:480px;[^}]*justify-self:end;/);
assert.match(css, /@media\(max-width:980px\)\{\.phone-first-shell\{grid-template-columns:1fr;/);
assert.doesNotMatch(css, /grid-template-columns:minmax\(0,1\.04fr\) minmax\(430px,\.96fr\)/);
assert.doesNotMatch(css, /font-size:clamp\(3\.35rem,5\.6vw,5\.55rem\)/);
console.log('Homepage Phone hero balance contract: PASS');
