// ===== DATA =====
const products = [];

let cart=[], compareList=[], modalQtyVal=1, modalProductId=null, quickOrderProductId=null, currentFilter='all', currentSort='bestseller';

// ── Persist & restore products from localStorage ──
const _LS_VERSION = '20260420a'; // bump when localStorage schema changes
function persistProducts() {
  try {
    localStorage.setItem('mc_products', JSON.stringify(products));
    localStorage.setItem('mc_products_ver', _LS_VERSION);
  } catch(e) {}
}
// Snapshot static badge/pct/old before localStorage may overwrite them
const _staticProductsMap = Object.fromEntries(products.map(p => [p.id, { old: p.old, pct: p.pct, badge: p.badge }]));
(function restoreProducts() {
  try {
    // Clear stale localStorage if it predates the EAN/SKU corruption fix
    if (localStorage.getItem('mc_products_ver') !== _LS_VERSION) {
      localStorage.removeItem('mc_products');
      localStorage.removeItem('mc_products_ver');
      return;
    }
    const saved = localStorage.getItem('mc_products');
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.length) return;
    // Merge strategy:
    // - data.js is always the base (new products are never lost)
    // - localStorage overrides ONLY if it's the same product (EAN or SKU match)
    //   → prevents old XML imports that reused IDs from corrupting data.js products
    // - localStorage-only products (added via XML import, no data.js match) are appended
    const lsMap = new Map(parsed.map(p => [p.id, p]));
    const dataIds = new Set(products.map(p => p.id));
    const merged = products.map(p => {
      if (!lsMap.has(p.id)) return p;
      const ls = lsMap.get(p.id);
      const sameProduct = (p.ean && ls.ean && p.ean === ls.ean) ||
                          (p.sku && ls.sku && p.sku === ls.sku);
      if (!sameProduct) return p; // ID conflict — data.js wins
      return { ...p, ...ls, id: p.id };
    });
    parsed.forEach(p => { if (!dataIds.has(p.id)) merged.push(p); });
    products.splice(0, products.length, ...merged);
    // Re-sync localStorage with corrected merged state
    try { localStorage.setItem('mc_products', JSON.stringify(products)); } catch(_) {}
  } catch(e) {}
})();
