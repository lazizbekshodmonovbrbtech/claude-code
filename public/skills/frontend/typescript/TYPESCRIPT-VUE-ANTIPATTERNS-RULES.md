---
name: typescript-vue-integration
description: TypeScript + Vue 3 integratsiya qoidalari — props typing, composable return types, template ref, provide/inject, va kritik anti-patternlar. Vue komponent + TypeScript birgalikda yozishda MAJBURIY o'qiladi.
---

# TypeScript — Vue 3 Integratsiya va Anti-Patternlar

## 1. COMPOSABLE RETURN TYPE — ANIQ BELGILANG

```typescript
// ❌ XATO: return type yo'q — TypeScript inference dan iborat, noaniq
export function useAuth() {
  const user = ref(null)
  // ...
  return { user, login, logout }
}

// ✅ TO'G'RI: explicit return type interface
interface UseAuthReturn {
  user: Readonly<Ref<User | null>>
  isAuthenticated: ComputedRef<boolean>
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export function useAuth(): UseAuthReturn {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => user.value !== null)
  // ...
  return { user: readonly(user), isAuthenticated, login, logout }
}
```

---

## 2. TEMPLATE REF — TO'G'RI TYPING

```typescript
// ✅ DOM element ref
const inputRef  = ref<HTMLInputElement | null>(null)
const divRef    = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// ✅ Komponent instance ref
const modalRef = ref<InstanceType<typeof MyModal> | null>(null)

// Xavfsiz ishlatish:
onMounted(() => {
  inputRef.value?.focus()
  modalRef.value?.open()
})

// ❌ XATO: non-null assertion — null bo'lishi mumkin
inputRef.value!.focus() // setup vaqtida null!
```

---

## 3. PROVIDE / INJECT — TYPE-SAFE

```typescript
// types/injection-keys.ts
import type { InjectionKey, Ref } from 'vue'

export const USER_KEY:   InjectionKey<Ref<User>>   = Symbol('user')
export const CONFIG_KEY: InjectionKey<AppConfig>   = Symbol('config')
export const THEME_KEY:  InjectionKey<Ref<Theme>>  = Symbol('theme')

// Parent komponent:
import { USER_KEY } from '@/types/injection-keys'
provide(USER_KEY, currentUser)

// Child komponent:
const user = inject(USER_KEY)           // Ref<User> | undefined
const user = inject(USER_KEY, ref(guestUser)) // default bilan — undefined yo'q

// ❌ XATO: string key — type yo'q
provide('user', currentUser)
const u = inject('user') // type: unknown!
```

---

## 4. GENERIC PROPS — MURAKKAB KOMPONENTLAR

```typescript
// ✅ Generic komponent — DataTable, Select, Autocomplete uchun
interface DataTableProps<T> {
  items: T[]
  columns: Array<{
    key: keyof T
    label: string
    sortable?: boolean
    render?: (item: T) => string
  }>
  rowKey: keyof T
  onRowClick?: (item: T) => void
}

// Vue 3.3+ dan generic components qo'llab-quvvatlanadi:
// <script setup lang="ts" generic="T">
```

---

## 5. KRITIK ANTI-PATTERNLAR

```typescript
// ❌ 1. Non-null assertion zanjiri — har birida crash xavfi
const name = store.user!.profile!.name!.toUpperCase()

// ✅ Optional chaining + default
const name = (store.user?.profile?.name ?? 'Guest').toUpperCase()

// ❌ 2. Type cast (as) — type guard siz
const user = (await response.json()) as User // Ma'lumot User emasligini bilmaymiz

// ✅ Type guard bilan validate
const raw = await response.json()
if (!isUser(raw)) throw new Error('Invalid user response')
const user = raw // User

// ❌ 3. Circular imports — runtime muammo
// a.ts → b.ts → a.ts — bu TypeScript xato bermaydi!
// ✅ Dependency direction: types → utils → services → composables → stores → views

// ❌ 4. Index signature xavfi
const map: Record<string, User> = {}
map['unknown'].name // Runtime: Cannot read 'name' of undefined

// ✅ noUncheckedIndexedAccess + optional chaining
const u = map['unknown'] // User | undefined
u?.name // xavfsiz

// ❌ 5. Haddan ortiq type complexity — compile time o'ladi
type Deep<T> = T extends object ? { [K in keyof T]: Deep<T[K]> } : T
// ✅ Faqat zarur chuqurlikda ishlatish, utility types ni zing zanjirlamang

// ❌ 6. any bilan @ts-ignore / @ts-expect-error ni suiiste'mol qilish
// @ts-ignore: Bu yerda type xato — lekin ishlaydi
const x: any = value // Butun type safetyni o'chirib yuboradi
// ✅ Agar type xato bo'lsa — type ni to'g'rilang, ignore qilmang
```

---

## 6. MAPPED VA CONDITIONAL TYPES — EHTIYOT

```typescript
// ✅ Foydali mapped type — form state uchun
type FormFields<T> = {
  [K in keyof T]: {
    value: T[K]
    error: string | null
    touched: boolean
  }
}

// ✅ Template literal types — event naming
type VueEmitEvent<T extends string> = `on${Capitalize<T>}`
// 'click' → 'onClick', 'update' → 'onUpdate'

// ⚠️ Ehtiyot: deep recursive types compile time ni sekinlashtiradi
// type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> }
// 4-5 darajadan oshmasin
```
