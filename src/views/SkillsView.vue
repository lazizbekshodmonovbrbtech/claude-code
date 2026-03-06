<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import NavBar from '@/components/NavBar.vue'
import { marked } from 'marked'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const route = useRoute()
const router = useRouter()
const { isDark } = useTheme()

const sidebarOpen = ref(false)
const loading = ref(false)
const content = ref('')
const copied = ref(false)
const zipping = ref(false)
const openFolders = ref([])

const skillsTree = [
  {
    type: 'section',
    label: 'FRONTEND',
    children: [
      {
        type: 'folder',
        label: 'Vue 3',
        icon: '<svg class="w-4 h-4" viewBox="0 0 256 221"><path fill="#41B883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z"/><path fill="#41B883" d="M0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z"/><path fill="#35495E" d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z"/></svg>',
        children: [
          { label: 'CLAUDE.md', path: 'skills/frontend/CLAUDE.md' },
          { label: 'Composition API', path: 'skills/frontend/vue3/VUE3-COMPOSITION-API-RULES.md' },
          { label: 'Performance', path: 'skills/frontend/vue3/VUE3-PERFORMANCE-RULES.md' },
          { label: 'Pinia & Router', path: 'skills/frontend/vue3/VUE3-PINIA-ROUTER-RULES.md' },
          { label: 'Accessibility', path: 'skills/frontend/vue3/VUE3-ACCESSIBILITY-ERROR-RULES.md' },
          { label: 'Anti-Patternlar', path: 'skills/frontend/vue3/VUE3-ANTIPATTERNS-RULES.md' },
        ],
      },
      {
        type: 'folder',
        label: 'TypeScript',
        icon: '<svg class="w-4 h-4" viewBox="0 0 256 256"><rect fill="#3178C6" width="256" height="256" rx="20"/><path fill="#fff" d="M150.518 200.475v27.62c4.492 2.302 9.805 4.028 15.938 5.179c6.133 1.151 12.597 1.726 19.393 1.726c6.622 0 12.914-.633 18.874-1.899c5.96-1.266 11.187-3.352 15.678-6.257c4.492-2.906 8.048-6.796 10.669-11.672c2.621-4.876 3.931-10.94 3.931-18.192c0-5.237-.903-9.882-2.708-13.936c-1.806-4.054-4.318-7.719-7.536-10.996c-3.218-3.277-7.014-6.257-11.389-8.938c-4.375-2.681-9.13-5.236-14.266-7.664c-3.739-1.783-7.101-3.508-10.087-5.179c-2.985-1.67-5.535-3.392-7.651-5.166c-2.116-1.774-3.739-3.681-4.869-5.721c-1.13-2.04-1.695-4.374-1.695-7.001c0-2.388.477-4.548 1.432-6.48c.955-1.932 2.359-3.601 4.213-5.006c1.853-1.405 4.143-2.49 6.868-3.256c2.726-.766 5.837-1.149 9.334-1.149c2.447 0 5.07.217 7.868.652c2.798.435 5.622 1.107 8.47 2.016c2.849.909 5.568 2.052 8.157 3.429c2.59 1.377 4.96 2.986 7.109 4.827v-26.02c-4.318-1.727-9.028-3.018-14.13-3.874c-5.102-.855-10.994-1.283-17.676-1.283c-6.622 0-12.914.693-18.874 2.079c-5.96 1.386-11.216 3.593-15.766 6.622c-4.55 3.029-8.165 6.967-10.843 11.814c-2.679 4.847-4.018 10.68-4.018 17.497c0 8.688 2.534 16.134 7.601 22.338c5.067 6.204 12.44 11.441 22.12 15.711c3.913 1.727 7.564 3.454 10.953 5.179c3.389 1.726 6.331 3.567 8.826 5.524c2.495 1.957 4.463 4.086 5.904 6.388c1.441 2.302 2.162 4.89 2.162 7.767c0 2.214-.462 4.258-1.386 6.131c-.924 1.873-2.359 3.499-4.305 4.876c-1.946 1.377-4.391 2.449-7.335 3.217c-2.944.767-6.419 1.151-10.424 1.151c-6.97 0-13.689-1.392-20.156-4.175c-6.467-2.783-12.193-6.735-17.178-11.857Zm-46.588-98.308h32.352v-24.895H56v24.895h32.266v94.041h15.664v-94.041Z"/></svg>',
        children: [
          { label: 'Config & Types', path: 'skills/frontend/typescript/TYPESCRIPT-CONFIG-TYPES-RULES.md' },
          { label: 'Guards & Utility', path: 'skills/frontend/typescript/TYPESCRIPT-GUARDS-UTILITY-RULES.md' },
          { label: 'Generics', path: 'skills/frontend/typescript/TYPESCRIPT-GENERICS-ERRORS-RULES.md' },
          { label: 'Vue Integration', path: 'skills/frontend/typescript/TYPESCRIPT-VUE-ANTIPATTERNS-RULES.md' },
        ],
      },
      {
        type: 'folder',
        label: 'Testing',
        icon: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 5.527a.75.75 0 01-.686.473H8.156a.75.75 0 01-.686-.473L5 14.5m14 0H5"/></svg>',
        children: [
          { label: 'Unit Testlar', path: 'skills/frontend/testing/FRONTEND-TESTING-UNIT-RULES.md' },
          { label: 'Integration', path: 'skills/frontend/testing/FRONTEND-TESTING-INTEGRATION-RULES.md' },
          { label: 'E2E Playwright', path: 'skills/frontend/testing/FRONTEND-TESTING-E2E-RULES.md' },
          { label: 'Mocking & CI/CD', path: 'skills/frontend/testing/FRONTEND-TESTING-MOCKING-CICD-RULES.md' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'BACKEND',
    children: [
      {
        type: 'folder',
        label: 'Java Spring',
        icon: '<svg class="w-4 h-4" viewBox="-118.513 4.399 540.906 540.906"><path d="M285.104 430.945h-2.037v-1.14h5.486v1.14h-2.025v5.688h-1.424v-5.688zm10.942.297h-.032l-2.02 5.393h-.924l-2.006-5.393h-.024v5.393h-1.343v-6.828h1.976l1.86 4.835 1.854-4.835h1.969v6.828h-1.311l.001-5.393z" fill="#e76f00"/><path d="M102.681 291.324s-14.178 8.245 10.09 11.035c29.4 3.354 44.426 2.873 76.825-3.259 0 0 8.518 5.341 20.414 9.967-72.63 31.128-164.376-1.803-107.329-17.743M93.806 250.704s-15.902 11.771 8.384 14.283c31.406 3.24 56.208 3.505 99.125-4.759 0 0 5.937 6.018 15.271 9.309-87.815 25.678-185.624 2.025-122.78-18.833" fill="#5382a1"/><path d="M168.625 181.799c17.896 20.604-4.701 39.146-4.701 39.146s45.439-23.458 24.571-52.833c-19.491-27.395-34.438-41.005 46.479-87.934.001-.001-127.013 31.721-66.349 101.621" fill="#e76f00"/><path d="M264.684 321.369s10.492 8.646-11.555 15.333c-41.923 12.7-174.488 16.535-211.314.507-13.238-5.76 11.587-13.752 19.396-15.429 8.144-1.766 12.798-1.437 12.798-1.437-14.722-10.371-95.157 20.363-40.857 29.166 148.084 24.015 269.944-10.814 231.532-28.14M109.499 208.617s-67.431 16.016-23.879 21.832c18.389 2.462 55.047 1.905 89.192-.956 27.906-2.354 55.928-7.358 55.928-7.358s-9.84 4.214-16.959 9.074c-68.475 18.01-200.756 9.631-162.674-8.79 32.206-15.568 58.392-13.802 58.392-13.802M230.462 276.231c69.608-36.171 37.425-70.932 14.96-66.248-5.506 1.146-7.961 2.139-7.961 2.139s2.045-3.202 5.947-4.588c44.441-15.624 78.619 46.081-14.346 70.521 0 0 1.079-.962 1.4-1.824" fill="#5382a1"/><path d="M188.495 4.399s38.55 38.562-36.563 97.862c-60.233 47.567-13.735 74.689-.025 105.678-35.158-31.723-60.96-59.647-43.65-85.637 25.406-38.151 95.792-56.648 80.238-117.903" fill="#e76f00"/><path d="M116.339 374.246c66.815 4.277 169.417-2.373 171.846-33.987 0 0-4.67 11.984-55.219 21.503-57.027 10.731-127.364 9.479-169.081 2.601.002-.002 8.541 7.067 52.454 9.883" fill="#5382a1"/><path d="M105.389 495.049c-6.303 5.467-12.96 8.536-18.934 8.536-8.527 0-13.134-5.113-13.134-13.314 0-8.871 4.937-15.357 24.739-15.357h7.328l.001 20.135m17.392 19.623V453.93c0-15.518-8.85-25.756-30.188-25.756-12.457 0-23.369 3.076-32.238 6.999l2.56 10.752c6.983-2.563 16.022-4.949 24.894-4.949 12.292 0 17.58 4.949 17.58 15.181v7.678h-6.135c-29.865 0-43.337 11.593-43.337 28.993 0 15.018 8.878 23.554 25.594 23.554 10.745 0 18.766-4.437 26.264-10.929l1.361 9.221 13.645-.002zM180.824 514.672h-21.691l-26.106-84.96h18.944l16.198 52.199 3.601 15.699c8.195-22.698 13.992-45.726 16.891-67.898h18.427c-4.938 27.976-13.822 58.684-26.264 84.96M264.038 495.049c-6.315 5.467-12.983 8.536-18.958 8.536-8.512 0-13.131-5.113-13.131-13.314 0-8.871 4.947-15.357 24.748-15.357h7.341v20.135m17.39 19.623V453.93c0-15.518-8.871-25.756-30.186-25.756-12.465 0-23.381 3.076-32.246 6.999l2.557 10.752c6.985-2.563 16.041-4.949 24.906-4.949 12.283 0 17.579 4.949 17.579 15.181v7.678h-6.146c-29.873 0-43.34 11.593-43.34 28.993 0 15.018 8.871 23.554 25.584 23.554 10.752 0 18.77-4.437 26.28-10.929l1.366 9.221 13.646-.002zM36.847 529.099c-4.958 7.239-12.966 12.966-21.733 16.206L6.527 535.2c6.673-3.424 12.396-8.954 15.055-14.104 2.3-4.581 3.252-10.485 3.252-24.604v-96.995h18.478v95.666c-.001 18.875-1.51 26.5-6.465 33.936" fill="#e76f00"/></svg>',
        children: [
          { label: 'CLAUDE.md', path: 'skills/backend/java-spring/CLAUDE.md' },
          { label: 'Entity & JPA', path: 'skills/backend/java-spring/SPRING-ENTITY-JPA-RULES.md' },
          { label: 'Repository & Query', path: 'skills/backend/java-spring/SPRING-REPOSITORY-QUERY-RULES.md' },
          { label: 'Service & Transaction', path: 'skills/backend/java-spring/SPRING-SERVICE-TRANSACTION-RULES.md' },
          { label: 'Controller & DTO', path: 'skills/backend/java-spring/SPRING-CONTROLLER-DTO-RULES.md' },
          { label: 'Security', path: 'skills/backend/java-spring/SPRING-SECURITY-EXCEPTION-RULES.md' },
          { label: 'Performance & Test', path: 'skills/backend/java-spring/SPRING-PERFORMANCE-TESTING-RULES.md' },
        ],
      },
    ],
  },
]

// Flatten all file entries
function getAllFiles(tree) {
  const files = []
  for (const node of tree) {
    if (node.path) files.push(node)
    if (node.children) files.push(...getAllFiles(node.children))
  }
  return files
}
const allFiles = getAllFiles(skillsTree)

const activeFile = computed(() => route.query.file || 'skills/frontend/CLAUDE.md')
const activeFileName = computed(() => activeFile.value.split('/').pop())

// Find which folder contains active file and auto-open it
function findFolderForFile(filePath) {
  for (const node of skillsTree) {
    if (node.children) {
      for (const child of node.children) {
        if (child.type === 'folder' && child.children) {
          if (child.children.some(f => f.path === filePath)) return child.label
        }
      }
    }
  }
  return null
}

function toggleFolder(label) {
  const idx = openFolders.value.indexOf(label)
  if (idx === -1) openFolders.value.push(label)
  else openFolders.value.splice(idx, 1)
}

function isFolderOpen(label) {
  return openFolders.value.includes(label)
}

function selectFile(path) {
  router.replace({ query: { file: path } })
  sidebarOpen.value = false
}

async function loadFile(filePath) {
  loading.value = true
  content.value = ''
  try {
    const res = await fetch('/' + filePath)
    if (!res.ok) throw new Error('Not found')
    const text = await res.text()
    content.value = marked.parse(text)
  } catch {
    content.value = '<p class="text-red-400">Fayl topilmadi</p>'
  } finally {
    loading.value = false
    nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }
}

async function copyContent() {
  const res = await fetch('/' + activeFile.value)
  const text = await res.text()
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

async function downloadZip() {
  zipping.value = true
  try {
    const zip = new JSZip()
    await Promise.all(
      allFiles.map(async (f) => {
        try {
          const res = await fetch('/' + f.path)
          if (res.ok) {
            const text = await res.text()
            zip.file(f.path, text)
          }
        } catch { /* skip */ }
      })
    )
    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'claude-code-skills.zip')
  } finally {
    zipping.value = false
  }
}

// Watch file query param
watch(() => route.query.file, (file) => {
  const path = file || 'skills/frontend/CLAUDE.md'
  loadFile(path)
  const folder = findFolderForFile(path)
  if (folder && !openFolders.value.includes(folder)) {
    openFolders.value.push(folder)
  }
}, { immediate: true })

onMounted(() => {
  const folder = findFolderForFile(activeFile.value)
  if (folder && !openFolders.value.includes(folder)) {
    openFolders.value.push(folder)
  }
})
</script>

<template>
  <div class="min-h-screen transition-colors duration-300"
       :class="isDark ? 'bg-dark-950' : 'bg-white'">
    <NavBar />

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
                    w-72 border-r flex flex-col overflow-hidden
                    transition-all duration-300 ease-in-out">

        <!-- Header -->
        <div class="p-4 border-b" :class="isDark ? 'border-dark-800' : 'border-slate-200'">
          <h2 class="text-sm font-semibold" :class="isDark ? 'text-white' : 'text-slate-900'">
            Claude Code Skills
          </h2>
        </div>

        <!-- Tree nav -->
        <nav class="flex-1 overflow-y-auto p-3 space-y-0.5">
          <template v-for="section in skillsTree.filter(n => n.type === 'section')" :key="section.label">
            <!-- Section separator -->
            <div class="px-3 pt-4 pb-1 text-xs font-mono uppercase tracking-wider"
                 :class="isDark ? 'text-slate-600' : 'text-slate-400'">
              {{ section.label }}
            </div>

            <template v-for="folder in section.children" :key="folder.label">
              <!-- Folder header -->
              <button @click="toggleFolder(folder.label)"
                      class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left"
                      :class="isDark ? 'text-slate-300 hover:bg-dark-800' : 'text-slate-600 hover:bg-slate-100'">
                <svg class="w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0"
                     :class="isFolderOpen(folder.label) ? 'rotate-90' : ''"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                <span class="flex-shrink-0" v-html="folder.icon"></span>
                <span>{{ folder.label }}</span>
              </button>

              <!-- Folder children -->
              <div v-show="isFolderOpen(folder.label)"
                   class="ml-4 space-y-0.5">
                <button v-for="file in folder.children" :key="file.path"
                        @click="selectFile(file.path)"
                        :class="activeFile === file.path
                          ? (isDark ? 'bg-brand-950 border-brand-800/60 text-brand-300' : 'bg-brand-50 border-brand-300 text-brand-700')
                          : (isDark ? 'border-transparent text-slate-400 hover:text-white hover:bg-dark-800' : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100')"
                        class="w-full flex items-center gap-2 pl-6 pr-3 py-1.5 rounded-lg text-sm border transition-all text-left">
                  {{ file.label }}
                </button>
              </div>
            </template>
          </template>
        </nav>

        <!-- Download buttons -->
        <div class="p-4 border-t space-y-2" :class="isDark ? 'border-dark-800' : 'border-slate-200'">
          <button @click="downloadZip" :disabled="zipping"
                  class="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl border text-sm transition-all"
                  :class="isDark
                    ? 'border-dark-700 hover:border-brand-700 text-slate-400 hover:text-brand-400 hover:bg-brand-950/30'
                    : 'border-slate-200 hover:border-brand-400 text-slate-500 hover:text-brand-600 hover:bg-brand-50'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            {{ zipping ? 'Arxivlanmoqda...' : 'Barcha fayllar ZIP' }}
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 min-w-0 max-w-4xl mx-auto px-4 md:px-10 py-10">

        <!-- Mobile toggle -->
        <div class="flex items-center gap-3 mb-6 md:hidden">
          <button @click="sidebarOpen = true"
                  class="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border transition-all"
                  :class="isDark
                    ? 'text-slate-400 hover:text-white border-dark-700 hover:bg-dark-800'
                    : 'text-slate-500 hover:text-slate-900 border-slate-300 hover:bg-slate-100'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            Menyuni ochish
          </button>
        </div>

        <!-- File header panel -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-8 p-4 rounded-xl border"
             :class="isDark ? 'bg-dark-900 border-dark-700' : 'bg-slate-50 border-slate-200'">
          <div class="flex items-center gap-2 min-w-0">
            <svg class="w-5 h-5 flex-shrink-0" :class="isDark ? 'text-brand-400' : 'text-brand-600'"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="font-mono text-sm truncate" :class="isDark ? 'text-white' : 'text-slate-900'">
              {{ activeFileName }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <a :href="'/' + activeFile" :download="activeFileName"
               class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
               :class="isDark
                 ? 'border-dark-600 text-slate-400 hover:text-brand-400 hover:border-brand-700'
                 : 'border-slate-300 text-slate-500 hover:text-brand-600 hover:border-brand-400'">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Yuklab olish
            </a>
            <button @click="copyContent"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                    :class="isDark
                      ? 'border-dark-600 text-slate-400 hover:text-brand-400 hover:border-brand-700'
                      : 'border-slate-300 text-slate-500 hover:text-brand-600 hover:border-brand-400'">
              <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke-width="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-width="2"/>
              </svg>
              <svg v-else class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ copied ? 'Nusxalandi!' : 'Nusxa' }}
            </button>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="space-y-4 animate-pulse">
          <div class="h-8 rounded-lg w-3/4" :class="isDark ? 'bg-dark-800' : 'bg-slate-200'" />
          <div class="h-4 rounded w-full" :class="isDark ? 'bg-dark-800' : 'bg-slate-200'" />
          <div class="h-4 rounded w-5/6" :class="isDark ? 'bg-dark-800' : 'bg-slate-200'" />
          <div class="h-4 rounded w-4/6" :class="isDark ? 'bg-dark-800' : 'bg-slate-200'" />
          <div class="h-32 rounded-xl w-full" :class="isDark ? 'bg-dark-800' : 'bg-slate-200'" />
          <div class="h-4 rounded w-full" :class="isDark ? 'bg-dark-800' : 'bg-slate-200'" />
          <div class="h-4 rounded w-3/4" :class="isDark ? 'bg-dark-800' : 'bg-slate-200'" />
        </div>

        <!-- Markdown content -->
        <article v-else :class="isDark ? 'skills-prose-dark' : 'skills-prose-light'" class="skills-prose" v-html="content" />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Base prose layout */
:deep(.skills-prose h1) { @apply font-display text-2xl font-bold mt-0 mb-6; }
:deep(.skills-prose h2) { @apply font-display text-xl font-bold mt-10 mb-4; }
:deep(.skills-prose h3) { @apply font-display text-lg font-semibold mt-8 mb-3; }
:deep(.skills-prose h4) { @apply font-display text-base font-semibold mt-6 mb-2; }
:deep(.skills-prose p) { @apply text-sm leading-relaxed mb-4; }
:deep(.skills-prose ul) { @apply list-disc list-inside space-y-1 mb-4 text-sm; }
:deep(.skills-prose ol) { @apply list-decimal list-inside space-y-1 mb-4 text-sm; }
:deep(.skills-prose li) { @apply leading-relaxed; }
:deep(.skills-prose strong) { font-weight: 600; }
:deep(.skills-prose hr) { @apply my-8 border-t; }
:deep(.skills-prose blockquote) { @apply border-l-4 pl-4 my-4 italic text-sm; }
:deep(.skills-prose table) { @apply w-full text-sm mb-6 border-collapse; }
:deep(.skills-prose th) { @apply text-left text-xs font-mono uppercase tracking-wider px-3 py-2.5; }
:deep(.skills-prose td) { @apply px-3 py-2.5 text-sm; }
:deep(.skills-prose code) { @apply font-mono px-1.5 py-0.5 rounded text-sm; }
:deep(.skills-prose pre) { @apply rounded-xl p-4 my-4 overflow-x-auto text-sm font-mono leading-relaxed; }
:deep(.skills-prose pre code) { @apply p-0 bg-transparent; }

/* Dark theme */
:deep(.skills-prose-dark h1),
:deep(.skills-prose-dark h2) { @apply text-white; }
:deep(.skills-prose-dark h3) { @apply text-brand-300; }
:deep(.skills-prose-dark h4) { @apply text-slate-200; }
:deep(.skills-prose-dark p),
:deep(.skills-prose-dark li) { @apply text-slate-300; }
:deep(.skills-prose-dark strong) { @apply text-white; }
:deep(.skills-prose-dark hr) { @apply border-dark-700; }
:deep(.skills-prose-dark blockquote) { @apply border-brand-700 text-slate-400; }
:deep(.skills-prose-dark code) { @apply text-brand-300 bg-brand-950/60; }
:deep(.skills-prose-dark pre) { @apply bg-dark-900 border border-dark-700; }
:deep(.skills-prose-dark pre code) { @apply text-slate-300; }
:deep(.skills-prose-dark th) { @apply bg-dark-800 text-brand-400 border-b border-dark-700; }
:deep(.skills-prose-dark td) { @apply text-slate-300 border-b border-dark-800; }
:deep(.skills-prose-dark tr:hover td) { @apply bg-dark-800/40; }

/* Light theme */
:deep(.skills-prose-light h1),
:deep(.skills-prose-light h2) { @apply text-slate-900; }
:deep(.skills-prose-light h3) { @apply text-brand-600; }
:deep(.skills-prose-light h4) { @apply text-slate-700; }
:deep(.skills-prose-light p),
:deep(.skills-prose-light li) { @apply text-slate-600; }
:deep(.skills-prose-light strong) { @apply text-slate-900; }
:deep(.skills-prose-light hr) { @apply border-slate-200; }
:deep(.skills-prose-light blockquote) { @apply border-brand-400 text-slate-500; }
:deep(.skills-prose-light code) { @apply text-brand-600 bg-brand-50; }
:deep(.skills-prose-light pre) { @apply bg-slate-50 border border-slate-200; }
:deep(.skills-prose-light pre code) { @apply text-slate-700; }
:deep(.skills-prose-light th) { @apply bg-slate-50 text-brand-600 border-b border-slate-200; }
:deep(.skills-prose-light td) { @apply text-slate-600 border-b border-slate-100; }
:deep(.skills-prose-light tr:hover td) { @apply bg-slate-50; }
</style>