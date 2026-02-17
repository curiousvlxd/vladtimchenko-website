<template>
  <article
    class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] overflow-hidden hover:border-teal/30 transition-colors"
  >
    <div class="p-6 sm:p-8">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <div class="flex items-center gap-3">
          <div>
            <h3 class="font-display font-semibold text-xl text-muted-pale">
              {{ entry.company }}
            </h3>
            <p class="mt-0.5 text-teal font-medium">
              {{ entry.role }}
            </p>
          </div>
          <a
            v-if="entry.link"
            :href="entry.link.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="entry.link.label || 'Open link'"
            class="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-teal/15 text-muted-pale hover:bg-teal/25 hover:text-teal transition-colors"
          >
            <AppIcon name="linkedin" class="w-5 h-5" />
          </a>
        </div>
        <div class="text-right text-sm text-muted">
          <p>{{ formatPeriod(entry.start, entry.end) }}</p>
          <p class="mt-0.5">{{ entry.location }}</p>
        </div>
      </div>
      <p class="mt-4 text-muted-light text-sm leading-relaxed">
        {{ entry.roleDescription }}
      </p>
      <div class="mt-5">
        <h4 class="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Highlights</h4>
        <ul class="space-y-1.5 text-sm text-muted-light">
          <li v-for="(item, i) in entry.highlights" :key="i" class="flex gap-2">
            <span class="text-teal shrink-0">&bull;</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
      <div class="mt-5 flex flex-wrap gap-2">
        <span
          v-for="tech in entry.techStack"
          :key="tech"
          class="px-2.5 py-1 rounded-lg bg-bg-card border border-teal/20 text-muted-light text-xs font-mono"
        >
          {{ tech }}
        </span>
      </div>
      <div v-if="entry.impact?.length" class="mt-5 pt-5 border-t border-teal/10">
        <h4 class="text-xs font-semibold text-teal uppercase tracking-wider mb-2">Impact</h4>
        <ul class="space-y-1.5 text-sm text-muted-light">
          <li v-for="(item, i) in entry.impact" :key="i" class="flex gap-2">
            <span class="text-teal shrink-0">&bull;</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { formatPeriod, type ExperienceEntry } from '~/data/experience'

defineProps<{ entry: ExperienceEntry }>()
</script>
