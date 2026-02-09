<template>
  <Teleport to="body">
    <Transition name="testimonial-modal">
      <div
        v-if="testimonial"
        class="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        @click="$emit('close')"
        @keydown.esc="$emit('close')"
        role="dialog"
        aria-modal="true"
        :aria-label="`Recommendation from ${testimonial.author}`"
      >
        <div class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] relative max-w-2xl w-full max-h-[90vh] flex flex-col shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_40px_-10px_rgba(24,183,164,0.15)]" @click.stop>
          <div class="flex justify-end shrink-0 p-4 pb-0">
            <button
              class="w-8 h-8 rounded-lg bg-teal/10 border border-teal/20 text-muted-pale flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-teal/20 hover:border-teal/40 hover:text-teal shrink-0"
              @click="$emit('close')"
              aria-label="Close modal"
            >
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="overflow-y-auto flex-1 min-h-0 p-8 pt-4">
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

            <div class="text-base text-muted-pale leading-relaxed mt-5">
              <p
                v-for="(paragraph, i) in paragraphs"
                :key="i"
                class="mb-4 last:mb-0"
              >
                {{ paragraph }}
              </p>
            </div>

            <div class="mt-6 pt-5 border-t border-teal/20 text-sm text-muted-light">
              {{ testimonial.date }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Testimonial } from '../../../data/testimonials'
import { getParagraphs, getInitials } from '../../../utils/testimonials'

const props = defineProps<{
  testimonial: Testimonial | null
}>()

defineEmits<{
  close: []
}>()

const paragraphs = computed(() => 
  props.testimonial ? getParagraphs(props.testimonial.text) : []
)

const initials = computed(() => 
  props.testimonial ? getInitials(props.testimonial.author) : ''
)
</script>

<style scoped>
.testimonial-modal-enter-active,
.testimonial-modal-leave-active {
  transition: opacity 0.25s ease;
}

.testimonial-modal-enter-active > div,
.testimonial-modal-leave-active > div {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.testimonial-modal-enter-from,
.testimonial-modal-leave-to {
  opacity: 0;
}

.testimonial-modal-enter-from > div,
.testimonial-modal-leave-to > div {
  opacity: 0;
  transform: scale(0.98) translateY(8px);
}

@media (max-width: 640px) {
  .card-gradient-animated {
    padding: 24px;
    max-height: 85vh;
    margin: 8px;
  }
}
</style>
