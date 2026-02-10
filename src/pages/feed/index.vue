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
      <NuxtLink :to="clearTagLink" class="text-sm text-muted-light hover:text-teal transition-colors">× clear</NuxtLink>
    </div>
    <div v-if="pending" class="space-y-6">
      <div v-for="i in 5" :key="i" class="rounded-2xl border border-teal/20 bg-bg-card p-6 animate-pulse">
        <div class="h-6 w-3/4 rounded bg-teal/20 mb-3" />
        <div class="h-4 w-full rounded bg-teal/10 mb-2" />
        <div class="h-4 w-1/2 rounded bg-teal/10 mb-3" />
        <div class="h-3 w-24 rounded bg-teal/10" />
      </div>
    </div>
    <ul v-else class="space-y-6">
      <li
        v-for="post in posts"
        :key="post._path"
        class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-6 hover:border-teal/30 transition-colors overflow-hidden"
        v-motion="motionItem"
      >
        <div class="block group">
          <NuxtLink :to="getPostLink(post._path)" class="block">
            <h2 class="font-display text-xl font-semibold text-muted-pale group-hover:text-teal transition-colors">
              {{ post.title }}
            </h2>
            <p v-if="post.description" class="mt-2 text-sm text-muted-light line-clamp-2">
              {{ post.description }}
            </p>
          </NuxtLink>
          <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
            <time :datetime="post.date">{{ formatBlogDate(post.date) }}</time>
            <span v-if="post.tags?.length" class="flex gap-2">
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
    </ul>
    <p v-if="!pending && posts.length === 0" class="text-muted-light">
      {{ searchQuery || currentTag ? 'No posts match.' : 'No posts yet.' }}
    </p>
  </div>
</template>

<script setup lang="ts">
const motionItem = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
}

const route = useRoute()

const { data: raw, pending } = await useAsyncData('feed-list', () =>
  queryContent('/feed').sort({ date: -1 }).only(['title', 'description', 'date', 'tags', '_path']).find()
)

interface BlogPost {
  _path: string
  title?: string
  description?: string
  date?: string
  tags?: string[]
}

const searchQuery = ref('')

const currentTag = computed(() => {
  const tag = route.query.tag
  return typeof tag === 'string' ? tag : null
})

const clearTagLink = computed(() => {
  const q = { ...route.query }
  delete q.tag
  delete q.giscus
  return { path: '/feed', query: q }
})

function getPostLink(path: string) {
  const query = { ...route.query }
  delete query.giscus
  return { path, query }
}

function getTagLink(tag: string) {
  const query = { ...route.query }
  delete query.giscus
  return { path: '/feed', query: { ...query, tag } }
}

const allPosts = computed<BlogPost[]>(() => (raw.value ?? []) as BlogPost[])

const posts = computed<BlogPost[]>(() => {
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
  title: 'Feed · Vlad Timchenko',
  meta: [
    { name: 'description', content: 'Notes and articles on software engineering, cloud-native .NET, and building production systems.' },
    { property: 'og:title', content: 'Feed · Vlad Timchenko' },
    { property: 'og:description', content: 'Notes and articles on software engineering, cloud-native .NET, and building production systems.' },
    { name: 'twitter:title', content: 'Feed · Vlad Timchenko' },
    { name: 'twitter:description', content: 'Notes and articles on software engineering, cloud-native .NET, and building production systems.' }
  ]
})

onMounted(() => {
  if (import.meta.client) window.scrollTo(0, 0)
})
</script>
