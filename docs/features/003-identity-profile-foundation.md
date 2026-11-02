# Feature RD 003 — PostgreSQL identity and profile foundation

## Status

Implemented

## Requirement traceability

- Product requirements: FR-002, FR-003, FR-004, and NFR-DATA-001.
- Source pattern: DEAPOpsManager Feature RDs 023 and 434, adapted without its
  tenant, audit, MFA, or media-scanning subsystems.

## Desired outcome

Every generated application begins with a usable account system and durable
profile management instead of treating identity as later scaffolding.

## Scope

- PostgreSQL-only Prisma datasource and initialization check.
- Email/password sign-up, login, protected application route, and logout.
- Normalized email stored both as `User.email` and the Wasp username identity.
- Self-service display name, email, and password changes.
- Replaceable profile picture stored in PostgreSQL.

## Acceptance criteria

- [x] AC-IDENTITY-01: PostgreSQL is declared in schema and checked before database initialization.
- [x] AC-IDENTITY-02: Sign-up and login expose only email, and the server rejects an identity that differs from the normalized email.
- [x] AC-IDENTITY-03: Root and profile routes require authentication.
- [x] AC-PROFILE-01: A user can update only their own display name and login email.
- [x] AC-PROFILE-02: Changing email atomically updates the unique user email and Wasp username identity.
- [x] AC-PROFILE-03: Password change requires the current password and a stronger replacement.
- [x] AC-PROFILE-04: Profile pictures are replaceable, PostgreSQL-backed, at most 5 MB, and validated by MIME type and file signature.

## Explicit boundary

Administrative user-directory CRUD, invitations, roles, tenant membership,
email verification, reset-email delivery, MFA, and malware scanning are
product-dependent capability packs or later Feature RDs. They are not implied
by this reusable identity baseline.

## Verification

Run `npm run template:check`, the AC-mapped unit tests, `wasp compile`, and a
PostgreSQL-backed manual smoke covering sign-up, sign-in, profile edits,
password change, image replacement, logout, and sign-in with the updated email.
