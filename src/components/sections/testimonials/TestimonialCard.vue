<template>
  <article
    class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] overflow-hidden hover:border-teal/40 hover:shadow-[0_0_24px_rgba(24,183,164,0.15)] transition-all duration-300 cursor-pointer h-full flex flex-col p-6 sm:p-8 min-h-[320px]"
    v-motion="motionItem"
    @click="$emit('click', testimonial)"
  >
    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-teal/20">
      <div class="w-6 h-6 flex items-center justify-center bg-[#0077b5] rounded text-white shrink-0">
        <AppIcon name="linkedin" viewBox="0 0 24 24" class="w-4 h-4" />
      </div>
      <span class="text-[11px] font-medium text-muted-light uppercase tracking-wider">LinkedIn Recommendation</span>
    </div>

    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-full bg-teal/15 border border-teal/20 text-teal-light flex items-center justify-center font-semibold text-base shrink-0">
        {{ initials }}
      </div>
      <div>
        <div class="font-semibold text-base text-muted-pale leading-tight">{{ testimonial.author }}</div>
        <div class="text-sm text-muted-light mt-1 leading-tight">
          {{ testimonial.position }}
          <span v-if="testimonial.company"> · {{ testimonial.company }}</span>
        </div>
      </div>
    </div>

    <div class="testimonial-text-block flex-1 relative mb-3 min-h-[120px]">
      <div
        ref="textRef"
        class="text-[15px] text-muted-pale leading-relaxed overflow-hidden relative z-0"
        :class="{ 'line-clamp-5': showReadMore }"
      >
        <p
          v-for="(paragraph, i) in paragraphs"
          :key="i"
          class="mb-3 last:mb-0"
        >
          {{ paragraph }}
        </p>
      </div>
      <div
        v-if="showReadMore"
        class="absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none"
        style="background: linear-gradient(to bottom, transparent, rgba(10, 17, 23, 0.8) 40%, rgba(10, 17, 23, 0.95) 70%, #0A1117)"
      />
    </div>

    <button
      v-if="showReadMore"
      class="mt-auto text-left text-[15px] font-medium text-teal hover:text-teal-dark transition-colors"
      @click.stop="$emit('read-more', testimonial)"
    >
      Read more
    </button>
  </article>
</template>

<script setup lang="ts">
import type { Testimonial } from '../../../data/testimonials'
import { getParagraphs, getInitials, needsReadMore } from '../../../utils/testimonials'
import { motionItem } from '../../../constants/motion'

const props = defineProps<{
  testimonial: Testimonial
}>()

defineEmits<{
  click: [testimonial: Testimonial]
  'read-more': [testimonial: Testimonial]
}>()

const textRef = ref<HTMLElement>()
const paragraphs = computed(() => getParagraphs(props.testimonial.text))
const initials = computed(() => getInitials(props.testimonial.author))
const showReadMore = ref(false)

function updateReadMore() {
  showReadMore.value = needsReadMore(textRef.value ?? null)
}

let ro: ResizeObserver | null = null

onMounted(() => {
  updateReadMore()
  const el = textRef.value
  if (el) {
    ro = new ResizeObserver(() => updateReadMore())
    ro.observe(el)
  }
})

onUnmounted(() => {
  ro?.disconnect()
})

watch(textRef, (el) => {
  if (el) {
    nextTick(() => {
      updateReadMore()
      if (ro) ro.disconnect()
      ro = new ResizeObserver(() => updateReadMore())
      ro.observe(el)
    })
  }
})
</script>

<style scoped>
.testimonial-text-block {
  isolation: isolate;
}

.line-clamp-5 {
  -webkit-line-clamp: 5;
  line-clamp: 5;
}

@media (max-width: 640px) {
  article {
    padding: 20px;
    min-height: 300px;
  }

  .line-clamp-5 {
    -webkit-line-clamp: 4;
    line-clamp: 4;
  }
}
</style>
