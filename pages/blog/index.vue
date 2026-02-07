<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6 py-12">
    <h1 class="font-display text-3xl font-bold text-muted-pale mb-2">
      Feed
    </h1>
    <p class="text-muted-light mb-10">
      Notes and articles.
    </p>
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
      <NuxtLink to="/blog" class="text-sm text-muted-light hover:text-teal transition-colors">× clear</NuxtLink>
    </div>
    <ul class="space-y-6">
      <li
        v-for="post in posts"
        :key="post._path"
        class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-6 hover:border-teal/30 transition-colors overflow-hidden"
        v-motion="motionItem"
      >
        <NuxtLink :to="post._path" class="block group">
          <h2 class="font-display text-xl font-semibold text-muted-pale group-hover:text-teal transition-colors">
            {{ post.title }}
          </h2>
          <p v-if="post.description" class="mt-2 text-sm text-muted-light line-clamp-2">
            {{ post.description }}
          </p>
          <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
            <time :datetime="post.date">{{ formatBlogDate(post.date) }}</time>
            <span v-if="post.readingTime">· {{ post.readingTime.text }}</span>
            <span v-if="post.tags?.length" class="flex gap-2">
              <NuxtLink
                v-for="tag in post.tags"
                :key="tag"
                :to="`/blog?tag=${encodeURIComponent(tag)}`"
                class="px-1.5 py-0.5 rounded bg-teal/15 text-teal-light hover:bg-teal/25 transition-colors"
                @click.stop
              >
                {{ tag }}
              </NuxtLink>
            </span>
          </div>
        </NuxtLink>
      </li>
    </ul>
    <p v-if="posts.length === 0" class="text-muted-light">
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

const { data: raw } = await useAsyncData('blog-list', () =>
  queryContent('/blog').sort({ date: -1 }).only(['title', 'description', 'date', 'tags', '_path', 'body']).find()
)

interface BlogPost {
  _path: string
  title?: string
  description?: string
  date?: string
  tags?: string[]
  readingTime: { text: string }
}

const searchQuery = ref('')

const currentTag = computed(() => {
  const tag = route.query.tag
  return typeof tag === 'string' ? tag : null
})

const allPosts = computed<BlogPost[]>(() => {
  const list = (raw.value ?? []) as Array<Record<string, unknown> & { body?: string; tags?: string[] }>
  return list.map((p) => {
    const body = p.body ?? ''
    const words = (typeof body === 'string' ? body : '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.ceil(words / 200))
    const { body: _, ...rest } = p
    return { ...rest, readingTime: { text: `${minutes} min read` } } as BlogPost
  })
})

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

</script>
