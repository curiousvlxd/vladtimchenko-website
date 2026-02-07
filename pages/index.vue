<template>
  <div class="home-content-container flex gap-8 lg:gap-12 mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
    <main id="home-top" class="min-w-0 flex-1 max-w-4xl">
      <BrandingHeroBannerCard class="mb-10 sm:mb-14" />

      <section
        :id="tabs[0]?.id || 'about'"
        class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-6 sm:p-8 mb-8"
      >
        <h2 class="font-display text-2xl font-semibold text-muted-pale mb-4">
          {{ home?.about?.title ?? 'About' }}
        </h2>
        <div class="prose prose-invert max-w-none">
          <p
            v-for="(p, i) in (home?.about?.paragraphs ?? [])"
            :key="i"
            class="text-muted-light leading-relaxed mb-4 last:mb-0"
          >
            {{ p }}
          </p>
        </div>
      </section>

      <section
        :id="tabs[1]?.id || 'experience'"
        class="mb-12"
      >
        <h2 class="font-display text-2xl font-semibold text-muted-pale mb-2">
          {{ home?.experience?.title ?? 'Experience' }}
        </h2>
        <p class="text-muted-light text-sm mb-6">
          {{ home?.experience?.commercialLabel ?? 'Commercial experience' }}
        </p>
        <div class="flex flex-col gap-6">
          <SectionsExperienceCard
            v-for="entry in experienceEntries"
            :key="entry.company + entry.role"
            :entry="entry"
          />
        </div>
      </section>

      <section
        :id="tabs[2]?.id || 'volunteering'"
        class="mb-12"
      >
        <h2 class="font-display text-2xl font-semibold text-muted-pale mb-6">
          {{ home?.volunteering?.title ?? 'Volunteering' }}
        </h2>
        <div class="flex flex-col gap-6">
          <SectionsVolunteeringCard
            v-for="entry in volunteeringEntries"
            :key="entry.organization + entry.role"
            :entry="entry"
          />
        </div>
      </section>

      <section
        :id="tabs[3]?.id || 'projects'"
      >
        <h2 class="font-display text-2xl font-semibold text-muted-pale mb-2">
          {{ home?.projects?.title ?? 'Projects' }}
        </h2>
        <p class="text-muted-light text-sm mb-6">
          Featured open-source and side projects.
        </p>
        <div v-if="pending" class="flex flex-col gap-4">
          <div
            v-for="i in 4"
            :key="i"
            class="rounded-2xl border border-teal/20 bg-bg-card h-28 animate-pulse"
          />
        </div>
        <div v-else class="flex flex-col gap-4">
          <CardsProjectCard
            v-for="repo in reposList"
            :key="repo.html_url"
            :repo="repo"
          />
        </div>
      </section>
    </main>

    <LayoutSectionNavSidebar
      :sections="tabs"
      :active-section="activeSection"
      @scroll-to="scrollToSection"
    />

    <div class="fixed right-4 bottom-6 z-50 lg:hidden">
      <button
        type="button"
        class="flex items-center gap-2 px-4 py-3 rounded-2xl bg-teal/20 border border-teal/30 text-muted-pale hover:bg-teal/30 shadow-lg font-medium text-sm"
        aria-label="Jump to section"
        :aria-expanded="panelOpen"
        @click="panelOpen = !panelOpen"
      >
        <AppIcon name="menu" class="w-5 h-5 shrink-0" />
        <span>Jump to section</span>
      </button>
    </div>

    <Transition name="panel-right">
      <div
        v-show="panelOpen"
        class="fixed inset-0 z-50 lg:hidden"
        :aria-hidden="!panelOpen"
      >
        <div class="absolute inset-0 bg-bg/80 backdrop-blur-sm" @click="panelOpen = false" />
        <div
          class="mobile-nav-panel absolute top-0 right-0 bottom-0 w-[min(100vw-2rem,18rem)] pr-[env(safe-area-inset-right)] border-l border-teal/20 bg-bg-card/95 backdrop-blur-sm overflow-auto"
          @click.stop
        >
          <div class="nav-panel-card font-sans rounded-none border-0 h-full flex flex-col">
            <nav class="flex flex-col flex-1 p-4 gap-0.5" aria-label="Sections">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  type="button"
                  :class="['section-tab', activeSection === tab.id ? 'section-tab--active' : 'section-tab--inactive']"
                  :aria-current="activeSection === tab.id ? 'true' : undefined"
                  @click="scrollToSection(tab.id); panelOpen = false"
                >
                  {{ tab.label }}
                </button>
            </nav>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import homeData from '~/data/content/home.json'
import { experienceEntries } from '~/data/experience'
import { volunteeringEntries } from '~/data/volunteering'

const home = homeData as {
  about?: { title?: string; paragraphs?: string[] }
  sectionTabs?: { id: string; label: string }[]
  experience?: { title?: string; commercialLabel?: string }
  volunteering?: { title?: string }
  projects?: { title?: string }
}

const tabs = computed(() => home?.sectionTabs ?? [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'volunteering', label: 'Volunteering' },
  { id: 'projects', label: 'Projects' }
])

const activeSection = ref('about')
const panelOpen = ref(false)
const scrollTargetId = ref<string | null>(null)

function scrollToSection(id: string) {
  activeSection.value = id
  scrollTargetId.value = id
  if (id === 'about') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  setTimeout(() => { scrollTargetId.value = null }, 1200)
}

let observer: IntersectionObserver | null = null
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (scrollTargetId.value) {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const id = e.target.id
          if (id === scrollTargetId.value && tabs.value.some(t => t.id === id)) {
            activeSection.value = id
          }
        }
        return
      }
      let topmost: { id: string; top: number } | null = null
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const id = e.target.id
        if (!tabs.value.some(t => t.id === id)) continue
        const top = e.boundingClientRect.top
        if (topmost === null || top < topmost.top) topmost = { id, top }
      }
      if (topmost) activeSection.value = topmost.id
    },
    { rootMargin: '-15% 0px -60% 0px', threshold: 0 }
  )
  nextTick(() => {
    tabs.value.forEach((tab) => {
      const el = document.getElementById(tab.id)
      if (el) observer?.observe(el)
    })
  })
})
onUnmounted(() => observer?.disconnect())

const { data: repos, pending } = useFetch<import('../types/repos').RepoMeta[]>('/api/repos', { key: 'repos' })
const reposList = computed(() => (Array.isArray(repos.value) ? repos.value : []))
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

.panel-right-enter-active,
.panel-right-leave-active {
  transition: opacity 0.2s ease;
}
.panel-right-enter-active .mobile-nav-panel,
.panel-right-leave-active .mobile-nav-panel {
  transition: transform 0.25s ease-out;
}
.panel-right-enter-from,
.panel-right-leave-to {
  opacity: 0;
}
.panel-right-enter-from .mobile-nav-panel,
.panel-right-leave-to .mobile-nav-panel {
  transform: translateX(100%);
}
</style>

<style>
.home-content-container {
  overflow: visible;
}
</style>
