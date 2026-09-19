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

### Next action

**M-02B-1R — Claude bounded visual repair.** Reorder the existing calculator/input ahead of Quick answer, compact first-viewport hierarchy as needed, preserve canonical/provider-policy content, and add no new quota feature. Complete local build → Eval Gate → genuine Preview → desktop/mobile × light/dark QA → merge → apex verification before moving to Copilot.
