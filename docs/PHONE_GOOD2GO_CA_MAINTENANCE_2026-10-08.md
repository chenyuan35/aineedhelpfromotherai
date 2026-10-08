# Good2Go Mobile Canada post-migration route maintenance — 2026-10-08

Canonical route: `good2go-payg-ca-2026`, **HOLD/backstage-only**. This existing legacy ID is retained for continuity and now labels the **post-2025 migration** profile; no genuinely new number SKU, public URL, route ID or indexability has been introduced.

## First-party and regulator timeline

The [CRTC Telecom Decision 2026-211 of 2026-08-18](https://crtc.gc.ca/eng/archive/2026/2026-211.htm) confirms that Ztar historically resold through Rogers for Good2Go, SpeakOut and related brands, and that the Rogers resale relationship and telephone number porting access became disputed when it was not renewed. Current Good2Go [data settings](https://good2gomobile.ca/support/data-settings) specify `sp.telus.com` and Telus SP APN settings. Neither piece is sufficient to attribute **every active post-transition SIM cohort** to an undisputed host. The canonical route and brand therefore remove the former Rogers `networkId` instead of falsely retaining a live Rogers affiliation or asserting an unverified new host.

The current [Good2Go service terms](https://good2gomobile.ca/pdfs/service-terms-and-conditions-good2go.pdf) say that credits pay for an **active rate plan**, plan validity can be **30 days to one year depending on selected product**, automatic renewal requires enough balance, and service is suspended without an active plan. **After 90 days with no active plan the service is deactivated and the number lost.** That is not a $20/180-day standalone PAYG validity product. The current [account FAQ](https://good2gomobile.ca/support/activation-account-support) says plan customers normally renew every **30 days**, offers $15/$25/$30/$40/$50/$100 prepaid credit vouchers, caps online top-ups at **CAD150 per rolling 30 days** and total balance at **CAD900**, and similarly says the line will be re-assigned after 90 days without an active plan. Vouchers are **funding instruments**, not proof that paying $20 grants 180-day number validity.

The [Good2Go plan catalog](https://good2gomobile.ca/support/plans) currently says it is being updated. It does not show a verified new-customer $19 plan, SIM/eSIM purchase price or annual plan option at checkout. Users transitioning from the old service have independently reported being put on a **CAD19/month** plan; treat this as a **dated migration observation only**, not a current general new-sale tariff. The canonical acquisition cost and annual keep price are explicitly **null/unknown** rather than invented from old Petro-Canada numbers. The previous CAD30 acquisition/$159 CNY conversion is retired.

## Onboarding, payment, international roaming

The provider's [activation FAQ](https://good2gomobile.ca/support/activation-account-support) states outright that a SIM **cannot be activated online while outside Canada** and the customer must return to Canada. The terms mention a SIM or **eSIM** as an eligible technical form, but there is no confirmed new-sale eSIM provision/QR route or foreign first-activation. Current activation collects subscriber details; an all-foreign applicant ID or no-ID guarantee is **not established**. Top-ups can be entered online, but acceptance of foreign-issued cards/addresses and actual checkout costs is unverified.

Good2Go's current contractual [roaming clause](https://good2gomobile.ca/pdfs/service-terms-and-conditions-good2go.pdf) is conditional: prepaid roaming depends on the underlying carrier's roaming arrangements and compatible network. This does **not** establish the previous unqualified “no roaming” assertion; equally, it does **not** prove mainland-China attachment, free inbound roaming SMS, OTP reachability, or long-term foreign retention. No exact bank/app route observation was admitted and no numerical success rate was created.

## Independent continuity and balance migration evidence

- [2025-07-31 Toronto low-use phone discussion](https://www.reddit.com/r/askTO/comments/1mdmoms/cheapest_possible_payasyougo_cell_plan/) reports departure from prior $25/120-day traditional PAYG arrangements; this shows historical alternatives were moving, not that a present $20/180d option survived.
- [2025-08-04 transition discussion](https://www.reddit.com/r/askTO/comments/1mhqum9/anyone_else_here_on_good2go_mobile/) quotes customers receiving 3G-network-transition/SIM-switch messages, with contradictory individual expectations.
- [2026-01-09 CellPhoneCanada firsthand thread](https://www.reddit.com/r/CellPhoneCanada/comments/1q8a63i/anyone_still_with_good2go_mobile_in_2026/) documents two customers who reported loss of service and account access after Christmas, and others describing a move to CAD19 monthly rate plans or loss of old balance.
- [2026-03-03 CellPhoneCanada firsthand thread](https://www.reddit.com/r/CellPhoneCanada/comments/1rjxf91/whats_going_on_with_good2go/) reports disputed CAD350–500 balances, a new $0 reading, support inaccessibility and at least one reported later number outage. These are distinct bounded claims, **not a verified carrier-wide loss rate** and no confirmation of individual reimbursements. The operator terms say credit is **non-refundable**; customers' complaints are not a promise of refunds.

## Canonical outcome and release gate

Good2Go moves from **2 → 12 route sources**, **1 → 10 events**, zero app-specific observations. The total source corpus rises **814 → 824**, canonical rows remain **160**, markets **87**, brands **157**, networks **117** (the old `rogers-ca` dimension is still used elsewhere but no longer attached to this route), historical public comparison **135**, explicit indexable **3** and sitemap **31**. Evidence state **HOLD** and `guideEligible=false` remain. The reviewed branch generates current data bundle/search summaries/metrics/lazy detail with **null** acquisition and keep cost, no indexed route, and dedicated regression in `phone:data:check`.

## Verified release

PR #432 squash-merged as `72584505dc2beb59d4059c68ad73bbf587fc5dcb`; CI #326 / run `37733111841` **PASS**, Eval Gate #1263 / run `37733111177` **PASS**, Vercel Preview `dpl_5hsRx8fpPNzntxYwNzCdVpemd1dZ` **READY**, production `dpl_Gp3A6b458Apb7dqtqxrF2Bntf7yh` **READY** at the exact merged SHA with both apex `aineedhelpfromotherai.com` and www aliases verified. Direct live JSON/sitemap HTTP reading remains blocked by the external reader and is not claimed verified.

The route remains backstage-only and HOLD after release, and no route-specific China OTP or current signup cost becomes evidence simply because deployment is READY. Next separate Wave B route after release: `o2-uk-classic-payg-6mo-2026`.
