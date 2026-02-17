<template>
  <header class="layout-header">
    <div class="layout-header__container">
      <BrandingLogoMark size="large" />
      <nav class="layout-header__nav" aria-label="Main">
        <NuxtLink
          v-for="link in headerLinks"
          :key="link.to"
          :to="getNavTo(link.to)"
          no-prefetch
          class="layout-header__link"
          :class="{ 'layout-header__link--active': isActive(link) }"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import BrandingLogoMark from '~/features/home/components/sections/about/LogoMark.vue'
import { FEED } from '~/features/feed/constants'
import type { NavItem } from '~/features/navigation/constants'
import { NAV_LINKS } from '~/features/navigation/constants'
import { omitQueryParam } from '~/utils/route-query'

const headerLinks = computed(() => NAV_LINKS.filter((link) => link.to !== '/cv'))
const route = useRoute()
const cleanedQuery = computed(() => omitQueryParam(route.query, FEED.QUERY_PARAM_GISCUS))

function isActive(link: NavItem) {
  const { to, exact } = link
  if (exact) return route.path === to
  return route.path === to || route.path.startsWith(to + '/')
}

function getNavTo(to: string) {
  return { path: to, query: cleanedQuery.value }
}
</script>

<style scoped src="./Header.css"></style>

