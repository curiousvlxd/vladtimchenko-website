<template>
  <footer
    v-if="!hideOnHomeMobile"
    class="layout-footer"
  >
    <div class="layout-footer__container">
      <p class="layout-footer__content">
        <span>© {{ new Date().getFullYear() }} {{ SITE_NAME }}</span>
        <span aria-hidden="true" class="layout-footer__divider">·</span>
        <a
          :href="siteRepo?.url || siteRepoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="layout-footer__link"
        >
          <span aria-hidden="true">★</span>
          <span v-if="siteRepo && siteRepo.stars >= 0">{{ siteRepo.stars }}</span>
          <span v-if="siteRepo">·</span>
          <span>View source on GitHub</span>
        </a>
        <span aria-hidden="true" class="layout-footer__divider">·</span>
        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          class="layout-footer__link"
          title="RSS feed"
        >
          <AppIcon name="rss" class="w-4 h-4 text-teal/80" />
          <span>RSS</span>
        </a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { LAYOUT } from '~/constants/app/layout'
import { SITE_NAME } from '~/constants/app/site'
import { useBreakpoint } from '~/composables/core/useBreakpoint'

const route = useRoute()
const nuxtApp = useNuxtApp()
const { public: { siteRepoUrl } } = useRuntimeConfig()
const { data: siteRepo } = await useFetch<{ stars: number; url: string }>('/api/site-repo', {
  key: 'site-repo',
  getCachedData: (key) => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
})

const isMobile = useBreakpoint(LAYOUT.FOOTER_HIDE_BREAKPOINT_PX)
const hideOnHomeMobile = computed(() => route.path === '/' && isMobile.value)
</script>

<style scoped src="./Footer.css"></style>

