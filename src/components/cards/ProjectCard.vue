<template>
  <article
    class="card-gradient-animated group relative rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-6 transition-all duration-300 hover:border-teal/40 hover:shadow-[0_0_24px_rgba(24,183,164,0.15)] hover:scale-[1.02]"
    v-motion="motionItem"
  >
    <h3 class="font-display font-semibold text-lg text-muted-pale">
      {{ repo.name }}
    </h3>
    <p v-if="repo.description" class="mt-2 text-sm text-muted-light">
      {{ repo.description }}
    </p>
    <div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
      <span class="flex items-center gap-1">
        <span aria-hidden>★</span> {{ repo.stargazers_count }}
      </span>
      <span class="flex items-center gap-1">
        <span aria-hidden>⎇</span> {{ repo.forks_count }}
      </span>
      <span>{{ formatDate(repo.updated_at) }}</span>
    </div>
    <div v-if="repo.language || repo.topics?.length" class="mt-3 flex flex-wrap gap-2">
      <span
        v-if="repo.language"
        class="px-2 py-0.5 rounded-md bg-teal/15 text-teal-light text-xs font-mono"
      >
        {{ repo.language }}
      </span>
      <span
        v-for="t in (repo.topics || []).slice(0, 5)"
        :key="t"
        class="px-2 py-0.5 rounded-md bg-bg-card border border-teal/20 text-muted-light text-xs"
      >
        {{ t }}
      </span>
    </div>
    <div class="mt-5 flex gap-3">
      <a
        :href="repo.html_url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal/15 text-teal-light text-sm font-medium hover:bg-teal/25 transition-colors"
      >
        GitHub
      </a>
      <a
        v-if="repo.homepage"
        :href="repo.homepage"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal/30 text-teal text-sm hover:bg-teal/10 transition-colors"
      >
        Live
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { RepoMeta } from '../../types/repos'

defineProps<{ repo: RepoMeta }>()

const motionItem = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0 },
  transition: { duration: 0.35 }
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}
</script>
