# 7. Change Control and Exceptions

## Scope changes

When implementation reveals a material requirement or architecture change:

1. stop the affected work;
2. document the discovery and impact;
3. update the Feature RD and acceptance criteria;
4. obtain renewed approval;
5. resume with a new failing test.

Do not bury changed scope in implementation notes or a pull-request diff.

## Exception record

An exception includes:

- rule or gate being waived;
- reason and alternatives considered;
- affected Feature RD, users, systems, and data;
- risk, compensating control, owner, and expiration;
- approving human and date;
- follow-up work and verification.

Exceptions are narrow and temporary. An agent cannot approve its own exception.

## Urgent fixes

Urgency may compress documentation but does not remove authorization,
verification, or recovery requirements. A production hotfix still needs:

- incident/problem statement and bounded scope;
- explicit approval;
- regression test or documented reason it cannot precede the fix;
- focused validation and production confirmation;
- retrospective Feature RD/evidence reconciliation.

## Concurrent work

Use separate worktrees or clones. Never share a dirty checkout, overwrite
unrelated changes, reuse another agent's credentials, or treat an unreviewed
agent report as integrated state. Integration occurs through explicit diffs,
reviewed commits, and rerun validation on the combined result.

## Methodology evolution

Changes to this SDLC are versioned template changes. Update this handbook,
agent rules, automated conformance checks, changelog, and methodology version
together. Generated applications adopt methodology updates deliberately through
a reviewed change; template updates never overwrite product-owned documents.
