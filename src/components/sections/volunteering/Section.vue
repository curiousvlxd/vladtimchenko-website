<template>
  <section
    id="volunteering"
    data-section="volunteering"
    class="mb-12 scroll-mt-24 sm:scroll-mt-28"
  >
    <h2 class="font-display text-2xl font-semibold text-muted-pale mb-6">
      {{ title }}
    </h2>

    <div class="flex flex-col gap-6">
      <SectionsVolunteeringCard
        v-for="entry in entries"
        :key="`${entry.organization}-${entry.role}`"
        :entry="entry"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { VolunteeringEntry } from '~/data/volunteering'

withDefaults(
  defineProps<{
    title?: string
    entries?: VolunteeringEntry[]
  }>(),
  {
    title: 'Volunteering',
    entries: () => []
  }
)
</script>
