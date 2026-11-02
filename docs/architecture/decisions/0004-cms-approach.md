# ADR 0004 - CMS approach

## Status

Proposed

## Context

Editors need to manage pages, events, success stories, banners (including the
surrender capacity banner), home flyers, the wish list and settings, today all
inside RG's CMS. They are volunteers with no developer.

## Decision

Build a thin, structured CMS inside the app at `/admin`, with typed content
models rather than a generic page builder:

- Typed models: `Page`, `Event`, `Story`, `Banner`, `Promo`, `WishlistItem`,
  `Setting`, `MediaAsset`.
- Rich text uses a restricted editor (headings, bold, italic, lists, links,
  images, tables off) storing structured JSON and server sanitized HTML with an
  allowlist. Raw HTML and scripts are not allowed.
- Draft and published states, preview, and `PageRevision` history (last 20) so
  volunteers can undo mistakes.
- Images go through `MediaAsset`: upload, resize to a set of widths, mandatory
  alt text (or an explicit decorative flag) before publish.
- Required legal text, such as the Florida charitable solicitation disclosure,
  is a locked, named content block that only an Admin can edit.

## Alternatives considered

- Markdown files in Git: unusable for volunteers.
- Headless CMS or WordPress: extra service, cost, login and security surface.
- Free form page builder: more power than needed and harder to keep accessible.

## Consequences

- We own CMS maintenance, but the scope is small and typed.
- Every editor surface must itself meet WCAG 2.2 AA (editor toolbar, dialogs).

## Verification and revisit triggers

Volunteer usability test with Barb before launch; XSS sanitization tests;
accessibility checks on the editor. Revisit if content needs outgrow typed models.
