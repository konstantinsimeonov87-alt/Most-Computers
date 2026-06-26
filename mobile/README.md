# Most Computers - Mobile App

React Native + Expo приложение за Most Computers.

## Stack
- **Expo SDK 51** (managed workflow)
- **Expo Router** (file-based navigation)
- **Supabase** (auth + database)
- **Zustand** (state management)
- **TypeScript**

## Структура
```
mobile/
├── app/
│   ├── (tabs)/          # Tab навигация
│   │   ├── index.tsx    # Начало / каталог
│   │   ├── search.tsx   # Търсене
│   │   ├── cart.tsx     # Количка
│   │   ├── wishlist.tsx # Любими
│   │   └── profile.tsx  # Профил + поръчки
│   ├── product/[id].tsx # Продуктова страница
│   ├── auth/
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── checkout/
│       └── index.tsx    # 3-стъпков checkout
├── lib/
│   ├── supabase.ts      # Supabase клиент
│   ├── products.ts      # Продуктови данни
│   ├── currency.ts      # EUR/BGN конвертация
│   └── types.ts         # TypeScript типове
├── store/
│   ├── authStore.ts     # Auth state (Zustand)
│   ├── cartStore.ts     # Количка state
│   └── wishlistStore.ts # Любими state
└── components/
    └── ProductCard.tsx  # Продуктова карта
```

## Стартиране

```bash
cd mobile
npm install
npx expo start
```

## Build за store

```bash
# Android APK
npx eas build --platform android --profile preview

# iOS
npx eas build --platform ios
```

Изисква EAS CLI: `npm install -g eas-cli` и акаунт в expo.dev.

## Assets
Трябва да добавите следните файлове в `assets/`:
- `icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `adaptive-icon.png` (1024x1024 за Android)
- `notification-icon.png` (96x96 бял/прозрачен PNG)

Използвайте логото на Most Computers с #bd1105 фон.
