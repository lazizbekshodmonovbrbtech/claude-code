<script setup>
import { ref } from 'vue'

const props  = defineProps({ code: String, lang: { type: String, default: '' } })
const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div class="terminal-block my-6 group">
    <div class="terminal-bar flex items-center justify-between">
      <div class="flex items-center justify-start">
        <span class="terminal-dot bg-[#ff5f57]"></span>
        <span class="terminal-dot bg-[#febc2e]"></span>
        <span class="terminal-dot bg-[#28c840]"></span>
        <span v-if="lang" class="font-mono text-xs text-slate-600 ml-2">{{ lang }}</span>
      </div>
      <button @click="copy"
              class="flex items-center gap-1.5 text-xs font-mono text-slate-500
                     hover:text-brand-400 transition-colors opacity-0 group-hover:opacity-100">
        <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" stroke-width="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-width="2"/>
        </svg>
        <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span>{{ copied ? 'Nusxa olindi!' : 'Nusxa olish' }}</span>
      </button>
    </div>
    <div class="terminal-body">
      <pre class="text-xs text-slate-300 whitespace-pre-wrap">{{ code }}</pre>
    </div>
  </div>
</template>
