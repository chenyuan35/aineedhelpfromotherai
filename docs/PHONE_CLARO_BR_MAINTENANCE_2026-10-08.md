# Claro Brazil prepaid lifecycle, eSIM and roaming audit — 2026-10-08

Route: `claro-pre-br-90d-2026`. Decision: **HOLD / backstage-only**. Current product is a real Brazilian prepaid number, but its published restriction makes it unsuitable for overseas SMS/OTP. No new route, URL, publication status or service-success percentage.

## Price and lifecycle correction

Old canonical values **R$15 / 90 days, R$60 / year** were not supported by current provider data. Claro's published prepaid recharge ladder includes **R$20 / 30 days**, **R$30 / 60 days**, **R$35 / 90 days**, **R$50 / 120 days** and **R$100 / 180 days**. Its official prepaid terms also mention **R$15 / 30 days** as physical-store/first-recharge context, **not** a R$15 / 90-day retention product. The lowest documented standard 90-day action is now **R$35**. Four such actions equal **R$140 over 360 days**, not automatically an exact 365-day cost. Do not conflate standard credit duration with Prezão offer-bundle renewal days. The old R$10 new-number acquisition estimate was not current-verifiable and is now **null**, rather than pretending recharge equals a complete acquisition cost.

Claro's current cancellation FAQ inconsistently says recharge within 90 days of **last recharge** and also references 90 days from **expiry of last recharge validity** before cancellation/reactivation via 1052. Treat this as a documented ambiguity, not a guaranteed additional usable grace period. The same FAQ says previously deactivated numbers may be reassigned after 180 days; that is a separate later possibility, not credit validity. Recommend a conservative 90-day action and direct line-status verification.

## Foreign activation, eSIM and payment

Current Claro eSIM material supports both new prepaid eSIM and physical SIM. Local digital eSIM issuance is advertised as no extra eSIM fee, while an in-store eSIM can cost **R$15**; these are not a verified universal new-number bundle price. Standard activation includes SMS/*552 registration with selfie/document. Claro explicitly states **foreign passport/RNE prepaid eSIM activation must take place in its physical stores**, despite general online eSIM marketing. A January 2026 tourist reports being refused passport activation at one Claro store, illustrating uncertainty in local execution; it is not general proof of a blanket refusal. A February 2026 user reports prepaid eSIM purchased but first-activation blocked from Portugal. No China-first activation entitlement is proven. Claro advertises website, app, *555# and local-store/banking recharge; foreign-issued-card acceptance and long-term app access overseas remain unresolved.

## Decisive overseas constraint

Claro's official international roaming pages explicitly state **prepaid and Controle subscribers have no international roaming** and direct customers to move to eligible postpaid before travel. The separate terms that advertise **free incoming SMS while roaming** describe a working, roaming-enabled offering and **must not** be inherited by this prepaid route. A January 2025 Japan-based prepaid customer reported loss of roaming/inbound bank SMS; other 2025–2026 prepaid account owners report inability to receive overseas SMS or move plans remotely. A June 2026 prepaid customer specifically reports the carrier denied roaming because of their tariff. Do not create synthetic exact-app observations, bank OTP success rates or recovery guarantees.

## Source ledger

- Claro current recharge options: https://www.claro.com.br/celular/planos-pre/claro-recarga
- Claro prepaid credit validity and payment channels: https://www.claro.com.br/produtosclaro/documentos_pre/
- Claro cancellation FAQ: https://www.claro.com.br/faq/pre-pago/em-quanto-tempo-a-minha-linha-podera-ser-cancelada
- Claro eSIM / foreign applicant passport store rule: https://www.claro.com.br/celular/esim
- Claro prepaid registration: https://www.claro.com.br/celular/planos-pre/como-ativar-seu-chip
- Claro roaming prepaid exclusion: https://www.claro.com.br/celular/roaming-internacional/como-usar-celular-no-exterior
- Claro international travel FAQ: https://www.claro.com.br/faq/ligacoes-e-sms/como-usar-celular-em-viagens-internacionais
- 2025-01-09 independent prepaid roaming failure in Japan: https://www.reddit.com/r/InternetBrasil/comments/1hx2i9b
- 2026-01-17 Claro store passport refusal report: https://www.reddit.com/r/Brazil/comments/1qfhs7i/my_battle_to_get_a_local_sim_card_as_a_tourist_in/
- 2026-02-19 overseas first eSIM activation complaint: https://www.reclameaqui.com.br/claro/impossibilidade-de-ativar-e-sim-da-claro-no-exterior-e-falta-de-informacao-clara-no-momento-da-compra_5hzKfiuITPUp1TYU/
- 2026-06-15 prepaid international roaming denial complaint: https://www.reclameaqui.com.br/claro/impossibilidade-de-ativacao-de-roaming-internacional-e-solicitacao-de-mudanca-de-plano-para-pre-pago-fora-do-pais_lsgawoSJG--Mci2J/
- 2025-12-26 prepaid foreign inbound-SMS/portability incident: https://www.reclameaqui.com.br/claro/impossibilidade-de-migrar-para-esim-e-receber-sms-no-exterior-impede-uso-do-numero-e-portabilidade_ncxnUcD3gEaaHDq5/

The one historical source is retained. **12 added sources and six added route events**; zero app-level observations; canonical **160 routes / 87 markets / 157 brands / 117 networks / 791 sources**. Publication remains **135 historical comparison / 3 route indexable / 31 sitemap URLs**.

## Released and verified

PR #426 squash-merged as `1d2fefb61e0c72672f209497541e3b99768ae9f9`; CI #320 / run #37728500364 **PASS**; Eval Gate #1251 / run #37728500198 **PASS**; Vercel Preview `dpl_B6CtBF1sgcfVfyTMNx8tpRyPGeda` **READY**; production `dpl_5aHCsnEvLwqBKkCDWac2X6E5D9i5` **READY** at that merged SHA and assigned `aineedhelpfromotherai.com` alias. Independent direct HTTP retrieval of the public JSON/sitemap was blocked by the external reader and is not claimed as verified. The first Eval Gate #1250 failed because the previous Telstra maintenance regression hardcoded its historical 779-source total. That assertion was repaired to a monotonic historical minimum; CI #320 / Eval Gate #1251 passed with the Claro addition.

## Verification contract and follow-up

`scripts/test-phone-claro-br-maintenance.mjs` enforces R$35/90 days, R$140/360 days, no invented acquisition price, unsupported roaming, HOLD, source/event evidence, no service observations and unchanged publication boundary. Generated finder summary/search/metrics/detail/database artifacts must pass the exact `phone:data:check` and CI/Eval Gate/Preview before merge. Release is complete under the observed CI/Eval/Preview and Vercel production-ready gates; direct public JSON HTTP content was not independently retrievable.

Next bounded Wave B route: `asda-mobile-uk-2026`.
