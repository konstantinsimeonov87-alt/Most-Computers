---
name: ui-quality
description: Implement and validate polished, consistent V2 UI across components, responsive breakpoints, themes and interaction states.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# UI Quality

Use when implementing or reviewing visual UI changes in SvelteKit components, routes or shared styles.

## Procedure

1. Find the canonical component, token and layout pattern before adding local markup or CSS.
2. Preserve a clear visual hierarchy with intentional typography, spacing, color and contrast.
3. Define responsive behavior for mobile, tablet and desktop, including overflow and breakpoint transitions.
4. Implement complete states: hover, focus-visible, pressed, disabled, loading, empty, validation and error.
5. Verify consistent sizing, alignment, hit areas, icon treatment and text truncation.
6. Check light/dark themes, reduced motion, long Bulgarian labels and missing/slow images.
7. Validate with deterministic screenshots and a real browser interaction pass; then run accessibility checks.

## Rules

- Prefer shared components and design tokens over page-specific overrides.
- Avoid layout shift: reserve image space and make loading transitions explicit.
- Do not use color alone to communicate state.
- Do not hide essential actions or content at mobile breakpoints.
- Do not approve a screenshot without checking console errors, missing assets and focus behavior.

## Acceptance checklist

- The intended visual hierarchy is obvious at a glance.
- Primary action is discoverable and usable with touch and keyboard.
- Content remains readable at narrow widths and with long text.
- States and themes are consistent with the design system.
- No unintended overflow, clipping, layout shift or contrast regression is present.
