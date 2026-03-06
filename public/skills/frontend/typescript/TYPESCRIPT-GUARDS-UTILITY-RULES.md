---
name: typescript-guards-utility
description: TypeScript type guards, discriminated union, utility types (Omit, Pick, Partial, ReturnType...). API response, DTO va runtime type tekshirishda MAJBURIY o'qiladi.
---

# TypeScript — Type Guards va Utility Types

## 1. TYPE GUARD — RUNTIME TEKSHIRISH

```typescript
// ✅ User-defined type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value &&
    typeof (value as User).id === 'number' &&
    typeof (value as User).name === 'string'
  )
}

// Ishlatish:
const raw = await response.json()
if (!isUser(raw)) throw new Error('Invalid response')
// Bu yerda raw: User — TypeScript biladi

// ✅ Assertion function — throw bilan
function assertDefined<T>(value: T | null | undefined, name: string): asserts value is T {
  if (value == null) throw new Error(`${name} aniqlanmagan`)
}

assertDefined(userId, 'userId')
// Bu yerdan pastda userId: string | number — null/undefined emas
```

---

## 2. DISCRIMINATED UNION — ENG KUCHLI PATTERN

```typescript
// ✅ API state uchun — har case aniq tip
type ApiState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

// TypeScript exhaustiveness check — barcha case covered bo'lishi majburiy
function renderState<T>(state: ApiState<T>): string {
  switch (state.status) {
    case 'idle':    return 'Hali yuklanmagan'
    case 'loading': return 'Yuklanmoqda...'
    case 'success': return `${state.data}` // state.data mavjud
    case 'error':   return state.error.message
    // Agar yangi status qo'shilsa — TypeScript bu yerda xato beradi
  }
}

// Vue 3 komponentda:
const state = ref<ApiState<User[]>>({ status: 'idle' })

async function load() {
  state.value = { status: 'loading' }
  try {
    state.value = { status: 'success', data: await fetchUsers() }
  } catch (e) {
    state.value = { status: 'error', error: e as Error }
  }
}
```

---

## 3. UTILITY TYPES — DTO PATTERN

```typescript
interface Product {
  id: number
  name: string
  price: number
  description: string
  categoryId: number
  isActive: boolean
  createdAt: Date
}

// ✅ Omit — id va timestamps kerak emas (CREATE uchun)
type CreateProductDto = Omit<Product, 'id' | 'createdAt'>

// ✅ Partial + Omit — UPDATE uchun (barcha maydon optional)
type UpdateProductDto = Partial<Omit<Product, 'id' | 'createdAt'>>

// ✅ Pick — LIST uchun faqat kerakli maydonlar
type ProductListItem = Pick<Product, 'id' | 'name' | 'price' | 'isActive'>

// ✅ Readonly — immutable response
type ReadonlyProduct = Readonly<Product>

// ✅ ReturnType / Awaited — function return typidan olish
async function fetchUser(id: number): Promise<User> { ... }
type UserReturn = Awaited<ReturnType<typeof fetchUser>> // = User

// ✅ Parameters — function parametrlaridan olish
type FetchParams = Parameters<typeof fetchUser> // = [number]

// ✅ Extract / Exclude — union manipulation
type NonNullStatus = Exclude<Status | null | undefined, null | undefined>
type SuccessOrError = Extract<ApiState<unknown>, { status: 'success' | 'error' }>
```

---

## 4. TYPE ASSERTION — FAQAT ZARUR HOLDA

```typescript
// ❌ XATO: blind assertion — runtime crash xavfi
const user = data as User

// ✅ TO'G'RI: type guard bilan
if (isUser(data)) {
  const user = data // TypeScript User deb biladi
}

// ❌ XATO: HTMLElement assertion xavfsiz emas
const el = document.getElementById('app') as HTMLInputElement
el.value = 'test' // Agar el input emas bo'lsa — crash!

// ✅ TO'G'RI: instanceof
const el = document.getElementById('app')
if (el instanceof HTMLInputElement) {
  el.value = 'test'
}

// ❌ XATO: Non-null assertion (!) zanjiri
const val = obj!.prop!.nested!.value // Har birida crash xavfi

// ✅ TO'G'RI: optional chaining + nullish coalescing
const val = obj?.prop?.nested?.value ?? defaultValue
```
