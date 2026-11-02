# Engineering Product Requirements Document

## Document control

- **Status:** Proposed. Revision 0.4.0 awaits Product Owner approval (focused
  diff summarized below). Baseline 0.3.0 was approved on 2026-11-02; Feature RDs
  that depend only on 0.3.0 requirements may continue.
- **Product owner:** Bernard Williams (DEAP). Client: Pet Rescue by Judy (PRBJ).
- **Architecture owner:** Architecture Agent
- **Version:** 0.4.0 (draft). Last approved: 0.3.0
- **Approved by:** Bernard Williams (Product Owner), version 0.3.0, decision
  given in chat and recorded by the Architecture Agent. Version 0.4.0: pending.
- **Approval date:** 2026-11-02 (version 0.3.0)
- **Change summary (0.3.0 to 0.4.0), found while preparing Feature RD 010:**
  adds FR-025 (reusable applicant profile), FR-026 (multi-step application that
  saves after every step and can be resumed) and FR-027 (applicants list and open
  their own draft and submitted applications). Amends FR-014 (submission requires
  a signed-in account, resolving OQ-08), NFR-SEC-003 (audit reads by anyone other
  than the data subject), NFR-PRIV-001 (profile and draft data), the public route
  rule (application information pages are public, the application itself is not)
  and the Decisions required list. Product owner direction recorded 2026-11-02:
  account required to apply; profile holds contact, identity, employer, housing,
  household, pets and veterinarian answers; submitted applications keep a frozen
  copy; date of birth is stored, not age. Impact: Feature RD 010 depends on this
  revision. No implemented criterion changes.
- **Change summary (0.2.0 to 0.3.0), found while preparing Feature RD 009:**
  adds FR-024 (branded public site shell and primary navigation), NFR-SEO-001
  (prerender wherever possible), and a public route rule in the authorization
  section. Product owner direction recorded: application form field lists are
  captured incrementally and per-form Feature RDs are updated as they arrive
  (see Assumptions). Impact: Feature RD 009 depends on this revision; one
  implemented criterion (RD 003 AC-IDENTITY-03, root route requires sign in) is
  amended so the home route is public.
- **Change summary (0.1.0 to 0.2.0):** Replaces the template starter text with
  the PRBJ product baseline. FR-001 to FR-004 and the four starter NFRs are
  kept verbatim so Feature RDs 001 to 008 still trace. Everything from FR-010
  and NFR-PERF-001 onward is new. Supporting detail lives in
  [requirements.md](requirements.md), [architecture.md](architecture.md) and
  [data-model.md](data-model.md); this document is the contract, those are
  explanations.

## Product purpose

Replace petrescuebyjudy.com, a table-based RescueGroups.org (RG) hosted site that
is poor on phones, with a fast, accessible, on-brand website and adoption portal
for PRBJ, a volunteer-run no-kill rescue in Sanford, Florida. Adopters find a
pet, apply, and give. A few volunteers run content and review applications
without a developer. RG stays the system of record for animals.

## Users, problems, and evidence

- **Primary users:** Adopters and fosters (mostly on phones), visitors and
  donors, volunteer applicants, rescue staff and volunteers acting as editors
  and application reviewers, and DEAP as the maintaining consultancy.
- **Problem:** The current site has limited filtering, is table-based and not
  mobile friendly, and keeps events, stories, pages and forms inside RG's CMS.
- **Evidence (observed):** live site review on 2026-11-02 and RG API v5 public
  documentation, recorded in the DEAP vault synopsis. RG v5 public API is
  read-only and beta and covers animals and organizations only.
- **Assumptions (not yet validated):** the animal count is in the low hundreds;
  most traffic is mobile; four of five application field lists are still
  uncaptured. See [open-questions.md](open-questions.md).
- **Desired outcomes:** see NFR-PERF-001, FR-012, and the launch measures in
  [delivery-plan.md](delivery-plan.md).

## Goals and non-goals

### Goals

- A mobile-first animal catalog with filters, search and shareable URLs, kept
  current from RG.
- Online applications (dog, cat, foster, Dog 4 a Day, volunteer) that protect
  applicant data and give reviewers a status workflow.
- Volunteer-operable content: pages, events, success stories, banners, flyers.
- Accounts with favorites, and alerts when matching animals are listed.
- Zero loss of inbound links and search ranking at cutover.

### Non-goals

- Editing animal records (stays in RG).
- Pushing applications or any data back into RG at launch.
- On-site donation or adoption-fee payment processing at launch.
- Volunteer scheduling or management (Volgistics stays external).
- Multi-rescue or multi-tenant operation.

## Scope

### In scope

- Everything in the functional requirements below.

### Out of scope

- The non-goals above, native mobile apps, SMS, and any RG v2 private-API
  integration unless the Product Owner approves it.

## Domain and system context

- **Core concepts:** Animal (mirrored from RG), Application, Account, Favorite,
  Alert subscription, Event, Story, Page, Banner, Promo, Media asset, Redirect,
  Sync run, Audit log. See [data-model.md](data-model.md).
- **Actors:** Visitor, Account holder, Editor, Reviewer, Admin, the RG API
  (trusted but beta, read-only), email provider, hosting provider.
- **Untrusted inputs:** all public form input, RG payloads (validated before
  persistence), uploaded images, rich text.
- **Tenancy:** single-tenant. The multitenancy capability pack is not used.

## Functional requirements

- **FR-001:** The application provides a working landing route.
- **FR-002:** Every generated application begins with email/password account
  creation, authenticated access, and self-service profile management.
- **FR-003:** A user's normalized email address is their login username; the
  application never asks for or generates a separate username.
- **FR-004:** Users can manage their display name, login email, password, and a
  replaceable profile picture stored durably in PostgreSQL.
- **FR-010:** Visitors can browse available animals with filters (species,
  breed, sex, age group, size, good with dogs, cats and kids, special needs,
  needs foster, in training), sorting and pagination. Filter state is
  encoded in the URL so any result set can be shared and bookmarked.
- **FR-011:** Each animal has a detail page with gallery, video when present,
  status, key attributes, description, a primary Apply action, share, print,
  and the required RG attribution image. Staff naming tags in RG animal names
  (FH, TRAINING CAMP, TRAINING CAMP GRADUATE) render as badges, not raw text.
- **FR-012:** The application mirrors public RG animal data into PostgreSQL on
  a schedule and on demand. If RG is unavailable, the last good data is served
  with a freshness indicator. Data older than 7 days is never presented as
  current.
- **FR-013:** Visitors can search the site across three scopes: available
  animals, animals and success stories, and website content.
- **FR-014:** Signed-in account holders can submit dog adoption, cat adoption,
  foster, Dog 4 a Day and volunteer applications with server-side validation,
  spam protection, a confirmation to the applicant and a notification to the
  rescue. Visitors without an account can read each application's information
  page and are taken to sign in or sign up before starting.
- **FR-015:** Reviewers can list, filter, open and progress applications through
  defined statuses and record notes. Only Reviewers and Admins can read
  applicant data.
- **FR-016:** Visitors can create an account, save favorite animals, and
  subscribe to alerts for new animals matching saved criteria such as breed.
- **FR-017:** Editors can create, edit, preview, publish and unpublish pages,
  events, success stories, banners (including the surrender capacity banner),
  home flyers, the wish list and site settings, without a developer.
- **FR-018:** Visitors can submit a success story with photo; an Editor must
  approve it before publication.
- **FR-019:** Visitors can send a contact message; the rescue receives it by
  email and in the admin inbox.
- **FR-020:** The site presents all giving options (PayPal, Venmo, check, vet
  direct, gift cards, wish list, sponsor a pet) and the required nonprofit
  disclosure text, linking out for payment at launch.
- **FR-021:** Every legacy URL pattern (`/animals/detail?AnimalID=`, `/info/...`,
  `/forms/form?formid=`) returns a permanent redirect to its new equivalent, or
  a deliberate fallback, verified from a crawl of the live site.
- **FR-022:** Public pages emit crawlable HTML metadata and structured data
  (title, description, canonical, Open Graph, JSON-LD, sitemap) including for
  animal, event and story pages.
- **FR-024:** The public site presents PRBJ branding (wordmark or logo, color,
  type) on a shared shell with a header and primary navigation (Home, Animals,
  Adopt / Foster, Surrender, Volunteer, Ways to Give, Successes), a footer with
  contact details, and a responsive menu on small screens. Every primary
  destination is reachable without signing in.
- **FR-025:** Account holders keep one reusable applicant profile holding the
  answers that describe them rather than a particular animal: legal name, address,
  cell phone, date of birth, employer, housing and landlord, household members,
  current and past pets, and veterinarian. Applications pre-fill from it, edits
  made while applying update it, and the holder can view, edit and clear it. A
  submitted application keeps a frozen copy of the profile values it was
  submitted with, so later edits never change an application on file.
- **FR-026:** Applications are completed in a multi-step wizard. Progress is
  saved on the server after every step (and on request), so an account holder can
  leave and return on any device to finish. Drafts expire after 30 days without
  a save. Submission validates every step again on the server and is final.
- **FR-027:** Account holders can list their own applications with status and
  last-saved or submitted date, resume a draft, discard a draft, and open a
  read-only copy of each submitted application from their account. They can never
  see another person's application or any reviewer note.
- **FR-023:** Reviewers and Admins receive email notices for new applications,
  contact messages and story submissions that contain no applicant data, only a
  link into the authenticated admin.

## Non-functional requirements

- **NFR-SEC-001:** Server-side authorization protects restricted operations.
- **NFR-A11Y-001:** User-facing experiences are built to WCAG 2.2 AA.
- **NFR-REL-001:** Releases have documented validation and rollback procedures.
- **NFR-DATA-001:** PostgreSQL is the required database from initialization;
  alternative Prisma providers are not supported by the template.
- **NFR-PERF-001:** On a mid-range phone on 4G, public pages meet LCP at or
  under 2.5 s, CLS at or under 0.1 and INP at or under 200 ms at the 75th
  percentile, measured in the field after launch and with Lighthouse in CI.
- **NFR-SEO-001:** Every public route that has no authentication requirement and
  no per-user render output is prerendered at build time (Wasp `prerender`),
  including dynamic routes for which concrete paths can be enumerated at build.
  Prerendered HTML contains the route's navigation, heading, title and meta
  description without JavaScript. Where prerendering cannot supply current
  data-driven content, server-injected metadata and structured data cover the
  gap (architecture section 3.3). Build-time data must come only from the
  production data source, never the RG test environment.
- **NFR-SEC-002:** Applicant personal data (names, addresses, phone, employer,
  landlord, veterinarian, household details, free text) is encrypted at rest at
  the application layer with a versioned key, in addition to disk and transport
  encryption.
- **NFR-SEC-003:** Every read of application detail by anyone other than the
  applicant, every status change, every export and every role change writes an
  append-only audit record naming actor, action, target and time. An applicant's
  reads of their own profile and applications are not audited. Audit rows cannot be updated or deleted by the
  application.
- **NFR-PRIV-001:** Applicant data, including drafts and the applicant profile,
  has a documented retention schedule enforced by a scheduled purge, with purge
  results logged. The profile lives while the account lives and can be cleared by
  its owner at any time. The schedule is approved by
  the rescue (see open questions).
- **NFR-SEC-004:** Secrets (RG key, encryption keys, email credentials) exist
  only in server environment variables, are never logged, never reach the
  client, and are never committed.
- **NFR-REL-002:** The site remains fully browsable when RG is down or returns
  429. The sync backs off and alerts; it never hammers RG.
- **NFR-REL-003:** Nightly encrypted database backups with 30 day retention, a
  recovery point objective of 24 hours and a recovery time objective of 4 hours,
  proven by a restore rehearsal before launch.
- **NFR-OPS-001:** Uptime, sync freshness, error rate and email delivery are
  monitored, with alerts routed to DEAP and a named rescue contact.
- **NFR-COMP-001:** The application complies with the RG API terms: public key
  status at launch, no test-environment data on public pages, one key per
  service, scheduled refresh at least weekly, one business day purge on RG
  request, and the required image on pet detail pages.
- **NFR-OPS-002:** A volunteer can perform routine operations (edit content,
  review applications, flip the capacity banner) from written admin guidance
  with no command line access.
- **NFR-COST-001:** Steady-state hosting and third-party services cost at most
  USD 50 per month unless the Product Owner approves more. (Proposed target;
  confirm in open questions.)

## Authentication, authorization, privacy, and security

- Email/password authentication and profile management are enabled by default.
- Roles: Account holder (default), Editor, Reviewer, Admin. Editors cannot read
  application data. Reviewers cannot change roles or settings. Admins can do
  both but their access is audited like everyone else's.
- Public routes (home, all content, catalog, application information pages, login,
  signup) need no account. Starting, continuing and submitting an application
  requires an account. Account, applicant profile, own applications, favorites
  and admin routes require authentication. This supersedes the starter default that protected the root
  route.
- Every protected operation enforces authorization on the server; the client
  hides controls for usability only.
- Public forms are rate limited and bot protected. Account enumeration is
  prevented on login, signup and reset flows.
- Foster contact details and RG contact records are never mirrored or shown.
- Threat boundaries and PII handling are specified in
  [architecture.md](architecture.md) and ADR 0007.

## Data lifecycle and recovery

- Animal data is a cache: rebuildable from RG at any time. Removal on RG request
  within one business day is supported by an admin purge action.
- Application data is the only irreplaceable sensitive data. Lifecycle:
  draft (expires after 30 days without a save), submitted, reviewed, completed or
  declined, then purged per schedule. The applicant profile is kept while the
  account exists and is encrypted like application data.
- Content (pages, events, stories) is irreplaceable and versioned for pages.
- Backup, restore and migration rules: NFR-REL-003 and the rollback runbook.
- Schema changes use committed Prisma migrations with expand, migrate,
  contract sequencing.

## Accessibility and user experience

- WCAG 2.2 AA is the engineering floor for user-visible behavior.
- Supported: current and previous major versions of Safari iOS, Chrome Android,
  Chrome, Safari, Firefox, Edge. 320 px reflow, 200 percent text resize.
- Critical workflows with keyboard-only and screen reader paths: find an
  animal, apply, favorite, donate links, contact, admin review.
- Informative images require alt text in the CMS; the editor blocks publish
  without it.

## Reliability, performance, and observability

- Availability target 99.5 percent monthly for public pages (best effort,
  single region, no paging rota).
- Sync freshness: hourly for available animals, alert if last success is older
  than 6 hours.
- Structured logs without PII; error tracking; synthetic uptime checks on home,
  an animal page and the sync heartbeat.
- Support ownership: DEAP for platform; a named rescue contact for content.

## Integrations and deployment context

- **RG API v5 (read-only, beta):** key in the Authorization header, server side
  only, behind an adapter interface. Failure modes: 429, 5xx, schema drift.
- **Email provider (SMTP or API):** transactional mail. Sender domain needs
  SPF and DKIM.
- **Bot protection (Turnstile or equivalent), error tracking, uptime monitor.**
- **External links:** PayPal, Venmo, Amazon, Chewy, Volgistics.
- **Hosting:** Railway (existing DEAP standard, Railway capability pack).
  Environments: local, staging, production. See ADR 0002.
- **DNS and domain:** petrescuebyjudy.com; control and mail records to be
  confirmed before cutover.

## Assumptions, dependencies, and risks

- **Assumptions:** see the Users section; also that RG field names match the
  v5 docs (unverified against live responses). The cat adoption form field list
  was captured on 2026-11-02 (Feature RD 010). Field lists for foster, Dog 4 a Day
  and volunteer are captured incrementally; the
  per-form Feature RDs are written with the best known fields and revised as
  information arrives, so FR-014 does not wait on a complete inventory.
- **Dependencies:** client logo files and photography, content access to the RG
  CMS for export, the four missing application field lists, DNS control, and RG
  key flipped to Public at launch.
- **Risks (top):** (1) SEO for dynamic animal pages on a client-rendered
  framework, (2) RG v5 beta instability, (3) applicant PII handling, (4)
  missing contract and scope, (5) volunteer operability after handover.

## Decisions required

- Approve this baseline.
- Data retention schedule (NFR-PRIV-001).
- Whether guests may submit applications without an account. **Decided
  2026-11-02:** no, an account is required (FR-014; OQ-08 closed).
- Hosting account ownership and the monthly cost ceiling (NFR-COST-001).
- Relationship to the separate Joey Barto contract proposal.

## Requirement traceability

Every domain Feature RD must cite one or more approved `FR-*` or `NFR-*`
identifiers from this document. During Feature RD preparation, the Architecture
Agent automatically checks coverage. It leaves this document unchanged when
coverage exists; if a genuine product-level gap exists, it maintains the PRD
and presents the focused diff for approval before the Feature RD advances.
