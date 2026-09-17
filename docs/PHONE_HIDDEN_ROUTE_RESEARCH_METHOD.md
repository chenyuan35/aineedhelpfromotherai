# Phone Route Research Method — Community-First / Hidden-Route

Last updated: 2026-09-17

## Purpose

Phone Number Lifecycle is valuable only if it can surface practical routes that are difficult for an ordinary user or a generic AI answer to discover, reproduce and maintain.

This method governs **all Phone route research**, not only unusual edge cases. It covers low-cost retention routes, support-assisted packages, app-only options, conversion flows, roaming/Wi-Fi Calling paths, activation edge cases, ordinary public plans, and current failure modes.

For Phone research, this document supersedes the evidence/discovery ordering in `docs/PHONE_NUMBER_LIFECYCLE_PRODUCT_PLAN.md` section 6 wherever the older wording implies that public carrier pages should be searched or trusted first.

The governing rule is:

> Community and real-user operations discover the route. Reproduction determines whether it is real and useful. Carrier/regulator material checks hard constraints and conflicts. Public marketing visibility does not decide whether a route exists, is valuable, or deserves research priority.

## Product value

The product is not an official-plan directory and must not become a cleaner copy of carrier websites.

The useful job is:

> Find low-cost, reproducible phone-number routes that real users are successfully using, explain exactly how they work, show where they fail, and keep the evidence fresh enough that another user can decide whether to try them.

A route that is trivial to find on an operator homepage may still be included when useful, but it is not the research advantage. The highest-value discoveries are often:

- support-assisted validity extensions or retention packages;
- app/account options that are not indexed publicly;
- customer-service enrollment flows;
- marketplace/travel-SIM routes that can be converted into a durable personal line;
- hidden or unusually cheap keep-alive actions;
- overseas activation, roaming, Wi-Fi Calling or SMS continuity paths;
- migration/reissue flows that preserve the same number;
- account-specific or legacy options still being honored in practice;
- policy changes, refusal patterns and failure modes discovered by users before public documentation changes.

If a user can get the same useful answer by asking a generic AI to summarize the carrier homepage, the Phone product has not done enough research.

## Research order

Use this order for **every Phone route**:

1. **Community discovery.** Find current first-hand reports, questions, screenshots, support transcripts, app/account screenshots, step-by-step success records and failure records.
2. **Replication search.** Look for independent users reporting the same route, price, support instruction, activation behavior or failure mode. Prefer reports separated by author/site/date rather than copied tutorials.
3. **Private first-party evidence.** Treat carrier customer-service emails/chats, authenticated account/app screens, support tickets and carrier-issued messages as first-party operational evidence when provenance is credible. They do not become ordinary hearsay merely because the same text is absent from a public URL.
4. **Reproducibility assessment.** Record exact actions, prerequisites, cost, timing, geography, device/SIM state, support channel and outcome. Separate the route from the anecdote.
5. **Freshness/failure check.** Search for recent reports that the route stopped working, changed price, started requiring different KYC, became agent-dependent, or now uses another support channel.
6. **Public official constraint check.** Only after the practical route is understood, search current carrier/regulator material for explicit legal/KYC/geography/termination restrictions, maximum validity, roaming limits and other hard boundaries that may conflict with or narrow the route.
7. **Production decision.** Decide whether the route is ready for the existing Phone canonical, should remain a monitored candidate, or should be rejected as stale, unsafe, non-reproducible or genuinely policy-conflicting.

Do not reverse this into “search the carrier website first and stop if the page is missing.”

## What public official material is and is not for

Public carrier/regulator material is useful for:

- hard legal/KYC/geography constraints;
- termination, number-loss and portability rules;
- published maximum validity or roaming boundaries;
- detecting explicit contradictions with a community route;
- stable background mechanics that help interpret an operational workflow.

Public material is **not**:

- a discovery gate;
- a requirement for admitting a route;
- proof that an unadvertised route does not exist;
- a ranking signal that makes an advertised plan preferable to a cheaper support-assisted one;
- a reason to discard current first-party support messages or reproduced app/account behavior;
- a substitute for checking whether real users can still complete the route today.

Operators have incentives to promote profitable/default products rather than the cheapest retention option. Therefore absence from a public product page carries little weight by itself.

## Evidence classes

Track evidence by what it actually proves, not by whether Google can index it.

### A. Reproduced carrier/app/support flow

A current sequence that multiple users can perform in the carrier app/account or through carrier support.

This is often the strongest operational evidence for hidden routes because it proves present availability rather than marketing visibility.

### B. Private first-party support artifact

Carrier email, live-chat transcript, support ticket, authenticated account/app message, carrier SMS or other direct carrier communication shared by a user.

Use when the carrier confirms a package, enrollment path, exception or account action that is not publicly advertised. Record date, channel and exact claim. Do not expose personal identifiers.

### C. Independent first-hand community report

A user describes their own purchase, activation, top-up, roaming, support interaction, failure or recovery and provides enough detail to identify prerequisites and outcome.

One report is a lead. Multiple independent current reports can establish reproducibility when they agree on the important steps.

### D. Public first-party rule

Carrier/regulator help pages, terms, published pricing, app documentation or official purchase pages.

Use mainly for hard constraints, public mechanics and conflict checks. Do not let this class automatically outrank newer reproduced operational evidence about a different plan/account state.

### E. Secondary tutorial / aggregation

A blog, guide or repost that may summarize other users' work. Useful for leads and terminology, but copied claims do not count as independent replication.

Affiliate incentives, copied screenshots and circular sourcing lower confidence.

## Route admission rule

A route does **not** require a public carrier product page to be usable in the product.

A route can become production-eligible when material claims are reproducible enough for a reasonable user decision. Typical sufficient patterns include:

- a credible private first-party carrier confirmation plus at least one independent current successful reproduction; or
- multiple independent current first-hand successful reproductions with materially matching steps and no current hard legal/technical prohibition; or
- a reproducible authenticated carrier/app flow whose price, eligibility and outcome can be directly observed, with community evidence covering practical failure modes.

A public product page alone is **not sufficient** for a strong route recommendation if community evidence shows poor real-world usability, new enforcement, recycled-number problems, activation failures or high maintenance risk.

Confidence drops when reports are old, copied, geographically inconsistent, dependent on a single support agent, or contradicted by newer failures.

## Route value / prioritization

Research and product priority should be based on user value, not official visibility.

Important dimensions include:

- total acquisition cost;
- real annual keep-alive cost;
- ability to receive SMS/OTP where the target user actually lives;
- number continuity and replacement/migration options;
- KYC burden and whether the legitimate process is realistically completable;
- activation geography/device constraints;
- Wi-Fi Calling/roaming continuity;
- account/support friction;
- recent successful reproduction;
- recent failure or enforcement reports;
- recycled-number/number-quality risks;
- how much ongoing maintenance the route requires;
- whether a cheaper hidden route materially beats the public/default offer.

The product should surface a hidden 49-baht support package over a more expensive advertised package when the hidden route is current, legitimate and reproducible.

## Required route record

For every route candidate, capture:

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
- **replicated community route** — multiple current independent first-hand reports agree and no hard current rule makes the route impossible;
- **emerging / single-report** — interesting and plausible, but not yet sufficiently replicated;
- **conflicting** — meaningful current evidence disagrees;
- **stale** — no recent successful reproduction and policy may have changed;
- **retired** — current evidence shows the route no longer works or is no longer legitimately available.

## Conflict handling

When a public rule and current community evidence conflict, do not automatically choose the public page.

Investigate whether:

- the public page describes a different plan, country, account type or activation state;
- the support route is an account-specific or retention-only offer;
- the public page is stale;
- the community report is stale or copied;
- support is applying a legitimate exception;
- the current route has become inconsistent or agent-dependent.

If the conflict cannot be resolved, mark it `conflicting` and explain the practical uncertainty.

## AIS Thailand example and correction

The 2026-09-17 AIS Thailand discussion exposed the previous research-model defect.

The thread included a direct AIS customer-service reply recommending a `49B Validity 365 Days package` for prepaid users who mainly keep the number for SMS/OTP or overseas use. Multiple current user reports describe the same support-assisted flow. Public AIS pages provide background validity mechanics but do not market the same THB 49 route as a normal indexed product.

Correct classification:

- the support email is a **private first-party support artifact**;
- multiple current users describing the same support-assisted 49-baht/365-day route are **replication evidence**;
- public AIS terms/pages are **constraint/background evidence**;
- the missing public THB 49 product page is irrelevant to whether the route is real if the support path remains reproducible.

Future research must not collapse “not publicly indexed” into “unverified.”

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
- direct carrier chat/email wording and the conditions agents request;
- 旧套餐 / legacy plan / retention offer / account-only offer;
- 论坛中“已上车”“实测”“刚开通”“客服给我开了”“失效了”“涨价了”等时效信号.

Search communities before assuming a route does not exist.

## Safety and legitimacy

Community-first research does not mean bypass research.

Do not recommend forged KYC, stolen identities, deceptive support stories, unauthorized account access, circumventing carrier security, or violating applicable law/terms.

A legitimate support-assisted package, carrier-approved conversion, app option or documented community workflow is in scope even when it is not advertised publicly.

## Maintenance

Operational routes decay quickly. Therefore:

- record the last known successful reproduction date;
- treat a new support refusal, mass termination, changed KYC request or price change as a material signal;
- prefer several independent recent reports over dozens of copied old tutorials;
- recheck high-value hidden routes more frequently than ordinary public plans;
- never silently convert an old successful report into a permanent rule;
- show users when a route depends on support discretion or has recent conflicting outcomes;
- actively demote routes whose real-world community evidence worsens even if their public documentation still looks unchanged.

The target is not certainty. The target is a substantially better, fresher and more practical decision than a generic search or generic AI answer can provide.