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
| P2 Discovery & indexing | Make Google discover and index the current utility cohort | IN PROGRESS | GSC connected; 15 priority URLs tracked; homepage indexed; 14 checked tool URLs currently unknown to Google | Tool cohort starts being crawled/indexed and receives its own impressions |
| P3 First search signals | Identify which existing pages/queries Google is testing | BLOCKED BY P2 | Current GSC impressions mostly belong to historical AI-debugging pages | At least several tool-page query/impression signals exist |
| P4 Winner optimization | Improve pages already earning impressions | QUEUED | Use GSC query/page/CTR/position data, titles, copy, internal links and exact intent | Clear improvement or a decision to stop investing |
| P5 Controlled expansion | Add 1–2 evidence-backed tools per round | QUEUED | Candidate feed comes from VPS radar + GSC + Ubersuggest + official docs/community evidence | Each round ships, indexes and is measured before the next broad round |
| P6 Distribution & authority | Earn discovery, mentions and relevant links outside Google | QUEUED | Relevant communities/directories/embeds/mentions, no spam | Repeatable referral/link sources appear |
| P7 Monetization optimization | Turn useful traffic into stable AdSense revenue | QUEUED | AdSense integration exists; approval/serving must be verified separately | First RMB 100/month, then optimize RPM without harming UX |

## Current sprint — Indexing before expansion

1. Fix the discovered URL consistency issue: generated canonical/sitemap URLs use trailing slashes while Vercel currently redirects them to no-slash URLs (`trailingSlash: false`). Pick one canonical form and make hosting, sitemap, canonicals and internal links agree.
2. Deploy the URL consistency fix through a tested PR and verify both old important routes and all tool routes.
3. Make sure `sitemap.xml` is the only intended sitemap entry and refresh/resubmit it in Search Console if necessary; old submitted non-sitemap URLs should not guide decisions.
4. Keep the 15-URL GSC indexing tracker active. Do not spam repeated recrawl requests; re-check the cohort on a measured cadence.
5. Connect GA4 to GSC Wizard if a GA4 property exists or is added, so direct/referral/engagement data can complement Search Console.
6. Once tool-page impressions appear, optimize the strongest existing page before creating a near-duplicate page.
7. Select the next 1–2 tools only from combined evidence: GSC signal + radar/autocomplete + official rules/community pain + keyword metrics when available.
8. Start light distribution for genuinely useful indexed tools: relevant directories, niche communities and natural mentions/backlinks; avoid bulk spam submissions.

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
| Keyword metrics when available | Ubersuggest |
| Changing provider rules | Official provider documentation |
| User pain / repeat questions | Public discussions such as Reddit/HN/forums |

Historical AI-agent/MCP strategy documents are not current planning authority. Preserve them only as history; they must not override the four current sources above.
