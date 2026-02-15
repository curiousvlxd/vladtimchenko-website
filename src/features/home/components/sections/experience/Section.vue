<template>
  <section
    id="experience"
    data-section="experience"
    class="mb-12 scroll-mt-24 sm:scroll-mt-28"
  >
    <h2 class="font-display text-2xl font-semibold text-muted-pale mb-3">
      {{ title }}
    </h2>

    <div class="flex flex-wrap items-center gap-3 mb-6">
      <div
        class="inline-flex flex-col rounded-2xl border border-teal/30 bg-gradient-to-br from-teal/15 to-teal/5 px-6 py-4 shadow-[0_0_0_1px_rgba(24,183,164,0.08),0_4px_12px_-2px_rgba(0,0,0,0.2)]"
        v-motion="motionItem"
      >
        <span class="font-display text-lg font-semibold tracking-tight text-teal">
          {{ totalExperienceDisplay }}
        </span>
      </div>

      <div
        class="inline-flex flex-col rounded-2xl border border-teal/30 bg-gradient-to-br from-teal/15 to-teal/5 px-6 py-4 shadow-[0_0_0_1px_rgba(24,183,164,0.08),0_4px_12px_-2px_rgba(0,0,0,0.2)]"
        v-motion="motionItem"
      >
        <span class="text-xs font-medium uppercase tracking-wider text-teal mb-0.5">
          Domains
        </span>
        <span class="text-sm text-muted-light">
          {{ EXPERIENCE_DOMAINS.join(', ') }}
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-6">
      <SectionsExperienceCard
        v-for="entry in entries"
        :key="`${entry.company}-${entry.role}`"
        :entry="entry"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { motionItem } from '~/common/constants/ui/motion'
import {
  EXPERIENCE_DOMAINS,
  getTotalExperienceDisplay,
  type ExperienceEntry
} from '~/data/experience'

const props = withDefaults(
  defineProps<{
    title?: string
    entries?: ExperienceEntry[]
  }>(),
  {
    title: 'Experience',
    entries: () => []
  }
)

const totalExperienceDisplay = computed(() =>
  getTotalExperienceDisplay(props.entries)
)
</script>

