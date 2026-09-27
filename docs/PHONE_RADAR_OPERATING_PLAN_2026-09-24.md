# Phone Radar Operating Plan

Status: ACTIVE PRIMARY GROWTH PLAN

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.

This document defines how Phone Radar should be operated as a maintainable product. Current task state belongs in `PROJECT_CONTEXT.md` and `docs/CURRENT_EXECUTION_QUEUE.md`; historical execution belongs in PRs, Git history and the Daily Project Journal.

## Business objective

Build a low-cost, maintainable phone-route decision product that earns organic traffic and repeat usage because it saves users substantial research and decision time.

Phone Radar is not a carrier encyclopedia and not a mass-generated SEO directory.

Its durable value is the combination of:

- broad route coverage;
- fragmented real-world evidence;
- current acquisition and retention economics;
- service-specific compatibility observations;
- KYC/activation/payment constraints;
- incident/recovery/refund history;
- freshness and contradiction tracking;
- fast visual comparison and search.

## Core user job

The target user wants an actual phone-number/data/SMS route and needs to answer quickly:

- what can I obtain now;
- what does it really cost to acquire;
- what does it cost and require to keep alive;
- can I activate/use it from my location;
- what KYC/payment/device constraints apply;
- what services have current success/failure evidence;
- what failures, recycling, suspension, seller or recovery incidents exist;
- how fresh and well-supported the evidence is;
- what exact next action should I take.

The product should reduce the need to manually read many carrier pages, forum threads and seller listings.

## Product/data separation

Phone Radar operates as five separate layers:

1. **Evidence intake** — broad discovery and source collection.
2. **Normalized database** — large internal route/evidence base.
3. **Query/search layer** — returns the subset relevant to the user's request.
4. **Interactive visual UI** — search, browse, compare, inspect and guide.
5. **Selective SEO publication** — only evidence-rich distinct search tasks become indexable URLs.

Database coverage may be much larger than the public/indexable page set.

A broad 90%+ relevant-route database coverage goal is acceptable when provenance and maintenance remain tractable. It is not a target for page count or sitemap size.

## Normalized data model

Use the hierarchy:

`market → network → brand/MVNO → concrete route/product/acquisition path → observations/events/snapshots/sources`

Keep provider-controlled facts distinct from operational evidence.

### Provider-controlled facts

Examples:

- official price;
- package allowance;
- published validity/deactivation rule;
- formal KYC requirement;
- supported form factors;
- official roaming/Wi-Fi Calling support;
- official purchase/activation path.

### Operational evidence

Examples:

- actual overseas acquisition/activation outcomes;
- ChatGPT/OpenAI, Telegram, WhatsApp and other service outcomes;
- number-range or prefix effects;
- account closure/suspension/recycling;
- seller non-delivery or invalid-number incidents;
- refunds, replacements, recovery and port-out outcomes;
- current app/payment/onboarding failures;
- actual retention workflow reproduction.

Official pages validate official facts; they do not automatically prove real-world operational behavior.

Missing data stays missing. Do not convert anecdotes into population probabilities. App compatibility percentages require visible sample size, date and route+service+operation-specific evidence.

## Interactive product surface

The main Phone experience should behave like a visual search and decision tool.

### Search / Browse

Allow users to narrow the database by task and constraints, including market, cost, route family, number type, eSIM/physical, retention cost/interval, remote activation, KYC/payment constraints, app evidence, incident state and freshness where supported.

### Compare

Allow a small number of routes to be pinned and compared across equivalent fields.

### Inspect

Expand a route into its deeper evidence only when requested.

### Guide

Show route-specific execution instructions when the user intends to act.

The UI should answer the comparison job before forcing the user to read prose.

## Progressive disclosure and loading

Treat performance and cognitive load as one product problem.

Prefer:

- small first-load payloads;
- loading only the market/family/result slice required by the current query;
- deeper route evidence only after route expansion;
- history/incidents/sources only on demand;
- no requirement to render every database row in initial HTML;
- client-side/static generation while it remains simpler and cheaper than introducing a backend service.

Do not add a server/API merely because the database is large. Add backend complexity only when data volume, freshness, privacy or performance proves the need.

## Publication states

Every route should have an explicit public-surface state independent from database admission:

- `research-only` — unreconciled/raw candidate;
- `database-only` — normalized internal record;
- `comparison-visible` — eligible for search/filter/comparison UI;
- `detail-eligible` — enough evidence for a deep route view;
- `indexable` — standalone public search page passes the publication gate.

These states are monotonic only when evidence remains valid; a route may be downgraded if facts become stale or conflicts appear.

## SEO publication gate

A database row does not earn an SEO page merely because it exists.

An indexable detail URL requires:

- unambiguous route identity and acquisition path;
- current provider-controlled commercial facts;
- meaningful independent operational evidence;
- a distinct search/execution job beyond the comparison row;
- substantial route-specific content;
- visible freshness and unresolved conflicts;
- a reason to exist even when the provider's official page is one click away;
- a reason to exist even when the strongest independent competitor is one click away.

Do not create country/provider/route page families simply for coverage.

Low-evidence/unknown routes may still be valuable in the searchable comparison database while remaining non-indexable and absent from sitemap publication.

## Evidence acquisition loop

The durable evidence flow is:

`community discovery / reviewed sources → candidate evidence → dedupe/provenance review → normalized records → database admission → comparison decision → optional publication decision`

Database admission, comparison visibility and SEO publication are three separate decisions.

### Community watcher

Use `phone-demand-watch` only as a bounded discovery worker.

Capture current questions, first-hand outcomes, service-specific mentions, acquisition channels, seller/refund incidents and candidate public domains. Preserve bounded metadata and short excerpts rather than forum archives. Do not bypass login, anti-bot, robots or platform controls.

### Reviewed source watcher

Use `phone-source-watch` for explicitly accepted official/commercial URLs whose price, package, stock, purchase path or published rules matter.

New domains discovered by community research are candidates only; they are not automatically approved monitoring targets.

### Disposable observer rule

Observer VPS hosts are not production infrastructure. Valuable normalized evidence must move into durable project sources; no unique state may remain only on a trial host.

## QwenPaw / Kimi collaboration

QwenPaw/Kimi are high-throughput backstage workers.

Preferred assignments:

- broad route discovery;
- forum/source retrieval;
- provenance and timestamps;
- structured field completion;
- contradiction/stale-price checks;
- deduplication and circular-report detection;
- bounded batch triage;
- draft data/test artifacts.

Their output is `RESEARCH CANDIDATE` until reviewed.

They must not independently:

- change product direction or current queue;
- redefine schemas/publication rules;
- turn database records into public/indexable pages;
- change rankings without an accepted rule;
- assign infrastructure roles;
- modify DNS/billing/AdSense/account-critical settings;
- merge or deploy production changes.

Before accepting a large batch, sample-audit source quality, duplication, classification and unsupported inference. High throughput should increase database/evidence coverage, not unreviewed page volume.

## Coordinating ChatGPT role

The coordinating session owns:

- canonical startup/reconciliation;
- product/value decisions;
- bounded task selection;
- batch quality control;
- evidence admission and public-surface gates;
- frontend/search/SEO architecture;
- Search Console and analytics interpretation;
- PR review and merge/release verification;
- canonical fact-source updates;
- Daily Project Journal closeout.

GitHub `main` remains the shared control plane.

## Growth loop

1. continuously acquire and normalize evidence;
2. improve search/filter/comparison usefulness before multiplying pages;
3. measure how users/search engines interact with the existing surface;
4. deepen routes that receive real demand/usage and have enough evidence;
5. publish standalone pages selectively;
6. build authority around citeable dated primary/operational evidence;
7. monetize only after trust and traffic are meaningful.

## Metrics

### Data/evidence metrics

- relevant route coverage;
- normalized-field completeness by route class;
- percentage of surfaced routes inside freshness windows;
- current independent observations per route/service;
- unresolved conflicts/incidents and later resolution rate;
- duplicate/rejected candidate rate;
- source health.

### Product metrics

- searches and filters used;
- result → inspect rate;
- compare usage;
- guide opens;
- outbound acquisition clicks;
- repeat/direct usage;
- route-level interaction where authorized analytics is available.

### Search/growth metrics

- canonical and approved indexable-page impressions/clicks/CTR/query mix;
- indexed vs intentionally non-indexed state;
- organic vs referral/social vs AI referral vs direct/repeat;
- later AdSense RPM/revenue only when traffic is meaningful.

Do not treat temporary referral/social traffic as SEO success.

## Maintenance rules

Prefer one data-driven system over duplicated route-specific code.

Maintain:

- one normalized schema;
- importer/admission paths;
- deterministic derived search/index artifacts;
- explicit publication state;
- generated UI from data;
- automated data integrity and publication-isolation tests;
- easy rollback through bounded PRs;
- no production dependency on disposable observer state.

A failure in one route/data batch should be repairable without rebuilding the whole product.

## Daily execution loop

Follow `docs/DAILY_PROJECT_JOURNAL.md` and `docs/SESSION_EXECUTION_PROTOCOL.md`.

Every workday:

1. read GitHub startup chain;
2. choose one bounded task;
3. delegate parallelizable evidence/data work;
4. execute and sample-audit;
5. persist accepted facts/code/data through GitHub;
6. verify;
7. measure when relevant;
8. journal actual work and blockers;
9. leave exactly one next-session task in `docs/CURRENT_EXECUTION_QUEUE.md`.

## Current reconciliation principle

The current broad global database should not be reduced merely because public route/page generation became too broad.

The correction target is the boundary:

`database coverage ≠ comparison visibility ≠ detail eligibility ≠ SEO indexability`

Preserve useful data. Fix the release states and frontend/publication behavior.
