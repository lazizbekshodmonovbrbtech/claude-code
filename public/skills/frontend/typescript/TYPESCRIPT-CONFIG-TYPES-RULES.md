---
name: typescript-config-types
description: TypeScript strict konfiguratsiya, type vs interface farqi, `any` taqiqlangan va barcha xavfsiz alternativalar. Har qanday TypeScript faylida MAJBURIY qoidalar.
---

# TypeScript — Konfiguratsiya va Asosiy Tiplar

## 1. TSCONFIG — STRICT MODE MAJBURIY

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "useUnknownInCatchVariables": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "@/*": ["./src/*"],
      "@types/*": ["./src/types/*"],
      "@stores/*": ["./src/stores/*"]
    }
  }
}
```

---

## 2. TYPE VS INTERFACE

```typescript
// ✅ Interface — obyekt shakli, kengaytirish uchun
interface User {
  id: number
  name: string
  email: string
}

interface AdminUser extends User {
  permissions: string[]
  lastLogin: Date
}

// ✅ Interface — generic bilan
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: { page: number; perPage: number; total: number }
}

// ✅ Type — union, intersection, utility uchun
type Status = 'idle' | 'loading' | 'success' | 'error'
type UserOrAdmin = User | AdminUser
type CreateUserDto = Omit<User, 'id'>
type UserKeys = keyof User
```

---

## 3. `any` MUTLAQO TAQIQLANGAN — ALTERNATIVALAR

```typescript
// ❌ KRITIK XATO: any — type safety yo'q, runtime crash xavfi
function process(data: any): any { return data.value }

// ✅ 1. unknown — xavfsiz, type check majburiy
function processInput(input: unknown): string {
  if (typeof input === 'string') return input.toUpperCase()
  if (typeof input === 'number') return String(input)
  throw new Error(`Kutilmagan tip: ${typeof input}`)
}

// ✅ 2. Generics — tip saqlanadi
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// ✅ 3. Union types — aniq qiymatlar
function format(value: string | number | boolean): string {
  return String(value)
}

// ✅ 4. Record — dinamik key uchun
const cache: Record<string, User> = {}
const statusLabels: Record<Status, string> = {
  idle: 'Tayyor',
  loading: 'Yuklanmoqda',
  success: 'Muvaffaqiyatli',
  error: 'Xato'
}
```

---

## 4. ENUM TAQIQLANGAN — CONST OBJECT ISHLATING

```typescript
// ❌ XATO: TypeScript enum — JS bundle da ugly, tree-shaking muammo
enum UserRole { ADMIN = 'admin', USER = 'user' }

// ✅ TO'G'RI: const object + type extraction
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
} as const

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
// = 'admin' | 'user' | 'moderator'

// Foydalanish:
function hasAccess(role: UserRole): boolean { ... }
hasAccess(USER_ROLES.ADMIN)  // ✅
hasAccess('superadmin')       // ❌ TypeScript xato beradi
```

---

## 5. IMPORT — TYPE-ONLY VA PATH ALIAS

```typescript
// ✅ Type-only import — runtime bundle ga kirmaydi
import type { User, Product } from '@/types'
import type { Ref, ComputedRef } from 'vue'

// ✅ Barrel export — components/common/index.ts
export { default as Button } from './Button.vue'
export { default as Input }  from './Input.vue'
export type { ButtonProps }  from './Button.vue'

// Ishlatish:
import { Button, Input } from '@/components/common'
// ❌ Emas:
import Button from '@/components/common/Button.vue'
import Input  from '@/components/common/Input.vue'
```
