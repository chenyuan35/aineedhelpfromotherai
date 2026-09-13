# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-13

## Current progress checkpoint

Use this section first in a new session. Do not rescan the whole repository, VPS, deployment history, or old chat unless this checkpoint is stale, contradictory, or the current task requires deeper inspection.

| Area | Current state | Next move |
|---|---|---|
| Production | Utility site is live on `https://aineedhelpfromotherai.com/`; Vercel deploys from GitHub `main` | Keep stable; verify only when releasing changes |
| Tool inventory | 13 live tool pages: traditional calculators/image tools plus Manus, Replit, Cursor, AI burn-rate, GitHub Copilot, and Bolt quota/reset tools | Add only 1–2 validated tools per round |
| Keyword discovery | VPS keyword radar is installed and running daily; first full run completed 320/320 source requests and found 1,227 candidates | Read `/var/lib/aineedhelp-radar/latest.md` when choosing topics |
| Current radar signals | Strong phrases include Cursor usage-limit reset, Codex usage-limit reset, Claude weekly/usage-limit reset, plus image compressor/resizer combinations | Keep as candidate backlog; do not publish the next batch until indexing starts |
| Search Console | GSC Wizard is connected to `sc-domain:aineedhelpfromotherai.com`. Last 28 settled days: 589 impressions, 0 clicks, avg position 43.24; those impressions are almost entirely from the historical AI-debugging pages because GSC data is settled only through 2026-09-10 | Treat current utility pages as a new indexing cohort rather than optimizing from old query data |
| Utility indexing | Live sitemap currently has 19 URLs. Direct URL Inspection shows homepage indexed, while all 14 checked utility/tool routes are currently `URL is unknown to Google`. A GSC Wizard indexing tracker monitors 15 priority URLs: 1 indexed, 14 not indexed, 0 pending/errors | Fix URL normalization consistency first, then let the tracker measure discovery/indexing |
| URL normalization | GSC on-page audit found every checked non-root tool URL is indexable but `/path/` redirects 308 to `/path` while the canonical and sitemap point to `/path/`. `vercel.json` explicitly has `trailingSlash: false` | Align hosting with canonical/sitemap/internal URLs before passive waiting; current preferred fix is to make trailing-slash URLs resolve directly |
| GSC sitemap state | GSC has the existing `https://aineedhelpfromotherai.com/sitemap.xml`; its historical report still reflects older submissions/warnings while live fetch reads 19 current URLs | After URL normalization, refresh/resubmit the intended sitemap and monitor the new cohort rather than stale counts |
| Analytics | Search Console is connected; GSC Wizard reports Google Analytics consent is not connected for this account | Connect GA4 if a property exists/is added so referral/direct/engagement data complements GSC |
| Ubersuggest | Autocomplete discovery works; precise keyword metrics may be unavailable/limited at times | Use when available; never block discovery or invent metrics |
| Durable workflow | `AGENTS.md`, this checkpoint, `docs/MASTER_PLAN.md`, and `docs/OPERATING_WORKFLOW.md` are the canonical handoff | Update checkpoint and master plan after material progress/priority changes |
| Last completed infra work | PR #14 added durable workflow + radar; PR #15 fixed supervisord scheduling; PR #16 added fast checkpoint; GSC connection/tracker are active | Do not redo these setups unless health checks fail |

Immediate priority: fix the trailing-slash/canonical/sitemap mismatch, then refresh the sitemap/indexing loop and monitor the 15 tracked URLs. Do not start another broad tool batch until the `/tools/` cohort begins receiving its own crawl/index/impression signals.

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

1. Align hosting URL normalization with sitemap/canonical URLs.
2. Get the current utility sitemap cohort discovered/indexed by Google.
3. Keep the new static tool site stable and fast.
4. Build only 1–2 validated tools per round instead of bulk publishing thin pages.
5. Use the VPS keyword radar to collect fresh autocomplete demand daily.
6. Use Search Console impressions from the new `/tools/` cohort to guide expansion once they exist.
7. Improve existing pages before making duplicate pages for near-identical intents.
8. Preserve sitemap/canonical/internal-link hygiene on every release.
9. Favor repeat-use utilities, especially new-product limits, resets, quotas, converters, and calculators.

## Handoff rule for future sessions

At the beginning of a new working session, read `AGENTS.md`, then the Current progress checkpoint in this file, then `docs/MASTER_PLAN.md`, then `docs/OPERATING_WORKFLOW.md`. Do not perform a full repository/VPS audit merely to rediscover already-confirmed state. Inspect deeper only when the requested task depends on it or a checkpoint item is stale/contradictory.

When a material milestone finishes, update the checkpoint in the same PR or immediately afterward. Update `docs/MASTER_PLAN.md` whenever phase status, current sprint order, exit gates, or priorities materially change.

GitHub `main` is the source of truth for code. If chat memory conflicts with repository state or production checks, trust the repository plus verified live state.
