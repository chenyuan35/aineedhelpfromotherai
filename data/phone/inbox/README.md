# Phone candidate inbox

Raw researcher/agent exports land here or are referenced from an external worker path.

Hard rule: inbox data is never read by the production Phone build. It can contain stale, contradictory, refuted, duplicate, or incomplete claims.

Flow:

`raw JSONL -> validate-phone-candidate-pack.mjs -> reviewed staging -> explicit promotion -> data/phone/v1 -> build-phone-database.mjs`

A bad candidate pack therefore cannot break production or silently change public ranking.

Community evidence policy:

- community/forum/third-party/agent/discount/hidden-route evidence is first-class research input;
- absence from a provider public site is **not** a rejection criterion and must not erase a community mechanism;
- provider/official material may corroborate a claim or expose an explicit conflict, but the conflict is layered beside the community record rather than overwriting it;
- preserve source date, author/source role, claim strength, uncertainty, price/version history, negative tests and seller/channel context;
- raw community intake remains backstage-only until separate review/admission/publication gates run.
