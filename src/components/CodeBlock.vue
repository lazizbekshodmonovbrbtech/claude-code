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
    <div class="terminal-bar justify-between">
      <div class="flex items-center gap-2">
        <span class="terminal-dot bg-[#ff5f57]"></span>
        <span class="terminal-dot bg-[#febc2e]"></span>
        <span class="terminal-dot bg-[#28c840]"></span>
        <span v-if="lang" class="font-mono text-xs text-slate-600 ml-2">{{ lang }}</span>
      </div>
      <button @click="copy"
              class="flex items-center gap-1.5 text-xs font-mono text-slate-500
                     hover:text-brand-400 transition-colors opacity-0 group-hover:opacity-100">
        <span>{{ copied ? '✓' : '⎘' }}</span>
        <span>{{ copied ? 'Nusxa olindi!' : 'Nusxa olish' }}</span>
      </button>
    </div>
    <div class="terminal-body">
      <pre class="text-xs text-slate-300 whitespace-pre-wrap">{{ code }}</pre>
    </div>
  </div>
</template>
