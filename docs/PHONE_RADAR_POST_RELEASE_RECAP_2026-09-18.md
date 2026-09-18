# Phone Radar Post-Release Recap — 2026-09-18

Status: handoff/reference only. Current execution priority lives in `docs/CURRENT_EXECUTION_QUEUE.md`; current facts live in `PROJECT_CONTEXT.md`; project phase lives in `docs/MASTER_PLAN.md`.

## Why this recap exists

The Phone work temporarily drifted from a fast route-discovery utility into a questionnaire/research-manual experience. The product was corrected and the corrected model is now live. This note records the lessons so the next session does not repeat the same drift.

## The product that is now live

Phone Radar solves one job: help a user discover, compare, execute and maintain useful phone routes faster than searching scattered tutorials and forum threads.

It has three user-facing families:

1. Long-term SMS/OTP numbers.
2. Data SIM/eSIM routes.
3. Temporary SMS platforms.

It has two layers:

1. A visual comparison/dashboard layer that appears immediately.
2. A full operational guide that opens only when the user asks for details.

The canonical remains:

`https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/`

## What went wrong before the reset

The research layer became the visible product. Specifically:

- forum/community discovery was followed by increasingly broad provider-document research;
- provider-document completeness was treated as a prerequisite to showing useful routes;
- data-model unknowns began dictating the interface;
- target-service rules and geography checks took over the user flow;
- users had to answer questions before seeing options;
- evidence/methodology prose displaced the actual decision.

That created the wrong product: a research database query rather than a Phone Radar.

## Correct source hierarchy

For operational phone-route reality:

- current user/community outcomes are primary;
- independent repetition, recent success/failure and incident resolution matter;
- provider/operator pages are normally used for current commercial metadata: price, package, promotion, stock, purchase link and advertised fees;
- provider silence does not invalidate a community-reproduced workflow;
- explicit legal/safety/hard constraints are checked only when they materially affect whether the user can execute the route.

This is formalized in `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`.

## Correct visible decision axes

Long-term SMS/OTP routes should emphasize:

- practical SMS/OTP signal;
- keep-alive cost;
- setup effort;
- remote/overseas practicality;
- stability/continuity;
- acquisition and recovery path.

Data SIM/eSIM routes should emphasize:

- current price/value;
- data allowance and validity;
- coverage;
- activation/device friction;
- speed/throttling or fair-use realities when known;
- recharge/reuse;
- whether a real phone number exists.

Temporary SMS platforms should emphasize:

- current price model;
- service/country coverage;
- availability/stock;
- recent success/failure signal;
- one-time vs rental behavior;
- shared/reused/private-number reality;
- privacy and recovery risk.

## What PR #115 changed

PR #115 replaced the old questionnaire/manual-first UI with:

- immediate three-family selection;
- real route rows on the first screen;
- optional country filter;
- compact family-specific metrics;
- `Show more` as a secondary action;
- `Full guide` on demand;
- acquisition/open-platform actions;
- a separate `radar-view.json` frontstage layer;
- analytics hooks for family selection, filters, show-more, guide open and outbound actions;
- a simpler public publishing path without the old brittle byte-offset patching.

The release preserved the existing canonical and existing backstage research files.

## Production verification already completed

After PR #115 merged:

- the production Phone canonical returned HTTP 200;
- title/metadata reflected Phone Radar;
- the page was indexable and self-canonical;
- `radar-view.json` returned HTTP 200;
- Vercel Preview and Eval Gate were green before merge.

Do not spend the next session repeating these checks unless a regression appears.

## What is still incomplete

The next session must still close the release with one deliberate interactive QA pass:

- all three families visible without input;
- compact shortlist behavior;
- country filter;
- one full guide per family;
- guide usefulness and execution flow;
- outbound purchase/platform links;
- mobile hierarchy/no horizontal overflow;
- analytics hooks still wired;
- no accidental return of evidence-wall/questionnaire behavior.

If this passes, Q-014 is complete.

## Current route-pool shape

The first v1 pool is intentionally uneven.

Long-term is deepest but still concentrated in the UK, US, Japan and mainland-China categories.

Data is the shallowest family: Airalo plus a concrete Mobal Japan physical-data route and a generic local fallback.

Temporary SMS currently compares SMSPool, 5SIM and ActivateX.

This unevenness is acceptable. Do not fill countries or families merely for visual symmetry.

## What should happen after closure

First, check the GSC settled-data trigger. If Search Console has settled through Sep 16, execute the first real post-release Phone measurement before another production expansion.

Then resume route research in small batches. Pick 1–2 production routes by user value, recency, uniqueness and reproducibility.

Useful current leads include:

- Kaktus Czech eSIM / low-cost retention route from the user-supplied community report;
- ClubSIM Hong Kong;
- A1 Croatia prepaid eSIM;
- RedPocket US if it is meaningfully different from current US choices.

AIS remains HOLD until its starting-state/reproducibility questions are sufficiently clear for safe execution.

## What must not happen again

Do not:

- put a mandatory questionnaire before useful routes;
- treat the research database as the interface;
- make provider documentation completeness the research goal;
- turn official-service rules into the identity of Phone Radar;
- add long methodology/evidence walls to the default view;
- invent OTP success percentages from anecdotes;
- invent a Phone risk score without a real methodology;
- create country/provider doorway pages;
- add dozens of routes at once;
- convert temporary SMS comparison into a marketplace/backend;
- redesign the shell simply because more research exists.

## Resume point

The exact next-session execution order is in `docs/CURRENT_EXECUTION_QUEUE.md` under `NEXT SESSION — exact execution order`.
