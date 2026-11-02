# Feature RD 005 — DEAP AI SDLC Playbook visual model

## Status

Implemented

## Requirement traceability

- Product requirement: FR-001
- Source methodology: DEAPOpsManager-Internal three-agent local SDLC
- Dependencies: Feature RD 004

## Problem

The methodology is comprehensive but its generic handbook name and prose-first
presentation make the cross-functional handoffs harder to understand quickly.

## Desired outcome

The methodology is consistently named the DEAP AI SDLC Playbook and uses
accessible Mermaid diagrams to clarify agent collaboration, gate transitions,
and evidence traceability without weakening the written rules.

## Scope

### In scope

- Rename canonical methodology entry points.
- Add Mermaid workflow, cross-functional sequence, stage-gate, and evidence
  traceability diagrams where they reduce cognitive load.
- Retain prose and tables as the authoritative, non-visual representation.

### Out of scope

- Changing agent authority or writable scopes.
- Replacing approval or validation with automated diagram state.
- Adding product-specific DEAPOpsManager rules.

## Existing behavior

The v0.5.0 methodology is called the Opinionated AI-Assisted SDLC or SDLC
handbook and contains no diagrams.

## Proposed architecture

Keep `docs/sdlc/README.md` as the canonical entry point. Rename its displayed
methodology and references while preserving paths for compatibility. Use
GitHub-supported Mermaid code blocks alongside equivalent prose and tables.

## Acceptance criteria

- [x] AC-PLAYBOOK-01: The root README and canonical entry point call the
  methodology the DEAP AI SDLC Playbook.
- [x] AC-PLAYBOOK-02: The Playbook visualizes the cross-functional handoffs
  among the human, Codex, Claude, and Cursor roles.
- [x] AC-PLAYBOOK-03: The lifecycle distinguishes approval, Build, Validate,
  Ship, Deploy, and Confirm visually and in text.
- [x] AC-PLAYBOOK-04: Evidence traceability is visualized from requirement
  through production confirmation.
- [x] AC-PLAYBOOK-05: Every diagram has adjacent prose or a table conveying the
  same operating rules without relying on color or the rendered graphic.

## Test plan

- Run `npm run sdlc:check` and template validation.
- Inspect Mermaid syntax and confirm the Markdown remains understandable when
  diagrams are not rendered.

## Rollout and rollback

Release as template v0.5.1. Preserve all existing file paths, allowing rollback
to v0.5.0 without migration.

## Open decisions

None.

## Verification

Implemented in the root README and canonical Playbook chapters. Release
evidence is recorded in the v0.5.1 validation and release workflow.

## Manual smoke

Open the repository README and each modified Playbook chapter on GitHub. Confirm
the Mermaid diagrams render and that the adjacent prose communicates the same
rules when read independently.
