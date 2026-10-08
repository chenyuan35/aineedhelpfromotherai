# O2 UK Classic Pay As You Go — legacy retention correction — 2026-10-08

Canonical route: `o2-uk-classic-payg-6mo-2026`, **HOLD / backstage-only**, not a current new-user number route. One existing route, no new indexable page and no public recommendation.

## Current official product identity and acquisition boundary

O2's [Classic PAYG help](https://www.o2.co.uk/help/products-and-services/pay-as-you-go/classic-pay-as-you-go) explicitly says the tariff is **no longer available to existing customers wishing to switch**, and non-holders **cannot switch**. O2's current [PAYG plans overview](https://www.o2.co.uk/help/products-and-services/pay-as-you-go/pay-as-you-go-plans) sells **Big Bundles and Rolling Plans** for new users—not Classic. [General O2 PAYG T&C §6.1](https://www.o2.co.uk/termsandconditions/mobile/our-pay-as-you-go-tariff-terms) acknowledges the **rare possibility** of acquiring a Legacy Tariff SIM through an indirect sales channel; this is an exception in a contract, not proof that a usable current Classic SIM can be bought on today's retail market. Do not exaggerate “impossible for any new user” or misrepresent Big Bundle SIMs as Classic.

As no verified current Classic-specific checkout/acquisition offer is available, the old **£10 landed/£93 CNY** entry is removed: `landedOriginal=null`, `landedCny=null`, and `mandatoryTopup=null`. The minimum **£10** is independently documented as a **top-up** denomination for existing accounts and generic initial PAYG activation, not the public price of purchasing Classic as a new route.

## Keep number: six calendar months vs cost

[Current Classic PAYG page](https://www.o2.co.uk/help/products-and-services/pay-as-you-go/classic-pay-as-you-go) is disjunctive: **top up OR add a Bolt On OR carry out chargeable activity** at least once in any **six-month** period. Otherwise O2 can disconnect the SIM and take the remaining credit. This is a **six-calendar-month** rule, not a precise statutory 180-day deadline. There is no universal obligation to top up **£10 every six months** if qualifying paid use is made. On the other hand, internet anecdotes claiming that a text alone always works for years must not override the loss-of-number warning.

[Classic rate table](https://www.o2.co.uk/termsandconditions/mobile/pay-as-you-go-classic-tariff-standard-rates) lists **2p per UK domestic text**, 3p/min for ordinary calls, 1p/MB data. Two texts over twelve months would nominally debit **4p in UK usage** if applicable, but that does not prove an exact keep-alive fee, a calendar anniversary schedule, remaining-credit sufficiency or a roaming SMS rate. Store `observedActionCost=0.02` for domestic use illustration, `keep.yearCostOriginal=null` and `intervalDays=null`; don't convert to outdated CNY. [O2 top-up rules](https://www.o2.co.uk/help/account/billing-and-usage/topping-up-pay-as-you-go-balance) demand a **UK-bank card registered at a UK address** for credit/debit funding, starting **£10 in whole pounds**. Vouchers or cash machines are alternative funding mechanisms, not guaranteed access for foreigners overseas.

## eSIM, activation, Wi-Fi, roaming and bank OTP

[O2 eSIM guide](https://www.o2.co.uk/help/phones-and-devices/sims-and-numbers/esim) and [SIM activation](https://www.o2.co.uk/help/phones-and-devices/sims-and-numbers/your-sim) confirm current **eligible PAYG eSIM** and physical-SIM activation after first top-up, with replacement SIM/eSIM subject to account controls and sometimes photo ID. These are **generic PAYG statements** and do not confirm that a held Classic legacy account can convert to eSIM nor that a new Classic eSIM can be acquired abroad. Do not claim universal no-KYC.

Current [O2 Wi-Fi Calling guidance](https://www.o2.co.uk/help/international-and-network/wifi/wifi-4g-and-5g-calling) explicitly permits **general PAYG Wi-Fi Calling in the UK** but says **Wi-Fi Calling is not supported outside the UK**; selected-device SMS-over-Wi-Fi does not turn into a China OTP workaround. [O2 roaming guidance](https://www.o2.co.uk/help/international-and-network/using-your-phone-abroad/roaming) documents PAYG use in Europe and non-European travel at destination-specific rates. It does **not** prove mainland-China Classic-specific registration, free incoming SMS, a bank/app OTP success outcome or a low-cost outgoing SMS keep action in China. There are **zero** deduplicated exact-app observations.

## Independent current-user cases

- [2024-11-11 O2 community Classic case](https://community.o2.co.uk/t5/Pay-As-You-Go/PAYG-sim-disconnected/td-p/1762471): a subscriber reports being disconnected despite making calls in previous six months, and says it took four contacts to recover access. One incident, no global loss rate.
- [2025-02-16 Classic customer and 3G/2G device concern](https://community.o2.co.uk/t5/Discussions-Feedback/O2-SENT-ME-A-TEXT-ON-07-02-2025-WARNING-ME-ABOUT-UPCOMING-3G-AND/td-p/1781447): self-identified Classic holder confirms ongoing light-pay-per-use tariff; cannot demonstrate new-sale access.
- [2025-11/12 account label/roaming support thread](https://community.o2.co.uk/t5/Pay-As-You-Go/Pay-As-You-Go-BPI-Subscription/td-p/1820257): multiple users report apparent account label changes, top-up errors or loss of calling while abroad; two Classic lines were still displayed as Classic. Mixed-tariff reports do not establish a Classic-China-SMS outage.

## Publication and release gate

Adds **11 canonical source records** and **10 route events**: O2 source depth **2 → 13**, observations **0**. Overall **160 routes / 87 markets / 157 brands / 117 networks / 835 sources**. No new route/market/brand/network; public comparison **135**, explicitly indexable **3**, sitemap **31** unchanged. Route remains **HOLD/backstage-only**, with `guideEligible=false`, `avoidRoute=true`. Generated finder/search/metrics/lazy detail have null new-user/annual retention amounts and retain current domestic charge separately; dedicated regression wired into `phone:data:check`.

**Release pending:** branch/PR, CI, Eval Gate, Vercel Preview and exact merged-SHA production checks. Next separate Wave B task after release: `singtel-hi-prepaid-passport-30d-2026`.
