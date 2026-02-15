<template>
  <div>
    <AppLoading v-if="loading" />

    <NuxtLayout>
      <NuxtPage>
        <template #default="{ Component, route }">
          <Suspense :timeout="0">
            <component :is="Component" />
            <template #fallback>
              <AppRouteSkeleton :path="route?.path" />
            </template>
          </Suspense>
        </template>
      </NuxtPage>
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
