# Phone candidate inbox

Raw researcher/agent exports land here or are referenced from an external worker path.

Hard rule: inbox data is never read by the production Phone build. It can contain stale, contradictory, refuted, duplicate, or incomplete claims.

Flow:

`raw JSONL -> validate-phone-candidate-pack.mjs -> reviewed staging -> explicit promotion -> data/phone/v1 -> build-phone-database.mjs`

A bad candidate pack therefore cannot break production or silently change public ranking.
