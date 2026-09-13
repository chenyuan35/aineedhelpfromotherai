# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-13

## Current progress checkpoint

Use this section first in a new session. Do not rescan the whole repository, VPS, deployment history, or old chat unless this checkpoint is stale, contradictory, or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | Utility site is live on `https://aineedhelpfromotherai.com/`; Vercel deploys from GitHub `main` | Keep stable; verify only when releasing changes |
| Tool inventory | 13 live tool pages: traditional calculators/image tools plus Manus, Replit, Cursor, AI burn-rate, GitHub Copilot, and Bolt quota/reset tools | Do not add a broad new batch; deepen existing pages first |
| Keyword discovery | VPS keyword radar is installed and running daily; first full run completed 320/320 source requests and found 1,227 candidates | Read `/var/lib/aineedhelp-radar/latest.md` when choosing topics |
| Current radar signals | Strong phrases include Cursor usage-limit reset, Codex usage-limit reset, Claude weekly/usage-limit reset, plus image compressor/resizer combinations | Keep as candidate backlog; do not publish the next batch until the current indexing cohort produces settled search signals |
| Search Console | GSC Wizard is connected to `sc-domain:aineedhelpfromotherai.com`. Settled performance data still predates the Sep 13 indexing push, so current utility-page impressions remain effectively zero in reporting | Wait for settled data after the new crawl/index event and compare the first indexed tool pages rather than guessing from old data |
| Utility indexing | Live sitemap has 19 URLs. The 15-URL tracker is now 4 indexed / 11 not indexed / 0 pending / 0 errors. Indexed tracked URLs are the homepage, `/tools/`, `/tools/cursor-usage-reset/`, and `/tools/image-compressor/`; the three utility URLs were crawled successfully by mobile Googlebot on 2026-09-13 09:57 UTC after manual request indexing. `/about/` is also indexed outside the tracker | Keep the tracker active; do not resubmit the remaining URLs repeatedly. Watch for the next crawl/index wave and first settled tool-page impressions |
| Breakthrough-page pilot | Cursor reset is the first deliberate depth/authority pilot instead of adding another tool. PR #30 enriches the existing URL with a fast answer for reset intent, current official Cursor sources, individual-vs-team behavior, the two monthly usage pools, exact reset-date instructions, additional FAQs, and a privacy-preserving copyable reset summary. No new URL is created | Measure Cursor impressions, queries, CTR and engagement after the Sep 13 indexing event settles; only replicate this depth pattern to other pages if it produces stronger signals |
| URL normalization | FIXED in PR #19. Vercel now uses `trailingSlash: true`, matching generated canonical and sitemap URLs. Production checks show `/tools/` and `/tools/cursor-usage-reset/` resolve directly with 200; GSC on-page re-audit found 0 issues on the checked pages | Do not change URL style again without evidence; keep sitemap/canonical/internal links aligned |
| Homepage UX | PR #24 replaced the oversized marketing-style hero with a calmer task-first homepage: smaller headline, direct tool search, task shortcuts, spacious quick-start cards, softer visual hierarchy, and unchanged SEO URLs/canonicals | Preserve this task-first, comfort-oriented direction; avoid oversized slogans or dense dashboard-style UI |
| GSC sitemap state | Live `https://aineedhelpfromotherai.com/sitemap.xml` contains 19 URLs. Search Console's settled sitemap-performance window still sees only the homepage with impressions because reporting lags the Sep 13 indexing event; older submitted-count/warning records are stale | Treat direct URL Inspection as the current indexing truth until sitemap/search-performance reporting catches up |
| External discovery | PR #27 aligned the public GitHub README with the utility-site mission and direct live-tool links. The daily IndexNow workflow is verified working. Bing Webmaster API is connected. On Sep 13, the first authority outreach round sent three personalized emails to hsmart.dev, Continuum Code and Drew Bredvick; no reply/link is verified yet. Detailed status lives in `docs/AUTHORITY_AND_AI_DISCOVERY.md` | Check the original Gmail threads and the ledger after 5–7 days; then research a second batch of only 3–5 highly relevant Cursor/AI-usage targets. Do not resend early or count sent mail as earned links |
| AI discovery | Public pages are crawlable. The first Exa benchmark showed an important split: direct known-URL extraction of Cursor succeeds cleanly, but semantic discovery queries do not yet return the direct utility page near the top; a GitHub result surfaced with stale legacy positioning. PR #32 shipped current utility-site `llms.txt`/`ai.txt` files and a repeatable provider benchmark. Production was verified with cache-busted fetches; Exa's normal `/llms.txt` retrieval still showed a stale cached legacy copy immediately afterward, proving provider cache/index lag is a separate state from the live origin. The ordered AIR workstream now defines this as legitimate provider-aligned integration, not exploitation or ranking manipulation | Execute `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` in order. AIR-1 remains active until Tavily has a real baseline; AIR-4 legitimate authority building is active; AIR-5 waits for propagation before rerunning Exa/Tavily |
| Analytics | GA4 property/data stream with measurement ID `G-FYKKNKRE58` is live site-wide from PR #21. GSC Wizard Analytics consent is connected, property `properties/553896884` (`aineedhelpfromotherai`) is linked to `sc-domain:aineedhelpfromotherai.com`, and a Sep 13 rollout annotation was added | Wait for the first settled GA4 sessions/page views, then use GA4 for referral/direct/engagement decisions alongside GSC |
| Ubersuggest | Autocomplete discovery works; precise keyword metrics may be unavailable/limited at times | Use when available; never block discovery or invent metrics |
| Durable workflow | `AGENTS.md`, this checkpoint, `docs/MASTER_PLAN.md`, `docs/OPERATING_WORKFLOW.md`, `docs/AUTHORITY_AND_AI_DISCOVERY.md`, `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md`, and `docs/AI_RETRIEVAL_BENCHMARK.md` are the durable handoff sources | Update checkpoint/master plan after material progress, update the authority/AI ledger after external actions/outcomes, update the AIR task list when a task status changes, and update the retrieval benchmark after provider tests |
| Last completed work | PR #32 merged and its machine-readable discovery files were verified on production with fresh/cache-busted retrieval. The same verification exposed provider-side cache lag on Exa's canonical `/llms.txt` fetch. The AI retrieval workstream is now formalized as an ordered, non-adversarial provider-integration queue rather than an ad-hoc "AI SEO" experiment | Follow the ordered AIR queue; do not jump to speculative rewrites while propagation/data tasks are waiting |

Immediate priority: let the Sep 13 Google indexing event and PR #32 AI-discovery changes settle, keep the 15-URL tracker active, measure the Cursor breakthrough page, follow the first three outreach threads, and execute the ordered AIR workstream. Do not start another broad tool batch, mass outreach campaign, or speculative provider-specific optimization until the corresponding evidence task is complete.

## Mission

Turn `aineedhelpfromotherai.com` into a low-cost, high-traffic utility site that can earn small, stable Google AdSense revenue.

Primary success metrics: organic impressions, indexed pages, CTR, useful repeat visits, page speed, AI/search citations/referrals where measurable, and ad revenue. The first practical revenue target is a few hundred RMB/month; do not optimize for SaaS complexity.

## Product rules

- Prefer real search demand, moderate competition, and clear utility intent.
- Prefer pure browser-side tools with no AI calls and negligible server cost.
- Put the working tool above long explanations.
- One distinct user job per page; avoid thin near-duplicate doorway pages.
- Reuse engines/components across a tool family, but keep each page genuinely useful.
- Add useful explanation, examples, FAQs, internal links, canonical URLs, schema, sitemap entries, and mobile support.
- Never target competitor brand queries deceptively.
- Verify claims about changing product limits against official sources.
- Search data is evidence, not intuition: use Ubersuggest when available, plus autocomplete/community signals and Search Console.
- When authority is the bottleneck, prefer making one indexed page materially more useful, trustworthy and shareable before creating more URLs.
- For AI-answer visibility, prioritize crawlability, clear answer structure, primary-source evidence, freshness and unique utility; do not rely on unproven AEO/GEO tricks.
- Separate AI-search discovery from extraction: if a known URL extracts cleanly but does not rank in provider search, work on discovery, authority, freshness and semantic relevance rather than adding more parsing markup.
- AI-native retrieval optimization must be non-adversarial: integrate with legitimate provider signals and published web conventions; never use cloaking, hidden provider-specific content, fake citations, fabricated freshness, synthetic backlinks or deceptive metadata.

## Current architecture

- Public site: `https://aineedhelpfromotherai.com/`
- Canonical host: apex domain. `www` permanently redirects to apex.
- Hosting: Vercel static frontend deployed from GitHub `chenyuan35/aineedhelpfromotherai`.
- Production deploys come from merges to `main`; PR branches receive Vercel previews.
- Cloudflare provides DNS. Do not change domain/DNS/account settings unless explicitly authorized.
- Historical backend/API/PostgreSQL services still exist; do not delete them until dependencies are deliberately retired.
- The separate `hermes` machine belongs to another project. Never use it for this website.

## Secret handling

Never print or commit credentials. Existing Vercel and Cloudflare credentials are stored on the authorized VPS with restrictive permissions. Documentation may mention credential file paths, never credential values.

Known credential paths on the VPS:
- `/root/.vercel_token`
- `/root/.cloudflare_token`
- `/root/.cloudflare_zone_id`

## Safe development workflow

Never modify/reset the dirty production worktree. Use a fresh branch/worktree, test locally, push, open a PR, wait for Vercel preview and CI, merge, then verify production HTTP responses.

Do not use destructive resets, delete data, modify AdSense/account configuration, or alter unrelated DNS/tunnels without explicit approval.

## Live tool families

Traditional utilities currently include percentage calculators, age/date calculators, image resizing, and image compression.

AI quota/reset family currently includes:
- Manus Credits Reset Timer
- Replit Usage Reset Timer
- Cursor Usage Reset Calculator
- AI Credit Burn Rate Calculator
- GitHub Copilot AI Credits Reset Timer
- Bolt Tokens Reset Calculator

The AI quota family exists because reset/credit questions are time-sensitive, high-anxiety, and can create repeat visits. Do not blindly clone every provider; validate demand and official rules first.

## Research stack

Use multiple independent signals:
1. Ubersuggest for monthly volume/CPC/SEO difficulty when quota/API permits.
2. Google/Bing autocomplete for live long-tail language and emerging product queries.
3. Official provider docs for changing quota/reset rules.
4. Reddit, Hacker News, forums, and public discussions for repeated user pain/confusion.
5. Google Search Console after pages receive impressions: prioritize actual queries where the site is already being shown.
6. Competitor/public-page analysis for successful UX patterns, never paywall/login bypassing.
7. GA4/GSC Wizard AI-assistant referrals plus Bing/Google AI visibility reports for answer-engine discovery once enough data exists.
8. `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` for the ordered AI-native retrieval workstream and `docs/AI_RETRIEVAL_BENCHMARK.md` for repeatable Exa/Tavily/agent-search tests.

A missing paid metric must not stop discovery. Mark estimates as unknown instead of inventing numbers.

## Current operating priorities

1. Get the current utility sitemap cohort discovered/indexed by Google.
2. Keep the new static tool site stable and fast.
3. Deepen the first indexed breakthrough page (`/tools/cursor-usage-reset/`) before adding more URLs, then measure whether richer intent coverage and shareability improve search signals.
4. Run small, relevant authority/distribution rounds and track every action/outcome in `docs/AUTHORITY_AND_AI_DISCOVERY.md`.
5. Execute the ordered, non-adversarial AI retrieval integration workstream: diagnose discovery/retrieval/ranking/chunking/citation stages with repeatable provider tests, then change only the stage supported by evidence.
6. Use the connected GA4 property in GSC Wizard once settled data appears so direct/referral/engagement can complement Search Console.
7. Build only 1–2 validated tools per round instead of bulk publishing thin pages.
8. Use the VPS keyword radar to collect fresh autocomplete demand daily.
9. Use Search Console impressions from the new `/tools/` cohort to guide expansion once they exist.
10. Improve existing pages before making duplicate pages for near-identical intents.
11. Preserve sitemap/canonical/internal-link hygiene on every release.
12. Favor repeat-use utilities, especially new-product limits, resets, quotas, converters, and calculators.
13. Maintain a small number of legitimate discovery paths in parallel with indexing: accurate public GitHub links, Bing/IndexNow, and relevant topic-specific resources/communities; never bulk-submit spam links.

## Handoff rule for future sessions

At the beginning of a new working session, read `AGENTS.md`, then the Current progress checkpoint in this file, then `docs/MASTER_PLAN.md`, then `docs/OPERATING_WORKFLOW.md`. If the active task involves outreach, authority, external distribution, referrals, AI assistants, AEO/GEO, citations or follow-ups, also read `docs/AUTHORITY_AND_AI_DISCOVERY.md` before acting. If the active task is specifically testing Exa, Tavily, ChatGPT Search, Perplexity or another AI-native search/retrieval provider, read `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` before `docs/AI_RETRIEVAL_BENCHMARK.md` and execute the next eligible AIR task. Do not perform a full repository/VPS audit merely to rediscover already-confirmed state.

When a material milestone finishes, update the checkpoint in the same PR or immediately afterward. Update `docs/MASTER_PLAN.md` whenever phase status, current sprint order, exit gates, or priorities materially change. Update `docs/AUTHORITY_AND_AI_DISCOVERY.md` immediately after every external action/outcome so the next executor never has to reconstruct outreach from chat memory. Update `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` whenever an AIR task changes state and `docs/AI_RETRIEVAL_BENCHMARK.md` after every AI-native provider test.

GitHub `main` is the source of truth for code. If chat memory conflicts with repository state or production checks, trust the repository plus verified live state.
