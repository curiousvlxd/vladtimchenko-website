<template>
  <li
    class="group relative card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-6 hover:border-teal/30 transition-colors overflow-hidden"
    v-motion="motionItem"
  >
    <div class="block group">
      <NuxtLink
        :to="getPostLink(post._path)"
        class="block"
      >
        <h2 class="font-display text-xl font-semibold text-muted-pale group-hover:text-teal transition-colors">
          {{ post.title }}
        </h2>
        <p
          v-if="post.description"
          class="mt-2 text-sm text-muted-light line-clamp-2"
        >
          {{ post.description }}
        </p>
      </NuxtLink>
      <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
        <time :datetime="post.date">{{ formatBlogDate(post.date) }}</time>
        <span
          v-if="post.tags?.length"
          class="flex gap-2"
        >
          <NuxtLink
            v-for="tag in post.tags"
            :key="tag"
            :to="getTagLink(tag)"
            class="px-1.5 py-0.5 rounded bg-teal/15 text-teal-light hover:bg-teal/25 transition-colors"
          >
            {{ tag }}
          </NuxtLink>
        </span>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { motionItem } from '~/common/constants/ui/motion'

export interface FeedListPost {
  _path: string
  title?: string
  description?: string
  date?: string
  tags?: string[]
}

defineProps<{
  post: FeedListPost
  getPostLink: (path: string) => RouteLocationRaw
  getTagLink: (tag: string) => RouteLocationRaw
}>()
</script>
