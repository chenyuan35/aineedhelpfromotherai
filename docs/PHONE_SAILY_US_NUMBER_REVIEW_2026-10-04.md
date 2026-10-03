# Saily U.S. phone number residual-candidate review — 2026-10-04

Status: **CLASSIFICATION BLOCKER CLEARED / ELIGIBLE FOR BACKSTAGE HOLD ADMISSION**

Scope: determine whether the Saily U.S. phone-number add-on is a genuine Phone Radar route or should remain excluded as a data-eSIM/temporary-number product. This review does not admit the route, create a public URL, change ranking, or broaden indexability.

## Evidence reviewed

### Current provider-controlled facts

1. Saily's current phone-number page advertises a dedicated persistent U.S. +1 number at **US$1.99/month**, with identity verification required. Data plans may change while the number stays the same.
   - https://saily.com/esim-phone-number/
2. Saily's current Help Center says the number can make/receive calls and texts, but the underlying carrier uses **internet-based / VoIP network technology**. Some services therefore detect it as VoIP and may reject OTP/2FA.
   - https://support.saily.com/hc/en-us/articles/27948689277596-Can-I-use-Saily-phone-number-for-OTP-and-2FA
   - https://support.saily.com/hc/en-us/articles/27948598334620-What-is-a-Saily-phone-number
3. Saily's consumer terms, updated 2026-08-27, define a distinct Number Reservation, KYC before activation, configurable reservation periods, and a quarantine/reassignment lifecycle after reservation expiry. Port-in/port-out is not supported and the feature is not intended as a traditional-phone replacement.
   - https://saily.com/legal/terms-of-service/
4. A September 2026 Saily Q&A states that an active subscription keeps the same number and that an inactive number is reserved for 45 days. Treat the 45-day statement as provider-community guidance rather than the stronger formal terms source.
   - https://www.reddit.com/r/saily/comments/1w884ep/qna_saily_phone_numbers/

### Current independent / user outcome evidence

1. An August 2026 user report says the purchased Saily number/SMS feature failed to operate despite repeated troubleshooting and two installation attempts; another commenter reported a similar failure.
   - https://www.reddit.com/r/best_eSIM_providers/comments/1vn6sr8/problem_using_saily_phone_number/
2. In Saily's June 2026 launch thread, users reported mixed practical behavior: one user reported WhatsApp activation success while another reported iMessage activation failure. The same thread also contains older Saily-representative statements calling the number non-VoIP; this conflicts with the newer formal Help Center description and is therefore not used as the current network-class fact.
   - https://www.reddit.com/r/saily/comments/1u1xudl/saily_launches_new_phone_number_feature/

## Reconciliation

The prior coverage audit left Saily outside canonical because it was unclear whether an app-based second-line product belongs in the same class as cellular retention routes.

That classification ambiguity is now resolvable without pretending the product is a cellular prepaid SIM:

- it is **not** pure data eSIM: the number is a separately reserved dedicated NANPA +1 number with voice/SMS capability;
- it is **not** a temporary verification number: the user retains the same number while the reservation/subscription remains active and the provider documents a post-expiry lifecycle;
- it is **not** a traditional mobile-carrier route: current provider documentation explicitly says the underlying carrier uses VoIP/internet-based technology;
- it nevertheless directly serves Phone Radar's long-term number-retention and overseas SMS/OTP user job.

Therefore the appropriate canonical representation is a distinct long-term VoIP/second-line number class, not `real-mobile` and not Data-eSIM.

## Decision

**ELIGIBLE FOR BACKSTAGE HOLD ADMISSION.**

For the later one-route admission task:

- family: `long-term`;
- number class: use an explicit non-cellular value such as `real-voip` or `voip-second-line` rather than `real-mobile`;
- form: app-managed U.S. +1 second-line / VoIP number paired with Saily connectivity;
- surface state: `backstage-only`;
- evidence state: `hold`;
- current number-reservation price evidence: US$1.99/month;
- KYC: required;
- porting: unsupported;
- OTP compatibility: mixed / service-dependent, with current provider disclosure that some services reject VoIP;
- operational reliability: preserve the August 2026 failure evidence rather than promoting the route as reliable;
- no public detail URL, sitemap admission, shortcut ranking, or recommendation claim.

The route should remain HOLD until stronger independent operational evidence demonstrates stable overseas incoming SMS/OTP behavior across relevant services. Admission itself is a separate bounded session/release task with normal data checks and publication-boundary regression coverage.
