# Feature RD 004 — Opinionated SDLC governance

## Status

Implemented

## Requirement traceability

- Product requirement: FR-001
- Source methodology: DEAPOpsManager-Internal three-agent local SDLC
- Dependencies: Feature RDs 001 and 002

## Problem

The repository's methodology is distributed across short agent and testing
documents. A generated team can understand the intent but cannot reliably find
the controlling rule, distinguish delivery gates, or detect documentation
drift automatically.

## Desired outcome

Generated repositories inherit a navigable, explicit, and mechanically checked
version of the DEAP three-agent SDLC while retaining project-owned requirements.

## Scope

### In scope

- Canonical handbook with authority, gates, Feature RDs, TDD, evidence,
  release, rollback, and exception control.
- Root README onboarding and cross-agent references.
- Pull-request evidence checklist.
- Automated structural conformance check included in validation.

### Out of scope

- Reproducing DEAPOpsManager-specific Railway, Slack, Zoom, tenancy, branding,
  or product-domain rules.
- Replacing product-owner approval with automation.
- Implementing a production deployment provider.

## Existing behavior

The template already separates UX design, architecture, and implementation;
uses Feature RDs and `AC-*` tests; and distinguishes Build, Validate, Ship, and
Deploy. The rules do not yet have a canonical detailed handbook or conformance
command.

## Proposed architecture

The handbook under `docs/sdlc/` is the canonical methodology. `AGENTS.md`,
Cursor rules, `docs/local-sdlc.md`, the README, and the pull-request template
are tool-specific entry points. `scripts/sdlc-check.mjs` verifies the handbook
and numbered Feature-RD contracts and runs before full validation.

## Acceptance criteria

- [x] AC-SDLC-01: The README directs users to a subdivided canonical handbook.
- [x] AC-SDLC-02: The handbook preserves the DEAP UX Designer, Claude
  Architecture Agent, Cursor Implementation Agent, and human approval split.
- [x] AC-SDLC-03: Build, Validate, Ship, Deploy, and Confirm have distinct
  authority, inputs, outputs, and completion language.
- [x] AC-SDLC-04: `npm run sdlc:check` rejects missing governance documents,
  unindexed or malformed numbered Feature RDs, and premature checked criteria.
- [x] AC-SDLC-05: Pull requests require contract, evidence, risk, rollback, and
  delivery-state declarations.

## Test plan

- Run `npm run sdlc:check` against the complete repository.
- Run template structure, bootstrap smoke, client tests, and Wasp compile.

## Rollout and rollback

Release as template v0.5.0. Roll back the release tag if generated-template
validation fails; existing generated applications adopt this methodology only
through deliberate review.

## Open decisions

None.

## Verification

Documentation and conformance code are implemented. Release evidence is
recorded in the v0.5.0 validation and GitHub release workflow.

## Manual smoke

Not applicable: methodology and repository-control change only.
