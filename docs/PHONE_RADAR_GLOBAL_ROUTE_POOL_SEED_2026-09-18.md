# Phone Radar — Global Route Pool Seed

Date: 2026-09-18
Status: WORKING RESEARCH SEED / NOT PRODUCTION DATA

## Purpose

Phone Radar must not be organized as a country-by-country carrier encyclopedia.

The discovery direction is global:

> Search current community routes worldwide, then admit the routes that are materially useful for SMS/OTP, low-cost retention, remote setup, continuity and recovery.

Country is an attribute/filter, not the research boundary and not a coverage quota.

This document is a breadth seed for the product reset. It records current community leads that prove the route pool must support many countries and route types. None of these entries are automatically production-ready merely because a tutorial exists.

## Initial cross-region community leads

| Region / country | Route or cluster | Why it matters to Phone Radar | Current community signal | Working status |
|---|---|---|---|---|
| Hong Kong | ClubSIM | Very low keep-alive cost, eSIM, mainland-China SMS/OTP use is a common cross-border need | NodeLoc tutorial from 2025 reports online eSIM acquisition, HK$6/year number retention and free SMS reception; comments also show application availability can open/close over time | HIGH-VALUE LEAD |
| Hong Kong / cross-border | CTExcel / CMLink and other HK-number routes | Chinese-speaking cross-border users repeatedly compare these against ClubSIM and other HK numbers | June 2026 NodeLoc number-preservation roundup lists them as cross-border communication candidates | CLUSTER TO SCOUT |
| Taiwan | Chunghwa prepaid / Taiwan Mobile / FarEasTone prepaid and legacy low-cost routes | Overseas residents need Taiwanese OTP/bank/app SMS while avoiding full monthly plans | PTT, Mobile01, Dcard and Backpackers discussions show active 2024–2026 user testing of overseas SMS, VoWiFi/IP-SMS and device-specific behavior; outcomes differ by route/device | HIGH-VALUE CLUSTER |
| South Korea | SKT/KT keep-number suspension; MVNO/prepaid | Korean numbers are tightly tied to identity verification; long-term overseas retention is a real pain point | 2024–2026 Living_in_Korea reports describe low-cost number suspension and MVNO/prepaid alternatives, but eligibility depends strongly on residency/ARC/account state | HIGH-VALUE BUT SEGMENTED |
| Singapore | Singtel hi! prepaid / SIMBA / StarHub prepaid / MyRepublic | Strong overseas-OTP use case with cheap keep-alive discussions | 2024–2026 AskSingapore reports include prepaid keep-alive and overseas SMS experiences; route cost/recovery differs materially by provider | HIGH-VALUE CLUSTER |
| New Zealand | One NZ / Skinny / 2degrees casual prepaid | Cheap annual keep-alive and overseas SMS are repeatedly discussed | 2024–2025 NZ community reports describe annual top-up style retention, free incoming SMS on some routes and Wi-Fi Calling differences | HIGH-VALUE CLUSTER |
| Croatia | A1 Croatia prepaid eSIM | Extremely low annual keep-alive and China roaming/SMS tutorial makes it a classic hidden route | April 2026 NodeLoc tutorial reports eSIM acquisition, China LTE roaming, free incoming SMS, eSIM device transfer and €2 yearly-style keep-alive mechanics | HIGH-VALUE LEAD |
| Germany | O2 prepaid/eSIM | European number, Wi-Fi Calling, eSIM conversion, cheap retention paths | 2026 NodeLoc tutorials document O2 activation/KYC/eSIM and low-cost retention techniques; current Germany community also reports long-term roaming-policy ambiguity | HIGH-VALUE / NEEDS OUTCOME SPLIT |
| United Kingdom | Lyca / giffgaff / Lebara / Vodafone routes | Mature overseas-number market with many inexpensive retention approaches | 2026 NodeLoc threads continue to discuss Lyca, Lebara and Vodafone-style routes; real-world activation/roaming behavior differs significantly | EXISTING + NEW LEADS |
| United States | Tello / Ultra PayGo / H2O / RedPocket | Large OTP demand, but setup geography and monthly cost vary widely | Already represented in current research; RedPocket remains a candidate rather than the global research sequence | EXISTING CLUSTER |
| Thailand | AIS hidden support-assisted retention route | Hidden support/retention mechanisms are exactly the kind of route ordinary marketing pages miss | Existing Q-013 research; held because route-state boundaries remain unresolved | EXISTING HOLD |
| Ukraine | low-cost eSIM/retention routes | Shows why incident history matters more than a one-time tutorial | Jan 2026 NodeLoc thread promoted an extremely cheap keep-alive route, while comments immediately raised an international-roaming shutdown concern | WATCH / INCIDENT EXAMPLE |
| Malaysia | local prepaid/eSIM for foreigners | Current users explicitly seek long-term +60 numbers for OTP and low-cost maintenance | Aug 2026 Malaysian community question shows live demand for eSIM + OTP + long-term prepaid retention; concrete best route still needs discovery | DEMAND LEAD |

## Community sources used for this breadth sample

- ClubSIM tutorial: https://www.nodeloc.com/t/topic/64554
- Global preservation-card roundup: https://www.nodeloc.com/t/topic/96568
- A1 Croatia tutorial: https://www.nodeloc.com/t/topic/81137
- O2 Germany activation/retention tutorial: https://www.nodeloc.com/t/topic/81901
- O2 Germany Wi-Fi Calling / retention tutorial: https://www.nodeloc.com/t/topic/76182
- Lyca UK discussion/tutorial: https://www.nodeloc.com/t/topic/80512
- Ukraine low-cost eSIM discussion: https://www.nodeloc.com/t/topic/74711
- Taiwan overseas prepaid SMS discussion: https://www.ptt.cc/bbs/MobileComm/M.1721191406.A.2D2.html
- Taiwan long-term overseas number discussion: https://www.pttweb.cc/bbs/MobileComm/M.1737676610.A.EC0
- Taiwan 2026 dual-SIM/OTP discussion: https://www.backpackers.com.tw/forum/showthread.php?t=10633414
- Korea keep-number suspension discussion: https://www.reddit.com/r/Living_in_Korea/comments/1h7tltp/
- Korea number-preservation discussion: https://www.reddit.com/r/Living_in_Korea/comments/1hcbsbn/
- Korea MVNO long-term discussion: https://www.reddit.com/r/Living_in_Korea/comments/1npd7je/
- Singapore overseas-number discussion: https://www.reddit.com/r/askSingapore/comments/1do1nq0/
- Singapore 2026 SMS overseas discussion: https://www.reddit.com/r/askSingapore/comments/1uqx0nt/
- New Zealand overseas-number discussion: https://www.reddit.com/r/newzealand/comments/1iuf9tl/
- New Zealand incoming SMS discussion: https://www.reddit.com/r/newzealand/comments/19ebe6v/
- Malaysia long-term local-number demand: https://www.reddit.com/r/malaysians/comments/1vwtuqi/

## Discovery rule derived from this sample

Do not maintain a fixed country checklist such as “finish US, then Japan, then Thailand.”

Instead:

1. continuously search multilingual communities for low-cost number routes;
2. create a route lead when a post/tutorial contains a concrete purchase/setup/retention/OTP workflow;
3. group copied reposts rather than counting them as independent outcomes;
4. extract only decision fields: SMS/OTP, annual keep-alive cost, setup friction, remote practicality, continuity/recovery, current stability and tutorial;
5. prioritize leads by user value, freshness and uniqueness rather than country coverage;
6. allow several routes from one country when they solve materially different jobs;
7. allow zero routes from a country when nothing useful/reproducible is found;
8. keep country as a filter/tag in the UI, not the organizing principle of the research pipeline.

## Immediate breadth backlog

The next discovery passes should continue across regions rather than deepening a single carrier:

- East Asia: Hong Kong, Taiwan, South Korea, Japan;
- Southeast Asia: Singapore, Malaysia, Thailand, Philippines, Indonesia, Vietnam;
- Europe: UK, Germany, Croatia, Czechia, Netherlands, Poland, Portugal, Spain, Italy, France, Austria, Baltics and Nordics when useful routes appear;
- Oceania: New Zealand, Australia;
- North America: US, Canada, Mexico;
- other regions only when community evidence reveals a materially useful route.

This is not a requirement to fill every country. It is a search-space reminder so the radar stays global.