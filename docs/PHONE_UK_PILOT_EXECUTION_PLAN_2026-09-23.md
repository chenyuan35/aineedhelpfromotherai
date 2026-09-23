# Phone Radar — UK Pilot Execution Plan

Date: 2026-09-23
Status: ACTIVE EXECUTION PLAN

This plan narrows the next Phone Radar work. It does not expand the product surface. The only active implementation target is the existing canonical `/tools/phone-number-survival-guide/`, Long-term SMS/OTP family, using a small UK pilot.

## A. CURRENT URGENT — execute now

### U1. Build the UK long-term-number matrix MVP on the existing canonical

Scope is fixed to a small UK pilot. Initial evidence candidates:

- Vodafone UK direct
- VOXI on Vodafone UK
- Lebara UK on Vodafone UK
- Giffgaff on O2

A candidate may be dropped before shipping if current evidence is too weak or cannot be reconciled cleanly.

Required user-visible outcome:

- grouped market → host network → brand/route hierarchy;
- desktop comparison matrix with horizontal access to dense fields;
- mobile compact grouped cards from the same normalized data;
- real landed acquisition cost and approximate CNY cost;
- yearly keep cost + exact keep action/interval;
- China/overseas activation state;
- KYC/device/payment friction;
- Wi-Fi Calling / roaming SMS;
- app-specific observed evidence for ChatGPT/OpenAI, Telegram, WhatsApp where available;
- recycling/suspension/closure events;
- refund/recovery/reissue/port-out evidence;
- trend, evidence count and last checked;
- Guide + Acquire/Open actions;
- detailed in-page guide per shipped route.

No other Phone family or market is an active implementation target.

## B. CURRENT PREREQUISITES — must be completed before UI/data claims ship

### P1. Source reconciliation packet

For each pilot route, collect and reconcile:

1. strongest recent forum/community acquisition report;
2. actual landed-cost components;
3. keep-alive method and interval;
4. China/overseas activation context;
5. app-specific success/failure observations;
6. continuity incidents;
7. recovery/refund outcomes;
8. strongest contradictory evidence;
9. last verified date;
10. source URLs and duplicate/circular-report check.

Official/provider pages may be used only to refresh commercial metadata such as current list price, package name, checkout availability and published fee.

### P2. Pilot data normalization

Map accepted evidence into the directory model:

`market → network → brand → route → acquisition paths / cost snapshots / service observations / continuity events / guide`

Do not encode a permanent `works=true` or universal success percentage.

### P3. Evidence-display gate

- `n >= 5` reasonably independent recent observations for the same route + service + operation: observed rate may be shown with denominator/date.
- `n < 5`: show raw count + qualitative state only.
- conflicts remain visible.
- missing cost or incident data remains unknown, not zero.

### P4. Frontend implementation

Only after P1-P3 are sufficiently complete for the pilot rows:

- replace the current Long-term flat route-card presentation;
- preserve Data SIM/eSIM and Temporary SMS behavior unless a minimal shared-shell adjustment is necessary;
- preserve the existing canonical;
- no new backend/database for this MVP.

### P5. Verification and release

Required before merge:

- local build/contract tests pass;
- desktop matrix usable without hidden critical fields;
- 390px and 320px mobile cards readable with no horizontal page overflow;
- Guide and Acquire/Open actions work;
- Data and Temporary families still work;
- no fabricated percentages or numeric Phone risk score;
- PR → Eval Gate → Vercel Preview → merge → apex production verification.

## C. WAITING / EXTERNAL TRIGGER QUEUE

These are not active implementation tasks and must not steal execution time from U1.

### W1. Search Console / interaction measurement

Trigger: only after the UK directory correction is production-verified and has had time to accrue evidence.

Then measure the existing canonical; keep Google organic separate from referral/social/direct.

### W2. TikTok App Review

Status: waiting for Approved or Rejected/Changes requested. Do not alter submitted configuration while waiting.

### W3. Authority batch 2

Status: waiting. Learn Cursor + explainx.ai follow-up is not due before 2026-09-29.

### W4. Relay Exit Risk

Status: passive data accrual only. Preserve existing snapshots/lifecycle collection; no search-led feature expansion.

## D. LATER / CONDITIONAL QUEUE

These tasks do not become active until U1 ships and its acceptance criteria are met.

### L1. Expand the UK matrix

Only add another UK route/network when source quality is sufficient and it adds a materially different user option.

### L2. Add the next market

Only after the UK pilot proves the schema and interaction. Choose the next market from real forum demand/current cheap-route evidence, not for geographic completeness.

### L3. Broaden app compatibility coverage

Add Google/bank/other services only when repeated user demand and route-specific observations exist.

### L4. Research ingestion automation

Only after the manual pilot establishes which fields and event types are actually useful. Automate collection/snapshots without making the UI depend on a paid live API.

### L5. Monetization optimization

Only after meaningful traffic exists. No AdSense-layout optimization before the product has usage.

## E. FROZEN / DO NOT DO

- no global carrier bulk-fill;
- no country/provider doorway pages;
- no Data SIM/eSIM expansion in the UK pilot session;
- no Temporary SMS expansion in the UK pilot session;
- no generic carrier encyclopedia;
- no provider-page documentation mirror;
- no arbitrary 0–100 Phone risk score;
- no success percentage from fewer than five independent recent observations;
- no hidden weighted universal “best number” score;
- no backend marketplace/SMS inventory system;
- no Astro migration as part of this work;
- no Reset-family expansion;
- no generic Codex reset tracker;
- no DNS, AdSense, billing or paid-service changes.

## F. EXECUTION ORDER

Execute continuously in this order unless a real blocker appears:

1. P1 source reconciliation packet;
2. P2 normalize accepted pilot data;
3. P3 determine which app rates can legally/evidentially be shown versus raw counts only;
4. P4 implement Long-term matrix + mobile cards + guides;
5. P5 test, preview, merge and verify production;
6. move W1 measurement into active state only after ship.

## G. STOP CONDITIONS

Stop and record a blocker only when:

- a pilot route lacks enough current evidence to support the required user-visible fields;
- source reports cannot be reconciled without guessing;
- an implementation change would require a new backend/paid service/irreversible account change;
- CI/Preview/provider quota blocks release;
- a safety/legal issue requires excluding a route or instruction.

Do not stop merely because some fields are unknown. Unknown is valid data and should be shown as unknown.
