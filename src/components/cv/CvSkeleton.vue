<template>
  <div class="cv-page mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 animate-pulse">
    <div class="mb-6 flex flex-wrap items-center gap-3">
      <div class="h-9 w-20 rounded bg-teal/20" />
      <div class="h-10 w-32 rounded-xl bg-teal/20" />
    </div>
    <div class="rounded-2xl border border-teal/20 bg-bg-card overflow-hidden">
      <div class="py-8 px-6 border-b border-teal/20 space-y-2 text-center">
        <div class="h-7 w-48 mx-auto rounded bg-teal/20" />
        <div class="h-5 w-64 mx-auto rounded bg-teal/10" />
        <div class="h-4 w-56 mx-auto rounded bg-teal/10" />
      </div>
      <div class="p-6 space-y-6">
        <div>
          <div class="h-4 w-16 rounded bg-teal/20 mb-2" />
          <div class="h-4 w-full rounded bg-teal/10 mb-1" />
          <div class="h-4 w-3/4 rounded bg-teal/10" />
        </div>
        <div>
          <div class="h-4 w-24 rounded bg-teal/20 mb-2" />
          <div class="h-4 w-full rounded bg-teal/10" />
        </div>
        <div>
          <div class="h-4 w-28 rounded bg-teal/20 mb-4" />
          <div v-for="i in 3" :key="i" class="pt-2">
            <div class="h-4 w-full rounded bg-teal/10 mb-1" />
            <div class="h-3 w-20 rounded bg-teal/10 mb-2" />
            <div class="h-4 w-4/5 rounded bg-teal/10 mb-1" />
            <div class="h-3 w-32 rounded bg-teal/10" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
