# Local SDLC — Quick Reference

The canonical, enforceable methodology is the
[DEAP AI SDLC Playbook](sdlc/README.md). This page remains as a concise entry point for
existing agent rules and integrations. When wording differs, the Playbook and
the approved Feature RD govern.

## Roles

| Role | Responsibility | Normal writable scope |
|---|---|---|
| Human Product Owner / Release Authority | Requirements, approval, exceptions, releases | Any authorized surface |
| Design Agent | Optional static mockups and interaction exploration | `docs/design/mockups/**` |
| Architecture Agent | Feature RDs, architecture, plan slices | `docs/**` |
| Implementation Agent | Code, tests, evidence, authorized release work | Application and verification files |

## Gate sequence

| Gate | Required output | Authority to advance |
|---|---|---|
| Discover | Evidence-backed problem statement | Product Owner |
| Specify | Traceable Feature RD | Architecture Agent |
| Approve | Approved scope and criteria | Product Owner |
| Build | Passing focused `AC-*` tests | Implementation Agent |
| Validate | Current validation record | Verification owner |
| Ship | Reviewed immutable candidate | Release Authority |
| Deploy and confirm | Target and live evidence | Release Authority |

An unmet gate stops progression. See
[Lifecycle and quality gates](sdlc/02-lifecycle-and-gates.md).

## Phase 1 — Discover and design

The Design Agent may explore visual directions. Its output is design input,
not a final decision about data, permissions, architecture, or feasibility.

## Phase 2 — Specify and approve

The Architecture Agent inspects the live repository and writes a Feature RD
with traceability, scope, architecture, cross-cutting reviews, acceptance
criteria, expected tests, rollout, and rollback. Implementation waits for
human approval.

## Phase 3 — Build

The Implementation Agent writes a failing `AC-*` test, implements the minimum
approved behavior, and makes the focused test pass. Build does not imply a
full validation run or deployment.

## Phase 4 — Validate

Run `npm run sdlc:validate`. Record commands, totals, failures, skipped checks,
and environmental limitations. Check criteria only when evidence supports
them. A failed or skipped required check remains visible.

## Phase 5 — Ship

After explicit authorization, prepare the reviewed release candidate, verify
the intended commit and branch, and publish it through the configured Git
workflow. Ship does not imply production success.

## Phase 6 — Deploy and confirm

Deploy only an unchanged commit covered by current validation evidence. Verify
the production target, migration result, service health, and critical live
behavior. A successful deploy command is not by itself production validation.

## External actions

Credentials, external messages, destructive data operations, commits, pushes,
merges, deployments, and rollbacks require explicit human authorization unless
the project records a narrower standing policy.

## Concurrent agents

Agents performing independent work use separate worktrees or clones. They do
not share a dirty working directory or stash another agent's changes.

Run `npm run sdlc:check` before validation and review. Exceptions follow
[Change control and exceptions](sdlc/07-change-control-and-exceptions.md).

