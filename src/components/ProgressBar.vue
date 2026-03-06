<script setup>
import { useProgress } from '@/composables/useProgress'
import { useTheme } from '@/composables/useTheme'

const { progress } = useProgress()
const { isDark } = useTheme()
</script>

<template>
  <div class="fixed top-16 left-0 right-0 z-50 h-0.5"
       :class="isDark ? 'bg-dark-800' : 'bg-slate-200'">
    <div class="h-full bg-gradient-to-r from-brand-600 via-brand-400 to-emerald-400
                transition-all duration-150 ease-out relative"
         :style="{ width: progress + '%' }">
      <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full
                  bg-brand-400 shadow-lg shadow-brand-500/50
                  translate-x-1.5 opacity-80" />
    </div>
  </div>
  <!-- Floating progress pill -->
  <div v-if="progress > 2"
       class="fixed bottom-6 right-6 z-50 flex items-center gap-2
              border rounded-full px-3 py-1.5
              text-xs font-mono shadow-xl
              transition-all duration-300"
       :class="isDark
         ? 'bg-dark-900 border-dark-700 text-slate-400'
         : 'bg-white border-slate-200 text-slate-500'">
    <div class="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
    {{ progress }}%
  </div>
</template>
