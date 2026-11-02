# Feature RD 006 — Task tracker getting-started guide

## Status

Implemented

## Requirement traceability

- Product requirement: FR-001
- Related decision: DEAP AI SDLC Playbook v0.5.1
- Dependencies: Feature RDs 001, 003, 004, and 005

## Problem

The template explains its structure and process but does not give a new user a
complete, bounded exercise that proves they can create an independent app and
practice the agent handoffs, PostgreSQL setup, authentication, Feature RDs,
TDD, validation, and evidence recording.

## Desired outcome

A new user can follow one linked guide to create a simple personal task tracker
while using the template and the DEAP AI SDLC Playbook as intended.

## Scope

### In scope

- GitHub template creation and local clone instructions.
- Verified bootstrap, PostgreSQL, validation, and start commands.
- Copy-ready bounded task requirements and agent prompts.
- Mermaid setup, data-model, and task-state visualizations.
- Authorization, accessibility, two-account, and manual-smoke guidance.

### Out of scope

- Implementing task tracking in the reusable template itself.
- Teams, assignments, due dates, priorities, labels, reminders, or deployment.
- Replacing official Wasp or GitHub installation documentation.

## Existing behavior

The root README contains concise setup instructions but no end-to-end learning
exercise or example domain workflow.

## Proposed architecture

Add `docs/getting-started-task-tracker.md` as a product-owned tutorial and link
it near the beginning of the root README and in the documentation map. Keep the
tutorial procedural, retain copy-ready prompts, and make clear that users build
the feature in their generated repository rather than in the template.

## Acceptance criteria

- [x] AC-GUIDE-01: A new user can create and personalize an independent
  `practice-task-tracker` repository from the GitHub template.
- [x] AC-GUIDE-02: The guide explains mandatory PostgreSQL initialization and
  safe local environment configuration without embedding credentials.
- [x] AC-GUIDE-03: The guide supplies bounded task-tracker requirements and
  separate Claude architecture and Cursor implementation prompts.
- [x] AC-GUIDE-04: Mermaid diagrams explain the exercise flow, ownership model,
  and task state transitions with equivalent prose nearby.
- [x] AC-GUIDE-05: Validation and manual smoke cover two-account isolation,
  keyboard use, reflow, errors, persistence, and delivery evidence.
- [x] AC-GUIDE-06: The root README links the guide from onboarding and the
  documentation map.

## Test plan

- Check every command and filename against the current template.
- Run SDLC governance, template structure, bootstrap smoke, client tests, and
  Wasp compilation.
- Inspect the guide for rendered Markdown and Mermaid compatibility.

## Rollout and rollback

Release as template v0.5.2. Rollback removes the guide and README links without
affecting generated application runtime behavior.

## Open decisions

None.

## Verification

The guide and README links are implemented. Release evidence is recorded in the
v0.5.2 validation and release workflow.

## Manual smoke

Open the root README on GitHub, follow its guide link, and verify the tutorial,
code blocks, internal links, and Mermaid diagrams render. A complete generated
task-tracker implementation remains the learner's exercise.
