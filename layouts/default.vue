<template>
  <div class="min-h-screen flex flex-col bg-bg overflow-x-hidden">
    <LayoutHeader />
    <main class="flex-1 pt-14 sm:pt-20" style="padding-bottom: calc(5rem + env(safe-area-inset-bottom, 0px));">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl as string) || 'https://vladtimchenko.dev'

const canonicalUrl = computed(() => {
  const path = route.path === '/' ? '' : route.path
  return `${siteUrl}${path}`
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  meta: [
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:title', content: 'Vlad Timchenko · Software Engineer' },
    { property: 'og:description', content: 'Vlad Timchenko • Software Engineer • Cloud-native .NET' },
    { property: 'og:image', content: `${siteUrl}/me.jpg` },
    { property: 'og:site_name', content: 'Vlad Timchenko' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Vlad Timchenko · Software Engineer' },
    { name: 'twitter:description', content: 'Vlad Timchenko • Software Engineer • Cloud-native .NET' },
    { name: 'twitter:image', content: `${siteUrl}/me.jpg` }
  ]
})
</script>
