<template>
  <footer
    v-if="!hideOnHomeMobile"
    class="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-bg/40 backdrop-blur-xl"
  >
    <div class="mx-auto max-w-4xl px-4 sm:px-6 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <p class="text-center text-sm text-muted flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <span>© {{ new Date().getFullYear() }} Vlad Timchenko</span>
        <span aria-hidden="true" class="text-muted/60">·</span>
        <a
          :href="siteRepo?.url || siteRepoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-muted-light hover:text-teal transition-colors"
        >
          <span aria-hidden="true">★</span>
          <span v-if="siteRepo && siteRepo.stars >= 0">{{ siteRepo.stars }}</span>
          <span v-if="siteRepo">·</span>
          <span>View source on GitHub</span>
        </a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const route = useRoute()
const { public: { siteRepoUrl } } = useRuntimeConfig()
const { data: siteRepo } = await useFetch<{ stars: number; url: string }>('/api/site-repo', { key: 'site-repo' })
const isMobile = ref(false)
let resizeTimeout: ReturnType<typeof setTimeout> | null = null

function checkMobile() {
  if (import.meta.client) {
    isMobile.value = window.innerWidth < 1024
  }
}

function onResize() {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(checkMobile, 150)
}

const hideOnHomeMobile = computed(() => route.path === '/' && isMobile.value)

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (resizeTimeout) clearTimeout(resizeTimeout)
})
</script>
