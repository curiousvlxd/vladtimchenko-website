<template>
  <ContentRenderer
    v-if="value?.body"
    :value="value"
    :components="mdxComponents"
    tag="div"
    class="markdown-renderer prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:font-display prose-headings:text-muted-pale prose-headings:tracking-tight prose-h1:mb-4 prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-p:my-4 prose-p:text-muted-light prose-p:leading-relaxed prose-ul:text-muted-light prose-ol:text-muted-light prose-li:my-1 prose-li:marker:text-teal/80 prose-a:text-teal prose-a:font-medium prose-a:no-underline hover:prose-a:text-teal-light hover:prose-a:underline prose-strong:text-muted-pale prose-code:text-teal-light prose-code:bg-teal/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-bg-card prose-pre:border prose-pre:border-teal/20 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:shadow-none prose-blockquote:border-l-4 prose-blockquote:border-teal/50 prose-blockquote:text-muted-light prose-blockquote:italic prose-table:w-full prose-th:bg-bg-card/60 prose-th:text-muted-pale prose-th:font-semibold prose-th:p-3 prose-td:text-muted-light prose-td:p-3 prose-tr:border-b prose-tr:border-white/5 prose-hr:border-teal/20 prose-hr:my-8 prose-img:my-6 prose-img:w-full prose-img:max-w-full prose-img:h-auto prose-img:rounded-2xl prose-img:border prose-img:border-teal/20 prose-img:bg-bg-card prose-figure:my-8 prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-muted"
    @click="emit('click', $event)"
  />
</template>

<script setup lang="ts">
import FeedImageCarousel from '~/components/feed/FeedImageCarousel.vue'

type MarkdownContent = { body?: unknown } & Record<string, unknown>
const mdxComponents = { FeedImageCarousel }

defineProps<{
  value: MarkdownContent | null
}>()

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void
}>()
</script>
