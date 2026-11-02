# Engineering Product Requirements Document

## Document control

- **Status:** Draft — generated applications must replace and approve this
  starter baseline before approving domain Feature RDs.
- **Product owner:** Project owner
- **Architecture owner:** Architecture Agent
- **Version:** 0.1.0
- **Approved by:** Not yet approved
- **Approval date:** Not yet approved

## Product purpose

Describe the users, problem, desired transformation, and measurable outcomes.

## Users, problems, and evidence

- **Primary users:** Identify the people whose work or outcomes change.
- **Problem:** Describe current behavior and its cost.
- **Evidence:** Separate observed evidence from assumptions.
- **Desired outcomes:** Define measurable product and user outcomes.

## Goals and non-goals

### Goals

- Define the outcomes this product must produce.

### Non-goals

- Name adjacent outcomes the product deliberately will not pursue.

## Scope

### In scope

- Define the first approved product capabilities.

### Out of scope

- Record tempting adjacent work that is deliberately excluded.

## Domain and system context

- Define core domain concepts, ownership, and important relationships.
- Identify actors, system boundaries, trusted services, and untrusted inputs.
- Record whether the product is single-tenant or multi-tenant.

## Functional requirements

- **FR-001:** The application provides a working landing route.
- **FR-002:** Every generated application begins with email/password account
  creation, authenticated access, and self-service profile management.
- **FR-003:** A user's normalized email address is their login username; the
  application never asks for or generates a separate username.
- **FR-004:** Users can manage their display name, login email, password, and a
  replaceable profile picture stored durably in PostgreSQL.

## Non-functional requirements

- **NFR-SEC-001:** Server-side authorization protects restricted operations.
- **NFR-A11Y-001:** User-facing experiences are built to WCAG 2.2 AA.
- **NFR-REL-001:** Releases have documented validation and rollback procedures.
- **NFR-DATA-001:** PostgreSQL is the required database from initialization;
  alternative Prisma providers are not supported by the template.

## Authentication, authorization, privacy, and security

- Email/password authentication and profile management are enabled by default.
- Every protected operation enforces authorization on the server.
- Define roles, resource ownership, privacy expectations, threat boundaries,
  and audit requirements before approving dependent Feature RDs.

## Data lifecycle and recovery

- Define creation, ownership, retention, deletion, migration, backup, recovery,
  and audit expectations for persisted data.

## Accessibility and user experience

- WCAG 2.2 AA is the engineering floor for user-visible behavior.
- Define supported devices, critical workflows, and alternative interactions.

## Reliability, performance, and observability

- Define availability, latency or scale expectations where material.
- Define failure behavior, logging, monitoring, alerting, and support ownership.

## Integrations and deployment context

- Record external systems, credentials, failure modes, data exchanged, and
  operational owners.
- Record the intended deployment provider and environment boundaries.

## Assumptions, dependencies, and risks

- **Assumptions:** Claims that still require validation.
- **Dependencies:** External or internal prerequisites.
- **Risks:** Product, data, security, delivery, and operational risks.

## Decisions required

- Tenant model.
- Deployment provider.
- Data retention and recovery requirements.

## Requirement traceability

Every domain Feature RD must cite one or more approved `FR-*` or `NFR-*`
identifiers from this document. During Feature RD preparation, the Architecture
Agent automatically checks coverage. It leaves this document unchanged when
coverage exists; if a genuine product-level gap exists, it maintains the PRD
and presents the focused diff for approval before the Feature RD advances.

