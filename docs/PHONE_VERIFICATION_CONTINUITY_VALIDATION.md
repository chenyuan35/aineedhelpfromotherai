# Phone Verification Continuity — Validation Ledger

Last updated: 2026-09-17

## Purpose

This is the durable execution ledger for validating whether **AI account verification continuity** should become a stronger decision layer inside the existing Phone Number Lifecycle product.

It is not authorization to create a new product surface, URL family, provider directory, backend, account system, SMS service, temporary-number marketplace, or broad content program.

GitHub Issue #78 remains the discussion/evidence thread. This file is the stable summary of what is being tested, what has been verified, what remains unknown, and what would stop or narrow the work.

## Current hypothesis

The sharper user job may be:

> Before I bind an important AI/service account to a phone number, tell me whether I may need that same number again later and what happens if I lose control of it.

Candidate memory question:

> **Will I need this number again?**

Candidate supporting line:

> **Verify once ≠ need once.**

These remain hypotheses, not approved production copy. A 2026 competitor scan found temporary-number/rental sellers already using very similar wording, so the phrase itself is **not** a moat. Any product advantage must come from maintained first-party evidence, cross-service continuity answers, retention guidance, freshness and explicit unknowns.

## Product boundary

This work stays inside the existing **Phone Number Lifecycle** surface.

The current production URL remains:

`/tools/phone-number-survival-guide/`

Do not create provider-specific, country-specific, keyword-variant, Codex-only, Claude-only or verification-only production pages during validation.

Do not add a service merely to make a matrix look complete.

Do not treat temporary-number, free-number, fake-number, bypass or OTP-circumvention demand as the target audience. Those queries may be large, but they are not the product direction.

## User problem to validate

For each supported service, answer only what can be verified:

- Is a phone number required now, and for which step?
- Is it only an initial signup/API-key requirement, or can the service request the number again later?
- If it can be requested again, is the timing fixed, trigger-based, risk-based, or undocumented?
- Do MFA, passkeys, security keys, trusted devices or other login methods remove the phone requirement, or are they a separate authentication layer?
- Can the associated phone number be changed or unlinked later?
- What happens if the original number is lost, recycled, temporary or inaccessible?
- What number classes are accepted/rejected/unknown?
- If long-term control matters, what is the cheapest documented and safest documented way to keep the number alive?
- What first-party source supports each claim, and when was it last verified?

Unknown must remain unknown. Do not invent a "next verification date", recurrence interval, success rate or risk probability.

## Completed evidence — 2026-09-17

### Project/state validation

- Re-read GitHub `main` fact sources before execution: `AGENTS.md`, `PROJECT_CONTEXT.md` checkpoint, `docs/MASTER_PLAN.md`, `docs/OPERATING_WORKFLOW.md`.
- Read `docs/PLUGIN_ORCHESTRATION.md` before using connected research/measurement plugins.
- Confirmed the current phase remains Phone search/behavior validation, with user-facing scope frozen to Phone + Reset + Relay.
- Production remains unchanged during this research round.

### Four-service evidence matrix

The matrix is deliberately bounded to Codex, ChatGPT, OpenAI API and Claude.

| Service | Phone required now | Later / repeated phone evidence | Timing | MFA / passkey relationship | Change / unlink status | Number restrictions | Continuity implication | Confidence |
|---|---|---|---|---|---|---|---|---|
| **Codex** | A phone step can appear during Codex authentication for some existing accounts; there is no current public first-party schedule describing exactly who is prompted or when. | Multiple 2026 issues in the official `openai/codex` repository document already-authenticated users being blocked by an old/inaccessible number, including users who can still access ChatGPT. | **Unknown / not publicly fixed.** Current evidence supports an unpredictable step-up, not a calendar recurrence claim. | GitHub issue evidence shows passkey, MFA or hardware-key authentication can succeed before a separate Codex phone gate still appears. This is observed product behavior, not a published guarantee about all accounts. | OpenAI's current account help says the account-associated phone number cannot be changed for ChatGPT/API accounts. Codex issue reports show this can become a lockout when the legacy number is inaccessible. | OpenAI phone-verification guidance rejects landline, VoIP, Google Voice and premium numbers and requires supported mobile SMS, with WhatsApp in selected regions. Whether every Codex flow uses the same acceptance policy is not separately documented. | **Strongest continuity case.** Losing control of a number can block Codex even when other authentication works. | High for the documented failure mode; medium for generalizing it to all Codex accounts. |
| **ChatGPT** | Current OpenAI help says ordinary new OpenAI account creation and ChatGPT usage no longer generally require phone verification. | No first-party evidence in this pass establishes a fixed recurring phone-verification requirement for ordinary ChatGPT use. | **Unknown / no fixed recurrence established.** | OpenAI documents passkeys, MFA and Advanced Account Security for account sign-in/security. These should not be presented as proof that a separate product-specific verification gate can never occur. | OpenAI currently says the account-associated phone number cannot be changed or updated for ChatGPT/API accounts. | Where OpenAI phone verification applies, current help rejects landline, VoIP, Google Voice and premium numbers. | Phone continuity is currently a weaker primary story for ordinary ChatGPT than for Codex. The inability to update an associated number is still relevant account-lifecycle context. | High for current public signup/use and change-number statements. |
| **OpenAI API** | Current OpenAI help says phone verification is required when generating the **initial API key**, not subsequent API keys. | No first-party evidence in this pass establishes recurring phone verification after that initial API-key step. | Initial requirement is documented; later recurrence is **not established**. | Login MFA/passkeys are a separate account-security layer and should not be conflated with the initial API phone-verification requirement. | OpenAI currently says the account-associated phone number cannot be changed or updated. | Current help rejects landline, VoIP, Google Voice and premium numbers. A phone number can currently be used for phone verification up to three times across accounts under the documented API-key verification rule. | A durable accepted number matters at onboarding, but current evidence is weaker for repeated-number dependence than Codex. | High for initial-key rule, number class and account-limit guidance. |
| **Claude** | Anthropic currently requires phone verification when first creating a Claude account. | No first-party evidence in this pass establishes a Codex-like recurring phone step-up schedule. | **Initial-only is documented; later recurrence remains unknown.** | Current Claude login guidance describes Google/email login after creation; no first-party evidence found that an MFA/passkey layer either causes or eliminates recurring phone verification. | Anthropic says users cannot directly change the verified number after verification. A separate current support article says Support can be asked to **unlink** a phone number from an old account when the user needs to reuse it for a new account; this is not the same as self-service replacement on the existing account. | VoIP, Google Voice, app-generated numbers, landlines and numbers that cannot receive texts are rejected. One phone number can currently verify up to three Claude accounts. | Durable control is explicitly encouraged by Anthropic for initial verification, but a repeated-verification lockout pattern comparable to Codex is not established. | High for signup/restrictions/unlink guidance; low-to-medium for any recurring-verification theory. |

### First-party sources checked in this pass

OpenAI:

- `https://help.openai.com/en/articles/8983040-what-does-phone-verification-look-like`
- `https://help.openai.com/en/articles/9135134-how-to-change-the-phone-number-associated-with-your-account`
- `https://help.openai.com/en/articles/8983024-can-i-use-a-premium-number-landline-google-voice-or-other-voip-phone-number`
- `https://help.openai.com/en/articles/8983031-how-many-times-can-i-use-the-same-phone-number-to-complete-the-phone-verification-associated-with-an-openai-accounts-first-api-key-generation`
- `https://help.openai.com/en/articles/20001039-passkeys-to-secure-your-openai-account`
- `https://help.openai.com/en/articles/20001221-advanced-account-security`

Anthropic:

- `https://support.claude.com/en/articles/8287232-verify-your-phone-number`
- `https://support.claude.com/en/articles/13189465-log-in-to-your-claude-account`
- `https://support.claude.com/en/articles/8452276-how-do-i-change-the-email-address-associated-with-my-account`

These rules are time-sensitive and must be re-checked at production-copy time.

### Codex failure evidence

The strongest 2026 failure mode remains recurring/step-up verification tied to an inaccessible legacy number.

Examples tracked in the official OpenAI Codex repository include:

- `openai/codex#25749` — authenticated account can use ChatGPT but Codex requests an inaccessible legacy number; thread contains many same-situation reports.
- `openai/codex#25670` — old number blocks Codex despite other account authentication.
- `openai/codex#25737` — security-key / Advanced Account Security succeeds, then Codex still presents SMS step-up.
- `openai/codex#25820` — Pro subscriber blocked by phone-verification rate limiting during Codex OAuth.
- `openai/codex#25837` — user changed countries/numbers and cannot use Codex because the account number cannot be changed.
- `openai/codex#28349` and related duplicates — paid/work accounts affected by phone verification and number-account limits.

This supports the distinction:

> **Account login authentication and service-specific phone verification can be separate layers.**

Do not generalize individual bug reports into a universal Codex rule or fixed recurrence interval.

### Demand validation — English vs Chinese

Current evidence shows a real but uneven market.

**English:**

- The strongest evidence is concentrated in the official OpenAI Codex GitHub issue tracker plus at least one Reddit thread specifically asking why Codex wants the phone number again after prior verification.
- English traditional keyword databases still do not return reliable volume for exact new phrases such as `codex phone verification`, `claude phone verification` and `chatgpt phone verification`.
- Cleaner generic continuity queries exist but are small: `how to change phone number for 2 step verification` (~110/mo), `change phone number for 2 step verification` (~40), `change verification phone number` (~30), `how to keep your old phone number` (~50), and `keep phone number without plan` (~10) in the current SE Ranking US dataset.
- Several natural-language loss/recovery phrases in this pass returned no SE Ranking data. Record that as database absence, not zero demand.

**Chinese:**

- The May–June 2026 search pass surfaced multiple independent V2EX threads about Codex phone verification, repeated verification, inaccessible temporary numbers and whether a long-term SIM is needed.
- NodeLoc also has a June 2026 thread reporting multiple accounts encountering Codex secondary phone verification.
- Commercial/promotional posts appeared around the same problem, suggesting sellers noticed the demand quickly; those posts are not treated as independent policy evidence.

Interpretation: Chinese communities are currently the denser **early-warning radar** for this specific Codex problem. English evidence is more fragmented across GitHub/Reddit but maps better to the site's target market. This supports using Chinese communities for discovery while requiring English search/community evidence and first-party documentation before changing the English product.

### Search-demand evidence

SE Ranking remains usable under the current connected account, so no paid Ubersuggest/Semrush/Ahrefs upgrade is needed for this validation.

Broad US verification demand is much larger but heavily polluted by temporary/free-number intent:

- `verification phone number`: ~5,400/mo
- `verify phone number`: ~2,400/mo
- `sms verification`: ~3,200/mo
- `temporary phone number for verification`: ~3,600/mo
- `free phone number for verification`: ~4,400/mo

The product should **not** chase those head terms as a temporary-number acquisition surface.

### Competition / SERP scan

The first bounded Firecrawl search materially changed the interpretation of the candidate memory phrase.

Results prominently included temporary-number/rental sellers such as PVAPins and SMSPin. Multiple PVAPins pages explicitly use ideas like:

- ask whether the user will need the number again;
- use one-time activation for one-off verification;
- rent a number for re-login, recovery or repeated verification.

This means the underlying question **already exists commercially**. The opportunity is therefore **not** ownership of the phrase or a generic "one-time vs rental number" recommendation.

What the current scan did **not** surface is a mature independent product whose primary job is to maintain a cross-service, first-party-source-backed continuity matrix covering:

- whether the service requires phone verification now;
- whether the same number may be needed later;
- whether timing is fixed, trigger-based or unknown;
- whether MFA/passkeys are a separate layer;
- whether the number can be changed or unlinked;
- what happens after number loss/recycling;
- which number classes are supported;
- what long-term retention action/cost is justified;
- when each claim was last verified.

Temporary-number sellers are therefore **adjacent competitors**, not evidence that the maintained continuity job is already solved. Their presence also reinforces the anti-scope rule: do not drift into selling or recommending disposable verification numbers simply because those SERPs are large.

### First-party site evidence

GSC remains too immature to judge the Phone launch. Phone was publicly released on 2026-09-16, while the latest settled Search Console date returned in this pass is 2026-09-14. The Phone URL therefore has no meaningful settled post-release search-performance window yet.

The existing Cursor Reset page has real reset-intent impressions from earlier settled data and remains a separate proven search signal.

## Current decision checkpoint — 2026-09-17

**No production repositioning.**

The current evidence supports a **provisional NARROW** posture:

- verification continuity is strong enough to keep and deepen as a decision layer inside Phone Number Lifecycle;
- Codex is the strongest recurring-lockout case by a wide margin;
- Claude provides a second long-term-number consequence, but mainly through initial verification + no self-service number replacement, not proven recurring step-up;
- ordinary ChatGPT and OpenAI API do not currently establish the same repeated-number dependence;
- the candidate phrase is already used by temporary-number/rental sellers, so a slogan-first reposition would be weak differentiation;
- our own Phone search/behavior data has not settled yet.

Therefore the default next product shape, **if later production evidence justifies a change**, is a compact evidence-backed **verification continuity result/module inside the existing Phone canonical URL**, not a Codex page, not a new product family, and not a whole-site reposition.

This is an interim product checkpoint, not authorization to build. A final KEEP / ADJUST / NARROW decision still waits for settled Phone behavior and one final review against the gate below.

## Evidence still required

### A. Existing Phone behavior

Wait for settled evidence after the Sep 16 release and measure:

- indexing;
- Phone queries/impressions/clicks;
- `phone_route_result` behavior;
- reminder/calendar export;
- revisit/direct behavior;
- repeated unknowns or failure points.

Do not use early zeroes as a negative verdict.

### B. Retention/action mapping

For the four current services, map only the **documented action** that follows from the matrix. Do not expand providers.

Examples of allowed outputs:

- `Codex: keep durable control of the number if the account already depends on it; a later step-up may occur, but timing is not publicly fixed.`
- `ChatGPT: ordinary use currently does not generally require phone verification; do not imply a recurring schedule.`
- `OpenAI API: initial API-key generation currently requires phone verification; later API-key creation does not under current help guidance.`
- `Claude: use a supported SMS-capable number you can retain long term; direct number replacement is unavailable, though Support can be asked to unlink a number from an old account for reuse.`

Any carrier/keep-alive cost recommendation must continue to come from the existing Phone evidence model, not from the AI-service matrix itself.

## Decision gate

No production repositioning is allowed until all of the following are true:

1. There are multiple independent demand signals, not one viral thread.
2. The result is useful beyond a single Codex incident: either at least one additional important service has a meaningful long-term phone-control consequence, or first-party Phone usage/search data independently proves the broader continuity job.
3. Current first-party documentation supports the service-specific claims shown to users.
4. The result is clearly more useful than a generic eSIM guide, temporary-number/rental site, isolated support article or simply asking an AI assistant a one-off question.
5. The change deepens the existing canonical Phone URL without creating a new product family or doorway-page set.
6. Maintenance remains bounded to a small evidence matrix and existing retention model.
7. Settled Phone search/behavior data does not point to a more valuable lifecycle stage that should be deepened first.

## Stop / adjust criteria

Stop or narrow this work if any of the following becomes true:

- The pain remains essentially Codex-only with little evidence of a broader recurring job.
- Search/community demand is dominated by disposable-number or bypass intent rather than continuity/retention intent.
- Official platform rules are too opaque to provide a better answer than "unknown" for most services.
- Maintaining current service rules would require high-cost scraping, private/internal APIs, paid data dependencies or frequent manual work disproportionate to traffic.
- Phone indexing/usage data shows users primarily value another lifecycle stage more strongly; deepen that proven stage first.

If Codex remains uniquely strong, treat it as an evidence-backed scenario inside the existing Phone product rather than rebuilding the whole product around Codex.

## Anti-scope-creep rules

During validation, do **not**:

- create a fourth product surface;
- create a second Phone canonical URL;
- add a provider/service just to fill the matrix;
- build email reminders, accounts, login, database state, SMS delivery or OTP handling;
- build a temporary-number marketplace or affiliate directory;
- add country/provider SEO pages;
- introduce a paid SEO/data dependency;
- run new workloads on the resource-tight trial observer VPS;
- change homepage positioning or production copy before the decision gate is met.

A new idea is recorded first. It becomes implementation only if it passes the current product stage, evidence, cost, maintenance and stop-condition checks.

## Immediate execution order

1. **DONE — evidence matrix.** Maintain only Codex, ChatGPT, OpenAI API and Claude unless a new service has an independent demand signal.
2. **DONE — first English-vs-Chinese demand comparison.** Refresh only when a material new 2026 signal appears.
3. **DONE — first competitor classification.** Temporary-number/rental sellers are adjacent competitors; the phrase alone is not differentiation.
4. **WAITING FOR SETTLED DATA — Phone behavior.** Re-check GSC/GA4 after the Sep 16 release has a real settled window.
5. **NEXT AFTER DATA — final decision.** Choose one: **KEEP current lifecycle framing**, **ADJUST the existing Phone framing toward continuity**, or **NARROW continuity to a compact AI-account scenario/result module inside the current product**.
6. Only after that decision may a production change be designed; any code/content change still follows fresh branch/worktree → tests → PR → CI/preview → merge → production verification.

## Tracking

- GitHub Issue: #78 — `Validate AI verification continuity as the Phone product anchor`
- Product plan: `docs/PHONE_NUMBER_LIFECYCLE_PRODUCT_PLAN.md`
- Current project status: `PROJECT_CONTEXT.md`
- Project priorities: `docs/MASTER_PLAN.md`

Update this ledger when evidence materially changes the decision, a validation item is completed, a blocker appears, or the direction is stopped/narrowed. Do not log every minor search query as a project milestone.
