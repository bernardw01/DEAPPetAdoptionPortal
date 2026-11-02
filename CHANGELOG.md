# Changelog

All notable changes to this template are recorded here. Versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.6.1] - 2026-11-01

### Changed

- Clarified that the complete Engineering PRD is created and approved once at
  application inception, not manually updated during every feature iteration.
- Made PRD coverage and impact analysis an automatic Architecture Agent step in
  every Feature RD pass.
- Added a fast path that leaves the PRD unchanged when approved requirements
  already cover the feature.
- Limited PRD edits and reapproval to genuine product-level or cross-cutting
  changes, presented as focused diffs for human review.

## [0.6.0] - 2026-11-01

### Added

- A required Engineering PRD definition and human approval gate between
  discovery and Feature RD specification.
- A complete Engineering PRD starter structure covering product intent, domain
  boundaries, security, data, accessibility, reliability, integrations,
  deployment, risks, decisions, and traceability.
- Governance validation for required Engineering PRD sections and status.
- A dedicated Engineering PRD drafting, review, and approval exercise in the
  practice task tracker guide.

### Changed

- Playbook Mermaid flows, lifecycle tables, agent responsibilities, and
  evidence chains now distinguish PRD approval from Feature RD approval.
- Feature RDs must trace to stable requirements in an approved Engineering PRD.

## [0.5.2] - 2026-11-01

### Added

- A complete getting-started exercise for creating a personal practice task
  tracker from the GitHub template.
- Copy-ready task requirements and separate Claude architecture and Cursor
  implementation prompts following the DEAP AI SDLC Playbook.
- Mermaid diagrams for the exercise workflow, user-to-task ownership model, and
  task lifecycle.
- Two-account authorization, accessibility, persistence, and evidence-oriented
  manual smoke instructions.

## [0.5.1] - 2026-11-01

### Changed

- Renamed the reusable methodology to the **DEAP AI SDLC Playbook**.
- Added Mermaid diagrams for the cross-functional agent handoff, delivery
  lifecycle, stage gates, and requirement-to-production evidence chain.
- Kept authoritative prose and tables alongside every visualization so the
  process remains usable without diagram rendering.

## [0.5.0] - 2026-11-01

### Added

- A canonical, subdivided SDLC handbook adapted directly from the
  DEAPOpsManager-Internal three-agent delivery methodology.
- Explicit UX Designer, Claude Architecture Agent, Cursor Implementation Agent,
  and human approval boundaries.
- An automated SDLC conformance check for governance and Feature-RD contracts.
- A pull-request template requiring contract, evidence, risk, rollback, and
  delivery-state declarations.

### Changed

- Root onboarding, agent rules, testing guidance, and validation now point to
  and enforce the canonical methodology.

## [0.4.1] - 2026-11-01

### Fixed

- Generated applications now skip the template-maintainer bootstrap smoke test,
  allowing `npm run sdlc:validate` to pass after project personalization.

## [0.4.0] - 2026-11-01

### Added

- Mandatory PostgreSQL initialization and configuration validation.
- Email-and-password account creation and sign-in enabled by default.
- A server-enforced rule that the normalized email address is the username.
- Authenticated self-service profile, email, and password management.
- Database-backed JPEG, PNG, and WebP profile pictures with replace support,
  size limits, and file-signature validation.

## [0.3.0] - 2026-11-01

### Added

- A canonical `VERSION` file and automated version-consistency validation.
- A controlled version-bump command supporting patch, minor, major, and exact versions.
- Tag-triggered validation and GitHub Release publication.
- Versioning policy and release instructions for template maintainers.

## [0.2.0] - 2026-11-01

### Added

- Shared governance for Cursor, Claude, and Codex agents.
- Role-separated, Feature-RD-driven AI development lifecycle.
- Bootstrap and optional capability-pack commands.
- Minimal Wasp starter application with testing and continuous validation.

[Unreleased]: https://github.com/bernardw01/deap-wasp-ai-template/compare/v0.6.1...HEAD
[0.6.1]: https://github.com/bernardw01/deap-wasp-ai-template/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/bernardw01/deap-wasp-ai-template/compare/v0.5.2...v0.6.0
[0.5.2]: https://github.com/bernardw01/deap-wasp-ai-template/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/bernardw01/deap-wasp-ai-template/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/bernardw01/deap-wasp-ai-template/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/bernardw01/deap-wasp-ai-template/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/bernardw01/deap-wasp-ai-template/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/bernardw01/deap-wasp-ai-template/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/bernardw01/deap-wasp-ai-template/releases/tag/v0.2.0
