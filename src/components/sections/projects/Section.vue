<template>
  <section
    id="projects"
    data-section="projects"
    class="mb-12 scroll-mt-24 sm:scroll-mt-28"
  >
    <h2 class="font-display text-2xl font-semibold text-muted-pale mb-2">
      {{ title }}
    </h2>

    <p class="text-muted-light text-sm mb-6">
      {{ description }}
    </p>

    <div v-if="pending" class="flex flex-col gap-4">
      <div
        v-for="index in pendingCardIndexes"
        :key="`pending-repo-${index}`"
        class="rounded-2xl border border-teal/20 bg-bg-card h-28 animate-pulse"
      />
    </div>

    <div v-else class="flex flex-col gap-4">
      <SectionsProjectsCard
        v-for="repo in repos"
        :key="repo.html_url"
        :repo="repo"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { HOME_SECTION_COPY } from '~/constants/home/home-sections'
import type { RepoMeta } from '~/types/repos'

const PENDING_CARD_COUNT = 4
const pendingCardIndexes = Array.from(
  { length: PENDING_CARD_COUNT },
  (_, index) => index
)

withDefaults(
  defineProps<{
    title?: string
    description?: string
    repos?: RepoMeta[]
    pending?: boolean
  }>(),
  {
    title: 'Projects',
    description: HOME_SECTION_COPY.PROJECTS_DESCRIPTION,
    repos: () => [],
    pending: false
  }
)
</script>

