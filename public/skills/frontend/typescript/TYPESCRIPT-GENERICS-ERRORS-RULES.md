---
name: typescript-generics-errors
description: TypeScript generics amaliy misollar (API client, composable, validator), typed error classes, Result pattern, async/await type safety. Service va composable yozishda MAJBURIY o'qiladi.
---

# TypeScript — Generics va Error Handling

## 1. GENERICS — AMALIY MISOLLAR

### Generic API Client

```typescript
// ✅ Type-safe API client
class ApiClient {
  async get<T>(url: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const response = await fetch(url + (params ? '?' + new URLSearchParams(params) : ''))
    if (!response.ok) throw new ApiError(response.status, response.statusText)
    return response.json() as Promise<ApiResponse<T>>
  }

  async post<TBody, TResponse>(url: string, body: TBody): Promise<ApiResponse<TResponse>> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!response.ok) throw new ApiError(response.status, response.statusText)
    return response.json()
  }
}

// Ishlatish — to'liq type inference:
const users = await api.get<User[]>('/users')        // ApiResponse<User[]>
const user  = await api.post<CreateUserDto, User>('/users', dto) // ApiResponse<User>
```

---

### Generic Composable

```typescript
// ✅ Generic useAsync — istalgan fetch uchun qayta ishlatiladigan
function useAsync<T>(fn: () => Promise<T>) {
  const state = ref<ApiState<T>>({ status: 'idle' })

  async function execute() {
    state.value = { status: 'loading' }
    try {
      const data = await fn()
      state.value = { status: 'success', data }
    } catch (error) {
      state.value = { status: 'error', error: error as Error }
    }
  }

  const data    = computed(() => state.value.status === 'success' ? state.value.data : null)
  const isLoading = computed(() => state.value.status === 'loading')
  const error   = computed(() => state.value.status === 'error' ? state.value.error : null)

  return { data, isLoading, error, execute }
}

// Ishlatish:
const { data: users, isLoading, execute: loadUsers } = useAsync(() => api.get<User[]>('/users'))
```

---

### Generic Form Validator

```typescript
type Rule<T> = (value: T) => string | null

function createValidator<T>(rules: Rule<T>[]) {
  return (value: T): string[] =>
    rules.map(r => r(value)).filter((msg): msg is string => msg !== null)
}

const validateEmail = createValidator<string>([
  v => !v ? 'Email majburiy' : null,
  v => !v.includes('@') ? 'Email formati noto\'g\'ri' : null,
  v => v.length > 255 ? 'Email juda uzun' : null,
])

validateEmail('')          // ['Email majburiy']
validateEmail('notanemail') // ["Email formati noto'g'ri"]
validateEmail('ok@test.com') // []
```

---

## 2. ERROR HANDLING — TYPE-SAFE

```typescript
// ✅ Custom typed error class
class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

class ValidationError extends AppError {
  constructor(public readonly field: string, message: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

// ✅ catch blokida unknown — strict mode
try {
  await riskyOperation()
} catch (error: unknown) {
  if (error instanceof ValidationError) {
    showFieldError(error.field, error.message)
  } else if (error instanceof AppError) {
    showToast(error.message, 'error')
  } else if (error instanceof Error) {
    console.error('Kutilmagan xato:', error)
  }
}

// ✅ Result pattern — exception o'rniga (functional uslub)
type Result<T, E = Error> =
  | { ok: true;  value: T }
  | { ok: false; error: E }

async function safeCall<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, value: await fn() }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) }
  }
}

const result = await safeCall(() => api.get<User>(`/users/${id}`))
if (!result.ok) { showError(result.error.message); return }
displayUser(result.value.data)
```

---

## 3. ASYNC — TYPE SAFETY

```typescript
// ✅ Promise.all — tuple typing avtomatik
const [users, products, categories] = await Promise.all([
  api.get<User[]>('/users'),
  api.get<Product[]>('/products'),
  api.get<Category[]>('/categories')
])
// Har birining tipi to'g'ri infer qilinadi

// ✅ Promise.allSettled — partial failure handle
const results = await Promise.allSettled([loadCritical(), loadOptional()])
const [critical, optional] = results
if (critical.status === 'rejected') throw critical.reason
const optionalData = optional.status === 'fulfilled' ? optional.value : null

// ✅ AbortController — request bekor qilish
function useAbortableFetch<T>(url: string) {
  const controller = new AbortController()
  onUnmounted(() => controller.abort())

  async function fetch(): Promise<T> {
    const response = await window.fetch(url, { signal: controller.signal })
    return response.json()
  }
  return { fetch }
}
```
