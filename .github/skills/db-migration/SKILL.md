---
name: db-migration
description: Design, validate and apply safe Supabase database migrations with RLS, dry-runs and rollback awareness.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# Database Migration

Use for Supabase schema, index, constraint, trigger or RLS changes.

## Procedure

1. Read the current schema and migration history before writing SQL.
2. Define the compatibility impact and whether the change is additive, backfill, or breaking.
3. Write an idempotent migration with explicit constraints, indexes and RLS policies.
4. Test representative reads/writes as anonymous, authenticated and admin users.
5. Run a dry-run or local migration check before applying remotely.
6. Document backfill, verification, rollback/forward-fix and production timing.

Never put credentials in migrations. Do not drop or rewrite production data without explicit approval.
