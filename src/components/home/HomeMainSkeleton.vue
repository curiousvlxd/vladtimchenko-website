<template>
  <main class="min-w-0 flex-1 max-w-4xl">
    <div class="mb-8 sm:mb-10 rounded-2xl border border-teal/20 bg-bg-card h-48 sm:h-56 animate-pulse" />
    <div class="rounded-2xl border border-teal/20 bg-bg-card p-6 sm:p-8 mb-8 animate-pulse">
      <div class="h-7 w-24 rounded bg-teal/20 mb-4" />
      <div class="space-y-3">
        <div class="h-4 w-full rounded bg-teal/10" />
        <div class="h-4 w-full rounded bg-teal/10" />
        <div class="h-4 w-4/5 rounded bg-teal/10" />
      </div>
    </div>
    <div class="mb-12">
      <div class="h-7 w-28 rounded bg-teal/20 mb-6" />
      <div class="flex flex-wrap gap-3 mb-6">
        <div class="h-20 w-40 rounded-2xl bg-bg-card animate-pulse" />
        <div class="h-20 w-48 rounded-2xl bg-bg-card animate-pulse" />
      </div>
      <div class="flex flex-col gap-6">
        <div v-for="i in 3" :key="i" class="rounded-2xl border border-teal/20 bg-bg-card h-36 animate-pulse" />
      </div>
    </div>
    <div class="mb-12">
      <div class="h-7 w-32 rounded bg-teal/20 mb-6" />
      <div class="flex flex-col gap-6">
        <div v-for="i in 2" :key="i" class="rounded-2xl border border-teal/20 bg-bg-card h-44 animate-pulse" />
      </div>
    </div>
    <div class="mb-12">
      <div class="h-7 w-24 rounded bg-teal/20 mb-6" />
      <div class="flex flex-col gap-6">
        <div v-for="i in 2" :key="i" class="rounded-2xl border border-teal/20 bg-bg-card h-28 animate-pulse" />
      </div>
    </div>
    <div class="mb-12">
      <div class="h-7 w-28 rounded bg-teal/20 mb-4" />
      <div class="h-4 w-64 rounded bg-teal/10 mb-6" />
      <div class="flex flex-col gap-4">
        <div v-for="i in 3" :key="i" class="rounded-2xl border border-teal/20 bg-bg-card h-24 animate-pulse" />
      </div>
    </div>
    <div class="mb-12">
      <div class="h-7 w-24 rounded bg-teal/20 mb-2" />
      <div class="h-4 w-48 rounded bg-teal/10 mb-6" />
      <div class="flex flex-col gap-4">
        <div v-for="i in 4" :key="i" class="rounded-2xl border border-teal/20 bg-bg-card h-28 animate-pulse" />
      </div>
    </div>
    <div class="mb-12">
      <div class="h-7 w-20 rounded bg-teal/20 mb-2" />
      <div class="h-4 w-72 rounded bg-teal/10 mb-6" />
      <div class="rounded-2xl border border-teal/20 bg-bg-card p-6 animate-pulse">
        <div class="space-y-4">
          <div class="h-10 w-full rounded-xl bg-teal/10" />
          <div class="h-10 w-full rounded-xl bg-teal/10" />
          <div class="h-24 w-full rounded-xl bg-teal/10" />
          <div class="h-10 w-32 rounded-xl bg-teal/20" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
</script>
