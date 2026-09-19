# Phone Radar visual-first acceptance — 2026-09-19

Status: **ACTIVE ACCEPTANCE CONTRACT FOR Q-014J.**

This document converts direct user feedback plus a live production browser audit into atomic visual tasks. It does not authorize a second Phone URL, a new route batch, or a broad site redesign.

Canonical: `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/`
Existing implementation branch: `feat/q014j-phone-visual-repair-20260918` / Draft PR #130.

## Product requirement

Phone Radar must communicate its job visually before it asks the user to read explanatory prose.

The first screen should answer, at a glance:

1. Do I need a number I can keep?
2. Do I need mobile data?
3. Do I need a one-time SMS code?
4. What are the best current choices for that job?

The page is not accepted merely because it contains data cards. The visual hierarchy must make the choice obvious without requiring the user to parse a marketing headline, explanatory paragraph and text-only tabs first.

## Live production audit — 2026-09-19

A read-only browser audit of production confirmed:

- the first screen still follows a marketing composition: eyebrow → oversized `Find the right phone route fast.` H1 → explanatory sentence → text route-family buttons;
- the hero consumes roughly the top third of a desktop viewport;
- the three route families are understandable primarily by reading their labels, not by graphical recognition;
- real route cards are visible and contain useful comparison data, so the route-data layer is a usable foundation;
- production route cards still expose five comparable labels (`SMS / OTP`, `KEEP / YEAR`, `SETUP`, `REMOTE`, `STABILITY`), which is denser than the intended decision-first hierarchy;
- no gross alignment failure was observed, but the composition does not meet the stronger visual-first product requirement.

Conclusion: **production is not visually closed.** It is a data-card prototype, not yet the intended visual decision dashboard.

## What PR #130 already improves

The current Draft PR moves in the correct direction:

- reduces the Phone-local H1 scale;
- introduces three visual job cards with SVG icons and plain-language purposes;
- uses a three-column desktop selector rather than text-only tabs;
- reorganizes route cards into identity/status + compact metadata + three primary metrics + actions;
- moves the full guide inline with the selected route;
- adds Phone-specific dark-state fixes and visual-contract regression checks.

These changes are **not accepted yet** because the fixed head has no fresh successful Vercel Preview.

## Q-014J visual-first task list

### V-01 — Demote the hero from centerpiece to orientation

Acceptance:
- `Phone Radar`/page identity remains visible but does not dominate the first screen;
- H1 is proportionate to the controls/data around it, not a marketing-display headline;
- explanatory copy is one short support line at most in the primary viewport;
- desktop composition should not read as “huge title over tiny sentence.”

### V-02 — Make the three user jobs the primary visual object

Acceptance:
- three choices are graphical cards/buttons with distinct icons/shapes and concise purpose labels;
- user can distinguish `keep a number`, `mobile data`, and `one-time code` before reading secondary explanation;
- exactly one selected state is obvious in light and dark mode;
- the selector row receives more visual priority than marketing copy.

### V-03 — Prefer a compact horizontal desktop composition

Acceptance:
- on normal desktop widths, use width before consuming height;
- job choices should sit in one compact horizontal row or an equally efficient visual composition;
- route identity, core comparison metrics and actions should read left-to-right rather than as repeated vertical prose blocks;
- avoid unnecessary vertical wrappers, duplicated labels and spacer sections before real data.

### V-04 — Turn route comparison into visual data, not paragraphs

Acceptance:
- each family exposes only the 2–3 metrics that change the decision;
- status/risk should use compact badges/signals, not repeated explanatory paragraphs;
- keep-alive cost, setup effort, availability/remote usability and equivalent family-specific values must be visually scannable;
- warnings appear only when they materially change the choice;
- longer acquisition/activation/retention/recovery prose stays behind `Full guide`.

### V-05 — Put a real choice in the first viewport

Acceptance:
- at common desktop height, at least the first real route/card is visible without a long scroll after the visual job selector;
- the user sees actual data quickly enough to understand this is a comparison tool, not an article;
- no catalog-count or explanatory chrome may displace the first useful result without a concrete reason.

### V-06 — Mobile remains visual, not a compressed desktop table

Acceptance:
- job cards remain tappable and understandable at 320–430px widths;
- horizontal scrolling, if used for job cards, is deliberate and does not cause page-level overflow;
- primary metrics remain legible without five tiny equal-weight columns;
- actions and inline guide remain attached to the selected route.

### V-07 — Real rendered acceptance, not source-code inference

Required screenshots/checks from a fresh Preview of the current fixed head or its legitimate successor on the same PR branch:

- desktop light;
- desktop dark;
- mobile light;
- mobile dark;
- selected state for all three families;
- first route visibility;
- country refinement;
- `Show more`;
- Full guide open/close;
- no horizontal overflow;
- primary/secondary action hierarchy.

CI/source assertions are necessary but are not visual acceptance.

## Stop / scope rules

- Do not merge PR #130 while Vercel `build-rate-limit` prevents a fresh rendered review.
- Do not push no-op commits or use alternate Vercel projects/accounts to bypass the quota.
- Fix reproduced visual defects on the existing PR #130 branch rather than starting a parallel Phone redesign branch.
- Do not add CMLink, One NZ or another route while shell acceptance is open.
- Do not migrate the entire site to Astro as part of this task.
- Do not solve the visual problem by adding decorative illustrations that consume more first-screen height; the visual must encode user choices/data.

## Definition of done

Q-014J visual closure is complete only when:

1. the page reads as a visual comparison tool within seconds;
2. the hero is subordinate to user-job choices and real data;
3. three job families are graphically distinct and selected state is unmistakable;
4. the first useful route is visible quickly;
5. route cards are compact comparison objects rather than text blocks;
6. desktop/mobile and light/dark real Preview review is clean;
7. existing canonical, route logic, analytics and accessibility remain intact;
8. no new product surface or unrelated route expansion was introduced.
