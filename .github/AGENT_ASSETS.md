# Agent and Skill automation

The repository keeps project agents in `.claude/commands/` and V2 Skills in `.github/skills/`.
The catalog at `.github/agent-assets.json` is generated from those sources and must not be edited manually.
Metadata overrides, dependency relationships and lifecycle state live in `.github/agent-registry.json`.

## Local commands

```bash
npm run agents:validate
npm run agents:update
npm run agents:validate:strict
npm run agents:create -- --type=skill --name=cache-strategy
npm run agents:migrate-metadata
```

- `agents:validate` checks names, descriptions, frontmatter and duplicate IDs. Legacy agents without frontmatter are reported as warnings.
- `agents:update` validates and regenerates the catalog.
- `agents:validate:strict` also fails for legacy agents without frontmatter, so it can be adopted gradually.
- `agents:create` creates a safe starter template and refuses to overwrite an existing asset.
- `agents:migrate-metadata` adds version, lifecycle, tier and owner fields to existing assets without replacing existing values.

## CI behavior

`.github/workflows/agent-assets.yml` runs when agent or Skill files change and every Monday as a health check.
It validates the complete set and updates the generated catalog on pushes to `main`.

To add an asset:

1. Add a command markdown file under `.claude/commands/{name}.md`, or a Skill at `.github/skills/{name}/SKILL.md`.
2. Give the Skill frontmatter a `name` matching its directory and add a one-line `description`.
3. Run `npm run agents:update`.
4. Review the generated catalog and the validation output.

## Metadata and lifecycle

Every catalog entry has a version, status, tier and owner. Use `active`, `experimental` or `deprecated` status.
Deprecated entries must define a replacement. Dependencies are listed with `requires` and are checked for valid asset names.
The registry also supports `lastReviewed`, which should be refreshed during scheduled health review.
