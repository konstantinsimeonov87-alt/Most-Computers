---
name: security-gate
description: Perform the V2 security gate covering dependencies, secrets, auth, RLS, injection, headers and production configuration.
version: 1.0.0
status: active
tier: core
owner: project-maintainers
---

# Security Gate

Use before merge or release, and after changes to auth, payments, data access or integrations.

## Procedure

1. Run the repository's dependency audit and inspect lockfile changes.
2. Search for hardcoded secrets, unsafe logging, client-exposed server values and insecure storage.
3. Review input validation, output encoding, CSRF, SSRF, injection and open redirects.
4. Verify Supabase RLS and authorization for anonymous, user and admin roles.
5. Check security headers, CSP, cookie flags, CORS and error disclosure.
6. Rank findings by exploitability and impact, then block release on critical/high issues.

Never include real secrets or exploit credentials in reports.
