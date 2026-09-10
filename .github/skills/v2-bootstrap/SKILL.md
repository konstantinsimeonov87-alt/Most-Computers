---
name: v2-bootstrap
description: Bootstrap and validate the Most Computers V2 SvelteKit foundation, including Tailwind v4, tokens, aliases, env and project conventions.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# V2 Bootstrap

Use when starting V2 or repairing its foundation. Confirm SvelteKit, Tailwind CSS v4, TypeScript, Vercel, Supabase and Algolia choices before changing configuration.

## Procedure

1. Inspect the existing package manifest, `src/`, config files and environment examples.
2. Create only missing foundation pieces: routes/layouts, shared aliases, design tokens, typed env access and server/client boundaries.
3. Keep secrets server-only; expose only deliberately public variables.
4. Validate with the repository's existing type-check, tests and build commands.
5. Report changed files, remaining manual environment setup and validation results.

Never overwrite existing project configuration blindly. Preserve working conventions and fail explicitly when a required environment variable is absent.
