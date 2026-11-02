# ADR 0005 - Database, caching and search

## Status

Proposed

## Context

PostgreSQL is mandatory (NFR-DATA-001). We cache RG animals locally, store
native content and encrypted applications, and need fast filtering and site
search for a few hundred animals and a modest amount of content.

## Decision

- One PostgreSQL database through Prisma with committed migrations.
- Animals: promoted typed columns for everything filtered, sorted or shown on
  cards; a validated `traits` JSONB column for the long tail of display only RG
  attributes, so RG adding or renaming a field does not require a migration.
- Internal UUID primary key plus `(source, sourceId)` unique, so the data source
  can change without rekeying.
- Search: Postgres full text (`tsvector` with GIN) over animals, stories and
  pages, three scopes as in the synopsis. No external search service.
- Application answers: versioned schemas validated with zod, stored encrypted.
- Jobs: pg-boss through Wasp jobs, in the same database.
- Cache policy: animal rows are disposable and rebuildable; content and
  applications are the data that must survive restores.

## Alternatives considered

- Algolia or Meilisearch: unnecessary at this size, extra cost and sync.
- One table per RG attribute mirror (the draft model): large and brittle for a
  beta API.
- Redis cache: not needed.

## Consequences

- Filter performance depends on a handful of indexes; verify with realistic
  data volume.
- JSONB traits are not queryable by default; promote a field to a column when it
  becomes a filter.

## Verification and revisit triggers

Query plan checks on the catalog at 1,000 animals; migration tests on empty and
seeded databases. Revisit if animal count exceeds about 5,000 or search quality
is poor.
