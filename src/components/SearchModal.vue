<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { chapters } from '@/data/chapters'

const props  = defineProps({ modelValue: Boolean })
const emit   = defineEmits(['update:modelValue', 'navigate'])
const { isDark } = useTheme()

const query  = ref('')
const input  = ref(null)

watch(() => props.modelValue, open => {
  if (open) {
    query.value = ''
    nextTick(() => input.value?.focus())
  }
})

const results = computed(() => {
  if (!query.value.trim()) return chapters.slice(0, 6)
  const q = query.value.toLowerCase()
  return chapters.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.desc.toLowerCase().includes(q) ||
    c.content.toLowerCase().includes(q)
  ).slice(0, 8)
})

function select(ch) {
  emit('navigate', ch.id)
  emit('update:modelValue', false)
}
</script>

<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="modelValue"
           class="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
           @click.self="$emit('update:modelValue', false)">

        <!-- Backdrop -->
        <div class="absolute inset-0 backdrop-blur-sm"
             :class="isDark ? 'bg-dark-950/80' : 'bg-black/20'" />

        <!-- Modal -->
        <div class="relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border"
             :class="isDark ? 'bg-dark-900 border-dark-700' : 'bg-white border-slate-200'">

          <!-- Search input -->
          <div class="flex items-center gap-3 px-4 py-4 border-b"
               :class="isDark ? 'border-dark-800' : 'border-slate-200'">
            <svg class="w-5 h-5 flex-shrink-0" :class="isDark ? 'text-slate-500' : 'text-slate-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input ref="input"
                   v-model="query"
                   placeholder="Bo'lim qidiring..."
                   @keydown.escape="$emit('update:modelValue', false)"
                   class="flex-1 bg-transparent text-base outline-none font-sans"
                   :class="isDark ? 'text-white placeholder-slate-600' : 'text-slate-900 placeholder-slate-400'" />
            <kbd class="text-xs px-2 py-1 rounded font-mono"
                 :class="isDark ? 'bg-dark-800 border border-dark-700 text-slate-500' : 'bg-slate-100 border border-slate-300 text-slate-400'">
              Esc
            </kbd>
          </div>

          <!-- Results -->
          <div class="py-2 max-h-96 overflow-y-auto">
            <div v-if="!query" class="px-4 pt-1 pb-2 text-xs font-mono"
                 :class="isDark ? 'text-slate-600' : 'text-slate-400'">
              Barcha bo'limlar
            </div>
            <div v-else-if="results.length === 0"
                 class="px-4 py-8 text-center text-sm"
                 :class="isDark ? 'text-slate-500' : 'text-slate-400'">
              "{{ query }}" -- hech narsa topilmadi
            </div>

            <button v-for="ch in results" :key="ch.id"
                    @click="select(ch)"
                    class="w-full flex items-center gap-4 px-4 py-3 transition-colors text-left group"
                    :class="isDark ? 'hover:bg-dark-800' : 'hover:bg-slate-50'">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-colors"
                   :class="isDark ? 'bg-dark-800 group-hover:bg-dark-700' : 'bg-slate-100 group-hover:bg-slate-200'">
                {{ ch.icon }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs" :class="isDark ? 'text-slate-600' : 'text-slate-400'">{{ ch.num }}</span>
                  <span class="text-sm font-medium truncate" :class="isDark ? 'text-white' : 'text-slate-900'">{{ ch.title }}</span>
                </div>
                <p class="text-xs truncate mt-0.5" :class="isDark ? 'text-slate-500' : 'text-slate-400'">{{ ch.desc }}</p>
              </div>
              <span class="group-hover:text-brand-500 transition-colors text-sm"
                    :class="isDark ? 'text-slate-700' : 'text-slate-300'">&#8594;</span>
            </button>
          </div>

          <!-- Footer -->
          <div class="px-4 py-3 border-t flex items-center gap-4 text-xs font-mono"
               :class="isDark ? 'border-dark-800 text-slate-600' : 'border-slate-200 text-slate-400'">
            <span>&#8629; Tanlash</span>
            <span>&#8593;&#8595; Navigatsiya</span>
            <span>Esc Yopish</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s, transform 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96) translateY(-8px); }
</style>
