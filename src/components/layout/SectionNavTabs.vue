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
                :ref="el => { if (el) tabRefs[tab.id] = el as HTMLElement }"
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
const tabRefs = ref<Record<string, HTMLElement>>({})
const showBottomSheet = ref(false)
const useDropdown = ref(false)
const useDropdownWithOverflow = ref(false)
const isClient = ref(false)

const shouldUseDropdown = computed(() => {
  if (props.layout !== 'horizontal') return false
  if (!isClient.value) return false
  return useDropdown.value || useDropdownWithOverflow.value
})

function checkIfTextOverflows() {
  if (import.meta.server || !tabsContainerRef.value) return false
  
  const container = tabsContainerRef.value
  const nav = container?.querySelector('.section-nav-tabs__row') as HTMLElement
  if (!nav) return false
  
  const tabs = Array.from(nav.querySelectorAll('.section-tab--row')) as HTMLElement[]
  if (tabs.length === 0) return false
  
  for (const tab of tabs) {
    const label = tab.querySelector('.section-tab--row__label') as HTMLElement
    if (label) {
      const hasOverflow = label.scrollWidth > label.clientWidth || 
                         label.offsetWidth < label.scrollWidth ||
                         label.textContent && label.scrollWidth > label.offsetWidth
      if (hasOverflow) {
        return true
      }
    }
  }
  
  return false
}

let resizeObserver: ResizeObserver | null = null
let checkTimeout: ReturnType<typeof setTimeout> | null = null

function checkOverflow() {
  if (checkTimeout) {
    clearTimeout(checkTimeout)
  }
  checkTimeout = setTimeout(() => {
    if (import.meta.client && props.layout === 'horizontal') {
      const hasOverflow = checkIfTextOverflows()
      useDropdownWithOverflow.value = hasOverflow
    }
  }, 200)
}

watch(() => props.activeSection, () => {
  if (import.meta.client && props.layout === 'horizontal') {
    checkOverflow()
  }
})

onMounted(() => {
  isClient.value = true
  
  if (import.meta.client && props.layout === 'horizontal') {
    const updateDropdown = () => {
      if (typeof window === 'undefined') return
      const isSmallScreen = window.innerWidth < 480
      useDropdown.value = isSmallScreen
      
      if (!isSmallScreen) {
        checkOverflow()
      }
    }
    
    updateDropdown()
    
    nextTick(() => {
      updateDropdown()
      
      setTimeout(() => {
        updateDropdown()
        if (tabsContainerRef.value && !shouldUseDropdown.value) {
          resizeObserver = new ResizeObserver(() => {
            checkOverflow()
          })
          resizeObserver.observe(tabsContainerRef.value)
        }
      }, 500)
    })
    
    const handleResize = () => {
      updateDropdown()
    }
    
    window.addEventListener('resize', handleResize)
    
    onUnmounted(() => {
      if (checkTimeout) {
        clearTimeout(checkTimeout)
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      window.removeEventListener('resize', handleResize)
    })
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.125rem;
  overflow: hidden;
}
.section-tab--row__label {
  font-size: clamp(0.5rem, min(0.8rem, 2.2vw), 0.8rem);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 100%;
  text-align: center;
  display: block;
}
@media (min-width: 400px) {
  .section-tab--row {
    padding: 0.25rem 0.25rem;
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

.section-nav-dropdown {
  width: 100%;
}

.section-nav-dropdown__button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: rgba(24, 183, 164, 0.1);
  border: 1px solid rgba(24, 183, 164, 0.2);
  color: #3FE0C6;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.section-nav-dropdown__button:hover {
  background: rgba(24, 183, 164, 0.15);
  border-color: rgba(24, 183, 164, 0.3);
}

.section-nav-dropdown__label {
  flex: 1;
  text-align: left;
}

.section-nav-dropdown__icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.section-nav-dropdown__button[aria-expanded="true"] .section-nav-dropdown__icon {
  transform: rotate(180deg);
}
</style>
