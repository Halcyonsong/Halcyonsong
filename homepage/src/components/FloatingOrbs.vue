<script setup lang="ts">
interface OrbData {
  label: string
  color: string
  angle: number
  distance: number
  size: number
  delay: number
  floatDuration: number
  opacityDuration: number
  scaleDuration: number
}

// 核心球：Java 生态 + 数据库，持续展示，透明度 0.3~0.7
const coreOrbs: OrbData[] = [
  { label: 'Java',         color: '#ED8B00', angle: 8,   distance: 260, size: 78, delay: 0.00, floatDuration: 7.5, opacityDuration: 6,   scaleDuration: 5 },
  { label: 'Spring',       color: '#6DB33F', angle: 38,  distance: 320, size: 66, delay: 0.08, floatDuration: 8,   opacityDuration: 7,   scaleDuration: 6 },
  { label: 'Spring Boot',  color: '#6DB33F', angle: 65,  distance: 285, size: 70, delay: 0.16, floatDuration: 7,   opacityDuration: 6.5, scaleDuration: 5.5 },
  { label: 'Spring Cloud', color: '#6DB33F', angle: 95,  distance: 350, size: 62, delay: 0.12, floatDuration: 8.5, opacityDuration: 7.5, scaleDuration: 6 },
  { label: 'Spring AI',    color: '#6DB33F', angle: 122, distance: 300, size: 58, delay: 0.20, floatDuration: 7.5, opacityDuration: 6,   scaleDuration: 5 },
  { label: 'Nacos',        color: '#00C1DE', angle: 150, distance: 340, size: 60, delay: 0.24, floatDuration: 8,   opacityDuration: 7,   scaleDuration: 6 },
  { label: 'Gateway',      color: '#00C1DE', angle: 178, distance: 275, size: 56, delay: 0.04, floatDuration: 7,   opacityDuration: 6.5, scaleDuration: 5.5 },
  { label: 'Sentinel',     color: '#00C1DE', angle: 208, distance: 330, size: 54, delay: 0.18, floatDuration: 8.5, opacityDuration: 7,   scaleDuration: 5.5 },
  { label: 'Seata',        color: '#00C1DE', angle: 238, distance: 295, size: 52, delay: 0.28, floatDuration: 7,   opacityDuration: 6,   scaleDuration: 5 },
  { label: 'Redis',        color: '#DC382D', angle: 268, distance: 360, size: 64, delay: 0.10, floatDuration: 8,   opacityDuration: 7,   scaleDuration: 6 },
  { label: 'MySQL',        color: '#4479A1', angle: 298, distance: 310, size: 72, delay: 0.22, floatDuration: 7.5, opacityDuration: 6.5, scaleDuration: 5.5 },
  { label: 'SQLite',       color: '#003B57', angle: 328, distance: 325, size: 50, delay: 0.14, floatDuration: 8.5, opacityDuration: 7.5, scaleDuration: 6 },
]

// 非核心球：有时完全消失再出现，透明度 0~0.6
const nonCoreOrbs: OrbData[] = [
  { label: 'C++',       color: '#00599C', angle: 22,  distance: 400, size: 56, delay: 0.35, floatDuration: 8,   opacityDuration: 11,  scaleDuration: 5.5 },
  { label: 'Python',    color: '#3776AB', angle: 52,  distance: 385, size: 60, delay: 0.42, floatDuration: 7.5, opacityDuration: 10,  scaleDuration: 6 },
  { label: 'FastAPI',   color: '#009688', angle: 108, distance: 420, size: 52, delay: 0.50, floatDuration: 8.5, opacityDuration: 12,  scaleDuration: 5 },
  { label: 'LangChain', color: '#2C3E50', angle: 138, distance: 390, size: 50, delay: 0.38, floatDuration: 7,   opacityDuration: 11.5, scaleDuration: 6 },
  { label: 'Django',    color: '#0C4B33', angle: 165, distance: 410, size: 54, delay: 0.46, floatDuration: 8,   opacityDuration: 10.5, scaleDuration: 5.5 },
  { label: 'ES',        color: '#005571', angle: 195, distance: 400, size: 52, delay: 0.52, floatDuration: 7.5, opacityDuration: 12,  scaleDuration: 6 },
  { label: 'Docker',    color: '#2496ED', angle: 225, distance: 380, size: 58, delay: 0.40, floatDuration: 8.5, opacityDuration: 11,  scaleDuration: 5.5 },
  { label: 'Git',       color: '#C73E1D', angle: 285, distance: 415, size: 54, delay: 0.36, floatDuration: 7,   opacityDuration: 10,  scaleDuration: 6 },
  { label: 'Linux',     color: '#E8B923', angle: 318, distance: 395, size: 50, delay: 0.48, floatDuration: 8,   opacityDuration: 12,  scaleDuration: 5 },
]
</script>

<template>
  <div class="orbs-container">
    <!-- 核心球 -->
    <div
      v-for="(orb, i) in coreOrbs"
      :key="'core-' + i"
      class="orb-wrapper"
      :style="{
        '--angle': orb.angle + 'deg',
        '--distance': orb.distance + 'px',
        '--size': orb.size + 'px',
        '--delay': orb.delay + 's',
        '--float-duration': orb.floatDuration + 's',
        '--opacity-duration': orb.opacityDuration + 's',
        '--scale-duration': orb.scaleDuration + 's',
        '--color': orb.color,
      }"
    >
      <div class="orb-float">
        <div class="orb core-orb">
          <span class="orb-label">{{ orb.label }}</span>
        </div>
      </div>
    </div>

    <!-- 非核心球 -->
    <div
      v-for="(orb, i) in nonCoreOrbs"
      :key="'non-' + i"
      class="orb-wrapper"
      :style="{
        '--angle': orb.angle + 'deg',
        '--distance': orb.distance + 'px',
        '--size': orb.size + 'px',
        '--delay': orb.delay + 's',
        '--float-duration': orb.floatDuration + 's',
        '--opacity-duration': orb.opacityDuration + 's',
        '--scale-duration': orb.scaleDuration + 's',
        '--color': orb.color,
      }"
    >
      <div class="orb-float">
        <div class="orb non-core-orb">
          <span class="orb-label">{{ orb.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orbs-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 0;
}

/* ===== 定位层：从头像中心弹出 ===== */
.orb-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%)
    rotate(var(--angle))
    translateX(var(--distance))
    rotate(calc(-1 * var(--angle)));
  animation: orbPopOut 1.1s cubic-bezier(0.22, 1, 0.36, 1) var(--delay) both;
}

@keyframes orbPopOut {
  0% {
    transform: translate(-50%, -50%)
      rotate(var(--angle))
      translateX(0px)
      rotate(calc(-1 * var(--angle)));
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%)
      rotate(var(--angle))
      translateX(var(--distance))
      rotate(calc(-1 * var(--angle)));
    opacity: 1;
  }
}

/* ===== 浮动层：气泡式缓慢漂浮 ===== */
.orb-float {
  animation: orbFloat var(--float-duration) ease-in-out
    calc(var(--delay) + 1.1s) infinite;
}

@keyframes orbFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-14px) translateX(7px);
  }
  50% {
    transform: translateY(-7px) translateX(-9px);
  }
  75% {
    transform: translateY(-16px) translateX(5px);
  }
}

/* ===== 球体层：透明度 + 缩放 + 光晕 ===== */
.orb {
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%,
    color-mix(in srgb, var(--color) 55%, white),
    var(--color));
  display: flex;
  align-items: center;
  justify-content: center;
  scale: 0;
  animation: orbScalePop 1.1s ease var(--delay) both;
}

@keyframes orbScalePop {
  0%   { scale: 0; }
  60%  { scale: 1.15; }
  100% { scale: 1; }
}

/* 核心球：透明度 0.3~0.7，温和缩放，永不消失 */
.core-orb {
  animation:
    orbScalePop 1.1s ease var(--delay) both,
    orbOpacityCore var(--opacity-duration) ease-in-out
      calc(var(--delay) + 1.1s) infinite,
    orbScaleCore var(--scale-duration) ease-in-out
      calc(var(--delay) + 1.1s) infinite,
    orbGlow var(--scale-duration) ease-in-out
      calc(var(--delay) + 1.1s) infinite;
}

@keyframes orbOpacityCore {
  0%, 100% { opacity: 0.7; }
  50%      { opacity: 0.3; }
}

@keyframes orbScaleCore {
  0%, 100% { scale: 0.96; }
  50%      { scale: 1.06; }
}

/* 非核心球：透明度 0~0.6，有时完全消失停留再出现 */
.non-core-orb {
  animation:
    orbScalePop 1.1s ease var(--delay) both,
    orbOpacityNonCore var(--opacity-duration) ease-in-out
      calc(var(--delay) + 1.1s) infinite,
    orbScaleNonCore var(--scale-duration) ease-in-out
      calc(var(--delay) + 1.1s) infinite,
    orbGlow var(--scale-duration) ease-in-out
      calc(var(--delay) + 1.1s) infinite;
}

@keyframes orbOpacityNonCore {
  0%   { opacity: 0.6; }
  20%  { opacity: 0.45; }
  30%  { opacity: 0.15; }
  35%  { opacity: 0; }
  50%  { opacity: 0; }
  58%  { opacity: 0.08; }
  70%  { opacity: 0.35; }
  85%  { opacity: 0.55; }
  100% { opacity: 0.6; }
}

@keyframes orbScaleNonCore {
  0%, 100% { scale: 0.94; }
  50%      { scale: 1.08; }
}

/* 光晕 */
@keyframes orbGlow {
  0%, 100% {
    box-shadow:
      0 0 15px color-mix(in srgb, var(--color) 25%, transparent),
      inset 0 0 12px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow:
      0 0 35px color-mix(in srgb, var(--color) 55%, transparent),
      inset 0 0 20px rgba(255, 255, 255, 0.2);
  }
}

.orb-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  white-space: nowrap;
  letter-spacing: 0.5px;
}
</style>
