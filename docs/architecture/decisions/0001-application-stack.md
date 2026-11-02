# ADR 0001 - Application stack

## Status

Proposed (records an inherited decision; needs Product Owner acknowledgement of
the rendering consequence).

## Context

The repository is the DEAP Wasp template: Wasp ^0.26, TypeScript, React,
PostgreSQL, Prisma, an SDLC toolchain and agent rules that assume Wasp. The
PRBJ product needs SEO friendly dynamic pages (animals, events, stories).
Wasp renders the client in the browser; build-time `prerender: true` exists
for static routes; per request SSR is not something to depend on.

## Decision

Use the template stack unchanged: Wasp, React, TypeScript, Prisma, PostgreSQL,
Wasp jobs, Wasp auth. Add Tailwind and shadcn through the shadcn capability
pack (adoption deferred until the first complex primitive needs it; Feature RD
009 uses CSS custom properties). Product Owner direction: turn on prerendering
wherever possible, so every public route that can be prerendered is, using
`prerender: true` for static routes and enumerated path arrays for dynamic
routes. Close the remaining gap for current, data-driven pages with an SEO shell
(server injected metadata, JSON-LD and a compact content block) behind an edge
router, scoped by spike S1. Do not install the multitenancy pack (single
tenant).

## Alternatives considered

- Next.js, Remix or Astro SSR: better native SEO, rejected because it discards
  the standard stack, tooling and agent rules, and costs more to maintain.
- WordPress with RG plugin: rejected for PII handling and patch burden.
- Static site generator plus functions: rejected, splits auth, forms and admin.

## Consequences

- Initial HTML for dynamic pages is produced by our own shell handler, a small
  custom component to build, test and maintain.
- Bundle size must be actively budgeted because this is an SPA.
- Wasp upgrades are tracked deliberately; the SDLC rule pins the documented
  version.

## Verification and revisit triggers

Spike S1 proves server delivered HTML, structured data and Core Web Vitals on a
real animal page. Revisit if S1 fails, if Wasp ships per request SSR that
removes the need for the shell, or if Search Console shows indexing failures
after launch.
