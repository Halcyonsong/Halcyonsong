<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Petal {
  id: number
  startLeft: number
  delay: number
  fallDuration: number
  swayDuration: number
  size: number
  driftX: number
  swayAmplitude: number
  rotateStart: number
  rotateTotal: number
  opacity: number
  blur: number
}

const petals = ref<Petal[]>([])
const PETAL_COUNT = 45
let idCounter = 0

function createPetal(): Petal {
  // 整个上方（-10%~100%）+ 右侧（100%~120%）都生成
  const startLeft = -10 + Math.random() * 130 // -10%~120%
  const size = 8 + Math.random() * 20
  const isNear = size > 20
  // 漂移距离与起始位置相关：越靠左漂移越少，越靠右漂移越多
  const driftRatio = 0.3 + Math.random() * 0.5
  return {
    id: idCounter++,
    startLeft,
    delay: Math.random() * 20,
    fallDuration: 8 + Math.random() * 12,
    swayDuration: 2 + Math.random() * 3,
    size,
    driftX: -(window.innerWidth * driftRatio + Math.random() * 200),
    swayAmplitude: 20 + Math.random() * 45,
    rotateStart: Math.random() * 360,
    rotateTotal: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360),
    opacity: isNear ? 0.7 + Math.random() * 0.2 : 0.3 + Math.random() * 0.3,
    blur: isNear ? 0 : 1 + Math.random() * 2,
  }
}

onMounted(() => {
  petals.value = Array.from({ length: PETAL_COUNT }, () => createPetal())
})
</script>

<template>
  <div class="sakura-container">
    <div
      v-for="petal in petals"
      :key="petal.id"
      class="petal-fall"
      :style="{
        '--start-left': petal.startLeft + 'vw',
        '--delay': petal.delay + 's',
        '--fall-duration': petal.fallDuration + 's',
        '--sway-duration': petal.swayDuration + 's',
        '--size': petal.size + 'px',
        '--drift-x': petal.driftX + 'px',
        '--sway-amp': petal.swayAmplitude + 'px',
        '--rotate-start': petal.rotateStart + 'deg',
        '--rotate-total': petal.rotateTotal + 'deg',
        '--opacity': petal.opacity,
        '--blur': petal.blur + 'px',
      }"
    >
      <div class="petal-sway">
        <div class="petal-shape"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sakura-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 50;
}

/* 第一层：下落轨迹（右上→左下对角线）+ 透明度淡入淡出 */
.petal-fall {
  position: absolute;
  top: -30px;
  left: var(--start-left);
  width: var(--size);
  height: var(--size);
  opacity: 0;
  filter: blur(var(--blur));
  animation: petalFall var(--fall-duration) cubic-bezier(0.25, 0.45, 0.6, 1) var(--delay) infinite;
}

@keyframes petalFall {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  8% {
    opacity: var(--opacity);
  }
  45% {
    transform: translate(calc(var(--drift-x) * 0.45), 45vh);
    opacity: var(--opacity);
  }
  85% {
    transform: translate(calc(var(--drift-x) * 0.88), 92vh);
    opacity: calc(var(--opacity) * 0.5);
  }
  100% {
    transform: translate(var(--drift-x), 115vh);
    opacity: 0;
  }
}

/* 第二层：左右摇摆（模拟风的不规则吹动） */
.petal-sway {
  width: 100%;
  height: 100%;
  animation: petalSway var(--sway-duration) ease-in-out var(--delay) infinite;
}

@keyframes petalSway {
  0% {
    transform: translateX(0) rotate(var(--rotate-start));
  }
  25% {
    transform: translateX(var(--sway-amp)) rotate(calc(var(--rotate-start) + var(--rotate-total) * 0.25));
  }
  50% {
    transform: translateX(calc(var(--sway-amp) * -0.6)) rotate(calc(var(--rotate-start) + var(--rotate-total) * 0.5));
  }
  75% {
    transform: translateX(calc(var(--sway-amp) * 0.8)) rotate(calc(var(--rotate-start) + var(--rotate-total) * 0.75));
  }
  100% {
    transform: translateX(0) rotate(calc(var(--rotate-start) + var(--rotate-total)));
  }
}

/* 第三层：花瓣形状 */
.petal-shape {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg,
    rgba(255, 210, 220, 0.9),
    rgba(255, 170, 190, 0.75));
  border-radius: 150% 0 150% 0 / 150% 0 150% 0;
  box-shadow:
    inset -2px -2px 4px rgba(220, 120, 150, 0.25),
    inset 1px 1px 2px rgba(255, 255, 255, 0.4),
    0 0 6px rgba(255, 183, 197, 0.15);
}

/* 小花瓣额外加个缺口效果，更像真实樱花 */
.petal-shape::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 15%;
  width: 20%;
  height: 20%;
  background: transparent;
  border-radius: 50%;
  box-shadow: inset 1px 1px 3px rgba(200, 100, 130, 0.2);
}
</style>
