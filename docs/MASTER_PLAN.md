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
| P2 Discovery & indexing | Make Google discover and index the current utility cohort | IN PROGRESS | GSC connected; 15 priority URLs tracked; tracker now 4 indexed / 11 not indexed after Sep 13 requests. `/tools/`, Cursor reset and image compressor were crawled successfully and indexed alongside the homepage. URL normalization is fixed. | Tool cohort starts receiving its own settled impressions, with indexing continuing beyond the first priority pages |
| P3 First search signals | Identify which existing pages/queries Google is testing | BLOCKED BY SETTLED DATA | New utility pages are now entering the index, but Search Console performance data still predates the Sep 13 crawl/index event | At least several tool-page query/impression signals exist |
| P4 Winner optimization | Improve pages already earning impressions | PILOT STARTED EARLY | Cursor reset is being used as the first depth/authority pilot before settled impressions arrive because it is already indexed and has strong radar intent. PR #30 adds current official-source depth and shareability without creating a new URL. Data-driven winner optimization still waits for settled GSC signals. | Clear improvement or a decision to stop investing |
| P5 Controlled expansion | Add 1–2 evidence-backed tools per round | QUEUED | Candidate feed comes from VPS radar + GSC + Ubersuggest + official docs/community evidence | Each round ships, indexes and is measured before the next broad round |
| P6 Distribution & authority | Earn discovery, mentions and relevant links outside Google | STARTED LIGHTLY | PR #27 aligned the public GitHub README with the utility site and added direct live-tool links. Existing IndexNow submission is verified working. Bing Webmaster API is connected and crawl/search data is readable in GSC Wizard; no current Bing crawl-issue URLs were reported. | Repeatable referral/link sources appear |
| P7 Monetization optimization | Turn useful traffic into stable AdSense revenue | QUEUED | AdSense integration exists; approval/serving must be verified separately | First RMB 100/month, then optimize RPM without harming UX |

## Current sprint — Indexing before expansion

1. DONE — Fix URL consistency: Vercel now serves trailing-slash URLs directly, matching generated canonicals and sitemap URLs. PR #19 shipped and production re-audit found no redirect/canonical issues on checked pages.
2. DONE — Add GA4 tracking: GA4 measurement ID `G-FYKKNKRE58` is injected once into every production HTML page by PR #21; production homepage and Cursor tool page were verified live.
3. DONE — Connect GA4 to GSC Wizard: Analytics consent is authorized, property `properties/553896884` (`aineedhelpfromotherai`) is linked to `sc-domain:aineedhelpfromotherai.com`, and a Sep 13 analytics rollout annotation is recorded. Current GA4 reports are still immature because the property/tag were created today and settled reporting data has not arrived yet.
4. ACTIVE — Keep the 15-URL GSC indexing tracker running. Current state is 4 indexed and 11 not indexed. The homepage, `/tools/`, Cursor reset and image compressor are indexed; do not spam repeated recrawl requests for the remaining 11.
5. MONITOR — Live `https://aineedhelpfromotherai.com/sitemap.xml` contains 19 URLs. Settled sitemap/search-performance data still predates the Sep 13 crawl/index event, so use direct URL Inspection as the current indexing truth until reporting catches up.
6. WAITING FOR DATA — Once GA4 produces settled sessions/page views, use referral/direct/engagement data to complement Search Console rather than reading early zeroes as a traffic verdict.
7. WAITING FOR SIGNAL — Once tool-page impressions appear, use actual query/page data to decide which existing page becomes the next optimization target.
8. WAITING FOR SIGNAL — Select the next 1–2 tools only from combined evidence: GSC signal + radar/autocomplete + official rules/community pain + keyword metrics when available.
9. ACTIVE LIGHT DISTRIBUTION — PR #27 provides an accurate public GitHub discovery path and the existing IndexNow workflow is verified working. Add only relevant directories/communities later; avoid bulk spam submissions.
10. DONE — Bing Webmaster API access is connected in GSC Wizard. Bing recognizes the site, exposes crawl/index data, reports no current crawl-issue URLs, and shows about 30 URLs historically in its index as of Sep 12. No sitemap/feed is currently listed there and Sep 1–11 search traffic is still 0 clicks / 0 impressions.
11. DONE — The small Google request-indexing set was submitted: `/tools/`, `/tools/cursor-usage-reset/`, and `/tools/image-compressor/`. All three now return `PASS / Submitted and indexed`, crawled successfully by mobile Googlebot on Sep 13.
12. ACTIVE — Breakthrough-page pilot: deepen the already-indexed Cursor reset page instead of adding another tool. PR #30 adds the immediate reset answer, current Cursor usage/billing/model-pool guidance, exact reset-date instructions, plan/team distinctions, additional FAQs, and a copyable reset summary while preserving the canonical URL.
13. NEXT — Measure Cursor query coverage, impressions, CTR and engagement after data settles. If this richer page earns stronger signals, apply the same depth pattern selectively to one other existing indexed page rather than bulk rewriting everything.
14. NEXT — Build a small set of relevant authority/discovery paths around Cursor/AI usage: useful resource mentions, community answers where the tool genuinely solves the question, and topic-specific links. Do not buy or spam links.
15. MONITOR — Continue watching the remaining 11 tracked URLs. Do not manually request-index every remaining URL unless evidence shows discovery has stalled after the current crawl/index wave settles.

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
- When authority is weak, prefer one materially stronger, more trustworthy and more shareable indexed page over many additional average pages.
- Search Console evidence outranks speculative keyword ideas once the site has enough impressions.
- Google/official provider documentation outranks community claims for technical/indexing/product-limit facts.
- Missing paid keyword metrics means "unknown", never a fabricated estimate.
- While indexing is immature, use a few legitimate discovery links in parallel; do not confuse bulk submission activity with real authority.

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
| Bing indexing/feed state | Bing Webmaster Tools via GSC Wizard; API connected as of 2026-09-13 |
| Keyword metrics when available | Ubersuggest |
| Changing provider rules | Official provider documentation |
| User pain / repeat questions | Public discussions such as Reddit/HN/forums |

Historical AI-agent/MCP strategy documents are not current planning authority. Preserve them only as history; they must not override the four current sources above.
