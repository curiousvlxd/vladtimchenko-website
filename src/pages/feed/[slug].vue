<template>
  <div class="mx-auto max-w-3xl px-4 sm:px-6 py-12">
    <NuxtLink
      :to="backToFeedLink"
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
              :to="getTagLink(tag)"
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
      <div class="min-h-[200px] rounded-2xl border border-teal/20 bg-bg-card/50 overflow-hidden">
        <ClientOnly>
          <GiscusComments
            :repo="config.giscusRepo"
            :repo-id="config.giscusRepoId"
            :category="config.giscusCategory"
            :category-id="config.giscusCategoryId"
            mapping="specific"
            :term="giscusTerm"
            strict="0"
            reactions-enabled="1"
            emit-metadata="0"
            input-position="top"
            :theme="giscusTheme"
            lang="en"
          />
          <template #fallback>
            <div class="min-h-[200px]" />
          </template>
        </ClientOnly>
      </div>
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
const giscusEnabled = computed(
  () =>
    Boolean(
      config.giscusRepo &&
        config.giscusRepoId &&
        config.giscusCategory &&
        config.giscusCategoryId
    )
)

const requestURL = import.meta.server ? useRequestURL() : null

const giscusTheme = computed(() => {
  const localHosts = ['localhost', '127.0.0.1', '0.0.0.0', '[::1]']

  if (import.meta.server) {
    const origin = requestURL?.origin || ''
    const hostname = requestURL?.hostname || ''
    const isLocalhost = localHosts.includes(hostname)
    if (isLocalhost) return 'dark'
    return `${origin}${config.giscusThemePath || '/giscus-theme.css'}`
  }

  if (typeof window === 'undefined') return ''

  const { origin, hostname } = window.location
  const isLocalhost = localHosts.includes(hostname)
  if (isLocalhost) return 'dark'

  return `${origin}${config.giscusThemePath || '/giscus-theme.css'}`
})

const giscusTerm = computed(() => `/feed/${slug.value}`)

const backToFeedLink = computed(() => {
  const query = { ...route.query }
  delete query.giscus
  return { path: '/feed', query }
})

function getTagLink(tag: string) {
  const query = { ...route.query }
  delete query.giscus
  return { path: '/feed', query: { ...query, tag } }
}

</script>
