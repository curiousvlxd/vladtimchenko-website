<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6 py-12">
    <section class="prose prose-invert max-w-none mb-12">
      <h1 class="font-display text-2xl font-semibold text-muted-pale mb-4">
        About
      </h1>
      <p class="text-muted-light leading-relaxed">
        Software engineer focused on cloud-native .NET, APIs, and scalable systems.
        Building tools and products that make a difference.
      </p>
    </section>
    <section>
      <BrandingContactCard />
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'About · Vlad Timchenko',
  meta: [
    { name: 'description', content: 'Software engineer focused on cloud-native .NET, APIs, and scalable systems. Building tools and products that make a difference.' },
    { property: 'og:title', content: 'About · Vlad Timchenko' },
    { property: 'og:description', content: 'Software engineer focused on cloud-native .NET, APIs, and scalable systems.' },
    { name: 'twitter:title', content: 'About · Vlad Timchenko' },
    { name: 'twitter:description', content: 'Software engineer focused on cloud-native .NET, APIs, and scalable systems.' }
  ]
})
</script>
