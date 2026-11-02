# 4. Engineering Workflow and TDD

## Before editing

1. Read `AGENTS.md`, the PRD, implementation plan, Feature-RD index, relevant
   Feature RD, and applicable repository rules.
2. Refresh and inspect the actual branch, working tree, code, dependencies, and
   tests. Preserve unrelated work.
3. Restate the approved slice, non-goals, affected contracts, and risks.
4. Confirm that the Feature RD is approved and decisions are resolved.

## Red, green, refactor

1. **Red:** add the smallest meaningful failing test named with its `AC-*` ID.
2. **Green:** implement only enough approved behavior to pass.
3. **Refactor:** improve structure without changing scope while focused tests
   remain green.
4. **Broaden later:** run neighboring and cross-cutting suites at the approved
   Validate or Ship gate; Build itself reports the focused result.

A test written after implementation must still demonstrate that it can fail
when the behavior is sabotaged; snapshot churn alone is not TDD evidence.

For staff- or portal-visible behavior, add or extend a Playwright specification
during Build. Manual GUI testing supplements that specification; it does not
replace it.

## Engineering invariants

- Keep server authorization at the operation or API boundary.
- Treat client visibility as presentation, never authorization.
- Validate untrusted input and fail closed on security boundaries.
- Use committed forward migrations for persisted schema changes.
- Preserve backwards compatibility or document migration and rollout order.
- Never edit generated Wasp output.
- Prefer Wasp-native routing, authentication, operations, jobs, and deployment.
- Reuse installed primitives and repository patterns before adding dependencies.
- Keep secrets server-side and out of logs, fixtures, screenshots, and commits.
- Treat accessibility, tenant isolation, auditability, and failure recovery as
  implementation concerns, not later polish.

## Scope discipline

Do not combine feature work with unrelated refactors, dependency upgrades, or
formatting sweeps. If a prerequisite defect is discovered, document it and
either obtain approval to expand scope or isolate it as a separate change.
