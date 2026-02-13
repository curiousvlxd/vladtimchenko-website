<template>
  <div class="mx-auto max-w-3xl px-4 sm:px-6 pt-0 pb-12">
    <div class="sticky top-14 sm:top-20 z-40 mb-8 flex items-center justify-between gap-3 border-b border-white/5 bg-bg/85 py-3 backdrop-blur-md">
      <NuxtLink
        :to="backToFeedLink"
        class="inline-flex items-center gap-2 text-sm text-muted-light hover:text-teal transition-colors"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Feed
      </NuxtLink>

      <ShareMenu
        v-if="page"
        :title="page.title ?? 'Post'"
        :description="pageDescription"
        :url="pageShareUrl"
      />
    </div>

    <FeedArticleSkeleton v-if="pending" />

    <article v-else-if="page" class="max-w-none">
      <div class="not-prose">
        <FeedArticleHeader
          :title="page.title ?? 'Post'"
          :date="page.date ?? ''"
          :tags="page.tags"
          :reading-time-text="readingTime?.text ?? null"
          :get-tag-link="getTagLink"
        />
      </div>
      <MarkdownRenderer
        v-if="page.body"
        :value="page"
        @click="handleArticleContentClick"
      />
    </article>

    <section v-else-if="pageError" class="text-muted-light">
      <p>Failed to load post.</p>
    </section>

    <section v-else-if="!page" class="text-muted-light">
      <p>Post not found.</p>
    </section>

    <section v-if="page && giscusEnabled" class="mt-12 pt-8 border-t border-teal/20">
      <h2 class="font-display text-xl font-semibold text-muted-pale mb-4">Comments</h2>
      <div class="min-h-[200px] rounded-2xl border border-teal/20 bg-bg-card/50 overflow-hidden">
        <ClientOnly>
          <GiscusComments
            :repo="giscusRepo!"
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

    <ArticleImageModal
      :model-value="Boolean(lightboxImage)"
      :src="lightboxImage?.src ?? ''"
      :alt="lightboxImage?.alt ?? ''"
      @update:model-value="handleImageModalModelValue"
    />
  </div>
</template>

<script setup lang="ts">
import type { Repo } from '@giscus/vue'
import ArticleImageModal from '~/components/feed/ArticleImageModal.vue'
import FeedArticleHeader from '~/components/feed/FeedArticleHeader.vue'
import FeedArticleSkeleton from '~/components/feed/FeedArticleSkeleton.vue'
import GiscusComments from '~/components/feed/GiscusComments.client.vue'
import MarkdownRenderer from '~/components/feed/MarkdownRenderer.vue'
import ShareMenu from '~/components/feed/ShareMenu.vue'
import { FEED } from '~/constants/feed/feed'
import { PUBLIC_ASSETS } from '~/constants/app/public-assets'
import { SITE_NAME } from '~/constants/app/site'
import { omitQueryParam } from '~/utils/route-query'
import { getSocialImageUrl } from '~/utils/social-image'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
type LightboxImage = { src: string; alt: string }
const lightboxImage = ref<LightboxImage | null>(null)

const { data: page, pending, error: pageError } = useLazyAsyncData(`feed-${slug.value}`, () =>
  queryContent('/feed', slug.value).findOne()
)

const readingTime = computed(() => {
  const p = page.value as { body?: { children?: unknown[] } } | null
  if (!p?.body) return null
  const text = JSON.stringify(p.body)
  const words = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / FEED.WORDS_PER_MINUTE))
  return { text: `${minutes} min read` }
})

watch([pending, page, pageError], () => {
  if (pending.value) return
  if (pageError.value) throw createError({ statusCode: 500, statusMessage: 'Failed to load post' })
  if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}, { immediate: true })

const articleTitle = computed(() => page.value?.title ?? 'Post')
const pageTitle = computed(() => `${articleTitle.value} - ${SITE_NAME}`)
const pageDescription = computed(() => (page.value?.description ?? (page.value as { excerpt?: string })?.excerpt) ?? '')
const runtimeConfig = useRuntimeConfig()
const config = runtimeConfig.public
const articlePath = computed(() =>
  (page.value as { _path?: string } | null)?._path ?? `/feed/${slug.value}`
)
const pageShareUrl = computed(() =>
  resolveAbsoluteUrl(articlePath.value)
)
const socialImage = computed(() =>
  getSocialImageUrl(runtimeConfig.public.siteUrl, {
    title: articleTitle.value,
    section: 'Post',
    url: articlePath.value
  })
)

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: articleTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: socialImage },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: articleTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: socialImage }
  ]
})

function isGiscusRepo(value: string | undefined): value is Repo {
  return typeof value === 'string' && value.includes('/')
}

const giscusRepo = computed<Repo | null>(() =>
  isGiscusRepo(config.giscusRepo) ? config.giscusRepo : null
)

const giscusEnabled = computed(
  () =>
    Boolean(
      giscusRepo.value &&
      config.giscusRepoId &&
      config.giscusCategory &&
      config.giscusCategoryId
    )
)

const requestURL = import.meta.server ? useRequestURL() : null
const localhostNames = new Set<string>(FEED.LOCAL_HOSTNAMES)

const giscusTheme = computed(() => {
  if (import.meta.server) {
    const origin = requestURL?.origin || ''
    const hostname = requestURL?.hostname || ''
    const isLocalhost = localhostNames.has(hostname)
    if (isLocalhost) return 'dark'
    return `${origin}${config.giscusThemePath || PUBLIC_ASSETS.GISCUS_THEME}`
  }

  if (typeof window === 'undefined') return ''

  const { origin, hostname } = window.location
  const isLocalhost = localhostNames.has(hostname)
  if (isLocalhost) return 'dark'

  return `${origin}${config.giscusThemePath || PUBLIC_ASSETS.GISCUS_THEME}`
})

const giscusTerm = computed(() => `/feed/${slug.value}`)

const backToFeedLink = computed(() => {
  const query = omitQueryParam(route.query, FEED.QUERY_PARAM_GISCUS)
  return { path: '/feed', query }
})

function getTagLink(tag: string) {
  const query = omitQueryParam(route.query, FEED.QUERY_PARAM_GISCUS)
  return { path: '/feed', query: { ...query, tag } }
}

function resolveAbsoluteUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const normalizedSiteUrl = runtimeConfig.public.siteUrl?.trim().replace(/\/+$/, '')
  if (normalizedSiteUrl) {
    return `${normalizedSiteUrl}${normalizedPath}`
  }

  if (import.meta.client && typeof window !== 'undefined') {
    return new URL(normalizedPath, window.location.origin).href
  }

  return normalizedPath
}

function handleArticleContentClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof HTMLElement)) return

  const image = target.closest('img')
  if (!(image instanceof HTMLImageElement)) return
  if (!image.closest('.markdown-renderer')) return

  const src = image.currentSrc || image.getAttribute('src')
  if (!src) return

  const link = image.closest('a')
  if (link instanceof HTMLAnchorElement) {
    event.preventDefault()
  }

  lightboxImage.value = {
    src,
    alt: image.getAttribute('alt')?.trim() ?? ''
  }
}

function closeImageLightbox() {
  lightboxImage.value = null
}

function handleImageModalModelValue(value: boolean) {
  if (!value) {
    closeImageLightbox()
  }
}

watch(() => route.fullPath, () => {
  closeImageLightbox()
})
</script>
