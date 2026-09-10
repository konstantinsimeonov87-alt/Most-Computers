---
name: typescript-strictness
description: Enforce strict, sound TypeScript in V2 and remove unsafe any, casts and unchecked external data.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# TypeScript Strictness

Use when adding or refactoring TypeScript, Svelte components, server code or integration types.

## Procedure

1. Inspect `tsconfig` and the existing strictness baseline.
2. Type external boundaries explicitly: form data, URL params, API responses, Supabase rows and Algolia records.
3. Replace `any`, unsafe assertions and non-null assertions with real types, schemas, guards or explicit error handling.
4. Keep server-only and browser-only types separated.
5. Update generated database types through the repository's existing process instead of hand-maintaining duplicates.
6. Run the narrowest existing type-check, then related tests.

Never silence a compiler error with `any`, `as unknown as`, `@ts-ignore` or a non-null assertion unless the invariant is proven and documented.
