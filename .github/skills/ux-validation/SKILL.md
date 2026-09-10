---
name: ux-validation
description: Validate V2 user experience, information architecture, conversion flows and interaction states across mobile and desktop.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# UX Validation

Use when designing or changing navigation, search, product discovery, cart, checkout, auth or other customer journeys.

## Procedure

1. Define the user goal, entry point, expected outcome and primary success metric.
2. Map the shortest happy path and identify friction, ambiguity, dead ends and unnecessary decisions.
3. Check information architecture, labels, hierarchy, navigation, search/filter behavior and back navigation.
4. Validate all meaningful states: first visit, loading, empty, error, retry, success, signed-out and signed-in.
5. Test mobile-first at narrow and wide breakpoints, then desktop; include keyboard and touch interactions.
6. Check trust signals, price clarity, delivery/returns information and confirmation before irreversible actions.
7. Report findings with severity, affected journey, evidence and a prioritized recommendation.

## Quality bar

Recommendations must be tied to a user task or measurable risk. Do not optimize a screen in isolation if the change makes the broader journey less clear.

## Example

```text
Problem: Search filters reset after returning from a product page.
Impact: Users lose discovery context and repeat work.
Recommendation: Preserve filter/query state in the URL and restore it on back navigation.
Acceptance: Back navigation restores query, filters, sort and scroll position on mobile and desktop.
```
