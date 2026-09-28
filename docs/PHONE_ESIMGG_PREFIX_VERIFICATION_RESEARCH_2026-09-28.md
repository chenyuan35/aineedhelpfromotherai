# eSIM.gg number-prefix verification research

Date: 2026-09-28
Status: **RESEARCH CANDIDATE / BACKSTAGE ONLY**

## Decision

Admit this as a distinct Phone Radar research branch, not as a new public route or a success-rate claim.

The user job is different from ordinary acquisition/retention comparison: **within the same eSIM.gg product, which number prefixes are currently clean enough to receive registration/verification codes for specific services?**

This should eventually sit under a hierarchy like:

`provider/product → number-prefix group → finer prefix → service → operation → dated outcome samples`

It does not replace the existing lifecycle/keep-alive model. It adds a compatibility/purity dimension beneath a route.

## Community source

Primary thread:

- LINUX DO: `eSIM.gg（乌龟卡）号码各号段纯净度（接码）集中讨论`
- Thread URL: https://linux.do/t/topic/2919304
- User-supplied focus post: https://linux.do/t/topic/2919304/3
- Thread published: 2026-09-18
- Reviewed: 2026-09-28

The thread says eSIM.gg numbers have many finer segments (the OP says 24) and groups them for discussion into broad prefix families `81`, `59`, `57`, `54`, and `53`.

## Direct first-person evidence captured

### 8103

The thread opener reports opening an eSIM.gg number in the `8103` segment and successfully receiving verification codes and registering both:

- Telegram — success
- WhatsApp — success

The same report says no risk-control block was encountered at that time.

Evidence class: one current first-person report, dated 2026-09-18.

### 5405

The same opener reports a second eSIM.gg number in the `5405` segment with:

- Telegram — success
- WhatsApp — success

The same report says no risk-control block was encountered at that time.

Evidence class: one current first-person report, dated 2026-09-18.

### 53 broad prefix

Post 3 reports that a `53`-prefix number successfully received verification for:

- Codex — success
- `ws` — success as written by the user

Do **not** normalize `ws` to WhatsApp without corroboration; preserve it as an unresolved source abbreviation.

Evidence class: one current first-person report, dated 2026-09-18.

## Poll evidence limitation

The thread contains three public polls covering broad prefix groups across services including WhatsApp, Telegram, Apple ID, PayPal, Instagram, TikTok, Amazon, Microsoft, Google/Gemini, OpenAI/ChatGPT, Anthropic/Claude and xAI/Grok.

Visible total voter counts at review time were:

- poll 1: 111 voters
- poll 2: 18 voters
- poll 3: 36 voters

The captured page exposes the poll options but not reliable per-option vote counts. Therefore:

- the existence of an `XX prefix + service OK` poll option is **not** evidence that the combination succeeded;
- the total voter count is **not** a denominator for any individual prefix/service pair;
- no percentage, probability or ranking may be derived from these totals;
- option-level counts must be captured explicitly before they can enter the compatibility matrix.

## Product value

This is useful because provider-level labels such as `eSIM.gg works with Telegram` are too coarse. The thread suggests meaningful quality differences can exist between number pools/prefixes inside the same product.

The practical decision surface is therefore not only:

`Which SIM/eSIM should I buy?`

but also:

`If I buy this product, which currently available prefix is the better-evidenced choice for the service I need?`

That is a genuine sub-branch of Phone Radar and can reduce wasted purchases and repeated trial-and-error.

## Proposed evidence model

For each observation retain only bounded operational facts:

- provider/product;
- broad prefix family;
- finer prefix when reported (for example `8103`, `5405`);
- service;
- operation (`registration-verification`, `login-verification`, etc. when known);
- result (`success`, `failure`, `delayed`, `risk-blocked`, `unknown`);
- observation date;
- source URL/post reference;
- first-person vs aggregate/poll;
- sample count;
- notes such as delay or risk-control outcome.

Do not store phone numbers, SMS codes, private account data or user identities beyond the public source reference needed for provenance.

## Publication gate

Keep backstage for now.

A public prefix-compatibility surface should require multiple attributable recent observations for a prefix/service pair. Until then show raw dated sample counts or qualitative evidence, never an invented percentage.

No new public URL, sitemap entry, indexability change or canonical route admission is authorized by this research packet.

## Follow-up triggers

Re-open this branch when any of the following appears:

1. explicit per-option poll counts become retrievable;
2. more first-person reports identify exact finer prefixes plus service outcomes;
3. failure/risk-control reports appear for prefixes currently represented only by successes;
4. eSIM.gg changes its available prefix pools or acquisition model;
5. enough independent recent samples exist to justify a bounded prefix/service comparison in the existing Phone UI.
