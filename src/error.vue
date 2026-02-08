<template>
  <NuxtLayout name="error">
    <div class="w-full flex flex-col items-center justify-center px-4 py-12">
      <div class="card-gradient-animated w-full max-w-md rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-8 sm:p-10 text-center">
      <p class="font-display text-7xl sm:text-8xl font-bold text-teal tabular-nums tracking-tight">
        {{ error?.statusCode ?? 404 }}
      </p>
      <h1 class="mt-4 font-display text-xl sm:text-2xl font-semibold text-muted-pale">
        {{ is404 ? 'Page not found' : 'Something went wrong' }}
      </h1>
      <p class="mt-2 text-sm text-muted-light">
        {{ is404 ? "This page doesn't exist or was moved." : (error?.message || 'An unexpected error occurred.') }}
      </p>
      <NuxtLink
        to="/"
        class="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal/20 px-5 py-2.5 text-sm font-medium text-teal hover:bg-teal/30 transition-colors"
      >
        <AppIcon name="back" class="w-4 h-4" />
        Back to home
      </NuxtLink>
    </div>
  </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: { statusCode?: number; message?: string } | null
}>()

const is404 = computed(() => props.error?.statusCode === 404)

useHead({
  title: () => (props.error?.statusCode === 404 ? '404 · Not found' : 'Error'),
  meta: [{ name: 'robots', content: 'noindex' }]
})
</script>
