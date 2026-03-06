---
name: frontend-testing-e2e
description: Playwright E2E testlari, Page Object Model pattern, test fixtures va Playwright sozlash. Kritik user flow uchun E2E test yozishda MAJBURIY o'qiladi.
---

# Frontend Testing — E2E Playwright Testlari

## 1. PLAYWRIGHT SOZLASH

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['list'], ['junit', { outputFile: 'playwright-results/junit.xml' }],
       ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : [['html', { open: 'on-failure' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry'
  }
})
```

---

## 2. PAGE OBJECT MODEL — MAJBURIY PATTERN

```typescript
// e2e/pages/LoginPage.ts
export class LoginPage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorAlert: Locator

  constructor(private page: Page) {
    this.emailInput   = page.getByRole('textbox', { name: /email/i })
    this.passwordInput = page.getByLabel(/parol/i)
    this.submitButton  = page.getByRole('button', { name: /kirish/i })
    this.errorAlert    = page.getByRole('alert')
  }

  async goto()                              { await this.page.goto('/login') }
  async login(email: string, pass: string)  {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(pass)
    await this.submitButton.click()
  }
  async waitForDashboard()                  { await this.page.waitForURL('/dashboard') }
}

// e2e/pages/DashboardPage.ts
export class DashboardPage {
  readonly welcomeMessage: Locator
  readonly userMenuButton: Locator
  readonly logoutItem: Locator

  constructor(private page: Page) {
    this.welcomeMessage = page.getByTestId('welcome-message')
    this.userMenuButton = page.getByRole('button', { name: /foydalanuvchi/i })
    this.logoutItem     = page.getByRole('menuitem', { name: /chiqish/i })
  }
}
```

---

## 3. E2E TESTLAR — AUTH SSENARIYLAR

```typescript
// e2e/tests/auth.spec.ts
test.describe('Autentifikatsiya', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies()
  })

  test('to\'g\'ri ma\'lumotlar bilan login', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboard = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.login('ali@test.com', 'Password1')
    await loginPage.waitForDashboard()

    await expect(dashboard.welcomeMessage).toContainText('Xush kelibsiz, Ali')
  })

  test('noto\'g\'ri parol uchun xato ko\'rsatish', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await loginPage.login('ali@test.com', 'wrongpass')

    await expect(loginPage.errorAlert).toBeVisible()
    await expect(loginPage.errorAlert).toContainText(/noto'g'ri/i)
    await expect(page).toHaveURL('/login')
  })

  test('himoyalangan route redirect qilish', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
    await expect(page).toHaveURL(/redirect=.*dashboard/)
  })

  test('logout muvaffaqiyatli ishlashi', async ({ page }) => {
    // Avval login
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('ali@test.com', 'Password1')
    await loginPage.waitForDashboard()

    // Logout
    const dashboard = new DashboardPage(page)
    await dashboard.userMenuButton.click()
    await dashboard.logoutItem.click()

    await expect(page).toHaveURL('/login')
    // Session tugaganini tekshirish
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})
```

---

## 4. TEST FIXTURES — TEZKOR AUTH

```typescript
// e2e/fixtures/auth.fixture.ts
import { test as base } from '@playwright/test'

type Fixtures = {
  userPage:  Page
  adminPage: Page
}

export const test = base.extend<Fixtures>({
  // Oddiy foydalanuvchi — API orqali tez login
  userPage: async ({ page }, use) => {
    const { token } = await (await page.request.post('/api/auth/test-token', {
      data: { role: 'USER' }
    })).json()
    await page.context().addCookies([{ name: 'auth_token', value: token, domain: 'localhost', path: '/' }])
    await use(page)
  },

  // Admin foydalanuvchi
  adminPage: async ({ page }, use) => {
    const { token } = await (await page.request.post('/api/auth/test-token', {
      data: { role: 'ADMIN' }
    })).json()
    await page.context().addCookies([{ name: 'auth_token', value: token, domain: 'localhost', path: '/' }])
    await use(page)
  }
})

// Ishlatish:
// e2e/tests/products.spec.ts
import { test } from '../fixtures/auth.fixture'

test('admin mahsulot qo\'sha oladi', async ({ adminPage }) => {
  await adminPage.goto('/products/new')
  // ...
})
```

---

## 5. E2E QOIDALARI

```
✅ Faqat kritik user flow uchun E2E yozing:
   - Login / Logout / Register
   - Asosiy CRUD operatsiyalar
   - To'lov jarayoni
   - Muhim form submission

❌ Har bir tugma uchun E2E yozmang — bu integration test vazifasi

✅ Locator strategiyasi (ustuvorlik tartibi):
   1. getByRole() — eng yaxshi (semantik, a11y bilan mos)
   2. getByLabel() — form elementlari uchun
   3. getByTestId() — dinamik content uchun
   4. getByText() — statik content uchun
   ❌ CSS selector — fragile, refactoring da sinadi

✅ wait-for, retry — flaky testlarni kamaytirish:
   await expect(element).toBeVisible() // avtomatik retry
   await page.waitForURL('/dashboard') // navigation
   // ❌ page.waitForTimeout(2000) — hech qachon!
```
