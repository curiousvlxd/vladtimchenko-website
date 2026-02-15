ё<template>
  <div v-if="totalSlides > 1" class="flex gap-2 justify-center mt-8 w-full">
    <button
      v-for="(_, index) in totalSlides"
      :key="index"
      class="h-1.5 rounded-full bg-teal/30 opacity-50 border-none cursor-pointer p-0 transition-all duration-300 hover:opacity-80"
      :class="{ 'bg-teal opacity-100 w-6': activeSlideIndex === index, 'w-1.5': activeSlideIndex !== index }"
      @click="$emit('go-to-slide', index)"
      :aria-label="`Go to slide ${index + 1}`"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalSlides: number
  activeSlideIndex: number
}>()

defineEmits<{
  'go-to-slide': [index: number]
}>()
</script>

