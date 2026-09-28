# Phone Japan batch-B identity / provenance reconciliation — 2026-09-29

Status: **RECONCILIATION COMPLETE / MIGRATION NOT STARTED**

Scope is limited to `frontend/tools/phone-number-lifecycle-mvp/jp-directory-batch-b.json`:

- `povo20-zero-base-2026`
- `mobal-japan-voice-2026`
- `sakura-mobile-voice-2026`

The 135-route comparison surface remains authoritative. This review does not authorize any new standalone route URL, sitemap entry, ranking claim or publication-state expansion.

## Decision summary

| Legacy route | Identity decision | Current disposition | Migration consequence |
|---|---|---|---|
| `povo20-zero-base-2026` | Distinct povo 2.0 Voice+Data route | HOLD | Do not migrate the current legacy row yet; retention/eKYC/overseas fields need current-fact reconciliation first. |
| `mobal-japan-voice-2026` | **Distinct product** from canonical `mobal-japan-voice-data` | Candidate/backstage | Do not alias or collapse. A separate canonical Voice-Only route is valid after the legacy row/source packet is corrected and exact adapter parity is proven. |
| `sakura-mobile-voice-2026` | **Same underlying product** as canonical `sakura-japan-voice-data` | Existing canonical product already represents it | Do not create a duplicate canonical product merely to preserve the legacy ID. Current adapter has no comparison-ID alias mechanism, so migration of this legacy ID stops at the documented alias boundary. |

## povo 2.0

### Current official facts

- Base plan remains JPY 0.
- Long-term inactivity handling is tied to **paid topping purchase**, not a fixed JPY 250 minimum. If no paid topping is purchased for the applicable 180-day period, service can be suspended; if the condition continues after suspension, cancellation can follow.
- The current Voice+Data application path requires identity verification using an accepted Japanese credential path such as My Number Card, Japanese driver's license or residence card. The old shorthand “Japanese identity documents only” is too broad: a residence card is explicitly supported, but a typical overseas-only applicant with only a foreign passport still does not satisfy this acquisition path.
- Voice+Data supports overseas roaming. Current povo support requires enabling overseas roaming and identity-document verification; overseas SMS is an officially supported service for the Voice+Data plan. The legacy row's “receiving SMS abroad unverified” wording is therefore stale.

### Identity / admission decision

Keep `povo20-zero-base-2026` as **HOLD** for the general overseas-user Phone Radar route. The route can be useful for users who already possess an accepted Japan credential, but that does not remove the acquisition blocker for a typical overseas-only user.

The current legacy comparison row should be reconciled before canonical migration. In particular, retention should be represented as the official paid-topping / 180-day rule rather than treating JPY 250 as a universal minimum keep-alive action.

### Current first-party sources

- https://povo.jp/spec/detail/
- https://faq.povo.jp/faq/show/904?site_domain=default
- https://faq.povo.jp/faq/show/858?site_domain=default
- https://povo.jp/en/procedure/other/
- https://faq.povo.jp/faq/show/882?category_id=9&site_domain=default

## Mobal Japan Voice-Only

### Identity decision

`mobal-japan-voice-2026` is **not** the same product as canonical `mobal-japan-voice-data`.

Mobal's current product page explicitly separates:

- **Japan Voice-Only Plan** — Japanese phone number + SMS, JPY 1,430/month; and
- **Japan Voice+Data Plans** — Japanese phone number + SMS + data, from JPY 1,650/month.

Therefore the legacy Voice-Only ID must not be collapsed into the existing canonical Voice+Data route.

### Current commercial / overseas facts

- Voice-Only setup price is JPY 4,950 regular, with a current temporary 10% JPY 4,455 offer shown on the product page.
- Voice-Only recurring charge is JPY 1,430/month.
- It provides a real Japanese 070/080/090 number.
- Incoming SMS is free; Mobal explicitly markets the Voice-Only product for verification-code receipt.
- The current product page states Voice-Only can be used for roaming outside Japan. Voice/SMS roaming is an optional activation; data roaming is not part of the Voice-Only route.
- Worldwide delivery is advertised for the current product.

A previously captured generic/helpdesk statement limiting roaming to the latest Voice+Data 5G product conflicts with the newer product-specific Voice-Only page. The product-specific current page must be retained as the primary source for the Voice-Only identity and roaming capability; the conflicting helpdesk source must not be used to erase the currently sold product's explicit capability.

### Migration consequence

A separate canonical route is valid in principle because this is a genuinely distinct product. Migration should happen only after the legacy comparison row/source packet is reconciled to the current Voice-Only facts and the canonical adapter reproduces that reviewed row exactly.

### Current first-party source

- https://www.mobal.com/japan-sim-card/

## Sakura Mobile Voice+Data

### Identity decision

`legacy: sakura-mobile-voice-2026` and `canonical: sakura-japan-voice-data` describe the **same Sakura Mobile monthly Voice+Data product**. They are not two separate routes merely because the IDs differ.

The existing canonical route already models the product as a monthly Japanese Voice+Data SIM/eSIM with the passport/non-resident path. Creating another canonical product under the legacy ID would create a duplicate identity and violate the normalized Phone architecture.

### Current commercial / overseas facts

- Current 5GB Voice+Data price is JPY 2,980 before tax / **JPY 3,278 tax included** per month.
- Activation fee is JPY 5,500 tax included.
- The current legacy batch uses JPY 2,980 as the recurring payable amount and therefore understates the tax-included recurring/annual cost.
- Sakura's current support page says Voice+Data calls and SMS are available outside Japan; cellular data is not.
- Non-residents can apply, but the passport route requires face-to-face identity verification/pickup in Japan. This is already represented more accurately by the existing canonical route than by the legacy batch row.

### Adapter boundary

The current `scripts/phone-canonical-comparison-adapter.mjs` always emits `id: route.id`. There is no canonical comparison-ID alias / legacy-ID mapping mechanism.

Therefore the same-product/different-ID Sakura case cannot be migrated with exact legacy-row parity without either:

1. adding an explicit comparison-only legacy-ID mapping mechanism; or
2. leaving the legacy comparison row in place until a later controlled cutover.

This is the queue's documented alias/schema stop condition. No alias redesign is performed in this review.

### Current first-party sources

- https://www.sakuramobile.jp/monthly/price/
- https://www.sakuramobile.jp/monthly/voice/
- https://support.sakuramobile.jp/hc/en-us/articles/360020533651-Can-I-use-the-Monthly-service-outside-of-Japan

## Migration boundary / result

No canonical migration is attempted in this session.

Reasons:

1. povo remains HOLD and its legacy retention/overseas wording needs current-fact correction before parity testing;
2. Mobal Voice-Only is a distinct product and needs a corrected Voice-Only source packet before separate canonical admission;
3. Sakura is already represented by canonical `sakura-japan-voice-data`, while the current adapter cannot map that canonical identity to the different legacy comparison ID without an explicit alias mechanism.

The comparison remains 135 routes, the reviewed batch manifest remains intact, and explicit indexability remains 3.

## Next bounded task

Reconcile the three Japan legacy comparison rows to the current facts above **without changing route count or publication state**, then decide the smallest comparison-only legacy-ID mapping needed for Sakura. Only after that should povo/Mobal canonical-adapter migration be attempted.
