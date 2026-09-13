# Operating Workflow

This is the default execution loop for `aineedhelpfromotherai.com`.

## 0. Resume without rescanning

At the start of a new session, read `AGENTS.md`, then the **Current progress checkpoint** at the top of `PROJECT_CONTEXT.md`, then `docs/MASTER_PLAN.md`, then this workflow. Do not perform a full repository/VPS/deployment audit unless the current task needs it or the checkpoint is stale/contradictory.

The checkpoint must answer: what is live, what was just completed, what is blocked/waiting, and what the next concrete action is. `docs/MASTER_PLAN.md` must answer: which project phase is active, which sprint task comes next, and what exit gate moves the project forward.

When the current task involves external authority, outreach, referral distribution, or AI-answer visibility, also read `docs/AUTHORITY_AND_AI_DISCOVERY.md` before acting. It is the durable ledger for who was contacted, what was sent, what happened, and what follow-up is due.

## 1. Discover

Collect candidate queries from the VPS keyword radar, Ubersuggest when available, autocomplete, Search Console, current product documentation, and repeated public user questions.

A candidate is stronger when it has several of these traits:
- clear action or calculation intent;
- repeated/return usage;
- changing rules or time-sensitive status;
- can run client-side;
- low server cost;
- one obvious search query maps to one useful page;
- incumbent results are weak, stale, slow, confusing, or overly complex.

Do not invent search-volume data when a metrics provider is unavailable.

## 2. Score and select

Score candidates on demand signal, competition, monetizable intent, implementation cost, repeat-visit potential, and policy freshness. Prefer candidates with multiple independent signals rather than one anecdote.

Default batch size: 1–2 new tools. Larger batches require unusually strong evidence and shared implementation.

Before coding a changing-product tool, identify an official source for the rule being calculated. If the provider exposes account-specific reset times, let the user enter/anchor that value instead of inventing a universal time.

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

## 6. Index and measure

Keep `robots.txt`, sitemap, canonical URLs, hosting URL normalization, and internal links synchronized. Submit/inspect important URLs in Search Console when available.

Review performance in cohorts rather than reacting to one day of data. Useful signals:
- indexed/not indexed;
- impressions by query and page;
- CTR at comparable positions;
- average position trend;
- repeat/direct visits where measurable;
- AdSense page RPM and revenue after meaningful traffic exists.

Use actual Search Console queries to decide whether to improve a page, add a distinct adjacent tool, or stop investing in the topic.

For AI discovery, treat classic SEO as the foundation rather than a separate hack. Keep public pages crawlable, give changing claims primary-source evidence and last-verified dates, use clear answer-first sections/headings, and provide unique utility that a generic summary cannot replace. Measure AI-assistant referral traffic through GA4/GSC Wizard and citation/AI visibility through Bing Webmaster or Search Console when those reports are available.

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

The VPS radar runs daily and writes its latest shortlist under `/var/lib/aineedhelp-radar/`. Review newly appearing phrases first. Re-check official rules on time-sensitive tools before making claims or when user reports suggest a change.

After every material milestone, update the **Current progress checkpoint** in `PROJECT_CONTEXT.md` before considering the round complete. Also update `docs/MASTER_PLAN.md` whenever a phase status, sprint task, exit gate, or priority materially changes. External authority/outreach/AI-discovery actions must also update `docs/AUTHORITY_AND_AI_DISCOVERY.md` in the same round.

Do not duplicate long history in the checkpoint or master plan. Git history/PRs are the historical log; the checkpoint is the current resume point, the master plan is the project-wide progress/task board, and the authority/AI ledger is the detailed external-distribution follow-up record.
