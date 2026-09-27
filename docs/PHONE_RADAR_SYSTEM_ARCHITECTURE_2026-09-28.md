# Phone Radar System Architecture — 2026-09-28

Status: ACTIVE durable architecture contract; publication-state enforcement implemented in PR #261.

This document separates Phone Radar's **data coverage**, **interactive product UI**, and **SEO/publication** concerns. A large database is expected and desirable; it must not be interpreted as authorization to create the same number of public/indexable pages.

## Product definition

Phone Radar is not a carrier encyclopedia and not a database rendered directly as webpages.

It is a **data-backed phone-route decision system**:

`broad evidence database → search/filter/query layer → visual decision UI → on-demand route detail → selective SEO publication`

The product succeeds when a user can find an appropriate route faster and with less uncertainty than by manually reconstructing the answer from carrier pages, forums, sellers and anecdotes.

## Layer 1 — research and evidence intake

Purpose: maximize useful evidence coverage, not public URL count.

Inputs may include:

- current community/forum reports;
- reviewed official/provider facts;
- seller/acquisition evidence;
- price and retention changes;
- activation/KYC/payment constraints;
- service-specific OTP/SMS outcomes;
- number-loss, recycling, closure, refund and recovery events;
- source freshness and contradictions.

QwenPaw/Kimi and bounded watchers may operate at high throughput here.

All delegated output is `RESEARCH CANDIDATE` by default. It is not automatically accepted product truth.

## Layer 2 — normalized Phone database

Purpose: become the broad internal knowledge base behind the product.

The database may contain hundreds or thousands of routes. A long-term coverage goal of roughly 90%+ of the relevant low-cost route universe is acceptable **as a data-coverage objective**, provided maintenance and provenance remain tractable.

Database scale is not an SEO objective.

Core normalized entities should remain separable:

`market → network → brand/MVNO → route/product/acquisition path → observations/events/snapshots/sources`

Important fields include:

- identity and route family;
- acquisition path and current landed cost;
- keep-alive action/cost/interval;
- KYC, location, payment and device constraints;
- eSIM/physical/number class;
- roaming/Wi-Fi Calling/SMS behavior;
- service + operation specific app evidence;
- continuity incidents and recovery/refund outcomes;
- current conflicts and unresolved fields;
- source provenance, source date and last verification date.

Missing fields remain missing. Unknown values never become neutral-positive values and never improve ranking.

## Layer 3 — query/search service

Purpose: let the frontend retrieve only the slice needed for the user's current task.

The frontend should not ship the complete deep database on initial page load.

Supported query dimensions should include, where data exists:

- country/market;
- route family;
- number type;
- eSIM vs physical;
- acquisition cost;
- yearly retention cost;
- retention interval;
- remote acquisition/activation;
- KYC/payment constraints;
- service-specific evidence such as ChatGPT/OpenAI, Telegram and WhatsApp;
- risk/incident/recovery state;
- freshness/evidence state.

The query layer may initially be generated/static/client-readable if that remains the simplest low-cost implementation. A server/API is justified only when data volume, freshness, privacy or performance proves it necessary.

## Layer 4 — interactive visual UI

Purpose: reduce decision cost.

The default product behaves more like a visual search/decision desktop than a content directory.

### Progressive disclosure

Users first see the minimum information required to choose a direction. Deeper information appears only after a search, filter, expansion, comparison or route selection.

### Lazy/on-demand loading

Prefer:

- small first-load payloads;
- market/family slices loaded on demand;
- deeper route evidence loaded only when a route is opened;
- history/incidents/source details loaded only when the user requests them;
- no requirement to render every database record in the DOM or initial HTML.

### Primary UI modes

1. **Search / Browse** — fast query, filters, ranking and grouped results.
2. **Compare** — pin a small set of routes and compare equivalent fields side-by-side.
3. **Inspect** — expand one route into cost, activation, retention, evidence, incidents and freshness.
4. **Guide** — show execution steps only when the user wants to act.

Visual components should be data-driven: cost bars/breakdowns, keep-alive timelines, compatibility/evidence chips, incident/history timelines, freshness indicators and clear pending/conflict states.

Do not create decorative charts that do not reduce decision time.

## Layer 5 — publication and SEO

SEO is a **selective publication layer**, not a mirror of the database.

A database record does not earn an indexable URL merely by existing.

Use explicit publication states:

- `research-only` — raw or unreconciled candidate;
- `database-only` — normalized and useful internally, not suitable for direct user surface;
- `comparison-visible` — may appear in search/filter/comparison results;
- `detail-eligible` — enough unique execution evidence for a deep route view;
- `indexable` — a distinct search task and evidence-rich public URL has passed publication gates.

A route detail page may become `indexable` only when it has a distinct user task, sufficient current evidence, visible conflicts/freshness, and substantial route-specific value beyond the comparison result.

Country/provider/route URL families must never be generated merely because rows exist in the database.

Observation/unknown records may still be useful in the interactive database UI while remaining non-indexable and omitted from sitemap publication.

## Agent orchestration

### Coordinating ChatGPT session

Owns:

- reading the canonical GitHub startup chain;
- current-state reconciliation;
- product architecture and value decisions;
- bounded task selection and Session Card;
- evidence admission gates;
- sample quality control on delegated batches;
- public-surface/SEO decisions;
- Search Console/analytics interpretation;
- PR review, release gating and production verification;
- canonical GitHub fact updates;
- daily journal closeout.

### QwenPaw / Kimi agents

Preferentially own parallelizable backstage work:

- broad route discovery;
- source retrieval and provenance;
- structured field extraction;
- contradiction detection;
- dedupe and same-author/circular-report checks;
- stale price/rule re-checks;
- database coverage expansion;
- bounded batch triage;
- draft data/test artifacts.

They may increase **evidence throughput** and **database coverage** aggressively, but must not independently turn database rows into public/indexable pages, change the roadmap, weaken publication gates, merge/deploy, or redefine project truth.

### Batch quality gate

For each large delegated batch:

1. define exact schema and evidence requirements before delegation;
2. require source URL, source date, evidence type and unresolved conflicts;
3. sample-audit a bounded subset before accepting the whole batch;
4. reject/narrow the batch if duplication, unsupported inference or stale facts exceed tolerance;
5. admit accepted records to the normalized database;
6. decide comparison visibility separately from database admission;
7. decide SEO/indexability separately from both.

## Daily operating loop

Each project workday uses one control loop:

1. **Resume** — read GitHub `main` startup chain and verified live state.
2. **Plan** — choose one bounded session task and checklist.
3. **Delegate** — send parallelizable evidence/data work to Qwen/Kimi where it saves time.
4. **Execute** — ChatGPT handles architecture, product, code/release or review work that requires project-wide judgment.
5. **Quality control** — sample delegated output and reconcile conflicts.
6. **Persist** — accepted facts go to the correct GitHub fact/data source through branch/PR workflow.
7. **Verify** — tests, CI/Eval/Preview and live production when relevant.
8. **Measure** — use first-party Search Console and authorized analytics where the task requires it.
9. **Journal** — append the day's actual checklist, completed work, evidence, blockers, unfinished state, next trigger and do-not-do list to `aineedhelpfromotherai — Daily Project Journal`.
10. **Close** — leave exactly one next-session task in `docs/CURRENT_EXECUTION_QUEUE.md`.

The journal records chronology; GitHub records truth.

## Maintenance architecture

The system should remain easy to repair and extend:

- one normalized route schema;
- import/admission tools rather than hand-editing many pages;
- deterministic derived artifacts/search indexes;
- explicit publication-state fields;
- generated UI from data rather than duplicated route-specific frontend code;
- clear invalidation/rebuild steps;
- tests for data integrity, public-surface isolation and publication gates;
- no production dependency on disposable observer state;
- rollback possible by reverting one bounded PR rather than manually repairing hundreds of pages.

## Current architectural correction

The current production surface contains a broad global Phone directory and many route/market/keep-alive URLs. The existence of the underlying global database is not itself a defect.

The reconciliation question is narrower:

> Which records should be database-only or comparison-visible, and which records genuinely qualify for indexable standalone publication?

Do not solve that question by shrinking the research database. Solve it by enforcing the layer boundaries above.
