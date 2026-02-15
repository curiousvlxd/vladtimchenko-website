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
import { useBodyScrollLock } from '~/common/composables/core/useBodyScrollLock'

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

useBodyScrollLock(toRef(props, 'modelValue'))
</script>

<style scoped src="./StatusModal.css"></style>
