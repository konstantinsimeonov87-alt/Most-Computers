---
name: accessibility-regression
description: Detect and prevent WCAG accessibility regressions in V2 components, routes and responsive states.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# Accessibility Regression

Use after UI, navigation, form, modal, checkout or responsive changes.

## Checklist

- Semantic landmarks, heading hierarchy and accessible names
- Keyboard navigation, focus order, focus trapping and escape behavior
- Form labels, descriptions, validation and error announcements
- Contrast, visible focus, reduced motion and touch target sizing
- Dialog, menu, carousel, tabs and loading state semantics
- Mobile and desktop layouts without clipped or hidden essential content

Run the repository's existing accessibility checks and a keyboard/manual pass for changed flows. Report the exact element, WCAG impact and reproduction steps; do not dismiss violations as cosmetic.
