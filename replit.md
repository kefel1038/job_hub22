# PlacementBridge Workspace

## Overview

PlacementBridge is a trust-based AI-powered hiring platform focused on the Qatar/GCC job market. It stands apart by surfacing only AI-verified jobs — combating fake listings and improving hiring trust.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Routing**: wouter

## Architecture

```
artifacts/placementbridge/   # React + Vite frontend
artifacts/api-server/        # Express 5 REST API
lib/api-spec/openapi.yaml    # OpenAPI contract (source of truth)
lib/api-client-react/        # Generated React Query hooks
lib/api-zod/                 # Generated Zod validation schemas
lib/db/                      # Drizzle ORM schema + client
```

## Database Schema

- `jobs` — Job postings with verification status, salary, apply methods
- `companies` — Company profiles with verified badge
- `applications` — Job applications
- `categories` — Job categories with slug

## Key Features

- **AI Job Verification** — Scores jobs 0-100 based on email domain, description quality, salary info, etc.
  - Verified (75+), Risky (40-74), Fake (<40)
- **WhatsApp / Email / URL Apply** — Multiple application methods per job
- **Verification Badges** — Visual trust indicators on jobs and companies
- **Category Browser** — 10 GCC-focused job categories
- **Dashboard Stats** — Real-time platform metrics

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Important Notes

- After `pnpm --filter @workspace/api-spec run codegen`, you MUST manually fix `lib/api-zod/src/index.ts` to only contain `export * from "./generated/api";` — Orval regenerates it with extra exports that cause duplicate export conflicts.
- All date fields from DB must be converted via `serializeDates()` in `artifacts/api-server/src/lib/serialize.ts` before Zod parsing (DB returns Date objects, Zod expects strings).

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
