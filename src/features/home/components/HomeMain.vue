<template>
  <main id="home-top" class="min-w-0 flex-1 max-w-4xl">
    <BrandingHeroBannerCard class="mb-8 sm:mb-10" />

    <SectionsAboutSection
      :title="home.about?.title"
      :paragraphs="home.about?.paragraphs"
    />

    <SectionsExperienceSection
      :title="home.experience?.title"
      :entries="experienceEntries"
    />

    <SectionsVolunteeringSection
      :title="home.volunteering?.title"
      :entries="volunteeringEntries"
    />

    <SectionsEducationSection
      :title="home.education?.title"
      :entries="educationEntries"
      @open-diploma="props.openDiploma"
    />

    <SectionsTestimonialsSection
      :title="home.testimonials?.title"
      :description="home.testimonials?.description"
    />

    <SectionsProjectsSection
      :title="home.projects?.title"
      :description="home.projects?.description"
      :repos="reposList"
      :pending="pending"
    />

    <SectionsContactSection
      :title="home.contact?.title"
      :description="home.contact?.description"
    />
  </main>
</template>

<script setup lang="ts">
import BrandingHeroBannerCard from '~/features/home/components/sections/about/HeroBannerCard.vue'
import homeData from '~/data/content/home.json'
import { educationEntries, type EducationEntry } from '~/data/education'
import { experienceEntries } from '~/data/experience'
import { volunteeringEntries } from '~/data/volunteering'
import type { RepoMeta } from '~/types/repos'

const props = defineProps<{
  openDiploma: (entry: EducationEntry) => void
}>()

const home = homeData as {
  about?: { title?: string; paragraphs?: string[] }
  experience?: { title?: string }
  volunteering?: { title?: string }
  education?: { title?: string }
  testimonials?: { title?: string; description?: string }
  projects?: { title?: string; description?: string }
  contact?: { title?: string; description?: string }
}

const nuxtApp = useNuxtApp()
const { data: repos, pending } = useLazyFetch<RepoMeta[]>('/api/repos', {
  key: 'repos',
  default: () => [],
  getCachedData: (key) => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
})

const reposList = computed(() => (Array.isArray(repos.value) ? repos.value : []))

const emit = defineEmits<{
  mounted: []
}>()

onMounted(() => {
  nextTick(() => {
    emit('mounted')
  })
})
</script>
