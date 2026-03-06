# CLAUDE.md — Frontend Loyiha Qo'llanmasi

Bu fayl **barcha frontend loyihalar** uchun universal Claude Code yo'riqnomasi.
Har qanday vazifani boshlashdan oldin bu faylni to'liq o'qing.

---

## Texnologiyalar

- **Framework**: Vue 3 — faqat `<script setup lang="ts">` + Composition API
- **Til**: TypeScript — `strict: true`, `any` MUTLAQO TAQIQLANGAN
- **State**: Pinia — setup store uslubi
- **Router**: Vue Router 4 — lazy loading MAJBURIY
- **Test**: Vitest · Vue Testing Library · Playwright
- **HTTP**: Axios — typed API client

---

## Skill Fayllar

Kod yozishdan **OLDIN** tegishli skill faylni o'qing.
Bir nechta sohaga tegishli bo'lsa — **har birini** o'qing.

### Vue 3

| Vazifa | Skill |
|--------|-------|
| Komponent, composable, `ref/reactive/computed/watch` | `@.claude/skills/vue3/VUE3-COMPOSITION-API-RULES.md` |
| 100+ elementlik list, lazy load, og'ir komponent | `@.claude/skills/vue3/VUE3-PERFORMANCE-RULES.md` |
| Pinia store, Vue Router, navigation guard | `@.claude/skills/vue3/VUE3-PINIA-ROUTER-RULES.md` |
| Modal, form, ARIA, focus trap, fayl tuzilishi | `@.claude/skills/vue3/VUE3-ACCESSIBILITY-ERROR-RULES.md` |
| Kod review, xato qidirish, refactor | `@.claude/skills/vue3/VUE3-ANTIPATTERNS-RULES.md` |

### TypeScript

| Vazifa | Skill |
|--------|-------|
| Type, interface, enum, tsconfig, import | `@.claude/skills/typescript-frontend/TYPESCRIPT-CONFIG-TYPES-RULES.md` |
| API response parse, type guard, DTO, utility types | `@.claude/skills/typescript-frontend/TYPESCRIPT-GUARDS-UTILITY-RULES.md` |
| Generic composable, API client, error class | `@.claude/skills/typescript-frontend/TYPESCRIPT-GENERICS-ERRORS-RULES.md` |
| Vue + TypeScript props, template ref, inject/provide | `@.claude/skills/typescript-frontend/TYPESCRIPT-VUE-ANTIPATTERNS-RULES.md` |

### Testing

| Vazifa | Skill |
|--------|-------|
| Composable, store, utility unit test | `@.claude/skills/frontend-testing/FRONTEND-TESTING-UNIT-RULES.md` |
| Komponent integration testi, accessibility testi | `@.claude/skills/frontend-testing/FRONTEND-TESTING-INTEGRATION-RULES.md` |
| E2E, Playwright, Page Object Model | `@.claude/skills/frontend-testing/FRONTEND-TESTING-E2E-RULES.md` |
| MSW mocking, GitLab CI/CD pipeline | `@.claude/skills/frontend-testing/FRONTEND-TESTING-MOCKING-CICD-RULES.md` |

---

## Har Doim Amal Qilinadigan Qoidalar

Quyidagi qoidalar **barcha fayllarda**, **har qanday vazifada** majburiy.

### Taqiqlangan — hech qachon yozmang

```
❌  any tipi                    → unknown, generic yoki union ishlatilsin
❌  Options API                 → faqat <script setup lang="ts">
❌  index ni :key sifatida      → noyob id ishlatilsin
❌  v-if + v-for bitta elementda → computed orqali filter qilinsin
❌  reactive() destructure      → toRefs() ishlatilsin
❌  computed() ichida side-effect → API call, DOM o'zgartirish taqiqlangan
❌  Props mutate qilish         → emit orqali o'zgartirilsin
❌  Lifecycle hook shartli      → doim top-level da chaqirilsin
❌  Template ref onMounted siz  → setup vaqtida null bo'ladi
❌  v-html sanitize siz         → DOMPurify.sanitize() majburiy
❌  100+ element to'g'ri render → virtual scroll ishlatilsin
❌  Event listener tozalanmagan → onUnmounted da olib tashlash kerak
❌  TypeScript enum             → const object + as const ishlatilsin
❌  Non-null assertion zanjiri  → optional chaining (?.) ishlatilsin
❌  Store dan model expose      → DTO/Response type orqali chiqarilsin
```

### Majburiy — har doim yozing

```
✅  <script setup lang="ts">                — barcha komponentda
✅  withDefaults(defineProps<Props>())      — typed props, default qiymatlar
✅  defineEmits<Emits>()                   — typed emits
✅  onUnmounted da cleanup                 — timer, event listener, subscription
✅  Async da try/catch/finally             — isLoading + error holatlari
✅  Pinia store da readonly()              — state ni himoya qilish
✅  Router da lazy loading                 — () => import('./View.vue')
✅  API response type guard bilan          — runtime tekshirish
✅  import type                            — runtime bundle ga kirmaydigan importlar
✅  Skeleton + error + empty holatlari     — har qanday async render uchun
```

### Fayl tuzilishi — standart

```
src/
├── assets/
├── components/
│   ├── common/        ← qayta ishlatiladigan UI (props only, store yo'q)
│   ├── layout/        ← Header, Sidebar, Footer
│   └── features/      ← biznes komponentlar
├── composables/       ← useX.ts (lifecycle + state + logika)
├── directives/        ← custom directives
├── layouts/           ← router layout lar
├── router/
│   ├── index.ts
│   └── guards/
├── services/
│   └── api/           ← axios instance + typed endpoints
├── stores/            ← Pinia stores (x.store.ts)
├── types/             ← interface, type, InjectionKey
├── utils/             ← formatters, validators (pure functions)
└── views/             ← sahifalar (logika composable/store da)
```

### Naming convention

| Narsa | Format | Misol |
|-------|--------|-------|
| Komponent fayl | `PascalCase.vue` | `UserCard.vue` |
| Composable | `useX.ts` | `useAuth.ts` |
| Store | `x.store.ts` | `auth.store.ts` |
| Type / Interface | `PascalCase` | `UserResponse` |
| Const object | `SCREAMING_SNAKE_CASE` | `USER_ROLES` |
| CSS class | `kebab-case` | `user-card__title` |

---

## Kod Yozgandan Keyin — Majburiy O'z-O'zini Review

> **Bu qadam o'tkazib yuborilmaydi.**
> Har qanday kod yozib bo'lgach, javob berishdan OLDIN
> quyidagi checklistni o'tkazing. Muammo topilsa — darhol tuzating.

### 1. Reaktivlik va Composition API

```
□  ref() vs reactive() — to'g'ri tanlanganmi?
□  reactive() destructure qilinmadimi? (reaktivlik yo'qoladi)
□  computed() ichida API call yoki side-effect yo'qmi?
□  watch/watchEffect da onCleanup kerak bo'lsa qo'shilganmi?
□  Lifecycle hook shartli chaqirilmadimi?
□  Template ref onMounted tashqarisida ishlatilmadimi?
□  Props mutate qilinmadimi?
□  store.state to'g'ridan-to'g'ri o'zgartirilmadimi?
```

### 2. TypeScript xavfsizligi

```
□  any tipi yo'qmi?
□  Barcha API response type guard bilan tekshirilganmi?
□  Non-null assertion (!) zanjiri yo'qmi?
□  Type assertion (as) — type guard siz ishlatilmadimi?
□  Enum o'rniga const object + as const ishlatilganmi?
□  Optional chaining (?.) va nullish coalescing (??) kerakli joyda?
□  Composable return type aniq belgilanganmi?
```

### 3. Performance

```
□  v-for da :key — noyob id (index emas)?
□  v-if va v-for bitta elementda yo'qmi?
□  100+ element → virtual scroll bormi?
□  Og'ir komponent → defineAsyncComponent?
□  Event listenerlar onUnmounted da tozalanganmi?
□  Katta massivlar → shallowRef ishlatilganmi?
□  Keraksiz watch yo'qmi (computed bilan almashtirilsinmi)?
```

### 4. Accessibility

```
□  Interaktiv element — <button> yoki <a> (div/span emas)?
□  Form input da <label :for="id"> bormi?
□  Xato xabari role="alert" bilan belgilanganmi?
□  aria-invalid, aria-describedby to'g'ri qo'yilganmi?
□  Modal ochilganda focus shu yerga o'tganmi?
□  Modal yopilganda focus oldingi elementga qaytganmi?
□  Esc klavishi modalni yopadimi?
```

### 5. Umumiy sifat

```
□  Komponent 200 satrdan oshmayaptimi? (oshsa — bo'lish kerak)
□  Biznes logika composable ga ko'chirilganmi?
□  isLoading + error + empty holatlari barchasi handle qilinganmi?
□  console.log, debug kodi qolmadimi?
□  Hardcoded string o'rniga i18n yoki constant ishlatilganmi?
```

### 6. Test

```
□  Yangi composable uchun unit test yozildimi?
□  Yangi komponent uchun integration test yozildimi?
□  Test implementation detail tekshirmayaptimi (faqat UI)?
□  Testlar mustaqilmi (biri ikkinchisiga bog'liq emas)?
```

---

## Git Commit Convention

> **Claude git commit QILMAYDI.**
> Faqat tavsiya qilingan commit message ni yozib beradi — commit ni dasturchi o'zi amalga oshiradi.

```
feat:     yangi funksionallik
fix:      xato tuzatish
refactor: logika o'zgarmasdan kodni qayta yozish
style:    formatlash, naming
test:     test qo'shish yoki o'zgartirish
chore:    konfiguratsiya, dependency
docs:     dokumentatsiya

Format:  <type>(<scope>): <tavsif>

Misol:   feat(auth): add JWT refresh token composable
         fix(user-list): fix memory leak in resize listener
         refactor(cart): extract useCartSummary composable
```

Vazifa tugagach Claude quyidagicha tavsiya beradi:

```
Tavsiya etilgan commit message:
  feat(user): add pagination to user list view

O'zgartirilgan fayllar:
  src/views/UserListView.vue
  src/composables/useUsers.ts
  src/components/common/Pagination.vue

Commitni amalga oshirish uchun:
  git add src/views/UserListView.vue src/composables/useUsers.ts src/components/common/Pagination.vue
  git commit -m "feat(user): add pagination to user list view"
```
