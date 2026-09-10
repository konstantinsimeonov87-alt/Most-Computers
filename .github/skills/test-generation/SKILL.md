---
name: test-generation
description: Write focused regression and behavior tests for new or changed V2 code.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# Test Generation

Use immediately after implementing or modifying V2 code.

## Procedure

1. Read the implementation, its types, callers and existing neighboring tests.
2. Create the smallest fixture that represents a real user or API scenario.
3. Cover the happy path and the relevant boundary cases:
   - malformed or missing input;
   - empty and loading states;
   - unauthorized or forbidden access;
   - database/network failure and retry;
   - duplicate submission or repeated navigation;
   - currency, quantity, date and pagination boundaries.
4. Assert user-visible output, returned data, side effects and error behavior.
5. Add a regression test that fails before the fix whenever practical.
6. Run the focused test command, then type-check and related tests.

## Rules

- Reuse the repository's existing test runner, fixtures and setup.
- Do not test private implementation details when behavior assertions are possible.
- Do not make real payment, analytics, email or production database calls.
- Do not weaken assertions, add arbitrary sleeps or silently skip failures.
- Keep tests independent, repeatable and readable.

## Example

```ts
it('rejects an order when the server recalculates a different total', async () => {
  const response = await submitOrder({ items: validItems, total: 1 });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({ message: 'Невалидна сума на поръчката' });
});
```
