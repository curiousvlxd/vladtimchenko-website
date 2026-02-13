<template>
  <Teleport to="body">
    <Transition name="pdf-modal">
      <div
        v-if="isOpen"
        class="pdf-modal-overlay fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md safe-area-pad"
        role="dialog"
        aria-modal="true"
        aria-label="PDF viewer"
        @click.self="close"
      >
        <div class="pdf-modal-box relative w-full sm:max-w-4xl h-[85dvh] sm:h-[88vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-teal/30 border-b-0 sm:border-b bg-bg-card overflow-hidden shadow-[0_0_0_1px_rgba(24,183,164,0.1),0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_40px_-10px_rgba(24,183,164,0.15)]">
          <div class="pdf-modal-gradient pointer-events-none absolute inset-0 rounded-t-2xl sm:rounded-2xl opacity-100" aria-hidden="true" />
          <header class="relative flex items-center justify-between shrink-0 px-4 sm:px-5 py-3 sm:py-4 border-b border-teal/20 bg-bg-card/90">
            <span class="font-display text-sm font-medium text-muted-pale truncate pr-2">{{ titleValue }}</span>
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
              <ModalLoader :show="Boolean(iframeSrc) && pdfLoading" />
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
import ModalLoader from '~/components/ui/ModalLoader.vue'
import { PDF_MODAL } from '~/constants/modals/pdf-modal'
import { useBodyScrollLock } from '~/composables/core/useBodyScrollLock'
import { useEscapeKey } from '~/composables/core/useEscapeKey'
import { useBreakpoint } from '~/composables/core/useBreakpoint'

const props = defineProps<{
  modelValue: MaybeRef<boolean>
  pdfUrl: MaybeRef<string>
  title?: MaybeRef<string>
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const isOpen = computed(() => unref(props.modelValue))
const pdfUrlValue = computed(() => unref(props.pdfUrl))
const titleValue = computed(() => unref(props.title))

const iframeSrc = computed(() => {
  if (!isOpen.value) return ''
  const url = pdfUrlValue.value?.trim()
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (import.meta.client && typeof window !== 'undefined') {
    return new URL(url, window.location.origin).href
  }
  return url
})

const pdfLoading = ref(true)

const isMobile = useBreakpoint(PDF_MODAL.MOBILE_BREAKPOINT_PX)

useBodyScrollLock(isOpen)
useEscapeKey(close, isOpen)

watch(isOpen, (open) => {
  if (open) pdfLoading.value = true
}, { immediate: true })

function onIframeLoad() {
  pdfLoading.value = false
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped src="./PdfModal.css"></style>

