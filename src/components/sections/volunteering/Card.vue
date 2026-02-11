<template>
  <article 
    class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] overflow-hidden hover:border-teal/30 transition-colors"
    v-motion="motionItem"
  >
    <div class="p-6 sm:p-8">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 class="font-display font-semibold text-xl text-muted-pale">
            {{ entry.organization }}
          </h3>
          <p class="mt-0.5 text-teal font-medium">
            {{ entry.role }}
          </p>
        </div>
        <div class="text-right text-sm text-muted">
          <p>
            {{ formatVolunteeringPeriod(entry.start, entry.end) }}
          </p>
          <p class="mt-0.5">{{ entry.location }}</p>
        </div>
      </div>
      <p class="mt-4 text-muted-light text-sm leading-relaxed">
        {{ entry.description }}
      </p>
      <div class="mt-5">
        <h4 class="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Highlights</h4>
        <ul class="space-y-1.5 text-sm text-muted-light">
          <li v-for="(item, i) in entry.highlights" :key="i" class="flex gap-2">
            <span class="text-teal shrink-0">•</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
      <div class="mt-5 flex flex-wrap gap-2">
        <span
          v-for="tag in entry.tags"
          :key="tag"
          class="px-2.5 py-1 rounded-lg bg-bg-card border border-teal/20 text-muted-light text-xs font-mono"
        >
          {{ tag }}
        </span>
      </div>
      <a
        v-if="entry.link"
        :href="entry.link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-5 inline-flex items-center gap-2 rounded-lg border border-teal/20 bg-teal/5 px-3 py-2 text-sm font-medium text-teal-light hover:bg-teal/15 hover:border-teal/30 transition-colors"
      >
        <AppIcon name="linkedin" class="w-4 h-4" />
        {{ entry.link.label || 'Post' }}
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
import { motionItem } from '~/constants/ui/motion'
import {
  formatVolunteeringPeriod,
  type VolunteeringEntry
} from '~/data/volunteering'

defineProps<{ entry: VolunteeringEntry }>()
</script>

