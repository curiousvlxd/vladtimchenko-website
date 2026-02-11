<template>
  <div class="section-nav-tabs" :class="{ 'section-nav-tabs--horizontal': layout === 'horizontal' }">
    <template v-if="layout === 'horizontal'">
      <ClientOnly>
        <template v-if="!shouldUseDropdown">
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
          <div ref="tabsContainerRef" class="section-nav-tabs__scroll">
            <nav class="section-nav-tabs__row" aria-label="Sections">
              <NuxtLink
                v-for="tab in sections"
                :key="tab.id"
                :to="tab.id === firstSectionId ? '/' : `/#${tab.id}`"
                :class="['section-tab section-tab--row', activeSection === tab.id ? 'section-tab--active' : 'section-tab--inactive']"
                :aria-current="activeSection === tab.id ? 'true' : undefined"
                @click.prevent="emit('scroll-to', tab.id)"
              >
                <span class="section-tab--row__label">{{ tab.label }}</span>
              </NuxtLink>
            </nav>
          </div>
        </template>
        <template v-else>
          <div class="section-nav-dropdown">
            <button
              class="section-nav-dropdown__button"
              @click="showBottomSheet = true"
              aria-label="Select section"
            >
              <span class="section-nav-dropdown__label">{{ activeSectionLabel }}</span>
              <svg class="section-nav-dropdown__icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </template>
        <template #fallback>
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
                @click.prevent="emit('scroll-to', tab.id)"
              >
                <span class="section-tab--row__label">{{ tab.label }}</span>
              </NuxtLink>
            </nav>
          </div>
        </template>
      </ClientOnly>

      <LayoutSectionNavBottomSheet
        v-model="showBottomSheet"
        :sections="sections"
        :active-section="activeSection"
        :scale-fill-width="scaleFillWidth"
        @scroll-to="(id: string) => emit('scroll-to', id)"
      />
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
import { useSectionNavTabsDropdown } from '~/composables/navigation/useSectionNavTabsDropdown'

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

const emit = defineEmits<{
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

const activeSectionLabel = computed(() => {
  const tab = props.sections.find(t => t.id === props.activeSection)
  return tab?.label ?? 'Select section'
})

const tabsContainerRef = ref<HTMLElement | null>(null)
const showBottomSheet = ref(false)

const { shouldUseDropdown, checkOverflow } = useSectionNavTabsDropdown(
  tabsContainerRef,
  toRef(props, 'layout')
)

watch(() => props.activeSection, () => {
  checkOverflow()
})
</script>

<style scoped src="./SectionNavTabs.css"></style>
