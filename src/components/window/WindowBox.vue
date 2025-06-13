<template>
  <div
    class="window"
    :style="{ top: pos.y + 'px', left: pos.x + 'px', width: width + 'px', height: height + 'px' }"
  >
    <div class="header" @mousedown.stop.prevent="startDrag">
      <div class="window-controls">
        <span class="close" @click="$emit('close')"></span>
        <span class="minimize" @click="toggleMinimize"></span>
        <span class="maximize" @click="toggleMaximize"></span>
      </div>
      <div class="title">{{ title }}</div>
      <div style="width: 60px;"></div>
    </div>
    <div class="content" v-show="!isMinimized">
      <Suspense>
        <component :is="component" />
      </Suspense>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  component: Object,
  title: String,
})

const pos = ref({ x: 100, y: 100 })
const width = ref(460)
const height = ref(320)

const isMinimized = ref(false)
const isMaximized = ref(false)

// 用于保存最大化前的位置和尺寸，方便还原
let savedPos = null
let savedWidth = null
let savedHeight = null

let startX = 0
let startY = 0
let dragging = false

function updateWindowSize() {
  const vw = window.innerWidth
  const vh = window.innerHeight

  if (isMaximized.value) {
    width.value = vw
    height.value = vh
    pos.value.x = 0
    pos.value.y = 0
  } else {
    width.value = Math.min(460, vw * 0.9)
    height.value = Math.min(320, vh * 0.8)

    if (pos.value.x + width.value > vw) {
      pos.value.x = vw - width.value - 20
    }
    if (pos.value.y + height.value > vh) {
      pos.value.y = vh - height.value - 20
    }
    if (pos.value.x < 0) pos.value.x = 20
    if (pos.value.y < 0) pos.value.y = 20
  }
}

function startDrag(e) {
  if (isMaximized.value || isMinimized.value) return // 最大化或最小化时禁用拖拽
  startX = e.clientX - pos.value.x
  startY = e.clientY - pos.value.y
  dragging = true
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

function onDrag(e) {
  if (!dragging) return
  const vw = window.innerWidth
  const vh = window.innerHeight

  let newX = e.clientX - startX
  let newY = e.clientY - startY

  if (newX < 0) newX = 0
  if (newY < 0) newY = 0
  if (newX + width.value > vw) newX = vw - width.value
  if (newY + height.value > vh) newY = vh - height.value

  pos.value.x = newX
  pos.value.y = newY
}

function stopDrag() {
  dragging = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

function toggleMinimize() {
  isMinimized.value = !isMinimized.value
}

function toggleMaximize() {
  const vw = window.innerWidth
  const vh = window.innerHeight

  if (!isMaximized.value) {
    // 记录当前状态，方便还原
    savedPos = { ...pos.value }
    savedWidth = width.value
    savedHeight = height.value

    pos.value.x = 0
    pos.value.y = 0
    width.value = vw
    height.value = vh
    isMaximized.value = true
    isMinimized.value = false
  } else {
    // 还原之前状态
    if (savedPos) {
      pos.value = savedPos
      width.value = savedWidth
      height.value = savedHeight
    }
    isMaximized.value = false
  }
}

onMounted(() => {
  updateWindowSize()
  window.addEventListener('resize', () => {
    if (isMaximized.value) {
      // 最大化时窗口大小随视口调整
      width.value = window.innerWidth
      height.value = window.innerHeight
    } else {
      updateWindowSize()
    }
  })
})
</script>

<style scoped>
.window {
  position: absolute;
  background: rgba(255 255 255 / 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  border-radius: 14px;
  box-shadow:
    0 8px 32px 0 rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255 255 255 / 0.18);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  user-select: none;
  -webkit-user-select: none;
  transition: width 0.3s ease, height 0.3s ease, top 0.1s, left 0.1s;
}

.header {
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  background: rgba(242 242 247 / 0.85);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  cursor: grab;
  position: relative;
}

.window-controls {
  display: flex;
  gap: 8px;
  width: 60px;
  align-items: center;
}

.window-controls span {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.25);
}

.window-controls .close {
  background: #ff5f56;
}

.window-controls .close:hover {
  background: #bf4943;
}

.window-controls .minimize {
  background: #ffbd2e;
}

.window-controls .minimize:hover {
  background: #bfa72a;
}

.window-controls .maximize {
  background: #27c93f;
}

.window-controls .maximize:hover {
  background: #1f9934;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #3c3c4399;
  user-select: none;
  pointer-events: none;
}

.content {
  flex: 1;
  overflow: auto;
  padding: 12px;
  background: rgba(255 255 255 / 0.95);
  border-radius: 0 0 14px 14px;
  user-select: text;
}
</style>
