<template>
  <Teleport to="body">
    <Transition name="bottom-sheet">
      <div
        v-if="modelValue"
        class="bottom-sheet-overlay fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Select section"
        @click="onOverlayClick"
        @keydown.esc="close"
      >
        <div
          class="bottom-sheet-content"
          :style="{ transform: `translateY(${dragOffset}px)` }"
          @click.stop
        >
          <div
            class="bottom-sheet-drag-area"
            @mousedown="startDrag"
            @touchstart.passive="startDrag"
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
          <nav class="bottom-sheet-nav" aria-label="Sections">
            <button
              v-for="tab in sections"
              :key="tab.id"
              type="button"
              :class="['bottom-sheet-item', activeSection === tab.id ? 'bottom-sheet-item--active' : '']"
              @click.stop="select(tab.id)"
              @touchstart.stop.passive="select(tab.id)"
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

function close() {
  emit('update:modelValue', false)
}

function select(id: string) {
  if (props.activeSection !== id) {
    emit('scroll-to', id)
  }
  close()
}

function onOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('bottom-sheet-overlay')) {
    close()
  }
}

useBodyScrollLock(toRef(props, 'modelValue'))

const dragStartY = ref(0)
const dragStartContentY = ref(0)
const isDragging = ref(false)
const dragOffset = ref(0)
const contentHeight = ref(0)

function startDrag(e: MouseEvent | TouchEvent) {
  if ((e.target as HTMLElement).closest('.bottom-sheet-nav')) return
  e.preventDefault()
  if ('touches' in e) (e as TouchEvent).stopPropagation()
  isDragging.value = true
  const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
  dragStartY.value = clientY
  dragStartContentY.value = dragOffset.value
  const content = document.querySelector('.bottom-sheet-content') as HTMLElement
  if (content) contentHeight.value = content.offsetHeight
  document.addEventListener('mousemove', onDrag, { passive: false })
  document.addEventListener('mouseup', endDrag)
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('touchend', endDrag)
  document.addEventListener('touchcancel', endDrag)
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return
  e.preventDefault()
  const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
  const deltaY = clientY - dragStartY.value
  const newOffset = Math.max(0, dragStartContentY.value + deltaY)
  dragOffset.value = newOffset
  if (newOffset > contentHeight.value * 0.6) {
    close()
    endDrag()
  }
}

function endDrag() {
  if (!isDragging.value) return
  isDragging.value = false
  if (dragOffset.value > contentHeight.value * 0.4) close()
  else dragOffset.value = 0
  setTimeout(() => {
    if (!props.modelValue) dragOffset.value = 0
  }, 300)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', endDrag)
  document.removeEventListener('touchcancel', endDrag)
}

watch(() => props.modelValue, (open) => {
  if (!open) dragOffset.value = 0
})

onUnmounted(() => endDrag())
</script>

<style scoped>
.bottom-sheet-overlay {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}
.bottom-sheet-content {
  width: 100%;
  max-width: 100%;
  max-height: 80vh;
  background: #0A1117;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  border: 1px solid rgba(24, 183, 164, 0.2);
  border-bottom: none;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom, 0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  touch-action: none;
}
.bottom-sheet-drag-area {
  flex-shrink: 0;
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.bottom-sheet-drag-area:active {
  cursor: grabbing;
}
.bottom-sheet-handle {
  width: 2.5rem;
  height: 0.5rem;
  background: rgba(110, 231, 183, 0.3);
  border-radius: 0.25rem;
  margin: 0.75rem auto 0.5rem;
  flex-shrink: 0;
  pointer-events: none;
}
.bottom-sheet-scale {
  position: relative;
  width: calc(100% - 2.5rem);
  height: 1.25rem;
  margin: 0 auto 1rem;
  flex-shrink: 0;
  overflow: hidden;
  padding: 0 0.25rem;
}
.bottom-sheet-scale-track {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 2px;
  background: rgba(226, 226, 226, 0.2);
  border-radius: 1px;
}
.bottom-sheet-scale-fill {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 2px;
  background: #6ee7b7;
  border-radius: 1px;
  transition: width 0.3s ease-out;
}
.bottom-sheet-scale-dots {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
}
.bottom-sheet-scale-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(226, 226, 226, 0.35);
  flex-shrink: 0;
  transition: width 0.2s ease, height 0.2s ease, background 0.2s ease;
  box-shadow: 0 0 0 2px rgba(10, 17, 23, 0.9);
}
.bottom-sheet-scale-dot--active {
  width: 10px;
  height: 10px;
  background: #6ee7b7;
}
.bottom-sheet-nav {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem 0;
  flex: 1;
  min-height: 0;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  touch-action: pan-y;
  position: relative;
  z-index: 1;
}
.bottom-sheet-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: transparent;
  border: none;
  color: #E6F1F4;
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.bottom-sheet-item:active {
  background: rgba(24, 183, 164, 0.1);
}
.bottom-sheet-item--active {
  background: rgba(24, 183, 164, 0.15);
  color: #3FE0C6;
}
.bottom-sheet-item--active:active {
  background: rgba(24, 183, 164, 0.2);
}
.bottom-sheet-item__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: rgba(110, 231, 183, 0.3);
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.bottom-sheet-item__dot--active {
  width: 0.75rem;
  height: 0.75rem;
  background: #3FE0C6;
}
.bottom-sheet-item__label {
  flex: 1;
}
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.bottom-sheet-enter-active .bottom-sheet-content,
.bottom-sheet-leave-active .bottom-sheet-content {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  opacity: 0;
}
.bottom-sheet-enter-from .bottom-sheet-content,
.bottom-sheet-leave-to .bottom-sheet-content {
  transform: translateY(100%);
  opacity: 0.8;
}
</style>
