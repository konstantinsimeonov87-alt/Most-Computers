const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sources = [
  { kind: 'agent', directory: path.join(root, '.claude', 'commands') },
  { kind: 'skill', directory: path.join(root, '.github', 'skills') },
];
const write = process.argv.includes('--write');

function addMetadata(filePath, kind) {
  const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  if (!content.startsWith('---\n')) return false;
  const end = content.indexOf('\n---', 4);
  if (end === -1) return false;

  const frontmatter = content.slice(4, end);
  const metadata = [
    ['version', '1.0.0'],
    ['status', 'active'],
    ['tier', kind === 'skill' ? 'core' : 'legacy'],
    ['owner', 'project-maintainers'],
  ].filter(([key]) => !new RegExp(`^${key}:`, 'm').test(frontmatter));

  if (!metadata.length) return false;
  const updated = `${content.slice(0, end)}\n${metadata.map(([key, value]) => `${key}: ${value}`).join('\n')}${content.slice(end)}`;
  if (write) fs.writeFileSync(filePath, updated);
  return true;
}

let changed = 0;
for (const source of sources) {
  if (!fs.existsSync(source.directory)) continue;
  const entries = fs.readdirSync(source.directory, { withFileTypes: true });
  for (const entry of entries) {
    const filePath = source.kind === 'agent'
      ? path.join(source.directory, entry.name)
      : path.join(source.directory, entry.name, 'SKILL.md');
    if (!entry.isDirectory() && source.kind === 'agent' && entry.name.endsWith('.md') && addMetadata(filePath, source.kind)) changed += 1;
    if (entry.isDirectory() && source.kind === 'skill' && addMetadata(filePath, source.kind)) changed += 1;
  }
}

console.log(`${write ? 'Updated' : 'Would update'} metadata in ${changed} assets.`);
