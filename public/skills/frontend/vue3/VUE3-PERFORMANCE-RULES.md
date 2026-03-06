---
name: vue3-performance
description: Vue 3 performance qoidalari — v-for key, v-if+v-for anti-pattern, shallowRef, lazy loading, virtual scroll, v-memo. 100+ elementlik listlar yoki og'ir komponentlarda MAJBURIY o'qiladi.
---

# Vue 3 — Performance Qoidalari

## 1. V-FOR KEY — KRITIK

```vue
<!-- ❌ XATO: index key sifatida — list o'zgarganda DOM xato render -->
<li v-for="(user, index) in users" :key="index">

<!-- ❌ XATO: key yo'q -->
<li v-for="user in users">

<!-- ✅ TO'G'RI: noyob, barqaror id -->
<li v-for="user in users" :key="user.id">
```

---

## 2. V-IF + V-FOR — BIRGALIKDA TAQIQLANGAN

```vue
<!-- ❌ XATO: v-for har iteratsiyada v-if ni ham baholaydi -->
<li v-for="user in users" v-if="user.isActive" :key="user.id">

<!-- ✅ TO'G'RI: computed bilan oldin filter qiling -->
<script setup>
const activeUsers = computed(() => users.value.filter(u => u.isActive))
</script>
<template>
  <li v-for="user in activeUsers" :key="user.id">
</template>
```

---

## 3. KATTA MA'LUMOTLAR — SHALLOWREF

```typescript
// ❌ XATO: 10,000+ element uchun ref() — deep reactivity sekin
const bigList = ref(new Array(10000).fill({ name: 'item' }))

// ✅ TO'G'RI: shallowRef — faqat reference o'zgarishi reaktiv
const bigList = shallowRef<Item[]>([])

// Yangilash:
bigList.value = [...bigList.value, newItem]
// Yoki:
bigList.value.push(newItem)
triggerRef(bigList)
```

---

## 4. LAZY LOADING — DEFINEAASYNCCOMPONENT

```typescript
// ❌ XATO: hamma komponent bir vaqtda yuklanadi
import HeavyChart from './HeavyChart.vue'
import DataTable from './DataTable.vue'

// ✅ TO'G'RI: faqat kerak bo'lganda yuklash
const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: ChartSkeleton,
  errorComponent: ErrorFallback,
  delay: 200,
  timeout: 10000
})
```

---

## 5. VIRTUAL SCROLL — 100+ ELEMENT UCHUN MAJBURIY

```vue
<!-- ❌ XATO: 1000+ element to'g'ridan-to'g'ri render — DOM o'ladi -->
<div v-for="item in tenThousandItems" :key="item.id">
  <ItemCard :item="item" />
</div>

<!-- ✅ TO'G'RI: @tanstack/vue-virtual -->
<script setup>
const parentRef = ref(null)
const virtualizer = useVirtualizer({
  count: items.value.length,
  getScrollElement: () => parentRef.value,
  estimateSize: () => 60,
  overscan: 5
})
</script>
<template>
  <div ref="parentRef" style="height:600px; overflow-y:auto">
    <div :style="{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }">
      <div
        v-for="row in virtualizer.getVirtualItems()" :key="row.index"
        :style="{ position:'absolute', top:0, width:'100%', transform:`translateY(${row.start}px)` }"
      >
        <ItemCard :item="items[row.index]" />
      </div>
    </div>
  </div>
</template>
```

---

## 6. V-MEMO — MURAKKAB LISTLAR

```vue
<!-- Faqat ko'rsatilgan qiymatlar o'zgarganda qayta render -->
<div v-for="user in users" :key="user.id" v-memo="[user.id, user.name, user.updatedAt]">
  <ComplexUserCard :user="user" />
</div>
```

---

## 7. SKELETON LOADING — UX STANDARTI

```vue
<template>
  <template v-if="isLoading">
    <SkeletonCard v-for="i in 5" :key="i" />
  </template>
  <template v-else-if="error">
    <ErrorState :error="error" @retry="refetch" />
  </template>
  <template v-else-if="items.length === 0">
    <EmptyState />
  </template>
  <template v-else>
    <DataCard v-for="item in items" :key="item.id" :item="item" />
  </template>
</template>
```

---

## 8. PERFORMANCE CHECKLIST

- [ ] `v-for` da noyob `:key` (index emas!)
- [ ] `v-if` va `v-for` alohida elementlarda
- [ ] 100+ element → virtual scroll
- [ ] Og'ir komponentlar → `defineAsyncComponent`
- [ ] Katta massivlar → `shallowRef`
- [ ] Takrorlanuvchi og'ir listlar → `v-memo`
- [ ] Rasmlar → `loading="lazy"` va optimallashtirilgan o'lcham
- [ ] `computed` ichida API call yo'q (pure!)
- [ ] Event listenerlar `onUnmounted` da tozalanganmi?
