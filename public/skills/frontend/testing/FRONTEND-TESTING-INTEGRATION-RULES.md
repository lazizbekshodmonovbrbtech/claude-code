---
name: frontend-testing-integration
description: Vue Testing Library bilan komponent integration testlari, accessibility testlari va render helper sozlash. Yangi komponent yozilganda MAJBURIY o'qiladi.
---

# Frontend Testing — Integration va Accessibility Testlari

## 1. RENDER HELPER — MARKAZLASHTIRILGAN SOZLASH

```typescript
// src/test/render-helpers.ts
import { render } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'

interface RenderOptions {
  initialState?: Record<string, unknown>
  routeUrl?: string
  props?: Record<string, unknown>
}

export function renderComponent(component: Component, options: RenderOptions = {}) {
  const { initialState = {}, routeUrl = '/', ...rest } = options

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:all(.*)*', component: { template: '<div/>' } }]
  })
  if (routeUrl !== '/') router.push(routeUrl)

  const pinia = createTestingPinia({ createSpy: vi.fn, initialState })

  return render(component, {
    global: {
      plugins: [router, pinia],
      stubs: { Transition: true, TransitionGroup: true }
    },
    ...rest
  })
}
```

---

## 2. KOMPONENT INTEGRATION TEST

```typescript
// components/__tests__/LoginForm.test.ts
import { screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

describe('LoginForm', () => {
  const user = userEvent.setup()

  it('renders all form elements', () => {
    renderComponent(LoginForm)
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/parol/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /kirish/i })).toBeInTheDocument()
  })

  it('shows validation on empty submit', async () => {
    renderComponent(LoginForm)
    await user.click(screen.getByRole('button', { name: /kirish/i }))
    expect(screen.getByText(/email majburiy/i)).toBeInTheDocument()
    expect(screen.getByText(/parol majburiy/i)).toBeInTheDocument()
  })

  it('shows error for invalid email format', async () => {
    renderComponent(LoginForm)
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'notanemail')
    await user.click(screen.getByRole('button', { name: /kirish/i }))
    expect(screen.getByText(/email formati noto'g'ri/i)).toBeInTheDocument()
  })

  it('calls login action with correct credentials', async () => {
    renderComponent(LoginForm)
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'ali@test.com')
    await user.type(screen.getByLabelText(/parol/i), 'Password1')
    await user.click(screen.getByRole('button', { name: /kirish/i }))

    const store = useAuthStore()
    expect(store.login).toHaveBeenCalledWith({ email: 'ali@test.com', password: 'Password1' })
  })

  it('disables button during loading', async () => {
    renderComponent(LoginForm, { initialState: { auth: { isLoading: true } } })
    expect(screen.getByRole('button', { name: /kirish/i })).toBeDisabled()
  })

  it('shows server error message', () => {
    renderComponent(LoginForm, {
      initialState: { auth: { error: 'Email yoki parol noto\'g\'ri' } }
    })
    expect(screen.getByRole('alert')).toHaveTextContent(/email yoki parol noto'g'ri/i)
  })
})
```

---

## 3. ACCESSIBILITY TEST

```typescript
// components/__tests__/Modal.a11y.test.ts
describe('Modal — Accessibility', () => {
  const user = userEvent.setup()

  it('has correct ARIA attributes', () => {
    renderComponent(Modal, { props: { isOpen: true, title: 'Test Modal' } })

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    const titleId = dialog.getAttribute('aria-labelledby')
    expect(document.getElementById(titleId!)).toHaveTextContent('Test Modal')
  })

  it('closes on Escape key', async () => {
    const onClose = vi.fn()
    renderComponent(Modal, { props: { isOpen: true, title: 'Test', onClose } })
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('traps focus inside dialog', async () => {
    renderComponent(Modal, {
      props: { isOpen: true, title: 'Test' },
      slots: { default: '<button>Action 1</button><button>Action 2</button>' }
    })
    const dialog = screen.getByRole('dialog')
    await user.tab()
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
  })
})

// Form a11y test
describe('BaseInput — Accessibility', () => {
  it('links label to input', () => {
    renderComponent(BaseInput, { props: { label: 'Email', modelValue: '' } })
    const input = screen.getByRole('textbox', { name: /email/i })
    expect(input).toBeInTheDocument()
  })

  it('announces error via role=alert', async () => {
    renderComponent(BaseInput, {
      props: { label: 'Email', modelValue: '', error: 'Majburiy maydon' }
    })
    expect(screen.getByRole('alert')).toHaveTextContent('Majburiy maydon')
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('links input to error message via aria-describedby', () => {
    renderComponent(BaseInput, {
      props: { label: 'Email', modelValue: '', error: 'Xato' }
    })
    const input = screen.getByRole('textbox')
    const errorId = input.getAttribute('aria-describedby')
    expect(document.getElementById(errorId!)).toHaveTextContent('Xato')
  })
})
```

---

## 4. ANTI-PATTERNLAR — HECH QACHON QILMANG

```typescript
// ❌ 1. Implementation detail ga test yozish
expect(wrapper.vm.internalState).toBe(true) // Internal state — fragile!
expect(wrapper.vm.$data.count).toBe(1)

// ✅ Foydalanuvchi ko'radigan narsani test qiling
expect(screen.getByText('1')).toBeInTheDocument()

// ❌ 2. Snapshot test — har o'zgarishda sinadi, ma'nosiz
expect(wrapper.html()).toMatchSnapshot()

// ✅ Aniq assertion
expect(screen.getByRole('button')).toHaveTextContent('Saqlash')
expect(screen.getByRole('button')).not.toBeDisabled()

// ❌ 3. Testlar bir-biriga bog'liq
let sharedStore: any
beforeAll(() => { sharedStore = setup() })
it('test1', () => { sharedStore.modify() })
it('test2', () => { expect(sharedStore.val).toBe(1) }) // test1 ga bog'liq!

// ✅ Har test mustaqil: beforeEach da reset
beforeEach(() => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
})

// ❌ 4. setTimeout bilan kutish
await new Promise(r => setTimeout(r, 500)) // Sekin, noaniq

// ✅ waitFor yoki flushPromises
await waitFor(() => expect(screen.getByText('Yuklandi')).toBeInTheDocument())
await flushPromises()
```
