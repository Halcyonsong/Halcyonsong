<script setup lang="ts">
</script>

<template>
  <div class="scroll-hint">
    <span class="hint-text">Scroll</span>
    <div class="mouse">
      <div class="wheel"></div>
    </div>
  </div>
</template>

<style scoped>
.scroll-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: fadeIn 1s ease 2s both;
}

.hint-text {
  font-size: 0.7rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.6;
}

.mouse {
  width: 24px;
  height: 38px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.wheel {
  width: 4px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2px;
  animation: wheelMove 1.8s ease-in-out infinite;
}

@keyframes wheelMove {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(12px);
    opacity: 0;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
