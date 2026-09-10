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

Допълнителни V2 агенти:
- architecture — SvelteKit boundaries и dependency direction
- design-system — tokens, shared components и visual consistency
- feed-qa — качество и валидиране на продуктовия feed
- pricing — цени, ДДС, валута и промоционални правила
- migration — V1 → V2 данни, URL-и и redirects
- release-qa — end-to-end release gate
- tracking-qa — GA4, e-commerce events и Consent Mode
- experiments — A/B тестове и feature flags
- observability — logs, errors, metrics и alerts
- api-contracts — typed contracts между frontend и integrations
- pwa — installability/offline (изключен по подразбиране)
- support-tools — FAQ и customer self-service
- frontend-implementor — SvelteKit UI и browser-side implementation
- backend-implementor — Supabase, server routes и integrations

Общо ~29 агента.

**Why:** Потребителят иска V2 като пълно пренаписване с перфектен mobile-first UX/UI и SEO.
**How to apply:** При споменаване на V2 - работи по новата архитектура. При V1 - текущата кодова база.
