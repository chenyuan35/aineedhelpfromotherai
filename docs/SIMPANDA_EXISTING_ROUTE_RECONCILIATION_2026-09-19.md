# SIM Panda existing-route reconciliation — 2026-09-19

Status: backstage research only. No production data change in this pass.

Scope: reconcile the two SIM Panda products that already map to Phone Radar routes: giffgaff UK and Ultra Mobile PayGo. The seller is a lead/commercial source, not operational authority.

## giffgaff UK

Disposition: **DEGRADING / production review required after current Phone visual closure.**

Current official rules still support the core route mechanics:
- a SIM is considered inactive after six months without qualifying use;
- qualifying activity includes a chargeable call/SMS/MMS, mobile-data connection, airtime-credit purchase or plan purchase;
- after inactivity deactivation the SIM itself cannot be reactivated, although giffgaff currently documents a 30-day window to request a PAC from agents and port the number to another UK network;
- international roaming remains supported, but Wi-Fi Calling is explicitly not supported outside the UK.

The seller tutorial's basic six-month keep-alive concept is therefore directionally correct. Its cheapest-data-retention technique should not be promoted as the default method: June 2026 first-hand China reports show delayed usage accounting and accidental high roaming-data consumption. Current community consensus in those threads prefers a simple chargeable SMS because the cost difference is trivial compared with the risk of uncontrolled roaming data.

More importantly, July 2026 produced a concentrated China-user suspension/closure wave. Multiple independent users reported closure emails despite light usage, including lines mainly kept for SMS/retention. Separate 2026 reports describe intermittent mainland-China receive-SMS failures and inability to send certain short-code SMS. By late August/early September, other users still reported long-running lines working normally, so the evidence is not a universal shutdown. The correct state is degrading/conflicting, not retired.

Decision implications:
- keep the existing route, because many lines still operate and the official six-month rule remains valid;
- do not describe it as a stable low-risk China long-term number while the 2026 closure wave is unresolved;
- after Phone visual closure, frontstage `stability` should be reconsidered from `Watch` to `Degrading` unless newer evidence shows the wave ended;
- the guide should recommend a simple qualifying SMS/credit action rather than a seller-provided micro-data trick;
- the guide must state that Wi-Fi Calling does not work abroad on giffgaff and that mainland-China SMS/roaming behavior has recent conflicting reports;
- seller price CNY 16 can be shown only as current SIM Panda availability if the purchase source is intentionally exposed; it must not replace the official acquisition source or be treated as universal market price.

Current sources:
- giffgaff inactivity/deactivation: https://help.giffgaff.com/en/articles/242797-understanding-why-your-number-has-been-deactivated
- giffgaff PAC after deactivation: https://help.giffgaff.com/en/articles/635745-getting-a-pac-or-stac-to-leave-giffgaff
- giffgaff Wi-Fi Calling abroad: https://help.giffgaff.com/en/articles/258841-understanding-wifi-calling-and-volte
- giffgaff roaming: https://help.giffgaff.com/en/articles/229548-using-your-mobile-phone-in-the-rest-of-the-world
- June 2026 keep-alive/data discussion: https://linux.do/t/topic/2357616
- June 2026 SMS-over-data preference discussion: https://linux.do/t/topic/2332213
- July 2026 China closure wave: https://linux.do/t/topic/1398440?page=5
- June/July 2026 mainland-China SMS trouble examples: https://linux.do/t/topic/2293886 and https://linux.do/t/topic/2600773/3
- Aug/Sep 2026 surviving-line reports: https://linux.do/t/topic/2837990

## Ultra Mobile PayGo

Disposition: **KEEP / Watch; current production core is substantially correct, but seller copy contains stale or overbroad details.**

Current official PayGo facts:
- USD 3 per 30-day service period;
- 100 minutes, 100 texts and 100MB US data per cycle;
- international roaming is supported for voice/SMS/MMS from the PayGo wallet; no international data roaming is included;
- current roaming table charges SMS separately when cellular-roaming abroad, including a receive-SMS charge in many countries;
- Wi-Fi Calling is officially supported abroad and can carry calls/texts over Wi-Fi;
- if no payment is made for 60 days after the last payment, Ultra says the account and number are cancelled;
- official purchase path remains eBay or selected T-Mobile stores, with channel availability varying.

This corrects two seller/older-guide issues. First, the current cancellation window is 60 days after the last payment, not the older 90-day wording seen in some guides. Second, seller language implying China use is uniformly easy is too strong. 2026 user reports continue to reproduce Ultra PayGo in China and recommend it for bank/verification SMS, but Wi-Fi Calling has intermittent reachability/setup problems on some mainland networks/devices. One January 2026 user temporarily received only Ultra's own service texts before Wi-Fi Calling recovered; April–May 2026 users still report successful China SMS/calling over Wi-Fi Calling. Treat this as setup/network variability, not route failure.

SIM Panda's assisted-activation offer is seller-specific. Do not make seller assistance a route prerequisite or imply that self-activation is unsafe by default. Ultra's official activation flow remains the authoritative baseline. Likewise, do not publish the seller's broad `no identity verification` claim as a guaranteed rule for every buyer/location; the useful user-facing fact is that PayGo activation does not use a conventional postpaid credit check/deposit, while checkout/account requirements can change.

Decision implications:
- retain Ultra PayGo as `Watch`; no evidence supports demotion comparable to giffgaff's 2026 closure wave;
- update backstage recovery/cancellation wording to the current official 60-day nonpayment cancellation rule when production route work resumes;
- explicitly distinguish Wi-Fi Calling from paid cellular roaming: Wi-Fi Calling is the low-cost overseas mode; cellular roaming SMS can consume wallet credit;
- keep `initial setup needs care` because current China evidence shows intermittent Wi-Fi Calling setup/reachability;
- keep the current USD 3/30-day cost and 100/100/100 allowance;
- seller CNY 233 price is only a current reseller acquisition snapshot, not the plan price;
- do not promise bank/app OTP compatibility; current user reports are supporting operational evidence only.

Current sources:
- Ultra PayGo: https://www.ultramobile.com/paygo/
- Ultra PayGo roaming rates: https://www.ultramobile.com/paygo/international-roaming/
- Ultra Wi-Fi Calling: https://www.ultramobile.com/help-center/what-is-wi-fi-calling/
- Ultra PayGo terms: https://www.ultramobile.com/mobile-plans-terms-conditions/
- Feb 2026 long-term-number discussion: https://www.uscardforum.com/t/topic/480864
- Jan–Jul 2026 PayGo user reports: https://www.uscardforum.com/t/topic/400369?page=4
- Apr 2026 China long-term-use report: https://www.uscardforum.com/t/topic/501690?page=2
- May 2026 China route discussion: https://linux.do/t/topic/2169936?page=2

## Inventory closeout

All SIM Panda SIM products in the Sep 19 inventory now have an explicit research disposition:
- giffgaff: existing route, **degrading/conflicting** due 2026 China closure reports;
- Haha SIM: **HOLD / Watch**;
- Ultra Mobile PayGo: existing route, **KEEP / Watch** with a 60-day cancellation-rule correction queued;
- Rakuten annual 070 SIM: **HOLD / Watch**, intermediary-continuity risk;
- One NZ: **VALIDATED / Watch**, future admission candidate after Phone closure;
- Skinny NZ: **HOLD**, seller stock unavailable and current China evidence thinner;
- Luky2/LuckySIM: **HOLD**, seller SKU/rules conflict with current official catalog;
- Giffgaff £10 voucher: accessory only, not a route;
- Hong Kong forwarding service: logistics service, outside Phone route scope.

No production route is changed by this research pass. The active Phone visual-closure gate remains ahead of route admission or data revisions.