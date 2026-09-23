# Phone Radar — UK Pilot Source Reconciliation Packet

Date checked: 2026-09-23
Status: P1 SOURCE RECONCILIATION IN PROGRESS / FIRST PASS COMPLETE
Scope: UK long-term SMS/OTP pilot only

This packet is the evidence gate for the first carrier-directory implementation. A claim does not enter the UK pilot UI merely because it appears in a forum post. Claims below are separated into publishable observations, unresolved fields and hold conditions.

The pilot candidates are intentionally limited to:

- Vodafone UK direct
- VOXI on Vodafone UK
- Lebara UK on Vodafone UK
- Giffgaff on O2

No other market/family is part of this packet.

## Evidence rules used in this packet

- Forum/community first-hand reports drive operational claims.
- Provider pages may later refresh list price/checkout metadata only.
- Commercial reseller posts can establish that a route/offer exists, but cannot by themselves establish reliability.
- Copied/circular reports are not counted independently.
- Fewer than five reasonably independent route+service+operation observations means no percentage.
- Unknown stays unknown.
- Unsafe/deceptive acquisition instructions are excluded even if a forum post mentions them.

---

## 1. Vodafone UK direct — £0 acquisition episode

### Pilot state

**OBSERVATION ROW / NOT A LONG-TERM GUIDE YET**

Reason: the June 2026 £0 eSIM acquisition episode is valuable information, but current community evidence does not establish a clean, durable long-term retention path. Some acquisition reports also mention questionable address practices; those instructions must not be reproduced.

### Host network / brand

- Market: UK
- Host network: Vodafone UK
- Brand: Vodafone UK direct
- Route: June 2026 £0 eSIM acquisition episode

### Acquisition evidence

Observed in June 2026:

- £0 checkout route reported by multiple LINUX DO users.
- eSIM QR delivery was reported after order processing.
- payment-card authorization was required by users even when the order value was zero.
- users warned to disable auto-renew / remove the payment method if they did not want continuation.
- some users reported payment-card acceptance friction.

Strong source threads:

- https://linux.do/t/topic/2401952
- https://linux.do/t/topic/2404421
- https://linux.do/t/topic/2401313

### Landed cost

- Community acquisition price: `£0` during the observed episode.
- Mandatory top-up: not established for the £0 episode.
- Physical shipping: not applicable to the eSIM path; physical-SIM mistakes were reported but are not the intended route.
- Extra device/eSIM-adapter cost: device-dependent; unknown unless the user lacks native eSIM support.
- CNY landed cost: do not publish until the active acquisition path is rechecked and FX is timestamped.

### Retention / keep-alive

Current evidence is **not sufficient for a durable long-term keep rule**.

Forum users explicitly described the route as difficult to keep and suggested treating it as temporary/quarterly-use or porting the number elsewhere. Another thread explored using Vodafone as an acquisition bridge and then porting to Giffgaff.

Sources:

- https://linux.do/t/topic/2404421
- https://linux.do/t/topic/2417339

UI state for MVP if shown:

- Keep/year: `Not established`
- Keep rule: `Long-term path unverified`
- Trend: `Watch`
- Guide action: only if a legitimate current acquisition path can be reproduced without fake identity/address information.

### App compatibility

No sufficient independent route-specific sample packet has been reconciled yet for ChatGPT / Telegram / WhatsApp.

UI: `Not enough current data` — no percentage.

### Continuity / refund / recovery

- Long-term continuity: unverified.
- Port-out discussion exists; no normalized success sample yet.
- Refund/recovery evidence: not reconciled.

### Safety exclusion

Do not reproduce forum suggestions to use fabricated addresses or identities. If the route cannot be obtained legitimately for the target user context, it remains an observation row or is dropped from the shipping pilot.

---

## 2. VOXI — Vodafone UK network

### Pilot state

**PUBLISHABLE CANDIDATE WITH ACQUISITION-CAVEAT**

Operational keep-alive evidence is stronger than the Vodafone-direct £0 route. Current free/discount acquisition paths are episodic and sometimes depend on one-use community coupon codes or reseller availability, so acquisition state must be time-stamped.

### Host network / brand

- Market: UK
- Host network: Vodafone UK
- Brand: VOXI
- Route: eSIM / PAYG-style retention after promotional plan period

### Acquisition evidence

Observed community patterns:

- free/discount one-use coupon codes were distributed in June-August 2026;
- forum users reported successfully activating via those codes;
- some current commercial/reseller posts sell a coupon or preconfigured account, which introduces reseller dependency and must not be treated as the only official route;
- older routes relied on education-email eligibility; the pilot must not recommend rented/borrowed eligibility credentials.

Sources:

- https://linux.do/t/topic/2399041?page=3
- https://linux.do/t/topic/2737575
- https://www.nodeloc.com/t/topic/102713

### Landed cost

Current evidence supports multiple acquisition states rather than one fixed price:

- coupon route: `£0 acquisition observed`, availability episodic;
- no-coupon route: community summaries report a paid first-month plan, value varies;
- minimum top-up repeatedly reported: `£5`;
- non-native-eSIM users may need an eSIM adapter/blank card; current reseller/community examples mention roughly CNY 20 for a simple blank card, but this is an accessory path, not part of VOXI itself.

Do not publish a single CNY landed cost until the shipping implementation chooses one currently reproducible acquisition path and timestamps the FX rate.

### Keep-alive evidence

Repeated community reports state that a balance-changing activity can refresh the line and users work to a 180-day interval.

Observed methods:

- Wi-Fi Calling SMS;
- small roaming-data usage;
- other balance-changing activity.

A May 2026 LINUX DO thread contains multiple users discussing 180-day balance-change retention and practical roaming-data/Wi-Fi-Calling methods.

Sources:

- https://linux.do/t/topic/2188975
- https://linux.do/t/topic/2399041?page=3
- https://www.nodeloc.com/t/topic/102713

User-facing candidate fields:

- Keep interval: `within 180 days` (community-reproduced; provider refresh still required for commercial/published rule metadata if used)
- Minimum top-up: `£5 observed`
- Keep/year: derive only after the exact reproduced keep action/cost is chosen for the row.

### Wi-Fi Calling / activation

Evidence is mixed enough that the UI must show friction rather than `easy`:

- some users report Wi-Fi Calling works after an initial successful setup;
- others report difficulty pulling Wi-Fi Calling up;
- some users use tiny roaming data instead of Wi-Fi Calling for keep-alive activity;
- August discussion suggests already-activated eSIM state can change later setup behavior.

UI candidate: `Wi-Fi Calling: workable but setup-sensitive`.

### App compatibility

A commercial NodeLoc post claims ChatGPT and other services, but this is not enough to show a success percentage or independent `works` label.

Current independent reconciled packet:

- ChatGPT/OpenAI: `insufficient independent sample`
- Telegram: `insufficient independent sample`
- WhatsApp: `insufficient independent sample`

No percentages.

### Continuity / refund / recovery

- no normalized mass-closure event packet found in this first pass;
- users explicitly compare VOXI as an alternative after Giffgaff problems, but that does not prove long-term stability;
- refund/reissue/port-out outcome packet still incomplete.

Trend for first MVP: `Watch` or `Not enough history` rather than `Stable` until reconciliation is stronger.

---

## 3. Lebara UK — Vodafone UK network

### Pilot state

**PUBLISHABLE CANDIDATE / STRONG OPERATIONAL FIRST-HAND EVIDENCE**

This is currently the strongest pilot example of why Phone Radar needs operation-specific evidence rather than one generic OTP label.

### Host network / brand

- Market: UK
- Host network: Vodafone UK
- Brand: Lebara UK
- Route: direct Lebara UK eSIM, installed in mainland China without first attaching to the UK Lebara network

### Acquisition evidence

A September 2026 follow-up post describes a low-cost flow:

- lowest promotional first-month plan around `£1.5`;
- then `£5` credit/top-up to activate/use the number;
- one user summarized total initial spend as roughly `£6.5` for that flow.

Another August user explicitly said the eSIM was purchased directly from the Lebara website while in China.

Sources:

- https://linux.do/t/topic/2745784
- https://linux.do/t/topic/2894665

This must be refreshed before release because promotional plan price is time-sensitive.

### Landed cost

Current community-reproduced starting point:

- first-month promotional plan: `~£1.5` observed;
- top-up/credit: `£5` observed in a port-in/activation flow;
- eSIM physical shipping: none;
- native eSIM device assumed; adapter cost is separate if needed;
- current candidate landed total: `~£6.5` observed for one recent flow, **not yet a universal current price**.

### China / overseas activation and SMS

Detailed August 12, 2026 first-hand report:

- eSIM bought and installed in mainland China;
- never attached to the UK Lebara network at that point;
- inbound SMS worked;
- WhatsApp verification SMS received;
- Telegram verification SMS received;
- Lebara system SMS received;
- incoming voice did not ring normally and went to voicemail;
- outgoing SMS was initially abnormal in the reported setup;
- support told the user full UK-network activation would be needed for normal outgoing voice/SMS behavior.

A second participant reported the same high-level state: inbound WhatsApp / Lebara / Telegram SMS worked while outgoing SMS and Wi-Fi Calling were initially problematic.

Source:

- https://linux.do/t/topic/2745784

### App compatibility

Current reconciled observation count is below the percentage gate.

- WhatsApp registration/verification: at least 2 recent same-thread first-hand reports of inbound success; `n < 5`, no percentage.
- Telegram registration/verification: at least 2 recent same-thread first-hand reports of inbound success; `n < 5`, no percentage.
- ChatGPT/OpenAI: no clean route-specific first-hand sample reconciled in this packet yet.

UI should show raw counts / insufficient sample, not `100%`.

### Keep-alive evidence

The detailed August report contains a billed `£0.49` outgoing SMS attempt. The destination did not receive it, but MyLebara showed the charge and support confirmed for that account that the billed chargeable activity restarted the 90-day inactivity window.

The user planned to perform a real chargeable action around every 70–75 days rather than wait until day 90.

Important conflict:

- another user in the same thread said their Lebara UK line had survived more than a year without a balance change.

Therefore the UI must not flatten this into a guaranteed deletion-on-day-90 rule.

Candidate display:

- Reproduced chargeable-activity interval: `90 days confirmed for one account/support interaction`
- Practical buffer used by reporter: `70–75 days`
- Action cost: `£0.49 observed`
- Minimum simple annual arithmetic at exactly four £0.49 actions: `£1.96/year`; practical buffered usage can be higher. This is a calculation from the observed action cost, not a provider promise.

### Wi-Fi Calling

Mixed / setup-sensitive:

- main August reporter could not get Wi-Fi Calling working;
- other users discuss difficult setup and separate methods;
- another thread reports a user refunding after inability to get service working.

UI candidate: `Wi-Fi Calling: difficult / conflicting`.

Source:

- https://linux.do/t/topic/2763577

### Continuity / refund / recovery

Current first-pass evidence:

- no mass shutdown event comparable to Giffgaff has been established in this packet;
- at least one user reported refunding after service/base-station problems;
- Giffgaff users report porting numbers into Lebara, showing a practical migration use case;
- full refund/reissue statistics remain insufficient.

Trend candidate: `Watch` (because activation/Wi-Fi-Calling behavior conflicts), not `Stable`.

---

## 4. Giffgaff — O2 network

### Pilot state

**PUBLISHABLE CANDIDATE / MUST SHOW CONTINUITY WARNING PROMINENTLY**

Giffgaff has the richest evidence packet, including useful low-cost acquisition/keep-alive information and a material 2026 closure/recovery/refund history. It must not be represented by a simple `Good` or `Stable` label.

### Host network / brand

- Market: UK
- Host network: O2
- Brand: Giffgaff
- Route: direct eSIM / PAYG credit route

### Acquisition evidence

May 2026 first-hand flow:

- download Giffgaff app;
- choose eSIM;
- choose PAYG / no plan;
- minimum top-up reported: `£10`;
- Visa/Mastercard used successfully by community users.

Source:

- https://linux.do/t/topic/2244241

For mainland-China phones without native foreign eSIM support, community routes include:

- native overseas-market eSIM phone: no extra adapter cost;
- physical official SIM: community resale examples around CNY 100, variable;
- blank/eSIM adapter card: community examples around CNY 10–20 for simple blank cards, but some branded adapters cost far more.

Sources:

- https://linux.do/t/topic/2479147
- https://linux.do/t/topic/2316548?page=2

The row must not silently treat adapter/shipping cost as zero. The acquisition path selector matters.

### Landed cost

Native-eSIM path:

- required credit/top-up: `£10` observed;
- extra shipping: none;
- adapter: none if the device natively supports the route.

Mainland-phone adapter path:

- `£10` credit plus adapter/blank-card cost;
- one expensive Xesim example totaled roughly USD 39.72 / CNY 268.75, demonstrating why accessory choice must be a separate landed-cost component rather than part of the carrier price.

Source:

- https://linux.do/t/topic/2316548?page=2

### Keep-alive evidence

Repeated community rule:

- create a balance-changing activity within 180 days;
- examples include an outgoing SMS or small data usage.

One June 2026 user described approximately `£0.30` per 180-day keep action, implying roughly `£0.60/year` if performed twice a year. This is an observed community cost, not yet a universal tariff guarantee.

Sources:

- https://linux.do/t/topic/2244241?page=2
- https://linux.do/t/topic/2432207

### App compatibility

Current first pass is useful but below the percentage gate for each route+service+operation combination.

ChatGPT / Codex:

- June 5, 2026 user reported Codex verification SMS arriving immediately on Giffgaff in China;
- same thread had another user reporting fast Google verification.

Source:

- https://linux.do/t/topic/2310901

Telegram:

- June 7 thread contains an initial failure to receive Telegram registration SMS;
- same user later reported it worked about an hour later;
- another user said direct registration worked but number-change/binding behavior differed;
- Telegram X was reported as a workaround in the same discussion.

Source:

- https://linux.do/t/topic/2322268

WhatsApp:

- same June 7 thread reports WhatsApp SMS working while Telegram initially failed.

Result for MVP:

- ChatGPT/OpenAI: `recent success observed; insufficient sample for rate`
- Telegram: `mixed / operation-dependent; insufficient sample for rate`
- WhatsApp: `recent success observed; insufficient sample for rate`

No percentages yet.

### Recycled-number evidence

February 2026 user reported receiving a newly obtained Giffgaff number that appeared tied to a prior Telegram account, indicating recycled/reallocated-number risk at acquisition.

Source:

- https://linux.do/t/topic/1615582

This is an observed anecdote, not a population recycling rate.

### 2026 closure / suspension wave

This must be a first-class event, not a hidden caveat.

Late July 2026 forum discussions describe a large wave of Giffgaff closures/suspensions affecting long-term overseas users, with loss of service and refund disputes.

Sources:

- https://linux.do/t/topic/2678340
- https://linux.do/t/topic/2661848
- https://linux.do/t/topic/2668038

### Recovery / restoration

August 2026 users began reporting some accounts/numbers being restored. Reports were not universal; some users received restoration, others did not.

Sources:

- https://linux.do/t/topic/2773030
- https://linux.do/t/topic/2777786
- https://linux.do/t/topic/2790241

### Refund outcomes

Refund evidence is mixed but materially improved by September:

- August: users reported some successful refunds after closure, while many others were denied or delayed.
- September 3: a user reported refund success after roughly a month and many tickets.
- September 11: another user reported eventual approval after a month-long dispute.
- September 12: one user reported automatic refund after successful port-out to Lebara.
- September 15: a user reported a refund arriving after earlier repeated denials.

Sources:

- https://linux.do/t/topic/2728830
- https://linux.do/t/topic/2849289
- https://linux.do/t/topic/2889603
- https://linux.do/t/topic/2894665
- https://linux.do/t/topic/2903412

UI candidate:

- Refund: `Mixed — multiple eventual successes after delays/denials`
- Recovery: `Partial / mixed`
- Trend: `Conflicting` (cheap/useful route, but major recent continuity event)
- Closure incidents: do not invent a numeric count until individual independent events are normalized; display `2026 mass closure wave observed` first.

---

## 5. First-pass admission decision

### Ready to normalize for the pilot

1. **Lebara UK** — strongest current first-hand operational packet; include with activation/Wi-Fi-Calling conflict visible.
2. **Giffgaff** — include only if the July closure wave and Aug-Sep recovery/refund history are prominent, not buried.
3. **VOXI** — include with acquisition dependency and insufficient independent app evidence clearly shown.

### Hold / observation only

4. **Vodafone UK direct £0 episode** — useful as a cheap acquisition/port-out episode, but do not publish a long-term execution guide until a legitimate, reproducible current acquisition path and retention method are verified. Never reproduce fake-address/identity tactics.

This means the production MVP may ship with **three fully actionable rows plus one clearly non-long-term observation row**, or may omit Vodafone direct entirely if current re-verification fails.

## 6. P2 normalization work unlocked by this packet

The next bounded work item is to encode only the accepted fields above into normalized pilot data:

- market/network/brand/route identity;
- acquisition path variants;
- landed-cost components;
- keep action/interval/cost;
- service observations with operation/date/source;
- continuity events;
- refund/recovery outcomes;
- trend/freshness;
- guide eligibility.

No UI percentage is currently justified for ChatGPT/OpenAI, Telegram or WhatsApp in this first-pass packet because no reconciled route+service+operation sample has reached the `n >= 5` gate.
