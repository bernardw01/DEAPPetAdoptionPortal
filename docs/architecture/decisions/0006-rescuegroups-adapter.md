# ADR 0006 - RescueGroups integration behind an adapter

## Status

Proposed

## Context

RG v5 public API is read-only, labeled beta, with long pending community
requests. Terms: public key required for public display, one key per service,
cache only for temporary display with at least weekly refresh, purge on request
within one business day, test data never public, and a required image on public
pet detail pages. Public keys can see animals and organizations only.

## Decision

- Define `AnimalSource` (list available, list adopted, get animal, lookups,
  org) returning a normalized `SourceAnimal`. Implement `RgV5Source`, and
  `FixtureSource` for tests. `RgV2Source` and `FtpExportSource` are reserved.
- Only the adapter knows JSON:API. Parse every response with zod at the boundary.
- Throttled client with token bucket, backoff and jitter on 429 and 5xx, circuit
  breaker, and `transactionId` logging.
- Hourly full snapshot of `available`, nightly `adopted`, weekly lookups.
- Never mirror foster or contact records. Request only the includes we use.
  Never store raw payloads in production.
- Production config rejects test hosts at startup.
- Contract tests with sanitized fixtures in CI, live smoke tests against the test
  environment on demand and nightly.

## Alternatives considered

- Call RG from the browser: leaks the key and violates rate and terms posture.
- Incremental sync: see architecture section 10.
- Use RG's embeddable widgets: not mobile friendly, no control, no SEO.

## Consequences

- A normalized model means some mapping code, which is the intended insulation.
- Any RG schema change surfaces as a failed contract test or a sync alert, not
  an outage.

## Verification and revisit triggers

Complete the live verification calls in `data-model.md` section 6 before the
mapping Feature RD is approved. Revisit if RG announces v5 write access, v2
sunset, or rate limit changes.
