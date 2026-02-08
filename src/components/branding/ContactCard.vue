<template>
  <div class="rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-8 sm:p-10">
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-8">
      <img :src="ASSETS.LOGO_WHITE" alt="" class="h-28 w-28 sm:h-32 sm:w-32 shrink-0" />
      <div class="flex-1 text-center sm:text-left min-w-0">
        <h2 class="font-display font-bold text-2xl text-muted-pale">
          Vlad Timchenko
        </h2>
        <p class="mt-1 text-teal text-sm font-medium">
          Software Engineer • Cloud-native .NET
        </p>
        <p class="mt-4 text-muted-light text-sm leading-relaxed max-w-md">
          Open to projects, collaborations, and conversations. Reach out via email or any channel below.
        </p>
        <div class="mt-6">
          <p class="text-xs text-muted uppercase tracking-wider mb-3">Connect</p>
          <div class="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            <BrandingEmailReveal />
            <a
              :href="CONTACT.GITHUB"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-teal/15 text-muted-pale hover:bg-teal/25 hover:text-teal transition-colors"
            >
              <AppIcon name="github" class="w-5 h-5" />
              <span class="text-sm font-medium">GitHub</span>
            </a>
            <a
              :href="CONTACT.LINKEDIN"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-teal/15 text-muted-pale hover:bg-teal/25 hover:text-teal transition-colors"
            >
              <AppIcon name="linkedin" class="w-5 h-5" />
              <span class="text-sm font-medium">LinkedIn</span>
            </a>
            <a
              :href="CONTACT.TELEGRAM"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-teal/15 text-muted-pale hover:bg-teal/25 hover:text-teal transition-colors"
            >
              <AppIcon name="telegram" class="w-5 h-5" />
              <span class="text-sm font-medium">Telegram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ASSETS, CONTACT } from '~/constants'
</script>
