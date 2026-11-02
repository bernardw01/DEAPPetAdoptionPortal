# ADR 0007 - Application storage and PII handling

## Status

Proposed (retention periods need rescue approval).

## Context

Applications carry names, addresses, phone, employer, landlord, veterinarian,
household and pet history. A breach would harm applicants and the rescue. The
draft model stored these as plaintext columns. The site must also notify the
rescue and applicant without leaking data over email.

## Decision

1. Split storage. `Application` holds a non-sensitive index (reference code,
   type, status, animal link, submitter name and email, timestamps, schema
   version). `ApplicationPayload` holds everything else, encrypted.
2. Application layer encryption: AES-256-GCM, a fresh nonce per record, key
   identified by `keyVersion`, keys from `APP_DATA_KEYS` env (key ring).
   Rotation re-encrypts lazily on read and by a batch job.
3. Notes by reviewers are encrypted the same way (`ApplicationNote`).
4. Reviewer detail views decrypt on the server and write an `AuditLog` row. List
   views never decrypt. CSV export is Admin only and audited.
5. Roles per ADR 0003. Editors have no access.
6. Staff emails carry a link and a reference code only. The applicant copy is sent
   to the applicant's own verified or submitted address (open question OQ-09 on
   whether to send full answers or a summary).
7. Retention (proposed, enforced by a nightly purge): abandoned drafts 30 days;
   declined and withdrawn 12 months; approved and completed 3 years; then the
   payload is deleted and a tombstone (reference, type, outcome, dates) stays.
   Contact messages 12 months.
8. `AuditLog` is append only, enforced by a database trigger that rejects update
   and delete, and kept for 3 years.
9. No file uploads at launch. No IP addresses stored; rate limiting uses
   transient memory.
10. Logs never contain payload fields, tokens or keys; a redaction helper and a
    test enforce this.
11. (Revision 2026-11-02, Feature RD 012.) Reusable applicant details live in
    `ApplicantProfile`, one encrypted document per user using the same AES-256-GCM
    scheme and key ring. Ciphertext is bound to its record by additional
    authenticated data (record kind, id, schema version). A submitted application
    stores an encrypted frozen copy (`profileSnapshot`) so history is stable;
    profile edits never change it. The profile lives while the account lives and
    can be cleared by its owner. Applicant reads of their own data are not audited.
12. Drafts are saved after every wizard step and expire 30 days after the last
    save. A daily job deletes expired drafts (no tombstone, never submitted).
    Date of birth is stored in the profile instead of age so age gates are
    reliable; the privacy copy discloses this.

## Alternatives considered

- Plaintext columns with disk encryption only: weak against SQL access, backups
  and over-privileged readers.
- Database level pgcrypto: keys would live with the data and queries.
- Pushing applications into RG: needs private credentials, out of scope.
- Third party form vendor: adds a data processor and cost; weaker audit.

## Consequences

- Searching inside answers is impossible by design; reviewers filter by index
  fields. This is acceptable and stated to stakeholders.
- Key loss means data loss, so key custody and backup of the key ring are launch
  checklist items, stored separately from database backups.

## Verification and revisit triggers

Tests: encrypt and decrypt round trip, tamper detection, key rotation, audit on
every read, role matrix, purge job, log redaction. Revisit if applications add
file uploads, payments, or sensitive identifiers, or if legal advice changes
retention.
