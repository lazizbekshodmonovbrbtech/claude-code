---
name: vue3-composition-api
description: Vue 3 Composition API qoidalari — script setup, reaktivlik (ref/reactive/computed/watch), props va emits. Yangi komponent yozishda MAJBURIY o'qiladi.
---

# Vue 3 — Composition API Qoidalari

## 1. `<script setup>` — MAJBURIY

```vue
<!-- ✅ TO'G'RI -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

<!-- ❌ XATO: Options API yangi komponentlarda taqiqlangan -->
<script>
export default {
  data() { return { count: 0 } }
}
</script>
```

---

## 2. REAKTIVLIK — TO'G'RI TANLASH

```typescript
// ✅ Primitiv uchun ref()
const isLoading = ref(false)
const count = ref(0)

// ✅ Obyekt uchun reactive() — lekin destructure qilmang!
const form = reactive({ email: '', password: '' })

// ❌ XATO: reaktivlik yo'qoladi
const { email } = form

// ✅ TO'G'RI: toRefs() bilan
const { email, password } = toRefs(form)
```

```vue
<!-- ❌ XATO: template da .value keraksiz -->
<p>{{ count.value }}</p>

<!-- ✅ TO'G'RI: template avtomatik unwrap qiladi -->
<p>{{ count }}</p>
```

---

## 3. COMPOSABLE — LOGIKANI AJRATISH

```typescript
// ❌ XATO: hamma narsa komponent ichida
// ✅ TO'G'RI: composables/useUsers.ts
export function useUsers() {
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchUsers() {
    isLoading.value = true
    error.value = null
    try {
      users.value = (await apiClient.get<User[]>('/users')).data
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchUsers)
  return { users: readonly(users), isLoading: readonly(isLoading), error: readonly(error), refetch: fetchUsers }
}
```

---

## 4. PROPS VA EMITS — ANIQ TYPE BILAN

```typescript
// ✅ TO'G'RI: Generic defineProps + defineEmits
interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  variant: 'primary'
})

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'blur', event: FocusEvent): void
}
const emit = defineEmits<Emits>()

// ❌ XATO: runtime declaration — type xavfsizligi yo'q
const props = defineProps({ modelValue: String, disabled: Boolean })

// ❌ XATO: props ni mutate qilmang
props.modelValue = 'new' // Vue warning!
```

---

## 5. WATCH VS WATCHEFFECT

```typescript
// ✅ watch — eski/yangi qiymat kerak, aniq manba
watch(userId, async (newId, oldId) => {
  if (newId !== oldId) await fetchUser(newId)
}, { immediate: true })

// ✅ watchEffect — bir nechta dependency, immediate
watchEffect(async () => {
  if (userId.value && token.value) await fetchData(userId.value)
})

// ❌ XATO: cleanup yo'q — memory leak!
watchEffect(() => {
  const timer = setInterval(() => tick(), 1000)
})

// ✅ TO'G'RI: onCleanup bilan
watchEffect((onCleanup) => {
  const timer = setInterval(() => tick(), 1000)
  onCleanup(() => clearInterval(timer))
})

// ❌ XATO: computed ichida side-effect
const data = computed(() => { apiCall() /* XATO */ ; return items.value.map(fn) })

// ✅ computed faqat pure hisoblash
const data = computed(() => items.value.filter(x => x.active).map(fn))
```
