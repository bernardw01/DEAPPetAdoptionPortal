# Testing and Evidence Strategy

This document supplies repository-specific testing guidance. The authoritative
evidence and gate policy is
[Validation and evidence](sdlc/05-validation-and-evidence.md).

## Required workflow

1. Approve testable acceptance criteria in a Feature RD.
2. Add a failing test whose name begins with the relevant `AC-*` identifier.
3. Implement the smallest passing change.
4. Refactor with the focused suite green.
5. Run proportionate broader verification.
6. Record observed release evidence.

## Test ladder

| Stage | Purpose | Expected evidence |
|---|---|---|
| TDD loop | Fast behavioral feedback | Focused test result |
| Build | Complete approved slice | Relevant `AC-*` tests |
| Validate | Full repository confidence | Unit, integration, compile, browser, accessibility |
| Ship | Release-candidate confidence | Commit, branch, selected release checks |
| Deploy | Production release | Target, migration, service and live checks |

## UI evidence

User-visible changes include applicable axe checks, a keyboard-only primary
path, visible-focus assertions, accessible-name checks, contrast evidence, and
320px reflow evidence. Manual testing supplements rather than replaces
automation.

## Release evidence

Report:

- exact commands run;
- passed, failed, and skipped totals;
- Wasp compile or build result;
- browser and accessibility result;
- environment and limitations;
- commit SHA when releasing;
- production checks when deploying.

