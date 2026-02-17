<template>
  <section
    id="about"
    data-section="about"
    class="rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-6 sm:p-8 mb-8 scroll-mt-24 sm:scroll-mt-28"
  >
    <h2 class="font-display text-2xl font-semibold text-muted-pale mb-4">
      {{ title }}
    </h2>
    <div class="prose prose-invert max-w-none">
      <p
        v-for="paragraph in paragraphs"
        :key="paragraph"
        class="text-muted-light leading-relaxed mb-4 last:mb-0"
      >
        {{ paragraph }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    paragraphs?: string[]
  }>(),
  {
    title: 'About',
    paragraphs: () => []
  }
)
</script>

