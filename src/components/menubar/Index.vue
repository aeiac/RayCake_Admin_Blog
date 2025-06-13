<template>	
  <svg style="display: none">
    <!-- 保持你原有的SVG过滤器不变 -->
  </svg>

  <div class="wrapper">
    <a :href="link" target="_blank">
      <div class="liquidGlass-wrapper">
        <div class="liquidGlass-inner">
          <div class="liquidGlass-effect"></div>
          <div class="liquidGlass-tint"></div>
          <div class="liquidGlass-shine"></div>
          <div class="liquidGlass-text">
            <div class="dock">
              <img
                v-for="(icon, index) in icons"
                :key="index"
                :src="icon"
                alt="App Icon"
                @click="goToArticle"
                @mouseenter="hoverIndex = index"
                @mouseleave="hoverIndex = null"
                :style="getIconStyle(index)"
                :class="{ 'hovered': hoverIndex === index }"
              />
            </div>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  icons: {
    type: Array,
    default: () => [
      'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/finder.png',
      'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/map.png',
      'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/messages.png',
      'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/notes.png',
      'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/finder.png',
      'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/map.png',
      'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/messages.png',
      'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/notes.png',
	  'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/map.png',
	  'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/messages.png',
	  'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/notes.png',
	  'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/finder.png',
	  'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/map.png',
	  'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/messages.png',
	  'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/notes.png',
	
    ]
  }
})

const router = useRouter()
const route = useRoute()
const active = ref(false)
const hoverIndex = ref(null)

watch(
  () => route.path,
  (newPath) => {
    active.value = (newPath === '/article')
  },
  { immediate: true }
)

function getIconStyle(index) {
  if (hoverIndex.value === null) return {}
  
  const distance = Math.abs(index - hoverIndex.value)
  if (distance > 3) return {} // 只影响附近的图标
  
  // 基于距离计算缩放比例
  const scale = 1 + (0.6 * (1 - distance * 0.25))
  return {
    transform: `scale(${scale}) translateY(${-15 * (1 - distance * 0.25)}%)`,
    zIndex: 10 - distance,
    transition: `transform ${0.2 + distance * 0.05}s cubic-bezier(0.25, 0.1, 0.25, 1.5)`
  }
}

function goToArticle() {
  if (route.path === '/article' && active.value) {
    router.push('/')
    active.value = false
  } else {
    router.push('/article')
    active.value = true
  }
}
</script>


<style scoped>
.wrapper {
  position: fixed;
  bottom: 2vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.liquidGlass-wrapper {
  position: relative;
  display: flex;
  font-weight: 600;
  color: black;
  cursor: pointer;
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
  width: auto;
  border-radius: 0 20px 20px 0;
  overflow: visible;
  z-index: 1;
}

.liquidGlass-effect,
.liquidGlass-tint,
.liquidGlass-shine {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  border-radius: 0 20px 20px 0;
}

.liquidGlass-effect {
  backdrop-filter: blur(3px);
  filter: url(#glass-distortion);
}

.liquidGlass-tint {
  background: rgba(255, 255, 255, 0.25);
}

.liquidGlass-shine {
  box-shadow: inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5),
              inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5);
}

.liquidGlass-text {
  z-index: 1;
  font-size: 2rem;
  color: black;
}

.dock {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  user-select: none;
  padding: 1vh 1vw;
  gap: clamp(1vw, 3vw, 40px);
  max-width: 95vw;
  flex-wrap: wrap;
  touch-action: pan-x;
}

.dock img {
  width: clamp(25px, 5vw, 55px);
  height: auto;
  position: relative;
  border-radius: 1rem;
  transition: transform 0.3s ease, filter 0.3s ease;
  will-change: transform, filter;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  z-index: 1;
}

.dock img:hover {
  transform: scale(1.6) translateY(-15%);
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
  z-index: 10;
}
.dock img {
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.5), 
              filter 0.3s ease;
  will-change: transform, filter;
}

.dock img.hovered {
  transform: scale(1.6) translateY(-15%);
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
  z-index: 10;
}
</style>
