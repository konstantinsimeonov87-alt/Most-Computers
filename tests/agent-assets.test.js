const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const { collectAssets, readFrontmatter } = require('../scripts/agent-assets');

test('collects the current agent and skill inventory without errors', () => {
  const result = collectAssets();

  expect(result.errors).toEqual([]);
  expect(result.assets).toEqual(expect.arrayContaining([
    expect.objectContaining({ kind: 'skill', name: 'code-quality', tier: 'core' }),
    expect.objectContaining({ kind: 'agent', name: 'frontend-implementor' }),
  ]));
});

test('rejects malformed frontmatter', () => {
  const filePath = path.join(__dirname, 'malformed-agent.md');
  fs.writeFileSync(filePath, '---\nname: broken\n');
  try {
    expect(readFrontmatter(filePath).error).toMatch(/unterminated/);
  } finally {
    fs.rmSync(filePath, { force: true });
  }
});

test('rejects invalid lifecycle metadata and unknown dependencies', () => {
  const original = fs.readFileSync(path.join(__dirname, '..', '.github', 'agent-registry.json'), 'utf8');
  const registryPath = path.join(__dirname, '..', '.github', 'agent-registry.json');
  const registry = JSON.parse(original);
  registry['skill:code-quality'] = {
    ...registry['skill:code-quality'],
    status: 'deprecated',
    replacement: null,
    requires: ['missing-skill'],
  };
  fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  try {
    const result = collectAssets();
    expect(result.errors).toEqual(expect.arrayContaining([
      expect.stringContaining('unknown dependency "missing-skill"'),
      expect.stringContaining('deprecated assets need replacement'),
    ]));
  } finally {
    fs.writeFileSync(registryPath, original);
  }
});

test('rejects unsupported version and quality tier', () => {
  const registryPath = path.join(__dirname, '..', '.github', 'agent-registry.json');
  const original = fs.readFileSync(registryPath, 'utf8');
  const registry = JSON.parse(original);
  registry['skill:code-quality'] = {
    ...registry['skill:code-quality'],
    version: 'next',
    tier: 'unknown',
  };
  fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  try {
    const result = collectAssets();
    expect(result.errors).toEqual(expect.arrayContaining([
      expect.stringContaining('invalid version'),
      expect.stringContaining('invalid tier'),
    ]));
  } finally {
    fs.writeFileSync(registryPath, original);
  }
});

test('generator creates a new asset without overwriting existing files', () => {
  const name = `test-generated-${process.pid}`;
  const target = path.join(__dirname, '..', '.github', 'skills', name, 'SKILL.md');
  try {
    execFileSync(process.execPath, [
      path.join(__dirname, '..', 'scripts', 'create-agent-asset.js'),
      `--type=skill`,
      `--name=${name}`,
    ], { stdio: 'pipe' });
    expect(fs.existsSync(target)).toBe(true);
    expect(fs.readFileSync(target, 'utf8')).toContain(`name: ${name}`);
  } finally {
    fs.rmSync(path.dirname(target), { recursive: true, force: true });
  }
});
