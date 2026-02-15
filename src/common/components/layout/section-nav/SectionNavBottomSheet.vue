<template>
  <Teleport to="body">
    <Transition name="bottom-sheet">
      <div
        v-if="modelValue"
        class="bottom-sheet-overlay fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Select section"
        @click.self="close"
        @keydown.esc="close"
      >
        <div
          ref="contentRef"
          class="bottom-sheet-content"
          :style="contentStyle"
          @click.stop
        >
          <div
            class="bottom-sheet-drag-area"
            @pointerdown="startDrag"
          >
            <div class="bottom-sheet-handle" />
            <div class="bottom-sheet-scale">
              <div class="bottom-sheet-scale-track" />
              <div
                class="bottom-sheet-scale-fill"
                :style="{ width: scaleFillWidth }"
              />
              <div class="bottom-sheet-scale-dots">
                <span
                  v-for="tab in sections"
                  :key="'dot-' + tab.id"
                  class="bottom-sheet-scale-dot"
                  :class="{ 'bottom-sheet-scale-dot--active': activeSection === tab.id }"
                />
              </div>
            </div>
          </div>
          <nav ref="navRef" class="bottom-sheet-nav" aria-label="Sections">
            <button
              v-for="tab in sections"
              :key="tab.id"
              type="button"
              :class="['bottom-sheet-item', activeSection === tab.id ? 'bottom-sheet-item--active' : '']"
              @click.stop="select(tab.id)"
            >
              <span
                class="bottom-sheet-item__dot"
                :class="{ 'bottom-sheet-item__dot--active': activeSection === tab.id }"
              />
              <span class="bottom-sheet-item__label">{{ tab.label }}</span>
            </button>
          </nav>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { BOTTOM_SHEET_RULES } from '~/features/navigation/constants'
import { useBodyScrollLock } from '~/common/composables/core/useBodyScrollLock'
import { useBottomSheetDrag } from '~/features/navigation/composables/useBottomSheetDrag'

export interface SectionTab {
  id: string
  label: string
}

const props = defineProps<{
  modelValue: boolean
  sections: SectionTab[]
  activeSection: string
  scaleFillWidth: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'scroll-to': [id: string]
}>()

const contentRef = ref<HTMLElement | null>(null)
const navRef = ref<HTMLElement | null>(null)

function close() {
  emit('update:modelValue', false)
}

function select(id: string) {
  if (props.activeSection !== id) {
    emit('scroll-to', id)
  }
  close()
}

useBodyScrollLock(toRef(props, 'modelValue'))

const { dragOffset, startDrag } = useBottomSheetDrag(
  contentRef,
  toRef(props, 'modelValue'),
  close,
  {
    excludeRef: navRef,
    rules: BOTTOM_SHEET_RULES
  }
)

const contentStyle = computed(() => ({
  transform: `translateY(${dragOffset.value}px)`,
  '--bottom-sheet-max-vh': `${BOTTOM_SHEET_RULES.MAX_HEIGHT_VH}`
}))
</script>

<style scoped src="./SectionNavBottomSheet.css"></style>

