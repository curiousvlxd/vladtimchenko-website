<template>
  <header class="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-bg/40 backdrop-blur-xl">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 flex min-h-14 h-14 sm:min-h-16 sm:h-20 items-center justify-between gap-3">
      <BrandingLogoMark size="large" />
      <nav class="flex items-center gap-4 sm:gap-6 text-sm shrink-0" aria-label="Main">
        <a
          v-for="link in headerLinks"
          :key="link.to"
          :href="link.to"
          class="inline-flex items-center min-h-[44px] min-w-[44px] sm:min-w-0 py-2 px-3 sm:px-2 -my-2 -mx-1 sm:mx-0 rounded text-muted-light hover:text-teal transition-colors touch-manipulation select-none"
          :class="{ 'text-teal font-medium': isActive(link) }"
          @click="onNavClick($event, link.to)"
        >
          {{ link.label }}
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { NavItem } from '~/constants/navigation'
import { NAV_LINKS } from '~/constants/navigation'

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
  void navigateTo(to)
}
</script>
