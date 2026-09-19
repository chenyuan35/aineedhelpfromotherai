# Reset Family Audit — 2026-09-20

Status: **IN PROGRESS — ONE PAGE AT A TIME**

Source contract: `docs/MAINTENANCE_VISUAL_EXECUTION_AUDIT_PLAN_2026-09-19.md` M-02B.

## M-02B-1 — Claude Code Limit Reset

Production URL: `https://aineedhelpfromotherai.com/tools/claude-code-limit-reset/`
Production baseline: `c420bce560e588ea53a6619fe0e89f62a95dc668`

| Field | Result |
|---|---|
| Functional | PASS |
| Desktop light | FAIL — primary calculator/input below first viewport |
| Desktop dark | FAIL — same hierarchy defect; contrast otherwise usable |
| Mobile light | FAIL — primary calculator/input far below first viewport |
| Mobile dark | FAIL — same hierarchy defect; contrast otherwise usable |
| SEO identity | PASS — canonical remains `/tools/claude-code-limit-reset/` |
| Horizontal overflow | PASS at 1440px and 390px |
| Saved-state behavior | PASS |
| Missing/past reset state | PASS |
| Five-hour session shortcut | PASS |

### Reproduced hierarchy defect

The page renders `Hero → Quick answer → Calculator`. On production, calculator top is ~912px at 1440×900 and ~1207px at 390×844. The first session-reset input is ~1240px desktop and ~1591px mobile. The first viewport therefore explains the tool before exposing the tool.

### Functional evidence

- future session + weekly timestamps produced separate countdowns and the expected next-event summary;
- saved timestamps restored after reload;
- a past session timestamp changed to `Check Claude` and asked the user to confirm the next reset;
- a missing weekly timestamp stayed bounded as `Set a reset`;
- `My 5-hour session just reset` created an approximately five-hour countdown;
- Clear removed both inputs and local saved state.

### M-02B-1R repair closure — DONE / PRODUCTION VERIFIED

Release vehicle: PR #156. Final head `45d80b4530f8ec02efab192ba39420d5230c20b8`; squash merge `049a6349f00516b9b08ffeea6a95325e538d113c`.

- only `frontend/tools/claude-code-limit-reset/index.html` changed (`+7/-5`);
- public build passed before PR;
- Eval Gate #583 passed;
- PR-specific Vercel Preview reached Ready and passed desktop/mobile × light/dark rendered QA;
- calculator top improved to ~420px desktop / ~503px mobile;
- both reset inputs moved to ~475px desktop / ~551px mobile, with the first countdown also visible in the tested mobile viewport;
- Quick answer remains available after the tool instead of displacing it;
- save/restore, future timestamps, past/missing state, five-hour shortcut and Clear all passed on Preview and production;
- no horizontal overflow at 1440px or 390px;
- title, meta description and canonical remained unchanged;
- no provider-policy claim or new quota functionality was added;
- Vercel production deployment succeeded and apex QA repeated the same four-state and functional checks.

### Next action

**M-02B-2 — GitHub Copilot Credits Reset read-only consistency audit.** Do not assume it needs the same repair; reproduce functional/visual defects first, then decide whether a bounded change is justified.
