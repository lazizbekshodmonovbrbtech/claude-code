---
name: frontend-testing-unit
description: Frontend testing strategiyasi, Vitest sozlash, composable va store unit testlari. Yangi composable, store yoki utility yozilganda MAJBURIY o'qiladi.
---

# Frontend Testing — Strategiya va Unit Testlar

## 1. TESTING PYRAMID

```
         /\
        /E2E\          ← Kritik user flow (5-10%)
       /------\
      /Integr. \       ← Komponent + API (25-35%)
     /----------\
    / Unit Tests  \    ← Composable, store, utils (55-65%)
   /--------------\
```

- **Unit**: tezkor, izolyatsiya, composable/utils/store logikasi
- **Integration**: komponent + bola komponent + store birga
- **E2E**: real browser, haqiqiy user ssenariylari

---

## 2. VITEST SOZLASH

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: process.env.CI ? ['text', 'cobertura'] : ['text', 'html'],
      thresholds: { lines: 80, functions: 80, branches: 75 }
    },
    reporters: process.env.CI ? ['verbose', 'junit'] : ['verbose'],
    outputFile: { junit: './junit-report.xml' }
  }
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
vi.mock('@/services/api', () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }
}))
```

---

## 3. COMPOSABLE UNIT TEST

```typescript
// ✅ withSetup helper — composable ni Vue context ichida test
function withSetup<T>(composable: () => T): T {
  let result!: T
  const app = createApp({ setup() { result = composable(); return () => {} } })
  app.use(createPinia())
  app.mount(document.createElement('div'))
  return result
}

// composables/__tests__/useCounter.test.ts
describe('useCounter', () => {
  it('initializes with default 0', () => {
    const { count } = withSetup(() => useCounter())
    expect(count.value).toBe(0)
  })

  it('initializes with provided value', () => {
    const { count } = withSetup(() => useCounter(5))
    expect(count.value).toBe(5)
  })

  it('increments correctly', () => {
    const { count, increment } = withSetup(() => useCounter())
    increment()
    increment()
    expect(count.value).toBe(2)
  })

  it('resets to initial value', () => {
    const { count, increment, reset } = withSetup(() => useCounter(3))
    increment()
    reset()
    expect(count.value).toBe(3)
  })

  it('computes doubled', () => {
    const { doubled, increment } = withSetup(() => useCounter())
    increment()
    expect(doubled.value).toBe(2)
  })
})
```

---

## 4. ASYNC COMPOSABLE TEST

```typescript
// composables/__tests__/useUsers.test.ts
import { apiClient } from '@/services/api'
import { flushPromises } from '@vue/test-utils'

const mockUsers: User[] = [
  { id: 1, name: 'Ali', email: 'ali@test.com' },
  { id: 2, name: 'Vali', email: 'vali@test.com' }
]

describe('useUsers', () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches users on mount', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockUsers })
    const { users, isLoading } = withSetup(() => useUsers())

    expect(isLoading.value).toBe(true)
    await flushPromises()

    expect(isLoading.value).toBe(false)
    expect(users.value).toEqual(mockUsers)
    expect(apiClient.get).toHaveBeenCalledWith('/users')
  })

  it('handles fetch error', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network error'))
    const { users, isLoading, error } = withSetup(() => useUsers())

    await flushPromises()

    expect(isLoading.value).toBe(false)
    expect(users.value).toEqual([])
    expect(error.value?.message).toBe('Network error')
  })
})
```

---

## 5. PINIA STORE TEST

```typescript
// stores/__tests__/auth.store.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { authService } from '@/services/auth'

vi.mock('@/services/auth')

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('authenticates on successful login', async () => {
    const mockUser = { id: 1, name: 'Ali', email: 'ali@test.com' }
    vi.mocked(authService.login).mockResolvedValueOnce(mockUser)

    const store = useAuthStore()
    await store.login({ email: 'ali@test.com', password: 'pass' })

    expect(store.currentUser).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('throws on invalid credentials', async () => {
    vi.mocked(authService.login).mockRejectedValueOnce(new Error('Invalid'))
    const store = useAuthStore()

    await expect(store.login({ email: 'x', password: 'y' })).rejects.toThrow('Invalid')
    expect(store.isAuthenticated).toBe(false)
  })

  it('clears user on logout', () => {
    const store = useAuthStore()
    store.$patch({ currentUser: { id: 1, name: 'Ali', email: 'a@b.com' } })
    store.logout()
    expect(store.currentUser).toBeNull()
  })
})
```
