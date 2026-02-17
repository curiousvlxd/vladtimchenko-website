<template>
  <SectionsProjectsSection
    :title="title"
    :description="description"
    :repos="reposList"
    :pending="pending"
  />
</template>

<script setup lang="ts">
import type { RepoMeta } from '~/types/repos'

defineProps<{
  title?: string
  description?: string
}>()

const nuxtApp = useNuxtApp()
const { data: repos, pending } = useLazyFetch<RepoMeta[] | null>('/api/repos', {
  key: 'projects-repos',
  server: false,
  default: () => null,
  getCachedData: (key) => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
})

const reposList = computed(() => (Array.isArray(repos.value) ? repos.value : []))
</script>
