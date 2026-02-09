<template>
  <Transition name="loading-fade-out">
    <div
      v-show="loading"
      class="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-bg"
      aria-hidden="!loading"
    >
      <img
        :src="logoSrc"
        alt=""
        width="120"
        height="120"
        class="shrink-0"
        style="width: 120px; height: 120px; object-fit: contain;"
        fetchpriority="high"
      />
      <div class="w-48 sm:w-64 h-1 rounded-full bg-bg-card overflow-hidden">
        <div
          class="h-full rounded-full bg-teal loading-bar"
          :style="{ width: progress + '%' }"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const loading = useState('app-loading', () => true)
const appReady = useState('app-ready', () => false)
import { ASSETS } from '~/constants'
const logoSrc = ASSETS.LOGO

const progress = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function startProgress() {
  if (timer) return
  timer = setInterval(() => {
    if (appReady.value) return
    if (progress.value < 80) {
      progress.value = Math.min(80, progress.value + 5)
    } else if (progress.value < 92) {
      progress.value = Math.min(92, progress.value + 1)
    }
  }, 80)
}

onMounted(() => {
  progress.value = 10
  startProgress()
})

watch(
  appReady,
  (ready) => {
    if (!ready) return
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    progress.value = 100
    setTimeout(() => {
      loading.value = false
    }, 200)
  },
  { immediate: true }
)

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.loading-bar {
  width: 0;
  transition: width 0.25s ease-out;
}

.loading-fade-out-leave-active {
  transition: opacity 0.15s ease;
}
.loading-fade-out-leave-to {
  opacity: 0;
}
</style>
