<template>
  <div
    v-if="siteKey"
    id="contact-turnstile"
    ref="containerRef"
    class="contact-turnstile"
  />
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const siteKey = (config.public?.turnstileSiteKey as string)?.trim() || ''

if (siteKey) {
  useHead({
    link: [{ rel: 'preconnect', href: 'https://challenges.cloudflare.com' }]
  })
}

const containerRef = ref<HTMLElement | null>(null)
const token = ref<string | null>(null)
let widgetId: string | null = null

function reset() {
  token.value = null
  if (typeof window !== 'undefined' && widgetId != null && (window as any).turnstile?.reset) {
    (window as any).turnstile.reset(widgetId)
  }
}

function render() {
  if (!siteKey || !containerRef.value || (window as any).turnstile?.render == null) return
  widgetId = (window as any).turnstile.render(containerRef.value, {
    sitekey: siteKey,
    theme: 'dark',
    size: 'normal',
    appearance: 'interaction-only',
    callback: (t: string) => {
      token.value = t
    },
    'error-callback': () => {
      token.value = null
    },
    'expired-callback': () => {
      token.value = null
    }
  })
}

onMounted(() => {
  if (!siteKey) return
  const w = (window as any)
  if (w.turnstile?.render) {
    render()
    return
  }
  const script = document.createElement('script')
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
  script.async = true
  script.defer = true
  script.onload = () => nextTick(render)
  document.head.appendChild(script)
})

defineExpose({
  token,
  reset
})
</script>

<style scoped>
.contact-turnstile {
  min-height: 0;
}
</style>
