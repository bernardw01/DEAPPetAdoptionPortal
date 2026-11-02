# Feature RD 010 — Public platform design foundation and homepage

## Status

Built

Approved by Bernard Williams (Product Owner) on 2026-11-02 together with
`docs/design/platform-baseline.md` and acknowledgement of ADR 0008. Open
decisions defaulted to the RD recommendations (FR-024 nav labels; Inter OFL;
pet-finder may navigate to `/animals` with query params; provisional logo;
fixture announcement/event copy). Build evidence recorded below on 2026-11-02
(commit at evidence time was local uncommitted Build on worktree
`DEAPPetAdoptionPortal-impl-010`).

## Requirement traceability

- Product requirements: FR-001, FR-024, NFR-A11Y-001, NFR-PERF-001, NFR-SEO-001
  (PRD 0.3.0, approved). Related for later slices (not required to finish this
  RD): FR-010 (catalog presentation patterns), FR-013 (search entry), FR-016
  (favorites persistence), FR-018/020 (stories/giving content), NFR-COMP-001
  (RG terms when live animal data appears), NFR-OPS-002 (volunteer operability
  of content once CMS exists).
- **PRD coverage check:** The approved PRD already covers a branded public shell
  and navigation (FR-024), a landing route (FR-001), WCAG 2.2 AA (NFR-A11Y-001),
  Core Web Vitals targets (NFR-PERF-001), and prerender (NFR-SEO-001). A reusable
  design-system and search-first homepage composition are implementation of
  those requirements plus design direction, not a product-level PRD gap.
  **`docs/PRD.md` is not edited in this pass.**
- Related decisions: ADR 0001 (stack; CSS custom properties for this slice),
  ADR 0008 (single public design foundation, Proposed),
  `docs/design/platform-baseline.md` (Proposed), Feature RD 009 (Built shell).
- Dependencies: Approved PRD 0.3.0; Product Owner approval of this RD and the
  platform baseline; RD 009 Built (public routes, prerender, test harness).
  Live RescueGroups sync is **not** required; static fixture animals are used.

## Problem and evidence

RD 009 delivered a public shell with provisional Fraunces/Figtree fonts and a
minimal holding homepage. The Product Owner approved the Design Agent mockup
`docs/design/mockups/prbj-modern-home/` as the visual direction for the platform.
Without translating that mockup into a shared foundation, later catalog,
application, and content features will diverge visually and recreate tokens and
components ad hoc. Evidence: mockup files under
`docs/design/mockups/prbj-modern-home/` and live-site shortcomings recorded in
the PRD (table-based, phone-unfriendly, competing hierarchy).

## Desired outcome

One documented, testable public design foundation (tokens, type, layout,
shared components) and a public homepage that matches the approved mockup’s
observable design: search-first hero, trust strip, featured pets, process,
involvement, event, newsletter presentation, and full footer—while preserving
FR-024 navigation destinations, prerender, and existing identity/profile
behavior.

## Actors

- Unauthenticated visitor (primary)
- Signed-in account holder (sees Account control; no new private homepage data)
- Implementation Agent (builds against ACs)
- Product Owner (approves baseline and RD)

## Scope

### In scope

- Approve and implement the platform baseline tokens, Georgia/Inter stacks
  (Inter self-hosted WOFF2 + license), layout container, and shared public
  primitives listed in `docs/design/platform-baseline.md`.
- Rebuild the public homepage `/` to match the mockup hierarchy and visual
  language (not the legacy promo grid).
- Apply the foundation to the existing public shell so header, footer, login,
  signup, and profile gain visual coherence (auth **behavior** unchanged).
- Replace RD 009 Fraunces/Figtree and superseded token values with the mockup
  baseline once this RD is approved.
- Static fixture animals for featured cards and hero (explicitly not live RG).
- Favorite control as local UI state (`aria-pressed`) only; no persistence.
- Pet finder form and newsletter form: real labeled controls; **no functional
  submit** to a backend (GET to `/animals` with query params is allowed as
  navigation scaffolding if `/animals` remains a holding page).
- Announcement bar content as static or config text (no CMS yet).
- Responsive and accessibility behavior per baseline and ACs below.
- Visual evidence at representative viewports (screenshot or visual regression).
- Update help/docs only if user-visible labels change in a way that needs it;
  otherwise record N/A.

### Out of scope / non-goals

- Full animal catalog, detail pages, RG sync, search index (FR-010–013).
- Application workflows, CMS, events CRUD, story moderation, donation processing.
- Persisted favorites/alerts (FR-016).
- Admin portal redesign (reuse foundations later; denser layout allowed).
- Changing FR-024 destination set without Product Owner decision.
- Tailwind/shadcn adoption.
- Deployment, staging, robots, sitemap, canonical beyond existing prerender.
- Logo redraw or AI-generated logo text.

## Existing behavior

Verified against the Built RD 009 tree on `main` (2026-11-02):

- Public prerendered routes: `/`, `/animals`, `/adopt-foster`, `/surrender`,
  `/volunteer`, `/ways-to-give`, `/successes`, `/about`, `/contact`, `/login`,
  `/signup`. `/profile` remains `authRequired`.
- Shell: text wordmark, primary nav (FR-024 labels), Donate, Sign in / Account
  via `useIsClient`, footer with Sanford contact, skip link, brand tokens and
  Fraunces/Figtree.
- Homepage is a short welcome + CTAs + contact, not the mockup composition.
- Tests: Vitest + Testing Library + Playwright/axe + prerender check exist.
- AC-PERF-01 on RD 009 missed Lighthouse 90 (recorded).

## Proposed architecture

### UI and interaction

- Extract design tokens and shared components under a feature-oriented module
  (for example `src/site/` / `src/design/`), driven by the platform baseline.
- Homepage page composes shared primitives; avoid a single untestable monolith.
- Account control and responsive menu continue to use `useIsClient` so
  prerender matches first client paint (ADR 0001 / architecture §3.3).
- Mobile menu: named Menu button, `aria-expanded` / `aria-controls`, Escape
  closes and returns focus.
- Favorite: button with accessible name and `aria-pressed`; not nested inside
  the animal name link.

### Application behavior

- `/` remains public and prerendered; unique title and meta description.
- Holding routes from RD 009 remain unless this RD only restyles them via the
  shared shell (no invented policy copy).
- Pet finder: labeled radios and selects; submit does not POST PII; may navigate
  to `/animals` with query string for future catalog.
- Newsletter: presentation only; prevent real network submit.

### Data model and migration

None for this RD. Fixture data lives in source modules or static JSON, not
Prisma.

### Authorization and security

- No new secrets. No browser RG credentials (NFR-COMP-001 when live data
  arrives later).
- External links keep `rel="noopener noreferrer"` and accessible external cue.
- Auth routes unchanged in behavior.

### Tenant isolation

Not applicable (single tenant).

### External services

None required. Fixture photos may temporarily reuse mockup assets with
provenance recorded; production path is RG mirror / CMS later.

### Reliability, recovery, and observability

Prerendered homepage remains readable without JS for primary content. No new
logging. Rollback = revert commits (CSS/fonts/components/homepage).

### SEO

Continue `prerender: true` on public routes. Page-specific `<title>` and meta
description in prerendered HTML (Wasp 0.26 + React head elements, as proven in
RD 009). Prefer a single document title if a supported mechanism exists;
otherwise record dual-title limitation.

## Accessibility

- **Controls inventory:** skip link; announcement links; logo/home; primary
  nav; Menu; Donate; Sign in/Account; pet-type radios; age/size selects; find
  button; filter chips; animal card links; favorite toggles; process links;
  involvement cards; event CTA; newsletter fields; footer links; external
  Volunteer Portal.
- **Keyboard / focus:** complete primary journey (land → open menu if needed →
  reach Animals/Find → operate finder and favorites); visible focus; Escape
  closes menu and returns focus; no keyboard trap; sticky header must not hide
  focused content.
- **Contrast:** token pairs verified by unit test (extend RD 009 contrast
  harness to new tokens).
- **Reflow / zoom:** 320px; 200% text; 44px targets.
- **Alternatives:** logo alt; animal photo alt naming the real animal; decorative
  scribbles `aria-hidden`; non-color state (pressed, current, selected).

## Conflict notes (do not silently reinterpret)

1. **Primary nav labels:** Mockup uses in-page marketing links; FR-024 requires
   Home, Animals, Adopt / Foster, Surrender, Volunteer, Ways to Give, Successes.
   **Authority: PRD.** RD recommendation: keep FR-024 destinations in the
   sitewide nav; homepage sections remain in-page anchors or secondary links.
2. **Fonts:** Mockup Georgia/Inter vs RD 009 Fraunces/Figtree vs
   `design-direction.md`. **Authority after approval: platform baseline + this
   RD.** Supersedes RD 009 fonts and provisional design-direction type.
3. **Touch target 42px** on some mockup controls vs 44px a11y floor.
   **Authority: NFR-A11Y-001 / accessibility contract.** Bump to ≥44px.
4. **RD 009 Lighthouse miss** vs NFR-PERF-001. This RD still targets the NFR;
   report misses honestly; do not hide them.

## Acceptance criteria

- [x] AC-FOUNDATION-01: Brand color tokens from the platform baseline exist once
  as CSS custom properties with the specified names and values; contrast pairs
  used for text/UI meet WCAG AA in a unit test.
  Evidence: `npm test -- --run` → `brandTokens.test.ts` passed (2026-11-02).
- [x] AC-FOUNDATION-02: Documented font stacks are exactly Georgia (display) and
  Inter (UI/body); Inter is self-hosted WOFF2 with a license file; no third-party
  font requests on public routes.
  Evidence: `brandTokens.test.ts` + Playwright AC-SITE-10 zero foreign origins.
- [x] AC-FOUNDATION-03: Content container max-width is 1180px with desktop
  gutters of 20px/side and mobile gutters of 14px/side per the baseline.
  Evidence: `brandTokens.test.ts` asserts wrap widths in `src/main.css`.
- [x] AC-FOUNDATION-04: Shared primitives exist for announcement, header, nav,
  actions, animal card, badge, favorite, trust strip, process steps, involvement
  card, event card, footer, and form controls listed in the baseline (exported
  for reuse; not homepage-only copies).
  Evidence: `HomePage.test.tsx` exports check; `SiteChrome.tsx` + `primitives.tsx`.
- [x] AC-HOME-01: Unauthenticated visitors open `/` and receive the homepage
  (no login redirect); `/profile` still requires authentication.
  Evidence: Playwright AC-HOME-01 passed.
- [x] AC-HOME-02: Homepage presents, in order: skip link, announcement, header,
  search-first hero, trust strip, featured pets + chips, adoption process,
  involvement, event, newsletter presentation, footer.
  Evidence: Playwright AC-HOME-02 + unit `HomePage.test.tsx`.
- [x] AC-HOME-03: Primary sitewide navigation retains FR-024 destinations in
  order (Home, Animals, Adopt / Foster, Surrender, Volunteer, Ways to Give,
  Successes) unless Product Owner records an approved label exception in this RD.
  Evidence: `fixtures.test.ts` + `SiteChrome.test.tsx`.
- [x] AC-HOME-04: Hero pet finder uses real labeled radios and selects; submit
  does not POST personal data; newsletter form does not functionally subscribe.
  Evidence: Playwright AC-HOME-04 + `HomePage.test.tsx`.
- [x] AC-HOME-05: Featured animals use fixture data with correct alt text and
  provenance comments; favorite toggles expose `aria-pressed` and accessible
  names without nested interactive elements.
  Evidence: `fixtures.test.ts` + favorite unit/e2e tests.
- [x] AC-HOME-06: Responsive layouts match the baseline at wide (≥981px), tablet
  (~980–741), 390px, and 320px (nav collapse, one-column hero/cards as specified).
  Evidence: Playwright AC-A11Y-03/AC-HOME-06 + AC-VIS-01 screenshots.
- [x] AC-HOME-07: At ≤980px, Menu has `aria-expanded` and `aria-controls`; Enter/
  Space toggle; Escape closes and returns focus; ≥981px shows links without Menu.
  Evidence: `SiteChrome.test.tsx` + Playwright AC-A11Y-02/AC-HOME-07.
- [x] AC-HOME-08: Logo uses the provisional asset without redrawing; proportions
  preserved; production replacement recorded as a pre-production dependency.
  Evidence: `fixtures.ts` provisional flag; logo home link/img in SiteChrome tests.
- [x] AC-HOME-09: Public `/` remains prerendered; prerendered HTML includes nav,
  h1, title, meta description, and footer without JS.
  Evidence: `npm run test:prerender` → 11 routes; Playwright hydrate check.
- [x] AC-HOME-10: Login, signup, and profile keep existing behavior and tests;
  they consume foundation tokens (visual only).
  Evidence: Playwright AC-HOME-10 (`--brand` #AE0303).
- [x] AC-A11Y-01: Public homepage (and shell) states have no serious or critical
  axe violations at 320px and desktop width.
  Evidence: Playwright AC-A11Y-01 passed (all public paths, 320 and 1280).
- [x] AC-A11Y-02: Primary task (reach Animals / operate finder / open a pet
  card link / toggle favorite / open-close menu) is keyboard operable with
  visible focus and correct focus return.
  Evidence: Playwright AC-A11Y-02/AC-HOME-07 passed.
- [x] AC-A11Y-03: 320px reflow without horizontal page scroll; usable at 200%
  text zoom; reduced-motion disables non-essential transitions.
  Evidence: Playwright AC-A11Y-03; `prefers-reduced-motion` in `src/main.css`.
- [x] AC-PERF-01: Lighthouse mobile on prerendered `/` records performance, LCP,
  and CLS; target LCP ≤ 2.5 s and CLS ≤ 0.1; any miss is reported, not hidden.
  Evidence: `npm run test:lighthouse` → performance **66**, LCP **6.9 s**, CLS **0**.
  **Miss recorded (not hidden):** below 90 / LCP ≤ 2.5 s; CLS meets ≤ 0.1.
- [x] AC-VIS-01: Screenshot or visual-regression evidence at 1280, 768, 390, and
  320 widths is recorded against the mockup composition.
  Evidence: `docs/evidence/010-platform-design/home-{1280,768,390,320}.png`.
- [x] AC-GOV-01: `wasp compile` succeeds; `npm run sdlc:check` passes; focused
  AC-mapped tests pass; no new console errors on the homepage happy path.
  Evidence: `wasp compile` OK; `sdlc:check` OK; 29/29 unit tests; Playwright
  hydrate with empty console-error list.

## Test plan

### Unit and contract

- Token values and contrast pairs (AC-FOUNDATION-01).
- Font-face / package presence and no CDN URL in CSS (AC-FOUNDATION-02).
- Nav order module remains FR-024 (AC-HOME-03).
- Fixture animal identities and alt strings (AC-HOME-05).

### Integration / component

- Header, Menu Escape/focus, announcement, pet finder labels, favorite
  `aria-pressed`, newsletter non-submit (Testing Library + jsdom).

### Playwright

- AC-HOME-01, AC-HOME-06–07, AC-A11Y-01–03, AC-HOME-09/10, AC-PERF-01, AC-VIS-01,
  zero foreign font origins.

### Compile / governance

- `wasp compile`, `npm run sdlc:check`; Validate uses `npm run sdlc:validate`
  when requested.

## Implementation slices

1. Tokens + Inter self-host + contrast tests (remove Fraunces/Figtree).  
2. Shared primitives (header/nav/footer/actions/cards) restyle.  
3. Homepage composition with fixtures.  
4. A11y/responsive Playwright + visual evidence.  
5. Prerender/Lighthouse evidence; mark ACs only with observed results.

## Rollout and rollback

- Rollout: local Build then Validate; no deploy in this RD.  
- Rollback: revert; no migration or external state.

## Open decisions (Product Owner)

Resolved 2026-11-02 by Product Owner approval (defaults = RD recommendations):

1. FR-024 destinations remain sitewide primary nav.  
2. `docs/design/platform-baseline.md` and ADR 0008 Approved/Accepted.  
3. Inter self-host with OFL license file.  
4. Announcement and event fixture copy from mockup shipped.  
5. Pet-finder may GET `/animals` with query params.  
6. Provisional JPG logo until client master (OQ-13).

## Verification

**Build (2026-11-02), observed:**

| Check | Result |
|---|---|
| `npm run sdlc:check` | Pass — “SDLC governance is valid (Engineering PRD and 10 Feature RDs checked).” |
| `wasp compile` | Pass (DB up-to-date warning only; no compile failure). |
| `npm test -- --run` | Pass — 10 files / 29 tests. |
| `npm run test:prerender` | Pass — 11 prerendered HTML files; `/profile` not prerendered. |
| `npm run test:e2e` | Pass — 10/10 Playwright tests. |
| `npm run test:lighthouse` | Recorded miss — performance 66, LCP 6.9 s, CLS 0. |
| Visual evidence | `docs/evidence/010-platform-design/home-{1280,768,390,320}.png` |
| Help/docs sync | N/A — FR-024 labels unchanged; no new user-guide procedure. |
| `npm run sdlc:validate` | **Not run** — Validate not requested in this Build. |

Do not treat Built as Validated. Full Validate still requires a fresh
`npm run sdlc:validate` on the reviewed commit.

## Manual smoke

After Validate: signed-out visitor at 390px opens `/`, expands Menu, reaches
Animals, tabs through finder and a favorite, confirms Donate and footer, signs
in and sees Account, confirms `/profile` still protected. With JS disabled,
confirm prerendered nav and h1.

## Cursor Implementation Agent handoff

Copy-ready prompt after Product Owner sets this RD and the platform baseline to
Approved/Planned:

```text
You are the Implementation Agent for this repository. Execute Feature RD 010
(Public platform design foundation and homepage): Build only.

Setup
- Work in your own worktree or clone based on current main (includes Built RD 009).
- Do not share a working directory with another agent.

Read first, in order
1. AGENTS.md and docs/sdlc/README.md
2. docs/PRD.md (Approved 0.3.0)
3. docs/design/platform-baseline.md (must be Approved)
4. docs/architecture/decisions/0008-public-platform-design-foundation.md
5. docs/features/000-overview.md and docs/features/010-public-platform-design-foundation.md
6. docs/design/mockups/prbj-modern-home/ (visual evidence only)
7. docs/accessibility/README.md and applicable .cursor/rules/
8. Current code: main.wasp.ts, src/site/**, src/main.css, package.json

Before changing anything: run `npm run sdlc:check` and resolve governance failures.

Scope
Implement only RD 010. Establish shared tokens/primitives from the platform
baseline; rebuild `/` to match the mockup hierarchy; keep FR-024 nav
destinations; self-host Inter; remove Fraunces/Figtree; use fixture animals;
no live RG; no newsletter/backend submit; no catalog/CMS/apps.

Method
- TDD: failing AC-* test first, then minimum pass; refactor only while green.
- Preserve prerender + useIsClient for auth/menu.
- wasp compile (not TypeScript-only).
- Do not edit generated Wasp output; do not install @wasp.sh/spec from npm.

Stop and report if architecture is missing, ACs conflict, or hydration cannot
be resolved within the RD.

Evidence
- Check AC boxes only with observed evidence.
- Status at most Built/Validated (never Implemented without human approval).
- Run npm run sdlc:validate only when Validate is requested; during Build use
  focused tests + wasp compile + npm run sdlc:check.
- Record Lighthouse misses honestly.

Boundaries
- Do NOT commit, push, merge, ship, or deploy unless explicitly authorized.
- Do not modify docs/PRD.md or ADRs; report architecture gaps to the human.
- Preserve unrelated work including docs/design/mockups/.
```
