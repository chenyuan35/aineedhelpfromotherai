# Session Handoff — Phone Radar Pivot — 2026-09-17

Status: CURRENT HANDOFF SNAPSHOT

This handoff exists only to make the next session resume cleanly. GitHub `main` plus verified production remains authoritative. In a new session, still read the mandatory sources in order: `AGENTS.md` → `PROJECT_CONTEXT.md` Current progress checkpoint → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md` → `docs/CURRENT_EXECUTION_QUEUE.md`.

## What changed materially in this session

The Phone product research model was corrected after the AIS Thailand `49B / 365 days` case exposed a structural flaw: the previous workflow gave too much weight to publicly indexed carrier pages and could miss the exact low-cost/support-assisted routes that make the product useful.

The product is now explicitly operated as a **Phone Radar**:

> Continuously discover non-obvious low-cost phone-number routes, verify how real users actually obtain and keep them working, expose true setup difficulty and failure conditions, and let users quickly filter to routes that fit their constraints.

This is not a carrier-plan directory and not a cleaner copy of operator websites.

## Authoritative Phone research rule

Read these before any further Phone route research:

1. `docs/PHONE_RADAR_PRODUCT_DEFINITION.md`
2. `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`
3. `docs/PHONE_HIDDEN_ROUTE_AUDIT_2026-09-17.md`

These documents supersede older wording elsewhere that implies public carrier documentation should be searched/trusted first or that community evidence is only for edge cases.

The current research order is:

1. community / real-user discovery;
2. independent reproduction search;
3. direct carrier support, authenticated carrier app/account, or support-ticket evidence;
4. current failure/refusal/freshness search;
5. public carrier/regulator material only for hard constraints, conflicts and stable mechanics;
6. reproducibility assessment and route record;
7. production decision.

A missing public marketing page is not a rejection criterion. A direct carrier support message shared by a user is first-party support evidence. Multiple independent current reproductions can establish a legitimate hidden route. Do not turn this into KYC/security/geography bypass advice.

## PRs completed in this session

- PR #99 — recorded the AIS Thailand manual demand signal; docs only.
- PR #100 — switched Phone research to hidden-route/community-first evidence handling and started Q-013 audit. Merged to main as `255990e19ff4c559f73a91e5439cea048c48e52d`.
- PR #101 — closed unmerged because it reused the pre-squash #100 branch; superseded by a clean branch. Do not revive it.
- PR #102 — made community/reproduction-first research authoritative for **all** Phone route work, not just hidden-route exceptions. Merged as `217a6d7ffa98e66dfaf08434254ad8604ff335a3`.
- PR #103 — added current Tello and Lebara community-reality findings to the Phone audit. Merged as `870c946bdb77bc1d3fe1f7a3fce9cdb2b7cd26aa`.
- PR #104 — defined the Phone Radar product/fast-filter model. Eval Gate and Vercel passed; merged as `ab2d1838cf465dc7ac61e0909ed3e40a9863026b`.

No production Phone UI/data route was changed by these PRs. They corrected research/product methodology and the audit ledger.

## Current Phone Radar product model

A useful route must be filterable by practical user constraints, not just carrier/plan name.

Required decision dimensions include:

- acquisition cost, first top-up, recurring fee, cheapest reproduced keep-alive action, yearly retention cost and hidden fees;
- passport/KYC/residency/address requirements;
- local presence or first home-network attachment requirement;
- customer-service/manual email/chat/app steps;
- payment restrictions, physical SIM/eSIM requirements and device/eSIM transfer limits;
- mainland-China purchase/activation/SMS/Wi-Fi Calling practicality;
- same-number replacement/transfer, recovery/grace/port-out and recycling risk;
- last successful reproduction, last failure/refusal report and confidence/freshness state.

The intended UX is a fast constraint filter. Example input: mainland China, has passport, eSIM required, SMS/OTP only, willing to email support, wants lowest annual retention cost. Output should be a small set of fitting routes with exact preparation, cost, difficult step, overseas behavior, keep-alive method, recent reproduction date and main failure risk.

Do not reduce setup difficulty to a vague `Easy / Hard` without showing the underlying reasons.

## Q-013 audit findings already established

These are research/audit findings, not all shipped production corrections yet:

- **AIS Thailand:** `49B Validity 365 Days` is a support-confirmed hidden retention-route candidate. The user-provided thread reproduces direct AIS customer-service wording, and independent current reports describe the same support-assisted path. Public AIS 365-day material is corroboration/constraint evidence, not the gate that makes the route real. AIS is not yet in the production catalog.
- **giffgaff UK:** current product treatment materially understates 2026 long-term-overseas enforcement risk. July/August 2026 user reports plus carrier-confirmed coverage show lines associated with extended/permanent use outside the UK were disconnected. Six-month inactivity mechanics alone are not enough to describe long-term overseas safety. Correction needed.
- **Sakura Mobile Japan:** production research marked post-departure roaming SMS as unknown, but current evidence shows Voice+Data SIM/eSIM supports calls and SMS abroad while cellular data is unavailable. This is a missed-positive-evidence defect. Correction needed after exact plan applicability check.
- **Ultra Mobile PayGo:** Wi-Fi Calling abroad was left unknown. Current Ultra material says Wi-Fi Calling is available on all Ultra plans and can be used internationally for calls/texts, but PayGo-specific provisioning still needs route-level confirmation. Verify then correct.
- **H2O PayGo:** deeper research currently supports the existing caution rather than overturning it.
- **Tello:** 2026 community reports indicate increasingly strict first-US-network-attachment/activation enforcement for users trying to start or maintain the route entirely abroad. Some users continue to report Wi-Fi Calling/OTP success after setup. Treat real-world overseas activation/roaming continuity as an enforcement/freshness issue, not merely a published-feature checkbox.
- **Lebara UK:** real-world overseas Wi-Fi Calling/SMS behavior is mixed, including eSIM provisioning and delayed-SMS reports. Do not turn a public `Wi-Fi Calling supported` statement into a blanket stability claim.
- Additional monitored candidates in the audit include RedPocket, ClubSIM, HK-mobi/CSL, O2 Germany prepaid eSIM, Simyo NL prepaid eSIM and One NZ. They are not authorization to bulk-expand the production catalog.

## Production rule during the audit

Keep one Phone canonical: `/tools/phone-number-survival-guide/`.

Do not create provider/country doorway pages or a second Phone canonical. Do not batch-add carriers merely because research finds interesting routes. First fix materially misleading current-route claims; then admit at most one or two genuinely strong hidden routes with recent reproducibility and maintainable evidence.

Production may remain stable while the matrix is incomplete. Exception: if an existing user-facing claim is clearly wrong and delaying correction would materially mislead users, make the smallest correction through the normal fresh-branch → tests → PR → CI/Eval/Vercel → merge → production-verify path.

## Measurement/distribution state that still matters

- Phone public release: 2026-09-16.
- Last checked GSC `settledThrough`: 2026-09-14, so settled Search Console data still did not cover the Phone release.
- Indexing tracker at last check: 18 tracked / 9 indexed / 9 not indexed; Phone canonical was still `URL is unknown to Google`.
- Cursor CTR pilot baseline remains 141 settled impressions / 0 clicks before the answer-first title change; wait for roughly 300–500 additional impressions before title churn.
- Homepage `home_job_select` is live; do not rewrite the homepage before meaningful behavior exists.
- Claude Reset Threads post and Cursor Reset Mastodon post were published as bounded distribution tests; keep referral/social separate from organic. Do not mass cross-post.
- Authority outreach round one was sent Sep 13. Follow-up window is Sep 18–20; when that window is open, read `docs/AUTHORITY_AND_AI_DISCOVERY.md` and the original Gmail threads before acting.
- Tavily AIR-1 remains quota-blocked; AIR-3 metadata write remains blocked; do not bypass or pay without authorization.

## Next-session execution order

After mandatory fact-source reading:

1. **Check trigger gates first.** If GSC `settledThrough >= 2026-09-16`, execute Q-003 Phone post-release measurement immediately and record one KEEP / ADJUST / NARROW decision before any production Phone repositioning.
2. If the Sep 18–20 authority window is open, execute Q-005 from the authority ledger + original Gmail threads; independently verify any claimed links.
3. Continue **Q-013 Phone Radar audit**. Inventory every production route and every material `unknown`/`partial`; compare current product claims against current community reproductions, failure reports, support/app artifacts and hard constraints.
4. Prioritize corrections to current routes before adding new ones. giffgaff is the highest-risk known correction candidate; Sakura and Ultra are next factual gaps; Tello/Lebara need realistic overseas-friction treatment.
5. Build a discrepancy matrix: `current product claim -> community/operational reality -> current support/app evidence -> hard constraint/conflict -> correction/keep/conflict -> last reproduction/failure date`.
6. Only after the matrix is sufficiently complete decide whether AIS or at most one other hidden route belongs in the existing canonical.
7. Keep Reset distribution, Cursor CTR, homepage, Relay and AIR on their existing measurement/blocked gates. Do not manufacture new production work.

## Known documentation precedence note

Some older text in `docs/MASTER_PLAN.md`, `docs/PHONE_NUMBER_LIFECYCLE_PRODUCT_PLAN.md`, `docs/PHONE_DEMAND_WATCH.md` or older PR history may still say variants of `official sources first` or `community reports only for failure modes`.

For Phone route discovery/recommendation research, that wording is superseded by:

- `docs/PHONE_RADAR_PRODUCT_DEFINITION.md`
- `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`
- the current Q-013 section in `docs/CURRENT_EXECUTION_QUEUE.md`

Official/regulator material still controls genuine hard legal/KYC/geography/security constraints and is used to investigate conflicts. It is not the discovery/admission/ranking gate for hidden low-cost routes.

## Safety / infrastructure reminders

- GitHub `main` + verified production = final truth.
- Never reset/discard/overwrite dirty production worktree.
- Use fresh branch/worktree and PR flow.
- Never use hermes.
- `yuan` is a personal workstation, not project infrastructure.
- Trial VPS remains a disposable observer; no new workload or unique durable state.
- No DNS/AdSense/billing/purchase/critical-account changes without explicit approval.
- Never expose secrets.

This handoff should not become a second roadmap. Once the next session updates the canonical checkpoint/queue with newer facts, use those newer sources instead.