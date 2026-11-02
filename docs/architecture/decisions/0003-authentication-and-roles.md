# ADR 0003 - Authentication and roles

## Status

Proposed (requires a PRD addition, FR-016 and roles, and a dedicated Feature RD).

## Context

The template uses Wasp `usernameAndPassword` with the normalized email as the
username (FR-002 to FR-004, implemented in Feature RD 003). The product needs
verified emails (alerts and application copies go to them), password reset,
and roles for Editor, Reviewer and Admin. The draft data model put
`passwordHash` and a `role` of `public` on `user`.

## Decision

1. Keep Wasp as the only credential store. The app's `User` holds profile and
   `role` only; no password hash column.
2. Move adopters to Wasp's email auth method for verification and reset. This
   is a behavior change to Feature RD 003 and must go through a new Feature RD
   and a focused PRD diff. No production users exist, so migration is trivial.
3. Roles: `MEMBER` (default), `EDITOR`, `REVIEWER`, `ADMIN`. "Public" is not a
   role. A `requireRole` server helper guards every admin operation.
4. Staff accounts are created or promoted by an Admin only; self signup never
   yields staff roles. Offer Google sign in for staff if the rescue uses Google
   accounts, to inherit their two step verification (decision for the Feature
   RD). Without it, enforce long passwords and reset on suspicion.
5. Rate limit login, signup and reset; generic error messages to prevent
   account enumeration.

## Alternatives considered

- Keep username and password only: no verification, weak reset.
- Passwordless magic links: good adopter UX, not Wasp native today.
- External IdP (Auth0, Clerk): cost and another vendor for a small user base.

## Consequences

- Email deliverability (SPF, DKIM, a sender domain) becomes launch critical.
- Role checks need a matrix test so Editors never reach application data.

## Verification and revisit triggers

Role matrix tests; enumeration tests; verification and reset e2e. Revisit if
staff cannot manage passwords safely or the rescue adopts Google Workspace.
