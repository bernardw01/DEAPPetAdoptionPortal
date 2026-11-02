# Delivery Plan

Status: Proposed. This is a planning document. Under the repo's SDLC, work
enters `docs/implementation-plan.md` only when its Feature RD is approved, and
planned work is never shown as completed. Hour figures are estimates for
AI-assisted delivery by one senior engineer plus an architect, human review
included, with a +/- 25 percent range. They are not a quote; any change to cost
or client contract needs Bernard's decision (see open questions OQ-01).

## 1. Phases, hours and exit evidence

| Phase | Outcome | Hours (est.) | Feature RDs (indicative) | Exit evidence |
|---|---|---|---|---|
| 0 Walking skeleton | Feature RD 009 baseline branded site (tokens, header nav, footer, prerendered public routes, test harness), Railway staging, edge router, prerender and SEO shell spike (S1), CI | 45 to 65 | 009 Baseline site (first); 010 Railway and edge; SEO spike | RD 009 criteria evidenced; S1 settles prerender vs shell split and proves server HTML and structured data on a sample animal page; staging deploy; `sdlc:validate` green |
| 1 Catalog and sync | Adapter, hourly sync, animal list and detail, filters, search, badges, attribution, freshness fallback | 80 to 105 | RG adapter and sync; Catalog; Animal detail; Site search | Contract tests green; live smoke vs RG test env; Lighthouse budgets; axe clean |
| 2 Applications and admin | Auth upgrade and roles; five application types; encryption, audit, retention; reviewer queue; notifications | 100 to 135 | Auth and roles; Application platform plus dog form; Other four forms; Review admin; Retention and audit | Role matrix, encryption and audit tests; e2e submit and review; restore of encrypted data rehearsed |
| 3 Accounts and favorites | Favorites, saved criteria alerts, account area | 40 to 55 | Favorites; Alerts | Idempotent alerts test; unsubscribe e2e |
| 4 Content migration and redirects | CMS (pages, events, stories, banners, promos, wish list), story submissions, content import, redirect table and rules, sitemap | 55 to 75 | CMS foundation; Events and stories; Content migration; Legacy redirects | Page parity checklist; redirect crawl diff has zero unexplained misses |
| 5 Launch hardening | Performance and accessibility pass, monitoring, backups and restore drill, runbooks, admin guide, RG key to Public, cutover | 40 to 55 | Hardening; Operations; Cutover | Full validation; restore drill evidence; rollback rehearsal; volunteer walkthrough signed |
| Project management and client time | Check-ins, approvals, content chasing | 25 to 35 | n/a | n/a |
| **Total** | | **385 to 520** | | |

Phases 1 and 2 can overlap after Phase 0 if two agents use separate worktrees.
Feature RD 009 defines the first browser and component test commands (`npm test`
runs client unit tests only today and no jsdom, Testing Library or Playwright is
installed).

## 1a. Sequencing (Product Owner direction, 2026-11-02)

1. **First capability: Feature RD 009, baseline branded site** with header
   navigation, footer, tokens, prerendered public routes and the minimum test
   harness it needs (component tests, Playwright with axe, prerender build
   check). It is the first visible milestone and the first of Phase 0.
2. Then in Phase 0: Railway staging and edge router (RD 010), spike S1 (below),
   CI additions.
3. Application forms: Feature RDs are written now with the fields we know and
   updated as Barb supplies the remaining field lists. Missing field lists
   therefore no longer block Phase 2 from starting; they gate only the final
   approval of each affected form RD.

## 2. Spike S1: prerender depth and SEO shell on Wasp (inside Phase 0, 8 hours max)

- Question: for data-driven routes, how much can prerender deliver (head and
  meta handling, enumerated paths, build-time data, hydration match), and can
  the edge router plus server shell cover the rest with per page title,
  canonical, Open Graph, JSON-LD and a content block as first byte HTML for an
  animal page, while the React app hydrates cleanly?
- Pass: Rich Results Test reads the structured data; `curl` without JavaScript
  shows name, summary and image; LCP at or under 2.5 s on a throttled phone
  profile; no hydration errors.
- Fail path: stop and escalate. The options (an exception to the standard stack,
  or a separate server rendered public site) are the Product Owner's decision
  and would trigger a PRD diff.

## 3. Testing approach (tests before code)

| Layer | Tooling | Notes |
|---|---|---|
| Unit | Vitest | Domain logic: tag parsing, age groups, status machine, encryption, retention, alert matching |
| RG adapter contract | Vitest plus sanitized recorded fixtures and zod schemas | Run in every CI build; fixtures refreshed by a reviewed script |
| RG live smoke | Vitest against the RG test environment | On demand and nightly from CI secrets, never in the PR gate, never logs the key |
| Integration | Vitest with a real PostgreSQL service | Migrations on empty and seeded DB, sync upserts, search queries, authorization |
| E2E and accessibility | Playwright plus axe | Primary paths: find an animal, apply, favorite, review, edit content; keyboard only; 320 px; focus checks |
| Performance | Lighthouse CI budgets, field Web Vitals | NFR-PERF-001 |
| Security | Role matrix tests, enumeration tests, sanitizer tests, log redaction test, dependency audit | NFR-SEC-* |
| Redirects | Crawl list from the live site replayed against staging | Zero unexplained misses |
| Restore | Scripted restore into a scratch database | Evidence stored with the release record |

Each Feature RD names `AC-*` criteria; each test file name starts with its AC id
(repo rule). Evidence is recorded as observed commands and totals, never inferred.

## 4. Environments

See [architecture.md](architecture.md) section 8. Local uses fixtures and the RG
test environment. Staging mirrors production on Railway, password protected and
`noindex`, with synthetic applicants only. Production runs the Public key.
Production refuses to start against a test RG host.

## 5. CI/CD

- CI: the repository's GitHub Actions run `npm run sdlc:validate` (governance,
  template checks, tests, Wasp compile). Add Postgres service, Playwright, axe,
  Lighthouse CI and the contract suite through Feature RDs.
- Build, Validate, Ship and Deploy stay separate (SDLC chapter 6). Deploys go to
  Railway only from a clean, validated commit with explicit Release Authority
  approval. Staging deploys may be authorized as a standing policy; production
  never.
- Migrations run as a deploy step with a pre-deploy backup check; failures stop
  the deploy.
- Release notes from `CHANGELOG.md`; immutable tag per release.

## 6. Monitoring and backups

- Uptime on home, an animal page and API health; sync freshness alert at 6 hours;
  429 and schema error alerts; error tracking; email delivery failures; job
  heartbeats.
- Alert routing: DEAP primary, a named rescue contact secondary (OQ-28).
- Backups: nightly encrypted dump to a separate bucket, 30 day retention,
  encryption key ring stored separately; quarterly restore rehearsal; first one
  before launch. RPO 24 hours, RTO 4 hours.

## 7. Release and rollback checklist

Pre-release:
- [ ] Feature RD and index statuses accurate; criteria evidenced
- [ ] `npm run sdlc:validate` passed on the exact clean SHA
- [ ] Migration reviewed for compatibility and rollback; backup confirmed
- [ ] Secrets present in the target environment; no secret in repo or logs
- [ ] Release Authority approval recorded

Deploy and confirm:
- [ ] Target project, environment, service and database resolved
- [ ] Deployed SHA equals validated SHA
- [ ] Migration applied and result captured
- [ ] Smoke checklist passed: home, animals list with filter, animal page with
      structured data, apply form submits on staging, admin login, sync freshness
      shown, a legacy URL redirects
- [ ] Monitoring green for the observation window

Rollback:
- Triggers: failed smoke, sustained error rate, data corruption, sync damage.
- Application rollback: redeploy the previous immutable release on Railway.
- Data: code rollback does not reverse migrations; use forward fixes or restore
  from backup for data loss; animal cache is rebuildable by a full sync.
- After: rerun smoke, record incident and evidence, update runbook.

Launch specific:
- [ ] RG key status set to Public, key record accurate, required image present
- [ ] DNS cutover plan with TTL lowered, mail records preserved, rollback DNS ready
- [ ] Redirect crawl diff clean; sitemap submitted to Search Console
- [ ] Old RG site kept reachable under a fallback hostname for a grace period if allowed

## 8. Smoke test checklist (living)

Keep one list in `docs/operations/` once the first deploy exists: public
browse, filter and share; animal page; apply (staging data); admin review;
content edit; banner flip; redirect samples; sync freshness; backup success.

## 9. Governance tasks

1. Approve `docs/PRD.md` (this proposal).
2. Personalize the template with `npm run bootstrap` and add capability packs
   `railway` and `shadcn` (an Implementation Agent action; Architecture does not
   modify scripts or manifests).
3. Add the first Feature RDs to `docs/features/` and `000-overview.md` as each is
   authored, one at a time, with approval gates.
4. Extend `docs/operations/deployment.md` and `rollback.md` during Phase 0 and 5.
