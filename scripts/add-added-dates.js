// Script: Retroactively add added:'YYYY-MM-DD' to all products in js/data.js
// Usage: node scripts/add-added-dates.js
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../js/data.js');
const src = fs.readFileSync(DATA_FILE, 'utf8');

// Parse all date-comment positions
// Match comments like:
//   // ── GPU Import - 2026-04-20 - ...
//   // Migration: 2026-04-22 - ...
//   // UPS устройства - 2026-04-30
//   // ── Webcam Import - 2026-05-28 - ...
const commentDateRe = /\/\/[^\n]*?(\d{4}-\d{2}-\d{2})[^\n]*/g;

// Build list of { index, date } for all date comments
const dateMarkers = [];
let m;
while ((m = commentDateRe.exec(src)) !== null) {
  dateMarkers.push({ index: m.index, date: m[1] });
}

console.log(`Found ${dateMarkers.length} date markers in data.js`);
dateMarkers.forEach(dm => {
  const preview = src.slice(dm.index, dm.index + 80).replace(/\n/g, ' ');
  console.log(`  ${dm.date} @ char ${dm.index}: ${preview}`);
});

// For each position in the file, determine which date applies
// (the last date marker before that position)
function getDateForPos(pos) {
  let result = '2026-01-01';
  for (const dm of dateMarkers) {
    if (dm.index <= pos) {
      result = dm.date;
    } else {
      break;
    }
  }
  return result;
}

// Now process line by line to add added: field
// Strategy: find lines containing badge:... and no added: field
// Insert added:'YYYY-MM-DD', after badge: value

const lines = src.split('\n');
let charPos = 0;
let modified = 0;
let skipped = 0;

const newLines = lines.map((line, lineIdx) => {
  const lineStart = charPos;
  charPos += line.length + 1; // +1 for \n

  // Skip if already has added:
  if (/\badded:/.test(line)) {
    skipped++;
    return line;
  }

  // Match lines that have badge: field (product data lines)
  // Pattern: badge:null or badge:'sale' or badge:'new' etc.
  const badgeMatch = line.match(/(badge:(?:null|'[^']*'))/);
  if (!badgeMatch) {
    return line;
  }

  // Determine date based on line position in file
  const date = getDateForPos(lineStart);

  // Insert added:'date', after the badge: value
  const badgeStr = badgeMatch[1];
  const insertAfter = badgeStr;
  const newLine = line.replace(insertAfter, `${insertAfter},added:'${date}'`);
  modified++;
  return newLine;
});

console.log(`\nModified: ${modified} lines`);
console.log(`Already had added: ${skipped} lines`);
console.log(`Total lines: ${lines.length}`);

const result = newLines.join('\n');
fs.writeFileSync(DATA_FILE, result, 'utf8');
console.log('\nWrote updated data.js');
