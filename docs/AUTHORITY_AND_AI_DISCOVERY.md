# Authority & AI Discovery Ledger

Last updated: 2026-09-13

This file is the durable execution log for external authority building, referral discovery, and AI-answer visibility work for `aineedhelpfromotherai.com`.

Use it before starting a new outreach/distribution round so we do not repeat contacts, lose follow-ups, or confuse planned work with completed work. Do not store private credentials or recipient email addresses here; use public site/author names and Gmail thread history for exact correspondence.

## Current objective

Build authority around the already-indexed Cursor reset page before adding another broad batch of tools. The near-term test is whether a materially deeper, more trustworthy and shareable page can earn search impressions, citations, referrals and relevant external mentions.

Primary page:
- `https://aineedhelpfromotherai.com/tools/cursor-usage-reset/`

For AI-native search/retrieval integration, the ordered execution queue is now `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md`. The governing principle is non-adversarial: integrate with legitimate discovery, relevance, quality, freshness, authority and citation signals rather than attempting to bypass or manipulate provider algorithms.

## Outreach ledger

| Date | Target | Why relevant | Action | Status | Next check |
|---|---|---|---|---|---|
| 2026-09-13 | hsmart.dev | Publishes Cursor/Claude Code comparison material that discusses usage limits | Sent a personalized resource-suggestion email pointing to the Cursor reset page | SENT | Check Gmail for reply or citation after 5–7 days; do not resend before then |
| 2026-09-13 | Continuum Code | Publishes Cursor usage-limit guidance | Sent a personalized resource-suggestion email explaining the official-source reset guidance and local countdown | SENT | Check Gmail for reply or citation after 5–7 days; do not resend before then |
| 2026-09-13 | Drew Bredvick | Writes about AI coding tools, Cursor and AI usage/cost topics | Sent a personalized resource-suggestion email focused on the practical reset calculator and official-source depth | SENT | Check Gmail for reply or citation after 5–7 days; do not resend before then |

Current outcome: no reply/citation has been verified yet. Do not count sent email as an earned link.

## Outreach execution rule

For each new target:
1. Confirm the target already covers Cursor, AI coding usage, quotas, limits, billing or adjacent developer tooling.
2. Read the relevant page before contacting them.
3. Explain the exact reader benefit of our resource; do not send generic link-exchange requests.
4. Keep each round small (normally 3–5 targets).
5. Record the action here immediately after sending/publishing.
6. On follow-up, read the original Gmail thread first. Do not send a second message if the recipient has replied, declined, already linked, or if the first message is still fresh.
7. Record outcomes as `REPLIED`, `LINKED`, `DECLINED`, `NO RESPONSE`, `NOT A FIT`, or `FOLLOW-UP SENT`.
8. Never buy links, mass-submit directories, or post promotional answers where the tool does not genuinely solve the discussion.

## AI discovery / answer-engine plan

The goal is not to "trick" an AI model. Current search/AI retrieval guidance and our own provider tests point to the same practical target: make pages easy to discover, retrieve, understand, quote and trust.

### 1. Crawl and retrieval eligibility

Verified 2026-09-13:
- `frontend/robots.txt` uses `User-agent: *` with `Allow: /`, so normal public pages are not blocked from general search/AI search crawlers.
- Google indexing is active for the Cursor page.
- Bing Webmaster is connected.
- IndexNow is already running daily.

Do not add special crawler rules unless a real access problem appears. Crawler eligibility is necessary but not sufficient for retrieval/ranking.

### 2. Make pages citation-friendly

For winner pages such as Cursor:
- Put the direct answer near the top.
- Use descriptive question-style headings matching real user jobs.
- State changing rules with an explicit "last verified" date.
- Link to the primary official source for changing product rules.
- Distinguish facts from our calculator/planning estimates.
- Add concise tables or bulletable facts when they improve clarity.
- Keep canonical URLs stable and avoid duplicate variants.
- Prefer one deep page covering closely related query variants over many thin pages.
- Add genuinely unique utility or first-party output that cannot be replaced by a generic AI summary (countdown, calculation, local state, examples, comparisons, verified edge cases).

### 3. Build external corroboration

AI retrieval systems and search engines are more likely to trust content that is independently discovered and referenced. The authority program therefore focuses on:
- relevant editorial links from AI coding / Cursor / developer-tool resources;
- useful GitHub resource lists where contribution rules permit it;
- community answers only when the page directly solves the question;
- natural mentions generated by a useful/shareable tool;
- no generic directory blasts or paid-link schemes.

### 4. Measurement

Track three separate outcomes:
- Search: Google/Bing impressions, queries, CTR and indexed status.
- Referral: GA4 sessions from external sites.
- AI assistants: GA4 referrals from ChatGPT, Perplexity, Copilot, Gemini, Claude and other assistants through GSC Wizard; Bing/Google AI visibility reports when available.

Baseline on 2026-09-13: GSC Wizard reports no settled AI-assistant referral sessions yet. This is a baseline, not a failure signal, because the new site/indexing rollout happened the same day.

### 5. AI-native search retrieval benchmark

Detailed benchmark protocol and results live in `docs/AI_RETRIEVAL_BENCHMARK.md`.

Verified 2026-09-13 with Exa:
- a natural-language Cursor reset intent query did not return our site in the top 10;
- an exact concept/title query did not return the direct Cursor utility page in the top 5;
- direct known-URL extraction of the Cursor page succeeded and returned the important answer-first sections cleanly;
- a domain-oriented query surfaced the GitHub repository, but not the direct utility site, and the retrieved repository representation was stale/legacy.

Interpretation: the page is machine-readable once known. The current AI-native search bottleneck is candidate discovery/indexing/ranking plus stale external representations, not page extraction.

Completed remediation:
- PR #32 rewrote legacy `llms.txt` and `ai.txt` for the current utility site;
- the production static build now publishes those files at the site root;
- fresh/cache-busted retrieval verified the new production content;
- Exa still showed a stale canonical `llms.txt` copy immediately afterward, proving provider cache/index lag must be tracked separately.

Current ordered AIR status:
- AIR-0 non-adversarial/provider-aligned principle: DONE.
- AIR-1 provider benchmark methodology: ACTIVE; Exa baseline exists, Tavily baseline still requires an executable provider run.
- AIR-2 machine-readable identity consistency: DONE.
- AIR-3 external metadata alignment: BLOCKED until a repository metadata write path or manual UI action is available.
- AIR-4 legitimate external corroboration: ACTIVE.
- AIR-5 Exa/Tavily rerun: WAITING for propagation.

## Next execution queue

1. Continue AIR-1 only when a real Tavily provider run is executable; do not invent a result.
2. Continue AIR-4 through the existing small, relevant Cursor authority program; verify earned mentions independently.
3. After 5–7 days, inspect replies from the first three outreach emails and record every outcome.
4. Allow provider caches/indexes and external authority signals time to propagate; do not repeatedly rewrite discovery files.
5. Run AIR-5: repeat the same Exa/Tavily benchmark and compare discovery rank, extraction quality and cache freshness against the baseline.
6. Use the result to advance AIR-6 and identify the actual failing stage before any new page optimization.
7. Check settled search queries/impressions, AI-assistant referral traffic and Bing/Google AI visibility signals when enough data exists.
8. If Cursor earns meaningful search/citation/referral signals, replicate the proven pattern to exactly one other existing indexed page.

## Decision log

- 2026-09-13: Chose Cursor reset as the first breakthrough-page pilot because it is already indexed and has strong current intent signals.
- 2026-09-13: PR #30 deepened the existing Cursor URL rather than creating another page.
- 2026-09-13: Began authority outreach with three personalized emails; no link is counted until independently verified.
- 2026-09-13: Added AI-answer visibility as a measured channel alongside classic search and referral traffic. Strategy is retrieval/citation readiness, not speculative "AI hacks".
- 2026-09-13: Added an explicit AI-native search benchmark. First Exa run shows clean direct extraction but weak discovery/ranking; this separates retrieval visibility from ordinary Google index status.
- 2026-09-13: Formalized the AIR workstream as a strict ordered queue. The project will integrate with provider algorithms through legitimate signals and observable retrieval stages, not by trying to crack, bypass or game them.
