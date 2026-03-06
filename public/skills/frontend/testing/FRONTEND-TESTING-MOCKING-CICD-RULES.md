---
name: frontend-testing-mocking-cicd
description: MSW (Mock Service Worker) bilan API mocking va GitLab CI/CD pipeline sozlash. Test mocking va CI pipeline yozishda MAJBURIY o'qiladi.
---

# Frontend Testing — API Mocking va GitLab CI

## 1. MSW — MOCK SERVICE WORKER

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  // GET — muvaffaqiyatli javob
  http.get('/api/users', () =>
    HttpResponse.json([
      { id: 1, name: 'Ali', email: 'ali@test.com' },
      { id: 2, name: 'Vali', email: 'vali@test.com' }
    ])
  ),

  // POST — yaratish
  http.post('/api/users', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: Date.now(), ...body as object }, { status: 201 })
  }),

  // Dynamic param + 404
  http.get('/api/users/:id', ({ params }) => {
    if (params.id === '999')
      return HttpResponse.json({ message: 'Topilmadi' }, { status: 404 })
    return HttpResponse.json({ id: params.id, name: 'Test User', email: 'test@test.com' })
  })
]

// src/mocks/server.ts (test uchun)
import { setupServer } from 'msw/node'
export const server = setupServer(...handlers)

// src/test/setup.ts ga qo'shing:
import { server } from '@/mocks/server'
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## 2. TEST ICHIDA MSW OVERRIDE

```typescript
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'

// ✅ Bitta test uchun handler override
it('shows empty state when no users', async () => {
  server.use(
    http.get('/api/users', () => HttpResponse.json([]))
  )
  renderComponent(UserList)
  await waitFor(() => expect(screen.getByText(/foydalanuvchi yo'q/i)).toBeInTheDocument())
})

it('shows error on server failure', async () => {
  server.use(
    http.get('/api/users', () => HttpResponse.json(null, { status: 500 }))
  )
  renderComponent(UserList)
  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
})

// ✅ Network error simulate
it('handles network error', async () => {
  server.use(
    http.get('/api/users', () => HttpResponse.error())
  )
  renderComponent(UserList)
  await waitFor(() => expect(screen.getByText(/ulanish xatosi/i)).toBeInTheDocument())
})
```

---

## 3. GITLAB CI — TO'LIQ PIPELINE

```yaml
# .gitlab-ci.yml
default:
  image: node:20-alpine
  interruptible: true

stages: [install, validate, test, e2e, report]

.cache: &cache
  cache:
    key: { files: [package-lock.json] }
    paths: [node_modules/]
    policy: pull

# ── INSTALL ──────────────────────────────
install:
  stage: install
  cache:
    key: { files: [package-lock.json] }
    paths: [node_modules/]
    policy: push
  script: [npm ci --prefer-offline]
  rules:
    - changes: [package-lock.json, package.json]

# ── VALIDATE ─────────────────────────────
validate:types:
  stage: validate
  <<: *cache
  script: [npm run type-check]

validate:lint:
  stage: validate
  <<: *cache
  script: [npm run lint -- --max-warnings 0]

# ── UNIT + INTEGRATION ────────────────────
test:unit:
  stage: test
  <<: *cache
  script:
    - npm run test:unit -- --coverage --reporter=verbose --reporter=junit --outputFile=junit-report.xml
  coverage: '/^All files\s*\|\s*[\d.]+/'
  artifacts:
    when: always
    expire_in: 7 days
    reports:
      junit: junit-report.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths: [coverage/]
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'

# ── E2E ──────────────────────────────────
test:e2e:
  stage: e2e
  image: mcr.microsoft.com/playwright:v1.42.0-jammy
  <<: *cache
  variables:
    PLAYWRIGHT_BROWSERS_PATH: /ms-playwright
    CI: "true"
    BASE_URL: http://localhost:5173
  script:
    - npm run build
    - npm run preview &
    - npx wait-on $BASE_URL -t 30000
    - npx playwright test
  artifacts:
    when: always
    expire_in: 7 days
    reports:
      junit: playwright-results/junit.xml
    paths: [playwright-report/, playwright-results/]
  parallel: 3
  needs: [test:unit]
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH =~ /^(main|develop)$/'

# ── PAGES (Coverage report) ───────────────
pages:
  stage: report
  <<: *cache
  script:
    - npm run test:unit -- --coverage
    - mv coverage/lcov-report public/
  artifacts:
    paths: [public/]
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'
```

---

## 4. PACKAGE.JSON — SCRIPTS

```json
{
  "scripts": {
    "type-check": "vue-tsc --noEmit",
    "lint":       "eslint . --ext .vue,.ts",
    "test:unit":  "vitest run",
    "test:watch": "vitest",
    "test:e2e":   "playwright test",
    "preview":    "vite preview --port 5173"
  }
}
```
