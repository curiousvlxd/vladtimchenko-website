<template>
  <Transition name="modal-loader-fade">
    <div
      v-if="show"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-[#0d1218]"
      aria-hidden="true"
    >
      <img
        :src="logoSrc"
        alt=""
        width="80"
        height="80"
        class="shrink-0 opacity-90"
        style="width: 80px; height: 80px; object-fit: contain;"
      >
      <div class="w-40 sm:w-52 h-1 rounded-full bg-bg-card overflow-hidden">
        <div class="h-full rounded-full bg-teal modal-loader-bar" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ASSETS } from '~/common/constants'

defineProps<{
  show: boolean
}>()

const logoSrc = ASSETS.LOGO
</script>

<style scoped>
.modal-loader-bar {
  animation: modal-loader 1.2s ease-in-out infinite;
  width: 40%;
}

@keyframes modal-loader {
  0% {
    transform: translateX(-100%);
  }

  50% {
    transform: translateX(150%);
  }

  100% {
    transform: translateX(-100%);
  }
}

.modal-loader-fade-enter-active,
.modal-loader-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-loader-fade-enter-from,
.modal-loader-fade-leave-to {
  opacity: 0;
}
</style>
