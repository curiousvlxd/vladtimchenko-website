<template>
  <div class="space-y-6">
    <div
      v-for="item in itemCount"
      :key="item"
      class="rounded-2xl border border-teal/20 bg-bg-card p-6 animate-pulse"
    >
      <div class="h-6 w-3/4 rounded bg-teal/20 mb-3" />
      <div class="h-4 w-full rounded bg-teal/10 mb-2" />
      <div class="h-4 w-1/2 rounded bg-teal/10 mb-3" />
      <div class="h-3 w-24 rounded bg-teal/10" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    itemCount?: number
  }>(),
  {
    itemCount: 5
  }
)
</script>
