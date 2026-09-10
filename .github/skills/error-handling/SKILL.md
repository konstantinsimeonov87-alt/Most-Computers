---
name: error-handling
description: Design explicit, safe and observable error handling for V2 UI, server actions, APIs and integrations.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# Error Handling

Use when implementing or changing validation, server actions, API calls, database access or user-facing failure states.

## Procedure

1. Classify failures as validation, authentication, authorization, not-found, conflict, rate-limit, transient or internal.
2. Validate input at the boundary and return the repository's standard response/error shape.
3. Show safe, actionable user messages without exposing secrets, SQL, stack traces or PII.
4. Log diagnostic context server-side with a request/correlation ID where available.
5. Retry only idempotent transient operations, with bounded backoff; do not retry validation or authorization errors.
6. Provide loading, error, retry and recovery states in the UI.
7. Test every relevant failure path and verify that failures cannot return a success-shaped response.

Never use empty catches, silent fallbacks or broad error swallowing.

```ts
try {
  return await createOrder(input);
} catch (error) {
  logger.error({ error, requestId }, 'Order creation failed');
  throw error(500, 'Поръчката не може да бъде създадена');
}
```
