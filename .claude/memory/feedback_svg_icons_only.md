---
name: feedback_svg_icons_only
description: НАВСЯКЪДЕ само SVG иконки — никога emoji като икони в UI
metadata:
  type: feedback
---

НАВСЯКЪДЕ в UI трябва да се използват само SVG иконки чрез `<svg><use href="#ic-..."/></svg>`. Никога emoji символи (📱, 🎮, ⚙️, 🏷 и т.н.) като визуални иконки.

**Why:** Потребителят изрично е казвал това многократно. Emoji изглеждат непоследователно между браузъри и ОС.

**How to apply:** В js/filters.js съществува helper функция `_fl(label)` и map `_FI` (emoji→SVG icon id), която замества водещи emoji в label стрингове с `<svg class="svg-ic"><use href="#ic-..."/></svg>`. Използвай `_fl()` навсякъде, където labels се рендерират като innerHTML. Налични SVG символи: ic-phone, ic-laptop, ic-monitor, ic-gamepad, ic-settings, ic-mouse, ic-wifi, ic-storage, ic-bag, ic-printer, ic-bolt, ic-return, ic-tag, ic-tablet, ic-globe, ic-cpu, ic-search, ic-wrench, ic-package, ic-headphones, ic-camera, ic-chat, ic-star, ic-watch, ic-pin, ic-shield, ic-check, ic-moon, ic-spark, ic-arrow-right, ic-home, ic-desktop, ic-truck, ic-filter, ic-heart, ic-cart, ic-user, ic-eye, ic-clock, ic-info.
