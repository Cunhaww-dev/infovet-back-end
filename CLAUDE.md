# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # development server with watch mode (tsx)
npm run build        # compile to dist/ with tsup
npm run lint         # biome check
npm run format       # biome format --write
npm run db:generate  # generate migration from schema changes
npm run db:migrate   # run pending migrations against the database
```

## Code style

Biome enforces: 2-space indent, single quotes, no semicolons, trailing commas (ES5). Imports are auto-organized on save.

## Architecture

Feature modules live under `src/modules/<feature>/` with four files each:

- `auth.schema.ts` — Zod schemas for request body validation + exported inferred types
- `auth.service.ts` — all business logic; no knowledge of HTTP (never imports `Request`/`Response`)
- `auth.controller.ts` — parses/validates req body with Zod `safeParse`, calls service, maps errors to HTTP status codes
- `auth.routes.ts` — registers Express routes, imports controller handlers

The controller is the only layer that translates service errors into HTTP responses. Services throw plain `Error` instances with human-readable messages; controllers catch them and map to the appropriate status code.

## Database

Drizzle ORM with MySQL2. Schema files live in `src/db/schema/` — one file per table. Each schema file exports the table definition and its inferred TypeScript types (`$inferSelect`, `$inferInsert`). The `src/db/index.ts` exports the `db` client used everywhere.

`drizzle.config.ts` (root) points drizzle-kit at `src/db/schema/` and outputs migrations to `drizzle/`. Migrations are committed to git.

## Path alias

`@/*` maps to `src/*`. Always use `@/` for internal imports.

## Multi-tenant isolation

Every table has a `veterinario_id` column. All queries must filter by `req.user.id`, which is injected by the `authenticate` middleware from the JWT payload — never from the request body or URL params. This is what prevents cross-tenant data access.

## Environment

Required variables (validated with Zod in `src/config/env.ts` at startup):
- `DATABASE_URL` — MySQL connection string
- `JWT_SECRET` — minimum 16 characters
- `JWT_EXPIRES_IN` — e.g. `7d`
