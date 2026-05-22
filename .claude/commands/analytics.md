---
description: 📊 Analytics агент — добавя tracking events и conversion tracking за mostcomputers.bg
---

# 📊 Analytics Agent

## Цел
Добавяне на e-commerce analytics tracking за измерване на потребителското поведение, conversion funnel и product performance.

## Стъпки

### 1. Дефинирай ключови events
Идентифицирай и категоризирай events по funnel stage:

**Awareness (Top of Funnel)**
| Event | Trigger | Data |
|---|---|---|
| `page_view` | Page load | page_title, referrer |
| `search` | Search submit | query, results_count, category_filter |
| `view_category` | Category click | category_name, product_count |

**Consideration (Mid Funnel)**
| Event | Trigger | Data |
|---|---|---|
| `view_product` | Product modal open | product_id, name, price, category |
| `add_to_wishlist` | Heart icon click | product_id, name, price |
| `compare_products` | Compare page open | product_ids[], category |

**Conversion (Bottom of Funnel)**
| Event | Trigger | Data |
|---|---|---|
| `add_to_cart` | Add to cart click | product_id, name, price, quantity |
| `remove_from_cart` | Remove from cart | product_id, name, price |
| `begin_checkout` | Checkout page open | cart_total, item_count |
| `apply_promo` | Promo code applied | promo_code, discount_amount |
| `purchase` | Order confirmed | order_total, items[], payment_method |

**Engagement**
| Event | Trigger | Data |
|---|---|---|
| `share_product` | Share button click | product_id, share_method |
| `write_review` | Review submit | product_id, rating |
| `use_keyboard_shortcut` | Keyboard shortcut | shortcut_key |

### 2. Имплементирай tracking layer
Създай `js/analytics.js` с:
```javascript
function trackEvent(eventName, data = {}) {
  // Google Analytics 4
  if (typeof gtag === 'function') {
    gtag('event', eventName, data);
  }
  // Facebook Pixel  
  if (typeof fbq === 'function') {
    fbq('trackCustom', eventName, data);
  }
  // Console log in dev mode
  if (location.hostname === 'localhost') {
    console.log(`[Analytics] ${eventName}`, data);
  }
}
```

### 3. Добави events в app.js
- Hook into existing functions: `addToCart()`, `openProductModal()`, `handleCheckout()`, etc.
- Използвай custom events: `mc:productopen`, `mc:cartupdate`
- Добави data attributes за tracking: `data-track="add_to_cart"`

### 4. E-commerce conversion funnel
Дефинирай и имплементирай conversion funnel:
```
Homepage → Product View → Add to Cart → Checkout → Purchase
   100%  →     35%      →    12%      →    8%    →    4%
```

### 5. Dashboard предложения
Предложи ключови метрики за monitoring:
- Conversion Rate (CR%)
- Average Order Value (AOV)
- Cart Abandonment Rate
- Top searched terms (no results)
- Most viewed but not purchased products

## Формат на доклада
- Готов `js/analytics.js` файл
- Списък на всички events с data schema
- Инструкции за Google Analytics 4 setup
