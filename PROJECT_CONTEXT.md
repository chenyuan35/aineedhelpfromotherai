# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-13

## Current progress checkpoint

Use this section first in a new session. Do not rescan the whole repository, VPS, deployment history, or old chat unless this checkpoint is stale, contradictory, or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | Utility site is live on `https://aineedhelpfromotherai.com/`; Vercel deploys from GitHub `main` | Keep stable; verify only when releasing changes |
| Tool inventory | 13 live tool pages: traditional calculators/image tools plus Manus, Replit, Cursor, AI burn-rate, GitHub Copilot, and Bolt quota/reset tools | Add only 1–2 validated tools per round |
| Keyword discovery | VPS keyword radar is installed and running daily; first full run completed 320/320 source requests and found 1,227 candidates | Read `/var/lib/aineedhelp-radar/latest.md` when choosing topics |
| Current radar signals | Strong phrases include Cursor usage-limit reset, Codex usage-limit reset, Claude weekly/usage-limit reset, plus image compressor/resizer combinations | Keep as candidate backlog; do not publish the next batch until the current indexing cohort produces settled search signals |
| Search Console | GSC Wizard is connected to `sc-domain:aineedhelpfromotherai.com`. Settled performance data still predates the Sep 13 indexing push, so current utility-page impressions remain effectively zero in reporting | Wait for settled data after the new crawl/index event before choosing winners |
| Utility indexing | Live sitemap has 19 URLs. The 15-URL tracker is now 4 indexed / 11 not indexed / 0 pending / 0 errors. Indexed tracked URLs are the homepage, `/tools/`, `/tools/cursor-usage-reset/`, and `/tools/image-compressor/`; the three utility URLs were crawled successfully by mobile Googlebot on 2026-09-13 09:57 UTC after manual request indexing. `/about/` is also indexed outside the tracker | Keep the tracker active; do not resubmit the remaining URLs repeatedly. Watch for the next crawl/index wave and first settled tool-page impressions |
| URL normalization | FIXED in PR #19. Vercel now uses `trailingSlash: true`, matching generated canonical and sitemap URLs. Production checks show `/tools/` and `/tools/cursor-usage-reset/` resolve directly with 200; GSC on-page re-audit found 0 issues on the checked pages | Do not change URL style again without evidence; keep sitemap/canonical/internal links aligned |
| Homepage UX | PR #24 replaced the oversized marketing-style hero with a calmer task-first homepage: smaller headline, direct tool search, task shortcuts, spacious quick-start cards, softer visual hierarchy, and unchanged SEO URLs/canonicals | Preserve this task-first, comfort-oriented direction; avoid oversized slogans or dense dashboard-style UI |
| GSC sitemap state | Live `https://aineedhelpfromotherai.com/sitemap.xml` contains 19 URLs. Search Console's settled sitemap-performance window still sees only the homepage with impressions because reporting lags the Sep 13 indexing event; older submitted-count/warning records are stale | Treat direct URL Inspection as the current indexing truth until sitemap/search-performance reporting catches up |
| External discovery | PR #27 aligned the public GitHub README with the utility-site mission and direct live-tool links. The daily IndexNow workflow is verified working. Bing Webmaster API is now connected in GSC Wizard; Bing recognizes the site, reports no current crawl-issue URLs, and had about 30 URLs in its historical index on Sep 12, but no sitemap/feed is currently listed and Sep 1–11 Bing search traffic is 0 clicks / 0 impressions | Keep GitHub/IndexNow active; monitor Bing crawl/search data and submit/verify the current sitemap in Bing when an authenticated feed-submission path is available |
| Analytics | GA4 property/data stream with measurement ID `G-FYKKNKRE58` is live site-wide from PR #21. GSC Wizard Analytics consent is connected, property `properties/553896884` (`aineedhelpfromotherai`) is linked to `sc-domain:aineedhelpfromotherai.com`, and a Sep 13 rollout annotation was added | Wait for the first settled GA4 sessions/page views, then use GA4 for referral/direct/engagement decisions alongside GSC |
| Ubersuggest | Autocomplete discovery works; precise keyword metrics may be unavailable/limited at times | Use when available; never block discovery or invent metrics |
| Durable workflow | `AGENTS.md`, this checkpoint, `docs/MASTER_PLAN.md`, and `docs/OPERATING_WORKFLOW.md` are the canonical handoff | Update checkpoint and master plan after material progress/priority changes |
| Last completed work | User completed the small Google request-indexing set and Bing API connection; verification then confirmed `/tools/`, Cursor reset, and image compressor indexed in Google, updated the tracker to 4/15 indexed, and confirmed Bing data access with no current crawl issues. PR #27 remains the first external discovery link release | Monitor indexing/search signals; do not start another broad tool batch yet |

Immediate priority: let the Sep 13 indexing event settle into Search Console/GA4 reporting, keep the 15-URL tracker active, monitor the remaining 11 tracked URLs without repeated request-indexing spam, and watch Bing/Google for the first utility-page impressions. Do not start another broad tool batch until the `/tools/` cohort produces its own search signals.

## Mission

Turn `aineedhelpfromotherai.com` into a low-cost, high-traffic utility site that can earn small, stable Google AdSense revenue.

Primary success metrics: organic impressions, indexed pages, CTR, useful repeat visits, page speed, and ad revenue. The first practical revenue target is a few hundred RMB/month; do not optimize for SaaS complexity.

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

A missing paid metric must not stop discovery. Mark estimates as unknown instead of inventing numbers.

## Current operating priorities

1. Get the current utility sitemap cohort discovered/indexed by Google.
2. Keep the new static tool site stable and fast.
3. Use the connected GA4 property in GSC Wizard once settled data appears so direct/referral/engagement can complement Search Console.
4. Build only 1–2 validated tools per round instead of bulk publishing thin pages.
5. Use the VPS keyword radar to collect fresh autocomplete demand daily.
6. Use Search Console impressions from the new `/tools/` cohort to guide expansion once they exist.
7. Improve existing pages before making duplicate pages for near-identical intents.
8. Preserve sitemap/canonical/internal-link hygiene on every release.
9. Favor repeat-use utilities, especially new-product limits, resets, quotas, converters, and calculators.
10. Maintain a small number of legitimate discovery paths in parallel with indexing: accurate public GitHub links, Bing/IndexNow, and later relevant directories/communities; never bulk-submit spam links.

## Handoff rule for future sessions

At the beginning of a new working session, read `AGENTS.md`, then the Current progress checkpoint in this file, then `docs/MASTER_PLAN.md`, then `docs/OPERATING_WORKFLOW.md`. Do not perform a full repository/VPS audit merely to rediscover already-confirmed state. Inspect deeper only when the requested task depends on it or a checkpoint item is stale/contradictory.

When a material milestone finishes, update the checkpoint in the same PR or immediately afterward. Update `docs/MASTER_PLAN.md` whenever phase status, current sprint order, exit gates, or priorities materially change.

GitHub `main` is the source of truth for code. If chat memory conflicts with repository state or production checks, trust the repository plus verified live state.