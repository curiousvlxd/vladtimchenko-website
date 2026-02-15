<template>
  <Teleport to="body">
    <Transition name="article-image-modal">
      <div
        v-if="isOpen && src"
        class="article-image-modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        :aria-label="titleValue"
        @click.self="close"
      >
        <div class="article-image-modal-box relative w-fit max-w-[calc(100vw-32px)] sm:max-w-[calc(100vw-80px)] max-h-[calc(100dvh-32px)] sm:max-h-[calc(100dvh-56px)] flex flex-col rounded-2xl border border-teal/30 bg-bg-card overflow-hidden shadow-[0_0_0_1px_rgba(24,183,164,0.1),0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_40px_-10px_rgba(24,183,164,0.15)]">
          <div class="article-image-modal-gradient pointer-events-none absolute inset-0 rounded-2xl opacity-100" aria-hidden="true" />

          <header class="relative w-full flex items-center justify-between shrink-0 px-4 sm:px-5 py-3 sm:py-4 border-b border-teal/20 bg-bg-card/90">
            <span class="min-w-0 flex-1 font-display text-sm font-medium text-muted-pale truncate pr-2">{{ titleValue }}</span>
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

          <div class="relative flex items-center justify-center bg-[#0d1218] overflow-hidden">
            <ModalLoader :show="imageLoading" />
            <img
              :src="src"
              :alt="alt || ''"
              class="block w-auto h-auto max-w-[calc(100vw-56px)] sm:max-w-[calc(100vw-120px)] max-h-[calc(100dvh-210px)] sm:max-h-[calc(100dvh-190px)] transition-opacity duration-200"
              :class="imageLoading ? 'opacity-0' : 'opacity-100'"
              loading="eager"
              decoding="async"
              @load="onImageLoaded"
              @error="onImageLoaded"
            >
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import ModalLoader from '~/common/components/ui/ModalLoader.vue'
import { useBodyScrollLock } from '~/common/composables/core/useBodyScrollLock'
import { useEscapeKey } from '~/common/composables/core/useEscapeKey'

const props = defineProps<{
  modelValue: boolean
  src: string
  alt?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed(() => props.modelValue)
const titleValue = computed(() => props.alt?.trim() || 'Image preview')
const imageLoading = ref(true)

useBodyScrollLock(isOpen)
useEscapeKey(close, isOpen)

watch(
  () => [isOpen.value, props.src] as const,
  ([open, nextSrc]) => {
    imageLoading.value = Boolean(open && nextSrc)
  },
  { immediate: true }
)

function onImageLoaded() {
  imageLoading.value = false
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.article-image-modal-gradient {
  background: radial-gradient(
    ellipse 120% 80% at 50% 0%,
    rgba(24, 183, 164, 0.08) 0%,
    rgba(24, 183, 164, 0.02) 45%,
    transparent 65%
  );
}

.article-image-modal-enter-active,
.article-image-modal-leave-active {
  transition: opacity 0.25s ease;
}

.article-image-modal-enter-active .article-image-modal-box,
.article-image-modal-leave-active .article-image-modal-box {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.article-image-modal-enter-from,
.article-image-modal-leave-to {
  opacity: 0;
}

.article-image-modal-enter-from .article-image-modal-box,
.article-image-modal-leave-to .article-image-modal-box {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}
</style>
