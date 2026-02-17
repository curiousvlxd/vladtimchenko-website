<template>
  <div class="home-content-container flex gap-8 lg:gap-12 mx-auto max-w-6xl px-4 sm:px-6 pt-8 sm:pt-10 pb-[7rem] sm:pb-[7rem] lg:pb-12">
    <HomeMain :open-diploma="openDiploma" />

    <LayoutSectionNavSidebar
      :sections="tabs"
      :active-section="activeSection"
      :first-section-id="firstTabId"
      @scroll-to="scrollToSection"
    />

    <PdfModal
      v-if="isDiplomaOpen"
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
          <span>&copy; {{ new Date().getFullYear() }} {{ home?.name ?? SITE_NAME }}</span>
          <span aria-hidden="true" class="text-muted/60">&middot;</span>
          <a
            :href="siteRepo?.url || siteRepoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-muted-light hover:text-teal transition-colors"
          >
            <span aria-hidden="true">&#9733;</span>
            <span v-if="siteRepo && siteRepo.stars >= 0">{{ siteRepo.stars }}</span>
            <span v-if="siteRepo">&middot;</span>
            <span>View source on GitHub</span>
          </a>
          <span aria-hidden="true" class="text-muted/60">&middot;</span>
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
import { PUBLIC_ASSETS } from '~/common/constants/app/public-assets'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from '~/common/constants/app/site'
import { useDiplomaModal } from '~/features/modals/composables/useDiplomaModal'
import { useSectionNav } from '~/features/navigation/composables/useSectionNav'
import { getSocialImageUrl } from '~/utils/social-image'

const PdfModal = defineAsyncComponent(
  () => import('~/features/modals/components/pdf/PdfModal.vue')
)

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

const { public: { siteRepoUrl, siteUrl } } = useRuntimeConfig()
const socialImage = getSocialImageUrl(siteUrl, {
  title: SITE_TITLE,
  subtitle: SITE_DESCRIPTION,
  section: 'Home'
})
const heroImageSrcSet = `${PUBLIC_ASSETS.PHOTO_WEBP_360} 360w, ${PUBLIC_ASSETS.PHOTO_WEBP_560} 560w`
const heroImageSizes = '(max-width: 640px) 144px, 176px'

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: PUBLIC_ASSETS.PHOTO_WEBP_560,
      type: 'image/webp',
      fetchpriority: 'high',
      imagesrcset: heroImageSrcSet,
      imagesizes: heroImageSizes
    }
  ],
  meta: [
    { property: 'og:image', content: socialImage },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: socialImage }
  ]
})

const siteRepo = ref<{ stars: number; url: string } | null>(null)

let siteRepoLoaded = false
let siteRepoIdleTimer: ReturnType<typeof setTimeout> | null = null
const siteRepoInteractionEvents: Array<keyof WindowEventMap> = [
  'pointerdown',
  'keydown',
  'touchstart'
]

async function loadSiteRepo() {
  if (siteRepoLoaded) return
  siteRepoLoaded = true
  if (siteRepoIdleTimer) {
    clearTimeout(siteRepoIdleTimer)
    siteRepoIdleTimer = null
  }
  siteRepoInteractionEvents.forEach((eventName) => {
    window.removeEventListener(eventName, loadSiteRepo)
  })

  try {
    siteRepo.value = await $fetch<{ stars: number; url: string }>('/api/site-repo')
  } catch {
    siteRepo.value = null
  }
}

onMounted(() => {
  siteRepoInteractionEvents.forEach((eventName) => {
    window.addEventListener(eventName, loadSiteRepo, { once: true, passive: true })
  })

  siteRepoIdleTimer = setTimeout(() => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        void loadSiteRepo()
      }, { timeout: 1500 })
      return
    }

    void loadSiteRepo()
  }, 2600)
})

onUnmounted(() => {
  if (siteRepoIdleTimer) {
    clearTimeout(siteRepoIdleTimer)
    siteRepoIdleTimer = null
  }

  siteRepoInteractionEvents.forEach((eventName) => {
    window.removeEventListener(eventName, loadSiteRepo)
  })
})
</script>

<style>
.home-content-container {
  overflow: visible;
}
</style>
