# Phone Verification Continuity — Validation Ledger

Last updated: 2026-09-17

## Purpose

This document is the durable execution ledger for validating whether **AI account verification continuity** should become the strongest memory point inside the existing Phone Number Lifecycle product.

It is not authorization to create a new product surface, new URL family, provider directory, backend, account system, SMS service, or broad content program.

GitHub Issue #78 is the discussion/evidence thread. This document is the stable summary of what is being tested, what has been completed, what remains, and what would stop the work.

## Current hypothesis

The sharper user job may be:

> Before I bind an important AI/service account to a phone number, tell me whether I may need that same number again later and what happens if I lose control of it.

Candidate memory question:

> **Will I need this number again?**

Candidate supporting line:

> **Verify once ≠ need once.**

These are hypotheses only. They are not approved production copy.

## Product boundary

This work stays inside the existing **Phone Number Lifecycle** surface.

The current production URL remains:

`/tools/phone-number-survival-guide/`

Do not create provider-specific, country-specific, keyword-variant, Codex-only, Claude-only, or verification-only production pages during validation.

Do not add new Phone providers merely to make the matrix look complete.

Do not treat temporary-number, free-number, fake-number, bypass, or OTP-circumvention demand as the target audience. Those queries may be large, but they are not the product direction.

## User problem to validate

For each supported service, answer only what can be verified:

- Is a phone number required now, and for which step?
- Is it only an initial signup/API-key requirement, or can the service request the number again later?
- If it can be requested again, is the timing fixed, trigger-based, risk-based, or undocumented?
- Do MFA, passkeys, security keys, trusted devices, or other login methods remove the phone requirement, or are they a separate authentication layer?
- Can the associated phone number be changed later?
- What happens if the original number is lost, recycled, temporary, or inaccessible?
- What number classes are accepted/rejected/unknown?
- If long-term control matters, what is the cheapest documented and safest documented way to keep the number alive?
- What first-party source supports each claim, and when was it last verified?

Unknown must remain unknown. Do not invent a "next verification date", recurrence interval, success rate, or risk probability.

## Completed evidence — 2026-09-17

### Project/state validation

- Re-read GitHub `main` fact sources before execution: `AGENTS.md`, `PROJECT_CONTEXT.md` checkpoint, `docs/MASTER_PLAN.md`, `docs/OPERATING_WORKFLOW.md`.
- Confirmed current phase remains Phone search/behavior validation, with product scope frozen to Phone + Reset + Relay.
- Production remains unchanged during this research round.

### First-party platform evidence

- OpenAI ordinary ChatGPT account creation/use currently does not generally require phone verification; first OpenAI API-key creation still has a phone-verification requirement under current official guidance.
- OpenAI currently documents that the associated phone number cannot be changed for ChatGPT/API accounts.
- OpenAI passkeys / Advanced Account Security affect sign-in authentication, but current evidence does not establish that they remove a separate Codex phone-verification gate.
- Anthropic currently requires phone verification for initial Claude account creation, rejects VoIP/Google Voice/app-generated numbers, limits one number to three verified accounts, and states the verified number cannot be changed through normal self-service. Anthropic explicitly advises using a number the user can retain long term.
- No first-party evidence has yet been found showing a fixed recurring Claude phone-verification schedule comparable to Codex reports.

### Codex continuity evidence

Recent OpenAI Codex GitHub issues show the concrete failure mode we are testing:

- A user can successfully use Google OAuth, MFA, trusted-device authentication and ChatGPT, yet be blocked from Codex because an old phone number is inaccessible.
- Other reports show Codex phone verification blocking otherwise authenticated accounts and failing to send verification codes.
- Current evidence supports describing Codex re-verification timing as **unpredictable / not publicly fixed**, not as a recurring calendar schedule.

Key examples are tracked in Issue #78, including openai/codex#25749 and #25828.

### Search-demand evidence

SE Ranking is available and currently has sufficient units, so paid Ubersuggest/Semrush upgrades are not required for this validation.

US keyword data shows a large broad verification market but mixed intent:

- `verification phone number`: about 5,400 monthly searches in SE Ranking.
- `verify phone number`: about 2,400.
- `sms verification`: about 3,200.
- `temporary phone number for verification`: about 3,600.
- `free phone number for verification`: about 4,400.

Most large-volume terms skew toward temporary/free-number acquisition and are therefore not treated as direct product-fit evidence.

Closer continuity/recovery intent is smaller but cleaner:

- `how to change phone number for 2 step verification`: about 110/month, low reported difficulty.
- `change verification phone number`: about 30/month, low reported difficulty.
- `how to keep your old phone number`: about 50/month.
- `keep phone number without plan`: about 10/month.

Exact new AI-brand queries such as `codex phone verification`, `claude phone verification`, and `chatgpt phone verification` currently return no reliable volume in SE Ranking. This is recorded as **insufficient database volume**, not as proof of zero demand.

### First-party site evidence

GSC settled data currently reaches through 2026-09-14, while Phone was publicly released on 2026-09-16. Therefore Phone search performance is not yet mature enough to justify production repositioning.

The existing Cursor Reset page already has real query impressions for reset-intent phrases, so its measured behavior remains a separate active signal rather than being displaced by this Phone hypothesis.

## Evidence still required

### A. Service evidence matrix

Build and maintain a compact matrix for only these initial services:

1. Codex
2. ChatGPT
3. OpenAI API
4. Claude

Fields:

- phone required now;
- requirement purpose;
- repeated/re-verification evidence;
- timing model: fixed / trigger-based / unknown;
- MFA/passkey substitution status;
- number-change capability;
- lost-number recovery path;
- number-class restrictions;
- first-party source URL;
- source date / last verified;
- community failure evidence;
- confidence.

Do not add another service unless it has a real independent demand signal.

### B. Demand validation

Continue with three distinct evidence types rather than relying on one SEO database:

- current English search/SERP data;
- recent English community/problem reports;
- recent Chinese community/problem reports.

Chinese communities are used as a demand radar. The English site remains the target product/traffic market unless later evidence justifies a deliberate strategy change.

### C. Competition validation

Determine whether any current product already maintains the same cross-platform decision answer:

- Will I need this number again?
- Can I replace it?
- Does MFA/passkey make the number irrelevant?
- What happens if I lose it?
- How do I keep it cheaply and safely?

Generic eSIM comparison sites, temporary-number sellers, OTP services, and isolated official help pages do not count as equivalent products unless they actually solve this continuity job.

### D. Existing Phone behavior

Wait for settled evidence after the Sep 16 release and measure:

- indexing;
- Phone queries/impressions/clicks;
- `phone_route_result` behavior;
- reminder/calendar export;
- revisit/direct behavior;
- repeated unknowns or failure points.

Do not use early zeroes as a negative verdict.

## Decision gate

No production repositioning is allowed until all of the following are true:

1. There are multiple independent demand signals, not one viral thread.
2. At least Codex plus one additional important service show meaningful long-term phone-control consequences, or search/usage evidence independently demonstrates the broader continuity job.
3. Current first-party documentation supports the service-specific claims shown to users.
4. The proposed result is clearly more useful than a generic eSIM guide, temporary-number site, isolated support article, or simply asking an AI assistant a one-off question.
5. The change can deepen the existing canonical Phone URL without creating a new product family or doorway-page set.
6. Maintenance cost remains bounded: a small evidence matrix, not a universal account-security database.

## Stop / adjust criteria

Stop or narrow this work if any of the following becomes true:

- The pain remains essentially Codex-only with little evidence of a broader recurring job.
- Search/community demand is dominated by disposable-number or bypass intent rather than continuity/retention intent.
- Official platform rules are too opaque to provide a better answer than "unknown" for most services.
- Maintaining current service rules would require high-cost scraping, private/internal APIs, paid data dependencies, or frequent manual work disproportionate to traffic.
- Phone indexing/usage data shows users primarily value another lifecycle stage more strongly; deepen that proven stage first.

If Codex remains uniquely strong, treat it as an evidence-backed scenario inside the existing Phone product rather than rebuilding the whole product around Codex.

## Anti-scope-creep rules

During validation, do **not**:

- create a fourth product surface;
- create a second Phone canonical URL;
- add a provider/service just to fill the matrix;
- build email reminders, accounts, login, database state, SMS delivery, or OTP handling;
- build a temporary-number marketplace or affiliate directory;
- add country/provider SEO pages;
- introduce a paid SEO/data dependency;
- run new workloads on the resource-tight trial observer VPS;
- change homepage positioning or production copy before the decision gate is met.

A new idea is recorded first. It becomes implementation only if it passes the current product stage, evidence, cost, maintenance and stop-condition checks.

## Immediate execution order

1. Complete the four-service evidence matrix: Codex, ChatGPT, OpenAI API, Claude.
2. Finish current English vs Chinese demand comparison using recent 2026 evidence.
3. Complete SERP/competitor scan for an existing verification-continuity product.
4. Wait for settled Phone GSC/GA4 behavior after the Sep 16 release; do not force a conclusion before the data exists.
5. Make one explicit decision: **KEEP current lifecycle framing**, **ADJUST existing Phone framing toward verification continuity**, or **NARROW verification continuity to a Codex/AI-account scenario inside the current product**.
6. Only after that decision may a production change be designed; any code/content change still follows fresh branch/worktree → tests → PR → CI/preview → merge → production verification.

## Tracking

- GitHub Issue: #78 — `Validate AI verification continuity as the Phone product anchor`
- Product plan: `docs/PHONE_NUMBER_LIFECYCLE_PRODUCT_PLAN.md`
- Current project status: `PROJECT_CONTEXT.md`
- Project priorities: `docs/MASTER_PLAN.md`

The ledger should be updated when evidence materially changes the decision, a validation item is completed, a blocker appears, or the direction is stopped/narrowed. Do not log every minor search query as a project milestone.
