# Phone Hidden-Route Research Method

Last updated: 2026-09-17

## Purpose

Phone Number Lifecycle is valuable only if it can surface practical routes that are difficult for an ordinary user or a generic AI answer to discover, reproduce and maintain.

This method governs research into low-cost retention routes, support-assisted packages, app-only options, conversion flows, roaming/Wi-Fi Calling workarounds, activation edge cases and other legitimate carrier paths that are often poorly documented or intentionally not promoted on public marketing pages.

For hidden-route research, this document supersedes the discovery ordering in `docs/PHONE_NUMBER_LIFECYCLE_PRODUCT_PLAN.md` section 6. Public carrier documentation remains important for hard constraints and conflict checks, but lack of a public product page is **not** a reason to discard a route.

## Product value

The product is not an official-plan directory.

The useful job is:

> Find a low-cost, reproducible phone-number route that real users are successfully using, explain exactly how it works, show where it can fail, and keep the evidence fresh enough that another user can decide whether to try it.

A route that is trivial to find on an operator homepage may still be useful, but it is not the core research advantage. The highest-value discoveries are often:

- support-assisted validity extensions or retention packages;
- app/account options that are not indexed publicly;
- customer-service enrollment flows;
- marketplace/travel-SIM routes that can be converted into a durable personal line;
- hidden or low-cost keep-alive actions;
- overseas activation, roaming, Wi-Fi Calling or SMS continuity paths;
- migration/reissue flows that preserve the same number;
- policy changes and failure modes discovered by users before the carrier updates public documentation.

## Research order

Use this order for hidden-route work:

1. **Community discovery.** Find current first-hand reports, questions, screenshots, support transcripts, app/account screenshots and step-by-step success/failure records.
2. **Replication search.** Look for independent users reporting the same route, price, support instruction or failure mode. Prefer reports separated by author/site/date rather than copied tutorials.
3. **First-party private evidence.** Treat carrier customer-service emails/chats, authenticated account/app screens and support tickets as first-party evidence when provenance is credible. They do not become ordinary hearsay merely because the carrier does not expose the same text on a public URL.
4. **Public official constraint check.** Search current carrier/regulator material for explicit conflicts, eligibility limits, KYC rules, maximum validity, roaming restrictions, cancellation rules and other hard boundaries.
5. **Reproducibility assessment.** Record the exact actions, prerequisites, cost, timing, geography, device/SIM state, support channel and outcome. Separate the route from the anecdote.
6. **Freshness/failure check.** Search for recent reports that the route stopped working, changed price, started requiring new KYC, or now depends on a different support channel.
7. **Production decision.** Decide whether the route is ready for the existing Phone canonical, should remain a monitored candidate, or should be rejected as stale, unsafe, non-reproducible or policy-conflicting.

Do not reverse this order into “search the carrier website first and stop if the page is missing.”

## Evidence classes

Track evidence by what it actually proves, not by whether Google can index it.

### A. Public first-party rule

Carrier/regulator help pages, terms, pricing, app documentation or official purchase pages.

Use for explicit constraints, ordinary pricing, published eligibility and public procedures.

### B. Private first-party support artifact

Carrier email, live-chat transcript, support ticket, authenticated account/app message or other direct carrier communication shared by a user.

Use when the carrier confirms a package, enrollment path, exception or account action that is not publicly advertised. Record the date, channel and claim. Do not expose personal identifiers.

### C. Reproduced carrier/app flow

A current sequence that multiple users can perform in the carrier app/account or through carrier support, even when the carrier does not publish a standalone page for it.

This is often the strongest evidence for hidden routes because it proves operational availability rather than marketing visibility.

### D. Independent first-hand community report

A user describes their own purchase/activation/top-up/support interaction and provides enough detail to identify prerequisites and outcome.

One report is a lead. Multiple independent current reports can establish reproducibility when they agree on the important steps and no stronger evidence contradicts them.

### E. Secondary tutorial / aggregation

A blog, guide or repost that may summarize other users' work. Useful for leads and terminology, but do not count copied claims as independent replication.

Affiliate incentives, copied screenshots and circular sourcing lower confidence.

## Hidden-route admission rule

A route does **not** require a public carrier product page to be usable in the product.

A support-assisted or hidden route can become production-eligible when all material claims have enough evidence for a reasonable user decision. Typical sufficient patterns include:

- a credible private first-party carrier confirmation **plus** at least one independent current successful reproduction; or
- multiple independent current first-hand successful reproductions with materially matching steps, combined with no explicit current carrier/regulator contradiction; or
- a reproducible authenticated carrier/app flow whose price, eligibility and outcome can be directly observed, with community evidence covering practical failure modes.

Confidence must drop when reports are old, copied, geographically inconsistent, dependent on a single support agent, or contradicted by newer failures.

## Required route record

For every hidden-route candidate, capture:

- provider and country;
- discovery source and date;
- purchase/acquisition channel;
- SIM/eSIM starting state;
- identity/KYC prerequisites;
- geography and device prerequisites;
- exact support/app/account steps;
- exact price and currency, including whether money is fee, balance, top-up or recurring charge;
- what the action changes: validity, ownership, roaming, Wi-Fi Calling, eSIM profile, number continuity, etc.;
- whether the same number is preserved;
- overseas SMS/call behavior actually reported;
- keep-alive interval and what resets it;
- failure modes and recovery steps;
- support channel used;
- evidence dates and freshness;
- conflicting reports;
- confidence class;
- last successful reproduction known to us.

The product should explain what a user must actually do, not merely link to a carrier homepage.

## Confidence labels

Use descriptive states rather than a fake numeric score:

- **support-confirmed + replicated** — carrier support/app evidence and at least one independent current reproduction agree;
- **replicated community route** — multiple current independent first-hand reports agree and no current official rule conflicts;
- **emerging / single-report** — interesting and plausible, but not yet sufficiently replicated;
- **conflicting** — meaningful current evidence disagrees;
- **stale** — no recent successful reproduction and policy may have changed;
- **retired** — current evidence shows the route no longer works or violates current rules.

## Role of official documentation

Public official material is still essential, but its role is narrower:

- enforce hard legal/KYC/geography constraints;
- verify ordinary carrier mechanics such as maximum validity, number termination and roaming boundaries;
- detect contradictions with community claims;
- provide stable context around a hidden route.

It is **not** a discovery gate. Operators may not publicly promote the cheapest retention option, support-only package or account-specific flow. “Not found on the public website” means exactly that; it does not mean “not official” or “not real.”

When a current explicit official rule conflicts with community claims, investigate the conflict rather than automatically choosing whichever source is easier to cite. The community report may be stale, the official page may describe a different plan, or support may be applying an account-specific exception.

## AIS Thailand example and correction

The 2026-09-17 AIS Thailand discussion exposed the previous research-model defect.

The thread included a direct AIS customer-service reply recommending a `49B Validity 365 Days package` for prepaid users who mainly keep the number for SMS/OTP or overseas use. The carrier's public site also exposes a 365-day prepaid validity mechanism, but does not present the same THB 49 support-assisted offer as a normal indexed product page.

Correct classification:

- the support email is a **private first-party support artifact**;
- multiple current user reports describing the same support-assisted 49-baht/365-day route are **replication evidence**;
- the public AIS 365-day validity page and prepaid terms are **constraint/corroboration evidence**;
- the missing public THB 49 product page is a public-documentation gap, not proof that the route is unofficial.

Future research must not repeat the earlier mistake of collapsing “not publicly indexed” into “unverified community claim.”

## Search targets

The radar/research loop should actively look for phrases and patterns such as:

- 保号 / keep number / extend validity / validity package;
- 客服开通 / support enabled / retention package / hidden plan;
- 低月租 / no monthly fee / yearly validity / cheap top-up;
- 转个人 / ownership transfer / personal-use conversion;
- 换 eSIM / replacement QR / same number / SIM swap;
- 国外激活 / activate abroad / first attach / roaming activation;
- Wi-Fi Calling / VoWiFi / SMS over Wi-Fi / OTP abroad;
- 充值延长 / top-up extends validity / app-only recharge;
- 漫游收短信 / free incoming SMS / roaming SMS;
- 套餐下架 / stopped working / KYC changed / support refused;
- actual carrier chat/email wording and the conditions agents request.

Search communities before assuming a route does not exist.

## Safety and legitimacy

Hidden-route research does not mean bypass research.

Do not recommend forged KYC, stolen identities, deceptive support stories, unauthorized account access, circumventing carrier security, breaking geography restrictions through evasion, or violating applicable law/terms.

A legitimate support-assisted package, carrier-approved conversion, app option or documented community workflow is in scope even when it is not advertised publicly.

## Maintenance

Hidden routes decay faster than public plans. Therefore:

- record the last known successful reproduction date;
- treat a new support refusal or changed KYC request as a material signal;
- prefer several independent recent reports over dozens of copied old tutorials;
- recheck high-value hidden routes more frequently than ordinary public plans;
- never silently convert an old successful report into a permanent rule;
- show users when a route depends on support discretion or has recent conflicting outcomes.

The target is not certainty. The target is a much better, evidence-backed decision than a generic search or generic AI answer can provide.