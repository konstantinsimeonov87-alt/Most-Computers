---
name: visual-regression
description: Detect unintended visual changes across V2 routes, responsive breakpoints, themes and shared components.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# Visual Regression

Use after changes to CSS, tokens, shared components, layouts or responsive behavior.

## Procedure

1. Identify affected routes and the canonical viewport/theme matrix.
2. Capture deterministic screenshots with stable data, fonts and animation disabled.
3. Compare against approved baselines at mobile, desktop and relevant dark/light themes.
4. Classify differences as intended, layout regression, typography, overflow, contrast or rendering instability.
5. Inspect changed components at breakpoint edges, not only common viewport sizes.
6. Update baselines only when the product change is intentional and documented.

Do not hide differences with excessive thresholds or approve screenshots containing loading placeholders, console errors or missing assets.
