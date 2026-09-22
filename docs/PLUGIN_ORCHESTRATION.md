# Plugin Orchestration Workflow

Last updated: 2026-09-22

This document defines how ChatGPT plugins/connectors are used around `aineedhelpfromotherai.com` without creating competing sources of truth or scope creep.

## Core rule

Plugins are specialized workers, not independent roadmaps.

**GitHub main + verified production state remain final truth.** A plugin result can inform a decision, but accepted project state, blockers, next steps and durable conclusions must be recorded back into the appropriate GitHub fact source in the same work round.

Do not adopt a plugin merely because it exists. A plugin must reduce manual work, improve evidence quality, unlock a missing capability, or replace maintenance/infrastructure cost.

## Bootstrap and source-of-truth roles

- **Notion Skill** — role-entry/bootstrap instructions only. It should make a new session enter the correct operating mode quickly, then require reading GitHub main in the mandated order.
- **Google Docs Daily Project Journal** — human-readable chronological execution diary. Append one dated entry per project workday with the task checklist, actual completed work, verification, blockers/holds and next trigger. It is not a roadmap, queue or source of truth; GitHub `main` plus verified production wins on conflict.
- **GitHub** — canonical code, `PROJECT_CONTEXT.md`, `MASTER_PLAN.md`, operating workflow, task-specific ledgers, issues, PRs and release history.
- **Mem** — research notebook / signal inbox for rough ideas, competitor notes, forum findings, screenshots and provisional synthesis. Mem is not a project-state source. Promote only validated conclusions into GitHub.
- **Linear** — optional execution queue for already-approved work. It may mirror actionable tasks from the GitHub plan, but must not become a second roadmap. GitHub wins on conflict.

## Measurement and discovery roles

- **GSC Wizard** — first-party Google Search evidence for indexing, queries, impressions, CTR, page performance and search-stage decisions. Prefer it over third-party estimates when our own page/query data exists.
- **SE Ranking / Ahrefs / Semrush / Ubersuggest** — external keyword, SERP and competitor estimates. Use whichever current account/quota can answer the question. Never invent data when a provider is blocked and never upgrade billing without explicit approval.
- **Exa / Tavily / normal web search** — external discovery, source finding, competitor research and AI-retrieval tests. Provider quota/auth/cache failures must be recorded as provider blockers, not site-discovery failures.
- **Firecrawl, if connected and usable within current/free quota** — bounded competitor/content extraction or page-change monitoring when it replaces manual browsing or custom crawler work. Do not duplicate an existing watcher or crawl broadly without a concrete evidence gap.

## Distribution and communication roles

- **Metricool** — social publishing and social analytics for connected accounts. Keep social/referral traffic separate from Google organic results.
- **Gmail** — outreach, replies and authority follow-up when `docs/AUTHORITY_AND_AI_DISCOVERY.md` authorizes the action. Material outcomes must be recorded back into that ledger.
- **Google Drive / Docs** — working artifacts, the daily chronological project journal, and human-readable research when useful. They do not replace GitHub fact sources. Notion may still be read for historical/bootstrap context when available, but it is no longer the writable daily journal.

## Standard orchestration loop

For any non-trivial project task, use the smallest useful chain:

1. **Bootstrap** — load the Notion Project Operating Skill if useful, then read GitHub main in the mandatory order: `AGENTS.md` → `PROJECT_CONTEXT.md` checkpoint → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md`.
2. **Route** — read the task-specific GitHub document required by the current job.
3. **Observe** — select the strongest first-party or specialized plugin for the question.
4. **Research** — add only the minimum external tools needed to close a specific evidence gap.
5. **Synthesize** — keep tentative findings in chat/Mem/working notes and clearly separate evidence from interpretation.
6. **Decide** — apply the current GitHub plan's gate, scope lock and stop criteria. Plugin availability does not create new work by itself.
7. **Execute** — use the GitHub branch/PR workflow for project changes; use action plugins only when the user/project rules authorize the action.
8. **Record** — write accepted result, blocker, next step and stop/narrow condition into the correct GitHub fact source, task ledger or issue in the same work round.
9. **Journal** — append the day's actual checklist/results/verification/blockers/next trigger to the Google Docs Daily Project Journal. Keep it concise and chronological; never let it become a competing state database.

## Cost and quota guard

A plugin being installable in ChatGPT does **not** mean its underlying service, API, data tier or action quota is free or unlimited.

Before adopting a plugin into the regular workflow:

- test the exact required action under the current connected account;
- note whether quota/auth/billing blocks it;
- prefer already-connected tools with usable current capacity;
- do not buy, upgrade or change billing without explicit user approval;
- do not make a production dependency on a temporary free tier unless there is a migration/disable path.

## Duplication guard

Do not run several tools that answer the same question merely because they are available.

Use a second source when cross-checking materially improves a decision, such as:

- first-party GSC vs third-party keyword estimates;
- official documentation vs community failure reports;
- one SEO database vs another when a new/low-volume query may be missing;
- known-URL extraction vs semantic discovery in AI retrieval benchmarks.

Do not duplicate:

- project-state databases across GitHub, Google Docs, Notion, Linear and Mem;
- uptime/source watchers that already have a verified owner;
- the same outreach record in multiple systems;
- the same task in several trackers unless one is explicitly a read-only/mirrored view.

## Current preferred project stack

Use this as a default routing map, not a mandate to call every tool:

- Role/bootstrap: Notion Skill when readable/useful; GitHub sources remain mandatory
- Code/facts/roadmap/history: GitHub
- Daily chronological journal: Google Docs
- Working research memory: Mem
- Search performance: GSC Wizard
- Keyword/SERP estimates: SE Ranking first when usable; Ahrefs/Semrush/Ubersuggest only when current quota permits
- General/AI-native research: Web/Exa; Tavily only when executable under current quota
- Social: Metricool
- Outreach: Gmail
- Optional execution queue: Linear
- Optional bounded crawl/monitoring: Firecrawl only after connection and quota check

The workflow should remain useful if any one external plugin disappears. GitHub facts and the product itself must not depend on a connector's continued availability.
