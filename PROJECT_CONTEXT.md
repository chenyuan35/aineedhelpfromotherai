# aineedhelpfromotherai.com — Durable Project Context

Last updated: 2026-09-13

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

1. Keep the new static tool site stable and fast.
2. Build only 1–2 validated tools per round instead of bulk publishing thin pages.
3. Use the VPS keyword radar to collect fresh autocomplete demand daily.
4. Connect/use Search Console when available and let real impressions guide expansion.
5. Improve existing pages before making duplicate pages for near-identical intents.
6. Preserve sitemap/canonical/internal-link hygiene on every release.
7. Favor repeat-use utilities, especially new-product limits, resets, quotas, converters, and calculators.

## Handoff rule for future sessions

At the beginning of a new working session, read this file and `docs/OPERATING_WORKFLOW.md` before making project changes. Then inspect `ops/keyword-radar/` and the latest radar report on the VPS if the task involves new tool selection.

GitHub `main` is the source of truth for code. If chat memory conflicts with repository state or production checks, trust the repository plus verified live state.
