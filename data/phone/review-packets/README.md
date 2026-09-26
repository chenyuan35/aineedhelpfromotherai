# Reviewed route packets

One reviewed route = one packet. Do not edit canonical tables by hand for ordinary additions.

Workflow:
1. raw candidate enters inbox/staging;
2. reviewer resolves contradictions and fills missing evidence;
3. create one reviewed packet;
4. `node scripts/apply-phone-review-packet.mjs <packet> --check`;
5. inspect diff/validation;
6. `node scripts/apply-phone-review-packet.mjs <packet> --apply`;
7. run Phone tests/build and commit through PR.

Packets are review artifacts, not public pages. `approved-backstage` creates a backstage route; public state requires a separate explicit reviewed change.
