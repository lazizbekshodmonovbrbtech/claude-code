---
name: vue3-antipatterns
description: Vue 3 da hech qachon qilinmaydigan kritik xatolar — memory leak, reaktivlik yo'qolishi, XSS, lifecycle hook xatolari. Kod review da MAJBURIY tekshiriladi.
---

# Vue 3 — Kritik Anti-Patternlar

## HECH QACHON QILMANG

```typescript
// ❌ 1. reactive() ni to'g'ridan-to'g'ri return qilish
// Destructure qilinganda reaktivlik yo'qoladi
function useData() {
  const state = reactive({ count: 0, name: '' })
  return state // XATO!
  // ✅ TO'G'RI:
  return { ...toRefs(state) }
}

// ❌ 2. Computed ni yozish — getter only!
const doubled = computed(() => count.value * 2)
doubled.value = 10 // TypeError! Writable computed kerak bo'lsa:
// ✅ TO'G'RI:
const doubled = computed({
  get: () => count.value * 2,
  set: (val) => { count.value = val / 2 }
})

// ❌ 3. Lifecycle hook ni shartli chaqirish — doim top-level da
if (condition) {
  onMounted(() => {}) // XATO! Vue uni e'tiborsiz qoldiradi
}
// ✅ Shart ni hook ichiga oling:
onMounted(() => { if (condition) { doSomething() } })

// ❌ 4. Template ref ni onMounted dan oldin ishlatish
const el = ref(null)
el.value.focus() // XATO! Setup vaqtida null
// ✅ TO'G'RI:
onMounted(() => el.value?.focus())

// ❌ 5. Props ni mutate qilish
const props = defineProps<{ user: User }>()
props.user = newUser       // XATO! Vue warning
props.user.name = 'Ali'    // XATO! Prop mutation

// ✅ TO'G'RI: emit orqali parent ga xabar bering
emit('update:user', { ...props.user, name: 'Ali' })
```

---

## MEMORY LEAK — EVENT LISTENER

```typescript
// ❌ XATO: tozalanmagan event listener
onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClick)
  // onUnmounted da tozalanmaydi → memory leak!
})

// ✅ TO'G'RI: har doim juft holda
onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))

// ✅ YOKI: useEventListener() composable
import { useEventListener } from '@vueuse/core'
useEventListener(window, 'resize', handleResize) // avtomatik tozalanadi
```

---

## XSS — V-HTML XAVFI

```vue
<!-- ❌ XATO: foydalanuvchi inputini to'g'ridan-to'g'ri render qilish -->
<div v-html="userInput" />

<!-- ✅ TO'G'RI: sanitize qilgandan keyin -->
<div v-html="DOMPurify.sanitize(userInput)" />

<!-- ✅ YAXSHISI: v-html ni umuman ishlatmang, Vue template ishlatang -->
<component :is="SafeRenderer" :content="userInput" />
```

---

## ASYNC SETUP — XATONI USHLASH

```typescript
// ❌ XATO: xato bo'lsa komponent butunlay ko'rinmaydi
const data = await fetchData()

// ✅ TO'G'RI: try-catch bilan
const data = ref(null)
const error = ref(null)
try {
  data.value = await fetchData()
} catch (e) {
  error.value = e
}
```

---

## PROVIDE/INJECT — TYPE-SAFE

```typescript
// ❌ XATO: string key — type yo'q
provide('user', currentUser)
const user = inject('user') // type: unknown

// ✅ TO'G'RI: InjectionKey — to'liq type safety
const USER_KEY: InjectionKey<Ref<User>> = Symbol('user')
provide(USER_KEY, currentUser)
const user = inject(USER_KEY) // type: Ref<User> | undefined
const user = inject(USER_KEY, ref(defaultUser)) // default bilan
```

---

## KOMPONENT ARXITEKTURA QOIDALARI

```
❌ God Component — 500+ satr, hamma logika bir joyda
✅ Single Responsibility — bitta vazifa, bitta komponent

❌ Store dan view ga to'g'ridan-to'g'ri DOM manipulyatsiya
✅ Reaktiv state → template avtomatik yangilanadi

❌ setTimeout/setInterval ni tozalamasdan qoldirish
✅ onUnmounted da clearTimeout/clearInterval

❌ Deep watch katta obyektda — sekin
✅ Aniq property ni watch qilish yoki computed ishlatish
watch(() => user.value.profile.name, handler) // ✅ Aniq path

❌ Event yoki callback bilan hal qilinadigan joyda watch ishlatish
✅ Imkon bo'lsa watch o'rniga event va callback ishlatish
```

---

## WATCH O'RNIGA EVENT VA CALLBACK

```typescript
// ❌ XATO: form submit natijasini watch qilish
const submitted = ref(false)
watch(submitted, (val) => {
  if (val) {
    sendData()
    submitted.value = false
  }
})

// ✅ TO'G'RI: to'g'ridan-to'g'ri event handler ishlatish
async function onSubmit() {
  await sendData()
}

// ❌ XATO: child komponent holatini watch qilish
const childReady = ref(false)
watch(childReady, (val) => {
  if (val) doSomething()
})

// ✅ TO'G'RI: emit orqali callback ishlatish
// Child: emit('ready')
// Parent: <ChildComponent @ready="doSomething" />

// ❌ XATO: route o'zgarganda ma'lumot yuklash uchun watch
watch(() => route.params.id, (id) => {
  fetchUser(id)
})

// ✅ TO'G'RI: beforeRouteUpdate yoki navigation guard ishlatish
onBeforeRouteUpdate(async (to) => {
  await fetchUser(to.params.id)
})

// ❌ XATO: ref o'zgarganda DOM ni yangilash uchun watch
const count = ref(0)
watch(count, (val) => {
  document.title = `Count: ${val}`
})

// ✅ TO'G'RI: watchEffect yoki computed ishlatish (agar watch zarur bo'lsa)
// Lekin bu holatda o'zgartirgan joyda to'g'ridan-to'g'ri chaqirish yaxshiroq:
function increment() {
  count.value++
  document.title = `Count: ${count.value}`
}
```

### Qachon watch ishlatish TO'G'RI:

```typescript
// ✅ Tashqi prop yoki store state o'zgarishiga reaktsiya — buni event bilan hal qilib bo'lmaydi
watch(() => props.userId, (id) => fetchUser(id))

// ✅ Bir nechta source ni kuzatish kerak bo'lganda
watch([searchQuery, selectedCategory], ([q, cat]) => {
  fetchResults(q, cat)
}, { debounce: 300 })

// ✅ Old va yangi qiymatni solishtirish kerak bo'lganda
watch(items, (newVal, oldVal) => {
  const added = newVal.filter(i => !oldVal.includes(i))
  notifyNewItems(added)
})
```
