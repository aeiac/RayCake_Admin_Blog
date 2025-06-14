<template>
  <div
    class="window"
    :class="{ maximized: isMaximized }"
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

    <!-- 缩放控制点 -->
    <div v-for="dir in directions" :key="dir" class="resize-handle" :class="dir" @mousedown.prevent="startResize($event, dir)" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  component: Object,
  title: String
})

const pos = ref({ x: 100, y: 100 })
const width = ref(460)
const height = ref(320)

const isMinimized = ref(false)
const isMaximized = ref(false)

let savedPos = null
let savedWidth = null
let savedHeight = null

const directions = [
  'top', 'bottom', 'left', 'right',
  'topleft', 'topright', 'bottomleft', 'bottomright'
]

function toggleMinimize() {
  isMinimized.value = !isMinimized.value
}

function toggleMaximize() {
  const vw = window.innerWidth
  const vh = window.innerHeight

  if (!isMaximized.value) {
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
    pos.value = savedPos
    width.value = savedWidth
    height.value = savedHeight
    isMaximized.value = false
  }
}

// 拖动
let startX = 0, startY = 0, dragging = false
function startDrag(e) {
  if (isMaximized.value || isMinimized.value) return
  startX = e.clientX - pos.value.x
  startY = e.clientY - pos.value.y
  dragging = true
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

function onDrag(e) {
  if (!dragging) return
  const vw = window.innerWidth, vh = window.innerHeight
  let newX = e.clientX - startX
  let newY = e.clientY - startY

  newX = Math.max(0, Math.min(newX, vw - width.value))
  newY = Math.max(0, Math.min(newY, vh - height.value))

  pos.value.x = newX
  pos.value.y = newY
}

function stopDrag() {
  dragging = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

// 缩放
let resizing = false
let resizeStartX = 0
let resizeStartY = 0
let resizeDir = ''
function startResize(e, dir) {
  if (isMaximized.value) return
  resizing = true
  resizeStartX = e.clientX
  resizeStartY = e.clientY
  savedWidth = width.value
  savedHeight = height.value
  savedPos = { ...pos.value }
  resizeDir = dir
  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
}

function onResize(e) {
  if (!resizing) return
  const dx = e.clientX - resizeStartX
  const dy = e.clientY - resizeStartY

  if (resizeDir.includes('right')) {
    width.value = Math.max(300, savedWidth + dx)
  }
  if (resizeDir.includes('left')) {
    const newWidth = Math.max(300, savedWidth - dx)
    width.value = newWidth
    pos.value.x = savedPos.x + (savedWidth - newWidth)
  }
  if (resizeDir.includes('bottom')) {
    height.value = Math.max(200, savedHeight + dy)
  }
  if (resizeDir.includes('top')) {
    const newHeight = Math.max(200, savedHeight - dy)
    height.value = newHeight
    pos.value.y = savedPos.y + (savedHeight - newHeight)
  }
}

function stopResize() {
  resizing = false
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
}

onMounted(() => {
  const vw = window.innerWidth
  const vh = window.innerHeight
  width.value = vw * 0.5
  height.value = vh * 0.5
  pos.value.x = (vw - width.value) / 2
  pos.value.y = (vh - height.value) / 2
})
</script>

<style scoped>
.window {
  position: absolute;
  background: rgba(255 255 255 / 0.9);
  backdrop-filter: saturate(180%) blur(20px);
  border-radius: 14px;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  user-select: none;
  transition: width 0.2s, height 0.2s;
}

.window.maximized {
  border-radius: 0 !important;
}

.header {
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  background: rgba(242 242 247 / 0.9);
  border-bottom: 1px solid rgba(0,0,0,0.1);
  cursor: grab;
}

.window-controls {
  display: flex;
  gap: 8px;
  width: 60px;
}

.window-controls span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.window-controls .close {
  background: #ff5f56;
}
.window-controls .minimize {
  background: #ffbd2e;
}
.window-controls .maximize {
  background: #27c93f;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #3c3c4399;
  pointer-events: none;
}

.content {
  flex: 1;
  overflow: auto;
  background: white;
}

/* 缩放控制点样式 */
.resize-handle {
  position: absolute;
  z-index: 10;
}

.top, .bottom {
  height: 6px;
  left: 0;
  right: 0;
  cursor: ns-resize;
}
.top { top: -3px; }
.bottom { bottom: -3px; }

.left, .right {
  width: 6px;
  top: 0;
  bottom: 0;
  cursor: ew-resize;
}
.left { left: -3px; }
.right { right: -3px; }

.topleft, .topright, .bottomleft, .bottomright {
  width: 10px;
  height: 10px;
}
.topleft {
  top: -5px;
  left: -5px;
  cursor: nwse-resize;
}
.topright {
  top: -5px;
  right: -5px;
  cursor: nesw-resize;
}
.bottomleft {
  bottom: -5px;
  left: -5px;
  cursor: nesw-resize;
}
.bottomright {
  bottom: -5px;
  right: -5px;
  cursor: nwse-resize;
}
</style>
