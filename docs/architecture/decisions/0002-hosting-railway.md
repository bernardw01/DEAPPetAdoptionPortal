# ADR 0002 - Hosting on Railway

## Status

Proposed

## Context

Volunteer-run nonprofit, low cost, minimal operations. DEAP already deploys on
Railway and the repo ships a Railway capability pack and deployment safeguards.
Wasp produces a static client build and a Node server. We need Postgres, a media
bucket, scheduled jobs and per environment secrets.

## Decision

Railway, one project with `staging` and `production` environments. Services:
`web` (static client), `api` (Wasp server and jobs), `edge` (small reverse proxy
that routes dynamic HTML paths to `api` and everything else to `web`),
PostgreSQL, and a storage bucket for media and backups. Install the railway
capability pack. Target cost: about USD 20 to 35 per month (estimate; confirm
from Railway pricing and measured usage).

Account ownership: recommend a Railway workspace owned by DEAP for build and
run, with a documented transfer or billing handover path if the client contract
requires client ownership (open question OQ-06).

## Alternatives considered

- Fly.io or Render: comparable; no advantage that offsets losing the existing
  DEAP workflow and capability pack.
- Vercel plus Neon: poor fit for a Wasp Node server and pg-boss jobs.
- DigitalOcean App Platform or a VPS: cheaper at the margin but more operations
  burden.
- Cloudflare in front for CDN: optional later; not required at this traffic.

## Consequences

- One vendor for app, database and storage; a Railway outage is a site outage.
- Backups must not rely only on the platform; we add our own nightly dump to a
  separate bucket (ideally a different provider) and rehearse restores.
- Single region, no paging rota; stated in the PRD availability target.

## Verification and revisit triggers

Confirm Railway backup features, private networking between services and bucket
support with the Railway MCP or docs during the walking skeleton. Revisit if
monthly cost exceeds NFR-COST-001, or on repeated platform incidents.
