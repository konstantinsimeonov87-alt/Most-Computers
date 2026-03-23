const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html.html');
const html = fs.readFileSync(filePath, 'utf8');

const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let match;
let idx = 0;
let ok = true;

while ((match = scriptRe.exec(html))) {
  idx += 1;
  const attrs = match[1];
  const body = match[2];
  const isJson = /type\s*=\s*['\"]application\/ld\+json['\"]/i.test(attrs);
  try {
    if (isJson) {
      JSON.parse(body);
    } else {
      new Function(body);
    }
  } catch (e) {
    console.error(`\n--- Script #${idx} parse error ---`);
    console.error('Attributes:', attrs.trim());
    console.error('Error:', e.message);
    console.error('Snippet:', body.trim().slice(0, 240).replace(/\s+/g, ' ') + (body.length > 240 ? '...' : ''));
    ok = false;
  }
}

if (ok) {
  console.log('✅ All <script> blocks parsed successfully.');
} else {
  console.error('❌ One or more <script> blocks had syntax errors.');
  process.exit(1);
}
