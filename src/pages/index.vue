<template>
  <div class="home-content-container flex gap-8 lg:gap-12 mx-auto max-w-6xl px-4 sm:px-6 pt-8 sm:pt-10 pb-[7rem] sm:pb-[7rem] lg:pb-12">
    <HomeMainSkeleton v-show="!homeReady" class="min-w-0 flex-1 max-w-4xl" />
    <HomeMain v-show="homeReady" :open-diploma="openDiploma" @mounted="homeReady = true" />

    <LayoutSectionNavSidebar
      :sections="tabs"
      :active-section="activeSection"
      :first-section-id="firstTabId"
      @scroll-to="scrollToSection"
    />

    <PdfModal
      v-model="isDiplomaOpen"
      :pdf-url="diploma.pdfUrl"
      :title="diploma.title"
    />

    <footer class="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-white/5 bg-bg/40 backdrop-blur-xl flex flex-col">
      <div class="mx-auto w-full max-w-6xl px-2 pt-2">
        <LayoutSectionNavTabs
          layout="horizontal"
          :sections="tabs"
          :active-section="activeSection"
          :first-section-id="firstTabId"
          @scroll-to="scrollToSection"
        />
      </div>
      <div class="mt-2.5 pt-2 border-t border-white/[0.06] px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <p class="text-center text-sm text-muted flex flex-wrap items-center justify-center gap-x-2 gap-y-1 py-0.5">
          <span>© {{ new Date().getFullYear() }} {{ home?.name ?? SITE_NAME }}</span>
          <span aria-hidden="true" class="text-muted/60">·</span>
          <a
            :href="siteRepo?.url || siteRepoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-muted-light hover:text-teal transition-colors"
          >
            <span aria-hidden="true">★</span>
            <span v-if="siteRepo && siteRepo.stars >= 0">{{ siteRepo.stars }}</span>
            <span v-if="siteRepo">·</span>
            <span>View source on GitHub</span>
          </a>
          <span aria-hidden="true" class="text-muted/60">·</span>
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-muted-light hover:text-teal transition-colors"
            title="RSS feed"
          >
            <AppIcon name="rss" class="w-4 h-4 text-teal/80" />
            <span>RSS</span>
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import homeData from '~/data/content/home.json'
import PdfModal from '~/components/modals/pdf/PdfModal.vue'
import { SITE_NAME } from '~/constants/app/site'
import { useDiplomaModal } from '~/composables/modals/useDiplomaModal'
import { useSectionNav } from '~/composables/navigation/useSectionNav'

const homeReady = ref(false)
const home = homeData as { name?: string; sectionTabs?: { id: string; label: string }[] }

const tabs = computed(() => home?.sectionTabs ?? [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'volunteering', label: 'Volunteering' },
  { id: 'education', label: 'Education' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'projects', label: 'Projects' }
])

const { activeSection, firstTabId, scrollToSection } = useSectionNav(tabs)
const diploma = useDiplomaModal()
const openDiploma = diploma.openDiploma
const isDiplomaOpen = computed({
  get: () => diploma.open.value,
  set: (value: boolean) => {
    diploma.open.value = value
  }
})

const nuxtApp = useNuxtApp()
const { public: { siteRepoUrl } } = useRuntimeConfig()
const { data: siteRepo } = await useFetch<{ stars: number; url: string }>('/api/site-repo', {
  key: 'site-repo',
  getCachedData: (key) => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
})
</script>

<style>
.home-content-container {
  overflow: visible;
}
</style>

