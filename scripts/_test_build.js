const fs = require('fs');
let data = fs.readFileSync('js/data.js', 'utf8');

// Simulate build.js steps
data = data
  .replace(/,\s*old\s*:\s*null/g, '')
  .replace(/,\s*pct\s*:\s*null/g, '')
  .replace(/,\s*badge\s*:\s*null/g, '')
  .replace(/,\s*reviews\s*:\s*\[\]/g, '')
  .replace(/,\s*ean\s*:\s*null/g, '');

const descRegex = /,\s*desc\s*:'(?:[^'\\]|\\.)*'/g;
const before = (data.match(descRegex) || []).length;

const core = data.replace(descRegex, '');
const afterMatches = (core.match(descRegex) || []).length;
console.log('desc fields found before strip:', before);
console.log('desc fields remaining after strip:', afterMatches);

// Find any unstripped desc
if (afterMatches > 0) {
  const m = core.match(/,\s*desc\s*:'[^']{0,200}/);
  if (m) console.log('First unstripped:', m[0].substring(0, 200));
}

// Try executing core
try {
  const fn = new Function(core + '; return products.length;');
  console.log('core executes OK, products:', fn());
} catch(e) {
  console.log('core EXEC ERROR:', e.message);
}

// Test slim strip
const slimSpecsRe = /,\s*specs\s*:\s*\{[^}]*\}/g;
const slim = core.replace(slimSpecsRe, '');
const specsMissed = (slim.match(/,\s*specs\s*:\s*\{/g) || []).length;
console.log('specs remaining after slim strip:', specsMissed);

try {
  const fn2 = new Function(slim + '; return products.length;');
  console.log('slim executes OK, products:', fn2());
} catch(e) {
  console.log('slim EXEC ERROR:', e.message);
}
