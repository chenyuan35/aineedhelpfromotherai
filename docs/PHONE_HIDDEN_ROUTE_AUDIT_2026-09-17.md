# Phone Hidden-Route / Failure-Mode Audit — 2026-09-17

Status: ACTIVE

Method: `docs/PHONE_HIDDEN_ROUTE_RESEARCH_METHOD.md`

This audit exists because the current Phone product was researched too heavily from public carrier documentation. That approach is good at describing published rules but can miss the two things that create the most user value:

1. legitimate low-cost/support-assisted routes that carriers do not actively advertise; and
2. recent community-observed failures that appear before public documentation catches up.

No production change is authorized by this document alone. The first goal is a discrepancy matrix.

## 1. Existing production-route discrepancies

### giffgaff UK — material risk escalation required

Current product strength:

- inactivity/keep-alive actions, PAYG cost and PAC rescue are well documented;
- existing tutorial notes already warn that keep-alive does not equal permission for permanent overseas use.

New community/freshness evidence:

- July 27–30, 2026 produced a cluster of NodeSeek/NodeLoc/community reports showing direct termination notices for `extended or permanent use outside the UK`, including lines activated only weeks earlier;
- users reproduced carrier replies refusing reinstatement and in some cases refusing unused-credit refunds;
- ISPreview published an Aug 1 report after receiving multiple complaints and obtained a giffgaff spokesperson confirmation that a proportion of PAYG SIMs associated with extended/permanent use outside the UK had been disconnected;
- the notices point users toward PAC transfer as the practical number-preservation path.

Important sources:

- https://www.nodeseek.com/post-848635-1
- https://www.nodeloc.com/t/topic/101536
- https://www.nodeloc.com/t/topic/101167
- https://www.ispreview.co.uk/index.php/2026/08/giffgaff-disconnect-some-prepaid-mobile-users-for-extended-roaming-outside-uk.html

Discrepancy:

- the product's six-month inactivity mechanics remain useful, but they are no longer sufficient to describe the route for a user who intends to live outside the UK;
- an overseas user can satisfy the inactivity rule and still lose the line for usage pattern/geography;
- this is not a theoretical terms caveat anymore; it has a recent enforcement wave.

Audit decision: **CORRECTION NEEDED.** Do not present giffgaff as a low-risk long-term overseas retention route. The route can remain useful for UK-primary users and short travel, but the recommendation logic and first-screen risk explanation need review.

### Sakura Mobile Japan Voice+Data — missed positive evidence

Current product state:

- post-departure roaming SMS was marked `unknown`.

Deeper first-party evidence:

- current Sakura Mobile support material explicitly says Voice+Data SIM/eSIM usage outside Japan supports calls and SMS while cellular data is unavailable.

Discrepancy:

- `unknown` understates a material capability that affects account-access continuity after leaving Japan.

Audit decision: **CORRECTION NEEDED.** Confirm exact plan/applicability and then replace the unknown state with the supported roaming-call/SMS rule.

### Ultra Mobile PayGo — incomplete Wi-Fi Calling evidence

Current product state:

- PayGo roaming SMS is supported;
- Wi-Fi Calling abroad was left `unknown`.

Deeper evidence:

- Ultra currently publishes `Free Wi-Fi Calling on All Ultra Plans` and states that international travelers can call and text over Wi-Fi;
- Ultra's current PayGo material separately confirms international roaming support for voice/SMS/MMS through the PayGo Wallet.

Discrepancy:

- the existing `unknown` may be too conservative;
- however, `all Ultra plans` must still be checked against current PayGo account/device provisioning before changing the route field.

Audit decision: **VERIFY THEN CORRECT** rather than automatically inheriting general-plan wording.

### H2O Wireless Pay As You Go — current caution supported

Current product state:

- overseas roaming is not treated as supported for the PayGo route.

Deeper evidence:

- H2O's current PayGo page says the service is for personal use in the U.S.;
- current H2O international roaming material applies roaming to Unlimited monthly and 12-Month plans, not the PayGo route.

Audit decision: **KEEP** the current caution unless a current support/app route proves otherwise.

## 2. Hidden-route candidates discovered from community evidence

These are research candidates, not production recommendations.

### AIS Thailand — THB 49 / 365-day support-assisted validity

Signal quality: **high**

Why it matters:

- direct AIS customer-service wording reproduced by a current user;
- multiple independent current tutorials/reports describe the same support-assisted 49-baht/365-day path;
- current AIS public material independently confirms a 365-day prepaid validity mechanism;
- the route also covers passport KYC, roaming, SMS, Wi-Fi Calling, eSIM reissue and long-term number continuity.

Current classification: **support-confirmed hidden route candidate**.

Remaining work:

- exact eligibility/account state for the 49B offer;
- whether it can be repeatedly renewed under current policy;
- current support channel consistency and refusal cases;
- distinguish Trip/Redtea/traveler-SIM starting products and conversion paths rather than merging them into one route.

### RedPocket US annual route — community-reproduced acquisition + support-assisted eSIM reissue

Signal quality: **medium-high**

Recent evidence:

- 2026 NodeSeek users report successful purchase/activation of the annual RedPocket route through the known marketplace channel;
- at least one current report documents support reissuing a manual eSIM QR after the default activation flow did not deliver one;
- another long-form community retention review treats RedPocket as one of the more reliable US-number routes after using alternatives.

Important practical negatives:

- marketplace-account/payment friction exists;
- recycled numbers can carry bad history, including reports of a newly issued number already blocked by WhatsApp;
- device/eSIM-adapter compatibility and carrier anti-fraud behavior matter.

Sources:

- https://www.nodeseek.com/post-612584-1
- https://www.nodeseek.com/post-783926-1

Current classification: **replicated community candidate; needs seller/channel + number-history risk audit**.

### ClubSIM Hong Kong — useful example of community freshness beating old tutorials

Signal quality: **high for change detection**

Earlier route:

- 2025 tutorials widely described the cheapest annual keep-alive as a HKD 6 SMS package.

Fresh community update:

- a June/July 2026 long-term user's retention log reports the HKD 6 package was removed on July 3 and the annual keep-alive cost moved to HKD 15;
- the same source also notes online self-service eSIM replacement limits.

Sources:

- https://www.nodeseek.com/post-479688-1
- https://www.nodeseek.com/post-783926-1

Lesson:

- copying an old official/product page or old tutorial would preserve a stale `6 HKD/year` fact;
- current community monitoring catches the real change earlier.

Current classification: **strong candidate only after current keep-alive price and replacement limits are rechecked**.

### HK-mobi / CSL Hong Kong — low-cost annual-retention candidate

Signal quality: **medium**

Current 2026 community report:

- online eSIM availability;
- reported effective opening cost around HKD 10 after included balance;
- reported HKD 28 / 365-day keep-alive;
- mainland roaming SMS reception is a central use case.

Source:

- https://www.nodeseek.com/post-739650-1

Current classification: **emerging candidate; needs independent replication and KYC/roaming/number-reissue audit**.

### Germany O2 prepaid eSIM — extremely low-cost transfer-based retention claim

Signal quality: **medium / high upside**

A detailed Aug 2026 first-hand NodeSeek report claims:

- legitimate passport identity verification;
- Wi-Fi Calling and overseas SMS capability;
- account-side eSIM regeneration;
- 180-day validity extension after account recharge;
- bank-transfer top-ups as low as EUR 0.01, implying a near-zero annual keep-alive cost.

Source:

- https://www.nodeseek.com/post-851904-1

Current classification: **high-priority replication candidate, not yet production evidence**.

Safety boundary:

- only the legitimate passport/KYC/carrier flow is in scope;
- do not preserve or recommend proxy/location spoofing or any method intended to defeat carrier geographic/security checks.

### Netherlands Simyo prepaid eSIM — current long-life balance route

Signal quality: **medium-high**

An Aug 2026 first-hand report documents:

- successful eSIM opening;
- 180-day activity/balance requirement;
- SMS as a straightforward keep-alive action;
- long runway from starting balance;
- explicit failed-order/refund friction and support recovery.

Source:

- https://www.nodeseek.com/post-884095-1

Current classification: **replicated research candidate; needs second independent user and exact carrier validity wording**.

### One NZ prepaid — long initial-validity candidate

Signal quality: **medium**

Community reports describe a low-cost eSIM route with a long initial validity window and later annual top-up retention. It also appears in a June 2026 personal multi-SIM retention review as a trusted route.

Current classification: **candidate; verify current new-line validity, international/Wi-Fi SMS behavior and eSIM-transfer limits**.

## 3. Community evidence that should NOT be promoted as a route

Community discovery also finds procedures that rely on false residency, false documents, deceptive support stories, location spoofing or other carrier/security evasion.

Those posts can still be useful as risk/failure signals, but the product must not turn them into instructions or recommendations.

Examples of claims to exclude from route instructions:

- false residence/student classification to pass SIM registration;
- forged or unrelated proof-of-address documents;
- instructions to deceive carrier support about device loss;
- location/GPS spoofing intended to bypass eSIM/carrier geographic controls;
- proxy/IP manipulation presented as a way to defeat explicit carrier eligibility rules.

If a legitimate carrier-supported path exists underneath such a tutorial, research that legitimate path separately.

## 4. Immediate audit priority

1. **giffgaff** — highest urgency because current production can materially understate 2026 overseas-termination risk.
2. **Sakura** — straightforward missed-evidence correction.
3. **Ultra PayGo** — verify PayGo-specific Wi-Fi Calling applicability.
4. **AIS** — build full hidden-route record around current support-assisted retention + conversion variants.
5. **RedPocket** — determine whether the current annual route is more suitable than Ultra/Tello for the intended overseas user, with number-history and marketplace risk explicit.
6. **ClubSIM / HK-mobi** — recheck current annual keep-alive and eSIM replacement mechanics.
7. **O2 Germany / Simyo NL / One NZ** — independent replication before any production expansion.

## 5. Production rule during this audit

Do not add a batch of new carriers just because the community search produced many interesting routes.

First fix material inaccuracies in current routes. Then admit at most one or two hidden routes whose value is genuinely different and whose current reproducibility is strong enough to maintain.

The desired result is not the largest SIM database. It is a small set of routes where the site knows the non-obvious path, the real current cost, the support/app steps, the failure modes and the date that users last reproduced it.