# Feature RD 009 - Baseline branded site and header navigation

## Status

Planned

Approved by Bernard Williams (Product Owner) on 2026-11-02, as written in this
revision. Open decisions below remain at the stated recommendations unless the
Product Owner changes them; the Implementation Agent stops and reports if one
blocks Build.

## Requirement traceability

- Product requirements: FR-001, FR-024, NFR-SEO-001, NFR-A11Y-001, NFR-PERF-001
  (PRD 0.3.0, approved 2026-11-02).
- PRD coverage check: FR-001 (landing route) and NFR-A11Y-001 cover part of this
  work. Branded public shell, primary navigation and prerendering were not
  covered, so the PRD was revised in the same pass (FR-024, NFR-SEO-001, public
  route rule). See the focused diff summary in the PRD change summary.
- Related decisions: ADR 0001 (stack and prerender policy), design direction
  (`docs/design-direction.md`), Feature RD 003 (identity; one criterion amended
  below).
- Dependencies: approved PRD 0.3.0. Client logo files are not required; a text
  wordmark is used until they arrive (OQ-13).

## Problem

The repository is a starter. Its home page is template placeholder copy behind a
sign-in wall, and it has no brand, no public navigation and no way for a visitor
to reach the sections a rescue site needs. Every later feature (catalog,
applications, content) needs a shared public shell to live in.

## Desired outcome

A publicly reachable, branded, responsive baseline site: a header with the
Pet Rescue by Judy wordmark and primary navigation, a footer, the seven top level
sections reachable and prerendered, and design tokens other features reuse. It
is deployable later as the first visible milestone and measurably accessible and
fast.

## Scope

### In scope

- Personalize the starter (`npm run bootstrap`) so project name, package name and
  Wasp app title identify the PRBJ portal.
- Public home route `/` replacing the template placeholder, with a short
  welcome, primary calls to action and contact details.
- Public placeholder routes for each primary navigation destination (see
  Application behavior). Each has a unique h1, title and description and plain,
  accurate holding text; no invented policy content.
- Header: wordmark link, primary navigation, a Donate link button to
  `/ways-to-give`, and an account control (Sign in or Account).
- Footer: address, phone, email, links to About Us and Contact Us, external
  Volunteer Portal link, copyright line.
- Skip link, landmarks, responsive menu behavior under 48rem.
- Brand design tokens as CSS custom properties from the design direction, applied
  to the shell and to the existing login, signup and profile pages for visual
  coherence only (no behavior change there).
- Self hosted fonts (Fraunces and Figtree, WOFF2 Latin subsets).
- Prerender every public route that can be prerendered (`prerender: true`),
  including `/login` and `/signup`.
- Test harness additions needed to prove this RD: component tests (jsdom and
  Testing Library), Playwright with axe, and a build check for prerendered HTML.
  Approved here as devDependencies; the Implementation Agent verifies
  compatibility with Wasp 0.26 and stops and reports if it conflicts.

### Out of scope

- Animal catalog, search, filters, applications, CMS, events, stories, favorites,
  donation processing, sync, admin, roles.
- Dropdown submenus (the live site has dropdown groups whose contents are not
  captured; later RDs add them).
- Real logo artwork, photography and flyers (OQ-13), Tailwind and shadcn
  adoption (decide when the first complex primitive is needed; see Open
  decisions), dark mode.
- Deployment, staging, edge router, `robots` and `noindex` handling, canonical
  URLs and sitemap (deployment and SEO RDs).
- Any change to authentication behavior, except that the root route is public.

## Existing behavior

Verified by reading the repository on 2026-11-02:

- `main.wasp.ts` declares `/login`, `/signup`, `/` (authRequired) and `/profile`
  (authRequired). Auth method is `usernameAndPassword` with normalized email.
- `src/MainPage.tsx` renders template copy and an account nav (profile, sign out);
  it requires a signed in user.
- `src/main.css` uses a blue template palette and Inter; there is no header,
  footer, skip link or navigation. Login and signup use a centered card layout.
- App title and names are still "Wasp AI Starter" (bootstrap not yet run).
- Tests: Vitest client tests exist for identity, profile image and project
  profile. No component, browser or accessibility tests exist.
- RD 003 AC-IDENTITY-03 states that the root and profile routes require
  authentication. This RD amends it: the root is public; profile stays protected.
  AC-IDENTITY-03 is recorded as superseded for the root route by AC-SITE-01 once
  this RD is Implemented.

## Proposed architecture

### UI and interaction

Shared `SiteLayout` (header, main, footer) used by every public page. Header:

1. Skip link ("Skip to main content") as the first focusable element.
2. Wordmark "Pet Rescue by Judy" (text, Fraunces, brand red) linking to `/`.
3. `nav` labelled "Primary" with, in order: Home, Animals, Adopt / Foster,
   Surrender, Volunteer, Ways to Give, Successes.
4. Donate link styled as the primary button, and the account control.

Below 48rem the navigation is collapsed behind a "Menu" button after hydration;
before hydration, and for crawlers and no-JS users, all links are present in the
HTML in normal flow. Current route gets `aria-current="page"`.

### Application behavior

Routes (all public, all `prerender: true`):

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Welcome, three calls to action (See animals, Adopt or foster, Ways to give), contact block |
| `/animals` | Animals | Holding page; catalog arrives in a later RD |
| `/adopt-foster` | Adopt / Foster | Holding page |
| `/surrender` | Surrender | Holding page |
| `/volunteer` | Volunteer | Holding page |
| `/ways-to-give` | Ways to Give | Holding page |
| `/successes` | Successes | Holding page |
| `/about` | About Us | Footer link; holding page |
| `/contact` | Contact Us | Address, phone and email; no form yet |
| `/login`, `/signup` | Existing | Prerendered; behavior unchanged |

`/profile` remains `authRequired` and is not prerendered.

Holding pages say plainly that the section is coming soon and show contact
details; they never state adoption policy, fees or capacity.

Prerender rules (Wasp docs, 0.26 line): static routes use `prerender: true`;
components must render identically on server and client. The account control
uses the `useIsClient` pattern: it renders "Sign in" during prerender and first
hydration render, then swaps to "Account" and Sign out for an authenticated
user. No `window`, `localStorage`, `Date.now()` or locale dependent formatting
in render paths. Responsive collapse also applies only after hydration.

Document head: each page needs its own `<title>` and meta description in the
prerendered HTML. The Wasp prerendering docs do not describe head handling, so
the Implementation Agent determines the supported mechanism from the Wasp 0.26
documentation and source. If no supported mechanism exists, it stops and reports
(an architecture question), and does not hand roll a workaround.

### Data model and migration

None.

### Authorization and security

- No new operations, endpoints or secrets. `/` and the new routes are public.
- External links (Volunteer Portal, any social) use `rel="noopener noreferrer"`
  and identify themselves as external to assistive technology.
- Auth redirect after login stays `/` (now the public home); a signed in user
  sees the Account control.
- No third party requests (fonts self hosted, no analytics, no embeds).

### Tenant isolation

Not applicable; single tenant.

### External services

None.

### Reliability, recovery, and observability

Static prerendered HTML makes these pages independent of the database and API at
read time. No logging changes. Rollback is a revert (below).

## Accessibility

- Controls and interaction inventory: skip link; wordmark link; primary nav links;
  Menu toggle button (small screens); Donate link; account control (link or
  button); footer links; external link; home calls to action.
- Keyboard and focus behavior: skip link visible on focus and moves focus to
  `main`; nav and toggle operable by Tab, Enter and Space; Escape closes the open
  menu and returns focus to the toggle; focus order matches visual order; visible
  focus ring on every control using the focus token, not obscured by sticky or
  fixed elements.
- Contrast: tokens and pairs per design direction (white on `#AE0303` 7.46:1,
  ink on white 19.44:1, link red on white 7.46:1, focus ring 6.57:1); verified by
  a unit test on the token file and by axe.
- Reflow: no horizontal scroll at 320 px; content usable at 200 percent text
  size; touch targets at least 44 px.
- Alternative representations: wordmark is text, so no image alt dependency;
  decorative icons are `aria-hidden`; no information conveyed by color alone;
  current page indicated by `aria-current` and a non-color cue.

## Acceptance criteria

- [ ] AC-SITE-01: An unauthenticated visitor can open `/` and receives the home page, not a redirect to `/login`; `/profile` still redirects unauthenticated visitors to `/login`.
- [ ] AC-SITE-02: Every public page renders a header containing the wordmark linking to `/` and a navigation landmark named "Primary" with links, in order, Home, Animals, Adopt / Foster, Surrender, Volunteer, Ways to Give, Successes, each with the href listed in the route table.
- [ ] AC-SITE-03: Each route in the route table responds successfully, shows exactly one h1 that is unique across routes, and sets a unique document title and meta description.
- [ ] AC-SITE-04: The link for the current route has `aria-current="page"` and a visible non-color indicator; no other nav link does.
- [ ] AC-SITE-05: At widths below 48rem, after hydration, the nav is collapsed behind a button named "Menu" with `aria-expanded` and `aria-controls`; Enter and Space toggle it; Escape closes it and returns focus to the button; at 48rem and above all links are visible with no button.
- [ ] AC-SITE-06: Every page has a skip link as the first focusable element that moves focus to the single `main` landmark.
- [ ] AC-SITE-07: The footer shows the rescue address, phone and email, links to About Us and Contact Us, and an external Volunteer Portal link with `rel="noopener noreferrer"` whose accessible name identifies it as external.
- [ ] AC-SITE-08: In the prerendered HTML the account control is "Sign in"; after hydration an authenticated user sees "Account" linking to `/profile` and a Sign out control, with no hydration warnings.
- [ ] AC-SITE-09: Brand tokens exist once, as CSS custom properties with the names and values in the design direction, and every foreground and background pair listed in the design direction meets its stated minimum contrast ratio in a unit test.
- [ ] AC-SITE-10: Fonts load from the application's own origin; a browser test records zero requests to other origins on every public route.
- [ ] AC-SITE-11: `/login`, `/signup` and `/profile` keep their existing behavior and tests, and use brand tokens.
- [ ] AC-SITE-12: Project name, package name, profile displayName and Wasp app title identify the Pet Rescue by Judy portal and no starter placeholder text remains on public pages.
- [ ] AC-PRERENDER-01: Every public route in the route table, including `/login` and `/signup`, is declared with prerendering, and a production build emits a static HTML file for each.
- [ ] AC-PRERENDER-02: Without running JavaScript, the prerendered HTML of every public route contains the header navigation links, the page h1, the title, the meta description and the footer.
- [ ] AC-PRERENDER-03: Loading each prerendered route in a browser produces no React hydration warning or console error.
- [ ] AC-PRERENDER-04: A route with `authRequired` is never marked for prerendering (the build fails compile otherwise).
- [ ] AC-A11Y-01: Every public route state has no serious or critical axe violations at 320 px and at desktop width.
- [ ] AC-A11Y-02: The primary task (reach each navigation destination) is operable by keyboard only, with visible focus and correct focus return after closing the menu.
- [ ] AC-A11Y-03: Pages reflow at 320 px without horizontal scrolling and remain usable at 200 percent text zoom.
- [ ] AC-PERF-01: On the prerendered home route, a Lighthouse run with the mobile profile reports performance of at least 90 and records LCP and CLS; any figure below target is reported, not hidden.

## Test plan

### Unit and contract

- `AC-SITE-02`, `-03`, `-04`: tests over a single navigation and route metadata
  module (labels, order, hrefs, unique titles and descriptions).
- `AC-SITE-09`: contrast unit test over the token pairs.
- `AC-SITE-12`: assert project profile and package values (extends the existing
  project profile tests).

### Integration

- `AC-SITE-05`, `-06`, `-07`, `-08`: component tests with Testing Library and
  jsdom for menu toggling, Escape and focus return, skip link target, footer
  links and account control states.
- `AC-PRERENDER-01`, `-02`, `-04`: a build check runs `wasp build`, lists
  generated HTML files, and asserts each route's file contains the expected
  links, h1, title and description. The command and output path are recorded as
  observed evidence.

### Playwright

- `AC-SITE-01`, `-10`, `-11`, `-PRERENDER-03`, `-A11Y-01..03`, `-PERF-01`:
  browser specs for each public route at 320 px and 1280 px, axe scan, keyboard
  walk, network origin assertion, console error assertion and zoom reflow. These
  specs are written at Build and may run at Validate or Ship.

## Rollout and rollback

- Rollout: local verification only. Nothing is deployed by this RD
  (`deploymentProvider` is unconfigured until the Railway RD).
- Rollback: revert the commit(s). No data, migration, secret or external state
  is created. Bootstrap changes are in tracked files and revert with the commit.

## Open decisions

1. Tailwind and shadcn: recommend deferring; this RD uses CSS custom properties
   and plain CSS (no new runtime dependency). Adopt the shadcn pack in the RD
   for the first complex primitive (filter bar or dialog). Product Owner to
   confirm.
2. Copyright holder and owner values for bootstrap (`PRBJ` or `DEAP`): Product
   Owner decides.
3. Public paths (`/adopt-foster`, `/ways-to-give`, `/successes`): confirm the
   slugs, since they become permanent URLs and feed the redirect map.
4. Head management mechanism under Wasp prerendering: the Implementation Agent
   reports what Wasp 0.26 supports (see Application behavior). A negative
   answer returns to Architecture.
5. Unknown routes: whether Wasp can serve a branded 404 inside the shell. Report
   at Build; an explicit AC is added if supported.
6. Logo and fonts: wordmark and Fraunces and Figtree are provisional until the
   client confirms brand assets (OQ-13).
7. Dropdown submenus: deferred until the live site's submenu contents are
   inventoried (OQ-14).

## Verification

Not yet implemented. Do not check acceptance criteria without observed evidence.
Required at Validate: `npm run sdlc:validate`, the AC-mapped unit and component
tests, the build check output, Playwright and axe results, and the Lighthouse
record, with skipped checks named.

## Manual smoke

To be written after Validate: as a signed out visitor on a phone width, open `/`,
use the menu to reach each destination, tab through the skip link and menu, sign
in and confirm the Account control, then confirm `/profile` still requires
sign in. Edge case: open a deep link directly with JavaScript disabled and
confirm header links and heading are present.
