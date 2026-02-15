<template>
  <div class="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
    <div v-if="isCvRoute" class="mx-auto max-w-5xl">
      <DocumentSkeleton :sections="cvSkeletonSections" />
    </div>

    <div v-else-if="isFeedArticleRoute" class="mx-auto max-w-3xl">
      <FeedArticleSkeleton />
    </div>

    <div v-else-if="isFeedRoute" class="mx-auto max-w-4xl">
      <FeedListSkeleton />
    </div>

    <div v-else class="mx-auto max-w-4xl min-w-0">
      <HomeMainSkeleton />
    </div>
  </div>
</template>

<script setup lang="ts">
import DocumentSkeleton from '~/common/components/ui/skeleton/DocumentSkeleton.vue'
import { CV_SKELETON } from '~/common/constants/ui/skeleton'
import FeedArticleSkeleton from '~/features/feed/components/FeedArticleSkeleton.vue'
import FeedListSkeleton from '~/features/feed/components/FeedListSkeleton.vue'
import HomeMainSkeleton from '~/features/home/components/HomeMainSkeleton.vue'

const props = defineProps<{
  path?: string
}>()

const normalizedPath = computed(() => props.path ?? '/')
const isCvRoute = computed(() => normalizedPath.value.startsWith('/cv'))
const isFeedRoute = computed(() => normalizedPath.value === '/feed')
const isFeedArticleRoute = computed(() => normalizedPath.value.startsWith('/feed/'))

const cvSkeletonSections = [
  { id: 'profile', titleWidth: '4rem' },
  { id: 'skills', titleWidth: '6rem', lines: ['100%'] },
  {
    id: 'experience',
    titleWidth: '7rem',
    entryCount: CV_SKELETON.EXPERIENCE_ENTRY_COUNT
  }
]
</script>
