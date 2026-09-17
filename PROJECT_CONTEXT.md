# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-17

This file is the compact current-facts source for the project. Keep volatile execution detail in the task-specific docs and PRs instead of letting this file become a historical log. If anything here conflicts with GitHub `main` plus verified production, GitHub `main` and verified production win.

## Current progress checkpoint

Read this section first in a new session. Do not rescan the whole repository, VPS fleet, deployment history, or old chats unless this checkpoint is stale, contradictory, or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | `https://aineedhelpfromotherai.com/` is live. Vercel deploys the static frontend from GitHub `main`; the historical Express/PostgreSQL backend remains behind the API path because Relay Exit Risk still depends on it. The current user-visible homepage positioning comes from PR #85 (`98b3573b`); PR #87 adds measurement only. | Keep production stable. Use fresh branches/PRs for changes; never reset or overwrite the dirty production worktree. |
| Product scope | Scope is frozen to three surfaces for the same AI-power-user audience: **Phone Number Lifecycle** is primary; **AI Reset Radar / reset tracking** and **Relay Exit Risk** are secondary. Legacy calculators/image tools are maintenance-only. | No fourth product surface, broad utility expansion, provider/country doorway pages, or second Phone canonical without an explicit evidence-backed strategy change. |
| Homepage positioning | PR #84 created one shared continuity story; PR #85 sharpened the first viewport to the direct hook **`AI stopped? Start here.`** and the question **`What stopped?`**. The memorable map is **Reset · Access · Reliability**: usage limit (`When can I use AI again?`), account access (`Will I still control the number?`), and relay dependency (`Can I depend on this relay?`). Phone remains the featured/primary product section; Reset gets the first immediate-action CTA because it already has live search intent. Eval Gate/Vercel passed; final apex desktop/mobile live fetches returned HTTP 200 with the new H1/title/meta. | Do not churn homepage copy again before real first-screen behavior exists unless a verified usability defect appears. Measure which job visitors choose once GA4 has real sessions/tool opens. |
| Phone Number Lifecycle | **LIVE / PRIMARY.** PR #75 publicly released the audited Phone Number Survival Guide at `https://aineedhelpfromotherai.com/tools/phone-number-survival-guide/`; the Phone public-release commit is `106f86c4`. It covers purchase, activation, verification, travel, keep-alive/expiry, recovery, explicit unknowns, first-party evidence and browser calendar reminders. The old internal `phone-number-lifecycle-mvp` URL remains a real 404. | Keep the current route/provider set stable until search/behavior evidence justifies change. Never apply a universal 90-day keep-alive rule. |
| Phone verification-continuity hypothesis | PR #81 completed a bounded four-service evidence matrix for Codex, ChatGPT, OpenAI API and Claude plus English/Chinese demand and initial competitor/SERP review. Verdict remains **provisional NARROW**: verification continuity may become a compact decision layer inside the existing Phone canonical, not a new product or URL family. | Wait for real Phone post-release data before repositioning production Phone UX. Durable detail: `docs/PHONE_VERIFICATION_CONTINUITY_VALIDATION.md` and Issue #78. |
| Cursor CTR pilot | Cursor remains the first authority/depth pilot. PR #82 changed only the build-time SEO title/meta to answer the observed reset query directly; production title is `When Does Cursor Usage Reset? Monthly Reset Calculator`. Pre-change Sep 13–14 baseline was 141 settled impressions and 0 clicks. | Wait for a materially larger post-change sample, roughly 300–500 additional impressions, before another title change unless an obvious defect appears. |
| Search Console | GSC Wizard is connected to `sc-domain:aineedhelpfromotherai.com`. Latest Sep 17 check reports `settledThrough=2026-09-14`, so settled data still does **not** cover the Sep 16 public Phone release. | When settled data covers Sep 16+, run the first Phone post-release measurement and make exactly one **KEEP / ADJUST / NARROW** decision before any Phone production change. |
| Indexing | GSC Wizard Index Tracker currently has **18 tracked / 9 indexed / 9 not indexed / 0 pending / 0 errors / 0 warnings**. Phone is currently reported as `URL is unknown to Google` with no recorded crawl. Production sitemap contains 22 URLs and exactly one Phone canonical. | Let the normal tracker cadence work. Do not repeatedly resubmit URLs; new indexing is a measurement trigger, not permission to add pages. |
| Analytics | GA4 measurement ID `G-FYKKNKRE58` is live site-wide and linked through GSC Wizard. PR #87 added a privacy-safe `home_job_select` event for first-screen **reset / access / reliability** choices with only job, placement and source path; production source verification confirmed the event tag is live. Early zero/near-zero data is not a negative product verdict. | Once real sessions exist, use `home_job_select` plus landing/tool-open behavior to compare first-screen jobs. Keep organic, referral, AI referral and direct/repeat behavior separate. |
| Relay Exit Risk | Relay Exit Risk v2 remains live as a secondary product. It uses a 0–100 **Exit Risk Index** from public measurements + stored lifecycle history + time-bounded community forecast. It is not a shutdown/fraud/scam probability. Same-day snapshot handling and current-vs-audit history were corrected in PR #68–#69. | Accumulate source/lifecycle/community history. Lower confidence for missing evidence; never turn the index into an unsupported probability or broad reputation directory. |
| Relay history observer | The low-resource `codex` VPS stores independent Relay lifecycle history in SQLite and sends a verified bounded backup to Qwen through the existing Taildrop workflow. | Let history accumulate; keep provider/source failures separate from actual relay risk changes. Do not make this host a unique dependency. |
| External/phone observers | Hatchable provides an infrastructure-independent hourly external health observer. A separate one-month low-resource trial observer runs bounded edge/source/Phone-source/Phone-demand timers. The trial host is intentionally disposable and resource-tight. | Keep workloads frozen. Use observer output as evidence/review triggers, never as automatic production edits. Retire or deliberately migrate trial duties before expiry. |
| Phone source/demand radar | Official-source watcher and public-feed community watcher are active on the disposable observer. The daily Phone Lifecycle Radar tracks buying, activation, verification, eSIM/physical SIM, roaming, KYC, retention/expiry and top-up language. | Read `/var/lib/aineedhelp-radar/latest.md` only when selecting Phone priorities. Forum/community signals are discovery evidence, not authoritative carrier rules. |
| Authority/distribution | First outreach round was sent Sep 13 to three relevant targets. Follow-up review is due approximately Sep 18–20, not earlier. Bing/IndexNow and public GitHub discovery paths remain active. | Read `docs/AUTHORITY_AND_AI_DISCOVERY.md` before follow-up. Verify any claimed link/citation independently and do not increase volume merely because round one is quiet. |
| AI retrieval | Known-URL extraction works in the existing Exa baseline, but discovery/authority is still weak. Tavily AIR-1 remains blocked by provider quota; AIR-3 remains blocked on GitHub metadata write access; AIR-4 is the active authority path. | Follow `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` in order, then `docs/AI_RETRIEVAL_BENCHMARK.md`. Do not pay to bypass blockers or invent provider results. |
| Technical quality | Existing structural/mobile/404 audits passed. Unknown URLs return real 404/noindex pages; canonical/trailing-slash/API routing is established. No current verified technical defect justifies another broad cleanup pass. | Optimize only from a measured defect, search signal or behavior signal. Preserve page speed and browser-first execution. |

## Immediate priority

Keep the new **`AI stopped? Start here.`** homepage stable while the already-defined measurement triggers mature. Phone Number Lifecycle remains the primary product; Reset and Relay remain supporting surfaces.

The ordered next actions are maintained in `docs/CURRENT_EXECUTION_QUEUE.md`. As of this checkpoint, the important triggers are:

1. **Phone:** wait for GSC `settledThrough >= 2026-09-16`, then inspect indexing, queries, clicks/CTR, GA4 landing behavior and Phone events before a KEEP/ADJUST/NARROW decision.
2. **Cursor:** keep measuring the answer-first title until a materially larger post-change impression sample exists.
3. **Homepage:** use the live `home_job_select` event once real sessions exist; do not change the hero/CTA before behavior evidence.
4. **Authority:** review the Sep 13 outreach threads only when the Sep 18–20 follow-up window arrives.
5. **Observers / Relay / AIR:** continue event-driven monitoring and respect existing blockers; do not manufacture production work while data is legitimately waiting.

## Mission

Turn `aineedhelpfromotherai.com` into a low-cost, high-traffic utility site that can earn small, stable AdSense revenue. Primary success signals are organic impressions, indexed pages, CTR, useful/repeat visits, page speed, measurable search/AI referrals and eventually ad revenue. Do not optimize for SaaS complexity.

## Product rules

- Prefer real search demand, clear tool intent, repeat value, speed, low marginal cost and maintainability.
- Prefer browser-side tools; add backend/shared state only when the user job genuinely requires it.
- One clear user task per page. Avoid thin, near-duplicate or keyword-variant doorway pages.
- Improve an existing URL before adding a similar one.
- Use official/current sources for changing product rules; label unknowns instead of inventing certainty.
- Separate discovery/community evidence from authoritative facts.
- For AI discoverability, improve crawlability, answer structure, semantic relevance, freshness, authority and primary-source evidence. No cloaking, hidden provider-specific text, fake citations/freshness or synthetic backlinks.

## Current architecture and safety

- Canonical public host: `https://aineedhelpfromotherai.com/`; `www` redirects to apex.
- Static frontend: Vercel from GitHub `chenyuan35/aineedhelpfromotherai` `main`.
- `/api/:path*` proxies to the historical Express/PostgreSQL runtime used by Relay Exit Risk.
- Cloudflare provides DNS. Do not change DNS, AdSense, billing or critical account settings without explicit user authorization.
- Never print or commit credentials.
- Never reset/discard/overwrite the dirty production worktree. Use a fresh branch/worktree → tests → PR → CI/Eval/Vercel Preview → merge → production verification.
- `hermes` belongs to another project and must never be used for this website.
- `yuan` is the user's personal computer, not website infrastructure; do not run persistent site services, monitors, crawlers, deployments, backups or project state there.
- Trial/temporary VPS machines are disposable observers unless explicitly promoted after evaluation; never put unique production state or irreplaceable data on them.

## Durable fact sources

Use the specialized files instead of expanding this checkpoint with operational history:

- `docs/MASTER_PLAN.md` — phases, sprint priorities and exit gates.
- `docs/OPERATING_WORKFLOW.md` — fixed execution workflow.
- `docs/CURRENT_EXECUTION_QUEUE.md` — atomic next actions, blockers and triggers.
- `docs/PHONE_NUMBER_LIFECYCLE_PRODUCT_PLAN.md` — Phone lifecycle scope.
- `docs/PHONE_VERIFICATION_CONTINUITY_VALIDATION.md` — verification-continuity evidence matrix.
- `docs/AUTHORITY_AND_AI_DISCOVERY.md` — outreach/referral/authority/AI-citation ledger.
- `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` then `docs/AI_RETRIEVAL_BENCHMARK.md` — ordered AI retrieval work and provider results.
- `docs/RELAY_RISK_METHODOLOGY.md` — fixed Relay Exit Risk definition/methodology.

## Handoff rule

At the beginning of a new working session, read GitHub `main` in this order: `AGENTS.md` → this file's **Current progress checkpoint** → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md`. Then read only the task-specific document required by the work.

When a material milestone finishes, refresh this checkpoint and the execution queue immediately. Update `docs/MASTER_PLAN.md` only when a phase/sprint/exit-gate/priority changes. Update authority and AIR ledgers immediately after their respective external actions/tests.

GitHub `main` plus verified live production is the final source of truth. Do not use chat memory to override it.
