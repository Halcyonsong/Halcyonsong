<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from './components/HeroSection.vue'
import TimelineSection from './components/TimelineSection.vue'
import Contribution3D from './components/Contribution3D.vue'
import SakuraPetals from './components/SakuraPetals.vue'

const contentRef = ref<HTMLElement>()
const sections = ref<HTMLElement[]>([])
const currentSection = ref(0)

function onScroll() {
  if (!contentRef.value) return
  const scrollTop = contentRef.value.scrollTop
  const winHeight = contentRef.value.clientHeight
  currentSection.value = Math.round(scrollTop / winHeight)

  // Fade out sections based on distance from current
  const allSections = contentRef.value.querySelectorAll('.snap-section')
  allSections.forEach((el, i) => {
    const htmlEl = el as HTMLElement
    const distance = Math.abs(i - currentSection.value)
    const progress = scrollTop / winHeight
    const sectionProgress = progress - i
    // Fade and slide
    const opacity = Math.max(0, 1 - Math.abs(sectionProgress) * 0.8)
    const translateY = sectionProgress * -50
    const scale = 1 - Math.abs(sectionProgress) * 0.05
    htmlEl.style.opacity = String(opacity)
    htmlEl.style.transform = `translateY(${translateY}px) scale(${scale})`
    htmlEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
  })
}

onMounted(() => {
  if (contentRef.value) {
    contentRef.value.addEventListener('scroll', onScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (contentRef.value) {
    contentRef.value.removeEventListener('scroll', onScroll)
  }
})
</script>

<template>
  <div class="page">
    <div class="bg-layer"></div>
    <div ref="contentRef" class="content">
      <section class="snap-section"><HeroSection /></section>
      <section class="snap-section"><TimelineSection /></section>
      <section class="snap-section"><Contribution3D /></section>
    </div>
    <SakuraPetals />
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
  background: rgba(0, 0, 0, 0.65);
  z-index: -1;
}

.content {
  position: relative;
  z-index: 1;
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.content::-webkit-scrollbar {
  display: none;
}

.snap-section {
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  overflow: hidden;
  opacity: 1;
  will-change: opacity, transform;
}
</style>
