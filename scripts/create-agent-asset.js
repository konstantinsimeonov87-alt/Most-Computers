const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=')];
}));

if (!['agent', 'skill'].includes(args.type) || !args.name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args.name)) {
  console.error('Usage: node scripts/create-agent-asset.js --type=agent|skill --name=lowercase-name');
  process.exit(1);
}

const target = args.type === 'agent'
  ? path.join(root, '.claude', 'commands', `${args.name}.md`)
  : path.join(root, '.github', 'skills', args.name, 'SKILL.md');

if (fs.existsSync(target)) {
  console.error(`Asset already exists: ${target}`);
  process.exit(1);
}

const description = `Describe when and why to use the ${args.name} ${args.type}.`;
const content = args.type === 'agent'
  ? `---\ndescription: ${description}\nmodel: claude-opus-4-8\nversion: 1.0.0\nstatus: experimental\ntier: optional\nowner: project-maintainers\n---\n\n# ${args.name}\n\n## Purpose\n\nDescribe the responsibilities and boundaries of this agent.\n\n## Procedure\n\n1. Inspect the relevant context.\n2. Make only approved, focused changes.\n3. Validate the result with existing checks.\n`
  : `---\nname: ${args.name}\ndescription: ${description}\nversion: 1.0.0\nstatus: experimental\ntier: optional\nowner: project-maintainers\n---\n\n# ${args.name}\n\nUse this Skill when its purpose applies.\n\n## Procedure\n\n1. Inspect the relevant context.\n2. Follow repository conventions.\n3. Validate the result.\n`;

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, content);
console.log(`Created ${path.relative(root, target).replace(/\\/g, '/')}`);
