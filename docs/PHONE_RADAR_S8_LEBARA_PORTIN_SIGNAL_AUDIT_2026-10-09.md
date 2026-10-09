# Phone Radar S8 — independent post-port China roaming signal; new-number proof gate still unmet

Reviewed on 2026-10-09. This release adds **one** dated first-hand source and **one** non-OTP operational event to the existing Lebara UK route; it does **not** promote any China-first route to verified or expand public URLs.

## Exact task vs evidence

The outstanding user job is **a new mainland-China buyer obtaining an original UK real-mobile number using an eligible payment method and acceptable identity/account process, completing provider-supported first network activation without ever visiting the UK, and newly receiving Telegram/WhatsApp OTP on that line**. Porting an existing number from another operator, installing an eSIM QR, occasionally registering a roaming network, and receiving one inbound code are all *different partial operations*.

| Primary source | Verified firsthand claim only | Critical missing link / interpretation |
| --- | --- | --- |
| [Lebara UK official eSIM help](https://www.lebara.co.uk/en/help/esim.html) | Provider policy: new eSIM can be ordered abroad; **service first activation must be in UK**, with account/email prerequisites. | Provider policy is not overridden by opportunistic registration abroad. |
| [Linux.do Aug 12 original OP](https://linux.do/t/topic/2745784) | One author, physically in mainland China, says bought and installed Lebara eSIM there, received Telegram and WhatsApp codes and provider SMS, but outbound voice/SMS failed; support reportedly confirmed missing UK-network activation. | Specific foreign-issued card/billing eligibility and ID verification not specified; receive-only episode **not fully supported activated service**. Two participants in the same original thread are one independent original URL. |
| [Linux.do Aug 26 original](https://linux.do/t/topic/2815946) | Two people in *one* original thread report new Lebara eSIM with no roaming signal and later refunds, UK-first activation support reply. | No named-app OTP test; not two independent source URLs, no population prevalence or refund guarantee. Already normalized in S7. |
| [NodeSeek Aug 11 **original separate case**](https://www.nodeseek.com/post-869053-1) | Author **kkk33**, timestamp 2026-08-11 21:41:30 displayed in original HTML; **ported an existing Giffgaff number into Lebara**, says paid £5 for a plan plus £5 PAYG, repeatedly manually chose China Unicom before intermittently acquiring mobile signal; switching eSIM line often lost network again. Different commenter in same thread reported auto-selection working on their account. | This is **port-in then intermittent mainland roaming**, explicitly **NOT acquisition of a new UK number or proven UK-compliant first activation**. Payment card origin, KYC and Telegram/WhatsApp OTP unreported. The £5+£5 reflects one dated author's spend, **not a current universal checkout quote**. |
| [NodeSeek mid-Aug technical WFC report](https://www.nodeseek.com/post-874249-1) | Author tested a rooted Redmi/eUICC and an overseas iPhone, sometimes achieved Wi-Fi Calling or charged outgoing SMS after manual/network changes; reported authentication errors and instability on other setups. Some replies offer other device outcomes. | Device-specific and possibly cross-forum same-author evidence; **do not count as a newly independent Telegram/WhatsApp success**, identity may overlap lzd2 in Aug12 thread. Not admitted as a new canonical source in S8. |
| [Linux.do Sep 21–Oct 1 discussion](https://linux.do/t/topic/2931869) | Recent Lebara owners discuss outbound SMS failure/restrictions/Wi-Fi Calling, mixed replies. | No documented end-to-end new-origin foreign payment+identity+authorized first network attach+fresh exact app OTP. Research-only, not normalized. |

## Canonical update

- New canonical source `nodeseek-lebara-869053-20260811` and associated `evt-lebara-portin-mainland-signal-20260811` on **existing** `lebara-uk-direct-esim-china`. Exact source URL/datetime above.
- Event type is `post-port-mainland-roaming-signal-instability`: not a Giffgaff closure, not a named app observation, not an estimated SMS failure rate, not a universal Lebara block.
- New source and event were appended **once**, route source link updated. Underlying route price, `lastVerifiedAt`, policy, route admission and frontstage remote first-activation fail-closed behavior were **not promoted/changed**.
- After S8: **160 routes / 87 markets / 157 brands / 117 networks / 898 sources / 323 events**, 27 service observations unchanged; Lebara 8 linked sources and 3 events; original Telegram and WhatsApp evidence each have **one distinct source**, not a new successful independent buyer.
- Generated `phone-database.json`, search index, lightweight summaries and Lebara on-demand detail are regenerated together. The existing historical comparison 135 / indexable routes 3 / sitemap URLs 31 remain unchanged. No new content/page/SEO slug or server work.

## Tests and acceptance

Clean main-commit archive imported into temporary remote compute (not user's workstation, production VPS or persistent hosting), normalized all affected artifacts with `node scripts/build-phone-database.mjs`, `--check` and `node scripts/test-phone-database.mjs`: **PASS**. Enumerated and executed all **78** components of the repository `phone:data:check` suite (using direct Node commands because that ephemeral shell lacks the npm binary): **78/78 PASS**. S8 regression asserts the source/event one-to-one relationship, sourceCount=8/eventCount=3, correct port-in classification, no new OTP observation and unchanged independent-source counts for Telegram and WhatsApp. Eight modified files uploaded as Git content-addressed blobs and checked against local SHA-1, including all generated JSON artifacts.

### Product decision

**China-first new number / full activation / payment / KYC / exact-app OTP verified winners: ZERO.** Continue showing **No verified matches**; do not create a fake percentage or claim two separate original successful new-buyer end-to-end cases. A genuinely independent current new-buyer sequence must identify original operator path vs port-in, device, location, payment issuer country (not details), email/ID friction, the official UK attachment exception and exact Telegram/WhatsApp receipt at a dated time. Without that whole chain, this gate remains incomplete. Five recruited usability sessions and live-number checkout/OTP tests remain unperformed and cannot be inferred from S6 browser QA.

**Final release notes:** PR, Eval, Preview, merged main, exact production and live HTTP verification to be appended only once observed.
