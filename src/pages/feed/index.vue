<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6 py-12">
    <div class="mb-6">
      <h1 class="font-display text-3xl font-bold text-muted-pale mb-1">
        Feed
      </h1>
      <p class="text-muted-light">
        Notes and articles.
      </p>
    </div>

    <div class="mb-6">
      <label for="feed-search" class="sr-only">Search by title or tag</label>
      <input
        id="feed-search"
        v-model="searchQuery"
        type="search"
        placeholder="Search by title or tag..."
        class="w-full max-w-md px-4 py-2.5 rounded-xl border border-teal/20 bg-bg-card text-muted-pale placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal/30"
        autocomplete="off"
      />
    </div>

    <div v-if="currentTag" class="mb-6 flex flex-wrap items-center gap-2">
      <span class="text-sm text-muted">Tag:</span>
      <span class="px-2 py-1 rounded bg-teal/20 text-teal text-sm font-medium">{{ currentTag }}</span>
      <NuxtLink :to="clearTagLink" class="text-sm text-muted-light hover:text-teal transition-colors">
        x clear
      </NuxtLink>
    </div>

    <FeedListSkeleton v-if="pending" />

    <ul v-else class="space-y-6">
      <FeedListItem
        v-for="post in posts"
        :key="post._path"
        :post="post"
        :get-post-link="getPostLink"
        :get-tag-link="getTagLink"
      />
    </ul>

    <p v-if="!pending && posts.length === 0" class="text-muted-light">
      {{ searchQuery || currentTag ? 'No posts match.' : 'No posts yet.' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import FeedListItem, { type FeedListPost } from '~/components/feed/FeedListItem.vue'
import FeedListSkeleton from '~/components/feed/FeedListSkeleton.vue'
import { FEED } from '~/constants/feed/feed'
import {
  FEED_META_DESCRIPTION,
  FEED_META_TITLE
} from '~/constants/app/site'
import { omitQueryParam } from '~/utils/route-query'
import { getSocialImageUrl } from '~/utils/social-image'

const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()
const feedSocialImage = getSocialImageUrl(siteUrl, {
  title: FEED_META_TITLE,
  subtitle: FEED_META_DESCRIPTION,
  section: 'Feed'
})

const { data: raw, pending } = await useAsyncData('feed-list', () =>
  queryContent('/feed').sort({ date: -1 }).only(['title', 'description', 'date', 'tags', '_path']).find()
)

const searchQuery = ref('')

const currentTag = computed(() => {
  const tag = route.query.tag
  return typeof tag === 'string' ? tag : null
})

const clearTagLink = computed(() => {
  const q = omitQueryParam(route.query, FEED.QUERY_PARAM_GISCUS)
  delete q.tag
  return { path: '/feed', query: q }
})

function getPostLink(path: string) {
  const query = omitQueryParam(route.query, FEED.QUERY_PARAM_GISCUS)
  return { path, query }
}

function getTagLink(tag: string) {
  const query = omitQueryParam(route.query, FEED.QUERY_PARAM_GISCUS)
  return { path: '/feed', query: { ...query, tag } }
}

const allPosts = computed<FeedListPost[]>(() => (raw.value ?? []) as FeedListPost[])

const posts = computed<FeedListPost[]>(() => {
  let list = allPosts.value
  const tag = currentTag.value
  if (tag) list = list.filter((p) => p.tags?.includes(tag))

  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return list

  return list.filter((p) => {
    const titleMatch = p.title?.toLowerCase().includes(q)
    const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q))
    return titleMatch || tagMatch
  })
})

useHead({
  title: FEED_META_TITLE,
  meta: [
    { name: 'description', content: FEED_META_DESCRIPTION },
    { property: 'og:title', content: FEED_META_TITLE },
    { property: 'og:description', content: FEED_META_DESCRIPTION },
    { property: 'og:image', content: feedSocialImage },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: FEED_META_TITLE },
    { name: 'twitter:description', content: FEED_META_DESCRIPTION },
    { name: 'twitter:image', content: feedSocialImage }
  ]
})

onMounted(() => {
  if (import.meta.client) window.scrollTo(0, 0)
})
</script>
