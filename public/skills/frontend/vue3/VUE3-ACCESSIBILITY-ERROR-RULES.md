---
name: vue3-accessibility-error
description: Vue 3 accessibility (A11Y), global error handling, Teleport va fayl tuzilishi qoidalari. Har qanday komponent yoki sahifa yozishda MAJBURIY o'qiladi.
---

# Vue 3 — Accessibility, Error Handling va Struktura

## 1. ACCESSIBILITY — MAJBURIY QOIDALAR

```vue
<!-- ❌ XATO: div ni button sifatida ishlatish -->
<div @click="handleClick">Bosing</div>

<!-- ✅ TO'G'RI: semantik HTML + ARIA -->
<button
  @click="handleClick"
  :aria-label="ariaLabel"
  :aria-pressed="isActive"
  :aria-disabled="isDisabled"
>{{ label }}</button>
```

---

## 2. FORM ACCESSIBILITY

```vue
<template>
  <div role="group" :aria-labelledby="groupId">
    <label :for="inputId">
      {{ label }}
      <span aria-hidden="true" v-if="required">*</span>
    </label>
    <input
      :id="inputId"
      v-model="modelValue"
      :aria-required="required"
      :aria-invalid="hasError ? 'true' : 'false'"
      :aria-describedby="hasError ? `${inputId}-error` : undefined"
    />
    <span
      v-if="hasError"
      :id="`${inputId}-error`"
      role="alert"
      class="error-message"
    >{{ errorMessage }}</span>
  </div>
</template>
```

---

## 3. MODAL / DIALOG ACCESSIBILITY

```vue
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      @keydown.esc="close"
      ref="dialogRef"
    >
      <div @click.self="close" class="backdrop" aria-hidden="true" />
      <div class="dialog-content">
        <h2 :id="titleId">{{ title }}</h2>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
// ✅ Focus management — dialog ochilganda va yopilganda
const previousFocus = ref<HTMLElement | null>(null)
const dialogRef = ref<HTMLElement | null>(null)

function open() {
  previousFocus.value = document.activeElement as HTMLElement
  isOpen.value = true
  nextTick(() => dialogRef.value?.focus())
}

function close() {
  isOpen.value = false
  previousFocus.value?.focus() // Fokusni qaytarish
}
</script>
```

---

## 4. TELEPORT — TO'G'RI FOYDALANISH

```vue
<!-- ✅ Modal, tooltip, dropdown — z-index muammolarini hal qiladi -->
<Teleport to="body">
  <div v-if="isOpen" class="modal">...</div>
</Teleport>

<!-- ✅ SSR bilan muvofiqlashish -->
<Teleport to="body" :disabled="!isMounted">
  <Tooltip v-if="showTooltip" />
</Teleport>

<script setup>
const isMounted = ref(false)
onMounted(() => { isMounted.value = true })
</script>
```

---

## 5. GLOBAL ERROR HANDLING

```typescript
// main.ts
app.config.errorHandler = (error, instance, info) => {
  console.error('Vue Error:', { error, component: instance?.$options.name, info })
  monitoringService.captureError(error) // Sentry yoki boshqa
}

// ✅ Komponent darajasida — useErrorBoundary composable
export function useErrorBoundary() {
  const error = ref<Error | null>(null)

  onErrorCaptured((err, instance, info) => {
    error.value = err
    console.error(`Error captured in ${info}:`, err)
    return false // Xatoni bu yerda to'xtatish
  })

  return { error: readonly(error) }
}
```

---

## 6. FAYL TUZILISHI — STANDART

```
src/
├── assets/
├── components/
│   ├── common/        → Button, Input, Modal, Badge...
│   ├── layout/        → Header, Sidebar, Footer
│   └── features/      → Biznes komponentlar
├── composables/       → useAuth, useUsers, useForm...
├── directives/        → v-focus, v-permission...
├── layouts/           → DefaultLayout, AuthLayout
├── router/
│   ├── index.ts
│   └── guards/
├── services/
│   └── api/           → axios instance + endpoints
├── stores/            → Pinia stores
├── types/             → interfaces, enums, DTOs
├── utils/             → formatters, validators
└── views/             → Page komponentlar (router level)
```

**Qoidalar:**
- `views/` — faqat sahifalar, logika composable/store da
- `components/common/` — props only, store dan mustaqil
- `composables/` — `useX` nomlanadi, lifecycle o'z ichida
