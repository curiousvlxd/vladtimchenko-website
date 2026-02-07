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

watch(loading, (v) => {
  if (!v) {
    const t = setTimeout(() => { contentVisible.value = true }, 350)
    return () => clearTimeout(t)
  }
  contentVisible.value = false
}, { immediate: true })
</script>
