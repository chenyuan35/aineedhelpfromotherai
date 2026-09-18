# Phone Radar Visual Closure Audit — 2026-09-18

Status: **AUDIT COMPLETE / REPAIR REQUIRED**

This audit was opened after direct user feedback that the shipped Phone Radar still feels visually messy. The finding is accepted as a concrete product defect, not a request for more routes or more content.

## Scope

Audit only the current production Phone shell and card hierarchy on the existing canonical:

`/tools/phone-number-survival-guide/`

No new route, new product surface, second canonical, provider research batch, or Astro migration is part of this audit.

## Evidence reviewed

- `frontend/tools/phone-number-lifecycle-mvp/index.html`
- `frontend/site.css`
- `frontend/tools/phone-number-lifecycle-mvp/radar-view.json`
- `scripts/test-phone-number-lifecycle-mvp.mjs`
- `docs/PHONE_RADAR_PRODUCT_RESET_2026-09-18.md`
- `docs/PHONE_RADAR_INTERACTION_SPEC_2026-09-18.md`
- direct user report that the current page is visually confusing / messy

The connected browser screenshot path was unavailable because the Opera Browser Connector was not connected. This audit therefore uses the checked-in production DOM/CSS plus the user's direct rendered-page observation. The repair session must include real preview/mobile visual verification before merge.

## Findings

### P0 — CSS token mismatch breaks the intended Phone visual system

Phone-specific CSS uses:

- `var(--border)`
- `var(--surface)`
- `var(--text)`

The production `frontend/site.css` defines the active site tokens as:

- `--line`
- `--panel`
- `--ink`

and does not define the Phone aliases above.

Result: multiple Phone declarations for borders, panel backgrounds, selected states and primary actions are invalid at computed-style time. The browser falls back to other/global rules instead of rendering the intended compact dashboard hierarchy.

This is a concrete implementation defect and must be fixed before Phone can be called visually closed.

### P0 — global button spacing leaks into Phone controls

Global CSS applies:

`button { ... margin-top: 16px }`

Phone-specific rules for family tabs, card actions, guide close and `Show more` do not reset that margin.

Result: controls inherit extra vertical spacing and can sit out of alignment with adjacent content. This directly increases the loose / messy appearance.

Repair requirement: all Phone-local buttons must explicitly own their margin/box model instead of inheriting the global calculator-button spacing.

### P1 — hero scale is marketing-sized instead of dashboard-sized

`.pr-hero h1` has no Phone-specific font-size override, so it inherits the global `h1` rule:

`font-size: clamp(2.5rem, 6vw, 5rem)`

On desktop this can render around 60–65 px or larger. The accepted interaction spec says Phone should feel like a compact data dashboard, not a marketing landing page.

Repair requirement: reduce Phone hero scale and vertical footprint so the family switch and first route move upward.

### P1 — too much chrome appears before the first real route

Current order before the first card is:

1. eyebrow;
2. H1;
3. hero paragraph;
4. three family tabs;
5. family description line;
6. country filter;
7. route count.

The accepted spec says a real route should appear almost immediately after the family switch. The family description repeats information already communicated by the tab label / hero, and the route count adds catalog bookkeeping rather than a decision signal.

Repair requirement:

- keep the three family choices;
- keep country as an optional refinement;
- remove or demote redundant family-note / route-count chrome;
- make the first route visually arrive immediately after the switch/refinement row.

### P1 — every card gives too many elements equal visual weight

Current long-term cards render five equal metric columns plus identity, two actions and a full-width caveat. On mobile, five metrics become a 2-column grid spanning three metric rows before actions/caveat.

The page therefore exposes many facts, but it does not sufficiently synthesize which facts matter first.

Repair requirement:

- preserve required decision information but create hierarchy;
- move state-like information such as `Stable / Watch` into a compact status chip near identity instead of an equal metric column;
- move number-type / data-only state into identity metadata where appropriate;
- keep the remaining core metrics as a compact comparison block;
- avoid rendering repetitive caveat prose when it merely restates already-visible setup/remote/stability fields;
- keep a concise warning line only when it changes the decision.

Do not add fabricated rankings or scores.

### P1 — the Full guide opens out of context

The shared `#route-guide` section is located after the entire route list, `Show more` control and keep-alive footnote. `openGuide()` fills that section and scrolls to it.

Result: clicking a route near the top sends the user away from the selected card and past the rest of the list. This breaks the compare → inspect → act loop and contributes to the sense that the page is one long mixed document.

Repair requirement: keep the guide attached to the selected route context. The minimum implementation is an inline expandable detail directly after the selected card; a drawer/bottom-sheet is acceptable only if it stays simple, accessible and reversible.

### P1 — data and temporary fields exist backstage but are not presented coherently

`radar-view.json` contains:

- Data `reuse`
- Temporary `availability`

but the current card renderer does not show those values. Simply adding more equal columns would make the clutter worse.

Repair requirement: during card hierarchy repair, decide which fields are primary comparison metrics and which belong in identity/status/secondary metadata. The final frontstage must remain concise while still preserving the family-specific user job.

### P1 — current automated audit cannot catch these visual defects

`scripts/test-phone-number-lifecycle-mvp.mjs` verifies route data, family separation, copy markers and analytics strings, but it does not verify:

- that Phone CSS custom properties resolve to production tokens;
- that global button spacing is overridden inside Phone;
- that the rendered card contract matches the intended field hierarchy;
- that the guide stays contextually attached to the selected route.

This explains how CI could pass while the page remained visually unfinished.

Repair requirement: add small static contract checks for the CSS token aliases/local button reset and for the repaired card/guide structure. Real preview/mobile visual verification remains mandatory; tests are not a substitute for seeing the page.

## Repair scope for the next bounded session

The next Phone session should repair the existing shell only:

1. fix Phone CSS token usage and local button spacing;
2. reduce hero/pre-list vertical weight;
3. reorganize cards into identity/status + compact metrics + restrained actions + conditional warning;
4. keep Full guide next to the selected card instead of at the end of the route list;
5. add targeted contract tests for the repaired structure;
6. verify desktop and mobile in a real Vercel Preview before merge.

## Explicit non-goals

Do not in the same repair session:

- add Trip.com CMLink or any other new route;
- reopen provider research;
- add recommendation scores / fake success percentages;
- create country/provider pages;
- migrate Phone to Astro;
- redesign homepage, Reset or Relay;
- change DNS, Vercel billing or account settings.

## Acceptance gate

Phone visual closure can be restored only when a real preview confirms:

- family choices are immediately understandable;
- the first route appears quickly;
- cards scan cleanly without a wall of equal-weight labels;
- warning/state hierarchy is obvious without long repeated prose;
- Full guide opens in the selected route's context;
- desktop and mobile have no overflow, misaligned controls or inherited global button spacing;
- light/dark selected/action states remain visually distinct;
- existing canonical, analytics and route data behavior still pass.

Until then, Q-014 visual closure is **reopened** and route expansion remains secondary to fixing the existing user-facing page.
