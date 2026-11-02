# Feature RD 008 — Automatic Engineering PRD maintenance

## Status

Implemented

## Requirement traceability

- Product requirement: FR-001
- Source methodology: DEAPOpsManager-Internal Engineering PRD practice
- Dependencies: Feature RD 007

## Problem

The new Engineering PRD gate can be read as requiring users to edit and
reapprove the complete PRD during every feature iteration. In practice, the PRD
is established at application inception and maintained by the Architecture
Agent only when product-level coverage genuinely changes.

## Desired outcome

Every Feature RD architecture pass automatically checks PRD coverage. Covered
features proceed without a PRD edit; uncovered product-level changes receive a
focused Architecture Agent-maintained PRD diff and human approval.

## Scope

### In scope

- Distinguish initial PRD creation from ongoing coverage checks.
- Make Architecture Agent maintenance automatic within Feature RD preparation.
- Define the threshold for editing and reapproving the PRD.
- Update lifecycle diagrams, rules, prompts, and the practice guide.

### Out of scope

- Automatic human approval.
- Editing the PRD for implementation detail already covered by requirements.
- Removing requirement traceability from Feature RDs.

## Existing behavior

The v0.6.0 workflow routes discovery through Define and Approve PRD before
Feature RD specification without clearly showing the fast path for an already
approved and sufficient product baseline.

## Proposed architecture

Add a PRD coverage decision before Feature RD specification. The Architecture
Agent records applicable IDs and leaves the PRD untouched when coverage exists.
It edits the PRD only for new or changed purpose, users, scope, ownership, or
cross-cutting constraints, then presents that focused diff for human approval.

## Acceptance criteria

- [x] AC-PRDMAINT-01: Playbook diagrams show a direct covered path from PRD
  coverage check to Feature RD specification.
- [x] AC-PRDMAINT-02: The complete PRD is created and approved at application
  inception rather than recreated for each feature.
- [x] AC-PRDMAINT-03: Claude instructions automatically perform coverage and
  impact analysis during every Feature RD architecture pass.
- [x] AC-PRDMAINT-04: Covered work leaves the PRD unchanged and requires no PRD
  reapproval.
- [x] AC-PRDMAINT-05: Only genuine product-level changes produce a focused PRD
  diff for human approval.
- [x] AC-PRDMAINT-06: The practice guide teaches the initial exercise and the
  lower-friction ongoing maintenance behavior separately.

## Test plan

- Run SDLC governance, template structure, bootstrap smoke, client tests, and
  Wasp compile.
- Review lifecycle diagrams for both initial-app and covered-feature paths.

## Rollout and rollback

Release as v0.6.1. This clarifies and reduces process burden without changing
the v0.6.0 PRD structure or invalidating existing approved baselines.

## Open decisions

None.

## Verification

Implemented across the Playbook, agent rules, starter PRD, and practice guide.
Release evidence is recorded in the v0.6.1 workflow.

## Manual smoke

Read the lifecycle as two scenarios: a new app must create and approve its PRD;
a later feature with existing requirement coverage must proceed to Feature RD
without any PRD edit or reapproval.
