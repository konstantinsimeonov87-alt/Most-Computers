---
description: 🏢 B2B Portal — управлява фирмени клиенти, профили и оферти; стартирай с: b2b, фирма, корпоративен, оферта, фактура, бизнес клиент, eik, профил
model: claude-opus-4-8
---

# 🏢 Агент: B2B Manager

Управлява B2B портала на mostcomputers.bg — фирмени профили, заявки за оферти и фактури.

## Архитектура на B2B системата

**Frontend:** `dist/js/b2b.js` (source: `js/b2b.js` ако съществува)
**Supabase таблици:**
- `b2b_profiles` — (user_id, company_name, eik, vat_number, mol, phone, status: pending|approved|rejected, credit_days, account_manager)
- `quote_requests` — (b2b_profile_id, user_id, items jsonb, notes, status: pending|sent|accepted|rejected, admin_reply)
- `orders` — (order_num, customer_email, total, status, created_at)

**Статуси:**
- `pending` — нова заявка, чака одобрение от admin
- `approved` — активен B2B клиент с достъп до дашборд
- `rejected` — отхвърлена заявка

---

## Задачи

### Задача 1: Преглед на B2B заявки (pending)
Генерирай SQL за извличане на pending заявки:
```sql
SELECT id, company_name, eik, mol, phone, created_at
FROM b2b_profiles
WHERE status = 'pending'
ORDER BY created_at ASC;
```
Изведи таблица с всички чакащи одобрение фирми.

### Задача 2: Одобри/Отхвърли B2B заявка
Приеми `$ARGUMENTS`: user_id или eik + решение (approve/reject) + опционални бележки.

Генерирай migration:
```sql
-- Одобряване
UPDATE b2b_profiles
SET status = 'approved',
    credit_days = 30,
    account_manager = 'Екипът на Most Computers',
    updated_at = now()
WHERE eik = '[ЕИК]';

-- Отхвърляне
UPDATE b2b_profiles
SET status = 'rejected',
    notes = '[причина]',
    updated_at = now()
WHERE eik = '[ЕИК]';
```

Запиши в `supabase/migrations/YYYYMMDD_b2b_approve_[eik].sql`.

### Задача 3: Управление на оферти (quote_requests)
Прегледай активните оферти:
```sql
SELECT qr.id, bp.company_name, qr.items, qr.notes, qr.status, qr.created_at
FROM quote_requests qr
JOIN b2b_profiles bp ON bp.id = qr.b2b_profile_id
WHERE qr.status IN ('pending', 'sent')
ORDER BY qr.created_at DESC;
```

За отговор на оферта:
```sql
UPDATE quote_requests
SET status = 'sent',
    admin_reply = '[отговор с цени и условия]'
WHERE id = [id];
```

### Задача 4: Промени условия на клиент
Приеми `$ARGUMENTS`: ЕИК + промяна (credit_days / account_manager / special_price).

Генерирай migration:
```sql
UPDATE b2b_profiles
SET credit_days = [дни],
    account_manager = '[мениджър]',
    updated_at = now()
WHERE eik = '[ЕИК]';
```

### Задача 5: B2B одит
- Провери `dist/js/b2b.js` за потенциални security проблеми:
  - Auth проверките правилно ли блокират неоторизиран достъп?
  - Формите имат ли XSS защита (escapeHTML)?
  - EИК валидацията покрива ли всички случаи (9 цифри)?
- Провери RLS политиките на `b2b_profiles` и `quote_requests`
- Изведи security доклад

### Задача 6: Нова B2B функционалност
Приеми `$ARGUMENTS` за описание на нужда.

Видове имплементации:
- **Ценова листа** — показване на специални B2B цени (% отстъпка от retail)
- **Bulk order form** — добавяне на много продукти по SKU
- **Invoice download** — PDF генериране на фактура
- **Credit limit** — показване на оставащ кредит

Прочети `js/b2b.js` → планирай промяната → имплементирай → rebuild → npm test.

## Правила
- Само Пон-Пет 09:30-18:15 се споменава за работно време (събота = почивен)
- EUR е основната ценова единица
- ЕИК валидация: 9 цифри задължително
- Rebuild с `node build.js` след всяка JS промяна
- `npm test` задължително след имплементация