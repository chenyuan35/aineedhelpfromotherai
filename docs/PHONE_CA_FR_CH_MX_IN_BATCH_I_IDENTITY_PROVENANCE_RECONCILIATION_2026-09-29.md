# Phone CA/FR/CH/MX/IN batch-I identity/provenance reconciliation — 2026-09-29

## Scope

Bounded reconciliation for `ca-fr-ch-mx-in-directory-batch-i.json` only:

- `speakout-711-365voucher-2026`
- `telcel-amigo-lifecycle-2026`
- `jio-prepaid-90d-trai-2026`
- `orange-mobicarte-2026`
- `sunrise-prepaid-2026`

No publication/indexability expansion, schema redesign, manifest-gate removal or other batch is in scope.

## Result

**PASS / five current-fact HOLD migrations with exact comparison parity.**

### 7-Eleven SpeakOut Canada

The legacy CA$25 / 365-day voucher model is no longer the current service model. Current SpeakOut requires an active rate plan; the physical SIM is CA$10, plans currently start at CA$19/30 days, and service is cancelled after 90 days with no active plan. Current customer help/terms also say SpeakOut does not roam outside Canada. The route therefore remains **HOLD** for overseas SMS/OTP use.

Current sources:

- https://speakout7eleven.ca/pages/terms-of-service
- https://speakout7eleven.ca/collections/plans-monthly
- https://www.speakout7eleven.ca/sim-cards/speakout-prepaid-sim-card
- https://speakout7eleven.ca/pages/help

### Telcel Amigo Mexico

The current Aug-2026 prepaid contract says the Amigo lifecycle ends after 365 days without activity and restarts with each Saldo recharge. Telcel currently lists prepaid recharges from MXN$10. Ordinary Amigo now supports online eSIM delivery/installation, but mandatory 2026 line registration applies. Telcel says foreigners may use a valid passport (or temporary CURP for foreigners) and remote registration requires a liveness selfie; the same general registration page also contains CURP language that leaves the ordinary passport-only remote path insufficiently clear. The separate Tourist eSIM has a clearer passport-only flow but is a different product and was not substituted into this route. Route remains **HOLD**.

Current sources:

- https://www.telcel.com/personas/politicas-y-codigos/contrato-prestacion-servicios
- https://www.telcel.com/personas/politicas-y-codigos/ciclo-vital-linea-amigo-prepago
- https://www.telcel.com/vinculatulinea
- https://www.telcel.com/esim/amigo
- https://www.telcel.com/personas/atencion-a-clientes/glosario
- https://www.telcel.com/personas/roaming/atencion-al-viajero

### Jio Prepaid India

The legacy Rs.199/90-day retention model was wrong for pure number retention. Jio's current regulatory policy says that after 90 days of continuous non-use, a prepaid line with sufficient main balance enters Automatic Number Retention: Rs.20 is deducted for each additional 30-day non-use period until the balance falls below the threshold. Incoming SMS on prepaid international roaming is free after IR is enabled. New SIM onboarding still requires original proof of identity/address through the India-centric onboarding path, and first-time IR preparation should be completed while connected to Jio. Route remains **HOLD** for overseas-first acquisition.

Current sources:

- https://www.jio.com/jcms/en-in/regulatory/
- https://www.jio.com/help/faq/mobile/prepaid-offerings/plans/what-documents-do-i-need-to-carry-to-get-a-jio-sim-for-jio-prepaid-plans/
- https://www.jio.com/help/faq/mobile/international-services/prepaid-ir-activation/how-do-i-activate-international-roaming-ir-on-my-jio-number-under-prepaid-packs/
- https://www.jio.com/help/faq/mobile/international-services/prepaid-ir-pack-pricing/will-i-be-charged-for-incoming-messages-while-on-international-roaming-ir-under-jio-prepaid-packs/

### Orange Mobicarte France

Current Orange material closes the old retention-data gap. Mobicarte Mini is EUR2.99; an eligible EUR10 recharge extends line validity six months, implying EUR20/year for the conservative two-recharge retention cycle. Identification is mandatory and the current offer is for users resident in or able to justify a stable link with metropolitan France. Europe roaming is documented, but reviewed evidence does not establish the target long-term inbound-SMS/OTP behavior in China/non-Europe. Route remains **HOLD / avoid-route** for this product job.

Current sources:

- https://boutique.orange.fr/vitrine/offres-prepayees/
- https://boutique.orange.fr/vitrine/rechargements-mobile/mobicarte/
- https://boutique.orange.fr/vitrines/voyage/reseaux-partenaires
- https://communaute.orange.fr/t5/offres-mobile-Orange-et-options/Etude-abonnement-temporaire-Internet-sur-mon-mobile/m-p/3418129

### Sunrise Prepaid Switzerland

The old community/wiki 12-month rule is stale. Sunrise currently says prepaid credit/number is released after 17 months without active use; qualifying use includes top-up, outgoing call, mobile data, outgoing SMS, or option/bundle purchase. Top-up starts at CHF10 and can be initiated abroad with a saved card. Current prepaid eSIM registration accepts a foreign address. A current community roaming thread supports ordinary SMS reception abroad in principle, but there is still no reviewed independent China-first activation + long-term OTP reproduction. Route remains **HOLD**.

Current sources:

- https://www.sunrise.ch/en/mobile/prepaid
- https://www.sunrise.ch/en/support/mobile/services/prepaid
- https://www.sunrise.ch/en/mobile/prepaid/top-up
- https://www.sunrise.ch/en/mobile/prepaid/travel-esim
- https://community.sunrise.ch/d/47446-cannot-receive-sms-whilst-roaming-in-new-zealand

## Canonical migration

All five route IDs were absent from canonical v1 before this batch, so no identity collision or alias/schema work was required. Each route was admitted through a reviewed packet as `backstage-only` + `hold`, with one `current-profile` snapshot. The generic comparison adapter deep-equals each corrected legacy comparison row.

Post-migration state:

- canonical routes: 45
- canonical markets: 23
- canonical brands: 42
- canonical networks: 28
- canonical sources: 156
- comparison routes: 135
- route-ID overlap: 34
- legacy-only comparison routes: 101
- explicit indexable routes: 3

## Stop/publication result

No standalone route URL, sitemap entry or indexability state was added. The reviewed legacy manifest remains authoritative for comparison coverage. None of these five HOLD rows should be promoted merely because the canonical migration succeeded.
