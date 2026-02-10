<template>
  <section
    class="card-gradient-animated relative overflow-hidden rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)]"
    v-motion="motionFade"
  >
    <div class="absolute inset-0 bg-gradient-to-r from-teal/5 via-transparent to-teal/10" />
    <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal/10 to-transparent opacity-60 animate-glow-pulse" />
    <div class="relative z-10 p-6 sm:p-8 lg:p-10">
      <div class="flex flex-col items-center text-center">
        <div class="inline-block rounded-full p-1.5 border-2 border-teal shadow-[0_0_20px_rgba(24,183,164,0.3)] avatar-ring mb-6">
          <img
            :src="ASSETS.PHOTO"
            alt="Vlad Timchenko"
            class="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover avatar-img"
          />
        </div>
        <h1 class="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-muted-pale">
          {{ home?.name ?? '' }}
        </h1>
        <p class="mt-2 text-teal font-medium text-lg">
          {{ HEADLINE }}
        </p>
        <p class="mt-3 text-muted text-sm">
          "Be curious, not judgemental" - Ted Lasso
        </p>
      </div>
      <div class="mt-8 pt-8 border-t border-teal/20 flex flex-wrap items-center justify-center gap-3">
        <BrandingEmailReveal />
        <a :href="CONTACT.GITHUB" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-11 h-11 rounded-xl bg-teal/15 text-muted-pale hover:bg-teal/25 hover:text-teal transition-colors" aria-label="GitHub">
          <AppIcon name="github" class="w-5 h-5" />
        </a>
        <a :href="CONTACT.LINKEDIN" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-11 h-11 rounded-xl bg-teal/15 text-muted-pale hover:bg-teal/25 hover:text-teal transition-colors" aria-label="LinkedIn">
          <AppIcon name="linkedin" class="w-5 h-5" />
        </a>
        <a :href="CONTACT.TELEGRAM" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-11 h-11 rounded-xl bg-teal/15 text-muted-pale hover:bg-teal/25 hover:text-teal transition-colors" aria-label="Telegram">
          <AppIcon name="telegram" class="w-5 h-5" />
        </a>
        <NuxtLink to="/cv" class="flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-teal/15 text-muted-pale hover:bg-teal/25 hover:text-teal transition-colors text-sm font-medium shrink-0" aria-label="CV">
          <AppIcon name="resume" class="w-5 h-5 shrink-0" />
          <span>CV</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import homeData from '../../data/content/home.json'
import { ASSETS, CONTACT, HEADLINE } from '~/constants'

const home = homeData as { name?: string }
const motionFade = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}
</script>

<style scoped>
.avatar-ring { transform: translateZ(0); backface-visibility: hidden; }
.avatar-img { transform: translateZ(0); backface-visibility: hidden; image-rendering: auto; box-shadow: inset 0 0 0 1px rgba(24, 183, 164, 0.12); }
</style>
