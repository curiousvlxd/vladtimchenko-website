<template>
  <div class="cv-page mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
    <div class="cv-actions no-print mb-6 flex flex-wrap items-center gap-3">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-muted-light hover:text-teal transition-colors">
        <AppIcon name="back" class="w-4 h-4" />
        {{ CV_PAGE.BACK_LABEL }}
      </NuxtLink>

      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal/20 text-teal hover:bg-teal/30 transition-colors text-sm font-medium disabled:opacity-60"
        :disabled="pdfExporting"
        @click="exportPdf"
      >
        <AppIcon v-if="!pdfExporting" name="download" class="w-4 h-4" />
        <span
          v-else
          class="size-4 shrink-0 inline-block rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden="true"
        />
        <span v-if="pdfExporting">{{ CV_PAGE.PDF_EXPORTING_LABEL }}</span>
        <span v-else>{{ CV_PAGE.PDF_EXPORT_LABEL }}</span>
      </button>
    </div>

    <CvDocument
      :home-name="homeName"
      :profile-text="profileText"
      :core-skills="coreSkills"
      :experience-entries="experienceEntries"
      :education-entries="educationEntries"
      :volunteering-entries="volunteeringEntries"
    />
  </div>
</template>

<script setup lang="ts">
import CvDocument from '~/features/cv/components/CvDocument.vue'
import { useCvContent } from '~/features/cv/composables/useCvContent'
import { useCvPdfExport } from '~/features/cv/composables/useCvPdfExport'
import { CV_PAGE } from '~/features/cv/constants'
import { SITE_NAME } from '~/common/constants/app/site'
import { getSocialImageUrl } from '~/utils/social-image'
import { requireSiteUrl } from '~/utils/site-url'

const {
  homeName,
  profileText,
  coreSkills,
  experienceEntries,
  educationEntries,
  volunteeringEntries
} = useCvContent()

const { pdfExporting, exportPdf } = useCvPdfExport(() => ({
  homeName,
  profileText,
  coreSkills,
  experienceEntries,
  educationEntries,
  volunteeringEntries
}))

const { public: { siteUrl } } = useRuntimeConfig()
const absoluteSiteUrl = requireSiteUrl(siteUrl)
const pageTitle = `CV - ${SITE_NAME}`
const pageDescription = 'Detailed CV of Vlad Timchenko: backend engineering, cloud-native .NET, production systems, and recent experience.'
const socialImage = getSocialImageUrl(siteUrl, {
  title: pageTitle,
  subtitle: pageDescription,
  section: 'CV',
  url: '/cv'
})

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: socialImage },
    { property: 'og:type', content: 'profile' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: socialImage }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: pageTitle,
        description: pageDescription,
        url: `${absoluteSiteUrl}/cv`,
        mainEntity: {
          '@type': 'Person',
          name: homeName.value || SITE_NAME
        }
      })
    }
  ]
})
</script>

