<template>
  <div class="section-nav-tabs" :class="{ 'section-nav-tabs--horizontal': layout === 'horizontal' }">
    <template v-if="layout === 'horizontal'">
      <div class="scale-row">
        <div class="scale-track-h" aria-hidden="true" />
        <div
          class="scale-fill-h"
          :style="{ width: scaleFillWidth }"
          aria-hidden="true"
        />
      </div>
      <nav class="section-nav-tabs__row flex flex-1 gap-0.5" aria-label="Sections">
        <button
          v-for="tab in sections"
          :key="tab.id"
          type="button"
          :class="['section-tab section-tab--row', activeSection === tab.id ? 'section-tab--active' : 'section-tab--inactive']"
          :aria-current="activeSection === tab.id ? 'true' : undefined"
          @click="$emit('scroll-to', tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>
    </template>
    <template v-else>
      <div class="flex min-h-0">
        <div class="scale-column">
          <div class="scale-track" aria-hidden="true" />
          <div
            class="scale-fill"
            :style="{ height: scaleFillHeight }"
            aria-hidden="true"
          />
          <div
            v-for="tab in sections"
            :key="'dot-' + tab.id"
            class="scale-dot-row"
          >
            <span
              class="scale-dot"
              :class="{ 'scale-dot--active': activeSection === tab.id }"
              aria-hidden="true"
            />
          </div>
        </div>
        <nav class="flex flex-col flex-1 py-4 pr-4 pl-2 gap-0.5" aria-label="Sections">
          <button
            v-for="tab in sections"
            :key="tab.id"
            type="button"
            :class="['section-tab', activeSection === tab.id ? 'section-tab--active' : 'section-tab--inactive']"
            :aria-current="activeSection === tab.id ? 'true' : undefined"
            @click="$emit('scroll-to', tab.id)"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
export interface SectionTab {
  id: string
  label: string
}

const props = withDefaults(
  defineProps<{
    sections: SectionTab[]
    activeSection: string
    layout?: 'vertical' | 'horizontal'
  }>(),
  { layout: 'vertical' }
)

defineEmits<{
  'scroll-to': [id: string]
}>()

const activeSectionIndex = computed(() => {
  const i = props.sections.findIndex(t => t.id === props.activeSection)
  return i >= 0 ? i : 0
})

const scaleFillHeight = computed(() => {
  const n = props.sections.length
  if (n === 0) return '0%'
  const p = ((activeSectionIndex.value + 0.5) / n) * 100
  return `${p}%`
})

const scaleFillWidth = computed(() => {
  const n = props.sections.length
  if (n === 0) return '0%'
  const p = ((activeSectionIndex.value + 0.5) / n) * 100
  return `${p}%`
})
</script>

<style scoped>
.section-tab {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: color 0.25s ease, background-color 0.25s ease;
}
.section-tab--inactive {
  color: #e2e2e2;
  background: transparent;
}
.section-tab--inactive:hover {
  color: #6ee7b7;
  background: rgba(30, 59, 59, 0.4);
}
.section-tab--active {
  color: #6ee7b7;
  background: #1e3b3b;
}
.section-tab--active:hover {
  background: #214343;
}

.scale-column {
  position: relative;
  width: 1.25rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 1rem 0;
  align-items: center;
}
.scale-track {
  position: absolute;
  left: 50%;
  top: 1rem;
  bottom: 1rem;
  width: 2px;
  transform: translateX(-50%);
  background: rgba(226, 226, 226, 0.2);
  border-radius: 1px;
  pointer-events: none;
}
.scale-fill {
  position: absolute;
  left: 50%;
  top: 1rem;
  width: 2px;
  transform: translateX(-50%);
  background: #6ee7b7;
  border-radius: 1px;
  pointer-events: none;
  transition: height 0.3s ease-out;
}
.scale-dot-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 1.75rem;
}
.scale-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(226, 226, 226, 0.35);
  flex-shrink: 0;
  transition: width 0.2s ease, height 0.2s ease, background 0.2s ease;
}
.scale-dot--active {
  width: 10px;
  height: 10px;
  background: #6ee7b7;
}

.section-nav-tabs--horizontal {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
}
.section-nav-tabs__row {
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.section-nav-tabs__row::-webkit-scrollbar {
  display: none;
}
.section-tab--row {
  flex: 1 1 0;
  min-width: 0;
  text-align: center;
  padding: 0.5rem 0.375rem;
  font-size: 0.8125rem;
  white-space: nowrap;
}
.scale-row {
  position: relative;
  height: 4px;
  width: 100%;
  border-radius: 2px;
  background: rgba(226, 226, 226, 0.2);
  overflow: hidden;
}
.scale-fill-h {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #6ee7b7;
  border-radius: 2px;
  transition: width 0.3s ease-out;
}
</style>
