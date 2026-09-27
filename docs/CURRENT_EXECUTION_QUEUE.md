# Current Execution Queue

Last updated: 2026-09-28

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules. Historical detail belongs in PRs, Git history, task-specific docs and the Daily Project Journal.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Phone database coverage and public/indexable coverage are separate concerns.** A broad 90%+ relevant-route database is an acceptable internal goal; it does not authorize equivalent public URL growth.
3. **Frontend target — visual search/decision UI.** Search/filter/compare first, progressive disclosure and on-demand loading, with deep evidence loaded only when the user touches the route.
4. **SEO target — selective publication.** Database rows may be `research-only`, `database-only`, `comparison-visible`, `detail-eligible` or `indexable`; only the last state earns a standalone search page/sitemap entry.
5. **AI Reset Radar — FROZEN / direct URLs preserved.**
6. **Relay Exit Risk — data-accrual experiment only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.

## JUST COMPLETED — Phone publication-state reconciliation / PR #261

The global Phone expansion is now reconciled with the product architecture without shrinking the database:

- current normalized dataset remains **135 routes / 83 markets**;
- `publication-policy.json` separates database/comparison state from standalone publication;
- normalized routes default to `comparison-visible`, not indexable;
- only VOXI, Lebara UK and Giffgaff are initially explicit `indexable` route details;
- market detail pages default to `database-only`, so the former 83-row market URL family is no longer auto-generated;
- standalone route / market / keep-alive details are generated only for explicit `detail-eligible` / `indexable` states;
- sitemap generation omits `noindex` pages and boundary tests reject non-indexable URL leakage;
- the global Directory initial HTML contains **0 database rows** and defers a shallow comparison index (135 routes) after page load; deep route evidence is not part of that initial payload;
- crawler-visible Phone internal-link validation prevents removed detail URLs from leaving 404 links;
- retention tests now treat deep retention intelligence as a subset of the carrier catalog rather than requiring every database route to have deep evidence;
- Keep-Alive no longer invents a 15% buffer, no longer assumes today is the user's last action, and calendar export is one-time rather than a drifting recurring rule.

Release closure: Eval Gate #855 passed; Vercel Preview reached READY; PR #261 squash-merged as `11f26865c954b0d39e8515e8fc7b1130f8efa717`; production deployment `dpl_8gqwvxA1W7ZLjFQuGL6YSUwYAvhB` reached READY. Production verification on the custom domain confirmed the Directory returns HTTP 200, representative removed non-indexable route (`tello-paygo-credit-2026`) and market (`united-states`) URLs return HTTP 404/noindex, and `sitemap.xml` contains only the explicitly admitted Phone detail URLs rather than the former bulk market/route families.

## NEXT SESSION — harden Qwen/Kimi data admission

**Session task:** make the route from delegated research into the normalized/comparison database explicit and auditable.

### Scope

1. inspect `merge-global-directory.py`, reviewed-packet importer/staging paths and current batch-file ownership;
2. replace or guard wildcard `*batch*.json` ingestion with an explicit reviewed manifest or equivalent admission contract;
3. keep raw Qwen/Kimi output outside comparison-visible data until sampled/reviewed;
4. preserve all currently admitted broad database coverage; do not delete routes merely to make the gate easier;
5. add regression tests proving an unlisted/raw batch cannot enter the comparison dataset;
6. keep publication policy independent so database admission still does not imply SEO/indexability.

### Definition of done

- new delegated research has a clear staging state;
- admission into the broad comparison database requires an explicit reviewed action;
- existing 135-route coverage is preserved unless a record is independently found invalid;
- tests protect the staging → database → publication boundaries;
- Qwen/Kimi can continue high-throughput research without gaining release authority.

### Stop conditions

Do not redesign the data schema or add a backend service unless the existing static/importer path truly cannot enforce admission. Do not weaken provenance/evidence requirements just to automate throughput.

## Qwen / Kimi work lane

QwenPaw/Kimi remain **high-throughput backstage workers**, not project managers.

Eligible parallel work:

- expand low-cost route coverage;
- retrieve and timestamp sources;
- fill normalized fields;
- detect stale prices/rules and contradictions;
- dedupe same-author/circular reports;
- collect service-specific operational evidence;
- produce bounded research/data batches.

Every delegated result is `RESEARCH CANDIDATE` until sampled/reviewed by the coordinating session. Qwen/Kimi must not independently change the roadmap, production/publication state, sitemap/indexability, ranking policy, infrastructure roles, billing/account settings, or merge/deploy state.

Before accepting a large batch, sample-audit source quality, duplicate rate, unsupported inference and stale facts. High throughput should increase evidence/database coverage, not unreviewed public page volume.

## Daily work discipline

Every project workday:

1. read the GitHub startup chain;
2. create one bounded Session Card/checklist;
3. delegate parallelizable evidence/data tasks when useful;
4. execute and verify the selected task;
5. update the correct GitHub facts/queue when state changes;
6. append one dated entry to `aineedhelpfromotherai — Daily Project Journal`;
7. close with completed work, failures/blockers, unfinished work, evidence state, next-session order and do-not-do list.

The journal is chronology only. GitHub `main` + verified production remains final truth.

## Measurement lane

- Search Console: use Windsor.ai `searchconsole` while connected; official GSC API/export is fallback.
- Keep Google organic separate from social/referral, AI referral and direct/repeat.
- GA4 tag `G-FYKKNKRE58` and behavior events are live in production; Windsor GA4 authorization currently resolves property `553896884` but report reads return zero rows. Treat this as an unresolved GA4 property/data-stream/read-path issue, not as a traffic conclusion.
- Do not churn Phone public UX from tiny GSC samples.

## External waits

- **TikTok App Review — WAITING.** Do not Recall/edit submitted configuration until Approved or Rejected/Changes requested.
- **Authority batch 2 — WAITING.** Follow the trigger in `docs/AUTHORITY_AND_AI_DISCOVERY.md`; do not create extra outreach volume merely to stay busy.

## Do not do next

- do not shrink the Phone research/database layer simply because the current public URL surface is too broad;
- do not equate a database row with a public page;
- do not bulk-create country/provider/route SEO pages from coverage data;
- do not invent compatibility percentages, missing costs or a Phone risk score;
- do not let Qwen/Kimi raw output bypass the review/admission/publication gates;
- do not migrate to a new backend merely for architectural neatness;
- do not reopen generic Reset/Codex tracker work;
- do not reopen Relay methodology;
- do not rotate trial accounts or change billing to bypass quotas;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
