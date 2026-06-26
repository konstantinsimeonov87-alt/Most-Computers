// Converts data-core.js → lib/products.ts
// Run from project root: node mobile/sync-products.js

const fs   = require('fs');
const path = require('path');

// Load data-core.js via vm sandbox (avoids comment stripping issues)
const vm  = require('vm');
const raw = fs.readFileSync(path.join(__dirname, '../data-core.js'), 'utf8');
const ctx = { products: [] };
vm.createContext(ctx);
try {
  vm.runInContext(raw, ctx);
} catch (e) {
  // some files end with ]); instead of ]; — try wrapping
  vm.runInContext(raw.replace(/\]\s*\)\s*;?\s*$/, '];'), ctx);
}
const products = ctx.products;

// Clean up: ensure every product has required fields
const clean = products
  .filter(p => p && p.id && p.name)
  .map(p => ({
    id:       p.id,
    name:     p.name,
    brand:    p.brand || '',
    cat:      p.cat || 'accessories',
    subcat:   p.subcat || '',
    price:    p.price || 0,
    ...(p.old   ? { old: p.old }   : {}),
    ...(p.pct   ? { pct: p.pct }   : {}),
    ...(p.badge ? { badge: p.badge }: {}),
    added:    p.added || '',
    emoji:    p.emoji || '📦',
    sku:      p.sku || '',
    ...(p.ean ? { ean: p.ean } : {}),
    specs:    p.specs || {},
    rating:   p.rating || 4.0,
    rv:       p.rv || 0,
    ...(p.desc ? { desc: p.desc } : {}),
    img:      p.img || '',
    stock:    !!p.stock,
    ...(p.lowstock ? { lowstock: true } : {}),
  }));

const out = `// AUTO-GENERATED — run: node mobile/sync-products.js
// Source: data-core.js  (${clean.length} products, synced ${new Date().toISOString().slice(0,10)})
import type { Product } from './types';

export const PRODUCTS: Product[] = ${JSON.stringify(clean, null, 0)
  .replace(/^\[/, '[\n')
  .replace(/\]$/, '\n]')
  .replace(/\},\{/g, '},\n{')};

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
  ).slice(0, 40);
}

export function getProductsByCategory(cat: string): Product[] {
  if (cat === 'all')  return PRODUCTS;
  if (cat === 'sale') return PRODUCTS.filter((p) => p.badge === 'sale' || !!p.old);
  if (cat === 'new')  return PRODUCTS.filter((p) => p.badge === 'new');
  return PRODUCTS.filter((p) => p.cat === cat);
}

export function getFeaturedProducts(limit = 12): Product[] {
  return PRODUCTS.filter((p) => p.stock).slice(0, limit);
}

export function getSaleProducts(limit = 10): Product[] {
  return PRODUCTS.filter((p) => p.stock && (p.badge === 'sale' || !!p.old)).slice(0, limit);
}
`;

const outPath = path.join(__dirname, 'lib', 'products.ts');
fs.writeFileSync(outPath, out, 'utf8');
console.log(`\nSynced ${clean.length} products -> mobile/lib/products.ts\n`);
