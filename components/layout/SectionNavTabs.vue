<template>
  <div class="section-nav-tabs" :class="{ 'section-nav-tabs--horizontal': layout === 'horizontal' }">
    <template v-if="layout === 'horizontal'">
      <div class="scale-row-h" aria-hidden="true">
        <div class="scale-track-h" />
        <div
          class="scale-fill-h"
          :style="{ width: scaleFillWidth }"
        />
        <div class="scale-dots-row-h">
          <span
            v-for="tab in sections"
            :key="'dot-h-' + tab.id"
            class="scale-dot"
            :class="{ 'scale-dot--active': activeSection === tab.id }"
          />
        </div>
      </div>
      <div class="section-nav-tabs__scroll">
        <nav class="section-nav-tabs__row" aria-label="Sections">
          <NuxtLink
            v-for="tab in sections"
            :key="tab.id"
            :to="tab.id === firstSectionId ? '/' : `/#${tab.id}`"
            :class="['section-tab section-tab--row', activeSection === tab.id ? 'section-tab--active' : 'section-tab--inactive']"
            :aria-current="activeSection === tab.id ? 'true' : undefined"
            @click.prevent="$emit('scroll-to', tab.id)"
          >
            {{ tab.label }}
          </NuxtLink>
        </nav>
      </div>
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
          <NuxtLink
            v-for="tab in sections"
            :key="tab.id"
            :to="tab.id === firstSectionId ? '/' : `/#${tab.id}`"
            :class="['section-tab', activeSection === tab.id ? 'section-tab--active' : 'section-tab--inactive']"
            :aria-current="activeSection === tab.id ? 'true' : undefined"
            @click.prevent="$emit('scroll-to', tab.id)"
          >
            {{ tab.label }}
          </NuxtLink>
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
    firstSectionId?: string
    layout?: 'vertical' | 'horizontal'
  }>(),
  { firstSectionId: 'about', layout: 'vertical' }
)

defineEmits<{
  'scroll-to': [id: string]
}>()

const firstSectionId = computed(() => props.firstSectionId ?? 'about')
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
  const idx = activeSectionIndex.value
  if (idx >= n - 1) return '100%'
  const p = ((idx + 0.5) / n) * 100
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
  text-decoration: none;
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
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
.section-nav-tabs--horizontal .scale-row-h {
  flex-shrink: 0;
}
.section-nav-tabs--horizontal .section-nav-tabs__scroll {
  flex: 1 1 auto;
  min-height: 2rem;
}
.section-nav-tabs__scroll {
  width: 100%;
  min-width: 0;
}
.section-nav-tabs__row {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  gap: 0.125rem;
  min-height: 2rem;
  padding: 0;
}
.section-tab--row {
  flex: 1 1 0;
  min-width: 0;
  text-align: center;
  padding: 0.2rem 0.125rem;
  font-size: 0.5rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (min-width: 400px) {
  .section-tab--row {
    padding: 0.25rem 0.25rem;
    font-size: 0.5625rem;
  }
}
.scale-row-h {
  position: relative;
  width: 100%;
  height: 1.25rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.scale-track-h {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(226, 226, 226, 0.2);
  border-radius: 1px;
  pointer-events: none;
}
.scale-fill-h {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  height: 2px;
  margin: auto 0;
  background: #6ee7b7;
  border-radius: 1px;
  pointer-events: none;
  transition: width 0.3s ease-out;
}
.scale-dots-row-h {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
  pointer-events: none;
}
.scale-dots-row-h .scale-dot {
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(13, 18, 24, 0.9);
}
.scale-dots-row-h .scale-dot--active {
  box-shadow: 0 0 0 2px rgba(13, 18, 24, 0.9);
}
</style>
