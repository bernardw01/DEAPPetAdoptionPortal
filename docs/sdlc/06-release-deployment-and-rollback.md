# 6. Release, Deployment, and Rollback

## Build, Validate, Ship, Deploy

- **Build:** implement one approved slice through the TDD loop.
- **Validate:** run the complete repository gate and record evidence.
- **Ship:** run the approved release pack and create the reviewed, versioned,
  immutable release candidate. This may be the daily path.
- **Deploy:** release that unchanged candidate to a confirmed environment.
- **Confirm:** prove migrations, health, and critical live behavior.

These verbs are commands with different authority and completion conditions.
There is no implicit “Build and Deploy” operation.

## Ship checklist

- Feature RD and index statuses are accurate.
- Required criteria are evidenced; remaining criteria are named.
- The configured Ship gate passes for the candidate SHA. In this starter,
  `npm run sdlc:ship` delegates to full validation until a focused release pack
  is explicitly approved.
- Worktree, branch, remote, and diff are reviewed.
- Version and changelog are synchronized.
- Migration compatibility and rollback are reviewed.
- No secrets, test artifacts, or unrelated changes are included.
- Release Authority explicitly approves the external action.

## Deploy checklist

- Resolve the exact environment, project, service, region, and database.
- Confirm deployed SHA equals validated release SHA.
- Require current evidence for the exact clean SHA; if evidence is missing or
  stale, stop and request Ship or Validate rather than running it implicitly.
- Back up or verify recovery for destructive or irreversible data changes.
- Apply migrations in the documented order and capture the result.
- Verify service health, logs, and critical authenticated behavior.
- Confirm monitoring and ownership for the observation window.

## Rollback

Every risky Feature RD names triggers, decision authority, commands or
procedure, data implications, and post-rollback verification. Code rollback
does not automatically reverse a database migration. Prefer forward-compatible
expand/migrate/contract changes and a corrective forward migration when data
has already changed.

## Completion language

Report the furthest proven state precisely: built, validated, shipped,
deployed, or production-confirmed. Never use “done” to hide an unverified
delivery stage.
