# Feature RD 002 — Template versioning and releases

## Status

Implemented

## Requirement traceability

- Product requirement: FR-001.
- Dependency: Feature RD 001.

## Desired outcome

Maintainers can increment, validate, publish, and explain template versions,
while generated applications can identify the methodology snapshot they use.

## Scope

- Semantic version policy and canonical version file.
- Automated synchronization checks and controlled version bumps.
- Changelog-derived GitHub Releases from immutable tags.
- Deliberate update guidance for generated repositories.

## Acceptance criteria

- [x] AC-VERSION-01: A single canonical version is synchronized across package, lock, and methodology metadata.
- [x] AC-VERSION-02: CI fails when version metadata or release notes disagree.
- [x] AC-VERSION-03: Maintainers can request patch, minor, major, or exact forward-only increments.
- [x] AC-VERSION-04: A `vX.Y.Z` tag is validated before its GitHub Release is created.
- [x] AC-VERSION-05: Generated applications receive a safe, deliberate update policy rather than automatic overwrites.

## Verification

Run `npm run version:check`, exercise `npm run version:bump -- patch --dry-run`,
and validate a clean tag-triggered GitHub Actions run.
