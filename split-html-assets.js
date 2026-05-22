const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html.html');
const cssPath  = path.join(__dirname, '..', 'styles.css');
const jsPath   = path.join(__dirname, '..', 'app.js');

let html = fs.readFileSync(htmlPath, 'utf8');

// Extract <style>...</style>
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
if (!styleMatch) {
  console.error('No <style> block found.');
  process.exit(1);
}
const styleContent = styleMatch[1];
fs.writeFileSync(cssPath, styleContent.trim() + '\n', 'utf8');

// Replace the <style> block with a link tag
html = html.replace(/<style>[\s\S]*?<\/style>/i, '<link rel="stylesheet" href="styles.css">');

// Extract the *main* <script> (not JSON-LD)
// We'll locate the last <script> tag that is NOT type="application/ld+json".
const scriptRegex = /<script(?![^>]*type=["']application\/(?:ld\+json)["'])[^>]*>([\s\S]*?)<\/script>/gi;
let lastMatch;
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  lastMatch = match;
}

if (!lastMatch) {
  console.error('No non-JSON-LD <script> block found.');
  process.exit(1);
}

const fullScriptTag = lastMatch[0];
const scriptContent = lastMatch[1];

fs.writeFileSync(jsPath, scriptContent.trim() + '\n', 'utf8');

// Replace that script block with a script tag that loads app.js with defer
html = html.replace(fullScriptTag, '<script src="app.js" defer></script>');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Extracted CSS to styles.css and JS to app.js, and updated index.html.html');
