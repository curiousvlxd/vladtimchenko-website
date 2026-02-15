<template>
  <div class="flex flex-col bg-bg overflow-x-hidden min-h-[100svh]">
    <LayoutHeader />
    <main class="flex-1 pt-14 sm:pt-20" style="padding-bottom: 5rem;">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { requireSiteUrl } from '~/utils/site-url'
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE
} from '~/common/constants/app/site'
import { getSocialImageUrl } from '~/utils/social-image'

const route = useRoute()
const config = useRuntimeConfig()
const siteUrl = requireSiteUrl(config.public?.siteUrl as string | undefined)

const canonicalUrl = computed(() => {
  const path = route.path === '/' ? '' : route.path
  return `${siteUrl}${path}`
})

const ogImage = getSocialImageUrl(config.public?.siteUrl as string | undefined, {
  title: SITE_TITLE,
  subtitle: SITE_DESCRIPTION,
  section: 'Home'
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  meta: [
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:title', content: SITE_TITLE },
    { property: 'og:description', content: SITE_DESCRIPTION },
    { property: 'og:image', content: ogImage },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: SITE_TITLE },
    { name: 'twitter:description', content: SITE_DESCRIPTION },
    { name: 'twitter:image', content: ogImage }
  ]
})
</script>

