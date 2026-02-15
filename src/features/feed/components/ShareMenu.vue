<template>
  <div ref="rootRef" class="relative inline-flex">
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-lg border border-teal/20 bg-teal/5 text-teal-light hover:bg-teal/15 hover:border-teal/30 transition-colors"
      :class="compact ? 'px-2 py-1.5 text-xs font-medium' : 'px-2.5 py-2 text-sm font-medium'"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      @click.stop="toggleMenu"
    >
      <AppIcon name="share" class="h-4 w-4" />
      <span>{{ copied ? 'Copied' : 'Share' }}</span>
    </button>

    <Transition name="share-menu-pop">
      <div
        v-if="isOpen"
        class="fixed bottom-3 left-1/2 -translate-x-1/2 z-[120] rounded-2xl border border-teal/25 bg-bg-card/95 backdrop-blur-sm p-2 shadow-[0_16px_36px_rgba(0,0,0,0.35),0_0_24px_rgba(24,183,164,0.12)] sm:absolute sm:left-auto sm:bottom-auto sm:translate-x-0"
        :class="alignRight ? 'sm:right-0 sm:top-[calc(100%+8px)]' : 'sm:left-0 sm:top-[calc(100%+8px)]'"
        role="menu"
      >
        <div class="flex items-center justify-center gap-2">
          <a
            :href="linkedinHref"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-teal/20 bg-teal/5 text-teal-light hover:bg-teal/15 hover:border-teal/30 transition-colors"
            role="menuitem"
            aria-label="Share on LinkedIn"
            title="LinkedIn"
            @click="closeMenu"
          >
            <AppIcon name="linkedin" class="h-4 w-4" />
            <span class="sr-only">Share on LinkedIn</span>
          </a>
          <a
            :href="xHref"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-teal/20 bg-teal/5 text-teal-light hover:bg-teal/15 hover:border-teal/30 transition-colors"
            role="menuitem"
            aria-label="Share on X"
            title="X"
            @click="closeMenu"
          >
            <AppIcon name="x" class="h-4 w-4" />
            <span class="sr-only">Share on X</span>
          </a>
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-teal/20 bg-teal/5 text-teal-light hover:bg-teal/15 hover:border-teal/30 transition-colors"
            :class="copied ? 'border-teal/35 bg-teal/15 text-teal' : ''"
            role="menuitem"
            :aria-label="copied ? 'Link copied' : 'Copy post link'"
            :title="copied ? 'Copied' : 'Copy link'"
            @click="copyShareText"
          >
            <AppIcon name="copy" class="h-4 w-4" />
            <span class="sr-only">{{ copied ? 'Copied' : 'Copy link' }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  description?: string | null
  url: string
  compact?: boolean
  alignRight?: boolean
}>(), {
  description: '',
  compact: false,
  alignRight: true
})

const isOpen = ref(false)
const copied = ref(false)
const rootRef = ref<HTMLElement | null>(null)
let copiedTimer: ReturnType<typeof setTimeout> | null = null

function normalizeText(value: string | null | undefined): string {
  return value?.replace(/\s+/g, ' ').trim() ?? ''
}

function withEllipsis(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`
}

const shortDescription = computed(() => {
  const normalized = normalizeText(props.description)
  if (!normalized) return 'Short post preview...'
  return withEllipsis(normalized, 112)
})

const shareText = computed(() => {
  const normalizedTitle = normalizeText(props.title)
  const description = shortDescription.value
  return withEllipsis(`${normalizedTitle} - ${description}`, 180)
})

const linkedinHref = computed(() =>
  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}`
)

const xHref = computed(() =>
  `https://twitter.com/intent/tweet?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(shareText.value)}`
)

function closeMenu() {
  isOpen.value = false
}

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function setCopiedState() {
  copied.value = true
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copied.value = false
  }, 1600)
}

function fallbackCopy(text: string): boolean {
  if (!import.meta.client || typeof document === 'undefined') return false
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  const success = document.execCommand('copy')
  document.body.removeChild(textarea)
  return success
}

async function copyShareText() {
  const payload = props.url

  try {
    if (import.meta.client && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(payload)
      setCopiedState()
      closeMenu()
      return
    }
  } catch {
  }

  if (fallbackCopy(payload)) {
    setCopiedState()
    closeMenu()
  }
}

function handlePointerDown(event: PointerEvent) {
  if (!isOpen.value) return
  const target = event.target
  if (!(target instanceof Node)) return
  if (rootRef.value?.contains(target)) return
  closeMenu()
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => {
  document.addEventListener('pointerdown', handlePointerDown)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', handlePointerDown)
  document.removeEventListener('keydown', handleEscape)
  if (copiedTimer) clearTimeout(copiedTimer)
})
</script>

<style scoped>
.share-menu-pop-enter-active,
.share-menu-pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.share-menu-pop-enter-from,
.share-menu-pop-leave-to {
  opacity: 0;
  transform: translateY(-2px);
}
</style>
