# User Feedback MVP — 2026-09-18

Status: **DESIGN READY / DO NOT IMPLEMENT IN THE CURRENT PHONE REPAIR PR**

## Why this exists

The site currently has a `/contact/` page, but ordinary users are sent to GitHub Issues for bug reports and feedback. That is too much friction for lightweight product feedback from people who only want to say that a page is confusing, wrong, broken or missing something.

The goal is not to build a support platform. The goal is to create a tiny, low-maintenance feedback loop that helps improve existing tools.

## User job

A user should be able to tell us, in a few seconds, that something on the current page was difficult or wrong without creating an account, writing a long report or leaving the site.

The owner should later be able to answer:

- which page received feedback;
- what broad problem users selected;
- whether one page repeatedly attracts the same complaint;
- whether the feedback changed after a page repair.

## MVP scope

Add a small `Feedback` control on tool pages.

Opening it shows one question:

**What went wrong?**

Quick reasons:

- `Hard to understand`
- `Wrong or outdated info`
- `Something is broken`
- `Too much text`
- `Missing an option`
- `Other`

One tap records the feedback event and confirms receipt.

After submission, offer an optional secondary action:

`Add details`

That action opens the existing public GitHub issue flow with a prefilled page URL and selected reason. Detailed free text remains in GitHub rather than creating a new site database or support backend.

## Explicit non-goals

Do not add in v1:

- a new feedback database;
- a new API endpoint;
- accounts or sign-in;
- email collection;
- screenshots/uploads;
- phone numbers, OTPs, credentials or identity-document fields;
- ticket assignment/workflow;
- live chat;
- voting/upvoting;
- a public feedback board;
- AI summarization;
- automated production changes based on feedback.

## Technical approach

Use the existing frontend and analytics path only.

A small reusable feedback component should:

1. render a compact `Feedback` trigger;
2. open an accessible popover/bottom sheet;
3. send a GA4 event after a reason is selected;
4. show a local success state;
5. offer a prefilled GitHub issue link for optional detailed reporting.

Recommended event:

`site_feedback`

Recommended bounded parameters:

- `page_path`
- `tool_slug`
- `reason`
- `theme` (`light` / `dark`)
- `viewport_class` (`mobile` / `desktop`)

Do not send arbitrary free-text feedback into GA4.

## File/module boundary

Prefer a shared frontend component/runtime rather than duplicating markup in every tool page.

Expected boundary:

- shared feedback markup/runtime under the existing frontend shared layer;
- minimal shared CSS in `frontend/site.css` or the current shared-style source;
- only a small opt-in hook on tool pages if the shared build path cannot inject it globally;
- targeted regression test for event name, allowed reasons, accessibility state and absence of sensitive input fields.

Do not mix this implementation into PR #130. Phone visual closure must be reviewed independently.

## Persistence

No new database in v1.

Quick feedback is aggregated in GA4 through the bounded event dimensions above. Detailed written reports use the existing GitHub Issues repository.

This is intentionally a low-maintenance first version. If meaningful traffic later shows that free-text anonymous feedback is necessary, evaluate a narrow persistent endpoint as a separate task with spam/privacy/rate-limit handling.

## Privacy and security

The widget must not ask for or intentionally send:

- phone number;
- OTP;
- account credentials;
- email address;
- identity documents;
- form contents from the tool itself.

Only the current page path and bounded UI context should be included in the analytics event.

The optional GitHub detailed-report action is an external user-initiated navigation and should be clearly labeled.

## UX rules

- The trigger must not obscure primary tool controls on mobile.
- Do not use an aggressive modal on page load.
- Do not interrupt a calculation or task flow.
- The feedback sheet must close easily.
- A one-tap reason should be enough; writing text must be optional.
- The success state should be immediate and quiet.
- All user-facing copy is English.

## Deployment and review

Implementation must follow the normal lightweight production path:

fresh branch → tests → Draft PR → Vercel Preview → desktop/mobile visual review → merge only after explicit acceptance → production verify.

This does not require a separate staging infrastructure or a second production environment.

## Test strategy

Minimum checks:

- feedback trigger is keyboard accessible;
- sheet/popover opens and closes correctly;
- reason buttons are reachable on mobile;
- exactly one bounded analytics event is emitted per submission;
- no arbitrary user text is sent to analytics;
- no sensitive input fields exist;
- GitHub detailed-report link includes the current page and selected reason;
- light/dark states are visually distinct;
- no horizontal overflow;
- existing tool actions remain unobstructed.

## Rollback

The feature must be removable by reverting one bounded implementation PR. It must not create a persistent backend dependency that requires cleanup during rollback.

## Operating cost

Expected incremental infrastructure cost: effectively zero beyond existing analytics and GitHub.

No paid service, new database or long-running process is required for v1.

## Success / stop criteria

Success means:

- feedback events are actually visible in analytics;
- page + reason data is sufficient to identify recurring UX problems;
- the control does not materially interfere with tool use;
- at least one future product fix can be tied to collected feedback.

Stop or redesign if:

- almost all reports need free text to be useful;
- spam/noise dominates;
- GA4 aggregation is insufficient for actionable diagnosis;
- the widget reduces conversion/tool completion;
- maintaining the integration becomes larger than the value of the feedback.

## Ordering

Q-014J Phone visual closure remains the active product-facing gate.

This Feedback MVP is the next cross-cutting maintenance/product-observation feature to consider **after** the current Phone repair reaches visual acceptance. It should help improve existing tools, not become a new product surface.