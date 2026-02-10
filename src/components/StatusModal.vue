<template>
  <Teleport to="body">
    <Transition name="status-modal">
      <div
        v-if="modelValue"
        class="status-modal-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        @click="close"
        @keydown.esc="close"
      >
        <div
          class="status-modal-card"
          @click.stop
        >
          <button
            type="button"
            class="status-modal-close"
            aria-label="Close"
            @click="close"
          >
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="status-modal-content">
            <div
              class="status-modal-icon"
              :class="iconClass"
            >
              <svg v-if="variant === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-display text-lg font-semibold text-muted-pale">
              {{ title }}
            </h3>
            <p class="text-sm text-muted-light leading-relaxed max-w-sm">
              {{ message }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    variant: 'success' | 'error'
    title: string
    message: string
    ariaLabel?: string
  }>(),
  { ariaLabel: 'Status' }
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const iconClass = computed(() =>
  props.variant === 'success'
    ? 'bg-teal/15 border-teal/40 text-teal-light'
    : 'bg-red-500/10 border-red-500/40 text-red-400'
)

function close() {
  emit('update:modelValue', false)
}

let scrollY = 0
watch(
  () => props.modelValue,
  (isOpen) => {
    if (!import.meta.client || typeof document === 'undefined') return
    if (isOpen) {
      scrollY = window.scrollY || window.pageYOffset || 0
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo({ top: scrollY })
    }
  }
)

onUnmounted(() => {
  if (!import.meta.client || typeof document === 'undefined') return
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
})
</script>

<style scoped>
.status-modal-overlay {
  @apply fixed inset-0 z-[110] flex items-center justify-center p-4;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}

.status-modal-card {
  @apply relative w-full max-w-md flex flex-col items-center;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  border: 1px solid rgba(24, 183, 164, 0.2);
  background: rgba(24, 183, 164, 0.05);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 40px -10px rgba(24, 183, 164, 0.15);
}

.status-modal-close {
  @apply absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 shrink-0;
  background: rgba(24, 183, 164, 0.1);
  border: 1px solid rgba(24, 183, 164, 0.2);
  color: #e6f1f4;
}
.status-modal-close:hover {
  background: rgba(24, 183, 164, 0.2);
  border-color: rgba(24, 183, 164, 0.4);
  color: #18b7a4;
}

.status-modal-content {
  @apply flex flex-col items-center text-center gap-3;
}

.status-modal-icon {
  @apply w-10 h-10 rounded-full flex items-center justify-center border;
}

.status-modal-enter-active,
.status-modal-leave-active {
  transition: opacity 0.25s ease;
}
.status-modal-enter-active .status-modal-card,
.status-modal-leave-active .status-modal-card {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.status-modal-enter-from,
.status-modal-leave-to {
  opacity: 0;
}
.status-modal-enter-from .status-modal-card,
.status-modal-leave-to .status-modal-card {
  opacity: 0;
  transform: scale(0.98) translateY(8px);
}
</style>
