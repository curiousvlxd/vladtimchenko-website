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

    <footer class="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-teal/10 bg-bg-card flex flex-col">
      <div class="mx-auto w-full max-w-6xl px-2 pt-2">
        <LayoutSectionNavTabs
          layout="horizontal"
          :sections="tabs"
          :active-section="activeSection"
          @scroll-to="scrollToSection"
        />
      </div>
      <p class="text-center text-sm text-muted py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        © {{ new Date().getFullYear() }} Vlad Timchenko
      </p>
    </footer>
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

<style>
.home-content-container {
  overflow: visible;
}
</style>
