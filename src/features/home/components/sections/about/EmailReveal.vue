<template>
  <div class="relative" ref="anchorRef">
    <button
      type="button"
      class="flex items-center justify-center w-11 h-11 rounded-xl bg-teal/15 text-muted-pale hover:bg-teal/25 hover:text-teal transition-colors"
      aria-label="Show email"
      @click="toggle"
    >
      <AppIcon name="email" class="w-5 h-5" />
    </button>
    <ClientOnly>
      <Teleport to="body">
        <div
          v-if="open"
          class="fixed inset-0 z-[44]"
          aria-hidden="true"
          @click="open = false"
        />
        <div
          v-if="open && anchorRect"
          class="email-popup fixed z-[45] rounded-xl border border-teal/25 bg-bg-card shadow-xl p-4 min-w-[220px]"
          :style="popupStyle"
          role="dialog"
          aria-label="Email"
          @click.stop
        >
          <div class="email-popup__tail" :style="tailStyle" aria-hidden="true" />
          <p class="text-xs text-muted uppercase tracking-wider mb-2">Email</p>
          <p class="text-teal-light font-medium break-all mb-3">{{ CONTACT.EMAIL }}</p>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg bg-teal/20 text-teal text-sm font-medium hover:bg-teal/30 transition-colors"
              @click="copy"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
            <a
              :href="`mailto:${CONTACT.EMAIL}`"
              class="px-3 py-1.5 rounded-lg bg-teal/20 text-teal text-sm font-medium hover:bg-teal/30 transition-colors"
            >
              Open in Mail
            </a>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { CONTACT } from '~/common/constants'
import { EMAIL_REVEAL } from './constants'
import { useAnchorPosition } from '~/common/composables/ui/useAnchorPosition'
import { useCopyFeedback } from '~/common/composables/ui/useCopyFeedback'

const open = ref(false)
const anchorRef = ref<HTMLElement | null>(null)

const anchorRect = useAnchorPosition(anchorRef, open)
const { copied, setCopied } = useCopyFeedback(EMAIL_REVEAL.COPIED_RESET_MS)

function toggle() {
  open.value = !open.value
}

const popupStyle = computed(() => {
  if (!anchorRect.value) return {}
  const r = anchorRect.value
  return {
    left: `${r.left}px`,
    top: `${r.bottom + EMAIL_REVEAL.POPUP_GAP_PX}px`
  }
})

const tailStyle = computed(() => {
  if (!anchorRect.value) return {}
  const r = anchorRect.value
  const tailCenterFromPopup = r.width / 2
  return {
    left: `${tailCenterFromPopup - EMAIL_REVEAL.TAIL_HALF_WIDTH_PX}px`
  }
})

function copy() {
  navigator.clipboard.writeText(CONTACT.EMAIL).then(() => setCopied())
}
</script>

<style scoped>
.email-popup {
  transform: translateZ(0);
  backface-visibility: hidden;
}
.email-popup__tail {
  position: absolute;
  top: -6px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid var(--bg-card);
  filter: drop-shadow(0 -1px 0 rgba(24, 183, 164, 0.25));
}
</style>

