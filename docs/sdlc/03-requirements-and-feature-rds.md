# 3. Engineering PRD and Feature RDs

## Why the Engineering PRD matters

The Engineering Product Requirements Document is the application-level contract
between product intent and technical delivery. It prevents a series of locally
reasonable features from becoming an incoherent product. It records not only
what users need, but the shared constraints every Feature RD must respect:
identity, authorization, data ownership, accessibility, reliability,
integrations, deployment, observability, and recovery.

The PRD is not a backlog, screen inventory, or one-time prompt. It is the
approved baseline used to decide whether a proposed feature belongs in the
product and whether its architecture is compatible with the whole system.
Feature RDs may add detail; they may not silently contradict the PRD.

## Requirements hierarchy

1. Discovery evidence identifies the problem, users, constraints, and unknowns.
2. The approved Engineering PRD defines outcomes, product boundaries, stable
   requirements, and cross-cutting engineering constraints.
3. Architecture decisions define or clarify durable technical constraints.
4. Feature RDs translate approved requirement IDs into testable implementation
   contracts.
5. The implementation plan orders approved contracts.
6. Tests and evidence prove the implemented contract.

Implementation code is never the sole requirements record.

## Required Engineering PRD content

`docs/PRD.md` contains, at minimum:

- document status, owner, approver, version, and approval record;
- product purpose, users, problems, evidence, and desired measurable outcomes;
- goals, non-goals, in-scope and out-of-scope capabilities;
- domain concepts, ownership boundaries, and system context;
- stable `FR-*` functional and `NFR-*` non-functional requirements;
- authentication, authorization, privacy, security, and tenant decisions;
- data lifecycle, migration, retention, recovery, and audit expectations;
- accessibility, reliability, performance, observability, and support needs;
- external integrations, deployment assumptions, and operational ownership;
- risks, assumptions, dependencies, open decisions, and traceability rules.

Use language that is measurable enough to decompose and verify. “The app is
secure, fast, and accessible” is not a requirement. Name the protected boundary,
expected behavior, measurable threshold or governing standard, and failure
condition.

## PRD lifecycle and change control

1. At application inception, the Architecture Agent drafts the Engineering PRD
   from discovery evidence and inspected repository state.
2. The Product Owner reviews product intent, scope, priorities, risks, and open
   decisions. Relevant technical owners review feasibility and constraints.
3. Status becomes `Approved` only through an explicit human decision recorded
   in the document.
4. For every later Feature RD request, the Architecture Agent automatically
   performs an impact and coverage check against the approved PRD.
5. If approved requirements already cover the change, Claude cites them and
   leaves the PRD unchanged. The user is not asked to maintain or reapprove it.
6. Only material changes to purpose, users, scope, data ownership, security,
   integrations, or cross-cutting non-functional constraints produce a focused
   PRD revision and renewed approval before dependent Feature RDs advance.

The PRD can evolve. The control is explicit revision and impact review, not
pretending early assumptions never change.

PRD maintenance is an Architecture Agent responsibility built into Feature RD
preparation. It is not a recurring manual documentation task assigned to the
Product Owner. Human work is limited to reviewing and approving a genuine
product-level change when one exists.

## When a Feature RD is mandatory

A Feature RD is required for any change that affects user behavior, persisted
data, authorization, privacy, accessibility, external services, deployment,
operational risk, or a public/internal contract. A narrow typo correction or
non-behavioral maintenance change may use a lightweight issue or commit record
if repository policy permits it.

Every Feature RD names the Engineering PRD requirement IDs it implements. If no
approved requirement covers the proposed behavior, update and approve the PRD
first rather than inventing product scope inside the Feature RD.

## Required Feature-RD content

Every numbered Feature RD contains:

- status and requirement traceability;
- problem and desired measurable outcome;
- in-scope and out-of-scope behavior;
- verified existing behavior;
- proposed UI, application, data, authorization, tenant, integration,
  reliability, observability, and accessibility decisions as applicable;
- uniquely named acceptance criteria;
- test plan across the appropriate test layers;
- rollout, rollback, open decisions, verification, and manual smoke guidance.

Use `docs/features/TEMPLATE-feature-rd.md` rather than inventing a new format.

## Acceptance-criterion rules

- Format: `AC-<FEATURE>-<NUMBER>`.
- Describe an externally observable outcome or a risk-control invariant.
- Be independently testable and avoid combining unrelated behaviors.
- Include actor, precondition, action, and expected result when ambiguity is
  possible.
- Name authorization failure, empty, loading, error, and edge states.
- Add accessibility criteria for every user-visible interaction.
- Do not check a criterion until evidence exists.

## Status rules

- **Proposed:** architecture draft; implementation prohibited.
- **Planned:** explicitly approved and sequenced.
- **In progress:** approved implementation has started.
- **Built:** focused acceptance criteria pass; full validation may remain.
- **Validated:** required repository gate passes with evidence.
- **Implemented:** shipped behavior is confirmed at the intended delivery level.
- **Partial:** named criteria remain incomplete.
- **Deferred:** intentionally removed from active delivery.

The index must match the Feature RD. Status cannot be advanced by optimism or
by an agent reviewing its own unverified claim.
