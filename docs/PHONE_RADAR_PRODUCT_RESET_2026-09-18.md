# Phone Radar Product Reset — 2026-09-18

Status: **ACTIVE PRODUCT RESET / NO PRODUCTION UI CHANGES YET**

This document records the product-direction correction agreed on 2026-09-18. It is a task list and guardrail for the next Phone Radar work round. It does not authorize production implementation by itself.

## Root-cause retrospective

The project started from the correct user job: help a user discover non-obvious, low-cost, currently usable phone-number routes from real community experience.

The product drifted because internal research and evidence handling were allowed to shape the public interface. The result became a questionnaire + research explanation instead of a fast decision tool.

The failure sequence was:

1. community tutorials and first-hand reports found valuable hidden routes;
2. research expanded into carrier-by-carrier documentation and rule reconciliation;
3. missing public documentation was increasingly represented as `unknown`;
4. internal evidence fields became public UI fields;
5. the page became a long explanation of why a route was or was not recommended;
6. research effort shifted toward completing provider records instead of helping the user choose a number quickly.

The correction is structural, not cosmetic.

## Product job

> **Phone Radar helps a user find, compare, open and keep a useful phone number using current real-user routes that are hard to discover from ordinary marketing pages.**

The user is not here to study carrier research, evidence methodology or source reconciliation.

The public experience must answer quickly:

- What number routes are available right now?
- How reliable is SMS/OTP reception in real use?
- What does it cost to obtain and keep the number for a year?
- How difficult is setup?
- Can I complete the route from my current location?
- What is the current stability / continuity risk?
- How do I open it?
- How do I keep it alive?
- Where do I buy it?

## Frontstage / backstage boundary

### Backstage — internal only by default

- forum/community discovery;
- cross-report reconciliation;
- source credibility assessment;
- incident history;
- success/failure event collection;
- confidence calculation;
- route freshness logic;
- risk derivation;
- duplicate/circular-report detection;
- research notes and raw source lists.

### Frontstage — what the user sees

- provider / route identity;
- country / number type;
- SMS/OTP reception signal;
- yearly keep-alive cost;
- setup difficulty;
- remote setup/location practicality;
- current stability/risk signal;
- eSIM / physical SIM state when relevant;
- short capability tags;
- purchase/opening action;
- concise tutorial;
- keep-alive instruction;
- major pitfall only when it changes the decision.

Research provenance may exist behind an optional detail control, but it must never be the normal reading path.

## Community reality rule

Real-user reports, tutorials, forum threads, comments, support interactions shared by users, and recent success/failure reports are the primary operational dataset for Phone Radar.

Public carrier pages are not an operational verification gate and absence from them must not turn a reproduced community route into `unknown` by default. Public price/product metadata may be collected when useful, but it does not override real-world operating evidence.

The product should track what happened in practice: successful opening, successful OTP reception, failures, number recovery, refunds, reversals, support outcomes, mass complaints, policy enforcement waves, and whether a route is improving or degrading over time.

## Metrics that need definitions before UI implementation

### SMS/OTP reliability

Do not invent a fake percentage. Until enough route-specific observations exist for a defensible rate, show a qualitative signal derived from recent community outcomes, sample count and recency.

Future numeric success rates must expose the observation window and sample size internally and must not imply statistical precision that the dataset does not support.

### Setup difficulty

Difficulty must be derived from actual friction: KYC, travel/local-presence requirement, support contact, SIM/eSIM conversion, device constraints, payment restrictions and number of manual steps.

The user may see a compact indicator; the reasons belong in a short actionable summary.

### Phone route risk

Do not reuse Relay Exit Risk methodology or invent an arbitrary 0–100 score.

Before a numeric Phone risk index can ship, define its scope and inputs. Candidate dimensions include recent service failures, number-loss/recycling events, abrupt enforcement, support inconsistency, recovery quality, long-term overseas continuity and trend direction.

Until that model exists, use descriptive states such as `stable`, `watch`, `degrading`, `conflicting`, or equivalent product language.

## Reset task list

### R-001 — Freeze the wrong loop

- Pause provider-by-provider documentation completion as the default next action.
- Pause RedPocket/AIS expansion unless new work directly supports the redesigned decision surface.
- Do not patch the current questionnaire/manual UI incrementally.
- Do not add another Phone URL.

**Done when:** the execution queue no longer sends the next session automatically into another carrier audit.

### R-002 — Rewrite the user-facing information contract

Define the minimum fields required for a useful route card and route detail.

Required card-level decision data:

- route/provider;
- number country/type;
- recent SMS/OTP reliability signal;
- real yearly keep-alive cost;
- setup difficulty;
- remote setup/location practicality;
- current stability/risk state;
- eSIM/physical SIM where material;
- recent-status/freshness signal;
- `How to open` and `Get / Buy` actions.

**Done when:** every visible field answers a user decision or action question. No research-methodology field is required to understand the card.

### R-003 — Define the detail/tutorial layer

The detail view should be a short operational playbook, not a literature review:

1. what to buy;
2. what to prepare;
3. exact opening steps;
4. how to receive SMS/OTP;
5. how to keep the number alive;
6. main current pitfall;
7. recovery/number-continuity path;
8. purchase link;
9. useful tutorial/video/community link when available and current.

**Done when:** a user can execute the route without first understanding the research system.

### R-004 — Redesign the data model around events and outcomes

Make community reality first-class data rather than an annotation on top of static carrier records.

Needed internal concepts:

- success event;
- failure/refusal event;
- OTP reception event;
- activation/setup event;
- keep-alive event;
- number-loss/recovery event;
- refund/restoration/support-resolution event;
- price/cost observation;
- tutorial/procedure observation;
- route snapshot over time.

**Done when:** the system can represent a route that was stable, degraded, triggered complaints, then recovered without flattening that history into one static rule.

### R-005 — Reclassify existing Phone data

Review current fields and separate them into:

- user-facing decision data;
- backstage research data;
- obsolete fields created by the old documentation-first mindset.

Specifically find `unknown` states caused only by lack of public documentation and re-evaluate them from real-user evidence instead.

**Done when:** missing marketing documentation is no longer treated as missing operational reality.

### R-006 — Build a community-signal research workflow

Research queries should prioritize:

- recent successful setup;
- recent OTP/SMS success and failure;
- current keep-alive cost;
- hidden/retention packages;
- overseas use;
- number recovery/reissue;
- sudden enforcement or recycling incidents;
- customer complaints and support outcomes;
- current tutorials and practical setup paths.

Stop researching once more information would not change the user's route choice, cost, difficulty, risk, tutorial or warning.

**Done when:** research is organized around user decisions and outcomes, not around completing a carrier encyclopedia.

### R-007 — Define the visual decision model before coding

Produce a layout specification/wireframe for the existing Phone canonical before implementation.

Requirements:

- useful routes visible without completing a questionnaire;
- lightweight filters refine rather than gate access;
- visual hierarchy emphasizes route, reliability, cost, difficulty and risk;
- proportions should be calm and information-dense without giant controls or cramped cards;
- source/evidence details are secondary/on-demand;
- mobile is a first-class layout, not a squeezed desktop version.

**Stop condition:** do not begin production implementation until this interaction model is reviewed as a product concept.

### R-008 — Implement only after the model is accepted

When authorized:

- use a fresh branch/worktree;
- preserve one Phone canonical;
- reuse existing route data where it still supports the new contract;
- remove questionnaire-first gating;
- implement route-first browsing + optional filters + tutorial detail;
- do not bulk-add providers as part of the redesign.

### R-009 — Validate the redesigned product as a tool

Minimum acceptance checks:

- a first-time visitor can see concrete number routes immediately;
- no research-methodology reading is required to compare routes;
- yearly cost, setup difficulty and SMS/OTP signal are scannable;
- opening/keep-alive actions are obvious;
- route details remain concise;
- mobile has no overflow and maintains hierarchy;
- current underlying data can update without rewriting the whole page;
- analytics can distinguish route view, filter use, tutorial open and outbound purchase/opening actions.

### R-010 — Resume route expansion only after the product reset

After the redesigned decision surface exists, resume candidate research only when a new route materially improves the available choices.

RedPocket, AIS and other candidates are inputs to the radar, not milestones by themselves.

## Explicit non-goals

- no carrier encyclopedia;
- no official-rule explainer as the main product;
- no mandatory multi-step questionnaire before seeing routes;
- no source bibliography on the default result screen;
- no fake SMS success percentage;
- no arbitrary Phone risk score;
- no bulk provider/country pages;
- no new canonical URL;
- no production redesign before the interaction model is agreed.

## Next action

The next Phone task is **R-002 + R-003 + R-007 as a product specification/wireframe discussion only**. Production code remains frozen until that concept is accepted.
