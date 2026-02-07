<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6 py-12">
    <h1 class="font-display text-3xl font-bold text-muted-pale mb-2">
      Projects
    </h1>
    <p class="text-muted-light mb-10">
      Featured open-source and side projects.
    </p>
    <div v-if="pending" class="flex flex-col gap-4">
      <div v-for="i in 6" :key="i" class="rounded-2xl border border-teal/20 bg-bg-card h-24 animate-pulse" />
    </div>
    <div v-else class="flex flex-col gap-4">
      <CardsProjectCard v-for="repo in reposList" :key="repo.html_url" :repo="repo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RepoMeta } from '../types/repos'

useHead({
  title: 'Projects · Vlad Timchenko',
  meta: [
    { name: 'description', content: 'Featured open-source and side projects.' },
    { property: 'og:title', content: 'Projects · Vlad Timchenko' },
    { property: 'og:description', content: 'Featured open-source and side projects.' },
    { name: 'twitter:title', content: 'Projects · Vlad Timchenko' },
    { name: 'twitter:description', content: 'Featured open-source and side projects.' }
  ]
})

const { data: repos, pending } = useFetch<RepoMeta[]>('/api/repos', { key: 'repos' })
const reposList = computed(() => Array.isArray(repos.value) ? repos.value : [])
</script>
