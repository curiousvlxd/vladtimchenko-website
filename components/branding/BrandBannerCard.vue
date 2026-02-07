<template>
  <section
    class="relative overflow-hidden rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] aspect-[3/1] min-h-[180px] flex items-center justify-center gap-6 sm:gap-8 px-6"
    v-motion="motionFade"
  >
    <div class="absolute inset-0 bg-gradient-to-r from-teal/5 via-transparent to-teal/10" />
    <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal/10 to-transparent opacity-60 animate-glow-pulse" />
    <div class="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
      <img :src="ASSETS.LOGO_WHITE" alt="" class="h-16 w-16 sm:h-20 sm:w-20 shrink-0" />
      <div class="text-center sm:text-left">
        <h1 class="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-muted-pale">
          VLAD TIMCHENKO
        </h1>
        <p class="mt-2 text-muted text-sm sm:text-base">
          Software Engineer • Cloud-native .NET
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ASSETS } from '~/constants'

const motionFade = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}
</script>
