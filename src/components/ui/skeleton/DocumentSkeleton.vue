<template>
  <div class="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 animate-pulse">
    <div v-if="showActions" class="mb-6 flex flex-wrap items-center gap-3">
      <SkeletonBlock
        class-name="h-9"
        width="5rem"
        rounded-class="rounded"
        tone="strong"
      />
      <SkeletonBlock
        class-name="h-10"
        width="8rem"
        rounded-class="rounded-xl"
        tone="strong"
      />
    </div>

    <div class="rounded-2xl border border-teal/20 bg-bg-card overflow-hidden">
      <div class="py-8 px-6 border-b border-teal/20 space-y-2 text-center">
        <SkeletonBlock
          class-name="mx-auto h-7"
          width="12rem"
          rounded-class="rounded"
          tone="strong"
        />
        <SkeletonBlock
          class-name="mx-auto h-5"
          width="16rem"
          rounded-class="rounded"
          tone="soft"
        />
        <SkeletonBlock
          class-name="mx-auto h-4"
          width="14rem"
          rounded-class="rounded"
          tone="soft"
        />
      </div>

      <div class="p-6 space-y-6">
        <section v-for="section in sections" :key="section.id">
          <SkeletonBlock
            class-name="mb-2 h-4"
            :width="section.titleWidth"
            rounded-class="rounded"
            tone="strong"
          />

          <div v-if="section.entryCount && section.entryCount > 0">
            <div
              v-for="index in section.entryCount"
              :key="`${section.id}-entry-${index}`"
              class="pt-2"
            >
              <SkeletonBlock
                class-name="mb-1 h-4"
                rounded-class="rounded"
                tone="soft"
              />
              <SkeletonBlock
                class-name="mb-2 h-3"
                width="5rem"
                rounded-class="rounded"
                tone="soft"
              />
              <SkeletonBlock
                class-name="mb-1 h-4"
                width="80%"
                rounded-class="rounded"
                tone="soft"
              />
              <SkeletonBlock
                class-name="h-3"
                width="8rem"
                rounded-class="rounded"
                tone="soft"
              />
            </div>
          </div>

          <SkeletonLines
            v-else
            :widths="section.lines ?? defaultLines"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonBlock from './SkeletonBlock.vue'
import SkeletonLines from './SkeletonLines.vue'

interface DocumentSkeletonSection {
  id: string
  titleWidth: string
  lines?: string[]
  entryCount?: number
}

withDefaults(
  defineProps<{
    showActions?: boolean
    sections: DocumentSkeletonSection[]
    defaultLines?: string[]
  }>(),
  {
    showActions: true,
    defaultLines: () => ['100%', '100%', '80%']
  }
)
</script>
