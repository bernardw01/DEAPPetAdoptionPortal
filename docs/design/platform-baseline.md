# Platform design baseline: Pet Rescue by Judy public site

## Status

**Proposed.** Awaiting Product Owner approval. Until approved, this document
and Feature RD 010 are architecture proposals. They are not yet the binding
implementation contract.

**Visual reference (design evidence):**
`docs/design/mockups/prbj-modern-home/` (`index.html`, `styles.css`,
`mockup.js`, `assets/`, `README.md`). Approved by the Product Owner as design
input for the platform baseline on 2026-11-02 (assignment to Architecture
Agent). A mockup is not specification truth by itself; this baseline document
and approved Feature RDs are the implementation contract.

**Approval block**

- Product Owner:
- Decision:
- Date:

## Authority and relationship to other artifacts

| Artifact | Role |
|---|---|
| Approved `docs/PRD.md` | Product requirements (what must exist). |
| This baseline + approved Feature RDs | Visual and interaction contract for public UI. |
| `docs/design/mockups/prbj-modern-home/` | Design evidence; exact spacing and composition source. |
| `docs/design-direction.md` | Earlier provisional direction (Fraunces/Figtree and older token names). **Superseded for fonts and color token names by this baseline once approved.** |
| Feature RD 009 | Built shell, routes, prerender, and a11y harness. **Visual tokens and fonts in RD 009 are superseded by this baseline and RD 010 once approved.** Structural gains (public `/`, prerender, test harness) remain. |
| ADR 0008 | Durable decision to use one public-platform design foundation. |

Future Feature RDs that change public UI must cite this baseline. A material
departure (different typefaces, a competing color system, a different content
max width, or a homepage hierarchy that demotes animal discovery) requires an
explicit Product Owner–approved exception recorded in that Feature RD.

The administrative interface may use a denser layout but must reuse the same
color, typography, focus, control, spacing, and accessibility foundations
unless a later approved Feature RD documents an exception.

## Exact typography

Rendered mockup stacks (do not substitute Fraunces, Figtree, Roboto, or Arial):

- **Display / editorial headings (h1, h2, and card titles that use the serif):**
  `Georgia, "Times New Roman", serif`
- **Body, navigation, labels, buttons, and controls:**
  `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Inter must be self-hosted as WOFF2 (necessary weights only; Latin subset where
appropriate; `font-display: swap`; preload only when justified). No Google
Fonts or other runtime font service. Ship a license file with the font files.
Georgia uses the system/fallback stack above (no third-party download).

Decorative mockup scribbles use `"Bradley Hand", cursive` as non-essential
ornament; they are homepage-specific and must remain `aria-hidden` if shipped.

## Color tokens

Centralize as CSS custom properties. Do not scatter unexplained literals.

| Token | Value | Use |
|---|---|---|
| `--brand` | `#AE0303` | Primary actions, links on light, badges |
| `--brand-strong` | `#8F0202` | Hover / pressed |
| `--brand-dark` | `#430909` | Announcement bar, dark involvement band |
| `--pink` | `#FDEBEC` | Soft tint, selected chips, event band |
| `--cream` | `#FAF7F5` | Soft section backgrounds |
| `--ink` | `#161110` | Body text |
| `--muted` | `#655F5D` | Secondary text |
| `--line` | `#E6DED9` | Borders |
| `--gold` | `#F0C96A` | Accent badge backgrounds (with dark text) |
| `--white` | `#FFFFFF` | Page and card surfaces |
| `--focus` | `#0B5FA5` | Focus ring (3px, 3px offset in the mockup) |
| `--shadow` | `0 16px 50px rgba(60, 18, 15, 0.12)` | Soft elevation |

Implementation may keep RD 009's `--color-*` naming only if values and semantics
map 1:1 to this table; prefer the mockup names above for new work.

## Layout system

Extracted from the mockup CSS (source of exact proportions):

- **Content max width:** 1180px (`.wrap`)
- **Desktop gutter:** 20px per side → `width: min(1180px, calc(100% - 40px))`
- **Mobile gutter (≤740px):** 14px per side → `width: min(100% - 28px, 1180px)`
- **Breakpoints observed:** 980px (nav collapse), 740px (single-column hero and
  cards), 430px (further stack)
- **Section padding:** ~100px block on large screens; ~72px at ≤740px
- **Radii:** pill actions `999px`; cards ~18px; hero arch ~245px / 38px; controls
  ~8–10px; event card ~24px
- **Shadows:** `--shadow` and lighter card shadow `0 8px 30px rgba(50,20,10,.07)`
- **Motion:** ~150–250ms transitions; honor `prefers-reduced-motion`
- **Sticky public header** with translucent white and light border
- **Sitewide announcement bar** on `--brand-dark`

## Responsive behavior (contract)

- Desktop primary navigation above 980px; named **Menu** control at and below
  980px with `aria-expanded` and `aria-controls`
- Collapsible mobile nav below the header (not a separate page)
- One-column homepage hero at ≤740px
- Trust strip: 4 → 2 → 1 columns across breakpoints
- Animal and involvement cards: 3 columns wide → 1 column on phones
- Adoption process: 2 columns wide → 1 column below 980px
- Horizontally scrollable quick-filter chips when needed
- Reflow through 320px without horizontal page scrolling
- Interactive targets at least 44×44px (where the mockup uses 42px, a11y wins:
  bump to 44px)
- No hover-only behavior; no sticky UI obscuring focused content

## Shared component foundation

Universal public primitives (reuse across catalog, detail, applications, giving,
events, stories, contact, and auth pages where appropriate):

- Design tokens and typography utilities
- Content container (`.wrap`)
- Announcement bar
- Public site header (logo, nav, Donate, account control)
- Desktop and mobile navigation
- Primary, secondary/outline, small, and text actions
- Eyebrow label and section heading
- Radio-pill group, select field, filter chip
- Pet search entry form (homepage entry; catalog owns deep filters later)
- Animal card, animal badge, favorite control (local UI state until FR-016)
- Trust / credibility strip
- Adoption-process step list
- Involvement card
- Event promotion card
- Newsletter / updates form presentation (non-submitting until a later RD)
- Public footer
- Loading, empty, error, unavailable states
- Focus, disabled, hover, pressed, selected, validation states

Homepage-specific composition (not required on every public page):

- Search-first hero with arched featured-animal image and pet-note callout
- Decorative scribbles
- Full homepage section sequence below

Prefer semantic HTML and CSS custom properties. Inspect the repo before adding
a component library; do not add Tailwind/shadcn solely to recreate this mockup
(ADR 0001 still defers that pack until a complex primitive needs it).

## Homepage content hierarchy

Preserve this order:

1. Skip link  
2. Event / urgent announcement bar  
3. Public header and navigation  
4. Search-first adoption hero (primary task: find a pet)  
5. Rescue credibility strip  
6. Featured available animals and quick filters  
7. Adoption-process explanation  
8. Foster, volunteer, and giving pathways  
9. Upcoming event  
10. Updates / newsletter concept  
11. Full organizational footer  

Donation is prominent but secondary to animal discovery. Do not revert to the
legacy dense sidebar, table listing, or competing promo-grid hierarchy.

## Navigation vs product routes

FR-024 requires sitewide primary destinations: Home, Animals, Adopt / Foster,
Surrender, Volunteer, Ways to Give, Successes. The mockup shows marketing
in-page anchors (Find a pet, How adoption works, Get involved, Events, About).
**Product authority is the PRD.** Implementation must keep FR-024 destinations
as the primary nav; homepage sections map onto those routes. See Feature RD 010
open decision for Product Owner confirmation of label wording.

## Brand assets

| Asset | Provenance | Production rule |
|---|---|---|
| `assets/prbj-logo.jpg` | Existing public PRBJ logo (mockup) | Provisional. Replace with client vector or high-res master before production. Do not redraw or regenerate. Preserve proportions. |
| `suki.jpg`, `silas.png`, `silas-2.jpg` | Public PRBJ/RescueGroups animal photos | Prototype / fixture only. Production animals come from the approved RG mirror or CMS. Document usage rights. Meaningful alt text. Never assign a real animal’s image to a different identity. |

## Accessibility

WCAG 2.2 AA floor per `docs/accessibility/README.md` and NFR-A11Y-001. Feature
RDs inventory controls and define axe, keyboard, focus, contrast, reflow, zoom,
reduced-motion, and announcement criteria. Automated checks alone do not prove
accessibility.

## Performance

NFR-PERF-001: LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms (p75 after launch). Explicit
image dimensions, `srcset`, prioritized LCP/hero image, lazy load below the
fold, no autoplay video, minimal JS for simple interaction, self-hosted fonts,
no third-party font CDN.

## How Implementation Agents use this document

1. Confirm Product Owner approval of this baseline and the Feature RD.  
2. Treat the mockup path as visual evidence; treat ACs as testable contracts.  
3. Extract reusable tokens and components; do not paste the homepage as one
   monolithic untestable blob.  
4. Record any small a11y or technical adjustment and its reason.  
5. Do not invent product policy, fees, or capacity content.
