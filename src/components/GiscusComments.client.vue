<template>
  <Giscus
    :repo="repo"
    :repo-id="repoId"
    :category="category"
    :category-id="categoryId"
    :mapping="mapping"
    :term="term"
    :strict="strict"
    :reactions-enabled="reactionsEnabled"
    :emit-metadata="emitMetadata"
    :input-position="inputPosition"
    :theme="theme"
    :lang="lang"
  />
</template>

<script setup lang="ts">

import Giscus from '@giscus/vue'
import type {
  AvailableLanguage,
  BooleanString,
  InputPosition,
  Mapping,
  Repo,
  Theme
} from '@giscus/vue'

withDefaults(
  defineProps<{
    repo: Repo
    repoId: string
    category?: string
    categoryId?: string
    mapping?: Mapping
    term?: string
    strict?: BooleanString
    reactionsEnabled?: BooleanString
    emitMetadata?: BooleanString
    inputPosition?: InputPosition
    theme?: Theme
    lang?: AvailableLanguage
  }>(),
  {
    mapping: 'specific',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    lang: 'en'
  }
)
</script>
