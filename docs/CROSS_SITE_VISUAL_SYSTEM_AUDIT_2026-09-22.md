# Cross-site Visual System Audit — 2026-09-22

Status: **COMPLETE — DEFECTS REPRODUCED / REPAIR REQUIRED**

Scope: M-05 read-only audit against GitHub `main` at `da231865aa7d766044e620d0a1e55efbe70269aa` plus live production at `https://aineedhelpfromotherai.com/`.

This session did not change production code. Per the session protocol, reproduced defects are recorded here and left for a separate bounded M-05R repair session.

## Audit contract

M-05 checks shared hierarchy, theme behavior, selected states, shared tokens, mobile legibility/tappability, build-generator overwrite risk, and related navigation across already-closed Phone / Reset / Relay / utility surfaces. It is not a redesign or Astro migration task.

## Representative production coverage

Rendered Chromium checks covered:

- Phone Radar — `/tools/phone-number-survival-guide/`
- Cursor Usage Reset — `/tools/cursor-usage-reset/`
- Relay Exit Risk — `/tools/relay-exit-risk-checker/`
- Percentage Calculator — `/tools/percentage-calculator/`
- Image Resizer — `/tools/image-resizer/`

Each representative surface was measured at 1440×900, 390×844, and 320×800 in both light and dark theme states. None reproduced page-level horizontal overflow.

## Checklist result

| M-05 check | Result | Evidence |
|---|---|---|
| H1 scale proportionate to tool surface | PASS | Phone measured ~34px desktop / 28px mobile; Cursor ~54px / 32px; Relay and generic utilities ~64px desktop / ~32–35px mobile. The differing scales did not displace the primary task behind explanatory prose in the representative checks. |
| Interactive object before long explanatory prose | PASS | Phone family selector begins ~231px desktop / ~283–304px mobile. Cursor first input ~723/721/834px vs first content section ~1187/1566/1767px. Relay first control ~502/391/503px vs explanatory content ~1824/2363/2693px. Percentage ~517/569/627px vs ~1075/1758/2068px. Image Resizer ~509/494/521px vs ~1007/1236/1338px. |
| Primary button hierarchy consistent in light/dark | PARTIAL / FAIL | Main primary actions remain visible, and Phone/Cursor keep page-specific hierarchy. Relay forecast choice buttons fail selected-state styling because of an undefined token; see M05-01. |
| Cards/status/metrics use shared tokens | FAIL | Reset-family generated styles still use undefined `--border` with a fixed light fallback instead of shared `--line`; see M05-02. |
| Selected states visible beyond subtle text | FAIL | Phone selected/unselected family state remains clearly distinct in dark theme. Relay 90-day forecast selected state is visually broken; see M05-01. |
| Mobile cards remain legible/tappable | PASS for representative surfaces | No 390/320 horizontal overflow was reproduced and primary controls remained reachable. Small native checkbox/file-control internals were not treated as standalone button defects. |
| No global CSS silently overrides page-specific hierarchy | PASS with Relay exception classified separately | Generic dark-button CSS is still broad, but Phone-specific dark rules beat it in built output and rendered QA. The Relay failure comes from its local undefined `--text` token, not a new global override. |
| Build generators preserve accepted repairs | PASS / NOTE | A fresh `npm ci` + `npm run build` passed. The first clean build rewrites tracked generated source files as part of the existing generator architecture, but the M-01/M-02 enhancer steps reapplied accepted page repairs. Running the full build a second time produced no further file-hash changes, so repeated-build drift was not reproduced. |
| Related links/navigation avoid broken/retired URLs | PASS for representative surfaces | Header/footer/related internal links collected from the five representative production pages returned no HTTP 4xx/5xx result in the audit. |
| Site-wide theme cycling works | PASS | Production theme toggle cycled `Dark → Auto(system resolved Light) → Light → Dark`, with matching `aria-label` state. |

## Reproduced defects

### M05-01 — Relay forecast selected state uses undefined `--text`

Production/source CSS for `.choice-button` uses `var(--text)` even though the shared site tokens define `--ink`, not `--text`:

```css
.choice-button{background:var(--panel);color:var(--text);...}
.choice-button[aria-pressed="true"]{background:var(--text);color:var(--panel);border-color:var(--text)}
```

Live light-theme production measurement at 390×844:

- before selection: `Yes` computed as white background, dark text, light border;
- after selecting `Yes`: `aria-pressed="true"`, computed background became transparent, text white, border white.

That makes the selected state nearly disappear against the light page surface and fails the explicit M-05 selected-state requirement. The shared rule is used by the forecast choice controls, so repair must use an existing defined token such as `--ink` and be verified in both themes.

This is a visual-state defect only. It does not change Relay methodology, risk-index semantics, forecast meaning, or API behavior.

### M05-02 — Reset family uses undefined `--border` instead of shared `--line`

The shared site token set defines `--line` for borders but not `--border`. Reset-family generator styles repeatedly use:

```css
border:1px solid var(--border,#d9d9df)
```

The undefined alias is present in the Reset generator path and resulting pages including Cursor, Claude, GitHub Copilot, Manus, Replit, Bolt, and AI Credit Burn Rate. Because the fallback is a fixed light gray, those card/countdown/metric borders do not follow the shared dark-theme `--line` value.

Prior page-level M-02 visual audits still passed, so this is not justification for redesigning those pages. It is a bounded cross-site token-consistency defect: replace the undefined alias at the generator/source level with the existing shared token, then rerun the already-accepted layouts in light/dark to prove no hierarchy regression.

## Build-generator finding

A clean build from `main` modified 15 tracked frontend source/generated files in the temporary audit clone before writing `dist`. This is existing generator behavior rather than a new product defect. The important M-05 gate is whether accepted repairs survive the build.

They did:

- Phone dark selected-state specificity is regenerated into built `site.css`;
- Cursor/Bolt/Manus/Replit/Burn mobile hierarchy enhancers are rerun by `frontend/bin/build.mjs`;
- utility regression checks passed;
- a second full build caused no additional hash changes outside `dist`/dependencies.

Decision: no separate build-idempotence repair is opened from this audit. Any M-05R token fix must still be made in the authoritative generator/source path so a clean production build cannot overwrite it.

## Decision

M-05 audit is **COMPLETE** with two bounded defects. Do not start M-06 final production audit yet.

Next independent task: **M-05R bounded cross-site token/selected-state repair**:

1. fix Relay `.choice-button` to use defined shared tokens and verify selected/unselected states in light/dark;
2. replace Reset-family `var(--border,#d9d9df)` with the shared border token in the generator/source path;
3. run the normal build/regressions and prove a second build is stable;
4. run representative 1440/390/320 light/dark rendered QA without changing SEO identity or product behavior;
5. merge only through the normal PR/Eval/Preview path and production-verify before advancing to M-06.

Do not migrate to Astro, redesign passing pages, change Relay methodology, change Reset semantics, or add new product functionality in M-05R.