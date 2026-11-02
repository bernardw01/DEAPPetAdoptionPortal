# Feature RD 001 — Repository foundation

## Status

Implemented

## Requirement traceability

- Product requirement: FR-001.
- Dependencies: Wasp 0.26 and Node.js 24.

## Desired outcome

A generated repository starts as a valid Wasp application and carries the
role-separated AI development methodology from its first commit.

## Scope

- Minimal public route and page.
- Canonical roles and delivery language.
- Project-personalization CLI.
- Optional capability packs.
- Structural, unit-test, and Wasp compile validation.

## Acceptance criteria

- [x] AC-FOUNDATION-01: The repository defines Build, Validate, Ship, and Deploy in order and gives them distinct meanings.
- [x] AC-FOUNDATION-02: Ship and Deploy are external actions requiring authorization.
- [x] AC-FOUNDATION-03: Bootstrap updates declared project identity without unrestricted search-and-replace.
- [x] AC-FOUNDATION-04: Capability packs are explicit, additive, and discoverable.
- [x] AC-FOUNDATION-05: CI runs structural checks, client tests, and `wasp compile`.

## Verification

Implemented in template release 0.2.0. CI is the authoritative clean-machine
check; local results and the published workflow run are recorded in the release
handoff.

## Manual smoke

1. Generate a repository from the template.
2. Run bootstrap with a new project name and slug.
3. Confirm the profile, package name, Wasp application name, and title changed.
4. Apply one capability pack and confirm its managed rule appears.
5. Run `npm run sdlc:validate`.
