# Phone Number Tutorial Research Matrix

Status: research input for the private MVP only. Not production copy.

Updated: 2026-09-15

## Purpose

The MVP should not invent its own phone-number curriculum. It should learn the questions, sequence and failure modes that already attract attention in tutorials, videos and community threads, then verify any money/risk-critical answer against current first-party sources.

Working rule:

> Copy the questions and user journey, not the answers.

Popular/tutorial/community material is used to discover what users care about. Official provider/service material is used to decide what we are willing to state as a current rule. Community experience can remain as a dated observation, but never override a current official hard requirement.

This first pass covers four clusters only:

1. giffgaff / cheap UK number retention
2. long-term US numbers abroad
3. Japanese phone numbers for visitors/new arrivals
4. temporary SMS verification marketplaces

This is a high-visibility/high-ranking sample, not a claim that these are objectively the most-viewed pages on the internet.

---

## Cross-topic question taxonomy

Across the four clusters, the same user jobs recur:

### Before buying

- Where do I buy it?
- Is this the official seller or a reseller?
- Will they actually deliver it?
- Is the price normal or inflated?
- Physical SIM or eSIM?
- Will my phone support it?
- Do I need a local address, passport, residence card or other ID?
- Can I order before arriving in the target country?

### Activation

- Can I activate it where I am now?
- Must the first network connection happen in the home country?
- Does VPN/IP location matter, or is a physical cellular network requirement involved?
- How long until the number is assigned and usable?
- What APN/eSIM/network-selection steps are required?

### Registration / OTP

- Is this a real mobile number or data-only/VoIP/temporary?
- Does the target service accept this number class?
- Can it receive ordinary SMS abroad?
- Can Wi-Fi Calling/Text receive OTPs?
- What happens if the code never arrives?

### Long-term ownership

- What is the minimum keep-alive action?
- How often must I use/top up/renew it?
- Does receiving SMS count, or must I make qualifying outbound use?
- Is long-term overseas use itself allowed?
- Can the carrier disconnect the line even if the inactivity timer is satisfied?
- What happens to the number after plan cancellation or account closure?

### Failure / recovery

- What if the SIM/eSIM stops working?
- What if I change phones?
- Can I replace the SIM/eSIM while keeping the number?
- Can I port the number out?
- If the number is already recycled or disconnected, is there a recovery window?
- What refund is available if a temporary number does not receive a code?

These should become the product information architecture. Users should not need to know telecom terminology before seeing them.

---

# Cluster 1 — giffgaff / cheap UK number retention

## Tutorial/community samples reviewed

1. getgiffgaff tutorial index — purchase, activation, account, app, keep-alive, recharge, signal, mainland-China activation, OTP troubleshooting and eSIM topics.
   - https://getgiffgaff.com/guides/
2. LarkSim 2026 giffgaff guide — purchase, activation, eSIM, roaming and keep-alive framing for Chinese users.
   - https://larksim.com/guide/giffgaff-guide
3. giffgaff.gg guide — activation, China signal troubleshooting, number format and keep-alive workflow.
   - https://www.giffgaff.gg/blog/giffgaff-tutor
   - https://www.giffgaff.gg/blog/notice-after-active
4. giffgaff.shop activation walkthrough — account/payment/billing-address/activation flow.
   - https://www.giffgaff.shop/guides/2-activate/
5. YouTube: 2026 giffgaff activation/recharge/keep-alive tutorial, about 13.9k views at research time.
   - https://www.youtube.com/watch?v=G1og0_nx4TA
6. YouTube: 2026 giffgaff free-SIM/activation/mainland-use/keep-alive video, about 11.8k views at research time.
   - https://www.youtube.com/watch?v=cvRrX7mFnHw
7. Reddit 2026: users trying to keep a giffgaff number alive while living abroad.
   - https://www.reddit.com/r/giffgaff/comments/1vebamc/your_giffgaff_mobile_number_will_be_disconnected/
8. Reddit 2026: report of service disconnection after long-term non-UK usage.
   - https://www.reddit.com/r/giffgaff/comments/1vcbxwk/giffgaff_just_disconnected_my_service_for/

## What the popular material teaches us about demand

The recurring user intent is not "what is giffgaff?". It is:

- get a cheap real UK number;
- obtain/activate it outside the UK if possible;
- receive verification SMS in China/abroad;
- spend almost nothing while retaining the number;
- know the exact qualifying action that resets the inactivity clock;
- fix no-signal/SMS problems;
- avoid losing the number after months abroad.

Tutorials are successful because they present this as a sequence, not as a tariff comparison.

## Official/current verification

Primary sources reviewed:

- Getting started / activation:
  - https://help.giffgaff.com/en/articles/240912-getting-started-on-giffgaff
- Roaming outside the UK:
  - https://help.giffgaff.com/en/articles/229548-using-your-mobile-phone-in-the-rest-of-the-world
- Terms and long-term roaming/fair-use wording:
  - https://www.giffgaff.com/terms
- Leaving / PAC after inactivity deactivation:
  - https://help.giffgaff.com/en/articles/635745-getting-a-pac-or-stac-to-leave-giffgaff
- Number transfer into giffgaff:
  - https://help.giffgaff.com/en/articles/240398-joining-us-keep-your-existing-number

## Important conflict found

Many Chinese tutorials frame giffgaff as a simple long-term overseas "keep number cheaply" solution. The current official terms add a separate risk that cannot be reduced to the six-month inactivity timer: giffgaff explicitly warns against first use outside the UK and prolonged usage patterns outside the UK that do not resemble normal travel/holiday use.

Therefore:

- `qualifying keep-alive action completed` does **not** equal `safe for permanent overseas use`;
- the product must separate **inactivity risk** from **long-term overseas-use policy risk**;
- a user living permanently outside the UK should not see giffgaff labelled as a low-risk long-term solution solely because one SMS every few months can reset inactivity.

Recent Reddit reports about disconnections are useful as a warning signal, but they are not universal proof. The official terms are sufficient to justify a visible policy-risk warning.

## Product implication

The giffgaff result card eventually needs at least four separate fields:

- inactivity deadline / qualifying action;
- first-use / activation geography evidence;
- long-term overseas-use policy risk;
- number rescue/port-out window after deactivation.

---

# Cluster 2 — long-term US numbers abroad

## Tutorial/community samples reviewed

1. Tello Chinese guide hub — purchase, China usage, Wi-Fi Calling and long-term-number framing.
   - https://www.tello-cn.com/
2. DigitalNomadLC Tello China guide, updated 2026-08-09.
   - https://www.digitalnomadlc.com/how-to-use-tello-esim-in-china/
3. Enovace guide using Tello as part of a US-bank setup workflow.
   - https://blog.enovace.com/zh/tutorials/2026/05/20/us-bank-account-from-china/
4. TravelDataCard US eSIM/China guide — distinguishes US-first activation from later overseas use.
   - https://www.traveldatacard.com/us-esim-china-guide
5. YouTube: 2026 US-number tutorial discussing Tello/Google Voice alternatives, about 29k views at research time.
   - https://www.youtube.com/watch?v=PGnTUwVRzyo
6. Reddit Tello threads about activation outside the US and porting while abroad.
   - https://www.reddit.com/r/Tello/comments/1nohvrk/activating_new_number_outside_us/
   - https://www.reddit.com/r/Tello/comments/1pb77y5/activating_a_new_tello_number_and_porting_from/
   - https://www.reddit.com/r/Tello/comments/1cia3bb/activating_porting_number_while_abroad/
7. Reddit Ultra Mobile PayGo overseas-use threads.
   - https://www.reddit.com/r/NoContract/comments/1ab8w00
   - https://www.reddit.com/r/NoContract/comments/18cu25r

## What the popular material teaches us about demand

The US-number audience repeatedly asks:

- cheapest real US mobile number for 2FA/forms/account recovery;
- eSIM vs physical SIM;
- whether activation can be completed from China/Europe/Asia;
- whether VPN is enough;
- whether the number can receive bank/app OTP abroad;
- Wi-Fi Calling vs cellular roaming;
- minimum monthly cost;
- whether the number will survive years abroad;
- whether a local US address/E911 address is required;
- which route works without returning to the US.

This is exactly the user journey our tool should answer.

## Official/current verification

Primary sources reviewed:

- Tello: activation abroad — current rule says first activation/port-in must occur while physically in the US and connect to US network towers.
  - https://tello.com/help_center/international-calls/can-i-activate-tello-while-i-m-abroad
- Tello overseas usage — international roaming and Wi-Fi Calling/Text after activation.
  - https://tello.com/help_center/roaming/how-can-i-use-my-device-overseas
- Tello getting started / payment / SIM/eSIM flow.
  - https://tello.com/help_center/new-to-tello/how-can-i-get-started-with-tello
  - https://tello.com/activate

## Important conflict found

Some current Chinese tutorials still say Tello can be directly activated in China or imply that a US IP/VPN is the important condition. Current Tello documentation says the opposite: physical presence in the US and initial connection to US network towers are required.

Community threads contain anecdotal workarounds where some people report successful overseas activation using roaming or other conditions. These are useful evidence that real-world behavior can differ, but they do not change the official supported route.

Product rule:

- Never present VPN as a substitute for a carrier's physical network-attachment requirement.
- Never recommend a community workaround as the default route when it conflicts with the current provider rule.
- Community workaround observations may be stored separately as `reported exception`, with date/sample/context, not merged into `officially supported`.

## Ultra / H2O lesson

Community content often fills gaps that official prepaid documentation leaves unclear, especially initial activation abroad and Wi-Fi Calling behavior. We should learn the questions from those threads but keep unsupported fields `unknown` until provider evidence exists.

## Product implication

US routes need separate fields for:

- first activation geography;
- E911/address requirement;
- Wi-Fi Calling/Text abroad;
- cellular roaming SMS abroad;
- monthly/renewal floor;
- number-recovery/porting process;
- official support vs anecdotal workaround.

---

# Cluster 3 — Japanese phone numbers for visitors/new arrivals

## Tutorial/community samples reviewed

1. Sakura Mobile 2026 Voice+Data guide.
   - https://www.sakuramobile.jp/blog/plan-guides/sakura-mobile-japan-voice-and-data-sim-guide-the-essential-resident-plan-for-expats-students/
2. Sakura Mobile voice SIM/eSIM application procedure.
   - https://www.sakuramobile.jp/monthly/voice/application-procedure/
3. Sakura Mobile non-resident/passport FAQ.
   - https://support.sakuramobile.jp/hc/en-us/articles/40337436227225-Do-I-need-to-be-a-resident-to-apply-for-Monthly-contracts
4. Mobal phone-number type / number-loss rule.
   - https://helpdesk.mobal.com/support/solutions/articles/205000042589-phone-number-type
5. Mobal activation guide.
   - https://helpdesk.mobal.com/support/solutions/articles/205000041311-activation-guide-voice-lite-sim-esim-
6. eSIM Index 2026 Mobal tourist phone-number guide.
   - https://esim-index.com/en/blog/japan-esim-with-phone-number
7. Japan SIM Guide Mobal vs Sakura comparison.
   - https://japansimguide.com/mobal-vs-sakura-mobile/
8. Reddit threads on needing a 070/080/090 Japanese number for reservations/SMS.
   - https://www.reddit.com/r/JapanTravelTips/comments/16ezw78/how_do_you_get_a_japanese_phone_number_for_online/
   - https://www.reddit.com/r/JapanTravelTips/comments/1ovn4un/do_any_esim_providers_actually_get_you_a_japanese_phone_number/
   - https://www.reddit.com/r/JapanTravelTips/comments/1e8v1xa/japanese_phone_number/

## What the popular material teaches us about demand

The first question for Japan is usually **not** "which SIM is cheapest?". It is:

> Do I actually need a Japanese phone number, or is data enough?

The local number becomes valuable when the user needs:

- restaurant/ticket/reservation forms that expect a Japanese mobile number;
- ordinary calls to Japanese businesses;
- SMS verification;
- a contact number for housing/banking/other local workflows;
- a standard 070/080/090 mobile identity instead of a data-only travel eSIM.

The next questions are document/pickup/activation questions:

- Can a tourist/non-resident get the number?
- Is a passport enough?
- Is face-to-face verification required?
- Can I order before Japan?
- Airport/office pickup vs delivery/eSIM?
- When is the number assigned?
- What happens to the number after cancellation?

## Official/current verification

- Sakura Travel SIM/eSIM is data-only and does not supply a normal voice/SMS phone number.
  - https://support.sakuramobile.jp/hc/en-us/articles/27171487316121--Travel-SIM-eSIM-Can-I-make-phone-calls-or-send-SMS-with-the-Travel-SIM-eSIM
- Sakura Monthly Voice+Data supports passport use for non-residents, but passport-based voice-number applications require face-to-face identity verification/pickup under the documented flow.
  - https://www.sakuramobile.jp/monthly/voice/application-procedure/
  - https://support.sakuramobile.jp/hc/en-us/articles/40337436227225-Do-I-need-to-be-a-resident-to-apply-for-Monthly-contracts
- Mobal issues standard Japanese 070/080/090 numbers after activation; the number is lost if the service is terminated.
  - https://helpdesk.mobal.com/support/solutions/articles/205000042589-phone-number-type

## Important product lesson

A generic "Japan eSIM" comparison is insufficient. Most travel eSIM demand is data-only and already well served by existing comparison sites. Our unique branch should ask first whether a real Japanese number is required.

Also, number formatting itself can create apparent failures: community threads show users entering `+81...` or non-local formats into Japanese reservation systems that expect a domestic mobile format. The product should eventually explain domestic vs international formatting when evidence supports it.

## Product implication

Japan route cards should distinguish:

- data-only travel product;
- real Japanese mobile number (070/080/090);
- tourist/non-resident eligibility;
- identity document accepted;
- face-to-face pickup/verification requirement;
- when number is assigned;
- whether number survives cancellation;
- local-format usage guidance.

---

# Cluster 4 — temporary SMS verification marketplaces

## Tutorial/community samples reviewed

1. SMSPool getting-started guide — account, deposit, one-time SMS vs rental vs data eSIM, service/country/pool selection and stock.
   - https://www.smspool.net/article/getting-started-with-smspool-a269862fdb3f
2. SMSPool order/view/cancel API guide.
   - https://www.smspool.net/article/smspool-api-order-view-and-cancel-numbers-9883b6969fad
3. SMSPool API docs with country/service success-rate and price data.
   - https://www.postman.com/smspool/smspool-api/documentation/be7o1wo/smspool-api
4. SMSPool balance-refund guide.
   - https://www.smspool.net/article/how-to-request-a-balance-refund-on-smspool--484d70f56719
5. 5SIM manual — service → country → operator → purchase flow and current public starting prices.
   - https://5sim.com/manual
6. 5SIM rules / refund limits.
   - https://www.5sim.com/rules
   - https://5sim.com/support/i-receive-incorrect-code
7. Reddit review/comparison of temporary-number providers.
   - https://www.reddit.com/r/PrivateInternetAccess/comments/ysbz5r/temporary_numbers_as_a_good_tool_to_protect_our/
8. Reddit 2026 current-provider discussion distinguishing free public numbers, one-time activations and rentals.
   - https://www.reddit.com/r/NoContract/comments/1ta4lc8/list_of_sms_verification_providers_that_still/

## What the popular material teaches us about demand

Temporary-verification users do not primarily want a telecom plan. Their decision is:

`target service -> number country -> supplier/pool -> current stock -> current price -> recent success -> refund behavior`

They also care about:

- whether the number has already been used;
- whether the SMS will arrive within the order window;
- whether failed/no-code orders are refunded automatically;
- one-time activation vs rental/long-term access;
- whether a free/public number exposes their SMS to strangers;
- whether a banned/rejected target account is refundable;
- whether the provider has current stock for the exact service/country pair.

## Official/current verification

SMSPool documents:

- separate one-time SMS, rental and data-only eSIM products;
- service/country/pool/stock selection;
- success-rate and price API data;
- cancellation/refund behavior for no-code orders;
- unused-deposit refund conditions.

5SIM documents:

- service/country/operator purchase flow;
- public starting prices;
- API access;
- refund/support requirements for incorrect SMS;
- no guarantee/refund simply because the resulting target account is banned.

## Important product lesson

The product must never collapse these into a single "works / doesn't work" score.

Separate:

- provider marketplace reliability;
- exact service-country-pool success data;
- refund/no-code protection;
- number ownership duration;
- target service's own acceptance rules;
- long-term recovery suitability.

A temporary number that receives one Telegram code successfully can still be a terrible choice for a long-term account.

Free public receive-SMS sites also represent a different risk class because messages may be visible to other users. They should not be ranked alongside private/dedicated paid routes without an explicit privacy warning.

The MVP must remain guidance/comparison only: no OTP storage, no mass registration automation, no anti-abuse/KYC bypass workflows.

---

# First conflict matrix

| Topic | Tutorial/community claim or recurring advice | Current first-party rule / stronger evidence | MVP treatment |
|---|---|---|---|
| giffgaff keep-alive | Send/top-up periodically and the number is safe long term abroad | Inactivity and long-term overseas-use/fair-use are separate; current terms warn against first use abroad and prolonged non-UK usage patterns | Show two different risks; do not label permanent overseas retention low-risk |
| Tello activation | Some guides say activate from China/abroad, sometimes with VPN | Current Tello rule requires physical US presence and first connection to US towers | Hard-block as immediate activation outside US; anecdotes only as separate observations |
| Tello abroad OTP | Wi-Fi Calling/Text can be used abroad | Current Tello docs support Wi-Fi Calling/Text and roaming after US activation | Show as supported only after activation prerequisites |
| Japan travel eSIM | "Japan eSIM" often implied to solve connectivity generally | Many travel eSIMs are data-only and have no Japanese phone number/SMS | Ask whether a local number is actually required before comparing routes |
| Sakura voice number | Tourist/non-resident can use passport | Passport-based Voice+Data flow requires documented face-to-face identity verification/pickup | Show passport eligibility together with pickup/verification constraint |
| Mobal number | Real Japanese number | Official docs confirm standard 070/080/090 number after activation and loss after termination | Show assignment timing and number-loss rule prominently |
| Temporary SMS cheap route | Cheapest number is the best choice | Success, stock, supplier pool, refund and number duration vary independently | Rank by task + success/refund/ownership, not price alone |
| Temporary SMS refund | "If it fails I get my money back" | Refund conditions differ; no-code cancellation can be refundable, target-account ban may not be | Display exact refund trigger, not generic "refund available" |

---

# MVP design changes implied by this research

Do not add more countries yet. The next useful data/model changes are:

1. Add a distinct `long_term_overseas_policy_risk` field, separate from inactivity/keep-alive.
2. Add `evidence_class`: `official-supported`, `official-restricted`, `community-observed`, `unknown`.
3. Never let `community-observed` override an `official-restricted` activation rule.
4. Add `number_assignment_timing` and `number_loss_on_termination` for local-number products.
5. Add `refund_trigger` for temporary SMS routes: no-code, cancellation window, incorrect code, banned target account, deposit refund.
6. Add `number_duration`: one-time, rental, renewable/durable carrier line.
7. Add `privacy_class` for temporary SMS: public inbox vs private/dedicated route.
8. Build the UI around the repeated tutorial questions rather than around providers.

## Stop condition for this research phase

Do not keep collecting tutorials indefinitely. For each cluster, stop when new sources mostly repeat the same questions and no longer introduce a new failure mode, conflict, or decision variable.

The next step after this matrix is to feed only the validated new decision variables back into the private MVP and test whether the result is materially faster and safer than reading the source tutorials manually.
