# Implementation Plan

## Rules

- Only approved Feature RDs enter the build sequence.
- Each slice names dependencies, acceptance criteria, and verification evidence.
- Planned work is never represented as completed work.

## Phase 0 — Repository foundation

**Status:** Implemented in v0.2.0

**Inputs:** FR-001 and Feature RD 001.

**Outcome:** Personalize the generated repository and verify the starter app.

**Verification:** Template structure, bootstrap smoke, client tests, and Wasp
compile passed locally and in GitHub Actions.

## Phase 1 — Versioned template releases

**Status:** Implemented in v0.3.0

**Inputs:** FR-001 and Feature RD 002.

**Outcome:** Version metadata, changelog, release notes, and immutable GitHub
tags remain synchronized and verifiable.

**Verification:** Version consistency, forward-only dry-run bump, changelog
extraction, full repository validation, and tag-triggered release workflow.

## Phase 2 — Identity and profile foundation

**Status:** Implemented in v0.4.0

**Inputs:** FR-002 through FR-004 and Feature RD 003.

**Outcome:** Generated applications start with PostgreSQL, account access,
email-as-username enforcement, and self-service profiles with durable avatars.

**Verification:** Identity and image-validation tests, template checks,
bootstrap smoke, Wasp client tests, and Wasp compilation.

## Phase 3 — Opinionated SDLC governance

**Status:** Implemented in v0.5.0

**Inputs:** FR-001 and Feature RD 004.

**Outcome:** The DEAP three-agent methodology is documented as a canonical,
subdivided handbook and enforced through agent entry points, pull-request
prompts, and an automated conformance check.

**Verification:** SDLC conformance, template structure, bootstrap smoke, Wasp
client tests, and Wasp compilation.

## Phase 4 — DEAP AI SDLC Playbook visual model

**Status:** Implemented in v0.5.1

**Inputs:** FR-001 and Feature RD 005.

**Outcome:** The reusable methodology is consistently named the DEAP AI SDLC
Playbook and communicates cross-functional roles, gates, and evidence flow with
Mermaid diagrams backed by authoritative prose and tables.

**Verification:** SDLC conformance, template structure, Markdown review,
bootstrap smoke, Wasp client tests, and Wasp compilation.

## Phase 5 — Practice task tracker getting-started guide

**Status:** Implemented in v0.5.2

**Inputs:** FR-001 and Feature RD 006.

**Outcome:** New users can create an independent practice repository and follow
a bounded task-tracker exercise through PostgreSQL setup, architecture approval,
AC-mapped implementation, validation, and manual evidence.

**Verification:** Command and path review, SDLC conformance, template structure,
bootstrap smoke, Wasp client tests, and Wasp compilation.

## Phase 6 — Engineering PRD gate

**Status:** Implemented in v0.6.0

**Inputs:** FR-001 and Feature RD 007.

**Outcome:** Every generated application defines and explicitly approves a
complete Engineering PRD before domain Feature RDs advance, preserving stable
product intent, cross-cutting constraints, and requirement traceability.

**Verification:** PRD structure enforcement, SDLC conformance, template
structure, bootstrap smoke, Wasp client tests, and Wasp compilation.

## Phase 7 — Automatic Engineering PRD maintenance

**Status:** Implemented in v0.6.1

**Inputs:** FR-001 and Feature RD 008.

**Outcome:** Initial app development creates and approves the Engineering PRD
once. Every later Feature RD pass automatically checks coverage, leaves covered
baselines unchanged, and proposes only genuine product-level PRD diffs.

**Verification:** Initial and covered-feature lifecycle review, SDLC
conformance, template structure, bootstrap smoke, Wasp client tests, and Wasp
compilation.


## Phase 8 - Baseline branded site and header navigation

**Status:** Built (Feature RD 009; visual tokens/fonts pending supersession by
Phase 9)

**Inputs:** FR-001, FR-024, NFR-SEO-001, NFR-A11Y-001, NFR-PERF-001 and Feature
RD 009.

**Outcome:** The Pet Rescue by Judy portal has a public, branded, prerendered
baseline site with a header, primary navigation, footer, brand tokens and the
component, browser and accessibility test harness that later features reuse.

**Verification:** AC-mapped unit and component tests, prerender build check,
Playwright with axe, Lighthouse record, SDLC conformance, Wasp compilation.
Evidence is recorded only after it is observed.

## Phase 9 - Public platform design foundation and homepage

**Status:** Proposed (Feature RD 010; awaiting Product Owner approval of the RD
and `docs/design/platform-baseline.md`)

**Inputs:** FR-001, FR-024, NFR-A11Y-001, NFR-PERF-001, NFR-SEO-001; Feature RD
010; ADR 0008; approved mockup `docs/design/mockups/prbj-modern-home/`.

**Outcome:** One shared public design foundation (Georgia/Inter, mockup tokens,
shared components) and a search-first homepage matching the approved mockup,
reusing RD 009 routing/prerender/harness. Live catalog and CMS remain later.

**Verification:** AC-mapped foundation and homepage tests, visual evidence at
approved viewports, Playwright/axe, prerender check, Lighthouse figures
(misses reported), SDLC conformance, Wasp compilation.

## Phase 10 - Cat adoption application wizard and applicant profile

**Status:** Proposed (Feature RD 012 awaits approval; depends on PRD 0.4.0
approval and on the animal catalog phase being Implemented first, Product Owner
decision 2026-11-02). The catalog Feature RD (011, to be written) is the next RD to write.

**Inputs:** FR-014, FR-025, FR-026, FR-027, NFR-SEC-002, NFR-PRIV-001,
NFR-A11Y-001 and Feature RD 012.

**Outcome:** A signed-in applicant completes the cat adoption application in a
saved, resumable eight-step wizard, reuses an encrypted applicant profile, and
sees their drafts and submitted applications in their account.

**Slices:** S1 encryption and migration M4a; S2 applicant profile; S3 wizard and
submit; S4 My applications and draft purge job. Each slice is its own TDD loop.

**Verification:** AC-mapped unit, database integration, component and Playwright
tests with axe, prerender check, SDLC conformance, Wasp compilation. Evidence is
recorded only after it is observed.

**Not delivered here:** applicant and staff emails, reviewer workflow, audit log,
submitted-application retention purge, animal catalog dropdown.
