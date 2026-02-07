<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6 py-12">
    <h1 class="font-display text-3xl font-bold text-muted-pale mb-2">
      Blog
    </h1>
    <p class="text-muted-light mb-10">
      Notes and articles.
    </p>
    <ul class="space-y-6">
      <li
        v-for="post in posts"
        :key="post._path"
        class="rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-6 hover:border-teal/30 transition-colors"
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
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
            <span v-if="post.readingTime">· {{ post.readingTime.text }}</span>
            <span v-if="post.tags?.length" class="flex gap-2">
              <span v-for="tag in post.tags" :key="tag" class="px-1.5 py-0.5 rounded bg-teal/15 text-teal-light">
                {{ tag }}
              </span>
            </span>
          </div>
        </NuxtLink>
      </li>
    </ul>
    <p v-if="posts.length === 0" class="text-muted-light">
      No posts yet.
    </p>
  </div>
</template>

<script setup lang="ts">
const motionItem = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
}

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

const posts = computed<BlogPost[]>(() => {
  const list = (raw.value ?? []) as Array<Record<string, unknown> & { body?: string }>
  return list.map((p) => {
    const body = p.body ?? ''
    const words = (typeof body === 'string' ? body : '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.ceil(words / 200))
    const { body: _, ...rest } = p
    return { ...rest, readingTime: { text: `${minutes} min read` } } as BlogPost
  })
})

function formatDate(d: string): string {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
