---
name: analytics-validation
description: Validate GA4 e-commerce events, Consent Mode v2, event deduplication and PII safety in V2.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# Analytics Validation

Use after changes to product, search, cart, checkout, consent or purchase flows.

## Procedure

1. Build an event matrix for `view_item`, `view_item_list`, `search`, cart, checkout and `purchase`.
2. Verify event names, item fields, value, currency and transaction identifiers.
3. Test consent denied, granted and changed states.
4. Detect duplicate events caused by hydration, navigation, retry or listeners.
5. Confirm no email, phone, address, payment data or other PII is sent.
6. Use debug/preview destinations only and document expected versus actual payloads.
