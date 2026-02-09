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
    <section v-if="page && giscusEnabled" class="mt-12 pt-8 border-t border-teal/20">
      <h2 class="font-display text-xl font-semibold text-muted-pale mb-4">Comments</h2>
      <div id="giscus" class="min-h-[200px] rounded-2xl border border-teal/20 bg-bg-card/50 overflow-hidden" />
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

const pageTitle = computed(() => `${page.value?.title ?? 'Post'} · Vlad Timchenko`)
const pageDescription = computed(() => (page.value?.description ?? (page.value as { excerpt?: string })?.excerpt) ?? '')

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription }
  ]
})

const config = useRuntimeConfig().public
const giscusEnabled = computed(() => Boolean(config.giscusRepo && config.giscusRepoId))

onMounted(() => {
  if (typeof window === 'undefined' || !giscusEnabled.value) return
  const container = document.getElementById('giscus')
  if (!container) return
  if (document.querySelector('script[src*="giscus.app/client.js"]')) return
  const themeUrl = new URL(config.giscusThemePath || '/giscus-theme.css', window.location.origin).toString()
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
  s.setAttribute('data-input-position', 'top')
  s.setAttribute('data-theme', themeUrl)
  s.setAttribute('data-lang', 'en')
  s.setAttribute('data-loading', 'lazy')
  s.setAttribute('crossorigin', 'anonymous')
  s.async = true
  container.appendChild(s)
})
</script>
