# Operating Workflow

This is the default execution loop for `aineedhelpfromotherai.com`.

## Task-list-first execution cadence

Before a non-trivial work round, create a bounded checklist from the current GitHub facts and execution queue. The checklist should state the intended actions, verification steps, blockers/triggers and stop conditions.

After the checklist exists, execute all eligible checklist items inside the selected bounded session task continuously. Do not stop after each item merely to narrate progress or request confirmation. Stop only when authorization is required, an irreversible/high-impact choice appears, a documented blocker/wait gate applies, or no eligible item remains.

### In-round defect handling

When a new issue is discovered while executing an already-authorized project task, treat it as part of the current work round and continue automatically through diagnosis, the smallest safe fix, tests, PR, CI/Eval/Preview, merge, production verification and fact-source update when all of the following are true:

- the issue is confirmed by evidence rather than speculation;
- the repair is bounded and reversible;
- it does not change product direction, DNS, billing, paid services, account-critical settings, privacy/security boundaries or another high-impact contract;
- it does not violate a documented wait gate or provider blocker.

Do not pause merely to report a routine defect, ask whether to fix it, or hand the obvious next step back to the user. Ask only when missing authorization or information would materially change direction, risk, cost, user-visible behavior or an irreversible/high-impact action. If one subtask is blocked but another eligible subtask in the same bounded work round remains, continue the eligible work instead of stopping the whole round.

At least once per project workday, append a dated entry to the Google Docs journal `aineedhelpfromotherai — Daily Project Journal` containing: the checklist, what actually completed, verification evidence, blockers/holds, and the next trigger. The Google Docs journal is a readable chronological diary only; it never overrides GitHub `main`, canonical fact sources, or verified production. Material accepted results must still be written to the correct GitHub fact source in the same work round.

## 0. Resume without rescanning

At the start of a new session, follow one exact chain: `AGENTS.md` → `PROJECT_CONTEXT.md` **Current progress checkpoint** → `docs/MASTER_PLAN.md` → `docs/OPERATING_WORKFLOW.md` → `docs/CURRENT_EXECUTION_QUEUE.md` → `docs/SESSION_EXECUTION_PROTOCOL.md`. Do not use an old chat, old session handoff, historical audit or remembered machine identity as a substitute. Do not perform a full repository/VPS/deployment audit unless the selected current task needs it or the canonical checkpoint is stale/contradictory.

The checkpoint must answer what is live and what is blocked; `docs/MASTER_PLAN.md` must answer phase/priority/exit gate; the queue must state exactly what task is next and what must not be done. If those sources disagree, reconcile them before execution instead of choosing whichever instruction is most convenient.

When the current task involves external authority, outreach, referral distribution, or AI-answer visibility, also read `docs/AUTHORITY_AND_AI_DISCOVERY.md` before acting. It is the durable ledger for who was contacted, what was sent, what happened, and what follow-up is due.

When the current task involves Exa, Tavily, ChatGPT Search, Perplexity or another AI-native search/retrieval system, also read `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md` and `docs/AI_RETRIEVAL_BENCHMARK.md`. Advance the ordered AIR task list instead of improvising a new provider-specific optimization plan.

When plugins/connectors are used, follow `docs/PLUGIN_ORCHESTRATION.md`. Plugins are specialized workers around the GitHub fact source, not independent roadmaps or competing project-state databases. Use the smallest useful tool chain, check the connected account's real quota before depending on a service, and record accepted results/blockers back into the appropriate GitHub fact source in the same work round.

### Parallel AI worker orchestration

When an additional capable agent/model is available on QwenPaw or another approved project worker, use it as a **high-throughput backstage worker**, not as an independent project manager. GitHub `main` remains the shared control plane.

Default division of labor:

- the coordinating ChatGPT session owns current-state reconciliation, product/value decisions, task priority, admission gates, Search Console/growth decisions, PR review, merge/release verification and canonical fact-source updates;
- QwenPaw/Kimi or another delegated worker should preferentially handle parallelizable research: forum/community discovery, source retrieval, evidence extraction, provenance/timestamps, deduplication, contradiction checks, candidate-field completion, bounded batch triage and draft test artifacts;
- delegated research outputs are `RESEARCH CANDIDATE` / raw evidence by default. They do not become accepted product data, public routes, rankings or roadmap tasks until the coordinating session reviews them against the applicable evidence/value gates;
- official/provider sources may verify provider-controlled facts after a candidate exists, but must not be used to mass-create Phone candidates merely because products are listed;
- delegated workers must not independently change `docs/CURRENT_EXECUTION_QUEUE.md`, product direction, production UI/data schema, infrastructure roles, DNS, billing, AdSense/account settings, merge/deploy state or other high-impact contracts;
- a worker may research many candidates in parallel, but public production still follows the one-current-task/session gate. High model quota is a reason to increase evidence throughput, not to increase unreviewed page/PR volume;
- before accepting a large batch, audit a small sample for source quality, duplication and classification error. Narrow or stop the batch if quality is poor.

A delegated worker's local heartbeat, memory or task list is never a project fact source. It must read the same GitHub startup chain before project work and treat conflicts as stale local state.

### Interpret rough inputs before execution

The user is not required to turn every thought into a professional product brief. Screenshots, copied prompts, competitor examples, half-formed ideas, observations, and material shared “for reference” are useful signals even when they are not executable specifications.

Default interpretation:
- an explicit request to build, change, send, deploy, publish, delete, buy, or otherwise act is an action request, still subject to the project's safety and priority rules;
- a shared idea, screenshot, prompt, example, competitor feature, or reference is a signal to analyze, not automatic authorization to implement it;
- do not manufacture a new roadmap task merely because a new technology, feature, or competitor pattern was mentioned.

Before turning a signal into implementation, convert it into product judgment:
1. identify the real user problem or opportunity behind the idea;
2. check whether it fits the project's current phase, evidence, and priorities;
3. compare simpler, lower-cost, lower-maintenance, or higher-value alternatives;
4. account for implementation cost, recurring maintenance, infrastructure, paid-service dependency, privacy/security, and scope-creep risk;
5. prefer a reversible, low-cost validation when it can answer the important question before a full build;
6. define what evidence would count as success, failure, or a reason to stop.

Ask a clarifying question only when the missing information would materially change the direction, risk, cost, user-visible behavior, or an irreversible action. Otherwise, make the best evidence-backed product recommendation from the available context. Do not make the user restate an idea in formal product language merely so work can begin.

For a genuinely new production feature or application, define the user job, scope/non-goals, major technical decisions, file/module boundaries, persistence/database needs, API surface, interface flow, security/privacy constraints, deployment/observability requirements, test strategy, rollback path, and expected operating cost before substantial implementation. Then build the smallest launchable, maintainable version that can test the thesis; do not default to maximal architecture.

## 0.5 Product value gate — before demand scoring or implementation

Read `docs/PRODUCT_VALUE_GATE.md` before building, expanding, or optimizing any product surface.

The first question is not “how many people search this?” It is:

> Why can the user not adequately solve this by reading the official page/account UI, remembering a fixed rule/date, or doing one ordinary search?

A candidate must provide at least one material advantage: information asymmetry, uncertainty reduction/prediction, multi-source aggregation, freshness/monitoring, meaningful computation/transformation, proprietary history, or clear decision-cost reduction.

Hard stop when the core answer is deterministic, stable, obvious, and already clearly available from the provider unless the site adds a separate durable advantage. Do not build a wrapper around official documentation simply because keyword demand exists.

Existing pages are subject to the same gate. Technical acceptance, ranking, impressions, or prior development effort do not grandfather a weak product into further investment.

Official sources remain important for provider-controlled facts. They are evidence inputs, not automatically the product itself. For real-world behavior, hidden routes, reliability, uncertainty, recovery, or operational outcomes, prioritize current independent user/community evidence and historical observations.

## 1. Discover

Collect candidate queries from the VPS keyword radar, Ubersuggest when available, autocomplete, Search Console, current product documentation, and repeated public user questions.

A candidate is stronger when it has several of these traits:
- clear action or calculation intent;
- repeated/return usage;
- changing rules or time-sensitive status;
- can run client-side;
- low server cost;
- one obvious search query maps to one useful page;
- incumbent results are weak, stale, slow, confusing, or overly complex;
- the user cannot get an equally useful answer from one clear official page/account screen.

Do not invent search-volume data when a metrics provider is unavailable.

## 2. Score and select

Only score candidates that pass the product-value gate. Search demand cannot rescue a candidate whose core answer is already deterministic and clearly provided by the source itself.

Score surviving candidates on demand signal, competition, monetizable intent, implementation cost, repeat-visit potential, policy freshness, and defensibility of the non-official value. Prefer candidates with multiple independent signals rather than one anecdote.

Default batch size: 1–2 new tools. Larger batches require unusually strong evidence and shared implementation.

Before coding a changing-product tool, identify an official source for the provider-controlled rule being calculated. Use that source to verify facts, not as proof that the tool has a reason to exist. If the provider exposes account-specific reset times, let the user enter/anchor that value instead of inventing a universal time; then separately prove what additional value the site provides beyond displaying the same reset time.

## 3. Build safely

- Fetch `origin/main`.
- Create a dedicated branch and fresh worktree.
- Do not edit the dirty production worktree.
- Reuse existing generator/style/client-side patterns.
- Keep user data local unless a server is genuinely required.
- Add canonical, meta description, WebApplication/Breadcrumb schema, useful FAQs, related links, and sitemap entry.
- Add automated syntax/build checks for any generator-created JavaScript.

## 4. Test before merge

Minimum checks:
- production build succeeds;
- each new route returns 200 in the preview;
- one H1 and correct title/canonical;
- canonical URL resolves directly without an avoidable redirect;
- calculator/timer logic works with normal and edge inputs;
- no client JavaScript syntax errors;
- mobile layout has no horizontal overflow;
- sitemap contains the exact final canonical URL;
- existing important routes still return 200.

For image/file tools, test a real input and download. For time/reset tools, test timezone conversion, expired timestamps, localStorage restore, and calendar export when present.

## 5. Release

Push branch, open PR, wait for Vercel Preview and CI/Eval Gate, then merge only after green checks. After merge, wait for the production deployment and independently verify the apex-domain URLs rather than assuming deployment success means the public domain is correct.

### Vercel Preview quota discipline

Treat Vercel deployments as a limited release resource even when the hosting plan describes deployments broadly as available. A remote branch push can create a new Preview deployment, so repeated small remote commits can exhaust a rolling deployment-rate limit without any code defect.

For production-affecting PRs:

- finish research, edits, formatting and local/GitHub-side tests before the first remote push whenever practical;
- prefer one consolidated final branch push per PR instead of a sequence of remote micro-commits;
- do not push no-op, formatting-only or bookkeeping commits merely to retrigger Vercel after the code is already valid;
- after a Preview is green, make another source push only for a real defect or required change; each new head must be revalidated;
- production-affecting changes still require both CI/Eval Gate success and a real Vercel Preview before merge.

For documentation-only fact-source/process PRs:

- they do not require a rendered Vercel Preview because they cannot change the public build/runtime;
- require a bounded diff review plus applicable GitHub CI/Eval checks instead;
- batch related documentation updates into one remote commit where practical;
- if Vercel Git integration still attempts a Preview for such a branch, do not repeatedly retrigger it just to turn the irrelevant status green.

When Vercel reports `build-rate-limit`, `Deployment rate limited`, or an equivalent provider quota failure:

1. classify it as a **provider quota blocker**, not a code/build failure;
2. stop further source pushes, manual redeploys, CLI deploys and Deploy Hook retries for that release until capacity returns, because they create additional deployment attempts rather than fixing the cause;
3. keep a production-affecting PR unmerged until a fresh real Preview succeeds;
4. record the blocker in the current project facts/queue when it materially blocks the active release;
5. when capacity returns, retry the existing release path once without introducing a fake source change solely to trigger deployment;
6. do not bypass the limit with alternate accounts/projects, and do not change billing/upgrade plans or paid account settings without explicit user authorization.

If recurring documentation pushes are materially consuming Preview quota, treat branch-level Preview suppression as a separate infrastructure change: verify the exact Vercel configuration behavior first, keep production/main deployments intact, test rollback, and do not change Vercel account settings merely to save quota without authorization.

## 6. Index and measure

Keep `robots.txt`, sitemap, canonical URLs, hosting URL normalization, and internal links synchronized. Submit/inspect important URLs in Search Console when available.

Review performance in cohorts rather than reacting to one day of data. Useful signals:
- indexed/not indexed;
- impressions by query and page;
- CTR at comparable positions;
- average position trend;
- repeat/direct visits where measurable;
- AdSense page RPM and revenue after meaningful traffic exists.

Use actual Search Console queries to decide whether to improve a page, add a distinct adjacent tool, or stop investing in the topic, but only after the product itself has passed the value gate. High impressions with weak/no clicks may indicate poor snippet fit, but they may also indicate a weak underlying user job; do not assume the fix is always SEO copy.

For AI discovery, treat classic SEO as the foundation rather than a separate hack. Keep public pages crawlable, give changing claims primary-source evidence and last-verified dates, use clear answer-first sections/headings, and provide unique utility that a generic summary cannot replace. Measure AI-assistant referral traffic through an authorized analytics reader such as GA4 when available. Use Windsor.ai `searchconsole` for current Google Search Console performance while it remains connected; GSC Wizard is deprecated for new reads. Treat AI citation/visibility as a separate measurement channel rather than inferring it from Google search traffic.

For AI-native retrieval systems, use a provider-aligned, non-adversarial approach. The objective is to fit legitimate discovery/relevance/quality/freshness/authority signals, not to bypass or manipulate them. Diagnose crawl/discovery, indexing, candidate retrieval, ranking/reranking, chunk extraction and downstream citation as separate stages. Never use cloaking, hidden provider-specific text, fake citations, fabricated freshness, synthetic backlinks or deceptive metadata.

## 7. External authority and outreach

When authority/distribution work is active:
- Keep outreach batches small and highly relevant; normally 3–5 targets per round.
- Read the target page before contacting the author/site.
- Do not send generic link-exchange or mass directory requests.
- Immediately record every sent outreach, published community contribution, reply, link, decline, or failed target in `docs/AUTHORITY_AND_AI_DISCOVERY.md`.
- Before a follow-up, read the original Gmail thread and the ledger; never rely on chat memory.
- Do not count an email as a backlink. Mark a link/citation only after independently verifying it exists.
- If a round gets no traction, change target quality or value proposition before increasing volume.

## 8. Maintenance and handoff

The VPS radar may write a latest shortlist under `/var/lib/aineedhelp-radar/`, but do not read it as part of ordinary session startup. Read `latest.md` only when the selected task is topic selection/discovery. Re-check official rules on time-sensitive tools before making claims or when user reports suggest a change.

After every material milestone, update the **Current progress checkpoint** in `PROJECT_CONTEXT.md` before considering the round complete. Also update `docs/MASTER_PLAN.md` whenever a phase status, sprint task, exit gate, or priority materially changes. External authority/outreach/AI-discovery actions must also update `docs/AUTHORITY_AND_AI_DISCOVERY.md` in the same round. AI-native provider tests must update `docs/AI_RETRIEVAL_BENCHMARK.md`, and AIR task status must update `docs/AI_RETRIEVAL_INTEGRATION_TASKS.md`.

Do not duplicate long history in the checkpoint or master plan. Git history/PRs are the historical log; the checkpoint is the current resume point, the master plan is the project-wide progress/task board, the authority/AI ledger is the detailed external-distribution follow-up record, and the AIR task list is the ordered execution queue for AI-native retrieval integration.
