<template>
  <div class="mx-auto max-w-3xl px-4 sm:px-6 py-12">
    <NuxtLink
      to="/feed"
      class="inline-flex items-center gap-2 text-sm text-muted-light hover:text-teal transition-colors mb-8"
    >
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Feed
    </NuxtLink>
    <article v-if="page" class="prose prose-invert max-w-none">
      <header class="mb-8">
        <h1 class="font-display text-3xl sm:text-4xl font-bold text-muted-pale">
          {{ page.title }}
        </h1>
        <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
          <time :datetime="page.date">{{ formatBlogDate(page.date, { month: 'long' }) }}</time>
          <span v-if="readingTime">· {{ readingTime.text }}</span>
          <span v-if="page.tags?.length" class="flex gap-2">
            <NuxtLink
              v-for="tag in page.tags"
              :key="tag"
              :to="`/feed?tag=${encodeURIComponent(tag)}`"
              class="px-1.5 py-0.5 rounded bg-teal/15 text-teal-light hover:bg-teal/25"
            >
              {{ tag }}
            </NuxtLink>
          </span>
        </div>
      </header>
      <ContentRenderer v-if="page.body" :value="page" tag="div" class="content-body" />
    </article>
    <section v-if="page" class="mt-12 pt-8 border-t border-teal/20">
      <div id="giscus" class="min-h-[200px]" />
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: page, error: pageError } = await useAsyncData(`feed-${slug.value}`, () =>
  queryContent('/feed', slug.value).findOne()
)

const readingTime = computed(() => {
  const p = page.value as { body?: { children?: unknown[] } } | null
  if (!p?.body) return null
  const text = JSON.stringify(p.body)
  const words = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return { text: `${minutes} min read` }
})

if (pageError.value) {
  throw createError({ statusCode: 500, statusMessage: 'Failed to load post' })
}
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

useHead({
  title: () => `${page.value?.title ?? 'Post'} - Vlad Timchenko`,
  meta: [
    {
      name: 'description',
      content: () => (page.value?.description as string) ?? ''
    }
  ]
})

const config = useRuntimeConfig().public
onMounted(() => {
  if (typeof window === 'undefined' || !config.giscusRepo) return
  const s = document.createElement('script')
  s.src = 'https://giscus.app/client.js'
  s.setAttribute('data-repo', config.giscusRepo)
  s.setAttribute('data-repo-id', config.giscusRepoId)
  s.setAttribute('data-category', config.giscusCategory)
  s.setAttribute('data-category-id', config.giscusCategoryId)
  s.setAttribute('data-mapping', 'pathname')
  s.setAttribute('data-strict', '0')
  s.setAttribute('data-reactions-enabled', '1')
  s.setAttribute('data-emit-metadata', '0')
  s.setAttribute('data-input-position', 'bottom')
  s.setAttribute('data-theme', 'dark')
  s.setAttribute('data-lang', 'en')
  s.setAttribute('crossorigin', 'anonymous')
  s.async = true
  document.getElementById('giscus')?.appendChild(s)
})
</script>
