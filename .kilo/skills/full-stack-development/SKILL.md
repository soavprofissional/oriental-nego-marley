---
name: full-stack-development
description: Build and maintain full-stack web applications (frontend + backend + data). Use when designing APIs, data models, auth, or end-to-end features. Covers architecture, API design, database, security basics, and deployment hygiene.
---

# Full-Stack Development

Deliver coherent features across the whole stack.

## Architecture

- Separate concerns: presentation, domain logic, data access, infrastructure.
- Keep frontend and backend contracts explicit (OpenAPI/TypeScript types).
- Share types via a common package or generated clients; avoid drift.
- Prefer stateless services; externalize session/state to DB/cache.

## API Design

- RESTful resources with predictable nouns and HTTP verbs.
- Consistent error format: `{ error: { code, message, details } }`.
- Version APIs (`/api/v1/...`) or use content negotiation.
- Paginate lists (`limit`/`cursor`); never return unbounded collections.
- Validate input at the boundary (zod/joi/JSON Schema); reject unknown fields.
- Use idempotency keys for mutating endpoints.
- Document with OpenAPI; generate client types.

## Data & Database

- Normalize for correctness; denormalize for read performance deliberately.
- Add indexes for query patterns; measure with `EXPLAIN`.
- Use migrations; never edit applied migrations.
- Wrap multi-step writes in transactions.
- Soft-delete when audit matters; hard-delete with cascade care.
- Back up before destructive operations.

## Authentication & Authorization

- Use established auth (OAuth/OIDC, session cookies, JWT with short expiry).
- Store passwords with bcrypt/argon2; never plaintext.
- Enforce authorization on every endpoint (server-side), not just UI.
- Principle of least privilege for DB/service accounts.
- Rotate secrets; use a secret manager.

## State Management (Frontend)

- Server state via query cache (React Query/SWR); client state minimal.
- Avoid duplicating server data in global state.
- Optimistic updates with rollback on failure.

## Error Handling

- Distinguish user errors (4xx) from server errors (5xx).
- Log server errors with context; don't leak stack traces to clients.
- Provide user-friendly messages; keep technical detail in logs.

## Performance

- Cache at the right layer (HTTP, app, DB).
- Avoid N+1 queries; use eager loading/joins.
- Compress responses; use CDN for static assets.
- Lazy-load routes and heavy components.

## Observability

- Structured logs (JSON) with request IDs.
- Metrics: latency, error rate, throughput.
- Tracing for distributed requests.
- Health check endpoints (`/health`, `/ready`).

## Deployment Hygiene

- 12-factor: config via env, stateless processes.
- Run migrations before app start; rollback plan documented.
- Feature flags for risky changes.
- Zero-downtime deploys; graceful shutdown handling.

## Checklist Before Shipping

- [ ] API contract updated and clients regenerated.
- [ ] Migrations tested up and down.
- [ ] Auth/authz verified for each role.
- [ ] Error cases handled and logged.
- [ ] Performance sanity-checked.
- [ ] Rollback plan exists.
