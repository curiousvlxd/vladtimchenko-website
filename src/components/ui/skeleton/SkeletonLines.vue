<template>
  <div :class="containerClassName" aria-hidden="true">
    <SkeletonBlock
      v-for="(lineWidth, index) in widths"
      :key="`line-${index}`"
      :width="lineWidth"
      :height="lineHeight"
      :class-name="lineClassName"
      rounded-class="rounded"
      :tone="tone"
    />
  </div>
</template>

<script setup lang="ts">
import SkeletonBlock from './SkeletonBlock.vue'

const props = withDefaults(
  defineProps<{
    widths?: string[]
    lineHeight?: string
    containerClassName?: string
    lineClassName?: string
    tone?: 'soft' | 'strong' | 'card'
  }>(),
  {
    widths: () => ['100%', '100%', '80%'],
    lineHeight: '1rem',
    containerClassName: 'space-y-3',
    lineClassName: '',
    tone: 'soft'
  }
)
</script>
