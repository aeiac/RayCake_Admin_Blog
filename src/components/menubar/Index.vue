<template>
  <svg style="display: none">
    <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
      <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lighting-color="white" result="specLight">
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
      <feDisplacementMap in="SourceGraphic" in2="softMap" scale="200" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>

  <div class="wrapper">
    <div class="liquidGlass-wrapper">
      <div class="liquidGlass-inner">
        <div class="liquidGlass-effect"></div>
        <div class="liquidGlass-tint"></div>
        <div class="liquidGlass-shine"></div>
        <div class="liquidGlass-text">
          <div class="dock">
            <template v-for="(icon, index) in icons" :key="index">
              <div class="icon-container">
                <img
                  :src="icon"
                  alt="App Icon"
                  @click="handleClick(index)"
                  @mouseenter="hoverIndex = index"
                  @mouseleave="hoverIndex = null"
                  :style="getIconStyle(index)"
                  :class="{ hovered: hoverIndex === index }"
                />
                <div v-show="clickedIndices.includes(index)" class="dot-indicator"></div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  icons: {
    type: Array,
    default: () => [
      'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/finder.png',
      'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/map.png',
      'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/messages.png',
      'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/notes.png'
    ]
  },
  clickedIndices: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['icon-click', 'icon-close'])

const hoverIndex = ref(null)

function getIconStyle(index) {
  if (hoverIndex.value === null) return {}
  const distance = Math.abs(index - hoverIndex.value)
  if (distance > 3) return {}
  const scale = 1 + (0.6 * (1 - distance * 0.25))
  return {
    transform: `scale(${scale}) translateY(${-15 * (1 - distance * 0.25)}%)`,
    zIndex: 10 - distance,
    transition: `transform ${0.2 + distance * 0.05}s cubic-bezier(0.25, 0.1, 0.25, 1.5)`
  }
}

function handleClick(index) {
  emit('icon-click', index)
}

function handleClose(index) {
  emit('icon-close', index)
}
</script>

<style scoped>
.wrapper {
  position: fixed;
  bottom: 2vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.liquidGlass-wrapper {
  position: relative;
  display: flex;
  color: black;
  cursor: pointer;
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
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
  flex-wrap: wrap;

  padding: 1vh 1vw;
  gap: clamp(1vw, 2vw, 30px);
  max-width: 96vw;
  touch-action: pan-x;
}

.icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 10px;
}

.dock img {
  width: clamp(20px, 5vw, 50px);
  height: auto;
  border-radius: 1rem;
  transition: transform 0.3s ease, filter 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  z-index: 1;
}

.dock img.hovered {
  transform: scale(1.6) translateY(-15%);
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
  z-index: 10;
}

.dot-indicator {
  position: absolute;
  bottom: 0;
  width: 6px;
  height: 6px;
  background-color: black;
  border-radius: 50%;
}

</style>
