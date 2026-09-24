# Phone Radar Operating Plan — 2026-09-24

Status: ACTIVE PRIMARY GROWTH PLAN

## Business objective

Phone Radar is the site's primary growth product. The practical business floor is to grow enough useful organic traffic and repeat usage to cover the domain's annual cost, then move toward the existing first monetization target of roughly RMB 100/month without adding recurring infrastructure cost that traffic cannot support.

The product wins only if it reduces a real user's decision time. It is not a carrier encyclopedia and not a mass-generated SEO directory.

## User job

The target user needs a real phone-number/data/SMS route for overseas apps and services and does not want to reconstruct the answer from fragmented forums, carrier pages, reseller sites and anecdotes.

Phone Radar should let that user answer, quickly:

- what route can I actually obtain now;
- what is the real landed price and cheapest current acquisition path;
- what does it cost and require to keep the number;
- which services have current observed success/failure evidence;
- what device/KYC/payment/activation constraints exist;
- what seller/platform/number-loss/recycling/recovery/refund problems have occurred;
- how fresh and how well-supported the evidence is;
- where to buy, activate, test, keep and recover the route.

## Product surface architecture

### 1. Phone index / comparison surface

The existing canonical `/tools/phone-number-survival-guide/` remains the default visual index and comparison layer.

It should answer the comparison job first: market → network → brand/MVNO → concrete route/acquisition path → current evidence. Users must be able to compare cost, keep-alive, app evidence, incidents, recovery and freshness without opening every guide.

### 2. Evidence-rich route detail pages

A route may later earn a separate detail URL only when it has enough distinct, maintainable material to solve an execution job that the index cannot solve cleanly. A detail page must contain substantial route-specific evidence such as acquisition paths, cost history, activation steps, service observations, incident/recovery history, current pitfalls, seller/platform information and freshness.

Do not create pages merely because a country/carrier/keyword exists. No country/provider doorway families and no template page whose only unique text is the carrier name.

Initial publication gate for a route detail page:

- route identity and acquisition path are unambiguous;
- current commercial source exists for provider-controlled facts;
- at least two useful independent operational evidence items, or one unusually detailed first-hand reproduction plus an independent corroborating signal;
- the page has a real execution/decision job beyond the index row;
- freshness date and unresolved conflicts are visible;
- the page survives both product-value substitution gates.

## Evidence acquisition loop

Production measurement and backstage evidence acquisition run in parallel. A measurement hold means "do not churn the public product without evidence"; it does not mean "stop collecting evidence."

### Observer A — community intelligence

Use the lightweight `phone-demand-watch` on a disposable observer VPS.

Purpose:

- find current route questions and first-hand outcomes;
- capture service-specific mentions such as OpenAI/ChatGPT/Codex, Claude, Telegram, WhatsApp, TikTok and Google;
- capture purchase/reseller/marketplace/deal/non-delivery/refund/seller-trust signals;
- discover externally linked public provider/seller/tutorial domains for later review;
- preserve only bounded metadata and short excerpts, not full forum archives.

Repository v1.1 runs hourly with randomized delay because NodeSeek and similar feeds are shallow enough that four-hour checks can miss fast-moving threads. It does not crawl whole forums or bypass 403/429/login/anti-bot controls.

### Observer B — reviewed source-change watch

Use `phone-source-watch` on a separate disposable observer when available.

Purpose:

- monitor explicitly reviewed public official/commercial URLs for price, package, stock, purchase-link and published-rule changes;
- check robots before requests;
- keep ETag/Last-Modified state and small normalized summaries;
- classify fetch failures separately from real content changes.

New seller/provider domains discovered by Observer A are not auto-added. Review source value, robots/terms and whether the page provides a decision-critical fact before adding it to Observer B.

### Disposable-host rule

Neither observer is production infrastructure. Raw state may be lost. Valuable normalized candidate summaries must be periodically moved to durable project facts/versioned research before host expiry. No unique production dependency or irreplaceable evidence may exist only on a trial VPS.

## Current evidence confirming the direction

Recent public evidence already shows the exact information asymmetry Phone Radar should capture:

- ESIM.gg's current public site sells a +372 Estonian number and states that using it at least once a year keeps the number active; current community walkthroughs report different OpenAI/WhatsApp/Telegram outcomes by number range and sometimes by time since activation.
- A September 2026 LINUX DO discussion records both successes and failures for ESIM.gg prefixes across OpenAI/Codex, WhatsApp, Telegram and other apps. This is a route + prefix + service + time-context problem, not a stable carrier rule.
- Saily now sells a US phone-number add-on, while its own help center warns that some services may classify the number as VoIP and OTP/2FA may fail. Official marketing alone is therefore insufficient; route-specific operational outcomes remain valuable.
- Roamless now offers app-based phone numbers for multiple country codes independently of its data eSIM, creating another route whose price, number type, OTP behavior and persistence need to be separated rather than flattened into "travel eSIM".

These are research candidates, not automatic production additions.

## Normalized data pipeline

The durable data flow is:

`public feeds / reviewed sources → candidate observations → dedupe/provenance review → normalized route events/snapshots → index aggregates → optional evidence-rich route detail page`

Keep separate records for:

- market/network/brand/route identity;
- acquisition paths and seller/provider domains;
- current price/discount/shipping/top-up/real landed cost;
- keep-alive cost/action/interval;
- service + operation success/failure observations;
- device/location/KYC/payment context;
- continuity incidents and number-range/prefix effects when supported;
- seller/platform non-delivery/refund/recovery/trust incidents;
- source URL, source date, fetch/review date and dedupe identity.

Do not replace missing data with neutral values. Do not convert anecdotes into population probabilities.

## Marketplace and seller intelligence boundary

Public marketplace/community evidence may identify acquisition channels and seller/platform risks. Record observable facts such as non-delivery, invalid number, refund outcome, replacement outcome, price and last verified date.

Do not automate login-gated marketplace scraping, bypass anti-bot controls, reproduce code words intended to evade marketplace moderation, or tell users how to defeat platform restrictions. Restricted-marketplace mentions can be stored only as a research signal that an acquisition channel is unstable or policy-sensitive.

## Growth loop

1. **Acquire evidence continuously.** Keep the research funnel alive even while the public page is held for measurement.
2. **Improve the existing index first.** Add only evidence-backed fields/routes that materially improve a user's decision.
3. **Publish route detail pages selectively.** A page exists because it solves a distinct execution job, not to manufacture URL count.
4. **Measure organic separately.** Use Windsor.ai Search Console while available; keep Google organic separate from referral/social/direct/AI traffic.
5. **Deepen winners.** If a route/query receives real impressions/clicks/usage, improve that route's evidence, guide and comparison before broad expansion.
6. **Build authority around primary evidence.** Useful route histories, dated observations and transparent source roles should be citeable by search/AI systems and communities.
7. **Monetize after trust/traffic.** Later acquisition/affiliate/partner links may be used when a real provider/reseller relationship exists, but commercial relationships must be visibly disclosed and must not silently buy rank or suppress negative evidence.

## Metrics that matter

Product/evidence metrics:

- number of current, evidence-qualified routes;
- percentage of surfaced routes checked within their required freshness window;
- number of service-specific independent observations;
- number of unresolved conflicts/incidents with later resolution tracked;
- useful seller/provider domains reviewed and source health.

Growth metrics:

- Phone canonical impressions, clicks, CTR and query mix;
- route/guide opens and filter/sort use when authorized analytics is available;
- outbound acquisition clicks separated by route;
- repeat/direct usage;
- later, AdSense revenue/RPM only after traffic is meaningful.

## Current state and next execution order

Current state on 2026-09-24:

- UK comparison pilot is live and production-verified;
- the first observed Search Console exposure for the Phone canonical is 1 impression for `survival number` on 2026-09-23, position 22, with no click; this sample is too small for a product change;
- the repository contains two bounded observer roles (`phone-demand-watch` and `phone-source-watch`);
- community watcher v1.1 is being upgraded to hourly structured intelligence with service/commerce/linked-host fields and regression coverage;
- the currently connected Qwen control machine is not the Phone systemd observer host and is too memory-constrained to absorb another recurring crawler workload;
- `codex-vps` is visible on the Tailscale network, but the current control path cannot run commands there without a fresh Tailscale SSH authorization check;
- two other Remote Desktop Commander devices that could not be identified safely are offline, so they are not being assumed to be the observer hosts.

Execution order:

1. merge and validate watcher v1.1 in GitHub;
2. when the actual disposable observer host is reachable, deploy v1.1 there and verify a real systemd run, source health, memory peak and next timer;
3. identify/verify the second observer host before assigning `phone-source-watch`; never infer host identity from an old chat;
4. begin periodic review of `candidates.tsv`, promoting only evidence-rich candidates into durable Phone research packets;
5. keep public Phone production stable until search/interaction evidence or a clearly superior evidence-backed route justifies a bounded change;
6. when a route has enough unique execution value, evaluate a separate detail URL under the route-page publication gate above.
