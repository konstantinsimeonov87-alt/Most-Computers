---
name: project-v2-plan
description: V2 на Most Computers - финален архитектурен план и tech stack решения
metadata:
  type: project
---

## V2 Most Computers - архитектурен план

Когато потребителят казва **V2** = новата версия (планирана, все още не започната).
Когато потребителят казва **V1** = текущата версия в `c:\Users\user\Desktop\New folder`.

### Tech Stack (финализиран)
- Framework: SvelteKit
- CSS: Tailwind CSS v4 (mobile-first)
- Hosting: Vercel
- Domain стратегия: v2.mostcomputers.bg -> switch към mostcomputers.bg при launch
- Rendering: Hybrid SSG + ISR (Vercel)
- Search: Algolia
- Font: Inter, self-hosted чрез @fontsource
- Images: Vercel Image Optimization (WebP/AVIF автоматично)
- Analytics: Google Analytics 4 + Consent Mode v2 + cookie banner
- Auth / Admin: Supabase Auth + role-based (admin role)
- Backend: Supabase (същият като V1)
- Design: Brand refresh (запазва червено #bd1105 + лого, обновява типография/spacing/cards)
- Dark mode: Light + Dark (CSS variables чрез Tailwind v4)
- PWA: Не за сега
- Език: Само Bulgarian (i18n структура готова за бъдещо разширение)
- Cookie: Consent Mode v2 + banner

### Агентна карта
- Orchestrator координира всички
- Фаза 0: Plan agent (scaffold + design tokens + CLAUDE.md)
- Фаза 1: implementor (Design System - паралелно с Ф0)
- Фаза 2: implementor (Layouts + Routing)
- Фаза 3: mobile-dev + 2x implementor (Homepage/Category, PDP, Cart/Checkout) - паралелно
- Фаза 4: implementor (Algolia, Supabase Auth, GA4, Vercel Images)
- Фаза 5: performance-seo + schema-markup - паралелно
- Фаза 6: a11y + ux-auditor + mobile-auditor + bundle + security - паралелно

Общо ~15 агента.

**Why:** Потребителят иска V2 като пълно пренаписване с перфектен mobile-first UX/UI и SEO.
**How to apply:** При споменаване на V2 - работи по новата архитектура. При V1 - текущата кодова база.
