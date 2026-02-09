<template>
  <div>
    <AppLoading v-if="loading" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const loading = useState('app-loading', () => true)
const appReady = useState('app-ready', () => false)

onMounted(() => {
  appReady.value = true
})
</script>
