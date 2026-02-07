<template>
  <Teleport to="body">
    <Transition name="pdf-modal">
      <div
        v-if="modelValue"
        class="pdf-modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="PDF viewer"
        @click.self="close"
      >
        <div class="pdf-modal-box relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-teal/30 bg-bg-card overflow-hidden shadow-[0_0_0_1px_rgba(24,183,164,0.1),0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_40px_-10px_rgba(24,183,164,0.15)]">
          <div class="pdf-modal-gradient pointer-events-none absolute inset-0 rounded-2xl opacity-100" aria-hidden="true" />
          <header class="relative flex items-center justify-between shrink-0 px-5 py-4 border-b border-teal/20 bg-bg-card/90">
            <span class="font-display text-sm font-medium text-muted-pale">{{ title }}</span>
            <button
              type="button"
              class="p-2.5 rounded-xl text-muted hover:text-teal hover:bg-teal/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:ring-offset-2 focus:ring-offset-bg-card"
              aria-label="Close"
              @click="close"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>
          <div class="relative flex-1 min-h-0 flex flex-col bg-[#0d1218] overflow-hidden" style="min-height: 70vh;">
            <Transition name="pdf-loader">
              <div
                v-if="pdfLoading"
                class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-[#0d1218]"
                aria-hidden="true"
              >
                <img
                  src="/logo.svg"
                  alt=""
                  width="80"
                  height="80"
                  class="shrink-0 opacity-90"
                  style="width: 80px; height: 80px; object-fit: contain;"
                />
                <div class="w-40 sm:w-52 h-1 rounded-full bg-bg-card overflow-hidden">
                  <div class="h-full rounded-full bg-teal pdf-modal-loading-bar" />
                </div>
              </div>
            </Transition>
            <iframe
              v-if="iframeSrc"
              :key="iframeSrc"
              :src="iframeSrc"
              class="pdf-iframe w-full border-0 bg-white"
              style="min-height: 70vh; height: 100%;"
              title="PDF document"
              @load="onIframeLoad"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  pdfUrl: string
  title?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const iframeSrc = computed(() => {
  if (!props.modelValue) return ''
  const url = props.pdfUrl?.trim()
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (import.meta.client && typeof window !== 'undefined') {
    return new URL(url, window.location.origin).href
  }
  return url
})

const pdfLoading = ref(true)

function onIframeLoad () {
  pdfLoading.value = false
}

watch(() => props.modelValue, (open) => {
  if (import.meta.client && typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : ''
  }
  if (open) pdfLoading.value = true
}, { immediate: true })

function close () {
  emit('update:modelValue', false)
}

function onKeydown (e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.pdf-modal-gradient {
  background: radial-gradient(
    ellipse 120% 80% at 50% 0%,
    rgba(24, 183, 164, 0.08) 0%,
    rgba(24, 183, 164, 0.02) 45%,
    transparent 65%
  );
}

.pdf-modal-enter-active,
.pdf-modal-leave-active {
  transition: opacity 0.25s ease;
}
.pdf-modal-enter-active .pdf-modal-box,
.pdf-modal-leave-active .pdf-modal-box {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.pdf-modal-enter-from,
.pdf-modal-leave-to {
  opacity: 0;
}
.pdf-modal-enter-from .pdf-modal-box,
.pdf-modal-leave-to .pdf-modal-box {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

.pdf-modal-loading-bar {
  animation: pdf-loading 1.2s ease-in-out infinite;
  width: 40%;
}

@keyframes pdf-loading {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(150%); }
  100% { transform: translateX(-100%); }
}

.pdf-loader-enter-active,
.pdf-loader-leave-active {
  transition: opacity 0.2s ease;
}
.pdf-loader-enter-from,
.pdf-loader-leave-to {
  opacity: 0;
}
</style>
