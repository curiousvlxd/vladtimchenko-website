<template>
  <div class="error-layout min-h-screen flex flex-col overflow-x-hidden">
    <main class="flex-1 flex flex-col items-center justify-center relative z-0">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.error-layout {
  background-color: var(--bg);
}
.error-layout::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background: radial-gradient(
    ellipse 140% 100% at 60% 30%,
    rgba(24, 183, 164, 0.06) 0%,
    transparent 55%
  );
  filter: blur(80px);
  animation: error-bg-drift 22s ease-in-out infinite;
  pointer-events: none;
}
@media (max-width: 1023px) {
  .error-layout::before {
    filter: blur(40px);
    animation: none;
  }
}
@keyframes error-bg-drift {
  0%, 100% { opacity: 1; transform: scale(1) translate(0, 0); }
  50% { opacity: 0.9; transform: scale(1.04) translate(-2%, 0); }
}
</style>
