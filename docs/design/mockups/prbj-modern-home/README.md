# Pet Rescue by Judy modern homepage mockup

## Status and boundary

Static Design Agent exploration only. This mockup is not application code,
specification truth, an approved Feature RD, or a commitment that the depicted
interactions and content will ship.

Open `index.html` through a local HTTP server for review. The mockup includes a
responsive desktop/mobile layout, a working mobile menu, quick-filter selection,
and favorite-button states. Forms do not submit or store information.

## Direction

The concept makes animals and adoption the primary experience while retaining
Pet Rescue by Judy's recognizable red, black, and white identity. The design is
warm, local, photo-forward, and deliberately less institutional than a generic
animal-directory site.

The information hierarchy was inspired by useful contemporary adoption-site
patterns observed on Adopt-a-Pet on 2026-11-02:

- Begin with the visitor's main task: finding a pet.
- Use a spacious editorial hero rather than a dense navigation-and-promo grid.
- Make filters simple at entry, with deeper filtering available in the catalog.
- Establish trust and provide adoption guidance before secondary content.

The mockup does not copy Adopt-a-Pet's brand, colors, wording, or component
styling.

## PRBJ elements retained

- Existing Pet Rescue by Judy logo.
- Deep rescue red as the primary action color.
- Current public animal photography from PRBJ's RescueGroups-hosted profiles.
- Sanford and Central Florida identity.
- No-kill, thoughtful-matching, community-supported positioning.
- Existing adoption, foster, volunteer, event, donation, and contact pathways.

## Homepage states shown

- Sitewide event announcement.
- Desktop and mobile navigation.
- Search-first adoption hero.
- Quick animal-filter selection.
- Animal cards with badges, traits, and favorite toggles.
- Four-step adoption explanation.
- Foster, volunteer, and donation paths.
- Upcoming event promotion.
- Newsletter concept and full contact footer.

## Accessibility intentions

- Semantic landmarks and headings.
- Skip link and visible keyboard focus.
- Real radio buttons, selects, buttons, and links.
- Named favorite toggles with `aria-pressed`.
- Minimum 44px interactive targets.
- High-contrast PRBJ red, text, and focus colors.
- Responsive reflow through 320px.
- Reduced-motion support.
- No meaning conveyed by color alone.

This static exploration still requires keyboard, screen-reader, contrast, zoom,
and reflow verification during implementation.

## Asset provenance

- `prbj-logo.jpg`: existing public Pet Rescue by Judy logo from its public X
  profile. Replace with the client-supplied vector or high-resolution master
  before implementation.
- `suki.jpg`, `silas.png`, and `silas-2.jpg`: current public PRBJ animal imagery
  hosted by RescueGroups. Use remains subject to PRBJ/RescueGroups rights and
  the production integration decision.

## Decisions for client review

1. Is the tone warm and community-oriented enough for Judy's organization?
2. Should the homepage prioritize animal search, urgent needs, or current events?
3. Is the deep red balance appropriate, or should the brand feel brighter?
4. Which current animals and stories should appear in an approved presentation?
5. Does Judy prefer "Find my match" or the more direct "View available pets"?
6. Should applications require an account, or begin as a guest workflow?
