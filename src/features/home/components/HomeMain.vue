<template>
  <main id="home-top" class="min-w-0 flex-1 max-w-4xl">
    <BrandingHeroBannerCard class="mb-8 sm:mb-10" />

    <SectionsAboutSection
      :title="home.about?.title"
      :paragraphs="home.about?.paragraphs"
    />

    <LazyExperienceSection
      :hydrate-on-visible="{ rootMargin: '280px' }"
      :title="home.experience?.title"
      :entries="experienceEntries"
    />

    <LazyVolunteeringSection
      :hydrate-on-visible="{ rootMargin: '240px' }"
      :title="home.volunteering?.title"
      :entries="volunteeringEntries"
    />

    <LazyEducationSection
      :hydrate-on-visible="{ rootMargin: '220px' }"
      :title="home.education?.title"
      :entries="educationEntries"
      @open-diploma="props.openDiploma"
    />

    <LazyTestimonialsSection
      :hydrate-on-visible="{ rootMargin: '220px' }"
      :title="home.testimonials?.title"
      :description="home.testimonials?.description"
    />

    <LazyProjectsSection
      :hydrate-on-visible="{ rootMargin: '220px' }"
      :title="home.projects?.title"
      :description="home.projects?.description"
    />

    <LazyContactSection
      :hydrate-on-visible="{ rootMargin: '180px' }"
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

const LazyExperienceSection = defineLazyHydrationComponent(
  'visible',
  () => import('~/features/home/components/sections/experience/Section.vue')
)
const LazyVolunteeringSection = defineLazyHydrationComponent(
  'visible',
  () => import('~/features/home/components/sections/volunteering/Section.vue')
)
const LazyEducationSection = defineLazyHydrationComponent(
  'visible',
  () => import('~/features/home/components/sections/education/Section.vue')
)
const LazyTestimonialsSection = defineLazyHydrationComponent(
  'visible',
  () => import('~/features/testimonials/components/sections/testimonials/Section.vue')
)
const LazyProjectsSection = defineLazyHydrationComponent(
  'visible',
  () => import('~/features/home/components/sections/projects/DeferredSection.vue')
)
const LazyContactSection = defineLazyHydrationComponent(
  'visible',
  () => import('~/features/contact/components/sections/contact/Section.vue')
)
</script>
