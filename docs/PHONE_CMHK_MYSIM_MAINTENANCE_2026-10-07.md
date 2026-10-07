# CMHK 4G MySIM maintenance — 2026-10-07

Route: `cmhk-mysim-hk-2026`

Status: reviewed maintenance; remains `admitted` + `backstage-only`; historical comparison visibility is preserved and no standalone SEO URL is added.

Current reconciliation:

- Current 7-Eleven Hong Kong retail material lists **4G MySIM at HK$38**, replacing the stale HK$33 acquisition baseline.
- Current MySIM terms state that **recharging extends prepaid-SIM validity**. A standing CMHK official refill guide documents **HK$50-HK$199 = 180 days** and **HK$200+ = 365 days**; a 2024 exact 4G MySIM retention report independently reproduces HK$50/180 days. The normalized low-cost path therefore remains **HK$100/year**, with an explicit verify-at-refill caveat because the denomination ladder is not restated in the 2026 MySIM PDF.
- CMHK's current prepaid eSIM exchange list explicitly includes **4G MySIM**, proving physical-prepaid-to-eSIM conversion eligibility rather than direct new-line eSIM purchase.
- From **17 June 2026**, CMHK says all prepaid SIM cards cannot be activated in **Mainland China**. Activation is allowed in Hong Kong or an applicable roaming destination other than Mainland China; a fully remote new-line 4G MySIM flow outside Hong Kong is not established.
- OFCA requires prepaid person-to-person SIM real-name registration before activation. A user without HKID may use another valid identity document such as a valid travel document or passport, subject to the regulation/provider flow.
- Exact-route overseas SMS evidence remains thin: one 2023 4G MySIM report records receipt of a CMHK account/status SMS in Shenzhen with mobile data off. A 2024 MySIM **5G** report records OTP/e-banking SMS success in Japan and South Korea, but that is adjacent-product evidence and is not converted into a 4G success rate.
- Current MySIM roaming documentation says a roaming data connection can trigger a **HK$15 daily usage charge**. The route moves to `trend=watch` and `guideEligible=false`; no service-specific OTP percentage is created.

Canonical after this pass: **160 routes / 87 markets / 157 brands / 117 networks / 747 sources**.

Publication boundary remains **135 comparison / 3 indexable / 31 sitemap URLs**.

Release verification:

- PR **#415** squash-merged as `4ab3dc5ea8100a60100ae097716b29a867b3c242`.
- CI **#306 PASS**; Eval Gate **#1224 PASS**; Vercel Preview PASS.
- Production deployment `dpl_8FRi8vfn5vMUasGf1BeaFvjha8oV` is **READY** and owns the apex alias.
- Production CMHK lazy detail JSON is HTTP 200 with 12 sources, HK$38 acquisition, HK$100 yearly keep and a 180-day keep interval.
- Production summary JSON is HTTP 200 with **160 routes**; standalone CMHK route remains HTTP 404; sitemap remains **31 URLs** and contains no CMHK route.

Next bounded maintenance candidate: `mtn-ng-keepmynumber-2026`.
