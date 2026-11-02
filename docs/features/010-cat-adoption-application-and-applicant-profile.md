# Feature RD 010 - Cat adoption application wizard and applicant profile

## Status

Proposed

Not approved, and sequenced after the animal catalog (Product Owner decision
2026-11-02: the pet database comes first). This RD depends on PRD 0.4.0 (FR-025, FR-026, FR-027, amended
FR-014), which is itself awaiting Product Owner approval. The Implementation Agent
must not start until both are approved. Do not check acceptance criteria without
observed evidence.

## Requirement traceability

- Product requirements (PRD 0.4.0 draft): FR-014 (cat adoption, signed-in
  submission, server validation), FR-025, FR-026, FR-027, NFR-SEC-001,
  NFR-SEC-002, NFR-SEC-004, NFR-PRIV-001, NFR-A11Y-001, NFR-SEO-001. Related:
  FR-002 to FR-004 (identity, RD 003).
- PRD coverage check: 0.3.0 covered the application itself (FR-014, US-APP-02,
  NFR-SEC-002) but had no requirement for a reusable applicant profile, saved and
  resumable multi-step progress, an applicant-facing application list, or a
  decision on guest submission. PRD revised to 0.4.0 in the same pass; the
  focused diff is summarized in the PRD change summary.
- Related decisions: ADR 0007 (storage and PII; revised alongside this RD),
  ADR 0003 (roles; email verification not yet adopted, see Open decisions),
  accessibility contract, design direction.
- Related stories: US-APP-02, US-APP-06, US-APP-07 (updated).
- Dependencies: approved PRD 0.4.0. The animal catalog Feature RD (RG sync, the
  `Animal` table and its lookups, FR-010 to FR-012, migration M3) must be
  Implemented first; this RD reads available cats from it. That RD is not yet
  written and is the next Architecture Agent task. Encryption key ring
  (`APP_DATA_KEYS`) in each environment before first use.
- Source of fields: live PRBJ cat adoption form 6846 supplied by the Product
  Owner on 2026-11-02. Closes the cat part of OQ-10; fields must still be confirmed
  by Barb (OQ-10, OQ-32).

## Problem

PRBJ's current cat application is one long table-based form. Every application
retypes the same address, employer, landlord, household, pet and vet answers,
nothing is saved until the end, and an applicant who is interrupted starts over.
The site has no way for an applicant to see what they submitted. Applicant
details are also the most sensitive data the site will hold.

## Desired outcome

A signed-in applicant completes the cat adoption application in a short guided
sequence of pages. Each page saves when they move on, so they can stop and
resume later from any device. Answers about themselves are stored once in an
encrypted applicant profile and pre-fill every future application. Their account
lists their drafts and submitted applications. Submitted applications are an
immutable, encrypted record that is safe to hand to reviewers in a later RD.

## Scope

### In scope

- Encryption service for application data (AES-256-GCM, versioned key ring), the
  first consumer of ADR 0007.
- Data model migration M4a: `ApplicantProfile`, `Application`,
  `ApplicationPayload`, `ApplicationEvent` and enums (all five application types
  and all statuses are defined now; only `CAT_ADOPTION` is built).
- Applicant profile: view, edit by section, clear.
- Cat application wizard: start, save per step, resume, discard draft, review,
  certify and submit, confirmation with reference code.
- "My applications" in the account area: list with status, resume a draft, open a
  read-only submitted application.
- Public information page `/apply/cat` (prerendered) that explains the process and
  links into the wizard.
- Daily Wasp job that deletes expired drafts and logs counts.
- Per user rate limits on application operations.

### Out of scope (non-goals)

- Dog, foster, Dog 4 a Day and volunteer applications. They reuse the profile and
  wizard framework in their own RDs.
- Reviewer queue, notes, status changes, applicant email for more information
  (FR-015), audit log and its table (reviewer RD).
- Confirmation email to the applicant and staff notification email (FR-023). No
  email provider exists yet. Until the notification RD ships, FR-014 is only
  partly met and the site must not go live for applications.
- Retention purge of submitted applications (US-APP-11 RD). Draft purge is in scope.
- Building the animal catalog itself (prerequisite RD, see Dependencies).
- Email verification, password reset, Turnstile at sign-up (auth upgrade RD, ADR
  0003).
- Guest (signed-out) applications, file uploads, payments, withdrawing a submitted
  application, printing or PDF export, editing a submitted application, and
  pushing anything to RG.

## Existing behavior

Verified by reading the repository on 2026-11-02:

- `schema.prisma` has only `User` and `ProfileImage`. No application model.
- `main.wasp.ts` has public prerendered shell routes (RD 009), `/login`, `/signup`
  and authenticated `/profile` with operations `getOwnProfile`,
  `updateOwnProfile`, `changeOwnPassword`, `uploadOwnProfileImage`. Auth is
  `usernameAndPassword` with the normalized email as the username.
- `/adopt-foster` is a holding page. No `/apply/*` route exists.
- No jobs, no email, no encryption module, no rate limiter, no `Animal` table.
- Brand tokens and the shell layout exist (RD 009). Test harness: Vitest, Testing
  Library, Playwright with axe, prerender check.

## Proposed architecture

### UI and interaction

Routes (new):

| Route | Auth | Prerender | Purpose |
|---|---|---|---|
| `/apply/cat` | public | yes | What to expect, what to have ready, "Start application" or "Sign in to start"; lists the visitor's open cat drafts when signed in (post-hydration) |
| `/apply/cat/:applicationId/:step` | required | no | One wizard page per step |
| `/apply/cat/:applicationId/done` | required | no | Confirmation with reference code |
| `/profile/applications` | required | no | My applications |
| `/profile/applications/:applicationId` | required | no | Read-only submitted application; for drafts, redirects into the wizard |
| `/profile/applicant` | required | no | View and edit applicant profile by section; clear profile |

`/profile` gains links to "My applications" and "Applicant profile". `/adopt-foster`
links to `/apply/cat` (copy change only; no policy text invented).

Wizard steps (`:step` slugs), in order. "Profile" steps read and write
`ApplicantProfile`; "Application" steps read and write the draft payload.

| # | Slug | Source | Fields |
|---:|---|---|---|
| 1 | `cat` | Application | `animalId`: a required dropdown of currently available cats from the catalog, pre-selected from `?animal=<animal id or slug>` |
| 2 | `about-you` | Profile | name, address, ZIP, cell phone, date of birth; email shown read-only |
| 3 | `work-and-home` | Profile | employer, owner or renter, landlord and phone, lease end |
| 4 | `household` | Profile | household members (repeatable), has owned pets before |
| 5 | `current-pets` | Profile | has current pets; each pet (repeatable) with the per-pet fields in the data model |
| 6 | `veterinarian` | Profile | vet name and phone, name on vet records |
| 7 | `your-plans` | Application | return policy acknowledgement, indoor or outdoor, daytime location, declaw plan and reason, behavior plan, referral source, comments |
| 8 | `review` | Application | read-only summary of all steps with "Change" links, certification wording, typed name, Submit |

Behavior:

- A progress list ("Application steps", ordered list in a `nav`) shows each step
  with a text status (Not started, In progress, Complete) and marks the current
  step with `aria-current="step"`. Complete or reached steps are links; steps
  beyond the furthest reached step plus one are plain text.
- Each step has: h1 "Step N of 8: Title", a short intro, required-field note,
  fields, and buttons **Back**, **Save and continue**, and **Save and finish
  later**. Profile steps show a note: "We fill this in from your applicant profile.
  Changes here update your profile for next time."
- **Save and continue** validates the step strictly; on success it saves and goes
  to the next step. **Back** and **Save and finish later** save leniently
  (values that are present must be well formed; required-ness is not enforced) and
  then navigate. "Finish later" lands on `/profile/applications` with a status
  message "Draft saved. You have until <date> to finish." (date computed on the
  client in the user's locale after hydration).
- Repeatable groups (household, pets): "Add person" and "Add pet" append an item
  and move focus to its first field; "Remove" is a button named with the item, and
  after removal focus moves to the previous item's heading or to the Add button.
- Step 7: choosing "No" on the return-policy acknowledgement does not submit and
  shows plain guidance with the rescue phone and email.
- Step 8 re-validates everything strictly. If any earlier step is incomplete, it
  lists them as links and disables Submit with an explanation (the server enforces
  this independently). Certification text shown is the current version string.
  Submit is final; there is no edit of a submitted application.
- Confirmation page shows the reference code and states plainly that an email copy
  is not sent yet when the notification RD has not shipped (copy toggled by a
  server setting, not a hidden assumption).
- Resume: opening a draft goes to its first incomplete step, or step 8 when all
  are complete. A visitor who is not signed in and opens a wizard URL is sent to
  `/login` and returned afterward if Wasp supports a post-login redirect (Open
  decision 4); otherwise they land on `/profile/applications`.
- Expired drafts (older than their `purgeAfter` and not yet purged) are shown as
  "Expired" in the list with no resume action.

Prerender: only `/apply/cat` is prerendered and must be identical on server and
client; draft lists and account state render after hydration (the `useIsClient`
pattern from RD 009). Authenticated routes are never prerendered.

### Application behavior

Wasp operations (all server side; `context.user` required except where noted):

| Operation | Kind | Behavior |
|---|---|---|
| `getApplicantProfile` | query | Decrypts and returns the caller's profile document plus per-section completeness |
| `saveApplicantProfileSection` | action | `{ section, data, expectedRevision, mode: "strict" \| "lenient" }`; validates the section with zod, merges into the document, re-encrypts, increments `revision`; rejects a stale `expectedRevision` with a conflict error |
| `clearApplicantProfile` | action | Replaces the document with an empty one (keeps the row); does not touch submitted applications |
| `startApplication` | action | `{ type: "CAT_ADOPTION", animalId? }` (must be an available cat when given); creates a `DRAFT` with an empty encrypted payload, `purgeAfter` = now + 30 days, and a `draft_created` event; limit 3 open drafts per user and type |
| `getApplication` | query | Returns the caller's own application; wizard shape for drafts, read-only shape (answers plus frozen profile snapshot) for submitted; step statuses computed by strict validation |
| `saveApplicationStep` | action | `{ applicationId, step, data, expectedRevision, mode }`; for profile steps writes the profile (same rules as the profile action) and advances `furthestStep`; for application steps merges into the payload; refreshes `lastSavedAt` and `purgeAfter`; increments `revision` |
| `submitApplication` | action | Single transaction: re-validate every step strictly against live profile and payload; copy the profile into `profileSnapshot`; set `certification.certifiedAt`; assign a unique `referenceCode`; set `submitterName`, `submitterEmail` (from `User.email`), `submittedAt`, `status = SUBMITTED`, `purgeAfter` (submitted rule); write the `submitted` event; re-encrypt |
| `discardApplication` | action | Deletes the caller's own `DRAFT` (payload and events cascade); refuses any non-draft |
| `listOwnApplications` | query | Index columns only (no decryption): type, status, animal name snapshot, reference code, last saved, submitted, expiry |

Rules:

- Step order is guidance for navigation only; the server accepts saves for any
  step the caller owns. Only `submitApplication` requires completeness.
- Step completeness is derived, never stored: a step is Complete when its current
  data passes strict validation. Profile steps therefore stay complete across
  applications once the profile is complete.
- Validation schemas are shared between client and server from one module
  (`src/applications/schemas`), zod, with the field rules in `docs/data-model.md`.
  The server never trusts the client's validation.
- Phone numbers are normalized to ten digits before storage. Dates are ISO
  `YYYY-MM-DD`. Text is trimmed and stored as plain text; it is rendered escaped,
  never as HTML.
- Concurrent edits (two tabs): saves carry `expectedRevision`; a mismatch returns
  a conflict and the wizard shows "This application changed in another window.
  Reload to continue" without discarding what the person typed on the page.
- `submitApplication` is idempotent for the same application: a repeated call on
  an already submitted application returns the existing reference code.
- Reference code: `PRBJ-` plus 8 characters from an unambiguous base 32 alphabet
  (no 0, O, 1, I, L), grouped `PRBJ-XXXX-XXXX`, unique constraint with retry.
- Minimum applicant age: none enforced by this RD. Age is computed from date of
  birth and recorded for reviewers (Open decision 6).

### Data model and migration

See `docs/data-model.md` (Applications section) for fields and the two document
schemas. Prisma models: `ApplicantProfile`, `Application`, `ApplicationPayload`,
`ApplicationEvent`, enums `ApplicationType`, `ApplicationStatus`; `User` gains
relations only (no new columns).

Migration M4a, expand only. Indexes: `Application(userId, status)`,
`Application(purgeAfter)`, unique `referenceCode` (nullable unique),
`ApplicantProfile.userId` unique. Rollback: drop the tables, valid only before real
applicant data exists; after that, forward fixes only.

Encryption (`src/security/appDataCrypto.ts`, server only):

- AES-256-GCM, fresh random 12 byte nonce per write, 16 byte tag stored with the
  ciphertext, key chosen by `keyVersion`.
- Key ring from `APP_DATA_KEYS` (JSON map of version to base64 32 byte key); the
  highest version encrypts, any listed version decrypts. Missing, malformed or
  wrong-length keys make the server fail closed at first use with a generic error
  and a startup log entry that names no key material.
- Additional authenticated data binds each ciphertext to its record: record kind,
  record id and `schemaVersion`, so ciphertext copied between rows fails to
  decrypt.
- Decryption errors never include plaintext or key data in messages or logs. A
  redaction helper strips payload fields from any logged object; a test proves it.
- Lazy re-encryption on read when `keyVersion` is behind, and a rotation batch job,
  are specified in ADR 0007 but built in the purge/rotation RD; this RD guarantees
  old versions remain readable.

Draft purge job (Wasp job, daily): deletes `Application` rows with `status = DRAFT`
and `purgeAfter` earlier than now, in batches; logs only counts and the run time.

### Authorization and security

- Every operation requires an authenticated user; the profile and application
  records are looked up by `userId = context.user.id`. An application id that
  belongs to someone else returns "not found" (same as a missing id), never a
  distinguishable forbidden error.
- No role (Editor, Reviewer, Admin) grants access through these operations. Staff
  access to applications is a separate, audited path in the reviewer RD. Editors
  never receive application data (architecture section 4).
- Server decides status transitions: this RD allows only create as `DRAFT`,
  `DRAFT -> SUBMITTED`, and draft deletion. A client cannot send `status`,
  `referenceCode`, `submitterName`, `purgeAfter` or `userId`; unknown keys are
  rejected by the zod schemas.
- Rate limits (transient in-memory token bucket per user, no IP storage): 60 step
  or profile saves per minute, 10 `startApplication` per hour, 5 `submitApplication`
  per hour. Exceeding returns a retryable error with a plain message.
- Applicant reads of their own profile and applications are not audited
  (NFR-SEC-003 as amended). `ApplicationEvent` records `draft_created` and
  `submitted` without payload data.
- List queries never decrypt. `listOwnApplications` selects index columns only, so
  a code path that decrypts for a list is a test failure.
- Logs, errors and analytics contain no profile or answer values and no ciphertext.
- Secrets: `APP_DATA_KEYS` is a server environment variable only, never exposed to
  the client, never committed, and `.env.server.example` documents the name
  without a value.
- CSRF and session handling are Wasp defaults; the RD adds no cookies.
- Account deletion is not implemented in this app yet. When it is, the profile
  cascades, drafts cascade and submitted applications keep their snapshot with
  `userId` set to null per retention rules.

### Tenant isolation

Not applicable (single tenant); per-user isolation is covered above.

### External services

None. No email is sent by this RD, no Turnstile, no RG calls.

Animal selection: step 1 lists animals from the local catalog where species is
cat, status is available and `removedAt` is null, ordered by display name with
naming tags (FH, TRAINING CAMP) shown as text. No RG call is made at apply time
(NFR-REL-002: applying keeps working when RG is down, using the last good
snapshot). `animalId` is stored on `Application` with `animalNameSnapshot`
(display name at save time), so a reviewer still sees the name if the animal is
later adopted or removed. `submitApplication` re-checks that the animal still
exists; if it has since been adopted or removed, submission is allowed only after
the applicant confirms or changes the choice on step 1, because a cat can be
adopted while someone fills the form. Courtesy-listed and pending-adoption
animals follow the catalog's rules for `isAdoptionPending` (the catalog RD
decides whether they appear).

### Reliability, recovery, and observability

- Saves are single transactions: payload or profile write plus `revision`,
  `lastSavedAt` and `purgeAfter` update commit together or not at all.
- Failed save: the wizard keeps the page's values, announces the error with
  `role="alert"`, and offers Retry; it never navigates on failure.
- Lost keys mean lost applicant data: key custody and backup are launch checklist
  items (ADR 0007). This RD adds a startup self-test that encrypts and decrypts a
  sentinel with the active key and fails the readiness log if it cannot.
- Logging: structured, count-and-duration only; job run logs count of deleted
  drafts. No PII.
- Rollback and recovery below.

## Accessibility

- Controls and interaction inventory: progress list and step links; step heading;
  text inputs (name, address, city, ZIP, +4, phone, employer, landlord, vet, pet
  fields); date of birth field; state select; radio groups (owner or renter,
  indoor or outdoor, yes or no questions, felv/fiv status, species, sex);
  checkboxes (return-policy acknowledgement, certification agreement); textareas
  (behavior plan, referral, comments, pet temperament); repeatable group Add and
  Remove buttons; Back, Save and continue, Save and finish later, Submit; error
  summary; save status message; "My applications" table or list with Resume,
  Open and Discard actions; discard confirmation dialog; profile section edit
  forms; Clear profile confirmation.
- Keyboard and focus behavior: every step is a native `form`; on step change
  focus moves to the step h1 and the document title updates to "Step N of 8:
  Title - Cat adoption application"; failed validation moves focus to an error
  summary at the top that links to each invalid field; Enter submits the form with
  Save and continue as the default button; Add and Remove focus rules as in UI;
  dialogs trap focus, close on Escape and return focus to the trigger; no
  keyboard trap anywhere.
- Contrast: brand tokens only (RD 009 pairs); error and status text meet 4.5:1
  and are never the only cue (icon and text prefix).
- Reflow: single column, usable at 320 px and 200 percent text size, controls at
  least 44 px; repeatable groups stack; the progress list collapses to "Step N of
  8" plus a disclosure of the full list under 48rem.
- Alternative representations and labels: every field has a visible label (never
  placeholder only), required fields marked "(required)" in text, optional fields
  say "(optional)", help text linked by `aria-describedby`, `autocomplete` tokens
  on identity fields (`given-name`, `family-name`, `street-address`,
  `address-level2`, `address-level1`, `postal-code`, `tel`, `bday`,
  `organization` where applicable), `inputmode` for phone and ZIP, native date
  input or three labeled fields for date of birth with a text hint.
- Status messages: "Saved" and "Draft saved" use a polite live region; errors use
  an assertive one; saving state is exposed (button `aria-busy` and text), not
  only a spinner.
- Redundant entry (WCAG 2.2 SC 3.3.7): profile pre-fill means returning
  applicants do not retype; applicants are never asked to re-enter data already
  provided in the same application.
- Session expiry: a save that fails with an authentication error preserves the
  page's values and offers a sign-in link that returns to the step.

## Acceptance criteria

Encryption and data

- [ ] AC-APPCRYPTO-01: Encrypting then decrypting a document with the active key returns an identical document, and two encryptions of the same document produce different ciphertext and nonces.
- [ ] AC-APPCRYPTO-02: Decryption fails when the ciphertext, nonce, tag, record id, record kind or schema version is altered, and the error contains no plaintext or key material.
- [ ] AC-APPCRYPTO-03: A record encrypted with an older key version still decrypts while that version remains in the key ring; new writes use the highest version.
- [ ] AC-APPCRYPTO-04: A missing, malformed or wrong-length `APP_DATA_KEYS` makes encryption and decryption fail closed with a generic error and never fall back to plaintext.
- [ ] AC-APPCRYPTO-05: A database query on `ApplicantProfile` and `ApplicationPayload` shows no recognizable plaintext of saved values, and `Application` index columns hold no address, phone, employer, landlord, household, pet or vet data.
- [ ] AC-APPCRYPTO-06: The log redaction helper removes payload fields from logged objects, and no operation in this RD writes profile or answer values to logs.

Applicant profile (FR-025)

- [ ] AC-APPPROFILE-01: A signed-in user can save each profile section; the saved values are returned by `getApplicantProfile` and pre-fill the matching wizard steps.
- [ ] AC-APPPROFILE-02: Server validation enforces every field rule in the data model (state code, five digit ZIP, ten digit phones, date of birth in the past, 1 to 12 household members, landlord fields required for renters, per-pet conditional fields) and rejects unknown keys.
- [ ] AC-APPPROFILE-03: A partially filled profile can be saved with lenient mode; strict mode rejects missing required fields for the section.
- [ ] AC-APPPROFILE-04: Editing a profile value after submitting an application does not change that application's frozen snapshot.
- [ ] AC-APPPROFILE-05: A user can clear their profile; the profile fields are empty afterward, submitted applications are unchanged, and the action affects only the caller's profile.
- [ ] AC-APPPROFILE-06: Stale writes (wrong `expectedRevision`) are rejected with a conflict error and change nothing.

Wizard, drafts and submission (FR-014, FR-026)

- [ ] AC-CATAPP-01: A signed-out visitor can open `/apply/cat` (prerendered, no redirect) and sees a sign-in action instead of a start action; any `/apply/cat/:id/...` route redirects a signed-out visitor to `/login`.
- [ ] AC-CATAPP-02: Starting an application creates a `DRAFT` with an encrypted empty payload, a 30 day `purgeAfter`, and a `draft_created` event; a fourth open cat draft is refused with a plain message.
- [ ] AC-CATAPP-16: Step 1 lists only cats that are available and not removed in the local catalog, makes no RG call, pre-selects the animal from `?animal=` when it is an available cat, rejects any other `animalId` on the server, stores `animalId` and `animalNameSnapshot`, and on submit requires the applicant to reconfirm if that cat is no longer available.
- [ ] AC-CATAPP-03: The wizard presents the eight steps in the specified order with the fields in the step table, one step per page, and a progress list that marks the current step and each step's status in text.
- [ ] AC-CATAPP-04: Save and continue on a valid step persists the data and moves to the next step; on an invalid step it saves nothing, shows an error summary and keeps entered values.
- [ ] AC-CATAPP-05: Back and Save and finish later persist well-formed partial data without requiring completion, then navigate.
- [ ] AC-CATAPP-06: After saving step N, closing the browser, signing in on another device and opening the draft shows every saved value and resumes at the first incomplete step.
- [ ] AC-CATAPP-07: Saving advances `lastSavedAt` and `purgeAfter` and `furthestStep`; an expired draft cannot be saved or resumed and shows as Expired.
- [ ] AC-CATAPP-08: Submit is rejected by the server, listing the incomplete steps, if any step fails strict validation, if the return-policy acknowledgement is not true, or if the certification name or agreement is missing, regardless of what the client sends.
- [ ] AC-CATAPP-09: A valid submit sets status `SUBMITTED`, a unique `PRBJ-XXXX-XXXX` reference code, `submitterName`, `submitterEmail`, `submittedAt`, the frozen `profileSnapshot`, a server timestamp in `certification.certifiedAt`, the certification text version, and a `submitted` event, in one transaction.
- [ ] AC-CATAPP-10: Submitting twice returns the same reference code and creates one event; a submitted application cannot be saved, edited, discarded or resubmitted.
- [ ] AC-CATAPP-11: A client cannot set `status`, `referenceCode`, `purgeAfter`, `userId`, `submitterName` or `submitterEmail` through any operation; such keys are rejected.
- [ ] AC-CATAPP-12: Two tabs saving with the same `expectedRevision` result in one accepted write and one conflict message that preserves the rejected tab's values.
- [ ] AC-CATAPP-13: On step 7, choosing "No" for the return-policy acknowledgement, or answering Yes to declawing without a reason, blocks Save and continue with a specific message; the "No" message shows the rescue phone and email.
- [ ] AC-CATAPP-14: The confirmation page shows the reference code and the correct notice about email copies.
- [ ] AC-CATAPP-15: The daily job deletes only expired drafts (payload and events cascade), leaves submitted applications and non-expired drafts untouched, and logs counts without PII.

My applications and authorization (FR-027, NFR-SEC-001)

- [ ] AC-APPLIST-01: `/profile/applications` lists only the caller's applications with type, animal name, status text, and last-saved or submitted date; drafts show Resume and Discard, submitted show Open; list queries do not decrypt payloads.
- [ ] AC-APPLIST-02: Opening a submitted application shows a read-only view of the answers and the frozen profile values, with no edit controls and no reviewer notes.
- [ ] AC-APPLIST-03: Discarding a draft requires confirmation and deletes it; the list updates and focus moves to a sensible target.
- [ ] AC-APPAUTH-01: For another user's application id, every operation returns the same not-found result as a nonexistent id, and no data.
- [ ] AC-APPAUTH-02: Unauthenticated calls to every operation in this RD fail; no operation is reachable by role alone, and Editor, Reviewer and Admin accounts see only their own applications here.
- [ ] AC-APPAUTH-03: Rate limits apply per user at the stated thresholds and return a retryable message without exposing counters across users.

Accessibility and prerender

- [ ] AC-APPPRERENDER-01: `/apply/cat` is built as static HTML containing the h1, title, meta description, header navigation and footer without JavaScript; no wizard, profile or list route is prerendered.
- [ ] AC-A11Y-01: Every wizard step, the review step, confirmation, My applications, applicant profile and the dialogs have no serious or critical axe violations at 320 px and at desktop width, including error states.
- [ ] AC-A11Y-02: The full application (start, all steps, review, submit, resume, discard) is operable by keyboard alone with visible focus, focus to the step heading on navigation, focus to the error summary on invalid submit, and correct focus after Add, Remove and dialog close.
- [ ] AC-A11Y-03: Save, error and conflict messages are announced through live regions; every field has a programmatic label, required and optional text, and the specified `autocomplete` tokens.
- [ ] AC-A11Y-04: Pages reflow at 320 px without horizontal scroll and remain usable at 200 percent text zoom with targets of at least 44 px.

## Test plan

### Unit and contract

- `AC-APPCRYPTO-01` to `-04`, `-06`: tests over `appDataCrypto` and the redaction
  helper with generated test keys (never real keys).
- `AC-APPPROFILE-02`, `-03`: zod schema tests with valid, invalid, boundary and
  unknown-key cases per field.
- `AC-CATAPP-08`, `-11`, `-13`: schema and domain tests for submit validation,
  forbidden keys and conditional rules; reference code generator tests
  (alphabet, format, collision retry).
- `AC-APPAUTH-03`: rate limiter tests with a fake clock.
- State machine tests for allowed and forbidden transitions.

### Integration

- Operations against a real PostgreSQL test database: `AC-APPCRYPTO-05`,
  `AC-APPPROFILE-01`, `-04`, `-05`, `-06`, `AC-CATAPP-02`, `-04` to `-07`, `-09`,
  `-10`, `-12`, `-15`, `AC-APPLIST-01`, `-02`, `-03`, `AC-APPAUTH-01`, `-02`. The
  authorization suite runs each operation as owner, other user, each staff role
  and anonymous.
- Component tests (Testing Library) for step forms, repeatable groups, error
  summary focus, live regions and dialogs: `AC-CATAPP-03`, `-13`, `-14`,
  `AC-A11Y-02`, `-03`.
- Build check: `AC-APPPRERENDER-01` extends the RD 009 prerender script.

### Playwright

- `AC-CATAPP-01`, `-06`, `AC-A11Y-01`, `-02`, `-04` and the happy path: sign up,
  fill steps 1 to 8, leave and return from a second browser context, submit,
  see the reference code, see the application listed and read-only; run axe at
  each step at 320 px and desktop, including an error state; keyboard-only walk;
  200 percent zoom reflow. Specs are written at Build and may run at Validate.

## Rollout and rollback

- Rollout order: the animal catalog RD is Implemented first; then (1) slice S1 crypto plus migration M4a, (2) S2 profile,
  (3) S3 wizard and submit, (4) S4 My applications and draft job. Each slice has
  its own failing tests first and its own commit. `APP_DATA_KEYS` must exist in
  local, staging and production before S1 is used; the Product Owner provisions
  and backs up keys (a launch checklist item). Nothing is deployed by this RD.
- Before launch, the notification RD (applicant copy and staff notice) must
  ship; this RD alone does not satisfy FR-014 or FR-023.
- Rollback: revert the commits and drop the M4a tables only if no real applicant
  data exists. After real data exists, do not drop; ship a forward fix and, if
  the feature must be withdrawn, hide the `/apply/cat` entry points while keeping
  data and keys. Never delete or rotate away keys while ciphertext exists.
- Recovery: backups follow NFR-REL-003; restoring the database without the key
  ring makes profile and application data unreadable, so the key ring has its own
  backup stored separately from database backups.

## Open decisions

Recommendations stand unless the Product Owner changes them.

1. Animal selection: **decided 2026-11-02**: the catalog is built first and step 1
   is a dropdown of available cats. The free text interim is dropped.
2. Live form marks "Comments / Is there anything else" required. Recommend
   optional; confirm with Judy (OQ-32).
3. Open draft limit of 3 per user and type, and a 30 day sliding expiry from the
   last save (matches ADR 0007 proposal). **Left as drafted** by the Product
   Owner 2026-11-02; Judy to confirm (OQ-34).
4. Return to the wizard after sign in. **Approved 2026-11-02**: use a post-login
   redirect target if Wasp supports one; otherwise land on
   `/profile/applications`. The Implementation Agent reports what Wasp 0.26
   supports.
5. Email verification: confirmation emails will go to `User.email`, which is not
   verified under the current auth method. **Decided 2026-11-02**: the auth
   upgrade RD (ADR 0003: email verification, reset) ships before launch and
   before the notification RD; it does not block building this RD.
6. Minimum applicant age for cat adoption: the form collects age but states no
   rule. Recommend no automated gate here and reviewer judgment; confirm with
   Judy (OQ-35).
7. What an applicant may see for each status and for declines (US-APP-08 and the
   reviewer RD). This RD shows the stored status name in plain words and no notes
   (OQ-33).
8. Certification wording is copied verbatim into the code as a versioned constant.
   Judy must approve the final text; the typed name plus server timestamp
   replaces "Name and Date" free text.
9. Date of birth collection (decided 2026-11-02) should be disclosed in the
   privacy copy shown on the profile page; Judy to approve text.
10. Whether `/profile/applicant` (standalone profile editing) ships in S2 or with
    S4 (recommended S2 so profile steps can reuse the same section forms).

## Implementation slices

| Slice | Contents | Gate |
|---|---|---|
| S1 | `appDataCrypto`, redaction helper, migration M4a, key env docs | AC-APPCRYPTO-* |
| S2 | Profile schemas, operations, `/profile/applicant` | AC-APPPROFILE-*, part of AC-A11Y-* |
| S3 | Wizard, step operations, submit, confirmation, `/apply/cat` | AC-CATAPP-01 to -14, AC-APPPRERENDER-01, AC-APPAUTH-* |
| S4 | My applications, discard, draft purge job | AC-APPLIST-*, AC-CATAPP-15 |

## Verification

Not yet implemented. Do not check acceptance criteria without observed evidence.

## Manual smoke

To be written after Validate: as a new account holder on a phone width, start a
cat application, complete two steps, tap Save and finish later, sign in on a
second device, resume at the next step, finish, submit, and confirm the reference
code and read-only copy under My applications. Edge cases: open another account's
application URL and confirm a not-found page; edit the profile afterward and
confirm the submitted copy is unchanged.
