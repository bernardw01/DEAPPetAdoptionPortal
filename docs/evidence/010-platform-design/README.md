# Feature RD 010 Build evidence

Observed 2026-11-02 during Implementation Agent Build (not Validate).

## Commands

- `npm run sdlc:check` — pass
- `wasp compile` — pass
- `npm test -- --run` — 29 passed
- `npm run test:prerender` — 11 prerendered public routes
- `npm run test:e2e` — 10 passed
- `npm run test:lighthouse` — performance 66, LCP 6.9 s, CLS 0 (**AC-PERF-01 miss**)

## Visuals

- `home-1280.png`
- `home-768.png`
- `home-390.png`
- `home-320.png`

## Notes

- Fraunces/Figtree removed; Inter OFL self-hosted.
- Fixture animals only; no live RescueGroups.
- Newsletter submit prevented; pet finder GET-scaffolds `/animals`.
- Full `npm run sdlc:validate` not run in this Build pass.
