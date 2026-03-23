// Simple utility to convert inline onclick attributes to data-action in HTML file
// Usage: node migrate-handlers.js index.html.html

const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Usage: node migrate-handlers.js <htmlFile>');
  process.exit(1);
}

const file = process.argv[2];
let html;
try {
  html = fs.readFileSync(file, 'utf8');
} catch (err) {
  console.error('Cannot read file', file, err);
  process.exit(1);
}

const newHtml = html.replace(/onclick="([^"]*)"/g, (m, code) => {
  let action = code.replace(/return\s+false;?/g, '').trim();
  action = action.replace(/\(\)\s*;?$/, '');
  return `data-action="${action}"`;
});

fs.writeFileSync(file, newHtml, 'utf8');
console.log('Updated', file);
