# Phone IE/PL/PT/HR batch-K identity / provenance reconciliation — 2026-09-29

Scope: `ie-pl-pt-hr-directory-batch-k.json` only. Publication/indexability is out of scope.

## Result

**PASS / four exact-parity backstage HOLD migrations.** Canonical becomes 53 routes / 30 markets / 50 brands / 36 networks / 182 sources. Comparison remains 135 routes; overlap becomes 42 and legacy-only becomes 93. Explicit indexability remains 3.

All named comparison batch files A–K are now dispositioned: 36 unique batch route IDs, 35 represented by the same canonical ID; the sole non-canonical batch ID is the already documented Sakura same-product legacy-ID blocker (`sakura-mobile-voice-2026` → canonical `sakura-japan-voice-data`). No batch-L is invented merely to continue migration activity.

## Route decisions

### Three Ireland Prepay — `three-ie-prepay-lifecycle-2026`

The old “one SMS every ~80 days / about EUR0.30 per year” recommendation is withdrawn. Current Three-controlled material agrees that top-up or credit-reducing call/text/data can preserve activity, but current provider guidance is materially inconsistent on timing: a current help article describes an alert after at least 90 days plus another 180 days before removal; another Three knowledge item says to top up at least every six months; contractual terms permit restriction/termination after 12 months without top-up or chargeable use. Credit expiry is a separate rule. Decision: **HOLD** until one current lifecycle rule can be reconciled. Provider-moderated support also confirms roaming can receive calls/texts without enabling mobile-data roaming.

Sources: `https://www.three.ie/legal/terms/prepay.html`, `https://community.three.ie/t5/Prepay/Keeping-your-Prepay-Number-Active/ta-p/804841`, `https://community.three.ie/t5/Prepay/Recycling-Inactive-Prepay-Numbers/ta-p/800862`, `https://community.three.ie/t5/Prepay-Plans-and-Services/Data-roaming-and-keeping-phone-number-active/td-p/791338`.

### Orange Polska na kartę — `orange-pl-nakarte-2026`

The old PLN10/year estimate is stale. The current Orange prepaid page explicitly offers account-validity extensions of +31 days for PLN9, +93 days for PLN19 and **+365 days for PLN39**. The former PLN5 inactivity-maintenance fee remains abolished. Orange requires prepaid registration and explicitly accepts an identity card or passport for in-person registration. Decision: **HOLD** despite clear PLN39/365-day economics because new-number acquisition remains Poland-centered and China/overseas OTP reliability is not independently verified.

Sources: `https://www.orange.pl/view/oferta-na-karte`, `https://www.orange.pl/view/zarejestruj-numer`, `https://www.orange.pl/view/utrzymanie-numeru`.

### Vodafone Portugal Yorn — `vodafone-yorn-pt-2026`

Current Vodafone guidance confirms Yorn remains a recurring weekly-cost tariff. If the scheduled tariff charge remains unpaid for seven days, incoming calls and SMS are also blocked until sufficient balance is restored and the overdue tariff cost is collected. Yorn eligibility is normally age 35 or under (student exception) and signup requires a Portuguese Citizen Card or other identity document for non-Portuguese users. Roaming exists, but the recurring funding requirement remains. Decision: **HOLD / negative knowledge**; do not convert the weekly tariff into a misleading cheap annual keep cost.

Sources: `https://www.vodafone.pt/content/digital-yorn/pt/yorn/ajuda/tarifario-yorn/os-meus-minutos-e-mensagens-renovam-a-semana-ou-ao-mes.html?PageSpeed=noscript`, `https://www.vodafone.pt/content/digital-yorn/pt/yorn/ajuda/tarifario-yorn/o-que-acontece-se-nao-tiver-saldo-suficiente-na-data-do-custo-semanal.html?PageSpeed=noscript`, `https://www.vodafone.pt/content/digital-yorn/pt/yorn/ajuda/aderir-yorn/como-posso-aderir-a-yorn.html`, `https://www.vodafone.pt/content/digital-yorn/pt/yorn/ajuda/internet-fixa/posso-usar-o-meu-yorn-fora-de-portugal-roaming.html?PageSpeed=noscript`.

### A1 Croatia Prepaid — `a1-hr-prepaid-2026`

Current A1 first-party pages establish a EUR3 standard prepaid SIM, online recharge from EUR5 using bank card / Apple Pay / Google Pay / Revolut / KEKS Pay / PayPal, identity-registration support using an identity card or passport, and a prepaid roaming tariff. A1 says standard vouchers extend account validity, but the current first-party pages captured here do not state the number of validity days added by each voucher amount. Decision: **HOLD**; no annual retention cost or safe interval is invented.

Sources: `https://www.a1.hr/privatni/mobiteli/sim-promo`, `https://www.a1.hr/privatni/mobiteli/mobilno-placanje/obnova-a1-racuna`, `https://www.a1.hr/privatni/mobiteli/a1-na-bonove/pristupnica`, `https://www.a1.hr/privatni/inozemstvo/cjenik-bonovi`.

## Migration / publication boundary

All four reviewed rows reproduce the corrected comparison rows by exact generic-adapter deep equality. No route was promoted, no standalone route/market page was created, no sitemap/indexability state changed, and the 135-route comparison surface remains authoritative.

## Next bounded decision

Named batch A–K migration is no longer the right automatic next action. The next task is a **post-A–K Phone checkpoint**: inspect the 93 remaining legacy-only routes plus current search/product evidence, then select at most one small next migration cohort or one existing route to deepen. Do not bulk-migrate and do not create a new indexable URL merely for coverage.
