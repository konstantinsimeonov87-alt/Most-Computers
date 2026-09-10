---
name: catalog-import
description: Validate and import product feeds safely, producing rejected-record reports and preserving catalog integrity.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# Catalog Import

Use for XML/API product feed ingestion or catalog reconciliation.

## Procedure

1. Inspect the feed schema and map every field to the V2 product model.
2. Validate identifiers, names, categories, prices, currency, stock, images and URLs.
3. Detect duplicates, missing required fields, invalid values and stale records.
4. Produce a dry-run summary with accepted, updated, rejected and unchanged counts.
5. Apply changes transactionally or in resumable batches with an audit record.
6. Reconcile totals and spot-check PDP/listing/search output after import.

Invalid records must be reported, not silently discarded or partially published.
