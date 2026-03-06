<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import NavBar from '@/components/NavBar.vue'
import SearchModal from '@/components/SearchModal.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { chapters } from '@/data/chapters'

const route  = useRoute()
const router = useRouter()
const { isDark } = useTheme()

const sidebarOpen  = ref(false)
const searchOpen   = ref(false)
const activeId     = ref(route.params.id || chapters[0].id)

const activeChapter = computed(() =>
  chapters.find(c => c.id === activeId.value) || chapters[0]
)

function navigate(id) {
  activeId.value = id
  sidebarOpen.value = false
  router.replace(`/docs/${id}`)
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

watch(() => route.params.id, id => {
  if (id) activeId.value = id
})

// Keyboard shortcut for search
onMounted(() => {
  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      searchOpen.value = true
    }
  })
})

const activeIndex   = computed(() => chapters.findIndex(c => c.id === activeId.value))
const prevChapter   = computed(() => chapters[activeIndex.value - 1] || null)
const nextChapter   = computed(() => chapters[activeIndex.value + 1] || null)
</script>

<template>
  <div class="min-h-screen transition-colors duration-300"
       :class="isDark ? 'bg-dark-950' : 'bg-white'">
    <NavBar />
    <ProgressBar />
    <SearchModal v-model="searchOpen" @navigate="navigate" />

    <div class="flex pt-16">
      <!-- Sidebar overlay (mobile) -->
      <div v-if="sidebarOpen"
           class="fixed inset-0 z-30 md:hidden"
           :class="isDark ? 'bg-dark-950/80' : 'bg-black/30'"
           @click="sidebarOpen = false" />

      <!-- Sidebar -->
      <aside :class="[
               sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
               isDark ? 'border-dark-800 bg-dark-950' : 'border-slate-200 bg-white'
             ]"
             class="fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-64px)]
                    w-72 border-r
                    flex flex-col overflow-y-auto transition-all duration-300 ease-in-out">

        <!-- Search button -->
        <div class="p-4 border-b" :class="isDark ? 'border-dark-800' : 'border-slate-200'">
          <button @click="searchOpen = true"
                  class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                         border text-sm transition-all group"
                  :class="isDark
                    ? 'bg-dark-800 border-dark-700 hover:border-brand-700 text-slate-500 hover:text-slate-300'
                    : 'bg-slate-50 border-slate-200 hover:border-brand-400 text-slate-400 hover:text-slate-600'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span class="flex-1 text-left">Qidirish...</span>
            <kbd class="hidden md:block text-xs px-1.5 py-0.5 rounded font-mono"
                 :class="isDark ? 'bg-dark-700 border border-dark-600 group-hover:border-brand-800' : 'bg-slate-100 border border-slate-300'">
              Ctrl+K
            </kbd>
          </button>
        </div>

        <!-- Chapter list -->
        <nav class="flex-1 p-3 space-y-0.5">
          <div class="px-3 py-2 text-xs font-mono uppercase tracking-wider"
               :class="isDark ? 'text-slate-600' : 'text-slate-400'">
            Bo'limlar
          </div>
          <button v-for="ch in chapters" :key="ch.id"
                  @click="navigate(ch.id)"
                  :class="activeId === ch.id
                    ? (isDark ? 'bg-brand-950 border-brand-800/60 text-brand-300' : 'bg-brand-50 border-brand-300 text-brand-700')
                    : (isDark ? 'border-transparent text-slate-400 hover:text-white hover:bg-dark-800' : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100')"
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                         text-sm font-medium border transition-all text-left">
            <span class="font-mono text-xs w-6 flex-shrink-0"
                  :class="isDark ? 'text-slate-600' : 'text-slate-400'">{{ ch.num }}</span>
            <span class="flex-shrink-0 text-base leading-none">{{ ch.icon }}</span>
            <span class="truncate">{{ ch.title }}</span>
          </button>
        </nav>

        <!-- Download -->
        <div class="p-4 border-t" :class="isDark ? 'border-dark-800' : 'border-slate-200'">
          <a href="/Claude_Code_Professional_Qollanma.pdf" download
             class="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl
                    border text-sm transition-all"
             :class="isDark
               ? 'border-dark-700 hover:border-brand-700 text-slate-400 hover:text-brand-400 hover:bg-brand-950/30'
               : 'border-slate-200 hover:border-brand-400 text-slate-500 hover:text-brand-600 hover:bg-brand-50'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            PDF yuklab olish
          </a>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 min-w-0 max-w-4xl mx-auto px-4 md:px-10 py-10">

        <!-- Mobile: sidebar toggle + breadcrumb -->
        <div class="flex items-center gap-3 mb-8 md:hidden">
          <button @click="sidebarOpen = true"
                  class="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border transition-all"
                  :class="isDark
                    ? 'text-slate-400 hover:text-white border-dark-700 hover:bg-dark-800'
                    : 'text-slate-500 hover:text-slate-900 border-slate-300 hover:bg-slate-100'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            Bo'limlar
          </button>
          <div class="flex items-center gap-2 text-sm"
               :class="isDark ? 'text-slate-500' : 'text-slate-400'">
            <span>{{ activeChapter.icon }}</span>
            <span class="truncate">{{ activeChapter.title }}</span>
          </div>
        </div>

        <!-- Chapter header -->
        <div class="mb-10">
          <div class="flex items-center gap-3 mb-4">
            <span class="section-badge font-mono">{{ activeChapter.num }}</span>
            <span class="text-2xl">{{ activeChapter.icon }}</span>
          </div>
          <p class="text-sm font-mono" :class="isDark ? 'text-slate-500' : 'text-slate-400'">
            {{ activeChapter.desc }}
          </p>
        </div>

        <!-- Content -->
        <article class="prose-custom"
                 v-html="activeChapter.content" />

        <!-- Nav buttons -->
        <div class="mt-16 pt-8 border-t flex items-center justify-between gap-4"
             :class="isDark ? 'border-dark-800' : 'border-slate-200'">
          <button v-if="prevChapter" @click="navigate(prevChapter.id)"
                  class="flex items-center gap-2 px-4 py-3 rounded-xl border
                         text-sm transition-all max-w-[48%]"
                  :class="isDark
                    ? 'border-dark-700 hover:border-brand-700 text-slate-400 hover:text-white hover:bg-dark-800'
                    : 'border-slate-200 hover:border-brand-400 text-slate-500 hover:text-slate-900 hover:bg-slate-50'">
            <span class="flex-shrink-0">&#8592;</span>
            <span class="truncate">{{ prevChapter.title }}</span>
          </button>
          <div v-else />

          <button v-if="nextChapter" @click="navigate(nextChapter.id)"
                  class="flex items-center gap-2 px-4 py-3 rounded-xl border
                         text-sm transition-all max-w-[48%] ml-auto"
                  :class="isDark
                    ? 'border-dark-700 hover:border-brand-700 text-slate-400 hover:text-white hover:bg-dark-800'
                    : 'border-slate-200 hover:border-brand-400 text-slate-500 hover:text-slate-900 hover:bg-slate-50'">
            <span class="truncate">{{ nextChapter.title }}</span>
            <span class="flex-shrink-0">&#8594;</span>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Terminal line types in prose content */
:deep(.code-line) { @apply font-mono text-xs text-slate-300 leading-relaxed; }
:deep(.code-line.comment) { @apply text-slate-600; }
:deep(.code-line.prompt) { @apply text-brand-400 font-semibold; }
:deep(.code-line.success) { @apply text-emerald-400; }
:deep(.code-line.error) { @apply text-red-400; }
:deep(.code-line.warning) { @apply text-yellow-400; }
:deep(.code-line.action) { @apply text-sky-400; }
:deep(.terminal-block) { @apply my-6; }
</style>
