<template>
  <footer
    v-if="!hideOnHomeMobile"
    class="fixed bottom-0 left-0 right-0 z-40 border-t border-teal/10 bg-bg-card"
  >
    <div class="mx-auto max-w-4xl px-4 sm:px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <p class="text-center text-sm text-muted">
        © {{ new Date().getFullYear() }} Vlad Timchenko
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const route = useRoute()
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
