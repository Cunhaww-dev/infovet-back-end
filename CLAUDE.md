# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # development server with watch mode (tsx)
npm run build        # compile to dist/server.js with tsup (CJS)
npm run start        # run compiled output (production)
npm run lint         # biome check src
npm run format       # biome format --write src
npm run db:generate  # generate migration from schema changes
npm run db:migrate   # run pending migrations against the database
npm run db:studio    # open Drizzle Studio (visual DB browser)
```

## Code style

Biome enforces: 2-space indent, single quotes, no semicolons, trailing commas (ES5). All code identifiers (variables, functions, files, columns) are in English. User-facing error messages may be in Portuguese.

## Architecture

Feature modules live under `src/modules/<feature>/` with four files:

- `<feature>.schema.ts` — Zod schemas for request body validation + exported inferred types
- `<feature>.service.ts` — all business logic and DB queries; never imports `Request`/`Response`
- `<feature>.controller.ts` — parses/validates `req.body` with Zod `safeParse`, calls service, maps errors to HTTP status codes
- `<feature>.routes.ts` — registers Express routes, imports controller handlers

The controller is the only layer that translates service errors into HTTP responses. Services throw plain `Error` instances; controllers catch them and map to the appropriate status code.

## Database

Drizzle ORM with MySQL2. Schema files live in `src/db/schema/` — one file per table. Each schema file exports the table definition and its inferred TypeScript types (`$inferSelect`, `$inferInsert`). The `src/db/index.ts` exports the `db` client used everywhere.

`drizzle.config.ts` (root) points drizzle-kit at `src/db/schema/` and outputs migrations to `drizzle/`. Migrations are committed to git.

Column naming uses snake_case in the database (`password_hash`, `created_at`) and camelCase or snake_case in TypeScript matching the Drizzle field key.

## Path alias

`@/*` maps to `src/*`. Always use `@/` for internal imports, except within the same module directory where relative imports are also acceptable.

## Authentication

The `authenticate` middleware lives at `src/middlewares/authentication.ts`. It verifies the `Authorization: Bearer <token>` header and injects `req.user = { id: number }` into the request. The TypeScript global augmentation for `req.user` is declared in that same file.

Usage on protected routes:
```ts
router.get('/resource', authenticate, handlerFunction)
```

## Multi-tenant isolation

Every future table (beyond `veterinarians`) must have a `veterinarian_id` column. All queries must filter by `req.user.id` injected by the `authenticate` middleware — never trust `veterinarian_id` from the request body or URL params.

## Build

tsup compiles `src/server.ts` to `dist/server.js` (CommonJS, forced `.js` extension via `outExtension` for Hostinger compatibility). The `type: "module"` in `package.json` applies to source files only.

## Environment

Variables validated with Zod at startup in `src/config/env.ts`:
- `DATABASE_URL` — MySQL connection string
- `JWT_SECRET` — minimum 16 characters
- `JWT_EXPIRES_IN` — e.g. `7d`
- `PORT` — defaults to 3000
- `NODE_ENV` — `development` | `production` | `test`
