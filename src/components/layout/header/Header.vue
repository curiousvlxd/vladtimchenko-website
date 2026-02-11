<template>
  <header class="layout-header">
    <div class="layout-header__container">
      <BrandingLogoMark size="large" />
      <nav class="layout-header__nav" aria-label="Main">
        <a
          v-for="link in headerLinks"
          :key="link.to"
          :href="link.to"
          class="layout-header__link"
          :class="{ 'layout-header__link--active': isActive(link) }"
          @click="onNavClick($event, link.to)"
        >
          {{ link.label }}
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import BrandingLogoMark from '~/components/sections/about/LogoMark.vue'
import { FEED } from '~/constants/feed/feed'
import type { NavItem } from '~/constants/navigation/menu'
import { NAV_LINKS } from '~/constants/navigation/menu'
import { omitQueryParam } from '~/utils/route-query'

const headerLinks = computed(() => NAV_LINKS.filter((link) => link.to !== '/cv'))
const route = useRoute()

function isActive(link: NavItem) {
  const { to, exact } = link
  if (exact) return route.path === to
  return route.path === to || route.path.startsWith(to + '/')
}

function onNavClick(e: MouseEvent, to: string) {
  if (e.ctrlKey || e.metaKey || e.button === 1) return
  e.preventDefault()
  const query = omitQueryParam(route.query, FEED.QUERY_PARAM_GISCUS)
  void navigateTo({ path: to, query })
}
</script>

<style scoped src="./Header.css"></style>

