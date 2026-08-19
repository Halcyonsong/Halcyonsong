<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Repo {
  name: string
  description: string | null
  created_at: string
  html_url: string
  language: string | null
  stargazers_count: number
}

interface TimelineItem {
  date: string
  title: string
  description: string
  url: string
  stars: number
  language: string | null
  isAbove: boolean
}

const items = ref<TimelineItem[]>([])
const loading = ref(true)
const error = ref(false)
const errorMsg = ref('')

function formatDate(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}.${m}`
}

onMounted(async () => {
  try {
    const res = await fetch('/repos.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const repos: Repo[] = await res.json()
    items.value = repos
      .map((r, i) => ({
        date: formatDate(r.created_at),
        title: r.name,
        description: r.description || 'No description',
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
        isAbove: i % 2 === 0,
      }))
  } catch (e) {
    error.value = true
    if (e instanceof Error) {
      errorMsg.value = e.message
    } else {
      errorMsg.value = 'Unknown error'
    }
    console.error('[Timeline] Fetch failed:', e)
  } finally {
    loading.value = false
  }
})

function scrollByWheel(e: WheelEvent) {
  const container = e.currentTarget as HTMLElement
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.preventDefault()
    container.scrollBy({ left: e.deltaY * 1.5, behavior: 'auto' })
  }
}

function scrollLeft() {
  const container = document.querySelector('.timeline-scroll') as HTMLElement
  if (container) container.scrollBy({ left: -380, behavior: 'smooth' })
}

function scrollRight() {
  const container = document.querySelector('.timeline-scroll') as HTMLElement
  if (container) container.scrollBy({ left: 380, behavior: 'smooth' })
}
</script>

<template>
  <section class="timeline-section">
    <h2 class="section-title">Projects Timeline</h2>

    <div class="timeline-card">
      <button class="scroll-btn left" @click="scrollLeft">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <!-- Loading -->
      <div v-if="loading" class="status-msg">Loading repositories...</div>

      <!-- Error -->
      <div v-else-if="error" class="status-msg">
        <div>Failed to load repository data.</div>
        <div class="error-detail">{{ errorMsg }}</div>
        <div class="error-hint">Run <code>npm run fetch-repos</code> to generate the data file first.</div>
      </div>

      <!-- Timeline -->
      <div
        v-else
        class="timeline-scroll"
        @wheel="scrollByWheel"
      >
        <div class="timeline-track">
          <div class="timeline-line"></div>

          <div
            v-for="(item, i) in items"
            :key="i"
            class="timeline-item"
            :class="{ above: item.isAbove, below: !item.isAbove }"
          >
            <!-- 上方卡片 -->
            <div v-if="item.isAbove" class="card-slot top">
              <div class="timeline-date">{{ item.date }}</div>
              <div class="project-card">
                <div class="project-header">
                  <h3 class="project-title">
                    <a :href="item.url" target="_blank" rel="noopener">{{ item.title }}</a>
                  </h3>
                  <span v-if="item.stars > 0" class="star">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {{ item.stars }}
                  </span>
                </div>
                <p class="project-desc">{{ item.description }}</p>
                <span v-if="item.language" class="lang-tag">{{ item.language }}</span>
              </div>
              <div class="connector"></div>
            </div>

            <!-- 圆点 -->
            <div class="timeline-dot"></div>

            <!-- 下方卡片 -->
            <div v-if="!item.isAbove" class="card-slot bottom">
              <div class="connector"></div>
              <div class="project-card">
                <div class="project-header">
                  <h3 class="project-title">
                    <a :href="item.url" target="_blank" rel="noopener">{{ item.title }}</a>
                  </h3>
                  <span v-if="item.stars > 0" class="star">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {{ item.stars }}
                  </span>
                </div>
                <p class="project-desc">{{ item.description }}</p>
                <span v-if="item.language" class="lang-tag">{{ item.language }}</span>
              </div>
              <div class="timeline-date">{{ item.date }}</div>
            </div>
          </div>
        </div>
      </div>

      <button class="scroll-btn right" @click="scrollRight">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.timeline-section {
  min-height: 100vh;
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 48px;
  opacity: 0.9;
}

.timeline-card {
  position: relative;
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 48px 56px;
  backdrop-filter: blur(12px);
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
  opacity: 0.7;
  color: #ff8888;
  word-break: break-word;
}

.error-hint {
  margin-top: 12px;
  font-size: 0.72rem;
  opacity: 0.4;
}

.error-hint a {
  color: inherit;
  text-decoration: underline;
}

.timeline-scroll {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  padding: 8px 0;
}

.timeline-scroll::-webkit-scrollbar {
  height: 6px;
}

.timeline-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.timeline-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.timeline-track {
  position: relative;
  display: flex;
  gap: 50px;
  min-width: max-content;
  min-height: 380px;
  align-items: center;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.25) 3%,
    rgba(255, 255, 255, 0.25) 97%,
    transparent);
  transform: translateY(-50%);
}

.timeline-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
  flex-shrink: 0;
  min-height: 380px;
}

.timeline-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
  z-index: 1;
  flex-shrink: 0;
}

.card-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: absolute;
  left: 0;
}

.card-slot.top {
  bottom: 50%;
  padding-bottom: 24px;
}

.card-slot.bottom {
  top: 50%;
  padding-top: 24px;
}

.connector {
  width: 1px;
  height: 28px;
  background: linear-gradient(180deg,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1));
}

.timeline-date {
  font-size: 0.82rem;
  font-weight: 600;
  opacity: 0.55;
  margin: 6px 0;
  letter-spacing: 1px;
}

.project-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 18px;
  transition: all 0.3s ease;
}

.project-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.project-title {
  font-size: 1.05rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.project-title a {
  color: inherit;
  text-decoration: none;
  transition: opacity 0.2s;
}

.project-title a:hover {
  opacity: 0.7;
}

.star {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.72rem;
  opacity: 0.55;
  flex-shrink: 0;
}

.project-desc {
  font-size: 0.82rem;
  line-height: 1.5;
  opacity: 0.6;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lang-tag {
  font-size: 0.68rem;
  padding: 2px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  letter-spacing: 0.3px;
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: all 0.2s;
}

.scroll-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
}

.scroll-btn.left {
  left: 12px;
}

.scroll-btn.right {
  right: 12px;
}
</style>
