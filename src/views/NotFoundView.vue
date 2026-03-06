<script setup>
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const { isDark } = useTheme()
</script>

<template>
  <div class="min-h-screen transition-colors duration-300"
       :class="isDark ? 'bg-dark-950' : 'bg-white'">
    <NavBar />
    <div class="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div class="text-center max-w-md">
        <div class="font-display text-8xl sm:text-9xl font-bold text-gradient mb-4">404</div>
        <h1 class="font-display text-2xl sm:text-3xl font-bold mb-3"
            :class="isDark ? 'text-white' : 'text-slate-900'">
          Sahifa topilmadi
        </h1>
        <p class="mb-8" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
          Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button @click="router.push('/')" class="btn-primary px-6 py-3">
            Bosh sahifa
          </button>
          <button @click="router.push('/docs')" class="btn-ghost px-6 py-3">
            Qo'llanma
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
