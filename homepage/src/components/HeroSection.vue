<script setup lang="ts">
import FloatingOrbs from './FloatingOrbs.vue'
import ScrollHint from './ScrollHint.vue'

const avatarUrl = 'https://avatars.githubusercontent.com/Halcyonsong'
</script>

<template>
  <section class="hero">
    <FloatingOrbs />

    <div class="avatar-wrapper">
      <img :src="avatarUrl" alt="Halcyonsong" class="avatar" />
    </div>

    <h1 class="name">Halcyonsong</h1>
    <p class="tagline">Java &amp; AI Full-Stack Engineer</p>

    <ScrollHint />
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  position: relative;
}

.avatar-wrapper {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.2);
  margin-bottom: 28px;
  animation: avatarFloatIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 12px;
  animation: fadeInUp 0.8s ease 0.8s both;
}

.tagline {
  font-size: 1.2rem;
  opacity: 0.8;
  letter-spacing: 1px;
  animation: fadeInUp 0.8s ease 1.2s both;
}

@keyframes avatarFloatIn {
  0% {
    transform: translateY(120vh) scale(0.5);
    opacity: 0;
  }
  60% {
    transform: translateY(-20px) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
