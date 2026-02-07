<template>
  <header class="sticky top-0 z-50 border-b border-teal/10 bg-bg/90 backdrop-blur-md">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 flex min-h-14 h-14 sm:min-h-16 sm:h-20 items-center justify-between gap-3">
      <BrandingLogoMark size="large" />
      <nav class="flex items-center gap-4 sm:gap-6 text-sm shrink-0">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-muted-light hover:text-teal transition-colors"
          active-class="text-teal font-medium"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const links = [
  { to: '/', label: 'Home' },
  { to: '/blog', label: 'Blog' }
]
</script>
