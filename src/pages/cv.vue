<template>
  <DocumentSkeleton
    v-show="!cvReady"
    :sections="skeletonSections"
  />

  <div v-show="cvReady" class="cv-page mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
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
import CvDocument from '~/components/cv/CvDocument.vue'
import DocumentSkeleton from '~/components/ui/skeleton/DocumentSkeleton.vue'
import { useCvContent } from '~/composables/cv/useCvContent'
import { useCvPdfExport } from '~/composables/cv/useCvPdfExport'
import { CV_PAGE } from '~/constants/cv/cv'
import { CV_SKELETON } from '~/constants/ui/skeleton'

const {
  homeName,
  profileText,
  coreSkills,
  experienceEntries,
  educationEntries,
  volunteeringEntries
} = useCvContent()

const cvReady = ref(false)

const skeletonSections = [
  { id: 'profile', titleWidth: '4rem' },
  { id: 'skills', titleWidth: '6rem', lines: ['100%'] },
  {
    id: 'experience',
    titleWidth: '7rem',
    entryCount: CV_SKELETON.EXPERIENCE_ENTRY_COUNT
  }
]

const { pdfExporting, exportPdf } = useCvPdfExport(() => ({
  homeName,
  profileText,
  coreSkills,
  experienceEntries,
  educationEntries,
  volunteeringEntries
}))

onMounted(() => {
  nextTick(() => {
    cvReady.value = true
  })
})
</script>

