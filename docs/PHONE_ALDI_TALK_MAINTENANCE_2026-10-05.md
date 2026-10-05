# ALDI TALK lifecycle / acquisition maintenance — 2026-10-05

## Scope

Existing canonical route only: `aldi-talk-activity-window-2026`. This maintenance does not add a route, public URL, publication rule, or service-success percentage.

## Current evidence reconciliation

- Regular ALDI TALK Starter-Set price remains **€9.99 with €10 starting credit**. A temporary **€2.99 promotion runs through 2026-10-11**; the durable acquisition metric stays €9.99 so a short promotion is not normalized as permanent economics.
- Activation starts a **12-month activity window**. Each top-up starts a new window; the existing official ladder remains **€5 / 4 months, €10 / 8 months, €15 / 12 months, €30 / 24 months**. The lowest documented keep path is therefore about **€15/year**.
- After the active window ends, the line enters a **two-month receive-only rescue period**. Without a top-up during that period the SIM is deactivated.
- Current ALDI TALK pages support both physical SIM and eSIM, but official documentation conflicts on the eSIM acquisition path: the dedicated eSIM page offers direct prepaid eSIM ordering, while the SIM-service page still describes eSIM as an exchange for an already activated plastic SIM. Preserve `physical + eSIM` and record the conflict.
- Registration requires personal data and an accepted valid identity document. Online Video-Ident is available, but reviewed first-party material does not prove universal foreign-passport acceptance or successful China-first activation.
- Prepaid roaming is supported, while ALDI TALK warns that technical service restrictions can occur in some countries. China-specific incoming-SMS reachability and app/OTP reliability remain unverified.

## Decision

Keep the route `admitted` + `backstage-only`, `guideEligible=true`, with zero service observations. No reliability percentage is created.

## Publication boundary

Canonical remains 160 routes / 87 markets. Historical comparison remains 135 routes, explicit indexability 3 routes, sitemap 31 URLs.
