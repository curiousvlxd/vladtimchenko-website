<template>
  <div class="home-content-container flex gap-8 lg:gap-12 mx-auto max-w-6xl px-4 sm:px-6 pt-8 sm:pt-10 pb-[7rem] sm:pb-[7rem] lg:pb-12">
    <main id="home-top" class="min-w-0 flex-1 max-w-4xl">
      <BrandingHeroBannerCard class="mb-8 sm:mb-10" />

      <section
        :id="tabs[0]?.id || 'about'"
        :data-section="tabs[0]?.id || 'about'"
        class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-6 sm:p-8 mb-8 scroll-mt-24 sm:scroll-mt-28"
      >
        <h2
          class="font-display text-2xl font-semibold text-muted-pale mb-4"
        >
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
        :data-section="tabs[1]?.id || 'experience'"
        class="mb-12"
      >
        <h2
          :id="tabs[1]?.id || 'experience'"
          class="font-display text-2xl font-semibold text-muted-pale mb-2 scroll-mt-24 sm:scroll-mt-28"
        >
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
        :data-section="tabs[2]?.id || 'volunteering'"
        class="mb-12"
      >
        <h2
          :id="tabs[2]?.id || 'volunteering'"
          class="font-display text-2xl font-semibold text-muted-pale mb-6 scroll-mt-24 sm:scroll-mt-28"
        >
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
        :data-section="tabs[3]?.id || 'education'"
        class="mb-12"
      >
        <h2
          :id="tabs[3]?.id || 'education'"
          class="font-display text-2xl font-semibold text-muted-pale mb-6 scroll-mt-24 sm:scroll-mt-28"
        >
          {{ home?.education?.title ?? 'Education' }}
        </h2>
        <div class="flex flex-col gap-6">
          <div
            v-for="entry in educationEntries"
            :key="entry.school + entry.degree"
            class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-6 sm:p-8 transition-all duration-300 hover:border-teal/40 hover:shadow-[0_0_24px_rgba(24,183,164,0.15)]"
          >
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 class="font-display font-semibold text-lg text-muted-pale">
                  {{ entry.school }}
                </h3>
                <p class="mt-1 text-sm text-muted-light">
                  {{ entry.degree }}, {{ entry.field }}
                </p>
                <p class="mt-0.5 text-xs text-muted">
                  {{ entry.period }}
                </p>
              </div>
              <button
                type="button"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal/20 text-teal hover:bg-teal/30 transition-colors text-sm font-medium shrink-0"
                @click="openDiploma(entry)"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View diploma
              </button>
            </div>
          </div>
        </div>
      </section>

      <section :data-section="tabs[4]?.id || 'projects'">
        <h2
          :id="tabs[4]?.id || 'projects'"
          class="font-display text-2xl font-semibold text-muted-pale mb-2 scroll-mt-24 sm:scroll-mt-28"
        >
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

    <PdfModal
      v-model="diplomaModalOpen"
      :pdf-url="diplomaModalUrl"
      :title="diplomaModalTitle"
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
        © {{ new Date().getFullYear() }} {{ home?.name ?? 'Vlad Timchenko' }}
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import homeData from '../data/content/home.json'
import { educationEntries, type EducationEntry } from '../data/education'
import { experienceEntries } from '../data/experience'
import { volunteeringEntries } from '../data/volunteering'

const home = homeData as {
  name?: string
  title?: string
  about?: { title?: string; paragraphs?: string[] }
  sectionTabs?: { id: string; label: string }[]
  experience?: { title?: string; commercialLabel?: string }
  volunteering?: { title?: string }
  education?: { title?: string }
  projects?: { title?: string }
}

const diplomaModalOpen = ref(false)
const diplomaModalUrl = ref('')
const diplomaModalTitle = ref('Diploma')

function openDiploma (entry: EducationEntry) {
  diplomaModalUrl.value = entry.diplomaUrl
  diplomaModalTitle.value = `${entry.school} · Diploma`
  nextTick(() => {
    diplomaModalOpen.value = true
  })
}

const tabs = computed(() => home?.sectionTabs ?? [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'volunteering', label: 'Volunteering' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' }
])

const firstTabId = computed(() => tabs.value[0]?.id ?? 'about')
const activeSection = ref('about')
const scrollTargetId = ref<string | null>(null)

function scrollToSection(id: string) {
  activeSection.value = id
  scrollTargetId.value = id
  if (id === firstTabId.value) {
    window.scrollTo(0, 0)
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  setTimeout(() => { scrollTargetId.value = null }, 1200)
}

const viewportTopOffset = 140

function updateActiveSection() {
  if (scrollTargetId.value) return
  const lastTab = tabs.value[tabs.value.length - 1]
  if (import.meta.client && typeof window !== 'undefined' && lastTab) {
    const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80
    if (nearBottom) {
      activeSection.value = lastTab.id
      return
    }
  }
  const sectionEls = document.querySelectorAll<HTMLElement>('[data-section]')
  const tabIds = new Set(tabs.value.map((t) => t.id))
  let activeId = firstTabId.value
  for (const el of sectionEls) {
    const id = el.getAttribute('data-section')
    if (!id || !tabIds.has(id)) continue
    const top = el.getBoundingClientRect().top
    if (top <= viewportTopOffset) activeId = id
  }
  activeSection.value = activeId
}

let observer: IntersectionObserver | null = null
onMounted(() => {
  activeSection.value = firstTabId.value
  window.scrollTo(0, 0)
  observer = new IntersectionObserver(
    (entries) => {
      if (scrollTargetId.value) {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const id = (e.target as HTMLElement).getAttribute('data-section')
          if (id === scrollTargetId.value && tabs.value.some((t) => t.id === id)) {
            activeSection.value = id
          }
        }
        return
      }
      updateActiveSection()
    },
    { rootMargin: '0px 0px -50% 0px', threshold: 0 }
  )
  nextTick(() => {
    document.querySelectorAll('[data-section]').forEach((el) => {
      observer?.observe(el)
    })
  })
  if (import.meta.client) {
    window.addEventListener('scroll', updateActiveSection, { passive: true })
  }
})
onUnmounted(() => {
  observer?.disconnect()
  if (import.meta.client) window.removeEventListener('scroll', updateActiveSection)
})

const { data: repos, pending } = useFetch<import('../types/repos').RepoMeta[]>('/api/repos', { key: 'repos' })
const reposList = computed(() => (Array.isArray(repos.value) ? repos.value : []))
</script>

<style>
.home-content-container {
  overflow: visible;
}
</style>
