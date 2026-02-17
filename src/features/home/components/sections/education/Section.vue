<template>
  <section
    id="education"
    data-section="education"
    class="mb-12 scroll-mt-24 sm:scroll-mt-28"
  >
    <h2 class="font-display text-2xl font-semibold text-muted-pale mb-6">
      {{ title }}
    </h2>

    <div class="flex flex-col gap-6">
      <div
        v-for="entry in entries"
        :key="`${entry.school}-${entry.degree}`"
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
            @click="$emit('open-diploma', entry)"
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
</template>

<script setup lang="ts">
import type { EducationEntry } from '~/data/education'

defineEmits<{
  'open-diploma': [entry: EducationEntry]
}>()

withDefaults(
  defineProps<{
    title?: string
    entries?: EducationEntry[]
  }>(),
  {
    title: 'Education',
    entries: () => []
  }
)
</script>

