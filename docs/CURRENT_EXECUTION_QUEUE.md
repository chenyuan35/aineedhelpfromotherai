# Current Execution Queue

Last updated: 2026-09-23

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` are canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: it is the atomic execution queue, not a history archive.

## Current decision

Product investment is no longer balanced equally across the three current surfaces.

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT.**
2. **AI Reset Radar — FROZEN / PRIMARY SURFACES REMOVED / DIRECT URLS PRESERVED.**
3. **Relay Exit Risk — DATA-ACCRUAL EXPERIMENT.**

Existing generic utilities remain maintenance-only.

Mandatory gates before any product build/expansion/optimization:

- official-source substitutability;
- independent-competitor substitutability;
- real user problem / repeat value;
- evidence that the project can provide a specific advantage.

See `docs/PRODUCT_VALUE_GATE.md` and `docs/PRODUCT_DIRECTION_RESET_2026-09-23.md`.

## JUST COMPLETED — Reset primary-surface removal

Status: **COMPLETE / PRODUCTION VERIFIED**.

PR #195 removed Reset from the site's primary product/discovery surfaces without deleting the old Reset URLs:

- homepage Reset navigation/CTA/job-map/search/featured section removed;
- `/tools/` Reset and AI-quota promotional sections removed;
- public `ai.txt` / `llms.txt` no longer promote Reset as preferred entry points;
- Reset tracker URLs removed from sitemap promotion;
- old direct Reset URLs remain reachable.

Verification:

- first Preview check found a real legacy Tools-section removal defect; it was repaired before merge;
- Eval Gate #672 passed;
- final Vercel Preview passed content + interactive layout QA;
- PR #195 squash-merged as `375b9c6044e93fe318378ada9b56ea3bc3e0a545`;
- Vercel production deployment succeeded;
- apex `/`, `/tools/`, Phone, Relay and direct Cursor Reset were independently verified.

Evidence: `docs/RESET_PRIMARY_SURFACE_REMOVAL_2026-09-23.md`.

## COMPLETED — Seven-page Reset product-value audit

No URL was deleted or redirected.

- Cursor Usage Reset — **DOWNGRADE**.
- Claude Code Limit Reset — **REPURPOSE**.
- GitHub Copilot Credits Reset — **KEEP / DIFFERENTIATE**.
- Manus Credits Reset — **DOWNGRADE**.
- Replit Usage Reset — **DOWNGRADE**.
- Bolt Tokens Reset — **REPURPOSE**.
- AI Credit Burn Rate Calculator — **KEEP / DIFFERENTIATE**.

Reset-family rule from now on:

- no new generic reset pages;
- no Cursor-first optimization;
- no Q-015 implementation;
- no generic Codex reset tracker;
- a future Codex idea must prove a gap beyond existing source/history/probability/countdown/quota trackers.

## NEXT — Phone canonical contract audit

Status: **READY / HIGHEST PRIORITY / AUDIT ONLY**.

One bounded task on the existing Phone product and Phone-facing homepage framing. Do not implement in the audit session.

Accepted product contract to audit against:

1. three fixed families only: **Long-term SMS/OTP**, **Data SIM/eSIM**, **Temporary SMS**;
2. **visual decision dashboard first**, **Full guide on demand**;
3. community/forum/current-user outcomes drive operational reality;
4. provider/operator pages are commercial-metadata inputs only: price, package, promotion, stock, purchase link and advertised fee;
5. provider pages do not certify OTP success, overseas activation, recovery, long-term trust or other real-world operating outcomes;
6. user sees a small actionable shortlist, not research methodology or a provider-documentation manual.

Two concrete defects are already reproduced and must be included in the audit:

- production homepage still says `Official rules first` and describes Phone as separating `documented carrier rules from unknowns`; this contradicts the accepted community/outcome-led source-role contract;
- production Phone canonical still contains historical related-tool linkage to Claude Reset after Reset was removed from primary product surfaces.

Audit the current canonical for:

- title/meta/H1/first-screen promise;
- three-family clarity and first useful route visibility;
- real carrier number vs data-only/VoIP state;
- recent SMS/OTP outcome and app/service caveats;
- remote activation practicality and activation-country constraints;
- KYC requirements;
- roaming/SMS behavior;
- keep-alive/retention cost and current reproduced method;
- current price/value and purchase path;
- freshness/current community outcome signal;
- frontstage fields that create reading/decision cost and should remain backstage;
- stale Reset references in Phone-facing navigation/related links.

Definition of done:

- concrete KEEP/CHANGE decision for each audited Phone surface/field;
- one bounded defect/change queue ordered by user impact;
- explicit list of what must be removed because it reflects old official-first thinking;
- no production deployment, no new route, no country/provider doorway page and no unrelated redesign in the audit session.

## Search Console

Status: **MEASURE, DO NOT LET GSC CHOOSE THE PRODUCT**.

Search Console remains an important distribution signal after a product passes the value and competition gates. It no longer decides product priority by itself.

Cursor's old 300-impression checkpoint is retired as a trigger for investment. Cursor data may continue to be observed, but no title/meta/depth work follows automatically.

Phone is indexed but had no exact-page rows in the latest accepted measurement window. This does not block the Phone contract audit because the task is correcting known product/source-role contradictions and validating an already accepted product model, not inventing a new route from weak GSC data.

## Relay Exit Risk

Status: **PRESERVE / ACCUMULATE DATA**.

Keep current methodology and continue legitimate historical snapshots/lifecycle accumulation. Do not add search-led features until direct demand or meaningful product usage appears.

## External waits

### TikTok App Review

Status: **SUBMITTED / WAITING FOR REVIEW**.

Do not Recall, edit submitted configuration/demo, remove the Sandbox review bridge, rotate credentials, or change URLs/products/scopes. Trigger only on `Approved` or `Rejected / Changes requested`.

### Q-005 / AIR-4 Authority

Status: **BATCH 2 SENT / WAITING**.

Batch 2 contains exactly Learn Cursor and explainx.ai. Do not add another target or follow up before 2026-09-29 or later. On recheck, read the original Gmail threads and independently verify public links/citations before deciding any follow-up.

## Do not do next

- do not optimize Cursor merely because impressions increase;
- do not create a generic Codex reset tracker;
- do not add another Reset page;
- do not delete/redirect/noindex old Reset URLs without a separate evidence-backed retirement decision;
- do not treat official-source completeness as a product advantage;
- do not clone a mature independent competitor without a concrete differentiated job;
- do not add another Phone route before the Phone contract audit;
- do not create Phone country/provider doorway pages;
- do not create a temporary-SMS backend/marketplace;
- do not invent OTP success percentages or fake confidence values;
- do not let provider pages overrule current operational community evidence merely because they are official;
- do not reopen Relay methodology or convert it into a shutdown probability;
- do not migrate the production site to Astro as part of this direction reset;
- do not rotate trial accounts to bypass plugin quotas;
- do not change DNS, AdSense, billing, paid services, or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.

## Session rule

One bounded task per session. The next session task is the Phone canonical contract audit only. It must end with a concrete defect/change queue and must not silently expand into implementation or route research.
