# Design Direction: Modern Re-skin of the PRBJ Brand

Status: Proposed. This is architecture input for the optional Design Agent and
for Feature RDs. It is not a mockup and not a final decision on data or
behavior. Mockups, if any, go under `docs/design/mockups/<slug>/`.

Brand cues were observed from computed styles on the live site on 2026-11-02
and have not been checked against rendered screenshots or logo files. Treat
hex values as provisional until the client supplies brand assets.

## 1. Principles

1. Warm and community driven, photo first. Animals are the hero.
2. Keep the red as the anchor, use it with restraint so it signals action.
3. Phone first, thumb reachable, one clear primary action per screen.
4. Accessible by construction: tokens that pass contrast, visible focus, no
   color only meaning.
5. Fast: few fonts, no decorative video, lean imagery.

## 2. Color tokens and contrast

Ratios computed with the WCAG relative luminance formula on 2026-11-02.
AA needs 4.5:1 for normal text, 3:1 for large text and UI components.

| Token | Hex | Use |
|---|---|---|
| `--color-brand` | `#AE0303` | Primary buttons, links on light, header bar |
| `--color-brand-accent` | `#B50005` | Headings, accents, icons |
| `--color-brand-strong` | `#8F0202` | Hover and pressed |
| `--color-ink` | `#0D0D0D` | Body text |
| `--color-ink-muted` | `#595959` | Secondary text |
| `--color-bg` | `#FFFFFF` | Page |
| `--color-bg-soft` | `#FAF7F5` | Section bands (warm off white) |
| `--color-bg-tint` | `#FDEBEC` | Pale pink tint, callouts, selected states |
| `--color-bg-muted` | `#F1F1F1` | Existing site grey, table stripes |
| `--color-focus` | `#0B5FA5` | Focus ring (2 px with 2 px offset) |
| `--color-success-fg` / `bg` | `#0F5132` / `#D9F2E3` | Success states |
| `--color-warning-fg` / `bg` | `#92400E` / `#FEF3C7` | Warnings, capacity banner |

| Pair | Ratio | Result |
|---|---|---|
| White on `#AE0303` (button text) | 7.46 | AAA |
| White on `#B50005` | 7.08 | AAA |
| White on `#8F0202` (hover) | 9.64 | AAA |
| `#AE0303` on white (links) | 7.46 | AAA |
| `#AE0303` on `#FDEBEC` | 6.49 | AA, AAA large |
| `#B50005` on `#FDEBEC` | 6.16 | AA |
| `#0D0D0D` on white | 19.44 | AAA |
| `#0D0D0D` on `#FAF7F5` | 18.22 | AAA |
| `#0D0D0D` on `#FDEBEC` | 16.91 | AAA |
| `#0D0D0D` on `#F1F1F1` | 17.21 | AAA |
| `#595959` on white | 7.00 | AAA |
| `#595959` on `#FDEBEC` | 6.09 | AA |
| `#0B5FA5` focus ring on white | 6.57 | passes 3:1 non-text |
| `#0F5132` on `#D9F2E3` | 7.92 | AAA |
| `#92400E` on `#FEF3C7` | 6.37 | AA |

Rules: red is never the only signal (pair with icon or label); do not place
brand red text on `#F1F1F1` below 14 px semibold without rechecking (6.61 passes,
but keep margin); light pink on white fails (do not use `#E9B7B9` for text, 1.76).
Dark mode is out of scope for launch; tokens are structured so it can be added.

## 3. Typography

- Display: **Fraunces** (variable, OFL), weights 600 and 700, used for h1 and h2
  to add warmth that the current Arial lacks.
- Body and UI: **Figtree** (variable, OFL), weights 400, 500, 700.
- Self host WOFF2 subsets (Latin), `font-display: swap`, preload the two used
  files, metric adjusted system fallbacks to prevent layout shift. No third party
  font requests. Both choices are provisional pending a brand check with Judy.
- Scale (rem, 1.25 ratio, fluid with `clamp`): 0.875, 1, 1.25, 1.5625, 1.953,
  2.441. Body 1rem (16 px) minimum, line height 1.5; headings 1.2.
- Line length 60 to 75 characters. Text must resize to 200 percent and reflow at
  320 px.

## 4. Spacing, shape and elevation

- Spacing: 4 px base; tokens 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Layout: 16 px page gutter on phones, 24 px on tablets, max content width
  1200 px; 4 / 8 / 12 column grid.
- Radius: 8 px controls, 12 px cards, 999 px pills and badges.
- Elevation: one soft shadow for cards and sticky bars; borders (1 px
  `#E5E0DC`) preferred over heavy shadows.
- Touch targets: at least 44 by 44 px (exceeds the WCAG 2.2 minimum of 24).
- Motion: 150 to 250 ms, respects `prefers-reduced-motion`, no parallax.

## 5. Component list

| Component | Behavior and accessibility notes |
|---|---|
| Site header | Logo left, primary nav, Donate and Apply buttons. Phone: logo, menu button (named, `aria-expanded`), full screen nav drawer with focus trap. Skip link first. |
| Primary nav | Home, Animals, Adopt and Foster, Surrender, Volunteer, Ways to Give, Successes. Dropdowns open on click and Enter, not hover only; Escape closes and returns focus. |
| Capacity and announcement banner | Top of page, dismissible per session where not critical, `role="status"` on change, warning tokens plus an icon. |
| Animal card | Photo 4:3 (with explicit dimensions), name, breed, sex and age, badges (FH, Training Camp, Special needs, Needs foster, Pending), favorite heart. One link target on the name (card is not a nested link maze). Heart is a separate named toggle button. |
| Filter bar | Desktop: sticky horizontal chips and a side drawer for more. Phone: one Filters button opening a bottom sheet with grouped controls, an Apply button showing the result count, and a Clear action; active filters shown as removable chips. Real form controls, fieldsets and legends. |
| Results header | Count in a live region, sort select, view toggle (grid, list). |
| Gallery | Large image with thumbnails; swipe, arrow buttons and keyboard; lightbox with focus trap, Escape, captions from alt text; video poster that loads on interaction. |
| Animal detail facts | Definition list in two columns on tablet, one on phone; unknowns omitted. |
| Sticky mobile action bar | Apply and Donate at the bottom on phones for animal pages only. Does not cover focused content (WCAG 2.4.11): use scroll padding and hide while the keyboard is open. |
| Application stepper | One form per step, labeled progress ("Step 2 of 6"), summary review step, error summary at top that receives focus, inline errors tied with `aria-describedby`, autosave status message, Back and Continue. Not a carousel. |
| Event card | Date block (text, not an image), title, time, place, map link, optional image. List and calendar views; calendar has a list alternative. |
| Story card | Photo, animal name, excerpt, A to Z index as links. |
| Donate block | Compact set of giving options with impact tiers ($10, $25, $50, $100+) as text, buttons that open PayPal or Venmo in the same tab with an "opens external site" cue. |
| Wish list | Plain lists with outbound link buttons. |
| Flyer grid | Images with meaningful alt text, optional link, responsive 1 to 3 columns. |
| Footer | Contact, address, social, Volunteer Portal link, nonprofit disclosure, Powered by RescueGroups attribution if used. |
| Admin shell | Dense but accessible: semantic tables, labeled filters, bulk actions by keyboard, clear role specific navigation. |
| Toasts and dialogs | Status via live regions; dialogs trap focus and restore it. |

## 6. Mobile behavior

- Single column, large photos, generous whitespace; filters in a bottom sheet;
  sticky Apply and Donate on animal pages.
- Tap targets 44 px; no hover only interactions; tooltips replaced by tap to reveal.
- Images use `srcset`; the LCP image on the animal page is prioritized and sized.
- Forms use correct `inputmode`, `autocomplete` and input types (tel, email,
  postal code), labels above fields, no placeholder only labels.
- Offline and slow network: skeleton states, no layout jumps, clear retry.

## 7. Content and tone

Plain, warm, specific. Show the adoption process clearly (apply, review,
meet, adopt) with the rescue's actual rules (no first come first served,
Central Florida only, 21 or older, lifetime return policy). Surrender page tone
stays compassionate when at capacity and lists resources.

## 8. What we still need from the client

- Logo files: original vector or high resolution PNG, plus the 2022 anniversary
  and "I am a Forever Dog" graphics, and usage rules.
- Confirmation of brand colors and fonts, and any brand guide.
- Photography: hero images, team and volunteer photos with usage consent, event
  photos; rights to use images currently hosted on RG.
- Current flyers and promo images in original formats (not screenshots).
- Event calendar PDF source and a list of recurring events.
- Wish list contents (the needs image is not readable as text).
- Text for the Florida solicitation disclosure and the exact wording of policies.
- Social account handles and permission to link or embed.
- A named contact who approves visual decisions.
