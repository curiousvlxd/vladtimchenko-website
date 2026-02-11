<template>
  <svg
    class="shrink-0 overflow-visible"
    :class="$attrs.class"
    :fill="icon.stroke ? 'none' : 'currentColor'"
    :stroke="icon.stroke ? 'currentColor' : undefined"
    :viewBox="props.viewBox"
    aria-hidden="true"
  >
    <g v-html="icon.content" />
  </svg>
</template>

<script setup lang="ts">
import type { IconName } from '~/constants/ui/icons'
import { getIcon } from '~/constants/ui/icons'

const props = withDefaults(
  defineProps<{ name: IconName; viewBox?: string }>(),
  { viewBox: '0 0 24 24' }
)
const icon = computed(() => getIcon(props.name))
</script>

