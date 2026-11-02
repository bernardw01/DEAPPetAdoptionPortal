# Feature RD 007 — Engineering PRD gate

## Status

Implemented

## Requirement traceability

- Product requirement: FR-001
- Source methodology: DEAPOpsManager-Internal engineering PRD hierarchy
- Dependencies: Feature RDs 004–006

## Problem

The Playbook names the PRD as a source of truth, but its lifecycle moves from
discovery directly to Feature RD specification. The practice guide likewise
treats PRD work as a short requirements edit. This understates the
application-level contract that aligns product intent, domain boundaries, and
cross-cutting engineering decisions before features are decomposed.

## Desired outcome

The Engineering PRD is an explicit, approved Playbook gate between discovery
and Feature RD specification, with a complete starter structure, governance
validation, and a hands-on drafting and approval step in the practice guide.

## Scope

### In scope

- Add Define Engineering PRD and Approve PRD stages to Playbook flows.
- Define the PRD's purpose, required contents, lifecycle, and change control.
- Expand `docs/PRD.md` into an Engineering PRD starter structure.
- Require the PRD structure in `npm run sdlc:check`.
- Make the practice guide draft and approve the PRD before a Feature RD.
- Align agent instructions and traceability rules.

### Out of scope

- Writing a generated application's final product decisions.
- Automatically approving PRD content.
- Replacing Feature RDs with the Engineering PRD.

## Existing behavior

The PRD contains a minimal purpose, scope, requirements, and open-decisions
outline. Playbook diagrams move from Discover directly to Specify.

## Proposed architecture

Keep `docs/PRD.md` as the canonical application-level engineering contract.
Claude drafts it, the human Product Owner explicitly approves it, and only then
may Claude derive domain Feature RDs. Feature RDs cite stable PRD requirement
IDs. Governance automation verifies structure, while approval remains human.

## Acceptance criteria

- [x] AC-PRD-01: Playbook prose, tables, and Mermaid flows include Engineering
  PRD definition and human approval before Feature RD specification.
- [x] AC-PRD-02: The Playbook explains why the Engineering PRD matters and
  defines its minimum content and change-control lifecycle.
- [x] AC-PRD-03: The starter PRD covers product, domain, security, data,
  accessibility, reliability, integration, deployment, risk, and traceability.
- [x] AC-PRD-04: Governance validation rejects a structurally incomplete PRD.
- [x] AC-PRD-05: The practice guide provides a separate PRD drafting prompt,
  review checklist, recorded approval step, and then a traceable Feature RD.
- [x] AC-PRD-06: Agent instructions prohibit domain implementation whose
  Feature RD lacks approved Engineering PRD coverage.

## Test plan

- Run the governance checker against the complete starter PRD.
- Run template structure, bootstrap smoke, client tests, and Wasp compile.
- Review Mermaid flows and the practice tutorial in rendered Markdown.

## Rollout and rollback

Release as v0.6.0 because this adds a required methodology gate. Generated
applications adopt it deliberately and must reconcile their existing PRD before
new domain Feature RDs advance.

## Open decisions

None.

## Verification

Implemented across the Playbook, starter PRD, agent rules, governance script,
and practice guide. Release evidence is recorded in the v0.6.0 workflow.

## Manual smoke

Read the Playbook and practice guide in sequence. Confirm a learner cannot move
from discovery to a domain Feature RD without drafting, reviewing, approving,
and recording the Engineering PRD baseline.
