<template>
  <main class="min-w-0 flex-1 max-w-4xl">
    <SkeletonBlock
      class-name="mb-8 sm:mb-10 h-48 sm:h-56"
      rounded-class="rounded-2xl"
      tone="card"
    />

    <div class="rounded-2xl border border-teal/20 bg-bg-card p-6 sm:p-8 mb-8 animate-pulse">
      <SkeletonBlock
        class-name="mb-4"
        width="6rem"
        height="1.75rem"
        rounded-class="rounded"
        tone="strong"
      />
      <SkeletonLines />
    </div>

    <section class="mb-12">
      <SkeletonBlock
        class-name="mb-6"
        width="7rem"
        height="1.75rem"
        rounded-class="rounded"
        tone="strong"
      />
      <div class="flex flex-wrap gap-3 mb-6">
        <SkeletonBlock
          class-name="h-20"
          width="10rem"
          rounded-class="rounded-2xl"
          tone="card"
        />
        <SkeletonBlock
          class-name="h-20"
          width="12rem"
          rounded-class="rounded-2xl"
          tone="card"
        />
      </div>
      <div class="flex flex-col gap-6">
        <SkeletonBlock
          v-for="index in experienceCardIndexes"
          :key="`experience-${index}`"
          class-name="h-36"
          rounded-class="rounded-2xl"
          tone="card"
        />
      </div>
    </section>

    <section class="mb-12">
      <SkeletonBlock
        class-name="mb-6"
        width="8rem"
        height="1.75rem"
        rounded-class="rounded"
        tone="strong"
      />
      <div class="flex flex-col gap-6">
        <SkeletonBlock
          v-for="index in volunteeringCardIndexes"
          :key="`volunteering-${index}`"
          class-name="h-44"
          rounded-class="rounded-2xl"
          tone="card"
        />
      </div>
    </section>

    <section class="mb-12">
      <SkeletonBlock
        class-name="mb-6"
        width="6rem"
        height="1.75rem"
        rounded-class="rounded"
        tone="strong"
      />
      <div class="flex flex-col gap-6">
        <SkeletonBlock
          v-for="index in educationCardIndexes"
          :key="`education-${index}`"
          class-name="h-28"
          rounded-class="rounded-2xl"
          tone="card"
        />
      </div>
    </section>

    <section class="mb-12">
      <SkeletonBlock
        class-name="mb-4"
        width="7rem"
        height="1.75rem"
        rounded-class="rounded"
        tone="strong"
      />
      <SkeletonBlock
        class-name="mb-6"
        width="16rem"
        height="1rem"
        rounded-class="rounded"
        tone="soft"
      />
      <div class="flex flex-col gap-4">
        <SkeletonBlock
          v-for="index in testimonialCardIndexes"
          :key="`testimonial-${index}`"
          class-name="h-24"
          rounded-class="rounded-2xl"
          tone="card"
        />
      </div>
    </section>

    <section class="mb-12">
      <SkeletonBlock
        class-name="mb-2"
        width="6rem"
        height="1.75rem"
        rounded-class="rounded"
        tone="strong"
      />
      <SkeletonBlock
        class-name="mb-6"
        width="12rem"
        height="1rem"
        rounded-class="rounded"
        tone="soft"
      />
      <div class="flex flex-col gap-4">
        <SkeletonBlock
          v-for="index in projectCardIndexes"
          :key="`project-${index}`"
          class-name="h-28"
          rounded-class="rounded-2xl"
          tone="card"
        />
      </div>
    </section>

    <section class="mb-12">
      <SkeletonBlock
        class-name="mb-2"
        width="5rem"
        height="1.75rem"
        rounded-class="rounded"
        tone="strong"
      />
      <SkeletonBlock
        class-name="mb-6"
        width="18rem"
        height="1rem"
        rounded-class="rounded"
        tone="soft"
      />
      <div class="rounded-2xl border border-teal/20 bg-bg-card p-6 animate-pulse">
        <div class="space-y-4">
          <SkeletonBlock class-name="h-10" rounded-class="rounded-xl" tone="soft" />
          <SkeletonBlock class-name="h-10" rounded-class="rounded-xl" tone="soft" />
          <SkeletonBlock class-name="h-24" rounded-class="rounded-xl" tone="soft" />
          <SkeletonBlock
            class-name="h-10"
            width="8rem"
            rounded-class="rounded-xl"
            tone="strong"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { HOME_SKELETON } from '~/constants/ui/skeleton'
import SkeletonBlock from '~/components/ui/skeleton/SkeletonBlock.vue'
import SkeletonLines from '~/components/ui/skeleton/SkeletonLines.vue'

const experienceCardIndexes = Array.from(
  { length: HOME_SKELETON.EXPERIENCE_CARD_COUNT },
  (_, index) => index
)

const volunteeringCardIndexes = Array.from(
  { length: HOME_SKELETON.VOLUNTEERING_CARD_COUNT },
  (_, index) => index
)

const educationCardIndexes = Array.from(
  { length: HOME_SKELETON.EDUCATION_CARD_COUNT },
  (_, index) => index
)

const testimonialCardIndexes = Array.from(
  { length: HOME_SKELETON.TESTIMONIAL_CARD_COUNT },
  (_, index) => index
)

const projectCardIndexes = Array.from(
  { length: HOME_SKELETON.PROJECT_CARD_COUNT },
  (_, index) => index
)
</script>

