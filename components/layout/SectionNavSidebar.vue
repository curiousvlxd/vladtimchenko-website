<template>
  <aside
    class="section-nav-sidebar hidden lg:block w-[11.5rem]"
    role="navigation"
    aria-label="Page sections"
  >
    <div class="nav-panel-card font-sans rounded-2xl border border-teal/20 bg-bg-card/95 backdrop-blur-sm overflow-hidden">
      <LayoutSectionNavTabs
        :sections="sections"
        :active-section="activeSection"
        @scroll-to="$emit('scroll-to', $event)"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  sections: { id: string; label: string }[]
  activeSection: string
}>()

defineEmits<{
  'scroll-to': [id: string]
}>()
</script>

<style scoped>
.section-nav-sidebar {
  position: fixed;
  top: 50%;
  right: max(1rem, calc((100vw - 72rem) / 2 - 1rem));
  transform: translateY(-50%);
  z-index: 30;
}
</style>
