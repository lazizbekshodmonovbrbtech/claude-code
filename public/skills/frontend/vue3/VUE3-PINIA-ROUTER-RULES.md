---
name: vue3-pinia-router
description: Vue 3 Pinia store arxitekturasi va Vue Router 4 qoidalari. Store yoki route yozishda MAJBURIY o'qiladi.
---

# Vue 3 — Pinia Store va Router Qoidalari

## 1. PINIA — SETUP STORE (AFZAL USUL)

```typescript
// ✅ TO'G'RI: Composition API uslubi — setup store
export const useAuthStore = defineStore('auth', () => {
  // State — ref bilan
  const currentUser = ref<User | null>(null)

  // Getters — computed bilan
  const isAuthenticated = computed(() => currentUser.value !== null)

  // Actions — async xatolarni tashqariga chiqaring, UI handle qilsin
  async function login(credentials: LoginCredentials): Promise<void> {
    try {
      currentUser.value = await authService.login(credentials)
    } catch (error) {
      throw error // Store yutmasin
    }
  }

  function logout(): void {
    currentUser.value = null
    useCartStore().$reset() // Bog'liq storeni tozalash
  }

  // ✅ State ni readonly qaytaring — tashqaridan mutate taqiqlangan
  return { currentUser: readonly(currentUser), isAuthenticated, login, logout }
})
```

---

## 2. PINIA — KRITIK XATOLAR

```typescript
// ❌ XATO 1: Store dan tashqarida state ni to'g'ridan-to'g'ri o'zgartirish
const store = useAuthStore()
store.currentUser = newUser // Action orqali o'zgartiring!

// ❌ XATO 2: Store ichida komponent-specific logika (UI toast, redirect)
async function login(credentials) {
  await authService.login(credentials)
  router.push('/dashboard') // Store router haqida bilmasin!
  showToast('Xush kelibsiz') // UI logikasi store da emas
}

// ❌ XATO 3: Circular import — a.store → b.store → a.store
// ✅ TO'G'RI: storeToRefs bilan reaktivlikni saqlang
const { currentUser, isAuthenticated } = storeToRefs(authStore)
// ❌ XATO: destructure qilsangiz reaktivlik yo'qoladi
const { currentUser } = authStore // REAKTIV EMAS!
```

---

## 3. STORE DECOMPOSE — TUZILISH

```
stores/
├── auth.store.ts      → Autentifikatsiya, foydalanuvchi
├── ui.store.ts        → Sidebar, theme, global notification
├── cart.store.ts      → Savat holati
└── product.store.ts   → Mahsulotlar, filter, pagination

❌ XATO: Bitta "app.store.ts" da hamma narsa
❌ XATO: Har bir komponent uchun alohida store
✅ Qoida: Feature/domain bo'yicha ajratish
```

---

## 4. VUE ROUTER 4 — LAZY LOADING MAJBURIY

```typescript
// ❌ XATO: barcha view lar bir vaqtda import qilinadi
import DashboardView from '@/views/DashboardView.vue'

// ✅ TO'G'RI: har route lazy load
const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, title: 'Dashboard' }
  },
  {
    path: '/admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] }
  }
]
```

---

## 5. NAVIGATION GUARD — AUTH TEKSHIRISH

```typescript
// ✅ TO'G'RI: router/guards/auth.guard.ts
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!to.meta.requiresAuth) {
    next()
    return
  }

  if (!authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Role tekshirish
  if (to.meta.roles && !to.meta.roles.includes(authStore.currentUser?.role)) {
    next({ name: 'forbidden' })
    return
  }

  next()
})

// ❌ XATO: Guard ichida store ni to'g'ridan-to'g'ri import qilish
// router.ts parse bo'lganda Pinia hali initialize bo'lmagan bo'lishi mumkin
// ✅ Guard ichida useStore() — Pinia tayyor bo'lgandan keyin chaqiriladi
```

---

## 6. ROUTE META TYPING

```typescript
// ✅ router/index.ts — Meta type kengaytirish
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[]
    title?: string
    layout?: 'default' | 'auth' | 'blank'
  }
}
```
