# Requirements: User Stories

Status: Proposed. These stories explain and decompose the Engineering PRD
([PRD.md](PRD.md)); they are not themselves the approval contract. Each story
cites the `FR-*` or `NFR-*` it serves. Feature RDs will turn stories into
`AC-<FEATURE>-<NN>` criteria with tests. Source detail: the DEAP vault
Application Synopsis (2026-11-02).

Priority groups: **Must** (launch blocking), **Should** (planned fast follow,
may ship at launch if capacity allows), **Later** (not planned for v1).

Shared acceptance baseline for every story that has UI: WCAG 2.2 AA (NFR-A11Y-001),
works at 320 px, keyboard operable, errors announced, no console errors.

## Must have (launch)

### Baseline site (FR-024, NFR-SEO-001) - first capability, Feature RD 009

**US-SITE-01** As a visitor, I land on a branded home page and can reach every
primary section from a header navigation without signing in.
- Header has the PRBJ wordmark, Home, Animals, Adopt / Foster, Surrender,
  Volunteer, Ways to Give, Successes, a Donate button and an account control.
- On phones the navigation collapses to a labelled Menu button; links remain in the
  HTML without JavaScript.
- Footer shows address, phone, email, About Us, Contact Us and the Volunteer Portal.

**US-SITE-02** As a search engine or link preview, I receive complete HTML for
public pages.
- Every public route that can be prerendered is, with its own title, description,
  heading and navigation in the static HTML (NFR-SEO-001).

### Animal catalog and detail (FR-010, FR-011, FR-012, FR-022)

**US-ANI-01** As an adopter on my phone, I can browse available animals in a
photo card grid so I can scan quickly.
- Cards show photo, name without tags, species, breed, sex, age group, status badge.
- Lazy loaded images with fixed aspect ratio; no layout shift.
- Empty and error states offer a way back (clear filters, try again).

**US-ANI-02** I can filter by species, breed, sex, age group, size, good with
dogs, cats and kids, special needs, needs foster, and in training, and sort.
- Filters apply server side; result count shown and announced to screen readers.
- Every filter combination is a shareable URL; back button restores state.
- Preset quick views: Recent, Dogs, Cats, Seniors, Special Needs, All.

**US-ANI-03** I can open an animal page with gallery, status, facts, long
description and a primary Apply action.
- Gallery supports swipe, keyboard, captions via alt text, and a larger view
  with focus trap and Escape to close; video plays when present.
- Facts include sex and altered status, age, size, fee text, good with, housetrained,
  microchipped, special needs, indoor or outdoor.
- Unknown values are omitted, never shown as "No".
- The required RG attribution image is present on the page (NFR-COMP-001).

**US-ANI-04** Staff tags in an animal's name (FH, TRAINING CAMP, TRAINING CAMP
GRADUATE) show as badges, not raw text.
- Name is shown without tags; badge has a text label and an explanation tooltip
  that works by keyboard and touch.

**US-ANI-05** I can share an animal and print a flyer.
- Share uses the native sheet where available, else copy link; print stylesheet
  produces a one page flyer with photo, key facts and contact details.

**US-ANI-06** I see siblings or bonded animals linked from an animal page.
- Linked only when the data identifies them (verify in RG; otherwise omit).

**US-ANI-07** If RG is unavailable the catalog still works.
- Last good data served; a freshness notice appears if older than 24 hours; after
  7 days a neutral "listings are updating, see RescueGroups" page replaces
  availability claims (FR-012, NFR-REL-002, NFR-COMP-001).

### Search (FR-013)

**US-SRCH-01** I can search the site across Available Animals, Animals and
Successes, and Website Content.
- One search box with a scope selector; results grouped by type; typo tolerant
  for names; empty state suggests filters.

### Applications (FR-014, FR-015, FR-023, NFR-SEC-002, NFR-SEC-003, NFR-PRIV-001)

**US-APP-01 Dog adoption.** I can complete the Dog Adoption Application (2024
form) with the fields in the synopsis: contact, employer, home ownership,
landlord and lease end, fence details, past and current pets, hours alone,
household, vet, behavior plan, return to PRBJ acknowledgment (required), source,
comments, typed name and date certification.
- Step by step with progress indicator; per step validation and an error summary
  that takes focus; the animal dropdown lists currently available dogs and can be
  pre-selected from an animal page.
- Required return-to-PRBJ acknowledgment blocks submission if unchecked.
- On submit: reference code shown, copy emailed to the applicant, link only
  notification to staff (FR-023).

**US-APP-02 Cat adoption.** Same behavior with the cat form fields.
- Feature RD is drafted with known fields and updated as the field list is captured (OQ-10).

**US-APP-03 Foster.** I can apply to foster.
- Eligibility notes shown first: within 30 miles of Sanford, no foster with intent
  to adopt, no unaltered pets in the home; the distance rule is advisory at launch
  (postal code check can warn, reviewers decide).
- Feature RD is drafted with known fields and updated as the field list is captured (OQ-10).

**US-APP-04 Dog 4 a Day.** I can apply for the day outing program.
- Rules shown first (18 or older, no Sunday or Monday, 10 to 11 AM pickup, back
  by 4 PM, no puppies under 6 months, no FH dogs, one application per person for
  life); age gate enforced; duplicate applicant detection by email flags for
  reviewers.
- Feature RD is drafted with known fields and updated as the field list is captured (OQ-10).

**US-APP-05 Volunteer.** I can apply to volunteer and find the hold harmless
release and orientation info.
- Minimum age rule per answer to OQ-11; printable release; link to Volgistics
  portal for approved volunteers.

**US-APP-06** Bot and abuse protection without blocking real people.
- Turnstile or equivalent, honeypot, per IP and per email rate limits; protection
  is operable by keyboard and screen reader; a failure message gives a phone and
  email fallback.

**US-APP-07** I can save a draft and return to finish.
- Signed in applicants: server side draft, encrypted, expires after 30 days.
- Guests (if allowed, OQ-08): draft kept only in the browser session, with a clear
  note that it will not survive closing the tab.

**US-APP-08** As a Reviewer I see a queue of applications and move each through
statuses.
- List filters by type, status, animal and date; list shows only index fields.
- Statuses: Submitted, In review, Needs info, Approved, Declined, Withdrawn,
  Completed; illegal transitions rejected; each change is timestamped and attributed.

**US-APP-09** As a Reviewer I can open an application, read it, add private notes
and email the applicant for missing information.
- Opening writes an audit record; notes encrypted; email uses a template and is
  logged in the timeline without content.

**US-APP-10** As an Admin I can see who accessed which application and when.
- Audit view filters by actor, target and date; audit rows cannot be edited or deleted.

**US-APP-11** Applicant data follows the retention schedule.
- A nightly purge deletes expired payloads and notes, leaves a tombstone, and logs
  counts; the schedule is configurable by Admin within approved limits.

### Accounts and favorites (FR-016, FR-002 to FR-004)

**US-ACC-01** I can register, verify my email, sign in, reset my password and
manage my profile.
- Generic responses prevent account enumeration; verification and reset links
  expire; password rules published.

**US-ACC-02** I can favorite animals and see my favorites list.
- Heart toggle has an accessible name and state; works signed in; if signed out,
  prompts sign in then completes the favorite.
- Favorites for animals no longer listed show a clear "no longer available" state.

### Content, events, stories, contact (FR-017, FR-018, FR-019)

**US-CMS-01** As an Editor I can create and edit pages with a restricted rich
text editor, preview, publish and unpublish.
- No raw HTML; images need alt text or a decorative flag before publish; last 20
  revisions restorable.

**US-CMS-02** I can manage events (title, date, time, place, map link, image,
description) and animals attending.
- Public list, detail pages, a calendar view and an `.ics` feed; past events
  archived automatically; canceled events labeled, not deleted.

**US-CMS-03** I can manage success stories (Pupdates and Cat Tails).
- Public list with photo, name, story, A to Z filter and pagination; each links
  to the animal's page, which remains available after adoption.

**US-CMS-04** I can flip the surrender capacity banner and other announcement
banners without a developer.
- Banner appears on the Surrender page and optionally sitewide; has start and end;
  announced politely to assistive tech and never blocks content.

**US-CMS-05** I can manage the home flyer grid, the wish list and site settings.
- Flyers need alt text; wish list items are plain text with optional links; legal
  disclosure text is locked to Admins.

**US-CMS-06** I can read About, Adoption Information, Surrender, Volunteer, Ways
to Give and Contact pages with the current content migrated from the live site.
- Page parity checklist signed off by Barb before launch.

**US-CONT-01** I can send a message through a contact form.
- Spam protected; confirmation shown; message arrives in the admin inbox and by
  link only email; address, phone and emails also listed on the page.

### Giving (FR-020)

**US-GIVE-01** I can find every way to give.
- PayPal one time and monthly, Venmo, check by mail, vet direct, gift cards,
  wish list (Amazon, Chewy), impact tiers, and the required nonprofit disclosure,
  all with working links and clear external link indication.

**US-GIVE-02** I can sponsor a pet where the animal is sponsorable.
- Sponsor block shows only when RG says sponsorable, using RG minimum and details;
  links out at launch.

### Redirects, SEO, platform (FR-021, FR-022, NFR-*)

**US-RED-01** Old links keep working.
- Every `/animals/detail?AnimalID=`, `/info/...` and `/forms/form?formid=` URL
  from the crawl returns a 301 to its new target; unmatched ones go to the
  closest listing with a logged miss; a post-launch report lists misses.

**US-SEO-01** Pages are discoverable and shareable.
- Server delivered title, description, canonical, Open Graph and JSON-LD on
  animal, event, story and content pages; sitemap and robots; verified by crawl
  and Rich Results test (FR-022).

**US-OPS-01** Sync, health and backups are observable.
- Sync status and freshness visible to Admins; alerts on sync older than 6 hours,
  repeated 429 or schema failures, failed backups, email failures (NFR-OPS-001).

**US-OPS-02** Admin can honor an RG removal request.
- One action purges RG derived data and its search index entries within minutes
  and records the action (NFR-COMP-001).

**US-PERF-01** The site is fast on phones (NFR-PERF-001).
- Lighthouse CI budgets enforced; field vitals reported after launch.

**US-OPS-03** A volunteer can run the site from written guidance (NFR-OPS-002).
- Admin guide covers editing content, reviewing applications, banner flip,
  user roles and what to do when something looks wrong.

## Should have

**US-ALERT-01** I can subscribe to alerts for new animals by breed or saved
criteria and unsubscribe in one click (FR-016).
- Email only; at most one email per animal per subscription; digest option;
  unsubscribe link works without signing in.

**US-STORY-01** I can submit a success story with a photo and consent to
publish; an Editor approves before it appears (FR-018).
- Consent checkbox and photo alt text prompt; moderation queue; rejected stories
  can send a templated reply.

**US-ANI-08** I can find animals near me or filter by foster need and distance
(geodistance) (FR-010).

**US-ANI-09** Animals attending an event show on the event page and vice versa
(FR-017).

**US-APP-12** Reviewers can see duplicate applicants across types (same email)
and a simple dashboard of counts by status.

**US-CMS-07** Editors can schedule publish and unpublish times for pages, events
and banners.

**US-SRCH-02** Search suggestions and recent popular searches.

**US-OPS-04** Cookieless analytics dashboard for the rescue (page views, top
animals, applications started vs submitted).

## Later

- **US-DON-01** On-site donation checkout and recurring gifts (needs payments
  scope and compliance review).
- **US-SPON-01** On-site pet sponsorship checkout.
- **US-INT-01** Push applications into RG through the private v2 API (needs
  credentials and a Product Owner decision).
- **US-VOL-01** Volunteer profiles, orientation tracking, shifts (Volgistics
  overlap).
- **US-NOTIF-01** SMS or push alerts.
- **US-I18N-01** Spanish translation of key pages and forms.
- **US-ANI-10** Compare animals side by side; matching quiz.
- **US-INT-02** Social feed embeds (Facebook, Instagram) beyond plain links.

## Traceability

| Stories | Requirements |
|---|---|
| US-ANI-* | FR-010, FR-011, FR-012, FR-022, NFR-COMP-001, NFR-REL-002 |
| US-SRCH-* | FR-013 |
| US-APP-* | FR-014, FR-015, FR-023, NFR-SEC-001 to 004, NFR-PRIV-001 |
| US-ACC-*, US-ALERT-* | FR-002 to FR-004, FR-016 |
| US-CMS-*, US-STORY-*, US-CONT-* | FR-017, FR-018, FR-019, NFR-OPS-002 |
| US-GIVE-* | FR-020 |
| US-RED-*, US-SEO-* | FR-021, FR-022 |
| US-OPS-*, US-PERF-* | NFR-OPS-001, NFR-REL-003, NFR-PERF-001, NFR-COMP-001 |
