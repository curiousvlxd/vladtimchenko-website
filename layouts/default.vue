<template>
  <div class="min-h-screen flex flex-col bg-bg overflow-x-hidden">
    <LayoutHeader />
    <main class="flex-1 pt-14 sm:pt-20" style="padding-bottom: calc(5rem + env(safe-area-inset-bottom, 0px));">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
