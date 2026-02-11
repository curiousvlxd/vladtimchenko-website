<template>
  <header class="mb-8">
    <h1 class="font-display text-3xl sm:text-4xl font-bold text-muted-pale">
      {{ title }}
    </h1>
    <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
      <time :datetime="date">{{ formatBlogDate(date, { month: 'long' }) }}</time>
      <span v-if="readingTimeText">- {{ readingTimeText }}</span>
      <span
        v-if="tags?.length"
        class="flex gap-2"
      >
        <NuxtLink
          v-for="tag in tags"
          :key="tag"
          :to="getTagLink(tag)"
          class="px-1.5 py-0.5 rounded bg-teal/15 text-teal-light hover:bg-teal/25"
        >
          {{ tag }}
        </NuxtLink>
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title: string
  date: string
  tags?: string[]
  readingTimeText?: string | null
  getTagLink: (tag: string) => RouteLocationRaw
}>()
</script>
