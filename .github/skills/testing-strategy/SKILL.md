---
name: testing-strategy
description: Choose and validate the right unit, integration, component and end-to-end tests for V2 changes.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# Testing Strategy

Use when planning a feature, refactor or bug fix, and before deciding that a change is sufficiently tested.

## Procedure

1. Identify the changed behavior and its risk: pure logic, UI state, server action, database access or full customer journey.
2. Choose the smallest effective test level:
   - unit for deterministic utilities and business rules;
   - component for rendering, interaction and accessibility states;
   - integration for server/database/external contracts;
   - E2E for critical journeys such as search, cart, checkout, auth and purchase.
3. Define success, invalid input, authorization, empty, loading, retry and failure cases.
4. Add regression coverage for the reported bug before or with the fix.
5. Keep tests deterministic: isolate time, randomness, network and external services with explicit fixtures/mocks.
6. Run focused checks first, then the repository's broader suite when shared code or critical flows changed.

## Quality bar

Tests must verify observable behavior, not implementation details. A green test suite is not sufficient when an important failure path, permission boundary or responsive state is untested.

Report coverage gaps and flaky tests explicitly; never skip a failing test to make a run appear successful.
