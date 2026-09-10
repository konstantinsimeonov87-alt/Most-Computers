---
name: code-quality
description: Write correct, type-safe and maintainable V2 code with explicit validation, error handling, tests and repository conventions.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# Code Quality

Use when implementing or materially refactoring V2 code. This skill governs how code is written, not only how an existing diff is reviewed.

## Before coding

1. Read the relevant route, component, server module, types and tests.
2. Search for an existing helper or pattern before introducing a new one.
3. Define the input/output contract and failure states.
4. Identify whether the code is server-only, browser-only or shared.

## Implementation rules

- Keep TypeScript strict and model real states with types; do not use `any` or unchecked casts to hide uncertainty.
- Validate external input at the boundary: forms, URL params, API responses, feed data and database results.
- Treat client input, prices, roles and redirect URLs as untrusted.
- Use explicit error handling with useful user-safe messages and server-side diagnostics; never swallow exceptions or return a success-shaped fallback.
- Keep secrets and privileged Supabase operations in server-only modules.
- Prefer small, composable functions with one responsibility and stable interfaces.
- Reuse shared schemas, types, constants and utilities instead of duplicating business rules.
- Preserve accessibility: semantic HTML, labels, keyboard behavior, focus states and meaningful loading/error/empty states.
- Keep UI behavior responsive and avoid unnecessary client-side work when SvelteKit server rendering is appropriate.

## Validation

1. Run the smallest existing formatter, type-check and test command covering the change.
2. Add or update focused tests for success, invalid input, authorization and failure paths.
3. Test loading, empty, error, retry and boundary cases.
4. Inspect the final diff for unrelated changes, dead code, debug output and secret exposure.
5. Report what was validated and any checks that could not be run.

## Right vs wrong

```ts
// Wrong: trusts client input and hides database failures.
const total = Number(formData.get('total'));
try {
  await saveOrder({ total });
} catch {
  return { success: true };
}

// Right: validates at the boundary and surfaces failure explicitly.
const parsed = orderSchema.safeParse(readOrderInput(formData));
if (!parsed.success) {
  return fail(400, { message: 'Невалидни данни за поръчката' });
}

const result = await saveOrder(parsed.data);
if (result.error) {
  throw error(500, 'Поръчката не може да бъде записана');
}
```

Correctness means the implementation is type-safe, handles failure explicitly, preserves security and accessibility, and is verified by the repository's existing checks.
