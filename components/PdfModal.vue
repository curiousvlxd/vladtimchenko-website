<template>
  <Teleport to="body">
    <Transition name="pdf-modal">
      <div
        v-if="modelValue"
        class="pdf-modal-overlay fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md safe-area-pad"
        role="dialog"
        aria-modal="true"
        aria-label="PDF viewer"
        @click.self="close"
      >
        <div class="pdf-modal-box relative w-full sm:max-w-4xl h-[85dvh] sm:h-[88vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-teal/30 border-b-0 sm:border-b bg-bg-card overflow-hidden shadow-[0_0_0_1px_rgba(24,183,164,0.1),0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_40px_-10px_rgba(24,183,164,0.15)]">
          <div class="pdf-modal-gradient pointer-events-none absolute inset-0 rounded-t-2xl sm:rounded-2xl opacity-100" aria-hidden="true" />
          <header class="relative flex items-center justify-between shrink-0 px-4 sm:px-5 py-3 sm:py-4 border-b border-teal/20 bg-bg-card/90">
            <span class="font-display text-sm font-medium text-muted-pale truncate pr-2">{{ title }}</span>
            <div class="flex items-center gap-1 shrink-0">
              <a
                v-if="iframeSrc"
                :href="iframeSrc"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2.5 rounded-xl text-muted hover:text-teal hover:bg-teal/10 transition-colors duration-200"
                aria-label="Open PDF in new tab"
                title="Open in new tab"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
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
            </div>
          </header>
          <div class="relative flex-1 min-h-0 flex flex-col bg-[#0d1218] overflow-hidden pdf-content-area">
            <div v-if="iframeSrc && isMobile" class="flex flex-col flex-1 min-h-0 p-4 sm:p-6">
              <div class="flex flex-col items-center justify-center gap-4 flex-1 rounded-xl border border-teal/20 bg-bg-card/50 py-8 px-4">
                <p class="text-muted-pale text-sm text-center">
                  For a better viewing experience on your phone, open the PDF in your browser.
                </p>
                <a
                  :href="iframeSrc"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium bg-teal text-bg hover:bg-teal/90 transition-colors"
                  @click="close"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open PDF
                </a>
              </div>
            </div>
            <template v-else>
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
                :key="'iframe-' + iframeSrc"
                :src="iframeSrc"
                class="pdf-iframe w-full flex-1 min-h-0 border-0 bg-white"
                title="PDF document"
                @load="onIframeLoad"
              />
            </template>
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

const isMobile = ref(false)
function updateMobile () {
  if (import.meta.client && typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 640
  }
}

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
  updateMobile()
  window.addEventListener('resize', updateMobile)
})
onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
  if (import.meta.client && typeof window !== 'undefined') {
    window.removeEventListener('resize', updateMobile)
  }
})
</script>

<style scoped>
.safe-area-pad {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.pdf-modal-box {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

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

.pdf-content-area {
  min-height: 0;
}
.pdf-iframe,
.pdf-embed {
  height: 100%;
  min-height: 400px;
}
@media (min-width: 640px) {
  .pdf-iframe,
  .pdf-embed {
    min-height: 60vh;
  }
}
</style>
