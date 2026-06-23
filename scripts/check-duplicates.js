// Checks for duplicate product entries in data.js by SKU
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dataPath = path.join(__dirname, '..', 'data.js');
const raw = fs.readFileSync(dataPath, 'utf8');

// Mock browser globals so data.js can run in Node.js
const ctx = vm.createContext({
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  console,
  JSON,
  products: [],
  cart: [],
  compareList: [],
  modalQtyVal: 1,
  modalProductId: null,
  quickOrderProductId: null,
  currentFilter: 'all',
  currentSort: 'bestseller',
  let: undefined,
});

vm.runInContext(raw, ctx, { timeout: 10000 });

const products = ctx.products;

const bySku = {};
const emptySku = [];

for (const p of products) {
  if (!p.sku || p.sku.trim() === '') {
    emptySku.push({ id: p.id, name: p.name, brand: p.brand, cat: p.cat });
    continue;
  }
  if (!bySku[p.sku]) bySku[p.sku] = [];
  bySku[p.sku].push(p);
}

const duplicates = Object.entries(bySku).filter(([, group]) => group.length > 1);

console.log(`Total products: ${products.length}`);
console.log(`Empty SKU: ${emptySku.length}`);
console.log(`Duplicate SKU groups: ${duplicates.length}\n`);

for (const [sku, group] of duplicates) {
  console.log(`SKU: ${sku} (${group.length} entries)`);
  for (const p of group) {
    console.log(`  ID ${p.id}: ${p.name} | price: ${p.price} | stock: ${p.stock} | specs keys: ${Object.keys(p.specs || {}).length}`);
  }
}

if (emptySku.length) {
  console.log('\n--- Empty SKU products ---');
  for (const p of emptySku) {
    console.log(`  ID ${p.id}: ${p.name} (${p.brand}, ${p.cat})`);
  }
}
