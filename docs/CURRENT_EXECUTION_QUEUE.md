# Current Execution Queue

Last updated: 2026-09-23

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` are canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: it is the atomic execution queue, not a history archive.

## Current decision

Product scope remains frozen to three surfaces:

1. **Phone Radar** — primary;
2. **AI Reset Radar** — secondary;
3. **Relay Exit Risk** — secondary.

Existing small utilities stay maintained/tested but are not a fourth product direction. No second Phone canonical, country/provider doorway pages, bulk generic tools, or broad Astro production migration.

A new mandatory product-value gate now applies before further product investment: `docs/PRODUCT_VALUE_GATE.md`.

## JUST COMPLETED — Product-value process correction

Status: **DOCUMENTED / NO PRODUCTION CHANGE**.

The project previously allowed search demand, ranking opportunity, and technical quality to outweigh a more basic question: whether the site adds anything materially better than the provider's own page/account UI.

Correction:

- search volume is not product value;
- official documentation is evidence for provider-controlled facts, not automatically the user-facing value proposition;
- deterministic, stable, clearly published answers are low-value by default unless the site adds meaningful prediction, aggregation, monitoring, computation, proprietary history, or decision-cost reduction;
- existing pages are not grandfathered in;
- Phone operational research remains community/outcome-led; provider pages remain commercial metadata sources by default.

## Search Console evidence remains valid

Evidence: `docs/GSC_MEASUREMENT_2026-09-22.md`.

- Windsor.ai `searchconsole` is connected to `sc-domain:aineedhelpfromotherai.com`.
- Cursor fresh post-change data reached 290 impressions / 0 clicks through the partial Sep 22 row; 289 / 0 through completed Sep 21.
- The previous 300-impression Cursor CTR checkpoint remains useful measurement evidence, but it is no longer the primary decision gate.
- A page must first prove a defensible non-official user job before CTR/snippet/depth optimization can justify more investment.

## NEXT — Reset product-value audit

Status: **READY**.

Audit the seven currently accepted Reset-family pages:

- `/tools/cursor-usage-reset/`
- `/tools/claude-code-limit-reset/`
- `/tools/github-copilot-credits-reset/`
- `/tools/manus-credits-reset/`
- `/tools/replit-usage-reset/`
- `/tools/bolt-tokens-reset/`
- `/tools/ai-credit-burn-rate-calculator/`

For each page answer:

1. What uncertainty, hidden information, repeated checking, calculation, or decision burden does it remove?
2. What does it provide that the provider's own page/account UI does not?
3. Does independent evidence/history materially improve the answer?
4. Is there a reason to return?
5. If the official page became perfectly clear and fast tomorrow, would this page still have value?

Classify each page as:

- KEEP / DIFFERENTIATE;
- DOWNGRADE;
- REPURPOSE;
- RETIRE-CANDIDATE.

Audit only. Do not delete, redirect, rewrite, or deploy in the same session.

## Cursor Q-002 / Q-015

Status: **MEASUREMENT CONTINUES / PRODUCT-VALUE GATED**.

Finalized data through Sep 19:

- Sep 17: 70 impressions / 0 clicks / avg position 7.29;
- Sep 18: 42 / 0 / 7.07;
- Sep 19: 37 / 0 / 7.22;
- finalized cumulative clean total: **149 impressions / 0 clicks**.

Sep 22 fresh-data recheck:

- Sep 20: 39 impressions / 0 clicks / avg position 7.00;
- Sep 21: 101 / 0 / 6.22;
- Sep 22 partial: 1 / 0 / 5.00;
- fresh-data cumulative total: **290 impressions / 0 clicks**; **289 / 0** through completed Sep 21.

Do not implement Q-015 or rewrite Cursor title/meta merely because the count crosses 300. First complete the Reset product-value audit and decide whether Cursor deserves further investment at all.

## Phone Q-003

Status: **KEEP / CONTINUE COLLECTING EVIDENCE**.

The Phone canonical remains indexed, but the latest exact Search Console page filter returned no rows in the accepted measurement window. Do not add Phone routes or churn positioning from zero exposure.

Phone product-value rule remains unchanged: independent community/user outcomes and hidden operational routes are the core value; provider/operator pages are commercial metadata inputs by default.

## External waits

### TikTok App Review

Status: **SUBMITTED / WAITING FOR REVIEW**.

Do not Recall, edit submitted configuration/demo, remove the Sandbox review bridge, rotate credentials, or change URLs/products/scopes. Trigger only on `Approved` or `Rejected / Changes requested`.

### Q-005 / AIR-4 Authority

Status: **BATCH 2 SENT / WAITING**.

Batch 2 contains exactly Learn Cursor and explainx.ai. Do not add another target or follow up before 2026-09-29 or later. On recheck, read the original Gmail threads and independently verify public links/citations before deciding any follow-up.

### Phone observer runtime

Status: **NOT VERIFIED FROM QWEN**.

The connected qwen environment is not the systemd disposable observer host. Do not infer watcher health from it.

## Do not do next

- do not optimize Cursor merely because it crosses 300 impressions;
- do not add another Reset page before the value audit;
- do not delete or redirect Reset pages during the audit session;
- do not treat official-source completeness as a product advantage;
- do not add another Phone route automatically;
- do not reopen accepted layouts without a separate evidence-backed task;
- do not add a third authority batch-2 target or send an early follow-up;
- do not add country/provider doorway pages or bulk generic utilities;
- do not create a temporary-SMS backend/marketplace;
- do not invent OTP percentages, Phone risk scores, Relay shutdown probabilities or fake confidence values;
- do not migrate the production site to Astro as part of this correction;
- do not rotate trial accounts to bypass plugin quotas;
- do not change DNS, AdSense, billing, paid services, or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.

## Session rule

One bounded task per session. The next session task is the seven-page Reset product-value audit only. The output is a classification and evidence-backed recommendation set, not production changes.
