---
name: e2e-release-gate
description: Run the pre-release end-to-end gate for V2 customer journeys, integrations, accessibility, SEO and production configuration.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# E2E Release Gate

Use before deploying V2 to preview or production.

## Checklist

- Homepage, category, search and PDP
- Cart, checkout, order confirmation and failure recovery
- Auth, wishlist and role-protected admin flows
- Mobile viewport, desktop viewport, keyboard and dark mode
- Metadata, canonical URLs, structured data, analytics and consent
- Type-check, tests, build, environment variables and deploy configuration

Return `GO`, `GO WITH RISKS` or `NO-GO`. Every failure needs evidence, severity and reproduction steps; do not mask flaky or missing checks.
