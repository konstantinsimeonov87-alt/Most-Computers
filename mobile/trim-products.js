const vm = require('vm');
const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.join(__dirname, '../data-core.js'), 'utf8');
const ctx = { products: [] };
vm.createContext(ctx);
try { vm.runInContext(raw, ctx); } catch(e) {
  vm.runInContext(raw.replace(/\]\s*\)\s*;?\s*$/, '];'), ctx);
}

const products = ctx.products
  .filter(p => p && p.id && p.name)
  .slice(0, 300);

const out = `// AUTO-GENERATED — 300 products for Expo Go testing
// Full catalog (4192) available via sync-products.js
import type { Product } from './types';

export const PRODUCTS: Product[] = ${JSON.stringify(products, null, 0)
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
    (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
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

fs.writeFileSync(path.join(__dirname, 'lib/products.ts'), out);
const kb = Math.round(Buffer.byteLength(out) / 1024);
console.log(`Done: ${products.length} products, ${kb} KB`);
