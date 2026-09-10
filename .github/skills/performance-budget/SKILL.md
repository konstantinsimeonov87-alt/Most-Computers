---
name: performance-budget
description: Measure and enforce V2 bundle, loading, Core Web Vitals, image and runtime performance budgets.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# Performance Budget

Use for performance-sensitive changes and before release.

## Procedure

1. Record a baseline for JS/CSS size, request count, build output and representative routes.
2. Measure LCP, INP, CLS, TTFB and image/font loading on mobile and desktop.
3. Compare against explicit budgets and identify the responsible module or asset.
4. Prefer code splitting, server rendering, optimized images, caching and smaller dependencies.
5. Re-measure after changes and report before/after evidence.

Never trade accessibility, correctness or cache invalidation safety for a score.
