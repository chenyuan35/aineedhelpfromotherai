# Current Execution Queue

Last updated: 2026-09-28

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` remain canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: one current task, current blockers/waits, and do-not-do rules. Historical detail belongs in PRs, Git history, task-specific docs and the Daily Project Journal.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **Phone database coverage and public/indexable coverage are separate concerns.** Broad reviewed database coverage is desirable; it does not authorize equivalent public URL growth.
3. **Frontend target — visual search/decision UI.** Search/filter/compare first, progressive disclosure and on-demand loading, with deep evidence loaded only when the user touches the route.
4. **SEO target — selective publication.** Database rows may be `research-only`, `database-only`, `comparison-visible`, `detail-eligible` or `indexable`; only the last state earns sitemap/indexable publication.
5. **AI Reset Radar — FROZEN / direct URLs preserved.**
6. **Relay Exit Risk — data-accrual experiment only.**

Architecture contract: `docs/PHONE_RADAR_SYSTEM_ARCHITECTURE_2026-09-28.md`.

## JUST COMPLETED — Qwen/Kimi data admission hardening / PR #263

The delegated-research → comparison-database boundary is now explicit without shrinking the broad Phone dataset:

- both legacy batch merge scripts no longer discover `*batch*.json` by wildcard;
- `frontend/tools/phone-number-lifecycle-mvp/batch-admission-manifest.json` is the explicit reviewed compatibility allowlist;
- the currently admitted legacy batch set is preserved and the global comparison artifact remains at least **135 routes**;
- an unlisted/raw delegated batch is excluded even when placed beside reviewed batch files;
- normalized `data/phone/v1` review-packet admission remains the preferred new-route path;
- comparison/database admission still does not grant route detail publication, sitemap inclusion or indexability;
- `npm run phone:data:check` now regression-tests the delegated-batch boundary and runs inside Eval Gate.

Release closure: Eval Gate #859 passed, Vercel Preview passed, PR #263 squash-merged as `6623b01293c9dd558ac2a9b8a274a5891a5954ea`, main Vercel deployment succeeded, and live `/tools/phone-number-survival-guide/` plus `/tools/phone-number-survival-guide/directory/` both returned HTTP 200.

## NEXT SESSION — canonical-to-comparison compatibility audit

**Session task:** determine whether the legacy comparison compatibility artifact can be derived from reviewed canonical Phone data so database admission has one unambiguous authority.

### Scope

1. compare route identity/counts and UI-required fields between canonical `data/phone/v1`, its compiled artifacts, and `frontend/tools/phone-number-lifecycle-mvp/global-directory.json`;
2. identify exactly what the legacy global directory still provides that canonical normalized data does not;
3. determine whether the 135-route comparison behavior can be generated losslessly from reviewed canonical truth with a small maintainable adapter/build step;
4. if the mapping is lossless, implement the smallest convergence and regression tests; if it is not lossless, document the exact incompatibility and stop;
5. preserve the PR #263 manifest gate until the compatibility layer is actually retired or made redundant;
6. keep publication/indexability policy independent and unchanged.

### Definition of done

- one unambiguous database-admission authority exists, or a precise bounded incompatibility is documented;
- current 135-route comparison coverage and required decision fields are preserved;
- raw/staging/Qwen/Kimi output still cannot bypass reviewed admission;
- no standalone route/market URL expansion occurs;
- tests protect canonical → comparison → publication boundaries.

### Stop conditions

Do not redesign the Phone schema, add a backend service, delete valid routes, bulk-publish pages, or weaken provenance/evidence rules merely to remove the compatibility layer.

## Qwen / Kimi work lane

QwenPaw/Kimi remain **high-throughput backstage workers**, not project managers.

Eligible parallel work: expand low-cost route evidence, retrieve/timestamp sources, fill normalized fields, detect stale rules/contradictions, dedupe circular reports, collect service-specific operational evidence, and produce bounded research/data batches.

Every delegated result is `RESEARCH CANDIDATE` until sampled/reviewed by the coordinating session. Qwen/Kimi must not independently change roadmap, database admission, production/publication state, sitemap/indexability, ranking policy, infrastructure roles, billing/account settings, or merge/deploy state.

## Daily work discipline

Every project workday: read the GitHub startup chain; define one bounded task; execute/delegate only what serves it; verify; update GitHub facts/queue when state changes; append the Daily Project Journal; close with completed work, blockers, unfinished work, next order and do-not-do list.

## Measurement lane

- Search Console: use Windsor.ai `searchconsole` while connected; official GSC API/export is fallback.
- Keep Google organic separate from social/referral, AI referral and direct/repeat.
- Do not churn Phone public UX from tiny GSC samples.

## External waits

- **TikTok App Review — WAITING.** Do not Recall/edit submitted configuration until Approved or Rejected/Changes requested.
- **Authority batch 2 — WAITING.** Follow the trigger in `docs/AUTHORITY_AND_AI_DISCOVERY.md`; do not create extra outreach volume merely to stay busy.

## Do not do next

- do not equate database rows with SEO pages;
- do not bulk-create country/provider/route SEO pages from coverage data;
- do not invent compatibility percentages, missing costs or a Phone risk score;
- do not let Qwen/Kimi raw output bypass review/admission/publication gates;
- do not migrate to a backend merely for architectural neatness;
- do not reopen generic Reset/Codex tracker work or Relay methodology;
- do not rotate trial accounts or change billing to bypass quotas;
- do not change DNS, AdSense, billing, paid services or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.
