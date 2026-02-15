<template>
  <div
    v-if="resolvedItems.length"
    class="not-prose relative left-1/2 my-8 w-[calc(100vw-1.5rem)] max-w-[1120px] -translate-x-1/2 sm:w-[calc(100vw-3rem)]"
    :aria-label="label"
  >
    <div class="group relative">
      <img
        :src="current.src"
        :alt="current.alt"
        loading="lazy"
        class="block h-auto w-full cursor-zoom-in rounded-2xl border border-teal/20 shadow-[0_0_0_1px_rgba(24,183,164,0.08)] transition-[border-color,box-shadow] duration-200 group-hover:border-teal/35 group-hover:shadow-[0_0_28px_rgba(24,183,164,0.2)]"
      >

      <button
        type="button"
        class="absolute left-2 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-teal/35 bg-bg/75 text-muted-light shadow-md backdrop-blur-sm transition-colors hover:border-teal hover:text-teal-light disabled:cursor-not-allowed disabled:opacity-40 sm:left-3"
        :disabled="resolvedItems.length < 2"
        aria-label="Previous screenshot"
        @click="prev"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        class="absolute right-2 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-teal/35 bg-bg/75 text-muted-light shadow-md backdrop-blur-sm transition-colors hover:border-teal hover:text-teal-light disabled:cursor-not-allowed disabled:opacity-40 sm:right-3"
        :disabled="resolvedItems.length < 2"
        aria-label="Next screenshot"
        @click="next"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div v-if="resolvedItems.length > 1" class="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-teal/20 bg-bg/70 px-2 py-1 backdrop-blur-sm sm:bottom-3">
        <button
          v-for="(item, i) in resolvedItems"
          :key="`${item.src}-${i}`"
          type="button"
          class="h-2 w-2 rounded-full transition-all"
          :class="i === index ? 'bg-teal' : 'bg-muted/60 hover:bg-muted-light/70'"
          :aria-label="`Go to screenshot ${i + 1}`"
          :aria-current="i === index ? 'true' : undefined"
          @click="goTo(i)"
        />
      </div>
    </div>

    <p v-if="current.caption" class="mt-3 px-1 text-xs leading-relaxed text-muted-light sm:text-sm">
      {{ current.caption }}
    </p>

    <slot />
  </div>
</template>

<script setup lang="ts">
type CarouselItem = {
  src: string
  alt: string
  caption?: string
}

const PRESET_ITEMS: Record<string, CarouselItem[]> = {
  'smtp-setup': [
    {
      src: '/feed/smtp-is-not-an-identity-protocol/cloudflare-email-routing-custom-addresses.png',
      alt: 'Cloudflare Email Routing custom address forwarding to Gmail',
      caption: 'Cloudflare Email Routing: inbound mail for contact@vladtimchenko.dev goes to Gmail.'
    },
    {
      src: '/feed/smtp-is-not-an-identity-protocol/gmail-send-mail-as-mailjet-smtp.png',
      alt: 'Gmail Send mail as using Mailjet SMTP',
      caption: 'Gmail Send mail as: outbound uses Mailjet SMTP for domain sending.'
    },
    {
      src: '/feed/smtp-is-not-an-identity-protocol/mailjet-domain-status-active.png',
      alt: 'Mailjet verified domain status active',
      caption: 'Mailjet domain is verified and active for outbound DKIM signing.'
    },
    {
      src: '/feed/smtp-is-not-an-identity-protocol/spf-dkim-checks-passed.png',
      alt: 'SPF and DKIM checks passed',
      caption: 'SPF and DKIM checks both pass.'
    }
  ]
}

function isCarouselItem(value: unknown): value is CarouselItem {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.src === 'string' && typeof candidate.alt === 'string'
}

function normalizeItems(value: unknown): CarouselItem[] {
  if (!Array.isArray(value)) return []
  return value
    .filter(isCarouselItem)
    .map((item) => ({
      src: item.src,
      alt: item.alt,
      caption: typeof item.caption === 'string' ? item.caption : undefined
    }))
}

const props = withDefaults(
  defineProps<{
    items?: CarouselItem[] | string
    preset?: string
    label?: string
  }>(),
  {
    items: undefined,
    preset: '',
    label: 'Setup screenshots'
  }
)

const index = ref(0)

const resolvedItems = computed<CarouselItem[]>(() => {
  const presetItems = props.preset ? PRESET_ITEMS[props.preset] : undefined
  if (presetItems?.length) return presetItems

  if (Array.isArray(props.items)) {
    return normalizeItems(props.items)
  }

  if (typeof props.items === 'string') {
    const raw = props.items.trim()
    if (!raw) return []
    try {
      return normalizeItems(JSON.parse(raw))
    } catch {
      return []
    }
  }

  return []
})

const current = computed(() => resolvedItems.value[index.value] ?? resolvedItems.value[0])

function goTo(nextIndex: number) {
  if (!resolvedItems.value.length) return
  const total = resolvedItems.value.length
  index.value = (nextIndex + total) % total
}

function next() {
  goTo(index.value + 1)
}

function prev() {
  goTo(index.value - 1)
}

watch(
  () => resolvedItems.value.length,
  () => {
    index.value = 0
  }
)
</script>
