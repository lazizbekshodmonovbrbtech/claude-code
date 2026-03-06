<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import NavBar from '@/components/NavBar.vue'
import { chapters, stats } from '@/data/chapters'

const router = useRouter()
const { isDark } = useTheme()
const visible = ref(false)
onMounted(() => setTimeout(() => visible.value = true, 100))

const features = [
  { icon: '\uD83D\uDE80', title: 'Terminal orqali boshqaruv', desc: 'Bash, Git, fayl tizimi \u2014 to\'g\'ridan-to\'g\'ri terminalda ishlaydi' },
  { icon: '\uD83E\uDDE0', title: 'Loyiha xotirasi', desc: 'CLAUDE.md \u2014 konventsiyalarni bir marta yozing, doim eslab qoladi' },
  { icon: '\uD83E\uDD16', title: 'Maxsus agentlar', desc: 'Backend, frontend \u2014 har sohaga ixtisoslashgan agentlar' },
  { icon: '\uD83D\uDD0C', title: 'Tashqi xizmatlar', desc: 'GitHub, PostgreSQL, Playwright \u2014 MCP orqali integratsiya' },
  { icon: '\uD83D\uDD04', title: 'Avtomatik pipeline', desc: 'GitHub Actions, Docker \u2014 avtomatik PR tekshiruv va test' },
  { icon: '\u2696\uFE0F', title: 'Vositalar taqqoslash', desc: 'Claude Code vs Cursor vs Antigravity \u2014 real sinov natijalari' },
]

const tools = [
  {
    name: 'Claude Code',
    badge: 'Eng samarali',
    color: 'brand',
    points: ['Katta context oynasi', 'Tejamkor token sarfi', 'CI/CD va agentlar', 'Murakkab loyihalar'],
    price: '$20/oy dan'
  },
  {
    name: 'Cursor',
    badge: 'Tezkor',
    color: 'blue',
    points: ['Tab autocomplete', 'Vizual interfeys', 'Ko\'p model tanlash', 'Kunlik vazifalar uchun'],
    price: '$20/oy dan'
  },
  {
    name: 'Antigravity',
    badge: 'Bepul',
    color: 'purple',
    points: ['Bepul (preview)', 'Katta kontekst oynasi', 'Parallel 3 agent', 'Manager ko\'rinish'],
    price: 'Bepul'
  },
]
</script>

<template>
  <div class="min-h-screen overflow-x-hidden transition-colors duration-300"
       :class="isDark ? 'bg-dark-950' : 'bg-white'">
    <NavBar />

    <!-- Hero -->
    <section class="relative pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 px-4 overflow-hidden">
      <!-- Background glow (dark only) -->
      <div v-if="isDark" class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]
                    bg-brand-500/5 rounded-full blur-[120px]" />
        <div class="absolute top-20 left-1/4 w-[400px] h-[400px]
                    bg-brand-900/20 rounded-full blur-[80px]" />
      </div>
      <!-- Background glow (light) -->
      <div v-else class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]
                    bg-brand-200/30 rounded-full blur-[100px]" />
        <div class="absolute top-10 right-1/4 w-[300px] h-[300px]
                    bg-emerald-100/40 rounded-full blur-[80px]" />
      </div>

      <!-- Grid pattern -->
      <div class="absolute inset-0 pointer-events-none"
           :style="{
             backgroundImage: isDark
               ? 'linear-gradient(rgba(22,176,106,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(22,176,106,0.03) 1px, transparent 1px)'
               : 'linear-gradient(rgba(22,176,106,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(22,176,106,0.04) 1px, transparent 1px)',
             backgroundSize: '60px 60px'
           }" />

      <div class="relative max-w-5xl mx-auto text-center">
        <!-- Badge -->
        <div :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
             class="transition-all duration-700 ease-out mb-10">
          <span class="section-badge">
            <span class="w-1.5 h-1.5 rounded-full animate-pulse"
                  :class="isDark ? 'bg-brand-400' : 'bg-brand-500'"></span>
            O'zbek tilida yagona professional qo'llanma
          </span>
        </div>

        <!-- Title -->
        <div :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
             class="transition-all duration-700 delay-100 ease-out mb-8">
          <h1 class="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6">
            <span class="block" :class="isDark ? 'text-white' : 'text-slate-900'">Claude Code</span>
            <span class="block">
              <span class="text-gradient">Professional</span>
              <span :class="isDark ? 'text-white' : 'text-slate-900'"> Qo'llanma</span>
            </span>
          </h1>
          <p class="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
             :class="isDark ? 'text-slate-400' : 'text-slate-500'">
            Java, TypeScript, JavaScript — real loyiha misollari bilan.
            <br class="hidden sm:block">
            Terminal screenshotlar, benchmark raqamlar, 17 bo'lim.
          </p>
        </div>

        <!-- CTA buttons -->
        <div :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
             class="transition-all duration-700 delay-200 ease-out flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <button @click="router.push('/docs')" class="btn-primary text-base px-8 py-3.5">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            O'qishni boshlash
          </button>
          <a href="/Claude_Code_Professional_Qollanma.pdf" download class="btn-ghost text-base px-8 py-3.5">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            PDF yuklab olish
          </a>
        </div>

        <!-- Terminal demo -->
        <div :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
             class="transition-all duration-700 delay-300 ease-out max-w-3xl mx-auto">
          <div class="terminal-block glow-green">
            <div class="terminal-bar">
              <span class="terminal-dot bg-[#ff5f57]"></span>
              <span class="terminal-dot bg-[#febc2e]"></span>
              <span class="terminal-dot bg-[#28c840]"></span>
              <span class="text-slate-500 text-xs font-mono ml-3">claude -- TaskManager loyihasi</span>
            </div>
            <div class="terminal-body text-left space-y-2 py-6 px-6">
              <p class="font-mono text-xs sm:text-sm text-slate-600"># Java Spring + Vue 3 loyiha, noldan</p>
              <p class="font-mono text-xs sm:text-sm text-brand-400 font-semibold">&gt; /init</p>
              <p class="font-mono text-xs sm:text-sm text-sky-400">&nbsp;&nbsp;Scanning project structure...</p>
              <p class="font-mono text-xs sm:text-sm text-sky-400">&nbsp;&nbsp;Found: backend/ (Java 21, Spring Boot 3.2)</p>
              <p class="font-mono text-xs sm:text-sm text-sky-400">&nbsp;&nbsp;Found: frontend/ (Vue 3, TypeScript)</p>
              <p class="font-mono text-xs sm:text-sm text-emerald-400">&nbsp;&nbsp;&#10003; CLAUDE.md created</p>
              <p class="font-mono text-xs sm:text-sm text-brand-400 font-semibold mt-3">&gt; JWT autentifikatsiya qo'sh, 7 fayl kerak bo'ladi</p>
              <p class="font-mono text-xs sm:text-sm text-sky-400">&nbsp;&nbsp;Writing User.java, JwtService.java...</p>
              <p class="font-mono text-xs sm:text-sm text-emerald-400">&nbsp;&nbsp;&#10003; 8 fayl | Tests: 12/12 passed | BUILD SUCCESS</p>
              <p class="font-mono text-xs sm:text-sm text-slate-600 flex items-center gap-1 mt-2">
                &gt; <span class="w-2 h-4 bg-brand-500 animate-blink inline-block"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-16 border-y transition-colors duration-300"
             :class="isDark ? 'border-dark-800' : 'border-slate-200'">
      <div class="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="s in stats" :key="s.label" class="text-center">
          <div class="font-display text-4xl md:text-5xl font-bold text-gradient mb-2">{{ s.value }}</div>
          <div class="text-sm font-mono" :class="isDark ? 'text-slate-500' : 'text-slate-400'">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-16 sm:py-24 px-4">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-10 sm:mb-16">
          <span class="section-badge mb-4 inline-flex">Nima o'rganasiz</span>
          <h2 class="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-4"
              :class="isDark ? 'text-white' : 'text-slate-900'">
            Professional darajada <span class="text-gradient">hamma narsa</span>
          </h2>
        </div>
        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          <div v-for="f in features" :key="f.title"
               class="card group cursor-pointer"
               @click="router.push('/docs')">
            <div class="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{{ f.icon }}</div>
            <h3 class="font-display font-semibold mb-2"
                :class="isDark ? 'text-white' : 'text-slate-900'">{{ f.title }}</h3>
            <p class="text-sm leading-relaxed"
               :class="isDark ? 'text-slate-400' : 'text-slate-500'">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tool comparison -->
    <section class="py-16 sm:py-24 px-4 transition-colors duration-300"
             :class="isDark ? 'bg-dark-900/50' : 'bg-slate-50/80'">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-10 sm:mb-16">
          <span class="section-badge mb-4 inline-flex">2026 Fevral -- Real benchmark</span>
          <h2 class="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-4"
              :class="isDark ? 'text-white' : 'text-slate-900'">
            Claude Code vs Cursor vs <span class="text-gradient">Antigravity</span>
          </h2>
          <p class="mt-4 text-base" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
            Bir xil model -- lekin natija tubdan farq qiladi. Nima uchun?
          </p>
        </div>
        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div v-for="t in tools" :key="t.name"
               :class="[
                 t.color === 'brand'
                   ? (isDark ? 'border-brand-700 bg-brand-950/20' : 'border-brand-300 bg-brand-50/50')
                   : (isDark ? 'border-dark-700' : 'border-slate-200'),
               ]"
               class="relative card border">
            <div v-if="t.color === 'brand'"
                 class="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-mono font-semibold
                        bg-brand-500 text-dark-950 px-3 py-1 rounded-full whitespace-nowrap shadow-md">
              &#9733; Eng yuqori sifat
            </div>
            <div class="flex items-center justify-between mb-5">
              <h3 class="font-display font-bold text-lg"
                  :class="isDark ? 'text-white' : 'text-slate-900'">{{ t.name }}</h3>
              <span :class="t.color === 'brand'
                             ? (isDark ? 'text-brand-400 bg-brand-950 border-brand-800' : 'text-brand-600 bg-brand-50 border-brand-300')
                           : t.color === 'blue'
                             ? (isDark ? 'text-sky-400 bg-sky-950 border-sky-800' : 'text-sky-600 bg-sky-50 border-sky-300')
                             : (isDark ? 'text-purple-400 bg-purple-950 border-purple-800' : 'text-purple-600 bg-purple-50 border-purple-300')"
                    class="text-xs font-mono font-bold px-2.5 py-1 rounded-full border">
                {{ t.badge }}
              </span>
            </div>
            <ul class="space-y-2.5 mb-6">
              <li v-for="p in t.points" :key="p"
                  class="flex items-center gap-2 text-sm"
                  :class="isDark ? 'text-slate-300' : 'text-slate-600'">
                <span :class="t.color === 'brand' ? 'text-brand-500'
                             : t.color === 'blue' ? 'text-sky-500' : 'text-purple-500'"
                      class="font-mono text-base">&#8594;</span>
                {{ p }}
              </li>
            </ul>
            <div class="font-mono text-sm font-semibold"
                 :class="t.color === 'brand'
                         ? (isDark ? 'text-brand-400' : 'text-brand-600')
                        : t.color === 'blue'
                         ? (isDark ? 'text-sky-400' : 'text-sky-600')
                         : (isDark ? 'text-purple-400' : 'text-purple-600')">
              {{ t.price }}
            </div>
          </div>
        </div>
        <div class="text-center mt-10">
          <button @click="router.push('/docs/taqqoslash')" class="btn-ghost">
            To'liq taqqoslashni o'qish
            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 sm:py-24 px-4">
      <div class="max-w-2xl mx-auto text-center">
        <div class="card border p-6 sm:p-10 md:p-14 glow-green transition-colors duration-300"
             :class="isDark
               ? 'border-brand-800/60 bg-gradient-to-b from-brand-950/40 to-dark-900'
               : 'border-brand-200 bg-gradient-to-b from-brand-50/60 to-white'">
          <h2 class="font-display text-3xl md:text-4xl font-bold mb-4"
              :class="isDark ? 'text-white' : 'text-slate-900'">
            Boshlashga tayyormisiz?
          </h2>
          <p class="mb-10" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
            17 bo'lim, real loyiha misoli, terminal screenshotlar.
            <br>
            O'zbek tilida -- yagona professional qo'llanma.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button @click="router.push('/docs')" class="btn-primary text-base px-8 py-3.5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              O'qishni boshlash
            </button>
            <a href="/Claude_Code_Professional_Qollanma.pdf" download class="btn-ghost text-base px-8 py-3.5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              PDF yuklab olish
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t py-10 px-4 transition-colors duration-300"
            :class="isDark ? 'border-dark-800' : 'border-slate-200'">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="font-mono text-sm" :class="isDark ? 'text-slate-600' : 'text-slate-400'">
          &copy; 2026 Claude Code O'zbekcha Qo'llanma
        </div>
        <div class="flex items-center gap-6 text-sm" :class="isDark ? 'text-slate-500' : 'text-slate-400'">
          <a href="https://code.claude.com/docs/en/overview" target="_blank"
             class="hover:text-brand-500 transition-colors">Rasmiy docs</a>
          <a href="https://github.com" target="_blank"
             class="hover:text-brand-500 transition-colors">GitHub</a>
          <span :class="isDark ? 'text-slate-700' : 'text-slate-300'">v7.0</span>
        </div>
      </div>
    </footer>
  </div>
</template>
