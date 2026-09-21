# Relay Exit Risk visual audit — 2026-09-21

Status: **M-03A AUDIT COMPLETE / BOUNDED REPAIR REQUIRED**

Production target: `https://aineedhelpfromotherai.com/tools/relay-exit-risk-checker/`

Methodology baseline: `docs/RELAY_RISK_METHODOLOGY.md`, version `2026-09-14-v1`.

## Audit scope

Read-only production audit only. No community forecast was submitted and no production data was changed.

Cases:

- safe empty-evidence domain: `m03-audit.invalid`;
- existing measured relay: `daoxe.com` from the current Sinan Compute open-data feed;
- desktop 1440×900 light/dark;
- mobile 390×844 light/dark;
- input → result path;
- prepaid-exposure local calculation;
- canonical/H1/overflow/client-error checks.

## Data and functional verification

`m03-audit.invalid` returned HTTP 200 with `riskIndex:null`, `confidence:"insufficient"`, no source, empty history and zero community votes. This is the correct low-evidence state; no synthetic neutral score is inserted.

`daoxe.com` returned HTTP 200 with Exit Risk Index `5`, `confidence:"low"`, one measured-availability component and current Sinan open-data attribution. The audited snapshot reported 100% availability across 21 recent probes and retained daily history. Community votes were zero, so the community score did not affect the index.

The page keeps the 0–100 value as an evidence index rather than a probability. Community survival and model-trust sentiment remain visually and semantically separate. The rendered wording matches the fixed methodology.

Prepaid exposure also passed: entering daily spend `8` and balance `200` produced `25 days exposed`. A clean browser run produced no page JavaScript errors. Production has exactly one H1, the self-canonical URL, and no page-level horizontal overflow at the audited desktop/mobile widths.

## Visual findings

Desktop is already structurally sound. At 1440×900 the input remains in the first viewport and the result grid begins at about 650px. The two-column result/community composition is readable in both themes.

Mobile reproduces a hierarchy defect. At 390×844 the hero is about 391px tall, the search controls occupy about 150px, and the primary result card begins at about 827px. The actual index/heading sits below the first viewport, so after the lookup the user sees effectively no result without scrolling.

The empty state is also too tall and repetitive. At 390px width the empty primary result card is about 1533px high, close to the populated result card at about 1675px. Absence is repeated across the stage caption, score explanation, third-party metric block and history block instead of being summarized once while still identifying which evidence classes are missing.

Dark mode preserves contrast and button hierarchy. No visual overflow defect was reproduced.

## Accepted defect queue

### M-03R-1 — Mobile result proximity

Reduce mobile pre-result vertical cost without changing title/meta/canonical or Relay semantics. After a lookup at 390×844, the Exit Risk heading/index must be materially visible in the first viewport rather than starting below it. Preserve the desktop two-column composition unless the repair requires a small shared spacing change.

### M-03R-2 — Empty-state density

Make the no-evidence result materially shorter. Consolidate repeated absence messages while still naming the missing evidence classes: measured third-party data, stored history and recent community forecasts. Do not invent a neutral score, hide uncertainty, or convert the index into a probability.

## Repair boundaries

Do not change the score formula, methodology version, source weighting, forecast thresholds, confidence rules, API persistence, community vote model, title/meta, canonical, or add a new Relay feature.

Do not submit test votes. Use the same safe `.invalid` domain plus a current measured relay for Preview/production acceptance.

## Next session

Execute one bounded M-03 Relay repair batch for M-03R-1 and M-03R-2, then require build/tests, Eval Gate, a real Vercel Preview, desktop/mobile light/dark visual acceptance, input/result verification, and independent apex production verification before closing M-03.