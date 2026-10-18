# Plugin Orchestration Workflow

Last updated: 2026-09-27

This document defines durable rules for using ChatGPT plugins/connectors around `aineedhelpfromotherai.com`.

## Core rule

Plugins are specialized tools, not project fact sources, roadmaps, or product managers.

**GitHub `main` + verified production state remain authoritative.** Plugin results can supply live data, execute authorized actions, or reduce manual work, but accepted conclusions, blockers, and durable project state must be recorded in the appropriate GitHub fact/task source.

Do not install or use a plugin merely because it exists. A plugin must materially improve evidence quality, reduce manual work, unlock a missing capability, or lower maintenance cost.

## Source precedence

1. GitHub `main` canonical project facts/plans.
2. Verified production/runtime state.
3. First-party connected data for the exact question.
4. Specialized external datasets/research tools.
5. General web/community evidence.

A plugin never overrides a higher-precedence source merely because its output is newer or more convenient.

## Dynamic state does not belong here

Do not store temporary provider/account state in this durable workflow, including:

- current trial/subscription status;
- remaining quota/credits;
- transient auth failures;
- current connected-account inventory;
- current provider outages;
- one-off API errors.

Record those in the current task-specific GitHub fact source when they materially affect execution. Re-check live availability before depending on any provider.

## Role map

### Project control and release

- **GitHub** — code, canonical facts, plans, task ledgers, PRs, CI and release history.
- **Vercel** — deployment state, preview/production verification, build/runtime logs and hosting diagnostics.
- **Google Drive / Docs** — human-readable daily journal or working artifacts only; never a competing roadmap.
- **Mem / Notion / Linear / task managers** — optional working memory or execution aids only; they never override GitHub.

### Search and traffic measurement

- **Google Search Console data** — primary source for Google organic impressions, clicks, CTR, query/page visibility and average position.
- Use the strongest currently connected read path for Search Console; a connector is an access bridge, not the data authority.
- Prefer official/first-party Search Console data over third-party keyword estimates when measuring this site.
- **Google Analytics 4** — primary source for actual site sessions/users, channels, landing pages, engagement and site events when the production tag and a readable connector are available.
- Keep Google organic, direct, referral/social, AI referral and other channels separate.
- Never equate `0 GSC clicks` with `0 total site visitors`.

### SEO and competitor research

- **SE Ranking / Semrush / Ahrefs / Ubersuggest** — keyword, SERP, backlink and competitor estimates when the connected account can answer the exact question.
- **Firecrawl** — bounded extraction/change monitoring when it replaces manual work and does not duplicate an existing watcher.
- **Exa / Tavily / normal web search** — discovery, source finding, competitor research and AI-native retrieval tests.

Third-party SEO numbers are estimates. Do not invent missing volume/CPC/difficulty when providers are blocked.

### Distribution and communication

- **Metricool** — social publishing/analytics when authorized; keep social/referral performance separate from organic search.
- **Gmail** — outreach and follow-up only when the authority/outreach ledger authorizes it.

## Standard orchestration loop

For a non-trivial project task:

1. Read the required GitHub startup chain.
2. Read the relevant task-specific methodology/ledger.
3. Choose the smallest plugin/tool chain that can answer the question.
4. Prefer first-party data for site performance and provider-controlled facts.
5. Add external research only to close a specific evidence gap.
6. Distinguish raw evidence, interpretation and accepted project fact.
7. Execute only authorized/reversible actions.
8. Persist material conclusions/blockers to the correct GitHub fact source.
9. Verify user-visible or production-affecting changes independently.

## Measurement routing

When the question is `Is traffic growing?`:

- Search Console → organic impressions, clicks, CTR, positions, queries/pages.
- GA4 → actual sessions/users, channel mix, landing pages, engagement and events.
- Social connector → social reach/referral activity.
- AI-referral capable analytics → identifiable AI assistant referrals.

Do not combine these into one undifferentiated traffic number.

When the question is `Why are impressions not becoming visits?`:

1. inspect query/page/position in Search Console;
2. inspect title/meta/first-screen intent match;
3. use GA4 only after a click/visit exists to inspect landing-page behavior;
4. do not redesign from tiny samples.

When the question is `Are users actually using a tool?`:

- prefer GA4 page/event data or another already-approved site analytics source;
- measure concrete actions rather than pageviews alone when instrumentation exists;
- do not add a second analytics product until the existing measurement layer is proven insufficient.

## Cost and authorization guard

Before making a plugin part of the regular workflow:

- verify the exact required action under the currently connected account;
- verify current quota/cost/access live;
- prefer already-connected tools that satisfy the job;
- do not buy, upgrade, rotate trial accounts, or change billing without explicit user approval;
- do not make production depend on a temporary free tier without a fallback/disable path.

Connecting/installing an external account still requires the user's explicit action when the provider presents an authorization flow.

## Duplication guard

Use a second tool only when cross-checking materially improves the decision.

Do not duplicate:

- project state across GitHub/Docs/Notion/Linear/Mem;
- multiple analytics stacks for the same small-site measurement job;
- uptime/source watchers that already have a verified owner;
- identical SEO databases without a concrete evidence gap;
- outreach records across several systems.

## Default project stack

Use this routing map as a default, not as a mandate to call every tool:

- project truth/code/release: GitHub + Vercel;
- Google organic performance: current first-party Search Console connection;
- actual site traffic/behavior: GA4 when readable;
- keyword/SERP/backlinks: one currently usable SEO provider, with a second only for material cross-checking;
- public research/extraction: Web/Exa/Firecrawl as needed;
- social: Metricool;
- outreach: Gmail;
- working journal/artifacts: Google Drive/Docs.

The project must remain operable if any one external connector disappears.
