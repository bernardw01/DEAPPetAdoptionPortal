# Repository Working Agreement

## Purpose

This is a Wasp application developed through a role-separated, evidence-based
SDLC. Product requirements live in `docs/PRD.md`; approved implementation
contracts live in `docs/features/`; the canonical methodology lives in
`docs/sdlc/README.md`. The Engineering PRD must be approved before domain
Feature RDs advance to implementation.

The Architecture Agent owns ongoing PRD maintenance. Each Feature RD pass
includes a coverage check, but the PRD is edited and reapproved only when the
feature exposes a genuine product-level requirement or cross-cutting change.

## Roles and boundaries

- The **Design Agent** may create static design artifacts only under
  `docs/design/mockups/<slug>/`. A mockup is design input, not specification
  truth.
- The **Architecture Agent** may author requirements, Feature RDs, architecture
  decisions, and implementation-plan slices. It must not edit application
  code, tests, migrations, or deployment scripts.
- The **Implementation Agent** implements only approved Feature RDs, writes
  tests, and records observed evidence. It must stop when architecture is
  missing or ambiguous.
- The **Human Product Owner / Release Authority** approves Feature RDs,
  exceptions, destructive actions, external writes, and production releases.

Do not let concurrent agents share a working directory. Use separate worktrees
or clones and integrate through reviewed commits.

## Before implementation

1. Read this file, `docs/sdlc/README.md`, the approved `docs/PRD.md`, `docs/implementation-plan.md`,
   `docs/features/000-overview.md`, and the relevant Feature RD.
2. Read every applicable rule under `.cursor/rules/`.
3. Inspect current code and tests. Do not rely on assumptions from another app.
4. Confirm scope, non-goals, acceptance criteria, and cross-cutting reviews.
5. Verify that the Feature RD is approved before changing application code and
   that its requirement IDs exist in the approved Engineering PRD.
6. Run `npm run sdlc:check`; resolve governance failures before claiming the
   change is ready for validation.

## Engineering requirements

- Prefer Wasp-native routing, authentication, operations, and jobs.
- Use TypeScript for application source.
- Organize application code by feature as the project grows.
- Keep authorization checks on the server.
- Never expose server secrets through client variables.
- Do not edit generated Wasp output.
- Preserve unrelated changes.
- Use committed migrations for persisted schema changes.

## Acceptance criteria and testing

1. Name acceptance criteria `AC-<FEATURE>-<NUMBER>`.
2. Write the smallest meaningful failing test first.
3. Implement the minimum change that makes it pass.
4. Refactor only while the relevant suite remains green.
5. Record actual commands and results; never infer or invent evidence.

UI changes also require applicable accessibility criteria from
`docs/accessibility/README.md`.

## Delivery commands

- **Build:** focused TDD loop for the approved slice. No deployment.
- **Validate:** `npm run sdlc:validate` (includes governance checks). No deployment.
- **Ship:** `npm run sdlc:ship` after review and explicit authorization.
- **Deploy:** deploy only a clean commit covered by current validation evidence.

## External actions

Commits, pushes, merges, deployments, credential changes, destructive database
operations, and external messages require explicit human authorization unless
the generated project records a narrower standing policy.

