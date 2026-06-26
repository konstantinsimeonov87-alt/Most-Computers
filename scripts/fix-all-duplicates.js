'use strict';
/**
 * fix-all-duplicates.js
 * Removes all duplicate product entries from data source files.
 *
 * Two types of duplicates handled:
 * 1. Same-SKU, different-ID: keep entry with more specs and stock: field, remove the rest
 * 2. Same-SKU, same-ID (Canon consumables pushed twice): remove the inStock: version
 */

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const SOURCE_FILES = [
  path.join(__dirname, '..', 'data.js'),
  path.join(__dirname, '..', 'data-core.js'),
  path.join(__dirname, '..', 'js', 'data.js'),
];

function loadProducts(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const ctx = vm.createContext({
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    console: { log: () => {}, warn: () => {}, error: () => {} },
    JSON,
    products: [],
    cart: [], compareList: [],
    modalQtyVal: 1, modalProductId: null, quickOrderProductId: null,
    currentFilter: 'all', currentSort: 'bestseller',
  });
  vm.runInContext(raw, ctx, { timeout: 20000 });
  return ctx.products;
}

// Returns true if the line represents a product with the given ID
function lineMatchesId(line, id) {
  // JS format:   {id:3410,  or  ,id:3410,
  // JSON format: {"id":3410,
  return new RegExp('(?:\\{|,)\\s*(?:"id"|id)\\s*:\\s*' + id + '(?:[,\\s}]|$)').test(line);
}

function processFile(filePath) {
  console.log(`\n=== Processing ${path.basename(filePath)} ===`);

  const products = loadProducts(filePath);

  // ── Group by SKU ──────────────────────────────────────────────────────────
  const bySku = {};
  for (const p of products) {
    const sku = p.sku && p.sku.trim();
    if (!sku) continue;
    if (!bySku[sku]) bySku[sku] = [];
    bySku[sku].push(p);
  }

  // IDs to remove entirely (different-ID duplicates)
  const idsToRemove = new Set();
  // IDs where only the `inStock:` occurrence should be removed (same-ID duplicates)
  const idsToRemoveIfInStock = new Set();

  for (const [, group] of Object.entries(bySku)) {
    if (group.length === 1) continue;

    const uniqueIds = [...new Set(group.map(p => p.id))];

    if (uniqueIds.length === 1) {
      // Same ID appears more than once
      const hasInStock = group.some(e => Object.prototype.hasOwnProperty.call(e, 'inStock'));
      const hasStock   = group.some(e => Object.prototype.hasOwnProperty.call(e, 'stock'));
      if (hasInStock && hasStock) {
        idsToRemoveIfInStock.add(uniqueIds[0]);
      }
      // If both have the same format (inStock:inStock or stock:stock) — skip, needs manual review
      continue;
    }

    // Different IDs — pick best entry
    const scored = uniqueIds.map(id => {
      const entries = group.filter(p => p.id === id);
      const hasStock   = entries.some(e => Object.prototype.hasOwnProperty.call(e, 'stock'));
      const maxSpecs   = Math.max(...entries.map(e => Object.keys(e.specs || {}).length));
      const minId      = Math.min(...entries.map(e => e.id));
      return { id, hasStock, maxSpecs, minId };
    });

    // Rank: stock: field first, then most specs, then lowest ID
    scored.sort((a, b) => {
      if (a.hasStock !== b.hasStock) return a.hasStock ? -1 : 1;
      if (a.maxSpecs !== b.maxSpecs) return b.maxSpecs - a.maxSpecs;
      return a.minId - b.minId;
    });

    // Remove all but winner
    for (const s of scored.slice(1)) {
      idsToRemove.add(s.id);
    }
  }

  console.log(`  To remove entirely:      ${idsToRemove.size} IDs`);
  console.log(`  To remove (inStock ver): ${idsToRemoveIfInStock.size} IDs`);

  if (idsToRemove.size === 0 && idsToRemoveIfInStock.size === 0) {
    console.log('  Nothing to do.');
    return 0;
  }

  // ── Process file line-by-line ─────────────────────────────────────────────
  const raw   = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split('\n');
  const kept  = [];
  let removed = 0;

  for (const line of lines) {
    let drop = false;

    for (const id of idsToRemove) {
      if (lineMatchesId(line, id)) { drop = true; break; }
    }

    if (!drop && line.includes('inStock:')) {
      for (const id of idsToRemoveIfInStock) {
        if (lineMatchesId(line, id)) { drop = true; break; }
      }
    }

    if (drop) { removed++; } else { kept.push(line); }
  }

  fs.writeFileSync(filePath, kept.join('\n'), 'utf8');
  console.log(`  Removed ${removed} lines → file updated`);
  return removed;
}

// ── Main ──────────────────────────────────────────────────────────────────
let totalRemoved = 0;
for (const f of SOURCE_FILES) {
  totalRemoved += processFile(f);
}
console.log(`\nTotal lines removed across all files: ${totalRemoved}`);
console.log('Done. Run check-duplicates.js to verify.');
