# server — Fastify worker (Phase 2)

Placeholder. The Node.js (Fastify) worker service lands in **Phase 2**: the
fair-matching engine, feed generation, score recompute, and over-exposure decay
(Spec §2, §6). It will read/write Postgres via the `service_role` key and use
Redis (Upstash) for feed queues, rate limits, and the active-match counters.

Kept as an empty folder for now so the repo layout is stable. When this gains
real code, promote shared types (`src/lib/providers`, `src/config`) into a
workspace package consumed by both the app and this service.
