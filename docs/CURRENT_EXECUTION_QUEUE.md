# Current Execution Queue

Last updated: 2026-09-23

`PROJECT_CONTEXT.md` and `docs/MASTER_PLAN.md` are canonical for current facts/phase. GitHub `main` + verified production wins on conflict. This file is intentionally short: it is the atomic execution queue, not a history archive.

## Current decision

1. **Phone Radar — ACTIVE PRIMARY GROWTH PRODUCT / UK PILOT SHIPPED / MEASUREMENT NEXT.**
2. **AI Reset Radar — FROZEN / PRIMARY SURFACES REMOVED / DIRECT URLS PRESERVED.**
3. **Relay Exit Risk — DATA-ACCRUAL EXPERIMENT.**

Mandatory gates before any product build/expansion/optimization remain official-source substitutability, independent-competitor substitutability, real user/repeat value and a concrete project advantage.

## JUST COMPLETED — UK Phone carrier-directory pilot

Status: **SHIPPED / PRODUCTION VERIFIED**.

PR #203 shipped the bounded UK carrier-directory implementation on the existing Phone canonical. Squash merge: `084de00f94257dc50305b1d456e7a56e877a92ce`.

Validation recorded:

- changed surface remained limited to the existing Phone canonical plus supporting evidence/docs/tests;
- PR final diff was reduced to 6 intended files after generated build artifacts were removed;
- Eval Gate #693: **PASS**;
- Vercel Preview / production commit status: **SUCCESS**;
- forced live production fetch: **HTTP 200**;
- live Long-term SMS/OTP shows the grouped UK matrix/directory;
- visible UK network/brand coverage includes Vodafone UK, VOXI, Lebara UK, O2 UK and Giffgaff;
- matrix exposes start cost, keep/year, app/service evidence, loss/closure history and refund/recovery state;
- detailed in-page guide content is present;
- Data SIM/eSIM and Temporary SMS family choices remain present;
- the current app evidence packet is below the `n >= 5` rate gate, so no fabricated success percentage is rendered.

Source packet: `docs/PHONE_UK_PILOT_SOURCE_PACKET_2026-09-23.md`.
Normalized data: `frontend/tools/phone-number-lifecycle-mvp/uk-directory-pilot.json`.
Accepted product contract: `docs/PHONE_RADAR_DIRECTORY_MATRIX_CONTRACT_2026-09-23.md`.

## NEXT — measurement hold, then re-measure Phone

Status: **WAIT FOR MEANINGFUL POST-DEPLOY DATA / NO IMMEDIATE PRODUCTION CHANGE**.

Do not edit Phone again merely because the UK pilot just shipped.

Next decision sequence:

1. allow Search Console + meaningful interaction evidence to accrue;
2. re-measure the existing Phone canonical;
3. keep Google organic separate from referral/social/direct and AI referral;
4. if impressions appear without clicks, diagnose query/SERP fit before changing the product;
5. if clicks appear but use is weak, improve the existing canonical from interaction evidence;
6. expand to another market/network only when evidence quality and product-value gates pass.

Do not interpret the first hours after deployment as meaningful search evidence.

## Relay Exit Risk

Status: **PRESERVE / ACCUMULATE DATA**.

Continue legitimate historical snapshots/lifecycle accumulation. Do not add search-led features until direct demand or meaningful usage appears.

## External waits

### TikTok App Review

Status: **SUBMITTED / WAITING FOR REVIEW**.

Do not Recall, edit submitted configuration/demo, remove the Sandbox review bridge, rotate credentials, or change URLs/products/scopes. Trigger only on `Approved` or `Rejected / Changes requested`.

### Q-005 / AIR-4 Authority

Status: **BATCH 2 SENT / WAITING**.

Batch 2 contains exactly Learn Cursor and explainx.ai. Do not add another target or follow up before 2026-09-29 or later. On recheck, read the original Gmail threads and independently verify public links/citations before deciding any follow-up.

## Do not do next

- do not immediately add another Phone market, provider family or ranking model merely because the UK pilot shipped;
- do not bulk-add global Phone rows with weak or copied evidence merely to make the directory look large;
- do not make operator/provider documentation the operational truth;
- do not invent ChatGPT/Telegram/WhatsApp success percentages from a few anecdotes;
- do not invent a numeric Phone risk index;
- do not hide denominator/date behind a compatibility percentage;
- do not treat all brands on one host network as having the same activation/retention/OTP behavior;
- do not create Phone country/provider doorway pages;
- do not create a temporary-SMS backend/marketplace;
- do not optimize Cursor merely because impressions increase;
- do not create a generic Codex reset tracker;
- do not add another Reset page;
- do not reopen Relay methodology or convert it into a shutdown probability;
- do not migrate production to Astro as part of Phone work;
- do not rotate trial accounts to bypass plugin quotas;
- do not change DNS, AdSense, billing, paid services, or critical account settings without explicit authorization;
- never use `hermes`; `yuan` is not project infrastructure.

## Session rule

This implementation session is complete when the shipped UK pilot state is merged into the canonical fact sources. A new session should begin from GitHub `main` and treat post-deploy measurement—not another speculative Phone build—as the next decision gate.
