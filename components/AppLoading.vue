<template>
  <Transition name="loading-fade-out">
    <div
      v-show="loading"
      class="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-bg"
      aria-hidden="!loading"
    >
      <img
        src="/logo.svg"
        alt=""
        width="120"
        height="120"
        class="shrink-0"
        style="width: 120px; height: 120px; object-fit: contain;"
        fetchpriority="high"
      />
      <div class="w-48 sm:w-64 h-1 rounded-full bg-bg-card overflow-hidden">
        <div class="h-full rounded-full bg-teal loading-bar" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const loading = useState('app-loading', () => true)

onMounted(() => {
  const hide = () => { loading.value = false }
  if (document.readyState !== 'loading') {
    hide()
  } else {
    document.addEventListener('DOMContentLoaded', hide, { once: true })
  }
})
</script>

<style scoped>
.loading-bar {
  animation: loading 1.2s ease-in-out infinite;
  width: 40%;
}

@keyframes loading {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(150%); }
  100% { transform: translateX(-100%); }
}

.loading-fade-out-leave-active {
  transition: opacity 0.3s ease;
}
.loading-fade-out-leave-to {
  opacity: 0;
}
</style>
