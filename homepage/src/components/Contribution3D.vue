<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement>()
const loading = ref(true)
const error = ref(false)
const errorMsg = ref('')
const stats = ref({ total: 0, bestDay: 0, days: 0 })

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let animationId: number
let isDragging = false
let prevMouseX = 0
let prevMouseY = 0
let rotationY = 0.6
let rotationX = 0.5
let targetRotationY = 0.6
let targetRotationX = 0.5
let autoRotate = true

interface DayData {
  date: string
  count: number
}

function generateMockData(): DayData[] {
  // 53 weeks x 7 days
  const data: DayData[] = []
  const today = new Date()
  const start = new Date(today)
  start.setDate(start.getDate() - 364)

  for (let i = 0; i < 365; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const isWeekend = d.getDay() === 0 || d.getDay() === 6
    const base = isWeekend ? 0.3 : 0.6
    const random = Math.random()
    const count = random < base ? 0 : Math.floor(Math.random() * 8) + 1
    data.push({
      date: d.toISOString().slice(0, 10),
      count,
    })
  }
  return data
}

async function loadData(): Promise<DayData[]> {
  try {
    const res = await fetch('/contributions.json')
    if (res.ok) {
      const json = await res.json()
      if (json.days && Array.isArray(json.days)) {
        return json.days
      }
    }
  } catch {
    // fall through to mock
  }
  return generateMockData()
}

function getColor(count: number): THREE.Color {
  if (count === 0) return new THREE.Color(0x1a1a2e)
  if (count <= 2) return new THREE.Color(0x0e4429)
  if (count <= 4) return new THREE.Color(0x006d32)
  if (count <= 6) return new THREE.Color(0x26a641)
  return new THREE.Color(0x39d353)
}

function init(data: DayData[]) {
  const canvas = canvasRef.value
  if (!canvas) return

  const width = canvas.parentElement?.clientWidth || window.innerWidth
  const height = canvas.parentElement?.clientHeight || window.innerHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000)
  camera.position.set(0, 80, 120)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(50, 100, 50)
  scene.add(dirLight)

  // Contribution bars
  const weeks = 53
  const days = 7
  const barSize = 2.2
  const gap = 0.4
  const step = barSize + gap
  const offsetX = -(weeks * step) / 2
  const offsetZ = -(days * step) / 2

  const group = new THREE.Group()

  let total = 0
  let bestDay = 0
  let activeDays = 0

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const idx = w * days + d
      if (idx >= data.length) break
      const dayData = data[idx]
      const count = dayData.count
      const height = count === 0 ? 0.3 : Math.max(0.5, count * 1.5)

      if (count > 0) {
        total += count
        activeDays++
        if (count > bestDay) bestDay = count
      }

      const geometry = new THREE.BoxGeometry(barSize, height, barSize)
      const material = new THREE.MeshLambertMaterial({
        color: getColor(count),
        transparent: count === 0,
        opacity: count === 0 ? 0.3 : 1,
      })
      const bar = new THREE.Mesh(geometry, material)
      bar.position.set(
        offsetX + w * step,
        height / 2,
        offsetZ + d * step,
      )
      bar.userData = { dayData, finalHeight: height }
      group.add(bar)
    }
  }

  // Animate bars growing
  const bars = group.children as THREE.Mesh[]
  bars.forEach((bar, i) => {
    const finalY = bar.position.y
    const finalScale = bar.scale.y
    bar.scale.y = 0.01
    bar.position.y = 0.01 / 2

    setTimeout(() => {
      const growDuration = 400
      const startTime = performance.now()
      const animate = () => {
        const elapsed = performance.now() - startTime
        const t = Math.min(elapsed / growDuration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        const s = Math.max(0.01, eased * finalScale)
        bar.scale.y = s
        bar.position.y = (s * finalY) / finalScale
        if (t < 1) requestAnimationFrame(animate)
      }
      animate()
    }, i * 8)
  })

  scene.add(group)
  stats.value = { total, bestDay, days: activeDays }

  // Mouse controls
  canvas.addEventListener('mousedown', onMouseDown)
  canvas.addEventListener('mousemove', onMouseMove)
  canvas.addEventListener('mouseup', onMouseUp)
  canvas.addEventListener('mouseleave', onMouseUp)
  canvas.addEventListener('wheel', onWheel, { passive: false })

  // Touch controls
  canvas.addEventListener('touchstart', onTouchStart, { passive: false })
  canvas.addEventListener('touchmove', onTouchMove, { passive: false })
  canvas.addEventListener('touchend', onMouseUp)

  window.addEventListener('resize', onResize)
  animate()
}

function onMouseDown(e: MouseEvent) {
  isDragging = true
  autoRotate = false
  prevMouseX = e.clientX
  prevMouseY = e.clientY
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging) return
  const dx = e.clientX - prevMouseX
  const dy = e.clientY - prevMouseY
  targetRotationY += dx * 0.005
  targetRotationX = Math.max(0.05, Math.min(1.4, targetRotationX + dy * 0.005))
  prevMouseX = e.clientX
  prevMouseY = e.clientY
}

function onMouseUp() {
  isDragging = false
  // Resume auto-rotate after 3s
  setTimeout(() => { if (!isDragging) autoRotate = true }, 3000)
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    isDragging = true
    autoRotate = false
    prevMouseX = e.touches[0].clientX
    prevMouseY = e.touches[0].clientY
    e.preventDefault()
  }
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging || e.touches.length !== 1) return
  const dx = e.touches[0].clientX - prevMouseX
  const dy = e.touches[0].clientY - prevMouseY
  targetRotationY += dx * 0.005
  targetRotationX = Math.max(0.05, Math.min(1.4, targetRotationX + dy * 0.005))
  prevMouseX = e.touches[0].clientX
  prevMouseY = e.touches[0].clientY
  e.preventDefault()
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 1.1 : 0.9
  camera.position.multiplyScalar(delta)
  const dist = camera.position.length()
  if (dist < 60) camera.position.normalize().multiplyScalar(60)
  if (dist > 300) camera.position.normalize().multiplyScalar(300)
}

function onResize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const width = canvas.parentElement?.clientWidth || window.innerWidth
  const height = canvas.parentElement?.clientHeight || window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function animate() {
  animationId = requestAnimationFrame(animate)
  if (autoRotate) {
    targetRotationY += 0.003
  }
  rotationY += (targetRotationY - rotationY) * 0.1
  rotationX += (targetRotationX - rotationX) * 0.1

  // Rotate scene around center
  const radius = camera.position.length()
  const phi = rotationX
  const theta = rotationY
  camera.position.x = radius * Math.sin(phi) * Math.sin(theta)
  camera.position.y = radius * Math.cos(phi)
  camera.position.z = radius * Math.sin(phi) * Math.cos(theta)
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
}

onMounted(async () => {
  try {
    const data = await loadData()
    loading.value = false
    await nextTick()
    init(data)
  } catch (e) {
    error.value = true
    errorMsg.value = e instanceof Error ? e.message : 'Unknown error'
    loading.value = false
  }
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section class="contrib-section">
    <h2 class="section-title">Contribution Graph</h2>

    <div class="card-frame">
      <div v-if="loading" class="status-msg">Loading 3D contribution graph...</div>

      <div v-else-if="error" class="status-msg">
        <div>Failed to load 3D graph.</div>
        <div class="error-detail">{{ errorMsg }}</div>
      </div>

      <div v-else class="canvas-wrapper">
        <canvas ref="canvasRef" class="contrib-canvas"></canvas>

        <div class="stats-overlay">
          <div class="stat-item">
            <span class="stat-value">{{ stats.total }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.days }}</span>
            <span class="stat-label">Active Days</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.bestDay }}</span>
            <span class="stat-label">Best Day</span>
          </div>
        </div>

        <div class="hint-overlay">
          Drag to rotate · Scroll to zoom
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contrib-section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 24px;
  opacity: 0.9;
}

.status-msg {
  text-align: center;
  padding: 60px 0;
  opacity: 0.5;
  font-size: 0.9rem;
}

.error-detail {
  margin-top: 8px;
  font-size: 0.78rem;
  color: #ff8888;
}

.card-frame {
  width: 90%;
  max-width: 1200px;
  height: 72vh;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.15);
}

.contrib-canvas {
  width: 100%;
  height: 100%;
  cursor: grab;
}

.contrib-canvas:active {
  cursor: grabbing;
}

.stats-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 24px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #39d353;
}

.stat-label {
  font-size: 0.65rem;
  opacity: 0.5;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.hint-overlay {
  position: absolute;
  bottom: 16px;
  right: 20px;
  font-size: 0.7rem;
  opacity: 0.35;
  letter-spacing: 1px;
}
</style>
