const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sources = [
  { kind: 'agent', directory: path.join(root, '.claude', 'commands') },
  { kind: 'skill', directory: path.join(root, '.github', 'skills') },
];
const inventoryPath = path.join(root, '.github', 'agent-assets.json');
const registryPath = path.join(root, '.github', 'agent-registry.json');

function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(directory, entry.name));
}

function readFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  if (!content.startsWith('---\n')) {
    return { fields: {}, warning: `${filePath}: missing YAML frontmatter` };
  }

  const end = content.indexOf('\n---', 4);
  if (end === -1) {
    return { fields: {}, error: `${filePath}: unterminated YAML frontmatter` };
  }

  const fields = {};
  for (const line of content.slice(4, end).split('\n')) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!match) continue;
    const value = match[2].replace(/^['"]|['"]$/g, '');
    fields[match[1]] = ['requires', 'dependsOn'].includes(match[1])
      ? value.split(',').map((item) => item.trim()).filter(Boolean)
      : value;
  }

  return { fields };
}

function readRegistry() {
  if (!fs.existsSync(registryPath)) return {};
  return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
}

function relative(filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function fallbackDescription(filePath) {
  const heading = fs.readFileSync(filePath, 'utf8').match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : path.basename(filePath, '.md');
}

function collectAssets() {
  const assets = [];
  const errors = [];
  const registry = readRegistry();

  for (const source of sources) {
    if (source.kind === 'agent') {
      for (const filePath of listFiles(source.directory)) {
        const parsed = readFrontmatter(filePath);
        const fields = parsed.fields;
        if (parsed.warning) errors.push(`warning: ${parsed.warning}`);
        if (parsed.error) errors.push(parsed.error);
        const expectedName = path.basename(filePath, '.md');
        if (!fields.description && !parsed.warning) errors.push(`${relative(filePath)}: missing description`);
        assets.push({
          kind: source.kind,
          name: expectedName,
          description: fields.description || fallbackDescription(filePath),
          path: relative(filePath),
          version: fields.version || '1.0.0',
          status: fields.status || 'active',
          tier: fields.tier || 'legacy',
          owner: fields.owner || 'project-maintainers',
          lastReviewed: fields.lastReviewed || null,
          requires: fields.requires || [],
          replacement: fields.replacement || null,
          ...registry[`${source.kind}:${expectedName}`],
        });
      }
      continue;
    }

    if (!fs.existsSync(source.directory)) continue;
    for (const entry of fs.readdirSync(source.directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const filePath = path.join(source.directory, entry.name, 'SKILL.md');
      if (!fs.existsSync(filePath)) {
        errors.push(`${relative(path.join(source.directory, entry.name))}: missing SKILL.md`);
        continue;
      }
      const parsed = readFrontmatter(filePath);
      const fields = parsed.fields;
      if (parsed.warning) errors.push(parsed.warning);
      if (parsed.error) errors.push(parsed.error);
      if (fields.name !== entry.name) {
        errors.push(`${relative(filePath)}: frontmatter name must be "${entry.name}"`);
      }
      if (!fields.description) errors.push(`${relative(filePath)}: missing description`);
      assets.push({
        kind: source.kind,
        name: entry.name,
        description: fields.description || '',
        path: relative(filePath),
        version: fields.version || '1.0.0',
        status: fields.status || 'active',
        tier: fields.tier || 'core',
        owner: fields.owner || 'project-maintainers',
        lastReviewed: fields.lastReviewed || null,
        requires: fields.requires || [],
        replacement: fields.replacement || null,
        ...registry[`${source.kind}:${entry.name}`],
      });
    }
  }

  const duplicateNames = new Set();
  const seenNames = new Set();
  for (const asset of assets) {
    if (seenNames.has(`${asset.kind}:${asset.name}`)) duplicateNames.add(`${asset.kind}:${asset.name}`);
    seenNames.add(`${asset.kind}:${asset.name}`);
  }
  for (const duplicate of duplicateNames) errors.push(`duplicate asset: ${duplicate}`);

  const assetNames = new Set(assets.map((asset) => asset.name));
  for (const asset of assets) {
    if (!/^\d+\.\d+\.\d+$/.test(asset.version)) errors.push(`${asset.kind}:${asset.name}: invalid version`);
    if (!['active', 'experimental', 'deprecated'].includes(asset.status)) {
      errors.push(`${asset.kind}:${asset.name}: invalid status "${asset.status}"`);
    }
    if (!['core', 'optional', 'legacy'].includes(asset.tier)) {
      errors.push(`${asset.kind}:${asset.name}: invalid tier "${asset.tier}"`);
    }
    for (const dependency of asset.requires) {
      if (!assetNames.has(dependency)) errors.push(`${asset.kind}:${asset.name}: unknown dependency "${dependency}"`);
    }
    if (asset.status === 'deprecated' && !asset.replacement) {
      errors.push(`${asset.kind}:${asset.name}: deprecated assets need replacement`);
    }
  }

  return { assets: assets.sort((a, b) => `${a.kind}:${a.name}`.localeCompare(`${b.kind}:${b.name}`)), errors };
}

function writeInventory(result) {
  fs.mkdirSync(path.dirname(inventoryPath), { recursive: true });
  const inventory = {
    counts: result.assets.reduce((counts, asset) => {
      counts[asset.kind] += 1;
      return counts;
    }, { agent: 0, skill: 0 }),
    generatedBy: 'scripts/agent-assets.js',
    assets: result.assets,
  };
  fs.writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`);
}

if (require.main === module) {
const result = collectAssets();
if (process.argv.includes('--write')) writeInventory(result);

const strict = process.argv.includes('--strict');
const blockingErrors = result.errors.filter((error) => strict || !error.startsWith('warning:'));
if (blockingErrors.length) {
  console.error('Agent/skill validation failed:');
  for (const error of blockingErrors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${result.assets.length} agent/skill assets.`);
  const warnings = result.errors.filter((error) => error.startsWith('warning:'));
  if (warnings.length) console.warn(`Found ${warnings.length} legacy asset warnings. Use --strict to enforce frontmatter.`);
  if (process.argv.includes('--write')) console.log(`Wrote ${relative(inventoryPath)}`);
}
}

module.exports = { collectAssets, readFrontmatter, readRegistry };
