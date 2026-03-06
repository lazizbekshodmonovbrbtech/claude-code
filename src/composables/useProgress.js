import { ref, onMounted, onUnmounted } from 'vue'

export function useProgress() {
  const progress = ref(0)

  function update() {
    const el = document.documentElement
    const scrolled = el.scrollTop || document.body.scrollTop
    const total = el.scrollHeight - el.clientHeight
    progress.value = total > 0 ? Math.round((scrolled / total) * 100) : 0
  }

  onMounted(() => window.addEventListener('scroll', update, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', update))

  return { progress }
}
