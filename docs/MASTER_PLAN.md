# Master Plan — Traffic Utility Site

Last updated: 2026-09-13

This is the project-wide progress board. `PROJECT_CONTEXT.md` answers "what is true now"; this file answers "where are we in the whole plan and what comes next"; `docs/OPERATING_WORKFLOW.md` defines how each task is executed.

## North-star goal

Build `aineedhelpfromotherai.com` into a low-cost utility site that earns small, stable AdSense revenue from organic traffic. First practical target: about RMB 100/month, then scale only what proves demand.

## Phase board

| Phase | Goal | Status | Evidence / current state | Exit gate |
|---|---|---|---|---|
| P0 Foundation | Stable static site, safe deploy flow, durable handoff | DONE | GitHub→Vercel flow, CI/Eval Gate, `AGENTS.md`, `PROJECT_CONTEXT.md`, workflow docs | Completed |
| P1 Initial tool inventory | Publish a useful, low-cost starter portfolio | DONE | 13 live tool pages across calculators, image tools and AI quota/reset tools | Completed |
| P2 Discovery & indexing | Make Google discover and index the current utility cohort | IN PROGRESS | GSC connected; 15 priority URLs tracked; homepage indexed; 14 checked tool URLs currently unknown to Google. URL normalization is fixed. GA4 tracking is live and the GA4 property is authorized/linked in GSC Wizard. | Tool cohort starts being crawled/indexed and receives its own impressions |
| P3 First search signals | Identify which existing pages/queries Google is testing | BLOCKED BY P2 | Current GSC impressions mostly belong to historical AI-debugging pages | At least several tool-page query/impression signals exist |
| P4 Winner optimization | Improve pages already earning impressions | QUEUED | Use GSC query/page/CTR/position data, titles, copy, internal links and exact intent | Clear improvement or a decision to stop investing |
| P5 Controlled expansion | Add 1–2 evidence-backed tools per round | QUEUED | Candidate feed comes from VPS radar + GSC + Ubersuggest + official docs/community evidence | Each round ships, indexes and is measured before the next broad round |
| P6 Distribution & authority | Earn discovery, mentions and relevant links outside Google | QUEUED | Relevant communities/directories/embeds/mentions, no spam | Repeatable referral/link sources appear |
| P7 Monetization optimization | Turn useful traffic into stable AdSense revenue | QUEUED | AdSense integration exists; approval/serving must be verified separately | First RMB 100/month, then optimize RPM without harming UX |

## Current sprint — Indexing before expansion

1. DONE — Fix URL consistency: Vercel now serves trailing-slash URLs directly, matching generated canonicals and sitemap URLs. PR #19 shipped and production re-audit found no redirect/canonical issues on checked pages.
2. DONE — Add GA4 tracking: GA4 measurement ID `G-FYKKNKRE58` is injected once into every production HTML page by PR #21; production homepage and Cursor tool page were verified live.
3. DONE — Connect GA4 to GSC Wizard: Analytics consent is authorized, property `properties/553896884` (`aineedhelpfromotherai`) is linked to `sc-domain:aineedhelpfromotherai.com`, and a Sep 13 analytics rollout annotation is recorded. Current GA4 reports are still zero because the property/tag were created today and settled reporting data has not arrived yet.
4. ACTIVE — Keep the 15-URL GSC indexing tracker running. Current state is 1 indexed homepage and 14 tool URLs `URL is unknown to Google`; do not spam repeated recrawl requests.
5. MONITOR — Live `https://aineedhelpfromotherai.com/sitemap.xml` contains 19 URLs. Search Console's older sitemap record still shows 40 submitted, 0 indexed and 17 warnings from its previous crawl, so wait for Google to re-download the corrected sitemap before treating those counts as current.
6. WAITING FOR DATA — Once GA4 produces settled sessions/page views, use referral/direct/engagement data to complement Search Console rather than reading GA4 zeroes as a traffic verdict.
7. WAITING FOR SIGNAL — Once tool-page impressions appear, optimize the strongest existing page before creating a near-duplicate page.
8. WAITING FOR SIGNAL — Select the next 1–2 tools only from combined evidence: GSC signal + radar/autocomplete + official rules/community pain + keyword metrics when available.
9. LIGHT DISTRIBUTION — Once useful tool URLs are indexed, submit/share selectively in relevant directories and niche communities to earn discovery and natural links; avoid bulk spam submissions.

## Measurement cadence

- Daily: VPS keyword radar runs automatically; no manual full scan required.
- Twice weekly while indexing is immature: inspect GSC indexing tracker, sitemap state and new `/tools/` impressions.
- Weekly: update this phase board/current sprint only if status or priority changed.
- After every production release: update `PROJECT_CONTEXT.md` checkpoint and this file if a phase/task materially moved.
- Monthly after meaningful traffic: review clicks, impressions, indexed URLs, top pages/queries, referral traffic, repeat usage where measurable, and AdSense revenue/RPM.

## Decision rules

- Do not publish many pages just because autocomplete returns many variants.
- Improve an existing page when multiple query variants describe the same user job.
- Create a new page only when the user job and tool logic are genuinely distinct.
- Prefer tools that work in-browser, need no account, answer the intent immediately, and have near-zero marginal cost.
- Search Console evidence outranks speculative keyword ideas once the site has enough impressions.
- Google/official provider documentation outranks community claims for technical/indexing/product-limit facts.
- Missing paid keyword metrics means "unknown", never a fabricated estimate.

## Source-of-truth map

| Need | Source |
|---|---|
| Current factual state | `PROJECT_CONTEXT.md` checkpoint |
| Whole-project stage / task priority | `docs/MASTER_PLAN.md` |
| Execution procedure | `docs/OPERATING_WORKFLOW.md` |
| Code/deployment truth | GitHub `main` + verified production |
| New keyword candidates | VPS `/var/lib/aineedhelp-radar/latest.md` |
| Google indexing/search performance | GSC Wizard / Google Search Console |
| Site traffic/engagement | GA4 via GSC Wizard; connected as of 2026-09-13, with useful reporting beginning after data settles |
| Keyword metrics when available | Ubersuggest |
| Changing provider rules | Official provider documentation |
| User pain / repeat questions | Public discussions such as Reddit/HN/forums |

Historical AI-agent/MCP strategy documents are not current planning authority. Preserve them only as history; they must not override the four current sources above.
