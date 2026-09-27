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

## JUST COMPLETED — core progress / publication audit

The Sep 27–28 audit reconciled GitHub rules against verified production and corrected one interpretation:

- production currently exposes a large global Phone dataset and many public URL families;
- **the large database is not itself the defect** — broad backstage coverage was intentionally delegated to Qwen/Kimi;
- the actual issue is that database admission, interactive comparison visibility and SEO/indexability are not yet enforced as separate release states;
- representative observation/unknown routes are currently indexable even when retention cost/rule/app evidence is incomplete;
- current fresh Search Console Phone-path exposure still appears only on the canonical Phone URL in the sampled window;
- GA4 instrumentation is live, Windsor authorization exists, but the current GA4 read path returns zero rows and remains a measurement-path issue rather than proof of zero traffic.

PR #258 is Draft. Its Tello / ClubSIM / Hotlink backstage reviewed-packet work and Node-24 CI correction are useful, but the PR must not implicitly redefine all global database rows as valid public/indexable product surfaces.

PR #259 is a Draft audit record. It must be reconciled with the clarified database-vs-public architecture before merge.

## NEXT SESSION — Phone publication-state reconciliation

**Session task:** implement and verify the separation between normalized database coverage, interactive comparison visibility and SEO/indexability.

### Scope

1. inspect the current Phone data/build path and identify the smallest durable place for publication state;
2. define/normalize the release states: `research-only` → `database-only` → `comparison-visible` → `detail-eligible` → `indexable`;
3. make the frontend/search layer able to use broad database coverage without requiring every route to be emitted as initial HTML or a standalone indexable URL;
4. make sitemap/route generation honor the explicit `indexable` gate;
5. preserve useful global search/filter data and do **not** shrink the database merely to reduce URL count;
6. add tests that fail when an observation/unknown route becomes indexable without passing the publication gate;
7. keep the change bounded and reversible, then follow PR → CI/Eval/Preview → production verification.

### Definition of done

- broad database coverage remains intact;
- comparison/search can still retrieve appropriate routes;
- standalone route/market/keep-alive sitemap publication is controlled by explicit publication state rather than row existence;
- at least representative low-evidence routes no longer become indexable by default;
- evidence-qualified published routes still work;
- automated tests protect the layer boundary;
- canonical GitHub facts and the Daily Project Journal are updated with the verified result.

### Stop conditions

Stop and split the task if the current build architecture requires a broad frontend rewrite, backend service introduction, irreversible URL deletion/redirect policy, or privacy/infrastructure change. Do not introduce a server/API merely because the database is large; prefer the simplest static/generated/queryable design until performance proves otherwise.

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
