# ADR 0008 — Single public-platform design foundation

## Status

Proposed (awaits Product Owner acknowledgement with Feature RD 010 and
`docs/design/platform-baseline.md`).

## Context

Pet Rescue by Judy needs one coherent public visual language across the
homepage, animal catalog and detail, adoption guidance, applications, volunteer
and giving pages, events, stories, contact, and auth surfaces. Feature RD 009
shipped a functional public shell with provisional Fraunces/Figtree fonts and
design-direction tokens. The Product Owner then approved the static mockup
`docs/design/mockups/prbj-modern-home/` as the design direction for the platform.
Without a single foundation decision, later Feature RDs risk inventing
feature-specific themes that fragment the brand and inflate CSS and a11y debt.

## Decision

Use **one centralized PRBJ public-platform design foundation**, documented in
`docs/design/platform-baseline.md`, derived from the approved homepage mockup:

- Exact Georgia (display) and Inter (UI/body) stacks; Inter self-hosted.
- Exact color, layout, radius, shadow, and breakpoint tokens from the mockup.
- Shared public components and states listed in the baseline.
- Admin UI may be denser but reuses the same foundations unless an approved
  Feature RD records an exception.
- Material departures require Product Owner–approved exceptions in the Feature
  RD that introduces them.

Feature RD 010 implements the foundation and the public homepage. Later RDs
compose the shared primitives rather than shipping alternate design systems.

## Scope

In scope: public UI tokens, typography, layout primitives, shared components,
and homepage composition. Out of scope: inventing a second brand for admin;
adopting Tailwind/shadcn solely for this foundation (still deferred per ADR
0001 until a complex primitive needs it).

## Alternatives considered

- **Keep RD 009 Fraunces/Figtree + design-direction tokens:** Rejected for the
  public platform once the Product Owner selected the mockup’s Georgia/Inter
  and token set as the visual baseline.
- **Per-feature visual systems:** Rejected; fragments brand and accessibility
  evidence.
- **Adopt Tailwind/shadcn immediately:** Deferred; the mockup is achievable with
  semantic HTML and CSS custom properties. Revisit when a complex primitive
  (filter sheet, dialog) needs the pack.

## Consequences

- Implementation Agents must read the platform baseline before public UI work.
- RD 009 visual choices are superseded for fonts and tokens when RD 010 is
  approved and Built; prerender, public routing, and the test harness remain.
- Client logo and production photography remain external dependencies (OQ-13).
- Homepage Lighthouse budgets remain ambitious given SPA weight (see RD 009
  PERF miss); the foundation must still target NFR-PERF-001.

## Accessibility implications

Shared focus, contrast, touch-target, and landmark patterns reduce per-feature
a11y drift. Every UI Feature RD still inventories controls and states.

## Performance implications

Self-hosted Inter, explicit image dimensions, and restrained motion are part of
the foundation. Bundle size remains a Wasp SPA concern (ADR 0001).

## Exception process

1. Feature RD names the baseline rule it cannot meet.  
2. States the smallest alternative and a11y/perf impact.  
3. Product Owner approves before implementation.  
4. Baseline document is updated if the exception becomes the new rule.

## Relationship to mockup and Feature RDs

- Design evidence: `docs/design/mockups/prbj-modern-home/`  
- Contract: `docs/design/platform-baseline.md` + Feature RD 010  
- Prior shell: Feature RD 009 (Built)

## Verification and revisit triggers

Revisit if the client supplies a different brand guide, if Inter licensing
blocks self-hosting, if Search Console or Lighthouse shows systemic CLS/LCP
failures after RD 010, or if admin needs a documented denser exception.
