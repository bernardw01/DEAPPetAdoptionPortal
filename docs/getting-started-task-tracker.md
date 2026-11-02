# Getting Started: Build a Practice Task Tracker

This tutorial uses the GitHub template and the DEAP AI SDLC Playbook to create
a small, real Wasp application. The finished practice app lets each signed-in
user create, view, complete, reopen, and delete only their own tasks.

Plan on 60–90 minutes for setup and specification, plus implementation time for
your AI agents. The exercise is intentionally small so you can practice the
delivery process rather than merely generate code.

## What you will learn

- Create an independent repository from the template.
- Personalize the generated application.
- Connect the mandatory local PostgreSQL database.
- Use the Playbook's human, Claude, and Cursor handoffs.
- Create and approve an Engineering PRD, then derive a Feature RD from it.
- Validate the app and manually prove its critical user path.

```mermaid
flowchart LR
    T[Use GitHub template] --> C[Clone your repository]
    C --> P[Personalize project]
    P --> DB[Initialize PostgreSQL]
    DB --> PRD[Claude drafts Engineering PRD]
    PRD --> PA{Approve product baseline?}
    PA -->|Revise| PRD
    PA -->|Yes| RD[Claude derives Feature RD]
    RD --> A{Approve feature contract?}
    A -->|Revise| RD
    A -->|Yes| B[Cursor builds with TDD]
    B --> V[Validate and run]
    V --> M[Manual practice-app smoke]
```

## 1. Check the prerequisites

Install or confirm:

- Git and a GitHub account with access to the template.
- Node.js **24.22.1 or newer** and npm.
- Wasp CLI compatible with the version declared in `main.wasp.ts`.
- PostgreSQL running locally.
- Claude Code for architecture and Cursor for implementation, if you want to
  follow the Playbook's intended agent separation.

Check the local tools:

```bash
git --version
node --version
npm --version
wasp version
psql --version
```

If Wasp is missing, follow the current
[official Wasp installation guide](https://wasp.sh/docs/quick-start). On
Windows, use WSL and keep the project in the Linux filesystem.

## 2. Create your practice repository

1. Open the
   [Wasp AI Development Template](https://github.com/bernardw01/deap-wasp-ai-template).
2. Select **Use this template**, then **Create a new repository**.
3. Name the repository `practice-task-tracker`.
4. Choose the owner and visibility, then create the repository.
5. On your computer, copy the clone URL from your new repository and run:

```bash
git clone YOUR_NEW_REPOSITORY_URL
cd practice-task-tracker
```

Do not fork the template. A repository created from a GitHub template has its
own history and is intended to become your independent application.

## 3. Personalize the starter

Run the repository bootstrap before adding domain features:

```bash
npm run bootstrap -- \
  --project-name "Practice Task Tracker" \
  --slug practice-task-tracker \
  --owner "Your Name"
npm install
```

Review the resulting changes:

```bash
git diff
npm run sdlc:check
```

Confirm that the project name changed in `package.json`, `main.wasp.ts`,
`.ai/project-profile.yaml`, and `.env.example`. Do not begin feature work if
bootstrap or the governance check fails.

## 4. Create and connect the PostgreSQL database

Create a local database using a PostgreSQL role that already exists on your
machine:

```bash
createdb practice_task_tracker
cp .env.example .env.server
```

Open `.env.server` and set the connection for your local role:

```dotenv
DATABASE_URL=postgresql://YOUR_POSTGRES_USER:YOUR_PASSWORD@localhost:5432/practice_task_tracker
```

If your local role uses peer authentication or no password, use the connection
format appropriate for that installation. Never commit `.env.server` or a real
password. Then initialize the schema:

```bash
npm run database:init
```

The starter requires PostgreSQL. Do not substitute SQLite for the exercise.

## 5. Create and approve the Engineering PRD

The Engineering PRD is the most important product-level artifact in this
exercise. It connects the reason for the application to stable requirements and
the engineering constraints that every future Feature RD must honor. Without
it, agents can produce individually plausible features that disagree about
users, data ownership, authorization, accessibility, reliability, or the
product's actual boundaries.

The PRD is broader than the first task-tracking feature. It answers:

- Who is the product for, and what evidence supports the problem?
- Which outcomes define success, and what is explicitly outside the product?
- What are the core domain concepts and ownership boundaries?
- Which functional and non-functional requirements are stable enough to trace?
- What must every feature preserve for security, data, accessibility,
  reliability, integrations, deployment, operations, and recovery?
- Which assumptions and decisions still need human resolution?

Give Claude Code this first architecture prompt:

```text
Act as the Architecture Agent defined by AGENTS.md and the DEAP AI SDLC
Playbook. Inspect the current repository and draft the Engineering Product
Requirements Document in docs/PRD.md for a bounded personal Practice Task
Tracker. Update docs only and do not create a Feature RD yet.

Preserve the template's PostgreSQL, email-as-username authentication, profile,
server authorization, WCAG 2.2 AA, and release-evidence requirements. Define
the users, problem evidence versus assumptions, measurable outcomes, goals,
non-goals, scope, domain and ownership model, system context, functional and
non-functional requirements, security/privacy, data lifecycle and recovery,
accessibility, reliability, observability, integrations, deployment context,
risks, dependencies, and open decisions. Give each requirement a stable FR-* or
NFR-* identifier. Use the bounded task requirements below as input. Leave the
document in Proposed status and present it for my review and explicit approval.
```

Use this bounded practice scope as input to the PRD:

```markdown
### Product purpose

Practice Task Tracker helps an individual signed-in user capture a short task
list and clearly see what remains to be done.

### Functional requirements

- **FR-TASK-001:** A signed-in user can create a task with a required title and
  optional description.
- **FR-TASK-002:** A signed-in user can view only their own tasks, ordered with
  incomplete tasks first and newest tasks first within each state.
- **FR-TASK-003:** A signed-in user can mark their own task complete or reopen it.
- **FR-TASK-004:** A signed-in user can delete their own task after confirmation.
- **FR-TASK-005:** Empty, loading, validation-error, and operation-error states
  are understandable and keyboard accessible.

### Out of scope

- Teams, assignments, due dates, priorities, labels, reminders, and sharing.
- Administrative task access and multi-tenancy.
```

The intentionally small scope is part of the exercise. Review Claude's complete
Engineering PRD, not only these task requirements. Resolve or explicitly defer
its open decisions. Confirm the product purpose, user, ownership model,
security boundary, success measures, non-goals, and operational expectations.

When the document matches your intent, explicitly approve that exact revision.
Record the Product Owner, version, approver, approval date, and `Approved`
status in `docs/PRD.md`. Do not ask Claude for the task Feature RD until this
product baseline is approved.

This full PRD exercise happens once because this is a new application. For later
features, you do not manually reopen the PRD on every iteration. Claude performs
the coverage check automatically while preparing each Feature RD. When existing
requirements cover the work, Claude cites them and leaves the PRD unchanged.
Only a genuine change to product purpose, users, scope, ownership, or a shared
engineering constraint produces a focused PRD update for your approval.

## 6. Have Claude produce the Feature RD

Give Claude Code this architecture prompt:

```text
Act as the Architecture Agent defined by AGENTS.md and the DEAP AI SDLC
Playbook. Inspect the approved Engineering PRD and current repository, then
update docs only. Turn FR-TASK-001 through FR-TASK-005 and their applicable
NFRs into one reviewable Feature RD using the next available Feature RD number.
Update docs/features/000-overview.md and docs/implementation-plan.md.

First perform the Playbook's automatic PRD coverage and impact check. If the
approved PRD already covers this feature, cite its IDs and do not edit the PRD.
If a genuine product-level gap exists, maintain the PRD as part of this same
architecture pass and show me the focused PRD diff for approval before
finalizing the dependent Feature RD.

The app is single-user-per-account, PostgreSQL-backed, and uses the existing
email/password authentication. Each Task must be owned by a User, and every
query and mutation must enforce ownership on the server. Include AC-* criteria,
the Prisma relationship, Wasp queries/actions, UI states, accessibility,
Vitest coverage, Playwright coverage, rollout, rollback, and manual smoke.
Do not edit application code or mark any acceptance criterion complete.
Present the RD for my approval before implementation.
```

Review the proposed Feature RD. Confirm that it:

- cites only approved Engineering PRD requirement IDs;
- traces to all five task requirements;
- keeps every operation authenticated and owner-scoped on the server;
- names the schema migration and Wasp operations;
- includes empty, loading, failure, keyboard, focus, and 320 px states;
- excludes teams, due dates, priorities, and other scope expansion;
- leaves every new acceptance checkbox unchecked.

Ask for revisions until the contract is unambiguous, then explicitly approve
that written revision.

## 7. Understand the target domain model

The Architecture Agent chooses the exact schema, but the approved design should
preserve this ownership relationship and simple state model:

```mermaid
erDiagram
    USER ||--o{ TASK : owns
    USER {
        string id PK
        string email
    }
    TASK {
        string id PK
        string userId FK
        string title
        string description
        datetime completedAt
        datetime createdAt
        datetime updatedAt
    }
```

```mermaid
stateDiagram-v2
    [*] --> Open: create task
    Open --> Completed: mark complete
    Completed --> Open: reopen
    Open --> [*]: confirm delete
    Completed --> [*]: confirm delete
```

`completedAt` is empty for an open task and records when a task was completed.
The server—not a client-side filter—must ensure users never read or modify
another user's tasks.

## 8. Have Cursor build the approved contract

After approval, give Cursor this implementation prompt:

```text
Act as the Implementation Agent defined by AGENTS.md and the DEAP AI SDLC
Playbook. Build the approved task-tracker Feature RD and only that RD.

Follow its implementation-plan slice and repository rules. Start with failing
AC-mapped tests, implement the minimum passing behavior, add the required
PostgreSQL migration and Playwright specification, and keep authorization on
the server. Do not add out-of-scope task features. During Build, run and report
the focused AC tests; do not silently claim Validate, Ship, or Deploy. Stop and
ask me if the approved RD leaves an architecture decision unresolved.
```

Review Cursor's diff before accepting the build. In particular, look for:

- a `Task` relationship to the authenticated user;
- server-side ownership predicates on list, update, and delete operations;
- AC identifiers in meaningful tests;
- no real credentials or generated Wasp output;
- no features outside the approved RD.

## 9. Validate and run the app

Apply the migration and run the complete local gate:

```bash
npm run database:init
npm run sdlc:validate
```

Validation must report the governance check, template structure, tests, and
Wasp compilation. Treat failed or skipped required checks as open work.

Start the application:

```bash
npm start
```

Open the client URL printed by Wasp—normally `http://localhost:3000`. Port
`3001` is normally the server API, not the browser UI.

## 10. Complete the manual practice-app smoke

Use two different email accounts so authorization is observable:

1. Sign up as `learner-one@example.com` using a local practice password.
2. Create a task with only a title and another with a title and description.
3. Confirm both appear in the expected order.
4. Complete one task, then reopen it.
5. Attempt an empty-title submission and confirm the error is understandable.
6. Delete one task and confirm cancellation and confirmation behave correctly.
7. Use the primary workflow with only the keyboard and confirm visible focus.
8. Resize to 320 px and confirm the page does not require horizontal scrolling.
9. Sign out, create `learner-two@example.com`, and confirm the first user's
   tasks are not visible.
10. Return to the first account and confirm its remaining task still exists.

Record what you observed in the Feature RD's `Verification` and `Manual smoke`
sections. Only then synchronize its acceptance checkboxes, implementation-plan
evidence, and Feature-RD index status.

## 11. Save the learning milestone

Review exactly what will be committed:

```bash
git status
git diff --check
git diff --stat
```

Commit and push only when you intend to publish this milestone. Building and
validating do not themselves authorize Ship or Deploy under the Playbook.

## Completion checklist

- [ ] Independent GitHub repository created from the template.
- [ ] Project personalized and dependencies installed.
- [ ] Local PostgreSQL database initialized.
- [ ] Engineering PRD reviewed, approved, versioned, and traceable.
- [ ] Feature RD reviewed and explicitly approved before code changes.
- [ ] Cursor implemented through AC-mapped TDD.
- [ ] Ownership enforced and tested on the server.
- [ ] `npm run sdlc:validate` passed.
- [ ] Manual smoke completed with two accounts and keyboard/reflow checks.
- [ ] Evidence and Feature-RD statuses accurately updated.

You now have both a working practice application and a complete example of the
DEAP AI SDLC Playbook in use.
