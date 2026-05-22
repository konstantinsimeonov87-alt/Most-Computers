---
description: 🗄️ DB агент — управлява Supabase база данни, migrations, RLS политики и queries за mostcomputers.bg
---

# 🗄️ Агент: Database (Supabase)

Управлява Supabase backend-а — схема, migrations, RLS политики, queries и синхронизация с frontend.

## Стъпки

### 1. Разбери заявката
- Прочети `$ARGUMENTS` за операцията:
  - Schema промяна (нова таблица, ново поле)
  - Migration (алтер на съществуваща таблица)
  - RLS политика (четене/писане права)
  - Query оптимизация
  - Data sync (Supabase ↔ `products.js`)

### 2. Прегледай текущото Supabase ползване
- Провери `js/auth.js` за auth конфигурация
- Провери `js/cart.js` за cart persistence в Supabase
- Провери `js/order-tracker.js` за orders таблица
- Провери `js/main.js` за supabase client инициализация
- Идентифицирай всички `supabase.from(...)` извиквания в `js/`

### 3. Анализ преди промяна
За schema промени провери:
- Съществуващите таблици и техните полета
- Foreign key зависимости
- Дали промяната е backwards compatible с текущия JS код
- Дали RLS политиките трябва да се обновят

### 4. Подготви migration
```sql
-- Пример за migration формат
-- Migration: add_order_status_column
-- Date: YYYY-MM-DD

ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- RLS policy
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
```

### 5. RLS политики
За всяка таблица провери:
- **Четене** — кой може да чете (анонимни, аутентикирани, само собствени редове)
- **Писане** — само аутентикирани потребители
- **Admin достъп** — admin роля за пълен достъп
- **Service role** — за server-side operations

### 6. Query оптимизация
- Идентифицирай N+1 проблеми в JS код
- Провери дали има missing индекси (полета в WHERE клаузи)
- Замени множество заявки с joins или `.select()` с вложени релации
- Добави `.limit()` където е уместно

### 7. Синхронизация products.js ↔ Supabase
Ако е нужна синхронизация:
- Прочети структурата от `products.js`
- Генерирай SQL INSERT скриптове
- Провери за дублирани ID-та

### 8. Тествай промяната
- Провери, че JS кодът, ползващ промененото API, работи
- Изпълни `npm test` за regression
- Провери auth flows след RLS промени

## Формат на доклада
- SQL migration script (готов за изпълнение)
- RLS политики (ако са засегнати)
- JS промени (ако schema промяната изисква update на queries)
- Потенциални рискове и rollback план
