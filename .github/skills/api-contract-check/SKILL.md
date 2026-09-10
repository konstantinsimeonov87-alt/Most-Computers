---
name: api-contract-check
description: Check typed contracts between SvelteKit, Supabase, Algolia and external integrations for compatibility and safe errors.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# API Contract Check

Use after changing request/response shapes, database fields, search indexes or auth claims.

## Procedure

1. Identify the canonical schema/type for each changed boundary.
2. Compare frontend types, server validation, Supabase generated types and persisted schema.
3. Check nullable fields, pagination, sorting, errors, auth claims and backward compatibility.
4. Validate Algolia index fields and filter/facet contracts.
5. Add or update focused contract tests using representative valid and invalid payloads.
6. Report breaking changes and required coordinated deployments.

Do not use `any`, silent defaults or unchecked casts to hide a contract mismatch.
