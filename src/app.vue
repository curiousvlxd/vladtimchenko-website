<template>
  <div>
    <AppLoading />
    <div :style="!contentVisible ? { visibility: 'hidden' } : undefined">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = useState('app-loading', () => true)
const contentVisible = ref(false)
const router = useRouter()

const LOADER_DELAY = 120
const CONTENT_REVEAL_DELAY = 120

watch(loading, (v) => {
  if (!v) {
    const t = setTimeout(() => { contentVisible.value = true }, CONTENT_REVEAL_DELAY)
    return () => clearTimeout(t)
  }
  contentVisible.value = false
}, { immediate: true })

onMounted(() => {
  let loaderTimer: ReturnType<typeof setTimeout> | null = null

  router.beforeEach((_to, from) => {
    if (from.matched.length === 0) return
    loaderTimer = setTimeout(() => {
      loaderTimer = null
      loading.value = true
    }, LOADER_DELAY)
  })

  router.afterEach(() => {
    if (loaderTimer) {
      clearTimeout(loaderTimer)
      loaderTimer = null
    }
    loading.value = false
  })
})
</script>
