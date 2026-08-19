<script setup lang="ts">
import HeroSection from './components/HeroSection.vue'
import TimelineSection from './components/TimelineSection.vue'
</script>

<template>
  <div class="page">
    <div class="bg-layer"></div>
    <div class="content">
      <HeroSection />
      <TimelineSection />
    </div>
  </div>
</template>

<style scoped>
.page {
  position: relative;
  min-height: 100vh;
}

.bg-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/background.jpg') center center / cover no-repeat fixed;
  z-index: -2;
}

.bg-layer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.content {
  position: relative;
  z-index: 1;
}
</style>
