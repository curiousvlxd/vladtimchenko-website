<template>
  <article
    class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] overflow-hidden hover:border-teal/40 hover:shadow-[0_0_24px_rgba(24,183,164,0.15)] transition-all duration-300 cursor-pointer h-full flex flex-col p-6 sm:p-8 min-h-[320px]"
    @click="$emit('click', testimonial)"
  >
    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-teal/20">
      <div
        class="w-6 h-6 flex items-center justify-center rounded shrink-0 bg-[#0077b5] text-white"
      >
        <AppIcon name="linkedin" viewBox="0 0 24 24" class="w-4 h-4" />
      </div>
      <span class="text-[11px] font-medium text-muted-light uppercase tracking-wider">
        LinkedIn Recommendation
      </span>
    </div>

    <div class="mb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-teal/15 border border-teal/20 text-teal-light flex items-center justify-center font-semibold text-base shrink-0">
          {{ initials }}
        </div>
        <div>
          <div class="font-semibold text-base text-muted-pale leading-tight">{{ testimonial.author }}</div>
          <div class="text-sm text-muted-light mt-1 leading-tight">
            {{ testimonial.position }}
            <span v-if="testimonial.company"> - {{ testimonial.company }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="testimonial-text-block flex-1 relative mb-3 min-h-[120px]">
      <div
        ref="textRef"
        class="testimonial-copy text-[15px] text-muted-pale leading-relaxed relative z-0"
        :class="{ 'testimonial-copy-collapsed': canToggle && !isExpanded }"
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
        v-if="canToggle && !isExpanded"
        class="absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none"
        style="background: linear-gradient(to bottom, transparent, rgba(10, 17, 23, 0.8) 40%, rgba(10, 17, 23, 0.95) 70%, #0A1117)"
      />
    </div>

    <div class="mt-auto flex items-center gap-3 flex-wrap">
      <button
        v-if="canToggle"
        class="inline-flex items-center rounded-full border border-teal/35 bg-teal/10 px-3 py-1.5 text-[13px] font-medium text-teal-light hover:border-teal/60 hover:bg-teal/20 transition-all"
        @click.stop="toggleExpanded"
      >
        {{ isExpanded ? 'View less' : 'View more' }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Testimonial } from '~/data/testimonials'
import { getParagraphs, getInitials } from '~/utils/testimonials'
import { TESTIMONIAL_CONSTANTS } from '~/features/testimonials/constants'

const props = defineProps<{
  testimonial: Testimonial
}>()

defineEmits<{
  click: [testimonial: Testimonial]
}>()

const COLLAPSED_HEIGHT = TESTIMONIAL_CONSTANTS.MAX_TEXT_HEIGHT

const textRef = ref<HTMLElement>()
const paragraphs = computed(() => getParagraphs(props.testimonial.text))
const initials = computed(() => getInitials(props.testimonial.author))
const canToggle = ref(false)
const isExpanded = ref(false)

function updateCanToggle() {
  const el = textRef.value
  if (!el) {
    canToggle.value = false
    return
  }

  canToggle.value = el.scrollHeight > COLLAPSED_HEIGHT + 2
}

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

let ro: ResizeObserver | null = null

onMounted(() => {
  updateCanToggle()
  const el = textRef.value
  if (el) {
    ro = new ResizeObserver(() => updateCanToggle())
    ro.observe(el)
  }
})

onUnmounted(() => {
  ro?.disconnect()
})

watch(textRef, (el) => {
  if (el) {
    nextTick(() => {
      updateCanToggle()
      if (ro) ro.disconnect()
      ro = new ResizeObserver(() => updateCanToggle())
      ro.observe(el)
    })
  }
})

watch(() => props.testimonial.id, () => {
  isExpanded.value = false
  nextTick(() => updateCanToggle())
})
</script>

<style scoped>
.testimonial-text-block {
  isolation: isolate;
}

.testimonial-copy {
  transition: max-height 0.3s ease;
}

.testimonial-copy-collapsed {
  max-height: 120px;
  overflow: hidden;
}

@media (max-width: 640px) {
  article {
    padding: 20px;
    min-height: 300px;
  }

  .testimonial-copy-collapsed {
    max-height: 104px;
  }
}
</style>
